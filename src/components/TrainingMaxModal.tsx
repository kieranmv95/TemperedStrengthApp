import { getExerciseById } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { TrainingMaxesStore } from '@/src/types/trainingMaxes';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import {
  formatWeightValueFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '../constants/tokens';

type TrainingMaxModalProps = {
  visible: boolean;
  exerciseIds: number[];
  initialValuesKg?: TrainingMaxesStore;
  mode: 'start' | 'edit';
  onClose: () => void;
  onConfirm: (valuesKg: TrainingMaxesStore) => void | Promise<void>;
  bottomInset: number;
};

export function TrainingMaxModal({
  visible,
  exerciseIds,
  initialValuesKg,
  mode,
  onClose,
  onConfirm,
  bottomInset,
}: TrainingMaxModalProps) {
  const { unit: weightUnit } = useWeightUnit();
  const [inputs, setInputs] = React.useState<Record<number, string>>({});
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      return;
    }
    const next: Record<number, string> = {};
    for (const id of exerciseIds) {
      const existing = initialValuesKg?.[id];
      next[id] =
        typeof existing === 'number' && existing > 0
          ? formatWeightValueFromKg(existing, weightUnit)
          : '';
    }
    setInputs(next);
    setSaving(false);
    // exerciseIds identity is stable per program; re-run only when the modal
    // opens, the lifts change, or the unit changes.
  }, [visible, exerciseIds, initialValuesKg, weightUnit]);

  const parsedValues = React.useMemo(() => {
    const values: TrainingMaxesStore = {};
    for (const id of exerciseIds) {
      const kg = parseUserWeightInputToKg(inputs[id] ?? '', weightUnit);
      if (kg !== null && Number.isFinite(kg) && kg > 0) {
        values[id] = kg;
      }
    }
    return values;
  }, [exerciseIds, inputs, weightUnit]);

  const allValid = exerciseIds.every((id) => parsedValues[id] !== undefined);
  const confirmDisabled = !allValid || saving;
  const title =
    mode === 'edit' ? 'Edit training maxes' : 'Set your training maxes';
  const confirmLabel = mode === 'edit' ? 'Save' : 'Start program';

  const handleConfirm = async () => {
    if (!allValid || saving) {
      return;
    }
    setSaving(true);
    try {
      await onConfirm(parsedValues);
    } catch (error) {
      console.error('Error saving training maxes:', error);
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View
            style={styles.sheetInner}
            accessibilityViewIsModal
            onAccessibilityEscape={onClose}
          >
            <View style={styles.header}>
              <Text style={styles.title} accessibilityRole="header">
                {title}
              </Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  pressed && styles.closeButtonPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Close ${title}`}
              >
                <Ionicons name="close" size={24} color={color.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.explanation}>
                This program builds every working set from your training max.
                Enter a training max for each lift: about 90% of your best
                single. Not sure? Use a weight you can lift for 3–5 clean reps.
                You can adjust these any time.
              </Text>

              {exerciseIds.map((id) => {
                const exerciseName =
                  getExerciseById(id)?.name ?? `Exercise ${id}`;
                return (
                  <View key={id} style={styles.field}>
                    <Text
                      style={styles.fieldLabel}
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                    >
                      {exerciseName}
                    </Text>
                    <View style={styles.inputRow}>
                      <TextInput
                        style={styles.input}
                        value={inputs[id] ?? ''}
                        onChangeText={(text) =>
                          setInputs((prev) => ({ ...prev, [id]: text }))
                        }
                        keyboardType="decimal-pad"
                        placeholder="Not set"
                        placeholderTextColor={color.textTertiary}
                        returnKeyType="done"
                        accessibilityLabel={`${exerciseName} training max, ${weightUnit}`}
                      />
                      <Text
                        style={styles.unit}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      >
                        {weightUnit}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View
              style={[
                styles.footer,
                { paddingBottom: modalSheetBottomPadding(bottomInset) },
              ]}
            >
              <Pressable
                style={({ pressed }) => [
                  styles.confirmButton,
                  pressed && !confirmDisabled && styles.confirmButtonPressed,
                  confirmDisabled && styles.confirmButtonDisabled,
                ]}
                onPress={handleConfirm}
                disabled={confirmDisabled}
                accessibilityRole="button"
                accessibilityLabel={confirmLabel}
                accessibilityState={{ disabled: confirmDisabled, busy: saving }}
              >
                <Text
                  style={[
                    styles.confirmButtonText,
                    confirmDisabled && styles.confirmButtonTextDisabled,
                  ]}
                >
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    maxHeight: '85%',
    paddingTop: space.md,
    paddingHorizontal: space.md,
  },
  sheetInner: {
    flexShrink: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    marginBottom: space.sm,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  closeButtonPressed: {
    backgroundColor: color.surface3,
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    gap: space.md,
    paddingBottom: space.md,
  },
  explanation: {
    ...typography.callout,
    color: color.textSecondary,
  },
  field: {
    gap: space.xs,
  },
  fieldLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    paddingHorizontal: space.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  input: {
    ...typography.numericMedium,
    flex: 1,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    color: color.textPrimary,
    paddingVertical: space.xs,
  },
  unit: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  footer: {
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  confirmButton: {
    minHeight: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
  },
  confirmButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  confirmButtonDisabled: {
    backgroundColor: color.surface3,
  },
  confirmButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  confirmButtonTextDisabled: {
    color: color.textDisabled,
  },
});
