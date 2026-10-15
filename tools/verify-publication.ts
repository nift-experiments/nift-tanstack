import { readFile, readdir } from "node:fs/promises";
import { hash, files } from "./io";
import assert from "node:assert/strict";
const docs = JSON.parse(await readFile("corpus/active.json", "utf8"));
const results: {
  scale: number;
  documents: number;
  payloadsEqual: boolean;
  htmlMainEqual: boolean;
  assetsEqual: boolean;
  searchEqual: boolean;
  brokenLinks: string[];
} = {
  scale: docs.length,
  documents: docs.length,
  payloadsEqual: true,
  htmlMainEqual: true,
  assetsEqual: true,
  searchEqual: true,
  brokenLinks: [],
};
const slugs = new Set(docs.map((d: any) => d.slug));
for (const doc of docs) {
  const a = JSON.parse(
      await readFile(`hybrid/dist/content/${doc.slug}.json`, "utf8"),
    ),
    b = JSON.parse(
      await readFile(`control/dist/content/${doc.slug}.json`, "utf8"),
    );
  assert.deepEqual(a, b, "Payload differs: " + doc.slug);
  const htmlA = await readFile(
      `hybrid/dist/client/docs/${doc.slug}/index.html`,
      "utf8",
    ),
    htmlB = await readFile(
      `control/dist/client/docs/${doc.slug}/index.html`,
      "utf8",
    );
  assert.equal(
    htmlA.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[0],
    htmlB.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[0],
    "SSRmain differs: " + doc.slug,
  );
  for (const match of htmlA.matchAll(/href="(\/docs\/[^"?#]+)"/g)) {
    const slug = match[1].replace(/^\/docs\//, "").replace(/\/$/, "");
    if (!slugs.has(slug)) results.brokenLinks.push(doc.slug + " → " + match[1]);
  }
}
assert.equal(
  results.brokenLinks.length,
  0,
  JSON.stringify(results.brokenLinks.slice(0, 10)),
);
assert.equal(
  hash(await readFile("hybrid/dist/client/search-index.json")),
  hash(await readFile("control/dist/client/search-index.json")),
  "Search bytes differ",
);
const assetsA = await files("hybrid/dist/client/assets"),
  assetsB = await files("control/dist/client/assets");
assert.equal(assetsA.length, assetsB.length);
for (const path of assetsA) {
  const other = path.replace(/^hybrid\//, "control/");
  assert.equal(
    hash(await readFile(path)),
    hash(await readFile(other)),
    "Asset differs " + path,
  );
}
console.log(JSON.stringify(results));
