import { resolve, sep } from "node:path";
const model = process.argv[2] || "hybrid";
if (!["hybrid", "control"].includes(model)) throw Error("Invalid model");
const root = resolve(model, "dist");
process.env.NODE_ENV = "production";
process.env.PULSE_DATA_ROOT = resolve(root, "content");
const app = (await import(resolve(root, "server/server.js"))).default;
const port = Number(process.env.PORT || (model === "hybrid" ? 4212 : 4213));
Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    let path;
    try {
      path = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
    for (const candidate of [path, path.replace(/\/$/, "") + "/index.html"]) {
      const file = resolve(root, "client", "." + candidate);
      if (!file.startsWith(resolve(root, "client") + sep)) continue;
      const resource = Bun.file(file);
      if ((await resource.exists()) && (await resource.stat()).isFile())
        return new Response(resource);
    }
    return app.fetch(request);
  },
});
console.log(`PulseOps ${model}: http://127.0.0.1:${port}`);
