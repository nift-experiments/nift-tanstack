import { readFile, mkdir, rm, copyFile, readdir } from "node:fs/promises";
import { hash, changed, files, run } from "../../tools/io";
const flags = new Set(process.argv.slice(2)),
  fresh = flags.has("--fresh"),
  all = flags.has("--all");
const start = performance.now(),
  times: Record<string, number> = {};
if (fresh) {
  for (const p of [".generated", ".cache", "public"])
    await rm(p, { recursive: true, force: true });
  for (const e of await readdir(".nift"))
    if (e !== "config.json")
      await rm(".nift/" + e, { recursive: true, force: true });
}
if (!(await Bun.file("../corpus/active.json").exists()))
  await run(["bun", "tools/generate.ts"], { cwd: "..", quiet: true });
await mkdir(".cache", { recursive: true });
const docs: any[] = JSON.parse(await readFile("../corpus/active.json", "utf8"));
const old = JSON.parse(
  await readFile(".cache/success.json", "utf8").catch(() => "{}"),
);
const compilerKey = hash(
  (await readFile("tools/compiler-worker.tsx", "utf8")) +
    (await readFile("bun.lock", "utf8")) +
    Bun.version,
);
const contentKeys: Record<string, string> = {},
  selected: any[] = [];
for (const d of docs) {
  contentKeys[d.slug] = hash(
    (await readFile("../" + d.file, "utf8")) + compilerKey,
  );
  const cached = JSON.parse(
    await readFile(".generated/rendered/" + d.slug + ".json", "utf8").catch(
      () => "null",
    ),
  );
  if (cached?.inputKey !== contentKeys[d.slug])
    selected.push({ ...d, inputKey: contentKeys[d.slug] });
}
times.plan = (performance.now() - start) / 1000;
let t = performance.now();
const jobs: string[] = [];
for (let i = 0; i < selected.length; i += 96) {
  const p = ".cache/compile-" + i + ".json";
  await changed(p, JSON.stringify({ records: selected.slice(i, i + 96) }));
  jobs.push(p);
}
let cursor = 0;
await Promise.all(
  Array.from({ length: Math.min(2, jobs.length) }, async () => {
    while (cursor < jobs.length)
      await run(["bun", "tools/compiler-worker.tsx", jobs[cursor++]], {
        quiet: true,
        env: { ...process.env, NODE_ENV: "production" },
      });
  }),
);
times.compile = (performance.now() - t) / 1000;
t = performance.now();
const appInputs = [
  ...(await files("frontend")),
  "vite.config.ts",
  "package.json",
  "bun.lock",
  "../shared/Portal.tsx",
  "../shared/Capacity.tsx",
  "../shared/fixtures.json",
  "../shared/site.json",
];
const appKey = hash(
  (await Promise.all(appInputs.sort().map((p) => readFile(p))))
    .map(String)
    .join("\0") +
    Bun.version +
    process.version,
);
let appRan = false;
const appComplete =
  old.bundleFiles?.length &&
  (
    await Promise.all(old.bundleFiles.map((p: string) => Bun.file(p).exists()))
  ).every(Boolean);
if (
  old.appKey !== appKey ||
  !appComplete ||
  !(await Bun.file(".cache/frontend/.vite/manifest.json").exists())
) {
  await run(
    ["bun", "x", "--no-install", "vite", "build", "--config", "vite.config.ts"],
    { quiet: true, env: { ...process.env, NODE_ENV: "production" } },
  );
  appRan = true;
}
const bundle = await files(".cache/frontend");
for (const file of bundle) {
  const target = "public/" + file.slice(".cache/frontend/".length);
  await mkdir(target.slice(0, target.lastIndexOf("/")), { recursive: true });
  const bytes = await readFile(file);
  if (
    !(await Bun.file(target).exists()) ||
    hash(await readFile(target)) !== hash(bytes)
  )
    await Bun.write(target, bytes);
}
for (const file of old.bundleFiles || [])
  if (!bundle.includes(file))
    await rm("public/" + file.slice(".cache/frontend/".length), {
      force: true,
    });
