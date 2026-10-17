/**
 * Project-owned stand-in for react-native-reanimated in Jest.
 *
 * Reanimated 4.7.1's own Jest path fails with react-native-worklets 0.13 (its
 * native initialiser calls UI-thread APIs the Worklets JS build doesn't
 * implement), and its bundled mock imports the same initialiser. This mock
 * covers only the APIs the app uses: animations resolve to their target value
 * immediately and are jest.fn()s, so tests can assert what was requested.
 * Animation feel is verified on device via the dev token preview.
 */
import { useState, type ComponentType } from 'react';
import { FlatList, Image, ScrollView, Text, View } from 'react-native';

type AnimationCallback = (finished: boolean) => void;

type MockSharedValue<T> = {
  value: T;
  get: () => T;
  set: (next: T | ((current: T) => T)) => void;
};

function makeMutable<T>(initial: T): MockSharedValue<T> {
  const sharedValue: MockSharedValue<T> = {
    value: initial,
    get: () => sharedValue.value,
    set: (next) => {
      sharedValue.value =
        typeof next === 'function'
          ? (next as (current: T) => T)(sharedValue.value)
          : next;
    },
  };
  return sharedValue;
}

function useSharedValue<T>(initial: T): MockSharedValue<T> {
  const [sharedValue] = useState(() => makeMutable(initial));
  return sharedValue;
}

const withTiming = jest.fn(
  <T,>(toValue: T, _config?: unknown, callback?: AnimationCallback): T => {
    callback?.(true);
    return toValue;
  }
);

const withSpring = jest.fn(
  <T,>(toValue: T, _config?: unknown, callback?: AnimationCallback): T => {
    callback?.(true);
    return toValue;
  }
);

const withSequence = jest.fn(<T,>(...animations: T[]): T => {
  return animations[animations.length - 1];
});

const withDelay = jest.fn(<T,>(_delay: number, animation: T): T => animation);

const withRepeat = jest.fn(<T,>(animation: T): T => animation);

function cancelAnimation(): void {}

function interpolate(
  value: number,
  input: readonly number[],
  output: readonly number[]
): number {
  const [inStart, inEnd] = [input[0], input[input.length - 1]];
  const [outStart, outEnd] = [output[0], output[output.length - 1]];
  if (inEnd === inStart) {
    return outStart;
  }
  const progress = Math.min(
    1,
    Math.max(0, (value - inStart) / (inEnd - inStart))
  );
  return outStart + progress * (outEnd - outStart);
}

function interpolateColor(
  value: number,
  input: readonly number[],
  output: readonly string[]
): string {
  return value <= input[0] ? output[0] : output[output.length - 1];
}

function useAnimatedStyle<T>(updater: () => T): T {
  return updater();
}

function useAnimatedProps<T>(updater: () => T): T {
  return updater();
}

function useDerivedValue<T>(updater: () => T): MockSharedValue<T> {
  return makeMutable(updater());
}

/** Launch-time Reduce Motion value; set per test via jest/mockReduceMotion. */
const useReducedMotion = jest.fn((): boolean => false);

/* Used by react-native-gesture-handler's Reanimated integration. */
function useEvent<T>(handler: T): T {
  return handler;
}

function useHandler() {
  return { context: {}, doDependenciesDiffer: false };
}

function useComposedEventHandler() {
  return () => {};
}

function isSharedValue(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'get' in value &&
    'set' in value
  );
}

function setGestureState(): void {}

function runOnJS<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  return fn;
}

function createAnimatedComponent<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return Component;
}

const Easing = {
  linear: (t: number) => t,
  ease: (t: number) => t,
  bezier: () => ({ factory: () => (t: number) => t }),
  in: (easing: (t: number) => number) => easing,
  out: (easing: (t: number) => number) => easing,
  inOut: (easing: (t: number) => number) => easing,
};

const ReduceMotion = {
  System: 'system',
  Always: 'always',
  Never: 'never',
} as const;

const Extrapolation = {
  CLAMP: 'clamp',
  EXTEND: 'extend',
  IDENTITY: 'identity',
} as const;

type LayoutAnimationBuilder = {
  duration: () => LayoutAnimationBuilder;
  delay: () => LayoutAnimationBuilder;
  easing: () => LayoutAnimationBuilder;
  springify: () => LayoutAnimationBuilder;
  damping: () => LayoutAnimationBuilder;
  stiffness: () => LayoutAnimationBuilder;
  mass: () => LayoutAnimationBuilder;
  reduceMotion: () => LayoutAnimationBuilder;
  withInitialValues: () => LayoutAnimationBuilder;
};

function createLayoutAnimationBuilder(): LayoutAnimationBuilder {
  const builder: LayoutAnimationBuilder = {
    duration: () => builder,
    delay: () => builder,
    easing: () => builder,
    springify: () => builder,
    damping: () => builder,
    stiffness: () => builder,
    mass: () => builder,
    reduceMotion: () => builder,
    withInitialValues: () => builder,
  };
  return builder;
}

const FadeIn = createLayoutAnimationBuilder();
const FadeOut = createLayoutAnimationBuilder();
const FadeInDown = createLayoutAnimationBuilder();
const FadeInUp = createLayoutAnimationBuilder();
const FadeOutDown = createLayoutAnimationBuilder();
const LinearTransition = createLayoutAnimationBuilder();

const Animated = {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  createAnimatedComponent,
};

export default Animated;

export {
  cancelAnimation,
  createAnimatedComponent,
  Easing,
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  interpolate,
  interpolateColor,
  isSharedValue,
  LinearTransition,
  makeMutable,
  ReduceMotion,
  runOnJS,
  setGestureState,
  useAnimatedProps,
  useAnimatedStyle,
  useComposedEventHandler,
  useDerivedValue,
  useEvent,
  useHandler,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
};
