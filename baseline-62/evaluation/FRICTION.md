# Observed friction (chronological, not a verdict)

- User supplied a normal `nift init` scaffold with HANDOVER; no migration initializer used. No local Git repo or remote exists initially.
- Nift's official getting-started and path documentation loaded. The markup documentation link failed in the web reader; use the installed project handover/local matching documentation as fallback and retain this discovery failure.
- Architecture decision to test: Nift owns native Markdown documentation + landing output; TanStack owns interactive `/app` routes/server functions. The control uses TanStack for both and its built-in prerendering for comparable documentation publication. This deliberately tests a static/interactive boundary rather than replicating Agora's renderer.
- Both controls will share maintained app/fixtures/corpus, dependencies and visual assets. Differences in document navigation/hydration will be evaluated explicitly, not presented as equal runtime work.

## First executable builds

- Initial CSS contained a gratuitous empty data-URL import. Vite correctly rejected it; removed. This was author error, not a tool limitation.
- Assumed `nift build -a`; installed CLI rejected it. `nift commands` documents `build --all`; corrected.
- Assumed Start `.inputValidator`; installed types and runtime require `.validator`. Typechecking now gates both applications.
- Named callable server-function module `.server.ts`, which Start deliberately blocks from client imports. Renamed to `docs-data.ts`; filesystem import remains inside the transformed server-function handler.
- TypeScript 7 removed `baseUrl`. Removed it and used relative path mappings.
- Nested control build initially exposed relative server-output ambiguity during preview. Set its output directory explicitly to an absolute control-local path; native prerender now publishes all 61 pages.
- During implementation, sync logic initially rewrote maintained templates and landing. Corrected before handoff: only navigation includes and wrappers are generated. Template edits must survive normal builds.

## Skeptical review corrections

- Expanded app fingerprint to include TypeScript config and imported dev plugin; recorded all emitted artifact paths so a partially missing `dist` triggers repair.
- `sync-docs` now rereads metadata on every invocation, validates record paths/sections, bootstraps missing derived tracking, and writes static CSS only when bytes change.
- Dev bridge now handles add/change/unlink, ignores generated wrappers, serializes/coalesces asynchronous builds and removes its listener on close.
- Missing deployment IDs now raise Router `notFound` from the loader.
- Saved theme restoration moved to a mounted root component, avoiding server/client markup mismatch. Browser persistence must be tested after reload.
- Control server now bundles Markdown through Vite's native raw glob. It no longer needs an absolute source filesystem path at runtime; documentation fetches remain portable with the dist artifact.
- Control documentation/landing links now use Router navigation, preserving its runtime advantage. Hybrid static docs remain ordinary page loads.

## Final observed seams

- Native @path navigation exposed a dev middleware mistake: an explicit `index.html` URL was treated as a directory. Added file-path handling and clicked the real link successfully.
- Changing dev plugin + docs together exposed a native build-lock race during Vite restart. Added closeBundle cleanup/draining; repeated concurrent change/restart recovered without the race.
- Control raw Markdown server-module HMR did not refresh active loader data. Added a small conventional full-reload hook; both open docs views then updated automatically.
- Moved shared CSS outside Vite publicDir after development warned about importing public source as a module.
- First process-tree observer undersampled short paths. Retained/rejected those aggregate peaks and repeated the small campaign once with kernel descendant traversal; short-path sampled tree peak rose from ~9 to ~44 MiB.
- Clean control HTML is not byte-deterministic because Router serializes match update timestamps. Assets match exactly; HTML matches after a narrow documented timestamp-only normalization.
