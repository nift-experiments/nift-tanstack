# Developer experience comparison

Scores are engineering judgments on a 1–10 scale (higher is better), not measurements or an arithmetic benchmark index. They evaluate this 62-guide greenfield portal after straightforward fixes. Scores do not extrapolate the Agora migration to every new TanStack application.

| Category | Start alone | Nift + Start | Evidence, deduction and improvement |
|---|---:|---:|---|
| Setup DX | 8 | 5 | Supported Vite/Start setup is recognizable. Hybrid needs tracking adaptation, a dev bridge, stage caching and serving dispatch. Ship a maintained normal-init integration recipe. |
| Daily development DX | 8 | 7 | Both have one command, working React HMR and docs reload. Hybrid needed link-path and watcher lifecycle fixes. Standardize bridge error/restart behavior. |
| AI-DX | 8 | 6 | Fresh worker succeeded, but README and dual-shell knowledge mattered; only one worker, not a blinded comparative study. Improve generated/source labels and integrated handover. |
| Architectural compatibility | 8 | 7 | Static docs/application boundary is coherent; React/SSR/Query remain native. Shared layout and client-state boundaries are awkward. Prefer explicit separate publishing domains. |
| Integration complexity | 8 | 4 | Hybrid owns synchronization, invalidation, watch lifecycle and dispatch beyond native Start. A supported adapter/output manifest would remove significant bespoke policy. |
| Documentation experience | 8 | 7 | Both use authoritative Markdown. Nift adds native paths/dependencies and independent static output; control keeps hydrated Router navigation. Neither exercises MDX components. Add metadata/frontmatter discovery and shared-content conventions. |
| Interactive application experience | 9 | 8 | Same real Start routes, Query loaders, server function, stateful controls and settings. Hybrid does not improve React work; crossing static docs resets the document. Keep that boundary explicit. |
| Incremental builds | 5 | 9 | Hybrid docs edit skips Vite and changes exactly one output; partial-output repair passes. Native control publication reruns the build, although dev HMR is fast and a generic no-op wrapper could improve it. Strengthen reusable stage input/environment declarations. |
| Production builds | 8 | 8 | Both are fast, reproduce from clean sources and use similar full-build aggregate memory. Hybrid is faster for this static-publication scope; its hosting has more moving parts. Certify a real deployment target before a broad recommendation. |
| Maintainability | 8 | 6 | Shared data/React/CSS help both. HTML/JSX shell duplication and project-specific cache policy cost the hybrid. Reduce duplicated presentation decisions without inventing another rendering framework. |
| Overall developer value | 8 | 6 | Roughly two-second native builds are already acceptable here. Faster content publication does not automatically repay extra integration ownership. Choose hybrid when independent static-doc publishing is itself valuable. |

## Setup and workflow observations

All original failed assumptions and fixes are retained chronologically in FRICTION.md. Nift normal initialization was the supplied starting point; migration mode was never used. Exact binary/version provenance is in environment.json; exact packages and lock are local. Installation and final source-only builds succeeded using the frozen lockfile.

Both dev commands preserve table search across React HMR; both reload changed Markdown automatically. Native server-only Markdown module HMR did not refresh an already loaded control page by itself, so a small conventional Vite full-reload hook was added rather than leaving the control disadvantaged. The hybrid needed a substantially larger bridge and cleanup on config restart to avoid a stale watcher racing a new Nift build.

Production component edits remain ordinary Vite builds. Normal hybrid content edits retain fast native page invalidation, while a global navigation change properly affects static docs and the app. Docs-template-only fan-out is cheaper still, but it is not the same workload as a shared application/navigation change and is reported as a correctness proof rather than substituted into the comparison.

## Independent reviews

Three fresh-context skeptical reviews are preserved verbatim: review-tanstack.md, review-nift.md and review-dx.md. They agree the split is technically coherent and native app conventions remain visible; none claims adding Nift is universally desirable. Their runtime localhost checks were unavailable under their sandbox, so they explicitly separate source inspection from parent browser/protocol evidence.

Straightforward defects resolved: missing-route 404 handling; theme restoration after reload; source-path-dependent control docs loading; incomplete config/output cache checks; stale metadata imports; missing watcher add/unlink; watcher build serialization and restart cleanup; generated wrappers mistaken for watch inputs; incomplete tools typechecking; misleading nominal test command; dense source formatting; unused scaffold editing targets.

Remaining findings: duplicated shells/landing; root-hosting assumptions; project-specific cache/environment contract; separate static/app deployment outputs and state transitions; small normal-build preparation scan; MDX and production hosting not tested. These are retained as limitations rather than polished away.
