import {
  motion,
  type DurationToken,
  type EasingToken,
  type SpringToken,
} from '@/src/constants/tokens';
import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
  Easing,
  ReduceMotion,
  useReducedMotion,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const EASINGS = {
  standard: Easing.bezier(...motion.easing.standard),
  exit: Easing.bezier(...motion.easing.exit),
} as const satisfies Record<EasingToken, unknown>;

export type Motion = {
  /** OS Reduce Motion setting; updates live while the app is open. */
  reduceMotion: boolean;
  /** Movement (translate, scale, rotate, size). Instant under Reduce Motion. */
  timing: (
    toValue: number,
    duration?: DurationToken,
    easing?: EasingToken
  ) => number;
  /** Spring movement. Instant under Reduce Motion. */
  spring: (toValue: number, preset?: SpringToken) => number;
  /** Opacity or colour progress. Shortened to a ≤150ms crossfade under Reduce Motion. */
  fade: (toValue: number, duration?: DurationToken) => number;
};

/**
 * The single entry point for animation. Every Reanimated animation in the app
 * is built through these helpers so Reduce Motion is respected everywhere.
 * The helpers are worklets and can be called from the JS thread or inside
 * `useAnimatedStyle` / gesture callbacks.
 */
export function useMotion(): Motion {
  // Synchronous launch-time value, so mount animations never play before the
  // async check below resolves. The listener keeps it current afterwards.
  const reduceMotionAtLaunch = useReducedMotion();
  const [reduceMotion, setReduceMotion] = useState(reduceMotionAtLaunch);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (!cancelled) {
          setReduceMotion(enabled);
        }
      })
      .catch((error) => {
        console.error('Failed to read Reduce Motion setting:', error);
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion
    );
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  const timing = (
    toValue: number,
    duration: DurationToken = 'base',
    easing: EasingToken = 'standard'
  ): number => {
    'worklet';
    if (reduceMotion) {
      return toValue;
    }
    return withTiming(toValue, {
      duration: motion.duration[duration],
      easing: EASINGS[easing],
      reduceMotion: ReduceMotion.Never,
    });
  };

  const spring = (toValue: number, preset: SpringToken = 'snappy'): number => {
    'worklet';
    if (reduceMotion) {
      return toValue;
    }
    return withSpring(toValue, {
      ...motion.spring[preset],
      reduceMotion: ReduceMotion.Never,
    });
  };

  const fade = (toValue: number, duration: DurationToken = 'fast'): number => {
    'worklet';
    return withTiming(toValue, {
      duration: reduceMotion
        ? Math.min(motion.duration[duration], motion.reducedFadeDuration)
        : motion.duration[duration],
      easing: EASINGS.standard,
      reduceMotion: ReduceMotion.Never,
    });
  };

  return { reduceMotion, timing, spring, fade };
}
