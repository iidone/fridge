import type { MealPlan, ShoppingList } from '../types';

const apiBaseUrl = (process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1').replace(/\/$/, '');

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, { signal });
  if (!response.ok) {
    throw new Error(`API вернул ошибку ${response.status}`);
  }
  return response.json();
}

export function getMealPlan(signal?: AbortSignal): Promise<MealPlan> {
  return get<MealPlan>('/meal-plan', signal);
}

export function getShoppingList(signal?: AbortSignal): Promise<ShoppingList> {
  return get<ShoppingList>('/shopping-list', signal);
}
