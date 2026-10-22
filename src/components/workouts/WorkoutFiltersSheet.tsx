import { AnimatedNumber, BottomSheet, FilterChip } from '@/src/components/ds';
import {
  DISCIPLINE_CATEGORY_FILTERS,
  categoryFilterDisplayLabel,
  focusTagDisplayLabel,
  getEquipmentFiltersInUse,
  type CategoryFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import type {
  WorkoutEquipment,
  WorkoutFocusTag,
  WorkoutFormatTag,
} from '@/src/types/workouts';
import { WORKOUT_FOCUS_TAGS, WORKOUT_FORMAT_TAGS } from '@/src/types/workouts';
import {
  countActiveWorkoutFilters,
  countWithEquipmentOption,
  countWithMultiSelectOption,
  countWorkoutsMatching,
  equipmentFilterLabel,
  WORKOUT_TIME_BUCKET_OPTIONS,
  workoutMatchesFilters,
  type WorkoutFilterCriteria,
  type WorkoutTimeBucket,
} from '@/src/utils/workoutFilters';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

export type WorkoutFiltersDraft = {
  searchQuery: string;
  activeCategoryFilter: CategoryFilter;
  selectedEquipment: WorkoutEquipment[];
  noEquipmentOnly: boolean;
  selectedFocus: WorkoutFocusTag[];
  selectedFormat: WorkoutFormatTag[];
  selectedTimeBuckets: WorkoutTimeBucket[];
};

type WorkoutFiltersSheetProps = {
  visible: boolean;
  draft: WorkoutFiltersDraft;
  favoriteIds: string[];
  onClose: () => void;
  onApply: (draft: WorkoutFiltersDraft) => void;
};

/** Wait for a pause in tapping before announcing the new match count. */
const COUNT_ANNOUNCE_DELAY_MS = 700;

function workoutsLabel(count: number): string {
  return `${count} workout${count === 1 ? '' : 's'}`;
}

type FilterSectionProps = {
  title: string;
  /** e.g. a "Clear" action or an "Any" hint. */
  accessory?: React.ReactNode;
  children: React.ReactNode;
};

function FilterSection({ title, accessory, children }: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {accessory}
      </View>
      <View style={styles.chipRow}>{children}</View>
    </View>
  );
}

