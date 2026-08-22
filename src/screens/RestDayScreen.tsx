import { CuratedSection } from '@/src/components/ds';
import { RestDayActivityCarousel } from '@/src/components/rest/RestDayActivityCarousel';
import { RestDayMobilityCarousel } from '@/src/components/rest/RestDayMobilityCarousel';
import { RestDayWorkoutCarousel } from '@/src/components/rest/RestDayWorkoutCarousel';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useRoles } from '@/src/hooks/useRoles';
import type { Program } from '@/src/types/program';
import type { SingleWorkout } from '@/src/types/workouts';
import { getRestDaySuggestionsForDay } from '@/src/utils/restDaySuggestions';
import { getFavoriteWorkouts, toggleFavoriteWorkout } from '@/src/utils/storage';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RestDayScreenProps = {
  programId: string | null;
  selectedDayIndex: number | null;
  startDate: string | null;
  workoutWeekPattern: Program['daysSplit'] | null;
  onProgramReset?: () => void;
};

export const RestDayScreen: React.FC<RestDayScreenProps> = ({
  programId,
  selectedDayIndex,
  startDate,
  workoutWeekPattern,
}) => {
  const { isPro, roles, isLoading: accessLoading } = useRoles();
  const [favorites, setFavorites] = useState<string[]>([]);
  const hasRecoveryAccess =
    isPro || roles.includes(COACH_ROLE) || accessLoading;

  const suggestions = useMemo(
    () =>
      getRestDaySuggestionsForDay(
        programId,
        selectedDayIndex ?? 0,
        startDate,
        workoutWeekPattern ?? null
      ),
    [programId, selectedDayIndex, startDate, workoutWeekPattern]
  );

  useFocusEffect(
    useCallback(() => {
      void (async () => {
        try {
          const favs = await getFavoriteWorkouts();
          setFavorites(favs);
        } catch (error) {
          console.error('Failed to load favorite workouts:', error);
        }
      })();
    }, [])
  );

  const handleLockedPress = () => {
    router.push('/records');
  };

  const handleToggleFavorite = async (workout: SingleWorkout) => {
    const newStatus = await toggleFavoriteWorkout(workout.id);
    if (newStatus) {
      setFavorites((prev) => [...prev, workout.id]);
    } else {
      setFavorites((prev) => prev.filter((id) => id !== workout.id));
    }
  };

  const showWorkouts = suggestions.workoutIds.length > 0;
  const showSkillLabs = suggestions.skillWorkoutIds.length > 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header} accessibilityRole="summary">
        <Text style={styles.title}>Rest Day</Text>
        <Text style={styles.subtitle}>
          Your body needs recovery to grow stronger.
        </Text>
        <Text style={styles.description}>
          Take this time to stretch, foam roll, or simply take a day off.{' '}
          <Text style={styles.descriptionEmphasis}>
            The suggestions below are optional. Skip them if you need full
            rest.
          </Text>
        </Text>
      </View>

      {suggestions.recoveryIds.length > 0 ? (
        <View style={styles.section}>
          <CuratedSection
            title="Mobility"
            description={suggestions.context}
            size="medium"
            style={styles.sectionHeader}
          />
          <RestDayMobilityCarousel
            recoveryIds={suggestions.recoveryIds}
            hasRecoveryAccess={hasRecoveryAccess}
            onLockedPress={handleLockedPress}
          />
        </View>
      ) : null}

      {showWorkouts ? (
        <View style={styles.section}>
          <CuratedSection
            title="If you still want to train"
            description="Proper workouts that shouldn't wreck tomorrow, only if you feel fresh."
            size="medium"
            style={styles.sectionHeader}
          />
          <RestDayWorkoutCarousel
            workoutIds={suggestions.workoutIds}
            favorites={favorites}
            isPro={isPro || accessLoading}
            roles={roles}
            onToggleFavorite={handleToggleFavorite}
            onLockedPress={handleLockedPress}
          />
        </View>
      ) : null}

      {suggestions.activities.length > 0 ? (
        <View style={styles.section}>
          <CuratedSection
            title="Other ideas"
            description="Easy recovery outside the app. Movement, heat, stillness, or full rest."
            size="medium"
            style={styles.sectionHeader}
          />
          <RestDayActivityCarousel activities={suggestions.activities} />
        </View>
      ) : null}

      {showSkillLabs ? (
        <View style={styles.section}>
          <CuratedSection
            title="Fancy trying something new"
            description="Skill labs to explore on your own time. Curiosity, not homework."
            size="medium"
            style={styles.sectionHeader}
          />
          <RestDayWorkoutCarousel
            workoutIds={suggestions.skillWorkoutIds}
            favorites={favorites}
            isPro={isPro || accessLoading}
            roles={roles}
            onToggleFavorite={handleToggleFavorite}
            onLockedPress={handleLockedPress}
          />
        </View>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push('/workouts')}
          activeOpacity={0.8}
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Browse workouts"
        >
          <Text style={styles.secondaryButtonText}>Browse all workouts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push('/recovery')}
          activeOpacity={0.8}
          style={styles.secondaryButton}
          accessibilityRole="button"
          accessibilityLabel="Browse mobility and flows"
        >
          <Text style={styles.secondaryButtonText}>
            Browse all mobility & flows
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  header: {
    marginBottom: Spacing.section,
    paddingTop: Spacing.xxl,
  },
  title: {
    color: Colors.accent,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxl,
    lineHeight: 24,
    marginBottom: Spacing.md,
  },
  description: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  descriptionEmphasis: {
    fontWeight: '700',
    color: Colors.textMuted,
  },
  section: {
    marginBottom: Spacing.section,
  },
  sectionHeader: {
    marginBottom: Spacing.md,
    gap: Spacing.xs,
  },
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  secondaryButton: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
});
