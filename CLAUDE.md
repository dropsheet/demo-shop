# Working in this repo

Do this for each ticket in the work order, in order, one commit per ticket:

1. Make the change the ticket asks for. Keep it small and in the existing style.
2. Typecheck: run `pebbled-offload "npm ci && npm run typecheck"`.
   - If it reports type errors, fix them and run it again. After 3 runs that still report errors, stop editing.
   - If `npm ci` itself fails (network, registry, sandbox), retry once. If it fails again, skip the typecheck.
   Do not run `npx tsc` directly: this sandbox has no node_modules.
3. Commit that ticket's change with `git commit`. The git identity is already configured; do not set or invent one.
   If the typecheck was skipped or still reports errors, say so in the commit message body.

When every ticket has its commit, stop.

Branch previews are served under a base path (`/demo-shop/<branch>`), so internal links use `next/link`, images use
`next/image` or an import, and no code hard-codes a root path such as `href="/"` or `src="/logo.png"`.
