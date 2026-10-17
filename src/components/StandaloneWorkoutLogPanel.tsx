import { SectionHeader, Skeleton } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import { useLargeText } from '@/src/hooks/useLargeText';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type {
  StandaloneLogPayload,
  StandaloneWorkoutLogEntry,
} from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  buildPayloadFromForm,
  loadEntryIntoForm,
  logListPrimarySummary,
  resetFormForSchema,
  type FormState,
} from '@/src/utils/standaloneWorkoutLogForm';
import { formatStandaloneLogCardTimestamp } from '@/src/utils/standaloneWorkoutLogFormat';
import {
  deleteStandaloneWorkoutLogEntry,
  getStandaloneWorkoutLogsForWorkout,
  upsertStandaloneWorkoutLogEntry,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { increment } from '../services/metricService';
import { BestLine } from './standaloneWorkoutLog/BestLine';
import { LogFormModal } from './standaloneWorkoutLog/LogFormModal';
import {
  LOG_CARD_SKELETON_HEIGHT,
  standaloneWorkoutLogPanelStyles as styles,
} from './standaloneWorkoutLog/standaloneWorkoutLogPanelStyles';

function newStandaloneLogId(): string {
  return `swl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

/** Row shape when `SingleWorkout.blocks` is the scaled difficulty branch. */
type ScaledBlockGroup = Extract<
  SingleWorkout['blocks'][number],
  { scale: string }
>;

function isScaledBlocks(
  blocks: SingleWorkout['blocks']
): blocks is ScaledBlockGroup[] {
  const first = blocks[0];
  return (
    typeof first === 'object' &&
    first !== null &&
    'scale' in first &&
    'blocks' in first
  );
}

function exerciseCountForWorkout(workout: SingleWorkout): number {
  if (isScaledBlocks(workout.blocks)) {
    return workout.blocks.reduce(
      (n, s) =>
        n +
        s.blocks.reduce((inner, b) => inner + (b.movements?.length ?? 0), 0),
      0
    );
  }
  return workout.blocks.reduce((n, b) => n + (b.movements?.length ?? 0), 0);
}

function durationMinsForLog(
  workout: SingleWorkout,
  payload: StandaloneLogPayload
): number {
  if (payload.kind === 'duration') {
    return Math.max(0, Math.round(payload.durationSeconds / 60));
  }
  return workout.estimatedTime;
}

type StandaloneWorkoutLogPanelProps = {
  workout: SingleWorkout;
};

export function StandaloneWorkoutLogPanel({
  workout,
}: StandaloneWorkoutLogPanelProps) {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const [logs, setLogs] = useState<StandaloneWorkoutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] =
    useState<StandaloneWorkoutLogEntry | null>(null);
  const [form, setForm] = useState<FormState>(() => resetFormForSchema());

  const refreshLogs = useCallback(async () => {
    try {
      const data = await getStandaloneWorkoutLogsForWorkout(workout.id);
      setLogs(data);
    } catch (e) {
      console.error(e);
    }
  }, [workout.id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    void (async () => {
      try {
        const data = await getStandaloneWorkoutLogsForWorkout(workout.id);
        if (!cancelled) {
          setLogs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [workout.id]);

  const openNew = () => {
    setEditingEntry(null);
    setForm(resetFormForSchema());
    setModalVisible(true);
  };

  const openEdit = (entry: StandaloneWorkoutLogEntry) => {
    setEditingEntry(entry);
    setForm(loadEntryIntoForm(entry, resetFormForSchema()));
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingEntry(null);
  };

  const handleSave = async () => {
    const built = buildPayloadFromForm(workout.logSchema, form);
    if (!built.ok) {
      Alert.alert('Check input', built.error);
      return;
    }

    const now = new Date().toISOString();
    const loggedAt = new Date(form.loggedAtMs).toISOString();
    const notesTrim = form.notesInput.trim();
    const isNotesOnlySchema = workout.logSchema.kind === 'notes_only';
    const optionalSessionNotes = isNotesOnlySchema
      ? undefined
      : notesTrim || undefined;

    const entry: StandaloneWorkoutLogEntry = editingEntry
      ? {
          ...editingEntry,
          loggedAt,
          payload: built.payload,
          notes: optionalSessionNotes,
          updatedAt: now,
        }
      : {
          id: newStandaloneLogId(),
          workoutId: workout.id,
          loggedAt,
          updatedAt: now,
          payload: built.payload,
          notes: optionalSessionNotes,
        };

    try {
      await increment('workouts_logged');
      await upsertStandaloneWorkoutLogEntry(entry);
      posthog?.capture(posthogEventsNames.workout.logged, {
        workout_name: workout.title,
        exercise_count: exerciseCountForWorkout(workout),
        duration_mins: durationMinsForLog(workout, built.payload),
      });
      await refreshLogs();
      closeModal();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Could not save this log.');
    }
  };

  const confirmDelete = (entry: StandaloneWorkoutLogEntry) => {
    Alert.alert('Delete log?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteStandaloneWorkoutLogEntry(workout.id, entry.id);
            await refreshLogs();
          } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Could not delete this log.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.panel}>
      <SectionHeader title="Your logs" />
      <BestLine workout={workout} logs={logs} />

      <Pressable
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
        ]}
        onPress={openNew}
        accessibilityRole="button"
      >
        <Ionicons name="add" size={22} color={color.onGold} />
        <Text style={styles.addButtonText}>
          {logs.length === 0 ? 'Log result' : 'Add another log'}
        </Text>
      </Pressable>

      {loading ? (
        <Skeleton
          width="100%"
          height={LOG_CARD_SKELETON_HEIGHT}
          radius="md"
          accessibilityLabel="Loading logs"
        />
      ) : logs.length === 0 ? (
        <Text style={styles.emptyText}>
          No logs yet. Use the button above to add one.
        </Text>
      ) : (
        logs.map((entry) => {
          const logStamp = formatStandaloneLogCardTimestamp(entry.loggedAt);
          const summary = logListPrimarySummary(entry, workout.logSchema);
          const showNotes =
            !!entry.notes && entry.payload.kind !== 'notes_only';
          const whenText = logStamp ? `Logged ${logStamp}` : entry.loggedAt;
          return (
            <View key={entry.id} style={styles.logCard}>
              <View style={[styles.logRow, largeText && styles.logRowStacked]}>
                <View
                  style={[
                    styles.logRowMain,
                    largeText && styles.logRowMainStacked,
                  ]}
                  accessible
                  accessibilityLabel={[
                    summary,
                    whenText,
                    showNotes ? entry.notes : null,
                  ]
                    .filter((part): part is string => !!part)
                    .join(', ')}
                >
                  <Text style={styles.logSummary}>{summary}</Text>
                  {logStamp ? (
                    <Text style={styles.logTimestampLine}>{logStamp}</Text>
                  ) : (
                    <Text
                      style={[
                        styles.logTimestampLine,
                        styles.logTimestampFallback,
                      ]}
                    >
                      {entry.loggedAt}
                    </Text>
                  )}
                  {showNotes ? (
                    <Text style={styles.logNotes}>{entry.notes}</Text>
                  ) : null}
                </View>
                <View
                  style={[
                    styles.logRowActions,
                    largeText && styles.logRowActionsStacked,
                  ]}
                >
                  <Pressable
                    style={({ pressed }) => [
                      styles.iconActionBtn,
                      pressed && styles.iconActionBtnPressed,
                    ]}
                    onPress={() => openEdit(entry)}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit log, ${logStamp ?? entry.loggedAt}`}
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={color.textSecondary}
                    />
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.iconActionBtn,
                      pressed && styles.iconActionBtnPressed,
                    ]}
                    onPress={() => confirmDelete(entry)}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete log, ${logStamp ?? entry.loggedAt}`}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={color.danger}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          );
        })
      )}

      <LogFormModal
        visible={modalVisible}
        workout={workout}
        editingEntry={editingEntry}
        form={form}
        onChangeForm={setForm}
        onClose={closeModal}
        onSave={handleSave}
      />
    </View>
  );
}
