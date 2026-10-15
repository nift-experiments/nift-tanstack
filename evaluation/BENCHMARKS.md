# Phase 2 measurements

These are **single serialized observations**, not medians, confidence intervals or final migration benchmarks. Each cell reports **wall seconds / maximum individual process RSS MiB / sampled simultaneous descendant-tree RSS MiB**. Raw commands, phase times, dominant process, sample count and actual maximum sampling gap are in [results-phase2.json](results-phase2.json) and [raw observations](observations-phase2/).

`fresh` removes the model's compiled content, application, cache and publication artifacts before rebuilding from maintained inputs; installed dependencies and the selected deterministic authored corpus are retained. It is fresh application state, not a cold OS/filesystem cache. `warm-full` forces every required static HTML page and search index to regenerate, reusing valid app and compiled MDX artifacts in **both** models. `unchanged` is the ordinary production command. A docs edit changes one original Markdown guide, then restores it outside the timed command. No server or other benchmark runs concurrently.

## Scale matrix

| Documents | Scenario | Nift + TanStack | Optimized TanStack-only |
|---:|---|---:|---:|
| 62 | fresh | 2.481s / 336.2 / 376.2 | 2.385s / 345.8 / 383.8 |
| 62 | warm-full | 0.402s / 97.5 / 130.2 | 0.330s / 97.5 / 127.8 |
| 62 | unchanged | 0.073s / 32.3 / 60.0 | 0.052s / 30.5 / 54.4 |
| 62 | docs-edit | 0.325s / 65.7 / 97.1 | 0.278s / 67.3 / 95.0 |
| 500 | fresh | 5.335s / 340.8 / 384.0 | 5.188s / 342.9 / 385.2 |
| 500 | warm-full | 1.375s / 113.4 / 254.7 | 1.206s / 114.0 / 251.6 |
| 500 | unchanged | 0.204s / 48.4 / 79.8 | 0.073s / 38.5 / 73.3 |
| 500 | docs-edit | 0.526s / 65.1 / 102.9 | 0.388s / 67.4 / 103.1 |
| 1,500 | fresh | 12.150s / 353.0 / 399.2 | 12.287s / 354.2 / 398.2 |
| 1,500 | warm-full | 4.602s / 117.0 / 266.8 | 4.196s / 116.9 / 265.7 |
| 1,500 | unchanged | 0.488s / 59.7 / 88.9 | 0.094s / 58.5 / 79.6 |
| 1,500 | docs-edit | 1.266s / 104.8 / 144.1 | 0.698s / 113.9 / 152.3 |
| 3,000 | fresh | 25.203s / 341.5 / 389.0 | 23.115s / 356.5 / 402.7 |
| 3,000 | warm-full | 8.590s / 163.6 / 271.6 | 7.304s / 176.2 / 271.7 |
| 3,000 | unchanged | 0.859s / 58.8 / 104.7 | 0.168s / 61.9 / 86.6 |
| 3,000 | docs-edit | 1.760s / 164.4 / 206.1 | 1.116s / 158.2 / 199.5 |

## Shared/application edits at 3,000 documents

| Scenario | Nift + TanStack | Optimized TanStack-only |
|---|---:|---:|
| shared-layout | 8.921s / 335.8 / 384.1 | 8.160s / 330.3 / 375.8 |
| mdx-component | 9.143s / 336.6 / 385.2 | 8.151s / 333.6 / 379.1 |
| navigation | 9.176s / 338.3 / 386.6 | 8.435s / 337.6 / 383.5 |
| styling | 8.978s / 335.5 / 383.0 | 8.161s / 334.5 / 379.7 |
| app-component | 8.951s / 338.9 / 386.8 | 8.261s / 340.8 / 386.4 |

Each shared/app case rebuilds Vite, reuses all 3,000 compiled documents and the valid search index, and republishes 3,002 static pages (documents plus landing/docs index). This conservative fan-out remains a limitation, including an app-only component edit. A docs edit compiles one document, skips Vite, rebuilds the shared search index and renders one route. Unchanged commands compile/render nothing and skip search/Vite. There is no separate backend bundle in this application; Start server functions belong to the app bundle, so no independent backend-only timing is claimed.

## Component costs at 3,000 documents

Seconds measured inside each command; command wall time also includes startup and work outside the named timers. Do not sum RSS across phases or treat timer subtraction as a separately measured process.

