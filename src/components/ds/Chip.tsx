import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import { flattenToHex } from '@/src/utils/contrast';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

type IoniconName = keyof typeof Ionicons.glyphMap;

const CHIP_HEIGHT = 36;
const CHIP_HIT_SLOP = (MIN_TARGET_SIZE - CHIP_HEIGHT) / 2;
const CHIP_ICON_SIZE = 16;

const FILTER_SELECTED_FILL = flattenToHex(color.goldTint, color.surface2);

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Number of results this filter would show; rendered with tabular figures. */
  count?: number;
  icon?: IoniconName;
  /** Defaults to "{label}, {count}". Pass e.g. "Strength, 22 workouts". */
  accessibilityLabel?: string;
  disabled?: boolean;
};

/**
 * Toggleable filter. Selection is shown by a check icon and a gold edge as
 * well as the fill, so it never relies on colour alone.
 */
export function FilterChip({
  label,
  selected,
  onPress,
  count,
  icon,
  accessibilityLabel,
  disabled = false,
}: FilterChipProps) {
  const motionHelpers = useMotion();
  const progress = useSharedValue(selected ? 1 : 0);

  useEffect(() => {
    progress.set(motionHelpers.fade(selected ? 1 : 0, 'fast'));
  }, [selected, progress, motionHelpers]);

  const surfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.get(),
      [0, 1],
      [color.surface2, FILTER_SELECTED_FILL]
    ),
    borderColor: interpolateColor(
      progress.get(),
      [0, 1],
      [color.borderSubtle, color.gold]
    ),
  }));

  const checkStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));

  const handlePress = () => {
    void Haptics.selectionAsync();
    onPress();
  };

  const defaultLabel = count === undefined ? label : `${label}, ${count}`;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      hitSlop={CHIP_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? defaultLabel}
      accessibilityState={{ selected, disabled }}
    >
      <Animated.View
        style={[
          styles.chip,
          styles.filterChip,
          surfaceStyle,
          disabled && styles.disabled,
        ]}
      >
        {selected ? (
          <Animated.View style={checkStyle} testID="filter-chip-check">
            <Ionicons
              name="checkmark"
              size={CHIP_ICON_SIZE}
              color={color.gold}
            />
          </Animated.View>
        ) : null}
        {icon ? (
          <Ionicons
            name={icon}
            size={CHIP_ICON_SIZE}
            color={selected ? color.gold : color.textSecondary}
          />
        ) : null}
        <Text
          style={[
            styles.label,
            selected ? styles.filterLabelSelected : styles.filterLabel,
          ]}
        >
          {label}
        </Text>
        {count !== undefined ? (
          <Text
            style={[
              styles.count,
              selected ? styles.filterLabelSelected : styles.countUnselected,
            ]}
          >
            {count}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

export type ChipTone = 'info' | 'gold' | 'neutral';

const ACTION_TONES: Record<
  ChipTone,
  { fill: string; pressedFill: string; foreground: string }
> = {
  info: {
    fill: color.infoTint,
    pressedFill: color.infoTintStrong,
    foreground: color.info,
  },
  gold: {
    fill: color.goldTint,
    pressedFill: color.goldTintStrong,
    foreground: color.gold,
  },
  neutral: {
    fill: color.surface2,
    pressedFill: color.surface3,
    foreground: color.textPrimary,
  },
};

type ActionChipProps = {
  label: string;
  icon: IoniconName;
  onPress: () => void;
  tone?: ChipTone;
  /** e.g. "How to perform, Snatch". Defaults to the visible label. */
  accessibilityLabel?: string;
  accessibilityHint?: string;
};

/** Icon + label button for inline actions such as "How to perform". */
export function ActionChip({
  label,
  icon,
  onPress,
  tone = 'info',
  accessibilityLabel,
  accessibilityHint,
}: ActionChipProps) {
  const tones = ACTION_TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      hitSlop={CHIP_HIT_SLOP}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: pressed ? tones.pressedFill : tones.fill },
      ]}
    >
      <Ionicons name={icon} size={CHIP_ICON_SIZE} color={tones.foreground} />
      <Text style={[styles.label, { color: tones.foreground }]}>{label}</Text>
    </Pressable>
  );
}

type TagProps = {
  label: string;
};

/** Read-only metadata, e.g. "Gymnastics". */
export function Tag({ label }: TagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagLabel}>{label}</Text>
    </View>
  );
}

export type BadgeTone = 'gold' | 'neutral' | 'success' | 'danger';

const BADGE_TONES: Record<BadgeTone, { fill: string; foreground: string }> = {
  gold: { fill: color.gold, foreground: color.onGold },
  neutral: { fill: color.surface3, foreground: color.textPrimary },
  success: { fill: color.successTint, foreground: color.success },
  danger: { fill: color.dangerTint, foreground: color.danger },
};

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
  /** e.g. "Pro workout" when the visible label is an abbreviation. */
  accessibilityLabel?: string;
};

/** Small filled status label, e.g. "PRO", a level, or "Completed". */
export function Badge({
  label,
  tone = 'gold',
  accessibilityLabel,
}: BadgeProps) {
  const tones = BADGE_TONES[tone];

  return (
    <View
      style={[styles.badge, { backgroundColor: tones.fill }]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <Text style={[styles.badgeLabel, { color: tones.foreground }]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.xxs,
    minHeight: CHIP_HEIGHT,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
  },
  filterChip: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    ...typography.calloutStrong,
  },
  filterLabel: {
    color: color.textSecondary,
  },
  filterLabelSelected: {
    color: color.gold,
  },
  count: {
    ...typography.numericSmall,
    marginLeft: space.xxs,
  },
  countUnselected: {
    color: color.textTertiary,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.surface3,
  },
  tagLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderRadius: radius.sm,
  },
  badgeLabel: {
    ...typography.captionStrong,
  },
});
