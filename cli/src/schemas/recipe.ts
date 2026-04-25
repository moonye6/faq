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
  ],

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
