// Public library API for @moonye/schemaguardian.
//
// Lets downstream tools call the same validators the `schemaguardian
// check` CLI uses internally, without spawning a subprocess. Used by:
//   - seodiagnose.com (the AI SEO advisor web tool)
//   - third-party SEO platforms that want to embed validation logic
//   - test suites that want to assert validator behavior
//
// Behavior is guaranteed identical to `schemaguardian check --json`.
// Output shape matches `CheckResult` from the CLI.
//
// USAGE
//
//   import { checkHtml, validateBlock, extractJsonLdBlocks } from '@moonye/schemaguardian';
//
//   // Convenience: extract + validate in one call
//   const result = checkHtml('https://example.com', htmlString);
//   // → { target, blocksFound, blocks: [{ block, schemaType, issues }] }
//
//   // Or use the primitives directly
//   const blocks = extractJsonLdBlocks(htmlString);
//   for (const block of blocks) {
//     if (block.parseError) continue;
//     const issues = validateBlock(block.parsed);
//     // issues: Issue[] — { severity, code, message, path? }[]
//   }

import { extractJsonLdBlocks, type JsonLdBlock } from './lib/extract';
import { validateBlock, type Issue, type Severity } from './lib/validators';
import { annotateHints, FIX_HINTS } from './lib/hints';
import type { BlockResult, CheckResult } from './lib/report';

// Re-exports — the public API surface
export { extractJsonLdBlocks } from './lib/extract';
export { validateBlock } from './lib/validators';
export { annotateHints, FIX_HINTS } from './lib/hints';
export type { JsonLdBlock } from './lib/extract';
export type { Issue, Severity } from './lib/validators';
export type { BlockResult, CheckResult } from './lib/report';

/**
 * Convenience: extract JSON-LD blocks from an HTML string, validate
 * each one, and return a CheckResult in the same shape as the CLI's
 * `check --json` output.
 *
 * @param target  Identifier for the analyzed source (URL, file path, or
 *                arbitrary label). Echoed back in the result for context.
 * @param html    The HTML string to analyze.
 * @returns       CheckResult with per-block validation issues + schema types.
 */
export function checkHtml(target: string, html: string): CheckResult {
  const blocks = extractJsonLdBlocks(html);
  const blockResults: BlockResult[] = blocks.map((b) => {
    if (b.parseError) {
      return {
        block: b,
        schemaType: '',
        issues: annotateHints([
          {
            severity: 'error' as Severity,
            code: 'json-parse',
            message: b.parseError,
          },
        ]),
      };
    }
    const issues = annotateHints(validateBlock(b.parsed));
    const schemaType = getSchemaType(b.parsed);
    return { block: b, schemaType, issues };
  });
  return { target, blocksFound: blocks.length, blocks: blockResults };
}

function getSchemaType(node: unknown): string {
  if (typeof node !== 'object' || node === null) return '';
  const t = (node as Record<string, unknown>)['@type'];
  if (typeof t === 'string') return t;
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string').join('+');
  return '';
}

/**
 * Convenience: count issues by severity. Useful for health scoring or
 * summary lines. Counts across ALL blocks in the result.
 */
export function countBySeverity(result: CheckResult): Record<Severity, number> {
  const counts: Record<Severity, number> = { error: 0, warning: 0, info: 0 };
  for (const b of result.blocks) {
    for (const issue of b.issues) {
      counts[issue.severity] += 1;
    }
  }
  return counts;
}

// Library version is pinned to package version. CLI version constant
// lives in src/index.ts; keep both in sync at release time.
export const LIBRARY_VERSION = '0.4.0';
