import {
  Badge,
  EnterOnMount,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import { CustomiseHomeSheet } from '@/src/components/home/CustomiseHomeSheet';
import {
  HomeSection,
  HomeUpgradeStrip,
  homeSectionHasContent,
} from '@/src/components/home/HomeSection';
import { homeScreenStyles as styles } from '@/src/components/home/homeScreenStyles';
import { TEMPERED_DAILY_VIEW_SOURCE } from '@/src/components/temperedDaily/temperedDailyConstants';
import { LiveCompetition } from '@/src/components/LiveCompetition';
import { color, MIN_TARGET_SIZE } from '@/src/constants/tokens';
import { getAllExercises } from '@/src/data/exercises';
import {
  getTemperedDailyWorkoutById,
  temperedDailyProgram,
} from '@/src/data/temperedDaily';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useHomeRemoteNotification } from '@/src/hooks/useHomeRemoteNotification';
import { useRoles } from '@/src/hooks/useRoles';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
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
import {
  defaultHomeLayout,
  homeLayoutHasHidden,
  moveHomeSection,
  setHomeSectionVisible,
  visibleHomeSectionIds,
  type HomeSectionPreference,
} from '@/src/utils/homeLayout';
import { getTemperedDailyToday } from '@/src/utils/temperedDaily';
import { listRecentPersonalBestRows } from '@/src/utils/recentPersonalBests';
import {
  getHomeLayout,
  getOnboardingProfile,
  getPersonalBestsStore,
  setHomeLayout,
} from '@/src/utils/storage';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { useFocusEffect, router, type Href } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentRef,
} from 'react';
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

/** Keeps the free upgrade strip in its original place, after the first two sections. */
const UPGRADE_STRIP_INDEX = 2;

