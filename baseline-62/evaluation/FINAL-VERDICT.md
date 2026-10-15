# Final verdict: conditional compatibility, not a default greenfield recommendation

**For this particular portal, starting again I would choose TanStack Start alone.** Nift + TanStack works and its static content iteration is excellent, but the roughly two-second native control publication is already comfortable. The additional synchronization, cache, watch, shell and hosting responsibilities are not free.

## Eight explicit answers

1. **Does it work naturally?** At the static docs/application boundary, yes. At a single seamless shared application shell, only partly. This is a useful composition of publishing responsibilities, not a unified framework.
2. **What does Nift contribute?** Standalone Markdown/template publication, native page dependencies and @path links, very cheap selective content rebuilds and docs-template fan-out without compiling the React application.
3. **What does TanStack contribute?** The actual interactive app: file routes, client navigation, SSR, server functions, per-request Query integration/data hydration and Vite/React development. Those remain native rather than being reconstructed by Nift.
4. **Where is it forced?** Shared HTML/JSX shell/landing edits, custom development and serving dispatch, manual stage invalidation policy, separate artifacts and document-state boundaries. The independent worker encountered these costs even with a good README.
5. **Would I choose it?** Not for this small primarily interactive greenfield portal. Conditionally for a team already using Nift or explicitly wanting documentation to publish/deploy independently as hydration-free HTML, with content updates substantially outnumbering app changes and clear acceptance of full-page cross-boundary navigation.
6. **Who benefits most?** Editorial/static-heavy hybrid sites with a stable interactive application and separate static publishing needs. Sixty docs alone does not establish a scale threshold; this experiment cannot quantify when added integration pays back. App-dominant projects with frequent shared-shell changes gain less.
7. **What would improve it most?** A supported normal-init integration recipe, tested lifecycle/output manifest, declared environment/toolchain invalidation and clearer managed-path/generated-source guidance. These would improve DX more than shaving milliseconds from native composition.
8. **Is it mature enough to recommend?** As an explicit architecture pattern for experienced teams: conditionally. As a turnkey default recommendation to TanStack developers: no. The local app is working and reproducible; production hosting, arbitrary base paths, MDX and a reusable integration contract remain uncertified.

## Evidence behind the judgment

Both applications implement 62 guides and the same real fixture app. Three independent skeptical source reviews and a separate fresh-context hands-on maintenance test were completed. The worker succeeded and parent browser checks verified its feature; that is positive AI-DX evidence, not proof the extra integration has no cost.

Two lightweight serialized observations per workload are retained, with the original undersampling issue explained. Full-build aggregate RSS was essentially equal around 425 MiB in the better-sampled warm-full pair. Hybrid full publication was faster, docs edits dramatically cheaper, and unchanged publication very cheap. Control SSR-only output was as fast as hybrid full, but does not include the comparable static publication. Production rebuilds are not a claim about dev-server HMR performance.

No-op savings partly come from the custom coordinator skipping Vite. A generic whole-project cache can also be placed around a control build; this is not an intrinsic TanStack inability to skip unchanged work. Native Nift page-level invalidation and independent content ownership are the more distinctive result.

Scored assessment: overall developer value **6/10 hybrid**, **8/10 Start alone** for this application. See DX-REVIEW.md for every category, deductions and proposed improvements; BENCHMARKS.md for measurements and definitions. Scores are judgments, not empirical confidence intervals.

## Status

Private local experiment complete. No remote repository was created, no push/publication/outreach occurred, and Nift core, Agora and Labs were not modified. Working local commands are in README. Retain failures, reviews and limitations as inputs to future integration work; do not treat a conditional result as a failed implementation or a universal endorsement.
