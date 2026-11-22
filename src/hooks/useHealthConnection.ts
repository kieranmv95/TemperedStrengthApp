import {
  getDateOfBirth,
  getHealthAvailability,
  getLatestRestingHeartRate,
  requestRestingHeartRateAccess,
} from '@/src/services/health';
import type { HealthAvailability } from '@/src/services/healthTypes';
import {
  applyHealthRestingHeartRate,
  clearHealthRestingHeartRate,
  getHealthConnected,
  setHealthConnected,
} from '@/src/utils/storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export type HealthConnectResult =
  'idle' | 'connected' | 'noData' | 'denied' | 'error';

export type UseHealthConnectionResult = {
  /** `null` while loading. */
  availability: HealthAvailability | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastResult: HealthConnectResult;
  dateOfBirth: Date | null;
  connect: () => Promise<HealthConnectResult>;
  disconnect: () => Promise<void>;
};

/**
 * Health availability and the connect / disconnect flow. Disconnecting stops
 * the app reading Health; revoking OS access happens in system settings.
 */
export function useHealthConnection(): UseHealthConnectionResult {
  const [availability, setAvailability] = useState<HealthAvailability | null>(
    null
  );
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [lastResult, setLastResult] = useState<HealthConnectResult>('idle');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void (async () => {
        const [nextAvailability, connected] = await Promise.all([
          getHealthAvailability(),
          getHealthConnected(),
        ]);
        if (cancelled) return;
        setAvailability(nextAvailability);
        setIsConnected(connected && nextAvailability === 'available');
        if (connected && nextAvailability === 'available') {
          const nextDateOfBirth = await getDateOfBirth();
          if (!cancelled) setDateOfBirth(nextDateOfBirth);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const connect = async (): Promise<HealthConnectResult> => {
    setIsConnecting(true);
    let result: HealthConnectResult;
    try {
      const granted = await requestRestingHeartRateAccess();
      if (!granted) {
        await setHealthConnected(false);
        setIsConnected(false);
        result = 'denied';
      } else {
        await setHealthConnected(true);
        setIsConnected(true);
        const [sample, nextDateOfBirth] = await Promise.all([
          getLatestRestingHeartRate(),
          getDateOfBirth(),
        ]);
        setDateOfBirth(nextDateOfBirth);
        if (sample) {
          await applyHealthRestingHeartRate(sample);
          result = 'connected';
        } else {
          result = 'noData';
        }
      }
    } catch (error) {
      console.error('Error connecting Health:', error);
      result = 'error';
    } finally {
      setIsConnecting(false);
    }
    setLastResult(result);
    return result;
  };

  const disconnect = async () => {
    try {
      await setHealthConnected(false);
      await clearHealthRestingHeartRate();
    } catch (error) {
      console.error('Error disconnecting Health:', error);
    }
    setIsConnected(false);
    setDateOfBirth(null);
    setLastResult('idle');
  };

  return {
    availability,
    isConnected,
    isConnecting,
    lastResult,
    dateOfBirth,
    connect,
    disconnect,
  };
}
