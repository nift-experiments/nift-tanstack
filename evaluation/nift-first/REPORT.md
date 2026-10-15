# Third architecture: Nift-first + TanStack islands

**For this documentation-heavy static portal, I would choose the Nift-first configuration. For a full-stack application requiring one Router/SSR/server-function lifecycle, I would still choose the optimized TanStack-only implementation.** The integrated Nift + Start branch remains a valid integration, but its planner does not establish a payoff over the optimized control.

The attached review correctly distinguished static-first islands from the completed single-Start-application experiment. Phase 2 followed the earlier requirement for one genuine Router across docs/app; it did not test Nift-first islands. Its conclusion remains valid within that scope. One diagram correction: the integrated hybrid publishes compiled payload JSON through Nift **before** Start SSR; Nift does not render those complete pages afterward.

## Comparable observations, different architectural contracts

All use the same 3,000 source documents, including the original 62 guides and 979 MDX sources, on the same host/tool versions and Linux observer convention. Primary numbers are one serialized observation per case, not medians or statistical distributions. Phase 2 observations are retained unchanged; they were captured earlier, not interleaved with the new run. Browser and maintenance checks were not active during timed commands; the static preview could remain idle outside the measured descendant tree.

Cells are **wall seconds / max individual process RSS MiB / sampled simultaneous descendant-tree RSS MiB**.

| Scenario | Integrated Nift + Start | Optimized TanStack-only | Nift-first islands |
|---|---:|---:|---:|
| fresh | 25.203s / 341.5 / 389.0 | 23.115s / 356.5 / 402.7 | 16.119s / 188.7 / 276.3 |
| warm-full | 8.590s / 163.6 / 271.6 | 7.304s / 176.2 / 271.7 | 2.455s / 142.8 / 183.2 |
| unchanged | 0.859s / 58.8 / 104.7 | 0.168s / 61.9 / 86.6 | 1.150s / 69.9 / 139.0 |
| docs-edit | 1.760s / 164.4 / 206.1 | 1.116s / 158.2 / 199.5 | 2.069s / 143.3 / 183.0 |
| shared-layout | 8.921s / 335.8 / 384.1 | 8.160s / 330.3 / 375.8 | 1.770s / 70.6 / 91.0 |

Fresh removes this configuration's compiled content, frontend bundle, HTML and native receipts before rebuilding. Dependencies and selected deterministic source corpus are retained; this is not cold OS cache. Warm full regenerates all HTML and search while reusing valid compilation/bundles, just as defined for both references. Nift-first publishes 3,089 HTML entry pages, including 87 workspace routes and the added explorer, versus the references' 3,002 static pages plus Start runtime app routes. The extras are small static app entry wrappers, not 87 prerendered React dashboards.

The fresh run is about 30% faster than the optimized control, with about 31% lower sampled tree RSS. Warm publication is about three times faster. These are useful architectural observations, not proof of a unique Nift advantage over all static generators. **Docs edits and unchanged builds remain slower than the optimized control.** Do not bury that weakness. The new configuration's preparation and native dependency passes still walk the corpus; a source edit also rebuilds the global search index.

The additional native Start prerender reference remains 26.93s / 613.7 MiB tree RSS at 3,000 documents, but the better optimized control is the primary comparison. Do not substitute the slower reference to inflate a win.

## New configuration detail

| Scenario | Wall / individual / tree | Compiled docs | Vite ran? | Search ran? | Nift HTML outputs rebuilt |
|---|---:|---:|---|---|---:|
| fresh | 16.119s / 188.7 / 276.3 | 3000 | True | True | 3089 |
| warm-full | 2.455s / 142.8 / 183.2 | 0 | False | True | 3089 |
| unchanged | 1.150s / 69.9 / 139.0 | 0 | False | False | 0 |
| docs-edit | 2.069s / 143.3 / 183.0 | 1 | False | True | 1 |
| mdx-edit | 2.030s / 150.5 / 189.0 | 1 | False | True | 1 |
| shared-layout | 1.770s / 70.6 / 91.0 | 0 | False | False | 3089 |
| shared-style | 1.889s / 69.7 / 90.4 | 0 | False | False | 3089 |
| shared-css | 1.317s / 90.7 / 99.4 | 0 | False | False | 0 |
| frontend-island | 2.427s / 205.3 / 249.7 | 0 | True | False | 0 |

