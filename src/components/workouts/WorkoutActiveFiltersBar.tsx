import { ActionChip } from '@/src/components/ds';
import { space } from '@/src/constants/tokens';
import {
  countActiveWorkoutFilters,
  equipmentFilterLabel,
  WORKOUT_TIME_BUCKET_OPTIONS,
  type WorkoutFilters,
} from '@/src/utils/workoutFilters';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

const SEARCH_LABEL_MAX = 28;

type ActiveFilter = {
  key: string;
  label: string;
  /** Filter group, used for analytics. */
  group: string;
  remove: Partial<WorkoutFilters>;
};

type WorkoutActiveFiltersBarProps = {
  filters: WorkoutFilters;
  onResetAll: () => void;
  onRemove: (changes: Partial<WorkoutFilters>, group: string) => void;
};

function listActiveFilters(filters: WorkoutFilters): ActiveFilter[] {
  const active: ActiveFilter[] = [];
  const search = filters.searchQuery.trim();
  if (search) {
    const label =
      search.length > SEARCH_LABEL_MAX
        ? `${search.slice(0, SEARCH_LABEL_MAX)}…`
        : search;
    active.push({
      key: 'search',
      label: `Search: ${label}`,
      group: 'search',
      remove: { searchQuery: '' },
    });
  }
  if (filters.favouritesOnly) {
    active.push({
      key: 'favourites',
      label: 'Favourites',
      group: 'favourites',
      remove: { favouritesOnly: false },
    });
  }
  if (filters.hideLocked) {
    active.push({
      key: 'locked',
      label: 'Hide locked',
      group: 'locked',
      remove: { hideLocked: false },
    });
  }
  for (const value of filters.disciplines) {
    active.push({
      key: `discipline-${value}`,
      label: value,
      group: 'discipline',
      remove: { disciplines: filters.disciplines.filter((v) => v !== value) },
    });
  }
  for (const value of filters.timeBuckets) {
    active.push({
      key: `time-${value}`,
      label:
        WORKOUT_TIME_BUCKET_OPTIONS.find((b) => b.id === value)?.label ?? value,
      group: 'time',
      remove: { timeBuckets: filters.timeBuckets.filter((v) => v !== value) },
    });
  }
  if (filters.bodyweightOnly) {
    active.push({
      key: 'bodyweight',
      label: 'Bodyweight only',
      group: 'equipment',
      remove: { bodyweightOnly: false },
    });
  }
  for (const value of filters.equipment) {
    active.push({
      key: `equipment-${value}`,
      label: equipmentFilterLabel(value),
      group: 'equipment',
      remove: { equipment: filters.equipment.filter((v) => v !== value) },
    });
  }
  for (const value of filters.formats) {
    active.push({
      key: `format-${value}`,
      label: value,
      group: 'format',
      remove: { formats: filters.formats.filter((v) => v !== value) },
    });
  }
  for (const value of filters.bodyFocus) {
    active.push({
      key: `focus-${value}`,
      label: value,
      group: 'focus',
      remove: { bodyFocus: filters.bodyFocus.filter((v) => v !== value) },
    });
  }
  for (const value of filters.levels) {
    active.push({
      key: `level-${value}`,
      label: value,
      group: 'level',
      remove: { levels: filters.levels.filter((v) => v !== value) },
    });
  }
  if (filters.partnerOnly) {
    active.push({
      key: 'partner',
      label: 'Partner workouts',
      group: 'partner',
      remove: { partnerOnly: false },
    });
  }
  for (const value of filters.collections) {
    active.push({
      key: `collection-${value}`,
      label: value,
      group: 'collection',
      remove: { collections: filters.collections.filter((v) => v !== value) },
    });
  }
  return active;
}

export function WorkoutActiveFiltersBar({
  filters,
  onResetAll,
  onRemove,
}: WorkoutActiveFiltersBarProps) {
  if (countActiveWorkoutFilters(filters) === 0) {
    return null;
  }

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
        {listActiveFilters(filters).map((filter) => (
          <ActionChip
            key={filter.key}
            label={filter.label}
            icon="close"
            tone="gold"
            onPress={() => onRemove(filter.remove, filter.group)}
            accessibilityLabel={`Remove ${filter.label} filter`}
          />
        ))}
      </ScrollView>
    </View>
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
