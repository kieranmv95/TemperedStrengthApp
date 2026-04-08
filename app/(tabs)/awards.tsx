import Award from '@/src/components/Award';
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
  Pressable,
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
            <FilterPill
              label="All"
              selected={statusFilter === 'all'}
              onPress={() => setStatusFilter('all')}
            />
            <FilterPill
              label="Achieved"
              selected={statusFilter === 'achieved'}
              onPress={() => setStatusFilter('achieved')}
            />
            <FilterPill
              label="Not achieved"
              selected={statusFilter === 'not_achieved'}
              onPress={() => setStatusFilter('not_achieved')}
            />
          </View>
          <View style={styles.filterRow}>
            <FilterPill
              label="All"
              selected={accessFilter === 'all'}
              onPress={() => setAccessFilter('all')}
            />
            <FilterPill
              label="Free"
              selected={accessFilter === 'free'}
              onPress={() => setAccessFilter('free')}
            />
            <FilterPill
              label="Pro"
              selected={accessFilter === 'pro'}
              onPress={() => setAccessFilter('pro')}
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

function FilterPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterPill,
        selected && styles.filterPillSelected,
        pressed && styles.filterPillPressed,
      ]}
    >
      <Text
        style={[
          styles.filterPillText,
          selected && styles.filterPillTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
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
  filterPill: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.backgroundScreen,
  },
  filterPillSelected: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  filterPillPressed: {
    opacity: 0.85,
  },
  filterPillText: {
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  filterPillTextSelected: {
    color: Colors.textOnAccent,
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
