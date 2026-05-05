import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
import { getAllExercises } from '@/src/data/exercises';
import { useSubscription } from '@/src/hooks/use-subscription';
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

function timeOfDayGreeting(): string {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) {
    return 'Good morning';
  }
  if (h >= 12 && h < 17) {
    return 'Good afternoon';
  }
  if (h >= 17 && h < 23) {
    return 'Good evening';
  }
  return 'Hey';
}

export default function HomeTabScreen() {
  const { unit: weightUnit } = useWeightUnit();
  const {
    isPro,
    isLoading: subscriptionLoading,
    refresh: refreshSubscription,
  } = useSubscription();
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
      void refreshSubscription();
    }, [loadHome, refreshSubscription])
  );

  const recentPbs = useMemo(() => {
    if (!pbStore) {
      return [];
    }
    return listRecentPersonalBestRows(pbStore, exerciseNameById, 3);
  }, [pbStore]);

  const greet = timeOfDayGreeting();
  const greetingTitle = displayName ? `${greet}, ${displayName}` : greet;
  const headerSubtitle = 'Tempered Strength, Your training HQ.';

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
    <StandardLayout title={greetingTitle} subtitle={headerSubtitle}>
      <StandardLayout.Body>
        <View style={styles.welcomeStrip}>
          {!subscriptionLoading ? (
            isPro ? (
              <>
                <View style={styles.welcomeStripTopRow}>
                  <View style={styles.welcomeHeadlineCell}>
                    <Text style={styles.welcomeTitle}>Let&apos;s Go.</Text>
                  </View>
                  <View
                    style={styles.planBadgePro}
                  >
                    <Text style={styles.planBadgeLabelPro}>PRO</Text>
                  </View>
                </View>
                <Text style={styles.welcomeBody}>
                  Your program, latest wins, and shortcuts are just below. Let&apos;s get
                  started.
                </Text>
              </>
            ) : (
              <>
                <View style={styles.welcomeStripTopRow}>
                  <View style={styles.welcomeHeadlineCell}>
                    <Text style={styles.welcomeTitle}>Upgrade to Pro</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.planBadgeFree}
                    onPress={() => router.push('/settings')}
                    accessibilityRole="button"
                    accessibilityLabel="Free plan"
                    accessibilityHint="Opens settings where you can upgrade to Tempered Strength Pro"
                  >
                    <Text style={styles.planBadgeLabelFree}>FREE TIER</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.welcomeBody}>
                  You are on the free plan. Unlock every program and workout, unlimited
                  exercise swaps, upgrade anytime from Settings.
                </Text>
              </>
            )
          ) : (
            <>
              <Text style={styles.welcomeTitle}>Glad you are here.</Text>
              <Text style={styles.welcomeBody}>
                Your program, latest wins, and shortcuts are just below — no rush,
                start when it feels right.
              </Text>
            </>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="barbell-outline" size={20} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Your program</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              What is on deck today and what is left in your block
            </Text>
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
                  {programSummary.awaitingProgramStart ? null : (
                    <>
                      Today:{' '}
                    </>
                  )}
                  <Text style={styles.cardAccent}>
                    {programSummary.todaySessionLabel}
                  </Text>
                </Text>
                <Text style={styles.cardMuted}>
                  Sessions left:{' '}
                  <Text style={styles.cardAccent}>
                    {programSummary.sessionsRemaining}
                  </Text>
                </Text>
              </View>
              <View style={styles.cardChevronWrap} pointerEvents="none">
                <Ionicons name="chevron-forward" size={22} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/program')}
              accessibilityRole="button"
              accessibilityLabel="Select a program"
            >
              <View style={styles.cardBody}>
                <Text style={styles.cardTitle}>Pick a program</Text>
                <Text style={styles.cardMuted}>
                  Head to the Program tab and choose one — we will surface the good
                  stuff here.
                </Text>
              </View>
              <View style={styles.cardChevronWrap} pointerEvents="none">
                <Ionicons name="chevron-forward" size={22} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="trophy-outline" size={20} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Recent wins</Text>
            </View>
            <Text style={styles.sectionSubtitle}>
              Your last three PRs, small jumps still count
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
              <View style={styles.cardChevronWrap} pointerEvents="none">
                <Ionicons name="chevron-forward" size={22} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push('/records')}
              accessibilityRole="button"
              accessibilityLabel="Open records to log personal bests"
            >
              <View style={styles.cardBody}>
                <Text style={styles.emptyTitle}>No PRs yet</Text>
                <Text style={styles.emptySubtitle}>
                  Log a PB from a workout and it will show up here. First one is the
                  best one.
                </Text>
              </View>
              <View style={styles.cardChevronWrap} pointerEvents="none">
                <Ionicons name="chevron-forward" size={22} color={Colors.accent} />
              </View>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="sparkles-outline" size={20} color={Colors.accent} />
              <Text style={styles.sectionTitle}>Quick links</Text>
            </View>
            <Text style={styles.sectionSubtitle}>References and extras you will reuse</Text>
          </View>
          <View style={styles.toolsRow}>
            <TouchableOpacity
              style={styles.toolButton}
              onPress={() => router.push('/glossary')}
              accessibilityRole="button"
              accessibilityLabel="Open glossary"
            >
              <Ionicons name="book-outline" size={22} color={Colors.accent} />
              <Text style={styles.toolLabel}>Glossary</Text>
            </TouchableOpacity>
            <View
              style={[styles.toolButton, styles.toolButtonDisabled]}
              accessibilityRole="text"
              accessibilityLabel="More tools coming soon"
            >
              <Text style={styles.toolLabelMuted}>More soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionheader}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="person-circle-outline" size={20} color={Colors.accent} />
              <Text style={styles.sectionTitle}>You</Text>
            </View>
            <Text style={styles.sectionSubtitle}>Settings and preferences</Text>
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
    </StandardLayout>
  );
}
