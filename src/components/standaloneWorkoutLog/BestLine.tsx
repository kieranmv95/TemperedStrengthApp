import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import { computeBestDurationEntry } from '@/src/utils/standaloneWorkoutLogForm';
import { formatDurationSeconds } from '@/src/utils/standaloneWorkoutLogFormat';
import React from 'react';
import { Text } from 'react-native';
import { standaloneWorkoutLogPanelStyles as styles } from './standaloneWorkoutLogPanelStyles';

type BestLineProps = {
  workout: SingleWorkout;
  logs: StandaloneWorkoutLogEntry[];
};

export function BestLine({ workout, logs }: BestLineProps) {
  const best = computeBestDurationEntry(logs, workout.logSchema);
  if (!best) {
    return null;
  }
  return (
    <Text style={styles.bestLine}>
      Personal best: {formatDurationSeconds(best.payload.durationSeconds)}
    </Text>
  );
}