`shared-style` changes a style in the common HTML template and fans out to all pages. `shared-css` changes the actual shared stylesheet bytes, then restores them; it republishes the CSS without Vite/MDX/HTML regeneration. `frontend-island` changes the calculator's output wording: Vite publishes changed bundle bytes; stable entry URLs allow HTML reuse. This is not exactly the same mutation as Phase 2's app-component case, so it is a diagnostic rather than a strict matched component-speedup ratio. Likewise, a Nift header edit and a React root-layout edit have equivalent site-wide purpose but different implementation boundaries.

| Scenario | Planning/cache | MD/MDX compilation + static MDX rendering | Bundle/assets | Search | Recipe/body preparation | Native Nift composition |
|---|---:|---:|---:|---:|---:|---:|
| fresh | 0.763s | 11.990s | 0.710s | 0.789s | 0.799s | 1.043s |
| warm-full | 0.176s | 0.001s | 0.007s | 0.873s | 0.549s | 0.827s |
| unchanged | 0.172s | 0.000s | 0.005s | 0.004s | 0.466s | 0.475s |
| docs-edit | 0.152s | 0.127s | 0.006s | 0.845s | 0.437s | 0.478s |
| shared-layout | 0.163s | 0.000s | 0.006s | 0.005s | 0.412s | 1.157s |
| frontend-island | 0.143s | 0.000s | 1.331s | 0.005s | 0.454s | 0.469s |

Timers are internal wall intervals; the outer command includes startup/unclassified work. The bundle/assets interval also checks/copies static outputs when Vite is skipped; it does not imply bundling ran. The compilation timer includes Markdown parsing, highlighting and MDX compilation/static React rendering; no separate highlighter measurement is claimed. These are **not native `@markup` timings**. MDX remains the largest fresh-build cost; the islands design does not make 979 MDX sources free.

## Actual browser JavaScript delivery

Cold document navigations through separate localhost diagnostic ports recorded actual script response-body bytes. `Cache-Control: no-store` prevented cross-page HTTP cache reuse. Responses are uncompressed, exclude HTTP/TLS overhead, and include neither a Web Vitals claim nor an internet latency model. Inline executable script bytes are separately counted from the corresponding publication HTML. Captured paths/status/bytes are retained in `network-*.jsonl` and `javascript.json`.

| Page | Integrated hybrid external JS | Optimized control external JS | Nift-first external JS |
|---|---:|---:|---:|
| Ordinary Workspace setup guide | 395,711 B | 395,711 B | **746 B** |
| Interactive Capacity drills MDX guide | 395,711 B | 395,711 B | **221,084 B** |

Including inline scripts, the references deliver 404,056 B for the ordinary guide and 405,272 B for the MDX guide. Nift-first has no executable inline scripts on those pages, so its totals are unchanged. React still accounts for most of the interactive MDX page's script payload. Search's own JS loads on the index, and the workspace/explorer have their own entries.

**Total published JS is not smaller:** references 419,381 B each; Nift-first 466,002 B. The static configuration includes an additional Query/Table/Virtual/Form explorer. Selective delivery, not a claim that its whole asset directory is smaller, is the important result. Estimated sum of separately gzipped assets is retained in `javascript.json`; it is not measured transfer. The capture script paths/lengths were checked against the final restored bundles; explorer-only form changes do not change the sampled docs scripts.

## What owns what

