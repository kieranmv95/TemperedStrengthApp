import { StandardLayout } from '@/src/components/ds';
import { WorkoutDetailScrollContent } from '@/src/components/workouts/WorkoutDetailScrollContent';
import { workoutDetailStyles as styles } from '@/src/components/workouts/workoutDetailStyles';
import { color } from '@/src/constants/tokens';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import { useRoles } from '@/src/hooks/useRoles';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import { asStringId } from '@/src/utils/routeParams';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { isWorkoutLocked } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router, useLocalSearchParams } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { AccessibilityInfo, Pressable, Text, View } from 'react-native';

const VIEW_SOURCES = new Set(['browse', 'search', 'programme', 'skills']);
const STATE_ICON_SIZE = 48;

export default function StandaloneWorkoutDetailScreen() {
  const { id: idParam, view_source: viewSourceParam } = useLocalSearchParams<{
    id?: string;
    view_source?: string;
  }>();
  const posthog = usePostHog();
  const workoutId = asStringId(idParam);
  const workout = useMemo(() => {
    if (!workoutId) return undefined;
    return getStandaloneWorkoutById(workoutId);
  }, [workoutId]);

  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const [favorites, setFavorites] = useState<string[]>([]);

  const viewSource =
    typeof viewSourceParam === 'string' && VIEW_SOURCES.has(viewSourceParam)
      ? viewSourceParam
      : 'browse';

  useFocusEffect(
    useCallback(() => {
      if (!workoutId || !workout) {
        return;
      }
      posthog.capture(posthogEventsNames.workout.view, {
        workout_name: workout.title,
        source: viewSource,
      });
    }, [workoutId, workout, viewSource, posthog])
  );

  const loadFavorites = async () => {
    const favs = await getFavoriteWorkouts();
    setFavorites(favs);
  };

  useFocusEffect(
    useCallback(() => {
      void loadFavorites();
    }, [])
  );

  const handleToggleFavorite = async (w: NonNullable<typeof workout>) => {
    const newStatus = await toggleFavoriteWorkout(w.id);
    posthog.capture(posthogEventsNames.workout.favourite, {
      workout_name: w.title,
      action: newStatus ? 'add' : 'remove',
    });
    if (newStatus) {
      setFavorites((prev) => [...prev, w.id]);
    } else {
      setFavorites((prev) => prev.filter((x) => x !== w.id));
    }
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  if (!workoutId || !workout) {
    return (
      <StandardLayout
        title="Workout"
        onBackPress={() => router.back()}
        disableScroll
      >
        <StandardLayout.Body>
          <View style={styles.emptyState}>
            <Ionicons
              name="barbell-outline"
              size={STATE_ICON_SIZE}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              Workout not found
            </Text>
            <Text style={styles.emptyDescription}>
              This workout may have been removed or the link is invalid.
            </Text>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const isLocked = !accessLoading && isWorkoutLocked(workout, { isPro, roles });
  const isFavorite = favorites.includes(workout.id);

  const handleFavoritePress = () => {
    AccessibilityInfo.announceForAccessibility(
      isFavorite ? 'Removed from favourites' : 'Added to favourites'
    );
    void handleToggleFavorite(workout);
  };

  return (
    <StandardLayout
      title={workout.title}
      onBackPress={() => router.back()}
      disableScroll
      edgeToEdgeBody
      titleAccessory={
        <Pressable
          style={styles.detailFavoriteButton}
          onPress={handleFavoritePress}
          disabled={isLocked}
          accessibilityRole="button"
          accessibilityLabel={`Favourite ${workout.title}`}
          accessibilityState={{ selected: isFavorite, disabled: isLocked }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={
              isLocked
                ? color.textDisabled
                : isFavorite
                  ? color.gold
                  : color.textSecondary
            }
          />
        </Pressable>
      }
    >
      <StandardLayout.Body>
        {isLocked ? (
          <View style={styles.lockedState}>
            <Ionicons
              name="lock-closed"
              size={STATE_ICON_SIZE}
              color={color.textSecondary}
            />
            <Text style={styles.lockedTitle} accessibilityRole="header">
              Pro workout
            </Text>
            <Text style={styles.lockedDescription}>
              Upgrade to Pro to unlock this workout.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.lockedCta,
                pressed && styles.lockedCtaPressed,
              ]}
              onPress={handleLockedPress}
              accessibilityRole="button"
              accessibilityLabel="Unlock with Pro"
              accessibilityHint="Opens the You tab"
            >
              <Text style={styles.lockedCtaText}>Unlock with Pro</Text>
              <Ionicons name="chevron-forward" size={18} color={color.onGold} />
            </Pressable>
          </View>
        ) : (
          <WorkoutDetailScrollContent workout={workout} />
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
