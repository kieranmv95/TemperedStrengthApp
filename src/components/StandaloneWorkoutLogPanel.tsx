import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import {
  buildPayloadFromForm,
  computeBestDurationEntry,
  loadEntryIntoForm,
  logListPrimarySummary,
  resetFormForSchema,
  type FormState,
} from '@/src/utils/standaloneWorkoutLogForm';
import {
  formatDurationSeconds,
  formatStandaloneLogCardTimestamp,
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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { increment } from '../services/metricService';

function newStandaloneLogId(): string {
  return `swl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function BestLine({
  workout,
  logs,
}: {
  workout: SingleWorkout;
  logs: StandaloneWorkoutLogEntry[];
}) {
  const best = computeBestDurationEntry(logs, workout.logSchema);
  if (!best) {
    return null;
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [notesActive, setNotesActive] = useState(false);
  const notesBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      setWhenPickerVisible(false);
      setAndroidPickerStep(null);
      setNotesActive(false);
    }
  }, [visible]);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (e) =>
      setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(hideEvent, () =>
      setKeyboardHeight(0)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
      if (notesBlurTimer.current) clearTimeout(notesBlurTimer.current);
    };
  }, []);

  const handleNotesFocus = () => {
    if (notesBlurTimer.current) clearTimeout(notesBlurTimer.current);
    setNotesActive(true);
  };

  const handleNotesBlur = () => {
    notesBlurTimer.current = setTimeout(
      () => setNotesActive(false),
      200
    );
  };

  const handleNotesDone = () => {
    setNotesActive(false);
    Keyboard.dismiss();
  };

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
                      onFocus={handleNotesFocus}
                      onBlur={handleNotesBlur}
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
                      onFocus={handleNotesFocus}
                      onBlur={handleNotesBlur}
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
        {notesActive && keyboardHeight > 0 && (
          <View
            style={[styles.keyboardDoneBar, { bottom: keyboardHeight }]}
          >
            <View style={styles.keyboardDoneBarSpacer} />
            <TouchableOpacity
              style={styles.keyboardDoneBtn}
              onPress={handleNotesDone}
            >
              <Text style={styles.keyboardDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
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
  keyboardDoneBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundElevated,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderDefault,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  keyboardDoneBarSpacer: {
    flex: 1,
  },
  keyboardDoneBtn: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  keyboardDoneText: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
});
