import { Colors } from '@/src/constants/theme';
import type { SingleWorkout } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';
import { workoutsListStyles as styles } from './workoutsListStyles';

type WorkoutCardProps = {
  workout: SingleWorkout;
  isFavorite: boolean;
  isPro: boolean;
  onToggleFavorite: (workoutId: string) => void;
  onPress: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
};

export function WorkoutCard({
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
