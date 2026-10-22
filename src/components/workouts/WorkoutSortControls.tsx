import { ActionChip, AnimatedNumber, FilterChip } from '@/src/components/ds';
import {
  WORKOUT_SORT_BY_OPTIONS,
  WORKOUT_SORT_DIRECTION_OPTIONS,
  type WorkoutSortBy,
  type WorkoutSortDirection,
} from '@/src/components/workouts/workoutsScreenConstants';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import type { SingleWorkout } from '@/src/types/workouts';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const BADGE_MIN_SIZE = 20;
const BADGE_POP_PEAK = 1.2;

type WorkoutSortBarButtonProps = {
  expanded: boolean;
  onPress: () => void;
};

export function WorkoutSortBarButton({
  expanded,
  onPress,
}: WorkoutSortBarButtonProps) {
  return (
    <ActionChip
      label="Sort by"
      icon="swap-vertical"
      tone="neutral"
      onPress={onPress}
      accessibilityLabel="Sort workouts"
      accessibilityState={{ expanded }}
    />
  );
}

function FilterCountBadge({ count }: { count: number }) {
  const motionHelpers = useMotion();
  const scale = useSharedValue(1);
  const previousCount = useRef(count);

  useEffect(() => {
    if (count !== previousCount.current) {
      scale.set(motionHelpers.bounce(BADGE_POP_PEAK));
    }
    previousCount.current = count;
  }, [count, scale, motionHelpers]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  return (
    <Animated.View style={[styles.badge, popStyle]}>
      <AnimatedNumber value={count} style={styles.badgeText} />
    </Animated.View>
  );
}

type WorkoutFiltersBarButtonProps = {
  activeCount: number;
  onPress: () => void;
};

export function WorkoutFiltersBarButton({
  activeCount,
  onPress,
}: WorkoutFiltersBarButtonProps) {
  return (
    <ActionChip
      label="Filters"
      icon="options-outline"
      tone={activeCount > 0 ? 'gold' : 'neutral'}
      onPress={onPress}
      accessibilityLabel={
        activeCount > 0
          ? `Filter workouts, ${activeCount} active`
          : 'Filter workouts'
      }
      trailing={
        activeCount > 0 ? <FilterCountBadge count={activeCount} /> : null
      }
    />
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
        <Text style={styles.sortLabel} accessibilityRole="header">
          Sort by
        </Text>
        <View style={styles.sortChips}>
          {WORKOUT_SORT_BY_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={sortBy === option.value}
              onPress={() => onChangeSortBy(option.value)}
              accessibilityLabel={`Sort by ${option.label}`}
            />
          ))}
        </View>
      </View>
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel} accessibilityRole="header">
          Order
        </Text>
        <View style={styles.sortChips}>
          {WORKOUT_SORT_DIRECTION_OPTIONS.map((option) => (
            <FilterChip
              key={option.value}
              label={option.label}
              selected={sortDirection === option.value}
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
  badge: {
    minWidth: BADGE_MIN_SIZE,
    height: BADGE_MIN_SIZE,
    paddingHorizontal: space.xxs,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badgeText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.onGold,
  },
  sortPanel: {
    paddingTop: space.sm,
    gap: space.sm,
  },
  sortRow: {
    gap: space.xs,
  },
  sortLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  sortChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
