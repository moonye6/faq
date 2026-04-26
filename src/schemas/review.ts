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
    {
      q: 'Does the review need to be visible on the page?',
      a: 'Yes — Google requires the schema content to match visible content. Hidden or accordion-collapsed reviews must still be in the DOM at initial render. Reviews loaded only via JS after a click are at risk of being treated as cloaked schema.',
    },
    {
      q: 'What is the right rating scale?',
      a: 'Default is 1-5. You can use any scale (1-10, 0-100) by setting bestRating and worstRating explicitly. Match what is visible on the page. Don\'t use 1-5 in schema while displaying 1-10 to users — it confuses both Google and AI engines.',
    },
    {
      q: 'How does Review schema affect AI shopping assistants?',
      a: 'Heavily. ChatGPT shopping mode, Perplexity Pro, and Gemini all parse Review schema when answering "best [product] for [use case]" queries. A product with 50 individual Review entries (with reviewBody text) cited in a structured way beats a product with just an AggregateRating number. The text gives the AI specifics to quote.',
    },
    {
      q: 'Can a reviewer be an Organization (publication) instead of a Person?',
      a: 'Yes. For publications like Wirecutter, The Verge, Consumer Reports, set author.@type to Organization with a name and url. AI assistants treat publication-attributed reviews as higher-authority and weight them more in recommendations.',
    },
    {
      q: 'How do I mark up "X out of 10" or letter-grade ratings?',
      a: 'Use ratingValue and bestRating numerically. For an 8/10, set ratingValue: "8", bestRating: "10". For letter grades (A-F), translate to numeric (A=4.0, B=3.0 etc.) or use 0-100 scale. AI engines normalize internally to 5-star equivalents.',
    },
    {
      q: 'Should I include positiveNotes and negativeNotes (pros/cons)?',
      a: 'Yes — these are powerful for AI extraction. positiveNotes and negativeNotes accept ItemList of pros/cons. AI assistants quote these directly in structured comparison answers ("Pros: X, Y. Cons: A, B."). High-leverage field that most generators omit.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (review-focused themes / RankMath)',
        description:
          'Review-focused themes (Reviewer, Affiliate Booster) include native review schema. RankMath\'s schema generator covers it for any theme.',
        steps: [
          'Install RankMath (free tier covers Review schema).',
          'On a post that contains a review, open RankMath\'s Schema Generator.',
          'Pick "Review" type and fill in itemReviewed (Product, Book, Movie, etc.), ratingValue, reviewBody, author.',
          'For pros/cons, use the positiveNotes / negativeNotes fields if your version supports it; otherwise add via custom JSON-LD.',
          'Always make sure the visible review content (rating, prose, pros/cons) matches the schema 1:1.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Shopify (product reviews via Judge.me / Yotpo / Loox)',
        description:
          'Most Shopify reviews come from third-party apps. Each has its own schema emission pattern; you usually do not need to add Review schema manually — but you should verify it is correct.',
        steps: [
          'Install Judge.me / Yotpo / Loox / Stamped — all four emit Review and AggregateRating schema by default.',
          'In your product template (sections/product-template.liquid or product.liquid), check that the app\'s schema snippet is present.',
          'For consistency, ensure your theme does NOT also emit AggregateRating from a different source — duplicate ratings cause Google to pick one and ignore the other (sometimes the wrong one).',
          'For featured customer reviews on landing pages, use the form above to emit standalone Review schema with itemReviewed pointing to the relevant product.',
          'Validate with schemaguardian on a product page.',
        ],
        codeExample: `<!-- Verify the reviews app schema is present in product.liquid -->
{% comment %}
  Judge.me example — do not duplicate this in your theme
  (it auto-injects via judgeme_widgets.liquid)
{% endcomment %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title }}",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{ product.metafields.judgeme.badge.rating }}",
    "reviewCount": "{{ product.metafields.judgeme.badge.count }}"
  },
  "review": [
    {% for review in product.metafields.judgeme.featured_reviews.value %}
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": {{ review.reviewer | json }} },
      "datePublished": {{ review.published_at | json }},
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": {{ review.rating }},
        "bestRating": 5
      },
      "reviewBody": {{ review.body | json }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>`,
      },
      {
        platform: 'Trustpilot / external review platform',
        description:
          'Reviews live on a third-party platform. You can pull and re-emit them on your own pages via the platform\'s API, with proper attribution.',
        steps: [
          'Use Trustpilot/G2/Capterra\'s API to fetch your reviews and aggregate rating.',
          'Render the reviews visibly on your page (required for schema validity).',
          'Emit AggregateRating + Review schema with author.@type as Person and itemReviewed pointing to your business or product.',
          'Include sourceOrganization in each Review pointing to the platform (e.g., {"@type": "Organization", "name": "Trustpilot"}).',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js / Astro affiliate or review site',
        description:
          'For affiliate review sites or comparison hubs, emit a Review per product reviewed plus a parent ItemList for the comparison.',
        steps: [
          'Define your reviews as typed content collection entries with itemReviewed, ratingValue, reviewBody, author, datePublished.',
          'In each review page, render <script type="application/ld+json"> with the full Review object.',
          'For "best X" comparison pages, emit ItemList with each product as a ListItem, and link out to individual review pages.',
          'For pros/cons in the visible UI, also pass them as positiveNotes/negativeNotes in the schema.',
          'Wire schemaguardian into CI.',
        ],
        codeExample: `// app/reviews/[slug]/page.tsx
import Script from 'next/script';

export default async function Review({ params }) {
  const r = await getReview(params.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: r.product.name,
      url: r.product.url,
      image: r.product.image,
      brand: { '@type': 'Brand', name: r.product.brand },
    },
    author: { '@type': 'Person', name: r.author.name, url: r.author.url },
    datePublished: r.publishedAt,
    reviewBody: r.body,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    positiveNotes: {
      '@type': 'ItemList',
      itemListElement: r.pros.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p,
      })),
    },
    negativeNotes: {
      '@type': 'ItemList',
      itemListElement: r.cons.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c,
      })),
    },
  };
  return (
    <>
      <article>{r.body}</article>
      <Script id="review-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
    ],

    examplesGallery: [
      {
        scenario: 'Product review with pros/cons (affiliate site)',
        description:
          'Full editorial review pattern with positiveNotes/negativeNotes ItemList. Pattern most cited by AI shopping assistants — pros/cons translate directly into structured comparison answers.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Product",
    "name": "Acme Pro Wireless Headphones",
    "image": "https://example.com/acme-pro.jpg",
    "url": "https://example.com/products/acme-pro",
    "brand": { "@type": "Brand", "name": "Acme" },
    "sku": "ACME-PRO-001"
  },
  "author": {
    "@type": "Person",
    "name": "Alex Chen",
    "url": "https://example.com/authors/alex-chen"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Headphone Review HQ",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2026-04-15",
  "reviewBody": "After three weeks of daily use, the Acme Pro earns a solid recommendation. Active noise cancellation is class-leading at this price point, battery life genuinely hits the claimed 40 hours, and the fit is comfortable for multi-hour sessions. Knock half a star for the slightly clicky buttons and a companion app that demands more permissions than it should.",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4.5",
    "bestRating": "5",
    "worstRating": "1"
  },
  "positiveNotes": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Class-leading noise cancellation at this price" },
      { "@type": "ListItem", "position": 2, "name": "Genuine 40-hour battery life" },
      { "@type": "ListItem", "position": 3, "name": "Comfortable for multi-hour sessions" }
    ]
  },
  "negativeNotes": {
    "@type": "ItemList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Slightly clicky physical buttons" },
      { "@type": "ListItem", "position": 2, "name": "Companion app requests excess permissions" }
    ]
  }
}`,
      },
      {
        scenario: 'Local business review (LocalBusiness itemReviewed)',
        description:
          'Customer review of a restaurant, salon, or service business. Pattern feeds Google map pack stars and AI "best X near me" answers.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "Restaurant",
    "name": "Trattoria Roma",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "789 Columbus Avenue",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94133"
    }
  },
  "author": {
    "@type": "Person",
    "name": "Jordan Park"
  },
  "datePublished": "2026-04-20",
  "reviewBody": "Old-school North Beach Italian done right. The cacio e pepe is properly emulsified, the wine list leans Italian-only with reasonable markups, and the service has the quiet confidence that comes from doing the same thing well for 30 years. Bring cash for tips — the card reader has been 'down' every time I've visited.",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": "4",
    "bestRating": "5"
  }
}`,
      },
      {
        scenario: 'Aggregate rating on a product page',
        description:
          'AggregateRating summarizing all customer reviews. Lives on the Product schema (not standalone). Pattern that produces SERP star ratings for ecommerce stores.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Acme Pro Wireless Headphones",
  "image": "https://example.com/acme-pro.jpg",
  "description": "Over-ear wireless headphones with active noise cancellation and 40-hour battery life.",
  "brand": { "@type": "Brand", "name": "Acme" },
  "sku": "ACME-PRO-001",
  "offers": {
    "@type": "Offer",
    "price": "199.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "1247",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Sarah K." },
      "datePublished": "2026-04-18",
      "reviewBody": "Three months in and these are still my daily drivers. Battery life is genuinely as advertised.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      }
    },
    {
      "@type": "Review",
      "author": { "@type": "Person", "name": "Mike T." },
      "datePublished": "2026-04-12",
      "reviewBody": "Great sound, but the app is buggy on Android 14. Lost half a star for that.",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "4",
        "bestRating": "5"
      }
    }
  ]
}`,
      },
    ],

    commonErrors: [
      {
        error: 'AggregateRating without visible review summary on the page',
        why: 'Google requires that the rating in schema be visibly shown to users. AggregateRating with ratingValue 4.7 and reviewCount 200 on a page that shows no rating is treated as schema spam — risk of manual action.',
        fix: 'Display the rating visibly (star icons, text "4.7 / 5 from 200 reviews") AND emit the schema. They must match exactly.',
      },
      {
        error: 'Inflating reviewCount or fabricating reviews',
        why: 'Listing reviewCount 1000 when the page shows 12 reviews, or generating fake review entries, violates Google\'s structured data spam policy. Detection has improved dramatically — automated triggers now catch most cases.',
        fix: 'Use the real number of genuine reviews. If you have 12 real reviews, that is what the schema should say.',
      },
      {
        error: 'Standalone Review schema without itemReviewed',
        why: 'A Review with no itemReviewed field is technically valid schema but produces no SERP enhancement and gives AI engines no way to attach the review to a product. It is wasted markup.',
        fix: 'Always include itemReviewed with @type, name, and ideally url. For ambient "general thoughts" content, use Article instead of Review.',
      },
      {
        error: 'Rating value out of bestRating bounds',
        why: 'ratingValue 6 with bestRating 5 fails parsing. Or ratingValue 4.5 with worstRating 0 (when worst is technically 1).',
        fix: 'ratingValue must satisfy worstRating ≤ ratingValue ≤ bestRating. Default scale is 1-5; if you use a different scale, set both bestRating and worstRating explicitly.',
      },
      {
        error: 'Author as a string instead of Person/Organization',
        why: 'author: "Alex Chen" parses but loses attribution boosts. AI engines cannot link the review back to a verified entity.',
        fix: 'Use author: { "@type": "Person", "name": "Alex Chen", "url": "https://example.com/authors/alex-chen" }. For publication reviews, use Organization with logo and sameAs.',
      },
      {
        error: 'Mixing AggregateRating sources (theme + plugin both emitting)',
        why: 'A Shopify theme with built-in AggregateRating plus a Judge.me / Yotpo plugin also emitting AggregateRating creates duplicate schema. Google parses one and ignores the other (often the older/wrong one).',
        fix: 'Disable the theme\'s default AggregateRating output if you use a reviews plugin. Test by viewing the rendered HTML — only one AggregateRating block should be present per product page.',
      },
    ],
  },

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
