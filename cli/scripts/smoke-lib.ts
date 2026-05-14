// Smoke test the library entry point after build:
//   bun run build && bun run smoke:lib
//
// Verifies that:
//   1. The lib entry imports cleanly (no top-level side effects firing)
//   2. Public API symbols are present
//   3. checkHtml() runs against a sample HTML with FAQ schema

import {
  checkHtml,
  validateBlock,
  extractJsonLdBlocks,
  countBySeverity,
  LIBRARY_VERSION,
} from '../dist/lib.js';

const SAMPLE_HTML = `<!doctype html>
<html><head>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is schemaguardian?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "A JSON-LD validator CLI and library."
    }
  }]
}
</script>
</head><body></body></html>`;

function assert(cond: unknown, msg: string): void {
  if (!cond) {
    process.stderr.write(`FAIL: ${msg}\n`);
    process.exit(1);
  }
  process.stdout.write(`PASS: ${msg}\n`);
}

assert(typeof checkHtml === 'function', 'checkHtml is a function');
assert(typeof validateBlock === 'function', 'validateBlock is a function');
assert(typeof extractJsonLdBlocks === 'function', 'extractJsonLdBlocks is a function');
assert(typeof countBySeverity === 'function', 'countBySeverity is a function');
assert(LIBRARY_VERSION === '0.4.0', `LIBRARY_VERSION is 0.4.0 (got ${LIBRARY_VERSION})`);

const result = checkHtml('sample', SAMPLE_HTML);
assert(result.blocksFound === 1, 'extracted 1 JSON-LD block');
assert(result.blocks.length === 1, 'result.blocks has 1 entry');
const block = result.blocks[0]!;
assert(block.schemaType === 'FAQPage', `schemaType is FAQPage (got "${block.schemaType}")`);

const counts = countBySeverity(result);
assert(typeof counts.error === 'number', 'error count present');
assert(typeof counts.warning === 'number', 'warning count present');
assert(typeof counts.info === 'number', 'info count present');

// Should have at least the faq-rich-result-deprecated warning
assert(counts.warning >= 1, `warning count >= 1 (got ${counts.warning})`);

process.stdout.write(`\nschemaguardian library smoke test passed.\n`);
process.stdout.write(`Counts: ${JSON.stringify(counts)}\n`);
