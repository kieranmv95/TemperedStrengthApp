import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PbModalDateTimeFieldProps = {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
};

/**
 * Date + time picker for PB log/edit modals (spinner, inline expand).
 */
export function PbModalDateTimeField({
  value,
  onChange,
  label = 'Date and time',
}: PbModalDateTimeFieldProps) {
  const [pickerVisible, setPickerVisible] = useState(false);

  const togglePicker = useCallback(() => {
    setPickerVisible((v) => !v);
  }, []);

  return (
    <View>
      <Text style={styles.modalLabel}>{label}</Text>
      <TouchableOpacity style={styles.dateButton} onPress={togglePicker}>
        <Text style={styles.dateButtonText}>{value.toLocaleString()}</Text>
        <Text style={styles.modalHint}>
          Tap to {pickerVisible ? 'hide' : 'show'} picker
        </Text>
      </TouchableOpacity>
      {pickerVisible ? (
        <DateTimePicker
          value={value}
          mode="datetime"
          display="spinner"
          themeVariant="dark"
          onChange={(_, d) => d && onChange(d)}
        />
      ) : null}
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
