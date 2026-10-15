import type { Plugin } from "vite";
import { readFile } from "node:fs/promises";
import { syncDocs } from "./sync-docs.ts";
import { spawn } from "node:child_process";
export function niftDocs(): Plugin {
  let dispose: () => Promise<void> = async () => {};
  return {
    closeBundle: () => dispose(),
    name: "nift-docs",
    async configureServer(server) {
      let inFlight = Promise.resolve();
      function build() {
        inFlight = execute();
        return inFlight;
      }
      async function execute() {
        await syncDocs();
        await new Promise<void>((resolve, reject) => {
          const p = spawn("nift", ["build"]);
          let output = "";
          p.stdout.on("data", (c) => (output += c));
          p.stderr.on("data", (c) => (output += c));
          p.once("error", reject);
          p.once("close", (code) =>
            code ? reject(new Error(output)) : resolve(),
          );
        });
      }
      await build();
      let pending: ReturnType<typeof setTimeout> | undefined;
      let running = false,
        dirty = false,
        closed = false;
      async function drain() {
        if (running || closed) return;
        running = true;
        try {
          while (dirty && !closed) {
            dirty = false;
            try {
              await build();
              server.ws.send({ type: "full-reload" });
            } catch (e) {
              const error = e as Error;
              server.ws.send({
                type: "error",
                err: { message: error.message, stack: error.stack || "" },
              });
            }
          }
        } finally {
          running = false;
        }
      }
      const onChange = (event: string, path: string) => {
        if (
          !["change", "add", "unlink"].includes(event) ||
          path.includes("/content/docs/")
        )
          return;
        if (
          !/\/(docs|templates|content|static)\//.test(path) &&
          !/\/shared\/(site.json|site.css)$/.test(path)
        )
          return;
        dirty = true;
        if (pending) clearTimeout(pending);
        pending = setTimeout(() => void drain(), 100);
      };
      server.watcher.add([
        "docs",
        "templates",
        "content",
        "shared/site.json",
        "shared/site.css",
        "static",
      ]);
      server.watcher.on("all", onChange);
      dispose = async () => {
        closed = true;
        if (pending) clearTimeout(pending);
        server.watcher.off("all", onChange);
        await inFlight.catch(() => {});
      };
      server.httpServer?.once("close", () => void dispose());
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || "/").split("?")[0];
        if (path !== "/" && !path.startsWith("/docs/")) return next();
        if (path.includes("..")) return next();
        try {
          const html = await readFile(
            "public" +
              (path === "/"
                ? "/index.html"
                : path.endsWith(".html")
                  ? path
                  : path.endsWith("/")
                    ? path + "index.html"
                    : path + "/index.html"),
            "utf8",
          );
          res.setHeader("Content-Type", "text/html");
          res.end(
            html.replace(
              "</head>",
              '<script type="module" src="/@vite/client"></script></head>',
            ),
          );
        } catch {
          next();
        }
      });
    },
  };
}
