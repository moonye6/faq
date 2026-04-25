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
  ],

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
