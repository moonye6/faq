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
    {
      q: 'How do AI assistants use LocalBusiness schema for "near me" queries?',
      a: 'When a user asks "best dentist near me" in ChatGPT search or Perplexity, the engine queries indexed pages with LocalBusiness schema in the user\'s geographic area. It extracts name, hours, rating, and price range to compose the answer with citations. Without the schema, your business simply does not appear in the candidate set.',
    },
    {
      q: 'Should I include geo coordinates (latitude / longitude)?',
      a: 'Strongly recommended. The geo field with a GeoCoordinates object (latitude, longitude) helps both Google\'s map pack and AI assistants distinguish between businesses with similar names in different cities. Use a tool like Google Maps to get exact coordinates, not approximate.',
    },
    {
      q: 'What is the right format for telephone numbers?',
      a: 'E.164 international format: +[country code][area code][number] with no spaces or dashes (e.g., +14155550123). This is the format Google Knowledge Graph and AI assistants prefer. Display format on the page can be human-friendly (415-555-0123) — the schema field should be E.164.',
    },
    {
      q: 'How do I mark up businesses without a fixed location (mobile, service-area)?',
      a: 'Use the areaServed field with a list of cities or a GeoCircle, instead of (or in addition to) address. For purely mobile businesses, omit address.streetAddress and use areaServed. Schema.org defines ServiceAreaBusiness as a subtype that signals this explicitly.',
    },
    {
      q: 'Can I include menus, services, or product offerings in LocalBusiness schema?',
      a: 'Yes — for restaurants, use hasMenu pointing to a Menu schema. For service businesses, use hasOfferCatalog with an OfferCatalog of Services. AI assistants parse these to answer "does X offer Y?" questions, and Google uses them for richer local results.',
    },
    {
      q: 'How important is aggregateRating for local businesses?',
      a: 'Critical. Both Google\'s map pack and AI "best near me" answers heavily weight rating. If you have genuine reviews on your site (or pulled from a verified source), include aggregateRating with ratingValue, reviewCount, and bestRating. Inflating fake reviews violates Google\'s policy and triggers penalties.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast Local / RankMath)',
        description:
          'Yoast Local SEO and RankMath both have local-business modules that auto-emit LocalBusiness schema from a settings panel. Easiest path for WordPress sites.',
        steps: [
          'Install Yoast Local SEO (paid extension to Yoast SEO) or RankMath (free with local module).',
          'Go to the local SEO settings panel and fill in business name, address, hours, phone, price range.',
          'Choose the most specific subtype (Restaurant, Dentist, etc.) — both plugins support 100+ subtypes.',
          'For multiple locations, both plugins support a Locations custom post type — one post per location with its own schema.',
          'Validate each location page with schemaguardian.',
        ],
      },
      {
        platform: 'Squarespace',
        description:
          'Squarespace has built-in business info fields but does NOT auto-emit LocalBusiness JSON-LD. Add it manually via Code Injection.',
        steps: [
          'Settings → Advanced → Code Injection → Header.',
          'Paste a JSON-LD block with your business details (name, address, hours, phone, price range).',
          'For multi-location: add per-page code injection on each location page (Page Settings → Advanced → Page Header Code Injection) instead of sitewide.',
          'If your business hours change, update the code injection — Squarespace will not auto-sync from the business info panel.',
          'Validate with schemaguardian after saving.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Joe's Coffee",
  "image": "https://example.com/storefront.jpg",
  "telephone": "+14155550123",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94105",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7749,
    "longitude": -122.4194
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:00",
      "closes": "19:00"
    }
  ],
  "servesCuisine": "Coffee",
  "acceptsReservations": "False"
}
</script>`,
      },
      {
        platform: 'Wix',
        description:
          'Wix has a built-in Business Info panel and emits some LocalBusiness schema by default, but with limited fields (often missing geo, openingHoursSpecification, priceRange). Augment via the Wix custom code feature.',
        steps: [
          'In Wix Editor, go to Settings → Custom Code → Add Custom Code.',
          'Set placement to Head, scope to All Pages (or specific Pages for multi-location).',
          'Paste a complete LocalBusiness JSON-LD block with the fields Wix omits.',
          'Wix\'s default schema may conflict — test with view-source on the live page; if duplicate, contact Wix support to disable their default emission for your subtype.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Static HTML / hand-rolled site',
        description:
          'For HTML-only sites or hand-coded landing pages, drop the JSON-LD generated above directly into the <head> of each location page.',
        steps: [
          'Generate the JSON-LD using this tool with your business details.',
          'Paste the <script type="application/ld+json"> block into the <head> section of the page.',
          'For multi-location: each location\'s page gets its own LocalBusiness schema block — never share one schema across pages.',
          'Update hours and price range whenever they change on the visible page.',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Restaurant with menu and reservations',
        description:
          'Full-fat Restaurant subtype with cuisine, menu URL, reservations flag, and aggregate rating. Pattern for sit-down restaurants — surfaces in Google map pack and AI "best [cuisine] near me" answers.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": "Trattoria Roma",
  "image": "https://example.com/trattoria-storefront.jpg",
  "url": "https://trattoriaroma.example",
  "telephone": "+14155550199",
  "priceRange": "$$$",
  "servesCuisine": "Italian",
  "menu": "https://trattoriaroma.example/menu",
  "acceptsReservations": "True",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "789 Columbus Avenue",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94133",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7989,
    "longitude": -122.4093
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Tuesday","Wednesday","Thursday"],
      "opens": "17:30",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Friday","Saturday"],
      "opens": "17:30",
      "closes": "23:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "17:00",
      "closes": "21:30"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "243"
  }
}`,
      },
      {
        scenario: 'Dental clinic / medical practice',
        description:
          'Dentist subtype (specific medical LocalBusiness) with services offered. AI health assistants surface this for "find a dentist who does [procedure]" queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Dentist",
  "name": "Bayview Family Dental",
  "image": "https://example.com/clinic-photo.jpg",
  "url": "https://bayviewfamilydental.example",
  "telephone": "+14155550144",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "456 Ocean Avenue",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94112",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 37.7234,
    "longitude": -122.4567
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday"],
      "opens": "08:00",
      "closes": "17:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Friday",
      "opens": "08:00",
      "closes": "14:00"
    }
  ],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Dental Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "General Cleaning"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Cosmetic Dentistry"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Invisalign"
        }
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "187"
  }
}`,
      },
      {
        scenario: 'Service-area business (mobile / no storefront)',
        description:
          'Plumber, electrician, mobile mechanic, or any service business that travels to customers and has no fixed walk-in location. Uses areaServed instead of a strict storefront address pattern.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "Bay Area Emergency Plumbing",
  "image": "https://example.com/truck.jpg",
  "url": "https://bayareaemergencyplumbing.example",
  "telephone": "+14155550155",
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "addressCountry": "US"
  },
  "areaServed": [
    { "@type": "City", "name": "San Francisco" },
    { "@type": "City", "name": "Daly City" },
    { "@type": "City", "name": "South San Francisco" },
    { "@type": "City", "name": "Oakland" }
  ],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "412"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Phone number not in E.164 format',
        why: 'Telephone field with formatting like (415) 555-0123 or 415.555.0123 is harder for Google\'s parser and AI assistants to normalize. Some implementations accept it; some do not.',
        fix: 'Use E.164: +14155550123 (no spaces, no dashes, country code prefix). Display format on the page can stay human-friendly.',
      },
      {
        error: 'Same LocalBusiness schema on every page',
        why: 'Sitewide LocalBusiness emitted on /about, /contact, /pricing all at once is fine for branding pages but causes confusion for multi-location businesses where each location should have its own schema scoped to its own page.',
        fix: 'For single-location: sitewide schema is fine on About/Contact/Home. For multi-location: scope LocalBusiness to each location\'s page only.',
      },
      {
        error: 'Wrong dayOfWeek format in openingHoursSpecification',
        why: 'dayOfWeek must be the full English day name ("Monday", "Tuesday") or the schema.org URL (https://schema.org/Monday). Abbreviations ("Mon"), three-letter codes, or non-English names break parsing.',
        fix: 'Use full English day names. The generator above handles this — if hand-editing, expand "Mon-Fri" to ["Monday","Tuesday","Wednesday","Thursday","Friday"].',
      },
      {
        error: 'Using LocalBusiness when a more specific subtype fits',
        why: 'Generic LocalBusiness works but loses subtype-specific features. A restaurant marked as LocalBusiness instead of Restaurant misses cuisine, menu, and reservation hooks that Google and AI engines look for.',
        fix: 'Pick the most specific schema.org subtype (Restaurant, Dentist, Attorney, AutoRepair, etc.). Search schema.org for "LocalBusiness subtypes" — there are 100+.',
      },
      {
        error: 'Inflated or fake aggregateRating',
        why: 'Adding aggregateRating with ratingValue 5.0 and reviewCount 200 when there are no genuine reviews on the page violates Google\'s structured data spam policy. AI assistants also fingerprint suspiciously perfect ratings.',
        fix: 'Only include aggregateRating if you have genuine reviews visible on the same page (or via a verified review platform integration). Match ratingValue and reviewCount to what is actually shown.',
      },
      {
        error: 'Missing geo coordinates',
        why: 'Without geo (latitude, longitude), Google\'s map pack has to geocode from the address, which is lossy and sometimes places the pin at a building entrance vs. parking lot. AI assistants also have lower confidence in your location.',
        fix: 'Get exact coordinates from Google Maps (right-click your storefront → click the lat/lng to copy). Include them as GeoCoordinates with latitude and longitude as numbers (not strings).',
      },
    ],
  },

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
