import {
  type SchemaTypeDef,
  jsonLdEnvelope,
  getString,
  getRepeater,
} from '~/lib/schema-types';

export const recipeSchema: SchemaTypeDef = {
  id: 'recipe',
  slug: 'recipe-schema-generator',
  name: 'Recipe Schema Generator',
  schemaType: 'Recipe',

  title: 'Recipe Schema Generator | JSON-LD for Google + AI Cooking Assistants',
  metaDescription:
    'Generate Recipe JSON-LD that still drives Google image carousels in 2026 and gets cited by ChatGPT, Gemini, and Perplexity for cooking queries.',
  h1: 'Recipe Schema Generator',
  intro:
    'Describe your recipe step by step. Get clean Recipe JSON-LD that still earns image carousel placement in Google and gets cited by AI cooking assistants.',
  geoAeoAngle:
    'Recipe is the rare schema type whose visual rich results were NOT cut by Google in 2023-2026. Image carousels in Google Search and Discover still favor pages with clean Recipe markup. On top of that, AI cooking assistants (ChatGPT, Gemini, Perplexity, dedicated recipe AIs) cite Recipe schema heavily when answering "how do I cook X" questions.',

  pageFaqs: [
    {
      q: 'Do Recipe rich results still show in Google in 2026?',
      a: 'Yes. Unlike FAQ and HowTo, Recipe rich results were preserved through the 2023-2026 reductions. Recipe pages with clean schema still earn image carousel placement, ratings, cooking time, and calorie display in standard search and Google Discover.',
    },
    {
      q: 'What fields are required for Recipe rich results?',
      a: 'Google requires name, image, recipeIngredient, and recipeInstructions. Recommended additions for fuller rich results: aggregateRating, totalTime, recipeYield, nutrition.calories, video, and author. Pages with all recommended fields get noticeably better placement.',
    },
    {
      q: 'How granular should recipeInstructions be?',
      a: 'One concrete step per array item, each with a name and text. AI cooking assistants extract steps individually when answering "what is the third step of..." queries — atomic steps cite better than paragraph blobs.',
    },
    {
      q: 'Should I include nutrition information?',
      a: 'Yes if you can. Calories at minimum. AI assistants increasingly answer "how many calories in..." queries directly from Recipe schema, and pages without nutrition often get skipped in favor of pages that have it.',
    },
    {
      q: 'Can I use Recipe schema if my recipe is in a video?',
      a: 'Yes. Set the video field with a VideoObject inside the Recipe. Google now ranks video-bearing recipes higher in Discover and image search results.',
    },
    {
      q: 'How should I format ingredients? With or without measurements in the same string?',
      a: 'Together in one string per ingredient: "1 1/2 cups all-purpose flour". Google\'s parser and AI cooking assistants handle this format reliably. Splitting amount/unit/ingredient into separate fields breaks parsing and is non-standard.',
    },
    {
      q: 'What about prepTime and cookTime in addition to totalTime?',
      a: 'All three are valuable. prepTime + cookTime should equal totalTime when all are provided. AI assistants use prepTime to filter "quick prep" queries and cookTime to filter "set and forget" recipes. All three in ISO 8601 format.',
    },
    {
      q: 'Should I tag dietary restrictions (vegan, gluten-free)?',
      a: 'Yes — use suitableForDiet with schema.org RestrictedDiet enum values: VeganDiet, VegetarianDiet, GlutenFreeDiet, KosherDiet, HalalDiet, LowCalorieDiet, etc. Critical for AI recipe assistants filtering by dietary need.',
    },
    {
      q: 'How do AI cooking assistants use Recipe schema differently from Google?',
      a: 'Google uses Recipe schema for image carousel placement and rich snippet display. AI assistants (ChatGPT, Gemini, Perplexity, dedicated recipe AIs) parse it for grocery list generation, scaling (2x / 0.5x servings), substitution suggestions, and step-by-step voice walkthroughs. Both surfaces benefit from the same fields.',
    },
    {
      q: 'What is recipeCategory and recipeCuisine for?',
      a: 'recipeCategory ("Dessert", "Main Course", "Breakfast") and recipeCuisine ("Italian", "Japanese", "Tex-Mex") are filter fields. AI engines use them to answer "best Italian main courses" or "easy weeknight desserts" queries. Always include both.',
    },
    {
      q: 'Should I include aggregateRating from real user reviews?',
      a: 'Yes if you have genuine reviews on the page. Recipe sites with aggregateRating get noticeably better Discover placement. Inflating fake ratings violates Google policy and triggers manual actions — common cause of recipe site demotion.',
    },
  ],

  deepContent: {
    platformIntegrations: [
      {
        platform: 'WordPress (WP Recipe Maker / Tasty Recipes)',
        description:
          'WP Recipe Maker (free + pro) and Tasty Recipes are the dominant recipe-card plugins. Both auto-emit complete Recipe JSON-LD with nutrition, ratings, and timing fields. Almost no manual work needed.',
        steps: [
          'Install WP Recipe Maker (free tier covers Recipe schema + nutrition labels) or Tasty Recipes.',
          'In the Gutenberg editor, add the plugin\'s Recipe Block.',
          'Fill in name, ingredients, instructions, times, yield, calories. The plugin builds a recipe card UI and emits Recipe JSON-LD automatically.',
          'For dietary tags (vegan, gluten-free), use the plugin\'s built-in tags — they map to schema.org RestrictedDiet values.',
          'Validate with schemaguardian after publishing.',
        ],
      },
      {
        platform: 'Shopify (cookware / food brand store)',
        description:
          'Recipe content on Shopify usually lives in blog posts (article.liquid). No native Recipe schema — add via a custom Liquid snippet driven by article metafields.',
        steps: [
          'Create a Recipes blog (Online Store → Blog Posts → New Blog).',
          'Define metafields on articles: ingredients (list.string), instructions (list.json), prep_time, cook_time, yield, calories.',
          'Create snippets/recipe-schema.liquid that emits Recipe JSON-LD from those metafields.',
          'Include the snippet in article.liquid only when blog handle equals "recipes".',
          'Validate with schemaguardian on a recipe post.',
        ],
        codeExample: `{% if blog.handle == 'recipes' %}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": {{ article.title | json }},
  "description": {{ article.excerpt | strip_html | json }},
  "image": "{{ article.image | img_url: '1200x' }}",
  "author": { "@type": "Person", "name": {{ article.author | json }} },
  "datePublished": {{ article.published_at | json }},
  "prepTime": {{ article.metafields.recipe.prep_time | json }},
  "cookTime": {{ article.metafields.recipe.cook_time | json }},
  "totalTime": {{ article.metafields.recipe.total_time | json }},
  "recipeYield": {{ article.metafields.recipe.yield | json }},
  "recipeCategory": {{ article.metafields.recipe.category | json }},
  "recipeCuisine": {{ article.metafields.recipe.cuisine | json }},
  "recipeIngredient": {{ article.metafields.recipe.ingredients.value | json }},
  "recipeInstructions": [
    {% for step in article.metafields.recipe.instructions.value %}
    {
      "@type": "HowToStep",
      "name": {{ step.name | json }},
      "text": {{ step.text | json }}
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  ],
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "{{ article.metafields.recipe.calories }} calories"
  }
}
</script>
{% endif %}`,
      },
      {
        platform: 'Next.js / Astro (recipe blog)',
        description:
          'For framework-built recipe sites, define recipes as typed content collection entries with full schema fields. Build JSON-LD at SSG time and render alongside the visible recipe card.',
        steps: [
          'Define a Zod schema for recipes in src/content/config.ts requiring name, ingredients[], steps[], totalTime, image.',
          'In the recipe page, render the visible card from frontmatter.',
          'Build a Recipe JSON-LD object from the same data and render with <script type="application/ld+json">.',
          'For nutrition, store calories/protein/carbs/fat as separate fields and emit NutritionInformation.',
          'Wire schemaguardian into CI to validate every recipe page on every deploy.',
        ],
        codeExample: `// src/pages/recipes/[slug].astro
---
import { getEntry } from 'astro:content';
const { slug } = Astro.params;
const entry = await getEntry('recipes', slug);
const r = entry.data;
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: r.name,
  description: r.description,
  image: r.image,
  author: { '@type': 'Person', name: r.author },
  datePublished: r.publishedAt,
  prepTime: r.prepTime,
  cookTime: r.cookTime,
  totalTime: r.totalTime,
  recipeYield: r.yield,
  recipeCategory: r.category,
  recipeCuisine: r.cuisine,
  suitableForDiet: r.diets, // ['VeganDiet', 'GlutenFreeDiet']
  recipeIngredient: r.ingredients,
  recipeInstructions: r.steps.map(s => ({
    '@type': 'HowToStep',
    name: s.name,
    text: s.text,
  })),
  nutrition: {
    '@type': 'NutritionInformation',
    calories: \`\${r.calories} calories\`,
  },
};
---
<article>{/* visible recipe card */}</article>
<script is:inline type="application/ld+json" set:html={JSON.stringify(jsonLd)} />`,
      },
      {
        platform: 'Static HTML (single recipe page)',
        description:
          'For a one-off recipe page or landing page, paste the JSON-LD generated above directly into the <head>. Simplest case for cookbook authors and food bloggers on plain HTML.',
        steps: [
          'Generate the JSON-LD using the form above with all recipe fields.',
          'Paste the <script type="application/ld+json"> block into the <head>.',
          'Make sure visible ingredients and instructions on the page match the schema 1:1.',
          'Add suitableForDiet manually in the schema if the recipe fits a dietary category.',
          'Validate with schemaguardian.',
        ],
      },
    ],

    examplesGallery: [
      {
        scenario: 'Savory main course (full-fat pattern)',
        description:
          'Complete savory recipe with prep + cook times, yield, calories, cuisine, and dietary tags. Pattern for traditional food blogs and recipe sites — earns Discover image carousel placement.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Weeknight Sheet-Pan Chicken Fajitas",
  "description": "30-minute sheet-pan chicken fajitas with bell peppers and onions. One pan, dishwasher cleanup.",
  "image": [
    "https://example.com/fajitas-1x1.jpg",
    "https://example.com/fajitas-4x3.jpg",
    "https://example.com/fajitas-16x9.jpg"
  ],
  "author": { "@type": "Person", "name": "Maya Chen" },
  "datePublished": "2026-04-20",
  "description": "30-minute sheet-pan chicken fajitas. Marinated chicken thighs roasted with peppers and onions, served with warm tortillas.",
  "prepTime": "PT10M",
  "cookTime": "PT20M",
  "totalTime": "PT30M",
  "recipeYield": "4 servings",
  "recipeCategory": "Main Course",
  "recipeCuisine": "Mexican",
  "keywords": "sheet pan, chicken, fajitas, weeknight",
  "recipeIngredient": [
    "1 1/2 lbs boneless skinless chicken thighs, sliced",
    "2 tbsp olive oil",
    "2 tsp chili powder",
    "1 tsp ground cumin",
    "1/2 tsp smoked paprika",
    "1/2 tsp salt",
    "2 bell peppers, sliced",
    "1 large yellow onion, sliced",
    "1 lime, juiced",
    "8 small flour tortillas, warmed",
    "Cilantro and sour cream for serving"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "name": "Heat oven and prepare sheet pan",
      "text": "Heat oven to 425°F. Line a large rimmed sheet pan with parchment."
    },
    {
      "@type": "HowToStep",
      "name": "Toss with spices",
      "text": "In a large bowl, toss chicken, peppers, onion with olive oil, chili powder, cumin, paprika, and salt."
    },
    {
      "@type": "HowToStep",
      "name": "Roast",
      "text": "Spread evenly on the sheet pan. Roast 18-22 minutes, until chicken is 165°F internal and edges of vegetables are charred."
    },
    {
      "@type": "HowToStep",
      "name": "Finish and serve",
      "text": "Squeeze lime juice over the pan. Serve in warm tortillas with cilantro and sour cream."
    }
  ],
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "412 calories",
    "proteinContent": "32g",
    "fatContent": "14g",
    "carbohydrateContent": "38g"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "143"
  }
}`,
      },
      {
        scenario: 'Baking recipe with video',
        description:
          'Baking recipe with embedded video tutorial. Pattern for YouTube-driven food creators — pages with video Recipe schema rank higher in Discover and image carousels.',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Classic Sourdough Boule",
  "description": "A foolproof same-day sourdough boule with crispy crust and open crumb. Includes a 4-minute video walkthrough.",
  "image": "https://example.com/sourdough-hero.jpg",
  "author": { "@type": "Person", "name": "Jordan Park" },
  "datePublished": "2026-04-12",
  "prepTime": "PT30M",
  "cookTime": "PT45M",
  "totalTime": "PT8H",
  "recipeYield": "1 boule (8 slices)",
  "recipeCategory": "Bread",
  "recipeCuisine": "European",
  "recipeIngredient": [
    "500g bread flour",
    "375g water (75% hydration)",
    "100g active sourdough starter",
    "10g fine sea salt"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "name": "Mix and autolyse",
      "text": "Combine flour and water until shaggy. Cover and rest 30 minutes (autolyse)."
    },
    {
      "@type": "HowToStep",
      "name": "Add starter and salt",
      "text": "Pinch in starter and salt. Squeeze and fold until fully incorporated."
    },
    {
      "@type": "HowToStep",
      "name": "Bulk fermentation with stretches",
      "text": "Cover, rest 30 min. Perform 4 sets of stretch-and-folds at 30-min intervals. Continue bulk until 50% volume increase (3-5 hrs at 75°F)."
    },
    {
      "@type": "HowToStep",
      "name": "Shape and proof",
      "text": "Pre-shape, rest 20 min. Final shape into a boule. Proof in a banneton at room temp 1 hour, then refrigerate overnight."
    },
    {
      "@type": "HowToStep",
      "name": "Bake",
      "text": "Bake in a preheated Dutch oven at 500°F for 20 min covered, then 25 min uncovered at 450°F. Internal temp should reach 205°F."
    }
  ],
  "video": {
    "@type": "VideoObject",
    "name": "Same-Day Sourdough Boule Walkthrough",
    "description": "Full 4-minute walkthrough of mixing, shaping, and baking a sourdough boule.",
    "thumbnailUrl": "https://i.ytimg.com/vi/sourdoughid/maxresdefault.jpg",
    "uploadDate": "2026-04-12",
    "duration": "PT4M30S",
    "embedUrl": "https://www.youtube.com/embed/sourdoughid"
  },
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "210 calories",
    "servingSize": "1 slice"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "287"
  }
}`,
      },
      {
        scenario: 'Diet-restricted recipe (vegan + gluten-free)',
        description:
          'Recipe with explicit dietary tags via suitableForDiet. Highly cited by AI recipe assistants when users filter by diet ("vegan dinner ideas", "gluten-free desserts").',
        jsonLd: `{
  "@context": "https://schema.org",
  "@type": "Recipe",
  "name": "Vegan Gluten-Free Chocolate Cake",
  "description": "Rich vegan chocolate cake made with almond flour and aquafaba. Naturally gluten-free, no refined sugar.",
  "image": "https://example.com/vegan-gf-chocolate-cake.jpg",
  "author": { "@type": "Person", "name": "Sarah Kim" },
  "datePublished": "2026-04-08",
  "prepTime": "PT15M",
  "cookTime": "PT35M",
  "totalTime": "PT50M",
  "recipeYield": "8 slices",
  "recipeCategory": "Dessert",
  "recipeCuisine": "American",
  "suitableForDiet": [
    "https://schema.org/VeganDiet",
    "https://schema.org/GlutenFreeDiet"
  ],
  "keywords": "vegan, gluten-free, chocolate, cake, refined sugar free",
  "recipeIngredient": [
    "2 cups almond flour",
    "1/2 cup cocoa powder",
    "1/2 cup coconut sugar",
    "1 tsp baking soda",
    "1/2 tsp salt",
    "1/2 cup aquafaba (chickpea brine)",
    "1/3 cup melted coconut oil",
    "1 tsp vanilla extract",
    "1/2 cup unsweetened almond milk",
    "1/4 cup dairy-free chocolate chips"
  ],
  "recipeInstructions": [
    {
      "@type": "HowToStep",
      "name": "Preheat and prepare pan",
      "text": "Heat oven to 350°F. Grease an 8-inch round cake pan and line bottom with parchment."
    },
    {
      "@type": "HowToStep",
      "name": "Mix dry ingredients",
      "text": "Whisk almond flour, cocoa powder, coconut sugar, baking soda, and salt in a large bowl."
    },
    {
      "@type": "HowToStep",
      "name": "Whip aquafaba",
      "text": "Beat aquafaba with an electric mixer until soft peaks form (3-4 min)."
    },
    {
      "@type": "HowToStep",
      "name": "Combine wet ingredients",
      "text": "Whisk melted coconut oil, vanilla, and almond milk into the dry mixture. Gently fold in whipped aquafaba and chocolate chips."
    },
    {
      "@type": "HowToStep",
      "name": "Bake",
      "text": "Pour into prepared pan. Bake 32-38 minutes until a toothpick inserted in center comes out clean. Cool 15 minutes before unmolding."
    }
  ],
  "nutrition": {
    "@type": "NutritionInformation",
    "calories": "285 calories",
    "fatContent": "19g",
    "carbohydrateContent": "26g",
    "proteinContent": "6g"
  }
}`,
      },
    ],

    commonErrors: [
      {
        error: 'Missing image or low-resolution image',
        why: 'Google\'s Recipe rich result eligibility requires image ≥1200px wide. Pages with smaller or missing images drop out of image carousel placement entirely — by far the highest-leverage Recipe surface.',
        fix: 'Use ≥1200px (ideally 1920×1080) photos. Pass image as an array of three aspect ratios (1×1, 4×3, 16×9) for maximum eligibility.',
      },
      {
        error: 'Instructions as one big text block',
        why: 'recipeInstructions as a single string ("Mix everything and bake") loses step-by-step rich result rendering. AI cooking assistants also cannot answer "what is step 3" queries.',
        fix: 'Split into HowToStep array, one atomic step per item with name and text. Users see the same numbered steps; engines get clean structured data.',
      },
      {
        error: 'Times in non-ISO format',
        why: '"15 minutes" or "1 hour 30 min" as strings are rejected by Google\'s parser. Recipe drops from time-filtered queries ("quick dinner ideas").',
        fix: 'Use ISO 8601 duration: PT15M, PT1H30M. Prefix with PT, then [H]H[M]M format.',
      },
      {
        error: 'Inflated aggregateRating without genuine reviews',
        why: 'Adding aggregateRating with 4.9 / 1000 reviews when the page shows none triggers Google\'s structured data spam policy. Recipe sites are a known target — penalties are common.',
        fix: 'Only include aggregateRating if you have genuine visible reviews. Match ratingValue and reviewCount to what is visible. Use a reviews plugin (WP Recipe Maker has one) for honest data.',
      },
      {
        error: 'Missing nutrition.calories',
        why: 'AI cooking assistants and Google\'s Recipe rich result both heavily favor recipes with calories declared. Without it, your recipe loses to competitors when users filter by calorie target.',
        fix: 'Always include nutrition.calories as "{N} calories" string format. Other nutrition fields (proteinContent, fatContent) are optional bonuses.',
      },
      {
        error: 'recipeYield as a number without unit',
        why: 'recipeYield: "4" without units is ambiguous (4 servings? 4 cookies? 4 quarts?). AI assistants asking "scale this for 8 people" get confused.',
        fix: 'Use a clear human-readable string: "4 servings", "12 cookies", "2 quarts", "1 9-inch cake".',
      },
    ],
  },

  fields: [
    { kind: 'text', key: 'name', label: 'Recipe Name', placeholder: 'Classic Buttermilk Pancakes', required: true },
    { kind: 'textarea', key: 'description', label: 'Description', placeholder: 'Fluffy buttermilk pancakes ready in 15 minutes.', rows: 2 },
    { kind: 'text', key: 'image', label: 'Image URL', placeholder: 'https://example.com/pancakes.jpg' },
    { kind: 'text', key: 'totalTime', label: 'Total Time (ISO 8601, e.g. PT15M)', placeholder: 'PT15M' },
    { kind: 'text', key: 'recipeYield', label: 'Yield', placeholder: '4 servings' },
    { kind: 'text', key: 'calories', label: 'Calories per serving', placeholder: '180' },
    {
      kind: 'repeater',
      key: 'ingredients',
      label: 'Ingredients',
      addLabel: 'Add Ingredient',
      itemLabel: 'Ingredient',
      minItems: 1,
      itemFields: [
        { kind: 'text', key: 'item', label: 'Ingredient', placeholder: '1 cup buttermilk', required: true },
      ],
    },
    {
      kind: 'repeater',
      key: 'steps',
      label: 'Instructions',
      addLabel: 'Add Step',
      itemLabel: 'Step',
      minItems: 1,
      itemFields: [
        { kind: 'text', key: 'name', label: 'Step Name', placeholder: 'Mix dry ingredients', required: true },
        { kind: 'textarea', key: 'text', label: 'Step Instructions', placeholder: 'Whisk flour, baking powder, sugar, and salt in a large bowl.', required: true, rows: 2 },
      ],
    },
  ],

  sampleData: {
    name: 'Classic Buttermilk Pancakes',
    description: 'Fluffy buttermilk pancakes ready in 15 minutes. Makes about 8 pancakes.',
    image: 'https://example.com/buttermilk-pancakes.jpg',
    totalTime: 'PT15M',
    recipeYield: '4 servings',
    calories: '180',
    ingredients: [
      { item: '1 1/2 cups all-purpose flour' },
      { item: '2 tbsp sugar' },
      { item: '2 tsp baking powder' },
      { item: '1/2 tsp salt' },
      { item: '1 1/4 cups buttermilk' },
      { item: '1 large egg' },
      { item: '3 tbsp melted butter' },
    ],
    steps: [
      { name: 'Mix dry ingredients', text: 'Whisk flour, sugar, baking powder, and salt in a large bowl.' },
      { name: 'Combine wet ingredients', text: 'In a separate bowl, whisk buttermilk, egg, and melted butter until smooth.' },
      { name: 'Combine and rest', text: 'Pour wet into dry and stir until just combined. Lumps are fine. Let batter rest 5 minutes.' },
      { name: 'Cook', text: 'Heat a skillet over medium. Pour 1/4 cup batter per pancake. Flip when bubbles form on top, cook 1 more minute.' },
    ],
  },

  buildJsonLd: (data) => {
    const name = getString(data, 'name').trim();
    const description = getString(data, 'description').trim();
    const image = getString(data, 'image').trim();
    const totalTime = getString(data, 'totalTime').trim();
    const recipeYield = getString(data, 'recipeYield').trim();
    const calories = getString(data, 'calories').trim();
    const ingredients = getRepeater(data, 'ingredients');
    const steps = getRepeater(data, 'steps');

    const body: Record<string, unknown> = { '@type': 'Recipe', name };
    if (description) body.description = description;
    if (image) body.image = image;
    if (totalTime) body.totalTime = totalTime;
    if (recipeYield) body.recipeYield = recipeYield;

    const ingArr = ingredients.map((i) => i.item?.trim()).filter(Boolean);
    if (ingArr.length) body.recipeIngredient = ingArr;

    const stepArr = steps
      .filter((s) => s.name?.trim() && s.text?.trim())
      .map((s) => ({
        '@type': 'HowToStep',
        name: s.name.trim(),
        text: s.text.trim(),
      }));
    if (stepArr.length) body.recipeInstructions = stepArr;

    if (calories) {
      body.nutrition = {
        '@type': 'NutritionInformation',
        calories: `${calories} calories`,
      };
    }

    return jsonLdEnvelope(body);
  },
};
