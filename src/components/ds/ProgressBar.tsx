import { color, radius } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type ProgressBarProps = {
  /** 0 to 1. Values outside the range are clamped. */
  progress: number;
  /** What is being measured, e.g. "Program progress". */
  accessibilityLabel: string;
  /** Spoken value, e.g. "6 of 16 sessions complete". */
  accessibilityValueText: string;
};

const BAR_HEIGHT = 6;

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Fill animates from its previous value (0 on mount) to the new one. */
export function ProgressBar({
  progress,
  accessibilityLabel,
  accessibilityValueText,
}: ProgressBarProps) {
  const motionHelpers = useMotion();
  const fill = useSharedValue(0);
  const target = clamp01(progress);

  useEffect(() => {
    fill.set(motionHelpers.timing(target, 'slow'));
  }, [target, fill, motionHelpers]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${fill.get() * 100}%`,
  }));

  return (
    <View
      style={styles.track}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(target * 100),
        text: accessibilityValueText,
      }}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: BAR_HEIGHT,
    borderRadius: radius.pill,
    backgroundColor: color.surface3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
});
