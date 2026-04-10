import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { daySelectorStyles as styles } from './daySelectorStyles';

type DotKind = 'today' | 'workout' | 'none';

type DaySelectorDayChipProps = {
  label: string;
  isSelected: boolean;
  dotKind: DotKind;
  onPress: () => void;
};

export function DaySelectorDayChip({
  label,
  isSelected,
  dotKind,
  onPress,
}: DaySelectorDayChipProps) {
  return (
    <TouchableOpacity
      style={[styles.dayItem, isSelected && styles.dayItemSelected]}
      onPress={onPress}
    >
      <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
        {label}
      </Text>
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
