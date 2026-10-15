import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import docs from "../docs/index.json";
const bases = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ["http://127.0.0.1:4202", "http://127.0.0.1:4203"];
let checked = 0;
for (const base of bases) {
  for (const path of [
    "/",
    ...docs.map((d) => "/docs/" + d.slug + "/"),
    "/app",
    "/app/deployments",
    "/app/deployments/dpl-075",
    "/app/incidents",
    "/app/settings",
    "/app/services",
  ]) {
    const res = await fetch(base + path);
    const html = await res.text();
    if (res.status !== 200 || !html.includes("PulseOps"))
      throw new Error(base + path + " " + res.status);
    if (path.startsWith("/docs/")) {
      const record = docs.find((d) => path === "/docs/" + d.slug + "/")!;
      if (!html.includes(record.title))
        throw new Error("Wrong documentation " + path);
    }
    checked++;
  }
  for (const path of [
    "/missing-page",
    "/app/deployments/no-such-deployment",
    "/docs/no/such/",
  ]) {
    const res = await fetch(base + path);
    if (res.status !== 404)
      throw new Error("Expected404 " + base + path + " got" + res.status);
    checked++;
  }
}
console.log(
  JSON.stringify({ checked, documentationPages: docs.length, bases }),
);
