import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const eventSchema: SchemaTypeDef = {
  id: 'event',
  slug: 'event-schema-generator',
  name: 'Event Schema Generator',
  schemaType: 'Event',

  title: 'Event Schema Generator | JSON-LD for Google Events + AI Calendar Queries',
  metaDescription:
    'Generate Event JSON-LD with date, location, organizer, and offers. Triggers Google events SERP feature and powers AI assistant calendar answers.',
  h1: 'Event Schema Generator',
  intro:
    'Fill in event details including date, location, and organizer. Get clean Event JSON-LD that surfaces in Google events results and AI calendar queries.',
  geoAeoAngle:
    'Event schema feeds three surfaces in 2026: Google\'s events SERP feature (the date-stamped event cards), Google Maps event display, and AI assistants answering "what is happening in {city} this weekend" or "is X concert sold out". AI assistants in particular have become heavy consumers of Event schema since 2025 — they cannot scrape ticketing platform APIs at scale, but they can read your Event markup.',

  pageFaqs: [
    {
      q: 'What date format does Event schema require?',
      a: 'ISO 8601. For datetime: 2026-09-15T19:00:00-07:00 (with timezone offset). For all-day events: 2026-09-15 (date only). Wrong format means your event will not appear in any rich results — Google silently drops events with malformed dates.',
    },
    {
      q: 'How do I mark up online events?',
      a: 'Set eventAttendanceMode to OnlineEventAttendanceMode. Set location to a VirtualLocation with the URL where the event happens (Zoom link, YouTube live URL, etc.). For hybrid events, use MixedEventAttendanceMode and provide both Place and VirtualLocation in a location array.',
    },
    {
      q: 'Should I include offers (ticket info)?',
      a: 'Yes if applicable. The offers field with price, priceCurrency, availability, and url is what produces the "Buy tickets" button in event rich results. Free events should still set offers with price 0 and availability InStock — this is how AI assistants distinguish ticketed from open events.',
    },
    {
      q: 'How does Event schema interact with AI search "what is happening near me"?',
      a: 'Perplexity, ChatGPT search, and Gemini all parse Event schema when answering location-based event queries. Pages with full Event markup (date + venue + offers + organizer) get cited disproportionately. Pages with prose-only event details get skipped in favor of structured competitors.',
    },
    {
      q: 'Can I mark up a recurring event series?',
      a: 'Each instance should have its own Event entry. Schema.org has EventSeries but Google does not currently use it for rich results. Better practice: a separate Event entry per occurrence, each with its own datetime and (if applicable) offers.',
    },
  ],

  fields: [
    { kind: 'text', key: 'name', label: 'Event Name', placeholder: 'Astro Conf 2026', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A 2-day developer conference for the Astro web framework.', rows: 3 },
    { kind: 'text', key: 'image', label: 'Image URL', placeholder: 'https://example.com/event-banner.jpg' },
    { kind: 'text', key: 'startDate', label: 'Start Date (ISO 8601 with timezone)', placeholder: '2026-09-15T09:00:00-07:00', required: true },
    { kind: 'text', key: 'endDate', label: 'End Date (ISO 8601 with timezone)', placeholder: '2026-09-16T17:00:00-07:00' },
    { kind: 'text', key: 'attendanceMode', label: 'Attendance Mode (Offline | Online | Mixed)', placeholder: 'Offline' },
    { kind: 'text', key: 'venueName', label: 'Venue Name', placeholder: 'Moscone Center West' },
    { kind: 'text', key: 'venueAddress', label: 'Venue Address', placeholder: '800 Howard St, San Francisco, CA 94103' },
    { kind: 'text', key: 'organizerName', label: 'Organizer Name', placeholder: 'Astro' },
    { kind: 'text', key: 'organizerUrl', label: 'Organizer URL', placeholder: 'https://astro.build' },
    { kind: 'text', key: 'price', label: 'Ticket Price (numeric, 0 for free)', placeholder: '299' },
    { kind: 'text', key: 'priceCurrency', label: 'Currency (ISO 4217)', placeholder: 'USD' },
    { kind: 'text', key: 'ticketUrl', label: 'Ticket URL', placeholder: 'https://example.com/tickets' },
  ],

  sampleData: {
    name: 'Astro Conf 2026',
    description: 'A 2-day developer conference covering Astro 6, server islands, content layer, and the future of MPA architecture.',
    image: 'https://example.com/astroconf-2026-banner.jpg',
    startDate: '2026-09-15T09:00:00-07:00',
    endDate: '2026-09-16T17:00:00-07:00',
    attendanceMode: 'Offline',
    venueName: 'Moscone Center West',
    venueAddress: '800 Howard St, San Francisco, CA 94103',
    organizerName: 'Astro',
    organizerUrl: 'https://astro.build',
    price: '299',
    priceCurrency: 'USD',
    ticketUrl: 'https://example.com/astroconf-2026/tickets',
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const startDate = getString(data, 'startDate').trim();
    const endDate = getString(data, 'endDate').trim();
    const attendanceMode = getString(data, 'attendanceMode').trim();
    const venueName = getString(data, 'venueName').trim();
    const venueAddress = getString(data, 'venueAddress').trim();
    const organizerName = getString(data, 'organizerName').trim();
    const organizerUrl = getString(data, 'organizerUrl').trim();
    const price = getString(data, 'price').trim();
    const priceCurrency = getString(data, 'priceCurrency').trim();
    const ticketUrl = getString(data, 'ticketUrl').trim();

    const body: Record<string, unknown> = { '@type': 'Event', name, startDate };
    if (description) body.description = description;
    if (image) body.image = image;
    if (endDate) body.endDate = endDate;

    if (attendanceMode) {
      const mode = attendanceMode.toLowerCase();
      if (mode.includes('online')) {
        body.eventAttendanceMode = 'https://schema.org/OnlineEventAttendanceMode';
      } else if (mode.includes('mixed') || mode.includes('hybrid')) {
        body.eventAttendanceMode = 'https://schema.org/MixedEventAttendanceMode';
      } else {
        body.eventAttendanceMode = 'https://schema.org/OfflineEventAttendanceMode';
      }
    }

    if (venueName) {
      body.location = {
        '@type': 'Place',
        name: venueName,
        ...(venueAddress && { address: venueAddress }),
      };
    }

    if (organizerName) {
      body.organizer = {
        '@type': 'Organization',
        name: organizerName,
        ...(organizerUrl && { url: organizerUrl }),
      };
    }

    if (price && priceCurrency) {
      body.offers = {
        '@type': 'Offer',
        price,
        priceCurrency,
        availability: 'https://schema.org/InStock',
        ...(ticketUrl && { url: ticketUrl }),
      };
    }

    return jsonLdEnvelope(body);
  },
};
