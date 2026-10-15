import { readFile } from "node:fs/promises";
import MiniSearch from "minisearch";
import { changed } from "./io";
const job = JSON.parse(await readFile(process.argv[2], "utf8"));
const index = new MiniSearch({
  fields: ["title", "text"],
  storeFields: ["slug", "title", "section"],
});
for (const d of job.docs) {
  const record = JSON.parse(
    await readFile(job.payload + "/" + d.slug + ".json", "utf8"),
  );
  index.add({
    id: d.slug,
    slug: d.slug,
    title: d.title,
    section: d.section,
    text: record.text,
  });
}
await changed(job.output, JSON.stringify(index));
