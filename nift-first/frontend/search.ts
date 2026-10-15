import MiniSearch from "minisearch";
const input = document.querySelector<HTMLInputElement>("[data-search]")!;
const output = document.querySelector<HTMLElement>("[data-results]")!;
let index: MiniSearch | null = null;
const loading = fetch("/search-index.json")
  .then((r) => {
    if (!r.ok) throw Error("Search index unavailable");
    return r.text();
  })
  .then((t) => {
    index = MiniSearch.loadJSON(t, {
      fields: ["title", "text"],
      storeFields: ["slug", "title", "section"],
    });
  });
input.addEventListener("input", async () => {
  try {
    await loading;
    output.replaceChildren();
    if (!input.value.trim()) return;
    const rows = index!
      .search(input.value, { prefix: true, combineWith: "AND" })
      .slice(0, 20);
    const status = document.createElement("p");
    status.role = "status";
    status.textContent = rows.length + " matching documents";
    output.append(status);
    for (const row of rows) {
      const p = document.createElement("p"),
        a = document.createElement("a");
      a.href = "/docs/" + row.slug + "/";
      a.textContent = row.title;
      p.append(a);
      output.append(p);
    }
  } catch (e) {
    output.textContent = String(e);
  }
});
