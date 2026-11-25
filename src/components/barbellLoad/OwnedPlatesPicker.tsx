import { FilterChip } from '@/src/components/ds';
import {
  color,
  space,
  typography,
} from '@/src/constants/tokens';
import { getAvailablePlates } from '@/src/utils/barbellLoad';
import { formatDisplayWeight } from '@/src/utils/oneRepMax';
import type { WeightUnit } from '@/src/utils/storage';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type OwnedPlatesPickerProps = {
  unit: WeightUnit;
  ownedPlates: number[];
  onChange: (plates: number[]) => void;
};

/**
 * Toggle which plate denominations the gym has. At least one plate must stay on.
 */
export function OwnedPlatesPicker({
  unit,
  ownedPlates,
  onChange,
}: OwnedPlatesPickerProps) {
  const catalog = getAvailablePlates(unit);

  const toggle = (weight: number) => {
    const isOwned = ownedPlates.includes(weight);
    if (isOwned) {
      if (ownedPlates.length <= 1) {
        return;
      }
      onChange(ownedPlates.filter((value) => value !== weight));
      return;
    }
    onChange(
      catalog.filter(
        (value) => ownedPlates.includes(value) || value === weight
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Plates you have</Text>
      <Text style={styles.hint}>
        Turn off denominations your gym does not stock.
      </Text>
      <View style={styles.chipRow}>
        {catalog.map((weight) => {
          const selected = ownedPlates.includes(weight);
          const label = formatDisplayWeight(weight, unit).replace(' ', '');
          return (
            <FilterChip
              key={weight}
              label={label}
              selected={selected}
              onPress={() => toggle(weight)}
              accessibilityLabel={`${selected ? 'Remove' : 'Add'} ${formatDisplayWeight(weight, unit)} plates`}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.xs,
  },
  label: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  hint: {
    ...typography.caption,
    color: color.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
});
