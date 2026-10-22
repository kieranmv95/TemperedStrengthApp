import {
  CheckinDayList,
  visibleTrackedBehaviours,
} from '@/src/components/checkin/CheckinDayList';
import { CheckinHistoryCalendar } from '@/src/components/checkin/CheckinHistoryCalendar';
import { CheckinListSkeleton } from '@/src/components/checkin/CheckinListSkeleton';
import { CheckinLogModal } from '@/src/components/checkin/CheckinLogModal';
import { ActionChip, SectionHeader, StandardLayout } from '@/src/components/ds';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useLargeText } from '@/src/hooks/useLargeText';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { checkinScreenStyles as styles } from '@/src/screens/checkin/checkinScreenStyles';
import { formatLocalYMD } from '@/src/services/streakService';
import type {
  BehaviourEntry,
  CatalogueBehaviour,
  CheckinSettings,
  TrackedBehaviour,
} from '@/src/types/checkin';
import type {
  DerivedSupplementDose,
  Supplement,
  SupplementLog,
  SupplementLogStatus,
} from '@/src/types/supplements';
import { needsLapseSelection } from '@/src/utils/checkin/caps';
import {
  getBehaviourCatalogue,
  refreshBehaviourCatalogueFromRemote,
} from '@/src/utils/checkin/catalogue';
import {
  cyclePhaseLabel,
  deriveCyclePhase,
} from '@/src/utils/checkin/cyclePhase';
import { ensureCheckinLapseGate } from '@/src/utils/checkin/lapse';
import { addLocalDays } from '@/src/utils/checkin/schedule';
import {
  buildCheckinStats,
  type CheckinStats,
} from '@/src/utils/checkin/stats';
import {
  deriveDosesForDate,
  getBehaviourEntriesForDate,
  getBehaviourEntriesInRange,
  getSupplementLogsForDate,
  getSupplementLogsInRange,
  getSupplements,
  getTrackedBehaviours,
  upsertBehaviourEntry,
  upsertSupplementLog,
} from '@/src/utils/storage';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { AppState, Pressable, Text, View } from 'react-native';

type CheckinSegment = 'today' | 'history';

type LogTarget = {
  date: string;
  behaviour: CatalogueBehaviour;
};

/**
 * Entries are loaded a year back so the completion streak is not clipped by the
 * window used for the 7 and 30 day percentages.
 */
const STATS_WINDOW_DAYS = 365;

function lastDateOfMonth(month: string): string {
  const [ys, ms] = month.split('-');
  const days = new Date(Number(ys), Number(ms), 0).getDate();
  return `${month}-${String(days).padStart(2, '0')}`;
}

function formatDayLabel(date: string, today: string): string {
  if (date === today) {
    return 'Today';
  }
  const [ys, ms, ds] = date.split('-');
  return new Date(Number(ys), Number(ms) - 1, Number(ds)).toLocaleDateString(
    undefined,
    { weekday: 'short', day: 'numeric', month: 'short' }
  );
}

