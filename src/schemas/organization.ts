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
  ],

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
