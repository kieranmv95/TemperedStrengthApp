import { ConditioningTimeModal } from '@/src/components/conditioning/ConditioningTimeModal';
import {
  FilterChip,
  PressableCard,
  Skeleton,
  StandardLayout,
} from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  getConditioningActivity,
  type ConditioningActivity,
  type ConditioningDistance,
} from '@/src/data/conditioningActivities';
import { useLargeText } from '@/src/hooks/useLargeText';
import type { ConditioningEffort } from '@/src/types/conditioningEfforts';
import {
  bestConditioningEffort,
  DURATION_INPUT_ERROR,
  formatConditioningPace,
  formatDuration,
  parseDurationInput,
} from '@/src/utils/conditioningEfforts';
import {
  getConditioningEffortsStore,
  saveConditioningEffort,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TIER_SKELETON_HEIGHT = 88;
const TIER_SKELETON_COUNT = 3;

type ConditioningActivityScreenProps = {
  activityId: string;
};

export function ConditioningActivityScreen({
  activityId,
}: ConditioningActivityScreenProps) {
  const activity = getConditioningActivity(activityId);
  const largeText = useLargeText();
  const [entries, setEntries] = useState<ConditioningEffort[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [logVisible, setLogVisible] = useState(false);
  const [selectedDistanceM, setSelectedDistanceM] = useState(
    activity?.defaultDistanceM ?? 0
  );
  const [durationInput, setDurationInput] = useState('');
  const [logDate, setLogDate] = useState(() => new Date());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const store = await getConditioningEffortsStore();
      const byDistance = store[activityId] ?? {};
      setEntries(Object.values(byDistance).flat());
    } catch (error) {
      console.error('Error loading conditioning efforts:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [activityId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openLog = useCallback(() => {
    if (!activity) return;
    setDurationInput('');
    setSelectedDistanceM(activity.defaultDistanceM);
    setLogDate(new Date());
    setLogVisible(true);
  }, [activity]);

  const handleSave = useCallback(async () => {
    if (!activity) return;
    const durationMs = parseDurationInput(durationInput);
    if (durationMs === null) {
      Alert.alert('Invalid time', DURATION_INPUT_ERROR);
      return;
    }
    setSaving(true);
    try {
      const { isPR } = await saveConditioningEffort(
        activity.id,
        selectedDistanceM,
        durationMs,
        logDate.toISOString()
      );
      Keyboard.dismiss();
      setLogVisible(false);
      const distance = activity.distances.find(
        (item) => item.distanceM === selectedDistanceM
      );
      const label = distance?.label ?? 'effort';
      Alert.alert(
        isPR ? 'New personal best' : 'Effort logged',
        isPR
          ? `${label} is now ${formatDuration(durationMs)}.`
          : `Saved to ${label} history.`
      );
      await load();
    } catch (error) {
      console.error('Error saving conditioning effort:', error);
      Alert.alert('Error', 'Could not save effort.');
    } finally {
      setSaving(false);
    }
  }, [activity, durationInput, selectedDistanceM, logDate, load]);

  if (!activity) {
    return (
      <StandardLayout title="Conditioning" onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <Text style={styles.emptyTitle}>Activity not found</Text>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout
      title={activity.name}
      subtitle={
        activity.summary ?? `${activity.equipment} · time for a set distance`
      }
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.body}>
          <Pressable
            style={({ pressed }) => [
              styles.logButton,
              pressed && styles.logButtonPressed,
            ]}
            onPress={openLog}
            accessibilityRole="button"
            accessibilityLabel="Log effort"
          >
            <Ionicons name="add" size={22} color={color.onGold} />
            <Text style={styles.logButtonText}>Log effort</Text>
          </Pressable>

          {loading || entries === null ? (
            <View style={styles.tierList}>
              {Array.from({ length: TIER_SKELETON_COUNT }, (_, index) => (
                <Skeleton
                  key={index}
                  width="100%"
                  height={TIER_SKELETON_HEIGHT}
                  radius="md"
                  accessibilityLabel={
                    index === 0 ? 'Loading personal bests' : undefined
                  }
                />
              ))}
            </View>
          ) : (
            <View style={styles.tierList}>
              {activity.distances.map((distance) => (
                <DistanceRow
                  key={distance.distanceM}
                  activity={activity}
                  distance={distance}
                  entries={entries.filter(
                    (entry) => entry.distanceM === distance.distanceM
                  )}
                  stacked={largeText}
                />
              ))}
            </View>
          )}
        </View>
      </StandardLayout.Body>

      <ConditioningTimeModal
        visible={logVisible}
        title="Log effort"
        hint="Faster times become the best for that distance. Other distances stay as they are."
        durationInput={durationInput}
        onChangeDuration={setDurationInput}
        date={logDate}
        onChangeDate={setLogDate}
        saving={saving}
        saveLabel="Save effort"
        onCancel={() => setLogVisible(false)}
        onSave={handleSave}
        distancePicker={
          <View style={styles.modalField}>
            <Text
              style={styles.modalLabel}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              {activity.tierLabel ?? 'Distance'}
            </Text>
            <View style={styles.distanceChips}>
              {activity.distances.map((distance) => (
                <FilterChip
                  key={distance.distanceM}
                  label={distance.label}
                  selected={selectedDistanceM === distance.distanceM}
                  onPress={() => setSelectedDistanceM(distance.distanceM)}
                  accessibilityLabel={`Distance ${distance.label}`}
                />
              ))}
            </View>
          </View>
        }
      />
    </StandardLayout>
  );
}

type DistanceRowProps = {
  activity: ConditioningActivity;
  distance: ConditioningDistance;
  entries: ConditioningEffort[];
  stacked: boolean;
};

function DistanceRow({
  activity,
  distance,
  entries,
  stacked,
}: DistanceRowProps) {
  const best = bestConditioningEffort(entries);
  const latest = latestEffort(entries);
  const count = entries.length;
  const showLatest =
    latest !== undefined && best !== undefined && latest.id !== best.id;
  const countLabel = `${count} ${count === 1 ? 'entry' : 'entries'}`;
  const bestTime = best ? formatDuration(best.durationMs) : null;
  const bestPace = best
    ? formatConditioningPace(best.durationMs, distance.distanceM, activity)
    : null;
  const bestDate = best ? new Date(best.achievedAt).toLocaleDateString() : null;

  return (
    <PressableCard
      onPress={() =>
        router.push(
          `/records/conditioning/${activity.id}/${distance.distanceM}`
        )
      }
      accessibilityLabel={
        best
          ? `${distance.label}, best ${bestTime}${bestPace ? `, ${bestPace}` : ''}, ${bestDate}`
          : `${distance.label}, not set`
      }
      accessibilityHint="Opens effort history"
    >
      <View style={[styles.tierRow, stacked && styles.tierRowStacked]}>
        <View style={styles.tierRowLeft}>
          <Text style={styles.tierLabel}>{distance.label}</Text>
          {distance.detail ? (
            <Text style={styles.tierCount}>{distance.detail}</Text>
          ) : null}
          {count > 0 ? (
            <Text style={styles.tierCount}>{countLabel}</Text>
          ) : null}
        </View>
        {best && bestTime && bestDate ? (
          <View style={styles.tierValues}>
            <View style={styles.tierHolder}>
              {showLatest ? (
                <Text style={styles.tierSubLabel}>Best</Text>
              ) : null}
              <Text style={[styles.tierTime, styles.tierTimeBest]}>
                {bestTime}
              </Text>
              {bestPace ? (
                <Text style={styles.tierDate}>{bestPace}</Text>
              ) : null}
              <Text style={styles.tierDate}>{bestDate}</Text>
            </View>
            {showLatest && latest ? (
              <View style={styles.tierHolder}>
                <Text style={styles.tierSubLabel}>Latest</Text>
                <Text style={styles.tierTime}>
                  {formatDuration(latest.durationMs)}
                </Text>
                <Text style={styles.tierDate}>
                  {new Date(latest.achievedAt).toLocaleDateString()}
                </Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={styles.tierEmpty}>Not set</Text>
        )}
      </View>
    </PressableCard>
  );
}

function latestEffort(
  entries: ConditioningEffort[]
): ConditioningEffort | undefined {
  if (entries.length === 0) {
    return undefined;
  }
  let latest = entries[0];
  for (const entry of entries) {
    if (entry.achievedAt > latest.achievedAt) {
      latest = entry;
    }
  }
  return latest;
}

const styles = StyleSheet.create({
  body: {
    gap: space.md,
  },
  emptyTitle: {
    ...typography.headline,
    color: color.textPrimary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  logButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  logButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  tierList: {
    gap: space.sm,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  tierRowStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  tierRowLeft: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  tierLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  tierCount: {
    ...typography.caption,
    color: color.textSecondary,
  },
  tierValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  tierHolder: {
    alignItems: 'center',
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    borderRadius: radius.sm,
    backgroundColor: color.surface2,
  },
  tierSubLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  tierTime: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  tierTimeBest: {
    color: color.gold,
  },
  tierDate: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textTertiary,
  },
  tierEmpty: {
    ...typography.callout,
    color: color.textTertiary,
  },
  modalField: {
    gap: space.xxs,
  },
  modalLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  distanceChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
