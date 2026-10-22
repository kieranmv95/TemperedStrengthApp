import { color } from '@/src/constants/tokens';
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
  Pressable,
  ScrollView,
  Text,
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
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalRoot}>
        <KeyboardAvoidingView
          style={styles.modalKeyboardRoot}
          behavior="padding"
          keyboardVerticalOffset={24}
        >
          <View style={styles.modalOverlay}>
            <View
              style={styles.modalCard}
              accessibilityViewIsModal
              onAccessibilityEscape={onClose}
            >
              <View style={styles.modalHeaderRow}>
                <View style={styles.modalHeaderText}>
                  <Text style={styles.modalTitle} accessibilityRole="header">
                    {title}
                  </Text>
                  <Text style={styles.modalSubtitle}>{workout.title}</Text>
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.modalCloseBtn,
                    pressed && styles.modalCloseBtnPressed,
                  ]}
                  onPress={onClose}
                  accessibilityRole="button"
                  accessibilityLabel={`Close ${title.toLowerCase()}`}
                >
                  <Ionicons name="close" size={24} color={color.textPrimary} />
                </Pressable>
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
                  <Pressable
                    style={({ pressed }) => [
                      styles.whenButton,
                      pressed && styles.whenButtonPressed,
                    ]}
                    onPress={openWhenPicker}
                    accessibilityRole="button"
                    accessibilityLabel="Change date and time"
                    accessibilityHint={
                      whenLine ? `Currently ${whenLine}` : undefined
                    }
                  >
                    <Ionicons
                      name="calendar-outline"
                      size={18}
                      color={color.textPrimary}
                    />
                    <Text style={styles.whenButtonText}>
                      Change date & time
                    </Text>
                  </Pressable>
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
                <Pressable
                  style={({ pressed }) => [
                    styles.btnGhostLarge,
                    pressed && styles.btnGhostPressed,
                  ]}
                  onPress={onClose}
                  accessibilityRole="button"
                >
                  <Text style={styles.btnGhostText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [
                    styles.btnPrimaryLarge,
                    pressed && styles.btnPrimaryPressed,
                  ]}
                  onPress={onSave}
                  accessibilityRole="button"
                  accessibilityLabel="Save log"
                >
                  <Ionicons name="checkmark" size={22} color={color.onGold} />
                  <Text style={styles.btnPrimaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
        {notesActive && keyboardHeight > 0 && (
          <View style={[styles.keyboardDoneBar, { bottom: keyboardHeight }]}>
            <View style={styles.keyboardDoneBarSpacer} />
            <Pressable
              style={styles.keyboardDoneBtn}
              onPress={handleNotesDone}
              accessibilityRole="button"
              accessibilityLabel="Dismiss keyboard"
            >
              <Text style={styles.keyboardDoneText}>Done</Text>
            </Pressable>
          </View>
        )}
        <LogFormModalWhenPickers
          form={form}
          onChangeForm={onChangeForm}
          whenPickerVisible={whenPickerVisible}
          setWhenPickerVisible={setWhenPickerVisible}
        />
      </View>
    </Modal>
  );
}
