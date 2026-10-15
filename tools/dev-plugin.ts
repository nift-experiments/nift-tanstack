import type { Plugin } from "vite";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
export function contentReload(model: string): Plugin {
  let dispose: () => Promise<void> = async () => {};
  return {
    name: "content-payload-reload",
    closeBundle: () => dispose(),
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split("?")[0] !== "/search-index.json") return next();
        try {
          res.setHeader("Content-Type", "application/json");
          res.end(
            await readFile(resolve(model, "dist/client/search-index.json")),
          );
        } catch {
          res.statusCode = 503;
          res.end("Search index not built");
        }
      });
      let pending: ReturnType<typeof setTimeout> | undefined;
      let dirty = false,
        closed = false;
      let task: Promise<void> | undefined;
      const rebuild = async () => {
        while (dirty && !closed) {
          dirty = false;
          await new Promise<void>((done) => {
            const child = spawn(
              "bun",
              ["tools/build.ts", model, "--content-only"],
              { cwd: process.cwd(), env: process.env },
            );
            let output = "";
            child.stdout.on("data", (d) => (output += d));
            child.stderr.on("data", (d) => (output += d));
            child.once("error", (e) => {
              server.ws.send({
                type: "error",
                err: { message: e.message, stack: e.stack || "" },
              });
              done();
            });
            child.once("close", (code) => {
              if (code)
                server.ws.send({
                  type: "error",
                  err: { message: output, stack: "" },
                });
              else server.ws.send({ type: "full-reload" });
              done();
            });
          });
        }
      };
      const listener = (event: string, path: string) => {
        if (
          !["change", "add", "unlink"].includes(event) ||
          (!path.includes("/corpus/") &&
            !/\/tools\/(compiler-worker|search-indexer)\.ts$/.test(path))
        )
          return;
        dirty = true;
        if (pending) clearTimeout(pending);
        pending = setTimeout(() => {
          if (!task)
            task = rebuild().finally(() => {
              task = undefined;
            });
        }, 120);
      };
      server.watcher.add([
        "../corpus",
        "../tools/compiler-worker.ts",
        "../tools/search-indexer.ts",
      ]);
      server.watcher.on("all", listener);
      dispose = async () => {
        closed = true;
        if (pending) clearTimeout(pending);
        server.watcher.off("all", listener);
        await task;
      };
    },
  };
}
