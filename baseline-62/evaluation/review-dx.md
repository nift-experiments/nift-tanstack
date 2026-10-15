# Independent developer and AI-DX review

## Verdict

For this greenfield interactive workspace with 60 guides, I would voluntarily choose TanStack Start alone. The hybrid is a credible static-document publishing arrangement, but the inspected implementation does not establish that its incremental publishing advantage pays for another toolchain and the coordination code. This is a source review, not the result of the later hands-on maintenance test, and it makes no timing claims.

The boundary is natural at `/docs/*` versus `/app/*`: editorial Markdown can be published as HTML while application routes retain Start, Query, server functions and SSR integration. It becomes less natural at the shared header, navigation, landing and styling, which span two rendering systems. A team already using Nift, or explicitly wanting separately hosted documentation without hydration, could reasonably accept that cost. Sixty guides by itself is not a sufficient reason.

## Evidence and strengths

- `README.md` is unusually explicit about maintained source, derived output, ports, build variants and runtime differences. It warns against editing wrappers, route trees and `.generated`, and against deleting all of `.nift`. This substantially improves initial agent orientation.
- Both implementations use ordinary Start file routes and shared `shared/Portal.tsx`, `shared/data.ts`, fixtures and CSS. `src/router.tsx` constructs per-request QueryClients and installs SSR Query integration. The hybrid does not invent an application component compiler or island runtime.
- `docs/**/*.md` is authoritative in both. Nift wrappers use native `@markup` against those files; control `control/src/docs-data.ts` loads the same corpus through a Start server function and `marked`. This permits meaningful content comparison without maintaining two corpora.
- `control/vite.config.ts` uses native Start prerender configuration and explicit page enumeration. Start alone already supports the static publication requirement; the appropriate comparison is against this build, not only the SSR-only script.
- `tools/build.ts` has a straightforward intended optimization: hash app inputs, skip unchanged Vite work, then run Nift publication. `build:full` offers an escape hatch. `tools/sync-docs.ts` preserves maintained templates and removes retired tracked documentation outputs.
- `evaluation/FRICTION.md` records failed assumptions and corrections, including `build --all`, server-function file conventions and the correction that stopped generation from overwriting maintained templates. That is useful evidence rather than a polished success-only account.

## Discoverability and source confusion

The README compensates for a confusing physical tree. A search finds a guide in `docs`, its wrapper in `content/docs`, its published HTML in `public/docs`, plus Nift tracking state and generated includes. `content/docs` wrappers and `.nift/tracked.json` are derived yet not covered by the local `.gitignore`; this is intentional for tooling visibility but increases the chance an agent edits or reviews generated material. These files have no prominent generated warning in the content itself. `.nift/config.json` is maintained alongside derived state, so ordinary cleanup heuristics are hazardous.

Unused scaffold material such as `templates/head.html`, `templates/template.html` and `public/assets/*` adds another plausible editing target. Active templates are the single-line `templates/docs.html` and `templates/landing.html`. There are only a few dozen physical lines of orchestration, but they are densely compressed statements; line count understates the reasoning burden. `shared/Portal.tsx` is similarly compressed, which affects both implementations and should not be attributed to Nift alone.

The control has fewer conceptual steps: edit Markdown, metadata, React views or standard route files, then use Start's existing build/dev path. Its docs server function and prerender configuration still require understanding, but they are within the same application framework.

## Configuration and coordination costs

1. **Generated state has a bootstrap dependency.** `syncDocs` unconditionally reads and parses `.nift/tracked.json`. Its status as derived state does not mean it is safely disposable. Clean-clone/recovery behavior needs an explicit seed or missing-file recovery, rather than relying only on the README warning.
2. **Fingerprint correctness is another maintenance responsibility.** `tools/build.ts` includes `src`, `shared`, `static`, Vite config, package metadata and lockfile, but omits `tsconfig.json` and the bridge tool sources. Changes to resolution/compiler settings can therefore skip a needed app build. `build:full` is documented, but contributors must recognize when the cache model is incomplete. This is a source-level risk, not a reproduced stale-build failure.
3. **The check script does not cover all critical glue.** `package.json` runs two TypeScript checks; the root include list does not enumerate `tools/build.ts` or `tools/serve.ts`. The dev plugin and sync helper are imported through Vite config, but that does not cover every orchestration entry point. `test` names `tools/*.test.ts`, while no matching files were present at inspection. A nominal script is not evidence of integration coverage.
4. **Development behavior is custom.** `tools/dev-plugin.ts` invokes blocking `spawnSync`, debounces `change` events, syncs state and reloads documents. It does not register explicit `add`/`unlink` handlers. An actual add/remove-guide exercise is needed before claiming the watcher workflow is smooth. Generated wrapper writes also occur inside watched content, so settling behavior deserves observation.
5. **Shared product changes cross ownership boundaries.** Header markup exists in `shared/Portal.tsx` and the sync helper's generated header; the landing exists in `content/index.html` and `shared/Docs.tsx`. The React landing derives section cards from metadata while Nift landing cards are hardcoded. A section or shell change can require coordinated HTML, React and metadata edits. Shared CSS reduces visual drift but does not eliminate markup drift.
6. **Publishing and serving are separate concerns.** `tools/serve.ts` orders hybrid `public` before Vite client output, then falls through to the Start handler. This is understandable for localhost, but routing precedence and deployment adaptation are extra owned behavior. The README correctly calls it a localhost adapter; no production-hosting advantage should be inferred from it.
7. **Runtime capabilities differ.** Static docs have full-page navigation and no React hydration, while control docs retain Router/client behavior. The lack of hydration may be a useful product choice, but it is not equal runtime work or a free DX win.

## Improvements worth making before a stronger recommendation

- Keep the ownership table, add a short task map (edit guide, add guide, change header, change landing, recover generated state), and mark derived wrappers prominently where Nift syntax permits.
- Format the bridge and shared components conventionally; remove or clearly label unused scaffold assets/templates.
- Make sync recover from absent tracking state, validate metadata references and duplicates, and test retirement/addition behavior in the later maintenance exercise.
- Cover compiler settings and relevant build glue in invalidation, and typecheck every orchestration entry point. Give cache diagnostics a readable reason for rebuild/skip.
- Generate both shells/landing data from a common structural model where practical, without turning the bridge into a second UI compiler. If that effort grows, reconsider the split.
- Verify watcher additions/deletions, error recovery and clean checkout builds. Add targeted tests for invalidation and retirement only after concrete behavior and failure modes are established.

## Verification limits

I read the README, friction log, build/sync/dev/serve tools, Vite and TypeScript configs, templates, shared views/data, routers and control documentation route. I did not modify application source or run the future maintenance exercise. In this review shell, `bun run check` could not start because `bun` was absent from PATH, and HTTP probes to localhost ports 4202 and 4203 returned status 000. Those results do not establish that the applications fail; they limit this review to inspected evidence. Runtime, visual and timing conclusions must come from the other evaluation runs.
