# Phase 2: one hydrated application, two publication planners

## Ownership

| Layer | Both models | Nift-specific branch |
|---|---|---|
| UI/routing | One Start/Router route tree, React root, shared layouts, client transitions, Query SSR/hydration and server functions | None; no separate Nift HTML shell |
| Content | Original Markdown, maintained authored additions, deterministic versioned reference corpus; standard MDX/GFM/highlighting compiler | Native dependency graph selects dirty recipes |
| Runtime docs | Compiled function-body payload per document, MDX provider components, server/client rendering through the same Router | Native tracked JSON injection publishes equivalent payload objects |
| Application build | Stable Vite graph independent of corpus text; shared app/config/toolchain keys and required output inventory | Same |
| Publication | Same bounded compiler and SSR batches, same search indexer, equivalent hydrated HTML/assets/payloads | Native status/build adds dependency/publication stage |
| Control | Byte-hash per-document planner, same compilation/render/cache strategies | Does not require Nift |

This architecture fixes the Phase 1 two-shell objection. Parent browser evidence demonstrates a note held only in React memory surviving docs→app→docs navigation. MDX tabs/calculator and cross-document links are real React/Router interactions. Nift does not compile React or supply a parallel application runtime.

## Data and build flow

```text
Maintained Markdown / MDX + metadata
  → planner (native Nift graph OR control content fingerprints)
  → shared bounded MDX + syntax highlighting compiler
  → per-document payloads outside the Vite module graph
  → shared Start server loader + React MDX provider components
  → bounded genuine Start SSR → hydrated HTML publication
  → common search artifact over extracted source text
```

Compiler batches contain 96 documents with two processes; renderer batches contain 128 routes with two processes. Processes are recycled to bound retained graphs rather than retaining thousands of content modules. Search runs in a separate process and is regenerated after content changes. It indexes regex-cleaned source text capped at 18,000 characters per document, rather than every rendered semantic node; text beyond the cap can be absent. Valid serialized search can be reused after app-only changes. These strategies are available to both models and are not credited as intrinsic Nift features.

The additional native Start prerender path uses the same compiled content but Start's own prerenderer at four concurrent requests. It is separately measured, not the default optimized-control strawman.

## Artifacts and sources

README names every maintained and derived surface. `.nift/config.json` is maintained; receipts/recipes/tracking, active corpus manifest, generated reference text, `.cache` and `dist` are disposable. Persist editorial work through authored additions or generator sources, not ignored generated documents. Native hash mode matches the control's preserved-mtime semantics. Literal package scopes remain literal code.

Each model emits `dist/client`, `dist/server` and `dist/content`; the same ordinary localhost static-plus-Start adapter serves both. Runtime payload storage is explicit through `PULSE_DATA_ROOT`; original source files are not required at runtime. This eliminates separate docs/app serving ownership, but does not remove the need to package a Start server and static assets on a real host.

## Remaining limits

- Runtime MDX function-body evaluation executes trusted authored code; strict no-eval CSP and untrusted content are unsupported. Registered provider components are the tested authoring path; arbitrary MDX module imports are not certified.
- Source/compiler, app, search and renderer cache keys are explicit project policy. Existing corrupted artifacts are not universally checked byte-for-byte on every no-op; use fresh rebuild to repair corruption. Missing app artifacts are validated, source hash changes and interrupted-copy recovery are tested.
- Global app/asset keys conservatively republish all documentation on shared shell, component, navigation, style and current app-component changes. Full search regeneration remains a fixed one-document-edit cost.
- Origin-root hosting is assumed. Production hosting, arbitrary base paths, real backend/auth persistence and mobile-browser certification are outside this evidence.
- The 3,000-page corpus is deterministic fictional reference material, not 3,000 handwritten or production-validated articles. It exercises compilation/SSR/search and shape diversity but cannot represent every real editorial workload.

Nift's genuine value here is dependency management; a flat corpus with a good non-Nift planner does not automatically benefit from another engine. The measurements must determine the tradeoff.
