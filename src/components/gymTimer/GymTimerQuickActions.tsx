import { useGymTimer } from '@/src/hooks/gym-timer-context';
import { router } from 'expo-router';
import * as QuickActions from 'expo-quick-actions';
import { useQuickActionCallback } from 'expo-quick-actions/hooks';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * Registers home-screen shortcuts and handles launches.
 * Requires a native rebuild after adding expo-quick-actions.
 */
export function GymTimerQuickActions() {
  const { startAndBeginGymTimer } = useGymTimer();

  useEffect(() => {
    void QuickActions.setItems([
      {
        id: 'gym-rest-90',
        title: 'Rest 90s',
        subtitle: 'Between-set rest timer',
        icon:
          Platform.OS === 'ios' ? 'symbol:timer' : undefined,
        params: { href: '/tools/timers?quick=rest90' },
      },
      {
        id: 'gym-tabata',
        title: 'Start Tabata',
        subtitle: '8 × 20s / 10s',
        icon:
          Platform.OS === 'ios' ? 'symbol:flame' : undefined,
        params: { href: '/tools/timers?quick=tabata' },
      },
    ]);
  }, []);

  useQuickActionCallback((action) => {
    const href =
      typeof action.params?.href === 'string' ? action.params.href : null;
    if (href?.includes('quick=rest90')) {
      startAndBeginGymTimer({
        v: 1,
        leadInSec: 0,
        source: { kind: 'quick_action' },
        type: 'REST',
        config: { durationSec: 90 },
      });
      router.push('/tools/timers');
      return;
    }
    if (href?.includes('quick=tabata')) {
      startAndBeginGymTimer({
        v: 1,
        source: { kind: 'quick_action' },
        type: 'TABATA',
        config: { rounds: 8, workSec: 20, restSec: 10 },
      });
      router.push('/tools/timers');
      return;
    }
    if (href) {
      router.push(href as '/tools/timers');
    }
  });

  return null;
}
