import { useSubscription } from "@/hooks/use-subscription";
import { allStandaloneWorkouts } from "@/src/data/workouts";
import type { SingleWorkout, WorkoutCategory } from "@/src/types/workouts";
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from "@/src/utils/storage";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TimeFilter = "≤15 min" | "16-30 min" | "31-45 min" | "46+ min" | null;
type CategoryFilter = "All" | WorkoutCategory | "Favorites" | "Pro";

const TIME_FILTERS: ("≤15 min" | "16-30 min" | "31-45 min" | "46+ min")[] = [
  "≤15 min",
  "16-30 min",
  "31-45 min",
  "46+ min",
];

const CATEGORY_FILTERS: CategoryFilter[] = [
  "All",
  "Favorites",
  "Pro",
  "Strength",
  "WOD",
  "Hyrox",
  "Conditioning",
  "Mobility",
];

const CATEGORY_ICONS: Record<WorkoutCategory, string> = {
  Strength: "barbell",
  WOD: "timer",
  Hyrox: "fitness",
  Conditioning: "heart",
  Mobility: "body",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  Beginner: "#c9b072",
  Intermediate: "#c9b072",
  Advanced: "#c9b072",
};

interface WorkoutCardProps {
  workout: SingleWorkout;
  isFavorite: boolean;
  isPro: boolean;
  onToggleFavorite: (workoutId: string) => void;
  onPress: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
}

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
    } else {
      onPress(workout);
    }
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
              color="#c9b072"
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
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#FF6B6B" : "#666"}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>{workout.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {workout.description}
      </Text>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={14} color="#888" />
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
  const [activeTimeFilter, setActiveTimeFilter] = useState<TimeFilter>(null);
  const [activeCategoryFilter, setActiveCategoryFilter] =
    useState<CategoryFilter>("All");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<SingleWorkout | null>(
    null
  );

  // Load favorites on mount and when screen is focused
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
    setSelectedWorkout(workout);
  };

  const handleCloseDetail = () => {
    setSelectedWorkout(null);
  };

  const handleLockedPress = () => {
    router.push("/paywall");
  };

  // Filter workouts based on active filters (time and category work together)
  const filteredWorkouts = allStandaloneWorkouts.filter((workout) => {
    // Apply time filter
    if (activeTimeFilter === "≤15 min" && workout.estimatedTime > 15)
      return false;
    if (
      activeTimeFilter === "16-30 min" &&
      (workout.estimatedTime < 16 || workout.estimatedTime > 30)
    )
      return false;
    if (
      activeTimeFilter === "31-45 min" &&
      (workout.estimatedTime < 31 || workout.estimatedTime > 45)
    )
      return false;
    if (activeTimeFilter === "46+ min" && workout.estimatedTime < 46)
      return false;

    // Apply category filter
    if (activeCategoryFilter === "All") return true;
    if (activeCategoryFilter === "Favorites")
      return favorites.includes(workout.id);
    if (activeCategoryFilter === "Pro") return workout.isPremium;
    return workout.category === activeCategoryFilter;
  });

  // Render workout detail modal
  if (selectedWorkout) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.detailHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleCloseDetail}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.detailTitle} numberOfLines={1}>
            {selectedWorkout.title}
          </Text>
          <TouchableOpacity
            style={styles.detailFavoriteButton}
            onPress={() => handleToggleFavorite(selectedWorkout.id)}
          >
            <Ionicons
              name={
                favorites.includes(selectedWorkout.id)
                  ? "heart"
                  : "heart-outline"
              }
              size={24}
              color={
                favorites.includes(selectedWorkout.id) ? "#FF6B6B" : "#FFFFFF"
              }
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.detailContent}
          contentContainerStyle={styles.detailContentContainer}
        >
          <View style={styles.detailMetaRow}>
            <View style={styles.detailCategoryBadge}>
              <Ionicons
                name={CATEGORY_ICONS[selectedWorkout.category] as any}
                size={14}
                color="#c9b072"
              />
              <Text style={styles.detailCategoryText}>
                {selectedWorkout.category}
              </Text>
            </View>
            <View style={styles.detailMetaItem}>
              <Ionicons name="time-outline" size={16} color="#888" />
              <Text style={styles.detailMetaText}>
                {selectedWorkout.estimatedTime} min
              </Text>
            </View>
            <View
              style={[
                styles.difficultyBadge,
                { borderColor: DIFFICULTY_COLORS[selectedWorkout.difficulty] },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: DIFFICULTY_COLORS[selectedWorkout.difficulty] },
                ]}
              >
                {selectedWorkout.difficulty}
              </Text>
            </View>
          </View>

          <Text style={styles.detailDescription}>
            {selectedWorkout.description}
          </Text>

          <View style={styles.detailTagsContainer}>
            {selectedWorkout.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {selectedWorkout.blocks.map((block, blockIndex) => (
            <View key={blockIndex} style={styles.blockContainer}>
              <Text style={styles.blockName}>{block.name}</Text>
              {block.instructions && (
                <Text style={styles.blockInstructions}>
                  {block.instructions}
                </Text>
              )}
              <View style={styles.movementsList}>
                {block.movements.map((movement, movementIndex) => {
                  const movementText =
                    typeof movement === "string"
                      ? movement
                      : `${movement.name}: ${movement.value}${movement.note ? ` (${movement.note})` : ""
                      }`;
                  return (
                    <View key={movementIndex} style={styles.movementItem}>
                      <Text style={styles.movementBullet}>•</Text>
                      <Text style={styles.movementText}>{movementText}</Text>
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Workouts</Text>
      </View>

      {/* Category filter tabs */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {CATEGORY_FILTERS.map((filter) => {
            const isActive = activeCategoryFilter === filter;
            const count =
              filter === "All"
                ? allStandaloneWorkouts.length
                : filter === "Favorites"
                  ? favorites.length
                  : filter === "Pro"
                    ? allStandaloneWorkouts.filter((w) => w.isPremium).length
                    : allStandaloneWorkouts.filter((w) => w.category === filter)
                      .length;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveCategoryFilter(filter)}
              >
                {filter === "Favorites" && (
                  <Ionicons
                    name="heart"
                    size={14}
                    color={isActive ? "#121212" : "#888"}
                    style={styles.filterIcon}
                  />
                )}
                {filter === "Pro" && (
                  <Ionicons
                    name="star"
                    size={14}
                    color={isActive ? "#121212" : "#888"}
                    style={styles.filterIcon}
                  />
                )}
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {filter}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    isActive && styles.filterCountActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Time filter tabs */}
      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScrollContent}
        >
          {TIME_FILTERS.map((filter) => {
            const isActive = activeTimeFilter === filter;
            const count = allStandaloneWorkouts.filter((w) => {
              if (filter === "≤15 min") return w.estimatedTime <= 15;
              if (filter === "16-30 min")
                return w.estimatedTime >= 16 && w.estimatedTime <= 30;
              if (filter === "31-45 min")
                return w.estimatedTime >= 31 && w.estimatedTime <= 45;
              if (filter === "46+ min") return w.estimatedTime >= 46;
              return false;
            }).length;

            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterTab, isActive && styles.filterTabActive]}
                onPress={() => setActiveTimeFilter(isActive ? null : filter)}
              >
                <Ionicons
                  name="time-outline"
                  size={14}
                  color={isActive ? "#121212" : "#888"}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    isActive && styles.filterTabTextActive,
                  ]}
                >
                  {filter}
                </Text>
                <Text
                  style={[
                    styles.filterCount,
                    isActive && styles.filterCountActive,
                  ]}
                >
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Workout list */}
      {filteredWorkouts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons
            name={
              activeCategoryFilter === "Favorites" ? "heart-outline" : "barbell"
            }
            size={64}
            color="#333"
          />
          <Text style={styles.emptyTitle}>
            {activeCategoryFilter === "Favorites"
              ? "No Favorites Yet"
              : "No Workouts Found"}
          </Text>
          <Text style={styles.emptyDescription}>
            {activeCategoryFilter === "Favorites"
              ? "Tap the heart icon on any workout to save it here."
              : "Try selecting a different filter."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredWorkouts}
          keyExtractor={(item) => item.id}
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  categoryFilterContainer: {
    // No border for category filters - they're on the first row
  },
  filterContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  filterScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1E1E1E",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  filterTabActive: {
    backgroundColor: "#c9b072",
    borderColor: "#c9b072",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterTabText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "600",
  },
  filterTabTextActive: {
    color: "#121212",
  },
  filterCount: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  filterCountActive: {
    color: "#121212",
    opacity: 0.7,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  workoutCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  workoutCardLocked: {
    borderColor: "#c9b072",
    borderWidth: 2,
    opacity: 0.6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
  },
  cardCategory: {
    color: "#888",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  premiumBadge: {
    backgroundColor: "#c9b072",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  premiumBadgeText: {
    color: "#121212",
    fontSize: 10,
    fontWeight: "700",
  },
  favoriteButton: {
    padding: 4,
  },
  cardTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardDescription: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: "#888",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    color: "#888",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  // Detail view styles
  detailHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  detailTitle: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  detailFavoriteButton: {
    padding: 8,
  },
  detailContent: {
    flex: 1,
  },
  detailContentContainer: {
    padding: 20,
  },
  detailMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  detailCategoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  detailCategoryText: {
    color: "#c9b072",
    fontSize: 12,
    fontWeight: "600",
  },
  detailMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailMetaText: {
    color: "#888",
    fontSize: 14,
    fontWeight: "500",
  },
  detailDescription: {
    color: "#CCC",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  detailTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  blockContainer: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  blockName: {
    color: "#c9b072",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  blockInstructions: {
    color: "#888",
    fontSize: 14,
    fontStyle: "italic",
    marginBottom: 12,
    lineHeight: 20,
  },
  movementsList: {
    gap: 8,
  },
  movementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  movementBullet: {
    color: "#c9b072",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  movementText: {
    color: "#FFFFFF",
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
});
