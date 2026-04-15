import type { WeightUnit } from '@/src/utils/storage';
import { getWeightUnit, setWeightUnit } from '@/src/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';

export function useWeightUnit(): {
  unit: WeightUnit;
  isLoading: boolean;
  setUnit: (unit: WeightUnit) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const [unit, setUnitState] = useState<WeightUnit>('kg');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refresh = useCallback(async () => {
    try {
      const u = await getWeightUnit();
      setUnitState(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      refresh();
    }, [refresh])
  );

  const setUnitSafe = useCallback(async (next: WeightUnit) => {
    setUnitState(next);
    try {
      await setWeightUnit(next);
    } catch (error) {
      // Re-sync local state to stored value if persistence fails.
      const u = await getWeightUnit();
      setUnitState(u);
      throw error;
    }
  }, []);

  return { unit, isLoading, setUnit: setUnitSafe, refresh };
}

