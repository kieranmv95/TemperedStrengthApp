import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { daySelectorStyles as styles } from './daySelectorStyles';

type DotKind = 'today' | 'workout' | 'none';

type DaySelectorDayChipProps = {
  label: string;
  subLabel?: string;
  isSelected: boolean;
  dotKind: DotKind;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function DaySelectorDayChip({
  label,
  subLabel,
  isSelected,
  dotKind,
  onPress,
  onLayout,
}: DaySelectorDayChipProps) {
  return (
    <TouchableOpacity
      style={[styles.dayItem, isSelected && styles.dayItemSelected]}
      onPress={onPress}
      onLayout={onLayout}
    >
      <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
        {label}
      </Text>
      {!!subLabel && (
        <Text
          style={[styles.daySubLabel, isSelected && styles.daySubLabelSelected]}
        >
          {subLabel}
        </Text>
      )}
      <View
        style={[
          styles.dot,
          dotKind === 'today'
            ? styles.dotToday
            : dotKind === 'workout'
              ? styles.dotWorkout
              : null,
        ]}
      />
    </TouchableOpacity>
  );
}
