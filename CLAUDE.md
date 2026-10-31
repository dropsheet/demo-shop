# Working in this repo

1. Make the change the work order asks for. Keep it small and in the existing style.
2. Typecheck: run `pebbled-offload "npm ci && npm run typecheck"`. Fix every error it reports and run it again until it
   passes. Do not run `npx tsc` directly: this sandbox has no node_modules.
3. Commit with `git commit`. The git identity is already configured; do not set or invent one.
4. Stop.
