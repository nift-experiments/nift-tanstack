# Phase 2 fresh-context maintenance exercise

Instrumented start: 2026-10-15 01:38:04 UTC (clock tool, before source inspection).
Instrumented implementation/check completion: 2026-10-15 01:40:36 UTC (clock tool).
Elapsed implementation/check window: 152 seconds. This is one local exercise, not a comparative maintenance benchmark. Report recording followed these checks.

## Discovery and diagnosis

Read the project README, package scripts and additions metadata before inspecting implementation. The README identifies authored inputs, disposable generated inputs, the shared Router tree, shared React/MDX components and shared Query fixtures. There were no applicable project AGENTS files discovered. Existing unrelated parent changes were left untouched.

Inspected `shared/site.json`, `shared/Portal.tsx`, `shared/data.ts`, `shared/DocComponents.tsx`, the root route and Settings/Services routes. Settings navigation used `/app/setting`; the real file route is `/app/settings`. Fixed the maintained navigation metadata. Diagnosis was complete before reading `evaluation/maintenance-seed.json`, which subsequently confirmed the singular-route defect. No seed implementation guidance was used for discovery.

## Maintained changes

- Registered two hand-written documents in `corpus/additions.json`, with sources in `corpus/authored/reliability-advanced/`. Added the maintained section title in shared site metadata.
- The MDX capacity-drill guide uses existing Tabs and BudgetCalculator components, a warning Callout and the new ServiceTopology component. The second Markdown guide gives recovery evidence procedures and links back to the drill and workspace.
- Callout accepts optional `note`, `warning` or `critical` tone, defaults to note and exposes the tone in visible text and its accessible label. Styling supports both existing themes; severity is not conveyed only by color. Static authored callouts do not force live alert announcements.
- Added a small maintained SVG under `shared/assets/` and a reusable React component importing it with Vite `?url`, complete with alternative text and caption. Both builds inline the small SVG as a data URL through ordinary Vite processing.
- Added `/app/capacity`, its loader and shared data view. It reuses `portalQuery`, filters by environment and compares every service's deployment count, total execution seconds, mean, budget utilization and signed headroom. A labeled 100–5,000 second slider changes the threshold and live review count. The view and docs explicitly identify historical duration as a planning proxy, not measured infrastructure utilization.
- The shared documentation index now resolves maintained section display titles from site metadata, falling back to catalog titles. This makes the added section readable without changing the generator.

All functionality uses one shared Start/Router application. No duplicate shell, model-specific UI, generator, build orchestration, core or baseline sources were edited by this exercise.

## Actual mistakes and recovery

1. The initial capacity-to-guide Link used a literal document URL. Both bundler builds accepted it, but `bun run check` rejected it against the typed splat route. Changed it to `/docs/$` with `_splat` parameters. Type checking then passed.
2. The first emitted-HTML assertion expected contiguous warning text. React inserts SSR comment delimiters between text nodes; the assertion was corrected to remove comments before matching. This was a check error, not an application defect.
3. Emitted-page verification revealed the new section heading was the raw slug despite maintained site metadata. The catalog's section title did not use that metadata. Fixed the shared index's display lookup, then rebuilt both models and repeated assertions successfully.

## Checks and limits

`bun run corpus 500` passed after additions metadata, selecting 500 documents including 146 MDX. Initial builds compiled four dirty records in each model (the shared workspace already contained unrelated dirty generated inputs); no claim is made that all four arose from these two additions. Final builds compiled zero documents and regenerated 502 HTML pages from the final shared app state:

| Check | Result |
| --- | --- |
| Final hybrid build | Passed, 2.831 s reported total |
| Final control build | Passed, 2.760 s reported total |
| Final `bun run check` | Passed |
| Both emitted guide pages | Titles and content present |
| MDX SSR markup | Warning tone, calculator and tablist present |
| Shared SVG processing | Imported SVG data URL and accessible description present in both models |
| Docs index | Advanced reliability title present in both models |
| Settings navigation | Correct plural route present in both emitted guides |

Independent fixture arithmetic confirmed all-environment execution totals of gateway 2,344, identity 2,376, notifications 2,440, payments 2,472 and search 2,408 seconds. For production at a 1,000-second budget only notifications exceeds budget (1,075 seconds); at 100 seconds all five exceed it. These provide concrete browser-check expectations, not a claim of browser verification.

No server was started/restarted, no long scale campaign or integration suite was run, and nothing was pushed or committed. The parent is responsible for live browser interaction checks and integration verification after handoff. Build/type and emitted HTML checks do not independently prove hydration, slider interaction or Settings persistence.

## Comparison with the baseline maintenance structure

Read the preserved baseline maintenance structure without editing it: its shared Docs module consumes a direct docs index; its Nift docs template has a separate HTML shell and generated header/sidebar; its sync-docs workflow validates Markdown source/path records. Phase 2's documented additions metadata and trusted MDX component mapping make these authored interactive additions possible in the same hydrated Router as app routes. The new feature required one route, one shared data view and shared content/UI edits, with no Nift template coordination.

This exercise supports a narrower structural observation: current maintenance of a route, navigation metadata and MDX component is common to both planners. It does not establish a measured DX win over baseline, does not rerun equivalent work against baseline and does not change the preserved 62-page verdict. Corpus regeneration remains a required extra step after metadata changes, and type checking was necessary beyond successful builds.
