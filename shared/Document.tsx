import { useMemo } from "react";
import { runSync } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { docComponents } from "./DocComponents";
import type { DocPayload } from "./content-types";
export function Document({ doc }: { doc: DocPayload }) {
  const Content = useMemo(
    () => runSync(doc.code, { ...runtime, baseUrl: import.meta.url }).default,
    [doc.code],
  );
  return (
    <article className="prose">
      <div className="eyebrow">
        <Link to="/docs">DOCUMENTATION</Link> / {doc.section}
      </div>
      <Content components={docComponents} />
      <div className="row">
        {doc.previous && (
          <Link to={"/docs/" + doc.previous.slug}>← {doc.previous.title}</Link>
        )}
        {doc.next && (
          <Link to={"/docs/" + doc.next.slug}>{doc.next.title} →</Link>
        )}
      </div>
    </article>
  );
}
