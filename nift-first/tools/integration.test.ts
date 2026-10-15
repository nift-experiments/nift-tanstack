import { test, expect } from "bun:test";
import { readFile, writeFile, stat, utimes, rm } from "node:fs/promises";
import { run } from "../../tools/io";
const build = async () =>
  JSON.parse(
    (await run(["bun", "tools/build.ts"], { quiet: true }))
      .trim()
      .split("\n")
      .at(-1)!,
  );
test("static content invalidation, checked assets, retry and missing output recovery", async () => {
  await build();
  const file = "../corpus/original/start/workspace-setup.md",
    source = await readFile(file, "utf8"),
    meta = await stat(file);
  try {
    await writeFile(
      file,
      source +
        "\nStatic incremental proof with literal `@path('missing')`, `@input('missing')` and `$[value]`.\n",
    );
    await utimes(file, meta.atime, new Date("2000-01-01"));
    const r = await build();
    expect(r.compiled).toBe(1);
    expect(r.appRan).toBe(false);
    expect(r.rendered).toBe(1);
    const html = await readFile(
      "public/docs/start/workspace-setup/index.html",
      "utf8",
    );
    expect(html).toContain("@path");
    expect(html).toContain("$[value]");
    expect(html).not.toContain("assets/docs.js");
  } finally {
    await writeFile(file, source);
    await utimes(file, meta.atime, meta.mtime);
    await build();
  }
  const cache = ".generated/rendered/start/workspace-setup.json",
    rendered = await readFile(cache, "utf8"),
    success = await readFile(".cache/success.json", "utf8");
  try {
    const data = JSON.parse(rendered);
    data.html += '<img src="/assets/missing-proof.svg" alt="Missing proof">';
    await writeFile(cache, JSON.stringify(data));
    let failed = false;
    try {
      await build();
    } catch (e) {
      failed = true;
      expect(String(e)).toContain("missing-proof.svg");
    }
    expect(failed).toBe(true);
    expect(await readFile(".cache/success.json", "utf8")).toBe(success);
  } finally {
    await writeFile(cache, rendered);
    await build();
  }
  const output = "public/docs/start/workspace-setup/index.html";
  await rm(output);
  const repaired = await build();
  expect(repaired.compiled).toBe(0);
  expect(repaired.appRan).toBe(false);
  expect(await Bun.file(output).exists()).toBe(true);
  expect(
    await readFile("public/docs/start/cli-installation/index.html", "utf8"),
  ).toContain("@pulse/cli");
}, 120000);
