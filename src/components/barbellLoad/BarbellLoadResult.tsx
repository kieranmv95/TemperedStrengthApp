import { FilterChip } from '@/src/components/ds';
import { BarbellLoadVisual } from '@/src/components/barbellLoad/BarbellLoadVisual';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  calculatePlates,
  getBarbellWeight,
  type BarType,
  type BarbellLoadResult as LoadResult,
} from '@/src/utils/barbellLoad';
import { formatDisplayWeight } from '@/src/utils/oneRepMax';
import type { WeightUnit } from '@/src/utils/storage';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type BarbellLoadResultProps = {
  targetWeight: number;
  unit: WeightUnit;
  barType: BarType;
  ownedPlates: number[];
  onBarTypeChange: (barType: BarType) => void;
  /** When both set, show low / high chips (e.g. a % range). */
  rangeLowWeight?: number | null;
  rangeHighWeight?: number | null;
  onSelectRangeWeight?: (weight: number) => void;
};

function formatPlateLine(
  count: number,
  weight: number,
  unit: WeightUnit
): string {
  const label = formatDisplayWeight(weight, unit);
  return `${count} × ${label} each side`;
}

/**
 * Shared result for the Bar Loader tool and bottom sheet: bar toggle,
 * graphic, per-side list, and target vs achieved.
 */
export function BarbellLoadResultView({
  targetWeight,
  unit,
  barType,
  ownedPlates,
  onBarTypeChange,
  rangeLowWeight = null,
  rangeHighWeight = null,
  onSelectRangeWeight,
}: BarbellLoadResultProps) {
  const result: LoadResult = calculatePlates(
    targetWeight,
    barType,
    ownedPlates,
    unit
  );

  const exact = result.achievedWeight === result.targetWeight;
  const maleLabel = `Men's ${getBarbellWeight('male', unit)}${unit}`;
  const femaleLabel = `Women's ${getBarbellWeight('female', unit)}${unit}`;
  const hasRange =
    rangeLowWeight !== null &&
    rangeHighWeight !== null &&
    typeof onSelectRangeWeight === 'function';

  return (
    <View style={styles.container}>
      {hasRange ? (
        <View style={styles.rangeRow}>
          <Text style={styles.sectionLabel}>Load</Text>
          <View style={styles.chipRow}>
            <FilterChip
              label={formatDisplayWeight(rangeLowWeight, unit)}
              selected={targetWeight === rangeLowWeight}
              onPress={() => onSelectRangeWeight(rangeLowWeight)}
              accessibilityLabel={`Use ${formatDisplayWeight(rangeLowWeight, unit)}`}
            />
            <FilterChip
              label={formatDisplayWeight(rangeHighWeight, unit)}
              selected={targetWeight === rangeHighWeight}
              onPress={() => onSelectRangeWeight(rangeHighWeight)}
              accessibilityLabel={`Use ${formatDisplayWeight(rangeHighWeight, unit)}`}
            />
          </View>
        </View>
      ) : null}

      <View style={styles.barToggle}>
        <Text style={styles.sectionLabel}>Barbell</Text>
        <View style={styles.chipRow}>
          <FilterChip
            label={maleLabel}
            selected={barType === 'male'}
            onPress={() => onBarTypeChange('male')}
            accessibilityLabel={`Use ${maleLabel} bar`}
          />
          <FilterChip
            label={femaleLabel}
            selected={barType === 'female'}
            onPress={() => onBarTypeChange('female')}
            accessibilityLabel={`Use ${femaleLabel} bar`}
          />
        </View>
      </View>

      <BarbellLoadVisual plates={result.plates} />

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Target</Text>
          <Text style={styles.summaryValue}>
            {formatDisplayWeight(result.targetWeight, unit)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Achieved</Text>
          <Text
            style={[styles.summaryValue, !exact && styles.summaryValueWarn]}
          >
            {formatDisplayWeight(result.achievedWeight, unit)}
          </Text>
        </View>
        {!exact ? (
          <Text
            style={styles.mismatchNote}
            accessibilityRole="text"
            accessibilityLiveRegion="polite"
          >
            Closest load with your plates. Target cannot be made exactly.
          </Text>
        ) : null}
        <Text style={styles.barNote}>
          {barType === 'male' ? "Men's" : "Women's"} bar{' '}
          {formatDisplayWeight(result.barWeight, unit)}
        </Text>
      </View>

      <View style={styles.plateList}>
        <Text style={styles.sectionLabel}>Each side</Text>
        {result.plates.length === 0 ? (
          <Text style={styles.emptyPlates}>No plates — bar only.</Text>
        ) : (
          result.plates.map((plate) => (
            <View key={plate.weight} style={styles.plateRow}>
              <View
                style={[styles.plateSwatch, { backgroundColor: plate.color }]}
              />
              <Text style={styles.plateText}>
                {formatPlateLine(plate.count, plate.weight, unit)}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.md,
  },
  rangeRow: {
    gap: space.xs,
  },
  barToggle: {
    gap: space.xs,
  },
  sectionLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  summary: {
    backgroundColor: color.surface2,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_TARGET_SIZE / 2,
  },
  summaryLabel: {
    ...typography.callout,
    color: color.textSecondary,
  },
  summaryValue: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  summaryValueWarn: {
    color: color.gold,
  },
  mismatchNote: {
    ...typography.caption,
    color: color.gold,
    marginTop: space.xxs,
  },
  barNote: {
    ...typography.caption,
    color: color.textSecondary,
  },
  plateList: {
    gap: space.xs,
  },
  emptyPlates: {
    ...typography.callout,
    color: color.textSecondary,
  },
  plateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE * 0.75,
  },
  plateSwatch: {
    width: 14,
    height: 28,
    borderRadius: 2,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: color.borderSubtle,
  },
  plateText: {
    ...typography.body,
    color: color.textPrimary,
    flex: 1,
  },
});
