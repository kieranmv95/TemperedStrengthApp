import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  normalizeToLocalMidnight,
  programSplitKeyToJsDay,
} from '@/src/utils/programStartWeekday';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const DAY_CELL_GUTTER = 2;
const MONTH_NAV_ICON_SIZE = 22;

type ProgramStartDateCalendarProps = {
  value: Date;
  onChange: (date: Date) => void;
  /** Start date may fall on any of these weekdays (local). */
  allowedWeekdays: ProgramDaySplitKey[];
};

function sameLocalCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export const ProgramStartDateCalendar: React.FC<
  ProgramStartDateCalendarProps
> = ({ value, onChange, allowedWeekdays }) => {
  const normalizedValue = useMemo(
    () => normalizeToLocalMidnight(value),
    [value]
  );

  const [visibleMonth, setVisibleMonth] = useState(() => {
    const v = normalizeToLocalMidnight(value);
    return new Date(v.getFullYear(), v.getMonth(), 1);
  });

  useEffect(() => {
    const v = normalizeToLocalMidnight(value);
    setVisibleMonth(new Date(v.getFullYear(), v.getMonth(), 1));
  }, [value]);

  const allowedJsDays = useMemo(
    () => new Set(allowedWeekdays.map((k) => programSplitKeyToJsDay(k))),
    [allowedWeekdays]
  );

  const { year, month, cells } = useMemo(() => {
    const y = visibleMonth.getFullYear();
    const m = visibleMonth.getMonth();
    const first = new Date(y, m, 1);
    const startPad = first.getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const items: ({ kind: 'pad' } | { kind: 'day'; day: number })[] = [];
    for (let i = 0; i < startPad; i++) {
      items.push({ kind: 'pad' });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      items.push({ kind: 'day', day: d });
    }
    const total = items.length;
    const endPad = (7 - (total % 7)) % 7;
    for (let i = 0; i < endPad; i++) {
      items.push({ kind: 'pad' });
    }
    return { year: y, month: m, cells: items };
  }, [visibleMonth]);

  const monthTitle = useMemo(() => {
    return visibleMonth.toLocaleString(undefined, {
      month: 'long',
      year: 'numeric',
    });
  }, [visibleMonth]);

  const canGoPrev = true;

  const goPrevMonth = () => {
    if (!canGoPrev) return;
    setVisibleMonth(new Date(year, month - 1, 1));
  };

  const goNextMonth = () => {
    setVisibleMonth(new Date(year, month + 1, 1));
  };

  return (
    <View style={styles.root}>
      <View style={styles.monthRow}>
        <Pressable
          onPress={goPrevMonth}
          style={({ pressed }) => [
            styles.monthNavHit,
            pressed && styles.monthNavPressed,
            !canGoPrev && styles.monthNavDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityState={{ disabled: !canGoPrev }}
          disabled={!canGoPrev}
        >
          <Ionicons
            name="chevron-back"
            size={MONTH_NAV_ICON_SIZE}
            color={color.textPrimary}
          />
        </Pressable>
        <Text
          style={styles.monthTitle}
          accessibilityRole="header"
          accessibilityLiveRegion="polite"
        >
          {monthTitle}
        </Text>
        <Pressable
          onPress={goNextMonth}
          style={({ pressed }) => [
            styles.monthNavHit,
            pressed && styles.monthNavPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Ionicons
            name="chevron-forward"
            size={MONTH_NAV_ICON_SIZE}
            color={color.textPrimary}
          />
        </Pressable>
      </View>

      <View
        style={styles.weekdayRow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {WEEKDAY_LABELS.map((label, i) => (
          <View key={i} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => {
          if (cell.kind === 'pad') {
            return <View key={`pad-${index}`} style={styles.dayCell} />;
          }

          const cellDate = new Date(year, month, cell.day);
          cellDate.setHours(0, 0, 0, 0);
          const isAllowed =
            allowedJsDays.size > 0 && allowedJsDays.has(cellDate.getDay());
          const selected = sameLocalCalendarDay(cellDate, normalizedValue);
          const dateLabel = cellDate.toLocaleDateString(undefined, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          });

          if (!isAllowed) {
            return (
              <View key={`d-${cell.day}`} style={styles.dayCell}>
                <View
                  style={styles.dayInner}
                  accessible
                  accessibilityLabel={`${dateLabel}, not available`}
                  accessibilityState={{ disabled: true }}
                >
                  <Text style={styles.dayTextDisabled}>{cell.day}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={`d-${cell.day}`} style={styles.dayCell}>
              <Pressable
                onPress={() => onChange(cellDate)}
                style={({ pressed }) => [
                  styles.dayInner,
                  pressed && styles.dayInnerPressed,
                  selected && styles.dayInnerSelected,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${dateLabel}, select program start date`}
              >
                <Text
                  style={[styles.dayText, selected && styles.dayTextSelected]}
                >
                  {cell.day}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.sm,
  },
  monthNavHit: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavPressed: {
    backgroundColor: color.surface3,
  },
  monthNavDisabled: {
    opacity: 0.6,
  },
  monthTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: space.xxs,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    padding: DAY_CELL_GUTTER,
    minHeight: MIN_TARGET_SIZE + DAY_CELL_GUTTER * 2,
  },
  dayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  dayInnerPressed: {
    backgroundColor: color.surface3,
  },
  dayInnerSelected: {
    backgroundColor: color.gold,
  },
  dayText: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  dayTextDisabled: {
    ...typography.numericSmall,
    color: color.textDisabled,
  },
  dayTextSelected: {
    color: color.onGold,
  },
});