await changed(
  "public/assets/site.css",
  await readFile("../shared/site.css", "utf8"),
);
await mkdir("public/api", { recursive: true });
await copyFile(
  "../shared/assets/service-topology.svg",
  "public/assets/service-topology.svg",
);
await changed(
  "public/api/fixtures.json",
  await readFile("../shared/fixtures.json", "utf8"),
);
await changed(
  "public/api/catalog.json",
  JSON.stringify(
    docs.map(({ slug, title, section }) => ({ slug, title, section })),
  ),
);
times.app = (performance.now() - t) / 1000;
t = performance.now();
const searchKey = hash(
  JSON.stringify(contentKeys) +
    JSON.stringify(docs) +
    (await readFile("tools/search-worker.ts", "utf8")),
);
let searchRan = false;
if (
  all ||
  old.searchKey !== searchKey ||
  !(await Bun.file("public/search-index.json").exists())
) {
  await run(["bun", "tools/search-worker.ts"], { quiet: true });
  searchRan = true;
}
times.search = (performance.now() - t) / 1000;
t = performance.now();
const escape = (s: string) =>
  s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
// Literal expression output protects code examples from template parsing.
// Only internal URL attributes become checked @path calls.
async function source(html: string, name: string) {
  const chunks: string[] = [],
    refs: string[] = [];
  let offset = 0;
  for (const match of html.matchAll(/(?:href|src)="(\/[^"<>]*)"/g)) {
    const url = match[1];
    if (url.startsWith("//")) continue;
    const at = match.index! + match[0].indexOf('"') + 1;
    chunks.push(html.slice(offset, at));
    const u = new URL(url, "http://local");
    let target = "public" + u.pathname;
    if (!/\.[a-z0-9]+$/i.test(u.pathname))
      target = target.replace(/\/$/, "") + "/index.html";
    const reference = target.endsWith(".html")
      ? target.slice("public/".length, -5)
      : target;
    refs.push("@path(" + JSON.stringify(reference) + ")");
    offset = at + url.length;
    // URL suffix is data too, never a template parameter.
    if (u.search || u.hash) {
      chunks.push(u.search + u.hash);
      refs.push("");
    }
  }
  chunks.push(html.slice(offset));
  const data = ".generated/body/" + name + ".json";
  await changed(data, JSON.stringify({ chunks }));
  return (
    "@json(body," +
    JSON.stringify(data) +
    ")" +
    chunks.map((_, i) => "$[body.chunks[" + i + "]]" + (refs[i] || "")).join("")
  );
}
const tracked: any[] = [];
async function page(name: string, title: string, html: string) {
  await changed(
    ".generated/content/" + name + ".html",
    await source(html, name),
  );
  tracked.push({ name, title, template: "templates/page.html" });
}
const sections = new Map<string, any[]>();
for (const d of docs) {
  const group = sections.get(d.section) || [];
  group.push(d);
  sections.set(d.section, group);
}
for (const d of docs) {
  const { html, islands } = JSON.parse(
    await readFile(".generated/rendered/" + d.slug + ".json", "utf8"),
  );
  const group = sections.get(d.section)!,
    i = group.indexOf(d);
  let nav = "";
  if (group[i - 1])
    nav +=
      '<a href="/docs/' +
      group[i - 1].slug +
      '/">← ' +
      escape(group[i - 1].title) +
      "</a>";
  if (group[i + 1])
    nav +=
      '<a href="/docs/' +
      group[i + 1].slug +
      '/">' +
      escape(group[i + 1].title) +
      " →</a>";
  await page(
    "docs/" + d.slug + "/index",
    d.title,
    '<article class="prose"><div class="eyebrow"><a href="/docs/">DOCUMENTATION</a> / ' +
      escape(d.section) +
      "</div>" +
      html +
      '<div class="row">' +
      nav +
      "</div></article>" +
      (islands ? '<script type="module" src="/assets/docs.js"></script>' : ""),
  );
}
const site = JSON.parse(await readFile("../shared/site.json", "utf8"));
await page(
  "docs/index",
  "Documentation",
  '<div class="eyebrow">FIELD GUIDE / ' +
    docs.length +
    ' DOCUMENTS</div><h1>Knowledge for operators.</h1><p>Authored guides, versioned contracts and selective interactive examples.</p><label>Search documentation<input type="search" data-search placeholder="Search contracts and runbooks…"></label><section aria-label="Search results" data-results></section><div class="cards">' +
    [...sections]
      .map(
        ([key, group]) =>
          "<section><h2>" +
          escape(site.sections.find((s: any) => s.slug === key)?.title ?? key.replace(/^reference\//, "API · ")) +
          "</h2><p>" +
          group.length +
          ' guides</p><a href="/docs/' +
          group[0].slug +
          '/">Explore →</a></section>',
      )
      .join("") +
    '</div><script type="module" src="/assets/search.js"></script>',
);
await page(
  "index",
  "PulseOps",
  '<div class="hero"><div class="eyebrow">STATIC SITE / SELECTIVE ISLANDS</div><h1>Ship confidently.<br>Respond clearly.</h1><p class="muted">An operations knowledge base with an embedded interactive workspace.</p><a class="button" href="/app/">Open workspace →</a><a href="/docs/">Explore documentation →</a></div>',
);
const fixtures = JSON.parse(await readFile("../shared/fixtures.json", "utf8"));
for (const route of [
  "app",
  "app/deployments",
  "app/incidents",
  "app/services",
  "app/capacity",
  "app/settings",
  ...fixtures.deployments.map((d: any) => "app/deployments/" + d.id),
])
  await page(
    route + "/index",
    "Operations workspace",
    '<div id="workspace"><p>Loading interactive workspace…</p><noscript>This workspace requires JavaScript. Documentation remains available without it.</noscript></div><script type="module" src="/assets/workspace.js"></script>',
  );
await page(
  "explorer/index",
  "API explorer",
  '<div id="api-explorer"><p>Loading interactive reference explorer…</p><noscript>Enable JavaScript to filter the reference catalog. <a href="/docs/">Browse documentation instead.</a></noscript></div><script type="module" src="/assets/explorer.js"></script>',
);
for (const name of old.pages || [])
  if (!tracked.some((p) => p.name === name)) {
    await rm("public/" + name + ".html", { force: true });
    await rm(".generated/content/" + name + ".html", { force: true });
  }
await changed(".nift/tracked.json", JSON.stringify({ tracked }, null, 2));
times.prepare = (performance.now() - t) / 1000;
t = performance.now();
const niftOutput = await run(["nift", "build", ...(all ? ["--all"] : [])], {
  quiet: true,
});
const rebuilt = niftOutput.match(/(\d+) files? rebuilt successfully/);
const rendered = all
  ? tracked.length
  : rebuilt
    ? Number(rebuilt[1])
    : niftOutput.includes("up to date")
      ? 0
      : null;
times.nift = (performance.now() - t) / 1000;
await changed(
  ".cache/success.json",
  JSON.stringify({
    contentKeys,
    appKey,
    searchKey,
    bundleFiles: bundle,
    pages: tracked.map((p) => p.name),
  }),
);
console.log(
  JSON.stringify({
    model: "nift-first",
    scale: docs.length,
    mdx: docs.filter((d) => d.format === "mdx").length,
    fresh,
    all,
    compiled: selected.length,
    appRan,
    searchRan,
    rendered,
    pages: tracked.length,
    times,
    totalSeconds: (performance.now() - start) / 1000,
  }),
);
