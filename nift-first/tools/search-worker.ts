import { readFile } from "node:fs/promises";
import MiniSearch from "minisearch";
import { changed } from "../../tools/io";
const docs = JSON.parse(await readFile("../corpus/active.json", "utf8"));
const index = new MiniSearch({
  fields: ["title", "text"],
  storeFields: ["slug", "title", "section"],
});
for (const d of docs) {
  const { text } = JSON.parse(
    await readFile(".generated/rendered/" + d.slug + ".json", "utf8"),
  );
  index.add({
    id: d.slug,
    slug: d.slug,
    title: d.title,
    section: d.section,
    text,
  });
}
await changed("public/search-index.json", JSON.stringify(index));
