# 🥘 Rasoi AI

AI-powered Indian recipe discovery for households, bachelors, students and working professionals.

## Included

1. **Real recipe data** — curated Indian breakfast, lunch and dinner recipes with ingredients, method, tags and nutrition.
2. **OpenAI recipe generation** — `/api/generate` creates a recipe from the ingredients and preferences supplied by the user.
3. **Voice-to-text** — browser Speech Recognition with `en-IN` locale for ingredient entry.
4. **Nutrition calculations** — calories, protein, fiber and fats plus serving scaling/health scoring utilities.
5. **Recipe detail pages** — `/recipes/[slug]`, static generation and mobile-friendly cooking instructions.
6. **Filters & preferences** — meal, goal, preparation-time and protein filters.
7. **Recipe SEO** — metadata, sitemap, robots and Schema.org `Recipe` JSON-LD.
8. **Database + favorites + shopping list** — Prisma/PostgreSQL schema and API endpoints, with localStorage fallback for the guest experience.
9. **Deployment** — Vercel configuration plus GitHub Actions CI.
10. **Responsive UI** — ingredient search, AI creation, favorites and shopping list flows.

## Local setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

For database-backed features, set a PostgreSQL `DATABASE_URL` and run:

```bash
npx prisma db push
```

For AI generation, set `OPENAI_API_KEY`. Never commit `.env.local` or API keys.

## Deployment

Import the repository into Vercel and configure `OPENAI_API_KEY`, `DATABASE_URL`, `OPENAI_MODEL` and `NEXT_PUBLIC_SITE_URL`. Vercel will run the Next.js build and the Prisma `postinstall` generation step.

## Note

Nutrition values in the included recipe dataset are estimates for the listed serving size, not medical or dietary advice. AI-generated nutrition is also an estimate and should be verified for clinical dietary needs.
