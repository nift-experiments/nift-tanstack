import { createRoot } from "react-dom/client";
import { useState } from "react";
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
        {labels.map((label, i) => (
          <button
            key={label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
          >
            {label}
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
for (const node of document.querySelectorAll<HTMLElement>("[data-island]")) {
  const Component =
    node.dataset.island === "Tabs"
      ? Tabs
      : node.dataset.island === "BudgetCalculator"
        ? BudgetCalculator
        : null;
  if (Component)
    createRoot(node).render(
      <Component {...JSON.parse(node.dataset.props || "{}")} />,
    );
}
