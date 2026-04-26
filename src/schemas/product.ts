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
    {
      q: 'How do I mark up a product with multiple variants (size, color)?',
      a: 'Use ProductGroup as the parent type with hasVariant pointing to individual Product entries, each with its own offers and image. For simpler cases, a single Product with offers as an array (one Offer per variant) is also valid. Google prefers ProductGroup for catalogs over the offers-array shortcut.',
    },
    {
      q: 'Should I include shipping and return policy in Product schema?',
      a: 'Yes. Add offers.shippingDetails (OfferShippingDetails) for shipping cost + delivery time, and offers.hasMerchantReturnPolicy (MerchantReturnPolicy) for returns. Both are now strongly recommended by Google for free shipping / free returns badge eligibility in shopping results.',
    },
    {
      q: 'Does Product schema work for marketplaces like Amazon or eBay?',
      a: 'Marketplaces need their own approach: Product per listing, but with offers as an array of Offers from different sellers (each with seller.@type=Organization). Google has specific marketplace guidelines that go beyond standard Product schema — see Google Search Central\'s Product Snippet docs for the full requirements.',
    },
    {
      q: 'How do AI shopping assistants pick which products to recommend from candidates?',
      a: 'They filter candidates by your structured data (price within range, brand match, rating threshold) then rank by aggregateRating × reviewCount × recency. Pages with complete Product schema (name, image, brand, offers, aggregateRating, sku) get retrieved more often and ranked higher than pages missing any of those fields.',
    },
    {
      q: 'What is the difference between Offer and AggregateOffer?',
      a: 'Offer is a single price from one seller. AggregateOffer is a price range across multiple sellers (lowPrice, highPrice, offerCount). Use AggregateOffer for product pages that aggregate listings (comparison sites, marketplaces). Use Offer for direct sales pages.',
    },
    {
      q: 'Should I include condition (new / used / refurbished)?',
      a: 'Yes if not new. The offers.itemCondition field accepts NewCondition, UsedCondition, RefurbishedCondition, or DamagedCondition. AI shopping assistants now filter on condition for "best refurbished X" queries — without it, your refurbished products do not appear in those filtered answers.',
    },
    {
      q: 'How do I validate Product schema in CI?',
      a: 'Run schemaguardian: npx @moonye/schemaguardian check https://your-product-page.com. It validates required fields (name, offers OR aggregateRating), flags Product schema without either (a known rich result blocker), and emits warnings for missing recommended fields like brand, sku, image dimensions, condition.',
    },
    {
      q: 'Can I use Review schema alongside aggregateRating on Product?',
      a: 'Yes, and you should. Stack them: Product gets aggregateRating (the summary), plus an array of individual Review objects with reviewBody. This gives AI assistants both the headline number AND quotable text from real reviews. Pages with both stacked outperform pages with only one in citation studies.',
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

  deepContent: {
    platformIntegrations: [
      {
        platform: 'Shopify',
        description:
          'Shopify themes ship a default Product schema in product.liquid, but it is often incomplete (missing aggregateRating, condition, shipping). Override or extend.',
        steps: [
          'In your theme code editor, open snippets/product-schema.liquid (or sections/product-template.liquid depending on theme).',
          'Find the existing <script type="application/ld+json"> block and inspect what it includes.',
          'Add aggregateRating from your reviews app (Judge.me, Yotpo, Loox all expose Liquid variables).',
          'Add itemCondition for non-new products via a metafield.',
          'For shipping/return badges, add offers.shippingDetails and hasMerchantReturnPolicy from your shop settings.',
          'Test the live page with the schemaguardian CLI before publishing the theme.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title | escape }}",
  "image": "{{ product.featured_image | img_url: '1200x' }}",
  "description": "{{ product.description | strip_html | escape }}",
  "sku": "{{ product.selected_or_first_available_variant.sku }}",
  "brand": { "@type": "Brand", "name": "{{ product.vendor | escape }}" },
  "offers": {
    "@type": "Offer",
    "price": "{{ product.price | money_without_currency | replace: ',', '' }}",
    "priceCurrency": "{{ shop.currency }}",
    "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}",
    "url": "{{ shop.url }}{{ product.url }}"
  }{% if product.metafields.judgeme.badge %},
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "{{ product.metafields.judgeme.badge.rating }}",
    "reviewCount": "{{ product.metafields.judgeme.badge.count }}"
  }{% endif %}
}
</script>`,
      },
      {
        platform: 'WooCommerce',
        description:
          'WooCommerce emits Product schema by default but it is minimal. Most stores use a plugin (Yoast SEO, RankMath, Schema Pro) to add aggregateRating, brand, and shipping data.',
        steps: [
          'Install RankMath or Yoast SEO (both have free tiers with Product schema support).',
          'In RankMath: WooCommerce → Product Schema → enable AggregateRating, Brand, ItemCondition.',
          'For shipping/return badges, install the official WooCommerce extensions for shipping zones and return policies — they expose schema.org-compatible fields.',
          'Disable WooCommerce\'s default schema output (in plugin settings) to avoid duplicate schema blocks on the page.',
          'Validate with schemaguardian after deploying changes.',
        ],
      },
      {
        platform: 'Webflow',
        description:
          'Webflow does not auto-generate Product schema. Add it manually via a custom code embed in the product template.',
        steps: [
          'In the Designer, open your Product CMS template page.',
          'Add an Embed element inside the page wrapper (or in the head via Site Settings → Custom Code if you want it in <head>).',
          'Paste a JSON-LD template with CMS field references like {{ wf {"path":"name","type":"PlainText"} }}.',
          'For aggregateRating, integrate a reviews tool (Stamped, Yotpo) and reference its CMS-bound fields.',
          'Publish and validate with schemaguardian.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ wf {"path":"name","type":"PlainText"} }}",
  "image": "{{ wf {"path":"main-image","type":"ImageRef"} }}",
  "description": "{{ wf {"path":"description","type":"PlainText"} }}",
  "sku": "{{ wf {"path":"sku","type":"PlainText"} }}",
  "offers": {
    "@type": "Offer",
    "price": "{{ wf {"path":"price","type":"Number"} }}",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
</script>`,
      },
      {
        platform: 'Next.js / Astro / static sites',
        description:
          'For framework-built sites, generate the JSON-LD at build time and inject it via the head. Astro\'s set:html and Next.js\'s next/script both work.',
        steps: [
          'Use the Product schema generator above to scaffold the JSON-LD shape.',
          'Move the generated object into a TypeScript file alongside your product page.',
          'Bind real product data (price, rating, image) to the JSON-LD object.',
          'Render with <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} /> in Next.js, or <script is:inline type="application/ld+json" set:html={JSON.stringify(productJsonLd)} /> in Astro.',
          'Wire schemaguardian into your CI to validate every deploy.',
        ],
      },
    ],
    examplesGallery: [
      {
        scenario: 'Physical product with reviews and shipping',
        description:
          'The full-fat case: physical good with brand, SKU, multiple offers (sale + regular), aggregate reviews, free shipping badge eligibility. This is the pattern for ecommerce stores selling physical goods.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Acme Pro Wireless Headphones",
  "image": [
    "https://example.com/headphones-front.jpg",
    "https://example.com/headphones-side.jpg"
  ],
  "description": "Over-ear wireless headphones with active noise cancellation, 40h battery life, and adaptive EQ.",
  "brand": { "@type": "Brand", "name": "Acme" },
  "sku": "ACME-PRO-001",
  "gtin13": "0123456789012",
  "offers": {
    "@type": "Offer",
    "price": "199.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "itemCondition": "https://schema.org/NewCondition",
    "url": "https://example.com/products/acme-pro-headphones",
    "shippingDetails": {
      "@type": "OfferShippingDetails",
      "shippingRate": { "@type": "MonetaryAmount", "value": "0", "currency": "USD" },
      "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "US" }
    },
    "hasMerchantReturnPolicy": {
      "@type": "MerchantReturnPolicy",
      "applicableCountry": "US",
      "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
      "merchantReturnDays": 30,
      "returnFees": "https://schema.org/FreeReturn"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.6",
    "reviewCount": "128"
  }
}`,
      },
      {
        scenario: 'SaaS subscription product',
        description:
          'For software-as-a-service, use Product (or SoftwareApplication for app-stores) with priceSpecification for monthly/annual billing. AI shopping assistants for SaaS comparison queries lean heavily on this pattern.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Acme Analytics Pro",
  "description": "Real-time analytics for B2B SaaS. Per-seat pricing.",
  "brand": { "@type": "Brand", "name": "Acme" },
  "image": "https://example.com/acme-analytics-screenshot.png",
  "offers": {
    "@type": "Offer",
    "priceSpecification": {
      "@type": "UnitPriceSpecification",
      "price": "29.00",
      "priceCurrency": "USD",
      "unitText": "MONTH",
      "billingDuration": 1,
      "billingIncrement": "https://schema.org/Monthly"
    },
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "342"
  }
}`,
      },
      {
        scenario: 'Digital product (course / ebook / template)',
        description:
          'For one-time-purchase digital goods, use Product with a flat Offer. AI assistants treat these as eligible for "best courses on X" or "templates for Y" queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Schema for AI Search — A Practical Guide",
  "description": "120-page ebook on structured data for the AI search era. PDF + ePub.",
  "brand": { "@type": "Brand", "name": "Schema for AI Search" },
  "image": "https://example.com/ebook-cover.jpg",
  "offers": {
    "@type": "Offer",
    "price": "29.00",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://example.com/buy"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "89"
  }
}`,
      },
    ],
    commonErrors: [
      {
        error: 'Price as string with currency in same field',
        why: 'Combining price + currency ("$199.00") into the price field breaks both Google rich result eligibility AND AI shopping query parsing. AI assistants filtering on price ranges cannot extract a numeric value from a currency-prefixed string.',
        fix: 'Set price as a numeric string ("199.00") and priceCurrency as the ISO 4217 code separately ("USD"). The schemaguardian CLI flags this pattern as a warning.',
      },
      {
        error: 'Availability without the schema.org URL prefix',
        why: '"InStock" alone does not validate. Schema.org spec requires the full URL form.',
        fix: 'Use "https://schema.org/InStock" (or OutOfStock, PreOrder, BackOrder, etc.). The Product schema generator above does this correctly automatically.',
      },
      {
        error: 'aggregateRating without visible reviews on the page',
        why: 'Schema-stuffing was the #1 trigger for Google manual actions in 2025-2026. If your schema claims 4.6 stars from 200 reviews but no reviews are visible on the page, Google penalizes the entire site (not just the page).',
        fix: 'Only include aggregateRating values that match what is visibly displayed on the page. Pull from your real reviews tool, never invent numbers.',
      },
      {
        error: 'Stale availability after products sell out',
        why: 'Pages marked InStock that are actually OutOfStock erode trust with both Google and AI assistants. AI shopping queries that surface an unavailable product damage user trust in your brand.',
        fix: 'Make availability a live field driven by inventory, not a static value. Most ecommerce platforms expose this — use the live field in your schema generator.',
      },
      {
        error: 'Missing brand on branded products',
        why: 'AI shopping queries explicitly filter on brand ("best Sony headphones"). Products without brand data are invisible to brand-specific queries.',
        fix: 'Always include brand as { "@type": "Brand", "name": "..." }. For private label products, use your store name as brand.',
      },
      {
        error: 'Image URL returning 404',
        why: 'Google checks image URLs during validation. A 404 image breaks rich result eligibility entirely. AI assistants also cannot use a missing image in product cards.',
        fix: 'Ensure image URLs are absolute (https://...), reachable from any IP, and point to actual product images (not placeholders or expired CDN URLs). Use schemaguardian + a separate link checker in CI.',
      },
    ],
  },
};
