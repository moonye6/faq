import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const videoSchema: SchemaTypeDef = {
  id: 'video',
  slug: 'video-schema-generator',
  name: 'Video Schema Generator',
  schemaType: 'VideoObject',

  title: 'Video Schema Generator | VideoObject JSON-LD for SERP Carousels + AI Discovery',
  metaDescription:
    'Generate VideoObject JSON-LD with thumbnail, duration, embed URL, and upload date. Triggers Google video carousels and powers AI search video discovery.',
  h1: 'Video Schema Generator',
  intro:
    'Mark up your videos with structured data Google and AI search engines actually use. Get clean VideoObject JSON-LD ready to drop into your <head>.',
  geoAeoAngle:
    'Video is one of the most active rich result types in 2026. Google video carousels still render prominently in standard SERPs and Discover. Beyond Google, Gemini and Perplexity Pro increasingly surface video answers when users ask "show me how to..." or "watch X explained" queries. VideoObject markup is what tells every consumer (search engines, AI assistants, social embed engines) the canonical metadata for your video — without it, your embed is just an opaque iframe to crawlers.',

  pageFaqs: [
    {
      q: 'Do video rich results still show in Google in 2026?',
      a: 'Yes, prominently. Unlike FAQ and HowTo, video rich results were preserved through the 2023-2026 reductions. Video carousels appear in standard SERPs, Discover, Image search, and the Videos tab. Pages with clean VideoObject markup get carousel placement plus duration / thumbnail / upload date display.',
    },
    {
      q: 'What is the difference between contentUrl and embedUrl?',
      a: 'contentUrl is the direct media file URL (e.g., a .mp4 hosted on your CDN). embedUrl is the iframe embed URL (e.g., https://www.youtube.com/embed/abc123). YouTube embeds need embedUrl. Self-hosted video needs contentUrl. You can provide both. Google requires at least one.',
    },
    {
      q: 'How do I mark up YouTube embeds correctly?',
      a: 'Set embedUrl to https://www.youtube.com/embed/{VIDEO_ID}, thumbnailUrl to https://i.ytimg.com/vi/{VIDEO_ID}/maxresdefault.jpg, uploadDate to the video\'s actual upload date, and duration in ISO 8601 format (PT5M30S = 5 min 30 sec). The video does not need to be hosted on your domain — Google indexes the embed wherever it appears.',
    },
    {
      q: 'Should I use VideoObject or Movie / TVEpisode?',
      a: 'VideoObject for the broadest case: tutorials, product demos, explainers, vlogs, marketing videos. Movie for theatrical / streaming films (eligible for movie-specific rich results). TVEpisode for episodic TV content. Use the most specific type that fits — Google\'s rich result eligibility differs per type.',
    },
    {
      q: 'Why does AI search care about video schema?',
      a: 'AI assistants cannot watch videos at scale, so they extract metadata from VideoObject markup to decide which videos to surface in answers. A video with explicit name + description + duration + uploadDate gets cited; a video where the AI has to guess at metadata from prose gets skipped. For "show me how to..." and "best video on..." queries, structured video metadata is the deciding factor.',
    },
    {
      q: 'Do I need transcripts for AI search to cite my videos?',
      a: 'Strongly recommended. AI engines (Perplexity, Gemini) prefer videos with transcripts because they can cite the textual content with timestamps. Use the transcript field with the full transcript text, or include a separate visible transcript on the page that the engine can crawl. Auto-generated YouTube captions are not enough on their own.',
    },
    {
      q: 'How specific should ISO 8601 duration format be?',
      a: 'Always include duration in PT[H]H[M]M[S]S format. For 1 minute 23 seconds: PT1M23S. For 1 hour 45 minutes: PT1H45M. Google rejects videos without duration from carousel placement. AI engines also use duration to filter ("show me a 5-minute explainer" excludes 90-minute videos).',
    },
    {
      q: 'Should I add VideoObject for every video on my site or only key ones?',
      a: 'Every video that has its own page or substantive prominence. Hero / explainer / tutorial videos get full VideoObject. Inline product demos can share a single VideoObject if they all reference the same canonical video. Skip schema for purely decorative background loops.',
    },
    {
      q: 'How do I handle live streams and upcoming videos?',
      a: 'For live streams, set publication.isLiveBroadcast to true and add startDate/endDate. For upcoming streams, use the same fields with future startDate. Google supports a LIVE badge in carousels for streams marked correctly. AI engines use this to filter "what is on now" queries.',
    },
    {
      q: 'Can VideoObject schema include chapters / segments?',
      a: 'Yes. Use the hasPart field with an array of Clip objects, each with name, startOffset (seconds from start), and endOffset. Google uses this to surface key moments in the SERP video carousel. AI engines use it to deep-link to relevant timestamps.',
    },
    {
      q: 'What thumbnail size and ratio does Google prefer?',
      a: 'Minimum 1200×630 px, ideal 1920×1080 (16:9). Maximum 8 MB. Use a static image (no GIFs). For YouTube embeds, the maxresdefault.jpg URL pattern (i.ytimg.com/vi/{ID}/maxresdefault.jpg) is the canonical high-res thumbnail. For self-hosted, generate from a representative frame.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'YouTube embed (most common case)',
        description:
          'You embed a YouTube video on your page and want VideoObject schema for that page. The video does not need to be on your channel — schema describes how the video appears on your URL.',
        steps: [
          'Get the YouTube video ID from the share URL (the part after v=).',
          'Set embedUrl to https://www.youtube.com/embed/{ID} and thumbnailUrl to https://i.ytimg.com/vi/{ID}/maxresdefault.jpg.',
          'Use the actual upload date of the YouTube video for uploadDate (visible on the video page below the title).',
          'Get duration from the YouTube page and convert to ISO 8601 (5:30 → PT5M30S, 1:45:20 → PT1H45M20S).',
          'Paste the JSON-LD into the <head> of the page where the embed lives.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Add FAQ Schema in 5 Minutes",
  "description": "A quick tutorial on adding valid FAQPage JSON-LD to any HTML page.",
  "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "uploadDate": "2026-04-25",
  "duration": "PT5M30S",
  "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "publisher": {
    "@type": "Organization",
    "name": "Schema for AI Search"
  }
}
</script>`,
      },
      {
        platform: 'Vimeo embed',
        description:
          'Same pattern as YouTube but with Vimeo URL conventions. Vimeo provides a thumbnail API; you can also screenshot a frame.',
        steps: [
          'Get the Vimeo video ID from the URL (e.g., vimeo.com/123456789 → ID is 123456789).',
          'Set embedUrl to https://player.vimeo.com/video/{ID}.',
          'For thumbnail, use Vimeo\'s oEmbed API: GET https://vimeo.com/api/oembed.json?url=https://vimeo.com/{ID} → use thumbnail_url from response.',
          'Set uploadDate, duration, name, description from the video metadata.',
          'Drop the JSON-LD into the page <head>.',
        ],
      },
      {
        platform: 'Self-hosted video (Cloudflare Stream / Mux / S3 + CloudFront)',
        description:
          'You serve video files from your own CDN. Use contentUrl (direct media URL) instead of embedUrl, plus a generated thumbnail.',
        steps: [
          'Upload your video to Cloudflare Stream / Mux / S3 — get the canonical .mp4 or .m3u8 URL.',
          'Generate a thumbnail (Cloudflare Stream and Mux auto-generate; S3 needs ffmpeg or a Lambda to extract a frame).',
          'Set contentUrl to the direct media URL and thumbnailUrl to the generated thumbnail.',
          'Calculate duration server-side at upload time and store it in your CMS — emit as ISO 8601 in the JSON-LD.',
          'Drop the JSON-LD into the page <head>.',
        ],
        codeExample: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Product Walkthrough: Acme Pro Dashboard",
  "description": "A 3-minute walkthrough of the Acme Pro analytics dashboard, covering metrics, filters, and export.",
  "thumbnailUrl": "https://cdn.example.com/videos/acme-pro/thumb-1080.jpg",
  "uploadDate": "2026-04-20",
  "duration": "PT3M12S",
  "contentUrl": "https://cdn.example.com/videos/acme-pro/walkthrough.mp4",
  "publisher": {
    "@type": "Organization",
    "name": "Acme",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
</script>`,
      },
      {
        platform: 'Next.js / Astro pages with video embeds',
        description:
          'Bind VideoObject metadata to your video CMS records and emit JSON-LD inside the same component that renders the embed iframe.',
        steps: [
          'Define a typed Video type ({name, description, thumbnailUrl, uploadDate, duration, embedUrl}) in your CMS or content collection.',
          'In the component that renders the <iframe>, also render <Script type="application/ld+json"> with VideoObject built from the same record.',
          'For multiple videos on one page, emit one VideoObject per video — Google handles arrays of structured data on a single page fine.',
          'For paginated video gallery pages, only emit VideoObject for videos visible on the current page (not the entire catalog).',
          'Validate with schemaguardian in CI.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Tutorial / how-to video (YouTube)',
        description:
          'Standard pattern for tutorial content embedded from YouTube. Highest-leverage VideoObject use case — these get cited heavily by AI engines for "how do I..." queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "How to Add Schema Markup to Any Website (2026)",
  "description": "Step-by-step tutorial on adding JSON-LD structured data to your site, covering FAQ, Product, and Breadcrumb schema. Includes validation and CI integration.",
  "thumbnailUrl": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "uploadDate": "2026-04-15",
  "duration": "PT8M42S",
  "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "publisher": {
    "@type": "Organization",
    "name": "Schema for AI Search",
    "logo": {
      "@type": "ImageObject",
      "url": "https://faqjsonld.com/favicon.svg"
    }
  },
  "hasPart": [
    {
      "@type": "Clip",
      "name": "Why schema markup matters in 2026",
      "startOffset": 0,
      "endOffset": 90,
      "url": "https://example.com/blog/tutorial#t=0"
    },
    {
      "@type": "Clip",
      "name": "Adding FAQ schema",
      "startOffset": 90,
      "endOffset": 270,
      "url": "https://example.com/blog/tutorial#t=90"
    },
    {
      "@type": "Clip",
      "name": "CI validation with schemaguardian",
      "startOffset": 270,
      "endOffset": 522,
      "url": "https://example.com/blog/tutorial#t=270"
    }
  ]
}`,
      },
      {
        scenario: 'Product demo video (self-hosted)',
        description:
          'Self-hosted product walkthrough served from your CDN. Pattern for SaaS landing pages, product detail pages, marketing sites where you control the video file.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Acme Pro Dashboard: 60-Second Demo",
  "description": "A one-minute walkthrough of the Acme Pro analytics dashboard. See real-time metrics, custom filters, and one-click CSV export.",
  "thumbnailUrl": "https://cdn.acme.example/videos/dashboard-demo/thumb.jpg",
  "uploadDate": "2026-04-22",
  "duration": "PT1M3S",
  "contentUrl": "https://cdn.acme.example/videos/dashboard-demo.mp4",
  "publisher": {
    "@type": "Organization",
    "name": "Acme",
    "logo": {
      "@type": "ImageObject",
      "url": "https://acme.example/logo.png"
    }
  },
  "transcript": "Welcome to the Acme Pro dashboard. The first thing you see is the live metrics panel..."
}`,
      },
      {
        scenario: 'Live stream / upcoming broadcast',
        description:
          'Live streams or scheduled broadcasts. Pattern for product launches, AMAs, conferences. Google supports a LIVE badge for currently-broadcasting streams.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": "Schema for AI Search — Live Q&A: GEO Deep Dive",
  "description": "Live Q&A on Generative Engine Optimization — what schema types matter most for ChatGPT, Perplexity, and Gemini citations. Bring your questions.",
  "thumbnailUrl": "https://example.com/live/geo-qa-thumb.jpg",
  "uploadDate": "2026-05-01",
  "embedUrl": "https://www.youtube.com/embed/live_stream_id",
  "publication": {
    "@type": "BroadcastEvent",
    "isLiveBroadcast": true,
    "startDate": "2026-05-01T18:00:00-07:00",
    "endDate": "2026-05-01T19:00:00-07:00"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Schema for AI Search"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Missing or wrong-format duration',
        why: 'Duration as "5:30" or "5 minutes 30 seconds" fails parsing. Google requires ISO 8601 (PT5M30S). Without valid duration, the video drops out of carousel placement.',
        fix: 'Convert to ISO 8601: 5 min 30 sec → PT5M30S, 1 hour 45 min → PT1H45M, 90 sec → PT1M30S. Always prefix with PT.',
      },
      {
        error: 'uploadDate set to today instead of actual upload',
        why: 'Some implementations set uploadDate to current date dynamically. Google\'s freshness signal expects the actual original upload date. Lying about freshness gets the video down-ranked when discovered.',
        fix: 'Set uploadDate to the real first-published date. For YouTube embeds, this is the date on the video page, not the date you embedded it.',
      },
      {
        error: 'Thumbnail too small or low quality',
        why: 'Thumbnails under 1200×630 px or with severe compression artifacts fail Google\'s carousel quality bar. The video indexes but does not get the carousel placement.',
        fix: 'Use 1920×1080 (16:9) thumbnails. For YouTube, use the maxresdefault.jpg URL. For self-hosted, render from a representative frame at full resolution.',
      },
      {
        error: 'Both contentUrl and embedUrl missing',
        why: 'Google requires at least one of contentUrl (direct media URL) or embedUrl (iframe URL). Without either, the parser cannot route users to the actual video and skips the schema.',
        fix: 'For YouTube/Vimeo: use embedUrl. For self-hosted: use contentUrl (and optionally embedUrl if you also offer an iframe player). For both YouTube and self-hosted, include both.',
      },
      {
        error: 'Description too short or missing',
        why: 'Single-sentence descriptions ("Watch our demo") give AI engines nothing to match queries against. Engines often skip videos with thin descriptions in favor of competitors with substantive metadata.',
        fix: 'Write 2-4 sentences (50-200 chars) covering what the video shows, who it is for, and what the viewer learns. Treat description as a mini search snippet.',
      },
      {
        error: 'VideoObject without publisher',
        why: 'Google rich results for video require publisher with name (and ideally logo). Without it, you may index but lose carousel eligibility — and AI engines cannot attribute citations correctly.',
        fix: 'Always include publisher as Organization with name. Add logo for full eligibility (logo URL must be a real image, minimum 112×112 px).',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'name', label: 'Video Title', placeholder: 'How to Add FAQ Schema in 5 Minutes', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'A quick tutorial on adding FAQPage JSON-LD to your site for AI search citation.', required: true, rows: 3 },
    { kind: 'text', key: 'thumbnailUrl', label: 'Thumbnail URL (1280x720+ recommended)', placeholder: 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg', required: true },
    { kind: 'text', key: 'uploadDate', label: 'Upload Date (ISO 8601)', placeholder: '2026-04-25', required: true },
    { kind: 'text', key: 'duration', label: 'Duration (ISO 8601, e.g. PT5M30S)', placeholder: 'PT5M30S' },
    { kind: 'text', key: 'contentUrl', label: 'Content URL (direct video file, optional if embedUrl set)', placeholder: 'https://example.com/videos/tutorial.mp4' },
    { kind: 'text', key: 'embedUrl', label: 'Embed URL (e.g. YouTube embed URL)', placeholder: 'https://www.youtube.com/embed/abc123' },
    { kind: 'text', key: 'publisherName', label: 'Publisher Name', placeholder: 'Schema for AI Search' },
    { kind: 'text', key: 'publisherLogo', label: 'Publisher Logo URL', placeholder: 'https://example.com/logo.png' },
  ],

  sampleData: {
    name: 'How to Add FAQ Schema in 5 Minutes (2026)',
    description: 'A quick tutorial on adding valid FAQPage JSON-LD to any HTML page. Covers the 2023 deprecation, the AI citation angle, and CI validation with schemaguardian.',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    uploadDate: '2026-04-25',
    duration: 'PT5M30S',
    contentUrl: '',
    embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    publisherName: 'Schema for AI Search',
    publisherLogo: 'https://faqjsonld.com/favicon.svg',
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const thumbnailUrl = getString(data, 'thumbnailUrl').trim();
    const uploadDate = getString(data, 'uploadDate').trim();
    const duration = getString(data, 'duration').trim();
    const contentUrl = getString(data, 'contentUrl').trim();
    const embedUrl = getString(data, 'embedUrl').trim();
    const publisherName = getString(data, 'publisherName').trim();
    const publisherLogo = getString(data, 'publisherLogo').trim();

    const body: Record<string, unknown> = {
      '@type': 'VideoObject',
      name,
      description,
      thumbnailUrl,
      uploadDate,
    };
    if (duration) body.duration = duration;
    if (contentUrl) body.contentUrl = contentUrl;
    if (embedUrl) body.embedUrl = embedUrl;

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
