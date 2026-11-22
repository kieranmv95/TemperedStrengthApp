import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { getLatestRestingHeartRate } from '@/src/services/health';
import type { RestingHeartRateSample } from '@/src/services/healthTypes';
import type {
  HeartRateZoneSettings,
  RestingHeartRate,
  ZoneMethod,
  ZoneRange,
  ZoneSetupState,
} from '@/src/types/heartRate';
import {
  birthYearFromAge,
  zoneAgeFromSettings,
  zoneRangesFromSettings,
  zoneSetupState,
} from '@/src/utils/heartRateZones';
import {
  applyHealthRestingHeartRate,
  clearRestingHeartRate,
  DEFAULT_HEART_RATE_ZONE_SETTINGS,
  getHealthConnected,
  getHeartRateZoneSettings,
  getRestingHeartRate,
  replaceWithHealthRestingHeartRate,
  setHeartRateZoneSettings,
  setManualRestingHeartRate,
} from '@/src/utils/storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

export type UseHeartRateZonesResult = {
  ranges: ZoneRange[] | null;
  settings: HeartRateZoneSettings;
  age: number | null;
  restingHr: RestingHeartRate | null;
  /** Latest Health reading, even when a pinned manual value is in use. */
  healthSample: RestingHeartRateSample | null;
  setupState: ZoneSetupState;
  isLoading: boolean;
  /** True while a connected Health source is being re-read. */
  isRefreshingHealth: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  saveAgeAndMethod: (age: number, method: ZoneMethod) => Promise<void>;
  setMethod: (method: ZoneMethod) => Promise<void>;
  saveManualRestingHr: (bpm: number) => Promise<void>;
  clearRestingHr: () => Promise<void>;
  switchToHealthValue: () => Promise<void>;
};

/**
 * Zone inputs and calculated ranges. On focus, re-reads resting HR from
 * Health when the user has connected it; failures keep the stored value.
 */
export function useHeartRateZones(): UseHeartRateZonesResult {
  const { dataRevision } = useSyncManager();
  const [settings, setSettings] = useState<HeartRateZoneSettings>(
    DEFAULT_HEART_RATE_ZONE_SETTINGS
  );
  const [restingHr, setRestingHr] = useState<RestingHeartRate | null>(null);
  const [healthSample, setHealthSample] =
    useState<RestingHeartRateSample | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (isCancelled: () => boolean) => {
    try {
      const [nextSettings, storedRestingHr, connected] = await Promise.all([
        getHeartRateZoneSettings(),
        getRestingHeartRate(),
        getHealthConnected(),
      ]);
      if (isCancelled()) return;
      setSettings(nextSettings);
      setRestingHr(storedRestingHr);
      setError(null);
      setIsLoading(false);

      if (!connected) {
        setHealthSample(null);
        return;
      }
      setIsRefreshingHealth(true);
      try {
        const sample = await getLatestRestingHeartRate();
        if (isCancelled()) return;
        setHealthSample(sample);
        if (sample) {
          const next = await applyHealthRestingHeartRate(sample);
          if (!isCancelled()) setRestingHr(next);
        }
      } catch (healthError) {
        console.error('Error refreshing resting heart rate:', healthError);
      } finally {
        if (!isCancelled()) setIsRefreshingHealth(false);
      }
    } catch (loadError) {
      console.error('Error loading heart rate zones:', loadError);
      if (!isCancelled()) {
        setError(
          loadError instanceof Error ? loadError : new Error(String(loadError))
        );
        setIsLoading(false);
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    await load(() => false);
  }, [load]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void load(() => cancelled);
      return () => {
        cancelled = true;
      };
    }, [load])
  );

  // An account sync pull can change the synced settings while focused.
  useEffect(() => {
    if (dataRevision === 0) return;
    let cancelled = false;
    void getHeartRateZoneSettings().then((next) => {
      if (!cancelled) setSettings(next);
    });
    return () => {
      cancelled = true;
    };
  }, [dataRevision]);

  const saveSettings = async (next: HeartRateZoneSettings) => {
    await setHeartRateZoneSettings(next);
    setSettings(next);
  };

  const saveAgeAndMethod = async (age: number, method: ZoneMethod) => {
    await saveSettings({ birthYear: birthYearFromAge(age), method });
  };

  const setMethod = async (method: ZoneMethod) => {
    await saveSettings({ ...settings, method });
  };

  const saveManualRestingHr = async (bpm: number) => {
    const next = await setManualRestingHeartRate(bpm);
    setRestingHr(next);
  };

  const clearRestingHr = async () => {
    await clearRestingHeartRate();
    setRestingHr(null);
  };

  const switchToHealthValue = async () => {
    if (!healthSample) return;
    const next = await replaceWithHealthRestingHeartRate(healthSample);
    setRestingHr(next);
  };

  return {
    ranges: zoneRangesFromSettings(settings, restingHr),
    settings,
    age: zoneAgeFromSettings(settings),
    restingHr,
    healthSample,
    setupState: zoneSetupState(settings, restingHr),
    isLoading,
    isRefreshingHealth,
    error,
    refresh,
    saveAgeAndMethod,
    setMethod,
    saveManualRestingHr,
    clearRestingHr,
    switchToHealthValue,
  };
}
