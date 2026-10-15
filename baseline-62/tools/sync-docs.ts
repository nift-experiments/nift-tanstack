import { mkdir, readFile, writeFile, copyFile, rm } from "node:fs/promises";
async function changed(path: string, text: string) {
  await mkdir(path.substring(0, path.lastIndexOf("/")) || ".", {
    recursive: true,
  });
  if ((await readFile(path, "utf8").catch(() => null)) !== text)
    await writeFile(path, text);
}
export async function syncDocs() {
  const docs: {
    slug: string;
    section: string;
    title: string;
    summary: string;
    file: string;
    page: string;
  }[] = JSON.parse(await readFile("docs/index.json", "utf8"));
  const site: {
    sections: { slug: string; title: string }[];
    nav: { href: string; label: string }[];
  } = JSON.parse(await readFile("shared/site.json", "utf8"));
  const seen = new Set<string>();
  for (const d of docs) {
    if (
      !/^[a-z0-9-]+\/[a-z0-9-]+$/.test(d.slug) ||
      d.page !== "docs/" + d.slug + "/index" ||
      d.file !== "docs/" + d.slug + ".md" ||
      seen.has(d.slug) ||
      !site.sections.some((s) => s.slug === d.section) ||
      d.section !== d.slug.split("/")[0]
    )
      throw new Error("Invalid docs metadata: " + d.slug);
    seen.add(d.slug);
    await readFile(d.file, "utf8");
  }

  await mkdir("public", { recursive: true });
  for (const name of ["site.css", "preferences.js"])
    await changed(
      "public/" + name,
      await readFile(
        (name === "site.css" ? "shared/" : "static/") + name,
        "utf8",
      ),
    );
  const sidebar = site.sections
    .map(
      (s) =>
        `<h3>${s.title}</h3>` +
        docs
          .filter((d) => d.section === s.slug)
          .map((d) => `<a href="@path('${d.page}')">${d.title}</a>`)
          .join("\n"),
    )
    .join("\n");
  await changed(
    ".generated/docs-sidebar.html",
    `<aside class="sidebar">${sidebar}</aside>`,
  );
  const old =
    JSON.parse(await readFile(".nift/tracked.json", "utf8").catch(() => "{}"))
      .tracked || [];
  const tracked = [
    { name: "/", title: "PulseOps", template: "templates/landing.html" },
    ...docs.map((d) => ({
      name: d.page,
      title: d.title,
      template: "templates/docs.html",
    })),
  ];
  for (const page of old)
    if (
      !tracked.some((x) => x.name === page.name) &&
      page.name.startsWith("docs/")
    ) {
      await rm("content/" + page.name + ".html", { force: true });
      await rm("public/" + page.name + ".html", { force: true });
    }
  await changed(
    ".nift/tracked.json",
    JSON.stringify({ tracked }, null, 2) + "\n",
  );
  for (const d of docs)
    await changed("content/" + d.page + ".html", `@markup(md, '${d.file}')\n`);
  const header = `<header><a class="brand" href="@path('/')">◈ PulseOps</a><nav><a href="@path('${docs[0].page}')">Docs</a>${site.nav.map((n) => `<a href="${n.href}">${n.label}</a>`).join("")}</nav><span class="badge">LOCAL WORKSPACE</span></header>`;
  await changed(".generated/site-header.html", header);
}
if (import.meta.main) await syncDocs();
