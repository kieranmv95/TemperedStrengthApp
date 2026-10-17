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

const SUGGESTED_WEIGHT = 110;
const RPE_HINT = 'Rate of perceived exertion, 1 to 10';

const INITIAL_SETS: DemoSet[] = [
  { weight: '110', reps: '2', rpe: '7', completed: true },
  { weight: '', reps: '2', rpe: '', completed: false },
  { weight: '', reps: '', rpe: '', completed: false },
];

type DemoSetRowProps = {
  index: number;
  set: DemoSet;
  active: boolean;
  onChange: (index: number, next: Partial<DemoSet>) => void;
};

function DemoSetRow({ index, set, active, onChange }: DemoSetRowProps) {
  const setLabel = `Set ${index + 1}`;
  const canLog = set.reps.trim().length > 0;

  return (
    <View
      style={[
        styles.row,
        active && styles.rowActive,
        set.completed && styles.rowCompleted,
      ]}
    >
      <Text style={styles.setNumber}>{index + 1}</Text>
      <View style={[styles.fields, active && styles.fieldsActive]}>
        <View style={styles.field}>
          <NumberField
            label="Weight (kg)"
            accessibilityContext={setLabel}
            value={set.weight}
            onChangeText={(weight) => onChange(index, { weight })}
            placeholder={String(SUGGESTED_WEIGHT)}
            suggestedValue={SUGGESTED_WEIGHT}
            step={2.5}
            allowDecimal
            showSteppers={active}
            showLabel={active}
            state={set.completed ? 'completed' : 'default'}
          />
        </View>
        <View style={styles.field}>
          <NumberField
            label="Reps"
            accessibilityContext={setLabel}
            value={set.reps}
            onChangeText={(reps) => onChange(index, { reps })}
            placeholder="2"
            suggestedValue={2}
            showSteppers={active}
            showLabel={active}
            state={set.completed ? 'completed' : 'default'}
          />
        </View>
        {!active ? (
          <View style={styles.rpeField}>
            <NumberField
              label="RPE"
              accessibilityContext={setLabel}
              value={set.rpe}
              onChangeText={(rpe) => onChange(index, { rpe })}
              placeholder="1–10"
              max={10}
              showLabel={false}
              hint={RPE_HINT}
            />
          </View>
        ) : null}
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

/**
 * Dev-only sketch of the set logger: compact rows, with the next set to log
 * expanded to show steppers. The real SetRow lands with the Program screen.
 */
export function DemoSetLogger() {
  const [sets, setSets] = useState(INITIAL_SETS);
  const activeIndex = sets.findIndex((set) => !set.completed);

  const handleChange = (index: number, next: Partial<DemoSet>) => {
    setSets((prev) =>
      prev.map((set, i) => (i === index ? { ...set, ...next } : set))
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={styles.headerRow}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        <Text style={[styles.columnLabel, styles.columnSet]}>Set</Text>
        <Text style={[styles.columnLabel, styles.columnFields]}>
          Weight (kg) · Reps · RPE
        </Text>
      </View>
      {sets.map((set, index) => (
        <DemoSetRow
          key={index}
          index={index}
          set={set}
          active={index === activeIndex}
          onChange={handleChange}
        />
      ))}
    </View>
  );
}

const SET_NUMBER_WIDTH = 24;
const RPE_FIELD_WIDTH = 64;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.sm,
    gap: space.xs,
  },
  headerRow: {
    flexDirection: 'row',
    gap: space.xs,
  },
  columnLabel: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  columnSet: {
    width: SET_NUMBER_WIDTH,
  },
  columnFields: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    padding: space.xxs,
    borderRadius: radius.sm,
  },
  rowActive: {
    backgroundColor: color.surface2,
    padding: space.xs,
  },
  rowCompleted: {
    opacity: 0.8,
  },
  setNumber: {
    ...typography.numericSmall,
    color: color.textSecondary,
    width: SET_NUMBER_WIDTH,
    textAlign: 'center',
  },
  fields: {
    flex: 1,
    flexDirection: 'row',
    gap: space.xs,
  },
  fieldsActive: {
    flexDirection: 'column',
  },
  field: {
    flex: 1,
  },
  rpeField: {
    width: RPE_FIELD_WIDTH,
  },
});
