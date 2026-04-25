export type Severity = 'error' | 'warning' | 'info';

export interface Issue {
  severity: Severity;
  code: string;
  message: string;
  path?: string;
}

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function getType(node: unknown): string[] {
  if (!isObj(node)) return [];
  const t = node['@type'];
  if (typeof t === 'string') return [t];
  if (Array.isArray(t)) return t.filter((x): x is string => typeof x === 'string');
  return [];
}

function has(node: Obj, key: string): boolean {
  const v = node[key];
  if (v === undefined || v === null) return false;
  if (typeof v === 'string' && v.trim() === '') return false;
  if (Array.isArray(v) && v.length === 0) return false;
  return true;
}

function check(
  cond: boolean,
  issues: Issue[],
  base: Omit<Issue, 'severity'> & { severity: Severity },
): void {
  if (!cond) issues.push(base);
}

export function validateBlock(block: unknown): Issue[] {
  const issues: Issue[] = [];

  if (!isObj(block)) {
    issues.push({
      severity: 'error',
      code: 'not-object',
      message: 'JSON-LD block is not a JSON object at the root.',
    });
    return issues;
  }

  // Generic envelope checks
  const ctx = block['@context'];
  if (typeof ctx !== 'string' || !ctx.includes('schema.org')) {
    issues.push({
      severity: 'error',
      code: 'missing-context',
      message: '@context must be a string that includes "schema.org".',
      path: '@context',
    });
  }

  const types = getType(block);
  if (types.length === 0) {
    issues.push({
      severity: 'error',
      code: 'missing-type',
      message: '@type is required and must be a string or array of strings.',
      path: '@type',
    });
    return issues;
  }

  for (const t of types) {
    issues.push(...validateByType(t, block));
  }

  return issues;
}

function validateByType(t: string, node: Obj): Issue[] {
  switch (t) {
    case 'FAQPage':
      return validateFaqPage(node);
    case 'HowTo':
      return validateHowTo(node);
    case 'Product':
      return validateProduct(node);
    case 'Recipe':
      return validateRecipe(node);
    case 'Article':
    case 'BlogPosting':
    case 'NewsArticle':
      return validateArticle(node);
    case 'Review':
      return validateReview(node);
    case 'LocalBusiness':
      return validateLocalBusiness(node);
    case 'Event':
      return validateEvent(node);
    case 'BreadcrumbList':
      return validateBreadcrumb(node);
    case 'Organization':
      return validateOrganization(node);
    case 'Course':
      return validateCourse(node);
    case 'JobPosting':
      return validateJobPosting(node);
    default:
      return [
        {
          severity: 'info',
          code: 'unsupported-type',
          message: `@type "${t}" is not in schemaguardian's known type registry. Generic envelope checks passed; type-specific checks skipped.`,
          path: '@type',
        },
      ];
  }
}

// ─── FAQPage ────────────────────────────────────────────────────────────────

function validateFaqPage(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'mainEntity'), issues, {
    severity: 'error',
    code: 'faq-missing-mainEntity',
    message: 'FAQPage requires a mainEntity array of Question objects.',
    path: 'mainEntity',
  });
  const main = node['mainEntity'];
  if (Array.isArray(main)) {
    main.forEach((q, i) => {
      const path = `mainEntity[${i}]`;
      if (!isObj(q)) {
        issues.push({ severity: 'error', code: 'faq-question-not-object', message: 'Each mainEntity item must be a Question object.', path });
        return;
      }
      check(getType(q).includes('Question'), issues, {
        severity: 'error',
        code: 'faq-question-wrong-type',
        message: 'Each mainEntity item must have @type=Question.',
        path: `${path}.@type`,
      });
      check(has(q, 'name'), issues, {
        severity: 'error',
        code: 'faq-question-missing-name',
        message: 'Question must have a name (the question text).',
        path: `${path}.name`,
      });
      const ans = q['acceptedAnswer'];
      if (!isObj(ans)) {
        issues.push({ severity: 'error', code: 'faq-missing-answer', message: 'Question must have acceptedAnswer object.', path: `${path}.acceptedAnswer` });
      } else {
        check(getType(ans).includes('Answer'), issues, {
          severity: 'error',
          code: 'faq-answer-wrong-type',
          message: 'acceptedAnswer must have @type=Answer.',
          path: `${path}.acceptedAnswer.@type`,
        });
        check(has(ans, 'text'), issues, {
          severity: 'error',
          code: 'faq-answer-missing-text',
          message: 'Answer must have text content.',
          path: `${path}.acceptedAnswer.text`,
        });
      }
    });
  }
  issues.push({
    severity: 'warning',
    code: 'faq-rich-result-deprecated',
    message:
      'Google restricted FAQ rich snippets to authority sites in 2023 and cut them further in March 2026. The schema is still valuable for AI search citation but should not be expected to produce SERP rich results on most sites.',
  });
  return issues;
}

