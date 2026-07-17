import { ProgramStartDateCalendar } from '@/src/components/ProgramStartDateCalendar';
import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  getProgramAnchorWeekdayKey,
  programAnchorFullWeekdayName,
} from '@/src/utils/programStartWeekday';
import { modalSheetBottomPadding } from '@/src/utils/platform';
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
  confirmLabel?: string;
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
  confirmLabel = 'Confirm',
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
            { paddingBottom: modalSheetBottomPadding(bottomInset) },
          ]}
        >
          <View style={styles.datePickerHeader}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.datePickerTitle}>Select Start Date</Text>
            <TouchableOpacity onPress={onConfirm} style={styles.confirmButton}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
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
                  Pick any day to start. That weekday becomes day 1 of each
                  program week — you&apos;ll choose your training days next.
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
