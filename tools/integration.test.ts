import { test, expect } from "bun:test";
import { readFile, writeFile, stat, utimes, chmod } from "node:fs/promises";
import { run } from "./io";
const build = async (model: string) => {
  const out = await run(["bun", "tools/build.ts", model], { quiet: true });
  return JSON.parse(out.trim().split("\n").at(-1)!);
};
test("content hash invalidation, literal source preservation, failure recovery and equal payloads", async () => {
  for (const model of ["hybrid", "control"]) await build(model);
  const file = "corpus/original/start/workspace-setup.md",
    source = await readFile(file, "utf8"),
    metadata = await stat(file);
  const marker = "Preserved timestamp content proof.";
  try {
    await writeFile(file, source + "\n" + marker + "\n");
    await utimes(file, metadata.atime, new Date("2000-01-01"));
    for (const model of ["hybrid", "control"]) {
      const result = await build(model);
      expect(result.appRan).toBe(false);
      expect(result.compiled).toBe(1);
      expect(result.rendered).toBe(1);
      expect(
        await readFile(
          `${model}/dist/content/start/workspace-setup.json`,
          "utf8",
        ),
      ).toContain(marker);
    }
    expect(
      JSON.parse(
        await readFile(
          "hybrid/dist/content/start/workspace-setup.json",
          "utf8",
        ),
      ),
    ).toEqual(
      JSON.parse(
        await readFile(
          "control/dist/content/start/workspace-setup.json",
          "utf8",
        ),
      ),
    );
    for (const model of ["hybrid", "control"]) {
      const target = `${model}/dist/content/start/workspace-setup.json`;
      const before = await readFile(
        `.cache/${model}/content-keys.json`,
        "utf8",
      );
      await writeFile(file, source + "\nFailure recovery " + model + ".\n");
      await chmod(target, 0o444);
      let failed = false;
      try {
        await build(model);
      } catch {
        failed = true;
      } finally {
        await chmod(target, 0o644);
      }
      expect(failed).toBe(true);
      expect(await readFile(`.cache/${model}/content-keys.json`, "utf8")).toBe(
        before,
      );
      await build(model);
      expect(await readFile(target, "utf8")).toContain(
        "Failure recovery " + model,
      );
    }
  } finally {
    await writeFile(file, source);
    await utimes(file, metadata.atime, metadata.mtime);
    for (const model of ["hybrid", "control"]) await build(model);
  }
  const literal = JSON.parse(
    await readFile("hybrid/dist/content/start/cli-installation.json", "utf8"),
  );
  expect(literal.code).toContain("@pulse/cli");
}, 120000);
