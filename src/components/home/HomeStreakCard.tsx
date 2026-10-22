import {
  color,
  elevation,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  weekDaysStartingMonday,
  type StreakSnapshot,
} from '@/src/services/streakService';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type HomeStreakCardProps = {
  snapshot: StreakSnapshot;
  displayName: string | null;
};

const DAY_DOT_SIZE = 24;
const WEEKDAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

function parseYmdToLocalNoon(ymd: string): Date {
  const [ys, ms, ds] = ymd.split('-');
  const y = Number(ys);
  const m = Number(ms) - 1;
  const d = Number(ds);
  return new Date(y, m, d, 12, 0, 0);
}

function pluralDays(count: number): string {
  return count === 1 ? 'day' : 'days';
}

export function HomeStreakCard({ snapshot }: HomeStreakCardProps) {
  const dateSet = useMemo(() => new Set(snapshot.dates), [snapshot.dates]);
  const week = useMemo(
    () => weekDaysStartingMonday(parseYmdToLocalNoon(snapshot.todayLocal)),
    [snapshot.todayLocal]
  );

  const doneNames = week
    .map((day, index) => (dateSet.has(day.ymd) ? WEEKDAY_NAMES[index] : null))
    .filter((name): name is string => name !== null);
  const accessibilityLabel = `Streak, ${snapshot.currentStreak} ${pluralDays(
    snapshot.currentStreak
  )}. Best ${snapshot.bestStreak} ${pluralDays(snapshot.bestStreak)}. ${
    doneNames.length > 0
      ? `Active this week: ${doneNames.join(', ')}`
      : 'No active days this week yet'
  }.`;

  return (
    <View
      style={[styles.card, elevation.raised]}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.header}>
        <Ionicons name="flame" size={18} color={color.gold} />
        <Text style={styles.headerTitle}>Streak</Text>
      </View>

      <View style={styles.mainRow}>
        <View>
          <View style={styles.countRow}>
            <Text style={styles.count}>{snapshot.currentStreak}</Text>
            <Text style={styles.countUnit}>
              {pluralDays(snapshot.currentStreak)}
            </Text>
          </View>
          <Text style={styles.best}>
            Best {snapshot.bestStreak} {pluralDays(snapshot.bestStreak)}
          </Text>
        </View>

        <View style={styles.weekRow}>
          {week.map((day) => {
            const done = dateSet.has(day.ymd);
            const isToday = day.ymd === snapshot.todayLocal;
            return (
              <View key={day.ymd} style={styles.weekCell}>
                <Text
                  style={[styles.weekLetter, isToday && styles.weekLetterToday]}
                >
                  {day.label}
                </Text>
                <View
                  style={[
                    styles.dayDot,
                    done && styles.dayDotDone,
                    isToday && !done && styles.dayDotToday,
                  ]}
                >
                  {done ? (
                    <Ionicons name="checkmark" size={14} color={color.onGold} />
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  headerTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  mainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.xxs,
  },
  count: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  countUnit: {
    ...typography.callout,
    color: color.textSecondary,
  },
  best: {
    ...typography.caption,
    color: color.textSecondary,
  },
  weekRow: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  weekCell: {
    alignItems: 'center',
    gap: space.xxs,
  },
  weekLetter: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  weekLetterToday: {
    color: color.gold,
  },
  dayDot: {
    width: DAY_DOT_SIZE,
    height: DAY_DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayDotDone: {
    backgroundColor: color.gold,
  },
  dayDotToday: {
    borderWidth: 1.5,
    borderColor: color.gold,
  },
});
