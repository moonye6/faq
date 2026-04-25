import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
  getRepeater,
} from '~/lib/schema-types';

export const localBusinessSchema: SchemaTypeDef = {
  id: 'localbusiness',
  slug: 'local-business-schema-generator',
  name: 'LocalBusiness Schema Generator',
  schemaType: 'LocalBusiness',

  title: 'LocalBusiness Schema Generator | Map Pack + AI "Near Me" Visibility',
  metaDescription:
    'Generate LocalBusiness JSON-LD with address, hours, phone, and price range. Feeds Google Map Pack and AI "near me" answers in ChatGPT and Perplexity.',
  h1: 'LocalBusiness Schema Generator',
  intro:
    'Fill in your business details. Get clean LocalBusiness JSON-LD that feeds the Google Map Pack AND AI search "near me" answers.',
  geoAeoAngle:
    'LocalBusiness schema does double duty in 2026. It is a primary signal for the Google Map Pack (the local-3 listing in SERPs) AND it is increasingly cited by AI assistants when answering "best X near me" queries. ChatGPT search and Perplexity Pro now surface local businesses by parsing LocalBusiness schema directly. Without it, you are invisible to both surfaces.',

  pageFaqs: [
    {
      q: 'Does LocalBusiness schema replace Google Business Profile?',
      a: 'No. They are complementary. Google Business Profile is the canonical signal Google trusts most for local rankings. LocalBusiness schema on your site reinforces that signal and is what AI assistants (which do not have Google Business Profile API access) parse to surface your business.',
    },
    {
      q: 'Should I use LocalBusiness or a more specific subtype?',
      a: 'Use the most specific subtype that fits: Restaurant, Dentist, AutoRepair, Hotel, Attorney, etc. Schema.org has 100+ LocalBusiness subtypes. Specific types unlock subtype-specific rich features (menus for restaurants, services for medical) and give AI assistants better classification.',
    },
    {
      q: 'What fields does Google require for local rich results?',
      a: 'Required: name, address (full PostalAddress), telephone. Recommended: openingHoursSpecification (per-day with opens/closes), priceRange, image, url, geo (latitude/longitude), aggregateRating, sameAs (social profile URLs).',
    },
    {
      q: 'How should I format opening hours?',
      a: 'Use openingHoursSpecification with one entry per day or day range. Each entry has dayOfWeek (Monday-Sunday), opens, and closes in 24-hour format. AI assistants parse this to answer "is X open right now?" — wrong format means the answer is wrong, which is worse than no answer.',
    },
    {
      q: 'My business has multiple locations. How do I mark them up?',
      a: 'Each location gets its own LocalBusiness page with location-specific schema. Do not stuff multiple addresses into one schema block. Use the parent Organization to link them via sameAs or department fields. Each location page should have a unique address, phone, and hours.',
    },
  ],

  fields: [
    { kind: 'text', key: 'name', label: 'Business Name', placeholder: "Joe's Coffee", required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'Specialty coffee roaster and cafe.', rows: 2 },
    { kind: 'text', key: 'image', label: 'Image URL', placeholder: 'https://example.com/storefront.jpg' },
    { kind: 'text', key: 'url', label: 'Website URL', placeholder: 'https://joescoffee.example' },
    { kind: 'text', key: 'telephone', label: 'Phone (E.164 format)', placeholder: '+1-415-555-0123', required: true },
    { kind: 'text', key: 'priceRange', label: 'Price Range ($, $$, $$$, $$$$)', placeholder: '$$' },
    { kind: 'text', key: 'streetAddress', label: 'Street Address', placeholder: '123 Main Street', required: true },
    { kind: 'text', key: 'addressLocality', label: 'City', placeholder: 'San Francisco', required: true },
    { kind: 'text', key: 'addressRegion', label: 'State / Region', placeholder: 'CA' },
    { kind: 'text', key: 'postalCode', label: 'Postal Code', placeholder: '94105' },
    { kind: 'text', key: 'addressCountry', label: 'Country (ISO 3166-1 alpha-2)', placeholder: 'US', required: true },
    {
      kind: 'repeater',
      key: 'hours',
      label: 'Opening Hours',
      addLabel: 'Add Hours',
      itemLabel: 'Hours',
      itemFields: [
        { kind: 'text', key: 'days', label: 'Day(s) (e.g. Mon-Fri or Saturday)', placeholder: 'Mon-Fri', required: true },
        { kind: 'text', key: 'opens', label: 'Opens (24h)', placeholder: '07:00', required: true },
        { kind: 'text', key: 'closes', label: 'Closes (24h)', placeholder: '19:00', required: true },
      ],
    },
  ],

  sampleData: {
    name: "Joe's Coffee",
    description: 'Specialty coffee roaster and cafe in downtown San Francisco. Single-origin pour-over and house-made pastries.',
    image: 'https://example.com/joes-coffee-storefront.jpg',
    url: 'https://joescoffee.example',
    telephone: '+1-415-555-0123',
    priceRange: '$$',
    streetAddress: '123 Main Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
    hours: [
      { days: 'Mon-Fri', opens: '07:00', closes: '19:00' },
      { days: 'Sat-Sun', opens: '08:00', closes: '17:00' },
    ],
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const url = getString(data, 'url').trim();
    const telephone = getString(data, 'telephone').trim();
    const priceRange = getString(data, 'priceRange').trim();
    const streetAddress = getString(data, 'streetAddress').trim();
    const addressLocality = getString(data, 'addressLocality').trim();
    const addressRegion = getString(data, 'addressRegion').trim();
    const postalCode = getString(data, 'postalCode').trim();
    const addressCountry = getString(data, 'addressCountry').trim();
    const hours = getRepeater(data, 'hours');

    const body: Record<string, unknown> = { '@type': 'LocalBusiness', name };
    if (description) body.description = description;
    if (image) body.image = image;
    if (url) body.url = url;
    if (telephone) body.telephone = telephone;
    if (priceRange) body.priceRange = priceRange;

    if (streetAddress || addressLocality) {
      body.address = {
        '@type': 'PostalAddress',
        ...(streetAddress && { streetAddress }),
        ...(addressLocality && { addressLocality }),
        ...(addressRegion && { addressRegion }),
        ...(postalCode && { postalCode }),
        ...(addressCountry && { addressCountry }),
      };
    }

    const hoursArr = hours
      .filter((h) => h.days?.trim() && h.opens?.trim() && h.closes?.trim())
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: expandDayRange(h.days.trim()),
        opens: h.opens.trim(),
        closes: h.closes.trim(),
      }));
    if (hoursArr.length) body.openingHoursSpecification = hoursArr;

    return jsonLdEnvelope(body);
  },
};

const dayMap: Record<string, string> = {
  Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday',
  Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday',
  Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',
  Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday',
};
const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function expandDayRange(input: string): string[] {
  const m = input.match(/^([A-Za-z]+)\s*-\s*([A-Za-z]+)$/);
  if (m) {
    const a = dayMap[m[1]];
    const b = dayMap[m[2]];
    if (a && b) {
      const ai = dayOrder.indexOf(a);
      const bi = dayOrder.indexOf(b);
      if (ai >= 0 && bi >= 0 && ai <= bi) return dayOrder.slice(ai, bi + 1);
    }
  }
  const single = dayMap[input];
  if (single) return [single];
  return [input];
}
