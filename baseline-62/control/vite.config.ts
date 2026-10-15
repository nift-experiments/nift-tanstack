import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import docs from "../docs/index.json" with { type: "json" };
import { fileURLToPath } from "node:url";
const corpus = fileURLToPath(new URL("..", import.meta.url));
const root = fileURLToPath(new URL(".", import.meta.url));
export default defineConfig({
  root,
  build: { outDir: root + "dist" },
  publicDir: corpus + "/static",
  plugins: [
    {
      name: "docs-content-reload",
      handleHotUpdate(ctx) {
        if (ctx.file.endsWith(".md") || ctx.file.endsWith("/docs/index.json"))
          ctx.server.ws.send({ type: "full-reload" });
      },
    },
    tanstackStart({
      prerender: {
        enabled: !process.env.PULSE_SSR_ONLY,
        autoSubfolderIndex: true,
        autoStaticPathsDiscovery: false,
        crawlLinks: false,
        concurrency: 4,
        failOnError: true,
      },
      pages: process.env.PULSE_SSR_ONLY
        ? []
        : [
            { path: "/", prerender: { enabled: true } },
            ...docs.map((d) => ({
              path: "/docs/" + d.slug + "/",
              prerender: { enabled: true },
            })),
          ],
    }),
    react(),
  ],
});
