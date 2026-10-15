# Independent Phase 2 DX and AI-DX review

## Scope and verdict

This is a source-led skeptical review of the integrated Phase 2 implementation at the 500-document checkpoint (146 MDX documents), with 3,000 documents intended to use the same architecture. It compares the maintained Phase 2 sources with the preserved 62-guide baseline and its DX, AI-DX and final-verdict reports. It is not the separate fresh-context maintenance test and does not replace the baseline conclusions.

**Judgment: credible architectural improvement, but choose the cache-aware control by default for a new TanStack project.** The hybrid now avoids the baseline's most visible presentation duplication and document-boundary cost. Its remaining distinctive role is native dependency tracking and JSON publication inside a largely shared TypeScript content system. That is a narrower, more defensible benefit than claiming Nift supplies the integrated React documentation experience. Adoption needs evidence that native tracking provides enough correctness or workflow value to repay another toolchain. No measured scale crossover is established by this review.

## Source evidence: genuine simplification

- `app/src/routes/docs.$.tsx` loads a document through a Start server function and renders `shared/Document.tsx`; both models use these same files. `DocLink` maps local links to Router links. This removes the old separately maintained HTML documentation shell, duplicated banner changes and two rendering conventions for navigation. The root app still owns the shell.
- The route tree is bounded by application routes, rather than expanding into thousands of authored route modules. MDX provider components (`Callout`, `Tabs`, `BudgetCalculator`) are maintained once and reused by SSR and browser rendering.
- Both models share compilation, highlighting, search, payload format, rendering workers and serving logic. A correction to an application component is made once. These are important AI orientation improvements over the baseline, whose independent maintenance test needed separate HTML/JSX changes.
- The control is genuinely cache aware: per-document content fingerprints, an application fingerprint, search fingerprint, per-route render fingerprints and missing-output checks are visible in `tools/build.ts`. It is no longer reasonable to credit the hybrid with avoiding every Vite build while forcing every control content edit through Vite.

These gains mostly come from the common architecture. The control receives them without Nift.

## Source evidence: complexity that remains

`tools/build.ts` is a 326-line custom build coordinator. Together the nine tool files contain roughly 733 lines at this checkpoint. Counting lines is not a quality metric, but the ownership surface is substantial: source discovery, metadata ordering, compilation batching, dependency planning, application caching, output repair, search indexing, prerendering and worker process failures are application-maintained policy.

Hybrid publication adds `.nift/config.json`, a Nift binary, generated tracked records, generated dependency wrappers, a dirty-status script, compiled staging payloads, Nift state and a template that injects JSON. The control already needs most coordinator stages, but does not need those additional representations. A new agent must know that `hybrid/content/*.html` is generated dependency syntax and that `.cache/hybrid/compiled` is not the served payload directory.

Nift does not compile MDX, own React routes, build the search index or render final HTML here. Its output is JSON subsequently consumed by Start. This is a valid integration, but its narrow role should be explicit in any adoption claim.

## Concrete concerns and recommended follow-up

1. **Cache contracts are bespoke and incomplete.** The render key uses the app fingerprint and document/catalog fingerprint, but does not include `tools/render-worker.ts`. Editing redirect or serialization behavior in that worker can leave existing pages untouched until a forced render. The MDX compiler fingerprint includes its worker and lockfile but not runtime/toolchain environment. Both models inherit these issues. Document the cache contract and add targeted invalidation coverage before treating cached publication as production infrastructure.
2. **Development invalidation differs from production invalidation.** The custom dev watcher reacts only to paths containing `/corpus/`. Editing `tools/compiler-worker.ts` does not itself trigger a content rebuild; an unrelated content edit or restart is needed. Existing content is prebuilt before Vite starts, so first dev startup pays a production publication build. This is simpler to explain than the baseline's dual shell, but is still a custom feedback loop.
3. **Errors have some propagation, but recovery is not established.** Worker failures are surfaced by `run`; dev failures send the accumulated output to Vite's error overlay. The compiler does not wrap errors with the current record's file/slug, so a failing batch can be less actionable than direct framework module compilation. Stages write outputs incrementally rather than atomically publishing a release; this source review does not establish behavior when a later stage fails after earlier files were replaced.
4. **The test script currently promises more than exists.** `bun test tools/*.test.ts` has no matching checked-in tests at this snapshot. Typechecking is useful but does not prove output repair, deletion, watcher restart or cache correctness. The baseline explicitly treated a misleading nominal test command as a resolved defect; do not reintroduce that handoff gap.
5. **MDX has a deliberate execution contract.** `compile(... outputFormat: "function-body")` and `runSync` execute trusted authored JavaScript on server and client. Provider components make this manageable, but arbitrary import-heavy MDX is not demonstrated by these examples, and strict no-eval CSP is explicitly outside the design. Content authors need a supported syntax/component recipe and diagnostics, not just the label “MDX supported.”
6. **Scale is not just route count.** Search downloads and deserializes one full MiniSearch index in the browser. Every planning pass still reads all active source documents and calculates hashes; the hybrid additionally updates/checks metadata and dependency wrappers. Two bounded compiler/render workers are sensible, but no 3,000-document responsiveness or memory conclusion follows from bounded concurrency alone.

