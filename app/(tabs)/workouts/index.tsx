import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { workoutsListStyles as styles } from '@/src/components/workouts/workoutsListStyles';
import {
  CATEGORY_FILTERS,
  TIME_FILTERS,
  type CategoryFilter,
  type TimeFilter,
} from '@/src/components/workouts/workoutsScreenConstants';
import { Colors, Spacing } from '@/src/constants/theme';
import { disciplines } from '@/src/data/disciplines';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { OnboardingGender } from '@/src/types/onboarding';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  getOnboardingProfile,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const NO_EQUIPMENT_TAG = 'No Equipment';
const WOMENS_PICKS_TAG = 'Women’s Picks';
const LEGS_AND_GLUTES_TAG = 'Legs & Glutes';
const GET_BIG_TAG = 'Get Big';

function workoutHasTag(workout: SingleWorkout, tag: string): boolean {
  return workout.tags.includes(tag);
}

function matchesTimeFilter(
  workout: SingleWorkout,
  timeFilter: TimeFilter
): boolean {
  if (timeFilter === null) return true;
  if (timeFilter === '≤15 min') return workout.estimatedTime <= 15;
  if (timeFilter === '16-30 min')
    return workout.estimatedTime >= 16 && workout.estimatedTime <= 30;
  if (timeFilter === '31-45 min')
    return workout.estimatedTime >= 31 && workout.estimatedTime <= 45;
  if (timeFilter === '46+ min') return workout.estimatedTime >= 46;
  return true;
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
    <Pressable
      style={({ pressed }) => [
        styles.curatedCard,
        pressed && styles.cardPressed,
        isLocked && styles.curatedCardLocked,
      ]}
      onPress={handlePress}
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
      <View style={styles.curatedCardStats}>
        <Text style={styles.curatedStatLabel}>Duration</Text>
        <View style={styles.curatedDurationBadge}>
          <Ionicons name="time" size={14} color={Colors.accent} />
          <Text style={styles.curatedDurationText}>
            {workout.estimatedTime} min
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function WorkoutsScreen() {
  const { isPro } = useSubscription();
  const posthog = usePostHog();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>('All');
  const [noEquipmentOnly, setNoEquipmentOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onboardingGender, setOnboardingGender] =
    useState<OnboardingGender | null>(null);

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

  const handleToggleFavorite = async (workoutId: string) => {
    const newStatus = await toggleFavoriteWorkout(workoutId);
    posthog.capture(posthogEventsNames.workout.favourite, {
      workout_id: workoutId,
      action: newStatus ? 'add' : 'remove',
    });
    if (newStatus) {
      setFavorites([...favorites, workoutId]);
    } else {
      setFavorites(favorites.filter((id) => id !== workoutId));
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
      setActiveTimeFilter(null);
      setNoEquipmentOnly(false);
    }
  };

  function matchesWorkout(
    workout: SingleWorkout,
    overrides?: Partial<{
      searchQuery: string;
      activeTimeFilter: TimeFilter;
      activeCategoryFilter: CategoryFilter;
      noEquipmentOnly: boolean;
    }>
  ): boolean {
    const effectiveSearchQuery = overrides?.searchQuery ?? searchQuery;
    const effectiveTimeFilter = overrides?.activeTimeFilter ?? activeTimeFilter;
    const effectiveCategoryFilter =
      overrides?.activeCategoryFilter ?? activeCategoryFilter;
    const effectiveNoEquipmentOnly =
      overrides?.noEquipmentOnly ?? noEquipmentOnly;

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

    if (effectiveNoEquipmentOnly && !workoutHasTag(workout, NO_EQUIPMENT_TAG)) {
      return false;
    }

    if (!matchesTimeFilter(workout, effectiveTimeFilter)) return false;

    if (effectiveCategoryFilter === 'All') return true;
    if (effectiveCategoryFilter === 'Favorites')
      return favorites.includes(workout.id);
    if (effectiveCategoryFilter === 'Pro') return workout.isPremium;
    return workout.category === effectiveCategoryFilter;
  }

  const filteredWorkouts = allStandaloneWorkouts.filter((workout) =>
    matchesWorkout(workout)
  );

  const womensPicksWorkouts = filteredWorkouts.filter((w) =>
    workoutHasTag(w, WOMENS_PICKS_TAG)
  );

  const legsAndGlutesWorkouts = filteredWorkouts.filter((w) =>
    workoutHasTag(w, LEGS_AND_GLUTES_TAG)
  );

  const getBigWorkouts = filteredWorkouts.filter((w) =>
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

        <View>
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

        <View style={{ marginTop: Spacing.sm }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScrollContent}
          >
            {TIME_FILTERS.map((filter) => {
              const isActive = activeTimeFilter === filter;
              const count = allStandaloneWorkouts.filter((w) =>
                matchesWorkout(w, { activeTimeFilter: filter })
              ).length;

              return (
                <Pill
                  key={filter}
                  onPress={() => {
                    const next = isActive ? null : filter;
                    captureFilter('time', next ?? 'none');
                    setActiveTimeFilter(next);
                  }}
                  isActive={isActive}
                  label={filter}
                  icon="time-outline"
                  count={count}
                />
              );
            })}
          </ScrollView>
        </View>
      </StandardLayout.AdvancedFilters>
      <StandardLayout.Body>
        {filteredWorkouts.length === 0 ? (
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
            data={filteredWorkouts}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              <>
                <View style={styles.curatedSection}>
                  <View style={styles.curatedSectionHeader}>
                    <Text style={styles.curatedSectionTitle}>Disciplines</Text>
                    <Text style={styles.curatedSectionHelper}>
                      get started with what you already know
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.curatedScrollContent}
                  >
                    {disciplines.map((discipline) => (
                      <Pressable
                        style={({ pressed }) => [
                          styles.disciplineSection,
                          pressed && styles.cardPressed,
                        ]}
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
                        <View
                          pointerEvents="none"
                          style={styles.disciplineBottomShade}
                        />
                        <View
                          pointerEvents="none"
                          style={styles.disciplineAccentLine}
                        />
                        {discipline.logo ? (
                          <Image
                            source={discipline.logo.source}
                            style={[
                              styles.disciplineLogo,
                              {
                                width: discipline.logo.width,
                                height: discipline.logo.height,
                              },
                            ]}
                          />
                        ) : null}
                        {discipline.showTitle || discipline.logo ? (
                          <Text style={styles.disciplineSectionTitle}>
                            {discipline.title}
                          </Text>
                        ) : null}
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>

                {showS1AndS2 && womensPicksWorkouts.length > 0 && (
                  <View style={styles.curatedSection}>
                    <View style={styles.curatedSectionHeader}>
                      <Text style={styles.curatedSectionTitle}>
                        Recommended for you
                      </Text>
                      <Text style={styles.curatedSectionHelper}>
                        A feel-good place to start.
                      </Text>
                    </View>
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
                  <View style={styles.curatedSection}>
                    <View style={styles.curatedSectionHeader}>
                      <Text style={styles.curatedSectionTitle}>
                        Legs &amp; Glutes
                      </Text>
                      <Text style={styles.curatedSectionHelper}>
                        Strong legs, confident you.
                      </Text>
                    </View>
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
                  <View style={styles.curatedSection}>
                    <View style={styles.curatedSectionHeader}>
                      <Text style={styles.curatedSectionTitle}>Get Big</Text>
                      <Text style={styles.curatedSectionHelper}>
                        Big pump. Feel strong.
                      </Text>
                    </View>
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

                <View style={styles.allWorkoutsHeader}>
                  <Text style={styles.allWorkoutsTitle}>All Workouts</Text>
                  <Text style={styles.allWorkoutsHelper}>
                    Browse the full library, then save your favourites for fast
                    access.
                  </Text>
                </View>
              </>
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
