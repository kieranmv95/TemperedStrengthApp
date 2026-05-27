import { Pill } from '@/src/components/pill';
import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getToolById } from '@/src/data/tools';
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
import { useFocusEffect } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const TOOL = getToolById('water-intake')!;

export function WaterIntakeCalculatorScreen() {
  const posthog = usePostHog();
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
        <Text style={styles.cardTitle}>{TOOL.title}</Text>
        <Text style={styles.cardDescription}>{TOOL.description}</Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Weight</Text>
          <TextInput
            style={styles.fieldInput}
            value={bodyweightInput}
            onChangeText={setBodyweightInput}
            placeholder="0"
            placeholderTextColor={Colors.textPlaceholder}
            keyboardType="decimal-pad"
            accessibilityLabel="Bodyweight"
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

        <View style={localStyles.section}>
          <Text style={localStyles.sectionLabel}>Activity level</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={localStyles.activityScroll}
          >
            {WATER_ACTIVITY_OPTIONS.map((option) => (
              <Pill
                key={option.level}
                onPress={() => setActivityLevel(option.level)}
                isActive={activityLevel === option.level}
                label={option.shortLabel}
              />
            ))}
          </ScrollView>
          <Text style={localStyles.activityHint}>
            {WATER_ACTIVITY_OPTIONS[activityLevel].description}
          </Text>
        </View>

        <View style={localStyles.creatineRow}>
          <View style={localStyles.creatineText}>
            <Text style={localStyles.creatineLabel}>Taking creatine?</Text>
            <Text style={localStyles.creatineHint}>
              Adds ~3 ml per kg for extra fluid needs
            </Text>
          </View>
          <Switch
            value={takingCreatine}
            onValueChange={setTakingCreatine}
            accessibilityLabel="Taking creatine"
          />
        </View>

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCalculate}
          accessibilityLabel="Calculate daily water intake"
        >
          <Text style={styles.primaryButtonText}>Calculate intake</Text>
        </TouchableOpacity>
      </View>

      {result !== null ? (
        <View style={styles.card}>
          <Text style={styles.resultHeading}>
            Daily target: {formatWaterMl(result.totalMl)}
          </Text>
          <Text style={localStyles.resultSubtext}>
            Spread across the day. Drink more around training and in hot
            weather.
          </Text>

          <View style={localStyles.breakdown}>
            <View style={localStyles.breakdownRow}>
              <Text style={localStyles.breakdownLabel}>Base hydration</Text>
              <Text style={localStyles.breakdownValue}>
                {formatWaterBreakdownMl(result.baseMl)}
              </Text>
            </View>
            <View style={localStyles.breakdownRow}>
              <Text style={localStyles.breakdownLabel}>
                Activity ({result.activityLabel})
              </Text>
              <Text style={localStyles.breakdownValue}>
                +{formatWaterBreakdownMl(result.activityMl)}
              </Text>
            </View>
            {result.creatineMl > 0 ? (
              <View style={localStyles.breakdownRow}>
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
    gap: Spacing.md,
  },
  sectionLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  activityScroll: {
    gap: Spacing.md,
  },
  activityHint: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
  creatineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundScreen,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    padding: Spacing.xl,
  },
  creatineText: {
    flex: 1,
    gap: Spacing.xs,
  },
  creatineLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  creatineHint: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 18,
  },
  resultSubtext: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  breakdown: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    gap: Spacing.lg,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.md,
  },
  breakdownLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    flex: 1,
  },
  breakdownValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
