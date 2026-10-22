import { NumberField } from '@/src/components/ds';
import { color } from '@/src/constants/tokens';
import type { SingleWorkout } from '@/src/types/workouts';
import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { logFormModalStyles as styles } from './logFormModalStyles';

type LogFormModalFieldsProps = {
  workout: SingleWorkout;
  form: FormState;
  onChangeForm: (f: FormState) => void;
  onNotesFocus: () => void;
  onNotesBlur: () => void;
};

export function LogFormModalFields({
  workout,
  form,
  onChangeForm,
  onNotesFocus,
  onNotesBlur,
}: LogFormModalFieldsProps) {
  const schema = workout.logSchema;

  return (
    <>
      {schema.kind === 'duration' && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            {schema.label ?? 'Time'}{' '}
            <Text style={styles.fieldHint}>(mm:ss or h:mm:ss)</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.inputNumeric]}
            value={form.durationInput}
            onChangeText={(durationInput) =>
              onChangeForm({ ...form, durationInput })
            }
            placeholder="45:30"
            placeholderTextColor={color.textTertiary}
            keyboardType="numbers-and-punctuation"
            selectionColor={color.gold}
            accessibilityLabel={schema.label ?? 'Time'}
            accessibilityHint="Minutes and seconds, or hours, minutes and seconds"
          />
        </View>
      )}

      {schema.kind === 'amrap' && (
        <>
          <NumberField
            label={schema.roundsLabel ?? 'Rounds'}
            value={form.roundsInput}
            onChangeText={(roundsInput) =>
              onChangeForm({ ...form, roundsInput })
            }
          />
          <NumberField
            label={schema.extraRepsLabel ?? 'Extra reps'}
            value={form.extraRepsInput}
            onChangeText={(extraRepsInput) =>
              onChangeForm({ ...form, extraRepsInput })
            }
          />
        </>
      )}

      {schema.kind === 'max_reps' && (
        <NumberField
          label={schema.label}
          value={form.repsInput}
          onChangeText={(repsInput) => onChangeForm({ ...form, repsInput })}
        />
      )}

      {schema.kind === 'distance' && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>
            {schema.label ?? 'Distance'} ({schema.unit})
          </Text>
          <TextInput
            style={[styles.input, styles.inputNumeric]}
            value={form.distanceInput}
            onChangeText={(distanceInput) =>
              onChangeForm({ ...form, distanceInput })
            }
            placeholder={schema.unit}
            placeholderTextColor={color.textTertiary}
            keyboardType="decimal-pad"
            selectionColor={color.gold}
            accessibilityLabel={`${schema.label ?? 'Distance'} (${schema.unit})`}
          />
        </View>
      )}

      {schema.kind === 'notes_only' && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea, styles.inputSessionNotes]}
            value={form.notesOnlyInput}
            onChangeText={(notesOnlyInput) =>
              onChangeForm({ ...form, notesOnlyInput })
            }
            placeholder={schema.placeholder ?? 'How did it go?'}
            placeholderTextColor={color.textTertiary}
            multiline
            selectionColor={color.gold}
            onFocus={onNotesFocus}
            onBlur={onNotesBlur}
            accessibilityLabel="Notes"
          />
        </View>
      )}

      {schema.kind !== 'none' && schema.kind !== 'notes_only' && (
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Session notes (optional)</Text>
          <TextInput
            style={[
              styles.input,
              styles.textAreaSmall,
              styles.inputSessionNotes,
            ]}
            value={form.notesInput}
            onChangeText={(notesInput) => onChangeForm({ ...form, notesInput })}
            placeholder="How you felt, conditions, etc."
            placeholderTextColor={color.textTertiary}
            multiline
            selectionColor={color.gold}
            onFocus={onNotesFocus}
            onBlur={onNotesBlur}
            accessibilityLabel="Session notes (optional)"
          />
        </View>
      )}
    </>
  );
}
