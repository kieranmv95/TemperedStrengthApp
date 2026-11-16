import { BottomSheet } from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ZoneMethodInfoSheetProps = {
  visible: boolean;
  onClose: () => void;
};

/** Explains the basic and advanced (Karvonen) zone calculations. */
export function ZoneMethodInfoSheet({
  visible,
  onClose,
}: ZoneMethodInfoSheetProps) {
  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="How zones are calculated"
    >
      <View style={styles.section}>
        <Text style={styles.heading}>Basic</Text>
        <Text style={styles.body}>
          Your max heart rate is estimated as 220 minus your age. Each zone is a
          percentage of that max.
        </Text>
        <Text style={styles.formula}>Max HR × zone %</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Advanced (Karvonen)</Text>
        <Text style={styles.body}>
          Uses your heart rate reserve: the gap between your max and resting
          heart rate. A fitter heart has a lower resting rate, so these zones
          fit you more closely.
        </Text>
        <Text style={styles.formula}>
          (Max HR − resting HR) × zone % + resting HR
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Measuring resting heart rate</Text>
        <Text style={styles.body}>
          Just after waking, before you get up, count your pulse for 60 seconds.
          A watch or fitness tracker can measure it for you too.
        </Text>
      </View>
      <Text style={styles.note}>
        Both methods are estimates. A lab test gives the most accurate zones.
      </Text>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: space.xxs,
  },
  heading: {
    ...typography.headline,
    color: color.textPrimary,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  formula: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  note: {
    ...typography.caption,
    color: color.textTertiary,
  },
});
