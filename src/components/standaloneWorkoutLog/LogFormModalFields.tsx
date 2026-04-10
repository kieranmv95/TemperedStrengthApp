import { Colors } from '@/src/constants/theme';
import type { SingleWorkout } from '@/src/types/workouts';
import type { FormState } from '@/src/utils/standaloneWorkoutLogForm';
import React from 'react';
import { Text, TextInput } from 'react-native';
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
        <>
          <Text style={styles.fieldLabel}>
            {schema.label ?? 'Time'}{' '}
            <Text style={styles.fieldHint}>(mm:ss or h:mm:ss)</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={form.durationInput}
            onChangeText={(durationInput) =>
              onChangeForm({ ...form, durationInput })
            }
            placeholder="45:30"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="numbers-and-punctuation"
            selectionColor={Colors.accent}
          />
        </>
      )}

      {schema.kind === 'amrap' && (
        <>
          <Text style={styles.fieldLabel}>
            {schema.roundsLabel ?? 'Rounds'}
          </Text>
          <TextInput
            style={styles.input}
            value={form.roundsInput}
            onChangeText={(roundsInput) =>
              onChangeForm({ ...form, roundsInput })
            }
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="number-pad"
            selectionColor={Colors.accent}
          />
          <Text style={styles.fieldLabel}>
            {schema.extraRepsLabel ?? 'Extra reps'}
          </Text>
          <TextInput
            style={styles.input}
            value={form.extraRepsInput}
            onChangeText={(extraRepsInput) =>
              onChangeForm({ ...form, extraRepsInput })
            }
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="number-pad"
            selectionColor={Colors.accent}
          />
        </>
      )}

      {schema.kind === 'max_reps' && (
        <>
          <Text style={styles.fieldLabel}>{schema.label}</Text>
          <TextInput
            style={styles.input}
            value={form.repsInput}
            onChangeText={(repsInput) => onChangeForm({ ...form, repsInput })}
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="number-pad"
            selectionColor={Colors.accent}
          />
        </>
      )}

      {schema.kind === 'distance' && (
        <>
          <Text style={styles.fieldLabel}>
            {schema.label ?? 'Distance'} ({schema.unit})
          </Text>
          <TextInput
            style={styles.input}
            value={form.distanceInput}
            onChangeText={(distanceInput) =>
              onChangeForm({ ...form, distanceInput })
            }
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="decimal-pad"
            selectionColor={Colors.accent}
          />
        </>
      )}

      {schema.kind === 'notes_only' && (
        <>
          <Text style={styles.fieldLabel}>Notes</Text>
          <TextInput
            style={[styles.input, styles.textArea, styles.inputSessionNotes]}
            value={form.notesOnlyInput}
            onChangeText={(notesOnlyInput) =>
              onChangeForm({ ...form, notesOnlyInput })
            }
            placeholder={schema.placeholder ?? 'How did it go?'}
            placeholderTextColor={Colors.textPlaceholder}
            multiline
            selectionColor={Colors.accent}
            onFocus={onNotesFocus}
            onBlur={onNotesBlur}
          />
        </>
      )}

      {schema.kind !== 'none' && schema.kind !== 'notes_only' && (
        <>
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
            placeholderTextColor={Colors.textPlaceholder}
            multiline
            selectionColor={Colors.accent}
            onFocus={onNotesFocus}
            onBlur={onNotesBlur}
          />
        </>
      )}
    </>
  );
}
