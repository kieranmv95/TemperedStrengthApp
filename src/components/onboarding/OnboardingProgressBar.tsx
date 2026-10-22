import { ProgressBar } from '@/src/components/ds';
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
  const progress = totalSteps > 0 ? clamped / totalSteps : 0;
  return (
    <View style={styles.progressRow}>
      <View style={styles.progressTrack}>
        <ProgressBar
          progress={progress}
          accessibilityLabel="Setup progress"
          accessibilityValueText={`Step ${clamped} of ${totalSteps}`}
        />
      </View>
      <Text
        style={styles.progressText}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {clamped}/{totalSteps}
      </Text>
    </View>
  );
}
