import { motion } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import React, { useEffect, useRef } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type EnterOnMountProps = {
  /** Position in the group; each step adds motion.entranceStagger of delay. */
  index: number;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

/**
 * Fades its content up by motion.entranceOffset once, when it first mounts.
 * Under Reduce Motion it is a short fade with no movement or stagger.
 */
export function EnterOnMount({ index, children, style }: EnterOnMountProps) {
  const motionHelpers = useMotion();
  const opacity = useSharedValue(0);
  const offset = useSharedValue<number>(
    motionHelpers.reduceMotion ? 0 : motion.entranceOffset
  );

  const hasEntered = useRef(false);

  useEffect(() => {
    if (hasEntered.current) {
      return;
    }
    hasEntered.current = true;
    const delay = index * motion.entranceStagger;
    opacity.set(motionHelpers.fade(1, 'base', delay));
    offset.set(motionHelpers.timing(0, 'base', 'standard', delay));
  }, [index, opacity, offset, motionHelpers]);

  const enterStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: offset.get() }],
  }));

  return <Animated.View style={[style, enterStyle]}>{children}</Animated.View>;
}
