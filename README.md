# demo-shop

A small Next.js storefront used to demo Dropsheet work orders. A work order
describes a change in one sentence; a runner makes the change on a branch, and
Vercel builds a preview of that branch.

- `app/page.tsx`: the home page (header, hero, product grid)
- `app/components/ProductCard.tsx`: one product card
- `app/lib/products.ts`: the product list (two products carry a `compareAtPrice`)
- `app/components/ProductArt.tsx`: the SVG product illustrations
- `tests/smoke.spec.ts`: Playwright smoke of the home page, light and dark

```bash
npm install
npm run dev          # local server
npm run build && npx playwright install chromium && npm run test:e2e
```

GitHub Actions (`.github/workflows/ci.yml`) builds and runs the smoke on every push to main and every PR.

There are no environment variables and no secrets. Every branch gets a Vercel
preview deploy; `main` deploys to production.
