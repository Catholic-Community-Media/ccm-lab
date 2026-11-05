# CCM Lab

Catholic Community Media website lab: Next.js + Payload 3 CMS, Neon Postgres, Cloudflare R2 media storage, deployed on Netlify.

## Local setup

```bash
nvm use
npm ci
cp .env.example .env   # then fill in the values
```

## Scripts

- `npm run dev` - start the dev server (http://localhost:3000, admin at /admin)
- `npm run test:unit` - Vitest unit tests
- `npm run test:e2e` - Playwright end-to-end tests

## Docs

Specs and plans live in `~/Projects/superpowers-docs`.
