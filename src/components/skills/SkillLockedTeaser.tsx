import { Badge, PressableCard } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type SkillLockedTeaserProps = {
  count: number;
  resourceLabel: string;
  onPress?: () => void;
};

/**
 * Locked-section preview: shows how many resources Pro or Coach unlocks,
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
    <PressableCard
      onPress={handlePress}
      accessibilityLabel={`${count} ${resourceLabel} with Pro or Coach. Upgrade to unlock.`}
    >
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.lockRow}>
            <Ionicons name="lock-closed" size={14} color={color.gold} />
            <Badge label="PRO / COACH" accessibilityLabel="Pro or Coach" />
          </View>
          <View style={styles.countBlock}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.resourceLabel}>{resourceLabel}</Text>
          </View>
        </View>

        <Text style={styles.headline}>
          Unlock {count} {resourceLabel} with Pro or Coach
        </Text>
        <Text style={styles.subcopy}>
          Full coaching breakdowns, cues and progressions for this skill.
        </Text>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  lockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  countBlock: {
    alignItems: 'flex-end',
  },
  count: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  resourceLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  headline: {
    ...typography.headline,
    color: color.textPrimary,
  },
  subcopy: {
    ...typography.callout,
    color: color.textSecondary,
  },
});
