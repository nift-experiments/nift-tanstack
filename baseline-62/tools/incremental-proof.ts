import { readFile, writeFile, readdir, rm, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
async function tree(dir: string): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = dir + "/" + e.name;
    if (e.isDirectory()) Object.assign(result, await tree(path));
    else
      result[path] = createHash("sha256")
        .update(await readFile(path))
        .digest("hex");
  }
  return result;
}
async function run() {
  const p = Bun.spawn(["bun", "run", "build"], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [out, err, code] = await Promise.all([
    new Response(p.stdout).text(),
    new Response(p.stderr).text(),
    p.exited,
  ]);
  if (code) throw new Error(out + err);
  return { out, phase: JSON.parse(out.trim().split("\n").at(-1)!) };
}
await mkdir("evaluation",{recursive:true});
const results = [];
await run();
const before = await tree("public/docs");
const appBefore = await tree("dist");
const path = "docs/start/workspace-setup.md",
  original = await readFile(path, "utf8");
try {
  await writeFile(path, original + "\nIncremental proof marker.\n");
  const { phase } = await run();
  const after = await tree("public/docs");
  const changed = Object.keys(after).filter((p) => after[p] !== before[p]);
  if (
    phase.appBuildRan ||
    changed.length !== 1 ||
    !changed[0].includes("workspace-setup")
  )
    throw new Error(
      "Doc isolation failed " + JSON.stringify({ phase, changed }),
    );
  if (JSON.stringify(await tree("dist")) !== JSON.stringify(appBefore))
    throw new Error("App artifact changed on docs edit");
  results.push({ scenario: "docs", changed, phase });
} finally {
  await writeFile(path, original);
  await run();
}
const layout = "templates/docs.html",
  saved = await readFile(layout, "utf8");
try {
  await writeFile(layout, saved + "\n<!-- shared-layout proof -->\n");
  const { phase } = await run();
  const after = await tree("public/docs");
  const changed = Object.keys(after).filter((p) => after[p] !== before[p]);
  if (phase.appBuildRan || changed.length !== Object.keys(before).length)
    throw new Error("Layout fanout failed");
  results.push({ scenario: "docs-shell", count: changed.length, phase });
} finally {
  await writeFile(layout, saved);
  await run();
}
const artifacts = Object.keys(await tree("dist/client")).filter((p) =>
  p.endsWith(".js"),
);
await rm(artifacts[0]);
const { phase } = await run();
if (!phase.appBuildRan || !(await Bun.file(artifacts[0]).exists()))
  throw new Error("Partial app artifact repair failed");
results.push({ scenario: "partial-artifact-repair", phase });
await writeFile(
  "evaluation/incremental-proof.json",
  JSON.stringify(results, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
