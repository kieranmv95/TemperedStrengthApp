import { ProgramStartDateCalendar } from '@/src/components/ProgramStartDateCalendar';
import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  getProgramAnchorWeekdayKey,
  programAnchorFullWeekdayName,
} from '@/src/utils/programStartWeekday';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherDatePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  startDate: Date;
  onChangeStartDate: (d: Date) => void;
  selectedProgram: Program | null;
  startDatePickerAllowedWeekdays: ProgramDaySplitKey[];
  onConfirm: () => void;
  bottomInset: number;
};

export function ProgramLauncherDatePickerModal({
  visible,
  onClose,
  startDate,
  onChangeStartDate,
  selectedProgram,
  startDatePickerAllowedWeekdays,
  onConfirm,
  bottomInset,
}: ProgramLauncherDatePickerModalProps) {
  return (
    <Modal
      visible={visible && !!selectedProgram}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.datePickerContainer,
            { paddingBottom: bottomInset + 40 },
          ]}
        >
          <View style={styles.datePickerHeader}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.datePickerTitle}>Select Start Date</Text>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.datePickerScroll}
            contentContainerStyle={styles.datePickerScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.datePickerExplanation}>
              {selectedProgram?.daysSplit?.length ? (
                <>
                  Your first session each week is the earliest day you picked
                  (Mon→Sun order). Pick a start date on{' '}
                  <Text style={styles.datePickerExplanationEmphasis}>
                    {`${programAnchorFullWeekdayName(
                      startDatePickerAllowedWeekdays[0] ?? 'mon'
                    )}s`}
                  </Text>
                  . Other weekdays are greyed out. Past dates cannot be
                  selected.
                </>
              ) : (
                <>
                  Your first session is always on{' '}
                  <Text style={styles.datePickerExplanationEmphasis}>
                    {selectedProgram
                      ? `${programAnchorFullWeekdayName(
                          getProgramAnchorWeekdayKey(selectedProgram)
                        )}s`
                      : null}
                  </Text>
                  . Only those dates can be your program start; other days are
                  greyed out because they do not match day 1 of this template.
                  Past dates cannot be selected.
                </>
              )}
            </Text>
            <ProgramStartDateCalendar
              value={startDate}
              onChange={onChangeStartDate}
              allowedWeekdays={startDatePickerAllowedWeekdays}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
