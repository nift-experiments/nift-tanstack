import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { contentReload } from "../tools/dev-plugin.ts";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
const root = resolve(import.meta.dirname, "..");
const model = process.env.PULSE_MODEL || "control";
const native = process.env.PULSE_NATIVE === "1";
const records = JSON.parse(
  readFileSync(resolve(root, "corpus/active.json"), "utf8"),
);
export default defineConfig({
  root: resolve(root, "app"),
  build: { emptyOutDir: true, outDir: resolve(root, model, "dist") },
  plugins: [
    contentReload(model),
    tanstackStart({
      prerender: {
        enabled: native,
        autoStaticPathsDiscovery: false,
        autoSubfolderIndex: true,
        crawlLinks: false,
        concurrency: 4,
        failOnError: true,
      },
      pages: native
        ? [
            { path: "/", prerender: { enabled: true } },
            { path: "/docs/", prerender: { enabled: true } },
            ...records.map((d: any) => ({
              path: "/docs/" + d.slug + "/",
              prerender: { enabled: true },
            })),
          ]
        : [],
    }),
    react(),
  ],
});
