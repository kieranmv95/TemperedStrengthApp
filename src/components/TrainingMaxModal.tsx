import { getExerciseById } from '@/src/data/exercises';
import { useWeightUnit } from '@/src/hooks/useWeightUnit';
import type { TrainingMaxesStore } from '@/src/types/trainingMaxes';
import { modalSheetBottomPadding } from '@/src/utils/platform';
import {
  formatWeightValueFromKg,
  parseUserWeightInputToKg,
} from '@/src/utils/weightUnits';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BorderRadius, Colors, FontSize, Spacing } from '../constants/theme';

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
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.sheet}
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'edit'
                ? 'Edit Training Maxes'
                : 'Set Your Training Maxes'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={{ paddingBottom: Spacing.md }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.explanation}>
              This program builds every working set from your training max.
              Enter a training max for each lift: about 90% of your best single.
              Not sure? Use a weight you can lift for 3-5 clean reps. You can
              adjust these any time.
            </Text>

            {exerciseIds.map((id) => {
              const exercise = getExerciseById(id);
              return (
                <View key={id} style={styles.field}>
                  <Text style={styles.fieldLabel}>
                    {exercise?.name ?? `Exercise ${id}`}
                  </Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={styles.input}
                      value={inputs[id] ?? ''}
                      onChangeText={(text) =>
                        setInputs((prev) => ({ ...prev, [id]: text }))
                      }
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor={Colors.textPlaceholder}
                      returnKeyType="done"
                    />
                    <Text style={styles.unit}>{weightUnit}</Text>
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
            <TouchableOpacity
              style={[
                styles.confirmButton,
                (!allValid || saving) && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!allValid || saving}
            >
              <Text style={styles.confirmButtonText}>
                {mode === 'edit' ? 'Save' : 'Start Program'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    maxHeight: '85%',
    paddingTop: Spacing.section,
    paddingHorizontal: Spacing.section,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    flex: 1,
    paddingRight: Spacing.md,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  scroll: {
    flexGrow: 0,
  },
  explanation: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  field: {
    marginBottom: Spacing.xxl,
  },
  fieldLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    paddingHorizontal: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundSubtle,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    paddingVertical: Spacing.xxl,
  },
  unit: {
    color: Colors.textMuted,
    fontSize: FontSize.xl,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footer: {
    marginTop: Spacing.md,
    paddingTop: Spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
  },
  confirmButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.4,
  },
  confirmButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxl,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
