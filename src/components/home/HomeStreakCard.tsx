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

export function HomeStreakCard({ snapshot }: HomeStreakCardProps) {
  const dateSet = useMemo(() => new Set(snapshot.dates), [snapshot.dates]);
  const week = useMemo(
    () => weekDaysStartingMonday(parseYmdToLocalNoon(snapshot.todayLocal)),
    [snapshot.todayLocal]
  );
  const dayLabel = snapshot.currentStreak === 1 ? 'day' : 'days';

  return (
    <Card style={styles.streakCard}>
      <View style={styles.streakCardInner}>
        <View style={styles.streakHeader}>
          <Ionicons name="flame" size={18} color={Colors.accent} />
          <Text style={styles.streakHeaderTitle}>Streak</Text>
        </View>

        <View style={styles.streakMainRow}>
          <View style={styles.streakStatsColumn}>
            <View style={styles.streakCountRow}>
              <Text style={styles.streakNumber}>{snapshot.currentStreak}</Text>
              <Text style={styles.streakCountUnit}>{dayLabel}</Text>
            </View>
            <Text style={styles.streakBestLine}>
              Best: {snapshot.bestStreak} {snapshot.bestStreak === 1 ? 'day' : 'days'}
            </Text>
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
                  <View
                    style={[
                      styles.streakDayDot,
                      done && styles.streakDayDotDone,
                      isToday && !done && styles.streakDayDotTodayRing,
                    ]}
                  >
                    {done ? (
                      <Ionicons
                        name="checkmark"
                        size={10}
                        color={Colors.textOnAccent}
                      />
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </Card>
  );
}
