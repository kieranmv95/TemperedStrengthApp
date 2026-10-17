import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { FilterChip } from './Chip';

type PillVariant = 'filter' | 'card';

type PillProps = {
  onPress: () => void;
  isActive: boolean;
  label: string;
  icon?: string;
  count?: number;
  /** When true, the pill is non-interactive (no press feedback / action). */
  disabled?: boolean;
  /** `card` is a small tappable tile; `filter` is a toggleable chip. */
  variant?: PillVariant;
};

/**
 * Legacy API kept for existing screens. `filter` renders a FilterChip; new
 * code should use FilterChip or ActionChip directly.
 */
export const Pill = ({
  onPress,
  isActive,
  label,
  icon,
  count,
  disabled = false,
  variant = 'filter',
}: PillProps) => {
  const iconName = icon as keyof typeof Ionicons.glyphMap | undefined;

  if (variant === 'filter') {
    return (
      <FilterChip
        label={label}
        selected={isActive}
        onPress={onPress}
        icon={iconName}
        count={count}
        disabled={disabled}
      />
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        elevation.raised,
        (isActive || pressed) && styles.cardActive,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, selected: isActive }}
    >
      {iconName ? (
        <Ionicons name={iconName} size={20} color={color.gold} />
      ) : null}
      <Text style={styles.cardText}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  cardActive: {
    backgroundColor: color.surface2,
  },
  cardText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
