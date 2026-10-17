import { color } from '@/src/constants/tokens';
import {
  CAL_DAY_LABELS,
  weekKeysStartingFrom,
} from '@/src/screens/programLauncherConstants';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import { programAnchorFullWeekdayName } from '@/src/utils/programStartWeekday';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  DAY_ITEM_ICON_SIZE,
  programLauncherStyles as styles,
} from './programLauncherStyles';

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
    <View style={styles.weekdayPicker}>
      <Text style={styles.workoutDaysHint}>
        Tap a day to change it. You need exactly {sessionsRequired} training
        days before you can start. Days are ordered from your program start day
        {lockedWeekday
          ? ` (${programAnchorFullWeekdayName(lockedWeekday)})`
          : ''}
        .
      </Text>
      {!weekdaySelectionReady && (
        <View
          style={styles.weekdaySelectionHintRow}
          accessible
          accessibilityLiveRegion="polite"
        >
          <Ionicons
            name="alert-circle-outline"
            size={18}
            color={color.warning}
          />
          <Text style={styles.weekdaySelectionHint}>
            Select exactly {sessionsRequired} days ({selectedWeekdays.length}{' '}
            selected).
          </Text>
        </View>
      )}
      <View style={styles.daysSplitContainer}>
        {orderedKeys.map((key) => {
          const selected = selectedWeekdays.includes(key);
          const locked = lockedWeekday === key;
          return (
            <Pressable
              key={key}
              style={({ pressed }) => [
                styles.dayItem,
                pressed && styles.dayItemPressed,
                selected && styles.dayItemSelected,
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
              <View style={styles.dayIconSlot}>
                {locked ? (
                  <Ionicons
                    name="lock-closed"
                    size={DAY_ITEM_ICON_SIZE}
                    color={color.gold}
                  />
                ) : selected ? (
                  <Ionicons
                    name="checkmark"
                    size={DAY_ITEM_ICON_SIZE}
                    color={color.gold}
                  />
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
