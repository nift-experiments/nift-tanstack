import {
  readFile,
  mkdir,
  writeFile,
  rm,
  copyFile,
  stat,
  readdir,
} from "node:fs/promises";
import { resolve } from "node:path";

import { changed, files, hash, run } from "./io";
import type { DocRecord, DocPayload, Catalog } from "../shared/content-types";
if (!(await Bun.file("corpus/active.json").exists()))
  await run(["bun", "tools/generate.ts"]);
const model = process.argv[2];
if (!["hybrid", "control"].includes(model))
  throw Error("Model must be hybrid or control");
const flags = new Set(process.argv.slice(3));
const fresh = flags.has("--fresh"),
  all = flags.has("--all"),
  native = flags.has("--native");
const start = performance.now();
const times: Record<string, number> = {};
const cache = `.cache/${model}`,
  dist = `${model}/dist`,
  payload = `${cache}/payload`;
if (fresh) {
  await rm(cache, { recursive: true, force: true });
  await rm(dist, { recursive: true, force: true });
  if (model === "hybrid")
    for (const entry of await readdir(".nift"))
      if (!["config.json", "tracked.json"].includes(entry))
        await rm(".nift/" + entry, { recursive: true, force: true });
}
await mkdir(cache, { recursive: true });
let docs: DocRecord[] = JSON.parse(
  await readFile("corpus/active.json", "utf8"),
);
const bySection = new Map<string, DocRecord[]>();
for (const d of docs) {
  const group = bySection.get(d.section) || [];
  group.push(d);
  bySection.set(d.section, group);
}
docs = docs.map((d) => {
  const group = bySection.get(d.section)!;
  const i = group.indexOf(d);
  const ref = (r: DocRecord | undefined) =>
    r ? { slug: r.slug, title: r.title } : undefined;
  return { ...d, previous: ref(group[i - 1]), next: ref(group[i + 1]) };
});
const compilerKey = hash(
  (await readFile("tools/compiler-worker.ts", "utf8")) +
    (await readFile("bun.lock", "utf8")),
);
await changed(".cache/compiler-key.txt", compilerKey);
const contentKeys: Record<string, string> = {};
for (const d of docs)
  contentKeys[d.slug] = hash(
    (await readFile(d.file, "utf8")) + JSON.stringify(d) + compilerKey,
  );
const oldKeys: Record<string, string> = JSON.parse(
  await readFile(`${cache}/content-keys.json`, "utf8").catch(() => "{}"),
);
let selected: DocRecord[] = [];
if (model === "hybrid") {
  const tracked = [];
  for (const d of docs) {
    const meta = `${cache}/metadata/${d.slug}.json`;
    await changed(meta, JSON.stringify(d));
    await changed(
      `hybrid/content/${d.slug}.html`,
      `@dep('${d.file}')@dep('.cache/compiler-key.txt')@dep('${meta}')$[inject('${cache}/compiled/${d.slug}.json').stringify()]`,
    );
    tracked.push({
      name: d.slug,
      title: d.title,
      template: "hybrid/templates/payload.html",
    });
  }
  await changed(
    ".nift/tracked.json",
    JSON.stringify({ tracked }, null, 2) + "\n",
  );
  const dirty: string[] = JSON.parse(
    await run(["nift", "tools/dirty.n"], { quiet: true }),
  );
  const set = new Set(dirty);
  selected = docs.filter(
    (d) =>
      flags.has("--recompile") ||
      fresh ||
      set.has(d.slug) ||
      !Bun.file(`${payload}/${d.slug}.json`).size,
  );
} else
  for (const d of docs)
    if (
      flags.has("--recompile") ||
      fresh ||
      oldKeys[d.slug] !== contentKeys[d.slug] ||
      !(await Bun.file(`${payload}/${d.slug}.json`).exists())
    )
      selected.push(d);
