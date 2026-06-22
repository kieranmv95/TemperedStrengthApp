import { Card, SmallChevron } from '@/src/components/ds';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { HomeStreakCard } from '@/src/components/home/HomeStreakCard';
import { SponsorAdsCarousel } from '@/src/components/home/SponsorAdsCarousel';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors } from '@/src/constants/theme';
import { getAllExercises } from '@/src/data/exercises';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useHomeRemoteNotification } from '@/src/hooks/useHomeRemoteNotification';
import { useHomeSponsorAds } from '@/src/hooks/useHomeSponsorAds';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { HomeSponsorAd } from '@/src/services/sanitySponsorAds';
import {
  applyDailyStreakCheckIn,
  buildSnapshot,
  formatLocalYMD,
  parseStreakState,
  type StreakSnapshot,
} from '@/src/services/streakService';
import type { PersonalBestsStore } from '@/src/types/personalBests';
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
import { formatWeightFromKg } from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import { router, type Href } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  TouchableOpacity,
  View
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
    return 'Morning';
  }
  if (h >= 12 && h < 17) {
    return 'Afternoon';
  }
  if (h >= 17 && h < 23) {
    return 'Evening';
  }
  return 'Hey';
}

export default function HomeTabScreen() {
  const posthog = usePostHog();
  const { banner: remoteNotification } = useHomeRemoteNotification();
  const { ads: sponsorAds } = useHomeSponsorAds();
  const { unit: weightUnit } = useWeightUnit();
  const {
    isPro,
    isLoading: subscriptionLoading,
    refresh: refreshSubscription,
  } = useSubscription();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [programSummary, setProgramSummary] =
    useState<HomeProgramSummary | null>(null);
  const [pbStore, setPbStore] = useState<PersonalBestsStore | null>(null);
  const [streakSnapshot, setStreakSnapshot] = useState<StreakSnapshot | null>(
    null
  );
  const hasCompletedInitialLoad = useRef(false);

  const loadHome = useCallback(async () => {
    const isFirstLoad = !hasCompletedInitialLoad.current;
    if (isFirstLoad) {
      setLoading(true);
    }
    try {
      const [profile, summary, store, streak] = await Promise.all([
        getOnboardingProfile(),
        loadHomeProgramSummary(),
        getPersonalBestsStore(),
        applyDailyStreakCheckIn(),
      ]);
      const trimmed = profile?.name?.trim();
      setDisplayName(trimmed && trimmed.length > 0 ? trimmed : null);
      setProgramSummary(summary);
      setPbStore(store);
      setStreakSnapshot(streak);
    } catch (error) {
      console.error('Error loading home screen data:', error);
      setDisplayName(null);
      setProgramSummary(null);
      setPbStore({});
      setStreakSnapshot(
        buildSnapshot(parseStreakState(null), formatLocalYMD(new Date()))
      );
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

  const openSponsorCta = useCallback(
    (ad: HomeSponsorAd) => {
      openHomeCtaUrl(ad.affiliateUrl);
    },
    [openHomeCtaUrl]
  );

  const recentPbs = useMemo(() => {
    if (!pbStore) {
      return [];
    }
    return listRecentPersonalBestRows(pbStore, exerciseNameById, 1);
  }, [pbStore]);

  const showFreeStrip = !subscriptionLoading && !isPro;
  const freeStripOpacity = useRef(new Animated.Value(0)).current;
  const freeStripHasRevealed = useRef(false);

  useEffect(() => {
    if (showFreeStrip && !freeStripHasRevealed.current) {
      freeStripHasRevealed.current = true;
      Animated.timing(freeStripOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    } else if (!showFreeStrip && freeStripHasRevealed.current) {
      freeStripHasRevealed.current = false;
      freeStripOpacity.setValue(0);
    }
  }, [showFreeStrip, freeStripOpacity]);

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
        <View style={styles.spacing}>
          {showFreeStrip && (
            <Animated.View
              style={[styles.welcomeStrip, { opacity: freeStripOpacity }]}
            >
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() =>
                  trackHomeLink('welcome_strip', '/records', () =>
                    router.push('/records')
                  )
                }
                accessibilityRole="button"
                accessibilityLabel="Upgrade to Pro, free tier"
                accessibilityHint="Opens the You tab where you can upgrade to Tempered Strength Pro"
              >
                <View style={styles.welcomeStripTopRow}>
                  <View style={styles.welcomeHeadlineCell}>
                    <Text style={styles.welcomeTitle}>Upgrade to Pro</Text>
                  </View>
                  <View style={styles.planBadgeFree} pointerEvents="none">
                    <Text style={styles.planBadgeLabelFree}>FREE TIER</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

          {remoteNotification && (
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
                <TouchableOpacity
                  style={[
                    styles.notificationCta,
                    { backgroundColor: remoteNotification.ctaColor },
                  ]}
                  onPress={() =>
                    openHomeCtaUrl(remoteNotification.ctaUrl)
                  }
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
                </TouchableOpacity>
              ) : null}
            </View>
          )}

          <View>
            {programSummary ? (
              <Card
                onPress={() =>
                  trackHomeLink('your_program_card', '/program', () =>
                    router.push('/program')
                  )
                }
                accessibilityLabel="Open program"
              >
                <View style={styles.cardBody}>
                  <Text style={styles.programTitle}>
                    {programSummary.programName}
                  </Text>
                  <Text style={styles.programStatus}>
                    {programSummary.todaySessionLabel}
                  </Text>
                  <Text style={styles.programSessionsRemaining}>
                    {programSummary.sessionsRemaining} session{programSummary.sessionsRemaining === 1 ? '' : 's'} remaining
                  </Text>

                  <View
                    style={styles.programCalendarProgressTrack}
                    accessible
                    accessibilityRole="progressbar"
                    accessibilityLabel="Program calendar progress"
                    accessibilityValue={{
                      min: 0,
                      max: 100,
                      now: Math.round(
                        programSummary.calendarSessionSpanProgress * 100
                      ),
                    }}
                  >
                    <View
                      style={[
                        styles.programCalendarProgressFill,
                        {
                          width: `${Math.min(
                            100,
                            Math.max(
                              0,
                              Math.round(
                                programSummary.calendarSessionSpanProgress *
                                10000
                              ) / 100
                            )
                          )}%`,
                        },
                      ]}
                    />
                  </View>
                </View>
                <SmallChevron />
              </Card>
            ) : (
              <Card
                onPress={() =>
                  trackHomeLink('pick_program_card', '/program', () =>
                    router.push('/program')
                  )
                }
                accessibilityLabel="Select a program"
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>Pick a program</Text>
                  <Text style={styles.cardMuted}>
                    Head to the Program tab and choose one then we will surface the
                    good stuff here.
                  </Text>
                </View>
                <SmallChevron />
              </Card>
            )}
          </View>

          {sponsorAds.length > 0 ? (
            <SponsorAdsCarousel ads={sponsorAds} onPressCta={openSponsorCta} />
          ) : null}

          {streakSnapshot ? (
            <HomeStreakCard
              snapshot={streakSnapshot}
              displayName={displayName}
            />
          ) : null}

          <View>
            {hasPersonalBests ? (
              <Card
                onPress={() =>
                  trackHomeLink(
                    'recent_wins_card',
                    '/records',
                    () => router.push('/records')
                  )
                }
                accessibilityLabel="Open personal bests"
              >
                <View style={[styles.cardBody, styles.pbListContent]}>
                  <View style={styles.pbListTitleRow}>
                    <Ionicons name="trophy-outline" size={18} color={Colors.accent} />
                    <Text style={styles.pbListTitle}>Your latest PB</Text>
                  </View>
                  {recentPbs.map((row, index) => (
                    <View
                      key={`${row.exerciseId}-${row.tier}-${row.achievedAt}-${index}`}
                      style={[styles.pbRow]}
                    >
                      <View style={styles.pbRowText}>
                        <Text
                          style={styles.pbRowTitle}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {row.exerciseName}
                        </Text>
                        <Text style={styles.pbMaxLabel}>
                          {formatRepMaxLabel(row.tier)}
                        </Text>
                      </View>
                      <View style={styles.pbValueWrap}>
                        <View style={styles.pbValueContainer}>
                          <Text style={styles.pbValue}>
                            {formatWeightFromKg(row.weightKg, weightUnit)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
                <SmallChevron />
              </Card>
            ) : (
              <Card
                onPress={() =>
                  trackHomeLink(
                    'recent_wins_empty_card',
                    '/records/personal-bests',
                    () => router.push('/records')
                  )
                }
                accessibilityLabel="Open personal bests to log records"
              >
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>No PRs yet</Text>
                  <Text style={styles.emptySubtitle}>
                    Your latest PB from your programs or on the you will show up here.
                  </Text>
                </View>
                <SmallChevron />
              </Card>
            )}
          </View>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
