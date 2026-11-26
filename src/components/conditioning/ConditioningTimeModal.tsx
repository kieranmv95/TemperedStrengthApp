import { PbModalDateTimeField } from '@/src/components/PbModalDateTimeField';
import {
  IOS_KEYBOARD_DONE_ACCESSORY_ID,
  IosKeyboardDoneAccessory,
} from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import React from 'react';
import {
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ConditioningTimeModalProps = {
  visible: boolean;
  title: string;
  hint?: string;
  durationInput: string;
  onChangeDuration: (value: string) => void;
  date: Date;
  onChangeDate: (date: Date) => void;
  saving: boolean;
  saveLabel: string;
  onCancel: () => void;
  onSave: () => void;
  distancePicker?: React.ReactNode;
};

export function ConditioningTimeModal({
  visible,
  title,
  hint,
  durationInput,
  onChangeDuration,
  date,
  onChangeDate,
  saving,
  saveLabel,
  onCancel,
  onSave,
  distancePicker,
}: ConditioningTimeModalProps) {
  const close = () => {
    Keyboard.dismiss();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={close}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalCard, elevation.overlay]}
          accessibilityViewIsModal
          onAccessibilityEscape={close}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalContent}
          >
            <Text style={styles.modalTitle} accessibilityRole="header">
              {title}
            </Text>
            {hint ? <Text style={styles.modalHint}>{hint}</Text> : null}
            {distancePicker}
            <View style={styles.modalField}>
              <Text
                style={styles.modalLabel}
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                Time <Text style={styles.timeFormat}>(mm:ss or hh:mm:ss)</Text>
              </Text>
              <TextInput
                style={styles.timeInput}
                value={durationInput}
                onChangeText={onChangeDuration}
                keyboardType="numbers-and-punctuation"
                inputAccessoryViewID={IOS_KEYBOARD_DONE_ACCESSORY_ID}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholder="hh:mm:ss"
                placeholderTextColor={color.textTertiary}
                autoCorrect={false}
                accessibilityLabel="Time, minutes and seconds, or hours, minutes and seconds"
                accessibilityHint="For example 22:10 or 01:45:30"
              />
            </View>
            <PbModalDateTimeField value={date} onChange={onChangeDate} />
            <IosKeyboardDoneAccessory />
            <View style={styles.modalActions}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalCancel,
                  pressed && styles.modalCancelPressed,
                ]}
                onPress={close}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                accessibilityState={{ disabled: saving }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalButton,
                  styles.modalSave,
                  pressed && styles.modalSavePressed,
                  saving && styles.modalButtonBusy,
                ]}
                onPress={onSave}
                disabled={saving}
                accessibilityRole="button"
                accessibilityLabel={saving ? 'Saving' : saveLabel}
                accessibilityState={{ disabled: saving, busy: saving }}
              >
                <Text style={styles.modalSaveText}>
                  {saving ? 'Saving…' : 'Save'}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'center',
    paddingHorizontal: space.md,
  },
  modalCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.lg,
    padding: space.xl,
    maxHeight: '90%',
  },
  modalContent: {
    gap: space.md,
  },
  modalTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  modalHint: {
    ...typography.callout,
    color: color.textSecondary,
  },
  modalField: {
    gap: space.xxs,
  },
  modalLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  timeFormat: {
    ...typography.caption,
    color: color.textTertiary,
  },
  timeInput: {
    ...typography.numericMedium,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
  },
  modalButton: {
    flexGrow: 1,
    flexBasis: 120,
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonBusy: {
    opacity: 0.6,
  },
  modalCancel: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  modalCancelPressed: {
    backgroundColor: color.surface3,
  },
  modalCancelText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  modalSave: {
    backgroundColor: color.gold,
  },
  modalSavePressed: {
    backgroundColor: color.goldStrong,
  },
  modalSaveText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
