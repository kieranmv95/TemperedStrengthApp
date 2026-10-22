import { color, radius, type RadiusToken } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useEffect } from 'react';
import {
  StyleSheet,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type SkeletonProps = {
  width: DimensionValue;
  height: DimensionValue;
  radius?: RadiusToken;
  /**
   * Set on one skeleton per loading region (e.g. "Loading workouts") so
   * assistive tech hears a single busy element; others stay hidden.
   */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/** Loading placeholder. Pulses gently; static tint under Reduce Motion. */
export function Skeleton({
  width,
  height,
  radius: radiusToken = 'sm',
  accessibilityLabel,
  style,
}: SkeletonProps) {
  const motionHelpers = useMotion();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.set(motionHelpers.pulse(1, 0.5));
  }, [opacity, motionHelpers]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.get() }));

  const accessibilityProps = accessibilityLabel
    ? {
        accessible: true,
        accessibilityLabel,
        accessibilityState: { busy: true },
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants' as const,
      };

  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius: radius[radiusToken] },
        pulseStyle,
        style,
      ]}
      {...accessibilityProps}
    />
  );
}

const styles = StyleSheet.create({
  block: {
    backgroundColor: color.surface2,
  },
});
