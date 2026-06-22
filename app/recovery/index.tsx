import { Pill } from '@/src/components/pill';
import { RecoveryCard } from '@/src/components/recovery/RecoveryCard';
import { workoutDetailStyles as headerStyles } from '@/src/components/workouts/workoutDetailStyles';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { recoveries } from '@/src/data/recovery';
import { useSubscription } from '@/src/hooks/use-subscription';
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';

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
  return equipment
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
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
  const { isPro } = useSubscription();
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

  return (
    <AppSafeAreaView style={headerStyles.container}>
      <View style={recoveryStyles.header}>
        <View style={recoveryStyles.headerRow}>
          <TouchableOpacity
            style={headerStyles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Back"
          >
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={headerStyles.detailTitle} numberOfLines={1}>
            Recovery
          </Text>
          <View style={headerStyles.headerRightSpacer} />
        </View>

        {recoveries.length > 0 ? (
          <View style={recoveryStyles.controls}>
            <View style={recoveryStyles.buttonsRow}>
              <TouchableOpacity
                style={recoveryStyles.toggleButton}
                onPress={() => setFiltersExpanded((value) => !value)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Filter recovery flows"
                accessibilityState={{ expanded: filtersExpanded }}
              >
                <Text style={recoveryStyles.toggleButtonText}>
                  {filtersExpanded ? 'Hide filters' : 'Show filters'}
                </Text>
                <Ionicons name="filter" size={16} color={Colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity
                style={recoveryStyles.toggleButton}
                onPress={() => setSortExpanded((value) => !value)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Sort recovery flows"
                accessibilityState={{ expanded: sortExpanded }}
              >
                <Text style={recoveryStyles.toggleButtonText}>Sort by</Text>
                <Ionicons
                  name="swap-vertical"
                  size={16}
                  color={Colors.textMuted}
                />
              </TouchableOpacity>
            </View>

            {sortExpanded ? (
              <View style={recoveryStyles.sortPanel}>
                <View style={recoveryStyles.sortRow}>
                  <Text style={styles.filtersLabel}>Sort by</Text>
                  <View style={recoveryStyles.sortPills}>
                    {SORT_BY_OPTIONS.map((option) => (
                      <Pill
                        key={option.value}
                        label={option.label}
                        isActive={sortBy === option.value}
                        onPress={() => setSortBy(option.value)}
                      />
                    ))}
                  </View>
                </View>
                <View style={recoveryStyles.sortRow}>
                  <Text style={styles.filtersLabel}>Title</Text>
                  <View style={recoveryStyles.sortPills}>
                    {SORT_DIRECTION_OPTIONS.map((option) => (
                      <Pill
                        key={option.value}
                        label={option.label}
                        isActive={sortDirection === option.value}
                        onPress={() => setSortDirection(option.value)}
                      />
                    ))}
                  </View>
                </View>
              </View>
            ) : null}

            {filtersExpanded ? (
              <View style={recoveryStyles.filters}>
                <View style={[styles.searchContainer, recoveryStyles.search]}>
                  <Ionicons
                    name="search"
                    size={18}
                    color={Colors.textPlaceholder}
                    style={styles.searchIcon}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search recovery flows..."
                    placeholderTextColor={Colors.textPlaceholder}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                  {searchQuery.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => setSearchQuery('')}
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

                <View style={styles.filtersRow}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterScrollContent}
                  >
                    <Text style={styles.filtersLabel}>Focus</Text>
                    <Pill
                      label="All"
                      isActive={selectedTags.length === 0}
                      onPress={() => setSelectedTags([])}
                    />
                    {availableTags.map((tag) => (
                      <Pill
                        key={tag}
                        label={tag}
                        isActive={selectedTags.includes(tag)}
                        onPress={() => toggleTag(tag)}
                      />
                    ))}
                  </ScrollView>
                </View>

                {availableEquipment.length > 0 || hasNoEquipmentRecoveries ? (
                  <View style={styles.filtersRow}>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.filterScrollContent}
                    >
                      <Text style={styles.filtersLabel}>Equipment</Text>
                      <Pill
                        label="Any"
                        isActive={
                          selectedEquipment.length === 0 && !noEquipmentOnly
                        }
                        onPress={selectAnyEquipment}
                      />
                      {hasNoEquipmentRecoveries ? (
                        <Pill
                          label="No equipment"
                          isActive={noEquipmentOnly}
                          onPress={toggleNoEquipment}
                        />
                      ) : null}
                      {availableEquipment.map((item) => (
                        <Pill
                          key={item}
                          label={equipmentLabel(item)}
                          isActive={selectedEquipment.includes(item)}
                          onPress={() => toggleEquipment(item)}
                        />
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {recoveries.length === 0 ? (
        <View style={headerStyles.emptyState}>
          <Ionicons name="leaf" size={64} color={Colors.backgroundSubtle} />
          <Text style={headerStyles.emptyTitle}>No Flows Found</Text>
          <Text style={headerStyles.emptyDescription}>
            Recovery flows will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          style={recoveryStyles.list}
          data={visibleRecoveries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={recoveryStyles.listContent}
          ListHeaderComponent={
            <View style={recoveryStyles.intro}>
              <Text style={recoveryStyles.introTitle}>
                Train hard, recover smart
              </Text>
              <Text style={recoveryStyles.introText}>
                Mobility, prehab, and recovery flows to keep your joints healthy
                and your body moving well. Use these on rest days or after
                training to stay consistent and injury-free.
              </Text>
            </View>
          }
          ListEmptyComponent={
            <View style={recoveryStyles.noResults}>
              <Ionicons
                name="filter"
                size={48}
                color={Colors.backgroundSubtle}
              />
              <Text style={recoveryStyles.noResultsText}>
                No flows match these filters.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <RecoveryCard
              recovery={item}
              isPro={isPro}
              onPress={handleRecoveryPress}
              onLockedPress={handleLockedPress}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </AppSafeAreaView>
  );
}

const recoveryStyles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  controls: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.xxl,
  },
  intro: {
    gap: Spacing.sm,
    marginBottom: Spacing.xxl,
  },
  introTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
  },
  introText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  filters: {
    gap: Spacing.xl,
  },
  search: {
    marginTop: 0,
    marginBottom: 0,
  },
  buttonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  toggleButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.base,
    fontWeight: '700',
  },
  sortPanel: {
    gap: Spacing.lg,
  },
  sortRow: {
    gap: Spacing.md,
  },
  sortPills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.section,
    gap: Spacing.lg,
  },
  noResultsText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
  },
});
