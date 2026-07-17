import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { daySelectorStyles as styles } from './daySelectorStyles';

type DotKind = 'completed' | 'skipped' | 'workout' | 'none';

type DaySelectorDayChipProps = {
  label: string;
  subLabel?: string;
  isSelected: boolean;
  /** Calendar “today”: gold chip background; session dot is black on gold (WCAG). */
  isToday: boolean;
  dotKind: DotKind;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

export function DaySelectorDayChip({
  label,
  subLabel,
  isSelected,
  isToday,
  dotKind,
  onPress,
  onLayout,
}: DaySelectorDayChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.dayItem,
        isSelected && styles.dayItemSelected,
        isToday && styles.dayItemToday,
      ]}
      onPress={onPress}
      onLayout={onLayout}
      accessibilityRole="button"
      accessibilityLabel={`${label}${
        dotKind === 'completed'
          ? ', completed'
          : dotKind === 'skipped'
            ? ', skipped'
            : ''
      }`}
    >
      <Text
        style={[
          styles.dayLabel,
          isSelected && !isToday && styles.dayLabelSelected,
          isToday && styles.dayLabelOnToday,
        ]}
      >
        {label}
      </Text>
      {!!subLabel && (
        <Text
          style={[
            styles.daySubLabel,
            isSelected && !isToday && styles.daySubLabelSelected,
            isToday && styles.daySubLabelOnToday,
          ]}
        >
          {subLabel}
        </Text>
      )}
      <View
        style={[
          styles.dot,
          dotKind === 'completed'
            ? styles.dotCompleted
            : dotKind === 'skipped'
              ? styles.dotSkipped
              : dotKind === 'workout'
                ? isToday
                  ? styles.dotWorkoutToday
                  : styles.dotWorkoutOnDarkSurface
                : styles.dotPlaceholder,
        ]}
      />
    </TouchableOpacity>
  );
}
