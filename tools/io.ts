import { mkdir, readFile, writeFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
export const hash = (value: string | Buffer) =>
  createHash("sha256").update(value).digest("hex");
export async function changed(path: string, value: string) {
  await mkdir(path.slice(0, path.lastIndexOf("/")) || ".", { recursive: true });
  if ((await readFile(path, "utf8").catch(() => null)) !== value)
    await writeFile(path, value);
}
export async function files(path: string): Promise<string[]> {
  return (
    await Promise.all(
      (await readdir(path, { withFileTypes: true }).catch(() => [])).map((e) =>
        e.isDirectory() ? files(path + "/" + e.name) : [path + "/" + e.name],
      ),
    )
  ).flat();
}
export async function run(
  command: string[],
  options: {
    cwd?: string;
    env?: Record<string, string | undefined>;
    quiet?: boolean;
  } = {},
) {
  const p = Bun.spawn(command, {
    cwd: options.cwd,
    env: options.env || process.env,
    stdout: options.quiet ? "pipe" : "inherit",
    stderr: options.quiet ? "pipe" : "inherit",
  });
  const stdout = options.quiet
    ? new Response(p.stdout).text()
    : Promise.resolve("");
  const stderr = options.quiet
    ? new Response(p.stderr).text()
    : Promise.resolve("");
  const [code, out, err] = await Promise.all([p.exited, stdout, stderr]);
  if (code) throw Error(command.join(" ") + " failed\n" + out + err);
  return out;
}
