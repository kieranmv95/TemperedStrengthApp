import { RecoveryCard } from '@/src/components/recovery/RecoveryCard';
import { restDayCarouselStyles as styles } from '@/src/components/rest/restDayCarouselStyles';
import { getRecoveryById } from '@/src/data/recovery';
import type { Recovery } from '@/src/types/recovery';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

type RestDayMobilityCarouselProps = {
  recoveryIds: string[];
  hasRecoveryAccess: boolean;
  onLockedPress: () => void;
};

export function RestDayMobilityCarousel({
  recoveryIds,
  hasRecoveryAccess,
  onLockedPress,
}: RestDayMobilityCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;

  const flows = useMemo(() => {
    const resolved: Recovery[] = [];
    for (const id of recoveryIds) {
      const flow = getRecoveryById(id);
      if (flow) {
        resolved.push(flow);
      }
    }
    return resolved;
  }, [recoveryIds]);

  if (flows.length === 0) {
    return null;
  }

  const handlePress = (recovery: Recovery) => {
    router.push({
      pathname: '/recovery/[id]',
      params: { id: recovery.id },
    });
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
          <RecoveryCard
            recovery={recovery}
            isPro={hasRecoveryAccess}
            onPress={handlePress}
            onLockedPress={onLockedPress}
            style={styles.card}
            hidePills
            hideProBadge
          />
        </View>
      ))}
    </ScrollView>
  );
}