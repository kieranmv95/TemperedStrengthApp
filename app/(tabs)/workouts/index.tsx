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
import { Colors } from '@/src/constants/theme';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
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

export default function WorkoutsScreen() {
  const { isPro } = useSubscription();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteWorkouts();
    setFavorites(favs);
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
                  onPress={() => setActiveCategoryFilter(filter)}
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
          </ScrollView>
        </View>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filterScrollContent,
              styles.lastFilterScrollContent,
            ]}
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
