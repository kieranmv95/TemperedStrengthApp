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
  withRepeat,
  withSequence,
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
  /**
   * Loading-only opacity loop between `from` and `to`. Returns the static
   * `from` value under Reduce Motion. Stop it by assigning a new value.
   */
  pulse: (from: number, to: number) => number;
  /** One-off scale pop from 1 to `peak` and back, e.g. a selected tab icon. Stays at 1 under Reduce Motion. */
  bounce: (peak: number) => number;
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

  const pulse = (from: number, to: number): number => {
    'worklet';
    if (reduceMotion) {
      return from;
    }
    const halfCycle = {
      duration: motion.skeletonCycle / 2,
      easing: EASINGS.standard,
      reduceMotion: ReduceMotion.Never,
    };
    return withRepeat(
      withSequence(withTiming(to, halfCycle), withTiming(from, halfCycle)),
      -1
    );
  };

  const bounce = (peak: number): number => {
    'worklet';
    if (reduceMotion) {
      return 1;
    }
    return withSequence(
      withTiming(peak, {
        duration: motion.duration.fast / 2,
        easing: EASINGS.standard,
        reduceMotion: ReduceMotion.Never,
      }),
      withSpring(1, {
        ...motion.spring.snappy,
        reduceMotion: ReduceMotion.Never,
      })
    );
  };

  return { reduceMotion, timing, spring, fade, pulse, bounce };
}
