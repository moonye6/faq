// AI Visibility Score — 10-dimension scoring of how visible a page/site is
// to AI search engines (Perplexity, ChatGPT, Gemini, Google AI Overviews).
//
// Design principles:
// 1. Transparent — every dimension shows what it checks and why.
// 2. Actionable — every gap ships with the specific fix.
// 3. Deterministic — same input always produces same score.
// 4. Heuristic-honest — scores are calibrated guesses, not measurements.

import { validateBlock, type Issue } from './validation/validators';
import { annotateHints } from './validation/hints';

export type DimensionStatus = 'pass' | 'warn' | 'fail';

export interface DimensionResult {
  id: string;
  name: string;
  category: 'schema' | 'content' | 'entity' | 'distribution' | 'technical';
  status: DimensionStatus;
  /** Points actually scored on this dimension (0..maxPoints). */
  points: number;
  maxPoints: number;
  /** One-line plain explanation of what was checked. */
  summary: string;
  /** Concrete fix or "you are good" message. */
  fix?: string;
  /** Sub-signals shown when the user expands the dimension. */
  signals: Array<{ label: string; value: string; ok: boolean }>;
}

export interface VisibilityScoreResult {
  url: string;
  fetchedAt: string;
  status: 'ok' | 'fetch-error' | 'parse-error';
  fetchError?: string;
  /** 0-100 weighted total. */
  totalScore: number;
  /** Rounded total for display. */
  scoreLabel: string;
  scoreBand: 'critical' | 'poor' | 'ok' | 'good' | 'excellent';
  dimensions: DimensionResult[];
  /** Counts per status, useful for summary cards. */
  summary: {
    pass: number;
    warn: number;
    fail: number;
    schemaTypes: string[];
  };
}

// --- Parse helpers (browser + Node compatible, no DOM dependency) ---

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function extractMatches(html: string, regex: RegExp): RegExpMatchArray[] {
  return [...html.matchAll(regex)];
}

function getMetaContent(html: string, nameOrProp: string): string | null {
  const re = new RegExp(`<meta\\s+(?:name|property)=["']${nameOrProp}["'][^>]*\\scontent=["']([^"']*)["']`, 'i');
  const m = html.match(re);
  if (m) return m[1] ?? null;
  // alternate attribute order
  const re2 = new RegExp(`<meta\\s+content=["']([^"']*)["'][^>]*\\s(?:name|property)=["']${nameOrProp}["']`, 'i');
  const m2 = html.match(re2);
  return m2 ? (m2[1] ?? null) : null;
}

