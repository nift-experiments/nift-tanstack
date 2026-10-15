import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
export function Callout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="callout">
      <strong>{title}</strong>
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
export const docComponents = { Callout, Tabs, BudgetCalculator, a: DocLink };
