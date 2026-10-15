# Phase 2 verdict: architecture improved; Nift adoption threshold not demonstrated

**I would choose the cache-aware TanStack-only implementation for this project.** The deeper integration is substantially better than Phase 1's split-shell design, but its most valuable improvements—external compiled MDX, bounded workers, stable app bundles, stage caches and one Router—also work in the control.

This is a useful negative/conditional engineering result, not a failed implementation. Both architectures function at 3,000 documents with genuine hydration, client transitions, MDX controls, search and the same interactive application. Nift adds native dependency selection and payload publication; the measured flat-corpus workload does not show that those extra responsibilities pay for themselves.

## Explicit answers

1. **Would I choose Nift + TanStack for the larger project?** No, given the measured equivalent optimized control. Existing Nift users or projects needing a richer native dependency graph may have different reasons, but this experiment does not establish a performance threshold for them.
2. **Does this differ from the original 62-page conclusion?** The source-model architecture is better, but the recommendation remains control-first. Preserve the original conclusion and measurements; Phase 2 does not retroactively rewrite them.
3. **Are full-build improvements substantial?** Not relative to the optimized control. The scale matrix distinguishes all-work fresh builds from warm publication that reuses valid compilation. Do not compare Phase 1's forced app recompilation directly with Phase 2's cached warm command as though they were the same workload.
4. **Is peak RSS meaningfully lower?** No reliable Nift-specific reduction was established. Both optimized pipelines bound memory similarly. A separate native prerender reference uses more memory, but bounded rendering also helps the non-Nift control.
5. **Are incremental builds better enough to matter?** Both avoid Vite for ordinary docs edits and render the changed route. The optimized control is also cheap; Nift is not uniquely responsible for that benefit. Whole-index search and native graph/planning costs remain visible.
6. **Did DX/AI-DX improve?** Yes structurally: one shell, one route/view change and provider-component ownership. The independent maintenance worker succeeded without duplicate templates. This improvement applies to both models, not a quantified productivity win for Nift.
7. **Natural or forced?** Start plus externally compiled content is coherent. Nift as an optional dependency engine is workable, but its additional recipe/publication layer is not compelling for this flat workload when a small content fingerprint planner suffices.
8. **Recommend to experienced TanStack developers?** Recommend the content/app separation pattern conditionally; do not recommend adding Nift by default on this evidence. Retain trusted-code/CSP and custom-hosting/cache qualifications.
9. **What before broader recommendation?** A supported small adapter, clearer native data-stage guidance, fewer duplicate planning passes, tested stage/version/transaction APIs and real deployment certification. Core changes were not made and are not automatically required.

## Adoption threshold

No numeric threshold was found through 3,000 documents. Page count alone did not create a Nift-specific win. Workload mix matters: frequent content edits benefit from compilation separation, while shared/app changes still have broad publication fan-out. In this experiment both models obtain those benefits. Inventing a larger threshold would go beyond the data.

## Repository recommendation

Keep the repository as an engineering/reproducibility record for now. Do not promote it as a proven Nift performance reference or turnkey starter. Whether to retain, promote, archive or delete it is the user's later decision; nothing was archived/deleted as part of this task. No Labs report, public site deployment, announcement or outreach occurred. Agora and other accepted experiments remain untouched and are not reinterpreted by this greenfield result.

See BENCHMARKS.md for observations and qualifications, DX-REVIEW.md for scores, original independent review snapshots and their appended final dispositions, and NIFT-IMPROVEMENTS.md for scoped future work.
