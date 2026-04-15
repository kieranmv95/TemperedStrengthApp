import Award from '@/src/components/Award';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getAll } from '@/src/data/awards';
import { getAllExercises } from '@/src/data/exercises';
import type { Exercise } from '@/src/types/exercise';
import { summarizePersonalBests } from '@/src/utils/personalBests';
import { getPersonalBestsStore } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type StatusFilter = 'all' | 'achieved' | 'not_achieved';
type RecordsSection = 'awards' | 'personal_bests';

export default function RecordsScreen() {
  const [section, setSection] = useState<RecordsSection>('personal_bests');
  const [awardRows, setAwardRows] = useState<
    Awaited<ReturnType<typeof getAll>> | null
  >(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const repsExercises = useMemo(
    () => getAllExercises().filter((e) => e.logging_type === 'reps'),
    []
  );

  const muscleOptions = useMemo(() => {
    const muscles = new Set(repsExercises.map((e) => e.muscle));
    return ['All', ...Array.from(muscles).sort()];
  }, [repsExercises]);

  const [pbStore, setPbStore] = useState<Awaited<
    ReturnType<typeof getPersonalBestsStore>
  > | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState<string>('All');

  const loadAwards = useCallback(async () => {
    try {
      const rows = await getAll();
      setAwardRows(rows);
    } catch (error) {
      console.error('Error loading awards:', error);
      setAwardRows([]);
    }
  }, []);

  const loadPbStore = useCallback(async () => {
    try {
      const store = await getPersonalBestsStore();
      setPbStore(store);
    } catch (error) {
      console.error('Error loading personal bests:', error);
      setPbStore({});
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAwards();
      loadPbStore();
    }, [loadAwards, loadPbStore])
  );

  const visibleRows = useMemo(() => {
    if (awardRows === null) return null;

    return awardRows.filter((row) => {
      if (statusFilter === 'achieved' && !row.granted) return false;
      if (statusFilter === 'not_achieved' && row.granted) return false;

      return true;
    });
  }, [awardRows, statusFilter]);

  const filteredPbExercises = useMemo(() => {
    return repsExercises.filter((ex) => {
      if (muscleFilter !== 'All' && ex.muscle !== muscleFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        if (
          !ex.name.toLowerCase().includes(q) &&
          !ex.muscle.toLowerCase().includes(q) &&
          !ex.pattern.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [repsExercises, muscleFilter, searchQuery]);

  const renderPbRow = useCallback(
    ({ item }: { item: Exercise }) => {
      const summary = pbStore
        ? summarizePersonalBests(pbStore[item.id] ?? {})
        : '…';
      return (
        <TouchableOpacity
          style={styles.pbRow}
          onPress={() => router.push(`/records/${item.id}`)}
        >
          <View style={styles.pbRowText}>
            <Text style={styles.pbRowTitle}>{item.name}</Text>
            <Text style={styles.pbRowMeta}>{item.muscle}</Text>
            <Text
              style={[
                styles.pbRowSummary,
                summary === 'No PBs logged' && styles.pbRowSummaryEmpty,
              ]}
              numberOfLines={2}
            >
              {summary}
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textPlaceholder}
          />
        </TouchableOpacity>
      );
    },
    [pbStore]
  );

  return (
    <StandardLayout
      title="Records"
      subtitle="Personal bests and awards"
      disableScroll={section === 'personal_bests'}
    >
      <StandardLayout.Filters>
        <View style={styles.sectionRow}>
          <Pill
            label="Personal Bests"
            isActive={section === 'personal_bests'}
            onPress={() => setSection('personal_bests')}
          />
          <Pill
            label="Trophies"
            isActive={section === 'awards'}
            onPress={() => setSection('awards')}
          />
        </View>
        {section === 'personal_bests' && (
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color={Colors.textPlaceholder}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor={Colors.textPlaceholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name="close-circle"
                  size={18}
                  color={Colors.textPlaceholder}
                />
              </TouchableOpacity>
            )}
          </View>
        )}
      </StandardLayout.Filters>
      <StandardLayout.AdvancedFilters>
        {section === 'awards' ? (
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
        ) : (
          <View style={styles.pbFilters}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.muscleScroll}
            >
              {muscleOptions.map((m) => (
                <Pill
                  key={m}
                  label={m}
                  isActive={muscleFilter === m}
                  onPress={() => setMuscleFilter(m)}
                />
              ))}
            </ScrollView>
          </View>
        )}
      </StandardLayout.AdvancedFilters>

      <StandardLayout.Body>
        {section === 'awards' ? (
          <View style={styles.awardsContainer}>
            {visibleRows === null ? (
              <ActivityIndicator color={Colors.textMuted} />
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
        ) : pbStore === null ? (
          <ActivityIndicator color={Colors.textMuted} />
        ) : (
          <FlatList
            data={filteredPbExercises}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderPbRow}
            contentContainerStyle={styles.pbListContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyStateText}>
                No exercises match your filters.
              </Text>
            }
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  sectionRow: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
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
  pbFilters: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    paddingVertical: Spacing.xs,
  },
  muscleScroll: {
    gap: Spacing.sm,
    paddingBottom: Spacing.xs,
  },
  awardsContainer: {
    gap: Spacing.xl,
  },
  pbListContent: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  pbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  pbRowText: {
    flex: 1,
    gap: Spacing.xs,
  },
  pbRowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  pbRowMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  pbRowSummary: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  pbRowSummaryEmpty: {
    color: Colors.textPlaceholder,
    fontStyle: 'italic',
  },
  emptyStateText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: Spacing.xxl,
  },
});
