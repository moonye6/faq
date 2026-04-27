#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { runCheck } from '~/commands/check';
import { runScan } from '~/commands/scan';
import { runInit } from '~/commands/init';

const VERSION = '0.3.0';

const HELP = `schemaguardian ${VERSION}

Validate JSON-LD structured data on URLs, HTML files, or whole sites.

USAGE
  schemaguardian <command> [options] [target]

COMMANDS
  check <url|file>     Validate a single URL or local HTML file.
  scan  <site-url>     Walk a site's sitemap.xml and validate every page.
  init                 Generate a .github/workflows/schemaguardian.yml template.
  help                 Show this help.
  version              Show version.

OPTIONS for check
  --ci                 Exit non-zero if any error is found.
  --json               Output machine-readable JSON.
  --no-color           Disable ANSI color codes.

OPTIONS for scan
  --sitemap <url>      Use this sitemap URL instead of auto-discovering.
  --limit <n>          Max URLs to scan (default 100).
  --concurrency <n>    Parallel requests (default 4).
  --ci                 Exit non-zero on any error or fetch failure.
  --json               Output machine-readable JSON.
  --no-color           Disable ANSI color codes.

OPTIONS for init
  --url <url>          Set the site URL in the generated workflow.
  --command <name>     check | scan (default scan).
  --target <path>      Output file path (default .github/workflows/schemaguardian.yml).
  --force              Overwrite if the target file already exists.

EXAMPLES
  schemaguardian check https://faqjsonld.com/faq-schema-generator
  schemaguardian check ./dist/index.html --ci
  schemaguardian scan https://faqjsonld.com --ci
  schemaguardian scan https://example.com --limit 25 --concurrency 8
  schemaguardian init --url https://my-site.com --command scan
  schemaguardian check https://example.com --json | jq '.blocks[0].issues'

CI INTEGRATION
  In .github/workflows/seo.yml:

    - run: npx --yes @moonye/schemaguardian@latest scan https://my-site.com --ci

  Or run \`schemaguardian init\` once and commit the generated workflow.

LEARN MORE
  https://faqjsonld.com/cli — full docs.
  https://github.com/moonye6/faq — source.
`;

function showHelp(): void {
  process.stdout.write(HELP);
}

function showVersion(): void {
  process.stdout.write(`schemaguardian ${VERSION}\n`);
}

function fail(msg: string, code = 2): number {
  process.stderr.write(`schemaguardian: ${msg}\n`);
  process.stderr.write(`Run "schemaguardian help" for usage.\n`);
  return code;
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2);

  if (argv.length === 0 || argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    showHelp();
    return 0;
  }
  if (argv[0] === 'version' || argv[0] === '--version' || argv[0] === '-v') {
    showVersion();
    return 0;
  }

  const cmd = argv[0];
  const rest = argv.slice(1);

  if (cmd === 'check') {
    let parsed;
    try {
      parsed = parseArgs({
        args: rest,
        options: {
          ci: { type: 'boolean', default: false },
          json: { type: 'boolean', default: false },
          'no-color': { type: 'boolean', default: false },
        },
        allowPositionals: true,
      });
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
    const target = parsed.positionals[0];
    if (!target) {
      return fail('check requires a URL or file path. Example: schemaguardian check https://faqjsonld.com');
    }
    return await runCheck({
      target,
      ci: parsed.values.ci as boolean,
      json: parsed.values.json as boolean,
      noColor: parsed.values['no-color'] as boolean,
    });
  }

  if (cmd === 'scan') {
    let parsed;
    try {
      parsed = parseArgs({
        args: rest,
        options: {
          sitemap: { type: 'string' },
          limit: { type: 'string', default: '100' },
          concurrency: { type: 'string', default: '4' },
          ci: { type: 'boolean', default: false },
          json: { type: 'boolean', default: false },
          'no-color': { type: 'boolean', default: false },
        },
        allowPositionals: true,
      });
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
    const target = parsed.positionals[0];
    if (!target) {
      return fail('scan requires a site URL. Example: schemaguardian scan https://faqjsonld.com');
    }
    const limit = Number.parseInt(parsed.values.limit as string, 10);
    const concurrency = Number.parseInt(parsed.values.concurrency as string, 10);
    if (!Number.isFinite(limit) || limit < 1) return fail('--limit must be a positive integer.');
    if (!Number.isFinite(concurrency) || concurrency < 1 || concurrency > 32) {
      return fail('--concurrency must be between 1 and 32.');
    }
    return await runScan({
      target,
      sitemap: parsed.values.sitemap as string | undefined,
      limit,
      concurrency,
      ci: parsed.values.ci as boolean,
      json: parsed.values.json as boolean,
      noColor: parsed.values['no-color'] as boolean,
    });
  }

  if (cmd === 'init') {
    let parsed;
    try {
      parsed = parseArgs({
        args: rest,
        options: {
          url: { type: 'string' },
          command: { type: 'string', default: 'scan' },
          target: { type: 'string' },
          force: { type: 'boolean', default: false },
        },
        allowPositionals: false,
      });
    } catch (e) {
      return fail(e instanceof Error ? e.message : String(e));
    }
    const command = parsed.values.command as string;
    if (command !== 'check' && command !== 'scan') {
      return fail(`--command must be "check" or "scan", got "${command}".`);
    }
    return await runInit({
      url: parsed.values.url as string | undefined,
      target: parsed.values.target as string | undefined,
      command,
      force: parsed.values.force as boolean,
    });
  }

  return fail(`unknown command "${cmd}"`);
}

main().then(
  (code) => process.exit(code),
  (e) => {
    process.stderr.write(`schemaguardian: unexpected error: ${e instanceof Error ? e.stack : String(e)}\n`);
    process.exit(1);
  },
);
