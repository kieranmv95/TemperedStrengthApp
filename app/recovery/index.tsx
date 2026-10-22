import { ActionChip, FilterChip, StandardLayout } from '@/src/components/ds';
import { RecoveryCard } from '@/src/components/recovery/RecoveryCard';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import { color, space, typography } from '@/src/constants/tokens';
import { recoveries } from '@/src/data/recovery';
import { useRoles } from '@/src/hooks/useRoles';
import {
  RECOVERY_TAGS,
  type Recovery,
  type RecoveryEquipment,
  type RecoveryTag,
} from '@/src/types/recovery';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const COACH_ROLE = 'coach';
const STATE_ICON_SIZE = 48;

type RecoverySortBy = 'name' | 'access';
type RecoverySortDirection = 'asc' | 'desc';

const SORT_BY_OPTIONS: { value: RecoverySortBy; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'access', label: 'Pro' },
];

const SORT_DIRECTION_OPTIONS: {
  value: RecoverySortDirection;
  label: string;
}[] = [
  { value: 'asc', label: 'Ascending' },
  { value: 'desc', label: 'Descending' },
];

function equipmentLabel(equipment: RecoveryEquipment): string {
  return equipment.charAt(0).toUpperCase() + equipment.slice(1);
}

function compareRecoveries(
  a: Recovery,
  b: Recovery,
  sortBy: RecoverySortBy,
  sortDirection: RecoverySortDirection
): number {
  const nameCmp = a.title.localeCompare(b.title, undefined, {
    sensitivity: 'base',
  });

  // `access` sorts free flows before premium ones (ascending), then falls back
  // to name so each group stays alphabetical.
  if (sortBy === 'access') {
    const accessCmp = Number(a.isPremium) - Number(b.isPremium);
    const directed = sortDirection === 'asc' ? accessCmp : -accessCmp;
    return directed !== 0 ? directed : nameCmp;
  }

  return sortDirection === 'asc' ? nameCmp : -nameCmp;
}

