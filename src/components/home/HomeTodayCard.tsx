import {
  AnimatedNumber,
  PressableCard,
  ProgressBar,
} from '@/src/components/ds';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  formatHomeProgramSessionMeta,
  type HomeProgramSummary,
} from '@/src/utils/homeProgramSummary';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type HomeTodayCardProps = {
  summary: HomeProgramSummary | null;
  onPress: () => void;
};

const REST_DAY_LABEL = 'Rest Day';

/** The Home hero: today's session (or rest day) on the active program. */
export function HomeTodayCard({ summary, onPress }: HomeTodayCardProps) {
  if (!summary) {
    return (
      <PressableCard
        variant="hero"
        onPress={onPress}
        accessibilityLabel="Pick a program"
        accessibilityHint="Opens the Program tab to choose a program"
      >
        <Text style={styles.overline}>Program</Text>
        <Text style={styles.title}>Pick a program</Text>
        <Text style={styles.body}>
          Choose one on the Program tab and today’s session will show up here.
        </Text>
      </PressableCard>
    );
  }

  const isRestDay = summary.todaySessionLabel === REST_DAY_LABEL;
  const isTrainingDay =
    !isRestDay && !summary.awaitingProgramStart && !summary.programCompleted;
  const sessionLabel = isRestDay ? 'Rest day' : summary.todaySessionLabel;
  const meta = formatHomeProgramSessionMeta({
    sessionsCompleted: summary.sessionsCompleted,
    sessionsSkipped: summary.sessionsSkipped,
    sessionsRemaining: summary.sessionsRemaining,
  });
  const sessionsLeftLabel =
    summary.sessionsRemaining === 1 ? 'session left' : 'sessions left';

  return (
    <PressableCard
      variant="hero"
      onPress={onPress}
      showChevron={false}
      accessibilityLabel={`${summary.programName}, ${sessionLabel}, ${meta}`}
      accessibilityHint="Opens the Program tab"
    >
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.overline}>Today</Text>
          <Text style={styles.title}>{sessionLabel}</Text>
          <Text style={styles.body}>{summary.programName}</Text>
        </View>

        <View style={styles.countRow}>
          <AnimatedNumber
            value={summary.sessionsRemaining}
            style={styles.count}
          />
          <Text style={styles.countLabel}>{sessionsLeftLabel}</Text>
        </View>

        <ProgressBar
          progress={summary.calendarSessionSpanProgress}
          accessibilityLabel="Program progress"
          accessibilityValueText={meta}
        />

        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            {isTrainingDay ? 'Go to today’s session' : 'Go to program'}
          </Text>
        </View>
      </View>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: space.sm,
  },
  heading: {
    gap: space.xxs,
  },
  overline: {
    ...typography.overline,
    color: color.gold,
  },
  title: {
    ...typography.title1,
    color: color.textPrimary,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.xs,
  },
  count: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  countLabel: {
    ...typography.callout,
    color: color.textSecondary,
  },
  cta: {
    alignSelf: 'flex-start',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  ctaText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