export function CheckinScreen() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const { dataRevision } = useSyncManager();
  const largeText = useLargeText();

  const [segment, setSegment] = useState<CheckinSegment>('today');
  const [today, setToday] = useState(() => formatLocalYMD(new Date()));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [settings, setSettings] = useState<CheckinSettings | null>(null);
  const [tracked, setTracked] = useState<TrackedBehaviour[]>([]);
  const [behavioursById, setBehavioursById] = useState<
    ReadonlyMap<string, CatalogueBehaviour>
  >(new Map());
  const [weekStartsOn, setWeekStartsOn] = useState(1);
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [stats, setStats] = useState<CheckinStats>({
    currentStreak: 0,
    completion7: 0,
    completion30: 0,
  });
  const [cyclePhaseText, setCyclePhaseText] = useState<string | null>(null);
  const [todayEntries, setTodayEntries] = useState<BehaviourEntry[]>([]);
  const [todayLogs, setTodayLogs] = useState<SupplementLog[]>([]);

  const [historyMonth, setHistoryMonth] = useState(() =>
    formatLocalYMD(new Date()).slice(0, 7)
  );
  const [markedDates, setMarkedDates] = useState<string[]>([]);
  const [historyDate, setHistoryDate] = useState<string | null>(null);
  const [historyEntries, setHistoryEntries] = useState<BehaviourEntry[]>([]);
  const [historyLogs, setHistoryLogs] = useState<SupplementLog[]>([]);
  const [historyDayLoading, setHistoryDayLoading] = useState(false);

  const [logTarget, setLogTarget] = useState<LogTarget | null>(null);

  const loadDay = useCallback(
    async (localDate: string) => {
      setError(null);
      try {
        const nextSettings = await ensureCheckinLapseGate(isPro);
        const [catalogue, nextTracked, nextSupplements, entries, logs] =
          await Promise.all([
            getBehaviourCatalogue(),
            getTrackedBehaviours(),
            getSupplements(),
            getBehaviourEntriesInRange(
              addLocalDays(localDate, -(STATS_WINDOW_DAYS - 1)),
              localDate
            ),
            getSupplementLogsForDate(localDate),
          ]);

        if (
          needsLapseSelection({
            isPro,
            tracked: nextTracked,
            supplements: nextSupplements,
            lapsePending: nextSettings.lapsePending,
            editableBehaviourIds: nextSettings.editableBehaviourIds,
          })
        ) {
          router.replace('/checkin/choose-active');
          return;
        }

        const nextBehavioursById = new Map(
          catalogue.behaviours.map((behaviour) => [behaviour.id, behaviour])
        );
        const visibleIds = visibleTrackedBehaviours(
          nextTracked,
          nextBehavioursById
        ).map((behaviour) => behaviour.id);

        setSettings(nextSettings);
        setTracked(nextTracked);
        setBehavioursById(nextBehavioursById);
        setWeekStartsOn(catalogue.weekStartsOn);
        setSupplements(nextSupplements);
        setTodayEntries(entries.filter((entry) => entry.date === localDate));
        setTodayLogs(logs);
        setStats(
          buildCheckinStats({
            today: localDate,
            trackedBehaviourIds: visibleIds,
            entries,
          })
        );
        setCyclePhaseText(
          nextSettings.womensHealthVisible
            ? cyclePhaseLabel(deriveCyclePhase(entries))
            : null
        );
      } catch (loadError) {
        console.error('Error loading check-in:', loadError);
        setError('Could not load your check-in. Try again in a moment.');
      } finally {
        setLoading(false);
      }
    },
    [isPro]
  );

  const loadHistoryMonth = useCallback(async (month: string) => {
    try {
      const start = `${month}-01`;
      const end = lastDateOfMonth(month);
      const [entries, logs] = await Promise.all([
        getBehaviourEntriesInRange(start, end),
        getSupplementLogsInRange(start, end),
      ]);
      const dates = new Set<string>();
      for (const entry of entries) {
        dates.add(entry.date);
      }
      for (const log of logs) {
        dates.add(log.date);
      }
      setMarkedDates(Array.from(dates));
    } catch (monthError) {
      console.error('Error loading check-in history month:', monthError);
      setMarkedDates([]);
    }
  }, []);

  const loadHistoryDate = useCallback(async (date: string) => {
    setHistoryDayLoading(true);
    try {
      const [entries, logs] = await Promise.all([
        getBehaviourEntriesForDate(date),
        getSupplementLogsForDate(date),
      ]);
      setHistoryEntries(entries);
      setHistoryLogs(logs);
    } catch (dayError) {
      console.error('Error loading check-in history day:', dayError);
      setHistoryEntries([]);
      setHistoryLogs([]);
    } finally {
      setHistoryDayLoading(false);
    }
  }, []);

  // Loading before the entitlement resolves would read a Pro user as Free and
  // wrongly push them into the lapse gate, so wait it out.
  const reloadForLocalDate = useCallback(() => {
    if (subscriptionLoading) {
      return;
    }
    const localDate = formatLocalYMD(new Date());
    setToday(localDate);
    void loadDay(localDate);
  }, [loadDay, subscriptionLoading]);

  useFocusEffect(
    useCallback(() => {
      reloadForLocalDate();
    }, [reloadForLocalDate])
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') {
        return;
      }
      reloadForLocalDate();
    });
    return () => subscription.remove();
  }, [reloadForLocalDate]);

  useEffect(() => {
    if (dataRevision < 1) {
      return;
    }
    reloadForLocalDate();
  }, [dataRevision, reloadForLocalDate]);

  // Catalogue updates are best-effort and must never hold up the screen.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const catalogue = await refreshBehaviourCatalogueFromRemote();
        if (cancelled) {
          return;
        }
        setBehavioursById(
          new Map(
            catalogue.behaviours.map((behaviour) => [behaviour.id, behaviour])
          )
        );
        setWeekStartsOn(catalogue.weekStartsOn);
      } catch (catalogueError) {
        console.error('Failed to refresh behaviour catalogue:', catalogueError);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (segment !== 'history') {
      return;
    }
    void loadHistoryMonth(historyMonth);
  }, [segment, historyMonth, loadHistoryMonth]);

  const refreshAfterWrite = useCallback(
    async (date: string) => {
      await loadDay(today);
      if (date !== today) {
        await loadHistoryDate(date);
      }
      if (segment === 'history') {
        await loadHistoryMonth(historyMonth);
      }
    },
    [historyMonth, loadDay, loadHistoryDate, loadHistoryMonth, segment, today]
  );

  const handleSaveEntry = useCallback(
    async (value: boolean | number | string) => {
      if (!logTarget) {
        return;
      }
      setSaving(true);
      try {
        await upsertBehaviourEntry({
          date: logTarget.date,
          behaviourId: logTarget.behaviour.id,
          value,
        });
        setLogTarget(null);
        await refreshAfterWrite(logTarget.date);
      } catch (saveError) {
        console.error('Error saving behaviour entry:', saveError);
        setError('Could not save that check-in. Try again.');
      } finally {
        setSaving(false);
      }
    },
    [logTarget, refreshAfterWrite]
  );

  const handleSetDoseStatus = useCallback(
    async (
      date: string,
      dose: DerivedSupplementDose,
      status: SupplementLogStatus
    ) => {
      try {
        await upsertSupplementLog({
          date,
          supplementId: dose.supplementId,
          scheduledTime: dose.scheduledTime,
          status,
        });
        await refreshAfterWrite(date);
      } catch (doseError) {
        console.error('Error saving supplement dose:', doseError);
        setError('Could not save that dose. Try again.');
      }
    },
    [refreshAfterWrite]
  );

  const handleSelectHistoryDate = useCallback(
    (date: string) => {
      setHistoryDate(date);
      void loadHistoryDate(date);
    },
    [loadHistoryDate]
  );

  const renderHeaderActions = () => (
    <>
      <ActionChip
        label="Behaviours"
        icon="add"
        tone="neutral"
        onPress={() => router.push('/checkin/settings')}
        accessibilityLabel="Add behaviours"
      />
      <ActionChip
        label="Supplements"
        icon="add"
        tone="neutral"
        onPress={() => router.push('/checkin/supplements')}
        accessibilityLabel="Add supplements"
      />
    </>
  );

  const renderSegments = () => (
    <View style={styles.segmentRow} accessibilityRole="radiogroup">
      {(
        [
          { key: 'today', label: 'Today' },
          { key: 'history', label: 'History' },
        ] as const
      ).map((option) => {
        const isActive = segment === option.key;
        return (
          <Pressable
            key={option.key}
            style={({ pressed }) => [
              styles.segmentOption,
              pressed && !isActive && styles.segmentOptionPressed,
              isActive && styles.segmentOptionActive,
            ]}
            onPress={() => setSegment(option.key)}
            accessibilityRole="radio"
            accessibilityLabel={option.label}
            accessibilityState={{ checked: isActive }}
          >
            <Text
              style={[styles.segmentText, isActive && styles.segmentTextActive]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const renderStats = () => (
    <View style={styles.section}>
      <View style={[styles.statsRow, largeText && styles.statsStacked]}>
        <View
          style={styles.statCard}
          accessible
          accessibilityLabel={`${stats.currentStreak} day streak`}
        >
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Day streak</Text>
        </View>
        <View
          style={styles.statCard}
          accessible
          accessibilityLabel={`${stats.completion7}% complete, last 7 days`}
        >
          <Text style={styles.statValue}>{stats.completion7}%</Text>
          <Text style={styles.statLabel}>Last 7 days</Text>
        </View>
        <View
          style={styles.statCard}
          accessible
          accessibilityLabel={`${stats.completion30}% complete, last 30 days`}
        >
          <Text style={styles.statValue}>{stats.completion30}%</Text>
          <Text style={styles.statLabel}>Last 30 days</Text>
        </View>
      </View>
      {cyclePhaseText ? (
        <Text style={styles.sectionNote}>{cyclePhaseText}</Text>
      ) : null}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle} accessibilityRole="header">
        Nothing to check in yet
      </Text>
      <Text style={styles.emptyBody}>
        Pick the daily behaviours you want to track, and add any supplements you
        take.
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.primaryButtonPressed,
        ]}
        onPress={() => router.push('/checkin/settings')}
        accessibilityRole="button"
        accessibilityLabel="Choose behaviours"
      >
        <Text style={styles.primaryButtonText}>Choose behaviours</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          styles.secondaryButton,
          pressed && styles.secondaryButtonPressed,
        ]}
        onPress={() => router.push('/checkin/supplements')}
        accessibilityRole="button"
        accessibilityLabel="Add supplements"
      >
        <Text style={styles.secondaryButtonText}>Add supplements</Text>
      </Pressable>
    </View>
  );

  const renderToday = () => {
    if (!settings) {
      return null;
    }
    const doses = deriveDosesForDate({
      date: today,
      today,
      supplements,
      logs: todayLogs,
    });
    const hasAnything =
      visibleTrackedBehaviours(tracked, behavioursById).length > 0 ||
      doses.length > 0;

    if (!hasAnything) {
      return renderEmptyState();
    }

    return (
      <View style={styles.page}>
        {renderStats()}
        <CheckinDayList
          tracked={tracked}
          behavioursById={behavioursById}
          entries={todayEntries}
          doses={doses}
          supplements={supplements}
          settings={settings}
          isPro={isPro}
          onPressBehaviour={(behaviour) =>
            setLogTarget({ date: today, behaviour })
          }
          onSetDoseStatus={(dose, status) =>
            void handleSetDoseStatus(today, dose, status)
          }
        />
      </View>
    );
  };

  const renderHistory = () => {
    if (!settings) {
      return null;
    }
    const doses =
      historyDate === null
        ? []
        : deriveDosesForDate({
            date: historyDate,
            today,
            supplements,
            logs: historyLogs,
          });

    return (
      <View style={styles.page}>
        <CheckinHistoryCalendar
          month={historyMonth}
          weekStartsOn={weekStartsOn}
          today={today}
          markedDates={markedDates}
          selectedDate={historyDate}
          onChangeMonth={setHistoryMonth}
          onSelectDate={handleSelectHistoryDate}
        />
        {historyDate === null ? (
          <Text style={styles.sectionNote}>
            Pick a day to see and edit what you logged.
          </Text>
        ) : historyDayLoading ? (
          <CheckinListSkeleton accessibilityLabel="Loading day" />
        ) : (
          <View style={styles.section}>
            <SectionHeader title={formatDayLabel(historyDate, today)} />
            <CheckinDayList
              tracked={tracked}
              behavioursById={behavioursById}
              entries={historyEntries}
              doses={doses}
              supplements={supplements}
              settings={settings}
              isPro={isPro}
              onPressBehaviour={(behaviour) =>
                setLogTarget({ date: historyDate, behaviour })
              }
              onSetDoseStatus={(dose, status) =>
                void handleSetDoseStatus(historyDate, dose, status)
              }
            />
          </View>
        )}
      </View>
    );
  };

  const logTargetEntry =
    logTarget === null
      ? undefined
      : (logTarget.date === today ? todayEntries : historyEntries).find(
          (entry) => entry.behaviourId === logTarget.behaviour.id
        );

  return (
    <StandardLayout
      title="Daily check-in"
      subtitle="Tick off the habits that keep you consistent."
      onBackPress={() => router.back()}
      headerActions={renderHeaderActions()}
    >
      <StandardLayout.Body>
        <View style={styles.page}>
          {renderSegments()}
          {error ? (
            <Text
              style={styles.errorText}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {error}
            </Text>
          ) : null}
          {loading ? (
            <CheckinListSkeleton accessibilityLabel="Loading check-in" />
          ) : segment === 'today' ? (
            renderToday()
          ) : (
            renderHistory()
          )}

          <CheckinLogModal
            visible={logTarget !== null}
            behaviour={logTarget?.behaviour ?? null}
            dateLabel={
              logTarget === null ? '' : formatDayLabel(logTarget.date, today)
            }
            value={logTargetEntry?.value}
            saving={saving}
            onClose={() => setLogTarget(null)}
            onSave={(value) => void handleSaveEntry(value)}
          />
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
