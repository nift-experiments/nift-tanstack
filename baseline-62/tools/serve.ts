import { resolve, sep } from "node:path";
const control = process.argv[2] === "control";
const base = resolve(control ? "control/dist" : "dist");
const roots = control
  ? [base + "/client"]
  : [resolve("public"), base + "/client"];
const app = (await import(base + "/server/server.js")).default;
const port = Number(process.env.PORT || (control ? 4203 : 4202));
Bun.serve({
  hostname: "127.0.0.1",
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let pathname: string;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
    for (const root of roots) {
      for (const suffix of [
        pathname,
        pathname.replace(/\/$/, "") + "/index.html",
      ]) {
        const target = resolve(root, "." + suffix);
        if (target !== root && !target.startsWith(root + sep)) continue;
        const file = Bun.file(target);
        if ((await file.exists()) && !(await file.stat()).isDirectory())
          return new Response(file);
      }
    }
    return app.fetch(request);
  },
});
console.log(
  `PulseOps ${control ? "control" : "hybrid"} http://127.0.0.1:${port}`,
);
