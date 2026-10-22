import { Badge, PressableCard } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillProRequiredBannerProps = {
  onPress?: () => void;
};

export function SkillProRequiredBanner({
  onPress,
}: SkillProRequiredBannerProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push('/paywall');
  };

  return (
    <PressableCard
      variant="hero"
      onPress={handlePress}
      accessibilityLabel="Pro or Coach required, you're on the free tier. Are you a coach, PT or gym owner? DM us for free access."
      accessibilityHint="Opens upgrade options to unlock Skills and Cues"
    >
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Pro or Coach required</Text>
          <Badge label="Free tier" tone="neutral" />
        </View>
        <Text style={styles.subtitle}>
          Are you a coach, PT or gym owner? DM us for free access.
        </Text>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.xxs,
  },
  titleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
