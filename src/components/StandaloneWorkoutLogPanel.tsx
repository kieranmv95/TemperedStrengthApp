import { Colors } from '@/src/constants/theme';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
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
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { increment } from '../services/metricService';
import { BestLine } from './standaloneWorkoutLog/BestLine';
import { LogFormModal } from './standaloneWorkoutLog/LogFormModal';
import { standaloneWorkoutLogPanelStyles as styles } from './standaloneWorkoutLog/standaloneWorkoutLogPanelStyles';

function newStandaloneLogId(): string {
  return `swl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

type StandaloneWorkoutLogPanelProps = {
  workout: SingleWorkout;
};

export function StandaloneWorkoutLogPanel({
  workout,
}: StandaloneWorkoutLogPanelProps) {
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
      <Text style={styles.sectionTitle}>Your logs</Text>
      <BestLine workout={workout} logs={logs} />

      <TouchableOpacity
        style={styles.addButton}
        onPress={openNew}
        activeOpacity={0.85}
      >
        <Ionicons
          name={logs.length === 0 ? 'add-circle-outline' : 'add-circle'}
          size={22}
          color={Colors.textOnAccent}
          style={styles.addButtonIcon}
        />
        <Text style={styles.addButtonText}>
          {logs.length === 0 ? 'Log result' : 'Add another log'}
        </Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={styles.loader} />
      ) : logs.length === 0 ? (
        <Text style={styles.emptyText}>
          No logs yet. Use the button above to add one.
        </Text>
      ) : (
        logs.map((entry) => {
          const logStamp = formatStandaloneLogCardTimestamp(entry.loggedAt);
          return (
            <View key={entry.id} style={styles.logCard}>
              <View style={styles.logRow}>
                <View style={styles.logRowMain}>
                  <Text style={styles.logSummary}>
                    {logListPrimarySummary(entry, workout.logSchema)}
                  </Text>
                  {logStamp ? (
                    <Text
                      style={styles.logTimestampLine}
                      accessibilityLabel={`Logged ${logStamp}`}
                    >
                      {logStamp}
                    </Text>
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
                  {entry.notes && entry.payload.kind !== 'notes_only' ? (
                    <Text style={styles.logNotes}>{entry.notes}</Text>
                  ) : null}
                </View>
                <View style={styles.logRowActions}>
                  <TouchableOpacity
                    style={styles.iconActionBtn}
                    onPress={() => openEdit(entry)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Edit log"
                  >
                    <Ionicons
                      name="create-outline"
                      size={20}
                      color={Colors.accent}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.iconActionBtn}
                    onPress={() => confirmDelete(entry)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    accessibilityRole="button"
                    accessibilityLabel="Delete log"
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={Colors.destructive}
                    />
                  </TouchableOpacity>
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
