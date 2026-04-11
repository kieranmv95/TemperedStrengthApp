import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type PbModalDateTimeFieldProps = {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
};

/**
 * Date + time picker for PB log/edit modals (iOS spinner toggle; Android system picker).
 */
export function PbModalDateTimeField({
  value,
  onChange,
  label = 'Date and time',
}: PbModalDateTimeFieldProps) {
  const [iosPickerVisible, setIosPickerVisible] = useState(false);
  const [androidPickerVisible, setAndroidPickerVisible] = useState(false);

  const onAndroidChange = useCallback(
    (event: DateTimePickerEvent, date?: Date) => {
      if (Platform.OS === 'android') {
        setAndroidPickerVisible(false);
      }
      if (event.type === 'dismissed') {
        return;
      }
      if (date) {
        onChange(date);
      }
    },
    [onChange]
  );

  return (
    <View>
      <Text style={styles.modalLabel}>{label}</Text>
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setIosPickerVisible((v) => !v)}
          >
            <Text style={styles.dateButtonText}>{value.toLocaleString()}</Text>
            <Text style={styles.modalHint}>
              Tap to {iosPickerVisible ? 'hide' : 'show'} picker
            </Text>
          </TouchableOpacity>
          {iosPickerVisible ? (
            <DateTimePicker
              value={value}
              mode="datetime"
              display="spinner"
              themeVariant="dark"
              onChange={(_, d) => d && onChange(d)}
            />
          ) : null}
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setAndroidPickerVisible(true)}
          >
            <Text style={styles.dateButtonText}>{value.toLocaleString()}</Text>
            <Text style={styles.modalHint}>Tap to change date and time</Text>
          </TouchableOpacity>
          {androidPickerVisible ? (
            <DateTimePicker
              value={value}
              mode="datetime"
              display="default"
              themeVariant="dark"
              onChange={onAndroidChange}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  modalLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    marginBottom: Spacing.sm,
  },
  dateButton: {
    marginBottom: Spacing.xxl,
  },
  dateButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  modalHint: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
});
