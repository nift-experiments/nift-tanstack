import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
const job = JSON.parse(await readFile(process.argv[2], "utf8"));
process.env.PULSE_DATA_ROOT = resolve(job.data);
const app = (await import(resolve(job.server))).default;
for (const path of job.paths) {
  let response = await app.fetch(new Request("http://pulse.local" + path));
  for (
    let i = 0;
    i < 4 &&
    response.status >= 300 &&
    response.status < 400 &&
    response.headers.get("location");
    i++
  )
    response = await app.fetch(
      new Request(
        new URL(response.headers.get("location")!, "http://pulse.local"),
      ),
    );
  if (!response.ok)
    throw Error("Render " + path + " returned " + response.status);
  const html = await response.text();
  if (!html.includes("<html") || !html.includes("PulseOps"))
    throw Error("Invalid SSR output " + path);
  const file = job.output + path.replace(/\/$/, "") + "/index.html";
  await mkdir(file.slice(0, file.lastIndexOf("/")), { recursive: true });
  await writeFile(file, html);
}
