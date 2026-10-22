import { FilterChip, NumberField } from '@/src/components/ds';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { color, space, typography } from '@/src/constants/tokens';
import { getToolById } from '@/src/data/tools';
import { useLargeText } from '@/src/hooks/useLargeText';
import { increment } from '@/src/services/metricService';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  calculateWaterIntakeMl,
  formatWaterBreakdownMl,
  formatWaterMl,
  parseBodyweightToKg,
  WATER_ACTIVITY_OPTIONS,
  type WaterActivityLevel,
  type WaterIntakeResult,
} from '@/src/utils/waterIntake';
import type { WeightUnit } from '@/src/utils/storage';
import { getWeightUnit } from '@/src/utils/storage';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import {
  AccessibilityInfo,
  Keyboard,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

const TOOL = getToolById('water-intake')!;

const SWITCH_TRACK_COLORS = { false: color.borderStrong, true: color.gold };

export function WaterIntakeCalculatorScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [bodyweightInput, setBodyweightInput] = useState('80');
  const [activityLevel, setActivityLevel] = useState<WaterActivityLevel>(1);
  const [takingCreatine, setTakingCreatine] = useState(false);
  const [result, setResult] = useState<WaterIntakeResult | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      increment('tool_water_intake_calculator_views');
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
      setResult(null);
      return;
    }

    const intake = calculateWaterIntakeMl(
      bodyweightKg,
      activityLevel,
      takingCreatine
    );
    if (intake === null) {
      setValidationError('Could not calculate. Check your input.');
      setResult(null);
      return;
    }

    setValidationError(null);
    setResult(intake);
    AccessibilityInfo.announceForAccessibility(
      `Daily target ${formatWaterMl(intake.totalMl)}`
    );
    posthog.capture(posthogEventsNames.content.toolCalculate, {
      tool_id: TOOL.id,
      unit: weightUnit,
      activity_level: activityLevel,
      taking_creatine: takingCreatine,
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

        <View style={localStyles.section}>
          <Text style={styles.sectionLabel}>Activity level</Text>
          <View style={localStyles.chipRow}>
            {WATER_ACTIVITY_OPTIONS.map((option) => (
              <FilterChip
                key={option.level}
                label={option.shortLabel}
                selected={activityLevel === option.level}
                onPress={() => setActivityLevel(option.level)}
                accessibilityLabel={`Activity level ${option.label}, ${option.description}`}
              />
            ))}
          </View>
          <Text style={localStyles.hint}>
            {WATER_ACTIVITY_OPTIONS[activityLevel].description}
          </Text>
        </View>

        <View style={localStyles.creatineRow}>
          <View style={localStyles.creatineText}>
            <Text style={localStyles.creatineLabel}>Taking creatine?</Text>
            <Text style={localStyles.hint}>
              Adds ~3 ml per kg for extra fluid needs
            </Text>
          </View>
          <Switch
            value={takingCreatine}
            onValueChange={setTakingCreatine}
            trackColor={SWITCH_TRACK_COLORS}
            ios_backgroundColor={color.borderStrong}
            accessibilityLabel="Taking creatine"
            accessibilityHint="Adds about 3 ml per kg for extra fluid needs"
          />
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
          accessibilityLabel="Calculate daily water intake"
        >
          <Text style={styles.primaryButtonText}>Calculate intake</Text>
        </Pressable>
      </View>

      {result !== null ? (
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel={`Daily target, ${formatWaterMl(result.totalMl)}`}
          >
            <Text style={styles.resultLabel} accessibilityRole="header">
              Daily target
            </Text>
            <Text style={styles.resultValue}>
              {formatWaterMl(result.totalMl)}
            </Text>
          </View>
          <Text style={styles.resultBody}>
            Spread across the day. Drink more around training and in hot
            weather.
          </Text>

          <View style={styles.divider}>
            <View
              style={localStyles.breakdownRow}
              accessible
              accessibilityLabel={`Base hydration, ${formatWaterBreakdownMl(
                result.baseMl
              )}`}
            >
              <Text style={localStyles.breakdownLabel}>Base hydration</Text>
              <Text style={localStyles.breakdownValue}>
                {formatWaterBreakdownMl(result.baseMl)}
              </Text>
            </View>
            <View
              style={localStyles.breakdownRow}
              accessible
              accessibilityLabel={`Activity, ${
                result.activityLabel
              }, plus ${formatWaterBreakdownMl(result.activityMl)}`}
            >
              <Text style={localStyles.breakdownLabel}>
                Activity ({result.activityLabel})
              </Text>
              <Text style={localStyles.breakdownValue}>
                +{formatWaterBreakdownMl(result.activityMl)}
              </Text>
            </View>
            {result.creatineMl > 0 ? (
              <View
                style={localStyles.breakdownRow}
                accessible
                accessibilityLabel={`Creatine, plus ${formatWaterBreakdownMl(
                  result.creatineMl
                )}`}
              >
                <Text style={localStyles.breakdownLabel}>Creatine</Text>
                <Text style={localStyles.breakdownValue}>
                  +{formatWaterBreakdownMl(result.creatineMl)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      ) : null}
    </ToolScreenShell>
  );
}

const localStyles = StyleSheet.create({
  section: {
    gap: space.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  hint: {
    ...typography.caption,
    color: color.textSecondary,
  },
  creatineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  creatineText: {
    flex: 1,
    gap: space.xxs,
  },
  creatineLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: space.sm,
  },
  breakdownLabel: {
    ...typography.callout,
    color: color.textSecondary,
    flex: 1,
  },
  breakdownValue: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
});
