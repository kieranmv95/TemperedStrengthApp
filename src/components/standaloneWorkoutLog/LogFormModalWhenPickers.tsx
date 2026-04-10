import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logFormModalStyles as styles } from './logFormModalStyles';

type LogFormModalWhenPickersProps = {
  form: FormState;
  onChangeForm: (f: FormState) => void;
  whenPickerVisible: boolean;
  setWhenPickerVisible: (v: boolean) => void;
  androidPickerStep: 'date' | 'time' | null;
  onAndroidDateChange: (event: DateTimePickerEvent, date?: Date) => void;
  onAndroidTimeChange: (event: DateTimePickerEvent, date?: Date) => void;
};

export function LogFormModalWhenPickers({
  form,
  onChangeForm,
  whenPickerVisible,
  setWhenPickerVisible,
  androidPickerStep,
  onAndroidDateChange,
  onAndroidTimeChange,
}: LogFormModalWhenPickersProps) {
  return (
    <>
      {Platform.OS === 'ios' && whenPickerVisible && (
        <View style={styles.whenPickerOverlayAbsolute} pointerEvents="box-none">
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
    </>
  );
}
