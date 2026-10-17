import {
  Badge,
  EnterOnMount,
  PressableCard,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import { HomeCheckinCard } from '@/src/components/home/HomeCheckinCard';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { HomeStreakCard } from '@/src/components/home/HomeStreakCard';
import { HomeTodayCard } from '@/src/components/home/HomeTodayCard';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
import { LiveCompetition } from '@/src/components/LiveCompetition';
import { color } from '@/src/constants/tokens';
import { getAllExercises } from '@/src/data/exercises';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useHomeRemoteNotification } from '@/src/hooks/useHomeRemoteNotification';
import { useRoles } from '@/src/hooks/useRoles';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  applyDailyStreakCheckIn,
  buildSnapshot,
  formatLocalYMD,
  parseStreakState,
  type StreakSnapshot,
} from '@/src/services/streakService';
import type { PersonalBestsStore } from '@/src/types/personalBests';
import {
  loadHomeCheckinSummary,
  type HomeCheckinSummary,
} from '@/src/utils/homeCheckinSummary';
import {
  loadHomeProgramSummary,
  type HomeProgramSummary,
} from '@/src/utils/homeProgramSummary';
import { formatRepMaxLabel } from '@/src/utils/personalBests';
import { listRecentPersonalBestRows } from '@/src/utils/recentPersonalBests';
import {
  getOnboardingProfile,
  getPersonalBestsStore,
} from '@/src/utils/storage';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useFocusEffect, router, type Href } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

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
  return 'Hello';
}

function formatTodayDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

function accountTypeBadgeLabel(
  isPro: boolean,
  isCoach: boolean
): 'PRO' | 'COACH' | 'PRO & COACH' | null {
  if (isPro && isCoach) {
    return 'PRO & COACH';
  }
  if (isPro) {
    return 'PRO';
  }
  if (isCoach) {
    return 'COACH';
  }
  return null;
}

