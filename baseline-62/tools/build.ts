import { createHash } from "node:crypto";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { syncDocs } from "./sync-docs";
async function files(dir: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(dir, { withFileTypes: true })).map((e) =>
        e.isDirectory() ? files(dir + "/" + e.name) : [dir + "/" + e.name],
      ),
    )
  ).flat();
}
const start = performance.now();
const hash = createHash("sha256");
const inputs = [
  ...(await files("src")).filter((p) => !p.endsWith("routeTree.gen.ts")),
  ...(await files("shared")),
  ...(await files("static")),
  "vite.config.ts",
  "tsconfig.json",
  "tools/dev-plugin.ts",
  "package.json",
  "bun.lock",
];
for (const p of inputs.sort()) hash.update(p).update(await readFile(p));
const fingerprint = hash.digest("hex");
const previous = await readFile(".generated/app-fingerprint", "utf8").catch(
  () => null,
);
async function run(cmd: string[]) {
  const t = performance.now();
  const p = Bun.spawn(cmd, { stdout: "inherit", stderr: "inherit" });
  const code = await p.exited;
  if (code) throw new Error(cmd.join(" ") + " exited " + code);
  return (performance.now() - t) / 1000;
}
const artifacts: string[] = JSON.parse(
  await readFile(".generated/app-artifacts.json", "utf8").catch(() => "[]"),
);
const complete =
  artifacts.length > 0 &&
  (await Promise.all(artifacts.map((p) => Bun.file(p).exists()))).every(
    Boolean,
  );
await syncDocs();
let app = 0;
if (process.argv.includes("--all") || previous !== fingerprint || !complete) {
  app = await run(["bun", "x", "vite", "build"]);
  await mkdir(".generated", { recursive: true });
  await writeFile(".generated/app-fingerprint", fingerprint);
  await writeFile(
    ".generated/app-artifacts.json",
    JSON.stringify(await files("dist")),
  );
}
const nift = await run([
  "nift",
  ...(process.argv.includes("--all") ? ["build", "--all"] : ["build"]),
]);
console.log(
  JSON.stringify({
    appBuildRan: app > 0,
    appSeconds: app,
    niftSeconds: nift,
    totalSeconds: (performance.now() - start) / 1000,
  }),
);
