import { Pill } from '@/src/components/pill';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import {
  WORKOUT_SORT_BY_OPTIONS,
  WORKOUT_SORT_DIRECTION_OPTIONS,
  type WorkoutSortBy,
  type WorkoutSortDirection,
} from '@/src/components/workouts/workoutsScreenConstants';
import type { SingleWorkout } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type WorkoutSortBarButtonProps = {
  expanded: boolean;
  onPress: () => void;
};

export function WorkoutSortBarButton({
  expanded,
  onPress,
}: WorkoutSortBarButtonProps) {
  return (
    <TouchableOpacity
      style={styles.filterBarButton}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Sort workouts"
      accessibilityState={{ expanded }}
    >
      <Text style={styles.filterBarButtonText}>Sort by</Text>
      <Ionicons name="swap-vertical" size={16} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

type WorkoutSortPanelProps = {
  sortBy: WorkoutSortBy;
  sortDirection: WorkoutSortDirection;
  onChangeSortBy: (value: WorkoutSortBy) => void;
  onChangeSortDirection: (value: WorkoutSortDirection) => void;
};

export function WorkoutSortPanel({
  sortBy,
  sortDirection,
  onChangeSortBy,
  onChangeSortDirection,
}: WorkoutSortPanelProps) {
  return (
    <View style={styles.sortPanel}>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <View style={styles.sortPills}>
          {WORKOUT_SORT_BY_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              isActive={sortBy === option.value}
              onPress={() => onChangeSortBy(option.value)}
            />
          ))}
        </View>
      </View>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Order</Text>
        <View style={styles.sortPills}>
          {WORKOUT_SORT_DIRECTION_OPTIONS.map((option) => (
            <Pill
              key={option.value}
              label={option.label}
              isActive={sortDirection === option.value}
              onPress={() => onChangeSortDirection(option.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

export function compareWorkouts(
  a: SingleWorkout,
  b: SingleWorkout,
  sortBy: WorkoutSortBy,
  sortDirection: WorkoutSortDirection
): number {
  let cmp = 0;
  if (sortBy === 'name') {
    cmp = a.title.localeCompare(b.title, undefined, { sensitivity: 'base' });
  } else {
    cmp = a.estimatedTime - b.estimatedTime;
  }
  return sortDirection === 'asc' ? cmp : -cmp;
}

const styles = StyleSheet.create({
  filterBarButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  filterBarButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  sortPanel: {
    paddingTop: Spacing.md,
    gap: Spacing.lg,
  },
  sortRow: {
    gap: Spacing.md,
  },
  sortLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sortPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
});
