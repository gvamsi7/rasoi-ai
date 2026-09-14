# Rasoi AI

A Next.js Indian recipe website with ingredient discovery and server-side OpenAI recipe generation.

## Working features

- Search nine curated recipes by name or ingredient; combine meal, time, goal, vegetarian/vegan and protein filters.
- Enter ingredients by typing or supported browser speech recognition. Ingredient matching shows recipes containing at least one selected ingredient.
- Generate a recipe with dietary preferences, exclusions and a time target; read all quantities, cooking steps and estimated nutrition.
- Save curated and generated recipes, reopen generated recipes, and maintain a shopping checklist with manual additions and completed-item cleanup.
- Responsive layout, keyboard focus styles, visible error/loading states, recipe metadata, sitemap and print-friendly recipe pages.

## Run locally

Requires Node.js 20.9+ and npm.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Set `OPENAI_API_KEY` in `.env.local` to enable real generation. `OPENAI_MODEL` defaults to `gpt-4o-mini`. Keys stay on the server. Without a key, the recipe collection and local saving work; generation shows a clear unavailable message.

```sh
npm run lint
npm run build
npm start
```

## Storage

The website uses browser localStorage: favorites, generated recipes and shopping items stay on the same browser/device. It does not promise accounts or cross-device syncing.

Optional PostgreSQL APIs are included separately. Configure `DATABASE_URL` and a random `SESSION_SECRET` of at least 32 characters, then run `npx prisma db push`. These APIs identify guests using signed HttpOnly cookies; caller-supplied email headers are never trusted. Mutation requests require a matching Origin header. The UI does not currently sync with these optional APIs. Keep the signing key stable between deployments.

## Deployment

Import this repository into Vercel, select the branch to deploy, and set `OPENAI_API_KEY`, optional `OPENAI_MODEL`, and `NEXT_PUBLIC_SITE_URL` to your actual HTTPS domain. Run the normal `npm run build` command. PostgreSQL is optional for the browser-based experience.

The AI route validates request and response shapes, sets a 30-second provider timeout, and caps calls at 10 per minute **per process**. For an unrestricted public launch, configure a shared rate limiter or hosting WAF and an API-provider spending limit; the in-memory cap is not a global quota across serverless instances.

## Verification and limits

Nutrition is an estimate per serving. Dietary flags are curated; generated recipes should be checked against ingredient labels and personal exclusions. Soaking time is included for moong chilla; rajma and chana recipes require fully cooked beans.

Live AI generation requires a configured API key. Optional database routes require a real PostgreSQL database. Automated smoke checks can validate unavailable and malformed-request behavior without either service.

## Browser smoke checks

After building, run the API checks and browser flow (the harness starts its own server without service secrets):

```sh
node tests/api-smoke.cjs
npx playwright install chromium
node tests/run-browser.cjs
```

The generated-recipe UI test uses a clearly mocked response; API tests verify validation and the unconfigured-service state. It does not test live model output or PostgreSQL connectivity.
