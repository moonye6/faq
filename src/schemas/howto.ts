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
    {
      q: 'Should I include tools and supplies?',
      a: 'Yes, when relevant. Use HowToTool for items consumed by hand (drill, knife) and HowToSupply for items consumed in the process (screws, ingredients). AI engines cite these for "what do I need to..." queries — without them, the answer is incomplete.',
    },
    {
      q: 'How should I format totalTime, prepTime, and performTime?',
      a: 'ISO 8601 duration format. PT15M = 15 minutes. PT1H30M = 1 hour 30 minutes. prepTime + performTime should equal totalTime when all three are provided. AI engines use these to filter "quick how-to" vs "weekend project" queries.',
    },
    {
      q: 'Can I use HowTo for software tutorials and code-heavy guides?',
      a: 'Yes. Software tutorials are one of the highest-leverage HowTo cases for AI citation — coding assistants (Cursor, Copilot, Claude) cite step-by-step guides constantly. Use code blocks inside step.text (HTML <code> or <pre> tags are accepted).',
    },
    {
      q: 'How does HowTo differ from a Recipe?',
      a: 'Recipe is a specific schema.org type (subtype of HowTo) with food-specific fields: recipeIngredient, recipeInstructions, nutrition, recipeYield, cookTime. Use Recipe for cooking content; HowTo for everything else (DIY, software, repairs, crafts).',
    },
    {
      q: 'Should each step have its own URL anchor?',
      a: 'Yes if practical. Use HowToStep.url with a fragment (#step-3) pointing to that step on the page. AI engines that deep-link can route users directly to the step they cite. For pages without step anchors, omit the field.',
    },
    {
      q: 'What is the right number of steps?',
      a: 'No hard limit, but AI citation works best with 4-12 atomic steps. Under 4 and the schema feels thin (consider whether HowTo is the right type at all). Over 12 and engines may truncate or summarize, hurting cite fidelity. Break long tutorials into multiple HowTo pages.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast / RankMath / Schema Pro)',
        description:
          'WordPress does not emit HowTo schema natively. RankMath, Schema Pro, and Yoast SEO Premium all have HowTo block / module support. RankMath\'s free tier covers it with a Gutenberg block.',
        steps: [
          'Install RankMath (free tier covers HowTo) or Yoast SEO Premium.',
          'In the Gutenberg editor, add the HowTo Block (RankMath: "HowTo Block by RankMath" / Yoast: "Yoast Howto").',
          'Author each step with name and instructions; add tools and supplies via the block sidebar.',
          'The plugin emits HowTo JSON-LD automatically and renders the visible step list — content match is automatic.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Shopify (DIY / instructional store)',
        description:
          'Shopify does not have native HowTo schema. For tutorial blog posts (e.g., "How to use this tool"), add HowTo via a custom Liquid section.',
        steps: [
          'In your theme code editor, create snippets/howto-schema.liquid.',
          'Define your steps as a metafield array (namespace: custom, key: howto_steps, type: list.metaobject).',
          'Render <script type="application/ld+json"> with HowTo type and step array from the metafield.',
          'Include the snippet in article.liquid or product.liquid templates only on tutorial-style pages.',
          'Validate with schemaguardian after pushing the theme.',
        ],
        codeExample: `{% if article.metafields.custom.howto_steps %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": {{ article.title | json }},
  "description": {{ article.excerpt | strip_html | json }},
  {% if article.metafields.custom.total_time %}
  "totalTime": {{ article.metafields.custom.total_time | json }},
  {% endif %}
  "step": [
    {% for step in article.metafields.custom.howto_steps.value %}
    {
      "@type": "HowToStep",
      "position": {{ forloop.index }},
      "name": {{ step.name | json }},
      "text": {{ step.instructions | json }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
{% endif %}`,
      },
      {
        platform: 'Next.js / Astro (docs sites, tutorial blogs)',
        description:
          'For framework-built sites, define steps as a typed array and render JSON-LD alongside the visible step list. Pattern fits docs sites, technical blogs, and developer tutorials best.',
        steps: [
          'Define steps as Array<{name: string; text: string; image?: string}> in your MDX/markdown frontmatter or content collection.',
          'In the page component, render the visible <ol> from the array.',
          'Render <script type="application/ld+json"> with HowTo built from the same array — guarantees content match.',
          'For step-by-step code tutorials, allow HTML/code in text and pass through React.createElement or Astro\'s set:html.',
          'Wire schemaguardian into CI to validate every deploy.',
        ],
        codeExample: `// tutorial.astro
---
const steps = [
  { name: 'Install the package', text: 'Run npm install @your/lib in your project root.' },
  { name: 'Import the helper', text: 'Add import { schemaGen } from "@your/lib" to your file.' },
  { name: 'Generate JSON-LD', text: 'Call schemaGen({type: "FAQPage", ...}) and pass to your <head>.' },
];
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to generate FAQPage JSON-LD with @your/lib',
  totalTime: 'PT5M',
  step: steps.map((s, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: s.name,
    text: s.text,
  })),
};
---
<ol>
  {steps.map(s => <li><strong>{s.name}</strong>: {s.text}</li>)}
</ol>
<script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`,
      },
      {
        platform: 'Static HTML (single-page tutorials)',
        description:
          'For one-off HTML tutorial pages, paste the JSON-LD generated above directly into the <head>. Simplest case.',
        steps: [
          'Generate the JSON-LD using the form above with each tutorial step.',
          'Paste the <script type="application/ld+json"> block into the <head> of the tutorial page.',
          'Make sure the visible step list on the page matches the schema steps in name and order.',
          'Add HowToTool and HowToSupply if relevant — both can be added directly in the JSON-LD.',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'DIY home repair (with tools and supplies)',
        description:
          'Classic DIY tutorial pattern with tools, supplies, and time estimates. AI assistants cite this for "how do I..." home queries; the tool/supply lists answer "what do I need" follow-ups.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Patch a Drywall Hole in Under an Hour",
  "description": "A simple 5-step guide to patching a fist-sized drywall hole using a self-adhesive mesh patch and joint compound.",
  "image": "https://example.com/howto/drywall-patch-hero.jpg",
  "totalTime": "PT45M",
  "estimatedCost": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": "12"
  },
  "tool": [
    { "@type": "HowToTool", "name": "Putty knife" },
    { "@type": "HowToTool", "name": "Sanding block (120 grit)" },
    { "@type": "HowToTool", "name": "Utility knife" }
  ],
  "supply": [
    { "@type": "HowToSupply", "name": "Self-adhesive drywall mesh patch (4x4 inch)" },
    { "@type": "HowToSupply", "name": "Joint compound (1 lb)" },
    { "@type": "HowToSupply", "name": "Paint matching wall color (1 cup)" }
  ],
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Clean the hole edges",
      "text": "Use the utility knife to trim any loose paper or jagged edges around the hole. The surface should be flat and dust-free."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Apply the mesh patch",
      "text": "Press the self-adhesive mesh patch over the hole, centered. Smooth it flat with your hand."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Spread the first layer of joint compound",
      "text": "Using the putty knife, spread a thin layer of joint compound over the patch, extending 2 inches beyond on all sides. Let dry 4-6 hours."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Sand and apply a second layer",
      "text": "Lightly sand the dried compound smooth. Apply a second thinner layer extending 4 inches beyond the patch. Let dry overnight."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Sand smooth and paint",
      "text": "Sand the second layer to a smooth flush finish. Wipe dust away. Apply paint matching the wall color in two coats."
    }
  ]
}`,
      },
      {
        scenario: 'Software / coding tutorial (AI-citable)',
        description:
          'Developer-facing HowTo for adding a feature to a codebase. Pattern most cited by AI coding assistants — atomic steps with code blocks score highest in citation extraction.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Add Schema Markup to a Next.js App",
  "description": "Add JSON-LD structured data (FAQPage, Article, Product) to a Next.js app using next/script with type-safe schema objects.",
  "totalTime": "PT15M",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Define a typed schema object",
      "text": "Create lib/schema.ts with a typed FaqPage object: const faqJsonLd = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: [...] }."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Import next/script",
      "text": "In your page component (e.g., app/faq/page.tsx), import Script from next/script."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Render the JSON-LD inline",
      "text": "Below the visible FAQ block, render <Script id='faq-jsonld' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Verify with rich results test",
      "text": "Deploy to staging. Open Google's Rich Results Test (search.google.com/test/rich-results) and paste the URL. Confirm 0 errors."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Wire CI validation",
      "text": "Add schemaguardian to your GitHub Actions workflow: npx @moonye/schemaguardian scan on every PR. Blocks regressions before they reach production."
    }
  ]
}`,
      },
      {
        scenario: 'Quick how-to (under 5 minutes, mobile-friendly)',
        description:
          'Short atomic tutorial for "quick how-to" queries. Pattern for life hacks, settings tweaks, fast fixes. Highly cited in voice search and AI assistants.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Enable Dark Mode on iPhone",
  "description": "Switch your iPhone to Dark Mode in three taps from any home screen.",
  "totalTime": "PT30S",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Open Settings",
      "text": "Tap the Settings app on your home screen."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Go to Display & Brightness",
      "text": "Scroll down and tap Display & Brightness."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Select Dark",
      "text": "Under Appearance, tap the Dark thumbnail. The change applies immediately."
    }
  ]
}`,
      },
    ],

    commonErrors: [
      {
        error: 'HowTo on a non-tutorial page',
        why: 'Some sites apply HowTo schema to product pages, blog posts, or landing pages that are not actually step-by-step tutorials. Google\'s parser flags this as misuse and can trigger a manual action.',
        fix: 'Only use HowTo when the page is a genuine step-by-step guide with numbered/ordered steps that someone could follow start-to-finish. Otherwise use Article, Product, or FAQPage.',
      },
      {
        error: 'Steps in wrong order or with non-sequential positions',
        why: 'HowToStep requires position as a sequential integer starting at 1. Skipping or duplicating positions breaks step ordering for AI engines that cite "the third step is..." queries.',
        fix: 'Always start at position 1 and increment by 1. The generator above handles this automatically — if hand-editing, double-check.',
      },
      {
        error: 'Missing totalTime',
        why: 'AI engines filter how-to results by duration ("quick 5-minute fix" vs "weekend project"). Without totalTime, your tutorial is excluded from time-bounded queries.',
        fix: 'Always include totalTime in ISO 8601 format. Estimate honestly — if your "5-minute fix" actually takes 30 minutes, the engine will catch the mismatch via user feedback signals.',
      },
      {
        error: 'Step text too long or combining multiple actions',
        why: 'Single steps that combine three actions ("install, configure, and test") cite poorly because the AI cannot extract a single atomic answer for "what is the first step".',
        fix: 'One concrete action per step. Break combined steps apart. If a step truly has substeps, use HowToSection nested inside the step.',
      },
      {
        error: 'Schema steps mismatch visible page steps',
        why: 'Visible page lists 5 steps but schema has 7 (or vice versa). Google\'s structured data spam policy treats this as deceptive markup.',
        fix: 'Generate schema from the same source array as the visible UI. Render both from one array of step objects.',
      },
      {
        error: 'Using HowTo for cooking recipes',
        why: 'Recipes have a more specific schema (Recipe) with food-specific fields (recipeIngredient, recipeYield, nutrition). Using HowTo for cooking content loses these signals.',
        fix: 'Switch to Recipe schema for any cooking/baking content. Recipe is a subtype of HowTo so the structure is similar; you just gain food-specific fields.',
      },
    ],
  },

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