times.plan = (performance.now() - start) / 1000;
const compileStart = performance.now();
const compileOut = model === "hybrid" ? `${cache}/compiled` : payload;
const batchSize = 96,
  concurrency = 2;
const jobs: string[] = [];
for (let i = 0; i < selected.length; i += batchSize) {
  const file = `${cache}/compile-${i}.json`;
  await changed(
    file,
    JSON.stringify({
      records: selected.slice(i, i + batchSize),
      output: compileOut,
    }),
  );
  jobs.push(file);
}
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (cursor < jobs.length) {
      const file = jobs[cursor++];
      await run(["bun", "tools/compiler-worker.ts", file], { quiet: true });
    }
  }),
);
times.compile = (performance.now() - compileStart) / 1000;
const niftStart = performance.now();
if (model === "hybrid") {
  const output = await run(["nift", "build", ...(all ? ["--all"] : [])], {
    quiet: true,
  });
  console.log(output.trim().split("\n").slice(-3).join("\n"));
}
times.nift = (performance.now() - niftStart) / 1000;
for (const slug of Object.keys(oldKeys))
  if (!contentKeys[slug]) {
    await rm(`${payload}/${slug}.json`, { force: true });
    await rm(`${dist}/content/${slug}.json`, { force: true });
    await rm(`${dist}/client/docs/${slug}`, { recursive: true, force: true });
  }
const catalog: Catalog = {
  count: docs.length,
  sections: [...bySection].map(([slug, rows]) => ({
    slug,
    title: slug.replace("reference/", "API · "),
    count: rows.length,
    first: rows[0].slug,
  })),
};
const catalogText = JSON.stringify(catalog);
const catalogKey = hash(catalogText);
await changed(`${dist}/content/catalog.json`, catalogText);
for (const d of docs) {
  const target = `${dist}/content/${d.slug}.json`;
  if (
    selected.some((s) => s.slug === d.slug) ||
    oldKeys[d.slug] !== contentKeys[d.slug] ||
    !(await Bun.file(target).exists())
  ) {
    await mkdir(target.slice(0, target.lastIndexOf("/")), { recursive: true });
    await copyFile(`${payload}/${d.slug}.json`, target);
  }
}
const appInputs = [
  ...(await files("app/src")).filter((p) => !p.endsWith("routeTree.gen.ts")),
  ...(await files("shared")),
  "app/vite.config.ts",
  "tools/dev-plugin.ts",
  "tsconfig.json",
  "package.json",
  "bun.lock",
];
const environment = JSON.stringify({
  bun: Bun.version,
  buildMode: "production",
  node: await run(["node", "--version"], { quiet: true }),
  NODE_OPTIONS: process.env.NODE_OPTIONS || "",
  VITE: Object.fromEntries(
    Object.entries(process.env).filter(([k]) => k.startsWith("VITE_")),
  ),
});
let appSource = environment;
for (const file of appInputs.sort())
  appSource += file + hash(await readFile(file));
const appKey = hash(appSource);
const previousApp = JSON.parse(
  await readFile(`${cache}/app.json`, "utf8").catch(() => "{}"),
);
const complete =
  previousApp.outputs?.length &&
  (
    await Promise.all(
      previousApp.outputs.map((p: string) => Bun.file(p).exists()),
    )
  ).every(Boolean);
const appStart = performance.now();
const appRan =
  !flags.has("--content-only") &&
  (native || !complete || previousApp.key !== appKey);
