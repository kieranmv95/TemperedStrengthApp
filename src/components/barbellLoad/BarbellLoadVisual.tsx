import type { Plate } from '@/src/utils/barbellLoad';
import { color, space } from '@/src/constants/tokens';
import React from 'react';
import { StyleSheet, View } from 'react-native';

type BarbellLoadVisualProps = {
  plates: Plate[];
};

const PLATE_HEIGHT = 110;
const PLATE_BASE_WIDTH = 10;
const BAR_HEIGHT = 8;
const COLLAR_HEIGHT = 18;
const COLLAR_WIDTH = 8;
const SLEEVE_WIDTH = 10;
const CORNER = 2;

/**
 * Simple side-on bar graphic. Collars are decorative and add no weight.
 * Plate colours come from the calculation result (standard rack colours).
 */
export function BarbellLoadVisual({ plates }: BarbellLoadVisualProps) {
  const leftPlates = [...plates].reverse();

  return (
    <View
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.sleeveRow}>
        <View style={styles.sleeve} />
        <View style={styles.collar} />
      </View>

      <View style={styles.platesRow}>
        {leftPlates.map((plate) =>
          Array.from({ length: plate.count }).map((_, idx) => (
            <View
              key={`left-${plate.weight}-${idx}`}
              style={[
                styles.plate,
                {
                  backgroundColor: plate.color,
                  width: PLATE_BASE_WIDTH * plate.size.thickness,
                  height: PLATE_HEIGHT * plate.size.height,
                  borderColor:
                    plate.color === '#FFFFFF'
                      ? color.borderStrong
                      : 'transparent',
                  borderWidth: plate.color === '#FFFFFF' ? StyleSheet.hairlineWidth : 0,
                },
              ]}
            />
          ))
        )}
      </View>

      <View style={styles.bar} />

      <View style={styles.platesRow}>
        {plates.map((plate) =>
          Array.from({ length: plate.count }).map((_, idx) => (
            <View
              key={`right-${plate.weight}-${idx}`}
              style={[
                styles.plate,
                {
                  backgroundColor: plate.color,
                  width: PLATE_BASE_WIDTH * plate.size.thickness,
                  height: PLATE_HEIGHT * plate.size.height,
                  borderColor:
                    plate.color === '#FFFFFF'
                      ? color.borderStrong
                      : 'transparent',
                  borderWidth: plate.color === '#FFFFFF' ? StyleSheet.hairlineWidth : 0,
                },
              ]}
            />
          ))
        )}
      </View>

      <View style={styles.sleeveRow}>
        <View style={styles.collar} />
        <View style={styles.sleeve} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
    gap: 2,
    minHeight: PLATE_HEIGHT + space.sm,
    paddingVertical: space.sm,
  },
  platesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  plate: {
    borderRadius: CORNER,
  },
  bar: {
    height: BAR_HEIGHT,
    flex: 1,
    minWidth: 24,
    backgroundColor: color.borderStrong,
    borderRadius: CORNER,
  },
  sleeveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  sleeve: {
    width: SLEEVE_WIDTH,
    height: BAR_HEIGHT,
    backgroundColor: color.borderStrong,
    borderRadius: CORNER,
  },
  collar: {
    width: COLLAR_WIDTH,
    height: COLLAR_HEIGHT,
    backgroundColor: color.textSecondary,
    borderRadius: CORNER,
  },
});
