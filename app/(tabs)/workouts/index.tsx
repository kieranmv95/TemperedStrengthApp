import { Pill } from '@/src/components/pill';
import { StandardLayout } from '@/src/components/StandardLayout';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { SingleWorkout, WorkoutCategory } from '@/src/types/workouts';
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
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type TimeFilter = '≤15 min' | '16-30 min' | '31-45 min' | '46+ min' | null;
type CategoryFilter = 'All' | WorkoutCategory | 'Favorites' | 'Pro';

const TIME_FILTERS: ('≤15 min' | '16-30 min' | '31-45 min' | '46+ min')[] = [
  '≤15 min',
  '16-30 min',
  '31-45 min',
  '46+ min',
];

const CATEGORY_FILTERS: CategoryFilter[] = [
  'All',
  'Favorites',
  'Pro',
  'Strength',
  'WOD',
  'Hyrox',
  'Conditioning',
  'Mobility',
];

const CATEGORY_ICONS: Record<WorkoutCategory, string> = {
  Strength: 'barbell',
  WOD: 'timer',
  Hyrox: 'fitness',
  Conditioning: 'heart',
  Mobility: 'body',
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: Colors.accent,
  Intermediate: Colors.accent,
  Advanced: Colors.accent,
};

type WorkoutCardProps = {
  workout: SingleWorkout;
  isFavorite: boolean;
  isPro: boolean;
  onToggleFavorite: (workoutId: string) => void;
  onPress: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
};

function WorkoutCard({
  workout,
  isFavorite,
  isPro,
  onToggleFavorite,
  onPress,
  onLockedPress,
}: WorkoutCardProps) {
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
      style={[styles.workoutCard, isLocked && styles.workoutCardLocked]}
      onPress={handlePress}
      activeOpacity={isLocked ? 0.5 : 0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.categoryIcon}>
            <Ionicons
              name={CATEGORY_ICONS[workout.category] as any}
              size={16}
              color={Colors.accent}
            />
          </View>
          <Text style={styles.cardCategory}>{workout.category}</Text>
          {workout.isPremium && (
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>PRO</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(workout.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? Colors.destructive : Colors.textPlaceholder}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>{workout.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {workout.description}
      </Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.metaText}>{workout.estimatedTime} min</Text>
        </View>
        <View
          style={[
            styles.difficultyBadge,
            { borderColor: DIFFICULTY_COLORS[workout.difficulty] },
          ]}
        >
          <Text
            style={[
              styles.difficultyText,
              { color: DIFFICULTY_COLORS[workout.difficulty] },
            ]}
          >
            {workout.difficulty}
          </Text>
        </View>
      </View>

      <View style={styles.tagsContainer}>
        {workout.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
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
      <StandardLayout.Filters>
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
                      : allStandaloneWorkouts.filter((w) => w.category === filter)
                        .length;

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
            contentContainerStyle={[styles.filterScrollContent, styles.lastFilterScrollContent]}
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
      </StandardLayout.Filters>
      <StandardLayout.Body>
        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name={
                activeCategoryFilter === 'Favorites' ? 'heart-outline' : 'barbell'
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

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    padding: 0,
  },
  filterScrollContent: {
    paddingBottom: Spacing.xl,
    gap: Spacing.md,
  },
  lastFilterScrollContent: {
    paddingBottom: 0,
  },
  listContent: {
    paddingTop: Spacing.xxl,
  },
  workoutCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  workoutCardLocked: {
    borderColor: Colors.accent,
    borderWidth: 2,
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCategory: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  premiumBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxs,
    fontWeight: '700',
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  cardDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xl,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.xxl,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
});

