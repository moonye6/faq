// Maps validator issue codes to actionable fix hints.
// Surfaced in check (per-issue) and scan (aggregated by code) output.

export const FIX_HINTS: Record<string, string> = {
  // Generic envelope
  'not-object': 'Ensure your <script type="application/ld+json"> contains a single JSON object (or an array of objects). Do not wrap multiple top-level blocks without an array.',
  'missing-context': 'Add "@context": "https://schema.org" as the first property of your JSON-LD block.',
  'missing-type': 'Add "@type" with a string value matching one of schema.org\'s types (e.g. "FAQPage", "Product").',
  'json-parse': 'JSON parse error — typical causes: unescaped double quotes inside string values, trailing commas, smart quotes from a CMS. Always JSON.stringify or use a generator.',
  'unsupported-type': 'Type-specific checks were skipped. Verify against schema.org/{type} and Google\'s rich result requirements for that type.',

  // FAQPage
  'faq-missing-mainEntity': 'Add "mainEntity": [...] as an array of Question objects. Each Question needs name + acceptedAnswer.',
  'faq-question-not-object': 'Each entry in mainEntity must be an object {"@type": "Question", "name": "...", "acceptedAnswer": {...}}.',
  'faq-question-wrong-type': 'Set "@type": "Question" on each mainEntity item.',
  'faq-question-missing-name': 'Add "name" with the question text. Question form (with ?) cites better in AI search.',
  'faq-missing-answer': 'Add "acceptedAnswer": {"@type": "Answer", "text": "..."} to each Question.',
  'faq-answer-wrong-type': 'Set "@type": "Answer" inside acceptedAnswer.',
  'faq-answer-missing-text': 'Add "text" with the answer content. Aim for 40-120 words; lead with the direct answer in sentence one.',
  'faq-rich-result-deprecated': 'Not a fix — informational. The Google SERP rich result is mostly gone, but FAQ schema remains highly cited by AI search engines (Perplexity, ChatGPT, Gemini, AI Overviews).',

  // HowTo
  'howto-missing-name': 'Add "name" describing what the tutorial accomplishes.',
  'howto-missing-step': 'Add "step": [...] with HowToStep objects. One concrete action per step.',
  'howto-step-not-object': 'Each step must be an object {"@type": "HowToStep", "name": "...", "text": "..."}.',
  'howto-step-missing-content': 'Each step needs at least name or text. Both is better — name for the step title, text for instructions.',
  'howto-rich-result-removed': 'Not a fix — informational. Google removed HowTo rich results in 2024 but the schema is heavily used by AI coding assistants and Perplexity.',

  // Product
  'product-missing-name': 'Add "name" with the product title.',
  'product-no-offer-or-rating': 'Add either "offers" (with price + priceCurrency + availability) or "aggregateRating" (with ratingValue + reviewCount) to qualify for SERP rich results.',
  'product-offer-missing-price': 'Add price as a number string (e.g. "199.00") inside offers.',
  'product-offer-missing-currency': 'Add priceCurrency as an ISO 4217 code (e.g. "USD", "EUR").',

  // Recipe
  'recipe-missing-name': 'Add "name" with the recipe title.',
  'recipe-missing-ingredients': 'Add "recipeIngredient": [...] as an array of strings, one ingredient per item with quantity ("1 1/2 cups flour").',
  'recipe-missing-instructions': 'Add "recipeInstructions": [...] as an array of HowToStep objects. One step per item with name and text.',
  'recipe-missing-image': 'Add "image" with a ≥1200px wide URL. Recipe rich results require it for image carousel placement.',

  // Article / BlogPosting / NewsArticle
  'article-missing-headline': 'Add "headline" matching your visible H1. Should be near-identical to the page <title>.',
  'article-missing-image': 'Add "image" — either a single 1200px+ URL or an array of 1×1, 4×3, 16×9 variants for max rich result coverage.',
  'article-missing-date': 'Add "datePublished" in ISO 8601 (e.g. "2026-04-26"). Required for AI assistants to attribute citations correctly.',
  'article-missing-author': 'Add "author" as a Person or Organization object. Strongly recommend Person with name + url + sameAs (LinkedIn, Twitter) for AI cite confidence.',
  'article-missing-publisher': 'Add "publisher" as Organization with name + logo. Logo must be ≥600×60 (wide) for Top Stories carousel — different from Organization.logo (square).',

  // Review
  'review-missing-itemReviewed': 'Add "itemReviewed" pointing to the reviewed item (Product, LocalBusiness, Movie, etc.) with @type, name, and ideally url. Without it, no SERP star ratings.',
  'review-missing-rating': 'Add "reviewRating": {"@type": "Rating", "ratingValue": "4.5", "bestRating": "5"}.',
  'review-rating-missing-value': 'Add "ratingValue" inside reviewRating. Numeric string between worstRating and bestRating.',
  'review-missing-author': 'Add "author" — Person for individual reviews, Organization for publication reviews. Plain strings lose attribution boosts.',

  // LocalBusiness
  'lb-missing-name': 'Add "name" with the business name.',
  'lb-missing-phone': 'Add "telephone" in E.164 format (+14155550123, no spaces or dashes). Required for Google Map Pack eligibility.',
  'lb-missing-address': 'Add "address": {"@type": "PostalAddress", "streetAddress": "...", "addressLocality": "...", "addressRegion": "...", "postalCode": "...", "addressCountry": "..."}.',
  'lb-address-incomplete': 'Add at minimum streetAddress and addressLocality. addressRegion + postalCode + addressCountry strongly recommended.',

  // Event
  'event-missing-name': 'Add "name" with the event title.',
  'event-missing-startDate': 'Add "startDate" in ISO 8601 with timezone (e.g. "2026-09-15T19:00:00-07:00"). Without timezone, Google interprets as UTC and displays wrong times.',
  'event-missing-location': 'Add "location" — Place object for in-person, VirtualLocation with url for online, or array of both for hybrid (with eventAttendanceMode = MixedEventAttendanceMode).',

  // BreadcrumbList
  'breadcrumb-missing-items': 'Add "itemListElement": [...] as an array of ListItem objects, one per level of hierarchy.',
  'breadcrumb-item-not-object': 'Each entry must be an object {"@type": "ListItem", "position": 1, "name": "...", "item": "..."}.',
  'breadcrumb-item-wrong-type': 'Set "@type": "ListItem" on each itemListElement entry.',
  'breadcrumb-bad-position': 'position must be a sequential integer starting at 1. Skipping or duplicating positions breaks the trail and Google discards the whole list.',
  'breadcrumb-item-missing-name': 'Add "name" — should match the visible breadcrumb label exactly.',
  'breadcrumb-item-missing-url': 'Add "item" as an absolute URL (https://example.com/path). Relative paths are rejected.',

  // Organization
  'org-missing-name': 'Add "name" with the canonical organization name. Use alternateName for variants.',
  'org-missing-url': 'Add "url" with the organization\'s primary website URL.',
  'org-missing-logo': 'Add "logo" — square ≥600×600 PNG/SVG/JPG URL. Different from Article.publisher.logo (which is wide ≥600×60). Many sites confuse the two.',

  // Course
  'course-missing-name': 'Add "name" with the course title.',
  'course-missing-description': 'Add "description" with at least one informative paragraph about what the course covers.',
  'course-missing-provider': 'Add "provider": {"@type": "Organization", "name": "...", "url": "..."}.',
  'course-missing-instance': 'Add "hasCourseInstance" with courseMode (Online | Onsite | Blended), courseWorkload (ISO 8601 duration), instructor, and offers. Without it, no Course rich result eligibility.',

  // JobPosting
  'job-missing-title': 'Add "title" with the job title (not "Position Available").',
  'job-missing-description': 'Add "description" — HTML allowed (<p>, <ul>, <strong>). Structure as: pitch, responsibilities, qualifications, what we offer.',
  'job-missing-datePosted': 'Add "datePosted" in ISO 8601 (e.g. "2026-04-26"). Use the real first-posted date, not today.',
  'job-missing-hiring-org': 'Add "hiringOrganization": {"@type": "Organization", "name": "...", "sameAs": "https://...", "logo": "https://..."}.',
  'job-missing-location': 'Add "jobLocation" with PostalAddress, OR set jobLocationType="TELECOMMUTE" with applicantLocationRequirements (Country) for remote roles. Never fabricate jobLocation for remote.',
  'job-missing-validThrough': 'Add "validThrough" — typically datePosted + 60 days. Required to avoid Google for Jobs domain suppression for stale postings.',
  'job-missing-salary': 'Add "baseSalary" with currency + min/max values + unitText (HOUR | YEAR). Roles without salary disappear from "$X+" filtered AI hiring queries; some US states also legally require disclosure.',
};

export function annotateHints<T extends { code: string; hint?: string }>(issues: T[]): T[] {
  for (const issue of issues) {
    if (!issue.hint) {
      const hint = FIX_HINTS[issue.code];
      if (hint) issue.hint = hint;
    }
  }
  return issues;
}
