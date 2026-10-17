import { color } from '@/src/constants/tokens';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import { computeBestDurationEntry } from '@/src/utils/standaloneWorkoutLogForm';
import { formatDurationSeconds } from '@/src/utils/standaloneWorkoutLogFormat';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
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
  const bestTime = formatDurationSeconds(best.payload.durationSeconds);
  return (
    <View
      style={styles.bestLine}
      accessible
      accessibilityLabel={`Personal best: ${bestTime}`}
    >
      <Ionicons name="trophy-outline" size={16} color={color.gold} />
      <Text style={styles.bestLineText}>Personal best: {bestTime}</Text>
    </View>
  );
}
