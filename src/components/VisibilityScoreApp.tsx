import { useEffect, useMemo, useState } from 'preact/hooks';
import type { VisibilityScoreResult, DimensionResult } from '~/lib/visibility-score';

interface Props {
  /** Optional URL passed via ?url= for shareable reports. */
  initialUrl?: string;
}

type State =
  | { kind: 'idle' }
  | { kind: 'loading'; url: string }
  | { kind: 'result'; result: VisibilityScoreResult }
  | { kind: 'error'; message: string };

const BAND_LABEL: Record<VisibilityScoreResult['scoreBand'], string> = {
  critical: 'Critical',
  poor: 'Poor',
  ok: 'OK',
  good: 'Good',
  excellent: 'Excellent',
};

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^[\w.-]+\.\w+/.test(trimmed)) return `https://${trimmed}`;
  return null;
}

function statusChar(status: 'pass' | 'warn' | 'fail'): string {
  return status === 'pass' ? '✓' : status === 'warn' ? '!' : '✗';
}

function pct(d: DimensionResult): number {
  return d.maxPoints === 0 ? 0 : Math.round((d.points / d.maxPoints) * 100);
}

const CATEGORY_LABEL: Record<DimensionResult['category'], string> = {
  schema: 'Schema',
  content: 'Content',
  entity: 'Entity',
  distribution: 'Distribution',
  technical: 'Technical',
};

