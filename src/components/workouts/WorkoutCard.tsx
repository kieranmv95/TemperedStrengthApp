import { Badge, PressableCard, Tag } from '@/src/components/ds';
import { categoryFilterDisplayLabel } from '@/src/components/workouts/workoutsScreenConstants';
import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import { useMotion } from '@/src/hooks/useMotion';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  isWorkoutLocked,
  premiumAccessBadgeLabel,
} from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Image,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { CATEGORY_ICONS } from './workoutUiConstants';

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
  /** Stretch to the parent's height, e.g. to match siblings in a carousel row. */
  fill?: boolean;
};

const CATEGORY_ICON_SIZE = 14;
const HEART_POP_PEAK = 1.25;
const MAX_TAGS = 3;

type FavouriteButtonProps = {
  title: string;
  isFavorite: boolean;
  onPress: () => void;
};

function FavouriteButton({ title, isFavorite, onPress }: FavouriteButtonProps) {
  const motionHelpers = useMotion();
  const scale = useSharedValue(1);
  const wasFavorite = useRef(isFavorite);

  useEffect(() => {
    if (isFavorite && !wasFavorite.current) {
      scale.set(motionHelpers.bounce(HEART_POP_PEAK));
    }
    wasFavorite.current = isFavorite;
  }, [isFavorite, scale, motionHelpers]);

  const popStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.get() }],
  }));

  const handlePress = () => {
    AccessibilityInfo.announceForAccessibility(
      isFavorite ? 'Removed from favourites' : 'Added to favourites'
    );
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      style={styles.favouriteButton}
      accessibilityRole="button"
      accessibilityLabel={`Favourite ${title}`}
      accessibilityState={{ selected: isFavorite }}
    >
      <Animated.View style={popStyle}>
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? color.gold : color.textSecondary}
        />
      </Animated.View>
    </Pressable>
  );
}

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
  fill = false,
}: WorkoutCardProps) {
  const isLocked = isWorkoutLocked(workout, { isPro, roles });
  const premiumBadge = premiumAccessBadgeLabel(workout.allowedRoles);
  const categoryLabel = categoryFilterDisplayLabel(workout.category);

  const handlePress = () => {
    if (isLocked) {
      onLockedPress();
      return;
    }
    onPress(workout);
  };

  const accessibilityLabel = [
    workout.title,
    categoryLabel,
    `${workout.estimatedTime} minutes`,
    workout.difficulty,
    workout.isPremium ? premiumBadge : null,
    isLocked ? 'locked' : null,
  ]
    .filter((part): part is string => !!part)
    .join(', ');

  return (
    <View style={[styles.container, fill && styles.fill, style]}>
      <PressableCard
        onPress={handlePress}
        showChevron={false}
        fill={fill}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={
          isLocked ? 'Opens the You tab to unlock this workout' : undefined
        }
        style={styles.card}
      >
        <View style={styles.header}>
          {workout.category === 'Rainhill' ? (
            <Image
              source={require('@/assets/images/logos/rainhill_icon.png')}
              style={styles.categoryImage}
            />
          ) : (
            <Ionicons
              name={
                CATEGORY_ICONS[
                  workout.category
                ] as keyof typeof Ionicons.glyphMap
              }
              size={CATEGORY_ICON_SIZE}
              color={color.gold}
            />
          )}
          <Text style={styles.category} numberOfLines={1}>
            {categoryLabel}
          </Text>
          {workout.isPremium ? <Badge label={premiumBadge} /> : null}
        </View>

        <Text style={styles.title} numberOfLines={hideTags ? 2 : undefined}>
          {workout.title}
        </Text>
        <Text style={styles.description} numberOfLines={1}>
          {workout.description}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="time-outline"
              size={16}
              color={color.textSecondary}
            />
            <Text style={styles.metaText}>{workout.estimatedTime} min</Text>
          </View>
          <Badge label={workout.difficulty} tone="neutral" />
          {isLocked ? (
            <View style={styles.metaItem}>
              <Ionicons name="lock-closed" size={14} color={color.gold} />
              <Text style={styles.lockedText}>Unlock with Pro</Text>
            </View>
          ) : null}
        </View>

        {hideTags || workout.tags.length === 0 ? null : (
          <View style={styles.tags}>
            {workout.tags.slice(0, MAX_TAGS).map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </View>
        )}
      </PressableCard>
      <FavouriteButton
        title={workout.title}
        isFavorite={isFavorite}
        onPress={() => onToggleFavorite(workout)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: space.xs,
  },
  fill: {
    flex: 1,
  },
  card: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE - space.md,
    paddingRight: MIN_TARGET_SIZE,
  },
  categoryImage: {
    width: CATEGORY_ICON_SIZE + space.xxs,
    height: CATEGORY_ICON_SIZE + space.xxs,
  },
  category: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
    marginTop: space.xxs,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  metaText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  lockedText: {
    ...typography.captionStrong,
    color: color.gold,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.sm,
  },
  favouriteButton: {
    position: 'absolute',
    top: space.xxs,
    right: space.xxs,
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
