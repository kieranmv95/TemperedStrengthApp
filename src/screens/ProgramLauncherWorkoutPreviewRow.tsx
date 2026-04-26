import { getExerciseById } from '@/src/data/exercises';
import type { Workout } from '@/src/types/program';
import React from 'react';
import { Text, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherWorkoutPreviewRowProps = {
  workout: Workout;
};

export function ProgramLauncherWorkoutPreviewRow({
  workout,
}: ProgramLauncherWorkoutPreviewRowProps) {
  const isV2 = workout.format === 'v2';

  const exerciseNames = !isV2
    ? workout.exercises
        .filter((ex) => ex.type === 'exercise')
        .map((ex) => (ex as { id: number }).id)
        .map((id) => getExerciseById(id)?.name)
        .filter((name): name is string => name !== undefined)
    : [];

  const blockTitles = isV2
    ? workout.blocks.map((b) => b.title).filter((t) => t.trim().length > 0)
    : [];

  return (
    <View style={styles.workoutItem}>
      <Text style={styles.workoutLabel}>{workout.label}</Text>
      {workout.description && (
        <Text style={styles.workoutDescription}>{workout.description}</Text>
      )}
      {exerciseNames.length > 0 ? (
        <Text style={styles.workoutExercisesList}>
          {exerciseNames.join(', ')}
        </Text>
      ) : blockTitles.length > 0 ? (
        <Text style={styles.workoutExercisesList}>
          {blockTitles.join(' • ')}
        </Text>
      ) : null}
      <View style={styles.workoutMeta}>
        <Text style={styles.workoutExercises}>
          {isV2 ? `${workout.blocks.length} blocks` : `${workout.exercises.length} exercises`}
        </Text>
        <View style={styles.workoutIntensity}>
          <Text style={styles.workoutIntensityLabel}>Intensity:</Text>
          <View style={styles.workoutIntensityBar}>
            {Array.from({ length: 10 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.workoutIntensityDot,
                  i < workout.intensity && styles.workoutIntensityDotFilled,
                ]}
              />
            ))}
          </View>
          <Text style={styles.workoutIntensityValue}>
            {workout.intensity}/10
          </Text>
        </View>
      </View>
    </View>
  );
}
