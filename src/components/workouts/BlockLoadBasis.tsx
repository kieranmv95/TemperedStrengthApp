import { ActionChip, NumberField } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import {
  formatDisplayWeight,
  oneRepMaxKgToDisplay,
  parseLiftWeightToKg,
} from '@/src/utils/oneRepMax';
import type { WeightUnit } from '@/src/utils/storage';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const ACTION_HIT_SLOP = { top: 10, bottom: 10, left: 10, right: 10 };

type BlockLoadBasisProps = {
  oneRmKg: number;
  unit: WeightUnit;
  /** True when the shown 1RM is a session override, not the saved PB. */
  isOverride: boolean;
  onOverride: (oneRmKg: number) => void;
  onResetOverride: () => void;
};

/**
 * Shows which 1RM the percentage breakdown uses, with a session-only override.
 */
export function BlockLoadBasis({
  oneRmKg,
  unit,
  isOverride,
  onOverride,
  onResetOverride,
}: BlockLoadBasisProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const displayWeight = formatDisplayWeight(
    oneRepMaxKgToDisplay(oneRmKg, unit),
    unit
  );

  useEffect(() => {
    if (!editing) {
      return;
    }
    setInput(String(oneRepMaxKgToDisplay(oneRmKg, unit)));
    setError(null);
  }, [editing, oneRmKg, unit]);

  const handleApply = () => {
    const kg = parseLiftWeightToKg(input, unit);
    if (kg === null) {
      setError(`Enter a valid weight in ${unit}.`);
      return;
    }
    setError(null);
    onOverride(kg);
    setEditing(false);
  };

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text
          style={styles.basis}
          accessibilityRole="text"
          accessibilityLabel={`Using one-rep max of ${displayWeight}${
            isOverride ? ', session override' : ''
          }`}
        >
          {`Using 1RM of ${displayWeight}`}
          {isOverride ? ' · override' : ''}
        </Text>
        <View style={styles.actions}>
          {isOverride && !editing ? (
            <Pressable
              onPress={onResetOverride}
              hitSlop={ACTION_HIT_SLOP}
              accessibilityRole="button"
              accessibilityLabel="Reset to saved personal best"
            >
              <Text style={styles.actionText}>Reset</Text>
            </Pressable>
          ) : null}
          <Pressable
            onPress={() => setEditing((open) => !open)}
            hitSlop={ACTION_HIT_SLOP}
            accessibilityRole="button"
            accessibilityLabel={
              editing ? 'Cancel changing one-rep max' : 'Change one-rep max'
            }
          >
            <Text style={styles.actionText}>{editing ? 'Cancel' : 'Change'}</Text>
          </Pressable>
        </View>
      </View>
      {editing ? (
        <View style={styles.editor}>
          <Text style={styles.hint}>
            Temporary for this session. Does not update your saved PB.
          </Text>
          <NumberField
            label={`1RM (${unit})`}
            value={input}
            onChangeText={setInput}
            placeholder={unit}
            allowDecimal
            error={error ?? undefined}
          />
          <ActionChip
            label="Use this 1RM"
            icon="checkmark-outline"
            tone="gold"
            onPress={handleApply}
            accessibilityLabel="Apply temporary one-rep max"
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.goldTint,
    borderRadius: radius.sm,
    paddingVertical: space.xs,
    paddingHorizontal: space.sm,
    gap: space.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
  },
  basis: {
    ...typography.captionStrong,
    color: color.gold,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  actionText: {
    ...typography.captionStrong,
    color: color.textPrimary,
  },
  editor: {
    gap: space.sm,
  },
  hint: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
