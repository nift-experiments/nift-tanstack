import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import MiniSearch from "minisearch";
import type { Catalog } from "./content-types";
export function Knowledge({ catalog }: { catalog: Catalog }) {
  const [query, setQuery] = useState(""),
    [index, setIndex] = useState<MiniSearch | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    fetch("/search-index.json")
      .then((r) => {
        if (!r.ok) throw Error("Search index unavailable");
        return r.text();
      })
      .then((text) => {
        if (!cancelled)
          setIndex(
            MiniSearch.loadJSON(text, {
              fields: ["title", "text"],
              storeFields: ["slug", "title", "section"],
            }),
          );
      })
      .catch((e) => setError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);
  const results =
    query && index
      ? index.search(query, { prefix: true, combineWith: "AND" }).slice(0, 20)
      : [];
  return (
    <>
      <div className="eyebrow">FIELD GUIDE / {catalog.count} DOCUMENTS</div>
      <h1>Knowledge for operators.</h1>
      <p className="muted">
        Authored guides, versioned contracts and interactive examples in the
        same Router workspace.
      </p>
      <label>
        Search documentation
        <input
          type="search"
          placeholder="Search contracts and runbooks…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      {query && (
        <section aria-label="Search results">
          <p role="status">
            {index ? results.length + " matching documents" : "Loading search…"}
          </p>
          {results.map((r) => (
            <p key={r.id}>
              <Link to={"/docs/" + r.slug}>{r.title}</Link>{" "}
              <small>{r.section}</small>
            </p>
          ))}
        </section>
      )}
      <div className="cards">
        {catalog.sections.map((s) => (
          <section key={s.slug}>
            <h2>{s.title}</h2>
            <p>{s.count} guides</p>
            <Link to={"/docs/" + s.first}>Explore →</Link>
          </section>
        ))}
      </div>
    </>
  );
}
