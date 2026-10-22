import { ProgramStartDateCalendar } from '@/src/components/ProgramStartDateCalendar';
import { color } from '@/src/constants/tokens';
import type { Program } from '@/src/types/program';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  getProgramAnchorWeekdayKey,
  programAnchorFullWeekdayName,
} from '@/src/utils/programStartWeekday';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
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
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={styles.sheet}
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
        >
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleRow}>
              <Text style={styles.sheetTitle} accessibilityRole="header">
                Select start date
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Cancel"
            >
              <Ionicons name="close" size={24} color={color.textPrimary} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.datePickerExplanation}>
              {selectedProgram?.daysSplit?.length ? (
                <>
                  Pick any day to start. That weekday becomes day 1 of each
                  program week — you’ll choose your training days next.
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
          <View
            style={[
              styles.sheetFooter,
              { paddingBottom: modalSheetBottomPadding(bottomInset) },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.primaryButtonPressed,
              ]}
              onPress={onConfirm}
              accessibilityRole="button"
              accessibilityLabel={confirmLabel}
            >
              <Text style={styles.primaryButtonText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
