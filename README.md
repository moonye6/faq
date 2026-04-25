# Schema for AI Search

Two products:

1. **[faqjsonld.com](https://faqjsonld.com)** — 12 free schema generators
   (FAQ / HowTo / Product / Recipe / Article / Review / LocalBusiness /
   Event / Breadcrumb / Organization / Course / JobPosting). Built for the
   AI search era: structured data is now a primary signal for citation by
   Perplexity, ChatGPT, Gemini, and Google AI Overviews, even where Google
   stopped showing FAQ and HowTo rich snippets in 2023-2026.
2. **[`schemaguard`](./cli/) CLI** — `npx schemaguard check <url>` validates
   JSON-LD on any page or HTML file. CI-friendly. See [`cli/README.md`](./cli/README.md).

## Layout

```
faq/
├── src/                    # the website (Astro)
│   ├── lib/                # SchemaTypeDef interface + helpers
│   ├── schemas/            # one file per supported schema type (registry-driven)
│   ├── components/         # SchemaGenerator Preact island
│   ├── layouts/
│   └── pages/              # /, /404, /[slug] (dynamic per schema type)
├── cli/                    # the schemaguard CLI (separate npm package)
│   ├── src/
│   │   ├── lib/            # extract, validators, report
│   │   ├── commands/       # check (v0.1)
│   │   └── schemas/        # vendored copy of schema definitions
│   └── README.md
├── public/
└── docs/                   # CEO plan, outside voice review, keyword research, phase plans
```

## Stack

- Astro 6 + Preact + Bun + TypeScript strict (website)
- Bun bundler + Node 18+ runtime + zero deps (CLI)
- @astrojs/sitemap (auto sitemap)

## Development

### Website

```sh
bun install               # use BUN_CONFIG_REGISTRY=https://registry.npmjs.org/ if behind a mirror
bun run dev               # localhost:4321
bun run build             # → dist/
bun run check             # astro + ts check
```

### CLI

```sh
cd cli
bun install
bun run build             # → dist/index.js (single bundled file)
node dist/index.js check https://faqjsonld.com   # smoke test
```

### Adding a new schema type

1. Create `src/schemas/{id}.ts` exporting a `SchemaTypeDef`
2. Register it in `src/schemas/index.ts`
3. (Optional) copy the same file into `cli/src/schemas/` and register
   in `cli/src/schemas/index.ts` so the CLI validates it too

Routing, sitemap, landing page, and generator UI are derived
automatically from the registry.

## Strategy

See `docs/` for the full strategic record:

- `ceo-plan-2026-04-25-faq-schema-generator.md` — original plan (v1)
- `outside-voice-2026-04-25.md` — independent critique that invalidated v1's
  "AI citation monitoring SaaS" thesis
- `keyword-research-2026-04-25.md` — SERP recon evidence
- `phase2-schemaguard-cli-2026-04-25.md` — current Phase 2 plan (CLI route)

**Current strategic route:** OSS CLI distributes via GitHub stars + npm,
with planned paid Pro tier for multi-domain monitoring + auto-PR fix.
The website is the SEO funnel top.

## Deploy

- Production: `https://faqjsonld.com` (Vercel, auto-deploys on push to main)
- CLI: `npm publish` from `cli/` directory (manual; needs npm token)

## Status

- [x] Phase 1: 12-schema generator matrix + landing pages + SEO infra
- [x] Phase 1A: GEO/AEO copy positioning per schema type
- [x] Phase 2 v0.1: schemaguard CLI `check` command
- [ ] Phase 2 v0.2: `scan` (sitemap-driven), `generate` (CLI prompts)
- [ ] Phase 2 v0.3+: paid Pro features (planned)

## License

MIT
