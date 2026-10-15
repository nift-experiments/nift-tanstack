# PulseOps: private greenfield Nift + TanStack experiment

Two implementations share one package lock, 62 maintained Markdown guides, realistic local fixtures, CSS, React views, TanStack Query data access and supported Start/Router route conventions. No external services or credentials. This is an engineering comparison, not a published product.

## Run

Requirements: Bun 1.4.3, Node 22.22.1, installed Nift 4.12.0. Ensure `bun`, `node` and `nift` are on PATH.

```sh
bun install --frozen-lockfile
bun run dev             # hybrid http://127.0.0.1:4200
bun run dev:control     # control http://127.0.0.1:4201
```

Production, from this directory:

```sh
bun run build           # complete hybrid; fingerprint skips unchanged app stage
bun run serve           # http://127.0.0.1:4202
bun run build:control   # complete control; native Start prerenders docs
bun run serve:control   # http://127.0.0.1:4203
bun run check
```

`build:full` forces both hybrid stages. `build:control:ssr` is an additional legitimate SSR-only control workload: it does NOT produce the comparable static documentation publication. Restart production servers after rebuilding their server bundle. Dev servers handle changes automatically.

## Maintained source and ownership

- `docs/**/*.md`: authoritative Markdown content; `docs/index.json`: navigation metadata. Add a guide to both. `shared/site.json` defines sections and navigation.
- `shared/Portal.tsx`: shared app/header views; `shared/data.ts`: Start server function and Query options; `shared/fixtures.json`: deterministic local fixture data.
- `src/routes`: hybrid's ordinary TanStack file routes. `control/src/routes`: control routes, plus its own landing/doc routes. Both use per-request QueryClients and SSR hydration integration.
- `shared/site.css`: shared design source. Nift copies it to `public/site.css`; Vite builds its own hashed CSS asset. `templates/{docs,landing}.html` and `content/index.html` are maintained Nift sources. The React landing counterpart is `shared/Docs.tsx`.
- `tools/sync-docs.ts`: derives tiny `content/docs/**` wrappers and `.nift/tracked.json` from docs metadata. Generates `.generated/*` navigation includes. NEVER edit these derived files. Nift native `@markup` renders the original Markdown, with native dependency tracking. Retired docs are removed from public output.
- Nift templates use `@path` for Nift-managed documentation and asset links. `/app/*` belongs to the Start server, crosses the static/app boundary and uses application-root URLs. React uses native Router links.
- `tools/build.ts`: conservative app fingerprint, standard Vite build when needed, Nift publication. It is not a replacement app compiler. Markdown changes skip Vite. Shared React/config/fixture changes rebuild Vite; native Nift dependencies independently determine docs fan-out.
- `tools/dev-plugin.ts`: small Vite middleware/watch bridge for Nift docs and landing, full-page reload on content changes; app components retain Vite HMR.
- `tools/serve.ts`: localhost adapter: hybrid static `public`, then Vite client assets, then genuine Start server request handler; control static prerender outputs then genuine Start handler.

## Artifact boundary

`public/docs`, `content/docs`, `.generated`, `.nift` build state, route trees and `dist` are derived. `.nift/config.json` is maintained; `.nift/tracked.json` is derived but intentionally visible for Nift tooling. Generated files are not a place to fix the site. Do not delete `.nift` wholesale to clean a build.

The hybrid static docs have no React hydration/client route transitions. The control retains those TanStack capabilities. Both have equivalent content and the same interactive application; their docs runtime/hosting architectures deliberately differ. This tradeoff must stay visible in the evaluation.

## Scope

Private local evaluation only. Do not push, publish, contact maintainers, modify Nift core or touch prior experiments. Reports live in `evaluation/`. Read `evaluation/FRICTION.md` for implementation failures as well as successful fixes.

## Evaluation

Read [the final verdict](evaluation/FINAL-VERDICT.md), [scored DX comparison](evaluation/DX-REVIEW.md), [measurements](evaluation/BENCHMARKS.md), [hands-on maintenance record](evaluation/maintenance-test.md) and [future integration proposals](evaluation/NIFT-IMPROVEMENTS.md).

`bun run test` runs the real incremental-isolation/output-repair checks and briefly edits/restores fixture sources; run it with dev servers stopped. Use `build:full` after toolchain/environment changes or when extending configuration imports beyond the declared cache inputs. The cache contract is specific to this experiment.
