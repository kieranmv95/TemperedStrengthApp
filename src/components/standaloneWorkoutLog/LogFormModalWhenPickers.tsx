import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppSafeAreaView } from '@/src/components/AppSafeAreaView';
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
  return (
    <>
      {whenPickerVisible && (
        <View style={styles.whenPickerOverlayAbsolute} pointerEvents="box-none">
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={() => setWhenPickerVisible(false)}
            accessibilityLabel="Dismiss date picker"
          />
          <AppSafeAreaView style={styles.whenPickerSheet} edges={['bottom', 'left', 'right']}>
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
          </AppSafeAreaView>
        </View>
      )}
    </>
  );
}
