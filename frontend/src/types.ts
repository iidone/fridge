export type Screen = 'home' | 'recipe' | 'shopping' | 'stores' | 'profile' | 'settings';
export type Tab = 'home' | 'shopping' | 'profile';

export interface Palette {
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  muted: string;
  line: string;
  green: string;
  greenDark: string;
  greenTint: string;
  white: string;
}

export interface Meal {
  id: string;
  day: string;
  title: string;
  description: string;
  mealType: string;
  calories: number;
  cookingMinutes: number;
  estimatedPriceRub: number;
  emoji: string;
}

export interface MealPlan {
  weekStart: string;
  budgetRub: number;
  spentRub: number;
  meals: Meal[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  priceRub: number;
  emoji: string;
  checked: boolean;
}

export interface ShoppingList {
  weekStart: string;
  items: ShoppingItem[];
}
