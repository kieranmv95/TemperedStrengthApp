import { ActionChip } from '@/src/components/ds';
import {
  categoryFilterDisplayLabel,
  focusTagDisplayLabel,
  type CategoryFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import { space } from '@/src/constants/tokens';
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
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

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
        <ActionChip
          label="Reset all"
          icon="refresh"
          tone="neutral"
          onPress={onResetAll}
          accessibilityLabel="Reset all filters"
        />

        {trimmedSearch.length > 0 ? (
          <RemovableFilter
            label={`Search: ${searchLabel}`}
            onRemove={onClearSearch}
          />
        ) : null}

        {activeCategoryFilter !== 'All' ? (
          <RemovableFilter
            label={categoryFilterDisplayLabel(activeCategoryFilter)}
            onRemove={onClearCategory}
          />
        ) : null}

        {selectedFocus.map((tag) => (
          <RemovableFilter
            key={`focus-${tag}`}
            label={focusTagDisplayLabel(tag)}
            onRemove={() => onRemoveFocus(tag)}
          />
        ))}

        {selectedFormat.map((tag) => (
          <RemovableFilter
            key={`format-${tag}`}
            label={tag}
            onRemove={() => onRemoveFormat(tag)}
          />
        ))}

        {selectedTimeBuckets.map((bucket) => (
          <RemovableFilter
            key={`time-${bucket}`}
            label={timeBucketLabel(bucket)}
            onRemove={() => onRemoveTimeBucket(bucket)}
          />
        ))}

        {noEquipmentOnly ? (
          <RemovableFilter label="No equipment" onRemove={onClearNoEquipment} />
        ) : null}

        {selectedEquipment.map((eq) => (
          <RemovableFilter
            key={eq}
            label={equipmentFilterLabel(eq)}
            onRemove={() => onRemoveEquipment(eq)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

type RemovableFilterProps = {
  label: string;
  onRemove: () => void;
};

function RemovableFilter({ label, onRemove }: RemovableFilterProps) {
  return (
    <ActionChip
      label={label}
      icon="close"
      tone="gold"
      onPress={onRemove}
      accessibilityLabel={`Remove ${label} filter`}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: space.sm,
    paddingBottom: space.xs,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingRight: space.md,
  },
});
