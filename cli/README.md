# schemaguardian

Validate JSON-LD structured data on any URL or HTML file. CI-friendly.
Built for the AI search era.

```sh
npx schemaguardian check https://your-site.com
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
npx schemaguardian check https://example.com

# global
npm i -g schemaguardian
schemaguardian check https://example.com

# project dev dependency
npm i -D schemaguardian
```

Requires Node 18+.

## Usage

```sh
schemaguardian check <url|file> [--ci] [--json] [--no-color]
schemaguardian help
schemaguardian version
```

### Examples

Check a live URL:

```sh
schemaguardian check https://faqjsonld.com/faq-schema-generator
```

Check a local HTML file:

```sh
schemaguardian check ./dist/index.html
```

Fail a CI build on any error:

```sh
schemaguardian check https://staging.example.com --ci
```

Pipe machine-readable output to `jq`:

```sh
schemaguardian check https://example.com --json | jq '.blocks[].issues'
```

## CI integration

### GitHub Actions

```yaml
# .github/workflows/schema.yml
name: schema
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npx schemaguardian check https://your-preview-url.example --ci
```

### GitLab CI

```yaml
# .gitlab-ci.yml
schema-check:
  image: node:20
  script:
    - npx schemaguardian check $CI_ENVIRONMENT_URL --ci
```

### package.json

```json
{
  "scripts": {
    "schema:check": "schemaguardian check https://faqjsonld.com --ci"
  }
}
```

## What it validates

For every `<script type="application/ld+json">` block found on the page:

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
- Crawling whole sites (use `scan` in v0.2)
- Validating that visible page content matches schema text content
  (Google requires this; only a human or rendered diff can verify it)
- Full schema.org SHACL validation

## Severity levels

| Level | Meaning | `--ci` exit code |
|---|---|---|
| `ERR` | Required field missing or wrong type. Will not produce rich results. | 1 |
| `WARN` | Best practice violation or 2026 deprecation note. Schema may still validate. | 0 |
| `INFO` | Type unsupported or other note. | 0 |

## JSON output schema

```jsonc
{
  "target": "https://example.com",
  "blocksFound": 2,
  "blocks": [
    {
      "block": { "raw": "...", "parsed": { ... }, "position": 1 },
      "schemaType": "FAQPage",
      "issues": [
        { "severity": "warning", "code": "faq-rich-result-deprecated", "message": "...", "path": "..." }
      ]
    }
  ]
}
```

## Roadmap

- **v0.1** (now): `check` command for a single URL or file
- **v0.2**: `scan` for entire sites via sitemap, `generate` for CLI prompts
- **v0.3+** (paid): multi-domain monitoring, auto-PR fix via GitHub API,
  team features, GitHub Action wrapper

The free CLI will always validate any site. Paid tiers add multi-domain
operations and automation.

## Contributing

Source lives at https://github.com/moonye6/faq under `cli/`. The 12
free schema generators on https://faqjsonld.com use the same schema
definitions. Issues and PRs welcome.

## License

MIT
