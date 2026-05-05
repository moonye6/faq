import { useEffect, useMemo, useState } from 'preact/hooks';
import { validateBlock, type Issue } from '~/lib/validation/validators';
import { annotateHints } from '~/lib/validation/hints';

interface ValidationResult {
  blocksFound: number;
  blocks: Array<{
    schemaType: string;
    parseError?: string;
    issues: Issue[];
  }>;
  inputError?: string;
}

const SAMPLE_VALID_FAQ = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping is 3-5 business days within the US. Express is 1-2 business days."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free returns within 30 days of delivery. Items must be unworn with original tags."
      }
    }
  ]
}
</script>`;

const SAMPLE_BROKEN_ARTICLE = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "How AI Search Changed SEO in 2026",
  "author": "Alex Chen"
}
</script>`;

const SAMPLE_PRODUCT_NO_OFFER = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Acme Pro Wireless Headphones",
  "image": "https://example.com/headphones.jpg",
  "description": "Over-ear wireless headphones with active noise cancellation."
}
</script>`;

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

// Extract JSON-LD blocks from a string. Handles:
// - Bare JSON objects/arrays
// - Full <script type="application/ld+json"> tags (one or many)
function extractJsonLdBlocks(input: string): Array<{ raw: string; parsed?: unknown; parseError?: string }> {
  const trimmed = input.trim();
  if (!trimmed) return [];

  // Try script tag extraction first
  const scriptRegex = /<script[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi;
  const matches = [...trimmed.matchAll(scriptRegex)];
  if (matches.length > 0) {
    return matches.map((m) => {
      const raw = (m[1] ?? '').trim();
      try {
        return { raw, parsed: JSON.parse(raw) };
      } catch (e) {
        return { raw, parseError: e instanceof Error ? e.message : String(e) };
      }
    });
  }

  // Otherwise treat the whole input as JSON
  try {
    return [{ raw: trimmed, parsed: JSON.parse(trimmed) }];
  } catch (e) {
    return [{ raw: trimmed, parseError: e instanceof Error ? e.message : String(e) }];
  }
}

function getTypeStr(parsed: unknown): string {
  if (!isObj(parsed)) return '';
  const t = parsed['@type'];
  if (typeof t === 'string') return t;
  if (Array.isArray(t)) return t.filter((x) => typeof x === 'string').join('+');
  return '';
}

function validate(input: string): ValidationResult {
  if (!input.trim()) {
    return { blocksFound: 0, blocks: [] };
  }

  const blocks = extractJsonLdBlocks(input);
  if (blocks.length === 0) {
    return { blocksFound: 0, blocks: [], inputError: 'No JSON or <script type="application/ld+json"> block found.' };
  }

  return {
    blocksFound: blocks.length,
    blocks: blocks.map((b) => {
      let issues: Issue[];
      if (b.parseError) {
        issues = [
          {
            severity: 'error',
            code: 'json-parse',
            message: `JSON parse failed: ${b.parseError}`,
          },
        ];
      } else if (Array.isArray(b.parsed)) {
        // @graph or array root: validate each entry
        issues = b.parsed.flatMap((entry) => validateBlock(entry));
      } else {
        issues = validateBlock(b.parsed);
      }
      annotateHints(issues);
      return {
        schemaType: getTypeStr(b.parsed),
        parseError: b.parseError,
        issues,
      };
    }),
  };
}

export default function SchemaValidator() {
  const [input, setInput] = useState<string>('');
  const [debouncedInput, setDebouncedInput] = useState<string>('');

  // Debounce input changes for validation (300ms)
  useEffect(() => {
    const t = setTimeout(() => setDebouncedInput(input), 300);
    return () => clearTimeout(t);
  }, [input]);

  const result = useMemo(() => validate(debouncedInput), [debouncedInput]);

  const totalErrors = result.blocks.reduce(
    (sum, b) => sum + b.issues.filter((i) => i.severity === 'error').length,
    0,
  );
  const totalWarnings = result.blocks.reduce(
    (sum, b) => sum + b.issues.filter((i) => i.severity === 'warning').length,
    0,
  );

  function loadSample(sample: string) {
    setInput(sample);
    setDebouncedInput(sample);
  }

  function clearInput() {
    setInput('');
    setDebouncedInput('');
  }

  return (
    <div class="validator">
      <div class="validator-toolbar">
        <span class="validator-toolbar-label">Try a sample:</span>
        <button type="button" class="sample-btn" onClick={() => loadSample(SAMPLE_VALID_FAQ)}>
          Valid FAQ
        </button>
        <button type="button" class="sample-btn" onClick={() => loadSample(SAMPLE_BROKEN_ARTICLE)}>
          Broken Article
        </button>
        <button type="button" class="sample-btn" onClick={() => loadSample(SAMPLE_PRODUCT_NO_OFFER)}>
          Incomplete Product
        </button>
        {input && (
          <button type="button" class="sample-btn sample-btn-clear" onClick={clearInput}>
            Clear
          </button>
        )}
      </div>

      <textarea
        class="validator-input"
        rows={14}
        placeholder={'Paste your JSON-LD here. Either the bare JSON object, or the full <script type="application/ld+json">...</script> tag.\n\nValidation runs as you type — no button to click.'}
        value={input}
        onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)}
        spellcheck={false}
      />

      {!debouncedInput.trim() ? (
        <div class="validator-empty">
          <p>Paste JSON-LD above or load a sample to validate.</p>
        </div>
      ) : result.inputError ? (
        <div class="validator-empty validator-input-error">
          <p>{result.inputError}</p>
        </div>
      ) : (
        <div class="validator-results">
          <div class={`validator-summary${totalErrors > 0 ? ' validator-summary-error' : totalWarnings > 0 ? ' validator-summary-warning' : ' validator-summary-clean'}`}>
            {totalErrors > 0 && <strong>{totalErrors} error{totalErrors === 1 ? '' : 's'}</strong>}
            {totalErrors > 0 && totalWarnings > 0 && <span class="dot"> · </span>}
            {totalWarnings > 0 && <strong>{totalWarnings} warning{totalWarnings === 1 ? '' : 's'}</strong>}
            {totalErrors === 0 && totalWarnings === 0 && <strong>Clean</strong>}
            <span class="validator-summary-block-count">
              across {result.blocksFound} block{result.blocksFound === 1 ? '' : 's'}
            </span>
          </div>

          {result.blocks.map((block, idx) => (
            <div class="validator-block" key={idx}>
              <div class="validator-block-header">
                <span class="validator-block-num">Block #{idx + 1}</span>
                {block.schemaType && (
                  <span class="validator-block-type">@type={block.schemaType}</span>
                )}
                {block.issues.length === 0 && <span class="validator-block-clean">✓ no issues</span>}
              </div>
              {block.issues.length > 0 && (
                <ul class="validator-issue-list">
                  {block.issues.map((issue, i) => (
                    <li class={`validator-issue validator-issue-${issue.severity}`} key={i}>
                      <div class="validator-issue-line">
                        <span class={`validator-issue-tag validator-issue-tag-${issue.severity}`}>
                          {issue.severity === 'error' ? 'ERR' : issue.severity === 'warning' ? 'WARN' : 'INFO'}
                        </span>
                        <span class="validator-issue-message">{issue.message}</span>
                      </div>
                      <div class="validator-issue-meta">
                        <span class="validator-issue-code">code: {issue.code}</span>
                        {issue.path && <span class="validator-issue-path">path: {issue.path}</span>}
                      </div>
                      {issue.hint && (
                        <div class="validator-issue-fix">
                          <span class="validator-issue-fix-label">fix:</span>
                          <span>{issue.hint}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