export default function VisibilityScoreApp({ initialUrl }: Props) {
  const [input, setInput] = useState<string>(initialUrl ?? '');
  const [state, setState] = useState<State>({ kind: 'idle' });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialUrl) {
      void run(initialUrl);
    }
  }, [initialUrl]);

  async function run(rawUrl: string) {
    const norm = normalizeUrl(rawUrl);
    if (!norm) {
      setState({ kind: 'error', message: 'Enter a full URL like https://example.com/page' });
      return;
    }
    setState({ kind: 'loading', url: norm });
    setExpanded({});
    try {
      const u = new URL('/api/visibility-score', window.location.origin);
      u.searchParams.set('url', norm);
      const res = await fetch(u.toString());
      if (!res.ok) {
        const text = await res.text();
        let detail = text;
        try { detail = JSON.parse(text).error ?? text; } catch {}
        setState({ kind: 'error', message: `Server returned ${res.status}: ${detail}` });
        return;
      }
      const result = (await res.json()) as VisibilityScoreResult;
      if (result.status !== 'ok') {
        setState({ kind: 'error', message: result.fetchError ?? 'Could not fetch or parse the URL.' });
        return;
      }
      setState({ kind: 'result', result });
      // Update URL bar with ?url= for shareability without reloading
      const shareUrl = new URL(window.location.href);
      shareUrl.searchParams.set('url', norm);
      window.history.replaceState({}, '', shareUrl.toString());
    } catch (e) {
      setState({ kind: 'error', message: e instanceof Error ? e.message : String(e) });
    }
  }

  function onSubmit(e: Event) {
    e.preventDefault();
    void run(input);
  }

  function reset() {
    setState({ kind: 'idle' });
    setExpanded({});
    const shareUrl = new URL(window.location.href);
    shareUrl.searchParams.delete('url');
    window.history.replaceState({}, '', shareUrl.toString());
  }

  const shareUrl = useMemo(() => {
    if (state.kind !== 'result') return null;
    const u = new URL(window.location.href);
    u.searchParams.set('url', state.result.url);
    return u.toString();
  }, [state]);

  const copyShare = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // ignore — older browsers
    }
  };

  return (
    <div class="vscore">
      <form class="vscore-form" onSubmit={onSubmit}>
        <input
          type="url"
          class="vscore-input"
          placeholder="https://your-site.com/some-page"
          value={input}
          onInput={(e) => setInput((e.target as HTMLInputElement).value)}
          required
          autocomplete="off"
          spellcheck={false}
        />
        <button
          type="submit"
          class="cta cta-primary vscore-submit"
          disabled={state.kind === 'loading'}
        >
          {state.kind === 'loading' ? 'Scoring...' : 'Check AI visibility'}
        </button>
      </form>

      {state.kind === 'loading' && (
        <div class="vscore-loading">
          <p>Fetching <code>{state.url}</code>…</p>
          <p class="vscore-loading-detail">
            Parsing JSON-LD, checking robots.txt, evaluating 10 dimensions. Takes 3-8 seconds.
          </p>
        </div>
      )}

      {state.kind === 'error' && (
        <div class="vscore-error">
          <p><strong>Could not score this URL.</strong></p>
          <p>{state.message}</p>
          <button type="button" class="sample-btn" onClick={reset}>Try a different URL</button>
        </div>
      )}

      {state.kind === 'result' && (
        <div class="vscore-result">
          <header class={`vscore-summary vscore-band-${state.result.scoreBand}`}>
            <div class="vscore-summary-number">
              <span class="vscore-summary-value">{state.result.scoreLabel}</span>
              <span class="vscore-summary-max">/100</span>
            </div>
            <div class="vscore-summary-meta">
              <div class="vscore-summary-band">{BAND_LABEL[state.result.scoreBand]}</div>
              <p class="vscore-summary-url">
                Scored <a href={state.result.url} rel="noopener nofollow" target="_blank">{state.result.url}</a>
              </p>
              <p class="vscore-summary-counts">
                <span class="vscore-stat vscore-stat-pass">✓ {state.result.summary.pass} pass</span>
                <span class="vscore-stat vscore-stat-warn">! {state.result.summary.warn} warn</span>
                <span class="vscore-stat vscore-stat-fail">✗ {state.result.summary.fail} fail</span>
              </p>
              <p class="vscore-summary-types">
                Schema types found: <code>{state.result.summary.schemaTypes.join(', ') || 'none'}</code>
              </p>
              <div class="vscore-summary-actions">
                <button type="button" class="sample-btn" onClick={reset}>Score another URL</button>
                {shareUrl && (
                  <button type="button" class="sample-btn" onClick={copyShare}>Copy shareable link</button>
                )}
              </div>
            </div>
          </header>

          <div class="vscore-dimension-list">
            {state.result.dimensions.map((d) => (
              <article class={`vscore-dimension vscore-status-${d.status}`} key={d.id}>
                <header
                  class="vscore-dimension-header"
                  onClick={() => setExpanded((prev) => ({ ...prev, [d.id]: !prev[d.id] }))}
                  role="button"
                  tabIndex={0}
                  aria-expanded={!!expanded[d.id]}
                >
                  <span class={`vscore-status-icon vscore-status-icon-${d.status}`}>{statusChar(d.status)}</span>
                  <span class="vscore-dimension-name">{d.name}</span>
                  <span class="vscore-dimension-category">{CATEGORY_LABEL[d.category]}</span>
                  <span class="vscore-dimension-points">
                    {d.points}<span class="vscore-dimension-points-max">/{d.maxPoints}</span>
                  </span>
                  <span class="vscore-dimension-bar">
                    <span class={`vscore-dimension-bar-fill vscore-status-bar-${d.status}`} style={`width: ${pct(d)}%`} />
                  </span>
                  <span class="vscore-dimension-toggle" aria-hidden="true">{expanded[d.id] ? '−' : '+'}</span>
                </header>
                <div class="vscore-dimension-summary">{d.summary}</div>
                {expanded[d.id] && (
                  <div class="vscore-dimension-detail">
                    <ul class="vscore-signal-list">
                      {d.signals.map((s, i) => (
                        <li class={s.ok ? 'vscore-signal-ok' : 'vscore-signal-bad'} key={i}>
                          <span class="vscore-signal-icon">{s.ok ? '✓' : '✗'}</span>
                          <span class="vscore-signal-label">{s.label}</span>
                          <span class="vscore-signal-value">{s.value}</span>
                        </li>
                      ))}
                    </ul>
                    {d.fix && (
                      <div class="vscore-fix">
                        <span class="vscore-fix-label">Fix:</span>
                        <span class="vscore-fix-text">{d.fix}</span>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
