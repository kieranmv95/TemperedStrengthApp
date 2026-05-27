import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { Colors } from '@/src/constants/theme';
import { getToolById } from '@/src/data/tools';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  buildOneRepMaxPercentageTable,
  calculateOneRepMaxKg,
  formatDisplayWeight,
  oneRepMaxKgToDisplay,
  parseLiftWeightToKg,
} from '@/src/utils/oneRepMax';
import type { WeightUnit } from '@/src/utils/storage';
import { getWeightUnit } from '@/src/utils/storage';
import { useFocusEffect } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TOOL = getToolById('one-rep-max')!;

export function OneRepMaxCalculatorScreen() {
  const posthog = usePostHog();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [liftInput, setLiftInput] = useState('100');
  const [repsInput, setRepsInput] = useState('1');
  const [resultOneRmKg, setResultOneRmKg] = useState<number | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      increment('tool_one_rep_max_views');
      posthog.capture(posthogEventsNames.content.toolView, {
        tool_id: TOOL.id,
      });

      void getWeightUnit().then(setWeightUnit);
    }, [posthog])
  );

  const runCalculation = useCallback(
    (trackEvent: boolean) => {
      const reps = parseInt(repsInput.trim(), 10);
      const weightKg = parseLiftWeightToKg(liftInput, weightUnit);

      if (weightKg === null) {
        setValidationError('Enter a valid lift weight.');
        setResultOneRmKg(null);
        return;
      }
      if (!Number.isInteger(reps) || reps < 1) {
        setValidationError('Enter a whole number of reps (1 or more).');
        setResultOneRmKg(null);
        return;
      }
      if (reps >= 21) {
        setValidationError('Reps must be below 21 for this formula.');
        setResultOneRmKg(null);
        return;
      }

      const oneRmKg = calculateOneRepMaxKg(weightKg, reps);
      if (oneRmKg === null) {
        setValidationError('Could not calculate. Check your inputs.');
        setResultOneRmKg(null);
        return;
      }

      setValidationError(null);
      setResultOneRmKg(oneRmKg);
      if (trackEvent) {
        posthog.capture(posthogEventsNames.content.toolCalculate, {
          tool_id: TOOL.id,
          reps,
          unit: weightUnit,
        });
      }
    },
    [liftInput, repsInput, weightUnit, posthog]
  );

  useEffect(() => {
    runCalculation(false);
  }, [runCalculation]);

  const handleCalculate = () => {
    Keyboard.dismiss();
    runCalculation(true);
  };

  const displayOneRm =
    resultOneRmKg !== null
      ? oneRepMaxKgToDisplay(resultOneRmKg, weightUnit)
      : null;
  const percentageTable =
    resultOneRmKg !== null
      ? buildOneRepMaxPercentageTable(resultOneRmKg, weightUnit)
      : [];

  return (
    <ToolScreenShell title={TOOL.title}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{TOOL.title}</Text>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Lift</Text>
          <TextInput
            style={styles.fieldInput}
            value={liftInput}
            onChangeText={setLiftInput}
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="decimal-pad"
            accessibilityLabel="Lift weight"
          />
          <View style={styles.unitToggle}>
            {(['kg', 'lb'] as const).map((unit) => {
              const isActive = weightUnit === unit;
              return (
                <TouchableOpacity
                  key={unit}
                  style={[
                    styles.unitOption,
                    isActive && styles.unitOptionActive,
                  ]}
                  onPress={() => setWeightUnit(unit)}
                  accessibilityLabel={`Use ${unit}`}
                >
                  <Text
                    style={[
                      styles.unitOptionText,
                      isActive && styles.unitOptionTextActive,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Reps</Text>
          <TextInput
            style={styles.fieldInput}
            value={repsInput}
            onChangeText={setRepsInput}
            placeholder="1"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="number-pad"
            accessibilityLabel="Repetitions"
          />
        </View>

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCalculate}
          accessibilityLabel="Calculate one rep max"
        >
          <Text style={styles.primaryButtonText}>Calculate One Rep Max</Text>
        </TouchableOpacity>
      </View>

      {displayOneRm !== null ? (
        <View style={styles.card}>
          <Text style={styles.resultHeading}>
            Your one rep max is{' '}
            {formatDisplayWeight(displayOneRm, weightUnit)}
          </Text>

          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>% of 1RM</Text>
              <Text style={styles.tableHeaderCell}>Lift weight</Text>
              <Text style={styles.tableHeaderCell}>Reps</Text>
            </View>
            {percentageTable.map((row) => (
              <View key={row.percent} style={styles.tableRow}>
                <Text style={styles.tableCell}>{row.percent}%</Text>
                <Text style={styles.tableCell}>
                  {formatDisplayWeight(row.weight, weightUnit)}
                </Text>
                <Text style={styles.tableCell}>{row.reps}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ToolScreenShell>
  );
}
