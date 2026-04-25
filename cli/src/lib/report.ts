import type { Issue } from './validators';
import type { JsonLdBlock } from './extract';

export interface BlockResult {
  block: JsonLdBlock;
  schemaType: string;
  issues: Issue[];
}

export interface CheckResult {
  target: string;
  blocksFound: number;
  blocks: BlockResult[];
}

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const GREEN = '\x1b[32m';
const CYAN = '\x1b[36m';

export function formatHuman(result: CheckResult, useColor = true): string {
  const c = (code: string, s: string) => (useColor ? `${code}${s}${RESET}` : s);
  const lines: string[] = [];
  lines.push(c(BOLD, `schemaguardian check ${result.target}`));
  lines.push('');

  if (result.blocksFound === 0) {
    lines.push(c(YELLOW, '⚠  No JSON-LD blocks found.'));
    lines.push(
      c(DIM, '   The page either has no structured data, or its <script> tags do not')
    );
    lines.push(
      c(DIM, '   use type="application/ld+json". Microdata and RDFa are not yet supported.')
    );
    return lines.join('\n');
  }

  lines.push(c(DIM, `Found ${result.blocksFound} JSON-LD block(s).`));
  lines.push('');

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const br of result.blocks) {
    const errors = br.issues.filter((i) => i.severity === 'error').length;
    const warnings = br.issues.filter((i) => i.severity === 'warning').length;
    totalErrors += errors;
    totalWarnings += warnings;

    const marker =
      errors > 0
        ? c(RED, '✗')
        : warnings > 0
          ? c(YELLOW, '!')
          : c(GREEN, '✓');
    lines.push(
      `${marker} block #${br.block.position} ${c(CYAN, `[@type=${br.schemaType || 'unknown'}]`)}` +
        (br.block.parseError ? c(RED, ' — JSON parse error') : ''),
    );

    if (br.block.parseError) {
      lines.push(c(RED, `   ${br.block.parseError}`));
    }

    for (const issue of br.issues) {
      const sev = issue.severity;
      const tag =
        sev === 'error' ? c(RED, 'ERR ') : sev === 'warning' ? c(YELLOW, 'WARN') : c(BLUE, 'INFO');
      const path = issue.path ? c(DIM, ` (${issue.path})`) : '';
      lines.push(`   ${tag}  ${issue.message}${path}`);
      lines.push(c(DIM, `         code: ${issue.code}`));
    }
    lines.push('');
  }

  // Summary footer
  if (totalErrors === 0 && totalWarnings === 0) {
    lines.push(c(GREEN, `Result: clean (${result.blocksFound} blocks, 0 errors, 0 warnings).`));
  } else {
    const parts: string[] = [];
    if (totalErrors > 0) parts.push(c(RED, `${totalErrors} error(s)`));
    if (totalWarnings > 0) parts.push(c(YELLOW, `${totalWarnings} warning(s)`));
    lines.push(`Result: ${parts.join(', ')} across ${result.blocksFound} block(s).`);
  }

  return lines.join('\n');
}

export function formatJson(result: CheckResult): string {
  return JSON.stringify(result, null, 2);
}

export function exitCodeFor(result: CheckResult): number {
  for (const br of result.blocks) {
    if (br.block.parseError) return 1;
    for (const i of br.issues) if (i.severity === 'error') return 1;
  }
  return 0;
}
