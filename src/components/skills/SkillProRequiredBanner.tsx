import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <TouchableOpacity
      style={styles.banner}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Pro or Coach required. Upgrade to unlock Skills and Cues"
    >
      <View style={styles.textBlock}>
        <Text style={styles.title}>Pro or Coach Required</Text>
        <Text style={styles.subtitle}>
          Are you a Coach, PT or Gym owner? DM us for free access
        </Text>
      </View>
      <View style={styles.badge} pointerEvents="none">
        <Text style={styles.badgeLabel}>FREE TIER</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accent,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xs,
  },
  title: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.accent,
    fontSize: FontSize.md,
    lineHeight: 18,
    fontWeight: '500',
  },
  badge: {
    borderWidth: 1,
    borderColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLabel: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.85,
  },
});
