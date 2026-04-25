import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { onboardingStyles as styles } from './onboardingStyles';

type OnboardingOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  fullWidth?: boolean;
};

export function OnboardingOptionCard({
  label,
  selected,
  onPress,
  fullWidth = true,
}: OnboardingOptionCardProps) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selected && styles.optionCardSelected,
        !fullWidth && styles.optionCardNotFullWidth,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.optionLabel,
          selected && styles.optionLabelSelected,
          !fullWidth && styles.optionLabelNotFullWidth,
        ]}
      >
        {label}
      </Text>

    </TouchableOpacity>
  );
}
