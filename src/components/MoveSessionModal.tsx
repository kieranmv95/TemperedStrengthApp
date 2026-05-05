import { moveSessionModalStyles as styles } from '@/src/components/moveSessionModalStyles';
import React, { useMemo } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

export type MoveSessionDayOption = {
  dayIndex: number;
  weekdayLabel: string; // e.g. "M", "T"
  dateLabel: string; // e.g. "16th"
  isFromDay: boolean;
  isFreeDay: boolean;
};

type MoveSessionModalProps = {
  visible: boolean;
  bottomInset: number;
  fromDayIndex: number | null;
  options: MoveSessionDayOption[];
  selectedToDayIndex: number | null;
  onSelectToDayIndex: (dayIndex: number) => void;
  onCancel: () => void;
  onConfirm: () => void;
};

export function MoveSessionModal({
  visible,
  bottomInset,
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={[styles.sheet, { paddingBottom: bottomInset + 24 }]}>
          <Text style={styles.title}>Move Session</Text>
          <Text style={styles.subtitle}>
            Move session to another day this week. You cannot move a session
            outside of this calendar week to not disrupt the overall flow of the
            program
          </Text>

          <View style={styles.daysRow}>
            {options.map((o) => {
              const disabled = !o.isFromDay && !o.isFreeDay;
              const selected = selectedToDayIndex === o.dayIndex;
              return (
                <TouchableOpacity
                  key={o.dayIndex}
                  style={[
                    styles.dayBtn,
                    o.isFromDay ? styles.dayBtnFrom : null,
                    selected && !o.isFromDay ? styles.dayBtnSelected : null,
                    disabled ? styles.dayBtnDisabled : null,
                  ]}
                  activeOpacity={0.85}
                  disabled={disabled || o.isFromDay}
                  onPress={() => onSelectToDayIndex(o.dayIndex)}
                >
                  <Text
                    style={[styles.dayLabel, o.isFromDay ? styles.dayLabelFrom : null]}
                  >
                    {o.weekdayLabel}
                  </Text>
                  <Text
                    style={[
                      styles.dayDateLabel,
                      o.isFromDay ? styles.dayDateLabelFrom : null,
                    ]}
                  >
                    {o.dateLabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <TouchableOpacity
                style={styles.btnGhost}
                onPress={onCancel}
                activeOpacity={0.85}
              >
                <Text style={styles.btnGhostText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.btnPrimary,
                  !canConfirm ? styles.btnPrimaryDisabled : null,
                ]}
                disabled={!canConfirm}
                onPress={onConfirm}
                activeOpacity={0.85}
              >
                <Text style={styles.btnPrimaryText}>Move Session</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

