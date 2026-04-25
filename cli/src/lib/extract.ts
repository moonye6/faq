/**
 * Extract JSON-LD blocks from HTML.
 * Regex-based for v0.1 — fragile against unusual whitespace but covers
 * 95%+ of real-world cases without a cheerio dependency.
 */

export interface JsonLdBlock {
  raw: string;
  parsed: unknown;
  parseError?: string;
  position: number;
}

const SCRIPT_RE =
  /<script\b[^>]*\btype\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;

export function extractJsonLdBlocks(html: string): JsonLdBlock[] {
  const out: JsonLdBlock[] = [];
  let pos = 0;
  for (const m of html.matchAll(SCRIPT_RE)) {
    const raw = (m[1] ?? '').trim();
    pos += 1;
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      out.push({ raw, parsed, position: pos });
    } catch (e) {
      out.push({
        raw,
        parsed: null,
        parseError: e instanceof Error ? e.message : String(e),
        position: pos,
      });
    }
  }
  return out;
}

export async function fetchHtml(target: string): Promise<string> {
  if (target.startsWith('http://') || target.startsWith('https://')) {
    const res = await fetch(target, {
      redirect: 'follow',
      headers: {
        'User-Agent':
          'schemaguard/0.1 (+https://faqjsonld.com) JSON-LD validator',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText} for ${target}`);
    }
    return await res.text();
  }
  const fs = await import('node:fs/promises');
  return await fs.readFile(target, 'utf8');
}
