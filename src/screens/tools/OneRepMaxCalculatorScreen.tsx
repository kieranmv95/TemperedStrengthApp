import { FilterChip, NumberField } from '@/src/components/ds';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { getToolById } from '@/src/data/tools';
import { useLargeText } from '@/src/hooks/useLargeText';
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
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';

const TOOL = getToolById('one-rep-max')!;

export function OneRepMaxCalculatorScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
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
        AccessibilityInfo.announceForAccessibility(
          `Your one-rep max is ${formatDisplayWeight(
            oneRepMaxKgToDisplay(oneRmKg, weightUnit),
            weightUnit
          )}`
        );
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
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={[styles.fieldRow, largeText && styles.fieldRowStacked]}>
          <View style={styles.fieldInput}>
            <NumberField
              label={`Lift weight (${weightUnit})`}
              value={liftInput}
              onChangeText={setLiftInput}
              placeholder={weightUnit}
              allowDecimal
            />
          </View>
          <View style={styles.unitToggle}>
            {(['kg', 'lb'] as const).map((unit) => (
              <FilterChip
                key={unit}
                label={unit}
                selected={weightUnit === unit}
                onPress={() => setWeightUnit(unit)}
                accessibilityLabel={`Use ${unit}`}
              />
            ))}
          </View>
        </View>

        <NumberField
          label="Reps"
          value={repsInput}
          onChangeText={setRepsInput}
          placeholder="1"
          hint="Whole number from 1 to 20"
        />

        {validationError ? (
          <Text
            style={styles.errorText}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
          >
            {validationError}
          </Text>
        ) : null}

        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
          onPress={handleCalculate}
          accessibilityRole="button"
          accessibilityLabel="Calculate one-rep max"
        >
          <Text style={styles.primaryButtonText}>Calculate one-rep max</Text>
        </Pressable>
      </View>

      {displayOneRm !== null ? (
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel={`Your one-rep max is ${formatDisplayWeight(
              displayOneRm,
              weightUnit
            )}`}
          >
            <Text style={styles.resultLabel} accessibilityRole="header">
              Your one-rep max
            </Text>
            <Text style={styles.resultValue}>
              {formatDisplayWeight(displayOneRm, weightUnit)}
            </Text>
          </View>

          <View>
            <View
              style={styles.tableHeader}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text style={styles.tableHeaderCell}>% of 1RM</Text>
              <Text style={styles.tableHeaderCell}>Lift weight</Text>
              <Text style={styles.tableHeaderCell}>Reps</Text>
            </View>
            {percentageTable.map((row) => (
              <View
                key={row.percent}
                style={styles.tableRow}
                accessible
                accessibilityLabel={`${row.percent}% of one-rep max, ${formatDisplayWeight(
                  row.weight,
                  weightUnit
                )}, ${row.reps} reps`}
              >
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
