# Google Search Console — Setup Checklist

One-time, ~10 minutes total. You do this manually because GSC requires
your Google account.

## 1. Add the property

1. Go to https://search.google.com/search-console
2. Click "Add property"
3. Choose **Domain** (preferred, covers all subdomains + protocols) — enter `faqjsonld.com`
   - Or **URL prefix** if you only want to track `https://faqjsonld.com` exactly

## 2. Verify ownership

For **Domain** verification, GSC will give you a TXT record to add to
your DNS:

```
TXT  @  google-site-verification=<some-long-string>
```

Where to add it depends on your DNS provider:

- **Vercel** (you bought the domain through Vercel?): Vercel dashboard → Domain Settings → DNS Records → add TXT
- **Cloudflare**: DNS tab → Add record → Type: TXT, Name: @, Value: the verification string
- **Namecheap / GoDaddy / etc.**: DNS Management → add TXT record

Wait 1-30 minutes for DNS to propagate (usually ~5 min on modern DNS).
Click "Verify" in GSC.

If Domain verification is too slow or you do not own DNS, fall back to
**URL prefix** verification:

- Download the HTML file GSC provides (e.g., `googleXXXXX.html`)
- Drop it into `public/` of this repo
- Push (Vercel auto-deploys)
- Verify in GSC

## 3. Submit the sitemap

Once verified:

1. Sidebar → **Sitemaps**
2. Add a new sitemap: `sitemap-index.xml`
3. Click Submit

GSC will fetch `https://faqjsonld.com/sitemap-index.xml`, follow it to
`/sitemap-0.xml`, and start indexing the URLs listed.

You should see "Success" within a few minutes. The "URLs discovered"
counter takes longer (24-72 hours typically) to populate.

## 4. Watch the Performance report

Sidebar → **Performance** → **Search results**

For the first 1-2 weeks, you will see almost nothing. Indexing takes
time, and your site is brand new with no backlinks. Patterns to watch
once data starts flowing:

- **Impressions per query** — which queries are surfacing your pages
- **CTR** — your title + meta description's appeal
- **Average position** — where you rank in the SERP
- **Top pages** — which pages drive the most impressions

For the schema generator matrix specifically:
- Watch each `/{type}-schema-generator` page individually
- Compare impressions on `breadcrumb-schema-generator` vs `faq-schema-generator`
  — early signal of which keywords have less competition
- The `/blog/` posts will likely take longer to rank but drive more
  qualified traffic when they do

## 5. (Optional) Bing Webmaster Tools

Bing has a similar tool at https://www.bing.com/webmasters. Same
process: add property, verify (DNS or HTML file), submit sitemap.

Bing matters more in 2026 than it used to because:
- Microsoft Copilot uses Bing's index for AI search
- ChatGPT search also uses Bing as one of its retrieval sources
- Verifying gives you separate impression data

## 6. Index inspection (when you push new content)

For any new high-priority page (especially the new blog posts), you can
manually request indexing:

1. GSC → URL Inspection → paste the full URL (e.g., `https://faqjsonld.com/blog/google-faq-deprecation-2026`)
2. Click "Request indexing"

Google will crawl it within 24-48 hours instead of waiting for the
natural crawl cycle (which can be days to weeks for new domains).

There is a daily quota (~10 URL inspections/day). Use it on:
- New blog posts immediately after publish
- The `/cli` page after any significant update
- Any of the 12 schema generator pages where copy meaningfully changed

## What you do NOT need to do

- **Do not** submit individual URLs unless they have already been
  indexed. The sitemap is the right primary tool.
- **Do not** worry about disavow lists. New domain, no toxic backlinks
  to disavow.
- **Do not** manually add hreflang or canonical tags via GSC. The site
  already emits them via Astro.
- **Do not** install a separate analytics tool just for GSC. GSC's own
  reports are sufficient for the metrics you care about (impressions,
  CTR, position, queries).

## What to check back on after setup

- **Day 3-7:** Sitemap should show "Success" and "URLs discovered: 16+"
- **Day 7-14:** First Performance data should appear
- **Day 30:** Begin looking at query trends — which schema-type keywords
  are picking up impressions
- **Day 60-90:** Decide which schema types deserve deeper landing pages
  based on real impression data (not the qualitative SERP recon in
  `keyword-research-2026-04-25.md`)

## Quick links

- GSC: https://search.google.com/search-console
- Sitemap URL: `https://faqjsonld.com/sitemap-index.xml`
- Property type: **Domain** recommended (with DNS TXT verification)
- Bing Webmaster: https://www.bing.com/webmasters
