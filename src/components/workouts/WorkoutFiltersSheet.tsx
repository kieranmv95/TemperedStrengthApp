import {
  ActionChip,
  AnimatedNumber,
  BottomSheet,
  Collapsible,
  FilterChip,
} from '@/src/components/ds';
import {
  COMMON_EQUIPMENT,
  MORE_EQUIPMENT,
  toggleValue,
} from '@/src/components/workouts/workoutsScreenConstants';
import { DISCIPLINE_ICONS } from '@/src/data/disciplines';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  WORKOUT_BODY_FOCUSES,
  WORKOUT_COLLECTIONS,
  WORKOUT_DISCIPLINES,
  WORKOUT_FORMATS,
  WORKOUT_LEVELS,
  type WorkoutEquipment,
} from '@/src/types/workouts';
import {
  countActiveWorkoutFilters,
  countWithEquipmentOption,
  countWithGroupOption,
  countWorkoutsMatching,
  EMPTY_WORKOUT_FILTERS,
  equipmentFilterLabel,
  WORKOUT_TIME_BUCKET_OPTIONS,
  type WorkoutFilterContext,
  type WorkoutFilterGroup,
  type WorkoutFilters,
} from '@/src/utils/workoutFilters';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type WorkoutFiltersSheetProps = {
  visible: boolean;
  draft: WorkoutFilters;
  context: WorkoutFilterContext;
  onClose: () => void;
  onApply: (draft: WorkoutFilters) => void;
};

/** Wait for a pause in tapping before announcing the new match count. */
const COUNT_ANNOUNCE_DELAY_MS = 700;

function workoutsLabel(count: number): string {
  return `${count} workout${count === 1 ? '' : 's'}`;
}

/** Hide options with no results unless they are already selected. */
function showFilterChip(count: number, isActive: boolean): boolean {
  return isActive || count > 0;
}

type FilterSectionProps = {
  title: string;
  description?: string;
  /** e.g. a "Clear" action. */
  accessory?: React.ReactNode;
  /** One row that scrolls sideways, edge to edge, instead of wrapping. */
  scrollable?: boolean;
  children: React.ReactNode;
};

function FilterSection({
  title,
  description,
  accessory,
  scrollable = false,
  children,
}: FilterSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle} accessibilityRole="header">
          {title}
        </Text>
        {accessory}
      </View>
      {description ? (
        <Text style={styles.sectionDescription}>{description}</Text>
      ) : null}
      {scrollable ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.scrollRow}
          contentContainerStyle={styles.scrollRowContent}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={styles.chipRow}>{children}</View>
      )}
    </View>
  );
}

type ClearActionProps = {
  label: string;
  onPress: () => void;
};

function ClearAction({ label, onPress }: ClearActionProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.sectionAction}
      accessibilityRole="button"
      accessibilityLabel={`Clear ${label}`}
    >
      <Text style={styles.sectionActionText}>Clear</Text>
    </Pressable>
  );
}

type GroupChipsProps<G extends WorkoutFilterGroup> = {
  group: G;
  options: readonly { value: WorkoutFilters[G][number]; label: string }[];
  filters: WorkoutFilters;
  context: WorkoutFilterContext;
  onToggle: (value: WorkoutFilters[G][number]) => void;
  iconFor?: (value: WorkoutFilters[G][number]) => string;
  /** For ordered scales such as time: keep every option in place, disabled when empty. */
  keepEmpty?: boolean;
};

function GroupChips<G extends WorkoutFilterGroup>({
  group,
  options,
  filters,
  context,
  onToggle,
  iconFor,
  keepEmpty = false,
}: GroupChipsProps<G>) {
  const selected = filters[group] as readonly WorkoutFilters[G][number][];
  return (
    <>
      {options.map(({ value, label }) => {
        const isActive = selected.includes(value);
        const count = countWithGroupOption(filters, context, group, value);
        const isEmpty = !showFilterChip(count, isActive);
        if (isEmpty && !keepEmpty) return null;
        return (
          <FilterChip
            key={String(value)}
            label={label}
            selected={isActive}
            disabled={isEmpty}
            onPress={() => onToggle(value)}
            icon={
              iconFor
                ? (iconFor(value) as keyof typeof Ionicons.glyphMap)
                : undefined
            }
            count={count}
            accessibilityLabel={`${label}, ${workoutsLabel(count)}`}
          />
        );
      })}
    </>
  );
}

