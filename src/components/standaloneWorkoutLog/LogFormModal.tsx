import { Colors } from '@/src/constants/theme';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import { formatStandaloneLogCardTimestamp } from '@/src/utils/standaloneWorkoutLogFormat';
import { Ionicons } from '@expo/vector-icons';
import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { logFormModalStyles as styles } from './logFormModalStyles';
import { LogFormModalFields } from './LogFormModalFields';
import { LogFormModalWhenPickers } from './LogFormModalWhenPickers';

export type LogFormModalProps = {
  visible: boolean;
  workout: SingleWorkout;
  editingEntry: StandaloneWorkoutLogEntry | null;
  form: FormState;
  onChangeForm: (f: FormState) => void;
  onClose: () => void;
  onSave: () => void;
};

export function LogFormModal({
  visible,
  workout,
  editingEntry,
  form,
  onChangeForm,
  onClose,
  onSave,
}: LogFormModalProps) {
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
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));
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
    notesBlurTimer.current = setTimeout(() => setNotesActive(false), 200);
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

                <LogFormModalFields
                  workout={workout}
                  form={form}
                  onChangeForm={onChangeForm}
                  onNotesFocus={handleNotesFocus}
                  onNotesBlur={handleNotesBlur}
                />
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

            <LogFormModalWhenPickers
              form={form}
              onChangeForm={onChangeForm}
              whenPickerVisible={whenPickerVisible}
              setWhenPickerVisible={setWhenPickerVisible}
              androidPickerStep={androidPickerStep}
              onAndroidDateChange={onAndroidDateChange}
              onAndroidTimeChange={onAndroidTimeChange}
            />
          </View>
        </KeyboardAvoidingView>
        {notesActive && keyboardHeight > 0 && (
          <View style={[styles.keyboardDoneBar, { bottom: keyboardHeight }]}>
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
