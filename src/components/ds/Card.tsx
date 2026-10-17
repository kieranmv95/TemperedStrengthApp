import { color, elevation, radius, space } from '@/src/constants/tokens';
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type CardProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  /** Kept for existing callers; press feedback is now a surface step. */
  activeOpacity?: number;
};

/**
 * Surface for grouped content. Prefer PressableCard for new tappable cards;
 * Card remains for existing screens that lay out their own content and chevron.
 */
export const Card = ({
  children,
  onPress,
  style,
  accessibilityLabel,
}: CardProps) => {
  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [
          styles.card,
          elevation.raised,
          style,
          pressed && styles.pressed,
        ]}
        onPress={onPress}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, elevation.raised, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  pressed: {
    backgroundColor: color.surface2,
  },
});
