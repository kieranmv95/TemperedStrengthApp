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
  buildOneRepMaxBreakdownTable,
  formatDisplayWeight,
  oneRepMaxKgToDisplay,
  parseLiftWeightToKg,
  type OneRepMaxBreakdownStep,
} from '@/src/utils/oneRepMax';
import type { WeightUnit } from '@/src/utils/storage';
import { getWeightUnit } from '@/src/utils/storage';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  Text,
  View,
} from 'react-native';

const TOOL = getToolById('one-rep-max-breakdown')!;

const STEP_OPTIONS: readonly OneRepMaxBreakdownStep[] = [10, 5];

export function OneRepMaxBreakdownScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [oneRmInput, setOneRmInput] = useState('100');
  const [resultOneRmKg, setResultOneRmKg] = useState<number | null>(null);
  const [stepPercent, setStepPercent] = useState<OneRepMaxBreakdownStep>(10);
  const [validationError, setValidationError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      increment('tool_one_rep_max_breakdown_views');
      posthog.capture(posthogEventsNames.content.toolView, {
        tool_id: TOOL.id,
      });

      void getWeightUnit().then(setWeightUnit);
    }, [posthog])
  );

  const breakdownTable = useMemo(() => {
    if (resultOneRmKg === null) {
      return [];
    }
    return buildOneRepMaxBreakdownTable(resultOneRmKg, weightUnit, stepPercent);
  }, [resultOneRmKg, weightUnit, stepPercent]);

  const displayOneRm =
    resultOneRmKg !== null
      ? oneRepMaxKgToDisplay(resultOneRmKg, weightUnit)
      : null;

  const handleBreakdown = () => {
    Keyboard.dismiss();
    const oneRmKg = parseLiftWeightToKg(oneRmInput, weightUnit);

    if (oneRmKg === null) {
      setValidationError('Enter a valid one-rep max.');
      setResultOneRmKg(null);
      return;
    }

    setValidationError(null);
    setResultOneRmKg(oneRmKg);
    AccessibilityInfo.announceForAccessibility(
      `Breakdown for ${formatDisplayWeight(
        oneRepMaxKgToDisplay(oneRmKg, weightUnit),
        weightUnit
      )} shown`
    );
    posthog.capture(posthogEventsNames.content.toolCalculate, {
      tool_id: TOOL.id,
      unit: weightUnit,
      step_percent: stepPercent,
    });
  };

  const handleToggleIncrements = () => {
    setStepPercent((current) => (current === 10 ? 5 : 10));
  };

  return (
    <ToolScreenShell title={TOOL.title}>
      <View style={styles.card}>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={[styles.fieldRow, largeText && styles.fieldRowStacked]}>
          <View style={styles.fieldInput}>
            <NumberField
              label={`One-rep max (${weightUnit})`}
              value={oneRmInput}
              onChangeText={setOneRmInput}
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
          onPress={handleBreakdown}
          accessibilityRole="button"
          accessibilityLabel="Show one-rep max breakdown"
        >
          <Text style={styles.primaryButtonText}>Show breakdown</Text>
        </Pressable>
      </View>

      {displayOneRm !== null ? (
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel={`Breakdown for ${formatDisplayWeight(
              displayOneRm,
              weightUnit
            )}`}
          >
            <Text style={styles.resultLabel} accessibilityRole="header">
              Breakdown for
            </Text>
            <Text style={styles.resultValue}>
              {formatDisplayWeight(displayOneRm, weightUnit)}
            </Text>
          </View>

          <View>
            <Text style={styles.sectionLabel}>Increments</Text>
            <View style={styles.unitToggle}>
              {STEP_OPTIONS.map((option) => {
                const isSelected = stepPercent === option;
                return (
                  <FilterChip
                    key={option}
                    label={`${option}%`}
                    selected={isSelected}
                    onPress={() => {
                      if (!isSelected) {
                        handleToggleIncrements();
                      }
                    }}
                    accessibilityLabel={`${option} percent increments`}
                  />
                );
              })}
            </View>
          </View>

          <View>
            <View
              style={styles.tableHeader}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Text style={styles.tableHeaderCell}>% of 1RM</Text>
              <Text style={styles.tableHeaderCell}>Lift weight</Text>
            </View>
            {breakdownTable.map((row) => (
              <View
                key={row.percent}
                style={styles.tableRow}
                accessible
                accessibilityLabel={`${row.percent}% of one-rep max, ${formatDisplayWeight(
                  row.weight,
                  weightUnit
                )}`}
              >
                <Text style={styles.tableCell}>{row.percent}%</Text>
                <Text style={styles.tableCell}>
                  {formatDisplayWeight(row.weight, weightUnit)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </ToolScreenShell>
  );
}
