/**
 * Schema type abstraction.
 *
 * Adding a new schema type = create one file in src/schemas/{id}.ts
 * exporting a SchemaTypeDef, then register it in src/schemas/index.ts.
 *
 * Everything else (URL routing, landing page, generator UI, sitemap entry)
 * is derived automatically from the SchemaTypeDef.
 */

export type FieldValue = string | RepeaterValue;
export type RepeaterValue = Array<Record<string, string>>;
export type FormData = Record<string, FieldValue>;

export interface TextField {
  kind: 'text';
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

export interface TextareaField {
  kind: 'textarea';
  key: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
}

export type SimpleField = TextField | TextareaField;

export interface RepeaterField {
  kind: 'repeater';
  key: string;
  label: string;
  addLabel: string;
  minItems?: number;
  itemLabel: string;
  itemFields: SimpleField[];
}

export type FieldDef = SimpleField | RepeaterField;

export interface PageFaq {
  q: string;
  a: string;
}

export interface SchemaTypeDef {
  /** Stable identifier, used as registry key. */
  id: string;
  /** URL slug (without leading slash). */
  slug: string;
  /** Display name shown in nav and H1 fallback. */
  name: string;
  /** schema.org @type value. */
  schemaType: string;

  /** SEO <title>. */
  title: string;
  /** SEO meta description. */
  metaDescription: string;
  /** Landing H1. */
  h1: string;
  /** Hero intro (1-2 sentences plain text). */
  intro: string;
  /** GEO/AEO angle: why this schema matters for AI search citation. */
  geoAeoAngle: string;

  /** Landing page's own FAQ section (uses FAQPage schema itself). */
  pageFaqs: PageFaq[];

  /** Form field definitions. */
  fields: FieldDef[];
  /** Pre-filled sample data on first visit. */
  sampleData: FormData;
  /** Builder: form data → schema.org JSON-LD object. */
  buildJsonLd: (data: FormData) => Record<string, unknown>;
}

/**
 * Wrap a JSON-LD body in the standard envelope.
 */
export function jsonLdEnvelope(body: Record<string, unknown>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    ...body,
  };
}

/**
 * Read a string field with safe fallback.
 */
export function getString(data: FormData, key: string): string {
  const v = data[key];
  return typeof v === 'string' ? v : '';
}

/**
 * Read a repeater field with safe fallback.
 */
export function getRepeater(data: FormData, key: string): RepeaterValue {
  const v = data[key];
  return Array.isArray(v) ? v : [];
}
