# Architecture and experiment scope

## Workload

PulseOps is a private, greenfield developer operations portal: 62 maintained Markdown guides in seven sections, 80 fixture deployments, 12 incidents, five services, a selectable time-series chart, searchable/filterable/sortable/paginated deployment tables, detail routes, incident filtering, a derived service view and validated browser-persisted settings. The first implementation had 60 guides; the independent maintenance worker added two. No migration scaffold or Agora compiler was copied. No external credentials, services, authentication system or real deployment mutation is implied by this local fixture application.

Both implementations use the same exact locked framework versions, original corpus, CSS, fixture data and React views. Plain Markdown was chosen; MDX/component-in-doc authoring was not exercised. The guides mix operational procedures, specific per-topic contracts, decision tables, configuration examples, HTTP API examples, checklists and runbooks. They are intentionally small practical guides, not thousands of padded benchmark pages.

## Ownership

| Concern | Nift + TanStack | TanStack-only |
|---|---|---|
| Dependency installation | Bun and one frozen lockfile | Same |
| Interactive routes, server functions, SSR | TanStack Start/Router | Same |
| Application cache/data hydration | Per-request QueryClient and Router SSR Query integration | Same |
| React compilation/HMR | Supported Start Vite plugin then React plugin | Same |
| Static landing/docs publication | Native Nift `@markup`, templates, `@content`, tracked dependencies and `@path` | Native Start prerenderer, shared React layout, bundled raw Markdown + marked server function |
| Content metadata | Common docs index and site JSON | Same maintained inputs |
| Dev docs updates | Custom serialized Nift middleware/watch bridge | Small standard Vite Markdown full-reload hook |
| Complete production command | Small app fingerprint coordinator then Nift | Ordinary Vite/Start build with native prerender |
| Serving | Local adapter dispatches Nift public, Vite client, Start fetch | Local adapter dispatches prerender/client then Start fetch |

The hybrid is not Nift rendering React or impersonating Start. It owns a genuine static publication, while Start owns the application. Bare Nift composition is only a fraction of full-build work. Normal Markdown edits skip Vite, but the coordinator still checks the small app tree and docs metadata; it is not O(1) preparation.

## Maintained versus derived

README describes each editing surface. `docs`, shared UI/fixtures/CSS/site data, route files, Nift templates/landing and tool/config sources are maintained. Tiny content wrappers, tracked-page inventory, navigation includes, route trees, Nift receipts and dist/public documentation are derived. Removing derived tracking works; removing the entire `.nift` directory also removes maintained configuration and is not a clean operation.

Unused initial template/assets were preserved outside the workspace at `/tmp/pulse-unused-initial-scaffold-20261015` and removed from the active editing tree. The original Nift scaffold handover remains for syntax reference; README governs the custom integration.

## Genuine differences and limitations

The hybrid docs are standalone HTML without React hydration or client Router transitions. Crossing between docs and application loads a new document and discards in-memory app state. The control retains normal Router navigation and document data loading. A hydrated-control build and static-doc hybrid therefore do not have identical runtime contracts; this is an architectural tradeoff, not a hidden performance equivalence claim.

Shared CSS and metadata are authoritative, but HTML and JSX shells and landing markup are separate. The handoff proved the resulting coordination cost. Both examples assume origin-root application hosting; Nift-owned paths are resolved through `@path`, while Start route links follow its root routing convention. Arbitrary subpath hosting, CDN cache policies, production process supervision, real backend persistence, accessibility audit, untrusted Markdown sanitization and MDX React components were not certified.

The cache is an experiment-specific, conservative file fingerprint, not a general build graph. It includes app/shared/static sources, Vite and TypeScript config, imported dev plugin, package/lock and required emitted artifact paths. Future build-time environment/toolchain changes or new imported configuration dependencies require `build:full` and extending that contract. This remaining ownership cost belongs in the score; no claim of universally correct arbitrary-Vite-project caching is made.

The control's SSR-only build is separately retained: it does not produce the 63-page static publication, and is not substituted into the equivalent-publication comparison. Likewise production rebuild observations are not Vite development/HMR latency measurements.
