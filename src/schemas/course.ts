import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const courseSchema: SchemaTypeDef = {
  id: 'course',
  slug: 'course-schema-generator',
  name: 'Course Schema Generator',
  schemaType: 'Course',

  title: 'Course Schema Generator | JSON-LD for Online Course Discovery',
  metaDescription:
    'Generate Course JSON-LD with provider, mode, duration, and price. Feeds Google Course rich results and AI assistants answering "how to learn X" queries.',
  h1: 'Course Schema Generator',
  intro:
    'Mark up your online course with provider, duration, mode, and price. Get clean Course JSON-LD that surfaces in Google course results and AI learning queries.',
  geoAeoAngle:
    'Course schema serves two surfaces in 2026. First: Google\'s Course rich results and Course carousels still render for educational queries (though limited to recognized providers — Coursera, edX, Udemy, plus self-published courses with strong signals). Second and increasingly important: AI assistants like ChatGPT, Perplexity, and Gemini directly recommend courses when answering "how do I learn X" questions, and they cite pages with Course schema disproportionately. For independent course creators, Course schema is the cheapest way to get into AI assistant recommendations.',

  pageFaqs: [
    {
      q: 'Does my course need to be on a major platform to use Course schema?',
      a: 'No. Course schema works for any provider — Coursera, Udemy, edX, your own LMS, a Notion page, a YouTube playlist. Major platforms have an inherent ranking advantage, but self-hosted courses with clean Course schema can still earn AI assistant citations and (sometimes) Google rich results.',
    },
    {
      q: 'What fields are required vs recommended?',
      a: 'Required: name, description, provider (with @type Organization). Strongly recommended: hasCourseInstance with courseMode (Online | Onsite | Blended), courseWorkload (ISO 8601 duration), instructor, offers with price, and educationalLevel. Without hasCourseInstance, your course is much less likely to show in Course rich results.',
    },
    {
      q: 'How do I mark up a free course?',
      a: 'Set offers.price to "0" and priceCurrency to your currency. Free courses are eligible for the same rich results as paid ones — and AI assistants explicitly favor free options when users do not specify budget. "Best free course on X" queries lean heavily on Course schema with price 0.',
    },
    {
      q: 'What is courseWorkload and how do I format it?',
      a: 'Total time learners are expected to spend, in ISO 8601 duration format. PT2H = 2 hours, P1W = 1 week, P3M = 3 months. AI assistants surface this when users ask "how long does it take to learn X" — accuracy matters more than impression management. Inflated workloads get flagged.',
    },
    {
      q: 'Can I mark up a series of related courses?',
      a: 'Yes. For each course, use a separate Course entry. To express the relationship, use isPartOf pointing to a parent EducationalOccupationalProgram entity. AI assistants currently use this less than they could — but Google\'s course display does respect series structure.',
    },
    {
      q: 'Should I include aggregateRating from student reviews?',
      a: 'Yes if you have genuine reviews on the page. Both Google\'s Course rich result and AI assistants weight rating heavily when ranking course recommendations. Inflating fake ratings violates Google policy — common cause of course platform demotion.',
    },
    {
      q: 'How do AI assistants pick courses to recommend?',
      a: 'They look for: (1) Course schema present, (2) clear provider, (3) explicit workload (matches "in N hours" filter queries), (4) educationalLevel match, (5) genuine aggregateRating, (6) free offers when budget unspecified. Pages missing 3+ of these get skipped.',
    },
    {
      q: 'What educationalLevel values does Google recognize?',
      a: 'Beginner, Intermediate, Advanced are the three Google documents. Schema.org accepts more (Professional, "high school", college level). Stick to the three for Course rich result eligibility. AI assistants normalize all variants internally.',
    },
    {
      q: 'How should I mark up a course with multiple instructors?',
      a: 'instructor accepts an array of Person objects. Pass each with name, url, and ideally sameAs. AI engines cite all instructors when recommending; use the first as primary if order matters.',
    },
    {
      q: 'Can I include hasCourseInstance.courseSchedule with start dates?',
      a: 'Yes for cohort-based courses. Use Schedule with startDate, endDate, repeatFrequency. AI assistants surface this when users ask "when does the next cohort start". Self-paced courses can omit this field.',
    },
    {
      q: 'How does Course schema interact with Coursera / Udemy listings?',
      a: 'If you also list on Coursera/Udemy, both they and your site emit Course schema. Use canonical link tags pointing to your preferred source (usually your own site if you control quality). For AI assistants, multiple listings are fine — they consolidate based on schema content.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (LearnDash / Tutor LMS / LifterLMS)',
        description:
          'LearnDash, Tutor LMS, and LifterLMS are the three dominant WordPress LMS plugins. All emit basic Course schema, but coverage varies — some omit hasCourseInstance, instructor, or pricing fields. Augment with custom schema if needed.',
        steps: [
          'Verify your LMS plugin\'s Course schema output: view source on a course page and search for "@type": "Course".',
          'If basic Course is present but missing hasCourseInstance: add a custom Function or Code Snippets entry that injects the missing fields via wp_head action.',
          'For aggregateRating, ensure the LMS plugin\'s review system emits ratings (or use a separate reviews plugin like Site Reviews).',
          'For educationalLevel, set it via the plugin\'s course taxonomy if available; otherwise emit via custom code.',
          'Validate with schemaguardian on a published course page.',
        ],
      },
      {
        platform: 'Teachable / Thinkific (course platforms)',
        description:
          'Both Teachable and Thinkific emit Course schema by default on the course landing page, but with limited fields (often missing instructor sameAs, structured rating, full pricing tiers). Augment via theme HTML insertion.',
        steps: [
          'In Teachable: Site → Custom Code → Site head section → paste an additional Course JSON-LD block with the fields the platform omits.',
          'In Thinkific: Site Builder → Settings → Code & Analytics → Site Footer → paste schema.',
          'Use a stable @id (e.g., https://academy.acme.example/courses/{slug}#course) so duplicate Course blocks consolidate as one entity.',
          'Make sure your custom schema does not contradict the platform\'s default — they coexist as long as fields agree.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js / Astro (self-hosted course site)',
        description:
          'For framework-built course sites (most independent course creators by 2026), define courses as typed content collection entries. Build full Course JSON-LD with hasCourseInstance, instructor sameAs, offers, and aggregateRating.',
        steps: [
          'Define a Zod schema for courses requiring name, description, provider, instructor, courseMode, workload, price, level.',
          'For each course landing page, render Course JSON-LD inline.',
          'Pull aggregateRating from your reviews data source (database, headless CMS, third-party).',
          'For cohort-based courses, dynamically update hasCourseInstance.courseSchedule with the next start date.',
          'Wire schemaguardian into CI to validate every course page.',
        ],
        codeExample: `// app/courses/[slug]/page.tsx
import Script from 'next/script';

export default async function CoursePage({ params }) {
  const c = await getCourse(params.slug);
  const reviews = await getCourseRating(c.id);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    '@id': \`https://academy.acme.example/courses/\${c.slug}#course\`,
    name: c.name,
    description: c.description,
    provider: {
      '@type': 'Organization',
      name: 'Acme Academy',
      url: 'https://academy.acme.example',
    },
    educationalLevel: c.level, // 'Beginner' | 'Intermediate' | 'Advanced'
    inLanguage: 'en',
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: c.mode, // 'Online' | 'Onsite' | 'Blended'
      courseWorkload: c.workload, // 'PT8H', 'P4W'
      instructor: c.instructors.map(i => ({
        '@type': 'Person',
        name: i.name,
        url: i.url,
        sameAs: i.socialLinks,
      })),
      offers: {
        '@type': 'Offer',
        price: c.price.toString(),
        priceCurrency: c.currency,
        availability: 'https://schema.org/InStock',
        url: c.purchaseUrl,
      },
    },
    aggregateRating: reviews.count > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: reviews.average,
      reviewCount: reviews.count,
      bestRating: 5,
    } : undefined,
  };
  return (
    <>
      <article>{/* course landing page */}</article>
      <Script id="course-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Static HTML (single course landing page)',
        description:
          'For one-off course landing pages, paste the JSON-LD generated above into <head>. Easiest case for indie creators selling a single course.',
        steps: [
          'Generate the JSON-LD with the form above, including provider, mode, workload, price.',
          'Paste the <script type="application/ld+json"> block into the <head>.',
          'Update offers.price and offers.availability when you change pricing or close enrollment.',
          'Add aggregateRating manually after collecting genuine reviews — match exactly what the page displays.',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Self-paced online course (paid)',
        description:
          'Standard self-paced video course pattern. Provider is the platform; instructor is the named teacher. Free preview lessons on landing page support visible-content match.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://academy.acme.example/courses/schema-for-ai-search#course",
  "name": "Schema for AI Search",
  "description": "A self-paced 4-week course on structured data optimization for AI search citation. 8 hours of video, 12 hands-on exercises, downloadable cheat sheet.",
  "image": "https://academy.acme.example/courses/schema-for-ai-search/cover.jpg",
  "provider": {
    "@type": "Organization",
    "name": "Acme Academy",
    "url": "https://academy.acme.example",
    "logo": "https://academy.acme.example/logo.png"
  },
  "educationalLevel": "Intermediate",
  "inLanguage": "en",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT8H",
    "instructor": {
      "@type": "Person",
      "name": "Alex Chen",
      "url": "https://example.com/authors/alex-chen",
      "sameAs": [
        "https://twitter.com/alexchen",
        "https://www.linkedin.com/in/alexchen"
      ]
    },
    "offers": {
      "@type": "Offer",
      "price": "149",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://academy.acme.example/courses/schema-for-ai-search/enroll",
      "category": "Lifetime access"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5"
  }
}`,
      },
      {
        scenario: 'Cohort-based bootcamp (with start dates)',
        description:
          'Synchronous cohort course with scheduled start/end dates. Pattern for premium bootcamps and accelerators. Schedule object lets AI assistants answer "when does the next cohort start".',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://academy.acme.example/courses/seo-bootcamp-cohort-7#course",
  "name": "SEO Bootcamp — Cohort 7",
  "description": "An 8-week cohort-based SEO bootcamp with live weekly sessions, hands-on audits of your real site, and small-group coaching. Cohort 7 starts June 2026.",
  "image": "https://academy.acme.example/seo-bootcamp/cohort-7-cover.jpg",
  "provider": {
    "@type": "Organization",
    "name": "Acme Academy",
    "url": "https://academy.acme.example"
  },
  "educationalLevel": "Intermediate",
  "inLanguage": "en",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "P8W",
    "courseSchedule": {
      "@type": "Schedule",
      "startDate": "2026-06-15",
      "endDate": "2026-08-10",
      "repeatFrequency": "P1W",
      "byDay": "https://schema.org/Tuesday"
    },
    "location": {
      "@type": "VirtualLocation",
      "url": "https://academy.acme.example/cohort-7/live"
    },
    "instructor": [
      {
        "@type": "Person",
        "name": "Maya Chen",
        "url": "https://example.com/authors/maya-chen"
      },
      {
        "@type": "Person",
        "name": "Jordan Park",
        "url": "https://example.com/authors/jordan-park"
      }
    ],
    "offers": [
      {
        "@type": "Offer",
        "name": "Standard",
        "price": "1499",
        "priceCurrency": "USD",
        "availability": "https://schema.org/LimitedAvailability",
        "url": "https://academy.acme.example/seo-bootcamp/cohort-7/enroll",
        "validFrom": "2026-04-15",
        "validThrough": "2026-06-10"
      },
      {
        "@type": "Offer",
        "name": "Early bird (ends April 30)",
        "price": "1199",
        "priceCurrency": "USD",
        "availability": "https://schema.org/SoldOut",
        "url": "https://academy.acme.example/seo-bootcamp/cohort-7/enroll",
        "validFrom": "2026-04-15",
        "validThrough": "2026-04-30"
      }
    ]
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "82",
    "bestRating": "5"
  }
}`,
      },
      {
        scenario: 'Free MOOC / open course',
        description:
          'Free open course pattern (Coursera-audit-style or self-published). Free offer with price 0, full instructor and workload, eligible for "best free course" AI queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Course",
  "@id": "https://opencourse.example/web-fundamentals#course",
  "name": "Web Fundamentals: HTML, CSS, JS",
  "description": "A free 6-week introduction to web development covering HTML semantics, CSS layout, JavaScript basics, and accessibility. No prerequisites.",
  "image": "https://opencourse.example/web-fundamentals/cover.jpg",
  "provider": {
    "@type": "Organization",
    "name": "Open Course Initiative",
    "url": "https://opencourse.example",
    "@id": "https://opencourse.example/#organization"
  },
  "educationalLevel": "Beginner",
  "inLanguage": "en",
  "isAccessibleForFree": true,
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "Online",
    "courseWorkload": "PT24H",
    "instructor": {
      "@type": "Person",
      "name": "Sarah Kim",
      "url": "https://opencourse.example/instructors/sarah-kim"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://opencourse.example/web-fundamentals/enroll"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "1843",
    "bestRating": "5"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Course without hasCourseInstance',
        why: 'Bare Course schema (just name, description, provider) is technically valid but disqualifies you from Course rich results in Google. AI assistants also have less to work with.',
        fix: 'Always include hasCourseInstance with at least courseMode and offers. Add courseWorkload, instructor, courseSchedule (for cohorts) for fuller eligibility.',
      },
      {
        error: 'Inflated workload',
        why: 'Listing courseWorkload "P12W" (12 weeks) for a course that genuinely takes 4 weeks misleads users and AI assistants. Eventually flagged via student feedback signals; can trigger demotion.',
        fix: 'Estimate honestly. Target time-on-task an average student spends. If you offer accelerated and standard tracks, document the standard track in schema.',
      },
      {
        error: 'Wrong courseMode value',
        why: 'courseMode accepts only Online, Onsite, or Blended. Custom values like "Self-paced" or "Live" fail Google parsing — falls back to no course rich result.',
        fix: 'Map your terminology to the three accepted values: Online (purely remote), Onsite (purely in-person), Blended (mix of both).',
      },
      {
        error: 'Free course missing offers',
        why: 'Course with no offers field disappears from "free courses" filter queries on AI assistants. Without explicit price 0, the AI cannot tell free from "pricing unknown".',
        fix: 'Always include offers, even free. Set price to "0" and priceCurrency, with availability InStock.',
      },
      {
        error: 'Provider as a string instead of Organization object',
        why: 'provider: "Acme Academy" parses but loses entity attribution. Google\'s rich result and AI assistants prefer linked entities for authority signals.',
        fix: 'Always: provider: { "@type": "Organization", "name": "Acme Academy", "url": "https://academy.acme.example", "@id": "https://academy.acme.example/#organization" }.',
      },
      {
        error: 'Inflated aggregateRating without genuine reviews',
        why: 'Adding 5.0 / 500 reviews when the course has no visible reviews on the page violates structured data spam policy. Google has actively demoted course pages for this.',
        fix: 'Only include aggregateRating if you have real reviews displayed on the page. Match ratingValue and reviewCount to what visitors see. Use a reviews plugin or platform with verified data.',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'name', label: 'Course Name', placeholder: 'Schema for AI Search', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A 4-week course on structured data optimization for AI search citation.', required: true, rows: 3 },
    { kind: 'text', key: 'providerName', label: 'Provider Name', placeholder: 'Acme Academy', required: true },
    { kind: 'text', key: 'providerUrl', label: 'Provider URL', placeholder: 'https://acme.example' },
    { kind: 'text', key: 'courseMode', label: 'Mode (Online | Onsite | Blended)', placeholder: 'Online' },
    { kind: 'text', key: 'workload', label: 'Workload (ISO 8601 duration, e.g. PT8H, P4W)', placeholder: 'PT8H' },
    { kind: 'text', key: 'instructorName', label: 'Instructor Name', placeholder: 'Alex Chen' },
    { kind: 'text', key: 'price', label: 'Price (numeric, 0 for free)', placeholder: '49' },
    { kind: 'text', key: 'priceCurrency', label: 'Currency (ISO 4217)', placeholder: 'USD' },
    { kind: 'text', key: 'educationalLevel', label: 'Level (Beginner | Intermediate | Advanced)', placeholder: 'Intermediate' },
  ],

  sampleData: {
    name: 'Schema for AI Search',
    description: 'A self-paced 4-week course covering structured data optimization for AI search citation. Includes hands-on exercises with FAQ, Product, and Article schema.',
    providerName: 'Acme Academy',
    providerUrl: 'https://academy.acme.example',
    courseMode: 'Online',
    workload: 'PT8H',
    instructorName: 'Alex Chen',
    price: '49',
    priceCurrency: 'USD',
    educationalLevel: 'Intermediate',
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const providerName = getString(data, 'providerName').trim();
    const providerUrl = getString(data, 'providerUrl').trim();
    const courseMode = getString(data, 'courseMode').trim();
    const workload = getString(data, 'workload').trim();
    const instructorName = getString(data, 'instructorName').trim();
    const price = getString(data, 'price').trim();
    const priceCurrency = getString(data, 'priceCurrency').trim();
    const educationalLevel = getString(data, 'educationalLevel').trim();

    const body: Record<string, unknown> = {
      '@type': 'Course',
      name,
      description,
      provider: {
        '@type': 'Organization',
        name: providerName,
        ...(providerUrl && { url: providerUrl }),
      },
    };

    if (educationalLevel) body.educationalLevel = educationalLevel;

    if (courseMode || workload || instructorName || (price && priceCurrency)) {
      const instance: Record<string, unknown> = { '@type': 'CourseInstance' };
      if (courseMode) {
        const mode = courseMode.toLowerCase();
        instance.courseMode = mode === 'online' ? 'Online' : mode === 'onsite' ? 'Onsite' : 'Blended';
      }
      if (workload) instance.courseWorkload = workload;
      if (instructorName) {
        instance.instructor = { '@type': 'Person', name: instructorName };
      }
      if (price && priceCurrency) {
        instance.offers = {
          '@type': 'Offer',
          price,
          priceCurrency,
          availability: 'https://schema.org/InStock',
        };
      }
      body.hasCourseInstance = instance;
    }

    return jsonLdEnvelope(body);
  },
};
