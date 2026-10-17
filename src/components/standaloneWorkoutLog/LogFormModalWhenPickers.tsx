import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logFormModalStyles as styles } from './logFormModalStyles';

type LogFormModalWhenPickersProps = {
  form: FormState;
  onChangeForm: (f: FormState) => void;
  whenPickerVisible: boolean;
  setWhenPickerVisible: (v: boolean) => void;
};

export function LogFormModalWhenPickers({
  form,
  onChangeForm,
  whenPickerVisible,
  setWhenPickerVisible,
}: LogFormModalWhenPickersProps) {
  if (!whenPickerVisible) {
    return null;
  }

  return (
    <View style={styles.whenPickerOverlayAbsolute}>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setWhenPickerVisible(false)}
        accessibilityRole="button"
        accessibilityLabel="Dismiss date picker"
      />
      <SafeAreaView
        edges={['bottom']}
        style={styles.whenPickerSheet}
        accessibilityViewIsModal
        onAccessibilityEscape={() => setWhenPickerVisible(false)}
      >
        <View style={styles.whenPickerToolbar}>
          <Pressable
            onPress={() => setWhenPickerVisible(false)}
            style={styles.whenPickerDoneBtn}
            accessibilityRole="button"
            accessibilityLabel="Done choosing date and time"
          >
            <Text style={styles.whenPickerDone}>Done</Text>
          </Pressable>
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
  );
}
