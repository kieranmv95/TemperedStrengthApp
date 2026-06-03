import { CuratedSection } from '@/src/components/ds';
import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { WorkoutActiveFiltersBar } from '@/src/components/workouts/WorkoutActiveFiltersBar';
import {
  compareWorkouts,
  WorkoutSortBarButton,
  WorkoutSortPanel,
} from '@/src/components/workouts/WorkoutSortControls';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import {
  CATEGORY_FILTERS,
  getEquipmentFiltersInUse,
  type CategoryFilter,
  type WorkoutSortBy,
  type WorkoutSortDirection,
} from '@/src/components/workouts/workoutsScreenConstants';
import { Colors } from '@/src/constants/theme';
import { disciplines } from '@/src/data/disciplines';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { OnboardingGender } from '@/src/types/onboarding';
import type { SingleWorkout, WorkoutEquipment } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  getOnboardingProfile,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const WOMENS_PICKS_TAG = 'Women’s Picks';
const LEGS_AND_GLUTES_TAG = 'Legs & Glutes';
const GET_BIG_TAG = 'Get Big';

function workoutHasTag(workout: SingleWorkout, tag: string): boolean {
  return workout.tags.includes(tag);
}

function equipmentFilterLabel(eq: WorkoutEquipment): string {
  return eq
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function CuratedWorkoutCard({
  workout,
  isPro,
  onPress,
  onLockedPress,
}: {
  workout: SingleWorkout;
  isPro: boolean;
  onPress: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
}) {
  const isLocked = workout.isPremium && !isPro;

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(workout);
  };

  return (
    <TouchableOpacity
      style={[styles.curatedCard, isLocked && styles.curatedCardLocked]}
      onPress={handlePress}
      activeOpacity={isLocked ? 0.5 : 0.7}
    >
      <View style={styles.curatedCardTopRow}>
        <Text style={styles.curatedCardCategory}>{workout.category}</Text>
        {workout.isPremium && (
          <View style={styles.curatedCardProBadge}>
            <Text style={styles.curatedCardProBadgeText}>PRO</Text>
          </View>
        )}
      </View>
      <Text style={styles.curatedCardTitle} numberOfLines={2}>
        {workout.title}
      </Text>
      <View>
        <View style={styles.curatedCardMeta}>
          <Ionicons name="time" size={14} color={Colors.accent} />
          <Text style={styles.curatedCardMetaText}>
            {workout.estimatedTime} min
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function WorkoutsScreen() {
  const { isPro } = useSubscription();
  const posthog = usePostHog();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<
    WorkoutEquipment[]
  >([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onboardingGender, setOnboardingGender] =
    useState<OnboardingGender | null>(null);
  const [sortExpanded, setSortExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<WorkoutSortBy>('name');
  const [sortDirection, setSortDirection] =
    useState<WorkoutSortDirection>('asc');

  const captureFilter = useCallback(
    (filterType: string, filterValue: string) => {
      posthog.capture(posthogEventsNames.workout.filtersApplied, {
        filter_type: filterType,
        filter_value: filterValue,
      });
    },
    [posthog]
  );

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }
    const q = searchQuery.trim();
    if (q.length < 2) {
      return;
    }
    searchDebounceRef.current = setTimeout(() => {
      captureFilter('search', q.slice(0, 120));
    }, 600);
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery, captureFilter]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
      loadOnboardingGender();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteWorkouts();
    setFavorites(favs);
  };

  const loadOnboardingGender = async () => {
    const profile = await getOnboardingProfile();
    setOnboardingGender(profile?.gender ?? null);
  };

  const handleToggleFavorite = async (workout: SingleWorkout) => {
    const newStatus = await toggleFavoriteWorkout(workout.id);
    posthog.capture(posthogEventsNames.workout.favourite, {
      workout_name: workout.title,
      action: newStatus ? 'add' : 'remove',
    });
    if (newStatus) {
      setFavorites([...favorites, workout.id]);
    } else {
      setFavorites(favorites.filter((id) => id !== workout.id));
    }
  };

  const handleWorkoutPress = (workout: SingleWorkout) => {
    const source = searchQuery.trim().length > 0 ? 'search' : 'browse';
    router.push({
      pathname: '/workouts/[id]',
      params: { id: workout.id, view_source: source },
    });
  };

  const handleLockedPress = () => {
    router.push('/settings');
  };

  const handleSelectCategoryFilter = (filter: CategoryFilter) => {
    captureFilter('category', filter);
    setActiveCategoryFilter(filter);

    if (filter === 'All') {
      setSelectedEquipment([]);
    }
  };

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    activeCategoryFilter !== 'All' ||
    selectedEquipment.length > 0;

  const handleResetAllFilters = () => {
    captureFilter('reset', 'all');
    setSearchQuery('');
    setActiveCategoryFilter('All');
    setSelectedEquipment([]);
  };

  const equipmentFiltersInUse = useMemo(
    () => getEquipmentFiltersInUse(allStandaloneWorkouts),
    []
  );

  const handleSelectEquipmentAll = () => {
    captureFilter('equipment', 'all');
    setSelectedEquipment([]);
  };

  const handleToggleEquipmentFilter = (eq: WorkoutEquipment) => {
    setSelectedEquipment((prev) => {
      const next = prev.includes(eq)
        ? prev.filter((item) => item !== eq)
        : [...prev, eq];
      captureFilter(
        'equipment',
        next.length > 0 ? next.join(',') : 'all'
      );
      return next;
    });
  };

  function matchesWorkout(
    workout: SingleWorkout,
    overrides?: Partial<{
      searchQuery: string;
      activeCategoryFilter: CategoryFilter;
      selectedEquipment: WorkoutEquipment[];
    }>
  ): boolean {
    const effectiveSearchQuery = overrides?.searchQuery ?? searchQuery;
    const effectiveCategoryFilter =
      overrides?.activeCategoryFilter ?? activeCategoryFilter;
    const effectiveSelectedEquipment =
      overrides?.selectedEquipment ?? selectedEquipment;

    if (effectiveSearchQuery.trim()) {
      const query = effectiveSearchQuery.trim().toLowerCase();
      const matchesTitle = workout.title.toLowerCase().includes(query);
      const matchesDescription = workout.description
        .toLowerCase()
        .includes(query);
      const matchesTags = workout.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }

    if (effectiveSelectedEquipment.length > 0) {
      const hasAll = effectiveSelectedEquipment.every((eq) =>
        workout.equipment.includes(eq)
      );
      if (!hasAll) return false;
    }

    if (effectiveCategoryFilter === 'All') return true;
    if (effectiveCategoryFilter === 'Favorites')
      return favorites.includes(workout.id);
    if (effectiveCategoryFilter === 'Pro') return workout.isPremium;
    return workout.category === effectiveCategoryFilter;
  }

  function equipmentCountForFilter(eq: WorkoutEquipment | null): number {
    const hypothetical =
      eq === null
        ? []
        : selectedEquipment.includes(eq)
          ? selectedEquipment
          : [...selectedEquipment, eq];
    return allStandaloneWorkouts.filter((w) =>
      matchesWorkout(w, { selectedEquipment: hypothetical })
    ).length;
  }

  const filteredWorkouts = useMemo(
    () => allStandaloneWorkouts.filter((workout) => matchesWorkout(workout)),
    [
      searchQuery,
      activeCategoryFilter,
      selectedEquipment,
      favorites,
    ]
  );

  const sortedWorkouts = useMemo(
    () =>
      [...filteredWorkouts].sort((a, b) =>
        compareWorkouts(a, b, sortBy, sortDirection)
      ),
    [filteredWorkouts, sortBy, sortDirection]
  );

  const handleChangeSortBy = (value: WorkoutSortBy) => {
    setSortBy(value);
    captureFilter('sort', `${value}_${sortDirection}`);
  };

  const handleChangeSortDirection = (value: WorkoutSortDirection) => {
    setSortDirection(value);
    captureFilter('sort', `${sortBy}_${value}`);
  };

  const womensPicksWorkouts = sortedWorkouts.filter((w) =>
    workoutHasTag(w, WOMENS_PICKS_TAG)
  );

  const legsAndGlutesWorkouts = sortedWorkouts.filter((w) =>
    workoutHasTag(w, LEGS_AND_GLUTES_TAG)
  );

  const getBigWorkouts = sortedWorkouts.filter((w) =>
    workoutHasTag(w, GET_BIG_TAG)
  );

  const showS1AndS2 = onboardingGender === 'female';
  const showS3 =
    onboardingGender === null ||
    onboardingGender === 'male' ||
    onboardingGender === 'prefer_not_to_say';

  return (
    <StandardLayout
      title="Workouts"
      subtitle="Log your workouts and track your progress."
      disableScroll
      filterBarButtons={
        <WorkoutSortBarButton
          expanded={sortExpanded}
          onPress={() => {
            setSortExpanded((v) => {
              const next = !v;
              if (next) {
                captureFilter('sort', 'panel_open');
              }
              return next;
            });
          }}
        />
      }
      filterBarBelowButtons={
        sortExpanded ? (
          <WorkoutSortPanel
            sortBy={sortBy}
            sortDirection={sortDirection}
            onChangeSortBy={handleChangeSortBy}
            onChangeSortDirection={handleChangeSortDirection}
          />
        ) : null
      }
    >
      <StandardLayout.AdvancedFilters>
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
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
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
          )}
        </View>

        <View style={styles.filtersWrap}>
          <View style={styles.filtersRow}>
            <Text style={styles.filtersLabel}>Discipline</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              {CATEGORY_FILTERS.map((filter) => {
                const isActive = activeCategoryFilter === filter;
                const displayLabel = filter === 'WOD' ? 'CrossFit' : filter;
                const count = allStandaloneWorkouts.filter((w) =>
                  matchesWorkout(w, { activeCategoryFilter: filter })
                ).length;

                return (
                  <Pill
                    key={filter}
                    onPress={() => handleSelectCategoryFilter(filter)}
                    isActive={isActive}
                    label={displayLabel}
                    icon={
                      filter === 'Favorites'
                        ? 'heart'
                        : filter === 'Pro'
                          ? 'star'
                          : undefined
                    }
                    count={count}
                  />
                );
              })}
            </ScrollView>
          </View>

          <View style={styles.filtersRow}>
            <Text style={styles.filtersLabel}>Equipment</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScrollContent}
            >
              <Pill
                label="All"
                isActive={selectedEquipment.length === 0}
                onPress={handleSelectEquipmentAll}
                count={equipmentCountForFilter(null)}
              />
              {equipmentFiltersInUse.map((eq) => (
                <Pill
                  key={eq}
                  label={equipmentFilterLabel(eq)}
                  isActive={selectedEquipment.includes(eq)}
                  onPress={() => handleToggleEquipmentFilter(eq)}
                  count={equipmentCountForFilter(eq)}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </StandardLayout.AdvancedFilters>
      <StandardLayout.Body>
        <WorkoutActiveFiltersBar
          searchQuery={searchQuery}
          activeCategoryFilter={activeCategoryFilter}
          selectedEquipment={selectedEquipment}
          equipmentLabel={equipmentFilterLabel}
          onResetAll={handleResetAllFilters}
          onClearSearch={() => {
            captureFilter('search', 'clear');
            setSearchQuery('');
          }}
          onClearCategory={() => handleSelectCategoryFilter('All')}
          onRemoveEquipment={(eq) => {
            setSelectedEquipment((prev) => {
              const next = prev.filter((item) => item !== eq);
              captureFilter(
                'equipment',
                next.length > 0 ? next.join(',') : 'all'
              );
              return next;
            });
          }}
        />
        {sortedWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                activeCategoryFilter === 'Favorites'
                  ? 'heart-outline'
                  : 'barbell'
              }
              size={64}
              color={Colors.backgroundSubtle}
            />
            <Text style={styles.emptyTitle}>
              {activeCategoryFilter === 'Favorites'
                ? 'No Favorites Yet'
                : 'No Workouts Found'}
            </Text>
            <Text style={styles.emptyDescription}>
              {activeCategoryFilter === 'Favorites'
                ? 'Tap the heart icon on any workout to save it here.'
                : searchQuery.trim()
                  ? 'No workouts match your search.'
                  : 'Try selecting a different filter.'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={sortedWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.listContent,
              hasActiveFilters && styles.listContentWithActiveFilters,
            ]}
            ListHeaderComponent={
              <View style={styles.curatedSectionList}>
                <View>
                  <CuratedSection
                    title="Disciplines"
                    description="get started with what you already know"
                    size='large'
                    style={styles.titleSpace}
                  />
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.curatedScrollContent}
                  >
                    {disciplines.map((discipline) => (
                      <TouchableOpacity
                        style={styles.disciplineSection}
                        key={discipline.tag}
                        onPress={() => {
                          posthog.capture(
                            posthogEventsNames.workout.filtersApplied,
                            {
                              filter_type: 'discipline',
                              filter_value: discipline.tag,
                            }
                          );
                          router.push(
                            `/workouts/tag/${encodeURIComponent(discipline.tag)}`
                          );
                        }}
                      >
                        <ImageBackground
                          source={discipline.image}
                          style={styles.disciplineImage}
                          imageStyle={styles.disciplineImageStyle}
                        />
                        <View
                          pointerEvents="none"
                          style={styles.disciplineGoldOverlay}
                        />
                        {discipline.showTitle && (
                          <Text style={styles.disciplineSectionTitle}>
                            {discipline.title}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {showS1AndS2 && womensPicksWorkouts.length > 0 && (
                  <View>
                    <CuratedSection
                      title="Recommended for you"
                      description="A feel-good place to start."
                      size='large'
                      style={styles.titleSpace}
                    />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.curatedScrollContent}
                    >
                      {womensPicksWorkouts.map((workout) => (
                        <CuratedWorkoutCard
                          key={workout.id}
                          workout={workout}
                          isPro={isPro}
                          onPress={handleWorkoutPress}
                          onLockedPress={handleLockedPress}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {showS1AndS2 && legsAndGlutesWorkouts.length > 0 && (
                  <View>
                    <CuratedSection
                      title="Legs &amp; Glutes"
                      description="Strong legs, confident you."
                      size='large'
                      style={styles.titleSpace}
                    />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.curatedScrollContent}
                    >
                      {legsAndGlutesWorkouts.map((workout) => (
                        <CuratedWorkoutCard
                          key={workout.id}
                          workout={workout}
                          isPro={isPro}
                          onPress={handleWorkoutPress}
                          onLockedPress={handleLockedPress}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {showS3 && getBigWorkouts.length > 0 && (
                  <View>
                    <CuratedSection
                      title="Get Big"
                      description="Big pump. Feel strong."
                      size='large'
                      style={styles.titleSpace}
                    />
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.curatedScrollContent}
                    >
                      {getBigWorkouts.map((workout) => (
                        <CuratedWorkoutCard
                          key={workout.id}
                          workout={workout}
                          isPro={isPro}
                          onPress={handleWorkoutPress}
                          onLockedPress={handleLockedPress}
                        />
                      ))}
                    </ScrollView>
                  </View>
                )}

                <CuratedSection
                  title="All Workouts"
                  description={`All our workouts, over ${allStandaloneWorkouts.length - 1}+ workouts.`}
                  size='large'
                  style={styles.titleSpace}
                />
              </View>
            }
            renderItem={({ item }) => (
              <WorkoutCard
                workout={item}
                isFavorite={favorites.includes(item.id)}
                isPro={isPro}
                onToggleFavorite={handleToggleFavorite}
                onPress={handleWorkoutPress}
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
