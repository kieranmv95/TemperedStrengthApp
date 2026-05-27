import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { Colors } from '@/src/constants/theme';
import { getToolById } from '@/src/data/tools';
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
import { useFocusEffect } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import { Keyboard, Text, TextInput, TouchableOpacity, View } from 'react-native';

const TOOL = getToolById('one-rep-max-breakdown')!;

export function OneRepMaxBreakdownScreen() {
  const posthog = usePostHog();
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
        <Text style={styles.cardTitle}>{TOOL.title}</Text>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>1RM</Text>
          <TextInput
            style={styles.fieldInput}
            value={oneRmInput}
            onChangeText={setOneRmInput}
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="decimal-pad"
            accessibilityLabel="One rep max weight"
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

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBreakdown}
          accessibilityLabel="Show one rep max breakdown"
        >
          <Text style={styles.primaryButtonText}>Breakdown</Text>
        </TouchableOpacity>
      </View>

      {displayOneRm !== null ? (
        <View style={styles.card}>
          <Text style={styles.resultHeading}>
            Breakdown for {formatDisplayWeight(displayOneRm, weightUnit)}
          </Text>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleToggleIncrements}
            accessibilityLabel={
              stepPercent === 10
                ? 'Show 5 percent increments'
                : 'Show 10 percent increments'
            }
          >
            <Text style={styles.secondaryButtonText}>
              {stepPercent === 10
                ? 'Show 5% increments'
                : 'Show 10% increments'}
            </Text>
          </TouchableOpacity>

          <View>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>% of 1RM</Text>
              <Text style={styles.tableHeaderCell}>Lift weight</Text>
            </View>
            {breakdownTable.map((row) => (
              <View key={row.percent} style={styles.tableRow}>
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
