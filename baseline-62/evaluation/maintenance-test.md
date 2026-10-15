# Fresh-context maintenance test

Completed 2026-10-15 at approximately 00:53 UTC. Hands-on work took approximately 4 minutes (first command was not timestamped; this is a rounded estimate, not an instrumented duration). This worker received the maintenance request and README ownership guidance, without the implementation conversation.

## Actual discovery and diagnosis

1. Listed README/package files, read README and the source inventory, then package scripts.
2. Read shared Portal, Query data, site metadata, React docs views, Nift templates/landing, existing route examples, docs metadata, fixture samples and the recorded friction report.
3. Read the sync-docs implementation to establish that the header is generated and must not be edited. Inspected shared CSS and the control root to find the maintained surfaces for a visible fixture indicator.
4. Diagnosed Settings: its implemented route is `/app/settings` in both apps, while the shared navigation metadata pointed to `/app/setting`. Corrected the metadata rather than adding a redundant route.

## Changes made

- `docs/reliability/recovery-validation.md`: original guide with user-path recovery gates, observation windows, backlog checks and closure evidence.
- `docs/reliability/dependency-failure-drills.md`: original bounded drill procedure, abort conditions and follow-up verification.
- `docs/index.json`, `shared/site.json`: Reliability navigation/section, Services navigation, corrected Settings destination.
- `content/index.html`: Reliability landing card, matching the metadata-driven React landing card.
- `shared/Portal.tsx`: shared Services view using the existing suspense Query data, a case-insensitive service filter, explicit empty state, per-service deployment/status counts and a clearly explained health rule (failed before running before healthy). This aggregates historical deployments across environments, not live service availability.
- `src/routes/app.services.tsx`, `control/src/routes/app.services.tsx`: matching native routes and Query loader, importing the same view.
- `shared/Portal.tsx`, `templates/docs.html`, `templates/landing.html`, `static/site.css`: consistent, responsive, visible “Fixture workspace · Local demonstration data” banner. It remains visible on narrow screens even though the existing LOCAL WORKSPACE header badge hides there.
- `evaluation/maintenance-test.md`: this record.

Only maintained sources were edited directly. Normal builds regenerated navigation, wrappers, route trees and outputs. No orchestration source, reviewer file, core, other repository, production server, publish or push was touched.

## Checks and evidence

- Hybrid `bun run build`: passed, app stage ran and Nift rebuilt 63 pages. Reported approximately 1.80 seconds total in the successful build log.
- Control `bun run build:control`: first attempt failed because sandbox policy denied the localhost listener used by native prerender (`EPERM`, address `127.0.0.1`). Retried with authorized tool escalation; passed, including both new guides in prerender output.
- `bun run check`: passed after both builds (both app typechecks, plus the tools typecheck present in the package script at execution time).
- Inspected landing and both Reliability guide HTML outputs in `public` and `control/dist/client`; all six contain the fixture indicator and Services/Settings destinations.
- Independently counted fixtures: five services, each with 16 deployments. Gateway, identity and payments each have 16 healthy; notifications has 16 failed; search has 16 running. These are the expected view totals and health categories.
- Browser interaction and production HTTP smoke checks were not performed. Existing parent servers were not restarted; ports 4202/4203 may still serve previous bundles. Build/typechecking validates route generation and compilation, but does not replace an interaction test of the filter.

## Mistakes, recovery and remaining friction

- One grouped read accidentally omitted the explicit workdir; all reads failed with file-not-found and no writes occurred. Repeated it in the experiment directory successfully.
- A git status command failed because this experiment has no Git repository. It was observational only; no Git mutation was attempted.
- The initial control build could compile but could not prerender under restricted localhost permissions. Escalated only that build; no permanent server was started or stopped.
- Native and React layouts require edits in separate maintained files for the banner. The generated header has a hardcoded older badge; avoiding orchestration edits meant using a shared-style banner beside it. Both apps visibly expose the same fixture wording, but this duplication is maintenance overhead.
- Hybrid landing cards are hand-maintained while the React landing derives them from section metadata; adding the section required one extra landing edit to maintain parity.
- Matching app route declarations require two small files with different relative import depths. Shared view/data changes require only one implementation.
- No existing functionality was intentionally removed. The health summary is deliberately historical and explains that limitation in the page and recovery guide.
