import { run } from "./io";
const model = process.env.PULSE_MODEL || "hybrid";
if (!["hybrid", "control"].includes(model)) throw Error("Invalid model");
await run(["bun", "tools/build.ts", model]);
await run(
  [
    "bun",
    "x",
    "vite",
    "--config",
    "app/vite.config.ts",
    "--host",
    "127.0.0.1",
    "--port",
    model === "hybrid" ? "4210" : "4211",
  ],
  {
    env: {
      ...process.env,
      PULSE_MODEL: model,
      PULSE_DATA_ROOT: require("node:path").resolve(model, "dist/content"),
    },
  },
);