| Scenario/model | Plan | MDX/highlight | Nift publication | App bundle | Search | SSR | Command wall |
|---|---:|---:|---:|---:|---:|---:|---:|
| fresh/hybrid | 1.012 | 14.339 | 0.659 | 1.695 | 0.818 | 6.464 | 25.203 |
| fresh/control | 0.193 | 13.492 | — | 1.610 | 0.791 | 6.844 | 23.115 |
| warm-full/hybrid | 0.801 | 0.000 | 0.433 | 0.000 | 0.806 | 6.447 | 8.590 |
| warm-full/control | 0.073 | 0.000 | — | 0.000 | 0.766 | 6.399 | 7.304 |
| unchanged/hybrid | 0.549 | 0.000 | 0.233 | 0.000 | 0.001 | 0.018 | 0.859 |
| unchanged/control | 0.085 | 0.000 | — | 0.000 | 0.001 | 0.022 | 0.168 |
| docs-edit/hybrid | 0.543 | 0.099 | 0.188 | 0.000 | 0.750 | 0.125 | 1.760 |
| docs-edit/control | 0.068 | 0.100 | — | 0.000 | 0.771 | 0.126 | 1.116 |
| shared-layout/hybrid | 0.526 | 0.000 | 0.211 | 1.760 | 0.003 | 6.367 | 8.921 |
| shared-layout/control | 0.080 | 0.000 | — | 1.769 | 0.003 | 6.253 | 8.160 |
| app-component/hybrid | 0.542 | 0.000 | 0.239 | 1.814 | 0.003 | 6.293 | 8.951 |
| app-component/control | 0.073 | 0.000 | — | 1.820 | 0.003 | 6.306 | 8.261 |

The compiler phase includes standard MDX/GFM/highlighting together; this experiment does not separately instrument syntax-highlighter time. Native Nift publishes compiled JSON payloads rather than composing a second HTML shell. These are not native `@markup` timings. Planning still walks/hashes the corpus; Nift adds wrapper/metadata checks, native status and publication. This fixed/linear planning cost is visible in unchanged and docs-edit results.

## Native Start prerender reference

The additional `control --fresh --native` uses built-in Start prerender with concurrency four and the same content compiler. It is **not** substituted for the better engineered primary control.

| Documents | Native Start reference |
|---:|---:|
| 62 | 2.865s / 387.0 / 425.0 |
| 3000 | 26.934s / 567.7 / 613.7 |

The optimized control's bounded SSR improves time/memory relative to that reference at 3,000 documents. The same improvement is available without Nift. The small fresh RSS difference between the primary models does not establish a meaningful Nift-specific memory reduction.

## Method and retained corrections

Linux `/proc` observer traverses kernel children across all threads and samples descendant RSS with a target 2 ms interval. Actual intervals vary; each record includes the largest observed gap. Tree RSS sums simultaneously resident descendant processes, excludes the observer, and can double-count shared pages. It is neither PSS nor total machine memory; short peaks can be missed. GNU time's maximum individual-process/phase RSS is separately retained and must not be called aggregate memory. Peaks generally occur in Vite for fresh/shared builds, SSR workers for warm full, and search indexing for large docs edits; consult the per-record dominant command.

Pinned versions/host are in [environment-phase2.json](environment-phase2.json). The corpus is generated fictional/versioned documentation, not an independently sampled production corpus. Its source inventory is recorded separately. No statistical or universal performance claim follows from one run per case.

A pilot stopped at a generated paragraph beginning `export`, which MDX correctly parsed as module syntax. The generator was corrected and all primary scales rerun; pilot records remain in `pilot-phase2/`. Initial warm commands unnecessarily forced Nift to republish valid JSON payloads. After correcting that policy, only the eight affected warm observations were rerun with `tools/warm-recheck.py`; prior observations remain in `warm-payload-force/`. Primary fresh/unchanged/edit observations are unchanged. A final search retry fix moves the successful key write after output copy; it changes failure handling, not the successful work selected by the measured commands. Follow-up integration checks cover it; the old timings are not silently presented as a new campaign.

## Judgment

No Nift adoption threshold is demonstrated through 3,000 documents. Both models achieve low memory and isolated content updates; the optimized control is faster in the matched primary observations. The deeper single-Router architecture is a real improvement over Phase 1, but its strongest performance benefits are generic compiler/bundle/cache separation rather than intrinsic Nift gains. Phase 1 used different publication policies and is not a matched before/after speedup experiment.
