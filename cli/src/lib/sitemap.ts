import { fetchHtml } from './extract';

const LOC_RE = /<loc>([^<]+)<\/loc>/gi;

export interface SitemapResult {
  sitemapUrl: string;
  urls: string[];
  childSitemapsFollowed: number;
}

/**
 * Fetch a sitemap (index or urlset). If it's a sitemap index, follow
 * children recursively. Returns deduplicated URLs.
 */
export async function fetchSitemap(
  sitemapUrl: string,
  maxDepth = 3,
): Promise<SitemapResult> {
  const seen = new Set<string>();
  let childSitemapsFollowed = 0;

  async function recurse(url: string, depth: number): Promise<void> {
    if (depth > maxDepth) return;
    let xml: string;
    try {
      xml = await fetchHtml(url);
    } catch (e) {
      throw new Error(
        `failed to fetch sitemap ${url}: ${e instanceof Error ? e.message : String(e)}`,
      );
    }

    const isIndex = /<sitemapindex\b/i.test(xml);
    const locs: string[] = [];
    for (const m of xml.matchAll(LOC_RE)) {
      const v = (m[1] ?? '').trim();
      if (v) locs.push(decodeXmlEntities(v));
    }

    if (isIndex) {
      childSitemapsFollowed += locs.length;
      for (const child of locs) {
        await recurse(child, depth + 1);
      }
    } else {
      for (const u of locs) seen.add(u);
    }
  }

  await recurse(sitemapUrl, 0);
  return {
    sitemapUrl,
    urls: [...seen],
    childSitemapsFollowed,
  };
}

/**
 * Try common sitemap locations under a base URL. Returns the first that
 * resolves successfully.
 */
export async function discoverSitemap(baseUrl: string): Promise<string> {
  const base = baseUrl.replace(/\/+$/, '');
  const candidates = [
    `${base}/sitemap-index.xml`,
    `${base}/sitemap.xml`,
    `${base}/sitemap_index.xml`,
  ];
  const errors: string[] = [];
  for (const url of candidates) {
    try {
      await fetchHtml(url);
      return url;
    } catch (e) {
      errors.push(`${url}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  throw new Error(
    `no sitemap found. Tried:\n${errors.map((e) => '  - ' + e).join('\n')}`,
  );
}

function decodeXmlEntities(s: string): string {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}
