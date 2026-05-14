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

  title: 'FAQ Schema Generator (2026): Generate Valid JSON-LD in 30 Seconds',
  metaDescription:
    'Yes, FAQ schema still works in 2026 — for AI search, not Google rich snippets. Generate valid FAQPage JSON-LD in 30 seconds. Free, no signup, copy-paste ready.',
  h1: 'FAQ Schema Generator',
  intro:
    'Paste your Q&A. Get valid FAQPage JSON-LD in 30 seconds. Free, no signup. The schema below is the same format AI search engines extract from when citing your page.',
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
    {
      q: 'Should I have one FAQPage schema per page or a sitewide one?',
      a: 'One per page, scoped to the visible FAQ block on that exact page. Sitewide FAQ schema repeated on every URL is a violation of the visible-content rule and gets ignored by Google. AI engines also treat repeated schema as a low-trust signal.',
    },
    {
      q: 'Can the same question appear under both FAQPage and a Question on a Q&A site?',
      a: 'No. FAQPage is for pages where the page owner authored both the question and the answer. QAPage is for community Q&A pages (Stack Overflow style) where answers come from users. Mixing them confuses extractors and is incorrect schema.',
    },
    {
      q: 'How does FAQ schema help with ChatGPT and Perplexity citations?',
      a: 'AI engines that crawl the web (Perplexity, ChatGPT browsing, Gemini) parse FAQPage markup as discrete question-answer pairs. When a user asks a similar question, the engine can lift the answer cleanly with attribution. Pages without FAQ schema still get cited but at lower rates because the engine has to infer Q&A boundaries from prose.',
    },
    {
      q: 'Should answers be short or long for AI citation?',
      a: 'Aim for 40-120 words per answer. Under 40 words and the answer often lacks the specifics AI engines reward; over 120 and the engine truncates mid-thought, hurting cite quality. Lead with the direct answer in the first sentence, then add 2-3 sentences of supporting detail.',
    },
    {
      q: 'Does FAQ schema work for product pages, blog posts, or landing pages?',
      a: 'Yes for all three, but only when the FAQ block is genuinely on the page. Product pages benefit most — common buyer questions (shipping, returns, sizing) are exactly what shopping AI assistants extract. Blog posts and landing pages benefit when the FAQ adds substantive new info beyond the main content.',
    },
    {
      q: 'What happens if I have invalid HTML inside an answer?',
      a: 'Google\'s rich results test will throw a parse error and the schema will be ignored entirely — even valid Q&A pairs in the same FAQPage block. Always run the JSON-LD output through a validator (this generator escapes for you, but if you hand-edit, escape all double quotes inside answer text).',
    },
    {
      q: 'Can I localize FAQ schema for different languages?',
      a: 'Yes — emit a separate FAQPage block per locale, on the localized URL. Use inLanguage on each Question if the page mixes languages, but the cleanest pattern is one FAQ schema per language URL with hreflang on the HTML.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast / RankMath)',
        description:
          'WordPress does not emit FAQ schema by default. The two dominant SEO plugins (Yoast and RankMath) both add a Gutenberg FAQ block that wires JSON-LD automatically — but only on posts that use the block, not on legacy classic-editor FAQ HTML.',
        steps: [
          'Install RankMath or Yoast SEO (both free tiers cover FAQ schema).',
          'In the Gutenberg editor, add the plugin\'s FAQ Block (RankMath: "FAQ Block by RankMath" / Yoast: "Yoast FAQ").',
          'Author each Q and A in the block — the plugin emits FAQPage JSON-LD automatically and the visible content matches.',
          'For legacy posts with classic-editor FAQ HTML, either re-author with the block or paste the JSON-LD from this generator into the page\'s Custom HTML.',
          'Validate with schemaguardian after publishing.',
        ],
      },
      {
        platform: 'Shopify (product pages)',
        description:
          'Shopify product pages frequently have FAQ accordions but most themes do not emit FAQPage schema for them. Add it via a section snippet that reads from a metafield or Liquid array.',
        steps: [
          'In your theme code editor, open snippets/ and create faq-schema.liquid.',
          'Define your FAQ as a metafield (namespace: custom, key: faq_pairs, type: list.metaobject) or a hard-coded Liquid array per template.',
          'Render <script type="application/ld+json"> with FAQPage and a mainEntity loop over the metafield.',
          'Include this snippet only on product templates where the visible FAQ accordion exists.',
          'Validate with schemaguardian after pushing the theme.',
        ],
        codeExample: `{% if product.metafields.custom.faq_pairs %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {% for pair in product.metafields.custom.faq_pairs.value %}
    {
      "@type": "Question",
      "name": {{ pair.question | json }},
      "acceptedAnswer": {
        "@type": "Answer",
        "text": {{ pair.answer | json }}
      }
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ]
}
</script>
{% endif %}`,
      },
      {
        platform: 'HubSpot / marketing landing pages',
        description:
          'HubSpot landing pages and HubDB-driven sites do not include FAQ schema in default modules. Add it via a custom HTML module on pages where FAQ is visible.',
        steps: [
          'In the Design Manager, create a Custom HTML module named "FAQ JSON-LD".',
          'Use HubSpot\'s HubL syntax to bind questions and answers from a HubDB table or module fields.',
          'Drop the module into the FAQ landing page template only — never sitewide.',
          'For marketing emails, do not include FAQ schema (it is for crawled web pages only, emails are not indexed).',
          'Validate with schemaguardian on the published landing page URL.',
        ],
      },
      {
        platform: 'Webflow',
        description:
          'Webflow has no native FAQ schema. Add it via an Embed element bound to CMS Collection fields, or via a <head> custom-code script on FAQ pages.',
        steps: [
          'Create a Webflow CMS Collection called "FAQ Items" with Question and Answer fields.',
          'On your FAQ page template, add an Embed element near the top.',
          'Use a Collection List inside an HTML embed pattern — Webflow supports CMS field bindings inside Embed.',
          'For pages with a fixed (non-CMS) FAQ, paste the JSON-LD output directly into the page\'s Inside <head> tag.',
          'Publish and validate with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js / Astro / static sites',
        description:
          'For framework-built sites, generate FAQPage JSON-LD at build time. Put the script tag in the same component that renders the visible FAQ — keeps content and schema in lockstep.',
        steps: [
          'Define your FAQ as a typed array (Array<{ q: string; a: string }>) in the same file as your FAQ component.',
          'Render the visible accordion from the array.',
          'In the same component, render <script type="application/ld+json"> built from the same array — guarantees content match.',
          'In Next.js use dangerouslySetInnerHTML; in Astro use set:html with is:inline on the script.',
          'Wire schemaguardian into your CI workflow so every deploy validates.',
        ],
        codeExample: `// FaqSection.astro
---
const faqs = [
  { q: 'What is X?', a: 'X is...' },
  { q: 'How do I Y?', a: 'You Y by...' },
];
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a }
  }))
};
---
<section>
  {faqs.map(f => (
    <details><summary>{f.q}</summary><p>{f.a}</p></details>
  ))}
</section>
<script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`,
      },
    ],

    examplesGallery: [
      {
        scenario: 'Product page FAQ (ecommerce)',
        description:
          'Buyer questions on a product page: shipping, returns, sizing, compatibility. This is the highest-leverage FAQ pattern — shopping AI assistants extract these directly when answering "is X right for me?" questions.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How long does shipping take?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Standard shipping is 3-5 business days within the US. Express is 1-2 business days. International shipping varies from 7-21 days depending on destination."
      }
    },
    {
      "@type": "Question",
      "name": "What is your return policy?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free returns within 30 days of delivery. Items must be unworn with original tags. Refunds are processed within 5-7 business days of receiving the return."
      }
    },
    {
      "@type": "Question",
      "name": "Are these headphones compatible with iPhone?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The headphones support Bluetooth 5.3 and pair with all iPhone models from iPhone 7 onward. They also support Apple's Find My network for tracking."
      }
    }
  ]
}`,
      },
      {
        scenario: 'Service / agency FAQ',
        description:
          'Common pre-sales questions for a service business: pricing structure, timeline, process, what-is-included. Cited heavily by AI engines answering "how much does X cost" or "how long does X take" queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How much does a brand identity project cost?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Our brand identity engagements range from $15,000 to $80,000 depending on scope. A typical SMB engagement (logo, type system, color, basic guidelines) is $25,000-$35,000 over 6-8 weeks."
      }
    },
    {
      "@type": "Question",
      "name": "What is included in the engagement?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Discovery workshop, competitive audit, three logo directions with two rounds of refinement, type and color system, basic brand guidelines (PDF), and source files (AI, SVG, PNG). Web design and motion are scoped separately."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with early-stage startups?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. We have a separate early-stage tier ($8,000-$12,000) with a tighter scope: one logo direction, color and type, and a one-page guideline. Designed to fit pre-seed and seed budgets."
      }
    }
  ]
}`,
      },
      {
        scenario: 'Documentation FAQ (SaaS / dev tools)',
        description:
          'Developer-facing FAQ on a docs page. AI coding assistants (Cursor, Copilot Chat, Claude in IDE) cite this pattern when answering integration and troubleshooting questions during a coding session.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I authenticate API requests?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Pass your API key as a Bearer token in the Authorization header: 'Authorization: Bearer YOUR_API_KEY'. Keys are created in the dashboard under Settings → API. Never expose keys in client-side code — proxy through your backend."
      }
    },
    {
      "@type": "Question",
      "name": "What rate limits apply?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free tier: 60 requests/minute. Pro: 600 requests/minute. Enterprise: custom. Rate-limit headers (X-RateLimit-Remaining, X-RateLimit-Reset) are returned on every response. 429 responses include a Retry-After header."
      }
    },
    {
      "@type": "Question",
      "name": "Why am I getting CORS errors?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The API only accepts requests from server-side. Browser-direct calls fail CORS by design — exposing API keys client-side is unsafe. Proxy through your backend, or use our public client SDK which handles auth without exposing keys."
      }
    }
  ]
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Hidden FAQ content (visible: none)',
        why: 'Google requires Q&A text in FAQPage to match content visibly available to users. CSS-hidden FAQ accordions where the answer is not in the DOM at all (lazy-loaded) fail this requirement.',
        fix: 'Render Q and A text in the initial HTML (server-rendered or static). CSS that hides answers behind a toggle is fine — it is JS-only injection that fails. If you must lazy-load, inject the JSON-LD on the same load event.',
      },
      {
        error: 'Same FAQ schema on every page',
        why: 'Sitewide FAQ JSON-LD repeated on URLs that do not actually display the FAQ violates the visible-content match rule. Google ignores it; AI engines treat repeated schema as a low-trust signal.',
        fix: 'Scope FAQ schema to pages where the FAQ block is genuinely visible. If your FAQ block is on /faq, only emit FAQPage JSON-LD on /faq.',
      },
      {
        error: 'Using FAQPage for community Q&A',
        why: 'FAQPage is for pages where the page owner authored both Q and A. Stack Overflow-style pages with user-submitted answers should use QAPage with Question and Answer (multiple, with upvotes), not FAQPage.',
        fix: 'Switch the @type to QAPage. Each Question has a single acceptedAnswer (best answer) and an array of suggestedAnswer with upvoteCount.',
      },
      {
        error: 'Unescaped quotes inside answer HTML',
        why: 'A single unescaped double quote inside acceptedAnswer.text breaks the JSON, and Google\'s parser ignores the entire FAQPage block — not just the offending Q&A pair.',
        fix: 'Always JSON.stringify or use a generator (this tool handles escaping). If hand-editing, escape all " inside answer text as \\" and validate with the rich results test before deploying.',
      },
      {
        error: 'Promotional content disguised as questions',
        why: 'Q&A pairs that are sales pitches ("Why is our product the best?") rather than information violate Google\'s spam policy for FAQ schema and are stripped from extraction. AI engines also de-prioritize them.',
        fix: 'Write questions in the buyer\'s voice, not the seller\'s. Real questions a customer would type into search. Answers should be informative, with the brand mentioned only when factually relevant.',
      },
      {
        error: 'FAQPage on a search results or category page',
        why: 'Google explicitly disallows FAQPage on listing/search pages. The schema is for pages with first-party authored Q&A content.',
        fix: 'Move the FAQ to a dedicated info page or a product/landing page where the Q&A is the page\'s primary substantive content.',
      },
      {
        error: 'Question text without a question mark',
        why: 'Not a hard validation error, but AI extractors weight the presence of question structure (interrogative form, ? terminator) when deciding whether to lift an answer cleanly.',
        fix: 'Phrase Question.name as a real question with a ? at the end. "How does X work?" beats "X overview".',
      },
    ],
  },

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
