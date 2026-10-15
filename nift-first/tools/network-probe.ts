// Diagnostic reverse proxy: records actual uncompressed response-body bytes.
// Separate ports and no-store ensure a cold JS load for each documented navigation.
import { appendFile } from "node:fs/promises";
import { resolve } from "node:path";
const log = resolve("../evaluation/nift-first/browser-requests.jsonl");
for (const [model, port, target] of [
  ["hybrid", 4215, 4212],
  ["control", 4216, 4213],
  ["nift-first", 4217, 4214],
] as const) {
  Bun.serve({
    hostname: "127.0.0.1",
    port,
    async fetch(request) {
      const u = new URL(request.url);
      const dest = new URL(u.pathname + u.search, "http://127.0.0.1:" + target);
      const r = await fetch(dest, { redirect: "manual" }),
        bytes = new Uint8Array(await r.arrayBuffer()),
        headers = new Headers(r.headers);
      headers.set("Cache-Control", "no-store");
      const location = headers.get("location");
      if (location)
        headers.set(
          "location",
          location.replace("127.0.0.1:" + target, "127.0.0.1:" + port),
        );
      await appendFile(
        log,
        JSON.stringify({
          model,
          path: u.pathname,
          status: r.status,
          bytes: bytes.length,
          contentType: headers.get("content-type"),
          at: new Date().toISOString(),
        }) + "\n",
      );
      return new Response(bytes, { status: r.status, headers });
    },
  });
}
console.log(
  "Cold-load diagnostic ports: hybrid4215 control4216 nift-first4217",
);
