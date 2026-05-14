# Promotion Drafts — Phase B

Phase B of the SEO recovery plan: earn external signals to fix the
"new site Google doesn't trust yet" problem. Stop relying on Google
to discover us; bring traffic in from HN/Reddit/dev.to/awesome lists,
which generates real users (= dwell time, return visits, branded
searches) — the strongest signal Google uses to decide whether a site
deserves indexing.

## CRITICAL UPDATE — schemaguardian 0.4.0 just shipped (2026-05-14)

The CLI now has a **programmatic library API** (`import { validate } from '@moonye/schemaguardian'`).
This is a FRESH news hook — much stronger than re-pitching the v0.3 fix-hints story.
Update the Show HN angle accordingly:

**Better Show HN title (2026-05-14+):**
```
Show HN: Schemaguardian 0.4 – TypeScript library for JSON-LD validation
```
or
```
Show HN: Validate schema.org JSON-LD as a TypeScript library, not just a CLI
```

**What to add to the body (insert after the "Run it:" section):**

> NEW in v0.4: programmatic library API. Embed the validator in your build pipeline,
> Astro/Next.js content collection schema, custom CI tool, or in-browser validator
> like the one at https://faqjsonld.com/faq-schema-validator (~25KB runtime, zero
> Node deps, works in browsers + Deno + Bun + Node):
>
>     import { validate } from '@moonye/schemaguardian';
>     const result = validate(jsonLdObject);
>     // result.issues = [{ severity, code, message, hint }, ...]
>
> Same validator that powers the CLI; same fix-hint catalog.

**Better target time (2026-05-14+):** Sunday 2026-05-17 7:30-8:30 AM PT. Don't wait
longer — every day past 0.4 release dilutes the news hook.

---

## Original drafts below (mostly still valid, just merge in the v0.4 angle above)


**Target sequence:**
1. Show HN — Sunday morning ~8:00 AM PT (peak HN front-page conversion window)
2. Reddit r/SEO — same day, different audience
3. Reddit r/programming — Mon/Tue, different angle
4. dev.to article — published before HN (gives HN something to link to)
5. Awesome list PRs — over the same week, low-effort background work

**Why this order:** HN gives the biggest one-shot traffic spike (5K-50K visits
if it hits front page). Reddit is more reliable but smaller. dev.to is
slow-burn SEO. Awesome lists compound over months.

---

## B1 — Show HN

**Submit at:** https://news.ycombinator.com/submit
**Best time:** Sunday 7:30-8:30 AM PT (Pacific, US time). Avoid Mon-Fri 9-5 PT
(office hours = lower upvote velocity = page slower to climb).

**Title** (under 80 chars):

```
Show HN: Schemaguardian – CLI for JSON-LD validation with fix hints
```

**URL field:** `https://github.com/moonye6/faq` (the repo, NOT the website. HN
respects code-first submissions.)

**Text field** (HN allows ~5000 chars):

```
I built schemaguardian because every existing schema validator tells you
what's wrong but not how to fix it. Google's Rich Results Test is great for
"is this valid" but stops at the error. The output of a typical Google
validator says:

  Error: Field "author" must be a Person or Organization

Schemaguardian's output says:

  Error: Field "author" must be a Person or Organization
  Fix:   author: { "@type": "Person", "name": "Alex Chen", "url": "...",
                   "sameAs": ["https://twitter.com/...", "https://..."] }
         AI engines verify authors via sameAs across the web. Plain string
         author names lose attribution boosts entirely.

It's an MIT-licensed Node CLI (Bun-built, ESM, ~37KB binary, zero
runtime dependencies). Runs locally on a URL or HTML file, scans entire
sitemaps, validates 13 schema.org types (FAQ, Product, Article, HowTo,
Recipe, Review, LocalBusiness, Event, Breadcrumb, Organization, Course,
JobPosting, Video), and ships with 60+ fix hints curated from the actual
Google rejection patterns I hit while building https://faqjsonld.com.

The reason fix hints matter more in 2026 than they did in 2022: Google
deprecated FAQ rich results in 2023 and cut HowTo in 2024. The schema is
still indexed — but its consumers are now AI assistants (Perplexity,
ChatGPT, Gemini, Google AI Overviews), not the SERP rich result. AI
extractors are stricter than Google's parser. They silently skip
malformed schema. Without a tool that tells you the specific reason and
the specific fix, your schema is "valid by Google" but invisible to AI
citation.

Run it:

  npx @moonye/schemaguardian check https://your-site.com
  npx @moonye/schemaguardian scan  https://your-site.com --ci

Or wire it into GitHub Actions in 30 seconds:

  npx @moonye/schemaguardian init

That generates a workflow that fails the build on any schema regression.

Source: https://github.com/moonye6/faq (everything's open, including the
13 schema generators that share the same validator core).

Happy to answer questions about the validator design, the fix-hint curation
process, or why FAQPage schema is still worth shipping in 2026.
```

