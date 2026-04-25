// @ts-check
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';

const SITE = process.env.SITE_URL ?? 'https://faq-schema-platform.example.com';

export default defineConfig({
  site: SITE,
  integrations: [preact(), sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
