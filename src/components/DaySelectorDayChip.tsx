import { color } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { Pressable, Text, View } from 'react-native';
import {
  STATUS_ICON_SIZE,
  daySelectorStyles as styles,
} from './daySelectorStyles';

export type DotKind = 'completed' | 'skipped' | 'workout' | 'none';

type DaySelectorDayChipProps = {
  /** Short weekday, e.g. "Mon". Replaced by "Today" on the current day. */
  weekday: string;
  dayOfMonth: number;
  /** Spoken date, e.g. "Monday 6th". */
  accessibleDate: string;
  isSelected: boolean;
  isToday: boolean;
  dotKind: DotKind;
  onPress: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const STATUS_DESCRIPTION: Record<DotKind, string> = {
  completed: ', completed',
  skipped: ', skipped',
  workout: ', session scheduled',
  none: ', rest day',
};

function StatusMark({ dotKind }: { dotKind: DotKind }) {
  if (dotKind === 'completed') {
    return (
      <Ionicons
        name="checkmark"
        size={STATUS_ICON_SIZE}
        color={color.success}
      />
    );
  }
  if (dotKind === 'skipped') {
    return (
      <Ionicons name="close" size={STATUS_ICON_SIZE} color={color.danger} />
    );
  }
  if (dotKind === 'workout') {
    return <View style={styles.scheduledDot} />;
  }
  return null;
}

export function DaySelectorDayChip({
  weekday,
  dayOfMonth,
  accessibleDate,
  isSelected,
  isToday,
  dotKind,
  onPress,
  onLayout,
}: DaySelectorDayChipProps) {
  return (
    <Pressable
      style={styles.dayItem}
      onPress={onPress}
      onLayout={onLayout}
      accessibilityRole="button"
      accessibilityLabel={`${accessibleDate}${isToday ? ', today' : ''}${
        STATUS_DESCRIPTION[dotKind]
      }`}
      accessibilityState={{ selected: isSelected }}
    >
      <Text
        style={[
          styles.weekday,
          isToday && styles.weekdayToday,
          isSelected && !isToday && styles.weekdaySelected,
        ]}
      >
        {isToday ? 'Today' : weekday}
      </Text>
      <Text
        style={[styles.dayOfMonth, isSelected && styles.dayOfMonthSelected]}
      >
        {dayOfMonth}
      </Text>
      <View style={styles.statusSlot}>
        <StatusMark dotKind={dotKind} />
      </View>
    </Pressable>
  );
}
