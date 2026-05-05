# TODOS

Deferred follow-ups, ordered by ROI. Format: priority + concrete next action.

Each entry is one item. Don't over-plan — these are placeholders for work that
has already been thought through, so when the moment comes you can just execute.

---

## P1 — High value, do during next polish pass

### #1 — Reduce AI-engine name density in homepage FAQ answers

**Found by:** E2E verification on 2026-05-05 after D5 design pass.
**Where:** `src/pages/index.astro` — `homeFaqs` array, answers to Q3, Q4, Q5, Q6.

**Status:** D5 reduced occurrences from ~6+ sections to 2 (hero sub + FAQ Q2),
but the named-engine count in visible body text is still 28. Distribution:
- Hero sub: 4 (intentional — keep, this is the search-keyword touchpoint)
- FAQ Q2 question + answer: 7 (intentional — Q2 literally asks about those engines)
- FAQ Q3-Q6 answers: ~17 (NOT intentional — these can be genericized)

**Action:**
In `src/pages/index.astro`, edit the FAQ answers for Q3, Q4, Q5, Q6 to replace
specific engine names ("ChatGPT search, Perplexity, Gemini, and Google AI
Overviews") with "AI search engines" or "AI assistants". Keep Q2 untouched.
Expected drop: 28 → ~12.

**Why this matters (later):** AI overload signals to Google's quality
classifier (excessive proper-noun keyword density on a marketing page reads
as content farming). Once the site has external trust signals, reducing
this density makes the page feel more editorial.

**Effort:** human ~10 min / CC ~3 min. Trivial copy edit, no code changes.

**When to do it:** After Phase B external promotion completes and before
re-running design review. Or as a quick chore alongside any other home edits.

---

### #2 — Add image arrays to all 10 BlogPosting JSON-LD blocks

**Found by:** `schemaguardian scan https://faqjsonld.com` on 2026-05-05.
**Reported as:** `article-missing-image × 10` warning.

**Where:** All 10 files under `src/pages/blog/*.astro`.

**Status:** Each BlogPosting JSON-LD currently has no `image` field. Google's
Top Stories carousel + AI Overviews citation prefer image arrays at 1×1, 4×3,
16×9 aspect ratios, ≥1200px wide.

**Action options:**

**A) Quick fix (recommended for now):**
Add a single image field referencing the existing `/og-default.svg` to every
blog post's `articleJsonLd` block. Done in 5 minutes.

```ts
// In every blog post:
const articleJsonLd = jsonLdEnvelope({
  '@type': 'BlogPosting',
  headline: title,
  image: [`${site}/og-default.svg`], // <-- add this
  description,
  // ...
});
```

**B) Per-post hero images (better long-term):**
Generate a custom 1200×630 SVG/PNG per post, save to `public/blog/og/<slug>.png`,
reference as the post's `image` AND `ogImage` (BaseLayout already supports
`ogImage` prop). Adds visual identity per post + improves social card distinction.

Per-post images take ~2 hr human / 30 min CC for all 10 posts.

**Why this matters (later):** Top Stories eligibility + AI Overviews
citation rate. Currently we're losing both because of missing image data,
not because of weak content.

**When to do it:** Phase 11+ polish, OR after a blog post gets cited and
loses out to a competitor with images. Whichever first.

---

## P2 — Medium, do when relevant

### #3 — Generator page meta-description AI engine name density

Same problem as #1 but in the 13 generator page meta-descriptions
(`metaDescription` field in each `src/schemas/*.ts`). Each repeats
"Perplexity, ChatGPT, Gemini, Google AI Overviews" verbatim. Same fix as #1
— replace with "AI search engines" except 1-2 cases.

**Effort:** ~15 min for all 13 files.

**When:** Same time as #1.

---

### #4 — Real typography (not system stack)

Design review flagged `system-ui / -apple-system` as the "I gave up on
typography" signal. Currently the only thing keeping the site from a 10/10
design score.

**Action:** Pick a real typeface for headings (Söhne / Inter / IBM Plex / etc.)
and serif for long-form (Charter / Source Serif). Self-host woff2 in
`public/fonts/` to avoid CDN-tracking concerns.

**Effort:** Pick fonts ~30 min, integrate ~30 min. ~1 hr total.

**Why:** Visual differentiation. Makes the site feel like a product, not a
template.

**When:** When user has bandwidth to evaluate typeface options. Lower priority
than the SEO recovery work, higher than most other polish.

---

## P3 — Low, do only if specific signal triggers

### #5 — Single product-style page for "How to add FAQ schema"

Target query: `how to add faq schema to website` (~1.5K monthly searches).

**Status:** Currently covered by the `/faq-schema-generator` deepContent +
the blog post `how-faq-schema-powers-ai-citation`. If GSC shows we're
ranking for the query but at position 8-15, consider a dedicated landing
page with stronger keyword targeting. If we rank top 5 already, skip.

**When:** After Phase D data checkpoint (~2026-05-19). Decide based on actual
GSC query data.

---

### #6 — Auto-rotate Phase 7 blog post date

The 8 "How X Schema Powers AI Citation" series posts all have
`datePublished: '2026-04-25'` and `dateModified: '2026-04-25'`. Looks like
content farming to Google's freshness classifier.

**Action:** Spread `datePublished` across April 25, 26, 27 (3 per day) so
each post has a different date. `dateModified` can stay = published date
until we genuinely update.

**Effort:** ~5 min.

**Why:** Google penalizes simultaneous mass-publish patterns post-2024.

**When:** Same time as #1, #2, #3.

---

## Done log

Move completed items here, dated. Helps the future-self see what was actually
shipped vs deferred indefinitely.

(empty)
