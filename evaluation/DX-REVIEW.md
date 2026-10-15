# Phase 2 developer-experience review

Scores are subjective engineering judgments on a 10-point scale, not timed user-study results. The original hybrid/control overall assessments remain 6/10 and 8/10 in the preserved baseline. Phase 2 has one shared app, so many ordinary editing scores are equal.

| Area | Hybrid | Optimized control | Evidence/reason |
|---|---:|---:|---|
| Setup | 6 | 7 | Same pinned Bun/Node installation; hybrid additionally requires Nift, recipes and native metadata |
| Daily development | 8 | 8 | One dev command, React HMR, live MDX refresh and normal Router transitions |
| Debugging/invalidation | 6 | 7 | Both own project-scoped keys; hybrid adds native status and a second publication graph |
| Compatibility | 8 | 8 | Genuine Start/Router/Query/React, official MDX compiler; same trusted-code/CSP restrictions |
| Integration simplicity | 6 | 7 | One shell fixes Phase 1; optional Nift layer remains extra ownership |
| Documentation editing | 8 | 8 | Authored additions, frontmatter/metadata, shared provider components and derived search |
| Interactive development | 9 | 9 | Same React routes, server functions, query data, filters/settings/MDX controls |
| Incremental publication | 7 | 8 | Both skip Vite after docs edit; optimized control has less planning overhead |
| Production readiness | 7 | 8 | Functional localhost packaging; deployment/auth/external persistence not certified, custom cache recovery bounded |
| Long-term maintenance | 7 | 8 | Clear maintained/generated boundary; native layer adds another tool/language without demonstrated payoff here |
| AI-DX | 7 | 8 | Fresh maintenance succeeded in one shared app; adapter-repair productivity not studied |
| Overall | 6 | 8 | Cohesion improved, but measured advantage does not justify the additional dependency graph |

Compared with Phase 1, the hybrid AI-DX increases from 6 to 7 because docs/app shell coordination has disappeared. Overall remains 6 because the primary control now obtains the same isolation and better timings with fewer layers. These scores do not imply that the implementation regressed: the alternative improved too.

Three independent review snapshots and appended verification notes are retained as `review-phase2-{tanstack,nift,dx}.md`. They were source reviews, with parent runtime evidence explicitly attributed. The independent maintenance report records successful changes and actual mistakes. Browser evidence covers hydration, two-way Router continuity with in-memory state, MDX tabs/calculator, app controls and search. Dev checks cover HMR and successive MDX updates for both models. Typechecking, payload/SSR/search/assets parity and failure-retry integration assertions supplement those interactions.

Remaining friction: whole-index search rebuild/load; broad shared/app HTML invalidation; project-specific stage/cache contracts; non-atomic publication and incomplete corrupted-existing-output detection; some retired intermediates retained; trusted runtime MDX evaluation and no arbitrary import/no-eval CSP certification; platform adapter requirements. These originate mainly in this integration, rather than proving a Nift core or TanStack limitation. See NIFT-IMPROVEMENTS.md for future scoped proposals, with no core changes made.