export function WorkoutFiltersSheet({
  visible,
  draft,
  favoriteIds,
  onClose,
  onApply,
}: WorkoutFiltersSheetProps) {
  const [localDraft, setLocalDraft] = useState<WorkoutFiltersDraft>(draft);
  const [wasVisible, setWasVisible] = useState(visible);
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announcedCount = useRef<number | null>(null);

  // Start each opening from the applied filters.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setLocalDraft(draft);
    }
  }

  const equipmentFiltersInUse = useMemo(
    () => getEquipmentFiltersInUse(allStandaloneWorkouts),
    []
  );

  const baseCriteria = useMemo(
    (): WorkoutFilterCriteria => ({
      searchQuery: localDraft.searchQuery,
      activeCategoryFilter: localDraft.activeCategoryFilter,
      selectedEquipment: localDraft.selectedEquipment,
      noEquipmentOnly: localDraft.noEquipmentOnly,
      selectedFocus: localDraft.selectedFocus,
      selectedFormat: localDraft.selectedFormat,
      selectedTimeBuckets: localDraft.selectedTimeBuckets,
      favoriteIds,
    }),
    [localDraft, favoriteIds]
  );

  const previewCount = useMemo(
    () =>
      allStandaloneWorkouts.filter((workout) =>
        workoutMatchesFilters(workout, baseCriteria)
      ).length,
    [baseCriteria]
  );

  const hasSelections = countActiveWorkoutFilters(localDraft) > 0;

  useEffect(() => {
    if (!visible) {
      announcedCount.current = null;
      return;
    }
    if (announcedCount.current === null) {
      announcedCount.current = previewCount;
      return;
    }
    if (announceTimer.current) {
      clearTimeout(announceTimer.current);
    }
    announceTimer.current = setTimeout(() => {
      if (announcedCount.current !== previewCount) {
        announcedCount.current = previewCount;
        AccessibilityInfo.announceForAccessibility(
          `${workoutsLabel(previewCount)} match`
        );
      }
    }, COUNT_ANNOUNCE_DELAY_MS);
    return () => {
      if (announceTimer.current) {
        clearTimeout(announceTimer.current);
      }
    };
  }, [previewCount, visible]);

  const handleReset = () => {
    setLocalDraft({
      searchQuery: '',
      activeCategoryFilter: 'All',
      selectedEquipment: [],
      noEquipmentOnly: false,
      selectedFocus: [],
      selectedFormat: [],
      selectedTimeBuckets: [],
    });
  };

  const toggleFocus = (tag: WorkoutFocusTag) => {
    setLocalDraft((prev) => ({
      ...prev,
      selectedFocus: prev.selectedFocus.includes(tag)
        ? prev.selectedFocus.filter((t) => t !== tag)
        : [...prev.selectedFocus, tag],
    }));
  };

  const toggleFormat = (tag: WorkoutFormatTag) => {
    setLocalDraft((prev) => ({
      ...prev,
      selectedFormat: prev.selectedFormat.includes(tag)
        ? prev.selectedFormat.filter((t) => t !== tag)
        : [...prev.selectedFormat, tag],
    }));
  };

  const toggleTimeBucket = (bucket: WorkoutTimeBucket) => {
    setLocalDraft((prev) => ({
      ...prev,
      selectedTimeBuckets: prev.selectedTimeBuckets.includes(bucket)
        ? prev.selectedTimeBuckets.filter((b) => b !== bucket)
        : [...prev.selectedTimeBuckets, bucket],
    }));
  };

  const toggleEquipment = (eq: WorkoutEquipment) => {
    setLocalDraft((prev) => ({
      ...prev,
      noEquipmentOnly: false,
      selectedEquipment: prev.selectedEquipment.includes(eq)
        ? prev.selectedEquipment.filter((item) => item !== eq)
        : [...prev.selectedEquipment, eq],
    }));
  };

  const selectDiscipline = (
    filter: (typeof DISCIPLINE_CATEGORY_FILTERS)[number]
  ) => {
    setLocalDraft((prev) => ({
      ...prev,
      activeCategoryFilter:
        prev.activeCategoryFilter === filter ? 'All' : filter,
    }));
  };

  const showFilterChip = (count: number, isActive: boolean) =>
    isActive || count > 0;

  const allEquipmentActive =
    localDraft.selectedEquipment.length === 0 && !localDraft.noEquipmentOnly;
  const allEquipmentCount = countWorkoutsMatching(baseCriteria, {
    selectedEquipment: [],
    noEquipmentOnly: false,
  });
  const noEquipmentCount = countWorkoutsMatching(baseCriteria, {
    selectedEquipment: [],
    noEquipmentOnly: true,
  });

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Filters"
      footer={
        <View style={styles.footer}>
          <Pressable
            style={({ pressed }) => [
              styles.footerButton,
              styles.resetButton,
              !hasSelections && styles.resetButtonDisabled,
              pressed && hasSelections && styles.resetButtonPressed,
            ]}
            onPress={handleReset}
            disabled={!hasSelections}
            accessibilityRole="button"
            accessibilityLabel="Reset filters"
            accessibilityState={{ disabled: !hasSelections }}
          >
            <Text
              style={[
                styles.resetText,
                !hasSelections && styles.resetTextDisabled,
              ]}
            >
              Reset
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.footerButton,
              styles.showButton,
              pressed && styles.showButtonPressed,
            ]}
            onPress={() => {
              onApply(localDraft);
              onClose();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Show ${workoutsLabel(previewCount)}`}
          >
            <Text style={styles.showText}>Show </Text>
            <AnimatedNumber value={previewCount} style={styles.showText} />
          </Pressable>
        </View>
      }
    >
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={color.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search workouts"
          placeholderTextColor={color.textTertiary}
          value={localDraft.searchQuery}
          onChangeText={(text) =>
            setLocalDraft((prev) => ({ ...prev, searchQuery: text }))
          }
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search workouts"
        />
        {localDraft.searchQuery.length > 0 ? (
          <Pressable
            onPress={() =>
              setLocalDraft((prev) => ({ ...prev, searchQuery: '' }))
            }
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
        ) : null}
      </View>

      <FilterSection
        title="Discipline"
        accessory={
          localDraft.activeCategoryFilter !== 'All' ? (
            <Pressable
              onPress={() =>
                setLocalDraft((prev) => ({
                  ...prev,
                  activeCategoryFilter: 'All',
                }))
              }
              style={styles.sectionAction}
              accessibilityRole="button"
              accessibilityLabel="Clear discipline"
            >
              <Text style={styles.sectionActionText}>Clear</Text>
            </Pressable>
          ) : (
            <Text style={styles.sectionHint}>Any</Text>
          )
        }
      >
        {DISCIPLINE_CATEGORY_FILTERS.map((filter) => {
          const isActive = localDraft.activeCategoryFilter === filter;
          const count = countWorkoutsMatching(baseCriteria, {
            activeCategoryFilter: filter,
          });
          if (!showFilterChip(count, isActive)) {
            return null;
          }
          const label = categoryFilterDisplayLabel(filter);
          return (
            <FilterChip
              key={filter}
              label={label}
              selected={isActive}
              onPress={() => selectDiscipline(filter)}
              icon={
                filter === 'Favorites'
                  ? 'heart'
                  : filter === 'Pro'
                    ? 'star'
                    : undefined
              }
              count={count}
              accessibilityLabel={`${label}, ${workoutsLabel(count)}`}
            />
          );
        })}
      </FilterSection>

      <FilterSection title="Focus">
        {WORKOUT_FOCUS_TAGS.map((tag) => {
          const isActive = localDraft.selectedFocus.includes(tag);
          const count = countWithMultiSelectOption(
            baseCriteria,
            'selectedFocus',
            tag
          );
          if (!showFilterChip(count, isActive)) {
            return null;
          }
          const label = focusTagDisplayLabel(tag);
          return (
            <FilterChip
              key={tag}
              label={label}
              selected={isActive}
              onPress={() => toggleFocus(tag)}
              count={count}
              accessibilityLabel={`${label}, ${workoutsLabel(count)}`}
            />
          );
        })}
      </FilterSection>

      <FilterSection title="Format">
        {WORKOUT_FORMAT_TAGS.map((tag) => {
          const isActive = localDraft.selectedFormat.includes(tag);
          const count = countWithMultiSelectOption(
            baseCriteria,
            'selectedFormat',
            tag
          );
          if (!showFilterChip(count, isActive)) {
            return null;
          }
          return (
            <FilterChip
              key={tag}
              label={tag}
              selected={isActive}
              onPress={() => toggleFormat(tag)}
              count={count}
              accessibilityLabel={`${tag}, ${workoutsLabel(count)}`}
            />
          );
        })}
      </FilterSection>

      <FilterSection title="Duration">
        {WORKOUT_TIME_BUCKET_OPTIONS.map((bucket) => {
          const isActive = localDraft.selectedTimeBuckets.includes(bucket.id);
          const count = countWithMultiSelectOption(
            baseCriteria,
            'selectedTimeBuckets',
            bucket.id
          );
          if (!showFilterChip(count, isActive)) {
            return null;
          }
          return (
            <FilterChip
              key={bucket.id}
              label={bucket.label}
              selected={isActive}
              onPress={() => toggleTimeBucket(bucket.id)}
              count={count}
              accessibilityLabel={`${bucket.label}, ${workoutsLabel(count)}`}
            />
          );
        })}
      </FilterSection>

      <FilterSection title="Equipment">
        {showFilterChip(allEquipmentCount, allEquipmentActive) ? (
          <FilterChip
            label="Any"
            selected={allEquipmentActive}
            onPress={() =>
              setLocalDraft((prev) => ({
                ...prev,
                selectedEquipment: [],
                noEquipmentOnly: false,
              }))
            }
            count={allEquipmentCount}
            accessibilityLabel={`Any equipment, ${workoutsLabel(allEquipmentCount)}`}
          />
        ) : null}
        {showFilterChip(noEquipmentCount, localDraft.noEquipmentOnly) ? (
          <FilterChip
            label="No equipment"
            selected={localDraft.noEquipmentOnly}
            onPress={() =>
              setLocalDraft((prev) => ({
                ...prev,
                noEquipmentOnly: !prev.noEquipmentOnly,
                selectedEquipment: [],
              }))
            }
            count={noEquipmentCount}
            accessibilityLabel={`No equipment, ${workoutsLabel(noEquipmentCount)}`}
          />
        ) : null}
        {equipmentFiltersInUse.map((eq) => {
          const isActive = localDraft.selectedEquipment.includes(eq);
          const count = countWithEquipmentOption(
            baseCriteria,
            eq,
            localDraft.selectedEquipment
          );
          if (!showFilterChip(count, isActive)) {
            return null;
          }
          const label = equipmentFilterLabel(eq);
          return (
            <FilterChip
              key={eq}
              label={label}
              selected={isActive}
              onPress={() => toggleEquipment(eq)}
              count={count}
              accessibilityLabel={`${label}, ${workoutsLabel(count)}`}
            />
          );
        })}
      </FilterSection>
    </BottomSheet>
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
  section: {
    gap: space.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TARGET_SIZE,
  },
  sectionTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  sectionAction: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.xs,
  },
  sectionActionText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  sectionHint: {
    ...typography.callout,
    color: color.textTertiary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  footer: {
    flexDirection: 'row',
    gap: space.sm,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  resetButtonPressed: {
    backgroundColor: color.surface3,
  },
  resetButtonDisabled: {
    borderColor: color.surface3,
  },
  resetText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  resetTextDisabled: {
    color: color.textDisabled,
  },
  showButton: {
    backgroundColor: color.gold,
  },
  showButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  showText: {
    ...typography.calloutStrong,
    fontVariant: ['tabular-nums'],
    color: color.onGold,
  },
});
