import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

  const formattedValue = value.toLocaleString();

  return (
    <View style={styles.container}>
      <Text
        style={styles.label}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {label}
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.field,
          pickerVisible && styles.fieldOpen,
          pressed && styles.fieldPressed,
        ]}
        onPress={togglePicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${formattedValue}`}
        accessibilityHint={
          pickerVisible ? 'Hides the picker' : 'Shows the picker'
        }
        accessibilityState={{ expanded: pickerVisible }}
      >
        <Ionicons
          name="calendar-outline"
          size={20}
          color={color.textSecondary}
        />
        <Text style={styles.value}>{formattedValue}</Text>
        <Ionicons
          name={pickerVisible ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={color.textTertiary}
        />
      </Pressable>
      <Text style={styles.hint}>
        Tap to {pickerVisible ? 'hide' : 'show'} picker
      </Text>
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
  container: {
    gap: space.xxs,
  },
  label: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  fieldOpen: {
    borderColor: color.gold,
  },
  fieldPressed: {
    backgroundColor: color.surface3,
  },
  value: {
    ...typography.body,
    fontVariant: ['tabular-nums'],
    color: color.textPrimary,
    flex: 1,
  },
  hint: {
    ...typography.caption,
    color: color.textTertiary,
  },
});
