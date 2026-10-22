import { Badge, SectionHeader, StandardLayout, Tag } from '@/src/components/ds';
import { TemperedDailyDayCard } from '@/src/components/temperedDaily/TemperedDailyDayCard';
import {
  DAY_LETTERS,
  formatTemperedDayLabel,
  TEMPERED_DAILY_NAME,
  TEMPERED_DAILY_NEW_WEEK_DROPS,
  TEMPERED_DAILY_RELEASE_COPY,
  TEMPERED_DAILY_TEASER_BODY,
  TEMPERED_DAILY_VIEW_SOURCE,
  TEMPERED_DAILY_WEEK_SUBTITLE,
  TEMPERED_DAILY_WEEK_TITLE,
} from '@/src/components/temperedDaily/temperedDailyConstants';
import { focusTagDisplayLabel } from '@/src/components/workouts/workoutsScreenConstants';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  getTemperedDailyWorkoutById,
  temperedDailyProgram,
} from '@/src/data/temperedDaily';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { TemperedDailyWeek } from '@/src/types/workouts';
import {
  getTemperedDailyToday,
  getTemperedDayDate,
} from '@/src/utils/temperedDaily';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const STATE_ICON_SIZE = 48;

function openWorkout(workoutId: string) {
  router.push(
    `/workout/${workoutId}?view_source=${TEMPERED_DAILY_VIEW_SOURCE}`
  );
}

function workoutForDay(week: TemperedDailyWeek, dayIndex: number) {
  const id = week.days[dayIndex];
  return id ? (getTemperedDailyWorkoutById(id) ?? null) : null;
}

export default function TemperedDailyWeekScreen() {
  const { isPro, isLoading: subscriptionLoading } = useSubscription();
  const { week, dayIndex: todayIndex } = getTemperedDailyToday(
    temperedDailyProgram,
    new Date()
  );
  const [selectedIndex, setSelectedIndex] = useState(todayIndex ?? 0);
  const showProBadge = !subscriptionLoading && !isPro;

  if (!week) {
    return (
      <StandardLayout
        title={TEMPERED_DAILY_WEEK_TITLE}
        subtitle={TEMPERED_DAILY_WEEK_SUBTITLE}
        onBackPress={() => router.back()}
        disableScroll
      >
        <StandardLayout.Body>
          <View style={styles.emptyState}>
            <Ionicons
              name="calendar-outline"
              size={STATE_ICON_SIZE}
              color={color.textTertiary}
            />
            <Text style={styles.emptyTitle} accessibilityRole="header">
              {TEMPERED_DAILY_NAME}
            </Text>
            <Text style={styles.emptyDescription}>
              {TEMPERED_DAILY_TEASER_BODY}
            </Text>
            <Text style={styles.dropLine}>{TEMPERED_DAILY_NEW_WEEK_DROPS}</Text>
          </View>
        </StandardLayout.Body>
      </StandardLayout>
    );
  }

  return (
    <StandardLayout
      title={TEMPERED_DAILY_WEEK_TITLE}
      subtitle={TEMPERED_DAILY_WEEK_SUBTITLE}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.sections}>
          <View style={styles.header}>
            <Text style={styles.overline}>
              {`${week.blockName} · ${week.phase}`}
            </Text>
            <Text style={styles.theme} accessibilityRole="header">
              {week.theme}
            </Text>
            <View style={styles.focusRow}>
              <Badge
                label={focusTagDisplayLabel(week.primaryFocus)}
                accessibilityLabel={`Primary focus, ${focusTagDisplayLabel(week.primaryFocus)}`}
              />
              {week.otherFocuses.map((tag) => (
                <Tag key={tag} label={focusTagDisplayLabel(tag)} />
              ))}
            </View>
            <Text style={styles.description}>{week.description}</Text>
            {todayIndex === null ? (
              <Text style={styles.dropLine}>
                {TEMPERED_DAILY_NEW_WEEK_DROPS}
              </Text>
            ) : null}
          </View>

          <View style={styles.daySection}>
            <View style={styles.dayRow} accessibilityRole="radiogroup">
              {DAY_LETTERS.map((letter, index) => {
                const isSelected = index === selectedIndex;
                const isToday = index === todayIndex;
                const dayLabel = formatTemperedDayLabel(
                  getTemperedDayDate(week, index)
                );
                return (
                  <Pressable
                    key={dayLabel}
                    onPress={() => setSelectedIndex(index)}
                    style={({ pressed }) => [
                      styles.dayButton,
                      isToday && styles.dayButtonToday,
                      pressed && !isSelected && styles.dayButtonPressed,
                      isSelected && styles.dayButtonSelected,
                    ]}
                    accessibilityRole="radio"
                    accessibilityLabel={
                      isToday ? `${dayLabel}, today` : dayLabel
                    }
                    accessibilityState={{ checked: isSelected }}
                  >
                    <Text
                      style={[
                        styles.dayLetter,
                        isToday && styles.dayLetterToday,
                        isSelected && styles.dayLetterSelected,
                      ]}
                    >
                      {letter}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <TemperedDailyDayCard
              dayLabel={formatTemperedDayLabel(
                getTemperedDayDate(week, selectedIndex)
              )}
              workout={workoutForDay(week, selectedIndex)}
              isToday={selectedIndex === todayIndex}
              showProBadge={showProBadge}
              onPress={openWorkout}
            />
          </View>

          <View style={styles.listSection}>
            <SectionHeader title="All this week" />
            {week.days.map((_, index) => {
              const dayLabel = formatTemperedDayLabel(
                getTemperedDayDate(week, index)
              );
              return (
                <TemperedDailyDayCard
                  key={dayLabel}
                  dayLabel={dayLabel}
                  workout={workoutForDay(week, index)}
                  isToday={index === todayIndex}
                  showProBadge={showProBadge}
                  onPress={openWorkout}
                />
              );
            })}
          </View>

          <View style={styles.footer}>
            {week.nextWeekFocus ? (
              <Text style={styles.footerText}>
                {'Next week’s focus: '}
                <Text style={styles.footerFocus}>{week.nextWeekFocus}</Text>
              </Text>
            ) : null}
            <Text style={styles.footerCaption}>
              {TEMPERED_DAILY_RELEASE_COPY}
            </Text>
          </View>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: space.lg,
    paddingBottom: space.xxl,
  },
  header: {
    gap: space.xs,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  theme: {
    ...typography.title1,
    color: color.gold,
  },
  focusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  description: {
    ...typography.body,
    color: color.textSecondary,
  },
  dropLine: {
    ...typography.calloutStrong,
    color: color.gold,
    textAlign: 'center',
  },
  daySection: {
    gap: space.sm,
  },
  dayRow: {
    flexDirection: 'row',
    padding: space.xxs,
    gap: space.xxs,
    backgroundColor: color.surface1,
    borderRadius: radius.pill,
    ...elevation.raised,
  },
  dayButton: {
    flex: 1,
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayButtonToday: {
    borderColor: color.gold,
  },
  dayButtonPressed: {
    backgroundColor: color.surface2,
  },
  dayButtonSelected: {
    backgroundColor: color.gold,
  },
  dayLetter: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  dayLetterToday: {
    color: color.gold,
  },
  dayLetterSelected: {
    color: color.onGold,
  },
  listSection: {
    gap: space.sm,
  },
  footer: {
    gap: space.xxs,
  },
  footerText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  footerFocus: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  footerCaption: {
    ...typography.caption,
    color: color.textTertiary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xxl,
    gap: space.xs,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },
});
