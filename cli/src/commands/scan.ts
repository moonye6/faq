import { extractJsonLdBlocks, fetchHtml } from '~/lib/extract';
import { validateBlock, type Issue } from '~/lib/validators';
import { annotateHints, FIX_HINTS } from '~/lib/hints';
import { fetchSitemap, discoverSitemap } from '~/lib/sitemap';

export interface ScanOptions {
  target: string;
  sitemap?: string;
  limit: number;
  concurrency: number;
  ci?: boolean;
  json?: boolean;
  noColor?: boolean;
}

export interface IssueCount {
  code: string;
  severity: Issue['severity'];
  count: number;
  exampleMessage: string;
  hint?: string;
}

export interface PageResult {
  url: string;
  status: 'ok' | 'errors' | 'warnings' | 'no-schema' | 'fetch-error';
  fetchError?: string;
  blocksFound: number;
  schemaTypes: string[];
  errors: number;
  warnings: number;
  issueCodes: string[];
}

export interface ScanResult {
  sitemap: string;
  totalUrlsInSitemap: number;
  scanned: number;
  limited: boolean;
  pages: PageResult[];
  summary: {
    ok: number;
    withErrors: number;
    withWarnings: number;
    fetchErrors: number;
    missingSchema: number;
    schemaTypeCounts: Record<string, number>;
    totalErrors: number;
    totalWarnings: number;
    issueBreakdown: IssueCount[];
  };
}

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';
const BLUE = '\x1b[34m';

function getTypeStr(parsed: unknown): string {
  if (typeof parsed !== 'object' || parsed === null) return '';
  const t = (parsed as Record<string, unknown>)['@type'];
  if (typeof t === 'string') return t;
  if (Array.isArray(t)) return t.filter((x) => typeof x === 'string').join('+');
  return '';
}

async function batch<T, R>(
  items: T[],
  size: number,
  fn: (item: T, idx: number) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size);
    const results = await Promise.all(slice.map((it, j) => fn(it, i + j)));
    out.push(...results);
  }
  return out;
}

interface PageResultInternal extends PageResult {
  issues: Issue[];
}

async function checkPage(url: string): Promise<PageResultInternal> {
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (e) {
    return {
      url,
      status: 'fetch-error',
      fetchError: e instanceof Error ? e.message : String(e),
      blocksFound: 0,
      schemaTypes: [],
      errors: 0,
      warnings: 0,
      issueCodes: [],
      issues: [],
    };
  }

  const blocks = extractJsonLdBlocks(html);
  if (blocks.length === 0) {
    return {
      url,
      status: 'no-schema',
      blocksFound: 0,
      schemaTypes: [],
      errors: 0,
      warnings: 0,
      issueCodes: [],
      issues: [],
    };
  }

  let errors = 0;
  let warnings = 0;
  const types: string[] = [];
  const allIssues: Issue[] = [];

  for (const b of blocks) {
    const t = getTypeStr(b.parsed);
    if (t) types.push(t);

    let issues: Issue[];
    if (b.parseError) {
      issues = [{ severity: 'error', code: 'json-parse', message: b.parseError }];
    } else {
      issues = validateBlock(b.parsed);
    }
    annotateHints(issues);
    for (const i of issues) {
      if (i.severity === 'error') errors += 1;
      else if (i.severity === 'warning') warnings += 1;
    }
    allIssues.push(...issues);
  }

  let status: PageResult['status'];
  if (errors > 0) status = 'errors';
  else if (warnings > 0) status = 'warnings';
  else status = 'ok';

  return {
    url,
    status,
    blocksFound: blocks.length,
    schemaTypes: types,
    errors,
    warnings,
    issueCodes: dedupe(allIssues.map((i) => i.code)),
    issues: allIssues,
  };
}

