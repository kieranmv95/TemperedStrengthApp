import { Badge, PressableCard } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { getRecoveryById } from '@/src/data/recovery';
import { useRoles } from '@/src/hooks/useRoles';
import type { Recovery } from '@/src/types/recovery';
import { premiumAccessBadgeLabel } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

const COACH_ROLE = 'coach';

type SkillMobilityFlowCardProps = {
  recovery: Recovery;
  hasAccess: boolean;
  onPress: (recovery: Recovery) => void;
  onLockedPress: () => void;
};

function SkillMobilityFlowCard({
  recovery,
  hasAccess,
  onPress,
  onLockedPress,
}: SkillMobilityFlowCardProps) {
  const isLocked = recovery.isPremium && !hasAccess;
  // All premium mobility flows unlock for coaches.
  const premiumBadge = premiumAccessBadgeLabel([COACH_ROLE]);

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(recovery);
  };

  const accessibilityLabel = [
    recovery.title,
    `${recovery.estimatedTime} minutes`,
    recovery.difficulty,
    recovery.isPremium ? 'Pro or Coach' : null,
    isLocked ? 'locked' : null,
  ]
    .filter((part): part is string => !!part)
    .join(', ');

  return (
    <PressableCard
      onPress={handlePress}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={
        isLocked ? 'Opens the You tab to unlock this mobility flow' : undefined
      }
      showChevron={false}
      fill
    >
      {recovery.isPremium ? (
        <View style={styles.badgeRow}>
          <Badge label={premiumBadge} />
        </View>
      ) : null}
      <Text style={styles.title}>{recovery.title}</Text>
      <Text style={styles.description} numberOfLines={1}>
        {recovery.description}
      </Text>
      <View style={styles.meta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={16} color={color.textSecondary} />
          <Text style={styles.metaText}>{recovery.estimatedTime} min</Text>
        </View>
        <Badge label={recovery.difficulty} tone="neutral" />
        {isLocked ? (
          <View style={styles.metaItem}>
            <Ionicons name="lock-closed" size={14} color={color.gold} />
            <Text style={styles.lockedText}>Unlock with Pro</Text>
          </View>
        ) : null}
      </View>
    </PressableCard>
  );
}

type SkillMobilityFlowsProps = {
  recoveryFlowIds: string[];
};

export function SkillMobilityFlows({
  recoveryFlowIds,
}: SkillMobilityFlowsProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;
  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const hasAccess = isPro || roles.includes(COACH_ROLE) || accessLoading;

  const flows = useMemo(() => {
    const resolved: Recovery[] = [];
    for (const id of recoveryFlowIds) {
      const flow = getRecoveryById(id);
      if (flow) {
        resolved.push(flow);
      }
    }
    return resolved;
  }, [recoveryFlowIds]);

  if (flows.length === 0) {
    return null;
  }

  const handlePress = (recovery: Recovery) => {
    router.push({
      pathname: '/recovery/[id]',
      params: { id: recovery.id },
    });
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollBleed}
      contentContainerStyle={styles.list}
    >
      {flows.map((recovery) => (
        <View key={recovery.id} style={{ width: cardWidth }}>
          <SkillMobilityFlowCard
            recovery={recovery}
            hasAccess={hasAccess}
            onPress={handlePress}
            onLockedPress={handleLockedPress}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -space.md,
  },
  list: {
    gap: space.sm,
    paddingHorizontal: space.md,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: space.xxs,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  metaText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  lockedText: {
    ...typography.captionStrong,
    color: color.gold,
  },
});