```text
Nift-first static website
  maintained Markdown → standard Markdown/GFM/highlight processor → HTML body data
  maintained MDX → official MDX compiler + static React render → HTML + island props
  body chunks + checked @path references + shared Nift templates → static publication
  selected mount points → React islands
    Query + Table + Virtual + Form → API explorer
    Router + Query → embedded operations workspace
```

Nift owns the document shell, page generation, native HTML dependency composition and static publication. The explicit external renderer owns Markdown/MDX transformations. It hashes the shared canonical corpus outside the nested native root; Nift tracks the generated body/recipe inputs inside its root. Bodies use strict `@json` data chunks, so literal template syntax stays data; internal URLs use checked `@path`, including images and compiled scripts/styles. There is no repeated complete React shell per article.

Plain Markdown is authored without React knowledge and ships no React. Static callouts/topology render without client components. Tabs/calculators retain their behavior and receive only local mounts. React `createRoot` replaces the prepared fallback inside each island; there is **no whole-document React hydration**. Trusted MDX evaluation occurs at build time, not in ordinary article browsers. Unknown MDX components/imports beyond the pinned corpus are not certified.

The embedded Router reuses the original Dashboard, deployment filtering/sorting/pagination/details, incidents, services, capacity and settings views. Query fetches identical fixture data from a static same-origin JSON API. The added explorer genuinely uses Query for loading, Table row models for filtering/sorting, Virtual to bound a 3,000-record catalog's DOM, and Form for validation/local submission. It is not a list of installed-but-unused libraries.

## Capability differences and parity evidence

- Docs↔docs and docs↔app are document navigations. Router navigation stays client-side inside `/app`. React memory/query context resets across the document boundary. The session note persists via explicit `sessionStorage`, not a claim of one shared React root.
- Workspace initial views are client-rendered and require JavaScript. Start SSR/server functions, authenticated backend persistence and server-function semantics are not supplied by the fixture JSON substitution. A real application with those requirements needs a separately specified service or Start; this result does not prove Start can be replaced generically.
- Static docs, headings/anchors, tables, highlighted code, source corpus, navigation and search are retained. Automated checks compare all 3,000 docs' heading/anchor/table/code surfaces and exact search bytes against the unchanged control. Every static local href/src target resolves. Full HTML is intentionally different, not byte-parity certified. There are 1,958 local island mounts.
- Browser checks exercise authored/generated MDX tabs/calculator, search, fixture dashboard, deployment filtering/detail, capacity arithmetic, persisted settings, Router transitions inside the workspace, full document boundaries and explorer filter/sort/virtual scroll/Form behavior. The explorer showed 184 payment references with only 16 mounted rows after scrolling, not all rows materialized. Browser warnings/errors in the saved check are empty. No mobile certification is claimed.
- Typechecking and 13 real integration assertions cover preserved-mtime edits, one-page rebuild without Vite, literal `@path(...)`/`@input(...)`/`$[...]`, missing asset build failure with successful-manifest preservation, retry and missing output recovery. Existing corrupted artifacts and atomic whole-directory deployment are not universally handled; fresh rebuild remains the repair path.

## Profiling and corrections retained

The first implementation measured 14.50s fresh / 279 MiB tree, but warm tree RSS reached about 404 MiB and a docs edit took 2.23s. Search indexing retained its heap in the coordinator and native status/build traversed the graph twice. Moving search to its own worker and using one native build pass improved those cases; both the initial and pre-recovery passes are retained.

A subsequent regression test demonstrated a literal `$[...]` failure and an intermediate-cache restoration bug. The fix uses strict JSON body chunks and a per-intermediate actual input hash. That correctness work adds preparation/validation cost: **the final, slower 16.12s fresh / 2.07s docs-edit numbers are the headline**, not the faster pre-fix pass. A warm reporting-only correction is retained separately; the final forced-full observation reports all 3,089 outputs. No best-of-run cherry-picking or median claim is made.