export async function runScan(opts: ScanOptions): Promise<number> {
  let sitemapUrl = opts.sitemap;
  let smap;

  if (!sitemapUrl) {
    if (opts.target.match(/\bsitemap.*\.xml$/i)) {
      sitemapUrl = opts.target;
    } else {
      try {
        sitemapUrl = await discoverSitemap(opts.target);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (opts.json) {
          process.stdout.write(JSON.stringify({ error: msg }, null, 2) + '\n');
        } else {
          process.stderr.write(`schemaguardian: ${msg}\n`);
        }
        return 1;
      }
    }
  }

  try {
    smap = await fetchSitemap(sitemapUrl);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) {
      process.stdout.write(JSON.stringify({ error: msg }, null, 2) + '\n');
    } else {
      process.stderr.write(`schemaguardian: ${msg}\n`);
    }
    return 1;
  }

  const total = smap.urls.length;
  const limited = total > opts.limit;
  const urlsToScan = smap.urls.slice(0, opts.limit);

  if (!opts.json) {
    const c = (col: string, s: string) => (opts.noColor ? s : `${col}${s}${RESET}`);
    process.stdout.write(c(BOLD, `schemaguardian scan ${opts.target}\n`));
    process.stdout.write('\n');
    process.stdout.write(c(DIM, `Sitemap: ${smap.sitemapUrl}\n`));
    if (smap.childSitemapsFollowed > 0) {
      process.stdout.write(c(DIM, `Child sitemaps followed: ${smap.childSitemapsFollowed}\n`));
    }
    process.stdout.write(
      c(DIM, `Found ${total} URL(s)${limited ? `, scanning first ${opts.limit}` : ''}, concurrency=${opts.concurrency}\n\n`),
    );
  }

  const internalResults = await batch(urlsToScan, opts.concurrency, checkPage);

  // Aggregate summary
  const issueBreakdownMap = new Map<string, IssueCount>();
  const summary: ScanResult['summary'] = {
    ok: 0,
    withErrors: 0,
    withWarnings: 0,
    fetchErrors: 0,
    missingSchema: 0,
    schemaTypeCounts: {},
    totalErrors: 0,
    totalWarnings: 0,
    issueBreakdown: [],
  };
  for (const r of internalResults) {
    if (r.status === 'ok') summary.ok += 1;
    else if (r.status === 'errors') summary.withErrors += 1;
    else if (r.status === 'warnings') summary.withWarnings += 1;
    else if (r.status === 'no-schema') summary.missingSchema += 1;
    else if (r.status === 'fetch-error') summary.fetchErrors += 1;
    summary.totalErrors += r.errors;
    summary.totalWarnings += r.warnings;
    for (const t of r.schemaTypes) {
      summary.schemaTypeCounts[t] = (summary.schemaTypeCounts[t] ?? 0) + 1;
    }
    for (const issue of r.issues) {
      if (issue.severity === 'info') continue;
      const existing = issueBreakdownMap.get(issue.code);
      if (existing) {
        existing.count += 1;
      } else {
        issueBreakdownMap.set(issue.code, {
          code: issue.code,
          severity: issue.severity,
          count: 1,
          exampleMessage: issue.message,
          hint: issue.hint ?? FIX_HINTS[issue.code],
        });
      }
    }
  }
  summary.issueBreakdown = [...issueBreakdownMap.values()].sort((a, b) => {
    if (a.severity !== b.severity) return a.severity === 'error' ? -1 : 1;
    return b.count - a.count;
  });

  // Strip internal-only issues array from public PageResult
  const pages: PageResult[] = internalResults.map((r) => {
    const { issues: _issues, ...rest } = r;
    return rest;
  });

  const result: ScanResult = {
    sitemap: smap.sitemapUrl,
    totalUrlsInSitemap: total,
    scanned: pages.length,
    limited,
    pages,
    summary,
  };

  if (opts.json) {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  } else {
    process.stdout.write(formatScanHuman(result, opts) + '\n');
  }

  if (opts.ci) {
    if (summary.totalErrors > 0 || summary.fetchErrors > 0) return 1;
  }
  return 0;
}

