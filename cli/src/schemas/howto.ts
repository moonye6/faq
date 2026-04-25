import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getRepeater,
  getString,
} from '~/lib/schema-types';

export const howtoSchema: SchemaTypeDef = {
  id: 'howto',
  slug: 'howto-schema-generator',
  name: 'HowTo Schema Generator',
  schemaType: 'HowTo',

  title: 'HowTo Schema Generator | JSON-LD for AI-Citable Tutorials',
  metaDescription:
    'Generate valid HowTo JSON-LD for tutorials and step-by-step guides. Optimized for AI search citation in Perplexity, ChatGPT, Gemini, and Google AI Overviews.',
  h1: 'HowTo Schema Generator',
  intro:
    'Describe your tutorial step by step. Get clean HowTo JSON-LD ready to drop into your <head>.',
  geoAeoAngle:
    'Google removed HowTo rich results from desktop in 2023 and from mobile in 2024. But HowTo structured data is still one of the cleanest signals you can give an AI search engine: this page is a tutorial, here are the steps in order, here is what each step does. Perplexity, ChatGPT, Gemini, and Google AI Overviews lean heavily on HowTo schema when extracting "how do I..." answers.',

  pageFaqs: [
    {
      q: 'Are HowTo rich results still shown in Google?',
      a: 'No. Google removed HowTo rich results from desktop in late 2023 and from all surfaces by 2024. The HowTo schema type itself is still valid and still being indexed — Google just stopped rendering the visual rich result.',
    },
    {
      q: 'Why bother with HowTo schema if it does not show in Google SERPs?',
      a: 'AI search consumers (Perplexity, ChatGPT, Gemini, Google AI Overviews) use HowTo schema as a primary signal when extracting tutorial answers. A page marked up as HowTo with explicit steps is dramatically easier for an AI to cite cleanly than the same content as plain prose.',
    },
    {
      q: 'How granular should each step be?',
      a: 'One concrete action per step. "Open the file" is a step. "Open the file, parse the JSON, and validate the schema" is three steps. AI search engines cite individual steps when answering "what is the first step to..." queries — atomic steps cite better.',
    },
    {
      q: 'Do I need step images?',
      a: 'No, but they help. The HowToStep type accepts an optional image field. AI search engines that surface visual answers (Google AI Overviews, Perplexity Pro) prefer steps with images when available.',
    },
  ],

  fields: [
    {
      kind: 'text',
      key: 'name',
      label: 'Tutorial Name',
      placeholder: 'How to add FAQ schema to a Next.js site',
      required: true,
    },
    {
      kind: 'textarea',
      key: 'description',
      label: 'Description',
      placeholder: 'A short summary of what this tutorial accomplishes.',
      rows: 2,
    },
    {
      kind: 'text',
      key: 'totalTime',
      label: 'Total Time (ISO 8601 duration, e.g. PT15M)',
      placeholder: 'PT15M',
    },
    {
      kind: 'repeater',
      key: 'steps',
      label: 'Steps',
      addLabel: 'Add Step',
      itemLabel: 'Step',
      minItems: 1,
      itemFields: [
        {
          kind: 'text',
          key: 'name',
          label: 'Step Name',
          placeholder: 'Install the package',
          required: true,
        },
        {
          kind: 'textarea',
          key: 'text',
          label: 'Step Instructions',
          placeholder: 'Run `bun add @example/package` in your project root.',
          required: true,
          rows: 2,
        },
      ],
    },
  ],

  sampleData: {
    name: 'How to add FAQ schema to any HTML page',
    description: 'A 3-step guide for adding FAQPage JSON-LD to a static or dynamic HTML page.',
    totalTime: 'PT5M',
    steps: [
      {
        name: 'Generate the JSON-LD',
        text: 'Use a FAQ schema generator to convert your Q&A pairs into FAQPage JSON-LD.',
      },
      {
        name: 'Wrap in a script tag',
        text: 'Place the JSON-LD inside <script type="application/ld+json"> tags.',
      },
      {
        name: 'Insert into the <head>',
        text: 'Add the script tag inside the <head> of the page where the visible FAQ content lives.',
      },
    ],
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const totalTime = getString(data, 'totalTime').trim();
    const steps = getRepeater(data, 'steps');

    const body: Record<string, unknown> = {
      '@type': 'HowTo',
      name,
      step: steps
        .filter((s) => s.name?.trim() && s.text?.trim())
        .map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name.trim(),
          text: s.text.trim(),
        })),
    };
    if (description) body.description = description;
    if (totalTime) body.totalTime = totalTime;

    return jsonLdEnvelope(body);
  },
};
