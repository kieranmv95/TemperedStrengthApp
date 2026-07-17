import {
  CAL_DAY_LABELS,
  weekKeysStartingFrom,
} from '@/src/screens/programLauncherConstants';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { programAnchorFullWeekdayName } from '@/src/utils/programStartWeekday';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherWeekdayPickerProps = {
  sessionsRequired: number;
  selectedWeekdays: ProgramDaySplitKey[];
  weekdayOrder?: ProgramDaySplitKey[];
  lockedWeekday?: ProgramDaySplitKey | null;
  weekdaySelectionReady: boolean;
  onToggleWeekday: (key: ProgramDaySplitKey) => void;
};

export function ProgramLauncherWeekdayPicker({
  sessionsRequired,
  selectedWeekdays,
  weekdayOrder,
  lockedWeekday = null,
  weekdaySelectionReady,
  onToggleWeekday,
}: ProgramLauncherWeekdayPickerProps) {
  const orderedKeys =
    weekdayOrder ?? weekKeysStartingFrom(lockedWeekday ?? 'mon');

  return (
    <View>
      <View style={styles.workoutDaysTitleBlock}>
        <Text style={styles.workoutTitle}>Workout Days (tap to change)</Text>
        <Text style={styles.workoutDaysHint}>
          You need exactly {sessionsRequired} training days before you can
          start. Days are ordered from your program start day
          {lockedWeekday
            ? ` (${programAnchorFullWeekdayName(lockedWeekday)})`
            : ''}
          .
        </Text>
      </View>
      {!weekdaySelectionReady && (
        <Text style={styles.weekdaySelectionHint}>
          Select exactly {sessionsRequired} days ({selectedWeekdays.length}{' '}
          selected).
        </Text>
      )}
      <View style={styles.daysSplitContainer}>
        {orderedKeys.map((key) => {
          const selected = selectedWeekdays.includes(key);
          const locked = lockedWeekday === key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.dayItem,
                selected && styles.dayItemSelected,
                locked && styles.dayItemLocked,
              ]}
              onPress={() => {
                if (locked) return;
                onToggleWeekday(key);
              }}
              disabled={locked}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected, disabled: locked }}
              accessibilityLabel={`${programAnchorFullWeekdayName(key)} training day${locked ? ', program start day' : ''}`}
            >
              <Text
                style={[styles.dayLabel, selected && styles.dayLabelSelected]}
              >
                {CAL_DAY_LABELS[key]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
