import { Badge, PressableCard } from '@/src/components/ds';
import {
  TEMPERED_DAILY_NAME,
  TEMPERED_DAILY_REST_DAY_UPSELL,
} from '@/src/components/temperedDaily/temperedDailyConstants';
import { color, space, typography } from '@/src/constants/tokens';
import type { SingleWorkout } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type RestDayTemperedDailyCardProps = {
  workout: SingleWorkout;
  theme: string;
  showProBadge: boolean;
  onPress: () => void;
};

/** Compact Tempered Daily prompt for program rest days. */
export function RestDayTemperedDailyCard({
  workout,
  theme,
  showProBadge,
  onPress,
}: RestDayTemperedDailyCardProps) {
  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={`${TEMPERED_DAILY_REST_DAY_UPSELL} ${TEMPERED_DAILY_NAME}, ${workout.title}, ${theme}, ${workout.estimatedTime} minutes`}
      accessibilityHint={
        showProBadge ? 'Pro workout. Opens the workout' : 'Opens the workout'
      }
    >
      <View style={styles.content}>
        <View style={styles.headingRow}>
          <Text style={styles.overline}>{TEMPERED_DAILY_NAME}</Text>
          {showProBadge ? <Badge label="PRO" /> : null}
        </View>
        <Text style={styles.title}>{TEMPERED_DAILY_REST_DAY_UPSELL}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.workoutTitle} numberOfLines={1}>
            {workout.title}
          </Text>
          <Text style={styles.theme}>{theme}</Text>
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
    gap: space.xxs,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  overline: {
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
  workoutTitle: {
    ...typography.calloutStrong,
    color: color.textSecondary,
    flexShrink: 1,
  },
  theme: {
    ...typography.captionStrong,
    color: color.gold,
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
});
