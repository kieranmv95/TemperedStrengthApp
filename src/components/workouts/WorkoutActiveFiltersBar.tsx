import { Pill } from '@/src/components/pill';
import {
  categoryFilterDisplayLabel,
  type CategoryFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type {
  WorkoutEquipment,
  WorkoutFocusTag,
  WorkoutFormatTag,
} from '@/src/types/workouts';
import {
  WORKOUT_TIME_BUCKET_OPTIONS,
  equipmentFilterLabel,
  type WorkoutTimeBucket,
} from '@/src/utils/workoutFilters';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SEARCH_LABEL_MAX = 28;

type WorkoutActiveFiltersBarProps = {
  searchQuery: string;
  activeCategoryFilter: CategoryFilter;
  selectedEquipment: WorkoutEquipment[];
  noEquipmentOnly: boolean;
  selectedFocus: WorkoutFocusTag[];
  selectedFormat: WorkoutFormatTag[];
  selectedTimeBuckets: WorkoutTimeBucket[];
  onResetAll: () => void;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearNoEquipment: () => void;
  onRemoveEquipment: (eq: WorkoutEquipment) => void;
  onRemoveFocus: (tag: WorkoutFocusTag) => void;
  onRemoveFormat: (tag: WorkoutFormatTag) => void;
  onRemoveTimeBucket: (bucket: WorkoutTimeBucket) => void;
};

export function WorkoutActiveFiltersBar({
  searchQuery,
  activeCategoryFilter,
  selectedEquipment,
  noEquipmentOnly,
  selectedFocus,
  selectedFormat,
  selectedTimeBuckets,
  onResetAll,
  onClearSearch,
  onClearCategory,
  onClearNoEquipment,
  onRemoveEquipment,
  onRemoveFocus,
  onRemoveFormat,
  onRemoveTimeBucket,
}: WorkoutActiveFiltersBarProps) {
  const trimmedSearch = searchQuery.trim();

  const hasActiveFilters = useMemo(() => {
    return (
      trimmedSearch.length > 0 ||
      activeCategoryFilter !== 'All' ||
      selectedEquipment.length > 0 ||
      noEquipmentOnly ||
      selectedFocus.length > 0 ||
      selectedFormat.length > 0 ||
      selectedTimeBuckets.length > 0
    );
  }, [
    trimmedSearch,
    activeCategoryFilter,
    selectedEquipment,
    noEquipmentOnly,
    selectedFocus,
    selectedFormat,
    selectedTimeBuckets,
  ]);

  if (!hasActiveFilters) {
    return null;
  }

  const searchLabel =
    trimmedSearch.length > SEARCH_LABEL_MAX
      ? `${trimmedSearch.slice(0, SEARCH_LABEL_MAX)}…`
      : trimmedSearch;

  const timeBucketLabel = (bucket: WorkoutTimeBucket) =>
    WORKOUT_TIME_BUCKET_OPTIONS.find((b) => b.id === bucket)?.label ?? bucket;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.resetButton}
          onPress={onResetAll}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Reset all filters"
        >
          <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
          <Text style={styles.resetButtonText}>Reset all</Text>
        </TouchableOpacity>

        {trimmedSearch.length > 0 ? (
          <Pill
            label={`Search: ${searchLabel}`}
            isActive
            onPress={onClearSearch}
            icon="search"
          />
        ) : null}

        {activeCategoryFilter !== 'All' ? (
          <Pill
            label={categoryFilterDisplayLabel(activeCategoryFilter)}
            isActive
            onPress={onClearCategory}
            icon={
              activeCategoryFilter === 'Favorites'
                ? 'heart'
                : activeCategoryFilter === 'Pro'
                  ? 'star'
                  : undefined
            }
          />
        ) : null}

        {selectedFocus.map((tag) => (
          <Pill
            key={`focus-${tag}`}
            label={tag}
            isActive
            onPress={() => onRemoveFocus(tag)}
          />
        ))}

        {selectedFormat.map((tag) => (
          <Pill
            key={`format-${tag}`}
            label={tag}
            isActive
            onPress={() => onRemoveFormat(tag)}
          />
        ))}

        {selectedTimeBuckets.map((bucket) => (
          <Pill
            key={`time-${bucket}`}
            label={timeBucketLabel(bucket)}
            isActive
            onPress={() => onRemoveTimeBucket(bucket)}
          />
        ))}

        {noEquipmentOnly ? (
          <Pill
            label="No equipment"
            isActive
            onPress={onClearNoEquipment}
          />
        ) : null}

        {selectedEquipment.map((eq) => (
          <Pill
            key={eq}
            label={equipmentFilterLabel(eq)}
            isActive
            onPress={() => onRemoveEquipment(eq)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingRight: Spacing.xxl,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  resetButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
