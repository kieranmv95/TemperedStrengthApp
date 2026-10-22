import { FilterChip } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text } from 'react-native';
import { onboardingStyles as styles } from './onboardingStyles';

type OnboardingOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  /** Full-width cards are single-choice; inline options are multi-select chips. */
  fullWidth?: boolean;
};

const OPTION_ICON_SIZE = 22;

export function OnboardingOptionCard({
  label,
  selected,
  onPress,
  fullWidth = true,
}: OnboardingOptionCardProps) {
  if (!fullWidth) {
    return <FilterChip label={label} selected={selected} onPress={onPress} />;
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.optionCard,
        pressed && styles.optionCardPressed,
        selected && styles.optionCardSelected,
      ]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
    >
      <Text style={styles.optionLabel}>{label}</Text>
      <Ionicons
        name={selected ? 'checkmark-circle' : 'ellipse-outline'}
        size={OPTION_ICON_SIZE}
        color={selected ? color.gold : color.borderStrong}
      />
    </Pressable>
  );
}
