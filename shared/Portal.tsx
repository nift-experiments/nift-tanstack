import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { portalQuery } from "./data";
import site from "./site.json";
export function PreferenceRestore() {
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pulse-preferences") || "null");
      if (p?.theme === "light" || p?.theme === "dark")
        document.documentElement.dataset.theme = p.theme;
    } catch {}
  }, []);
  return null;
}
export function Header({ docsClient = false }: { docsClient?: boolean }) {
  const docsHref: string = "/docs/start/workspace-setup/";
  const [note, setNote] = useState("");
  return (
    <>
      <header>
        <Link className="brand" to="/">
          ◈ PulseOps
        </Link>
        <nav>
          {docsClient ? (
            <Link to={docsHref}>Docs</Link>
          ) : (
            <a href={docsHref}>Docs</a>
          )}
          {site.nav.map((n) => (
            <Link key={n.href} to={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <details className="scratchpad">
          <summary>Session note</summary>
          <label>
            Session note
            <input
              aria-label="Session note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Unsaved context for this tab"
            />
          </label>
        </details>
        <span className="badge">LOCAL WORKSPACE</span>
      </header>
      <div className="fixture-workspace">
        Fixture workspace · Local demonstration data
      </div>
    </>
  );
}
export function Dashboard() {
  const { data, refetch, isFetching } = useSuspenseQuery(portalQuery);
  const [window, setWindow] = useState(24);
  const [selected, setSelected] = useState(0);
  const points = data.series.slice(-window);
  return (
    <>
      <div className="eyebrow">WORKSPACE / OVERVIEW</div>
      <h1>Operate with context.</h1>
      <p className="muted">
        Deployment health, incident response and service signals in one
        workspace.
      </p>
      <div className="cards">
        {[
          ["Deployments", data.deployments.length],
          [
            "Healthy",
            data.deployments.filter((d) => d.status === "healthy").length,
          ],
          [
            "Open incidents",
            data.incidents.filter((d) => d.status !== "resolved").length,
          ],
        ].map(([k, v]) => (
          <section key={k}>
            <small>{k}</small>
            <strong>{v}</strong>
          </section>
        ))}
      </div>
      <section>
        <div className="row">
          <h2>Request volume</h2>
          <select
            aria-label="Chart window"
            value={window}
            onChange={(e) => setWindow(+e.target.value)}
          >
            <option value={24}>24 hours</option>
            <option value={12}>12 hours</option>
            <option value={6}>6 hours</option>
          </select>
          <button onClick={() => refetch()}>
            {isFetching ? "Refreshing…" : "Refresh fixtures"}
          </button>
        </div>
        <div className="chart">
          {points.map((p, i) => (
            <button
              aria-label={`${p.hour}:00 ${p.requests} requests`}
              title={`${p.requests} requests`}
              key={p.hour}
              style={{ height: p.requests / 22 + "%" }}
              className={selected === i ? "selected" : ""}
              onClick={() => setSelected(i)}
            />
          ))}
        </div>
        <p className="muted">
          {points[Math.min(selected, points.length - 1)].hour}:00 ·{" "}
          {points[Math.min(selected, points.length - 1)].requests} requests ·{" "}
          {points[Math.min(selected, points.length - 1)].latency}ms latency
        </p>
      </section>
      <h2>Recent deployments</h2>
      <DeploymentTable compact />
    </>
  );
}
export function DeploymentTable({ compact = false }: { compact?: boolean }) {
  const { data } = useSuspenseQuery(portalQuery);
  const [search, setSearch] = useState(""),
    [env, setEnv] = useState("all"),
    [sort, setSort] = useState("id"),
    [page, setPage] = useState(0);
  const rows = data.deployments
    .filter(
      (d) =>
        (env === "all" || d.environment === env) &&
        JSON.stringify(d).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "duration" ? b.duration - a.duration : b.id.localeCompare(a.id),
    );
  const size = compact ? 5 : 10;
  return (
    <section>
      <div className="row">
        <input
          aria-label="Search deployments"
          placeholder="Search service, revision, owner…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <select
          aria-label="Environment"
          value={env}
          onChange={(e) => {
            setEnv(e.target.value);
            setPage(0);
          }}
        >
          <option value="all">All environments</option>
          {["production", "staging", "preview"].map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <select
          aria-label="Sort deployments"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="id">Newest first</option>
          <option value="duration">Longest duration</option>
        </select>
      </div>
      <div className="overflow">
        <table>
          <thead>
            <tr>
              {[
                "Deployment",
                "Service",
                "Environment",
                "Status",
                "Duration",
                "Owner",
              ].map((x) => (
                <th key={x}>{x}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(page * size, (page + 1) * size).map((d) => (
              <tr key={d.id}>
                <td>
                  <Link to="/app/deployments/$id" params={{ id: d.id }}>
                    {d.id}
                  </Link>
                </td>
                <td>{d.service}</td>
                <td>{d.environment}</td>
                <td>
                  <span className={"status " + d.status}>{d.status}</span>
                </td>
                <td>{d.duration}s</td>
                <td>{d.owner}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!rows.length && <p>No matching deployments.</p>}
      <div className="row">
        <span>
          {rows.length} results · Page {page + 1} of{" "}
          {Math.max(1, Math.ceil(rows.length / size))}
        </span>
        <button disabled={!page} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <button
          disabled={(page + 1) * size >= rows.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}
export function DeploymentDetail({ id }: { id: string }) {
  const { data } = useSuspenseQuery(portalQuery);
  const d = data.deployments.find((x) => x.id === id);
  return d ? (
    <>
      <h1>{d.id}</h1>
      <p className="muted">Deployment details</p>
      <section>
        <dl>
          {Object.entries(d).map(([k, v]) => (
            <div className="row" key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
      <Link to="/app/deployments">Back to deployments</Link>
    </>
  ) : (
    <>
      <h1>Deployment not found</h1>
      <Link to="/app/deployments">All deployments</Link>
    </>
  );
}
export function Incidents() {
  const { data } = useSuspenseQuery(portalQuery);
  const [status, setStatus] = useState("all");
  return (
    <>
      <h1>Incident response</h1>
      <select
        aria-label="Incident status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        {["all", "investigating", "monitoring", "resolved"].map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
      <div className="cards">
        {data.incidents
          .filter((i) => status === "all" || i.status === status)
          .map((i) => (
            <section key={i.id}>
              <small>
                {i.id} · {i.severity}
              </small>
              <h2>{i.title}</h2>
              <p>
                {i.status} · {i.owner}
              </p>
            </section>
          ))}
      </div>
    </>
  );
}
export function Settings() {
  const [name, setName] = useState("Platform team"),
    [email, setEmail] = useState(""),
    [theme, setTheme] = useState("dark"),
    [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("pulse-preferences") || "null");
      if (p) {
        setName(p.name);
        setEmail(p.email);
        setTheme(p.theme);
      }
    } catch {}
  }, []);
  return (
    <>
      <h1>Workspace settings</h1>
      <p className="muted">Preferences are stored only in this browser.</p>
      <section>
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim().length < 3)
              return setMessage(
                "Workspace name must contain at least 3 characters.",
              );
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
              return setMessage("Enter a valid notification email.");
            localStorage.setItem(
              "pulse-preferences",
              JSON.stringify({ name, email, theme }),
            );
            document.documentElement.dataset.theme = theme;
            setMessage("Preferences saved.");
          }}
        >
          <label>
            Workspace name
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            Notification email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <button>Save preferences</button>
          <p role="status">{message}</p>
        </form>
      </section>
    </>
  );
}

export function Services() {
  const { data } = useSuspenseQuery(portalQuery);
  const [filter, setFilter] = useState("");
  const services = [...new Set(data.deployments.map((d) => d.service))].sort();
  const visible = services.filter((service) =>
    service.toLowerCase().includes(filter.trim().toLowerCase()),
  );
  return (
    <>
      <div className="eyebrow">WORKSPACE / SERVICES</div>
      <h1>Service health</h1>
      <p className="muted">
        Health summarizes all fixture deployments: failed takes priority over
        running, then healthy. Counts include every environment and historical
        deployment.
      </p>
      <section>
        <label>
          Filter services
          <input
            type="search"
            placeholder="Search service name…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
        <p role="status">
          {visible.length} of {services.length} services
        </p>
        <div className="overflow">
          <table>
            <thead>
              <tr>
                {[
                  "Service",
                  "Deployments",
                  "Healthy",
                  "Running",
                  "Failed",
                  "Health",
                ].map((title) => (
                  <th key={title}>{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((service) => {
                const deployments = data.deployments.filter(
                  (d) => d.service === service,
                );
                const healthy = deployments.filter(
                  (d) => d.status === "healthy",
                ).length;
                const running = deployments.filter(
                  (d) => d.status === "running",
                ).length;
                const failed = deployments.filter(
                  (d) => d.status === "failed",
                ).length;
                const health = failed
                  ? "failed"
                  : running
                    ? "running"
                    : "healthy";
                return (
                  <tr key={service}>
                    <th scope="row">{service}</th>
                    <td>{deployments.length}</td>
                    <td>{healthy}</td>
                    <td>{running}</td>
                    <td>{failed}</td>
                    <td>
                      <span className={"status " + health}>{health}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!visible.length && (
          <p>
            No services match this filter. Clear the search to see all services.
          </p>
        )}
      </section>
    </>
  );
}
