import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
  getRepeater,
} from '~/lib/schema-types';

export const organizationSchema: SchemaTypeDef = {
  id: 'organization',
  slug: 'organization-schema-generator',
  name: 'Organization Schema Generator',
  schemaType: 'Organization',

  title: 'Organization Schema Generator | JSON-LD for Knowledge Panel + AI Attribution',
  metaDescription:
    'Generate Organization JSON-LD with logo, social profiles, and contact info. Foundation for Google Knowledge Panel and AI assistant company attribution.',
  h1: 'Organization Schema Generator',
  intro:
    'Mark up your company with name, logo, social profiles, and contact details. Get clean Organization JSON-LD that feeds the Google Knowledge Panel and AI attribution.',
  geoAeoAngle:
    'Organization schema is the structural foundation of how Google and AI assistants understand "what is this company". Google uses it as a primary input to your Knowledge Panel (the box that appears beside SERPs for branded searches). AI assistants like Perplexity and ChatGPT use it to attribute facts back to a verified entity rather than generic web copy. Without Organization schema, brand searches surface incorrect, outdated, or randomly-aggregated facts. With it, you control the canonical answer.',

  pageFaqs: [
    {
      q: 'Where should Organization schema live?',
      a: 'On your homepage, marked up once. Some sites repeat it on every page — that is allowed but adds no value. Better practice: Organization on the homepage, plus a sitewide reference (Article publisher, Product brand) pointing back to the canonical Organization entity by @id.',
    },
    {
      q: 'What is the sameAs property and why does it matter?',
      a: 'sameAs is an array of URLs to your verified profiles on other authoritative platforms — LinkedIn, Twitter/X, Wikipedia, Crunchbase, GitHub. Google uses these to disambiguate your entity from similarly-named businesses. AI assistants use them to verify claims and pull additional facts. Skip sameAs and your Knowledge Panel will be incomplete.',
    },
    {
      q: 'How do I get a Wikipedia entry to link via sameAs?',
      a: 'You do not strategically pursue one — Wikipedia entries come from organic editor interest. But if your company has one, include it in sameAs. Wikipedia is the highest-trust signal Google uses for entity verification, by a wide margin.',
    },
    {
      q: 'What is the difference between Organization and LocalBusiness?',
      a: 'Organization is the parent type — use it for any organization (company, nonprofit, government). LocalBusiness is a subtype for businesses with physical presence and local-search relevance. Multi-location chains use Organization at the parent and LocalBusiness per location.',
    },
    {
      q: 'Can I use Organization schema for a personal brand or solo business?',
      a: 'Yes if you operate as an LLC, sole proprietorship, or DBA. For pure personal brands without a business entity, use Person schema instead — it tells Google + AI assistants this is an individual, which produces a different (more accurate) Knowledge Panel.',
    },
    {
      q: 'Should logo be a square or wide horizontal image?',
      a: 'Square (≥600×600 PNG/SVG) for Organization.logo. The horizontal format (≥600×60) is for Article.publisher.logo specifically. Two different fields, two different images. Many sites get this wrong and use the same logo for both, losing rich result eligibility on one or the other.',
    },
    {
      q: 'How does AI search use Organization schema for citation?',
      a: 'When AI assistants need to attribute a fact about a company ("according to Acme..."), they look up the canonical Organization entity. Schema with sameAs to LinkedIn/Crunchbase/Wikipedia gives them a verified anchor. Without it, the AI may pull stale or incorrect facts from random aggregator sites.',
    },
    {
      q: 'What is @id and why should I use it across pages?',
      a: '@id is a stable URL identifier for an entity. By using "@id": "https://acme.example/#organization" on the Organization schema and referencing it as publisher.@id on Article schemas, you tell parsers "this is the same entity everywhere". Strong cite consolidation signal for AI engines.',
    },
    {
      q: 'How many sameAs URLs should I include?',
      a: 'Aim for 4-8 high-trust, verified profiles. Mandatory: official LinkedIn company page, Twitter/X. Strong: Wikipedia (if exists), Crunchbase, GitHub (if relevant), Facebook. Skip low-trust profiles (random forums, unverified directories) — diluting sameAs with junk weakens the signal.',
    },
    {
      q: 'Should I include contactPoint for customer support?',
      a: 'Yes when applicable. contactPoint with contactType "customer support" plus telephone, email, and availableLanguage tells AI assistants how to route "how do I contact X" queries. Without it, the AI surfaces whatever phone number it finds first on the web — often outdated.',
    },
    {
      q: 'How do I handle multiple legal entities (parent + subsidiaries)?',
      a: 'Mark up each entity on its own homepage. Use parentOrganization and subOrganization fields to link them. AI engines consolidate the entity graph this way. Do not stuff all entities into one schema block — keep them separate and link via @id references.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast / RankMath)',
        description:
          'Both Yoast and RankMath have Organization schema modules that auto-emit on the homepage based on settings. Cleanest path for WordPress sites.',
        steps: [
          'Install RankMath or Yoast SEO.',
          'In RankMath: General Settings → Titles & Meta → Local SEO → set business type to "Organization" or specific subtype.',
          'In Yoast: SEO → Search Appearance → Knowledge Graph & Schema → fill in name, logo, social profiles.',
          'Both plugins ask for sameAs URLs (LinkedIn, Twitter, etc.) — fill all that apply.',
          'Confirm Organization schema only emits on the homepage (not every page) — RankMath does this by default; check Yoast settings.',
          'Validate with schemaguardian on the homepage URL.',
        ],
      },
      {
        platform: 'Shopify',
        description:
          'Shopify themes do not emit Organization schema for the brand by default. Add it via theme.liquid <head> section, scoped to the homepage.',
        steps: [
          'In your theme code editor, open layout/theme.liquid.',
          'Inside the <head> block, add a {% if template.name == "index" %} ... {% endif %} guard.',
          'Inside the guard, paste a JSON-LD Organization block with shop.name, shop.url, your logo URL, and sameAs URLs from your settings.',
          'For multi-store internationalized setups, use shop.permanent_domain and one Organization per store.',
          'Validate with schemaguardian on the storefront homepage.',
        ],
        codeExample: `{% if template.name == 'index' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "{{ shop.url }}#organization",
  "name": "{{ shop.name | escape }}",
  "url": "{{ shop.url }}",
  "logo": "{{ 'logo.png' | asset_url }}",
  "sameAs": [
    "https://www.instagram.com/{{ settings.instagram_handle }}",
    "https://www.facebook.com/{{ settings.facebook_handle }}",
    "https://twitter.com/{{ settings.twitter_handle }}"
  ]
}
</script>
{% endif %}`,
      },
      {
        platform: 'Next.js / Astro homepage',
        description:
          'For framework-built sites, emit Organization schema once on the homepage. Reference the same @id from per-page Article publisher and Product brand fields.',
        steps: [
          'Create lib/schema/organization.ts exporting a typed Organization object with stable @id (e.g., https://example.com/#organization).',
          'In the homepage component, render <Script type="application/ld+json"> with JSON.stringify of the Organization object.',
          'For Article, Product, and other schemas elsewhere, set publisher.@id to the same value — pulls them all into one entity graph.',
          'Keep sameAs URLs in a config file so updates flow through everywhere.',
          'Validate with schemaguardian on every deploy.',
        ],
        codeExample: `// lib/schema/organization.ts
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://acme.example/#organization',
  name: 'Acme Inc.',
  url: 'https://acme.example',
  logo: {
    '@type': 'ImageObject',
    url: 'https://acme.example/logo-square.png',
    width: 600,
    height: 600,
  },
  description: 'Acme builds developer tools for the AI search era.',
  foundingDate: '2018-03-15',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: 'support@acme.example',
    availableLanguage: ['en'],
  },
  sameAs: [
    'https://www.linkedin.com/company/acme',
    'https://twitter.com/acme',
    'https://github.com/acme',
    'https://www.crunchbase.com/organization/acme',
  ],
};

// app/page.tsx
import Script from 'next/script';
import { organizationJsonLd } from '@/lib/schema/organization';

export default function Home() {
  return (
    <>
      <main>{/* homepage content */}</main>
      <Script id="org-jsonld" type="application/ld+json">
        {JSON.stringify(organizationJsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Static HTML / hand-rolled site',
        description:
          'For HTML-only sites, paste the JSON-LD generated above into the <head> of the homepage only. Don\'t repeat on every page — it adds no value and bloats payload.',
        steps: [
          'Generate the JSON-LD using the form above with your company details and all relevant sameAs URLs.',
          'Paste the <script type="application/ld+json"> block into the <head> of index.html only.',
          'For per-page Article or Product schema, reference the Organization by @id (https://example.com/#organization) instead of duplicating the full block.',
          'Update sameAs whenever you launch on a new platform (LinkedIn, Crunchbase, etc.).',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'SaaS / B2B software company',
        description:
          'Tech company with Crunchbase, GitHub, and dev-community sameAs. Pattern most cited by AI engines for "what is X" and "who builds X" queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://acme.example/#organization",
  "name": "Acme Software",
  "alternateName": "Acme",
  "url": "https://acme.example",
  "logo": {
    "@type": "ImageObject",
    "url": "https://acme.example/logo-square.png",
    "width": 600,
    "height": 600
  },
  "description": "Acme Software builds open-source developer tools for schema markup, structured data validation, and AI search optimization.",
  "foundingDate": "2018-03-15",
  "founders": [
    { "@type": "Person", "name": "Maya Chen" },
    { "@type": "Person", "name": "Jordan Park" }
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "customer support",
      "email": "support@acme.example",
      "availableLanguage": ["en"]
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "email": "sales@acme.example",
      "availableLanguage": ["en"]
    }
  ],
  "sameAs": [
    "https://www.linkedin.com/company/acme",
    "https://twitter.com/acme",
    "https://github.com/acme",
    "https://www.crunchbase.com/organization/acme",
    "https://en.wikipedia.org/wiki/Acme_Software"
  ]
}`,
      },
      {
        scenario: 'Marketing / design agency',
        description:
          'Service business with portfolio focus. Includes parentOrganization and knowsAbout for service taxonomy. Pattern for agencies pitching specialized expertise.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://branchstudio.example/#organization",
  "name": "Branch Studio",
  "url": "https://branchstudio.example",
  "logo": "https://branchstudio.example/logo.png",
  "description": "Branch Studio is a brand identity and digital design agency working with early-stage technology companies.",
  "foundingDate": "2020-06-01",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1234 Mission Street",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94103",
    "addressCountry": "US"
  },
  "knowsAbout": [
    "Brand Identity",
    "Logo Design",
    "Visual Systems",
    "Webflow Development",
    "Design Systems"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "email": "hello@branchstudio.example"
  },
  "sameAs": [
    "https://www.linkedin.com/company/branch-studio",
    "https://www.instagram.com/branchstudio",
    "https://dribbble.com/branchstudio",
    "https://www.behance.net/branchstudio"
  ]
}`,
      },
      {
        scenario: 'Non-profit / NGO',
        description:
          'NonProfit subtype with NTEE-style focus, founders, and donation routing. Pattern for charitable organizations seeking AI-assistant accuracy on mission and giving.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "NGO",
  "@id": "https://opencodefund.example/#organization",
  "name": "Open Code Fund",
  "alternateName": "OCF",
  "url": "https://opencodefund.example",
  "logo": "https://opencodefund.example/logo.png",
  "description": "Open Code Fund is a 501(c)(3) non-profit funding open-source maintenance for critical web infrastructure.",
  "foundingDate": "2019-01-15",
  "nonprofitStatus": "Nonprofit501c3",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Brooklyn",
    "addressRegion": "NY",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "general inquiries",
    "email": "info@opencodefund.example"
  },
  "potentialAction": {
    "@type": "DonateAction",
    "target": "https://opencodefund.example/donate"
  },
  "sameAs": [
    "https://www.linkedin.com/company/opencodefund",
    "https://twitter.com/opencodefund",
    "https://github.com/opencodefund",
    "https://www.guidestar.org/profile/00-0000000"
  ]
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Repeating Organization schema on every page',
        why: 'Sitewide repetition adds no signal and bloats payload. Google parses it once per crawl session anyway. AI engines may even fingerprint redundant schema as a low-trust signal.',
        fix: 'Emit Organization once on the homepage. Reference by @id (https://example.com/#organization) from per-page Article publisher and Product brand fields.',
      },
      {
        error: 'Wrong logo aspect (using horizontal logo for Organization.logo)',
        why: 'Organization.logo expects ≥600×600 (square or near-square). Article.publisher.logo expects ≥600×60 (wide horizontal). Using the wide one for Organization breaks Knowledge Panel display.',
        fix: 'Maintain two logo files: square for Organization.logo, wide for Article.publisher.logo. Many design systems already have both — just reference correctly.',
      },
      {
        error: 'Diluting sameAs with low-trust profiles',
        why: 'Listing 30 directories, social profiles, forum bios, and obscure platforms in sameAs weakens the signal. Google heavily weights LinkedIn, Wikipedia, Crunchbase; everything else has marginal value and noise drowns out the signal.',
        fix: 'Keep sameAs to 4-8 high-trust verified profiles. Drop directory listings and unverified platforms.',
      },
      {
        error: 'Mismatched name across schema and visible UI',
        why: 'Schema says "Acme Inc." but the website footer says "Acme Software" and Twitter says "Acme Co." Google\'s entity disambiguation gets confused; AI engines treat as low-confidence.',
        fix: 'Pick one canonical name. Use alternateName for variants ("Acme" alongside "Acme Inc.") instead of inconsistent name across surfaces.',
      },
      {
        error: 'Logo URL returns 404 or non-image content type',
        why: 'Google\'s validator and AI crawlers fetch the logo URL. If it 404s, returns wrong MIME type, or is behind auth, the schema is treated as broken.',
        fix: 'Host logo on a public CDN URL with no auth. Verify content-type is image/png, image/jpeg, or image/svg+xml. Test the URL in an incognito browser.',
      },
      {
        error: 'Using LocalBusiness when Organization fits better',
        why: 'Sites with no physical location (pure SaaS, remote agency) using LocalBusiness instead of Organization create confused signals. Google\'s map pack expects local data; AI assistants may surface you for "near me" queries you cannot serve.',
        fix: 'Use Organization for non-local businesses. Use LocalBusiness only when you have a physical location customers visit. Use both (Organization parent, LocalBusiness per location) for chains.',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'name', label: 'Organization Name', placeholder: 'Acme Inc.', required: true },
    { kind: 'text', key: 'url', label: 'Website URL', placeholder: 'https://acme.example', required: true },
    { kind: 'text', key: 'logo', label: 'Logo URL (square, 600x600+ recommended)', placeholder: 'https://acme.example/logo.png' },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A SaaS company building tools for X.', rows: 2 },
    { kind: 'text', key: 'foundingDate', label: 'Founding Date (ISO 8601, optional)', placeholder: '2018-03-15' },
    { kind: 'text', key: 'email', label: 'Contact Email', placeholder: 'hello@acme.example' },
    { kind: 'text', key: 'telephone', label: 'Contact Phone', placeholder: '+1-415-555-0100' },
    {
      kind: 'repeater',
      key: 'sameAs',
      label: 'Social / Profile URLs (sameAs)',
      addLabel: 'Add Profile',
      itemLabel: 'Profile',
      itemFields: [
        { kind: 'text', key: 'url', label: 'Profile URL', placeholder: 'https://linkedin.com/company/acme', required: true },
      ],
    },
  ],

  sampleData: {
    name: 'Acme Inc.',
    url: 'https://acme.example',
    logo: 'https://acme.example/logo.png',
    description: 'Acme builds developer tools for the AI search era. Founded 2018, headquartered in San Francisco.',
    foundingDate: '2018-03-15',
    email: 'hello@acme.example',
    telephone: '+1-415-555-0100',
    sameAs: [
      { url: 'https://linkedin.com/company/acme' },
      { url: 'https://twitter.com/acme' },
      { url: 'https://github.com/acme' },
      { url: 'https://www.crunchbase.com/organization/acme' },
    ],
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const url = getString(data, 'url').trim();
    const logo = getString(data, 'logo').trim();
    const description = getString(data, 'description').trim();
    const foundingDate = getString(data, 'foundingDate').trim();
    const email = getString(data, 'email').trim();
    const telephone = getString(data, 'telephone').trim();
    const sameAs = getRepeater(data, 'sameAs');

    const body: Record<string, unknown> = { '@type': 'Organization', name };
    if (url) body.url = url;
    if (logo) body.logo = logo;
    if (description) body.description = description;
    if (foundingDate) body.foundingDate = foundingDate;

    if (email || telephone) {
      body.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        ...(email && { email }),
        ...(telephone && { telephone }),
      };
    }

    const sameAsArr = sameAs.map((s) => s.url?.trim()).filter(Boolean);
    if (sameAsArr.length) body.sameAs = sameAsArr;

    return jsonLdEnvelope(body);
  },
};
