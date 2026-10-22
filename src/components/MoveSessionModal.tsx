import { BottomSheet } from '@/src/components/ds';
import { moveSessionModalStyles as styles } from '@/src/components/moveSessionModalStyles';
import { color } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

export type MoveSessionDayOption = {
  dayIndex: number;
  weekdayLabel: string; // e.g. "M", "T"
  dateLabel: string; // e.g. "16th"
  isFromDay: boolean;
  isFreeDay: boolean;
};

type MoveSessionModalProps = {
  visible: boolean;
  /** Kept for callers; the bottom sheet applies the safe-area inset itself. */
  bottomInset: number;
  fromDayIndex: number | null;
  options: MoveSessionDayOption[];
  selectedToDayIndex: number | null;
  onSelectToDayIndex: (dayIndex: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

const DAY_ICON_SIZE = 16;

function dayOptionAccessibilityLabel(
  option: MoveSessionDayOption,
  unavailable: boolean
): string {
  const day = `${option.weekdayLabel} ${option.dateLabel}`;
  if (option.isFromDay) {
    return `${day}, current session day`;
  }
  if (unavailable) {
    return `${day}, already has a session`;
  }
  return `${day}, free`;
}

export function MoveSessionModal({
  visible,
  fromDayIndex,
  options,
  selectedToDayIndex,
  onSelectToDayIndex,
  onCancel,
  onConfirm,
}: MoveSessionModalProps) {
  const canConfirm = useMemo(() => {
    if (fromDayIndex === null) return false;
    if (selectedToDayIndex === null) return false;
    if (selectedToDayIndex === fromDayIndex) return false;
    const dest = options.find((o) => o.dayIndex === selectedToDayIndex);
    return !!dest?.isFreeDay;
  }, [fromDayIndex, selectedToDayIndex, options]);

  return (
    <BottomSheet
      visible={visible}
      onClose={onCancel}
      title="Move session"
      footer={
        <View style={styles.footerRow}>
          <Pressable
            style={({ pressed }) => [
              styles.btnGhost,
              pressed && styles.btnGhostPressed,
            ]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
          >
            <Text style={styles.btnGhostText}>Cancel</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.btnPrimary,
              pressed && canConfirm && styles.btnPrimaryPressed,
              !canConfirm && styles.btnPrimaryDisabled,
            ]}
            disabled={!canConfirm}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel="Move session"
            accessibilityState={{ disabled: !canConfirm }}
          >
            <Text
              style={[
                styles.btnPrimaryText,
                !canConfirm && styles.btnPrimaryTextDisabled,
              ]}
            >
              Move session
            </Text>
          </Pressable>
        </View>
      }
    >
      <Text style={styles.subtitle}>
        Move this session to another day in this program week. Sessions can’t
        move outside the week, so the overall flow of the program isn’t
        disrupted.
      </Text>

      <View
        style={styles.daysRow}
        accessibilityRole="radiogroup"
        accessibilityLabel="Move to day"
      >
        {options.map((o) => {
          const disabled = !o.isFromDay && !o.isFreeDay;
          const selected = selectedToDayIndex === o.dayIndex && !o.isFromDay;
          return (
            <Pressable
              key={o.dayIndex}
              style={({ pressed }) => [
                styles.dayBtn,
                pressed && styles.dayBtnPressed,
                o.isFromDay ? styles.dayBtnFrom : null,
                selected ? styles.dayBtnSelected : null,
                disabled ? styles.dayBtnDisabled : null,
              ]}
              disabled={disabled || o.isFromDay}
              onPress={() => onSelectToDayIndex(o.dayIndex)}
              accessibilityRole="radio"
              accessibilityLabel={dayOptionAccessibilityLabel(o, disabled)}
              accessibilityState={{
                checked: selected,
                disabled: disabled || o.isFromDay,
              }}
            >
              <Text
                style={[
                  styles.dayLabel,
                  selected && styles.dayLabelSelected,
                  disabled && styles.dayLabelDisabled,
                ]}
              >
                {o.weekdayLabel}
              </Text>
              <Text
                style={[
                  styles.dayDateLabel,
                  selected && styles.dayLabelSelected,
                  disabled && styles.dayLabelDisabled,
                ]}
              >
                {o.dateLabel}
              </Text>
              <View style={styles.dayIconSlot}>
                {o.isFromDay ? (
                  <Ionicons
                    name="barbell-outline"
                    size={DAY_ICON_SIZE}
                    color={color.textSecondary}
                  />
                ) : selected ? (
                  <Ionicons
                    name="checkmark"
                    size={DAY_ICON_SIZE}
                    color={color.gold}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View
        style={styles.legend}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Ionicons
          name="barbell-outline"
          size={DAY_ICON_SIZE}
          color={color.textSecondary}
        />
        <Text style={styles.legendText}>Current session day</Text>
      </View>
    </BottomSheet>
  );
}
