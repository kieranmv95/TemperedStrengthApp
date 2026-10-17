import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type PagerButtonProps = {
  icon: 'chevron-back' | 'chevron-forward';
  label: string;
  disabled: boolean;
  onPress: () => void;
};

function PagerButton({ icon, label, disabled, onPress }: PagerButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && styles.buttonPressed,
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={disabled ? color.textDisabled : color.textPrimary}
      />
    </Pressable>
  );
}

type SkillPagerProps = {
  /** e.g. "Tip 1 of 3". */
  positionLabel: string;
  previousLabel: string;
  nextLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;
};

/** Previous / next buttons either side of the current position. */
export function SkillPager({
  positionLabel,
  previousLabel,
  nextLabel,
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
}: SkillPagerProps) {
  return (
    <View style={styles.row}>
      <PagerButton
        icon="chevron-back"
        label={previousLabel}
        disabled={!canGoPrevious}
        onPress={onPrevious}
      />
      <Text style={styles.position}>{positionLabel}</Text>
      <PagerButton
        icon="chevron-forward"
        label={nextLabel}
        disabled={!canGoNext}
        onPress={onNext}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  position: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
    flexShrink: 1,
    textAlign: 'center',
  },
  button: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    borderColor: color.borderSubtle,
  },
  buttonPressed: {
    backgroundColor: color.surface3,
  },
});
