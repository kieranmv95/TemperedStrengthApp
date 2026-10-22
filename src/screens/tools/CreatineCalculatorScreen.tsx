import { FilterChip, NumberField } from '@/src/components/ds';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { getToolById } from '@/src/data/tools';
import { useLargeText } from '@/src/hooks/useLargeText';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  CREATINE_LOADING_GI_WARNING_THRESHOLD_G,
  calculateCreatineDoses,
  formatCreatineGrams,
  parseBodyweightToKg,
  type CreatineDoseResult,
} from '@/src/utils/creatine';
import type { WeightUnit } from '@/src/utils/storage';
import { getWeightUnit } from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const TOOL = getToolById('creatine')!;

export function CreatineCalculatorScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [bodyweightInput, setBodyweightInput] = useState('80');
  const [doses, setDoses] = useState<CreatineDoseResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      increment('tool_creatine_calculator_views');
      posthog.capture(posthogEventsNames.content.toolView, {
        tool_id: TOOL.id,
      });

      void getWeightUnit().then(setWeightUnit);
    }, [posthog])
  );

  const handleCalculate = () => {
    Keyboard.dismiss();
    const bodyweightKg = parseBodyweightToKg(bodyweightInput, weightUnit);

    if (bodyweightKg === null) {
      setValidationError('Enter a valid bodyweight.');
      setDoses(null);
      return;
    }

    const result = calculateCreatineDoses(bodyweightKg);
    if (result === null) {
      setValidationError('Could not calculate. Check your input.');
      setDoses(null);
      return;
    }

    setValidationError(null);
    setDoses(result);
    AccessibilityInfo.announceForAccessibility(
      `Maintenance dose ${formatCreatineGrams(result.maintenanceGrams)} per day`
    );
    posthog.capture(posthogEventsNames.content.toolCalculate, {
      tool_id: TOOL.id,
      unit: weightUnit,
    });
  };

  return (
    <ToolScreenShell title={TOOL.title}>
      <View style={styles.card}>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={[styles.fieldRow, largeText && styles.fieldRowStacked]}>
          <View style={styles.fieldInput}>
            <NumberField
              label={`Bodyweight (${weightUnit})`}
              value={bodyweightInput}
              onChangeText={setBodyweightInput}
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
          onPress={handleCalculate}
          accessibilityRole="button"
          accessibilityLabel="Calculate creatine dose"
        >
          <Text style={styles.primaryButtonText}>Calculate dose</Text>
        </Pressable>
      </View>

      {doses !== null ? (
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel={`Maintenance dose, ${formatCreatineGrams(
              doses.maintenanceGrams
            )} per day`}
          >
            <Text style={styles.resultLabel} accessibilityRole="header">
              Maintenance dose
            </Text>
            <Text style={styles.resultValue}>
              {formatCreatineGrams(doses.maintenanceGrams)}
            </Text>
          </View>
          <Text style={styles.resultBody}>
            Take this amount daily to support muscle creatine stores and
            training performance. Based on ~0.03 g per kg bodyweight, within the
            usual 3-5 g/day range used in research.
          </Text>

          <View style={styles.divider}>
            <Text style={styles.resultLabel} accessibilityRole="header">
              Size-focused (higher end)
            </Text>
            <Text style={localStyles.secondaryDose}>
              {formatCreatineGrams(doses.sizeFocusedGrams)} per day
            </Text>
            <Text style={styles.resultBody}>
              If you want a simple “push it for size” target, this biases toward
              the upper end of common practice while staying practical.
            </Text>
          </View>

          <View style={styles.divider}>
            <Text style={styles.resultLabel} accessibilityRole="header">
              Optional loading phase
            </Text>
            <Text style={localStyles.secondaryDose}>
              {formatCreatineGrams(doses.loadingGrams)} per day
            </Text>
            {doses.loadingGrams > CREATINE_LOADING_GI_WARNING_THRESHOLD_G ? (
              <View style={localStyles.warning}>
                <Ionicons
                  name="warning-outline"
                  size={20}
                  color={color.warning}
                />
                <Text style={localStyles.warningText}>
                  Warning: Loading above{' '}
                  {formatCreatineGrams(CREATINE_LOADING_GI_WARNING_THRESHOLD_G)}{' '}
                  per day can cause stomach / GI distress for some people. If
                  you load, split the total into 3-4 smaller doses with meals -
                  or skip loading and stick to daily dosing.
                </Text>
              </View>
            ) : null}
            <Text style={styles.resultBody}>
              For 5-7 days only (~0.2 g per kg), then switch to the maintenance
              dose above. Loading is optional; maintenance alone works fine.
            </Text>
          </View>
        </View>
      ) : null}
    </ToolScreenShell>
  );
}

const localStyles = StyleSheet.create({
  secondaryDose: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
    backgroundColor: color.warningTint,
    borderRadius: radius.sm,
    padding: space.sm,
  },
  warningText: {
    ...typography.callout,
    color: color.textPrimary,
    flex: 1,
  },
});
