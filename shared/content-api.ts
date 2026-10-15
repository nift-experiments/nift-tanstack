import { createServerFn } from "@tanstack/react-start";
export const getDoc = createServerFn({ method: "GET" })
  .validator((slug: string) => slug.replace(/\/$/, ""))
  .handler(async ({ data }) => {
    const { readDoc } = await import("./content-store.server");
    return readDoc(data);
  });
export const getCatalog = createServerFn({ method: "GET" }).handler(
  async () => {
    const { readCatalog } = await import("./content-store.server");
    return readCatalog();
  },
);
