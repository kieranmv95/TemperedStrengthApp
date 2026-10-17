import { NumberField, SetCheckButton } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type DemoSet = {
  weight: string;
  reps: string;
  rpe: string;
  completed: boolean;
};

const RPE_HINT = 'Rate of perceived exertion, 1 to 10';

const INITIAL_SETS: DemoSet[] = [
  { weight: '110', reps: '2', rpe: '7', completed: true },
  { weight: '', reps: '2', rpe: '', completed: false },
  { weight: '', reps: '', rpe: '', completed: false },
];

type DemoSetRowProps = {
  index: number;
  set: DemoSet;
  isNext: boolean;
  onChange: (index: number, next: Partial<DemoSet>) => void;
};

function DemoSetRow({ index, set, isNext, onChange }: DemoSetRowProps) {
  const setLabel = `Set ${index + 1}`;
  const canLog = set.reps.trim().length > 0;
  const fieldState = set.completed ? 'completed' : 'default';

  return (
    <View style={styles.row}>
      <Text style={[styles.setNumber, isNext && styles.setNumberNext]}>
        {index + 1}
      </Text>
      <View style={styles.field}>
        <NumberField
          label="Weight (kg)"
          accessibilityContext={setLabel}
          value={set.weight}
          onChangeText={(weight) => onChange(index, { weight })}
          placeholder="kg"
          allowDecimal
          showLabel={false}
          state={fieldState}
        />
      </View>
      <View style={styles.smallField}>
        <NumberField
          label="Reps"
          accessibilityContext={setLabel}
          value={set.reps}
          onChangeText={(reps) => onChange(index, { reps })}
          placeholder="2"
          showLabel={false}
          state={fieldState}
        />
      </View>
      <View style={styles.smallField}>
        <NumberField
          label="RPE"
          accessibilityContext={setLabel}
          value={set.rpe}
          onChangeText={(rpe) => onChange(index, { rpe })}
          placeholder="1–10"
          max={10}
          showLabel={false}
          hint={RPE_HINT}
          state={fieldState}
        />
      </View>
      <SetCheckButton
        state={set.completed ? 'completed' : 'pending'}
        onPress={() => onChange(index, { completed: !set.completed })}
        accessibilityLabel={setLabel}
        disabled={!canLog}
        disabledHint="Enter reps to log this set"
      />
    </View>
  );
}

/** Dev-only sketch of inline set logging; the next set to log has a gold number. */
export function DemoSetLogger() {
  const [sets, setSets] = useState(INITIAL_SETS);
  const nextIndex = sets.findIndex((set) => !set.completed);

  const handleChange = (index: number, next: Partial<DemoSet>) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, ...next } : set))
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.row}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Text style={[styles.columnLabel, styles.setNumber]}>Set</Text>
        <Text style={[styles.columnLabel, styles.field]}>Weight (kg)</Text>
        <Text style={[styles.columnLabel, styles.smallField]}>Reps</Text>
        <Text style={[styles.columnLabel, styles.smallField]}>RPE</Text>
        <View style={styles.checkSpacer} />
      </View>
      {sets.map((set, index) => (
        <DemoSetRow
          key={index}
          index={index}
          set={set}
          isNext={index === nextIndex}
          onChange={handleChange}
        />
      ))}
    </View>
  );
}

const SET_NUMBER_WIDTH = 24;
const SMALL_FIELD_WIDTH = 64;
const CHECK_WIDTH = 44;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.sm,
    gap: space.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  columnLabel: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  setNumber: {
    ...typography.numericSmall,
    color: color.textSecondary,
    width: SET_NUMBER_WIDTH,
    textAlign: 'center',
  },
  setNumberNext: {
    color: color.gold,
  },
  field: {
    flex: 1,
  },
  smallField: {
    width: SMALL_FIELD_WIDTH,
  },
  checkSpacer: {
    width: CHECK_WIDTH,
  },
});
