import { useState, type ReactNode } from "react";
import topologyUrl from "./assets/service-topology.svg?url";
import { Link } from "@tanstack/react-router";
export function Callout({
  title,
  children,
  tone = "note",
}: {
  title: string;
  tone?: "note" | "warning" | "critical";
  children: ReactNode;
}) {
  return (
    <aside
      className={"callout callout-" + tone}
      aria-label={tone + ": " + title}
    >
      <strong>
        {tone === "note" ? "Note" : tone === "warning" ? "Warning" : "Critical"}
        : {title}
      </strong>
      <div>{children}</div>
    </aside>
  );
}
export function Tabs({
  labels,
  values,
}: {
  labels: string[];
  values: string[];
}) {
  const [active, setActive] = useState(0);
  return (
    <section>
      <div role="tablist" aria-label="Code example">
        {labels.map((name, i) => (
          <button
            key={name}
            role="tab"
            id={"tab-" + name}
            aria-selected={active === i}
            onClick={() => setActive(i)}
          >
            {name}
          </button>
        ))}
      </div>
      <pre role="tabpanel" aria-label={labels[active]}>
        <code>{values[active]}</code>
      </pre>
    </section>
  );
}
export function BudgetCalculator({ initial = 100 }: { initial?: number }) {
  const [requests, setRequests] = useState(initial);
  return (
    <section>
      <label>
        Requests per minute
        <input
          aria-label="Requests per minute"
          type="range"
          min="10"
          max="1000"
          value={requests}
          onChange={(e) => setRequests(+e.target.value)}
        />
      </label>
      <output>
        {requests} requests/min · {requests * 60} requests/hour
      </output>
    </section>
  );
}
export function DocLink({
  href,
  children,
  ...props
}: {
  href?: string;
  children?: ReactNode;
  [key: string]: unknown;
}) {
  return href?.startsWith("/") ? (
    <Link to={href} {...props}>
      {children}
    </Link>
  ) : (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
export function ServiceTopology() {
  return (
    <figure>
      <img
        src={topologyUrl}
        width="640"
        height="120"
        alt="Gateway sends requests to identity and payments services."
      />
      <figcaption>
        Example service dependencies for a recovery drill.
      </figcaption>
    </figure>
  );
}
export const docComponents = {
  Callout,
  Tabs,
  BudgetCalculator,
  ServiceTopology,
  a: DocLink,
};
