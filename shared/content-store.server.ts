import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import type { DocPayload, Catalog } from "./content-types";
function root() {
  const dir = process.env.PULSE_DATA_ROOT;
  if (!dir)
    throw Error("PULSE_DATA_ROOT must point to the built content directory");
  return resolve(dir);
}
export async function readDoc(slug: string): Promise<DocPayload | null> {
  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(slug)) return null;
  const base = root();
  const file = resolve(base, slug + ".json");
  if (!file.startsWith(base + sep)) return null;
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}
export async function readCatalog(): Promise<Catalog> {
  return JSON.parse(await readFile(resolve(root(), "catalog.json"), "utf8"));
}
