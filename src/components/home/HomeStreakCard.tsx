import { Card } from '@/src/components/ds';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { Colors } from '@/src/constants/theme';
import { weekDaysStartingMonday, type StreakSnapshot } from '@/src/services/streakService';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

type HomeStreakCardProps = {
  snapshot: StreakSnapshot;
  displayName: string | null;
};

function parseYmdToLocalNoon(ymd: string): Date {
  const [ys, ms, ds] = ymd.split('-');
  const y = Number(ys);
  const m = Number(ms) - 1;
  const d = Number(ds);
  return new Date(y, m, d, 12, 0, 0);
}

export function HomeStreakCard({ snapshot, displayName }: HomeStreakCardProps) {
  const dateSet = useMemo(() => new Set(snapshot.dates), [snapshot.dates]);
  const week = useMemo(
    () => weekDaysStartingMonday(parseYmdToLocalNoon(snapshot.todayLocal)),
    [snapshot.todayLocal]
  );

  const message = displayName
    ? `You are doing really great, ${displayName}!`
    : 'Keep showing up — consistency wins.';

  return (
    <Card>
      <View style={styles.streakCardInner}>
        <View style={styles.streakHero}>
          <View style={styles.streakIconRing}>
            <Ionicons name="flame" size={28} color={Colors.accent} />
          </View>
          <Text style={styles.streakNumber}>{snapshot.currentStreak}</Text>
          <Text style={styles.streakLabel}>Day streak</Text>
          <Text style={styles.streakMessage}>{message}</Text>
        </View>

        <View style={styles.streakWeekRow}>
          {week.map((day) => {
            const done = dateSet.has(day.ymd);
            const isToday = day.ymd === snapshot.todayLocal;
            return (
              <View key={day.ymd} style={styles.streakWeekCell}>
                <Text
                  style={[
                    styles.streakWeekLetter,
                    isToday && styles.streakWeekLetterToday,
                    !isToday && !done && styles.streakWeekLetterMuted,
                  ]}
                >
                  {day.label}
                </Text>
                <Text
                  style={[
                    styles.streakWeekDateNum,
                    isToday && styles.streakWeekDateNumToday,
                    !isToday && !done && styles.streakWeekDateNumMuted,
                  ]}
                >
                  {day.dayOfMonth}
                </Text>
                <View
                  style={[
                    styles.streakDayDot,
                    done && styles.streakDayDotDone,
                    isToday && !done && styles.streakDayDotTodayRing,
                  ]}
                >
                  {done ? (
                    <Ionicons name="checkmark" size={12} color={Colors.textOnAccent} />
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.streakStatsCard}>
          <View style={styles.streakStatBlock}>
            <Text style={styles.streakStatLabel}>Total days</Text>
            <Text style={styles.streakStatValue}>{snapshot.totalDays}</Text>
          </View>
          <Text style={styles.streakBestLine}>
            Best streak: {snapshot.bestStreak} days
          </Text>
        </View>
      </View>
    </Card>
  );
}
