import { compile } from "@mdx-js/mdx";
import gfm from "remark-gfm";
import highlight from "rehype-highlight";
import slug from "rehype-slug";
import { mkdir, readFile, writeFile } from "node:fs/promises";
const job = JSON.parse(await readFile(process.argv[2], "utf8"));
for (const record of job.records) {
  const source = await readFile(record.file, "utf8");
  const result = await compile({value:source,path:record.file}, {
    format: record.format,
    outputFormat: "function-body",
    development: false,
    remarkPlugins: [gfm],
    rehypePlugins: [slug, [highlight, { detect: false }]],
  });
  const payload = {
    ...record,
    code: String(result),
    text: source
      .replace(/<[^>]+>/g, " ")
      .replace(/[#*`|\[\]{}]/g, " ")
      .slice(0, 18000),
  };
  const file = job.output + "/" + record.slug + ".json";
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, JSON.stringify(payload) + "\n");
}
