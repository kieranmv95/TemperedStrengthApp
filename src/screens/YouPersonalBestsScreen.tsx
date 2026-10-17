import {
  FilterChip,
  PressableCard,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { getAllExercises } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { Exercise } from '@/src/types/exercise';
import { listPersonalBestSummaryLines } from '@/src/utils/personalBests';
import { getPersonalBestsStore } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const ROW_SKELETON_HEIGHT = 96;
const ROW_SKELETON_COUNT = 4;

export function YouPersonalBestsScreen() {
  const { unit: weightUnit } = useWeightUnit();

  const repsExercises = useMemo(
    () => getAllExercises().filter((e) => e.logging_type === 'reps_and_weight'),
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
      loadPbStore();
    }, [loadPbStore])
  );

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
      const pbLines = listPersonalBestSummaryLines(
        pbStore?.[item.id] ?? {},
        weightUnit,
        item.lowerWeightIsBetter === true
      );
      const pbSummary =
        pbLines.length === 0
          ? 'No PBs logged'
          : pbLines.map((line) => line.label).join(', ');
      return (
        <PressableCard
          onPress={() => router.push(`/records/${item.id}`)}
          accessibilityLabel={`${item.name}, ${item.muscle}, ${pbSummary}`}
          accessibilityHint="Opens personal bests for this exercise"
        >
          <View style={styles.pbRowText}>
            <Text style={styles.pbRowTitle}>{item.name}</Text>
            <Text style={styles.pbRowMeta}>{item.muscle}</Text>
            {pbLines.length === 0 ? (
              <Text style={styles.pbRowEmpty}>No PBs logged</Text>
            ) : (
              <View style={styles.pbRowValues}>
                {pbLines.map((line) => (
                  <View key={`${item.id}-${line.tier}`} style={styles.pbValue}>
                    <Text style={styles.pbValueText}>{line.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </PressableCard>
      );
    },
    [pbStore, weightUnit]
  );

  return (
    <StandardLayout
      title="Personal bests"
      subtitle="Your personal records by exercise"
      disableScroll
      onBackPress={() => router.back()}
    >
      <StandardLayout.Filters>
        <View style={styles.search}>
          <Ionicons
            name="search"
            size={18}
            color={color.textSecondary}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises"
            placeholderTextColor={color.textTertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            accessibilityLabel="Search exercises"
          />
          {searchQuery.length > 0 && (
            <Pressable
              onPress={() => setSearchQuery('')}
              style={styles.clearSearch}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Ionicons
                name="close-circle"
                size={20}
                color={color.textSecondary}
              />
            </Pressable>
          )}
        </View>
      </StandardLayout.Filters>
      <StandardLayout.AdvancedFilters>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.muscleScroll}
        >
          {muscleOptions.map((m) => (
            <FilterChip
              key={m}
              label={m}
              selected={muscleFilter === m}
              onPress={() => setMuscleFilter(m)}
            />
          ))}
        </ScrollView>
      </StandardLayout.AdvancedFilters>

      <StandardLayout.Body>
        {pbStore === null ? (
          <View style={styles.skeletons}>
            {Array.from({ length: ROW_SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={ROW_SKELETON_HEIGHT}
                radius="md"
                accessibilityLabel={
                  index === 0 ? 'Loading personal bests' : undefined
                }
              />
            ))}
          </View>
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
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingLeft: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  searchInput: {
    ...typography.body,
    flex: 1,
    color: color.textPrimary,
    paddingVertical: space.xs,
  },
  clearSearch: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleScroll: {
    gap: space.xs,
    paddingVertical: space.xxs,
  },
  skeletons: {
    gap: space.sm,
    paddingTop: space.xs,
  },
  pbListContent: {
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.sm,
  },
  pbRowText: {
    gap: space.xxs,
  },
  pbRowTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  pbRowMeta: {
    ...typography.caption,
    color: color.textSecondary,
  },
  pbRowValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xxs,
  },
  pbValue: {
    paddingHorizontal: space.xs,
    paddingVertical: space.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
  },
  pbValueText: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  pbRowEmpty: {
    ...typography.caption,
    color: color.textTertiary,
    marginTop: space.xxs,
  },
  emptyStateText: {
    ...typography.callout,
    color: color.textTertiary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
});
