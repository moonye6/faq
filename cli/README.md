# schemaguardian

[![npm version](https://img.shields.io/npm/v/@moonye/schemaguardian?label=npm&color=0d4f3c)](https://www.npmjs.com/package/@moonye/schemaguardian)
[![npm downloads](https://img.shields.io/npm/dm/@moonye/schemaguardian?color=0d4f3c)](https://www.npmjs.com/package/@moonye/schemaguardian)
[![license](https://img.shields.io/npm/l/@moonye/schemaguardian)](https://github.com/moonye6/faq/blob/main/LICENSE)

Validate JSON-LD structured data on any URL, HTML file, or whole site
via sitemap. CI-friendly. Built for the AI search era.

```sh
# Validate one page
npx @moonye/schemaguardian check https://your-site.com

# Walk every URL in your sitemap.xml
npx @moonye/schemaguardian scan https://your-site.com

# Drop a ready-to-commit GitHub Actions workflow
npx @moonye/schemaguardian init --url https://your-site.com
```

## Why this exists

Google scaled back FAQ and HowTo rich results in 2023 and cut them
further in the March 2026 core update. But structured data is now a
primary signal for citation in AI search engines (Perplexity, ChatGPT,
Gemini, Google AI Overviews). `schemaguardian` validates your JSON-LD
against schema.org rules **plus** the documented Google rejection
patterns and the 2026 reality of which schema types still produce
rich results.

It runs in CI. It exits non-zero on real problems. It tells you why.

## Install

```sh
# one-off
npx @moonye/schemaguardian check https://example.com

# global
npm i -g @moonye/schemaguardian
schemaguardian check https://example.com

# project dev dependency
npm i -D @moonye/schemaguardian
```

Requires Node 18+.

## Commands

```sh
schemaguardian check <url|file>      Validate a single URL or local HTML file.
schemaguardian scan  <site-url>      Walk a site's sitemap.xml and validate every page.
schemaguardian init                  Generate .github/workflows/schemaguardian.yml.
schemaguardian help
schemaguardian version
```

### `check` — single page

```sh
schemaguardian check https://faqjsonld.com/faq-schema-generator
schemaguardian check ./dist/index.html
schemaguardian check https://staging.example.com --ci
schemaguardian check https://example.com --json | jq '.blocks[].issues'
```

Options: `--ci` (exit non-zero on errors) · `--json` (machine output) · `--no-color`.

### `scan` — whole site via sitemap

Auto-discovers `/sitemap-index.xml`, `/sitemap.xml`, or `/sitemap_index.xml`.
Recursively follows sitemap indices to their child sitemaps. Validates
every URL in parallel.

```sh
schemaguardian scan https://faqjsonld.com
schemaguardian scan https://example.com --limit 25 --concurrency 8 --ci
schemaguardian scan https://example.com --sitemap https://example.com/news-sitemap.xml
schemaguardian scan https://example.com --json | jq '.summary'
```

Options:

| Flag | Default | Meaning |
|---|---|---|
| `--sitemap <url>` | auto-discover | Use this sitemap URL instead of guessing. |
| `--limit <n>` | 100 | Max URLs to scan. |
| `--concurrency <n>` | 4 | Parallel requests (1-32). |
| `--ci` | off | Exit non-zero on any error or fetch failure. |
| `--json` | off | Machine-readable output. |
| `--no-color` | off | Disable ANSI color. |

Output includes per-page status, a per-type count of schemas found
across the site, and a list of pages with no structured data at all.

### `init` — generate a CI workflow

```sh
# default: writes .github/workflows/schemaguardian.yml using `scan`
schemaguardian init --url https://my-site.com

# use single-page check instead of scan
schemaguardian init --url https://my-site.com --command check

# write somewhere else
schemaguardian init --url https://my-site.com --target .gitlab-ci.yml --force
```

Options: `--url <url>` (the site to validate) · `--command check|scan`
(default scan) · `--target <path>` (output location) · `--force`
(overwrite an existing file).

## CI integration

### GitHub Actions

```yaml
# .github/workflows/schema.yml
name: schemaguardian
on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npx --yes @moonye/schemaguardian@latest scan https://your-site.com --ci
```

Or just `npx @moonye/schemaguardian init` once and commit the file.

### GitLab CI

```yaml
schema-check:
  image: node:20
  script:
    - npx --yes @moonye/schemaguardian@latest scan $CI_ENVIRONMENT_URL --ci
```

### package.json

```json
{
  "scripts": {
    "schema:check": "schemaguardian check https://faqjsonld.com --ci",
    "schema:scan":  "schemaguardian scan  https://faqjsonld.com --ci"
  }
}
```

## What it validates

For every `<script type="application/ld+json">` block found on a page:

1. **Generic envelope** — JSON parses, `@context` includes schema.org,
   `@type` is present.
2. **Per-type required fields** for the 12 schema types in the registry:
   FAQPage, HowTo, Product, Recipe, Article (and BlogPosting,
   NewsArticle), Review, LocalBusiness, Event, BreadcrumbList,
   Organization, Course, JobPosting.
3. **2026-specific Google rejection patterns**, including:
   - FAQ rich result deprecation since 2023, further cut March 2026
   - HowTo rich result removal since 2023-2024
   - Product without offers OR aggregateRating (no rich result)
   - JobPosting without `validThrough` (Google for Jobs suppression)
   - JobPosting without `baseSalary` (lower placement, AI filter skip)
   - Article without publisher logo (Top Stories ineligible)
   - BreadcrumbList with non-sequential positions
   - Many more, see `src/lib/validators.ts`.

Other `@type` values pass envelope checks and emit an info-level note
that type-specific validation was skipped.

### What it does NOT do (yet)

- Microdata or RDFa parsing (only JSON-LD)
- Validating that visible page content matches schema text content
  (Google requires this; only a human or rendered diff can verify it)
- Full schema.org SHACL validation
- Multi-domain monitoring (planned for paid Pro tier)

## Severity levels

| Level | Meaning | `--ci` exit code |
|---|---|---|
| `ERR` | Required field missing or wrong type. Will not produce rich results. | 1 |
| `WARN` | Best practice violation or 2026 deprecation note. Schema may still validate. | 0 |
| `INFO` | Type unsupported or other note. | 0 |

`scan --ci` also exits 1 on any fetch failure (HTTP 4xx/5xx, timeout, DNS).

## JSON output schemas

### `check --json`

```jsonc
{
  "target": "https://example.com",
  "blocksFound": 2,
  "blocks": [
    {
      "block": { "raw": "...", "parsed": { ... }, "position": 1 },
      "schemaType": "FAQPage",
      "issues": [{ "severity": "warning", "code": "faq-rich-result-deprecated", "message": "...", "path": "..." }]
    }
  ]
}
```

### `scan --json`

```jsonc
{
  "sitemap": "https://example.com/sitemap-index.xml",
  "totalUrlsInSitemap": 14,
  "scanned": 14,
  "limited": false,
  "pages": [
    { "url": "...", "status": "ok", "blocksFound": 2, "schemaTypes": ["FAQPage", "BreadcrumbList"], "errors": 0, "warnings": 1 }
  ],
  "summary": {
    "ok": 1, "withErrors": 0, "withWarnings": 13, "fetchErrors": 0,
    "missingSchema": 0, "schemaTypeCounts": { "FAQPage": 13 },
    "totalErrors": 0, "totalWarnings": 13
  }
}
```

## Roadmap

- **v0.1**: `check` command for a single URL or file
- **v0.2** (now): `scan` for whole sites via sitemap, `init` for one-shot CI setup
- **v0.3+** (paid Pro, planned): multi-domain monitoring, auto-PR fix
  via GitHub API, team workflows, GitHub Action wrapper

The free CLI will always validate any site. Paid tiers add multi-domain
operations and automation.

## Contributing

Source lives at https://github.com/moonye6/faq under `cli/`. The 12
free schema generators on https://faqjsonld.com use the same validators.
Issues and PRs welcome.

## License

MIT
