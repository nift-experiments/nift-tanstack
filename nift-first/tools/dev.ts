import { watch } from "node:fs";
import { run } from "../../tools/io";
await run(["bun", "tools/build.ts"]);
const server = Bun.spawn(["bun", "tools/serve.ts"], {
  stdout: "inherit",
  stderr: "inherit",
  env: process.env,
});
let running = false,
  dirty = false,
  timer: ReturnType<typeof setTimeout> | undefined;
async function build() {
  if (running) {
    dirty = true;
    return;
  }
  running = true;
  try {
    await run(["bun", "tools/build.ts"]);
    console.log("Publication updated; reload the browser.");
  } catch (e) {
    console.error(e);
  } finally {
    running = false;
    if (dirty) {
      dirty = false;
      void build();
    }
  }
}
const watchers = [
  "../corpus",
  "../shared",
  "frontend",
  "templates",
  "tools",
].map((path) =>
  watch(path, { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => void build(), 150);
  }),
);
console.log(
  "Watching maintained sources. Reload after updates; this simple dev mode is not React HMR.",
);
process.on("SIGINT", () => {
  for (const w of watchers) w.close();
  server.kill();
  process.exit(0);
});
await server.exited;