export default function HomeTabScreen() {
  const posthog = usePostHog();
  const { banner: remoteNotification } = useHomeRemoteNotification();
  const { unit: weightUnit } = useWeightUnit();
  const {
    isPro,
    isLoading: subscriptionLoading,
    refresh: refreshSubscription,
  } = useSubscription();
  const { roles, isLoading: rolesLoading } = useRoles();
  const isCoach = roles.includes(COACH_ROLE);
  const accessLoading = subscriptionLoading || rolesLoading;
  const accountBadge = accountTypeBadgeLabel(isPro, isCoach);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programSummary, setProgramSummary] =
    useState<HomeProgramSummary | null>(null);
  const [pbStore, setPbStore] = useState<PersonalBestsStore | null>(null);
  const [streakSnapshot, setStreakSnapshot] = useState<StreakSnapshot | null>(
    null
  );
  const [checkinSummary, setCheckinSummary] =
    useState<HomeCheckinSummary | null>(null);
  const hasCompletedInitialLoad = useRef(false);

  const loadHome = useCallback(async () => {
    const isFirstLoad = !hasCompletedInitialLoad.current;
    if (isFirstLoad) {
      setLoading(true);
    }
    try {
      const [profile, summary, store, streak, checkin] = await Promise.all([
        getOnboardingProfile(),
        loadHomeProgramSummary(),
        getPersonalBestsStore(),
        applyDailyStreakCheckIn(),
        loadHomeCheckinSummary(),
      ]);
      const trimmed = profile?.name?.trim();
      setDisplayName(trimmed && trimmed.length > 0 ? trimmed : null);
      setProgramSummary(summary);
      setPbStore(store);
      setStreakSnapshot(streak);
      setCheckinSummary(checkin);
    } catch (error) {
      console.error('Error loading home screen data:', error);
      setDisplayName(null);
      setProgramSummary(null);
      setPbStore({});
      setStreakSnapshot(
        buildSnapshot(parseStreakState(null), formatLocalYMD(new Date()))
      );
      setCheckinSummary(null);
    } finally {
      setLoading(false);
      hasCompletedInitialLoad.current = true;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadHome();
      if (tryConsumeSubscriptionRefreshCooldown()) {
        void refreshSubscription();
      }
    }, [loadHome, refreshSubscription])
  );

  const trackHomeLink = useCallback(
    (linkId: string, pathname: string, navigate: () => void) => {
      posthog.capture(posthogEventsNames.home.linkPressed, {
        link_id: linkId,
        target: pathname,
      });
      navigate();
    },
    [posthog]
  );

  const openHomeCtaUrl = useCallback((url: string) => {
    const trimmed = url.trim();
    if (!trimmed) {
      return;
    }
    if (/^https?:\/\//i.test(trimmed)) {
      Linking.openURL(trimmed).catch((error) => {
        console.error('Failed to open URL:', error);
      });
      return;
    }
    const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    router.push(path as Href);
  }, []);

  const recentPbs = useMemo(() => {
    if (!pbStore) {
      return [];
    }
    return listRecentPersonalBestRows(pbStore, exerciseNameById, 1);
  }, [pbStore]);

  const showFreeStrip = !accessLoading && !isPro;
  const firstName = displayName?.split(/\s+/)[0] ?? null;
  const greet = timeOfDayGreeting();
  const greetingTitle = firstName ? `${greet}, ${firstName}` : greet;
  const titleAccessory =
    !accessLoading && accountBadge ? (
      <Badge
        label={accountBadge}
        accessibilityLabel={`Account type ${accountBadge}`}
      />
    ) : null;

  if (loading) {
    return (
      <StandardLayout
        variant="forged"
        title={greetingTitle}
        subtitle={formatTodayDate()}
      >
        <StandardLayout.Body>
          <View style={styles.skeletons}>
            <Skeleton
              width="100%"
              height={208}
              radius="md"
              accessibilityLabel="Loading home"
            />
            <Skeleton width="100%" height={96} radius="md" />
            <View style={styles.bentoRow}>
              <Skeleton width="48%" height={148} radius="md" />
              <Skeleton width="48%" height={148} radius="md" />
            </View>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const hasPersonalBests = recentPbs.length > 0;
  let entranceIndex = 0;
  const nextEntrance = () => entranceIndex++;

  return (
    <StandardLayout
      variant="forged"
      title={greetingTitle}
      subtitle={formatTodayDate()}
      titleAccessory={titleAccessory}
    >
      <StandardLayout.Body>
        <View style={styles.sections}>
          {remoteNotification ? (
            <EnterOnMount index={nextEntrance()}>
              <View
                style={[
                  styles.notificationBanner,
                  {
                    backgroundColor: remoteNotification.bgColor,
                    borderColor: remoteNotification.borderColor,
                  },
                ]}
              >
                {remoteNotification.title.length > 0 ? (
                  <Text
                    style={[
                      styles.notificationBannerTitle,
                      { color: remoteNotification.titleColor },
                    ]}
                    accessibilityRole="header"
                  >
                    {remoteNotification.title}
                  </Text>
                ) : null}
                {remoteNotification.body.length > 0 ? (
                  <Text
                    style={[
                      styles.notificationBannerBody,
                      { color: remoteNotification.descriptionColor },
                    ]}
                  >
                    {remoteNotification.body}
                  </Text>
                ) : null}
                {remoteNotification.ctaText.length > 0 &&
                remoteNotification.ctaUrl.length > 0 ? (
                  <Pressable
                    style={[
                      styles.notificationCta,
                      { backgroundColor: remoteNotification.ctaColor },
                    ]}
                    onPress={() => openHomeCtaUrl(remoteNotification.ctaUrl)}
                    accessibilityRole="button"
                    accessibilityLabel={remoteNotification.ctaText}
                  >
                    <Text
                      style={[
                        styles.notificationCtaText,
                        { color: remoteNotification.ctaTextColor },
                      ]}
                    >
                      {remoteNotification.ctaText}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </EnterOnMount>
          ) : null}

          <LiveCompetition />

          <EnterOnMount index={nextEntrance()}>
            <HomeTodayCard
              summary={programSummary}
              onPress={() =>
                trackHomeLink(
                  programSummary ? 'your_program_card' : 'pick_program_card',
                  '/program',
                  () => router.push('/program')
                )
              }
            />
          </EnterOnMount>

          {showFreeStrip ? (
            <EnterOnMount index={nextEntrance()}>
              <PressableCard
                onPress={() =>
                  trackHomeLink('welcome_strip', '/records', () =>
                    router.push('/records')
                  )
                }
                accessibilityLabel="Upgrade to Pro, free tier"
                accessibilityHint="Opens the You tab where you can upgrade to Tempered Strength Pro"
              >
                <View style={styles.upgradeRow}>
                  <Text style={styles.upgradeTitle}>Upgrade to Pro</Text>
                  <Badge label="Free tier" tone="neutral" />
                </View>
              </PressableCard>
            </EnterOnMount>
          ) : null}

          {checkinSummary ? (
            <EnterOnMount index={nextEntrance()}>
              <HomeCheckinCard
                loggedCount={checkinSummary.loggedCount}
                totalCount={checkinSummary.totalCount}
                supplementsDue={checkinSummary.supplementsDue}
                supplementsTotal={checkinSummary.supplementsTotal}
                onPress={() =>
                  trackHomeLink('daily_checkin_card', '/checkin', () =>
                    router.push('/checkin')
                  )
                }
              />
            </EnterOnMount>
          ) : null}

          <EnterOnMount index={nextEntrance()} style={styles.bentoRow}>
            <View style={styles.bentoTile}>
              <HubPromoCard
                layout="tile"
                icon="barbell-outline"
                eyebrow="Open workouts"
                title="Just fancy a workout?"
                description="Strength, mobility flows and more outside a program."
                onPress={() =>
                  trackHomeLink('just_a_workout_card', '/workouts', () =>
                    router.push('/workouts')
                  )
                }
                accessibilityLabel="Opens Workouts"
              />
            </View>
            <View style={styles.bentoTile}>
              <HubPromoCard
                layout="tile"
                icon="cart-outline"
                eyebrow="Partner picks"
                title="Browse the shop"
                description="The best gear at exclusive prices."
                onPress={() =>
                  trackHomeLink('browse_shop_card', '/shop', () =>
                    router.push('/shop')
                  )
                }
                accessibilityLabel="Opens partner products"
              />
            </View>
          </EnterOnMount>

          {streakSnapshot ? (
            <EnterOnMount index={nextEntrance()}>
              <HomeStreakCard
                snapshot={streakSnapshot}
                displayName={displayName}
              />
            </EnterOnMount>
          ) : null}

          <EnterOnMount index={nextEntrance()}>
            {hasPersonalBests ? (
              <PressableCard
                onPress={() =>
                  trackHomeLink('recent_wins_card', '/records', () =>
                    router.push('/records')
                  )
                }
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
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color={color.gold}
                  />
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
            ) : (
              <PressableCard
                onPress={() =>
                  trackHomeLink(
                    'recent_wins_empty_card',
                    '/records/personal-bests',
                    () => router.push('/records')
                  )
                }
                accessibilityLabel="No personal bests yet"
                accessibilityHint="Opens the You tab to log records"
              >
                <Text style={styles.cardTitle}>No PBs yet</Text>
                <Text style={styles.cardBody}>
                  Personal bests from your programs and the You tab will show up
                  here.
                </Text>
              </PressableCard>
            )}
          </EnterOnMount>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
