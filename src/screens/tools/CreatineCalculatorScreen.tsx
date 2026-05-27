import {
  ToolScreenShell,
  toolFormStyles as styles,
} from '@/src/components/tools/ToolScreenShell';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { getToolById } from '@/src/data/tools';
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
import { useFocusEffect } from '@react-navigation/native';
import { usePostHog } from 'posthog-react-native';
import React, { useCallback, useState } from 'react';
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const TOOL = getToolById('creatine')!;

export function CreatineCalculatorScreen() {
  const posthog = usePostHog();
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
    posthog.capture(posthogEventsNames.content.toolCalculate, {
      tool_id: TOOL.id,
      unit: weightUnit,
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

        {validationError ? (
          <Text style={styles.errorText}>{validationError}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleCalculate}
          accessibilityLabel="Calculate creatine dose"
        >
          <Text style={styles.primaryButtonText}>Calculate dose</Text>
        </TouchableOpacity>
      </View>

      {doses !== null ? (
        <View style={styles.card}>
          <Text style={styles.resultHeading}>
            Maintenance dose: {formatCreatineGrams(doses.maintenanceGrams)}
          </Text>
          <Text style={localStyles.resultSubtext}>
            Take this amount daily to support muscle creatine stores and
            training performance. Based on ~0.03 g per kg bodyweight, within
            the usual 3-5 g/day range used in research.
          </Text>

          <View style={localStyles.sizeBlock}>
            <Text style={localStyles.sizeTitle}>Size-focused (higher end)</Text>
            <Text style={localStyles.sizeDose}>
              {formatCreatineGrams(doses.sizeFocusedGrams)} per day
            </Text>
            <Text style={localStyles.resultSubtext}>
              If you want a simple “push it for size” target, this biases toward
              the upper end of common practice while staying practical.
            </Text>
          </View>

          <View style={localStyles.loadingBlock}>
            <Text style={localStyles.loadingTitle}>Optional loading phase</Text>
            <Text style={localStyles.loadingDose}>
              {formatCreatineGrams(doses.loadingGrams)} per day
            </Text>
            {doses.loadingGrams > CREATINE_LOADING_GI_WARNING_THRESHOLD_G ? (
              <Text style={localStyles.loadingWarning}>
                Warning: Loading above{' '}
                {formatCreatineGrams(CREATINE_LOADING_GI_WARNING_THRESHOLD_G)}{' '}
                per day can cause stomach / GI distress for some people. If you
                load, split the total into 3-4 smaller doses with meals - or skip
                loading and stick to daily dosing.
              </Text>
            ) : null}
            <Text style={localStyles.resultSubtext}>
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
  resultSubtext: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  loadingBlock: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    gap: Spacing.sm,
  },
  sizeBlock: {
    marginTop: Spacing.xl,
    paddingTop: Spacing.xl,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    gap: Spacing.sm,
  },
  sizeTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
  },
  sizeDose: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  loadingTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
  },
  loadingDose: {
    color: Colors.accent,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  loadingWarning: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    backgroundColor: Colors.accentWashFill,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
    padding: Spacing.xl,
    marginTop: Spacing.sm,
  },
});
