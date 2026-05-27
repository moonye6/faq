// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

const SITE = process.env.SITE_URL ?? 'https://faqjsonld.com';

// Pages are static by default (prerender=true). API routes and individual
// pages can opt in to server-rendering by exporting `export const prerender = false`.
// Used by /api/visibility-score for server-side URL fetch + analysis.
export default defineConfig({
  site: SITE,
  output: 'static',
  adapter: vercel(),
  integrations: [preact(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
