import { Badge, Tag } from '@/src/components/ds';
import {
  getTemperedDailyWorkoutLabels,
  TEMPERED_DAILY_NAME,
  TEMPERED_DAILY_NEW_WEEK_DROPS,
  TEMPERED_DAILY_REST_DAY_BODY,
  TEMPERED_DAILY_REST_DAY_TITLE,
  TEMPERED_DAILY_TEASER_BODY,
  TEMPERED_DAILY_TODAY_HEADING,
  TEMPERED_DAILY_VIEW_WEEK,
} from '@/src/components/temperedDaily/temperedDailyConstants';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { SingleWorkout } from '@/src/types/workouts';
import type { TemperedDailyToday } from '@/src/utils/temperedDaily';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type TemperedDailyWidgetProps = {
  today: TemperedDailyToday;
  /** Resolved from `today.workoutId`; null on a rest day or with no content. */
  workout: SingleWorkout | null;
  date: Date;
  showProBadge: boolean;
  onOpenWorkout: (workoutId: string) => void;
  onOpenWeek: () => void;
};

function formatWidgetDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

/** Home card for Tempered Daily. Shown to Pro and free users alike. */
export function TemperedDailyWidget({
  today,
  workout,
  date,
  showProBadge,
  onOpenWorkout,
  onOpenWeek,
}: TemperedDailyWidgetProps) {
  const { week, dayIndex } = today;
  const dateLabel = formatWidgetDate(date);

  const renderHeading = () => (
    <View style={styles.headingRow}>
      <View style={styles.heading}>
        <Text style={styles.overline}>{TEMPERED_DAILY_TODAY_HEADING}</Text>
        <Text style={styles.dateLine}>
          {dateLabel}
          {week ? (
            <>
              {' · '}
              <Text style={styles.theme}>{week.theme}</Text>
            </>
          ) : null}
        </Text>
      </View>
      {showProBadge ? (
        <Badge label="PRO" accessibilityLabel="Pro feature" />
      ) : null}
    </View>
  );

  const renderBody = () => {
    if (!week) {
      return (
        <View style={styles.body}>
          {renderHeading()}
          <Text style={styles.title}>{TEMPERED_DAILY_NAME}</Text>
          <Text style={styles.description}>{TEMPERED_DAILY_TEASER_BODY}</Text>
          <Text style={styles.dropLine}>{TEMPERED_DAILY_NEW_WEEK_DROPS}</Text>
        </View>
      );
    }

    if (dayIndex === null) {
      return (
        <View style={styles.body}>
          {renderHeading()}
          <Text style={styles.title}>{TEMPERED_DAILY_NAME}</Text>
          <Text style={styles.dropLine}>{TEMPERED_DAILY_NEW_WEEK_DROPS}</Text>
        </View>
      );
    }

    if (!workout) {
      return (
        <View style={styles.body}>
          {renderHeading()}
          <Text style={styles.title}>{TEMPERED_DAILY_REST_DAY_TITLE}</Text>
          <Text style={styles.description}>{TEMPERED_DAILY_REST_DAY_BODY}</Text>
        </View>
      );
    }

    const labels = getTemperedDailyWorkoutLabels(workout);
    return (
      <Pressable
        onPress={() => onOpenWorkout(workout.id)}
        style={({ pressed }) => [styles.body, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={`${TEMPERED_DAILY_TODAY_HEADING}, ${week.theme}, ${workout.title}, ${workout.estimatedTime} minutes, ${labels.join(', ')}`}
        accessibilityHint={
          showProBadge ? 'Pro workout. Opens the workout' : 'Opens the workout'
        }
      >
        {renderHeading()}
        <View style={styles.titleRow}>
          <Text style={[styles.title, styles.titleFlex]}>{workout.title}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={color.textTertiary}
          />
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {workout.description}
        </Text>
        <View style={styles.metaRow}>
          <View style={styles.time}>
            <Ionicons
              name="time-outline"
              size={16}
              color={color.textSecondary}
            />
            <Text style={styles.timeText}>{workout.estimatedTime} min</Text>
          </View>
          {labels.map((label) => (
            <Tag key={label} label={label} />
          ))}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.card}>
      {renderBody()}
      <View style={styles.divider} />
      <Pressable
        onPress={onOpenWeek}
        style={({ pressed }) => [styles.weekRow, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={TEMPERED_DAILY_VIEW_WEEK}
        accessibilityHint={`Opens this week's ${TEMPERED_DAILY_NAME} workouts`}
      >
        <Text style={styles.weekRowText}>{TEMPERED_DAILY_VIEW_WEEK}</Text>
        <Ionicons name="chevron-forward" size={18} color={color.gold} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  body: {
    padding: space.md,
    gap: space.xs,
  },
  pressed: {
    backgroundColor: color.surface2,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  heading: {
    flex: 1,
    gap: space.xxs,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  dateLine: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  theme: {
    color: color.gold,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  titleFlex: {
    flex: 1,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  dropLine: {
    ...typography.calloutStrong,
    color: color.gold,
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
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: color.borderSubtle,
  },
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  weekRowText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
