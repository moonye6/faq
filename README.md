# Schema for AI Search

Schema generators built for the AI search era. FAQ rich snippets were
deprecated for most sites in 2023 and cut further by Google's March 2026
core update — but FAQ, HowTo, and other structured data types remain
primary signals for citation by Perplexity, ChatGPT, Gemini, and Google
AI Overviews. This site generates clean JSON-LD aimed at that consumer.

## Stack

- **Astro 6** — SSG, MPA architecture, one URL per schema type
- **Preact** — interactive generator islands
- **Bun** — package manager + runtime
- **TypeScript strict**
- **@astrojs/sitemap** — auto-generated sitemap

## Commands

```sh
bun install               # install deps (use BUN_CONFIG_REGISTRY=https://registry.npmjs.org/ if behind a mirror)
bun run dev               # localhost:4321
bun run build             # → dist/
bun run preview           # serve dist/
bun run check             # astro + ts check
SITE_URL=https://your.domain bun run build   # set canonical site URL
```

## Adding a new schema type

1. Create `src/schemas/{id}.ts` exporting a `SchemaTypeDef`
2. Register it in `src/schemas/index.ts`

That's the only change. Routing, sitemap, landing page, and generator UI
are derived from the registry automatically.

See `src/schemas/faq.ts` and `src/schemas/howto.ts` for reference.

## Project layout

```
src/
├── lib/
│   └── schema-types.ts          # SchemaTypeDef interface + helpers
├── schemas/
│   ├── index.ts                 # registry
│   ├── faq.ts                   # FAQPage adapter
│   └── howto.ts                 # HowTo adapter
├── components/
│   └── SchemaGenerator.tsx      # Preact island: form → JSON-LD
├── layouts/
│   └── BaseLayout.astro         # global shell + SEO meta
└── pages/
    ├── index.astro              # home: lists all schema types
    ├── 404.astro
    └── [slug].astro             # dynamic route per schema type
```

## Strategy

This repository implements the SELECTIVE EXPANSION baseline of the CEO
plan in `docs/ceo-plan-2026-04-25-faq-schema-generator.md`:
the **schema type generator matrix layer** that serves as the SEO traffic
entry. Higher-level modules (auto-extract from URL/PDF, AI citation
monitoring, schema health dashboard, AI-friendliness score) are
cherry-pick decisions pending the next round of outside voice review.

## Phase 1 status

- [x] Astro + Bun + TypeScript scaffolding
- [x] SchemaTypeDef abstraction
- [x] FAQ + HowTo adapters
- [x] Reusable SchemaGenerator Preact island
- [x] GEO/AEO landing template + dynamic routing
- [x] SEO infrastructure (sitemap, robots, canonical, OG meta)
- [x] Build + SSR verified
- [ ] Add: Product, Recipe, Article, Review, LocalBusiness, Event, Course, JobPosting, Breadcrumb (Phase 1 cont.)
- [ ] Pick a domain + deploy (Cloudflare Pages / Vercel / GitHub Pages)
- [ ] Outside voice review of Approach C commercial assumptions

## Notes

- The default `SITE_URL` is a placeholder. Override via the env var when
  building for production so canonicals and sitemap URLs are correct.
- The favicon is the Astro default. Replace `public/favicon.svg`.
- Each landing page is itself marked up with `FAQPage` JSON-LD using its
  own `pageFaqs` content. Eat your own dog food.
