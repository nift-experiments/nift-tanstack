import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { niftDocs } from "./tools/dev-plugin.ts";
export default defineConfig({
  publicDir: "static",
  plugins: [niftDocs(), tanstackStart(), react()],
});