function parseJsonLdBlocks(html: string): Array<{ parsed?: unknown; parseError?: string }> {
  const blocks = extractMatches(html, /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
  return blocks.map((m) => {
    const raw = (m[1] ?? '').trim();
    try {
      return { parsed: JSON.parse(raw) };
    } catch (e) {
      return { parseError: e instanceof Error ? e.message : String(e) };
    }
  });
}

/** Flatten JSON-LD blocks into individual schema entities (handles @graph). */
function flattenSchemaEntities(blocks: Array<{ parsed?: unknown }>): Array<Record<string, unknown>> {
  const out: Array<Record<string, unknown>> = [];
  for (const b of blocks) {
    if (!b.parsed) continue;
    if (Array.isArray(b.parsed)) {
      for (const item of b.parsed) if (isObj(item)) out.push(item);
    } else if (isObj(b.parsed)) {
      const graph = b.parsed['@graph'];
      if (Array.isArray(graph)) {
        for (const item of graph) if (isObj(item)) out.push(item);
      } else {
        out.push(b.parsed);
      }
    }
  }
  return out;
}

function getTypes(entity: Record<string, unknown>): string[] {
  const t = entity['@type'];
  if (typeof t === 'string') return [t];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string');
  return [];
}

function findEntitiesByType(entities: Array<Record<string, unknown>>, ...types: string[]): Array<Record<string, unknown>> {
  return entities.filter((e) => getTypes(e).some((t) => types.includes(t)));
}

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function countTags(html: string, tag: string): number {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>`, 'gi');
  return (html.match(re) || []).length;
}

// --- The 10 dimensions ---

// Weights sum to 100.
const WEIGHTS = {
  schemaCoverage: 18,
  atomicAnswers: 12,
  entityClarity: 12,
  authorAttribution: 10,
  chunkability: 10,
  citationReadiness: 10,
  aiBotAccessibility: 15,
  sitemapCanonical: 5,
  ogSocial: 5,
  technicalBasics: 3,
};

function dimSchemaCoverage(entities: Array<Record<string, unknown>>): DimensionResult {
  const types = new Set(entities.flatMap(getTypes));
  const keyTypes = ['FAQPage', 'Article', 'BlogPosting', 'NewsArticle', 'Organization', 'BreadcrumbList', 'Product', 'WebSite'];
  const found = keyTypes.filter((t) => types.has(t));
  const has = (...names: string[]) => names.some((n) => types.has(n));

  const signals = [
    { label: 'FAQPage schema', value: has('FAQPage') ? 'yes' : 'no', ok: has('FAQPage') },
    { label: 'Article / BlogPosting / NewsArticle', value: has('Article', 'BlogPosting', 'NewsArticle') ? 'yes' : 'no', ok: has('Article', 'BlogPosting', 'NewsArticle') },
    { label: 'Organization schema', value: has('Organization') ? 'yes' : 'no', ok: has('Organization') },
    { label: 'BreadcrumbList', value: has('BreadcrumbList') ? 'yes' : 'no', ok: has('BreadcrumbList') },
    { label: 'Total JSON-LD blocks parsed', value: String(entities.length), ok: entities.length > 0 },
  ];

  let points = 0;
  const max = WEIGHTS.schemaCoverage;
  // FAQPage: 6, Article-family: 4, Organization: 4, BreadcrumbList: 2, anything: 2
  if (entities.length > 0) points += 2;
  if (has('FAQPage')) points += 6;
  if (has('Article', 'BlogPosting', 'NewsArticle')) points += 4;
  if (has('Organization')) points += 4;
  if (has('BreadcrumbList')) points += 2;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  return {
    id: 'schema-coverage',
    name: 'Schema coverage',
    category: 'schema',
    status,
    points,
    maxPoints: max,
    summary: `Found ${entities.length} JSON-LD block(s) with ${types.size} schema type(s). Key types present: ${found.join(', ') || 'none'}.`,
    fix:
      status === 'pass'
        ? undefined
        : 'Add the missing high-leverage types. FAQPage drives AI citation, Article/BlogPosting provides attribution, Organization anchors your entity, BreadcrumbList helps both Google and AI engines understand site hierarchy. Generate at /faq-schema-generator and /article-schema-generator.',
    signals,
  };
}

function dimAtomicAnswers(entities: Array<Record<string, unknown>>): DimensionResult {
  const faqs = findEntitiesByType(entities, 'FAQPage');
  const max = WEIGHTS.atomicAnswers;

  if (faqs.length === 0) {
    return {
      id: 'atomic-answers',
      name: 'Atomic answer quality',
      category: 'content',
      status: 'fail',
      points: 0,
      maxPoints: max,
      summary: 'No FAQPage schema to analyze. Atomic Q&A is the highest-cite-rate content format in AI search.',
      fix: 'Add FAQPage schema with 4-8 Q&A pairs. Answers should be 40-120 words, lead with the direct answer, and avoid referring to other answers ("see Q3 above" hurts cite quality).',
      signals: [{ label: 'FAQPage blocks', value: '0', ok: false }],
    };
  }

  let total = 0;
  let shortGood = 0;
  let longBad = 0;
  let questionFormed = 0;
  for (const faq of faqs) {
    const main = (faq.mainEntity as unknown[]) ?? [];
    for (const q of main) {
      if (!isObj(q)) continue;
      total++;
      const name = String(q.name ?? '');
      if (name.trim().endsWith('?')) questionFormed++;
      const ans = q.acceptedAnswer;
      if (!isObj(ans)) continue;
      const txt = String(ans.text ?? '').trim();
      const len = txt.length;
      if (len > 0 && len <= 800) shortGood++;
      else if (len > 1500) longBad++;
    }
  }
  const pctShort = total > 0 ? shortGood / total : 0;
  const pctQuestion = total > 0 ? questionFormed / total : 0;

  let points = 0;
  if (total > 0) points += 3;
  if (total >= 4) points += 3;
  if (pctShort >= 0.7) points += 3;
  if (pctQuestion >= 0.7) points += 3;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'Total Q&A pairs', value: String(total), ok: total >= 4 },
    { label: 'Question-form names (end with ?)', value: `${questionFormed}/${total}`, ok: pctQuestion >= 0.7 },
    { label: 'Answers within citable length (≤800 chars)', value: `${shortGood}/${total}`, ok: pctShort >= 0.7 },
    { label: 'Answers too long (>1500 chars)', value: String(longBad), ok: longBad === 0 },
  ];

  return {
    id: 'atomic-answers',
    name: 'Atomic answer quality',
    category: 'content',
    status,
    points,
    maxPoints: max,
    summary: `${total} Q&A pair(s). ${shortGood}/${total} are within citable length, ${questionFormed}/${total} use question form.`,
    fix:
      status === 'pass'
        ? undefined
        : `Aim for 4-8 Q&A pairs per page. Each question should end with "?". Answers should be 40-120 words (under ~800 chars). Lead with the direct answer in sentence one.`,
    signals,
  };
}

function dimEntityClarity(entities: Array<Record<string, unknown>>): DimensionResult {
  const orgs = findEntitiesByType(entities, 'Organization', 'LocalBusiness');
  const max = WEIGHTS.entityClarity;

  if (orgs.length === 0) {
    return {
      id: 'entity-clarity',
      name: 'Entity clarity (Organization)',
      category: 'entity',
      status: 'fail',
      points: 0,
      maxPoints: max,
      summary: 'No Organization schema found. Without an entity anchor, AI engines pull brand facts from random aggregators.',
      fix: 'Add Organization schema on your homepage with a stable @id (e.g. https://yoursite.com/#organization), logo (square ≥600×600), and sameAs array linking to LinkedIn / Wikipedia / Crunchbase / Twitter / GitHub. Generate at /organization-schema-generator.',
      signals: [
        { label: 'Organization or LocalBusiness present', value: 'no', ok: false },
      ],
    };
  }

  const org = orgs[0]!;
  const sameAs = Array.isArray(org.sameAs) ? org.sameAs.filter((x) => typeof x === 'string') : [];
  const hasLogo = !!org.logo;
  const hasName = typeof org.name === 'string' && org.name.length > 0;
  const hasUrl = typeof org.url === 'string' && org.url.length > 0;
  const hasId = typeof org['@id'] === 'string';
  const hasDescription = typeof org.description === 'string' && org.description.length > 20;

  let points = 0;
  if (hasName) points += 2;
  if (hasUrl) points += 2;
  if (hasLogo) points += 2;
  if (sameAs.length >= 2) points += 2;
  if (sameAs.length >= 4) points += 1;
  if (hasId) points += 2;
  if (hasDescription) points += 1;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'Organization name', value: hasName ? String(org.name) : '—', ok: hasName },
    { label: 'url', value: hasUrl ? '✓' : '—', ok: hasUrl },
    { label: 'logo', value: hasLogo ? '✓' : '—', ok: hasLogo },
    { label: '@id (stable identifier)', value: hasId ? '✓' : '—', ok: hasId },
    { label: 'sameAs URLs', value: String(sameAs.length), ok: sameAs.length >= 2 },
    { label: 'description', value: hasDescription ? '✓' : '—', ok: hasDescription },
  ];

  return {
    id: 'entity-clarity',
    name: 'Entity clarity (Organization)',
    category: 'entity',
    status,
    points,
    maxPoints: max,
    summary: `Organization schema present. ${sameAs.length} sameAs URL(s), logo ${hasLogo ? 'set' : 'missing'}, @id ${hasId ? 'set' : 'missing'}.`,
    fix:
      status === 'pass'
        ? undefined
        : `Strengthen Organization: ${!hasLogo ? 'add logo (square ≥600×600); ' : ''}${sameAs.length < 4 ? 'add more sameAs URLs (LinkedIn, Wikipedia, Crunchbase, GitHub — aim for 4+); ' : ''}${!hasId ? 'add stable @id like https://yoursite.com/#organization; ' : ''}${!hasDescription ? 'add a description.' : ''}`,
    signals,
  };
}

function dimAuthorAttribution(entities: Array<Record<string, unknown>>): DimensionResult {
  const articles = findEntitiesByType(entities, 'Article', 'BlogPosting', 'NewsArticle');
  const max = WEIGHTS.authorAttribution;

  if (articles.length === 0) {
    // Not necessarily a fail if this is a generator/landing page. Mark as warn with low weight.
    return {
      id: 'author-attribution',
      name: 'Author attribution',
      category: 'entity',
      status: 'warn',
      points: Math.floor(max / 2),
      maxPoints: max,
      summary: 'No Article/BlogPosting schema. Author attribution applies to editorial content; this page may not need it.',
      fix: 'If this is an editorial / blog page, add Article schema with a Person author including url and sameAs (LinkedIn, Twitter). AI engines need attribution to cite content confidently.',
      signals: [{ label: 'Article-family blocks', value: '0', ok: false }],
    };
  }

  let withPersonAuthor = 0;
  let withSameAs = 0;
  let withPublisher = 0;
  let withDates = 0;
  for (const art of articles) {
    const author = art.author;
    if (isObj(author) && getTypes(author).includes('Person')) {
      withPersonAuthor++;
      if (Array.isArray(author.sameAs) && (author.sameAs as unknown[]).length > 0) withSameAs++;
    } else if (Array.isArray(author) && author.some((a) => isObj(a) && getTypes(a).includes('Person'))) {
      withPersonAuthor++;
    }
    if (isObj(art.publisher)) withPublisher++;
    if (art.datePublished) withDates++;
  }

  const totalArt = articles.length;
  let points = 0;
  if (withPersonAuthor === totalArt) points += 3;
  else if (withPersonAuthor > 0) points += 2;
  if (withSameAs > 0) points += 3;
  if (withPublisher === totalArt) points += 2;
  if (withDates === totalArt) points += 2;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'Articles with Person author', value: `${withPersonAuthor}/${totalArt}`, ok: withPersonAuthor === totalArt },
    { label: 'Articles with author sameAs URLs', value: `${withSameAs}/${totalArt}`, ok: withSameAs === totalArt },
    { label: 'Articles with publisher', value: `${withPublisher}/${totalArt}`, ok: withPublisher === totalArt },
    { label: 'Articles with datePublished', value: `${withDates}/${totalArt}`, ok: withDates === totalArt },
  ];

  return {
    id: 'author-attribution',
    name: 'Author attribution',
    category: 'entity',
    status,
    points,
    maxPoints: max,
    summary: `${totalArt} article(s). ${withPersonAuthor} with Person author, ${withSameAs} with sameAs URLs, ${withPublisher} with publisher, ${withDates} with dates.`,
    fix:
      status === 'pass'
        ? undefined
        : 'For every Article/BlogPosting: use Person author with url + sameAs (LinkedIn, Twitter, ORCID); set publisher to your Organization with logo; include datePublished. Plain string authors lose cite eligibility.',
    signals,
  };
}

function dimChunkability(html: string, textBody: string): DimensionResult {
  const max = WEIGHTS.chunkability;
  const h1Count = countTags(html, 'h1');
  const h2Count = countTags(html, 'h2');
  const h3Count = countTags(html, 'h3');
  const liCount = countTags(html, 'li');
  const pCount = countTags(html, 'p');
  const wordCount = textBody.split(/\s+/).filter(Boolean).length;
  const avgWordsPerP = pCount > 0 ? wordCount / pCount : 0;

  let points = 0;
  if (h1Count === 1) points += 2;
  else if (h1Count > 0) points += 1;
  if (h2Count >= 2) points += 2;
  if (h3Count >= 2) points += 1;
  if (liCount >= 6) points += 2;
  if (avgWordsPerP > 0 && avgWordsPerP <= 80) points += 3;
  else if (avgWordsPerP <= 120) points += 1;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'H1 tag', value: String(h1Count), ok: h1Count === 1 },
    { label: 'H2 tags', value: String(h2Count), ok: h2Count >= 2 },
    { label: 'H3 tags', value: String(h3Count), ok: h3Count >= 2 },
    { label: 'List items', value: String(liCount), ok: liCount >= 6 },
    { label: 'Avg words per paragraph', value: avgWordsPerP > 0 ? avgWordsPerP.toFixed(0) : '—', ok: avgWordsPerP > 0 && avgWordsPerP <= 80 },
    { label: 'Total word count', value: String(wordCount), ok: wordCount >= 300 },
  ];

  return {
    id: 'chunkability',
    name: 'Chunkability (structure)',
    category: 'content',
    status,
    points,
    maxPoints: max,
    summary: `Headings: ${h1Count} H1, ${h2Count} H2, ${h3Count} H3. Lists: ${liCount} items. Avg paragraph: ${avgWordsPerP.toFixed(0)} words.`,
    fix:
      status === 'pass'
        ? undefined
        : `AI engines chunk by structure. ${h1Count !== 1 ? 'Use exactly one H1; ' : ''}${h2Count < 2 ? 'add 2+ H2 sections; ' : ''}${avgWordsPerP > 80 ? 'shorten paragraphs (target ≤80 words); ' : ''}${liCount < 6 ? 'add bullet/numbered lists for atomic facts.' : ''}`,
    signals,
  };
}

function dimCitationReadiness(entities: Array<Record<string, unknown>>): DimensionResult {
  const max = WEIGHTS.citationReadiness;
  const articles = findEntitiesByType(entities, 'Article', 'BlogPosting', 'NewsArticle');
  const allWithDatePublished = articles.length > 0 && articles.every((a) => !!a.datePublished);
  const allWithDateModified = articles.length > 0 && articles.every((a) => !!a.dateModified);
  const allWithPublisherLogo = articles.length > 0 && articles.every((a) => {
    const pub = a.publisher;
    if (!isObj(pub)) return false;
    const logo = pub.logo;
    return !!logo;
  });
  const allWithImage = articles.length > 0 && articles.every((a) => !!a.image);

  let points = 0;
  if (articles.length > 0) points += 2;
  if (allWithDatePublished) points += 3;
  if (allWithDateModified) points += 2;
  if (allWithPublisherLogo) points += 2;
  if (allWithImage) points += 1;
  points = Math.min(max, points);

  // No articles → cannot fully evaluate, return warn with half points
  if (articles.length === 0) {
    return {
      id: 'citation-readiness',
      name: 'Citation readiness',
      category: 'content',
      status: 'warn',
      points: Math.floor(max / 2),
      maxPoints: max,
      summary: 'No Article-family schema. Citation readiness applies to editorial pages.',
      fix: 'If this is editorial content, add datePublished, dateModified, publisher with logo, and an image array (1×1, 4×3, 16×9 ratios).',
      signals: [{ label: 'Article blocks', value: '0', ok: false }],
    };
  }

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'datePublished on all articles', value: allWithDatePublished ? '✓' : '✗', ok: allWithDatePublished },
    { label: 'dateModified on all articles', value: allWithDateModified ? '✓' : '✗', ok: allWithDateModified },
    { label: 'publisher.logo on all articles', value: allWithPublisherLogo ? '✓' : '✗', ok: allWithPublisherLogo },
    { label: 'image on all articles', value: allWithImage ? '✓' : '✗', ok: allWithImage },
  ];

  return {
    id: 'citation-readiness',
    name: 'Citation readiness',
    category: 'content',
    status,
    points,
    maxPoints: max,
    summary: `${articles.length} article(s). Dates ${allWithDatePublished ? 'present' : 'missing'}, publisher logo ${allWithPublisherLogo ? 'present' : 'missing'}, image ${allWithImage ? 'present' : 'missing'}.`,
    fix:
      status === 'pass'
        ? undefined
        : `${!allWithDatePublished ? 'Add datePublished; ' : ''}${!allWithDateModified ? 'add dateModified; ' : ''}${!allWithPublisherLogo ? 'add publisher.logo (wide ≥600×60 for Top Stories); ' : ''}${!allWithImage ? 'add image array.' : ''}`,
    signals,
  };
}

export interface RobotsTxtSummary {
  fetched: boolean;
  text?: string;
  fetchError?: string;
}

function dimAiBotAccessibility(robots: RobotsTxtSummary): DimensionResult {
  const max = WEIGHTS.aiBotAccessibility;
  if (!robots.fetched || !robots.text) {
    return {
      id: 'ai-bot-accessibility',
      name: 'AI bot accessibility (robots.txt)',
      category: 'distribution',
      status: 'warn',
      points: Math.floor(max / 2),
      maxPoints: max,
      summary: robots.fetchError ? `robots.txt fetch failed: ${robots.fetchError}` : 'No robots.txt found.',
      fix: 'Add robots.txt at /robots.txt. Verify it does not Disallow GPTBot, ClaudeBot, Google-Extended, PerplexityBot, Applebot-Extended. These are the bots that crawl for AI citation.',
      signals: [{ label: 'robots.txt fetched', value: 'no', ok: false }],
    };
  }

  const txt = robots.text;
  const aiBots = ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot', 'Applebot-Extended', 'Bytespider', 'CCBot', 'meta-externalagent'];

  const blocked: string[] = [];
  // For each bot, check if there's a user-agent: <bot> followed by Disallow: /
  for (const bot of aiBots) {
    const re = new RegExp(`User-agent:\\s*${bot}\\b[\\s\\S]*?Disallow:\\s*\\/`, 'i');
    if (re.test(txt)) blocked.push(bot);
  }

  const criticalBlocked = blocked.filter((b) => ['GPTBot', 'ClaudeBot', 'Google-Extended', 'PerplexityBot'].includes(b));

  let points = max;
  if (criticalBlocked.length > 0) {
    // Block any critical bot → drop to ~10% of max
    points = Math.max(1, Math.floor(max * 0.1));
  } else if (blocked.length > 0) {
    // Block non-critical bot → drop to ~50% of max
    points = Math.floor(max * 0.5);
  }

  let status: DimensionStatus = 'pass';
  if (criticalBlocked.length > 0) status = 'fail';
  else if (blocked.length > 0) status = 'warn';

  const signals = [
    { label: 'GPTBot allowed', value: blocked.includes('GPTBot') ? '✗ blocked' : '✓ allowed', ok: !blocked.includes('GPTBot') },
    { label: 'ClaudeBot allowed', value: blocked.includes('ClaudeBot') ? '✗ blocked' : '✓ allowed', ok: !blocked.includes('ClaudeBot') },
    { label: 'Google-Extended (AI Overviews) allowed', value: blocked.includes('Google-Extended') ? '✗ blocked' : '✓ allowed', ok: !blocked.includes('Google-Extended') },
    { label: 'PerplexityBot allowed', value: blocked.includes('PerplexityBot') ? '✗ blocked' : '✓ allowed', ok: !blocked.includes('PerplexityBot') },
    { label: 'Applebot-Extended allowed', value: blocked.includes('Applebot-Extended') ? '✗ blocked' : '✓ allowed', ok: !blocked.includes('Applebot-Extended') },
  ];

  return {
    id: 'ai-bot-accessibility',
    name: 'AI bot accessibility (robots.txt)',
    category: 'distribution',
    status,
    points,
    maxPoints: max,
    summary: criticalBlocked.length > 0
      ? `CRITICAL: ${criticalBlocked.join(', ')} blocked in robots.txt. Site is invisible to those AI engines no matter how good the schema is.`
      : blocked.length > 0
      ? `Some AI bots blocked: ${blocked.join(', ')}. Major engines (GPTBot, ClaudeBot, Google-Extended, PerplexityBot) are allowed.`
      : 'All major AI crawlers allowed.',
    fix:
      criticalBlocked.length > 0
        ? `URGENT: remove Disallow rules for ${criticalBlocked.join(', ')} from robots.txt. If you use Cloudflare, check Bots → AI Crawl settings — Cloudflare auto-blocks these and overrides your robots.txt. Disable that setting in the Cloudflare dashboard. Without this, no schema optimization matters.`
        : blocked.length > 0
        ? `Consider unblocking ${blocked.join(', ')} unless you have a specific reason to opt out of those crawlers.`
        : undefined,
    signals,
  };
}

function dimSitemapCanonical(html: string, canonicalUrl: string | null, urlObj: URL): DimensionResult {
  const max = WEIGHTS.sitemapCanonical;
  const hasCanonical = !!canonicalUrl;
  const selfCanonical = canonicalUrl ? canonicalUrl.replace(/\/$/, '') === urlObj.href.replace(/\/$/, '') : false;
  const hasLangAttr = /<html[^>]*\blang=["'][^"']+["']/i.test(html);

  let points = 0;
  if (hasCanonical) points += 2;
  if (selfCanonical) points += 1;
  if (hasLangAttr) points += 1;
  if (urlObj.protocol === 'https:') points += 1;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'Canonical tag present', value: hasCanonical ? canonicalUrl ?? '—' : '—', ok: hasCanonical },
    { label: 'Self-canonical', value: selfCanonical ? '✓' : '✗', ok: selfCanonical },
    { label: 'HTML lang attribute', value: hasLangAttr ? '✓' : '✗', ok: hasLangAttr },
    { label: 'HTTPS', value: urlObj.protocol === 'https:' ? '✓' : '✗', ok: urlObj.protocol === 'https:' },
  ];

  return {
    id: 'sitemap-canonical',
    name: 'Canonical + basic SEO',
    category: 'technical',
    status,
    points,
    maxPoints: max,
    summary: `Canonical ${hasCanonical ? (selfCanonical ? '✓ self' : '✗ mismatch') : '✗ missing'}. lang ${hasLangAttr ? '✓' : '✗'}.`,
    fix:
      status === 'pass'
        ? undefined
        : `${!hasCanonical ? 'Add <link rel="canonical" href="..."> to <head>; ' : ''}${!selfCanonical && hasCanonical ? 'canonical should point to self, not another page; ' : ''}${!hasLangAttr ? 'add lang attribute to <html>.' : ''}`,
    signals,
  };
}

function dimOgSocial(html: string): DimensionResult {
  const max = WEIGHTS.ogSocial;
  const ogTitle = getMetaContent(html, 'og:title');
  const ogDescription = getMetaContent(html, 'og:description');
  const ogImage = getMetaContent(html, 'og:image');
  const ogImageW = getMetaContent(html, 'og:image:width');
  const twitterCard = getMetaContent(html, 'twitter:card');

  let points = 0;
  if (ogTitle) points += 1;
  if (ogDescription) points += 1;
  if (ogImage) points += 2;
  if (twitterCard) points += 1;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  const signals = [
    { label: 'og:title', value: ogTitle ? '✓' : '✗', ok: !!ogTitle },
    { label: 'og:description', value: ogDescription ? '✓' : '✗', ok: !!ogDescription },
    { label: 'og:image', value: ogImage ? '✓' : '✗', ok: !!ogImage },
    { label: 'og:image:width', value: ogImageW ?? '—', ok: !!ogImageW },
    { label: 'twitter:card', value: twitterCard ?? '✗', ok: !!twitterCard },
  ];

  return {
    id: 'og-social',
    name: 'OG / social meta',
    category: 'distribution',
    status,
    points,
    maxPoints: max,
    summary: `${ogTitle ? '✓' : '✗'} og:title  ${ogDescription ? '✓' : '✗'} og:description  ${ogImage ? '✓' : '✗'} og:image  ${twitterCard ? '✓' : '✗'} twitter:card`,
    fix:
      status === 'pass'
        ? undefined
        : `Add ${!ogTitle ? 'og:title, ' : ''}${!ogDescription ? 'og:description, ' : ''}${!ogImage ? 'og:image (1200×630px), ' : ''}${!twitterCard ? 'twitter:card.' : ''} These power how AI assistants and social platforms preview your page.`,
    signals,
  };
}

function dimTechnicalBasics(html: string, urlObj: URL): DimensionResult {
  const max = WEIGHTS.technicalBasics;
  const hasViewport = /<meta\s+name=["']viewport["']/i.test(html);
  const hasDescription = !!getMetaContent(html, 'description');
  const isHttps = urlObj.protocol === 'https:';

  let points = 0;
  if (hasViewport) points += 1;
  if (hasDescription) points += 1;
  if (isHttps) points += 1;
  points = Math.min(max, points);

  let status: DimensionStatus = 'fail';
  if (points >= max * 0.75) status = 'pass';
  else if (points >= max * 0.4) status = 'warn';

  return {
    id: 'technical-basics',
    name: 'Technical basics',
    category: 'technical',
    status,
    points,
    maxPoints: max,
    summary: `${isHttps ? '✓' : '✗'} HTTPS  ${hasViewport ? '✓' : '✗'} viewport  ${hasDescription ? '✓' : '✗'} meta description`,
    fix:
      status === 'pass'
        ? undefined
        : `${!isHttps ? 'Migrate to HTTPS; ' : ''}${!hasViewport ? 'add <meta name="viewport" content="width=device-width, initial-scale=1">; ' : ''}${!hasDescription ? 'add <meta name="description">.' : ''}`,
    signals: [
      { label: 'HTTPS', value: isHttps ? '✓' : '✗', ok: isHttps },
      { label: 'viewport meta', value: hasViewport ? '✓' : '✗', ok: hasViewport },
      { label: 'meta description', value: hasDescription ? '✓' : '✗', ok: hasDescription },
    ],
  };
}

// --- Main entry point ---

export interface ScoreInputs {
  url: string;
  html: string;
  robotsTxt: RobotsTxtSummary;
}

export function scoreVisibility(input: ScoreInputs): VisibilityScoreResult {
  const urlObj = new URL(input.url);
  const html = input.html;

  // Parse JSON-LD blocks
  const blocks = parseJsonLdBlocks(html);
  const entities = flattenSchemaEntities(blocks);
  const schemaTypes = Array.from(new Set(entities.flatMap(getTypes)));

  // Validator-level issues per block (used for additional context if needed)
  const issuePool: Issue[] = [];
  for (const b of blocks) {
    if (!b.parsed) continue;
    const block = Array.isArray(b.parsed)
      ? b.parsed
      : isObj(b.parsed) && Array.isArray((b.parsed as Record<string, unknown>)['@graph'])
        ? ((b.parsed as Record<string, unknown>)['@graph'] as unknown[])
        : [b.parsed];
    for (const item of block) {
      if (!isObj(item)) continue;
      issuePool.push(...validateBlock(item));
    }
  }
  annotateHints(issuePool);

  const canonicalMatch = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] ?? null : null;
  const textBody = stripTags(html);

  const dimensions: DimensionResult[] = [
    dimSchemaCoverage(entities),
    dimAtomicAnswers(entities),
    dimEntityClarity(entities),
    dimAuthorAttribution(entities),
    dimChunkability(html, textBody),
    dimCitationReadiness(entities),
    dimAiBotAccessibility(input.robotsTxt),
    dimSitemapCanonical(html, canonicalUrl, urlObj),
    dimOgSocial(html),
    dimTechnicalBasics(html, urlObj),
  ];

  const totalScore = dimensions.reduce((sum, d) => sum + d.points, 0);
  const summary = {
    pass: dimensions.filter((d) => d.status === 'pass').length,
    warn: dimensions.filter((d) => d.status === 'warn').length,
    fail: dimensions.filter((d) => d.status === 'fail').length,
    schemaTypes,
  };

  let scoreBand: VisibilityScoreResult['scoreBand'] = 'critical';
  if (totalScore >= 90) scoreBand = 'excellent';
  else if (totalScore >= 75) scoreBand = 'good';
  else if (totalScore >= 60) scoreBand = 'ok';
  else if (totalScore >= 40) scoreBand = 'poor';

  return {
    url: input.url,
    fetchedAt: new Date().toISOString(),
    status: 'ok',
    totalScore,
    scoreLabel: String(totalScore),
    scoreBand,
    dimensions,
    summary,
  };
}

/** Helper for the API endpoint: fetch HTML + robots.txt then score. */
export async function fetchAndScore(targetUrl: string): Promise<VisibilityScoreResult> {
  let url: URL;
  try {
    url = new URL(targetUrl);
  } catch {
    return {
      url: targetUrl,
      fetchedAt: new Date().toISOString(),
      status: 'parse-error',
      fetchError: 'Invalid URL. Use a full URL like https://example.com/page',
      totalScore: 0,
      scoreLabel: '—',
      scoreBand: 'critical',
      dimensions: [],
      summary: { pass: 0, warn: 0, fail: 0, schemaTypes: [] },
    };
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return {
      url: targetUrl,
      fetchedAt: new Date().toISOString(),
      status: 'parse-error',
      fetchError: 'URL must use http:// or https:// scheme.',
      totalScore: 0,
      scoreLabel: '—',
      scoreBand: 'critical',
      dimensions: [],
      summary: { pass: 0, warn: 0, fail: 0, schemaTypes: [] },
    };
  }

  let html = '';
  try {
    const res = await fetch(url.href, {
      headers: {
        'user-agent': 'schemaguardian-visibility-score/1.0 (+https://faqjsonld.com/ai-visibility-score)',
        accept: 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      return {
        url: targetUrl,
        fetchedAt: new Date().toISOString(),
        status: 'fetch-error',
        fetchError: `HTTP ${res.status} fetching ${url.href}`,
        totalScore: 0,
        scoreLabel: '—',
        scoreBand: 'critical',
        dimensions: [],
        summary: { pass: 0, warn: 0, fail: 0, schemaTypes: [] },
      };
    }
    html = await res.text();
  } catch (e) {
    return {
      url: targetUrl,
      fetchedAt: new Date().toISOString(),
      status: 'fetch-error',
      fetchError: e instanceof Error ? e.message : String(e),
      totalScore: 0,
      scoreLabel: '—',
      scoreBand: 'critical',
      dimensions: [],
      summary: { pass: 0, warn: 0, fail: 0, schemaTypes: [] },
    };
  }

  // Fetch robots.txt from the same origin
  const robotsUrl = `${url.protocol}//${url.host}/robots.txt`;
  let robotsTxt: RobotsTxtSummary = { fetched: false };
  try {
    const r = await fetch(robotsUrl, {
      headers: { 'user-agent': 'schemaguardian-visibility-score/1.0' },
      signal: AbortSignal.timeout(8000),
    });
    if (r.ok) {
      const text = await r.text();
      robotsTxt = { fetched: true, text };
    } else {
      robotsTxt = { fetched: false, fetchError: `HTTP ${r.status}` };
    }
  } catch (e) {
    robotsTxt = { fetched: false, fetchError: e instanceof Error ? e.message : String(e) };
  }

  return scoreVisibility({ url: url.href, html, robotsTxt });
}
