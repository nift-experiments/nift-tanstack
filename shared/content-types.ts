export type DocRecord = {
  slug: string;
  title: string;
  section: string;
  file: string;
  format: "md" | "mdx";
  summary: string;
  previous?: { slug: string; title: string };
  next?: { slug: string; title: string };
};
export type DocPayload = DocRecord & { code: string; text: string };
export type Catalog = {
  count: number;
  sections: { slug: string; title: string; count: number; first: string }[];
};
