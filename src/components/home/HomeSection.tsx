import { Badge, PressableCard } from '@/src/components/ds';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
import { HomeCheckinCard } from '@/src/components/home/HomeCheckinCard';
import { HomeStreakCard } from '@/src/components/home/HomeStreakCard';
import { HomeTodayCard } from '@/src/components/home/HomeTodayCard';
import { TemperedDailyWidget } from '@/src/components/home/TemperedDailyWidget';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { color } from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import type { StreakSnapshot } from '@/src/services/streakService';
import type { SingleWorkout } from '@/src/types/workouts';
import type { HomeCheckinSummary } from '@/src/utils/homeCheckinSummary';
import type { HomeSectionId } from '@/src/utils/homeLayout';
import type { HomeProgramSummary } from '@/src/utils/homeProgramSummary';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import type { RecentPersonalBestRow } from '@/src/utils/recentPersonalBests';
import type { WeightUnit } from '@/src/utils/storage';
import type { TemperedDailyToday } from '@/src/utils/temperedDaily';
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export function homeSectionHasContent(
  id: HomeSectionId,
  input: {
    checkinSummary: HomeCheckinSummary | null;
    streakSnapshot: StreakSnapshot | null;
  }
): boolean {
  if (id === 'checkin') {
    return input.checkinSummary != null;
  }
  if (id === 'streaks') {
    return input.streakSnapshot != null;
  }
  return true;
}

type HomeSectionProps = {
  id: HomeSectionId;
  programSummary: HomeProgramSummary | null;
  onOpenProgram: () => void;
  temperedToday: TemperedDailyToday;
  temperedWorkout: SingleWorkout | null;
  date: Date;
  showProBadge: boolean;
  onOpenDailyWorkout: (workoutId: string) => void;
  onOpenDailyWeek: () => void;
  checkinSummary: HomeCheckinSummary | null;
  onOpenCheckin: () => void;
  onOpenWorkouts: () => void;
  onOpenShop: () => void;
  streakSnapshot: StreakSnapshot | null;
  displayName: string | null;
  recentPbs: RecentPersonalBestRow[];
  weightUnit: WeightUnit;
  onOpenRecords: () => void;
  onOpenEmptyRecords: () => void;
};

export function HomeSection({
  id,
  programSummary,
  onOpenProgram,
  temperedToday,
  temperedWorkout,
  date,
  showProBadge,
  onOpenDailyWorkout,
  onOpenDailyWeek,
  checkinSummary,
  onOpenCheckin,
  onOpenWorkouts,
  onOpenShop,
  streakSnapshot,
  displayName,
  recentPbs,
  weightUnit,
  onOpenRecords,
  onOpenEmptyRecords,
}: HomeSectionProps) {
  const largeText = useLargeText();

  switch (id) {
    case 'program':
      return <HomeTodayCard summary={programSummary} onPress={onOpenProgram} />;
    case 'daily':
      return (
        <TemperedDailyWidget
          today={temperedToday}
          workout={temperedWorkout}
          date={date}
          showProBadge={showProBadge}
          onOpenWorkout={onOpenDailyWorkout}
          onOpenWeek={onOpenDailyWeek}
        />
      );
    case 'checkin':
      if (!checkinSummary) {
        return null;
      }
      return (
        <HomeCheckinCard
          loggedCount={checkinSummary.loggedCount}
          totalCount={checkinSummary.totalCount}
          supplementsDue={checkinSummary.supplementsDue}
          supplementsTotal={checkinSummary.supplementsTotal}
          onPress={onOpenCheckin}
        />
      );
    case 'wodShop':
      return (
        <View style={[styles.bentoRow, largeText && styles.bentoStacked]}>
          <View style={largeText ? null : styles.bentoTile}>
            <HubPromoCard
              layout={largeText ? 'row' : 'tile'}
              icon="barbell-outline"
              eyebrow="Open workouts"
              title="Just fancy a workout?"
              description="Strength, mobility flows and more outside a program."
              onPress={onOpenWorkouts}
              accessibilityLabel="Opens Workouts"
            />
          </View>
          <View style={largeText ? null : styles.bentoTile}>
            <HubPromoCard
              layout={largeText ? 'row' : 'tile'}
              icon="cart-outline"
              eyebrow="Partner picks"
              title="Browse the shop"
              description="The best gear at exclusive prices."
              onPress={onOpenShop}
              accessibilityLabel="Opens partner products"
            />
          </View>
        </View>
      );
    case 'streaks':
      if (!streakSnapshot) {
        return null;
      }
      return (
        <HomeStreakCard snapshot={streakSnapshot} displayName={displayName} />
      );
    case 'personalBests':
      if (recentPbs.length > 0) {
        return (
          <PressableCard
            onPress={onOpenRecords}
            accessibilityLabel={`Your latest PB, ${recentPbs
              .map(
                (row) =>
                  `${row.exerciseName}, ${formatRepMaxLabel(
                    row.tier
                  )}, ${formatWeightFromKg(row.weightKg, weightUnit)}`
              )
              .join('; ')}`}
            accessibilityHint="Opens your personal bests"
          >
            <View style={styles.pbTitleRow}>
              <Ionicons name="trophy-outline" size={18} color={color.gold} />
              <Text style={styles.cardTitle}>Your latest PB</Text>
            </View>
            {recentPbs.map((row, index) => (
              <View
                key={`${row.exerciseId}-${row.tier}-${row.achievedAt}-${index}`}
                style={styles.pbRow}
              >
                <View style={styles.pbRowText}>
                  <Text style={styles.pbExercise} numberOfLines={2}>
                    {row.exerciseName}
                  </Text>
                  <Text style={styles.pbTier}>
                    {formatRepMaxLabel(row.tier)}
                  </Text>
                </View>
                <Text style={styles.pbValue}>
                  {formatWeightFromKg(row.weightKg, weightUnit)}
                </Text>
              </View>
            ))}
          </PressableCard>
        );
      }
      return (
        <PressableCard
          onPress={onOpenEmptyRecords}
          accessibilityLabel="No personal bests yet"
          accessibilityHint="Opens the You tab to log records"
        >
          <Text style={styles.cardTitle}>No PBs yet</Text>
          <Text style={styles.cardBody}>
            Personal bests from your programs and the You tab will show up here.
          </Text>
        </PressableCard>
      );
    default: {
      const unexpected: never = id;
      return unexpected;
    }
  }
}

type HomeUpgradeStripProps = {
  onPress: () => void;
};

export function HomeUpgradeStrip({ onPress }: HomeUpgradeStripProps) {
  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel="Upgrade to Pro, free tier"
      accessibilityHint="Opens the You tab where you can upgrade to Tempered Strength Pro"
    >
      <View style={styles.upgradeRow}>
        <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
        <Badge label="Free tier" tone="neutral" />
      </View>
    </PressableCard>
  );
}
