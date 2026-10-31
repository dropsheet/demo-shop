# demo-shop

A small Next.js storefront used to demo Dropsheet work orders. A work order
describes a change in one sentence; a runner makes the change on a branch, and
Vercel builds a preview of that branch.

- `app/page.tsx`: the home page (header, hero, product grid)
- `app/components/ProductCard.tsx`: one product card
- `app/lib/products.ts`: the product list

```bash
npm install
npm run dev
```

There are no environment variables and no secrets. Every branch gets a Vercel
preview deploy; `main` deploys to production.
