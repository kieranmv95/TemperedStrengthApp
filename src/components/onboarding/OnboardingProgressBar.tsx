import React from 'react';
import { Text, View } from 'react-native';
import { onboardingStyles as styles } from './onboardingStyles';

type OnboardingProgressBarProps = {
  currentStep: number;
  totalSteps: number;
};

export function OnboardingProgressBar({
  currentStep,
  totalSteps,
}: OnboardingProgressBarProps) {
  const clamped = Math.max(0, Math.min(currentStep, totalSteps));
  const pct = totalSteps > 0 ? (clamped / totalSteps) * 100 : 0;
  return (
    <View style={styles.progressRow}>
      <View
        style={styles.progressTrack}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: totalSteps, now: clamped }}
      >
        <View style={[styles.progressFill, { width: `${pct}%` }]} />
      </View>
      <Text style={styles.progressText}>
        {clamped}/{totalSteps}
      </Text>
    </View>
  );
}
