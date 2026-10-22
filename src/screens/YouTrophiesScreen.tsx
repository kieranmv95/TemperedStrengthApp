import Award from '@/src/components/Award';
import { FilterChip, Skeleton, StandardLayout } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import { getAll } from '@/src/data/awards';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type StatusFilter = 'all' | 'achieved' | 'not_achieved';

const AWARD_SKELETON_HEIGHT = 116;
const AWARD_SKELETON_COUNT = 3;

function trophiesLabel(label: string, count: number | undefined): string {
  if (count === undefined) {
    return label;
  }
  return `${label}, ${count} ${count === 1 ? 'trophy' : 'trophies'}`;
}

export function YouTrophiesScreen() {
  const { isPro } = useSubscription();
  const [awardRows, setAwardRows] = useState<Awaited<
    ReturnType<typeof getAll>
  > | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const loadAwards = useCallback(async () => {
    try {
      const rows = await getAll();
      setAwardRows(rows);
    } catch (error) {
      console.error('Error loading awards:', error);
      setAwardRows([]);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAwards();
    }, [loadAwards])
  );

  const visibleRows = useMemo(() => {
    if (awardRows === null) return null;

    return awardRows.filter((row) => {
      if (statusFilter === 'achieved' && !row.granted) return false;
      if (statusFilter === 'not_achieved' && row.granted) return false;

      return true;
    });
  }, [awardRows, statusFilter]);

  const allCount = awardRows?.length;
  const achievedCount = awardRows?.filter((row) => row.granted).length;
  const notAchievedCount = awardRows?.filter((row) => !row.granted).length;

  return (
    <StandardLayout
      title="Trophies"
      subtitle="Achievements and milestones"
      onBackPress={() => router.back()}
    >
      <StandardLayout.AdvancedFilters>
        <View style={styles.filterRow}>
          <FilterChip
            label="All"
            selected={statusFilter === 'all'}
            onPress={() => setStatusFilter('all')}
            count={allCount}
            accessibilityLabel={trophiesLabel('All', allCount)}
          />
          <FilterChip
            label="Achieved"
            selected={statusFilter === 'achieved'}
            onPress={() => setStatusFilter('achieved')}
            count={achievedCount}
            accessibilityLabel={trophiesLabel('Achieved', achievedCount)}
          />
          <FilterChip
            label="Not achieved"
            selected={statusFilter === 'not_achieved'}
            onPress={() => setStatusFilter('not_achieved')}
            count={notAchievedCount}
            accessibilityLabel={trophiesLabel('Not achieved', notAchievedCount)}
          />
        </View>
      </StandardLayout.AdvancedFilters>

      <StandardLayout.Body>
        <View style={styles.awardsContainer}>
          {visibleRows === null ? (
            Array.from({ length: AWARD_SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={AWARD_SKELETON_HEIGHT}
                radius="md"
                accessibilityLabel={
                  index === 0 ? 'Loading trophies' : undefined
                }
              />
            ))
          ) : visibleRows.length === 0 ? (
            <Text style={styles.emptyStateText}>
              No trophies match your filters.
            </Text>
          ) : (
            visibleRows.map((item) => (
              <Award
                key={item.award.id}
                fontSize={item.award.badgeTitle.length > 12 ? 16 : undefined}
                badgeTitle={item.award.badgeTitle}
                title={item.award.name}
                description={item.award.description}
                variant={item.award.tier}
                awardPro={item.award.isPro}
                isUserPro={isPro}
                granted={item.granted}
              />
            ))
          )}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  awardsContainer: {
    gap: space.sm,
    paddingBottom: space.md,
  },
  emptyStateText: {
    ...typography.callout,
    color: color.textTertiary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
});
