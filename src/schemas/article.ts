import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const articleSchema: SchemaTypeDef = {
  id: 'article',
  slug: 'article-schema-generator',
  name: 'Article Schema Generator',
  schemaType: 'Article',

  title: 'Article Schema Generator | BlogPosting JSON-LD for News & Blog SEO',
  metaDescription:
    'Generate Article (BlogPosting / NewsArticle) JSON-LD for Google News, Discover, and AI search citation. Includes author, dates, publisher, and image fields.',
  h1: 'Article Schema Generator',
  intro:
    'Fill in headline, author, dates, and publisher. Get clean Article JSON-LD ready for Google News, Discover, and AI search citation.',
  geoAeoAngle:
    'Article schema is what Google News and Discover use to surface your post, and what AI search engines use to attribute citations to a specific author and publication date. AI assistants almost always prefer to cite content with clear author + date metadata over content without it. Article schema is the cheapest way to give them what they need.',

  pageFaqs: [
    {
      q: 'When should I use Article vs BlogPosting vs NewsArticle?',
      a: 'BlogPosting for blog posts. NewsArticle for news pieces (gets News tab consideration). Article as the generic catch-all. They share the same fields. If you publish a mix, pick the most specific type per page — search engines treat them differently in eligibility.',
    },
    {
      q: 'What fields does Google require for Article rich results?',
      a: 'Required: headline, image (1+ URLs, ideally 1200px+ wide), datePublished, author (with name and ideally url). Recommended: dateModified, publisher (with name and logo), description, articleBody. Without publisher logo, Top Stories carousel eligibility drops significantly.',
    },
    {
      q: 'Why does AI search care about Article schema?',
      a: 'When AI assistants cite content, they need to attribute it: "According to {author}, writing in {publisher} on {date}, ..." Article schema gives them all four cleanly. Pages without it get cited as "according to a website" or skipped entirely in favor of pages with attribution.',
    },
    {
      q: 'Should the headline match the page <title>?',
      a: 'They should be very close but do not have to be identical. Headline is the spoken-form title (what you would say). Title tag often has SEO modifiers ("| Site Name", "(2026 Update)"). If they diverge widely, Google may treat the page as untrustworthy or pick its own.',
    },
    {
      q: 'How important is dateModified vs datePublished?',
      a: 'Both matter. datePublished is what AI assistants cite. dateModified is what Google uses to decide freshness ranking. Update dateModified whenever you make substantive edits — but do not lie. Unchanged pages with bumped dateModified eventually get penalized.',
    },
    {
      q: 'What dimensions and aspect ratios should the image be?',
      a: 'Google specifies multiple variants ideally: 1×1 (1200×1200), 4×3 (1200×900), 16×9 (1920×1080). Pass image as an array of three URLs to maximize rich result eligibility across different surfaces. Minimum width is 1200 px regardless of aspect.',
    },
    {
      q: 'Can the author be an Organization instead of a Person?',
      a: 'Yes — set author.@type to Organization. Use this for institutional content (corporate blog, agency report). For named-author posts, use Person with name and url. Mixed cases (e.g., "Acme Editorial Team") work as Organization.',
    },
    {
      q: 'What is sameAs on author and how does it help AI citation?',
      a: 'sameAs is an array of canonical URLs for the same author entity (LinkedIn, Twitter, personal site, ORCID, Wikipedia). It lets Google\'s Knowledge Graph and AI engines link the author across the web, boosting cite quality. For named authors, always include at least 2-3 sameAs URLs.',
    },
    {
      q: 'Do I need articleBody in the schema?',
      a: 'Optional but valuable. articleBody with the full article text gives AI engines a clean source for citation extraction (vs. having to clean HTML). For paywalled or partially-visible content, articleBody can include the full text even when the page truncates — but you must visibly display the same text or risk a "cloaking" violation.',
    },
    {
      q: 'How should I mark up multi-author articles?',
      a: 'author accepts an array. Pass each author as a Person object with name, url, and ideally sameAs. AI engines cite all listed authors when they cite the article. Order matters — the first author is treated as primary in some surfaces.',
    },
    {
      q: 'Does Article schema help for AI Overviews specifically?',
      a: 'Yes. Google AI Overviews heavily prefer cited sources with full Article markup (clear author, date, publisher). Pages without it are cited at lower rates and often replaced by aggregator sites that do mark up correctly. Article schema is one of the few near-zero-cost ways to improve AI Overview cite share.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (Yoast / RankMath)',
        description:
          'WordPress emits Article schema automatically via Yoast or RankMath. Both pull from the post\'s metadata (author, date, featured image, site title) so almost no manual work — just verify configuration.',
        steps: [
          'Install Yoast SEO or RankMath (both free tiers cover Article schema).',
          'In RankMath: Schema → Default Schema Type → Article (or BlogPosting/NewsArticle per post type).',
          'In Yoast: SEO → Search Appearance → Content Types → Posts → enable Article schema.',
          'Configure the publisher logo in plugin settings (must be ≥600×60px for Top Stories eligibility).',
          'For each post, ensure the featured image is set and ≥1200px wide.',
          'Validate with schemaguardian after publishing.',
        ],
      },
      {
        platform: 'Ghost',
        description:
          'Ghost emits BlogPosting / NewsArticle schema by default in its core templates (Casper, Source). Customize via theme handlebars helpers if you need to extend.',
        steps: [
          'Verify your theme outputs Article schema: view source on a published post and search for "@type": "Article".',
          'If using a custom theme, add {{ghost_head}} in default.hbs (in <head>) and {{ghost_foot}} in the footer — Ghost auto-emits schema via these helpers.',
          'For NewsArticle eligibility, edit the theme post.hbs and override the default schema with a {{!-- handlebars partial --}} that sets @type to NewsArticle.',
          'For author sameAs, populate the Twitter and Facebook fields in each author\'s profile — Ghost adds them to schema automatically.',
          'Validate with schemaguardian.',
        ],
      },
      {
        platform: 'Substack',
        description:
          'Substack emits basic Article schema on post pages but with limited fields (no Organization publisher, weak author markup). For premium SEO, this is one of Substack\'s known weaknesses — many writers also self-host on a custom domain to take full control.',
        steps: [
          'Substack does not allow custom <head> code on standard plans — there is no way to inject extended Article schema directly.',
          'For paid Substack Pro, you can add custom code via the Customization panel — paste an extended Article JSON-LD block referencing post metadata.',
          'For higher SEO ceiling, mirror posts to a self-hosted blog (Astro, Next.js) with full schema control and use Substack as the email distribution layer.',
          'Always include canonical link tags pointing to one source (Substack OR self-hosted, not both).',
          'Validate the canonical URL with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js (App Router)',
        description:
          'Use Next.js 13+ generateMetadata or inline JSON-LD via <Script>. Build the Article object from your post frontmatter or CMS record.',
        steps: [
          'In your post page (app/blog/[slug]/page.tsx), import Script from next/script.',
          'Build the Article object: const articleJsonLd = { "@type": "Article", headline, image, datePublished, dateModified, author, publisher }.',
          'Render <Script id="article-jsonld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} /> in the page body.',
          'For dynamic OG image (different image per post), make sure the schema image URL matches the OG image URL.',
          'Wire schemaguardian into CI to validate every deploy.',
        ],
        codeExample: `// app/blog/[slug]/page.tsx
import Script from 'next/script';

export default async function Post({ params }) {
  const post = await getPost(params.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage1x1, post.coverImage4x3, post.coverImage16x9],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      url: \`https://example.com/authors/\${post.author.slug}\`,
      sameAs: post.author.links,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Example Magazine',
      logo: { '@type': 'ImageObject', url: 'https://example.com/logo.png' },
    },
  };
  return (
    <>
      <article>{post.content}</article>
      <Script id="article-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Astro Content Collections',
        description:
          'Astro\'s content collections give you typed frontmatter that maps cleanly to Article schema. Use a Zod schema to enforce required fields, then build JSON-LD at SSG time.',
        steps: [
          'Define a Zod schema for posts in src/content/config.ts requiring headline, datePublished, author, image.',
          'In the [slug].astro page, build the Article object from Astro.props.entry.data.',
          'Render <script is:inline type="application/ld+json"> with set:html={JSON.stringify(jsonLd)}.',
          'For author sameAs, define authors in a separate content collection and reference by slug.',
          'Validate with schemaguardian on every deploy.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Long-form blog post (BlogPosting)',
        description:
          'Standard pattern for editorial blog content: named author, multi-resolution images, full publisher block with logo. Highest cite-rate config for AI Overviews.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "How AI Search Changed SEO in 2026",
  "description": "Google reduced FAQ and HowTo rich results, but Perplexity and ChatGPT now cite structured data more aggressively than ever. A 2026 field guide.",
  "image": [
    "https://example.com/ai-search-2026-1x1.jpg",
    "https://example.com/ai-search-2026-4x3.jpg",
    "https://example.com/ai-search-2026-16x9.jpg"
  ],
  "datePublished": "2026-04-25T09:00:00-07:00",
  "dateModified": "2026-04-26T11:30:00-07:00",
  "author": {
    "@type": "Person",
    "name": "Alex Chen",
    "url": "https://example.com/authors/alex-chen",
    "sameAs": [
      "https://twitter.com/alexchen",
      "https://www.linkedin.com/in/alexchen",
      "https://github.com/alexchen"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Magazine",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png",
      "width": 600,
      "height": 60
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/ai-search-2026"
  }
}`,
      },
      {
        scenario: 'News article (NewsArticle, Top Stories eligible)',
        description:
          'NewsArticle subtype eligible for Top Stories carousel and Google News. Stricter publisher logo requirements. Pattern for newsrooms and time-sensitive reporting.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Schema Markup Surges to All-Time High in 2026 Crawler Survey",
  "description": "Google's structured data reduction has not slowed adoption — 67% of top 1M domains now emit JSON-LD, up from 41% in 2023.",
  "image": [
    "https://example.com/news-cover.jpg"
  ],
  "datePublished": "2026-04-26T06:30:00Z",
  "dateModified": "2026-04-26T08:15:00Z",
  "dateline": "San Francisco",
  "author": [
    {
      "@type": "Person",
      "name": "Sarah Kim",
      "url": "https://example.com/authors/sarah-kim"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Search Engine Journal",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/sej-logo.png",
      "width": 600,
      "height": 60
    }
  },
  "articleSection": "SEO",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/news/schema-adoption-2026"
  }
}`,
      },
      {
        scenario: 'Research / whitepaper article',
        description:
          'Long-form research with multiple authors, citations, and a corporate publisher. Pattern for industry reports, technical whitepapers, agency thought leadership.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "The State of AI Search Citations: 2026 Annual Report",
  "description": "An empirical analysis of 50,000 AI-generated answers from ChatGPT, Perplexity, Gemini, and Google AI Overviews. Cite-share, attribution patterns, and structured-data correlation.",
  "image": [
    "https://example.com/report-cover-1x1.jpg",
    "https://example.com/report-cover-16x9.jpg"
  ],
  "datePublished": "2026-04-15",
  "dateModified": "2026-04-25",
  "author": [
    {
      "@type": "Person",
      "name": "Dr. Maya Patel",
      "url": "https://example.com/authors/maya-patel",
      "sameAs": [
        "https://orcid.org/0000-0001-0000-0000",
        "https://www.linkedin.com/in/mayapatel"
      ]
    },
    {
      "@type": "Person",
      "name": "Tom Wright",
      "url": "https://example.com/authors/tom-wright"
    }
  ],
  "publisher": {
    "@type": "Organization",
    "name": "Acme Research Lab",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/acme-research-logo.png"
    }
  },
  "isAccessibleForFree": false,
  "wordCount": 18742,
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/research/ai-search-citations-2026"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Missing or undersized publisher logo',
        why: 'Google requires publisher logo with width ≥600px and height ≤60px for Top Stories carousel eligibility. Most "logos" sites use are full-square brand marks (200×200), which fail this check.',
        fix: 'Generate a wide horizontal logo specifically for schema (e.g., 600×60 PNG with transparent background). Reference it from publisher.logo.url. Many publishers ship a separate "schema logo" alongside their visual brand logo.',
      },
      {
        error: 'Headline mismatch between schema, page <title>, and visible <h1>',
        why: 'When all three diverge wildly, Google distrusts the schema and may pick its own headline (often the title tag minus suffix). AI engines may treat the page as low-confidence and skip citation.',
        fix: 'Keep all three within 1-2 word variations. Schema headline = visible H1 = title tag minus brand suffix is the cleanest pattern.',
      },
      {
        error: 'Bumping dateModified without real changes',
        why: 'Some sites auto-bump dateModified on every deploy or even on every cache rebuild, hoping for a freshness boost. Google detects this (compares to actual content diffs) and eventually penalizes.',
        fix: 'Only update dateModified when content actually changes substantively (new sections, updated facts, corrections). Don\'t touch it for typo fixes or re-renders.',
      },
      {
        error: 'Single image instead of multi-aspect array',
        why: 'Google\'s rich result preview surfaces use different aspect ratios depending on placement (1×1 in carousels, 16×9 in Discover). A single 1200×800 image works for some surfaces but loses placement in others.',
        fix: 'Pass image as an array of 3 URLs (1×1, 4×3, 16×9), all ≥1200px on the long edge. Generators (Cloudinary, imgix) can produce these from one source image.',
      },
      {
        error: 'Author as a string instead of Person object',
        why: 'Schema spec requires author as a Person or Organization object with @type. Plain strings ("author": "Alex Chen") are technically allowed but lose AI engine attribution boosts and sameAs linking.',
        fix: 'Always use { "@type": "Person", "name": "Alex Chen", "url": "https://example.com/authors/alex-chen", "sameAs": [...] }. Add sameAs URLs for the strongest cite quality.',
      },
      {
        error: 'Wrong @type for the content',
        why: 'A news piece marked as Article or BlogPosting loses NewsArticle-only eligibility (Top Stories, Google News). A blog marked as NewsArticle without news-grade editorial oversight gets demoted when Google\'s news classifier disagrees.',
        fix: 'Use NewsArticle only for time-sensitive news with editorial oversight. Use BlogPosting for blog/editorial. Use Article as a safe generic fallback.',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'headline', label: 'Headline', placeholder: 'How AI Search Changed SEO in 2026', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A short summary of the article.', rows: 2 },
    { kind: 'text', key: 'image', label: 'Image URL (1200px+ wide recommended)', placeholder: 'https://example.com/cover.jpg' },
    { kind: 'text', key: 'datePublished', label: 'Date Published (ISO 8601)', placeholder: '2026-04-25' },
    { kind: 'text', key: 'dateModified', label: 'Date Modified (ISO 8601, optional)', placeholder: '2026-04-25' },
    { kind: 'text', key: 'authorName', label: 'Author Name', placeholder: 'Alex Chen' },
    { kind: 'text', key: 'authorUrl', label: 'Author URL (optional)', placeholder: 'https://example.com/authors/alex' },
    { kind: 'text', key: 'publisherName', label: 'Publisher Name', placeholder: 'Example Magazine' },
    { kind: 'text', key: 'publisherLogo', label: 'Publisher Logo URL', placeholder: 'https://example.com/logo.png' },
  ],

  sampleData: {
    headline: 'How AI Search Changed SEO in 2026',
    description:
      'Google reduced FAQ and HowTo rich results, but Perplexity and ChatGPT now cite structured data more aggressively than ever.',
    image: 'https://example.com/ai-search-2026-cover.jpg',
    datePublished: '2026-04-25',
    dateModified: '2026-04-25',
    authorName: 'Alex Chen',
    authorUrl: 'https://example.com/authors/alex-chen',
    publisherName: 'Example Magazine',
    publisherLogo: 'https://example.com/logo.png',
  },

  buildJsonLd: (data) => {
    const headline = getString(data, 'headline').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const datePublished = getString(data, 'datePublished').trim();
    const dateModified = getString(data, 'dateModified').trim();
    const authorName = getString(data, 'authorName').trim();
    const authorUrl = getString(data, 'authorUrl').trim();
    const publisherName = getString(data, 'publisherName').trim();
    const publisherLogo = getString(data, 'publisherLogo').trim();

    const body: Record<string, unknown> = { '@type': 'Article', headline };
    if (description) body.description = description;
    if (image) body.image = image;
    if (datePublished) body.datePublished = datePublished;
    if (dateModified) body.dateModified = dateModified;
    if (authorName) {
      body.author = {
        '@type': 'Person',
        name: authorName,
        ...(authorUrl && { url: authorUrl }),
      };
    }
    if (publisherName) {
      body.publisher = {
        '@type': 'Organization',
        name: publisherName,
        ...(publisherLogo && {
          logo: { '@type': 'ImageObject', url: publisherLogo },
        }),
      };
    }
    return jsonLdEnvelope(body);
  },
};
