# Review dispositions

Three fresh-context reviews are retained as checkpoint snapshots. Parent verification and subsequent corrections are recorded separately rather than retroactively editing reviewer findings.

- Unified React shell and Router across docs/app: source verified by all reviewers; parent hydration/navigation checks are separate runtime evidence.
- Native dependency mode: changed modified→hash so preserved-mtime source edits have equivalent semantics to control; real integration test passed.
- Failure recovery: successful source keys are committed after publication, and runtime payload copies compare previous successful keys; read-only destination failure/retry test passed in both models.
- Stage dependencies: renderer and search implementation keys added; imported dev plugin included in app key. App toolchain environment records Bun/Node, VITE variables and normalized production mode. This remains an explicitly scoped project graph.
- Watcher: compiler/search sources added, asynchronous rebuilds serialized and shutdown drains the active task. React HMR and two successive MDX edits were verified in both dev applications.
- Search: complete index rebuild after content changes remains a measured cost. App-only rebuild may reuse the valid serialized search artifact; warm full explicitly regenerates it in both models.
- Source ownership: generated corpus is explicitly disposable; persistent new docs use authored additions. README now explains runtime MDX evaluation/CSP, path namespaces, artifact packaging and no production-host certification.
- Testing: replaced nominal glob with an actual integration test. Bun's test environment exposed a production JSX mismatch; production build environment is now explicit and the test passes.
- Remaining: no-eval CSP unsupported, no untrusted MDX, origin-root hosting, general cache/config extension burden, corrupted-but-existing output is not universally detected; use fresh rebuild for corruption. Independent benchmark and fresh-context maintenance results will determine value, not theoretical scale alone.

Final 3,000-document verification: equal payload objects, SSR main content, search bytes and bundled asset bytes, with no broken internal docs links. Final warm observations are 8.590s hybrid / 7.304s control; reviewers’ earlier pending-warm wording remains a dated checkpoint statement. Search success-key ordering was also corrected after the final source review and a protected-search-destination retry test was added; see the final integration result.
