import { restDayCarouselStyles as styles } from '@/src/components/rest/restDayCarouselStyles';
import { WorkoutCard } from '@/src/components/workouts/WorkoutCard';
import { getStandaloneWorkoutById } from '@/src/data/workouts';
import type { SingleWorkout } from '@/src/types/workouts';
import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

type RestDayWorkoutCarouselProps = {
  workoutIds: string[];
  favorites: string[];
  isPro: boolean;
  roles: string[];
  onToggleFavorite: (workout: SingleWorkout) => void;
  onLockedPress: () => void;
};

export function RestDayWorkoutCarousel({
  workoutIds,
  favorites,
  isPro,
  roles,
  onToggleFavorite,
  onLockedPress,
}: RestDayWorkoutCarouselProps) {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = windowWidth * 0.6;

  const workouts = useMemo(() => {
    const resolved: SingleWorkout[] = [];
    for (const id of workoutIds) {
      const workout = getStandaloneWorkoutById(id);
      if (workout) {
        resolved.push(workout);
      }
    }
    return resolved;
  }, [workoutIds]);

  if (workouts.length === 0) {
    return null;
  }

  const handlePress = (workout: SingleWorkout) => {
    router.push(`/workout/${workout.id}?view_source=rest_day`);
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
            isPro={isPro}
            roles={roles}
            onToggleFavorite={onToggleFavorite}
            onPress={handlePress}
            onLockedPress={onLockedPress}
            style={styles.card}
            hideTags
          />
        </View>
      ))}
    </ScrollView>
  );
}
