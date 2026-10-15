import { resolve, sep } from "node:path";
const root = resolve("public");
Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT || 4214),
  async fetch(request) {
    let path: string;
    try {
      path = decodeURIComponent(new URL(request.url).pathname);
    } catch {
      return new Response("Invalid path", { status: 400 });
    }
    if (path.endsWith("/index.html"))
      return Response.redirect(
        new URL(path.slice(0, -10), request.url).href,
        308,
      );
    for (const p of [path, path.replace(/\/$/, "") + "/index.html"]) {
      const file = resolve(root, "." + p);
      if (!file.startsWith(root + sep)) continue;
      const f = Bun.file(file);
      if ((await f.exists()) && (await f.stat()).isFile()) {
        if (p.endsWith("/index.html") && !path.endsWith("/"))
          return Response.redirect(
            new URL(path + "/" + new URL(request.url).search, request.url).href,
            308,
          );
        return new Response(f);
      }
    }
    return new Response('<h1>Page not found</h1><a href="/">Return home</a>', {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  },
});
console.log("PulseOps nift-first: http://127.0.0.1:4214");
