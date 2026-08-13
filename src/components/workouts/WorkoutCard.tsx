import { Colors } from '@/src/constants/theme';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  isWorkoutLocked,
  premiumAccessBadgeLabel,
} from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Card } from '../ds';
import { CATEGORY_ICONS, DIFFICULTY_COLORS } from './workoutUiConstants';
import { workoutsListStyles as styles } from './workoutsListStyles';

type WorkoutCardProps = {
  workout: SingleWorkout;
  isFavorite: boolean;
  isPro: boolean;
  /** App roles (e.g. coach) checked against workout.allowedRoles. */
  roles?: string[];
  onToggleFavorite: (workout: SingleWorkout) => void;
  onPress: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
  style?: StyleProp<ViewStyle>;
  /** Hide tag pills (compact carousel cards). */
  hideTags?: boolean;
};

export function WorkoutCard({
  workout,
  isFavorite,
  isPro,
  roles = [],
  onToggleFavorite,
  onPress,
  onLockedPress,
  style,
  hideTags = false,
}: WorkoutCardProps) {
  const isLocked = isWorkoutLocked(workout, { isPro, roles });
  const premiumBadge = premiumAccessBadgeLabel(workout.allowedRoles);

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(workout);
  };

  return (
    <Card
      style={[
        styles.workoutCard,
        isLocked && styles.workoutCardLocked,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityLabel="Open workout"
    >
      <View style={hideTags ? localStyles.compactBody : undefined}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleRow}>
            <View style={styles.categoryIcon}>
              {workout.category === 'Rainhill' ? (
                <Image
                  source={require('@/assets/images/logos/rainhill_icon.png')}
                  style={styles.sponsorLogo}
                />
              ) : (
                <Ionicons
                  name={CATEGORY_ICONS[workout.category] as any}
                  size={14}
                  color={Colors.accent}
                />
              )}
            </View>
            <Text style={styles.cardCategory}>{workout.category}</Text>
            {workout.isPremium ? (
              <View style={styles.premiumBadge}>
                <Text style={styles.premiumBadgeText}>{premiumBadge}</Text>
              </View>
            ) : (
              <View style={localStyles.premiumBadgeSpacer} />
            )}
          </View>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => onToggleFavorite(workout)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? Colors.destructive : Colors.textPlaceholder}
            />
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.cardTitle, hideTags && localStyles.compactTitle]}
          numberOfLines={hideTags ? 2 : undefined}
        >
          {workout.title}
        </Text>
        <Text style={styles.cardDescription} numberOfLines={1}>
          {workout.description}
        </Text>

        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={Colors.accent} />
            <Text style={styles.metaTimeText}>{workout.estimatedTime} min</Text>
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

        {hideTags ? null : (
          <View style={styles.tagsContainer}>
            {workout.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </Card>
  );
}

const localStyles = StyleSheet.create({
  compactBody: {
    flex: 1,
    width: '100%',
  },
  compactTitle: {
    minHeight: 44,
    lineHeight: 22,
  },
  /** Keeps header height stable when a card has no PRO badge. */
  premiumBadgeSpacer: {
    height: 16,
    width: 1,
  },
});

