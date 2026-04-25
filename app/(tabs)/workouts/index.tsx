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
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
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
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const NO_EQUIPMENT_TAG = 'No Equipment';
const WOMENS_PICKS_TAG = "Women’s Picks";
const LEGS_AND_GLUTES_TAG = 'Legs & Glutes';
const GET_BIG_TAG = 'Get Big';

function workoutHasTag(workout: SingleWorkout, tag: string): boolean {
  return workout.tags.includes(tag);
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
      <View style={styles.curatedCardMeta}>
        <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
        <Text style={styles.curatedCardMetaText}>
          {workout.estimatedTime} min
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function WorkoutsScreen() {
  const { isPro } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>('All');
  const [noEquipmentOnly, setNoEquipmentOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [onboardingGender, setOnboardingGender] =
    useState<OnboardingGender | null>(null);

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
    if (newStatus) {
      setFavorites([...favorites, workoutId]);
    } else {
      setFavorites(favorites.filter((id) => id !== workoutId));
    }
  };

  const handleWorkoutPress = (workout: SingleWorkout) => {
    router.push({
      pathname: '/workouts/[id]',
      params: { id: workout.id },
    });
  };

  const handleLockedPress = () => {
    router.push('/settings');
  };

  const handleSelectCategoryFilter = (filter: CategoryFilter) => {
    setActiveCategoryFilter(filter);

    if (filter === 'All') {
      setActiveTimeFilter(null);
      setNoEquipmentOnly(false);
    }
  };

  const filteredWorkouts = allStandaloneWorkouts.filter((workout) => {
    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();
      const matchesTitle = workout.title.toLowerCase().includes(query);
      const matchesDescription = workout.description
        .toLowerCase()
        .includes(query);
      const matchesTags = workout.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );
      if (!matchesTitle && !matchesDescription && !matchesTags) return false;
    }

    if (noEquipmentOnly && !workoutHasTag(workout, NO_EQUIPMENT_TAG))
      return false;

    if (activeTimeFilter === '≤15 min' && workout.estimatedTime > 15)
      return false;
    if (
      activeTimeFilter === '16-30 min' &&
      (workout.estimatedTime < 16 || workout.estimatedTime > 30)
    )
      return false;
    if (
      activeTimeFilter === '31-45 min' &&
      (workout.estimatedTime < 31 || workout.estimatedTime > 45)
    )
      return false;
    if (activeTimeFilter === '46+ min' && workout.estimatedTime < 46)
      return false;

    if (activeCategoryFilter === 'All') return true;
    if (activeCategoryFilter === 'Favorites')
      return favorites.includes(workout.id);
    if (activeCategoryFilter === 'Pro') return workout.isPremium;
    return workout.category === activeCategoryFilter;
  });

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
      subtitle="Log your and track your progress"
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
              const count =
                filter === 'All'
                  ? allStandaloneWorkouts.length
                  : filter === 'Favorites'
                    ? favorites.length
                    : filter === 'Pro'
                      ? allStandaloneWorkouts.filter((w) => w.isPremium).length
                      : allStandaloneWorkouts.filter(
                        (w) => w.category === filter
                      ).length;

              return (
                <Pill
                  key={filter}
                  onPress={() => handleSelectCategoryFilter(filter)}
                  isActive={isActive}
                  label={filter}
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

            <Pill
              onPress={() => setNoEquipmentOnly((prev) => !prev)}
              isActive={noEquipmentOnly}
              label="No equipment"
              icon="home-outline"
              count={
                allStandaloneWorkouts.filter((w) =>
                  workoutHasTag(w, NO_EQUIPMENT_TAG)
                ).length
              }
            />
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
              const count = allStandaloneWorkouts.filter((w) => {
                if (filter === '≤15 min') return w.estimatedTime <= 15;
                if (filter === '16-30 min')
                  return w.estimatedTime >= 16 && w.estimatedTime <= 30;
                if (filter === '31-45 min')
                  return w.estimatedTime >= 31 && w.estimatedTime <= 45;
                if (filter === '46+ min') return w.estimatedTime >= 46;
                return false;
              }).length;

              return (
                <Pill
                  key={filter}
                  onPress={() => setActiveTimeFilter(isActive ? null : filter)}
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
                {showS1AndS2 && womensPicksWorkouts.length > 0 && (
                  <View style={styles.curatedSection}>
                    <View style={styles.curatedSectionHeader}>
                      <View style={styles.curatedSectionHeaderRow}>
                        <Text style={styles.curatedSectionKicker}>Curated</Text>
                      </View>
                      <Text style={styles.curatedSectionTitle}>
                        Women’s Picks
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
                      <View style={styles.curatedSectionHeaderRow}>
                        <Text style={styles.curatedSectionKicker}>Curated</Text>
                      </View>
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
                      <View style={styles.curatedSectionHeaderRow}>
                        <Text style={styles.curatedSectionKicker}>Curated</Text>
                      </View>
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
