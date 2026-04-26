import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
} from '~/lib/schema-types';

export const jobPostingSchema: SchemaTypeDef = {
  id: 'jobposting',
  slug: 'job-posting-schema-generator',
  name: 'JobPosting Schema Generator',
  schemaType: 'JobPosting',

  title: 'JobPosting Schema Generator | JSON-LD for Google for Jobs Visibility',
  metaDescription:
    'Generate JobPosting JSON-LD required for Google for Jobs visibility. Includes title, salary, location, employment type, and validity dates.',
  h1: 'JobPosting Schema Generator',
  intro:
    'Mark up your job posting with title, salary, location, and employment type. Get clean JobPosting JSON-LD required for Google for Jobs and AI hiring queries.',
  geoAeoAngle:
    'JobPosting schema is REQUIRED for visibility in Google for Jobs (the carousel of job listings shown in SERPs for hiring queries). Without JobPosting markup, your role is invisible to that surface, period. On top of that, AI assistants increasingly answer "remote {role} jobs paying $X+" queries by parsing JobPosting schema across the open web. Pages without it are skipped in favor of competitors that have it. This is one of the few schema types where the absence of markup is actively penalized.',

  pageFaqs: [
    {
      q: 'Is JobPosting schema required for Google for Jobs?',
      a: 'Yes. Google for Jobs only shows roles that have valid JobPosting structured data. No schema means no visibility in the Google for Jobs carousel — and since 2023, that carousel is the dominant traffic source for inbound applications on most hiring queries.',
    },
    {
      q: 'What fields does Google require?',
      a: 'Required: title, description, datePosted, hiringOrganization, jobLocation (or applicantLocationRequirements for remote), employmentType. Strongly recommended: validThrough, baseSalary, identifier. Roles without baseSalary get noticeably lower placement and skipped by AI assistants more often.',
    },
    {
      q: 'How do I mark up remote jobs?',
      a: 'Set jobLocationType to "TELECOMMUTE" and use applicantLocationRequirements to specify where applicants can be based (often a Country object). Do NOT use a fake jobLocation address — Google will detect this and may issue a manual action against your hiring organization profile.',
    },
    {
      q: 'What happens when a role is filled?',
      a: 'Set validThrough to the date the role closed and remove the JobPosting schema (or the entire page). Leaving expired postings in your sitemap is one of the top reasons companies get suppressed from Google for Jobs entirely. Stale schema is worse than no schema.',
    },
    {
      q: 'Should I include salary even if it is approximate?',
      a: 'Yes. baseSalary with a range (minValue + maxValue + currency) is acceptable and strongly preferred over no salary. Google explicitly favors transparent salary data, and AI assistants now filter "$X+" queries by parsing baseSalary. Roles without it get filtered out of an increasing share of queries.',
    },
    {
      q: 'How often must I update validThrough?',
      a: 'Every posting needs validThrough. Google deprioritizes postings without it. When the role closes, remove the schema (or the page) within 24-48 hours — old listings poison your domain reputation in Google for Jobs.',
    },
    {
      q: 'What employment types does Google recognize?',
      a: 'FULL_TIME, PART_TIME, CONTRACTOR, TEMPORARY, INTERN, VOLUNTEER, PER_DIEM, OTHER. Use the most specific. Custom values fail parsing and the role drops out of Google for Jobs.',
    },
    {
      q: 'How do AI hiring assistants use JobPosting schema?',
      a: 'Job-search AIs (LinkedIn AI, ChatGPT job mode, dedicated tools) parse JobPosting to filter by salary band, location, employment type, and remote status. Roles with complete schema (especially baseSalary) appear in 3-4x more "remote {role} paying $X" answers than roles without.',
    },
    {
      q: 'Can I list multiple locations for the same role?',
      a: 'Yes — jobLocation accepts an array of Place objects. AI assistants and Google for Jobs surface the role for searches matching any listed location. Don\'t fake-multi-list (10 cities for a remote-only role) — it triggers spam filters.',
    },
    {
      q: 'Should I include directApply?',
      a: 'If your application happens entirely on your own page (no third-party redirect), set directApply to true. Google\'s "Apply directly" badge boosts click-through rate. If you redirect to Greenhouse/Lever/Workday, leave directApply false or omit.',
    },
    {
      q: 'How do I mark up jobs requiring specific qualifications?',
      a: 'Use qualifications, responsibilities, skills, educationRequirements, and experienceRequirements (all string fields). AI hiring assistants parse these for "jobs that need X skill" queries. Most postings omit these — including them is a strong differentiator.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (WP Job Manager / WP Job Openings)',
        description:
          'WP Job Manager is the dominant WordPress jobs plugin. Both it and WP Job Openings emit JobPosting schema for jobs created via their admin UI.',
        steps: [
          'Install WP Job Manager (free + paid extensions).',
          'Create job listings via the plugin\'s admin UI: title, description, employment type, location, application URL.',
          'Install the WP Job Manager Application Deadline extension to enable validThrough — Google requires this.',
          'For salary, install the WP Job Manager Salary extension or the WC for Jobs add-on (or augment via custom JSON-LD if you can\'t afford the extension).',
          'Verify by viewing source on a job page — search for "@type": "JobPosting".',
          'Submit the jobs sitemap URL to Google Search Console for Google for Jobs eligibility.',
        ],
      },
      {
        platform: 'Greenhouse / Lever / Workday (ATS systems)',
        description:
          'Most ATS systems (Greenhouse, Lever, Workday, Ashby, Rippling) emit JobPosting schema on the public job page they host. If your jobs live entirely on Greenhouse, you usually don\'t need to add schema yourself — but you should still mirror the schema on your /careers page if you display jobs there.',
        steps: [
          'Verify your ATS\'s schema output: view source on a Greenhouse/Lever job page and search for "@type": "JobPosting".',
          'If you list jobs on your own /careers page (in addition to ATS), mirror JobPosting schema there with sameAs pointing to the ATS canonical URL.',
          'Use canonical link tags on your /careers job pages pointing to the ATS URL — avoids duplicate-content penalties.',
          'For Greenhouse Job Boards, the platform handles Google for Jobs sitemap submission. For Lever, you must submit your /careers page sitemap manually.',
          'Validate any custom-emitted schema with schemaguardian.',
        ],
      },
      {
        platform: 'Next.js / Astro (custom careers page)',
        description:
          'For framework-built careers pages, define jobs as typed content. Each job page emits full JobPosting schema with all required Google for Jobs fields plus baseSalary.',
        steps: [
          'Define a typed Job type with title, description, datePosted, validThrough, employmentType, location, salary fields.',
          'Pull jobs from your CMS, ATS API, or markdown files (rebuild on every job update).',
          'For each job page, render JobPosting JSON-LD inline with all required and recommended fields.',
          'Generate /sitemap-jobs.xml with only currently-valid jobs (validThrough in the future).',
          'Submit /sitemap-jobs.xml to Google Search Console under "Sitemaps" — required for Google for Jobs.',
          'Wire schemaguardian into CI to validate every job page.',
        ],
        codeExample: `// app/careers/[slug]/page.tsx
import Script from 'next/script';

export default async function JobPage({ params }) {
  const job = await getJob(params.slug);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.descriptionHtml,
    datePosted: job.postedAt,
    validThrough: job.expiresAt,
    employmentType: job.type, // 'FULL_TIME' | 'CONTRACTOR' | ...
    hiringOrganization: {
      '@type': 'Organization',
      name: 'Acme Inc.',
      sameAs: 'https://acme.example',
      logo: 'https://acme.example/logo.png',
    },
    jobLocation: job.locations.map(loc => ({
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: loc.city,
        addressRegion: loc.region,
        addressCountry: loc.country,
      },
    })),
    ...(job.remote && {
      jobLocationType: 'TELECOMMUTE',
      applicantLocationRequirements: job.eligibleCountries.map(c => ({
        '@type': 'Country',
        name: c,
      })),
    }),
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: job.salaryCurrency,
      value: {
        '@type': 'QuantitativeValue',
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: 'YEAR',
      },
    },
    qualifications: job.qualifications,
    responsibilities: job.responsibilities,
    skills: job.skills,
    directApply: job.applyOnSite,
  };
  return (
    <>
      <article>{job.descriptionHtml}</article>
      <Script id="job-jsonld" type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </Script>
    </>
  );
}`,
      },
      {
        platform: 'Static HTML (single role landing page)',
        description:
          'For one-off role landing pages or solo-recruiter sites, paste the JSON-LD generated above directly into <head>. Easiest case for small companies hiring 1-3 roles.',
        steps: [
          'Generate the JSON-LD with the form above, including all required fields (title, description, datePosted, validThrough, employmentType, hiringOrganization, jobLocation).',
          'Paste the <script type="application/ld+json"> block into the <head> of the role page.',
          'Set validThrough realistically — typically datePosted + 60 days.',
          'When the role closes, delete the page or remove the JobPosting schema and 410 the URL.',
          'Submit your sitemap to Google Search Console.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Full-time engineering role (remote, with salary)',
        description:
          'Standard full-time tech role pattern. Salary range, remote with country eligibility, direct apply on company site. Highest-engagement Google for Jobs config.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Senior Software Engineer, Schema Platform",
  "description": "<p>We are hiring a senior engineer to lead development of our schema generation and AI citation monitoring platform.</p><p><strong>Responsibilities:</strong> Architect and ship the next-generation schema tooling. Build the AI citation monitoring backend. Mentor 2-3 engineers as the team scales.</p><p><strong>Requirements:</strong> 6+ years backend engineering. Strong TypeScript / Node. Experience with structured data, SEO tooling, or developer tools is a plus.</p>",
  "datePosted": "2026-04-25",
  "validThrough": "2026-06-25T23:59:00-07:00",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme Inc.",
    "sameAs": "https://acme.example",
    "logo": "https://acme.example/logo-square.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Mission Street",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94103",
      "addressCountry": "US"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": [
    { "@type": "Country", "name": "US" },
    { "@type": "Country", "name": "Canada" }
  ],
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 180000,
      "maxValue": 240000,
      "unitText": "YEAR"
    }
  },
  "qualifications": "6+ years backend engineering experience. Strong TypeScript / Node skills. Familiarity with structured data and SEO is a plus.",
  "responsibilities": "Architect schema generation tooling. Build AI citation monitoring backend. Mentor 2-3 engineers.",
  "skills": "TypeScript, Node.js, distributed systems, structured data, JSON-LD, SEO tooling",
  "directApply": true
}`,
      },
      {
        scenario: 'Contract / freelance role',
        description:
          'Short-term contract role with hourly compensation. Pattern for agencies and project-based hires. Google for Jobs handles contracts via employmentType CONTRACTOR.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Contract Brand Designer (3-month)",
  "description": "<p>3-month contract to lead a brand identity refresh for a Series B fintech client. Logo, color, typography, brand guidelines. Remote.</p><p><strong>Deliverables:</strong> Discovery + audit (week 1-2), three logo directions (week 3-4), refinement and system (week 5-8), guidelines (week 9-12).</p>",
  "datePosted": "2026-04-22",
  "validThrough": "2026-05-31",
  "employmentType": "CONTRACTOR",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Branch Studio",
    "sameAs": "https://branchstudio.example",
    "logo": "https://branchstudio.example/logo.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "US"
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "minValue": 110,
      "maxValue": 160,
      "unitText": "HOUR"
    }
  },
  "qualifications": "5+ years brand identity experience. Portfolio showing 3+ shipped brand systems. Comfort working solo with weekly client check-ins.",
  "skills": "Brand strategy, logo design, type systems, color theory, brand guidelines, Figma",
  "directApply": false
}`,
      },
      {
        scenario: 'Internship (paid, fixed dates)',
        description:
          'Summer internship pattern. Fixed-duration role with start/end dates, hourly pay, eligibility for current students. AI hiring assistants surface for "{semester} intern" queries.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Summer 2026 Engineering Intern",
  "description": "<p>12-week paid summer internship on the platform engineering team. Hands-on backend work, weekly mentorship, end-of-summer project demo to leadership.</p>",
  "datePosted": "2026-04-15",
  "validThrough": "2026-05-15",
  "employmentType": "INTERN",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Acme Inc.",
    "sameAs": "https://acme.example",
    "logo": "https://acme.example/logo-square.png"
  },
  "jobLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1234 Mission Street",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "postalCode": "94103",
      "addressCountry": "US"
    }
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "USD",
    "value": {
      "@type": "QuantitativeValue",
      "value": 50,
      "unitText": "HOUR"
    }
  },
  "qualifications": "Currently enrolled CS undergraduate (rising junior or senior preferred). Familiarity with Python or TypeScript. No prior internship required.",
  "educationRequirements": "Currently enrolled in an undergraduate CS or related program",
  "experienceRequirements": "No prior professional experience required",
  "skills": "Python, TypeScript, Git, basic distributed systems concepts",
  "jobStartDate": "2026-06-08",
  "directApply": true
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Stale postings (expired roles still in sitemap)',
        why: 'Closed roles left with future or past validThrough dates poison your hiring organization\'s reputation in Google for Jobs. After repeated stale postings, Google may suppress your domain entirely from the carousel.',
        fix: 'Remove or 410 expired job pages within 24-48 hours of closing. Update your sitemap to exclude closed roles. Set validThrough to a real future date when posting.',
      },
      {
        error: 'Fake jobLocation for remote roles',
        why: 'Some companies set jobLocation to their HQ for remote roles to game location-filtered searches. Google detects this (compares to applicantLocationRequirements and content) and issues manual actions.',
        fix: 'For remote: jobLocationType: "TELECOMMUTE" + applicantLocationRequirements (Country object). jobLocation can still hold a real city for hybrid roles, but never fabricate it.',
      },
      {
        error: 'Missing baseSalary',
        why: 'Roles without baseSalary disappear from "$X+ jobs" filtered queries on AI hiring assistants. Some US states (CA, CO, NY, WA) also require salary disclosure by law — omitting violates pay transparency rules.',
        fix: 'Always include baseSalary. Even if approximate, a range (min + max) is better than nothing. Comply with state pay transparency laws — schema reflects what should already be on the page.',
      },
      {
        error: 'Wrong employmentType value',
        why: 'Custom values like "Permanent", "Casual", "Project-based" fail Google\'s parser. The role drops out of Google for Jobs entirely.',
        fix: 'Use Google\'s exact enum: FULL_TIME, PART_TIME, CONTRACTOR, TEMPORARY, INTERN, VOLUNTEER, PER_DIEM, OTHER. Map your terminology to these.',
      },
      {
        error: 'datePosted backdated to look fresh',
        why: 'Setting datePosted to today on a role that has been open for 6 months is detected via Google\'s archive crawl. Penalty: domain demotion in Google for Jobs.',
        fix: 'Use the real first-posted date. To refresh visibility, edit the job description (real updates) — Google\'s freshness signal is based on dateModified, not datePosted.',
      },
      {
        error: 'description as plain text without structure',
        why: 'Plain-text job descriptions parse but lose richness. Google for Jobs uses HTML structure (paragraphs, bold, lists) to extract responsibilities and qualifications. Without it, the role displays as a wall of text.',
        fix: 'Use HTML in description (<p>, <ul>, <li>, <strong>). Structure as: opening pitch, responsibilities, qualifications, what we offer. Match what is visible on the page.',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'title', label: 'Job Title', placeholder: 'Senior Software Engineer', required: true },
    { kind: 'textarea', key: 'description', label: 'Description (HTML allowed)', placeholder: 'We are hiring a senior engineer to...', required: true, rows: 5 },
    { kind: 'text', key: 'datePosted', label: 'Date Posted (ISO 8601)', placeholder: '2026-04-25', required: true },
    { kind: 'text', key: 'validThrough', label: 'Valid Through (ISO 8601)', placeholder: '2026-06-25' },
    { kind: 'text', key: 'employmentType', label: 'Employment Type', placeholder: 'FULL_TIME | PART_TIME | CONTRACTOR | TEMPORARY | INTERN' },
    { kind: 'text', key: 'companyName', label: 'Hiring Company Name', placeholder: 'Acme Inc.', required: true },
    { kind: 'text', key: 'companyUrl', label: 'Company Website', placeholder: 'https://acme.example' },
    { kind: 'text', key: 'companyLogo', label: 'Company Logo URL', placeholder: 'https://acme.example/logo.png' },
    { kind: 'text', key: 'locationCity', label: 'Location City', placeholder: 'San Francisco' },
    { kind: 'text', key: 'locationRegion', label: 'Location State/Region', placeholder: 'CA' },
    { kind: 'text', key: 'locationCountry', label: 'Location Country (ISO 3166-1 alpha-2)', placeholder: 'US' },
    { kind: 'text', key: 'remote', label: 'Remote? (yes / no)', placeholder: 'no' },
    { kind: 'text', key: 'salaryMin', label: 'Salary Min (numeric)', placeholder: '160000' },
    { kind: 'text', key: 'salaryMax', label: 'Salary Max (numeric)', placeholder: '220000' },
    { kind: 'text', key: 'salaryCurrency', label: 'Salary Currency (ISO 4217)', placeholder: 'USD' },
    { kind: 'text', key: 'salaryUnit', label: 'Salary Unit (HOUR | DAY | MONTH | YEAR)', placeholder: 'YEAR' },
  ],

  sampleData: {
    title: 'Senior Software Engineer, Schema Platform',
    description:
      '<p>We are hiring a senior engineer to lead development of our schema generation and AI citation monitoring platform. You will own the architecture, ship features end-to-end, and work directly with our founding team.</p><p><strong>What you will do:</strong> Design and ship the next generation of schema tooling. Build the AI citation monitoring backend. Mentor 2-3 engineers as the team scales.</p>',
    datePosted: '2026-04-25',
    validThrough: '2026-06-25',
    employmentType: 'FULL_TIME',
    companyName: 'Acme Inc.',
    companyUrl: 'https://acme.example',
    companyLogo: 'https://acme.example/logo.png',
    locationCity: 'San Francisco',
    locationRegion: 'CA',
    locationCountry: 'US',
    remote: 'yes',
    salaryMin: '180000',
    salaryMax: '240000',
    salaryCurrency: 'USD',
    salaryUnit: 'YEAR',
  },

  buildJsonLd: (data) => {
    const title = getString(data, 'title').trim();
    const description = getString(data, 'description').trim();
    const datePosted = getString(data, 'datePosted').trim();
    const validThrough = getString(data, 'validThrough').trim();
    const employmentType = getString(data, 'employmentType').trim();
    const companyName = getString(data, 'companyName').trim();
    const companyUrl = getString(data, 'companyUrl').trim();
    const companyLogo = getString(data, 'companyLogo').trim();
    const locationCity = getString(data, 'locationCity').trim();
    const locationRegion = getString(data, 'locationRegion').trim();
    const locationCountry = getString(data, 'locationCountry').trim();
    const remote = getString(data, 'remote').trim().toLowerCase();
    const salaryMin = getString(data, 'salaryMin').trim();
    const salaryMax = getString(data, 'salaryMax').trim();
    const salaryCurrency = getString(data, 'salaryCurrency').trim();
    const salaryUnit = getString(data, 'salaryUnit').trim().toUpperCase();

    const body: Record<string, unknown> = {
      '@type': 'JobPosting',
      title,
      description,
      datePosted,
      hiringOrganization: {
        '@type': 'Organization',
        name: companyName,
        ...(companyUrl && { sameAs: companyUrl }),
        ...(companyLogo && { logo: companyLogo }),
      },
    };
    if (validThrough) body.validThrough = validThrough;
    if (employmentType) body.employmentType = employmentType;

    const jobLocation = {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(locationCity && { addressLocality: locationCity }),
        ...(locationRegion && { addressRegion: locationRegion }),
        ...(locationCountry && { addressCountry: locationCountry }),
      },
    };
    body.jobLocation = jobLocation;

    if (remote === 'yes' || remote === 'true' || remote === 'remote') {
      body.jobLocationType = 'TELECOMMUTE';
      if (locationCountry) {
        body.applicantLocationRequirements = {
          '@type': 'Country',
          name: locationCountry,
        };
      }
    }

    if (salaryMin && salaryMax && salaryCurrency) {
      body.baseSalary = {
        '@type': 'MonetaryAmount',
        currency: salaryCurrency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: salaryMin,
          maxValue: salaryMax,
          unitText: salaryUnit || 'YEAR',
        },
      };
    }

    return jsonLdEnvelope(body);
  },
};
