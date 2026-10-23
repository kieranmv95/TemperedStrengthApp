import { Badge, PressableCard, Tag } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import type { SingleWorkout } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  getTemperedDailyWorkoutLabels,
  TEMPERED_DAILY_REST_DAY_TITLE,
} from './temperedDailyConstants';

type TemperedDailyDayCardProps = {
  dayLabel: string;
  /** Null on a rest day. */
  workout: SingleWorkout | null;
  isToday: boolean;
  showProBadge: boolean;
  onPress: (workoutId: string) => void;
};

/** One day of the week: the scheduled workout, or a rest day. */
export function TemperedDailyDayCard({
  dayLabel,
  workout,
  isToday,
  showProBadge,
  onPress,
}: TemperedDailyDayCardProps) {
  const dayText = isToday ? `${dayLabel} · Today` : dayLabel;

  if (!workout) {
    return (
      <View
        style={styles.restCard}
        accessible
        accessibilityLabel={`${dayText}, ${TEMPERED_DAILY_REST_DAY_TITLE}`}
      >
        <Text style={styles.day}>{dayText}</Text>
        <Text style={styles.title}>{TEMPERED_DAILY_REST_DAY_TITLE}</Text>
      </View>
    );
  }

  const labels = getTemperedDailyWorkoutLabels(workout);

  return (
    <PressableCard
      onPress={() => onPress(workout.id)}
      accessibilityLabel={`${dayText}, ${workout.title}, ${labels.join(', ')}, ${workout.estimatedTime} minutes`}
      accessibilityHint={
        showProBadge ? 'Pro workout. Opens the workout' : 'Opens the workout'
      }
    >
      <View style={styles.content}>
        <View style={styles.dayRow}>
          <Text style={styles.day}>{dayText}</Text>
          {showProBadge ? <Badge label="PRO" /> : null}
        </View>
        <Text style={styles.title}>{workout.title}</Text>
        <View style={styles.metaRow}>
          {labels.map((label) => (
            <Tag key={label} label={label} />
          ))}
          <View style={styles.time}>
            <Ionicons
              name="time-outline"
              size={14}
              color={color.textSecondary}
            />
            <Text style={styles.timeText}>{workout.estimatedTime} min</Text>
          </View>
        </View>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.xs,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  day: {
    ...typography.overline,
    color: color.textTertiary,
  },
  title: {
    ...typography.headline,
    color: color.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  timeText: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  restCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
});