// ─── HowTo ──────────────────────────────────────────────────────────────────

function validateHowTo(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'howto-missing-name', message: 'HowTo requires name.', path: 'name' });
  check(has(node, 'step'), issues, { severity: 'error', code: 'howto-missing-step', message: 'HowTo requires step array.', path: 'step' });
  const steps = node['step'];
  if (Array.isArray(steps)) {
    steps.forEach((s, i) => {
      const path = `step[${i}]`;
      if (!isObj(s)) {
        issues.push({ severity: 'error', code: 'howto-step-not-object', message: 'Each step must be an object.', path });
        return;
      }
      check(has(s, 'text') || has(s, 'name'), issues, {
        severity: 'error',
        code: 'howto-step-missing-content',
        message: 'Each step must have at least name or text.',
        path,
      });
    });
  }
  issues.push({
    severity: 'warning',
    code: 'howto-rich-result-removed',
    message:
      'Google removed HowTo rich results from desktop in 2023 and from all surfaces by 2024. Schema is still valid and used by AI search engines, but produces no SERP rich result.',
  });
  return issues;
}

// ─── Product ────────────────────────────────────────────────────────────────

function validateProduct(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'product-missing-name', message: 'Product requires name.', path: 'name' });
  const hasOffer = isObj(node['offers']) || (Array.isArray(node['offers']) && (node['offers'] as unknown[]).length > 0);
  const hasRating = isObj(node['aggregateRating']);
  if (!hasOffer && !hasRating) {
    issues.push({
      severity: 'warning',
      code: 'product-no-offer-or-rating',
      message: 'Product without offers or aggregateRating will not produce SERP rich results. Add at least one.',
    });
  }
  if (isObj(node['offers'])) {
    const offer = node['offers'] as Obj;
    check(has(offer, 'price'), issues, { severity: 'warning', code: 'product-offer-missing-price', message: 'offers should include price.', path: 'offers.price' });
    check(has(offer, 'priceCurrency'), issues, { severity: 'warning', code: 'product-offer-missing-currency', message: 'offers should include priceCurrency (ISO 4217).', path: 'offers.priceCurrency' });
  }
  return issues;
}

// ─── Recipe ─────────────────────────────────────────────────────────────────

function validateRecipe(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'recipe-missing-name', message: 'Recipe requires name.', path: 'name' });
  check(has(node, 'recipeIngredient'), issues, { severity: 'error', code: 'recipe-missing-ingredients', message: 'Recipe requires recipeIngredient array.', path: 'recipeIngredient' });
  check(has(node, 'recipeInstructions'), issues, { severity: 'error', code: 'recipe-missing-instructions', message: 'Recipe requires recipeInstructions.', path: 'recipeInstructions' });
  check(has(node, 'image'), issues, { severity: 'warning', code: 'recipe-missing-image', message: 'Recipe should include image for rich result eligibility.', path: 'image' });
  return issues;
}

// ─── Article / BlogPosting / NewsArticle ────────────────────────────────────

