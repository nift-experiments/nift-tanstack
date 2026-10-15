# Validation record

Parent browser checks use the Codex in-app browser, not simulated component tests. Independent reviewers inspected source and recorded that their restricted shells could not reach localhost; these parent observations are separate evidence.

- Hybrid production: dashboard Query SSR/hydration, six-hour chart selection and point selection, deployment filtering by service + environment, dynamic detail route, settings invalid email rejection, successful save and persisted fields after reload; no captured hydration warnings in this flow.
- Both dev workflows: React banner text changed through HMR while `payments` table search state remained intact. Source restored.
- Both dev workflows: Markdown edit automatically appeared in the open documentation page; temporary marker restored. Control uses a small Vite reload hook because raw server module HMR alone did not rerun active browser loader data.
- Hybrid dev: actual `@path`-generated `index.html` link navigated successfully after middleware correction.
- Both dev workflows: added metadata + Markdown guide appeared without manual restart. Temporary guide removed from metadata and source; hybrid generated output retired.
- Hybrid dev: config-plugin edit concurrent with content update restarted cleanly after lifecycle cleanup fix. Before the fix an old watcher could race the new plugin and trigger Nift's build lock; this is recorded friction, not a Nift core failure.
- `evaluation/incremental-proof.json`: real production edit checks, not mirrored unit assertions. One Markdown output changed, no Vite or application artifact changed; shared docs-template fan-out touched all 62 docs without Vite; partial app artifact deletion caused repair.
- Native Markdown preserved a literal `@pulse/cli` scoped-package code example. Tables, fenced JSON/shell/HTTP, checklists and blockquotes are present in the corpus.

Further final production, clean-source and browser checks are appended below when complete.

## Final checks

- HTTP verifier: 144 checks across both running production models, including every guide, landing, app routes, detail route, Services and three404 cases per model; all passed (`http-verification.json`).
- Both final browser models: pagination, empty deployment filter, incident status filtering (four investigating fixtures), six-hour chart/point selection, invalid email rejection, settings persistence and restored dark theme after reload passed (`browser-checks.json`). Services filter returned the expected gateway totals in both.
- Light theme restoration after a full hybrid reload was separately observed as `html[data-theme=light]`, then both applications returned to dark. No captured warn/error logs in the final tested flows.
- Source-only frozen-lock builds and all app/tools typechecks passed. Exact hybrid and narrowly normalized control publication equivalence, plus dist-only control loader portability, are recorded separately.
- Browser viewport override returned successfully but did not change the measured 1265px viewport. Therefore no successful narrow-device browser certification is claimed. Responsive CSS is present; saved desktop screenshot is proof of the inspected layout. This is a browser-tool verification limitation, not a discovered Nift/TanStack defect.
