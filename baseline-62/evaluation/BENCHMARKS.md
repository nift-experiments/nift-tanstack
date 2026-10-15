# Exploratory production publication observations

Two serialized observations per scenario, not a statistical campaign. The second campaign corrected memory sampling; initial raw results are preserved. No cloud or incumbent migration benchmark. Local environment and exact binary provenance: environment.json; exact dependency versions: package.json/bun.lock.

Both complete commands publish one landing + 62 guides and the same interactive Start application. The hybrid static public tree has 65 files (63 HTML + CSS + preferences JS); the control client tree has 77 files, including its hydration/application assets. File-count equality is not claimed: docs runtime capabilities differ.

## Wall time and peak memory

Wall ranges include both exploratory observations. Tree RSS and GNU-time max individual RSS below use the improved second observer only. These columns are different measurements; do not sum individual process peaks.

| Scenario | Hybrid wall range (s) | Control wall range (s) | Hybrid sampled tree peak (MiB) | Control sampled tree peak (MiB) | Hybrid max individual (MiB) | Control max individual (MiB) |
|---|---:|---:|---:|---:|---:|---:|
| Fresh application state | 1.358–1.497 | 1.894–1.921 | 429.3 | 428.6 | 384.9 | 419.2 |
| Warm forced full | 1.460–1.644 | 2.140–2.154 | 425.7 | 424.2 | 380.9 | 414.7 |
| Unchanged production command | 0.037–0.039 | 1.867–1.893 | 43.9 | 427.4 | 28.0 | 417.9 |
| One Markdown edit | 0.047–0.069 | 1.853–2.114 | 44.3 | 436.3 | 27.8 | 426.8 |
| Shared navigation/layout | 1.470–1.500 | 2.029–2.296 | 441.2 | 441.9 | 396.1 | 432.6 |
| React component edit | 1.341–1.633 | 2.042–2.153 | 448.4 | 445.6 | 403.1 | 436.1 |

The improved warm-full pair was **1.460s / 425.7 MiB tree** hybrid and **2.140s / 424.2 MiB tree** control. Full-build aggregate memory is effectively equal here; this is not a memory-win headline. The docs edit was **0.047s / 44.3 MiB tree** versus **1.853s / 436.3 MiB tree**. Absolute native-control production publication is still around two seconds.

## Stage observations, improved campaign

Hybrid coordinator timings exclude outer shell/observer startup; Nift seconds include its command startup. They are not interchangeable with whole-command wall time. Preparation is small but not absent. Node/Vite dominates full/app-edit peaks; Bun dominates the short unchanged/docs-edit aggregate peaks. Individual PID/RSS/comm and sample intervals are retained per observation. No phase-level RSS attribution beyond that process evidence was instrumented.

| Hybrid scenario | Vite ran | Vite seconds | Nift command seconds | Coordinator seconds | Whole observed seconds |
|---|---|---:|---:|---:|---:|
| fresh | True | 1.2842 | 0.0424 | 1.3341 | 1.3577 |
| warm-full | True | 1.3948 | 0.0252 | 1.4296 | 1.4597 |
| unchanged | False | 0.0000 | 0.0137 | 0.0191 | 0.0369 |
| docs-edit | False | 0.0000 | 0.0156 | 0.0229 | 0.0473 |
| shared-layout | True | 1.3889 | 0.0517 | 1.4473 | 1.4700 |
| component-edit | True | 1.2943 | 0.0196 | 1.3200 | 1.3413 |

Control native publication rebuilds client/server and uses Start's prerenderer (four concurrent pages). The control's additional **SSR-only** workload took **1.492–1.851s**, with **410.5 MiB** sampled tree RSS in the second observation. It omits the static publication, so is shown separately rather than substituted into equivalent-publication results. There are no search-index, minification-service, real backend database or external-network phases in either local fixture project.

## Scenario definitions and fairness

- Fresh means derived application/publication/tracking outputs removed, dependencies retained and OS caches uncontrolled. It is not a cold disk/OS benchmark. Hybrid `.nift/config.json` remains maintained source; generated tracking is regenerated.
- Warm full forces both hybrid stages (`build:full`); control executes its normal complete native build. Outputs exist at entry.
- Unchanged uses each documented complete production command. Hybrid skips Vite by its custom fingerprint; native control Vite rebuilds. A generic control wrapper could also skip an unchanged build; this is orchestration value, not an inherent TanStack deficiency.
- Docs edit adds one paragraph to the same maintained Markdown. Shared layout changes the common navigation label, affecting both shells and application; it is not just a cheaper Nift-only template tweak. Component edit changes a shared dashboard heading. Every temporary source mutation is restored and both publications restored before the next scenario.
- Hybrid docs-template-only fan-out was separately verified in incremental-proof.json (all 62 guides, no Vite), but is not substituted for the common shared-layout workload.
- Production publication timings do not measure development HMR. Both development servers preserve table search across React HMR and reload changed Markdown. Native control SSR is a legitimate alternative when static output is unnecessary.

## RSS methodology and correction

`tools/observe.py` invokes GNU `/usr/bin/time -v` for max individual process RSS and independently samples the simultaneously live descendant process RSS sum. Observer memory is excluded; the timed command wrappers and all discovered descendants are included. Linux RSS sums double-count shared mappings and are not unique physical allocation/PSS. Sampling can miss brief peaks. These exploratory observations have no confidence interval or causal memory claim.

The first sampler scanned all system `/proc` entries with a 20ms target; observed gaps reached roughly 60ms. It captured only one/two samples for the shortest hybrid paths and reported about 9 MiB tree RSS, below their individually reported ~28 MiB peak. Those aggregate readings are explicitly rejected as peak evidence, not hidden. Initial logs/JSON remain in observations-initial and benchmark-results-initial.json.

The improved sampler traverses kernel child lists for **every runtime thread**, avoiding the process-leader-only child omission, with a 2ms target. It captured 14 samples for unchanged and 19 for the docs edit; max observed gaps were about 3.8ms there, up to 9.5ms on longer builds. These observed tree peaks (~44 MiB) are credible samples, still not mathematically guaranteed maxima. Raw per-command JSON/time/log and sampling method are under observations. Both campaigns were serialized and experiment dev/production servers stopped; unrelated system work and machine-wide noise were not controlled.

## Reproducibility

Source-only copy `/tmp/pulseops-clean-source-20261015` built both applications with a frozen lockfile and no inherited generated tracking/dist/public. Hybrid 65-file public output was byte-identical. Control's 77-file client output had identical asset bytes and HTML equivalent after normalizing only 13-digit Router success-match update timestamps. The exact normalization and differences are in clean-source-proof.json; arbitrary content differences were not normalized. Its relocated dist-only documentation handler returned 200 without source corpus files (artifact-portability.json).

These results justify fast independent docs publication as a real contribution. They do not establish that adding a second build system is worthwhile for every 62-guide application.
