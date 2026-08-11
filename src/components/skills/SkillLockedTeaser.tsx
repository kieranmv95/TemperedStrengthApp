import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type SkillLockedTeaserProps = {
  count: number;
  resourceLabel: string;
  onPress?: () => void;
};

/**
 * Locked-section preview: shows how many resources Pro unlocks,
 * without revealing the real content.
 */
export function SkillLockedTeaser({
  count,
  resourceLabel,
  onPress,
}: SkillLockedTeaserProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    router.push('/paywall');
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${count} ${resourceLabel} with Pro. Upgrade to unlock.`}
    >
      <View style={styles.topRow}>
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={14} color={Colors.accent} />
          <Text style={styles.lockLabel}>PRO</Text>
        </View>
        <View style={styles.countBlock}>
          <Text style={styles.count}>{count}</Text>
          <Text style={styles.resourceLabel}>{resourceLabel}</Text>
        </View>
      </View>

      <Text style={styles.headline}>
        Unlock {count} {resourceLabel} with Pro
      </Text>
      <Text style={styles.subcopy}>
        Full coaching breakdowns, cues, and progressions for this skill.
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: Spacing.xl,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    backgroundColor: Colors.accentWashFill,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.lg,
    minHeight: 28,
  },
  lockLabel: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.85,
  },
  countBlock: {
    alignItems: 'flex-end',
  },
  count: {
    color: Colors.accent,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '800',
  },
  resourceLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'lowercase',
  },
  headline: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  subcopy: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
});
