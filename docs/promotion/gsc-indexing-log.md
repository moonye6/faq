# GSC Indexing Request Log

Tracking which URLs have been submitted via Google Search Console's
"Request Indexing" button. GSC has a daily quota (~10-12 requests per
property per day), so this needs to span multiple days.

After submission, check status in `Indexing → Pages` after 1-3 days.
"URL is on Google" = success. "Discovered/Crawled - currently not
indexed" = Google saw it but chose not to index (means quality signal
issue, not the request itself).

---

## 2026-05-05 batch (Day 1)

**Quota hit at:** `course-schema-generator` (the 12th submission)

### ✅ Submitted (11 URLs, bottom-up order)

```
/job-posting-schema-generator
/blog/how-faq-schema-powers-ai-citation
/blog/how-product-schema-powers-ai-citation
/blog/how-howto-schema-powers-ai-citation
/blog/how-article-schema-powers-ai-citation
/blog/how-organization-schema-powers-ai-citation
/blog/how-breadcrumb-schema-powers-ai-citation
/blog/how-local-business-schema-powers-ai-citation
/blog/how-video-schema-powers-ai-citation
/blog/google-faq-deprecation-2026
/blog/geo-aeo-explained
```

### ❌ Quota-blocked (1 URL — re-submit Day 2)

```
/course-schema-generator
```

### ⏳ Not yet submitted (16 URLs — submit Day 2 after quota reset)

**Tier 1 priority (do these first when quota resets):**

```
/                                  ← homepage, MOST IMPORTANT
/faq-schema-generator               ← primary wedge page
/faq-schema-validator               ← new differentiator
/product-schema-generator
/article-schema-generator
/schema-types
/cli
/blog
```

**Tier 2:**

```
/breadcrumb-schema-generator
/local-business-schema-generator
/video-schema-generator
/recipe-schema-generator
/organization-schema-generator
/howto-schema-generator
/review-schema-generator
/event-schema-generator
```

---

## Day 2 plan (~2026-05-06 18:00 UTC, ~24h after quota hit)

Quota resets after ~24h. Submit Tier 1 first (8 URLs), then if quota
allows, course-schema-generator + Tier 2 (9 URLs total = 17 remaining).
If quota blocks again, day 3 finishes the rest.

**Important:** Day-2 submission is more meaningful than Day-1's because
the Phase A4/A5/C changes (internal links, /faq-schema-validator,
homepage redesign) are now LIVE on production. Re-submitting won't
hurt; Google re-evaluates each request against current page state.

---

## Status check (run on Day 3-5)

After 48-72h, in GSC `Indexing → Pages`:
- Count how many of the 28 are now "On Google" vs the original 2
- Count how many are still "Crawled - not indexed" vs "Discovered"
- The delta tells us if the Phase A internal-linking + Phase C
  validator differentiation moved Google's quality assessment

If Day-3 indexed count is still ≤5, the bottleneck is external trust
signals, not technical. That's when Phase B (Show HN, Reddit, awesome
lists) becomes the only lever left.