**Tips:**
- Don't link to the website domain in title (HN treats it as marketing). Link to GitHub.
- Reply to every comment within 30 minutes for the first 4 hours. Comment velocity =
  ranking signal on HN.
- If asked "is this a SaaS pitch?" — answer plainly: no, just a CLI. There's a
  paid Pro tier on the roadmap (multi-domain monitoring) but the CLI itself stays
  free forever.
- Don't ask for upvotes. HN bans for vote manipulation.

**Expected outcome:** 50/50 chance of front page. If it hits, expect
3K-15K visits in 24h, 5-20 GitHub stars/hour during peak. Even if it
doesn't hit, ~200-500 visits is normal.

---

## B2 — Reddit r/SEO

**Subreddit:** https://reddit.com/r/SEO
**Best time:** Tue-Thu 8-10 AM ET, US-heavy traffic
**Mod rules:** No self-promotion within first 90 days of account, no link in title.

**Title:**

```
I built a free CLI to validate schema markup in CI — open source, includes 60+ fix hints
```

**Body:**

```
Hey r/SEO,

I've been running https://faqjsonld.com (free schema generators for 13 types)
and got tired of broken schema slipping through my own deploys. Built a CLI
to catch it before it ships.

What it does:
- Validates JSON-LD against schema.org rules + Google's 2024-2026 rich
  result requirements
- Scans your entire sitemap, not just one page
- Outputs the specific fix for every error (60+ curated fix hints based
  on actual Google rejection patterns)
- Integrates with GitHub Actions in one command

Usage:
  npx @moonye/schemaguardian check https://your-site.com
  npx @moonye/schemaguardian scan  https://your-site.com --ci
  npx @moonye/schemaguardian init  # writes a GitHub Actions workflow

Why I built it:
Google scaled back FAQ rich results in 2023 and HowTo in 2024. Most
schema validators tell you "is this valid for Google" — but the bigger
question now is "will AI assistants actually cite this." AI extractors
(Perplexity, ChatGPT, Gemini, AI Overviews) are stricter than Google's
parser and silently skip malformed schema. The fix hints are curated
specifically for AI-citation patterns, not just Google validation.

It's MIT-licensed, zero runtime deps, ~37KB binary. No signup, no rate
limit, no upsell.

GitHub: https://github.com/moonye6/faq
npm:    https://www.npmjs.com/package/@moonye/schemaguardian

Would genuinely appreciate brutal feedback. What schema gets you the most
trouble in 2026?
```

**Tips:**
- Engage every comment within 4 hours. r/SEO mods de-rank low-engagement posts.
- If someone says "FAQ schema is dead", don't argue — share the data on AI
  citation rates and link the blog post on it.
- Don't post the same content to r/bigseo, r/digital_marketing same day.
  Stagger 48 hours.

---

## B3 — Reddit r/programming

**Subreddit:** https://reddit.com/r/programming
**Best time:** Tue-Thu 9-11 AM ET
**Mod rules:** Must be technical content, no marketing. They will remove if it
reads as a tool ad.

**Title:**

```
Show /r/programming: I wrote a JSON-LD validator with actionable fix hints in TypeScript
```

**Body:**

```
Wrote a CLI to validate JSON-LD structured data on websites. The angle that
made it worth open-sourcing: every other validator (Google's Rich Results
Test, schema.org validator, npm validators) tells you what's wrong but not
how to fix it. So I curated 60+ fix hints based on actual Google rejection
patterns I hit while building a structured-data tool site.

Architecture:
- TypeScript, compiled with Bun, ships as a single ~37KB ESM bundle
- Zero runtime deps (vendored only what the validator core needs)
- Pure functions for the validation logic — works the same in Node, Bun,
  Deno, and the browser (currently bundling for the browser to put it on
  the website itself)
- Issue codes are stable identifiers — `faq-question-missing-name`,
  `article-missing-publisher` — so the hint map decouples cleanly from
  the validators

Per-validator the hint map looks like:

  'article-missing-author':
    'Add "author" as a Person or Organization object. Strongly recommend
     Person with name + url + sameAs (LinkedIn, Twitter) for AI cite
     confidence.',

The thing I'm most curious about technically: the trade-off between
TypeScript's structural types and JSON-LD's @type discriminator. I went
with a string-based switch in `validateByType()` rather than discriminated
unions because @type can be an array (multi-type entities). Open to better
patterns if anyone has one.

Source: https://github.com/moonye6/faq (cli/ subdirectory)
npm:    https://www.npmjs.com/package/@moonye/schemaguardian

Code review welcome. The validator core is at cli/src/lib/validators.ts.
```

