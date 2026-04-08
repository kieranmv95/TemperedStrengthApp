import Award from '@/src/components/Award';
import { Pill } from '@/src/components/pill';
import {
  Colors,
  FontSize,
  Spacing
} from '@/src/constants/theme';
import { getAll } from '@/src/data/awards';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type StatusFilter = 'all' | 'achieved' | 'not_achieved';
type AccessFilter = 'all' | 'free' | 'pro';

export default function AwardsScreen() {
  const [awardRows, setAwardRows] = useState<
    Awaited<ReturnType<typeof getAll>> | null
  >(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [accessFilter, setAccessFilter] = useState<AccessFilter>('all');

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

      if (accessFilter === 'free' && row.award.isPro) return false;
      if (accessFilter === 'pro' && !row.award.isPro) return false;

      return true;
    });
  }, [awardRows, statusFilter, accessFilter]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Awards</Text>
        <Text style={styles.subtitle}>
          All the awards you&apos;ve earned
        </Text>
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
          <View style={styles.filterRow}>
            <Pill
              label="All"
              isActive={accessFilter === 'all'}
              onPress={() => setAccessFilter('all')}
              count={awardRows?.length}
            />
            <Pill
              label="Free"
              isActive={accessFilter === 'free'}
              onPress={() => setAccessFilter('free')}
              count={awardRows?.filter((row) => !row.award.isPro).length}
            />
            <Pill
              label="Pro"
              isActive={accessFilter === 'pro'}
              onPress={() => setAccessFilter('pro')}
              count={awardRows?.filter((row) => row.award.isPro).length}
            />
          </View>
        </View>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <View style={styles.awardsContainer}>
          {visibleRows === null ? (
            <ActivityIndicator />
          ) : visibleRows.length === 0 ? (
            <Text style={styles.emptyStateText}>
              No awards match your filters.
            </Text>
          ) : (
            visibleRows.map((item) => (
              <Award
                key={item.award.id}
                fontSize={
                  item.award.badgeTitle.length > 12 ? 16 : undefined
                }
                badgeTitle={item.award.badgeTitle}
                title={item.award.name}
                description={item.award.description}
                variant={item.award.tier}
                awardPro={item.award.isPro}
                granted={item.granted}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  content: {
    padding: Spacing.section,
  },
  header: {
    padding: Spacing.section,
    paddingBottom: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
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
    gap: Spacing.lg,
  },
  emptyStateText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