if (appRan) {
  await run(["bun", "x", "vite", "build", "--config", "app/vite.config.ts"], {
    env: {
      ...process.env,
      NODE_ENV: "production",
      PULSE_MODEL: model,
      PULSE_NATIVE: native ? "1" : "0",
      PULSE_DATA_ROOT: resolve(dist, "content"),
    },
    quiet: true,
  });
  await changed(
    `${cache}/app.json`,
    JSON.stringify({
      key: appKey,
      outputs: [
        ...(await files(`${dist}/server`)),
        ...(await files(`${dist}/client`)),
      ].filter((p) => !p.endsWith(".html") && !p.endsWith("search-index.json")),
    }),
  );
}
times.app = (performance.now() - appStart) / 1000;
const searchStart = performance.now();
const searchKey = hash(
  JSON.stringify(contentKeys) +
    (await readFile("tools/search-indexer.ts", "utf8")),
);
const oldSearch = await readFile(`${cache}/search-key`, "utf8").catch(
  () => null,
);
let searchRan = false;
const cachedSearch = `${cache}/search-index.json`;
if (
  all ||
  fresh ||
  oldSearch !== searchKey ||
  !(await Bun.file(cachedSearch).exists())
) {
  const job = `${cache}/search-job.json`;
  await changed(job, JSON.stringify({ docs, payload, output: cachedSearch }));
  await run(["bun", "tools/search-indexer.ts", job], { quiet: true });
  await changed(`${cache}/search-key`, searchKey);
  searchRan = true;
}
if (
  searchRan ||
  !(await Bun.file(`${dist}/client/search-index.json`).exists())
) {
  await mkdir(`${dist}/client`, { recursive: true });
  await copyFile(cachedSearch, `${dist}/client/search-index.json`);
}
times.search = (performance.now() - searchStart) / 1000;
if (flags.has("--content-only")) {
  console.log(
    JSON.stringify({
      model,
      scale: docs.length,
      compiled: selected.length,
      contentOnly: true,
      totalSeconds: (performance.now() - start) / 1000,
    }),
  );
  await changed(`${cache}/content-keys.json`, JSON.stringify(contentKeys));
  process.exit(0);
}
const renderStart = performance.now();
const rendererKey = hash(
  (await readFile("tools/render-worker.ts", "utf8")) + Bun.version,
);
const oldRender: Record<string, string> = JSON.parse(
  await readFile(`${cache}/render-keys.json`, "utf8").catch(() => "{}"),
);
const nextRender: Record<string, string> = {};
const routes = ["/", "/docs/", ...docs.map((d) => "/docs/" + d.slug + "/")];
const rendered: string[] = [];
for (let i = 0; i < routes.length; i++) {
  const path = routes[i];
  const key = hash(
    rendererKey + appKey + (i < 2 ? catalogKey : contentKeys[docs[i - 2].slug]),
  );
  nextRender[path] = key;
  if (
    all ||
    fresh ||
    appRan ||
    oldRender[path] !== key ||
    !(await Bun.file(
      `${dist}/client${path.replace(/\/$/, "")}/index.html`,
    ).exists())
  )
    rendered.push(path);
}
if (!native) {
  let renderCursor = 0;
  const batches: string[] = [];
  for (let i = 0; i < rendered.length; i += 128) {
    const file = `${cache}/render-${i}.json`;
    await changed(
      file,
      JSON.stringify({
        paths: rendered.slice(i, i + 128),
        server: `${dist}/server/server.js`,
        data: `${dist}/content`,
        output: `${dist}/client`,
      }),
    );
    batches.push(file);
  }
  await Promise.all(
    Array.from({ length: Math.min(2, batches.length) }, async () => {
      while (renderCursor < batches.length)
        await run(["bun", "tools/render-worker.ts", batches[renderCursor++]], {
          env: { ...process.env, NODE_ENV: "production" },
          quiet: true,
        });
    }),
  );
}
await changed(`${cache}/render-keys.json`, JSON.stringify(nextRender));
await changed(`${cache}/content-keys.json`, JSON.stringify(contentKeys));
times.render = (performance.now() - renderStart) / 1000;
console.log(
  JSON.stringify({
    model,
    scale: docs.length,
    fresh,
    all,
    native,
    compiled: selected.length,
    appRan,
    searchRan,
    rendered: native ? routes.length : rendered.length,
    times,
    totalSeconds: (performance.now() - start) / 1000,
  }),
);
