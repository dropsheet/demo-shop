# Working in this repo

Do this for each ticket in the work order, in order, one commit per ticket:

1. Make the change the ticket asks for. Keep it small and in the existing style. Edit files with your editing tools:
   this sandbox has no Python.
2. Commit that ticket's change with `git commit`. The git identity is already configured; do not set or invent one.
3. Typecheck the commit: run `pebbled-offload "npm ci && npm run typecheck"`. It only runs on a clean tree, so commit first.
   - If it reports type errors, fix them, fold the fix into the same commit with `git commit --amend --no-edit`, and
     run it again. After 3 runs that still report errors, stop editing.
   - If `npm ci` itself fails (network, registry, sandbox), retry once. If it fails again, skip the typecheck.
   - If the typecheck was skipped or still reports errors, say so in the commit message body (`git commit --amend`).
   Do not run `npx tsc` directly: this sandbox has no node_modules.

When every ticket has its commit, stop.

Branch previews are served under a base path (`/demo-shop/<branch>`), so internal links use `next/link`, images use
`next/image` or an import, and no code hard-codes a root path such as `href="/"` or `src="/logo.png"`.
