import { color } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type ProgressRingTone = 'gold' | 'success';

type ProgressRingProps = {
  /** 0 to 1. Values outside the range are clamped. */
  progress: number;
  size: number;
  strokeWidth?: number;
  tone?: ProgressRingTone;
  /** What is being measured, e.g. "Rest timer". */
  accessibilityLabel: string;
  /** Spoken value, e.g. "45 seconds remaining". */
  accessibilityValueText: string;
  /** Centred content, e.g. a countdown. Hidden from assistive tech; the value text is read instead. */
  children?: React.ReactNode;
};

const TONE_COLORS: Record<ProgressRingTone, string> = {
  gold: color.gold,
  success: color.success,
};

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/** Arc starts at 12 o'clock and animates from its previous value (0 on mount). */
export function ProgressRing({
  progress,
  size,
  strokeWidth = 6,
  tone = 'gold',
  accessibilityLabel,
  accessibilityValueText,
  children,
}: ProgressRingProps) {
  const motionHelpers = useMotion();
  const fill = useSharedValue(0);
  const target = clamp01(progress);
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;

  useEffect(() => {
    fill.set(motionHelpers.timing(target, 'slow'));
  }, [target, fill, motionHelpers]);

  const arcProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - fill.get()),
  }));

  return (
    <View
      style={{ width: size, height: size }}
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
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color.surface3}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={TONE_COLORS[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          fill="none"
          animatedProps={arcProps}
        />
      </Svg>
      {children ? (
        <View
          style={styles.center}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {children}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  svg: {
    transform: [{ rotate: '-90deg' }],
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
