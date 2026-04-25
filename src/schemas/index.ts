/**
 * Schema type registry.
 *
 * To add a new schema type:
 *   1. Create src/schemas/{id}.ts exporting a SchemaTypeDef
 *   2. Import it here and add to the registry array
 *
 * That is the entire change. Routing, sitemap, landing page, and generator
 * UI are all derived from this registry automatically.
 */

import type { SchemaTypeDef } from '~/lib/schema-types';
import { faqSchema } from './faq';
import { howtoSchema } from './howto';
import { productSchema } from './product';
import { recipeSchema } from './recipe';
import { articleSchema } from './article';
import { reviewSchema } from './review';
import { localBusinessSchema } from './localbusiness';
import { eventSchema } from './event';
import { breadcrumbSchema } from './breadcrumb';
import { organizationSchema } from './organization';
import { courseSchema } from './course';
import { jobPostingSchema } from './jobposting';
import { videoSchema } from './video';

export const schemaRegistry: SchemaTypeDef[] = [
  faqSchema,
  howtoSchema,
  productSchema,
  recipeSchema,
  articleSchema,
  reviewSchema,
  localBusinessSchema,
  eventSchema,
  breadcrumbSchema,
  organizationSchema,
  courseSchema,
  jobPostingSchema,
  videoSchema,
];

export function getSchemaBySlug(slug: string): SchemaTypeDef | undefined {
  return schemaRegistry.find((s) => s.slug === slug);
}

export function allSchemaSlugs(): string[] {
  return schemaRegistry.map((s) => s.slug);
}
