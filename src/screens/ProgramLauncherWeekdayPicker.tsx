import {
  CALENDAR_DAY_KEYS,
  CAL_DAY_LABELS,
} from '@/src/screens/programLauncherConstants';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { programAnchorFullWeekdayName } from '@/src/utils/programStartWeekday';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { programLauncherStyles as styles } from './programLauncherStyles';

type ProgramLauncherWeekdayPickerProps = {
  sessionsRequired: number;
  selectedWeekdays: ProgramDaySplitKey[];
  weekdaySelectionReady: boolean;
  onToggleWeekday: (key: ProgramDaySplitKey) => void;
};

export function ProgramLauncherWeekdayPicker({
  sessionsRequired,
  selectedWeekdays,
  weekdaySelectionReady,
  onToggleWeekday,
}: ProgramLauncherWeekdayPickerProps) {
  return (
    <View>
      <View style={styles.workoutDaysTitleBlock}>
        <Text style={styles.workoutTitle}>Workout Days (tap to change)</Text>
        <Text style={styles.workoutDaysHint}>
          You need exactly {sessionsRequired} training days before you can
          start. Tap the days below to fit your scehdule
        </Text>
      </View>
      {!weekdaySelectionReady && (
        <Text style={styles.weekdaySelectionHint}>
          Select exactly {sessionsRequired} days ({selectedWeekdays.length}{' '}
          selected).
        </Text>
      )}
      <View style={styles.daysSplitContainer}>
        {CALENDAR_DAY_KEYS.map((key) => {
          const selected = selectedWeekdays.includes(key);
          return (
            <TouchableOpacity
              key={key}
              style={[styles.dayItem, selected && styles.dayItemSelected]}
              onPress={() => onToggleWeekday(key)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${programAnchorFullWeekdayName(key)} training day`}
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