function formatScanHuman(result: ScanResult, opts: ScanOptions): string {
  const c = (col: string, s: string) => (opts.noColor ? s : `${col}${s}${RESET}`);
  const lines: string[] = [];

  // Per-page lines
  // Compute path length for alignment
  const paths = result.pages.map((p) => relativePath(p.url, opts.target));
  const maxPath = Math.min(60, Math.max(20, ...paths.map((p) => p.length)));

  for (let i = 0; i < result.pages.length; i += 1) {
    const p = result.pages[i]!;
    const path = paths[i]!;
    let marker: string;
    let detail: string;
    switch (p.status) {
      case 'ok':
        marker = c(GREEN, '✓');
        detail = c(DIM, `(${p.blocksFound} block${p.blocksFound === 1 ? '' : 's'}: ${dedupe(p.schemaTypes).join(', ')})`);
        break;
      case 'warnings':
        marker = c(YELLOW, '!');
        detail = c(DIM, `(${p.blocksFound} blocks, ${p.warnings} warning${p.warnings === 1 ? '' : 's'})`);
        break;
      case 'errors':
        marker = c(RED, '✗');
        detail = c(RED, `(${p.errors} error${p.errors === 1 ? '' : 's'}, ${p.warnings} warning${p.warnings === 1 ? '' : 's'})`);
        break;
      case 'no-schema':
        marker = c(BLUE, '○');
        detail = c(BLUE, '(no JSON-LD found)');
        break;
      case 'fetch-error':
        marker = c(RED, '✗');
        detail = c(RED, `(fetch failed: ${p.fetchError})`);
        break;
    }
    lines.push(`${marker} ${path.padEnd(maxPath)}  ${detail}`);
  }
  lines.push('');

  // Summary
  lines.push(c(BOLD, 'Summary'));
  lines.push(`  Scanned        ${result.scanned} of ${result.totalUrlsInSitemap}${result.limited ? ' (limited)' : ''}`);
  lines.push(`  Clean          ${c(GREEN, String(result.summary.ok))}`);
  lines.push(`  Warnings       ${c(YELLOW, String(result.summary.withWarnings))}`);
  lines.push(`  Errors         ${c(RED, String(result.summary.withErrors))}`);
  lines.push(`  No schema      ${c(BLUE, String(result.summary.missingSchema))}`);
  lines.push(`  Fetch failures ${c(RED, String(result.summary.fetchErrors))}`);
  lines.push(`  Total errors   ${result.summary.totalErrors}`);
  lines.push(`  Total warnings ${result.summary.totalWarnings}`);

  if (Object.keys(result.summary.schemaTypeCounts).length > 0) {
    lines.push('');
    lines.push(c(BOLD, 'Schema types found'));
    const sorted = Object.entries(result.summary.schemaTypeCounts).sort(
      (a, b) => b[1] - a[1],
    );
    for (const [type, count] of sorted) {
      lines.push(`  ${c(CYAN, type.padEnd(24))} ${count} page${count === 1 ? '' : 's'}`);
    }
  }

  if (result.summary.missingSchema > 0) {
    lines.push('');
    lines.push(c(BOLD, c(BLUE, 'Pages with no structured data')));
    for (const p of result.pages) {
      if (p.status === 'no-schema') {
        lines.push(`  ${relativePath(p.url, opts.target)}`);
      }
    }
  }

  if (result.summary.issueBreakdown.length > 0) {
    lines.push('');
    lines.push(c(BOLD, 'Top issues with fixes'));
    const top = result.summary.issueBreakdown.slice(0, 8);
    for (const issue of top) {
      const tag =
        issue.severity === 'error' ? c(RED, 'ERR ') : c(YELLOW, 'WARN');
      lines.push(`  ${tag} [${c(CYAN, issue.code)}] × ${issue.count}`);
      lines.push(c(DIM, `        ${issue.exampleMessage}`));
      if (issue.hint) {
        lines.push(c(CYAN, `   fix: ${wrapText(issue.hint, 76, '        ')}`));
      }
    }
    if (result.summary.issueBreakdown.length > top.length) {
      lines.push(
        c(DIM, `  …and ${result.summary.issueBreakdown.length - top.length} more issue code(s). Use --json for the full breakdown.`),
      );
    }
  }

  lines.push('');
  if (result.summary.totalErrors === 0 && result.summary.fetchErrors === 0) {
    lines.push(c(GREEN, `Result: clean (${result.summary.ok} ok, ${result.summary.withWarnings} warnings, ${result.summary.missingSchema} missing).`));
  } else {
    lines.push(c(RED, `Result: ${result.summary.totalErrors} error(s) across ${result.summary.withErrors} page(s); ${result.summary.fetchErrors} fetch failure(s).`));
  }
  return lines.join('\n');
}

function wrapText(text: string, width: number, indent: string): string {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if (line.length === 0) {
      line = w;
    } else if (line.length + 1 + w.length > width) {
      lines.push(line);
      line = w;
    } else {
      line += ' ' + w;
    }
  }
  if (line) lines.push(line);
  return lines.join('\n' + indent);
}

function relativePath(url: string, base: string): string {
  if (url.startsWith(base)) {
    const rest = url.slice(base.length);
    return rest || '/';
  }
  try {
    const u = new URL(url);
    return u.pathname || '/';
  } catch {
    return url;
  }
}

function dedupe<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}
