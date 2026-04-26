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
    {
      q: 'Should I include eventStatus?',
      a: 'Yes when the event status changes. eventStatus values: EventScheduled (default), EventCancelled, EventPostponed, EventRescheduled, EventMovedOnline. Google\'s rich result removes cancelled events from listings; AI assistants use it to answer "is X cancelled?" queries.',
    },
    {
      q: 'How do I mark up a hybrid (in-person + online) event?',
      a: 'Set eventAttendanceMode to MixedEventAttendanceMode. Provide location as an array with both Place (physical venue) and VirtualLocation (online URL). AI assistants and Google both surface hybrid events for "online or in-person" filter queries.',
    },
    {
      q: 'Should performer be an Organization or Person?',
      a: 'Match what fits. For concerts: Person or MusicGroup. For conferences: Organization (the speaker\'s company) or Person. For sports events: SportsTeam. For panels with multiple performers, use an array. AI engines use this to surface events when users search for the performer by name.',
    },
    {
      q: 'What is the right way to mark up free events?',
      a: 'Set offers.price to "0" and offers.priceCurrency. This is how AI assistants distinguish "free events" filter queries from paid events. Without offers, the schema is valid but the event drops from "free things to do" answers.',
    },
    {
      q: 'How does Google Maps use Event schema?',
      a: 'Google Maps surfaces events at venues with LocalBusiness schema linked to your Event\'s location.@id. This produces the "events at this venue" panel. Pages with both LocalBusiness (venue) and Event (with location pointing back) get noticeably more local discovery.',
    },
    {
      q: 'Can I mark up a virtual conference with multiple sessions?',
      a: 'Yes. Use a parent Event for the conference, with subEvent array of individual session Events. Each session has its own startDate, endDate, performer, description. AI assistants extract sessions individually for "what talks are there about X" queries.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (The Events Calendar / Events Manager)',
        description:
          'The Events Calendar (free) and Events Manager are the dominant WordPress event plugins. Both auto-emit Event schema for events created via their admin UI.',
        steps: [
          'Install The Events Calendar plugin (free) or Events Manager.',
          'Create events via the plugin\'s admin UI: title, datetime (with timezone), venue, organizer, ticket URL.',
          'Both plugins emit Event JSON-LD on the event page automatically — verify by viewing source.',
          'For ticketed events, install Event Tickets (companion plugin) — adds offers field with price and availability.',
          'For online events, set eventAttendanceMode in the plugin\'s advanced settings.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Eventbrite (embedded ticket widgets)',
        description:
          'If you embed Eventbrite\'s ticket widget on your own page, Eventbrite does not emit Event schema for you — you must add it on your page yourself, with offers pointing to the Eventbrite checkout URL.',
        steps: [
          'Add the Eventbrite checkout button or widget to your event page.',
          'Generate Event JSON-LD with the form above, using the Eventbrite checkout URL as offers.url.',
          'Make sure the visible event details (date, venue, price) on your page match the schema 1:1.',
          'Update offers.availability when tickets sell out (SoldOut) or when the event approaches (LimitedAvailability).',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js / Astro (event listing site or conference site)',
        description:
          'For framework-built event sites, define events as typed content collection entries. Build Event JSON-LD per event page; for listing pages, emit ItemList with each event as ListItem.',
        steps: [
          'Define a Zod schema for events requiring name, startDate, location (Place or VirtualLocation), organizer.',
          'For each event detail page, render Event JSON-LD inline.',
          'For the events listing page, emit ItemList with @type Event for each item — gets you carousel display in some surfaces.',
          'Update eventStatus dynamically when an event is cancelled or postponed.',
          'Wire schemaguardian into CI to validate every event page.',
        ],
        codeExample: `// app/events/[slug]/page.tsx
import Script from 'next/script';

export default async function EventPage({ params }) {
  const e = await getEvent(params.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: e.name,
    description: e.description,
    image: [e.image],
    startDate: e.startDate, // ISO 8601 with timezone
    endDate: e.endDate,
    eventAttendanceMode:
      e.mode === 'online'
        ? 'https://schema.org/OnlineEventAttendanceMode'
        : e.mode === 'mixed'
        ? 'https://schema.org/MixedEventAttendanceMode'
        : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus:
      e.status === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    location: e.mode === 'online'
      ? {
          '@type': 'VirtualLocation',
          url: e.streamUrl,
        }
      : {
          '@type': 'Place',
          name: e.venue,
          address: {
            '@type': 'PostalAddress',
            streetAddress: e.address,
            addressLocality: e.city,
            addressRegion: e.region,
            postalCode: e.postalCode,
            addressCountry: e.country,
          },
        },
    organizer: {
      '@type': 'Organization',
      name: e.organizer,
      url: e.organizerUrl,
    },
    offers: {
      '@type': 'Offer',
      price: e.price,
      priceCurrency: e.currency,
      availability:
        e.soldOut
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
      url: e.ticketUrl,
      validFrom: e.salesStart,
    },
    performer: e.performers.map(p => ({
      '@type': 'Person',
      name: p.name,
    })),
  };
  return (
    <>
      <article>{/* event page content */}</article>
      <Script id="event-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Static HTML (single event landing page)',
        description:
          'For one-off event landing pages (a launch event, a pop-up, a single-occurrence conference), paste the JSON-LD generated above directly into <head>. Easiest case.',
        steps: [
          'Generate the JSON-LD with the form above, including all date/venue/organizer/ticket fields.',
          'Paste the <script type="application/ld+json"> block into the <head> of the event page.',
          'Use absolute datetime with timezone (2026-09-15T19:00:00-07:00, not "Sept 15 at 7pm").',
          'When tickets sell out, manually update offers.availability to SoldOut on the page.',
          'After the event, leave the schema in place — Google removes past events from rich results automatically based on endDate.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Concert / live performance',
        description:
          'Music concert with venue, performer, and ticketed offers. Pattern most commonly cited by AI assistants for "concerts in {city}" queries — generates Google Events feature card with "Buy tickets" button.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "MusicEvent",
  "name": "Phoebe Bridgers — Punisher Tour Reprise",
  "description": "Phoebe Bridgers performs a special acoustic set at the Greek Theatre, Berkeley.",
  "image": "https://example.com/phoebe-greek-2026.jpg",
  "startDate": "2026-08-22T19:30:00-07:00",
  "endDate": "2026-08-22T22:00:00-07:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Greek Theatre Berkeley",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "2001 Gayley Rd",
      "addressLocality": "Berkeley",
      "addressRegion": "CA",
      "postalCode": "94720",
      "addressCountry": "US"
    }
  },
  "performer": {
    "@type": "Person",
    "name": "Phoebe Bridgers"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Another Planet Entertainment",
    "url": "https://apeconcerts.com"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "GA Standing",
      "price": "65",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://example.com/tickets/phoebe-ga",
      "validFrom": "2026-04-01T10:00:00-07:00"
    },
    {
      "@type": "Offer",
      "name": "Reserved Seating",
      "price": "95",
      "priceCurrency": "USD",
      "availability": "https://schema.org/LimitedAvailability",
      "url": "https://example.com/tickets/phoebe-seated"
    }
  ]
}`,
      },
      {
        scenario: 'Multi-day developer conference',
        description:
          'Conference Event with subEvent array (sessions), multiple performers, and tiered pricing. Pattern for tech conferences and industry summits.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Schema Conf 2026",
  "description": "A 2-day technical conference on structured data, AI search optimization, and the future of web SEO. Workshops on day 2.",
  "image": "https://example.com/schemaconf-2026.jpg",
  "startDate": "2026-09-15T09:00:00-07:00",
  "endDate": "2026-09-16T17:00:00-07:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": [
    {
      "@type": "Place",
      "name": "Moscone Center West",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "800 Howard St",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94103",
        "addressCountry": "US"
      }
    },
    {
      "@type": "VirtualLocation",
      "url": "https://schemaconf.example/live"
    }
  ],
  "organizer": {
    "@type": "Organization",
    "name": "Schema Conf",
    "url": "https://schemaconf.example"
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "Early Bird (in-person)",
      "price": "499",
      "priceCurrency": "USD",
      "availability": "https://schema.org/SoldOut",
      "url": "https://schemaconf.example/tickets"
    },
    {
      "@type": "Offer",
      "name": "Standard (in-person)",
      "price": "699",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://schemaconf.example/tickets"
    },
    {
      "@type": "Offer",
      "name": "Online stream",
      "price": "199",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://schemaconf.example/tickets"
    }
  ],
  "subEvent": [
    {
      "@type": "Event",
      "name": "Keynote: The State of Schema in 2026",
      "startDate": "2026-09-15T09:30:00-07:00",
      "endDate": "2026-09-15T10:30:00-07:00",
      "performer": { "@type": "Person", "name": "Maya Chen" },
      "location": { "@type": "Place", "name": "Main Stage" }
    },
    {
      "@type": "Event",
      "name": "Workshop: Building a Schema Validation CI Pipeline",
      "startDate": "2026-09-16T13:00:00-07:00",
      "endDate": "2026-09-16T16:00:00-07:00",
      "performer": { "@type": "Person", "name": "Jordan Park" },
      "location": { "@type": "Place", "name": "Workshop Room A" }
    }
  ]
}`,
      },
      {
        scenario: 'Online webinar / live stream',
        description:
          'Pure-online event with VirtualLocation. Pattern for webinars, virtual product launches, livestream Q&A. Free or paid both work.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "Schema for AI Search — Live Office Hours",
  "description": "A 60-minute live Q&A on schema markup strategy for AI search. Bring questions; we cover what is working in 2026.",
  "image": "https://example.com/office-hours-banner.jpg",
  "startDate": "2026-05-08T18:00:00-07:00",
  "endDate": "2026-05-08T19:00:00-07:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
  "location": {
    "@type": "VirtualLocation",
    "url": "https://faqjsonld.com/live"
  },
  "organizer": {
    "@type": "Organization",
    "name": "Schema for AI Search",
    "url": "https://faqjsonld.com"
  },
  "performer": {
    "@type": "Person",
    "name": "moonye6"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "https://faqjsonld.com/live/register",
    "validFrom": "2026-04-26T00:00:00-07:00"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Datetime without timezone offset',
        why: 'startDate "2026-09-15T19:00:00" without timezone is ambiguous. Google\'s parser interprets as UTC by default, which is usually wrong, and the event displays at incorrect times in SERPs.',
        fix: 'Always include timezone: 2026-09-15T19:00:00-07:00 (PDT) or 2026-09-15T19:00:00Z (UTC). Use the venue\'s local timezone, not the user\'s.',
      },
      {
        error: 'Free events without offers',
        why: 'Free events with no offers field disappear from "free things to do" filtered queries. AI assistants cannot tell free from unknown-pricing events without offers data.',
        fix: 'Always include offers, even for free events. Set price to "0" and priceCurrency, with availability InStock.',
      },
      {
        error: 'Cancelled events still showing as scheduled',
        why: 'When you cancel an event, leaving eventStatus as EventScheduled (or omitted, which defaults to scheduled) means Google and AI engines still surface it as upcoming. Users show up to a cancelled event.',
        fix: 'Set eventStatus to EventCancelled, EventPostponed, or EventRescheduled (with previousStartDate). Update visibly on the page too.',
      },
      {
        error: 'Online events without VirtualLocation URL',
        why: 'OnlineEventAttendanceMode without location.@type VirtualLocation and url makes the schema technically invalid. Google rejects it; AI assistants cannot route users to the actual stream.',
        fix: 'For online events: location.@type = VirtualLocation, location.url = the join URL (Zoom, YouTube live, custom platform). For hybrid: location is an array with both Place and VirtualLocation.',
      },
      {
        error: 'Stale events left in schema after the event ends',
        why: 'Past events lingering with eventStatus EventScheduled clutter Google\'s rich result feed. Some sites accumulate hundreds of past events with valid-but-outdated schema.',
        fix: 'Google removes past events from rich results based on endDate automatically — but for hygiene, archive past event pages or set eventStatus appropriately. Keeps your event archive clean.',
      },
      {
        error: 'Free event with availability SoldOut on free offer',
        why: 'Mixed signals: price 0 with availability SoldOut. Google\'s parser sometimes drops the event entirely; AI assistants treat as broken markup.',
        fix: 'For free events that have reached capacity, use SoldOut on offers AND set eventStatus to EventScheduled (still happening, just no more registrations). Update visibly on the page.',
      },
    ],
  },

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
