import { useCallback, useEffect, useRef, useState } from 'react';
import { demoMealPlan, demoShoppingList } from '../data/mockData';
import { getMealPlan, getShoppingList } from '../services/api';
import type { MealPlan, ShoppingList } from '../types';

const apiEnabled = process.env.EXPO_PUBLIC_ENABLE_API === 'true';

export function useAppData() {
  const [mealPlan, setMealPlan] = useState<MealPlan>(demoMealPlan);
  const [shoppingList, setShoppingList] = useState<ShoppingList>(demoShoppingList);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const request = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);

    const [mealResult, shoppingResult] = await Promise.allSettled([
      getMealPlan(controller.signal),
      getShoppingList(controller.signal),
    ]);

    if (controller.signal.aborted) return;

    const errors: string[] = [];
    if (mealResult.status === 'fulfilled') {
      setMealPlan(mealResult.value);
    } else {
      errors.push(`рацион (${describeError(mealResult.reason)})`);
    }
    if (shoppingResult.status === 'fulfilled') {
      setShoppingList(shoppingResult.value);
    } else {
      errors.push(`список покупок (${describeError(shoppingResult.reason)})`);
    }

    setApiError(
      errors.length > 0
        ? `Не удалось загрузить ${errors.join(' и ')}. Для недоступных данных показаны демо-значения.`
        : null,
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!apiEnabled) return;
    void refresh();
    return () => request.current?.abort();
  }, [refresh]);

  return { mealPlan, shoppingList, apiError, loading, refresh };
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'неизвестная ошибка';
}
