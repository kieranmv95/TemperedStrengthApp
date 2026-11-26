import { ConditioningTimeModal } from '@/src/components/conditioning/ConditioningTimeModal';
import { ActionChip, Skeleton, StandardLayout } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  getConditioningActivity,
  getConditioningDistance,
} from '@/src/data/conditioningActivities';
import { useLargeText } from '@/src/hooks/useLargeText';
import type { ConditioningEffort } from '@/src/types/conditioningEfforts';
import {
  bestConditioningEffort,
  DURATION_INPUT_ERROR,
  formatDuration,
  parseDurationInput,
} from '@/src/utils/conditioningEfforts';
import {
  deleteConditioningEffort,
  getConditioningEffortsStore,
  saveConditioningEffort,
  updateConditioningEffort,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const ENTRY_SKELETON_HEIGHT = 76;
const ENTRY_SKELETON_COUNT = 3;

type ConditioningDistanceScreenProps = {
  activityId: string;
  distanceM: number;
};

export function ConditioningDistanceScreen({
  activityId,
  distanceM,
}: ConditioningDistanceScreenProps) {
  const activity = getConditioningActivity(activityId);
  const distance = getConditioningDistance(activityId, distanceM);
  const largeText = useLargeText();
  const [entries, setEntries] = useState<ConditioningEffort[] | null>(null);
  const [loading, setLoading] = useState(true);

  const [addVisible, setAddVisible] = useState(false);
  const [addDuration, setAddDuration] = useState('');
  const [addDate, setAddDate] = useState(() => new Date());
  const [addSaving, setAddSaving] = useState(false);

  const [editEntry, setEditEntry] = useState<ConditioningEffort | null>(null);
  const [editDuration, setEditDuration] = useState('');
  const [editDate, setEditDate] = useState(() => new Date());
  const [editSaving, setEditSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const store = await getConditioningEffortsStore();
      const rows = store[activityId]?.[distanceM] ?? [];
      setEntries(
        [...rows].sort(
          (a, b) =>
            new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime()
        )
      );
    } catch (error) {
      console.error('Error loading conditioning history:', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [activityId, distanceM]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const openAdd = useCallback(() => {
    setAddDuration('');
    setAddDate(new Date());
    setAddVisible(true);
  }, []);

  const saveAdd = useCallback(async () => {
    if (!activity || !distance) return;
    const durationMs = parseDurationInput(addDuration);
    if (durationMs === null) {
      Alert.alert('Invalid time', DURATION_INPUT_ERROR);
      return;
    }
    setAddSaving(true);
    try {
      const { isPR } = await saveConditioningEffort(
        activity.id,
        distance.distanceM,
        durationMs,
        addDate.toISOString()
      );
      Keyboard.dismiss();
      setAddVisible(false);
      if (isPR) {
        Alert.alert(
          'New personal best',
          `${distance.label} is now ${formatDuration(durationMs)}.`
        );
      }
      await load();
    } catch (error) {
      console.error('Error saving conditioning effort:', error);
      Alert.alert('Error', 'Could not save effort.');
    } finally {
      setAddSaving(false);
    }
  }, [activity, distance, addDuration, addDate, load]);

  const openEdit = useCallback((entry: ConditioningEffort) => {
    setEditEntry(entry);
    setEditDuration(formatDuration(entry.durationMs));
    setEditDate(new Date(entry.achievedAt));
  }, []);

  const saveEdit = useCallback(async () => {
    if (!activity || !distance || !editEntry) return;
    const durationMs = parseDurationInput(editDuration);
    if (durationMs === null) {
      Alert.alert('Invalid time', DURATION_INPUT_ERROR);
      return;
    }
    setEditSaving(true);
    try {
      await updateConditioningEffort(
        activity.id,
        distance.distanceM,
        editEntry.id,
        { durationMs, achievedAt: editDate.toISOString() }
      );
      Keyboard.dismiss();
      setEditEntry(null);
      await load();
    } catch (error) {
      console.error('Error updating conditioning effort:', error);
      Alert.alert('Error', 'Could not update entry.');
    } finally {
      setEditSaving(false);
    }
  }, [activity, distance, editEntry, editDuration, editDate, load]);

  const confirmDelete = useCallback(
    (entry: ConditioningEffort) => {
      if (!activity || !distance) return;
      const timeText = formatDuration(entry.durationMs);
      const dateText = new Date(entry.achievedAt).toLocaleString();
      Alert.alert('Delete entry', `Remove ${timeText} on ${dateText}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteConditioningEffort(
                activity.id,
                distance.distanceM,
                entry.id
              );
              await load();
            } catch (error) {
              console.error('Error deleting conditioning effort:', error);
              Alert.alert('Error', 'Could not delete entry.');
            }
          },
        },
      ]);
    },
    [activity, distance, load]
  );

  if (!activity || !distance) {
    return (
      <StandardLayout title="Conditioning" onBackPress={() => router.back()}>
        <StandardLayout.Body>
          <Text style={styles.emptyDescription}>Distance not found</Text>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  const best = bestConditioningEffort(entries ?? []);

  return (
    <StandardLayout
      title={`${distance.label} ${activity.name}`}
      disableScroll
      onBackPress={() => router.back()}
      headerActions={
        <ActionChip
          label="Add entry"
          icon="add"
          tone="gold"
          onPress={openAdd}
          accessibilityLabel="Add effort"
        />
      }
    >
      <StandardLayout.Body>
        {loading || entries === null ? (
          <View style={styles.skeletons}>
            {Array.from({ length: ENTRY_SKELETON_COUNT }, (_, index) => (
              <Skeleton
                key={index}
                width="100%"
                height={ENTRY_SKELETON_HEIGHT}
                radius="md"
                accessibilityLabel={index === 0 ? 'Loading history' : undefined}
              />
            ))}
          </View>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={styles.emptyList}>
                No history yet. Tap Add entry to log a time for this distance.
              </Text>
            }
            renderItem={({ item }) => {
              const timeText = formatDuration(item.durationMs);
              const dateText = new Date(item.achievedAt).toLocaleString();
              const isBest = best?.id === item.id;
              return (
                <View
                  style={[styles.entryCard, largeText && styles.entryStacked]}
                >
                  <View style={styles.rowMain}>
                    <Text
                      style={[styles.rowTime, isBest && styles.rowTimeBest]}
                    >
                      {timeText}
                    </Text>
                    <Text style={styles.rowDate}>{dateText}</Text>
                  </View>
                  <View style={styles.rowActions}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rowAction,
                        pressed && styles.rowActionPressed,
                      ]}
                      onPress={() => openEdit(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Edit entry, ${timeText} on ${dateText}`}
                    >
                      <Ionicons
                        name="pencil"
                        size={18}
                        color={color.textPrimary}
                      />
                      <Text style={styles.rowActionText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      style={({ pressed }) => [
                        styles.rowAction,
                        pressed && styles.rowActionDangerPressed,
                      ]}
                      onPress={() => confirmDelete(item)}
                      accessibilityRole="button"
                      accessibilityLabel={`Delete entry, ${timeText} on ${dateText}`}
                      accessibilityHint="Asks to confirm before deleting"
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={color.danger}
                      />
                      <Text style={[styles.rowActionText, styles.dangerText]}>
                        Delete
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />
        )}
      </StandardLayout.Body>

      <ConditioningTimeModal
        visible={addVisible}
        title={`New ${distance.label}`}
        hint="Every save is added to history. The fastest time is the personal best for this distance."
        durationInput={addDuration}
        onChangeDuration={setAddDuration}
        date={addDate}
        onChangeDate={setAddDate}
        saving={addSaving}
        saveLabel="Save effort"
        onCancel={() => setAddVisible(false)}
        onSave={saveAdd}
      />
      <ConditioningTimeModal
        visible={editEntry !== null}
        title="Edit entry"
        durationInput={editDuration}
        onChangeDuration={setEditDuration}
        date={editDate}
        onChangeDate={setEditDate}
        saving={editSaving}
        saveLabel="Save changes"
        onCancel={() => setEditEntry(null)}
        onSave={saveEdit}
      />
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  skeletons: {
    gap: space.sm,
    paddingTop: space.xs,
  },
  listContent: {
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.sm,
    flexGrow: 1,
  },
  emptyList: {
    ...typography.callout,
    color: color.textTertiary,
    textAlign: 'center',
    marginTop: space.xxl,
  },
  entryCard: {
    ...elevation.raised,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
  },
  entryStacked: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowMain: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  rowTime: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  rowTimeBest: {
    color: color.gold,
  },
  rowDate: {
    ...typography.caption,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  rowActions: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  rowAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
  },
  rowActionPressed: {
    backgroundColor: color.surface2,
  },
  rowActionDangerPressed: {
    backgroundColor: color.dangerTint,
  },
  rowActionText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  dangerText: {
    color: color.danger,
  },
});
