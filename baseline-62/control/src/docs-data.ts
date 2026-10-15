import { createServerFn } from "@tanstack/react-start";
import { marked } from "marked";
import docs from "../../docs/index.json";
export const getDoc = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const record = docs.find((d) => d.slug === slug.replace(/\/$/, ""));
    if (!record) return null;
    const { corpus } = await import("./doc-content");
    const text = corpus["../../" + record.file];
    if (text === undefined)
      throw new Error("Missing bundled document: " + record.file);
    return { ...record, html: await marked(text) };
  });
