import { color, MIN_TARGET_SIZE } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);

export type SetCheckState = 'pending' | 'completed' | 'failed';

type SetCheckButtonProps = {
  state: SetCheckState;
  onPress: () => void;
  /** e.g. "Set 2". The state is appended: "Set 2, completed". */
  accessibilityLabel: string;
  disabled?: boolean;
  /** Spoken when disabled, e.g. "Enter reps to log this set". */
  disabledHint?: string;
};

const SIZE = MIN_TARGET_SIZE;
const CIRCLE_SIZE = 36;
const CHECK_PATH = 'M11 18.5 L16 23.5 L25 13.5';
const CHECK_LENGTH = 22;

const STATE_SUFFIX: Record<SetCheckState, string> = {
  pending: 'not logged',
  completed: 'completed',
  failed: 'failed',
};

/**
 * Logs a set. Completing fills the circle gold, draws the check and gives a
 * success haptic; only on the change to completed, not when already logged.
 */
export function SetCheckButton({
  state,
  onPress,
  accessibilityLabel,
  disabled = false,
  disabledHint,
}: SetCheckButtonProps) {
  const motionHelpers = useMotion();
  const isCompleted = state === 'completed';
  const fill = useSharedValue(isCompleted ? 1 : 0);
  const draw = useSharedValue(isCompleted ? 1 : 0);
  const previousState = useRef(state);

  useEffect(() => {
    const becameCompleted =
      state === 'completed' && previousState.current !== 'completed';
    previousState.current = state;

    fill.set(motionHelpers.spring(state === 'completed' ? 1 : 0, 'snappy'));
    draw.set(motionHelpers.timing(state === 'completed' ? 1 : 0, 'base'));
    if (becameCompleted) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [state, fill, draw, motionHelpers]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: fill.get(),
    transform: [{ scale: 0.6 + 0.4 * fill.get() }],
  }));

  const checkProps = useAnimatedProps(() => ({
    strokeDashoffset: CHECK_LENGTH * (1 - draw.get()),
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={styles.target}
      accessibilityRole="checkbox"
      accessibilityLabel={`${accessibilityLabel}, ${STATE_SUFFIX[state]}`}
      accessibilityHint={disabled ? disabledHint : undefined}
      accessibilityState={{ checked: isCompleted, disabled }}
    >
      <View style={styles.circle}>
        <View
          style={[
            styles.ring,
            state === 'failed' && styles.ringFailed,
            disabled && styles.ringDisabled,
          ]}
        />
        <Animated.View style={[styles.fill, fillStyle]} />
        {state === 'failed' ? (
          <Ionicons name="close" size={20} color={color.danger} />
        ) : (
          <Svg
            width={CIRCLE_SIZE}
            height={CIRCLE_SIZE}
            style={StyleSheet.absoluteFill}
          >
            <AnimatedPath
              d={CHECK_PATH}
              stroke={color.onGold}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              strokeDasharray={CHECK_LENGTH}
              animatedProps={checkProps}
            />
          </Svg>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  target: {
    width: SIZE,
    height: SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    ...StyleSheet.absoluteFill,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: color.borderStrong,
  },
  ringFailed: {
    borderColor: color.danger,
  },
  ringDisabled: {
    borderColor: color.surface3,
  },
  fill: {
    ...StyleSheet.absoluteFill,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: color.gold,
  },
});
