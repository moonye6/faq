import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const reviewSchema: SchemaTypeDef = {
  id: 'review',
  slug: 'review-schema-generator',
  name: 'Review Schema Generator',
  schemaType: 'Review',

  title: 'Review Schema Generator | JSON-LD for Star Ratings + AI Recommendations',
  metaDescription:
    'Generate Review JSON-LD for product, book, movie, or business reviews. Triggers SERP star ratings and powers AI assistant recommendations.',
  h1: 'Review Schema Generator',
  intro:
    'Mark up your review with structured rating, author, and verdict. Get clean Review JSON-LD that triggers SERP stars and gets cited by AI assistants.',
  geoAeoAngle:
    'Review schema does two jobs in 2026. First: when attached to a Product or LocalBusiness, it produces the star rating shown directly in SERPs. Second: standalone Review schema is heavily used by AI assistants (ChatGPT, Perplexity, Gemini) when generating "best X for Y" recommendations. Pages with explicit Review markup get cited disproportionately when AI tries to surface verdicts.',

  pageFaqs: [
    {
      q: 'When does Review schema produce SERP star ratings?',
      a: 'Stars appear when Review (or AggregateRating) is attached to an eligible item type: Product, LocalBusiness, Book, Movie, MusicAlbum, Recipe, SoftwareApplication, Course, Game, Event. Standalone Review schema (without an itemReviewed) does not produce stars on its own.',
    },
    {
      q: 'Can I add fake reviews to inflate ratings?',
      a: 'No. Google requires that any Review or AggregateRating in your markup be visible on the page and represent genuine user reviews. Schema-stuffing is one of the most common triggers for manual actions in 2025-2026 — Google has gotten very good at detecting it.',
    },
    {
      q: 'What types of items can Review schema describe?',
      a: 'Anything reviewable: Product, Book, Movie, MusicAlbum, Restaurant, LocalBusiness, Event, Course, SoftwareApplication, Game, CreativeWork. Set itemReviewed.@type to the appropriate type. Without an itemReviewed, the review is technically valid but produces no SERP enhancements.',
    },
    {
      q: 'How do AI assistants use Review schema?',
      a: 'When asked "is X good?" or "best X under $Y", AI assistants like Perplexity Pro and ChatGPT cite pages with explicit Review markup over pages with prose-only opinions. The structured rating + verdict is easier to extract and present in a citation card.',
    },
    {
      q: 'Should I use Review or AggregateRating?',
      a: 'Both, depending. Use Review for an individual review (one author, one verdict). Use AggregateRating when summarizing many reviews on a Product or LocalBusiness page. They can coexist: a Product can have one AggregateRating plus an array of individual Review objects.',
    },
  ],

  fields: [
    { kind: 'text', key: 'itemName', label: 'Item Name', placeholder: 'Acme Pro Headphones', required: true },
    {
      kind: 'text',
      key: 'itemType',
      label: 'Item Type (Product, Book, Movie, LocalBusiness, etc.)',
      placeholder: 'Product',
      required: true,
    },
    { kind: 'text', key: 'itemUrl', label: 'Item URL (optional)', placeholder: 'https://example.com/headphones' },
    { kind: 'textarea', key: 'reviewBody', label: 'Review Body', placeholder: 'After 3 weeks of daily use...', required: true, rows: 5 },
    { kind: 'text', key: 'ratingValue', label: 'Rating (1-5)', placeholder: '4.5', required: true },
    { kind: 'text', key: 'bestRating', label: 'Best Rating', placeholder: '5' },
    { kind: 'text', key: 'authorName', label: 'Author Name', placeholder: 'Alex Chen', required: true },
    { kind: 'text', key: 'datePublished', label: 'Date Published (ISO 8601)', placeholder: '2026-04-25' },
  ],

  sampleData: {
    itemName: 'Acme Pro Wireless Headphones',
    itemType: 'Product',
    itemUrl: 'https://example.com/acme-pro-headphones',
    reviewBody:
      'After three weeks of daily use, the Acme Pro headphones earn a solid recommendation. Active noise cancellation is class-leading at this price point, battery life genuinely hits the claimed 40 hours, and the fit is comfortable for multi-hour sessions. Knock half a star for the slightly clicky buttons and a companion app that demands more permissions than it should.',
    ratingValue: '4.5',
    bestRating: '5',
    authorName: 'Alex Chen',
    datePublished: '2026-04-25',
  },

  buildJsonLd: (data) => {
    const itemName = getString(data, 'itemName').trim();
    const itemType = getString(data, 'itemType').trim() || 'Thing';
    const itemUrl = getString(data, 'itemUrl').trim();
    const reviewBody = getString(data, 'reviewBody').trim();
    const ratingValue = getString(data, 'ratingValue').trim();
    const bestRating = getString(data, 'bestRating').trim() || '5';
    const authorName = getString(data, 'authorName').trim();
    const datePublished = getString(data, 'datePublished').trim();

    const body: Record<string, unknown> = {
      '@type': 'Review',
      itemReviewed: {
        '@type': itemType,
        name: itemName,
        ...(itemUrl && { url: itemUrl }),
      },
      reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue,
        bestRating,
      },
      author: { '@type': 'Person', name: authorName },
    };
    if (datePublished) body.datePublished = datePublished;
    return jsonLdEnvelope(body);
  },
};
