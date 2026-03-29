import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout, WorkoutLogSchema } from '@/src/types/workouts';
import {
  formatDurationSeconds,
  formatStandaloneLogCardTimestamp,
  formatStandaloneLogSummary,
  parseDurationInputToSeconds,
} from '@/src/utils/standaloneWorkoutLogFormat';
import {
  deleteStandaloneWorkoutLogEntry,
  getStandaloneWorkoutLogsForWorkout,
  upsertStandaloneWorkoutLogEntry,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

function newStandaloneLogId(): string {
  return `swl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

type FormState = {
  /** When the workout actually happened (UTC ms). */
  loggedAtMs: number;
  durationInput: string;
  roundsInput: string;
  extraRepsInput: string;
  repsInput: string;
  distanceInput: string;
  notesOnlyInput: string;
  notesInput: string;
};

const emptyForm = (): FormState => ({
  loggedAtMs: Date.now(),
  durationInput: '',
  roundsInput: '',
  extraRepsInput: '',
  repsInput: '',
  distanceInput: '',
  notesOnlyInput: '',
  notesInput: '',
});

function resetFormForSchema(): FormState {
  return emptyForm();
}

function loadEntryIntoForm(
  entry: StandaloneWorkoutLogEntry,
  base: FormState = emptyForm()
): FormState {
  const next = { ...base };
  const t = new Date(entry.loggedAt).getTime();
  next.loggedAtMs = Number.isNaN(t) ? Date.now() : t;
  switch (entry.payload.kind) {
    case 'duration':
      next.durationInput = formatDurationSeconds(entry.payload.durationSeconds);
      break;
    case 'amrap':
      next.roundsInput = String(entry.payload.rounds);
      next.extraRepsInput = String(entry.payload.extraReps);
      break;
    case 'max_reps':
      next.repsInput = String(entry.payload.reps);
      break;
    case 'distance':
      next.distanceInput = String(entry.payload.value);
      break;
    case 'notes_only': {
      const main = entry.payload.text.trim();
      const extra = entry.notes?.trim() ?? '';
      next.notesOnlyInput = [main, extra].filter(Boolean).join('\n\n');
      break;
    }
    default:
      break;
  }
  if (entry.payload.kind === 'notes_only') {
    next.notesInput = '';
  } else {
    next.notesInput = entry.notes ?? '';
  }
  return next;
}

type BuildPayloadResult =
  | { ok: true; payload: StandaloneWorkoutLogEntry['payload'] }
  | { ok: false; error: string };

function buildPayloadFromForm(
  schema: WorkoutLogSchema,
  form: FormState
): BuildPayloadResult {
  switch (schema.kind) {
    case 'none':
      return { ok: false, error: 'This workout does not support logging.' };
    case 'duration': {
      const durationSeconds = parseDurationInputToSeconds(form.durationInput);
      if (durationSeconds === null || durationSeconds <= 0) {
        return {
          ok: false,
          error: 'Enter a valid time (e.g. 45:30 or 1:05:30).',
        };
      }
      return { ok: true, payload: { kind: 'duration', durationSeconds } };
    }
    case 'amrap': {
      const rounds = parseInt(form.roundsInput.trim(), 10);
      const extraReps = parseInt(form.extraRepsInput.trim(), 10);
      if (
        Number.isNaN(rounds) ||
        Number.isNaN(extraReps) ||
        rounds < 0 ||
        extraReps < 0
      ) {
        return {
          ok: false,
          error: 'Enter valid rounds and extra reps (0 or more).',
        };
      }
      return { ok: true, payload: { kind: 'amrap', rounds, extraReps } };
    }
    case 'max_reps': {
      const reps = parseInt(form.repsInput.trim(), 10);
      if (Number.isNaN(reps) || reps < 0) {
        return { ok: false, error: 'Enter a valid rep count.' };
      }
      return { ok: true, payload: { kind: 'max_reps', reps } };
    }
    case 'distance': {
      const value = parseFloat(form.distanceInput.trim());
      if (Number.isNaN(value) || value < 0) {
        return { ok: false, error: 'Enter a valid distance.' };
      }
      return { ok: true, payload: { kind: 'distance', value } };
    }
    case 'notes_only': {
      const text = form.notesOnlyInput.trim();
      if (!text) {
        return { ok: false, error: 'Add a note or cancel.' };
      }
      return { ok: true, payload: { kind: 'notes_only', text } };
    }
    default:
      return { ok: false, error: 'Unsupported log type.' };
  }
}

/** Primary line in the log list (merges legacy notes for notes-only payloads). */
function logListPrimarySummary(
  entry: StandaloneWorkoutLogEntry,
  schema: WorkoutLogSchema
): string {
  if (entry.payload.kind === 'notes_only') {
    const main = entry.payload.text.trim();
    const extra = entry.notes?.trim() ?? '';
    return [main, extra].filter(Boolean).join('\n\n');
  }
  return formatStandaloneLogSummary(entry.payload, schema);
}

function BestLine({
  workout,
  logs,
}: {
  workout: SingleWorkout;
  logs: StandaloneWorkoutLogEntry[];
}) {
  const schema = workout.logSchema;
  if (schema.kind !== 'duration') {
    return null;
  }
  const entries = logs.filter(
    (
      e
    ): e is StandaloneWorkoutLogEntry & {
      payload: { kind: 'duration'; durationSeconds: number };
    } => e.payload.kind === 'duration'
  );
  if (entries.length === 0) {
    return null;
  }

  let best = entries[0];
  for (const e of entries) {
    const better = schema.lowerIsBetter
      ? e.payload.durationSeconds < best.payload.durationSeconds
      : e.payload.durationSeconds > best.payload.durationSeconds;
    if (better) {
      best = e;
    }
  }

  return (
    <Text style={styles.bestLine}>
      Personal best: {formatDurationSeconds(best.payload.durationSeconds)}
    </Text>
  );
}

type LogFormModalProps = {
  visible: boolean;
  workout: SingleWorkout;
  editingEntry: StandaloneWorkoutLogEntry | null;
  form: FormState;
  onChangeForm: (f: FormState) => void;
  onClose: () => void;
  onSave: () => void;
};

function LogFormModal({
  visible,
  workout,
  editingEntry,
  form,
  onChangeForm,
  onClose,
  onSave,
}: LogFormModalProps) {
  const schema = workout.logSchema;
  const title = editingEntry ? 'Edit log' : 'Log result';
  const [whenPickerVisible, setWhenPickerVisible] = useState(false);
  const [androidPickerStep, setAndroidPickerStep] = useState<
    'date' | 'time' | null
  >(null);

  useEffect(() => {
    if (!visible) {
      setWhenPickerVisible(false);
      setAndroidPickerStep(null);
    }
  }, [visible]);

  const whenLine = formatStandaloneLogCardTimestamp(
    new Date(form.loggedAtMs).toISOString()
  );

  const openWhenPicker = () => {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
      setAndroidPickerStep('date');
    }
    setWhenPickerVisible(true);
  };

  const onAndroidDateChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setWhenPickerVisible(false);
    }
    if (event.type === 'dismissed' || !date) {
      setAndroidPickerStep(null);
      return;
    }
    const base = new Date(form.loggedAtMs);
    base.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    onChangeForm({ ...form, loggedAtMs: base.getTime() });
    requestAnimationFrame(() => {
      setAndroidPickerStep('time');
      setWhenPickerVisible(true);
    });
  };

  const onAndroidTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    setWhenPickerVisible(false);
    setAndroidPickerStep(null);
    if (event.type === 'dismissed' || !date) {
      return;
    }
    const base = new Date(form.loggedAtMs);
    base.setHours(date.getHours(), date.getMinutes(), 0, 0);
    onChangeForm({ ...form, loggedAtMs: base.getTime() });
  };

  return (
    <>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView
          style={styles.modalKeyboardRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle}>{title}</Text>
                  <Text style={styles.modalSubtitle} numberOfLines={2}>
                    {workout.title}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close"
                >
                  <Ionicons name="close" size={26} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalScroll}
                contentContainerStyle={styles.modalScrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.whenBlock}>
                  <Text style={styles.fieldLabel}>When you did this</Text>
                  <Text style={styles.whenHint}>Defaults to now.</Text>
                  {whenLine ? (
                    <Text style={styles.whenSingleLine}>{whenLine}</Text>
                  ) : null}
                  <TouchableOpacity
                    style={styles.whenButton}
                    onPress={openWhenPicker}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Change date and time"
                    delayPressIn={0}
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={Colors.accent}
                    />
                    <Text style={styles.whenButtonText}>
                      Change date & time
                    </Text>
                  </TouchableOpacity>
                </View>

                {schema.kind === 'duration' && (
                  <>
                    <Text style={styles.fieldLabel}>
                      {schema.label ?? 'Time'}{' '}
                      <Text style={styles.fieldHint}>(mm:ss or h:mm:ss)</Text>
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={form.durationInput}
                      onChangeText={(durationInput) =>
                        onChangeForm({ ...form, durationInput })
                      }
                      placeholder="45:30"
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="numbers-and-punctuation"
                      selectionColor={Colors.accent}
                    />
                  </>
                )}

                {schema.kind === 'amrap' && (
                  <>
                    <Text style={styles.fieldLabel}>
                      {schema.roundsLabel ?? 'Rounds'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={form.roundsInput}
                      onChangeText={(roundsInput) =>
                        onChangeForm({ ...form, roundsInput })
                      }
                      placeholder="0"
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="number-pad"
                      selectionColor={Colors.accent}
                    />
                    <Text style={styles.fieldLabel}>
                      {schema.extraRepsLabel ?? 'Extra reps'}
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={form.extraRepsInput}
                      onChangeText={(extraRepsInput) =>
                        onChangeForm({ ...form, extraRepsInput })
                      }
                      placeholder="0"
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="number-pad"
                      selectionColor={Colors.accent}
                    />
                  </>
                )}

                {schema.kind === 'max_reps' && (
                  <>
                    <Text style={styles.fieldLabel}>{schema.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={form.repsInput}
                      onChangeText={(repsInput) =>
                        onChangeForm({ ...form, repsInput })
                      }
                      placeholder="0"
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="number-pad"
                      selectionColor={Colors.accent}
                    />
                  </>
                )}

                {schema.kind === 'distance' && (
                  <>
                    <Text style={styles.fieldLabel}>
                      {schema.label ?? 'Distance'} ({schema.unit})
                    </Text>
                    <TextInput
                      style={styles.input}
                      value={form.distanceInput}
                      onChangeText={(distanceInput) =>
                        onChangeForm({ ...form, distanceInput })
                      }
                      placeholder="0"
                      placeholderTextColor={Colors.textPlaceholder}
                      keyboardType="decimal-pad"
                      selectionColor={Colors.accent}
                    />
                  </>
                )}

                {schema.kind === 'notes_only' && (
                  <>
                    <Text style={styles.fieldLabel}>Notes</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        styles.inputSessionNotes,
                      ]}
                      value={form.notesOnlyInput}
                      onChangeText={(notesOnlyInput) =>
                        onChangeForm({ ...form, notesOnlyInput })
                      }
                      placeholder={schema.placeholder ?? 'How did it go?'}
                      placeholderTextColor={Colors.textPlaceholder}
                      multiline
                      selectionColor={Colors.accent}
                    />
                  </>
                )}

                {schema.kind !== 'none' && schema.kind !== 'notes_only' && (
                  <>
                    <Text style={styles.fieldLabel}>
                      Session notes (optional)
                    </Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textAreaSmall,
                        styles.inputSessionNotes,
                      ]}
                      value={form.notesInput}
                      onChangeText={(notesInput) =>
                        onChangeForm({ ...form, notesInput })
                      }
                      placeholder="How you felt, conditions, etc."
                      placeholderTextColor={Colors.textPlaceholder}
                      multiline
                      selectionColor={Colors.accent}
                    />
                  </>
                )}
              </ScrollView>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.btnGhostLarge}
                  onPress={onClose}
                  activeOpacity={0.75}
                >
                  <Text style={styles.btnGhostText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnPrimaryLarge}
                  onPress={onSave}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={Colors.textOnAccent}
                    style={styles.btnPrimaryIcon}
                  />
                  <Text style={styles.btnPrimaryText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>

            {Platform.OS === 'ios' && whenPickerVisible && (
              <View
                style={styles.whenPickerOverlayAbsolute}
                pointerEvents="box-none"
              >
                <TouchableOpacity
                  style={StyleSheet.absoluteFill}
                  activeOpacity={1}
                  onPress={() => setWhenPickerVisible(false)}
                  accessibilityLabel="Dismiss date picker"
                />
                <SafeAreaView style={styles.whenPickerSheet}>
                  <View style={styles.whenPickerToolbar}>
                    <TouchableOpacity
                      onPress={() => setWhenPickerVisible(false)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      accessibilityRole="button"
                      accessibilityLabel="Done"
                    >
                      <Text style={styles.whenPickerDone}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    value={new Date(form.loggedAtMs)}
                    mode="datetime"
                    display="spinner"
                    themeVariant="dark"
                    onChange={(_, date) => {
                      if (date) {
                        onChangeForm({ ...form, loggedAtMs: date.getTime() });
                      }
                    }}
                  />
                </SafeAreaView>
              </View>
            )}

            {Platform.OS === 'android' &&
              whenPickerVisible &&
              androidPickerStep === 'date' && (
                <DateTimePicker
                  value={new Date(form.loggedAtMs)}
                  mode="date"
                  display="default"
                  onChange={onAndroidDateChange}
                  themeVariant="dark"
                />
              )}
            {Platform.OS === 'android' &&
              whenPickerVisible &&
              androidPickerStep === 'time' && (
                <DateTimePicker
                  value={new Date(form.loggedAtMs)}
                  mode="time"
                  display="default"
                  onChange={onAndroidTimeChange}
                  themeVariant="dark"
                />
              )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

type StandaloneWorkoutLogPanelProps = {
  workout: SingleWorkout;
};

export function StandaloneWorkoutLogPanel({
  workout,
}: StandaloneWorkoutLogPanelProps) {
  const schema = workout.logSchema;
  const [logs, setLogs] = useState<StandaloneWorkoutLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEntry, setEditingEntry] =
    useState<StandaloneWorkoutLogEntry | null>(null);
  const [form, setForm] = useState<FormState>(() => resetFormForSchema());

  /** Reload list without toggling the full-screen spinner (e.g. after save). */
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

const styles = StyleSheet.create({
  panel: {
    marginTop: Spacing.xxl,
    paddingTop: Spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  sectionTitle: {
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  loader: {
    marginVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  bestLine: {
    fontSize: FontSize.lg,
    color: Colors.accent,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  logCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
  },
  logRowMain: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  logSummary: {
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  logTimestampLine: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  logTimestampFallback: {
    marginTop: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  logNotes: {
    fontSize: FontSize.base,
    lineHeight: 20,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  logRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: Spacing.sm,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundScreen,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  addButtonIcon: {
    marginRight: 2,
  },
  addButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  modalKeyboardRoot: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.section,
  },
  modalCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    maxHeight: '90%',
    paddingBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  modalHeaderText: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  modalCloseBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  modalSubtitle: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  modalScroll: {
    maxHeight: 400,
  },
  modalScrollContent: {
    paddingBottom: Spacing.xl,
  },
  whenBlock: {
    marginBottom: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  whenHint: {
    fontSize: FontSize.base,
    lineHeight: 20,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
  },
  whenSingleLine: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginBottom: Spacing.md,
  },
  whenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.backgroundDark,
    gap: Spacing.sm,
  },
  whenButtonText: {
    fontSize: FontSize.base,
    fontWeight: '600',
    color: Colors.accent,
  },
  whenPickerOverlayAbsolute: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: Colors.overlayLight,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  whenPickerSheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    paddingBottom: Spacing.xxl,
  },
  whenPickerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  whenPickerDone: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.accent,
  },
  fieldLabel: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  fieldHint: {
    fontWeight: '400',
    color: Colors.textMuted,
    fontSize: FontSize.base,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
    fontSize: FontSize.displaySm,
    color: Colors.textPrimary,
    marginBottom: Spacing.xxl,
    backgroundColor: Colors.backgroundDark,
  },
  inputSessionNotes: {
    fontSize: FontSize.base,
    lineHeight: 20,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    minHeight: 72,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
  },
  btnGhostLarge: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  btnPrimaryLarge: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryIcon: {
    marginRight: Spacing.sm,
  },
  btnPrimaryText: {
    fontSize: FontSize.xl,
    color: Colors.textOnAccent,
    fontWeight: '700',
  },
});
