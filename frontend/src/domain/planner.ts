import type { Meal, MealPlan, ShoppingItem, ShoppingList, UserProfile } from '../types';

type IngredientDefinition = {
  name: string;
  emoji: string;
  unit: 'г' | 'шт.';
  amountPerServing: number;
  packSize: number;
  packPriceRub: number;
};

type RecipeDefinition = {
  id: string;
  title: string;
  description: string;
  calories: number;
  cookingMinutes: number;
  estimatedPriceRub: number;
  emoji: string;
  ingredients: IngredientDefinition[];
};

const days = [
  { label: 'Пн', date: 16 },
  { label: 'Вт', date: 17 },
  { label: 'Ср', date: 18 },
  { label: 'Чт', date: 19 },
  { label: 'Пт', date: 20 },
  { label: 'Сб', date: 21 },
  { label: 'Вс', date: 22 },
];

const recipes: RecipeDefinition[] = [
  {
    id: 'chicken-buckwheat',
    title: 'Курица с гречкой',
    description: 'и овощным салатом',
    calories: 430,
    cookingMinutes: 25,
    estimatedPriceRub: 340,
    emoji: '🥗',
    ingredients: [
      { name: 'Куриная грудка', emoji: '🍗', unit: 'г', amountPerServing: 180, packSize: 500, packPriceRub: 280 },
      { name: 'Гречка', emoji: '🌾', unit: 'г', amountPerServing: 80, packSize: 800, packPriceRub: 95 },
      { name: 'Томаты черри', emoji: '🍅', unit: 'г', amountPerServing: 120, packSize: 500, packPriceRub: 180 },
      { name: 'Огурцы', emoji: '🥒', unit: 'г', amountPerServing: 100, packSize: 500, packPriceRub: 120 },
    ],
  },
  {
    id: 'lentil-soup',
    title: 'Чечевичный суп',
    description: 'с овощами и зеленью',
    calories: 360,
    cookingMinutes: 35,
    estimatedPriceRub: 220,
    emoji: '🍲',
    ingredients: [
      { name: 'Чечевица', emoji: '🫘', unit: 'г', amountPerServing: 90, packSize: 800, packPriceRub: 160 },
      { name: 'Морковь', emoji: '🥕', unit: 'г', amountPerServing: 100, packSize: 1000, packPriceRub: 90 },
      { name: 'Лук', emoji: '🧅', unit: 'шт.', amountPerServing: 0.5, packSize: 5, packPriceRub: 110 },
      { name: 'Свежая зелень', emoji: '🥬', unit: 'шт.', amountPerServing: 0.25, packSize: 1, packPriceRub: 65 },
    ],
  },
  {
    id: 'omelet-vegetables',
    title: 'Омлет с овощами',
    description: 'и свежей зеленью',
    calories: 390,
    cookingMinutes: 15,
    estimatedPriceRub: 250,
    emoji: '🍳',
    ingredients: [
      { name: 'Яйца', emoji: '🥚', unit: 'шт.', amountPerServing: 2, packSize: 10, packPriceRub: 140 },
      { name: 'Томаты черри', emoji: '🍅', unit: 'г', amountPerServing: 120, packSize: 500, packPriceRub: 180 },
      { name: 'Свежая зелень', emoji: '🥬', unit: 'шт.', amountPerServing: 0.25, packSize: 1, packPriceRub: 65 },
    ],
  },
  {
    id: 'fish-rice',
    title: 'Рыба с рисом',
    description: 'и лимонной заправкой',
    calories: 470,
    cookingMinutes: 30,
    estimatedPriceRub: 390,
    emoji: '🐟',
    ingredients: [
      { name: 'Филе хека', emoji: '🐟', unit: 'г', amountPerServing: 180, packSize: 600, packPriceRub: 390 },
      { name: 'Рис', emoji: '🍚', unit: 'г', amountPerServing: 80, packSize: 800, packPriceRub: 110 },
      { name: 'Лимон', emoji: '🍋', unit: 'шт.', amountPerServing: 0.25, packSize: 2, packPriceRub: 130 },
    ],
  },
];

const goalOrder: Record<UserProfile['nutritionGoal'], string[]> = {
  health: ['chicken-buckwheat', 'fish-rice', 'lentil-soup', 'omelet-vegetables'],
  economy: ['lentil-soup', 'omelet-vegetables', 'chicken-buckwheat', 'fish-rice'],
  energy: ['fish-rice', 'chicken-buckwheat', 'omelet-vegetables', 'lentil-soup'],
};

export function generatePlannerData(profile: UserProfile): { mealPlan: MealPlan; shoppingList: ShoppingList } {
  const selectedRecipes = chooseRecipes(profile);
  const weeklyRecipes = days.map((_, index) => selectedRecipes[index % selectedRecipes.length]);
  const meals: Meal[] = days.map((day, index) => {
    const recipe = weeklyRecipes[index];
    return {
      id: `${day.label.toLowerCase()}-${recipe.id}`,
      day: day.label,
      title: recipe.title,
      description: recipe.description,
      mealType: 'Обед',
      calories: recipe.calories,
      cookingMinutes: recipe.cookingMinutes,
      estimatedPriceRub: recipe.estimatedPriceRub,
      emoji: recipe.emoji,
    };
  });
  const shoppingList = buildShoppingList(weeklyRecipes, profile);

  return {
    mealPlan: {
      weekStart: '2026-11-16',
      budgetRub: profile.weeklyBudgetRub,
      spentRub: shoppingList.items.reduce((total, item) => total + item.priceRub, 0),
      meals,
    },
    shoppingList,
  };
}

function chooseRecipes(profile: UserProfile): RecipeDefinition[] {
  const forbidden = [...profile.allergies, ...profile.dislikedFoods].map(normalize);
  const allowed = recipes.filter((recipe) => {
    const searchableText = normalize([recipe.title, recipe.description, ...recipe.ingredients.map((item) => item.name)].join(' '));
    return !forbidden.some((term) => term && searchableText.includes(term));
  });
  const source = allowed.length > 0 ? allowed : recipes;
  return goalOrder[profile.nutritionGoal]
    .map((id) => source.find((recipe) => recipe.id === id))
    .filter((recipe): recipe is RecipeDefinition => Boolean(recipe));
}

function buildShoppingList(selectedRecipes: RecipeDefinition[], profile: UserProfile): ShoppingList {
  const required = new Map<string, { definition: IngredientDefinition; amount: number }>();
  selectedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      const current = required.get(ingredient.name);
      required.set(ingredient.name, {
        definition: ingredient,
        amount: (current?.amount ?? 0) + ingredient.amountPerServing,
      });
    });
  });

  const pantry = profile.pantryItems.map(normalize);
  const items: ShoppingItem[] = [];
  required.forEach(({ definition, amount }) => {
    const coveredByPantry = pantry.some((item) => item && (item.includes(normalize(definition.name)) || normalize(definition.name).includes(item)));
    if (coveredByPantry) return;

    const packs = Math.max(1, Math.ceil(amount / definition.packSize));
    const purchasedAmount = packs * definition.packSize;
    items.push({
      id: normalize(definition.name).replaceAll(' ', '-'),
      name: definition.name,
      amount: formatAmount(purchasedAmount, definition.unit),
      priceRub: packs * definition.packPriceRub,
      emoji: definition.emoji,
      checked: false,
    });
  });

  return { weekStart: '2026-11-16', items };
}

function formatAmount(amount: number, unit: IngredientDefinition['unit']): string {
  const value = Number.isInteger(amount) ? amount : amount.toFixed(1).replace('.0', '');
  return `${value} ${unit}`;
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('ru-RU').trim();
}
