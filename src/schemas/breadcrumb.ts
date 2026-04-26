import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getRepeater,
} from '~/lib/schema-types';

export const breadcrumbSchema: SchemaTypeDef = {
  id: 'breadcrumb',
  slug: 'breadcrumb-schema-generator',
  name: 'Breadcrumb Schema Generator',
  schemaType: 'BreadcrumbList',

  title: 'Breadcrumb Schema Generator | BreadcrumbList JSON-LD for SERP URL Trail',
  metaDescription:
    'Generate BreadcrumbList JSON-LD that produces the URL hierarchy trail shown in nearly every Google SERP in 2026. Reliably rendered across desktop and mobile.',
  h1: 'Breadcrumb Schema Generator',
  intro:
    'Build the hierarchy trail to your page. Get clean BreadcrumbList JSON-LD that produces the URL trail shown in almost every Google SERP.',
  geoAeoAngle:
    'BreadcrumbList is the most reliably-rendered schema type in 2026. Where FAQ and HowTo rich results were cut, breadcrumbs survived intact and now appear above your page title in nearly every Google SERP — desktop and mobile. AI assistants also use breadcrumbs to understand site hierarchy when classifying content. Two minutes of work, persistent visual SERP enhancement, plus better AI categorization. The cheapest schema win in the matrix.',

  pageFaqs: [
    {
      q: 'Do breadcrumb rich results still show in Google in 2026?',
      a: 'Yes, more than ever. While Google reduced FAQ, HowTo, and Sitelinks Search Box results in 2023-2026, breadcrumbs were not touched. They render above the page title on virtually every desktop and mobile SERP. They are arguably the most reliably-displayed structured data in 2026.',
    },
    {
      q: 'Should breadcrumb names match the visible breadcrumb on the page?',
      a: 'Yes. Schema names should mirror the visible breadcrumb trail. Mismatches (where schema says "Products > Headphones" but the visible trail says "Shop > Audio") can trigger Google to ignore your structured data or, worse, replace your visible breadcrumb with the schema version even if it is wrong.',
    },
    {
      q: 'What position number do I start at?',
      a: '1 for the homepage, 2 for the first category, and so on, ending at the current page. Position numbers must be sequential integers starting at 1. Skipping a number (1, 2, 4) breaks the trail and Google may discard the entire BreadcrumbList.',
    },
    {
      q: 'Should the current page be the last item?',
      a: 'Yes. The last item in the list should be the current page. Some implementations omit it because the user is already there — that is incorrect for schema purposes. Include it with its full URL; Google needs the complete trail.',
    },
    {
      q: 'Can a single page have multiple breadcrumb trails?',
      a: 'Yes. If a page legitimately fits multiple categories (e.g., a product page reachable from "Shop > Audio > Headphones" AND "Brands > Acme > Headphones"), include both BreadcrumbList objects. Google will pick the most relevant one per query context.',
    },
    {
      q: 'Should I include the homepage as the first breadcrumb?',
      a: 'Yes, almost always. The homepage as position 1 establishes the root of the trail. The only exception: a fully self-contained microsite or landing page that has no parent in the site hierarchy — in that case, omit the home item rather than fabricate one.',
    },
    {
      q: 'Do breadcrumb URLs need to be absolute or relative?',
      a: 'Absolute. Each item.url must be a full URL (https://example.com/path), not a relative path. Google\'s parser rejects relative paths and the BreadcrumbList will not render in SERPs.',
    },
    {
      q: 'How do AI search engines use breadcrumb schema?',
      a: 'Perplexity, ChatGPT, and Gemini use breadcrumbs to understand the topical hierarchy of a page — what it is about and how specific it is. A page deep in /audio/headphones/wireless/noise-cancelling/ is treated as a more specific authority on noise-cancelling wireless headphones than a top-level /audio/ page. Cleaner breadcrumbs improve cite-routing for long-tail queries.',
    },
    {
      q: 'Should breadcrumb names be capitalized like titles or like categories?',
      a: 'Match what the visible breadcrumb shows. If your visible UI uses Title Case ("Wireless Headphones"), the schema should too. Inconsistency between schema and visible UI is the most common reason Google discards breadcrumb markup.',
    },
    {
      q: 'What if my site has no clear hierarchy (flat blog with tag-only navigation)?',
      a: 'Use Home → [Primary Tag] → Post Title as a synthetic trail. Better than no breadcrumb at all. Even a two-level trail (Home → Post) is valid and will render. The BreadcrumbList must have at least 1 item but typically needs at least 2 to be useful.',
    },
    {
      q: 'Can I use BreadcrumbList for a SaaS app or single-page application?',
      a: 'Only on pages that are crawlable and indexable. SPA routes that require JS to render are often invisible to crawlers. If your app uses server-side rendering or static export for marketing pages, breadcrumbs help there. For app-internal routes (post-login dashboards), schema is irrelevant — those are not indexed.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast / RankMath)',
        description:
          'Both Yoast SEO and RankMath emit BreadcrumbList JSON-LD automatically based on your site\'s post hierarchy and category taxonomy. Almost no work required.',
        steps: [
          'Install RankMath or Yoast SEO.',
          'In RankMath: General Settings → Breadcrumbs → enable "Schema markup". In Yoast: Search Appearance → Breadcrumbs → enable.',
          'Configure breadcrumb separator and home label to match your theme\'s visible breadcrumb.',
          'If your theme also outputs breadcrumb schema, disable one of the two — duplicate schema causes Google to pick whichever it parses first, often the wrong one.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Shopify',
        description:
          'Shopify themes with Online Store 2.0 (Dawn, Sense, Crave) emit breadcrumb schema for collection and product pages. Older themes (Debut, Brooklyn) often do not.',
        steps: [
          'Check your current theme: view source on a product page and search for BreadcrumbList. If found, you are done.',
          'If missing: in your theme code editor, open snippets/ and create breadcrumbs-schema.liquid.',
          'Build the trail from product.collections.first and product.title (or use product.type).',
          'Include the snippet in product.liquid and collection.liquid templates only.',
          'Validate with schemaguardian.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "{{ shop.url }}/"
    },
    {% if product.collections.first %}
    {
      "@type": "ListItem",
      "position": 2,
      "name": "{{ product.collections.first.title | escape }}",
      "item": "{{ shop.url }}{{ product.collections.first.url }}"
    },
    {% endif %}
    {
      "@type": "ListItem",
      "position": {% if product.collections.first %}3{% else %}2{% endif %},
      "name": "{{ product.title | escape }}",
      "item": "{{ shop.url }}{{ product.url }}"
    }
  ]
}
</script>`,
      },
      {
        platform: 'Next.js',
        description:
          'Build breadcrumb data from the Next.js router pathname or your CMS hierarchy. Render the JSON-LD in the same component that renders the visible breadcrumb to keep them in sync.',
        steps: [
          'Create a Breadcrumbs.tsx component that takes a typed array of {name, url} items.',
          'Render the visible <nav> from the array.',
          'Inside the same component, render <Script type="application/ld+json"> with the BreadcrumbList JSON-LD built from the same array.',
          'Use next/script with strategy="afterInteractive" to avoid blocking, or place inline in the head.',
          'Wire schemaguardian into your CI to validate every deploy.',
        ],
        codeExample: `// Breadcrumbs.tsx
import Script from 'next/script';

type Item = { name: string; url: string };

export function Breadcrumbs({ items }: { items: Item[] }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <>
      <nav aria-label="Breadcrumb">
        {items.map((it, i) => (
          <span key={i}>
            <a href={it.url}>{it.name}</a>
            {i < items.length - 1 && ' / '}
          </span>
        ))}
      </nav>
      <Script id="breadcrumb-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Astro / static sites',
        description:
          'Astro\'s file-based routing makes breadcrumbs trivial: derive the trail from Astro.url.pathname, or pass items explicitly via component props.',
        steps: [
          'Create src/components/Breadcrumbs.astro that takes items as a prop.',
          'Render visible <nav> from items.',
          'Render <script is:inline type="application/ld+json"> with JSON.stringify of BreadcrumbList built from the same items.',
          'For dynamic routes ([slug].astro), build items from your content collection metadata.',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'E-commerce category > subcategory > product',
        description:
          'Classic ecommerce breadcrumb pattern. Home → top-level category → subcategory → product. Renders directly above the product title in Google SERPs and helps shopping AI assistants understand product taxonomy.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Audio",
      "item": "https://example.com/audio"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Headphones",
      "item": "https://example.com/audio/headphones"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Acme Pro Wireless Headphones",
      "item": "https://example.com/audio/headphones/acme-pro"
    }
  ]
}`,
      },
      {
        scenario: 'Blog post under a topical category',
        description:
          'Blog hierarchy: Home → Blog → Category → Post. Useful for AI engines parsing topical authority. A post under /blog/seo/technical-seo/ signals deeper expertise than one at /blog/.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://example.com/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "SEO",
      "item": "https://example.com/blog/seo"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "How Schema Markup Powers AI Citation",
      "item": "https://example.com/blog/seo/schema-markup-ai-citation"
    }
  ]
}`,
      },
      {
        scenario: 'Documentation section > article',
        description:
          'Developer docs pattern: Home → Docs → Section → Article. AI coding assistants use this hierarchy to route queries to the correct page (e.g., "auth docs" → /docs/api/authentication).',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Docs",
      "item": "https://example.com/docs"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "API Reference",
      "item": "https://example.com/docs/api"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "Authentication",
      "item": "https://example.com/docs/api/authentication"
    }
  ]
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Skipping or non-sequential position numbers',
        why: 'BreadcrumbList requires sequential integers starting at 1. Position 1, 2, 4 (skipping 3) or starting at 0 breaks the trail and Google discards the whole list.',
        fix: 'Always start at 1 and increment by 1 for each item. If you remove an item from the trail, renumber the rest.',
      },
      {
        error: 'Schema names mismatch visible breadcrumb',
        why: 'Schema says "Products > Headphones" but the visible UI says "Shop > Audio". Google flags the inconsistency and may either ignore the schema or replace the visible breadcrumb with the schema version (which is now wrong in the eyes of users).',
        fix: 'Generate the schema from the same source array as the visible UI. If you change one, the other auto-updates.',
      },
      {
        error: 'Relative URLs in item field',
        why: 'item must be a full absolute URL (https://example.com/path). Relative paths like /audio/headphones are rejected by Google\'s parser.',
        fix: 'Always emit absolute URLs. In templates, prepend the canonical site URL: shop.url + product.url, or process.env.SITE_URL + path.',
      },
      {
        error: 'Omitting the current page (last item)',
        why: 'Some implementations skip the last item because the user is already on it. The schema spec requires the full trail including the current page.',
        fix: 'Include the current page as the final ListItem with its full URL. The visible UI can render the last item as non-clickable text — but the schema must include it.',
      },
      {
        error: 'Multiple BreadcrumbList blocks for the same trail',
        why: 'Theme + plugin both emitting breadcrumb schema → Google parses one and may pick the older or less complete one. AI engines may fingerprint the page as low-trust.',
        fix: 'Pick one source. In WordPress with Yoast/RankMath, disable theme breadcrumb output. In Shopify, remove duplicate snippets if you migrated themes.',
      },
      {
        error: 'Using the same name for every item',
        why: 'Pages where every breadcrumb item is named "Home" or "Page" (often a templating bug) fail to provide hierarchy signal. AI engines treat as broken markup.',
        fix: 'Name each item by its actual title — the category name, the page name. If your CMS has a "Show in breadcrumbs as" override field, use it for cleaner names than the URL slug.',
      },
    ],
  },

  fields: [
    {
      kind: 'repeater',
      key: 'items',
      label: 'Breadcrumb Items (Home → ... → Current Page)',
      addLabel: 'Add Breadcrumb',
      itemLabel: 'Item',
      minItems: 2,
      itemFields: [
        { kind: 'text', key: 'name', label: 'Name', placeholder: 'Headphones', required: true },
        { kind: 'text', key: 'url', label: 'URL', placeholder: 'https://example.com/audio/headphones', required: true },
      ],
    },
  ],

  sampleData: {
    items: [
      { name: 'Home', url: 'https://example.com/' },
      { name: 'Audio', url: 'https://example.com/audio' },
      { name: 'Headphones', url: 'https://example.com/audio/headphones' },
      { name: 'Acme Pro Wireless Headphones', url: 'https://example.com/audio/headphones/acme-pro' },
    ],
  },

  buildJsonLd: (data) => {
    const items = getRepeater(data, 'items');
    return jsonLdEnvelope({
      '@type': 'BreadcrumbList',
      itemListElement: items
        .filter((it) => it.name?.trim() && it.url?.trim())
        .map((it, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: it.name.trim(),
          item: it.url.trim(),
        })),
    });
  },
};
