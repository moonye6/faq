import { extractJsonLdBlocks, fetchHtml } from '~/lib/extract';
import { validateBlock, type Issue } from '~/lib/validators';
import {
  exitCodeFor,
  formatHuman,
  formatJson,
  type BlockResult,
  type CheckResult,
} from '~/lib/report';

export interface CheckOptions {
  target: string;
  json?: boolean;
  ci?: boolean;
  noColor?: boolean;
}

function getTypeStr(parsed: unknown): string {
  if (typeof parsed !== 'object' || parsed === null) return '';
  const t = (parsed as Record<string, unknown>)['@type'];
  if (typeof t === 'string') return t;
  if (Array.isArray(t)) return t.filter((x) => typeof x === 'string').join('+');
  return '';
}

export async function runCheck(opts: CheckOptions): Promise<number> {
  let html: string;
  try {
    html = await fetchHtml(opts.target);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (opts.json) {
      process.stdout.write(JSON.stringify({ error: msg }, null, 2) + '\n');
    } else {
      process.stderr.write(`schemaguard: failed to fetch ${opts.target}: ${msg}\n`);
    }
    return 1;
  }

  const blocks = extractJsonLdBlocks(html);
  const blockResults: BlockResult[] = blocks.map((b) => {
    let issues: Issue[] = [];
    if (b.parseError) {
      issues = [
        {
          severity: 'error',
          code: 'json-parse',
          message: `JSON parse failed: ${b.parseError}`,
        },
      ];
    } else {
      issues = validateBlock(b.parsed);
    }
    return {
      block: b,
      schemaType: getTypeStr(b.parsed),
      issues,
    };
  });

  const result: CheckResult = {
    target: opts.target,
    blocksFound: blocks.length,
    blocks: blockResults,
  };

  if (opts.json) {
    process.stdout.write(formatJson(result) + '\n');
  } else {
    process.stdout.write(formatHuman(result, !opts.noColor) + '\n');
  }

  if (opts.ci) {
    return exitCodeFor(result);
  }
  return 0;
}
