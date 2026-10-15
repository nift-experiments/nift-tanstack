# Nift-first PulseOps + TanStack islands

Third architecture, alongside the **unchanged** Phase 2 integrated hybrid and optimized TanStack-only control. This is a static-first website with an embedded React/TanStack Router workspace, not TanStack Start mounted as an island.

From this directory:

```sh
bun install --frozen-lockfile
bun run build                 # auto-generates a missing shared corpus manifest at the selected scale
bun run serve                 # http://127.0.0.1:4214/
bun run check
bun run dev                   # serialized file watcher + localhost server; reload after changes, not HMR
bun run build --fresh          # discard only this configuration's derived state
bun run build --all            # regenerate all HTML/search; reuse valid content/bundles
```

Requires the root repo's pinned dependencies as well (`bun install --frozen-lockfile` from the parent), Bun 1.4.3, Node 22.22.1 and Nift 4.12.0. Corpus generation uses the existing parent tools. Do not modify the original control or its root package/lock. Select corpus size from the parent using `bun run corpus 3000` before building; the target is the identical 3,000 authored inputs including all 62 original guides and 979 MDX sources.

## Maintained sources

- Ordinary content: parent `corpus/original`, `corpus/authored`, `corpus/additions.json` and `tools/generate.ts`. Same ownership rules as Phase 2. Do not preserve edits in generated corpus files.
- `templates/page.html` and `templates/header.html`: the one Nift-owned site shell. Author internal href/src URLs with `@path` (tracked page names for pages, concrete existing files for assets). `$[title]` inserts the tracked title. Never use a second React header.
- Shared `../shared/site.css`, Portal/Capacity views and fixture JSON remain unchanged inputs. New configuration-specific browser behavior belongs under `frontend`.
- `frontend/doc-islands.tsx`: independent mounted Tabs and BudgetCalculator. They own only their mount element. Add the matching server fallback/registration in `tools/compiler-worker.tsx` when introducing a new authored MDX component.
- `frontend/explorer.tsx`: Query catalog loading, Table filtering/sorting, Virtual bounded DOM and Form-validated local-only subscription. It is extra functionality beyond the reference, not skipped comparison work.
- `frontend/workspace.tsx`: embedded programmatic Router reusing existing dashboard, deployment/detail, incidents, services, capacity and settings views. `data-client.ts` replaces Start server functions with a same-origin static fixture API. This fixture substitution preserves demonstrated UI data, not a general authenticated backend contract.
- `tools/build.ts`: explicit compiler/bundle/search stages (search has its own worker); bounded workers; generated page recipes; native Nift HTML composition. Non-Nift compile preparation cost remains included. The compiler uses standard Markdown/GFM/highlight processing for Markdown and official MDX compilation plus React static rendering for MDX only. No React SSR or hydration of the full document.

## Derived state and boundaries

`public`, `.cache`, `.generated`, `.nift` receipts/tracking are derived. **Keep `.nift/config.json`.** The parent corpus remains authoritative outside this native project root. The external compiler watches/hashes those sources; Nift tracks the generated body recipes within its boundary. Bodies are split into strict JSON text chunks and checked URL references. Nift loads chunks through `@json` and outputs their values without reparsing them, so Nift-like examples cannot execute. Internal body URLs are emitted as checked `@path` references, including the topology image. Framework/runtime-generated links use the documented `/docs/<slug>/` contract instead of template source.

Plain Markdown pages load only the tiny vanilla shell script. MDX with interactive components loads React and the docs entry; static callouts/images do not require a client component. Search loads MiniSearch only on the docs index. Explorer and workspace bundles are loaded only at those entries. React `createRoot` mounts replace only prepared island fallbacks; this is selective mounting, not whole-page hydration. Build-time trusted MDX evaluation remains; ordinary docs ship no MDX evaluator.

Documentation navigation and docs↔workspace transitions are full-document navigations. Inside `/app`, Router navigation remains client-side. A session note is intentionally stored in `sessionStorage`; its continuity does not prove shared React state across document boundaries. Canonical trailing-slash redirects are required by the localhost static adapter for relative Nift URLs. Header URLs are resolved once before Router changes location. Unknown URLs return 404. Origin-root hosting is assumed; no arbitrary-base/deployment/auth certificate is claimed.

The workspace is client-rendered and requires JavaScript; reference Start app routes also provide SSR/server-function semantics. This capability difference must accompany performance comparisons. Documentation, initial component fallback content, headings, tables, anchors, highlighting, navigation and search are retained; this does not imply byte-identical full HTML across architectures.

## Verification and evidence

`python3 tools/verify.py` compares all docs against an already built parent control: heading text/anchors, tables and highlighted code, exact search bytes, and every local static href/src target. Parent browser checks separately exercise component behavior and app interactions. Reports/raw measurements live in `../evaluation/nift-first/`; these are lightweight single-run diagnostics, not a campaign claiming statistical significance.

Production does not require Bun/Start as an application server: `public` is a conventional static directory, including fixture APIs. The checked-in Bun adapter is a localhost preview. Do not modify Nift core, publish to Labs, deploy or contact maintainers as part of this experiment.

Run `bun run test` with dev watchers stopped for preserved-mtime edits, literal Nift-like code, missing-asset failure/retry and missing-output recovery. Compiler intermediates carry their actual input hash, so a failed publication followed by restoring the source cannot reuse the wrong body.

The independent GitHub clean-checkout proof in `../evaluation/nift-first/clean-clone.json` reproduced every publication file byte-for-byte. Run `python3 tools/tree-hash.py public` to obtain the static inventory digest.
