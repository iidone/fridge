import type { MealPlan, ShoppingList } from '../types';

export const demoMealPlan: MealPlan = {
  weekStart: '2026-11-16',
  budgetRub: 4200,
  spentRub: 2610,
  meals: [
    { id: 'monday-lunch', day: 'Пн', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'tuesday-lunch', day: 'Вт', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'wednesday-lunch', day: 'Ср', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'thursday-lunch', day: 'Чт', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'friday-lunch', day: 'Пт', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'saturday-lunch', day: 'Сб', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
    { id: 'sunday-lunch', day: 'Вс', title: 'Курица с гречкой', description: 'и овощным салатом', mealType: 'Обед', calories: 430, cookingMinutes: 25, estimatedPriceRub: 340, emoji: '🥗' },
  ],
};

export const demoShoppingList: ShoppingList = {
  weekStart: '2026-11-16',
  items: [
    { id: 'chicken', name: 'Куриная грудка', amount: '500 г', priceRub: 280, emoji: '🍗', checked: false },
    { id: 'tomato', name: 'Томаты черри', amount: '250 г', priceRub: 160, emoji: '🍅', checked: false },
    { id: 'cucumber', name: 'Огурцы', amount: '2 шт.', priceRub: 90, emoji: '🥒', checked: false },
    { id: 'avocado', name: 'Авокадо', amount: '1 шт.', priceRub: 140, emoji: '🥑', checked: false },
    { id: 'greens', name: 'Свежая зелень', amount: '1 пучок', priceRub: 65, emoji: '🥬', checked: false },
    { id: 'yogurt', name: 'Греческий йогурт', amount: '150 г', priceRub: 85, emoji: '🥛', checked: true },
  ],
};