function validateArticle(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'headline'), issues, { severity: 'error', code: 'article-missing-headline', message: 'Article requires headline.', path: 'headline' });
  check(has(node, 'image'), issues, { severity: 'warning', code: 'article-missing-image', message: 'Article should have image (1200px+ wide for Top Stories eligibility).', path: 'image' });
  check(has(node, 'datePublished'), issues, { severity: 'error', code: 'article-missing-date', message: 'Article requires datePublished.', path: 'datePublished' });
  check(isObj(node['author']) || (Array.isArray(node['author']) && (node['author'] as unknown[]).length > 0), issues, {
    severity: 'error',
    code: 'article-missing-author',
    message: 'Article requires author with name (and ideally url).',
    path: 'author',
  });
  if (!isObj(node['publisher'])) {
    issues.push({
      severity: 'warning',
      code: 'article-missing-publisher',
      message: 'Article should have publisher with name and logo for Top Stories eligibility.',
      path: 'publisher',
    });
  }
  return issues;
}

// ─── Review ─────────────────────────────────────────────────────────────────

function validateReview(node: Obj): Issue[] {
  const issues: Issue[] = [];
  if (!isObj(node['itemReviewed'])) {
    issues.push({
      severity: 'warning',
      code: 'review-missing-itemReviewed',
      message: 'Review without itemReviewed will not produce SERP star ratings.',
      path: 'itemReviewed',
    });
  }
  if (!isObj(node['reviewRating'])) {
    issues.push({ severity: 'error', code: 'review-missing-rating', message: 'Review requires reviewRating with ratingValue.', path: 'reviewRating' });
  } else {
    check(has(node['reviewRating'] as Obj, 'ratingValue'), issues, {
      severity: 'error',
      code: 'review-rating-missing-value',
      message: 'reviewRating must have ratingValue.',
      path: 'reviewRating.ratingValue',
    });
  }
  if (!isObj(node['author'])) {
    issues.push({ severity: 'error', code: 'review-missing-author', message: 'Review requires author.', path: 'author' });
  }
  return issues;
}

// ─── LocalBusiness ──────────────────────────────────────────────────────────

function validateLocalBusiness(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'lb-missing-name', message: 'LocalBusiness requires name.', path: 'name' });
  check(has(node, 'telephone'), issues, { severity: 'warning', code: 'lb-missing-phone', message: 'LocalBusiness should have telephone for Map Pack eligibility.', path: 'telephone' });
  if (!isObj(node['address'])) {
    issues.push({ severity: 'error', code: 'lb-missing-address', message: 'LocalBusiness requires address (PostalAddress).', path: 'address' });
  } else {
    const a = node['address'] as Obj;
    check(has(a, 'streetAddress') || has(a, 'addressLocality'), issues, {
      severity: 'warning',
      code: 'lb-address-incomplete',
      message: 'address should include streetAddress and addressLocality.',
      path: 'address',
    });
  }
  return issues;
}

// ─── Event ──────────────────────────────────────────────────────────────────

function validateEvent(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'event-missing-name', message: 'Event requires name.', path: 'name' });
  check(has(node, 'startDate'), issues, { severity: 'error', code: 'event-missing-startDate', message: 'Event requires startDate (ISO 8601 with timezone).', path: 'startDate' });
  if (!isObj(node['location'])) {
    issues.push({ severity: 'warning', code: 'event-missing-location', message: 'Event should have location (Place or VirtualLocation).', path: 'location' });
  }
  return issues;
}

// ─── BreadcrumbList ─────────────────────────────────────────────────────────

