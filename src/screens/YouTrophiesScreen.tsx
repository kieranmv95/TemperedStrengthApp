import Award from '@/src/components/Award';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getAll } from '@/src/data/awards';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type StatusFilter = 'all' | 'achieved' | 'not_achieved';

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

  return (
    <StandardLayout
      title="Trophies"
      subtitle="Achievements and milestones"
      onBackPress={() => router.back()}
    >
      <StandardLayout.AdvancedFilters>
        <View style={styles.filters}>
          <View style={styles.filterRow}>
            <Pill
              label="All"
              isActive={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
              count={awardRows?.length}
            />
            <Pill
              label="Achieved"
              isActive={statusFilter === 'achieved'}
              onPress={() => setStatusFilter('achieved')}
              count={awardRows?.filter((row) => row.granted).length}
            />
            <Pill
              label="Not achieved"
              isActive={statusFilter === 'not_achieved'}
              onPress={() => setStatusFilter('not_achieved')}
              count={awardRows?.filter((row) => !row.granted).length}
            />
          </View>
        </View>
      </StandardLayout.AdvancedFilters>

      <StandardLayout.Body>
        <View style={styles.awardsContainer}>
          {visibleRows === null ? (
            <ActivityIndicator color={Colors.textMuted} />
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
  filters: {
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  awardsContainer: {
    gap: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  emptyStateText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
