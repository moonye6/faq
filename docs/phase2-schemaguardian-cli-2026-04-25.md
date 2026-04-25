---
date: 2026-04-25
phase: 2
status: ACTIVE
strategic-route: Schema-Guard CLI (OSS + paid CI plugin)
supersedes: docs/ceo-plan-2026-04-25-faq-schema-generator.md (Approach C)
informed-by:
  - docs/outside-voice-2026-04-25.md
  - docs/keyword-research-2026-04-25.md
---

# Phase 2: schemaguardian CLI

After outside voice + live 2026 data invalidated CEO plan v1's Approach C
(AI citation monitoring SaaS), the new strategic route is OSS CLI + paid
CI plugin. This doc captures Phase 2 scope.

## Strategic positioning

- **Free OSS CLI** distributes via GitHub stars + npm — sidesteps the AI
  citation monitoring data-cost arms race entirely.
- **Phase 1 (12-schema generator matrix on faqjsonld.com) = SEO funnel
  top.** Drives organic discovery to the CLI repo.
- **Paid CI plugin** ($19/mo per repo, planned not built) layers on
  multi-domain monitoring, auto-PR fix, team features.
- **Buyer ICP:** developer + SEO-aware engineering teams who want CI
  gating on structured data quality. NOT enterprise SEO directors.

## What schemaguardian does

`schemaguardian <command>` — CLI for structured data validation and audit.

### MVP commands (Phase 2 v0.1)

| Command | What it does |
|---|---|
| `schemaguardian check <url\|file>` | Fetches URL or reads HTML file, extracts all JSON-LD `<script>` tags, validates each against schema.org rules + common Google rejection conditions. Reports issues. `--ci` exits non-zero on any issue. |

### v0.2 (next iteration)

| Command | What it does |
|---|---|
| `schemaguardian scan <site-url>` | Reads `sitemap.xml`, crawls all URLs, reports per-page schema coverage. Identifies gaps (e.g., product pages missing Product schema). |
| `schemaguardian generate <type>` | Interactive prompt to generate a specific schema type. Mirror of the web tools at faqjsonld.com but in the terminal. |

### v0.3+ (paid Pro features, planned)

- Multi-domain monitoring with diff alerts
- Auto-PR fix: detect schema regression, open a fix PR via GitHub API
- Team/org features: shared config, baseline tracking, slack alerts
- GitHub Action wrapper

## Architecture decisions

- **Monorepo**: CLI lives in `cli/` subdirectory of `moonye6/faq` repo.
  Same git history, easy local development against shared schema concepts.
- **Vendored schemas**: `cli/src/schemas/` has its own copy of the schema
  definitions for now. The web app and CLI may drift. If/when this hurts,
  extract a shared `packages/core` workspace.
- **Build**: `bun build cli/src/index.ts --target=node --outfile=cli/dist/index.js`
  to a single bundled JavaScript file.
- **Distribution**: `npm publish` from `cli/` directory. Package name
  `schemaguardian`. Bin name `schemaguardian`. Entry: `cli/dist/index.js`.
- **Validation engine**: hand-rolled per-schema-type validator using the
  same `SchemaTypeDef` definitions plus a small set of Google-specific
  rules (e.g., FAQ visible-answer requirement is documented but not
  programmatically checkable from schema alone — flag as warning).

## Validation rules implemented in v0.1

For each detected JSON-LD block:

1. **JSON parse**: must be valid JSON.
2. **`@context` present**: must include `https://schema.org`.
3. **`@type` present**: must be a string or array of strings.
4. **Known type**: if the type is one of our 12 supported types
   (FAQPage, HowTo, Product, Recipe, Article, Review, LocalBusiness,
   Event, BreadcrumbList, Organization, Course, JobPosting), apply
   per-type required-field checks. Otherwise, skip with a hint.
5. **Per-type required fields** (examples):
   - `FAQPage`: `mainEntity` array with each item having `@type=Question`,
     `name`, and `acceptedAnswer` with `@type=Answer` and `text`
   - `Product`: `name` + (`offers` or `aggregateRating`)
   - `JobPosting`: `title`, `description`, `datePosted`, `hiringOrganization`,
     `jobLocation` (or `jobLocationType=TELECOMMUTE`)
6. **Common Google rejection patterns**:
   - HowTo schema (warn — not eligible for rich results since 2024)
   - FAQ on non-authority site (warn — rich results restricted since 2023)
   - JobPosting without `validThrough` (warn — required by Google for Jobs)

## Out of scope for v0.1

- Microdata or RDFa (only JSON-LD)
- Visual content match (we cannot check that visible page matches schema text)
- Schema.org full SHACL validation (overkill for v0.1)
- Authentication / paid features

## Risks (acknowledged)

1. **Vendored schema drift**: web and CLI definitions may diverge. Mitigation: this is intentional for v0.1; revisit after first 100 npm installs.
2. **No clear monetization in v0.1**: paid Pro features (multi-domain, auto-PR, team) are not built. v0.1 is loss-leader OSS for distribution.
3. **`structured-data-testing-tool` (Google's old tool, retired) and `Schema Markup Validator` (current) are competitors.** Differentiation: ours is CLI-first + CI-friendly + supports our 12-type matrix natively + GEO/AEO positioning.

## Success criteria for Phase 2 v0.1

- [ ] `npx @moonye/schemaguardian check https://faqjsonld.com/faq-schema-generator` returns clean output (we eat our own dog food)
- [ ] `npx @moonye/schemaguardian check ./test-fixtures/invalid.html --ci` exits non-zero
- [ ] README documents 3 CI integration examples (GitHub Actions, GitLab CI, generic shell)
- [ ] Published to npm as `schemaguardian`
- [ ] First 50 GitHub stars within 6 weeks (organic indicator)

## Decisions log

- **Name**: `schemaguardian` (no dash). `schema-guard` taken by unrelated package. `aeo-guard` available but user preferred preserving the brand.
- **Repo**: monorepo (cli/ subdirectory) to ship faster. Extract later if needed.
- **Initial command**: only `check` for v0.1. `scan` and `generate` deferred to v0.2.
- **Pro tier**: planned, NOT built. v0.1 is purely OSS to validate distribution.

## Next session priorities

1. Implement `check` command end-to-end
2. Smoke test against own pages
3. Smoke test against real-world failing pages
4. Write CLI README + CI integration examples
5. Hand off to user for `npm publish` (requires their npm token)
6. (Then) `scan` command in v0.2