function asOptions<T extends string>(values: readonly T[]) {
  return values.map((value) => ({ value, label: value }));
}

const TIME_OPTIONS = WORKOUT_TIME_BUCKET_OPTIONS.map((b) => ({
  value: b.id,
  label: b.label,
}));

export function WorkoutFiltersSheet({
  visible,
  draft,
  context,
  onClose,
  onApply,
}: WorkoutFiltersSheetProps) {
  const [localDraft, setLocalDraft] = useState<WorkoutFilters>(draft);
  const [wasVisible, setWasVisible] = useState(visible);
  const [showMoreEquipment, setShowMoreEquipment] = useState(false);
  const [moreFiltersExpanded, setMoreFiltersExpanded] = useState(false);
  const announceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const announcedCount = useRef<number | null>(null);

  // Start each opening from the applied filters.
  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setLocalDraft(draft);
      setShowMoreEquipment(
        draft.equipment.some((eq) => MORE_EQUIPMENT.includes(eq))
      );
      setMoreFiltersExpanded(
        draft.formats.length > 0 ||
          draft.bodyFocus.length > 0 ||
          draft.levels.length > 0 ||
          draft.collections.length > 0 ||
          draft.partnerOnly
      );
    }
  }

  const previewCount = countWorkoutsMatching(localDraft, context);
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

  const update = (changes: Partial<WorkoutFilters>) => {
    setLocalDraft((prev) => ({ ...prev, ...changes }));
  };

  const toggleGroup = <G extends WorkoutFilterGroup>(
    group: G,
    value: WorkoutFilters[G][number]
  ) => {
    setLocalDraft((prev) => ({
      ...prev,
      [group]: toggleValue(prev[group] as WorkoutFilters[G][number][], value),
    }));
  };

  const toggleEquipment = (eq: WorkoutEquipment) => {
    setLocalDraft((prev) => ({
      ...prev,
      bodyweightOnly: false,
      equipment: toggleValue(prev.equipment, eq),
    }));
  };

  const toggleCount = (changes: Partial<WorkoutFilters>) =>
    countWorkoutsMatching(localDraft, context, changes);

  const favouritesCount = toggleCount({ favouritesOnly: true });
  const unlockedCount = toggleCount({ hideLocked: true });
  const bodyweightCount = toggleCount({ bodyweightOnly: true, equipment: [] });
  const partnerCount = toggleCount({ partnerOnly: true });

  const renderEquipmentChip = (eq: WorkoutEquipment) => {
    const isActive = localDraft.equipment.includes(eq);
    const count = countWithEquipmentOption(localDraft, context, eq);
    if (!showFilterChip(count, isActive)) return null;
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
  };

  const equipmentSelected =
    localDraft.equipment.length > 0 || localDraft.bodyweightOnly;

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
            onPress={() => setLocalDraft(EMPTY_WORKOUT_FILTERS)}
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
          onChangeText={(text) => update({ searchQuery: text })}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          accessibilityLabel="Search workouts"
        />
        {localDraft.searchQuery.length > 0 ? (
          <Pressable
            onPress={() => update({ searchQuery: '' })}
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

      <View style={styles.chipRow}>
        <FilterChip
          label="Favourites"
          icon="heart"
          selected={localDraft.favouritesOnly}
          onPress={() => update({ favouritesOnly: !localDraft.favouritesOnly })}
          count={favouritesCount}
          accessibilityLabel={`Favourites, ${workoutsLabel(favouritesCount)}`}
        />
        {context.isPro ? null : (
          <FilterChip
            label="Hide locked"
            icon="lock-open-outline"
            selected={localDraft.hideLocked}
            onPress={() => update({ hideLocked: !localDraft.hideLocked })}
            count={unlockedCount}
            accessibilityLabel={`Hide locked, ${workoutsLabel(unlockedCount)}`}
          />
        )}
      </View>

      <FilterSection
        title="Discipline"
        accessory={
          localDraft.disciplines.length > 0 ? (
            <ClearAction
              label="discipline"
              onPress={() => update({ disciplines: [] })}
            />
          ) : null
        }
      >
        <GroupChips
          group="disciplines"
          options={asOptions(WORKOUT_DISCIPLINES)}
          filters={localDraft}
          context={context}
          onToggle={(value) => toggleGroup('disciplines', value)}
          iconFor={(value) => DISCIPLINE_ICONS[value]}
        />
      </FilterSection>

      <FilterSection
        title="Time"
        scrollable
        accessory={
          localDraft.timeBuckets.length > 0 ? (
            <ClearAction
              label="time"
              onPress={() => update({ timeBuckets: [] })}
            />
          ) : null
        }
      >
        <GroupChips
          group="timeBuckets"
          options={TIME_OPTIONS}
          filters={localDraft}
          context={context}
          onToggle={(value) => toggleGroup('timeBuckets', value)}
          keepEmpty
        />
      </FilterSection>

      <FilterSection
        title="What do you have?"
        description="Shows workouts you can do with the kit you pick."
        accessory={
          equipmentSelected ? (
            <ClearAction
              label="equipment"
              onPress={() => update({ equipment: [], bodyweightOnly: false })}
            />
          ) : null
        }
      >
        <FilterChip
          label="Bodyweight only"
          selected={localDraft.bodyweightOnly}
          onPress={() =>
            update({
              bodyweightOnly: !localDraft.bodyweightOnly,
              equipment: [],
            })
          }
          count={bodyweightCount}
          accessibilityLabel={`Bodyweight only, ${workoutsLabel(bodyweightCount)}`}
        />
        {COMMON_EQUIPMENT.map(renderEquipmentChip)}
        {showMoreEquipment ? MORE_EQUIPMENT.map(renderEquipmentChip) : null}
        <ActionChip
          label={showMoreEquipment ? 'Less equipment' : 'More equipment'}
          icon={showMoreEquipment ? 'chevron-up' : 'chevron-down'}
          tone="neutral"
          onPress={() => setShowMoreEquipment((value) => !value)}
          accessibilityState={{ expanded: showMoreEquipment }}
        />
      </FilterSection>

      <Collapsible
        title="More filters"
        expanded={moreFiltersExpanded}
        onToggle={() => setMoreFiltersExpanded((value) => !value)}
      >
        <View style={styles.moreFilters}>
          <FilterSection title="Format">
            <GroupChips
              group="formats"
              options={asOptions(WORKOUT_FORMATS)}
              filters={localDraft}
              context={context}
              onToggle={(value) => toggleGroup('formats', value)}
            />
          </FilterSection>
          <FilterSection title="Body focus">
            <GroupChips
              group="bodyFocus"
              options={asOptions(WORKOUT_BODY_FOCUSES)}
              filters={localDraft}
              context={context}
              onToggle={(value) => toggleGroup('bodyFocus', value)}
            />
          </FilterSection>
          <FilterSection title="Level">
            <GroupChips
              group="levels"
              options={asOptions(WORKOUT_LEVELS)}
              filters={localDraft}
              context={context}
              onToggle={(value) => toggleGroup('levels', value)}
            />
          </FilterSection>
          <FilterSection title="Partner">
            <FilterChip
              label="Partner workouts"
              icon="people-outline"
              selected={localDraft.partnerOnly}
              onPress={() => update({ partnerOnly: !localDraft.partnerOnly })}
              count={partnerCount}
              accessibilityLabel={`Partner workouts, ${workoutsLabel(partnerCount)}`}
            />
          </FilterSection>
          <FilterSection title="Collections">
            <GroupChips
              group="collections"
              options={asOptions(WORKOUT_COLLECTIONS)}
              filters={localDraft}
              context={context}
              onToggle={(value) => toggleGroup('collections', value)}
            />
          </FilterSection>
        </View>
      </Collapsible>
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
  sectionDescription: {
    ...typography.callout,
    color: color.textSecondary,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  scrollRow: {
    marginHorizontal: -space.md,
  },
  scrollRowContent: {
    gap: space.xs,
    paddingHorizontal: space.md,
  },
  moreFilters: {
    gap: space.md,
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
