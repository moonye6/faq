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
  ],

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
