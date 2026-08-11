import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { Spacing } from '@/src/constants/theme';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import { useSubscription } from '@/src/hooks/use-subscription';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  getFavoriteWorkouts,
  toggleFavoriteWorkout,
} from '@/src/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';

type SkillWorkoutsProps = {
  workoutsIds: string[];
};

export function SkillWorkouts({ workoutsIds }: SkillWorkoutsProps) {
  const posthog = usePostHog();
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const [favorites, setFavorites] = useState<string[]>([]);

  const workouts = useMemo(() => {
    const resolved: SingleWorkout[] = [];
    for (const id of workoutsIds) {
      const workout = getStandaloneWorkoutById(id);
      if (workout) {
        resolved.push(workout);
      }
    }
    return resolved;
  }, [workoutsIds]);

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const favs = await getFavoriteWorkouts();
          setFavorites(favs);
        } catch (error) {
          console.error('Failed to load favorite workouts:', error);
        }
      })();
    }, [])
  );

  if (workouts.length === 0) {
    return null;
  }

  const handlePress = (workout: SingleWorkout) => {
    router.push({
      pathname: '/workouts/[id]',
      params: { id: workout.id, view_source: 'browse' },
    });
  };

  const handleLockedPress = () => {
    router.push('/records');
  };

  const handleToggleFavorite = async (workout: SingleWorkout) => {
    const newStatus = await toggleFavoriteWorkout(workout.id);
    posthog.capture(posthogEventsNames.workout.favourite, {
      workout_name: workout.title,
      action: newStatus ? 'add' : 'remove',
    });
    if (newStatus) {
      setFavorites((prev) => [...prev, workout.id]);
    } else {
      setFavorites((prev) => prev.filter((id) => id !== workout.id));
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scrollBleed}
      contentContainerStyle={styles.list}
    >
      {workouts.map((workout) => (
        <View key={workout.id} style={{ width: cardWidth }}>
          <WorkoutCard
            workout={workout}
            isFavorite={favorites.includes(workout.id)}
            isPro={isPro || subscriptionLoading}
            onToggleFavorite={handleToggleFavorite}
            onPress={handlePress}
            onLockedPress={handleLockedPress}
            style={styles.card}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollBleed: {
    marginHorizontal: -Spacing.xxl,
  },
  list: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  card: {
    marginBottom: 0,
  },
});
