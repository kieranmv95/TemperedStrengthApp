import { Badge, Tag } from '@/src/components/ds';
import { focusTagDisplayLabel } from '@/src/components/workouts/workoutsScreenConstants';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { TemperedDailyWeek } from '@/src/types/workouts';
import { parseLocalDate } from '@/src/utils/temperedDaily';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  TEMPERED_DAILY_LOCKED_BENEFITS,
  TEMPERED_DAILY_LOCKED_BENEFITS_TITLE,
  TEMPERED_DAILY_LOCKED_CTA,
  TEMPERED_DAILY_NAME,
} from './temperedDailyConstants';

type TemperedDailyComingSoonProps = {
  week: TemperedDailyWeek;
  /** Free users get the upgrade button. Pro users already have access. */
  showUnlock: boolean;
  onUnlock: () => void;
};

function ordinalDay(day: number): string {
  const mod100 = day % 100;
  if (mod100 >= 11 && mod100 <= 13) {
    return `${day}th`;
  }
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** Launch preview shown until the first Tempered Daily week opens. */
export function TemperedDailyComingSoon({
  week,
  showUnlock,
  onUnlock,
}: TemperedDailyComingSoonProps) {
  const start = parseLocalDate(week.weekStart);
  const month = start.toLocaleDateString('en-GB', { month: 'long' });
  const weekday = start.toLocaleDateString('en-GB', { weekday: 'long' });
  const dateLabel = `${ordinalDay(start.getDate())} ${month}`;

  return (
    <View style={styles.sections}>
      <View
        style={styles.hero}
        accessible
        accessibilityRole="header"
        accessibilityLabel={`${TEMPERED_DAILY_NAME}, Pro feature. Week one, ${week.theme}. Opens ${weekday} ${dateLabel}, 00:01.`}
      >
        <View style={styles.heroWash} />
        <View style={styles.heroTop}>
          <Text style={styles.heroOverline}>{TEMPERED_DAILY_NAME}</Text>
          <Badge label="PRO" accessibilityLabel="Pro feature" />
        </View>
        <View style={styles.dateBlock}>
          <Text style={styles.dateLabel}>{dateLabel}</Text>
          <Text style={styles.dateWhen}>{`${weekday} · 00:01`}</Text>
        </View>
        <Text style={styles.theme}>{week.theme}</Text>
        <Text style={styles.blockLine}>
          {`${week.blockName} · ${week.phase}`}
        </Text>
      </View>

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

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>
          {TEMPERED_DAILY_LOCKED_BENEFITS_TITLE}
        </Text>
        {TEMPERED_DAILY_LOCKED_BENEFITS.map((benefit) => (
          <View key={benefit} style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={18} color={color.gold} />
            <Text style={styles.benefitText}>{benefit}</Text>
          </View>
        ))}
      </View>

      {showUnlock ? (
        <Pressable
          style={({ pressed }) => [
            styles.unlock,
            pressed && styles.unlockPressed,
          ]}
          onPress={onUnlock}
          accessibilityRole="button"
          accessibilityLabel={TEMPERED_DAILY_LOCKED_CTA}
          accessibilityHint="Opens the Pro upgrade screen"
        >
          <Text style={styles.unlockText}>{TEMPERED_DAILY_LOCKED_CTA}</Text>
          <Ionicons name="chevron-forward" size={18} color={color.onGold} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  sections: {
    gap: space.lg,
    paddingBottom: space.xxl,
  },
  hero: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.lg,
    gap: space.sm,
    overflow: 'hidden',
  },
  heroWash: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.goldTint,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroOverline: {
    ...typography.overline,
    color: color.gold,
  },
  dateBlock: {
    gap: space.xxs,
  },
  dateLabel: {
    ...typography.title2,
    color: color.textPrimary,
  },
  dateWhen: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  theme: {
    ...typography.title1,
    color: color.gold,
  },
  blockLine: {
    ...typography.callout,
    color: color.textPrimary,
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
  benefits: {
    gap: space.sm,
  },
  benefitsTitle: {
    ...typography.overline,
    color: color.textTertiary,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.xs,
  },
  benefitText: {
    ...typography.callout,
    color: color.textPrimary,
    flex: 1,
  },
  unlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  unlockPressed: {
    backgroundColor: color.goldStrong,
  },
  unlockText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
