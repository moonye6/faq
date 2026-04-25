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
  ],

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
