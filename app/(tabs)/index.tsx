import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
import { getAllExercises } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { workoutScreenStyles } from '@/src/screens/workoutScreenStyles';
import type { PersonalBestsStore } from '@/src/types/personalBests';
import {
  type HomeProgramSummary,
  loadHomeProgramSummary,
} from '@/src/utils/homeProgramSummary';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import { listRecentPersonalBestRows } from '@/src/utils/recentPersonalBests';
import {
  getOnboardingProfile,
  getPersonalBestsStore,
} from '@/src/utils/storage';
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const exerciseNameById: ReadonlyMap<number, string> = (() => {
  const m = new Map<number, string>();
  for (const ex of getAllExercises()) {
    m.set(ex.id, ex.name);
  }
  return m;
})();

export default function HomeTabScreen() {
  const { unit: weightUnit } = useWeightUnit();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programSummary, setProgramSummary] = useState<HomeProgramSummary | null>(
    null
  );
  const [pbStore, setPbStore] = useState<PersonalBestsStore | null>(null);
  const hasCompletedInitialLoad = useRef(false);

  const loadHome = useCallback(async () => {
    const isFirstLoad = !hasCompletedInitialLoad.current;
    if (isFirstLoad) {
      setLoading(true);
    }
    try {
      const [profile, summary, store] = await Promise.all([
        getOnboardingProfile(),
        loadHomeProgramSummary(),
        getPersonalBestsStore(),
      ]);
      const trimmed = profile?.name?.trim();
      setDisplayName(trimmed && trimmed.length > 0 ? trimmed : null);
      setProgramSummary(summary);
      setPbStore(store);
    } catch (error) {
      console.error('Error loading home screen data:', error);
      setDisplayName(null);
      setProgramSummary(null);
      setPbStore({});
    } finally {
      setLoading(false);
      hasCompletedInitialLoad.current = true;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHome();
    }, [loadHome])
  );

  const recentPbs = useMemo(() => {
    if (!pbStore) {
      return [];
    }
    return listRecentPersonalBestRows(pbStore, exerciseNameById, 3);
  }, [pbStore]);

  const greetingTitle = displayName ? `Hi, ${displayName}` : 'Hi';

  if (loading) {
    return (
      <StandardLayout title={greetingTitle}>
        <StandardLayout.Body>
          <View style={styles.loadingBox}>
            <ActivityIndicator color={Colors.accent} />
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const hasPersonalBests = recentPbs.length > 0;

  return (
    <StandardLayout title={greetingTitle} subtitle="Welcome to Tempered Strength">
      <StandardLayout.Body>
        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <Text style={styles.sectionTitle}>Your Program</Text>
            <Text style={styles.sectionSubtitle}>Structure your training with a program</Text>
          </View>
          {programSummary ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/program')}
              accessibilityRole="button"
              accessibilityLabel="Open program"
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>{programSummary.programName}</Text>
                <Text style={[styles.cardMuted, { marginTop: 4 }]}>
                  Today&apos;s Session:{' '}
                  <Text style={styles.cardAccent}>
                    {programSummary.todaySessionLabel}
                  </Text>
                </Text>
                <Text style={styles.cardMuted}>
                  Sessions Remaining:{' '}
                  <Text style={styles.cardAccent}>
                    {programSummary.sessionsRemaining}
                  </Text>
                </Text>
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/program')}
              accessibilityRole="button"
              accessibilityLabel="Select a program"
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Select a program</Text>
                <Text style={styles.cardMuted}>
                  Choose a program on the Program tab to get started.
                </Text>
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <Text style={styles.sectionTitle}>Recent PB&apos;s</Text>
            <Text style={styles.sectionSubtitle}>
              Shows the 3 most recent PB&apos;s
            </Text>
          </View>
          {hasPersonalBests ? (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/records')}
              accessibilityRole="button"
              accessibilityLabel="Open records and personal bests"
            >
              <View style={styles.cardBody}>
                {recentPbs.map((row, index) => (
                  <View
                    key={`${row.exerciseId}-${row.tier}-${row.achievedAt}-${index}`}
                    style={[styles.pbRow, index === 0 && styles.pbRowFirst]}
                  >
                    <Text style={styles.pbRowTitle}>{row.exerciseName}</Text>
                    <Text style={styles.pbRowMeta}>
                      {formatRepMaxLabel(row.tier)} ·{' '}
                      {formatWeightFromKg(row.weightKg, weightUnit)}
                    </Text>
                  </View>
                ))}
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/records')}
              accessibilityRole="button"
              accessibilityLabel="Open records to log personal bests"
            >
              <View style={styles.cardBody}>
                <Text style={styles.emptyTitle}>No Personal Bests Logged</Text>
                <Text style={styles.emptySubtitle}>
                  Log your first PB to see it here!
                </Text>
              </View>
              <Text style={styles.cardArrow}>→</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <Text style={styles.sectionTitle}>Tools</Text>
            <Text style={styles.sectionSubtitle}>
              Here&apos;s some bits you might find handy
            </Text>
          </View>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push('/glossary')}
              accessibilityRole="button"
              accessibilityLabel="Open glossary"
            >
              <Ionicons name="book-outline" size={22} color={Colors.textMuted} />
              <Text style={styles.toolLabel}>Glossary</Text>
            </TouchableOpacity>
            <View
              style={[styles.toolButton, styles.toolButtonDisabled]}
              accessibilityRole="text"
              accessibilityLabel="More tools coming soon"
            >
              <Text style={styles.toolLabelMuted}>More Coming Soon…</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <Text style={styles.sectionTitle}>Account</Text>
            <Text style={styles.sectionSubtitle}>
              Manage your account and preferences
            </Text>
          </View>
          <TouchableOpacity
            style={workoutScreenStyles.startSessionButton}
            onPress={() => router.push('/settings')}
            accessibilityRole="button"
            accessibilityLabel="Open settings"
          >
            <Text style={workoutScreenStyles.startSessionButtonText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </StandardLayout.Body>
    </StandardLayout >
  );
}
