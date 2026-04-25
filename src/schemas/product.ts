import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const productSchema: SchemaTypeDef = {
  id: 'product',
  slug: 'product-schema-generator',
  name: 'Product Schema Generator',
  schemaType: 'Product',

  title: 'Product Schema Generator | JSON-LD with Price, Rating & Stock',
  metaDescription:
    'Generate Product JSON-LD that triggers full SERP rich results in 2026: price, rating, availability. Also optimized for AI shopping search citation.',
  h1: 'Product Schema Generator',
  intro:
    'Fill in your product details. Get clean Product JSON-LD with price, rating, and stock fields ready for search engines and AI shopping assistants.',
  geoAeoAngle:
    'Product is one of the few schema types that retains full SERP rich results in 2026. Price, star rating, and availability still render directly in Google. On top of that, AI shopping consumers (ChatGPT shopping mode, Perplexity Pro, Gemini) parse Product schema to power "best X for $Y" recommendations. This is the highest-leverage schema type in the matrix.',

  pageFaqs: [
    {
      q: 'Does Product schema still show rich results in Google in 2026?',
      a: 'Yes. Product is one of the few schema types that survived the 2023-2026 rich-result reductions. Price, star rating, review count, and stock availability still render in standard SERPs and in Google Shopping panels.',
    },
    {
      q: 'What is the minimum Product schema Google requires for rich results?',
      a: 'You need name, image, description, and either offers (with price + priceCurrency + availability) or aggregateRating (with ratingValue + reviewCount), or both. Without offers or rating, the schema indexes but does not render rich.',
    },
    {
      q: 'How do AI shopping assistants use Product schema?',
      a: 'ChatGPT shopping, Perplexity Pro, and Gemini parse Product schema to extract structured comparison data — price, rating, brand, key specs. A page with clean Product schema gets cited in "best X under $Y" answers; a page without it is invisible to those queries.',
    },
    {
      q: 'Can I use Product schema for digital products and SaaS?',
      a: 'Yes. Schema.org Product covers physical goods, digital products, and SaaS. For SaaS, set offers.priceSpecification with price and priceCurrency, and use availability InStock. For free products, set price 0 and a clear description.',
    },
    {
      q: 'What goes wrong with Product schema most often?',
      a: 'Three things: (1) price in markup does not match price visible to users — Google flags this and may issue a manual action, (2) using a stock photo URL that returns 404, (3) inflating aggregateRating with reviews that are not visible on the page. All three trigger penalties or rich-result removal.',
    },
  ],

  fields: [
    { kind: 'text', key: 'name', label: 'Product Name', placeholder: 'Acme Pro Headphones', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'Wireless over-ear headphones with active noise cancellation.', required: true, rows: 3 },
    { kind: 'text', key: 'image', label: 'Image URL', placeholder: 'https://example.com/headphones.jpg', required: true },
    { kind: 'text', key: 'brand', label: 'Brand', placeholder: 'Acme' },
    { kind: 'text', key: 'sku', label: 'SKU', placeholder: 'ACME-PRO-001' },
    { kind: 'text', key: 'price', label: 'Price (numeric)', placeholder: '199.00' },
    { kind: 'text', key: 'priceCurrency', label: 'Currency (ISO 4217)', placeholder: 'USD' },
    { kind: 'text', key: 'availability', label: 'Availability', placeholder: 'InStock | OutOfStock | PreOrder' },
    { kind: 'text', key: 'ratingValue', label: 'Rating Value (1-5)', placeholder: '4.6' },
    { kind: 'text', key: 'reviewCount', label: 'Review Count', placeholder: '128' },
  ],

  sampleData: {
    name: 'Acme Pro Wireless Headphones',
    description:
      'Over-ear wireless headphones with active noise cancellation, 40h battery life, and adaptive EQ.',
    image: 'https://example.com/acme-pro-headphones.jpg',
    brand: 'Acme',
    sku: 'ACME-PRO-001',
    price: '199.00',
    priceCurrency: 'USD',
    availability: 'InStock',
    ratingValue: '4.6',
    reviewCount: '128',
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const brand = getString(data, 'brand').trim();
    const sku = getString(data, 'sku').trim();
    const price = getString(data, 'price').trim();
    const currency = getString(data, 'priceCurrency').trim();
    const availability = getString(data, 'availability').trim();
    const rating = getString(data, 'ratingValue').trim();
    const reviewCount = getString(data, 'reviewCount').trim();

    const body: Record<string, unknown> = { '@type': 'Product', name };
    if (description) body.description = description;
    if (image) body.image = image;
    if (brand) body.brand = { '@type': 'Brand', name: brand };
    if (sku) body.sku = sku;

    if (price && currency) {
      body.offers = {
        '@type': 'Offer',
        price,
        priceCurrency: currency,
        ...(availability && {
          availability: availability.startsWith('http')
            ? availability
            : `https://schema.org/${availability}`,
        }),
      };
    }
    if (rating && reviewCount) {
      body.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: rating,
        reviewCount,
      };
    }

    return jsonLdEnvelope(body);
  },
};
