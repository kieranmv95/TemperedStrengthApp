import { GlossaryText } from '@/src/components/glossary/GlossaryText';
import { getExerciseById } from '@/src/data/exercises';
import type { Workout } from '@/src/types/program';
import { Text, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherWorkoutPreviewRowProps = {
  workout: Workout;
  showIntensity?: boolean;
};

export function ProgramLauncherWorkoutPreviewRow({
  workout,
  showIntensity = true,
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
      <GlossaryText
        text={workout.label}
        style={styles.workoutLabel}
        accessibilityRole="header"
      />
      {workout.description ? (
        <GlossaryText
          text={workout.description}
          style={styles.workoutDescription}
        />
      ) : null}
      {exerciseNames.length > 0 ? (
        <GlossaryText
          text={exerciseNames.join(', ')}
          style={styles.workoutExercisesList}
        />
      ) : blockTitles.length > 0 ? (
        <GlossaryText
          text={blockTitles.join(' · ')}
          style={styles.workoutExercisesList}
        />
      ) : null}
      <View style={styles.workoutMeta}>
        <Text style={styles.workoutExercises}>
          {isV2
            ? `${workout.blocks.length} blocks`
            : `${workout.exercises.length} exercises`}
        </Text>
        {showIntensity ? (
          <View
            style={styles.workoutIntensity}
            accessible
            accessibilityLabel={`Intensity ${workout.intensity} out of 10`}
          >
            <Text style={styles.workoutIntensityLabel}>Intensity</Text>
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
        ) : null}
      </View>
    </View>
  );
}
