import { Pill } from '@/src/components/pill';
import { workoutFiltersSheetStyles as styles } from '@/src/components/workouts/workoutFiltersSheetStyles';
import {
  DISCIPLINE_CATEGORY_FILTERS,
  categoryFilterDisplayLabel,
  getEquipmentFiltersInUse,
  type CategoryFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import { Colors } from '@/src/constants/theme';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import type {
  WorkoutEquipment,
  WorkoutFocusTag,
  WorkoutFormatTag,
} from '@/src/types/workouts';
import {
  WORKOUT_FOCUS_TAGS,
  WORKOUT_FORMAT_TAGS,
} from '@/src/types/workouts';
import {
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
import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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

export function WorkoutFiltersSheet({
  visible,
  draft,
  favoriteIds,
  onClose,
  onApply,
}: WorkoutFiltersSheetProps) {
  const [localDraft, setLocalDraft] = useState<WorkoutFiltersDraft>(draft);

  useEffect(() => {
    if (visible) {
      setLocalDraft(draft);
    }
  }, [visible, draft]);

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

  const selectDiscipline = (filter: (typeof DISCIPLINE_CATEGORY_FILTERS)[number]) => {
    setLocalDraft((prev) => ({
      ...prev,
      activeCategoryFilter:
        prev.activeCategoryFilter === filter ? 'All' : filter,
    }));
  };

  const showFilterPill = (count: number, isActive: boolean) =>
    isActive || count > 0;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityLabel="Close filters"
          >
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color={Colors.textPlaceholder}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts..."
            placeholderTextColor={Colors.textPlaceholder}
            value={localDraft.searchQuery}
            onChangeText={(text) =>
              setLocalDraft((prev) => ({ ...prev, searchQuery: text }))
            }
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {localDraft.searchQuery.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                setLocalDraft((prev) => ({ ...prev, searchQuery: '' }))
              }
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="close-circle"
                size={18}
                color={Colors.textPlaceholder}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Discipline</Text>
              {localDraft.activeCategoryFilter !== 'All' ? (
                <TouchableOpacity
                  onPress={() =>
                    setLocalDraft((prev) => ({
                      ...prev,
                      activeCategoryFilter: 'All',
                    }))
                  }
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.sectionAction}>Clear</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.sectionHint}>Any</Text>
              )}
            </View>
            <View style={styles.pillRow}>
              {DISCIPLINE_CATEGORY_FILTERS.map((filter) => {
                const isActive = localDraft.activeCategoryFilter === filter;
                const count = countWorkoutsMatching(baseCriteria, {
                  activeCategoryFilter: filter,
                });
                if (!showFilterPill(count, isActive)) {
                  return null;
                }
                return (
                  <View key={filter} style={styles.pillWrap}>
                    <Pill
                      label={categoryFilterDisplayLabel(filter)}
                      isActive={isActive}
                      onPress={() => selectDiscipline(filter)}
                      icon={
                        filter === 'Favorites'
                          ? 'heart'
                          : filter === 'Pro'
                            ? 'star'
                            : undefined
                      }
                      count={count}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Focus</Text>
            </View>
            <View style={styles.pillRow}>
              {WORKOUT_FOCUS_TAGS.map((tag) => {
                const isActive = localDraft.selectedFocus.includes(tag);
                const count = countWithMultiSelectOption(
                  baseCriteria,
                  'selectedFocus',
                  tag
                );
                if (!showFilterPill(count, isActive)) {
                  return null;
                }
                return (
                  <View key={tag} style={styles.pillWrap}>
                    <Pill
                      label={tag}
                      isActive={isActive}
                      onPress={() => toggleFocus(tag)}
                      count={count}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Format</Text>
            </View>
            <View style={styles.pillRow}>
              {WORKOUT_FORMAT_TAGS.map((tag) => {
                const isActive = localDraft.selectedFormat.includes(tag);
                const count = countWithMultiSelectOption(
                  baseCriteria,
                  'selectedFormat',
                  tag
                );
                if (!showFilterPill(count, isActive)) {
                  return null;
                }
                return (
                  <View key={tag} style={styles.pillWrap}>
                    <Pill
                      label={tag}
                      isActive={isActive}
                      onPress={() => toggleFormat(tag)}
                      count={count}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Duration</Text>
            </View>
            <View style={styles.pillRow}>
              {WORKOUT_TIME_BUCKET_OPTIONS.map((bucket) => {
                const isActive = localDraft.selectedTimeBuckets.includes(
                  bucket.id
                );
                const count = countWithMultiSelectOption(
                  baseCriteria,
                  'selectedTimeBuckets',
                  bucket.id
                );
                if (!showFilterPill(count, isActive)) {
                  return null;
                }
                return (
                  <View key={bucket.id} style={styles.pillWrap}>
                    <Pill
                      label={bucket.label}
                      isActive={isActive}
                      onPress={() => toggleTimeBucket(bucket.id)}
                      count={count}
                    />
                  </View>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionLabel}>Equipment</Text>
            </View>
            <View style={styles.pillRow}>
              {(() => {
                const allEquipmentActive =
                  localDraft.selectedEquipment.length === 0 &&
                  !localDraft.noEquipmentOnly;
                const allEquipmentCount = countWorkoutsMatching(baseCriteria, {
                  selectedEquipment: [],
                  noEquipmentOnly: false,
                });
                if (!showFilterPill(allEquipmentCount, allEquipmentActive)) {
                  return null;
                }
                return (
                  <View style={styles.pillWrap}>
                    <Pill
                      label="Any"
                      isActive={allEquipmentActive}
                      onPress={() =>
                        setLocalDraft((prev) => ({
                          ...prev,
                          selectedEquipment: [],
                          noEquipmentOnly: false,
                        }))
                      }
                      count={allEquipmentCount}
                    />
                  </View>
                );
              })()}
              {(() => {
                const noEquipmentActive = localDraft.noEquipmentOnly;
                const noEquipmentCount = countWorkoutsMatching(baseCriteria, {
                  selectedEquipment: [],
                  noEquipmentOnly: true,
                });
                if (!showFilterPill(noEquipmentCount, noEquipmentActive)) {
                  return null;
                }
                return (
                  <View style={styles.pillWrap}>
                    <Pill
                      label="No equipment"
                      isActive={noEquipmentActive}
                      onPress={() =>
                        setLocalDraft((prev) => ({
                          ...prev,
                          noEquipmentOnly: !prev.noEquipmentOnly,
                          selectedEquipment: [],
                        }))
                      }
                      count={noEquipmentCount}
                    />
                  </View>
                );
              })()}
              {equipmentFiltersInUse.map((eq) => {
                const isActive = localDraft.selectedEquipment.includes(eq);
                const count = countWithEquipmentOption(
                  baseCriteria,
                  eq,
                  localDraft.selectedEquipment
                );
                if (!showFilterPill(count, isActive)) {
                  return null;
                }
                return (
                  <View key={eq} style={styles.pillWrap}>
                    <Pill
                      label={equipmentFilterLabel(eq)}
                      isActive={isActive}
                      onPress={() => toggleEquipment(eq)}
                      count={count}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <SafeAreaView edges={['bottom']} style={styles.footer}>
          <Text style={styles.resultCount}>
            {previewCount} workout{previewCount === 1 ? '' : 's'} match
          </Text>
          <View style={styles.footerButtons}>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={handleReset}
              activeOpacity={0.8}
            >
              <Text style={styles.footerButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.footerButton, styles.footerButtonPrimary]}
              onPress={() => {
                onApply(localDraft);
                onClose();
              }}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.footerButtonText,
                  styles.footerButtonTextPrimary,
                ]}
              >
                Show {previewCount}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </Modal>
  );
}