function validateBreadcrumb(node: Obj): Issue[] {
  const issues: Issue[] = [];
  const items = node['itemListElement'];
  if (!Array.isArray(items) || items.length === 0) {
    issues.push({ severity: 'error', code: 'breadcrumb-missing-items', message: 'BreadcrumbList requires itemListElement array.', path: 'itemListElement' });
    return issues;
  }
  items.forEach((it, i) => {
    const path = `itemListElement[${i}]`;
    if (!isObj(it)) {
      issues.push({ severity: 'error', code: 'breadcrumb-item-not-object', message: 'Each itemListElement must be a ListItem object.', path });
      return;
    }
    check(getType(it).includes('ListItem'), issues, { severity: 'error', code: 'breadcrumb-item-wrong-type', message: 'Each item must have @type=ListItem.', path: `${path}.@type` });
    const expectedPos = i + 1;
    if (it['position'] !== expectedPos) {
      issues.push({
        severity: 'error',
        code: 'breadcrumb-bad-position',
        message: `position must be sequential starting at 1; expected ${expectedPos}, got ${JSON.stringify(it['position'])}.`,
        path: `${path}.position`,
      });
    }
    check(has(it, 'name'), issues, { severity: 'error', code: 'breadcrumb-item-missing-name', message: 'ListItem requires name.', path: `${path}.name` });
    check(has(it, 'item') || has(it, 'url'), issues, { severity: 'error', code: 'breadcrumb-item-missing-url', message: 'ListItem requires item (URL).', path: `${path}.item` });
  });
  return issues;
}

// ─── Organization ───────────────────────────────────────────────────────────

function validateOrganization(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'org-missing-name', message: 'Organization requires name.', path: 'name' });
  check(has(node, 'url'), issues, { severity: 'warning', code: 'org-missing-url', message: 'Organization should have url.', path: 'url' });
  check(has(node, 'logo'), issues, { severity: 'warning', code: 'org-missing-logo', message: 'Organization should have logo (square, 600x600+) for Knowledge Panel.', path: 'logo' });
  return issues;
}

// ─── Course ─────────────────────────────────────────────────────────────────

function validateCourse(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'name'), issues, { severity: 'error', code: 'course-missing-name', message: 'Course requires name.', path: 'name' });
  check(has(node, 'description'), issues, { severity: 'error', code: 'course-missing-description', message: 'Course requires description.', path: 'description' });
  check(isObj(node['provider']), issues, { severity: 'error', code: 'course-missing-provider', message: 'Course requires provider (Organization).', path: 'provider' });
  if (!isObj(node['hasCourseInstance']) && !Array.isArray(node['hasCourseInstance'])) {
    issues.push({
      severity: 'warning',
      code: 'course-missing-instance',
      message: 'Course should have hasCourseInstance with mode, workload, and offers for Course rich result eligibility.',
      path: 'hasCourseInstance',
    });
  }
  return issues;
}

// ─── JobPosting ─────────────────────────────────────────────────────────────

function validateJobPosting(node: Obj): Issue[] {
  const issues: Issue[] = [];
  check(has(node, 'title'), issues, { severity: 'error', code: 'job-missing-title', message: 'JobPosting requires title.', path: 'title' });
  check(has(node, 'description'), issues, { severity: 'error', code: 'job-missing-description', message: 'JobPosting requires description.', path: 'description' });
  check(has(node, 'datePosted'), issues, { severity: 'error', code: 'job-missing-datePosted', message: 'JobPosting requires datePosted.', path: 'datePosted' });
  check(isObj(node['hiringOrganization']), issues, { severity: 'error', code: 'job-missing-hiring-org', message: 'JobPosting requires hiringOrganization (Organization).', path: 'hiringOrganization' });
  if (!isObj(node['jobLocation']) && !Array.isArray(node['jobLocation']) && node['jobLocationType'] !== 'TELECOMMUTE') {
    issues.push({
      severity: 'error',
      code: 'job-missing-location',
      message: 'JobPosting requires jobLocation, OR jobLocationType="TELECOMMUTE" with applicantLocationRequirements for remote roles.',
      path: 'jobLocation',
    });
  }
  if (!has(node, 'validThrough')) {
    issues.push({
      severity: 'warning',
      code: 'job-missing-validThrough',
      message: 'JobPosting should set validThrough. Stale postings without expiration are a top reason companies get suppressed from Google for Jobs.',
      path: 'validThrough',
    });
  }
  if (!isObj(node['baseSalary'])) {
    issues.push({
      severity: 'warning',
      code: 'job-missing-salary',
      message: 'JobPosting without baseSalary gets lower placement and skipped by AI hiring queries that filter on $X+.',
      path: 'baseSalary',
    });
  }
  return issues;
}
