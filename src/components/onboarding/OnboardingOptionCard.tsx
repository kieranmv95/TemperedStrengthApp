import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { onboardingStyles as styles } from './onboardingStyles';

type OnboardingOptionCardProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function OnboardingOptionCard({
  label,
  selected,
  onPress,
}: OnboardingOptionCardProps) {
  return (
    <TouchableOpacity
      style={[styles.optionCard, selected && styles.optionCardSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      activeOpacity={0.8}
    >
      <Text
        style={[styles.optionLabel, selected && styles.optionLabelSelected]}
      >
        {label}
      </Text>
      <View style={styles.optionCheckSlot}>
        <Text style={[styles.optionCheck, { opacity: selected ? 1 : 0 }]}>
          ✓
        </Text>
      </View>
    </TouchableOpacity>
  );
}
