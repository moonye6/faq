// Server endpoint for /ai-visibility-score.
// Hybrid mode: this single route runs on Vercel serverless.
// Fetches the target URL + robots.txt, runs scoring, returns JSON.

import type { APIRoute } from 'astro';
import { fetchAndScore } from '~/lib/visibility-score';

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
  const target = url.searchParams.get('url');
  if (!target) {
    return new Response(
      JSON.stringify({ error: 'Missing required query param: url' }),
      { status: 400, headers: { 'content-type': 'application/json' } },
    );
  }

  try {
    const result = await fetchAndScore(target);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        // Cache identical scores for 5 minutes to soften abuse
        'cache-control': 'public, max-age=300, s-maxage=300',
        'access-control-allow-origin': '*',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Internal error scoring the URL.',
        detail: e instanceof Error ? e.message : String(e),
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
};

export const POST: APIRoute = async ({ request }) => {
  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  if (!body.url) {
    return new Response(JSON.stringify({ error: 'Missing required field: url' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
  try {
    const result = await fetchAndScore(body.url);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: 'Internal error scoring the URL.',
        detail: e instanceof Error ? e.message : String(e),
      }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
};
