import { ProgramLauncherWeekdayPicker } from '@/src/screens/ProgramLauncherWeekdayPicker';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import React from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherWeekdayModalProps = {
  visible: boolean;
  onClose: () => void;
  onBack: () => void;
  sessionsRequired: number;
  selectedWeekdays: ProgramDaySplitKey[];
  weekdayOrder: ProgramDaySplitKey[];
  lockedWeekday: ProgramDaySplitKey | null;
  weekdaySelectionReady: boolean;
  onToggleWeekday: (key: ProgramDaySplitKey) => void;
  onConfirm: () => void;
  bottomInset: number;
};

export function ProgramLauncherWeekdayModal({
  visible,
  onClose,
  onBack,
  sessionsRequired,
  selectedWeekdays,
  weekdayOrder,
  lockedWeekday,
  weekdaySelectionReady,
  onToggleWeekday,
  onConfirm,
  bottomInset,
}: ProgramLauncherWeekdayModalProps) {
  return (
    <Modal
      visible={visible}
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
            <TouchableOpacity onPress={onBack} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.datePickerTitle}>Workout Days</Text>
            <TouchableOpacity
              onPress={onConfirm}
              style={styles.confirmButton}
              disabled={!weekdaySelectionReady}
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  !weekdaySelectionReady && styles.confirmButtonTextDisabled,
                ]}
              >
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.datePickerScroll}
            contentContainerStyle={styles.datePickerScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.weekdayModalBody}>
              <ProgramLauncherWeekdayPicker
                sessionsRequired={sessionsRequired}
                selectedWeekdays={selectedWeekdays}
                weekdayOrder={weekdayOrder}
                lockedWeekday={lockedWeekday}
                weekdaySelectionReady={weekdaySelectionReady}
                onToggleWeekday={onToggleWeekday}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
