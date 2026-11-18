import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { demoProfile } from '../data/mockData';
import { generatePlannerData } from '../domain/planner';
import { getMealPlan, getShoppingList } from '../services/api';
import type { MealPlan, ShoppingList, UserProfile } from '../types';

const apiEnabled = process.env.EXPO_PUBLIC_ENABLE_API === 'true';

export function useAppData(profile: UserProfile = demoProfile) {
  const generatedData = useMemo(() => generatePlannerData(profile), [profile]);
  const [remoteMealPlan, setRemoteMealPlan] = useState<MealPlan | null>(null);
  const [remoteShoppingList, setRemoteShoppingList] = useState<ShoppingList | null>(null);
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
      setRemoteMealPlan(mealResult.value);
    } else {
      errors.push(`рацион (${describeError(mealResult.reason)})`);
    }
    if (shoppingResult.status === 'fulfilled') {
      setRemoteShoppingList(shoppingResult.value);
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
    // API refresh is intentionally started from the mount effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void refresh();
    return () => request.current?.abort();
  }, [refresh]);

  return {
    mealPlan: remoteMealPlan ?? generatedData.mealPlan,
    shoppingList: remoteShoppingList ?? generatedData.shoppingList,
    apiError,
    loading,
    refresh,
  };
}

function describeError(error: unknown): string {
  return error instanceof Error ? error.message : 'неизвестная ошибка';
}
