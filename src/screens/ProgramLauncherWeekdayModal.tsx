import { color } from '@/src/constants/tokens';
import { ProgramLauncherWeekdayPicker } from '@/src/screens/ProgramLauncherWeekdayPicker';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
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
                Workout days
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Close workout days"
            >
              <Ionicons name="close" size={24} color={color.textPrimary} />
            </Pressable>
          </View>
          <ScrollView
            style={styles.sheetScroll}
            contentContainerStyle={styles.sheetScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <ProgramLauncherWeekdayPicker
              sessionsRequired={sessionsRequired}
              selectedWeekdays={selectedWeekdays}
              weekdayOrder={weekdayOrder}
              lockedWeekday={lockedWeekday}
              weekdaySelectionReady={weekdaySelectionReady}
              onToggleWeekday={onToggleWeekday}
            />
          </ScrollView>
          <View
            style={[
              styles.sheetFooter,
              styles.sheetFooterRow,
              { paddingBottom: modalSheetBottomPadding(bottomInset) },
            ]}
          >
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                styles.sheetFooterButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Back to start date"
            >
              <Text style={styles.secondaryButtonText}>Back</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                styles.sheetFooterButton,
                pressed && weekdaySelectionReady && styles.primaryButtonPressed,
                !weekdaySelectionReady && styles.primaryButtonDisabled,
              ]}
              onPress={onConfirm}
              disabled={!weekdaySelectionReady}
              accessibilityRole="button"
              accessibilityLabel="Confirm workout days"
              accessibilityState={{ disabled: !weekdaySelectionReady }}
            >
              <Text
                style={[
                  styles.primaryButtonText,
                  !weekdaySelectionReady && styles.primaryButtonTextDisabled,
                ]}
              >
                Confirm
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