## DX / AI-DX judgment

| Area | Nift-first judgment | Evidence / limitation |
|---|---:|---|
| Ordinary documentation authoring | 9/10 | Markdown, HTML/CSS templates; no React knowledge for ordinary articles |
| Island addition/maintenance | 7/10 | Clear entry/mount boundary; a new MDX component also needs fallback/provider registration and tests |
| Static layout/styles | 8/10 | One Nift shell; CSS/template changes skip Vite |
| Development workflow | 6/10 | One simple watcher/serve command, serialized builds; manual browser reload, not React HMR |
| Architecture clarity | 8/10 | Static site, local islands and Router workspace have explicit ownership |
| Full-stack capability fit | 5/10 | Deliberately omits Start SSR/server-function lifecycle; not an appropriate drop-in full-stack replacement |
| AI-DX | 8/10 for scoped static/island work | Fresh agent located and fixed Form validation/accessibility from README; parent verified browser behavior |
| Overall for this static portal | 8/10 | Strong delivery/full-publication profile, with slower incremental planning retained |

Scores are subjective category-fit judgments, not comparable timed productivity statistics. Phase 2's original hybrid/control scores remain unchanged. The fresh maintenance exercise changed one explorer source file and ran typecheck plus a library-level smoke test. It did not test adding a new MDX island, deploying, or replacing a backend. Its report records actual path/discovery/tooling friction, not a universal agent productivity claim. Parent browser verification is separately attributed.

## Recommendations by application category

1. **Documentation-heavy/static sites:** prefer Nift-first when document navigation is acceptable and most articles do not need a framework runtime. Its full-build/delivery advantages are material here. Frequent edits still deserve planner/search profiling; the optimized control wins the measured small-update cases.
2. **Mixed static/interactive sites:** prefer Nift-first if interactive regions are bounded and app boundaries are acceptable. Prefer optimized Start when continuous Router state, cross-section data context, SSR or server functions are central. There is no single unconditional winner.
3. **Full-stack applications:** prefer TanStack Start, specifically the optimized control rather than adding Nift merely as a payload planner. Use the single-app hybrid only when an independent native dependency/publication requirement justifies the extra layer; this experiment has not demonstrated that threshold.

The broader complementary proposition is **Nift + appropriate TanStack libraries**, not “Nift makes every TanStack Start app faster.” Keep this third architecture as a useful reference with its capability ledger. It is not an unconditional production-starter endorsement. No Nift core changes, Labs publication, public deployment or maintainer contact occurred.

## Reproduction and future work

See `../../nift-first/README.md`, `results.json`, `observations/`, `parity.json`, `javascript.json`, `MAINTENANCE.md`, and the unchanged Phase 2 reports. All source/reference hashes are retained. The corpus is deterministic fictional/versioned material, not 3,000 individually hand-written production articles.

Memory uses the same Linux all-thread descendant observer, 2 ms target with actual gaps recorded. Tree RSS sums simultaneous descendants, can double-count shared pages, excludes the observer and is neither PSS nor total machine memory. Individual process/phase maxima remain separate. Single samples and implementation-specific tradeoffs do not establish general numerical thresholds.

Future targets: avoid per-command full corpus/body planning; reduce global search rebuilds; package a small island adapter and component/fallback test workflow; improve dev reload/HMR without moving document ownership back into React; certify a real host/base-path/service contract. These are tooling/application targets unless a concrete core reproducer demonstrates otherwise. Do not reopen old migration results or change Nift core as part of this task.

Official API references used during implementation: [Table v8 row models](https://tanstack.com/table/v8/docs/guide/row-models), [React Virtual](https://tanstack.com/virtual/latest/docs/framework/react/react-virtual), [Form quick start](https://tanstack.com/form/latest/docs/framework/react/quick-start). Pinned versions in the isolated package/lock are authoritative; the original configurations' dependency lock is unchanged.
