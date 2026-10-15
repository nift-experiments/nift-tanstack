# AI developer experience

## Independent maintenance test

A fresh-context worker received the project path, README and ordinary maintenance requirements, without the implementation conversation or the injected issue location. It added a Reliability section and two original guides, a Query-backed `/app/services` view and matching routes, a consistent fixture-workspace indicator, and diagnosed/fixed the broken Settings navigation from metadata. Its own report is `maintenance-test.md`.

The worker edited maintained sources, not generated wrappers/headers. Both production builds and all TypeScript checks passed. Parent browser testing subsequently verified the Services filter in both apps: gateway returned 16 deployments, all healthy. Parent all-route checks passed. Approximate worker elapsed time was four minutes, explicitly an estimate, not a stopwatch result.

Observed mistakes were modest: a read command omitted workdir and failed harmlessly; a Git-status query discovered that this local project has no Git repository; control prerender required sandbox listener permission. The metadata diagnosis was correct rather than papered over with a duplicate singular route.

## What this establishes

A new agent could orient itself from the checked-in handover, recognize native TanStack conventions, find the authoritative sources and complete representative changes. The build split is maintainable with explicit guidance. This does not prove an agent unfamiliar with Nift could infer the integration without README, nor is one successful worker a comparative human study. There was no second blinded worker assigned exclusively to the control.

## Costs the worker actually encountered

Adding a docs section required updating Markdown/index/site metadata plus the maintained HTML landing; React landing cards derive from metadata. A shared banner needed separate HTML and JSX changes. Matching experiment route wrappers have different relative import depths. These are coordination costs, not proof of an agent failure. Shared React views/data mean the service implementation itself was written once.

Original implementation also made generated/source mistakes: sync logic initially overwrote maintained templates, and cache/watch assumptions were incomplete. Independent reviewers found them; corrections and actual failure recovery remain in FRICTION.md. Readable source formatting, generated-directory ignores, explicit ownership documentation, an actual integration-test command and tools typechecking improve the final handoff, but they do not erase that effort.

## Judgment

For this application: AI-DX 6/10 hybrid, 8/10 TanStack-only. The hybrid has a very fast content-production feedback loop and enough guidance to work, but an agent must understand another syntax, output tree, watcher, cache contract and shared-shell boundary. The control's existing framework conventions carry more of that knowledge. A supported integration scaffold with tested lifecycle/input/output handling and explicit route namespaces would improve the hybrid score more than another microbenchmark optimization.
