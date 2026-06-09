import { Pill } from '@/src/components/pill';
import {
  categoryFilterDisplayLabel,
  type CategoryFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { WorkoutEquipment } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SEARCH_LABEL_MAX = 28;

type WorkoutActiveFiltersBarProps = {
  searchQuery: string;
  activeCategoryFilter: CategoryFilter;
  selectedEquipment: WorkoutEquipment[];
  noEquipmentOnly: boolean;
  equipmentLabel: (eq: WorkoutEquipment) => string;
  onResetAll: () => void;
  onClearSearch: () => void;
  onClearCategory: () => void;
  onClearNoEquipment: () => void;
  onRemoveEquipment: (eq: WorkoutEquipment) => void;
};

export function WorkoutActiveFiltersBar({
  searchQuery,
  activeCategoryFilter,
  selectedEquipment,
  noEquipmentOnly,
  equipmentLabel,
  onResetAll,
  onClearSearch,
  onClearCategory,
  onClearNoEquipment,
  onRemoveEquipment,
}: WorkoutActiveFiltersBarProps) {
  const trimmedSearch = searchQuery.trim();

  const hasActiveFilters = useMemo(() => {
    return (
      trimmedSearch.length > 0 ||
      activeCategoryFilter !== 'All' ||
      selectedEquipment.length > 0 ||
      noEquipmentOnly
    );
  }, [trimmedSearch, activeCategoryFilter, selectedEquipment, noEquipmentOnly]);

  if (!hasActiveFilters) {
    return null;
  }

  const searchLabel =
    trimmedSearch.length > SEARCH_LABEL_MAX
      ? `${trimmedSearch.slice(0, SEARCH_LABEL_MAX)}…`
      : trimmedSearch;

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
            label={equipmentLabel(eq)}
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
