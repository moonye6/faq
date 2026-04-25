#!/usr/bin/env node
import { parseArgs } from 'node:util';
import { runCheck } from '~/commands/check';

const VERSION = '0.1.0';

const HELP = `schemaguard ${VERSION}

Validate JSON-LD structured data on URLs and HTML files.

USAGE
  schemaguard <command> [options] [target]

COMMANDS
  check <url|file>     Fetch the URL or read the file, extract every JSON-LD
                       block, and validate against schema.org rules plus common
                       Google rejection conditions.
  help                 Show this help.
  version              Show version.

OPTIONS for check
  --ci                 Exit non-zero if any error is found. Use this in CI.
  --json               Output machine-readable JSON instead of human format.
  --no-color           Disable ANSI color codes.

EXAMPLES
  schemaguard check https://faqjsonld.com/faq-schema-generator
  schemaguard check ./dist/index.html --ci
  schemaguard check https://example.com --json | jq '.blocks[0].issues'

CI INTEGRATION
  In .github/workflows/seo.yml:

    - run: npx schemaguard check \${{ env.PREVIEW_URL }} --ci

  In package.json:

    "scripts": { "schema:check": "schemaguard check https://faqjsonld.com --ci" }

LEARN MORE
  https://faqjsonld.com — free schema generators built for the AI search era.
  https://github.com/moonye6/faq — source.
`;

function showHelp(): void {
  process.stdout.write(HELP);
}

function showVersion(): void {
  process.stdout.write(`schemaguard ${VERSION}\n`);
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
      const msg = e instanceof Error ? e.message : String(e);
      process.stderr.write(`schemaguard: ${msg}\n`);
      process.stderr.write(`Run "schemaguard help" for usage.\n`);
      return 2;
    }
    const target = parsed.positionals[0];
    if (!target) {
      process.stderr.write('schemaguard: check requires a URL or file path.\n');
      process.stderr.write('Example: schemaguard check https://faqjsonld.com\n');
      return 2;
    }
    return await runCheck({
      target,
      ci: parsed.values.ci as boolean,
      json: parsed.values.json as boolean,
      noColor: parsed.values['no-color'] as boolean,
    });
  }

  process.stderr.write(`schemaguard: unknown command "${cmd}"\n`);
  process.stderr.write(`Run "schemaguard help" for usage.\n`);
  return 2;
}

main().then(
  (code) => process.exit(code),
  (e) => {
    process.stderr.write(`schemaguard: unexpected error: ${e instanceof Error ? e.stack : String(e)}\n`);
    process.exit(1);
  },
);
