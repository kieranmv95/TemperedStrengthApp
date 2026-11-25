import {
  getAvailablePlates,
  type BarType,
} from '@/src/utils/barbellLoad';
import type { WeightUnit } from '@/src/utils/storage';
import {
  getDefaultBarbell,
  getOwnedPlates,
  setDefaultBarbell,
  setOwnedPlates,
} from '@/src/utils/storage';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';

/**
 * Default bar and owned plate denominations for the current weight unit.
 * Reloads on focus and when synced data revises.
 */
export function useBarbellLoadPrefs(unit: WeightUnit): {
  barType: BarType;
  ownedPlates: number[];
  isLoading: boolean;
  setBarType: (barType: BarType) => Promise<void>;
  setOwnedPlatesForUnit: (plates: number[]) => Promise<void>;
  refresh: () => Promise<void>;
} {
  const { dataRevision } = useSyncManager();
  const [barType, setBarTypeState] = useState<BarType>('male');
  const [ownedPlates, setOwnedPlatesState] = useState<number[]>(() =>
    getAvailablePlates(unit)
  );
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [storedBar, storedPlates] = await Promise.all([
        getDefaultBarbell(),
        getOwnedPlates(unit),
      ]);
      const catalog = getAvailablePlates(unit);
      const owned =
        storedPlates.length > 0
          ? catalog.filter((plate) => storedPlates.includes(plate))
          : catalog;
      setBarTypeState(storedBar);
      setOwnedPlatesState(owned.length > 0 ? owned : catalog);
    } finally {
      setIsLoading(false);
    }
  }, [unit]);

  useFocusEffect(
    React.useCallback(() => {
      void refresh();
    }, [refresh])
  );

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (dataRevision === 0) return;
    void refresh();
  }, [dataRevision, refresh]);

  const setBarTypeSafe = useCallback(async (next: BarType) => {
    setBarTypeState(next);
    try {
      await setDefaultBarbell(next);
    } catch (error) {
      const stored = await getDefaultBarbell();
      setBarTypeState(stored);
      throw error;
    }
  }, []);

  const setOwnedPlatesSafe = useCallback(
    async (plates: number[]) => {
      const catalog = getAvailablePlates(unit);
      const next = catalog.filter((plate) => plates.includes(plate));
      const owned = next.length > 0 ? next : catalog;
      setOwnedPlatesState(owned);
      try {
        await setOwnedPlates(unit, owned);
      } catch (error) {
        const stored = await getOwnedPlates(unit);
        const restored =
          stored.length > 0
            ? catalog.filter((plate) => stored.includes(plate))
            : catalog;
        setOwnedPlatesState(restored.length > 0 ? restored : catalog);
        throw error;
      }
    },
    [unit]
  );

  return {
    barType,
    ownedPlates,
    isLoading,
    setBarType: setBarTypeSafe,
    setOwnedPlatesForUnit: setOwnedPlatesSafe,
    refresh,
  };
}
