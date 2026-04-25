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
  ],

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
