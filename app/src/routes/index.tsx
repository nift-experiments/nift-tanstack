import { createFileRoute, Link } from "@tanstack/react-router";
export const Route = createFileRoute("/")({
  component: () => (
    <>
      <div className="hero">
        <div className="eyebrow">ONE WORKSPACE / ONE ROUTER</div>
        <h1>
          Ship confidently.
          <br />
          Respond clearly.
        </h1>
        <p className="muted">
          The operations console and knowledge base share one hydrated React
          application.
        </p>
        <Link className="button" to="/app">
          Open workspace →
        </Link>
        <Link to="/docs">Explore documentation →</Link>
      </div>
    </>
  ),
});