export default function RecoveryScreen() {
  const insets = useSafeAreaInsets();
  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const hasAccess = isPro || roles.includes(COACH_ROLE) || accessLoading;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<RecoveryTag[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<
    RecoveryEquipment[]
  >([]);
  const [noEquipmentOnly, setNoEquipmentOnly] = useState(false);
  const [sortBy, setSortBy] = useState<RecoverySortBy>('name');
  const [sortDirection, setSortDirection] =
    useState<RecoverySortDirection>('asc');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sortExpanded, setSortExpanded] = useState(false);

  const availableTags = useMemo(() => {
    const tags = new Set<RecoveryTag>();
    recoveries.forEach((recovery) =>
      recovery.tags.forEach((tag) => tags.add(tag))
    );
    return Array.from(tags).sort(
      (a, b) => RECOVERY_TAGS.indexOf(a) - RECOVERY_TAGS.indexOf(b)
    );
  }, []);

  const availableEquipment = useMemo(() => {
    const equipment = new Set<RecoveryEquipment>();
    recoveries.forEach((recovery) =>
      recovery.equipment.forEach((item) => equipment.add(item))
    );
    return Array.from(equipment).sort();
  }, []);

  const hasNoEquipmentRecoveries = useMemo(
    () => recoveries.some((recovery) => recovery.equipment.length === 0),
    []
  );

  const visibleRecoveries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = recoveries.filter((recovery) => {
      if (query) {
        const matchesQuery =
          recovery.title.toLowerCase().includes(query) ||
          recovery.description.toLowerCase().includes(query) ||
          recovery.tags.some((tag) => tag.toLowerCase().includes(query));
        if (!matchesQuery) return false;
      }
      if (
        selectedTags.length > 0 &&
        !selectedTags.some((tag) => recovery.tags.includes(tag))
      ) {
        return false;
      }
      if (noEquipmentOnly) {
        if (recovery.equipment.length > 0) return false;
      } else if (
        selectedEquipment.length > 0 &&
        !selectedEquipment.some((item) => recovery.equipment.includes(item))
      ) {
        return false;
      }
      return true;
    });

    return filtered.sort((a, b) =>
      compareRecoveries(a, b, sortBy, sortDirection)
    );
  }, [
    searchQuery,
    selectedTags,
    selectedEquipment,
    noEquipmentOnly,
    sortBy,
    sortDirection,
  ]);

  const toggleTag = (tag: RecoveryTag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
  };

  const selectAnyEquipment = () => {
    setSelectedEquipment([]);
    setNoEquipmentOnly(false);
  };

  const toggleNoEquipment = () => {
    setNoEquipmentOnly((prev) => !prev);
    setSelectedEquipment([]);
  };

  const toggleEquipment = (equipment: RecoveryEquipment) => {
    setNoEquipmentOnly(false);
    setSelectedEquipment((prev) =>
      prev.includes(equipment)
        ? prev.filter((item) => item !== equipment)
        : [...prev, equipment]
    );
  };

  const handleRecoveryPress = (recovery: Recovery) => {
    router.push({
      pathname: '/recovery/[id]',
      params: { id: recovery.id },
    });
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  const showControls = recoveries.length > 0;

  return (
    <StandardLayout
      title="Recovery"
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
      headerActions={
        showControls ? (
          <>
            <ActionChip
              label={filtersExpanded ? 'Hide filters' : 'Show filters'}
              icon="options-outline"
              tone={filtersExpanded ? 'gold' : 'neutral'}
              onPress={() => setFiltersExpanded((value) => !value)}
              accessibilityLabel="Filter recovery flows"
              accessibilityState={{ expanded: filtersExpanded }}
            />
            <ActionChip
              label="Sort by"
              icon="swap-vertical"
              tone={sortExpanded ? 'gold' : 'neutral'}
              onPress={() => setSortExpanded((value) => !value)}
              accessibilityLabel="Sort recovery flows"
              accessibilityState={{ expanded: sortExpanded }}
            />
          </>
        ) : undefined
      }
    >
      {showControls && (sortExpanded || filtersExpanded) ? (
        <StandardLayout.Filters>
          {sortExpanded ? (
            <View style={recoveryStyles.panel}>
              <View style={styles.filtersRow}>
                <Text style={styles.filtersLabel} accessibilityRole="header">
                  Sort by
                </Text>
                <View style={recoveryStyles.chipWrap}>
                  {SORT_BY_OPTIONS.map((option) => (
                    <FilterChip
                      key={option.value}
                      label={option.label}
                      selected={sortBy === option.value}
                      onPress={() => setSortBy(option.value)}
                      accessibilityLabel={`Sort by ${option.label}`}
                    />
                  ))}
                </View>
              </View>
              <View style={styles.filtersRow}>
                <Text style={styles.filtersLabel} accessibilityRole="header">
                  Order
                </Text>
                <View style={recoveryStyles.chipWrap}>
                  {SORT_DIRECTION_OPTIONS.map((option) => (
                    <FilterChip
                      key={option.value}
                      label={option.label}
                      selected={sortDirection === option.value}
                      onPress={() => setSortDirection(option.value)}
                    />
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {filtersExpanded ? (
            <View style={recoveryStyles.panel}>
              <View style={styles.searchContainer}>
                <Ionicons name="search" size={18} color={color.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search recovery flows"
                  placeholderTextColor={color.textTertiary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                  accessibilityLabel="Search recovery flows"
                />
                {searchQuery.length > 0 ? (
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
                ) : null}
              </View>

              <View style={styles.filtersRow}>
                <Text style={styles.filtersLabel} accessibilityRole="header">
                  Focus
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScrollContent}
                >
                  <FilterChip
                    label="All"
                    selected={selectedTags.length === 0}
                    onPress={() => setSelectedTags([])}
                    accessibilityLabel="All focus areas"
                  />
                  {availableTags.map((tag) => (
                    <FilterChip
                      key={tag}
                      label={tag}
                      selected={selectedTags.includes(tag)}
                      onPress={() => toggleTag(tag)}
                    />
                  ))}
                </ScrollView>
              </View>

              {availableEquipment.length > 0 || hasNoEquipmentRecoveries ? (
                <View style={styles.filtersRow}>
                  <Text style={styles.filtersLabel} accessibilityRole="header">
                    Equipment
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                  >
                    <FilterChip
                      label="Any"
                      selected={
                        selectedEquipment.length === 0 && !noEquipmentOnly
                      }
                      onPress={selectAnyEquipment}
                      accessibilityLabel="Any equipment"
                    />
                    {hasNoEquipmentRecoveries ? (
                      <FilterChip
                        label="No equipment"
                        selected={noEquipmentOnly}
                        onPress={toggleNoEquipment}
                      />
                    ) : null}
                    {availableEquipment.map((item) => (
                      <FilterChip
                        key={item}
                        label={equipmentLabel(item)}
                        selected={selectedEquipment.includes(item)}
                        onPress={() => toggleEquipment(item)}
                      />
                    ))}
                  </ScrollView>
                </View>
              ) : null}
            </View>
          ) : null}
        </StandardLayout.Filters>
      ) : null}

      <StandardLayout.Body>
        {recoveries.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="leaf-outline"
              size={STATE_ICON_SIZE}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              No flows found
            </Text>
            <Text style={styles.emptyDescription}>
              Recovery flows will appear here.
            </Text>
          </View>
        ) : (
          <FlatList
            style={recoveryStyles.list}
            data={visibleRecoveries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: insets.bottom + space.xxl },
            ]}
            ListHeaderComponent={
              <View style={recoveryStyles.intro}>
                <Text
                  style={recoveryStyles.introTitle}
                  accessibilityRole="header"
                >
                  Train hard, recover smart
                </Text>
                <Text style={recoveryStyles.introText}>
                  Mobility, prehab, and recovery flows to keep your joints
                  healthy and your body moving well. Use these on rest days or
                  after training to stay consistent and injury-free.
                </Text>
              </View>
            }
            ListEmptyComponent={
              <View style={recoveryStyles.noResults}>
                <Ionicons
                  name="options-outline"
                  size={STATE_ICON_SIZE}
                  color={color.textTertiary}
                />
                <Text style={recoveryStyles.noResultsText}>
                  No flows match these filters.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <RecoveryCard
                recovery={item}
                isPro={hasAccess}
                onPress={handleRecoveryPress}
                onLockedPress={handleLockedPress}
              />
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const recoveryStyles = StyleSheet.create({
  panel: {
    gap: space.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  list: {
    flex: 1,
  },
  intro: {
    gap: space.xxs,
    marginBottom: space.md,
  },
  introTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  introText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: space.xxl,
    gap: space.sm,
  },
  noResultsText: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
