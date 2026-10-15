import { Link } from "@tanstack/react-router";
import docs from "../docs/index.json";
import site from "./site.json";
export function Sidebar() {
  return (
    <aside className="sidebar">
      {site.sections.map((s) => (
        <div key={s.slug}>
          <h3>{s.title}</h3>
          {docs
            .filter((d) => d.section === s.slug)
            .map((d) => (
              <Link key={d.slug} to={"/docs/" + d.slug + "/"}>
                {d.title}
              </Link>
            ))}
        </div>
      ))}
    </aside>
  );
}
export function Landing() {
  return (
    <>
      <div className="hero">
        <div className="eyebrow">DEVELOPER OPERATIONS, TOGETHER</div>
        <h1>
          Ship confidently.
          <br />
          Respond clearly.
        </h1>
        <p className="muted">
          A practical workspace for deployment health, incident response and the
          knowledge that connects them.
        </p>
        <Link className="button" to="/app">
          Open workspace →
        </Link>
        <Link to={"/docs/" + "start/workspace-setup/"}>
          Read the field guide
        </Link>
      </div>
      <div className="cards">
        {site.sections.map((s) => (
          <section key={s.slug}>
            <h2>{s.title}</h2>
            <p className="muted">
              Practical procedures, reference contracts and operational
              checklists.
            </p>
            <Link
              to={"/docs/" + docs.find((d) => d.section === s.slug)!.slug + "/"}
            >
              Explore {s.title.toLowerCase()} →
            </Link>
          </section>
        ))}
      </div>
    </>
  );
}
