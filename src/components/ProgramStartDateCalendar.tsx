import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';
import {
  normalizeToLocalMidnight,
  programSplitKeyToJsDay,
} from '@/src/utils/programStartWeekday';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

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
        <TouchableOpacity
          onPress={goPrevMonth}
          style={[styles.monthNavHit, !canGoPrev && styles.monthNavDisabled]}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
          accessibilityState={{ disabled: !canGoPrev }}
          disabled={!canGoPrev}
        >
          <Text style={styles.monthNavText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{monthTitle}</Text>
        <TouchableOpacity
          onPress={goNextMonth}
          style={styles.monthNavHit}
          accessibilityRole="button"
          accessibilityLabel="Next month"
        >
          <Text style={styles.monthNavText}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekdayRow}>
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

          if (!isAllowed) {
            return (
              <View key={`d-${cell.day}`} style={styles.dayCell}>
                <View style={[styles.dayInner, styles.dayInnerDisabled]}>
                  <Text style={styles.dayTextDisabled}>{cell.day}</Text>
                </View>
              </View>
            );
          }

          return (
            <View key={`d-${cell.day}`} style={styles.dayCell}>
              <TouchableOpacity
                onPress={() => onChange(cellDate)}
                style={[styles.dayInner, selected && styles.dayInnerSelected]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${cell.day}, select program start date`}
              >
                <Text
                  style={[styles.dayText, selected && styles.dayTextSelected]}
                >
                  {cell.day}
                </Text>
              </TouchableOpacity>
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
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xxl,
  },
  monthNavHit: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavDisabled: {
    opacity: 0.35,
  },
  monthNavText: {
    color: Colors.accent,
    fontSize: FontSize.displayLg,
    fontWeight: '600',
  },
  monthTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    padding: 2,
    minHeight: 40,
  },
  dayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
  },
  dayInnerDisabled: {
    opacity: 0.35,
  },
  dayInnerSelected: {
    backgroundColor: Colors.accent,
  },
  dayText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  dayTextDisabled: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  dayTextSelected: {
    color: Colors.textOnAccent,
  },
});