export default function HomeTabScreen() {
  const posthog = usePostHog();
  const { banner: remoteNotification } = useHomeRemoteNotification();
  const { unit: weightUnit } = useWeightUnit();
  const { dataRevision } = useSyncManager();
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
  const [layout, setLayout] =
    useState<HomeSectionPreference[]>(defaultHomeLayout);
  const [customiseOpen, setCustomiseOpen] = useState(false);
  const hasCompletedInitialLoad = useRef(false);
  const customiseButtonRef = useRef<ComponentRef<typeof Pressable>>(null);
  const layoutRef = useRef(layout);
  const layoutEpoch = useRef(0);
  const flushingLayout = useRef(false);
  const lastWrittenLayout = useRef<HomeSectionPreference[] | null>(null);
  const persistLayoutRef = useRef<(next: HomeSectionPreference[]) => void>(
    () => {}
  );

  const applyStoredLayout = useCallback(
    (stored: HomeSectionPreference[], epoch: number) => {
      if (epoch !== layoutEpoch.current || flushingLayout.current) {
        return;
      }
      layoutRef.current = stored;
      setLayout(stored);
    },
    []
  );

  const persistLayout = useCallback((next: HomeSectionPreference[]) => {
    layoutEpoch.current += 1;
    layoutRef.current = next;
    setLayout(next);
    if (flushingLayout.current) {
      return;
    }
    flushingLayout.current = true;
    void (async () => {
      let attempted = next;
      try {
        for (;;) {
          attempted = layoutRef.current;
          await setHomeLayout(attempted);
          lastWrittenLayout.current = attempted;
          if (layoutRef.current === attempted) {
            break;
          }
        }
      } catch (error) {
        console.error('Error saving home layout:', error);
      } finally {
        flushingLayout.current = false;
        if (
          layoutRef.current !== attempted &&
          layoutRef.current !== lastWrittenLayout.current
        ) {
          persistLayoutRef.current(layoutRef.current);
        }
      }
    })();
  }, []);
  persistLayoutRef.current = persistLayout;

  const loadHome = useCallback(async () => {
    const isFirstLoad = !hasCompletedInitialLoad.current;
    if (isFirstLoad) {
      setLoading(true);
    }
    const layoutEpochAtRead = layoutEpoch.current;
    try {
      const [profile, summary, store, streak, checkin, storedLayout] =
        await Promise.all([
          getOnboardingProfile(),
          loadHomeProgramSummary(),
          getPersonalBestsStore(),
          applyDailyStreakCheckIn(),
          loadHomeCheckinSummary(),
          getHomeLayout(),
        ]);
      const trimmed = profile?.name?.trim();
      setDisplayName(trimmed && trimmed.length > 0 ? trimmed : null);
      setProgramSummary(summary);
      setPbStore(store);
      setStreakSnapshot(streak);
      setCheckinSummary(checkin);
      applyStoredLayout(storedLayout, layoutEpochAtRead);
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
  }, [applyStoredLayout]);

  useFocusEffect(
    useCallback(() => {
      void loadHome();
      if (tryConsumeSubscriptionRefreshCooldown()) {
        void refreshSubscription();
      }
    }, [loadHome, refreshSubscription])
  );

  useEffect(() => {
    const epoch = layoutEpoch.current;
    let cancelled = false;
    void getHomeLayout().then((stored) => {
      if (cancelled) {
        return;
      }
      applyStoredLayout(stored, epoch);
    });
    return () => {
      cancelled = true;
    };
  }, [applyStoredLayout, dataRevision]);

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const current = layoutRef.current;
      const sectionId = current[fromIndex]?.id;
      persistLayout(moveHomeSection(current, fromIndex, toIndex));
      posthog.capture(posthogEventsNames.home.layoutChanged, {
        change: 'reorder',
        section_id: sectionId,
        from_index: fromIndex,
        to_index: toIndex,
      });
    },
    [persistLayout, posthog]
  );

  const handleToggleVisible = useCallback(
    (id: HomeSectionPreference['id'], visible: boolean) => {
      if (!isPro) {
        return;
      }
      persistLayout(setHomeSectionVisible(layoutRef.current, id, visible));
      posthog.capture(posthogEventsNames.home.layoutChanged, {
        change: 'visibility',
        section_id: id,
        visible,
      });
    },
    [isPro, persistLayout, posthog]
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
  const now = new Date();
  const temperedToday = getTemperedDailyToday(temperedDailyProgram, now);
  const temperedWorkout = temperedToday.workoutId
    ? (getTemperedDailyWorkoutById(temperedToday.workoutId) ?? null)
    : null;
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
      <StandardLayout title={greetingTitle} subtitle={formatTodayDate()}>
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

  const canHideSections = !subscriptionLoading && isPro;
  const hideDecisionPending =
    subscriptionLoading && homeLayoutHasHidden(layout);
  const sectionIds = visibleHomeSectionIds(layout, canHideSections).filter(
    (id) =>
      homeSectionHasContent(id, {
        checkinSummary,
        streakSnapshot,
      })
  );
  const upgradeStripIndex = Math.min(UPGRADE_STRIP_INDEX, sectionIds.length);
  let entranceIndex = 0;
  const nextEntrance = () => entranceIndex++;

  const renderUpgradeStrip = (slot: number) => {
    if (!showFreeStrip || slot !== upgradeStripIndex) {
      return null;
    }
    return (
      <EnterOnMount index={nextEntrance()}>
        <HomeUpgradeStrip
          onPress={() =>
            trackHomeLink('welcome_strip', '/records', () =>
              router.push('/records')
            )
          }
        />
      </EnterOnMount>
    );
  };

  return (
    <>
      <StandardLayout
        title={greetingTitle}
        subtitle={formatTodayDate()}
        titleAccessory={titleAccessory}
        headerActions={
          <Pressable
            ref={customiseButtonRef}
            onPress={() => {
              posthog.capture(posthogEventsNames.home.customiseOpened);
              setCustomiseOpen(true);
            }}
            hitSlop={(MIN_TARGET_SIZE - 32) / 2}
            style={({ pressed }) => [
              styles.customiseButton,
              pressed && styles.customiseButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Customise home"
            accessibilityHint="Reorder home sections. Pro can also show or hide them."
          >
            <Ionicons
              name="reorder-three"
              size={20}
              color={color.textPrimary}
            />
            <Text style={styles.customiseLabel}>Customise</Text>
          </Pressable>
        }
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

            {hideDecisionPending ? (
              <View style={styles.skeletons}>
                <Skeleton
                  width="100%"
                  height={208}
                  radius="md"
                  accessibilityLabel="Loading home"
                />
                <Skeleton width="100%" height={96} radius="md" />
              </View>
            ) : sectionIds.length === 0 ? (
              <Text style={styles.emptyHome}>
                Every section is hidden. Customise home to show them again.
              </Text>
            ) : (
              <>
                {sectionIds.map((id, index) => (
                  <React.Fragment key={id}>
                    {renderUpgradeStrip(index)}
                    <EnterOnMount index={nextEntrance()}>
                      <HomeSection
                        id={id}
                        programSummary={programSummary}
                        onOpenProgram={() =>
                          trackHomeLink(
                            programSummary
                              ? 'your_program_card'
                              : 'pick_program_card',
                            '/program',
                            () => router.push('/program')
                          )
                        }
                        temperedToday={temperedToday}
                        temperedWorkout={temperedWorkout}
                        date={now}
                        showProBadge={showFreeStrip}
                        onOpenDailyWorkout={(workoutId) =>
                          trackHomeLink(
                            'tempered_daily_workout',
                            `/workout/${workoutId}`,
                            () =>
                              router.push(
                                `/workout/${workoutId}?view_source=${TEMPERED_DAILY_VIEW_SOURCE}`
                              )
                          )
                        }
                        onOpenDailyWeek={() =>
                          trackHomeLink(
                            'tempered_daily_week',
                            '/tempered-daily',
                            () => router.push('/tempered-daily')
                          )
                        }
                        checkinSummary={checkinSummary}
                        onOpenCheckin={() =>
                          trackHomeLink('daily_checkin_card', '/checkin', () =>
                            router.push('/checkin')
                          )
                        }
                        onOpenWorkouts={() =>
                          trackHomeLink(
                            'just_a_workout_card',
                            '/workouts',
                            () => router.push('/workouts')
                          )
                        }
                        onOpenShop={() =>
                          trackHomeLink('browse_shop_card', '/shop', () =>
                            router.push('/shop')
                          )
                        }
                        streakSnapshot={streakSnapshot}
                        displayName={displayName}
                        recentPbs={recentPbs}
                        weightUnit={weightUnit}
                        onOpenRecords={() =>
                          trackHomeLink('recent_wins_card', '/records', () =>
                            router.push('/records')
                          )
                        }
                        onOpenEmptyRecords={() =>
                          trackHomeLink(
                            'recent_wins_empty_card',
                            '/records/personal-bests',
                            () => router.push('/records')
                          )
                        }
                      />
                    </EnterOnMount>
                  </React.Fragment>
                ))}
                {renderUpgradeStrip(sectionIds.length)}
              </>
            )}
          </View>
        </StandardLayout.Body>
      </StandardLayout>
      <CustomiseHomeSheet
        visible={customiseOpen}
        layout={layout}
        canHideSections={canHideSections}
        onClose={() => setCustomiseOpen(false)}
        onReorder={handleReorder}
        onToggleVisible={handleToggleVisible}
        onUpgrade={() => {
          setCustomiseOpen(false);
          trackHomeLink('customise_upgrade', '/paywall', () => {
            router.push('/paywall');
          });
        }}
        returnFocusRef={customiseButtonRef}
      />
    </>
  );
}
