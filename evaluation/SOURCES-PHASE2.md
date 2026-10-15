# Primary references and implementation provenance

- TanStack Start native static prerendering: https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering
- TanStack Start + Query: https://tanstack.com/start/latest/docs/framework/react/guide/tanstack-query
- MDX compiler, function-body output and run/runSync API: https://mdxjs.com/packages/mdx/
- MDX on-demand pattern and trusted-code evaluation qualification: https://mdxjs.com/guides/mdx-on-demand/
- Official Vite shared options/output behavior: https://vite.dev/config/build-options.html
- Nift public documentation: https://nift.dev; installed CLI `nift commands` and matching read-only source/docs used to verify native status(), hash mode, @dep and inject/stringify behavior.

Exact dependencies and frozen lockfile belong to this repository. Original62-page work remains in baseline-62. Read-only Agora bounded-renderer/content-separation patterns informed the design; this experiment uses a much smaller common worker/payload pipeline, not the Agora application/compiler. No prior repository or Nift core was modified.
