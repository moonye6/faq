import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getRepeater,
} from '~/lib/schema-types';

export const faqSchema: SchemaTypeDef = {
  id: 'faq',
  slug: 'faq-schema-generator',
  name: 'FAQ Schema Generator',
  schemaType: 'FAQPage',

  title: 'FAQ Schema Generator | JSON-LD for AI Search Citation',
  metaDescription:
    'Generate valid FAQPage JSON-LD that AI search engines (Perplexity, ChatGPT, Gemini, Google AI Overviews) actually cite. Free, no signup.',
  h1: 'FAQ Schema Generator',
  intro:
    'Paste your questions and answers. Get clean FAQPage JSON-LD ready to drop into your <head>.',
  geoAeoAngle:
    'Google scaled back FAQ rich snippets in 2023 and cut them further in March 2026. But FAQ structured data has one of the highest citation rates in AI search. The point of FAQ schema in 2026 is no longer the SERP dropdown — it is making your answers easy for ChatGPT, Perplexity, Gemini, and Google AI Overviews to extract and cite.',

  pageFaqs: [
    {
      q: 'Does FAQ schema still help SEO in 2026?',
      a: 'Not the way it used to. Google restricted FAQ rich results to government and health authority sites in 2023, and the March 2026 core update cut visible FAQ rich snippets by roughly half across tracked sites. But FAQ schema remains highly valuable for AI search — Perplexity, ChatGPT, Gemini, and Google AI Overviews use FAQ markup as a primary signal when extracting and citing answers.',
    },
    {
      q: 'Where do I put the JSON-LD output?',
      a: 'Inside a <script type="application/ld+json"> tag in the <head> of the page where the FAQ content lives. Do not paste it into the body or repeat it across pages where the visible FAQ does not exist — Google flags mismatches.',
    },
    {
      q: 'Do my questions and answers need to be visible on the page?',
      a: 'Yes. Google requires that the question and answer text in your FAQPage schema match content visibly available to users on the same page. Hidden or mismatched content can cause your structured data to be ignored or trigger a manual action.',
    },
    {
      q: 'How many questions should I include?',
      a: 'There is no hard limit, but quality beats quantity. 4-8 well-written Q&A pairs that match real user questions outperform 30 padded ones. Each answer should be self-contained — AI search engines extract answers individually, so an answer that depends on context from another answer will not cite well.',
    },
    {
      q: 'Can I use HTML inside answers?',
      a: 'Yes. The FAQPage schema accepts HTML in the acceptedAnswer.text field. Common safe tags: <p>, <a>, <ul>, <ol>, <li>, <strong>, <em>. Avoid <script>, <iframe>, and inline event handlers — they will be stripped or cause validation errors.',
    },
  ],

  fields: [
    {
      kind: 'repeater',
      key: 'qaPairs',
      label: 'Questions & Answers',
      addLabel: 'Add Question',
      itemLabel: 'Q&A',
      minItems: 1,
      itemFields: [
        {
          kind: 'text',
          key: 'question',
          label: 'Question',
          placeholder: 'What is FAQ schema?',
          required: true,
        },
        {
          kind: 'textarea',
          key: 'answer',
          label: 'Answer',
          placeholder: 'FAQ schema is structured data that...',
          required: true,
          rows: 3,
        },
      ],
    },
  ],

  sampleData: {
    qaPairs: [
      {
        question: 'What is FAQ schema?',
        answer:
          'FAQ schema (FAQPage in schema.org) is structured data that tells search engines and AI assistants the question-and-answer structure of a page, so they can cite individual answers.',
      },
      {
        question: 'Why does FAQ schema matter for AI search?',
        answer:
          'AI search engines like Perplexity, ChatGPT, Gemini, and Google AI Overviews use FAQ markup as a high-confidence signal when extracting answers. Pages with clean FAQ schema get cited more often than pages without it.',
      },
    ],
  },

  buildJsonLd: (data) => {
    const pairs = getRepeater(data, 'qaPairs');
    return jsonLdEnvelope({
      '@type': 'FAQPage',
      mainEntity: pairs
        .filter((p) => p.question?.trim() && p.answer?.trim())
        .map((p) => ({
          '@type': 'Question',
          name: p.question.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: p.answer.trim(),
          },
        })),
    });
  },
};
