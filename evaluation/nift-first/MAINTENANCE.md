# Fresh-context maintenance

- Task window: 2026-10-15 13:34–13:35:54 Australia/Melbourne (+11:00); first recorded clock reading 13:34:52, implementation/check completion 13:35:26, final report review 13:35:54. Approximate start minute, not a measured productivity benchmark.
- Task: reject an untouched empty API explorer subscription, preserve the input's accessible name when errors appear, and retain successful local-only submission.
- Discovery: `README.md` explicitly maps the explorer to `frontend/explorer.tsx`, identifies TanStack Form and local-only subscription semantics, and gives `bun run check`. No prior conversation was needed to locate the change. No applicable AGENTS.md was found in the checked ancestor directories.
- Changed source: `nift-first/frontend/explorer.tsx`. Extracted the existing email predicate into a shared validator and registered it for both change and submit. Moved the error outside the label, associated the label through `htmlFor`/`id`, and associated error text through conditional `aria-describedby` plus `aria-invalid`. Existing successful submission message and `localStorage` write remain intact.
- Added report: `evaluation/nift-first/MAINTENANCE.md` (this file). No parent/shared/control/package/lock/corpus edits; no builds or benchmarks.

## Verification and encountered errors

`bun run check` initially failed because `bun` was absent from the shell PATH (exit 127). Retrying with `PATH=$HOME/.bun/bin:$PATH bun run check` passed (`tsc --noEmit`, exit 0).

A temporary Bun inline smoke check imported the installed TanStack `FormApi`/`FieldApi`, extracted the actual source validator, mounted an empty form/field, and submitted it. It verified that no success callback ran and an error existed. Changing to `reader@example.com` and submitting invoked the success callback. A source assertion confirmed the existing localStorage call remained. This verifies library validation flow, not a browser localStorage write or accessibility-tree behavior. The markup now gives the input the stable label “Update email”; error text is a separate description. Browser verification remains for the parent evaluation run.

Minor discovery errors: the initially assumed repository-root `evaluation/nift-first` did not exist; the README clarified reports belong in the experiment's sibling `../evaluation/nift-first`. A broad ancestor `find` was interrupted after about ten seconds and replaced by explicit ancestor AGENTS.md checks. An attempted installed-library test-source lookup found no packaged test file. Login-shell setup emitted three `Failed to create stream fd: Operation not permitted` lines; non-login commands avoided them. None blocked the source fix or typecheck.

## Subjective DX assessment

The README's maintained-source map and explicit ownership boundaries made this narrowly scoped maintenance straightforward. The explorer is a single small component, so its validator and label markup are visible together. The subtle gap is behavioral: an on-change validator does not make the initial-submit requirement explicit, and typechecking cannot expose that gap. The README documents checking but offers no focused form interaction test command or expected accessibility behavior. A small documented browser smoke path would make future fresh-context verification easier. Its prerequisite statement also assumes Bun is already discoverable on PATH. No comparative productivity claim is warranted from this one task; no matched task was performed in the other architectures.

## Parent browser follow-up

The parent subsequently verified an untouched empty submit shows an error with save disabled, the textbox remains named “Update email”, and a corrected valid fixture address produces the local success message. Duplicate validator message display was deduplicated by the parent. No comparative agent productivity claim follows.
