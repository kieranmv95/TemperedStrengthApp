import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  motion,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

type ToastProps = {
  message: string;
  visible: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  action?: ToastAction;
  onDismiss: () => void;
};

/** Clears the tab bar (49pt) with a margin; on stack screens it simply sits a little higher. */
const TOAST_BOTTOM_CLEARANCE = 64;

/** Transient confirmation pinned near the bottom. Rendered by ToastProvider. */
export function Toast({
  message,
  visible,
  icon,
  action,
  onDismiss,
}: ToastProps) {
  const motionHelpers = useMotion();
  const insets = useSafeAreaInsets();
  const opacity = useSharedValue(0);
  const offset = useSharedValue<number>(motion.entranceOffset);

  useEffect(() => {
    opacity.set(motionHelpers.fade(visible ? 1 : 0, 'fast'));
    offset.set(
      motionHelpers.timing(visible ? 0 : motion.entranceOffset, 'base')
    );
  }, [visible, opacity, offset, motionHelpers]);

  const toastStyle = useAnimatedStyle(() => ({
    opacity: opacity.get(),
    transform: [{ translateY: offset.get() }],
  }));

  return (
    <View
      style={[
        styles.container,
        { bottom: insets.bottom + TOAST_BOTTOM_CLEARANCE },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View style={[styles.toast, elevation.overlay, toastStyle]}>
        <Pressable
          style={styles.message}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel={message}
          accessibilityHint="Dismisses this message"
        >
          {icon ? (
            <Ionicons name={icon} size={20} color={color.success} />
          ) : null}
          <Text style={styles.messageText}>{message}</Text>
        </Pressable>
        {action ? (
          <Pressable
            onPress={action.onPress}
            style={styles.action}
            accessibilityRole="button"
            accessibilityLabel={action.label}
          >
            <Text style={styles.actionText}>{action.label}</Text>
          </Pressable>
        ) : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: space.md,
    right: space.md,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingLeft: space.md,
    paddingRight: space.xs,
    borderRadius: radius.md,
    backgroundColor: color.surface3,
  },
  message: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingVertical: space.sm,
  },
  messageText: {
    ...typography.callout,
    color: color.textPrimary,
    flexShrink: 1,
  },
  action: {
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    justifyContent: 'center',
  },
  actionText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
