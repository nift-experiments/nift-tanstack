import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { portalQuery } from "./data";

export function Capacity() {
  const { data } = useSuspenseQuery(portalQuery);
  const [threshold, setThreshold] = useState(1000);
  const [environment, setEnvironment] = useState("all");
  const services = [...new Set(data.deployments.map((d) => d.service))];
  const rows = services
    .map((service) => {
      const deployments = data.deployments.filter(
        (d) =>
          d.service === service &&
          (environment === "all" || d.environment === environment),
      );
      const seconds = deployments.reduce((sum, d) => sum + d.duration, 0);
      return { service, count: deployments.length, seconds };
    })
    .sort(
      (a, b) => b.seconds - a.seconds || a.service.localeCompare(b.service),
    );
  const over = rows.filter((r) => r.seconds > threshold).length;
  return (
    <>
      <div className="eyebrow">WORKSPACE / CAPACITY</div>
      <h1>Deployment execution capacity</h1>
      <p className="muted">
        Compare recorded deployment execution seconds per service with a
        planning budget. These historical fixtures span all recorded
        deployments, not a timed measurement of CPU, traffic or concurrent
        capacity.
      </p>
      <section>
        <label>
          Environment
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
          >
            <option value="all">All environments</option>
            {[...new Set(data.deployments.map((d) => d.environment))]
              .sort()
              .map((env) => (
                <option key={env}>{env}</option>
              ))}
          </select>
        </label>
        <label htmlFor="capacity-budget">
          Execution budget per service: {threshold} seconds
        </label>
        <input
          id="capacity-budget"
          type="range"
          min="100"
          max="5000"
          step="100"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
        />
        <p role="status">
          {over} of {rows.length} services exceed the {threshold}-second budget.
        </p>
        <div className="overflow">
          <table>
            <caption>
              Services ordered by total execution time in{" "}
              {environment === "all" ? "all environments" : environment}
            </caption>
            <thead>
              <tr>
                {[
                  "Service",
                  "Deployments",
                  "Total seconds",
                  "Mean seconds",
                  "Budget used",
                  "Headroom seconds",
                  "Review",
                ].map((label) => (
                  <th scope="col" key={label}>
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.service}>
                  <th scope="row">{r.service}</th>
                  <td>{r.count}</td>
                  <td>{r.seconds}</td>
                  <td>{r.count ? (r.seconds / r.count).toFixed(1) : "—"}</td>
                  <td>{Math.round((r.seconds / threshold) * 100)}%</td>
                  <td>{threshold - r.seconds}</td>
                  <td>
                    {r.seconds > threshold ? "Over budget" : "Within budget"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Negative headroom means recorded execution time exceeds the selected
          budget. Review deployment count alongside the mean before comparing
          services.
        </p>
      </section>
      <Link to="/docs/$" params={{ _splat: "reliability-advanced/capacity-drills" }}>
        Plan a capacity drill →
      </Link>
    </>
  );
}