## Authored source and generation ownership

The original guides remain in `corpus/original`, with their index translated into the active catalog. `corpus/additions.json` gives maintained extra records an explicit insertion point. Synthetic reference families are generated by service, version and topic with varying bodies, code, tables and interactive components. This is a useful production-shaped workload, not 3,000 independent editorial decisions.

The ownership trap is `corpus/generated`: it is ignored, and the generator preserves an existing file by default, so a hand edit appears to work locally. `--regenerate` overwrites it, and a clean checkout does not preserve that edit. Authoritative additions should live outside that generated tree and be registered in `corpus/additions.json`; changing the synthetic families should change `tools/generate.ts`. The report and README should make this distinction prominent. “Selected authored documents” in generator output blurs it.

The generator's provenance hash describes generator source, not the complete current contents of preserved generated files. Its `generated = count - 62` also counts maintained additions as generated if additions are present. There is no observed problem while additions is empty, but this should be corrected before using the manifest to characterize a maintenance workload. Duplicated slugs and malformed additions also lack explicit validation in the inspected generator.

## Workflow and documentation snapshot

At review time the root README contains only phase checkpoints. It does not yet explain installation, the external Nift prerequisite, scale selection, commands/ports, output ownership, additions, provider components, forced rebuild flags or error recovery. Parent documentation work is concurrent, so these are snapshot gaps rather than claims about the final handoff. A good handoff should distinguish ordinary cached publication, `--all`, `--fresh`, `--content-only`, and the `build:native` comparison, and explain why dev startup first publishes content.

The preserved baseline's successful fresh-context maintenance result remains evidence about that baseline only. This architecture looks easier for an agent to navigate at the presentation layer; it has not yet earned an equivalent hands-on result. A new worker should be asked to add a maintained MDX page and a component use, locate generated boundaries, diagnose a navigation issue and verify both model outputs. This reviewer did not perform that test.

## Comparison fairness

The normal hybrid and cache-aware control share the consequential optimizations and two-worker SSR policy. That is a strong improvement in experimental fairness. Report both full publication and isolated stage costs, and distinguish native Start prerendering (`--native`, configured concurrency four) from the cache-aware control; the native option is not the same bounded custom renderer workload.

The notes correctly reject the first 500-page prototype timings because hybrid reused artifacts while control started fresh. Require matched fresh/warm states for later numbers. Full corpus hashing and global search rebuilding after a content edit belong in end-to-end timing even if only one document is compiled. Any new speed claim should identify whether it measures compilation, Nift publication, final static publication or development reload.

## Runtime evidence and limits

I ran `bun run check` successfully against the inspected Phase 2 sources, including tools and application configuration. This establishes TypeScript consistency only. I did not run a build, alter content, open the application, inject failures, benchmark or execute the maintenance test. All state preservation, hydration, reload, deletion/repair and large-scale browser conclusions above are source deductions or explicitly outstanding checks, not observed runtime outcomes.

## Adoption assessment

The new design substantially improves integrated documentation DX for **both** models and addresses the baseline's strongest shell-composition criticism. It does not yet reverse the default adoption judgment in favor of Nift. For a team already investing in native Nift dependencies, the hybrid is now a plausible small adapter boundary around document payloads. For a greenfield TanStack team, the cache-aware control gives the same maintained React/MDX experience with fewer tool-specific concepts. Reconsider only after matched scale evidence, an honest ownership handoff, targeted lifecycle/invalidation checks and the independent maintenance test demonstrate an incremental benefit worth maintaining.
