import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
const root = import.meta.dirname;
export default defineConfig({
  root,
  plugins: [react()],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
      "@tanstack/react-query",
    ],
    alias: [
      {
        find: resolve(root, "../shared/data.ts"),
        replacement: resolve(root, "frontend/data-client.ts"),
      },
      {
        find: /^\.\/data$/,
        replacement: resolve(root, "frontend/data-client.ts"),
      },
    ],
  },
  build: {
    outDir: ".cache/frontend",
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: {
        shell: resolve(root, "frontend/shell.ts"),
        docs: resolve(root, "frontend/doc-islands.tsx"),
        search: resolve(root, "frontend/search.ts"),
        workspace: resolve(root, "frontend/workspace.tsx"),
        explorer: resolve(root, "frontend/explorer.tsx"),
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});
