import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const articleSchema: SchemaTypeDef = {
  id: 'article',
  slug: 'article-schema-generator',
  name: 'Article Schema Generator',
  schemaType: 'Article',

  title: 'Article Schema Generator | BlogPosting JSON-LD for News & Blog SEO',
  metaDescription:
    'Generate Article (BlogPosting / NewsArticle) JSON-LD for Google News, Discover, and AI search citation. Includes author, dates, publisher, and image fields.',
  h1: 'Article Schema Generator',
  intro:
    'Fill in headline, author, dates, and publisher. Get clean Article JSON-LD ready for Google News, Discover, and AI search citation.',
  geoAeoAngle:
    'Article schema is what Google News and Discover use to surface your post, and what AI search engines use to attribute citations to a specific author and publication date. AI assistants almost always prefer to cite content with clear author + date metadata over content without it. Article schema is the cheapest way to give them what they need.',

  pageFaqs: [
    {
      q: 'When should I use Article vs BlogPosting vs NewsArticle?',
      a: 'BlogPosting for blog posts. NewsArticle for news pieces (gets News tab consideration). Article as the generic catch-all. They share the same fields. If you publish a mix, pick the most specific type per page — search engines treat them differently in eligibility.',
    },
    {
      q: 'What fields does Google require for Article rich results?',
      a: 'Required: headline, image (1+ URLs, ideally 1200px+ wide), datePublished, author (with name and ideally url). Recommended: dateModified, publisher (with name and logo), description, articleBody. Without publisher logo, Top Stories carousel eligibility drops significantly.',
    },
    {
      q: 'Why does AI search care about Article schema?',
      a: 'When AI assistants cite content, they need to attribute it: "According to {author}, writing in {publisher} on {date}, ..." Article schema gives them all four cleanly. Pages without it get cited as "according to a website" or skipped entirely in favor of pages with attribution.',
    },
    {
      q: 'Should the headline match the page <title>?',
      a: 'They should be very close but do not have to be identical. Headline is the spoken-form title (what you would say). Title tag often has SEO modifiers ("| Site Name", "(2026 Update)"). If they diverge widely, Google may treat the page as untrustworthy or pick its own.',
    },
    {
      q: 'How important is dateModified vs datePublished?',
      a: 'Both matter. datePublished is what AI assistants cite. dateModified is what Google uses to decide freshness ranking. Update dateModified whenever you make substantive edits — but do not lie. Unchanged pages with bumped dateModified eventually get penalized.',
    },
  ],

  fields: [
    { kind: 'text', key: 'headline', label: 'Headline', placeholder: 'How AI Search Changed SEO in 2026', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A short summary of the article.', rows: 2 },
    { kind: 'text', key: 'image', label: 'Image URL (1200px+ wide recommended)', placeholder: 'https://example.com/cover.jpg' },
    { kind: 'text', key: 'datePublished', label: 'Date Published (ISO 8601)', placeholder: '2026-04-25' },
    { kind: 'text', key: 'dateModified', label: 'Date Modified (ISO 8601, optional)', placeholder: '2026-04-25' },
    { kind: 'text', key: 'authorName', label: 'Author Name', placeholder: 'Alex Chen' },
    { kind: 'text', key: 'authorUrl', label: 'Author URL (optional)', placeholder: 'https://example.com/authors/alex' },
    { kind: 'text', key: 'publisherName', label: 'Publisher Name', placeholder: 'Example Magazine' },
    { kind: 'text', key: 'publisherLogo', label: 'Publisher Logo URL', placeholder: 'https://example.com/logo.png' },
  ],

  sampleData: {
    headline: 'How AI Search Changed SEO in 2026',
    description:
      'Google reduced FAQ and HowTo rich results, but Perplexity and ChatGPT now cite structured data more aggressively than ever.',
    image: 'https://example.com/ai-search-2026-cover.jpg',
    datePublished: '2026-04-25',
    dateModified: '2026-04-25',
    authorName: 'Alex Chen',
    authorUrl: 'https://example.com/authors/alex-chen',
    publisherName: 'Example Magazine',
    publisherLogo: 'https://example.com/logo.png',
  },

  buildJsonLd: (data) => {
    const headline = getString(data, 'headline').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const datePublished = getString(data, 'datePublished').trim();
    const dateModified = getString(data, 'dateModified').trim();
    const authorName = getString(data, 'authorName').trim();
    const authorUrl = getString(data, 'authorUrl').trim();
    const publisherName = getString(data, 'publisherName').trim();
    const publisherLogo = getString(data, 'publisherLogo').trim();

    const body: Record<string, unknown> = { '@type': 'Article', headline };
    if (description) body.description = description;
    if (image) body.image = image;
    if (datePublished) body.datePublished = datePublished;
    if (dateModified) body.dateModified = dateModified;
    if (authorName) {
      body.author = {
        '@type': 'Person',
        name: authorName,
        ...(authorUrl && { url: authorUrl }),
      };
    }
    if (publisherName) {
      body.publisher = {
        '@type': 'Organization',
        name: publisherName,
        ...(publisherLogo && {
          logo: { '@type': 'ImageObject', url: publisherLogo },
        }),
      };
    }
    return jsonLdEnvelope(body);
  },
};
