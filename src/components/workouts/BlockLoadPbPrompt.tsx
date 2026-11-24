import { ActionChip, FilterChip, NumberField } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { getExerciseById } from '@/src/data/exercises';
import type { RepMax } from '@/src/types/personalBests';
import { parseLiftWeightToKg } from '@/src/utils/oneRepMax';
import { savePersonalBest, type WeightUnit } from '@/src/utils/storage';
import React, { useState } from 'react';
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native';

const TIER_OPTIONS: readonly RepMax[] = [1, 3, 5];

type BlockLoadPbPromptProps = {
  exerciseId: number;
  unit: WeightUnit;
  onSaved: () => void;
};

/**
 * Inline prompt to log a PB so percentage tokens on the block can show weights.
 */
export function BlockLoadPbPrompt({
  exerciseId,
  unit,
  onSaved,
}: BlockLoadPbPromptProps) {
  const exercise = getExerciseById(exerciseId);
  const exerciseName = exercise?.name ?? 'this lift';
  const [weightInput, setWeightInput] = useState('');
  const [tier, setTier] = useState<RepMax>(1);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (saving) {
      return;
    }
    const kg = parseLiftWeightToKg(weightInput, unit);
    if (kg === null) {
      setError(`Enter a valid weight in ${unit}.`);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await savePersonalBest(exerciseId, tier, kg);
      AccessibilityInfo.announceForAccessibility(
        `Saved ${exerciseName} personal best. Percentages updated.`
      );
      onSaved();
    } catch (err) {
      console.error('Error saving load-breakdown PB:', err);
      setError('Could not save. Try again.');
      setSaving(false);
    }
  };

  return (
    <View style={styles.card} accessibilityRole="summary">
      <Text style={styles.title}>Add PB for load breakdown</Text>
      <Text style={styles.body}>
        Log a {exerciseName} max so percentages show your working weights.
      </Text>
      <View style={styles.tierRow} accessibilityRole="radiogroup">
        {TIER_OPTIONS.map((option) => (
          <FilterChip
            key={option}
            label={`${option}RM`}
            selected={tier === option}
            onPress={() => setTier(option)}
            accessibilityLabel={`${option} rep max`}
          />
        ))}
      </View>
      <NumberField
        label={`Weight (${unit})`}
        value={weightInput}
        onChangeText={setWeightInput}
        placeholder={unit}
        allowDecimal
        error={error ?? undefined}
      />
      <ActionChip
        label={saving ? 'Saving…' : 'Save PB'}
        icon="trophy-outline"
        tone="gold"
        onPress={() => {
          void handleSave();
        }}
        accessibilityLabel={`Save ${exerciseName} personal best`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.goldTint,
    borderRadius: radius.sm,
    padding: space.sm,
    gap: space.sm,
  },
  title: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  tierRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
