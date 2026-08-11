import { RecoveryCard } from '@/src/components/recovery/RecoveryCard';
import { Spacing } from '@/src/constants/theme';
import { getRecoveryById } from '@/src/data/recovery';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { Recovery } from '@/src/types/recovery';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

type SkillMobilityFlowsProps = {
  recoveryFlowIds: string[];
};

export function SkillMobilityFlows({
  recoveryFlowIds,
}: SkillMobilityFlowsProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;
  const { isPro, isLoading: subscriptionLoading } = useSubscription();

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
      contentContainerStyle={styles.list}
    >
      {flows.map((recovery) => (
        <View key={recovery.id} style={{ width: cardWidth }}>
          <RecoveryCard
            recovery={recovery}
            isPro={isPro || subscriptionLoading}
            onPress={handlePress}
            onLockedPress={handleLockedPress}
            style={styles.card}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.md,
    paddingRight: Spacing.xxl,
  },
  card: {
    marginBottom: 0,
  },
});
