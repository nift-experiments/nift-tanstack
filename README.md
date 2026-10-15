# Nift + TanStack: greenfield scale experiment

Public engineering R&D, **not a deployed website or an adoption claim**. The original 62-guide result is preserved under `baseline-62/` with its conclusion unchanged. Phase 2 tests one hydrated Start/Router application at 62, 500, 1,500 and 3,000 documents.

## Prerequisites and commands

Bun 1.4.3, Node 22.22.1 and Nift 4.12.0 on PATH. Exact JS dependencies are pinned in package.json/bun.lock. No accounts, external services or secrets are required.

```sh
bun install --frozen-lockfile
bun run corpus 500                 # select62/500/1500/3000; deterministic source generation
bun run build:hybrid                # native Nift dependency/publication model
bun run build:control               # cache-aware non-Nift control
bun run serve:hybrid                # http://127.0.0.1:4212
bun run serve:control               # http://127.0.0.1:4213
bun run dev:hybrid                  # one dev command, port4210
bun run dev:control                 # one dev command, port4211
bun run check
bun run test                       # serialized real integration checks; stop dev servers first
```

Either build generates a missing corpus manifest automatically at the selected `corpus/scale.json` size. Both implementations build independently; control never requires Nift. Restart production servers after rebuilding app code.

```sh
bun tools/build.ts hybrid --fresh   # discard that model's generated state and rebuild from sources
bun tools/build.ts control --fresh
bun tools/build.ts hybrid --all     # force full HTML/search publication; valid MDX/app compilation may be reused
bun tools/build.ts control --all
bun tools/build.ts hybrid --all --recompile # additionally force all MDX compilation
bun run build:native                # additional native Start prerender path, same content compiler
```

Native Start prerender is an additional reference, not a deliberately expensive stand-in for the optimized control. Matched primary models share batching, caching and runtime functionality. Do not attribute generic stage-cache savings to Nift.

## One application, two dependency/publication planners

`app/src/routes` contains the single shared Router tree, root React layout and real Start server functions. `shared/Portal.tsx`, fixtures and Query options implement dashboard, sortable/filterable/paginated deployments, incidents, service aggregates and validated persistent settings. A per-tab session note provides useful in-memory context and a visible Router-continuity test.

`shared/Document.tsx` runs precompiled MDX with normal React components. `shared/DocComponents.tsx` owns callouts, tabs, interactive calculator and Router-aware Markdown links. Docs and app routes hydrate and navigate in the same Router. There is no Nift HTML shell or docs/app dispatch split.

`tools/compiler-worker.ts` is the shared standard MDX/GFM/highlighting pipeline. Per-document function-body payloads remain outside the Vite module graph. Official MDX `runSync` evaluates **trusted authored code**, on server and browser; untrusted user input and strict no-eval CSP are not supported by this design. Both models have this same tradeoff.

The hybrid root `.nift/config.json` uses hash invalidation. Native `status()` selects dirty recipes; `@dep` and tracked `inject(...).stringify()` publish payload JSON. The control selects dirty records with content fingerprints and publishes equivalent JSON directly. Both use the same bounded compiler, search indexer and genuine Start SSR renderer. Whole-index search regeneration remains a measurable fixed cost after a document change.

`tools/build.ts` declares app/compiler/search/renderer stage inputs and validates required artifact presence. Renderer implementation changes invalidate HTML; missing assets trigger app repair. Source hashes and successful publication keys are committed only after stages succeed. This is project-specific orchestration, not a general-purpose replacement for Vite dependency analysis. Use `--fresh` after unsupported configuration/host-toolchain changes or suspected output corruption. Do not hand-edit generated output.

## Content ownership

- `corpus/original/`: the original62authored guides and index, copied without content changes.
- `corpus/additions.json`: maintained records for new hand-written Markdown/MDX. Put their sources under `corpus/authored/` and include `slug,title,section,file,format,summary`. Run `bun run corpus <scale>` after adding/removing metadata.
- `tools/generate.ts`: authoritative deterministic generator for versioned reference material;16service schemas ×4versions ×46operation/guide/runbook/design topics, truncated to selected scale. It is templated fictional API documentation, not3,000handwritten or production-validated service contracts.
- `corpus/generated/`, `corpus/active.json`, `corpus/generation.json`: disposable generated inputs/metadata. Never treat edits there as maintained work. Existing generated bodies are preserved during scale selection for diagnostics, but `bun run corpus 3000 --regenerate` deliberately resets them. To retain an editorial change, move it to a maintained authored record or update the generator.
- `.cache/`, `.nift` receipts/tracking, `hybrid/content`, route trees and both `dist` trees: derived. `.nift/config.json` and `hybrid/templates/payload.html` are maintained. **Do not delete `.nift` wholesale.**

The generator preserves all original guides at every scale. Content families vary service fields, endpoints, error contracts, versioned budgets, procedural gates, code languages, tables, links and MDX interactions. Source generation provenance and final corpus hashes belong in evaluation, not an inflated source archive.

## Serving and scope

Both models emit a conventional `dist/client` static publication, `dist/server` Start handler and `dist/content` runtime payload directory. The same localhost adapter serves static assets/HTML then Start. A platform adapter must set `PULSE_DATA_ROOT` to the emitted content directory; no original corpus is needed at runtime. Origin-root hosting is assumed. Production hosting, auth, external backend persistence and arbitrary-base-path deployment are not certified.

Nift-managed recipe paths stay within the shared repository root. Framework links/assets are produced by Start/Router; there is no second authored Nift HTML path layer to coordinate. Do not inject templates into code examples.

## Evidence and policy

Original evidence: `evaluation/BASELINE-62-PAGES.md` and `baseline-62/evaluation/`. Phase 2 implementation notes and independent review snapshots live in `evaluation/`. **Final result: prefer the optimized TanStack-only control for this project.** The integrated single-Router architecture works at 3,000 documents, but no Nift-specific adoption threshold was established.

- [Measurements and component costs](evaluation/BENCHMARKS.md)
- [Architecture](evaluation/ARCHITECTURE.md)
- [DX scores](evaluation/DX-REVIEW.md) and [AI-DX](evaluation/AI-DX-REVIEW.md)
- [Final recommendation](evaluation/FINAL-VERDICT.md)
- [Future Nift integration proposals](evaluation/NIFT-IMPROVEMENTS.md)

At 3,000 documents, fresh builds were 25.20s hybrid versus 23.12s control; warm full publication 8.59s versus 7.30s; a docs edit 1.76s versus 1.12s. These are single observations, not medians. See the report for RSS, all scales, workload definitions and limitations.

Commits/pushes to this repository are authorized. No Labs page, public deployment, social announcement or maintainer outreach is authorized. Nift core, Agora and prior experiments remain untouched. See the final report before drawing conclusions from a checkpoint.
