import { Colors } from '@/src/constants/theme';
import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { SingleWorkout } from '@/src/types/workouts';
import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import { formatStandaloneLogCardTimestamp } from '@/src/utils/standaloneWorkoutLogFormat';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { LogFormModalFields } from './LogFormModalFields';
import { logFormModalStyles as styles } from './logFormModalStyles';
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
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [notesActive, setNotesActive] = useState(false);
  const notesBlurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!visible) {
      setWhenPickerVisible(false);
      setNotesActive(false);
    }
  }, [visible]);

  useEffect(() => {
    const showEvent = 'keyboardWillShow';
    const hideEvent = 'keyboardWillHide';
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
    setWhenPickerVisible(true);
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
          behavior="padding"
          keyboardVerticalOffset={24}
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
                    name="checkmark"
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