**Tips:**
- Lead with the technical angle. r/programming hates marketing.
- Be ready to defend architectural choices.
- Don't link the website (they'll downvote as marketing); link the GitHub
  source dir directly.

---

## B4 — dev.to article

**Publish at:** https://dev.to/new
**Why:** Slower burn than HN/Reddit but builds long-tail SEO. dev.to articles
get crawled fast, picked up by Google's "from sites with similar topics"
recommendations, and you get a permanent backlink.

**Tags** (3-4 max): `webdev`, `seo`, `typescript`, `cli`

**Title:**

```
Validating Schema Markup in CI: A Walkthrough
```

(Avoid the brand name in title — neutral title gets more clicks from
Google's dev.to organic.)

**Cover image:** Use the og-default.svg from the repo (or generate a 1000x500
banner with the schemaguardian logo if available).

**Body:**

````markdown
Schema markup is the structured data Google and AI assistants use to
understand your pages. JSON-LD inside a `<script type="application/ld+json">`
tag, schema.org vocabulary, copy-paste into your `<head>`. That's the whole
deal.

But schema breaks silently. A botched template change can strip valid markup
site-wide without a visible bug. Your tests pass. Your monitors don't fire.
Six weeks later you notice your AI citation share dropped and you have no
idea why.

This post walks through validating schema in CI so the regression never
ships. We'll use [schemaguardian](https://www.npmjs.com/package/@moonye/schemaguardian),
an MIT-licensed CLI I wrote, but the principles apply to any validator.

## Why "valid" isn't enough in 2026

Google's Rich Results Test will tell you whether your schema parses. That's
necessary. It's not sufficient.

In 2026, the bigger question is: will AI assistants actually cite this?
Perplexity, ChatGPT, Gemini, and Google AI Overviews are now major consumers
of schema markup. They're stricter than Google's parser:

- They silently skip schema with missing context (e.g., `Article` without
  `author.sameAs` URLs)
- They de-prioritize schema that doesn't match visible content
- They prefer specific subtypes (`Restaurant` over generic `LocalBusiness`)
- They reward complete entity graphs (Organization → Article → Author)

A validator that only checks "does this parse" misses all of this. So the
hint catalog matters as much as the validator itself.

## The validator architecture

`schemaguardian` is a Node CLI built with Bun. The core looks like this:

```typescript
export function validateBlock(block: unknown): Issue[] {
  const issues: Issue[] = [];
  if (!isObj(block)) {
    issues.push({ severity: 'error', code: 'not-object', message: '...' });
    return issues;
  }
  const types = getType(block);
  for (const t of types) {
    issues.push(...validateByType(t, block));
  }
  return issues;
}
```

`validateByType` is a switch over schema.org types: `FAQPage`, `Product`,
`Article`, etc. Each handler knows the required fields, the recommended
fields, and the 2026 patterns that matter for AI citation specifically.

The fix hints are decoupled. After validation produces issues, a separate
pass annotates each issue with a hint based on the issue code:

```typescript
export const FIX_HINTS: Record<string, string> = {
  'article-missing-author':
    'Add "author" as a Person or Organization object. Strongly recommend ' +
    'Person with name + url + sameAs (LinkedIn, Twitter) for AI cite ' +
    'confidence.',
  // ...60+ more
};
```

This separation matters. The validators stay pure (deterministic, easy to
test). The hint map evolves as we learn new rejection patterns from real
Google + AI behavior. They never tangle.

## Wiring it into CI

GitHub Actions has the simplest setup. One command from the project root:

```bash
npx @moonye/schemaguardian init --url https://your-site.com
```

That writes `.github/workflows/schemaguardian.yml` containing:

```yaml
name: Schema Validation
on:
  pull_request:
  push:
    branches: [main]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npx --yes @moonye/schemaguardian@latest scan https://your-site.com --ci
```

Commit it. Every PR now validates the entire sitemap. If schema breaks,
the build fails. The PR can't merge until you fix it.

## Reading the output

A typical run looks like this:

```
✓ /                                  (4 blocks: WebSite, FAQPage, CollectionPage)
✓ /faq-schema-generator              (2 blocks: FAQPage, BreadcrumbList)
! /blog/some-post                    (2 blocks, 1 warning)
✗ /broken-page                       (1 error, 0 warnings)

Top issues with fixes
  ERR  [article-missing-publisher] × 1
        Article should have publisher with name and logo for Top Stories...
   fix: Add "publisher" as Organization with name + logo. Logo must be
        ≥600×60 (wide) for Top Stories carousel — different from
        Organization.logo (square). Many sites confuse the two.
```

The fix line is the part that matters. It's the difference between "I see
something is broken" and "here's exactly what to change."

## What this catches that other tools miss

A real example from my own deploy: I had a template change that stripped
`publisher.logo` from all article pages. Google's Rich Results Test still
showed "valid" because publisher logo is "recommended" not "required." My
existing CI didn't catch it. Six weeks later, AI Overview citations dropped
~40%.

`schemaguardian` would have caught it on the first PR with:

```
WARN [article-missing-publisher-logo] × 47
     Article publisher should include logo (≥600×60) for Top Stories...
fix: ...
```

47 articles, one warning code, immediate signal.

## Try it

```bash
npx @moonye/schemaguardian check https://your-site.com
```

Source: https://github.com/moonye6/faq (cli/ subdirectory)

The validator is generic — works on any site, not just sites built with
my generators. If you find a rejection pattern not covered by the hint
catalog, PRs welcome.
````

---

## B5 — Awesome list PRs

**Strategy:** Pick 6-8 well-maintained "awesome" lists, file PRs adding a
single entry. Low effort, compounds over years (these lists rank high in
Google for "best X tools").

**Target lists** (sorted by likelihood of acceptance):

| List | Repo | Suggested section |
|---|---|---|
| awesome-cli-apps | agarrharr/awesome-cli-apps | Development → SEO / Validation |
| awesome-nodejs | sindresorhus/awesome-nodejs | Misc → SEO |
| awesome-seo | marcobiedermann/awesome-seo | Tools → Schema |
| awesome-seo-tools | gajus/awesome-seo-tools | (top-level entry) |
| awesome-static-website-services | agarrharr/awesome-static-website-services | SEO |
| awesome-astro | one-aalam/awesome-astro | Tools (since the site is built with Astro) |
| awesome-structured-data | (search GitHub) | (top-level) |

**PR title:**

```
Add schemaguardian (CLI for JSON-LD validation with fix hints)
```

**PR body:**

```
This PR adds [schemaguardian](https://github.com/moonye6/faq), an
MIT-licensed CLI for validating schema.org JSON-LD structured data with
actionable fix hints (60+ curated patterns).

I'm the author. Adding here because:
- Free, zero deps, works on any site
- 13 schema types covered (FAQ, Product, Article, HowTo, Recipe, Review,
  LocalBusiness, Event, Breadcrumb, Organization, Course, JobPosting, Video)
- CI integration: `npx @moonye/schemaguardian init` writes a GitHub
  Actions workflow in one command
- Fix hints are the differentiator vs other validators — every error
  ships with the specific change to make

If this isn't a fit for the list, no worries — happy to remove or adjust
the framing. Thanks for maintaining a great resource.
```

**Suggested entry text** (Markdown):

```markdown
- [schemaguardian](https://github.com/moonye6/faq) - JSON-LD schema validator
  with actionable fix hints. Validates a single URL, an HTML file, or an
  entire sitemap. CI-friendly. MIT licensed.
```

**Tips:**
- Spread PRs across 1-2 weeks. Filing 8 PRs in one day looks coordinated.
- Each list maintainer has different style preferences. Read the contribution
  guide and recent merged PRs before submitting.
- If a maintainer asks for changes, accept. Don't argue. Acceptance > perfect
  framing.
- Keep a tracker: which lists merged, which are pending, which rejected.
  Rejected ones can usually be re-attempted in 6 months with more proof
  of usage (GitHub stars, downloads).

---

## Tracking

Keep a simple log of what was posted where and the result:

```
Date       | Channel        | Outcome                              | Notes
-----------|----------------|--------------------------------------|--------
2026-05-XX | Show HN        | Front page #14, 8K visits, 47 stars  | ...
2026-05-XX | Reddit r/SEO   | 230 upvotes, 89 comments              | ...
2026-05-XX | dev.to article | 1.2K views, 12 reactions             | ...
2026-05-XX | awesome-cli    | Merged                                | ...
2026-05-XX | awesome-seo    | Pending                               | ...
```

This becomes the data that decides Phase D — whether to keep pushing
external signals or shift to the next round of content.
