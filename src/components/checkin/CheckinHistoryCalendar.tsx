import {
  CALENDAR_MARK_SIZE,
  checkinStyles as styles,
} from '@/src/components/checkin/checkinStyles';
import { color } from '@/src/constants/tokens';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

/** Indexed by `Date.getDay()` (0 = Sunday). */
const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

type CheckinHistoryCalendarProps = {
  /** Visible month as `YYYY-MM`. */
  month: string;
  /** ISO weekday the grid starts on (1 = Monday … 7 = Sunday). */
  weekStartsOn: number;
  today: string;
  /** Dates with at least one behaviour entry or supplement log. */
  markedDates: readonly string[];
  selectedDate: string | null;
  onChangeMonth: (month: string) => void;
  onSelectDate: (date: string) => void;
};

type CalendarCell =
  { kind: 'pad' } | { kind: 'day'; day: number; date: string };

function parseMonth(month: string): { year: number; monthIndex: number } {
  const [ys, ms] = month.split('-');
  return { year: Number(ys), monthIndex: Number(ms) - 1 };
}

function formatMonth(year: number, monthIndex: number): string {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
}

function buildCells(
  year: number,
  monthIndex: number,
  weekStartsOn: number
): CalendarCell[] {
  const startJsDay = weekStartsOn % 7;
  const firstJsDay = new Date(year, monthIndex, 1).getDay();
  const startPad = (firstJsDay - startJsDay + 7) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = 0; i < startPad; i++) {
    cells.push({ kind: 'pad' });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({
      kind: 'day',
      day,
      date: `${formatMonth(year, monthIndex)}-${String(day).padStart(2, '0')}`,
    });
  }
  const endPad = (7 - (cells.length % 7)) % 7;
  for (let i = 0; i < endPad; i++) {
    cells.push({ kind: 'pad' });
  }
  return cells;
}

function dayAccessibilityLabel(input: {
  year: number;
  monthIndex: number;
  day: number;
  isToday: boolean;
  hasData: boolean;
}): string {
  const parts = [
    new Date(input.year, input.monthIndex, input.day).toLocaleDateString(
      undefined,
      { weekday: 'long', day: 'numeric', month: 'long' }
    ),
  ];
  if (input.isToday) {
    parts.push('today');
  }
  parts.push(input.hasData ? 'has check-in' : 'no check-in');
  return parts.join(', ');
}

export function CheckinHistoryCalendar({
  month,
  weekStartsOn,
  today,
  markedDates,
  selectedDate,
  onChangeMonth,
  onSelectDate,
}: CheckinHistoryCalendarProps) {
  const { year, monthIndex } = parseMonth(month);
  const cells = buildCells(year, monthIndex, weekStartsOn);
  const marked = new Set(markedDates);
  const monthTitle = new Date(year, monthIndex, 1).toLocaleString(undefined, {
    month: 'long',
    year: 'numeric',
  });
  const canGoNext = month < today.slice(0, 7);

  const goPrevMonth = () => {
    onChangeMonth(
      monthIndex === 0
        ? formatMonth(year - 1, 11)
        : formatMonth(year, monthIndex - 1)
    );
  };

  const goNextMonth = () => {
    if (!canGoNext) {
      return;
    }
    onChangeMonth(
      monthIndex === 11
        ? formatMonth(year + 1, 0)
        : formatMonth(year, monthIndex + 1)
    );
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.calendarMonthRow}>
        <Pressable
          style={({ pressed }) => [
            styles.calendarMonthNav,
            pressed && styles.calendarMonthNavPressed,
          ]}
          onPress={goPrevMonth}
          accessibilityRole="button"
          accessibilityLabel="Previous month"
        >
          <Ionicons name="chevron-back" size={22} color={color.textPrimary} />
        </Pressable>
        <Text style={styles.calendarMonthTitle} accessibilityRole="header">
          {monthTitle}
        </Text>
        <Pressable
          style={({ pressed }) => [
            styles.calendarMonthNav,
            pressed && canGoNext && styles.calendarMonthNavPressed,
          ]}
          onPress={goNextMonth}
          disabled={!canGoNext}
          accessibilityRole="button"
          accessibilityLabel="Next month"
          accessibilityState={{ disabled: !canGoNext }}
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={canGoNext ? color.textPrimary : color.textDisabled}
          />
        </Pressable>
      </View>

      <View
        style={styles.calendarWeekdayRow}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        {WEEKDAY_LABELS.map((_, index) => (
          <View key={index} style={styles.calendarWeekdayCell}>
            <Text style={styles.calendarWeekdayText}>
              {WEEKDAY_LABELS[(weekStartsOn + index) % 7]}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.calendarGrid}>
        {cells.map((cell, index) => {
          if (cell.kind === 'pad') {
            return <View key={`pad-${index}`} style={styles.calendarDayCell} />;
          }

          const isFuture = cell.date > today;
          const isSelected = cell.date === selectedDate;
          const isToday = cell.date === today;
          const hasData = marked.has(cell.date);

          return (
            <View key={cell.date} style={styles.calendarDayCell}>
              <Pressable
                style={({ pressed }) => [
                  styles.calendarDayInner,
                  pressed && !isSelected && styles.calendarDayInnerPressed,
                  isToday && !isSelected && styles.calendarDayInnerToday,
                  isSelected && styles.calendarDayInnerSelected,
                ]}
                onPress={() => onSelectDate(cell.date)}
                disabled={isFuture}
                accessibilityRole="button"
                accessibilityLabel={dayAccessibilityLabel({
                  year,
                  monthIndex,
                  day: cell.day,
                  isToday,
                  hasData,
                })}
                accessibilityState={{
                  selected: isSelected,
                  disabled: isFuture,
                }}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    isFuture && styles.calendarDayTextMuted,
                    isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {cell.day}
                </Text>
                {hasData ? (
                  <Ionicons
                    name="checkmark"
                    size={CALENDAR_MARK_SIZE}
                    color={isSelected ? color.onGold : color.gold}
                  />
                ) : (
                  <View style={styles.calendarMarkSpacer} />
                )}
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
}
