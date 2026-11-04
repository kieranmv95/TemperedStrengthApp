import { Badge, SectionHeader, Tag } from '@/src/components/ds';
import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import type { SingleWorkout, TemperedDailyWeek } from '@/src/types/workouts';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import {
  getTemperedDailyWorkoutLabels,
  TEMPERED_DAILY_LOCKED_BENEFITS,
  TEMPERED_DAILY_LOCKED_BENEFITS_TITLE,
  TEMPERED_DAILY_LOCKED_BODY,
  TEMPERED_DAILY_LOCKED_CTA,
  TEMPERED_DAILY_LOCKED_INSIDE,
  TEMPERED_DAILY_LOCKED_TITLE,
  TEMPERED_DAILY_NAME,
  TEMPERED_DAILY_VIEW_WEEK,
} from './temperedDailyConstants';

type TemperedDailyLockedUpsellProps = {
  workout: SingleWorkout;
  /** The week this workout belongs to; null hides the week details. */
  week: TemperedDailyWeek | null;
  onUnlock: () => void;
  onViewWeek: () => void;
};

type BlockPreview = {
  name: string;
  optional: boolean;
};

/** Block names from the first scale, so free users see the shape of the session. */
function getBlockPreview(workout: SingleWorkout): BlockPreview[] {
  const preview: BlockPreview[] = [];
  for (const item of workout.blocks) {
    if ('scale' in item) {
      for (const block of item.blocks) {
        preview.push({ name: block.name, optional: !!block.optional });
      }
      break;
    }
    preview.push({ name: item.name, optional: !!item.optional });
  }
  return preview;
}

/** Locked state for Tempered Daily workouts, shown to free users. */
export function TemperedDailyLockedUpsell({
  workout,
  week,
  onUnlock,
  onViewWeek,
}: TemperedDailyLockedUpsellProps) {
  const labels = getTemperedDailyWorkoutLabels(workout);
  const blocks = getBlockPreview(workout);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Text style={styles.overline}>{TEMPERED_DAILY_NAME}</Text>
          <Badge label="PRO" accessibilityLabel="Pro feature" />
        </View>
        <Text style={styles.heroTitle} accessibilityRole="header">
          {TEMPERED_DAILY_LOCKED_TITLE}
        </Text>
        <Text style={styles.heroBody}>{TEMPERED_DAILY_LOCKED_BODY}</Text>
      </View>

      <View style={styles.card}>
        {week ? (
          <Text style={styles.weekLine}>
            {`${week.blockName} · `}
            <Text style={styles.weekTheme}>{week.theme}</Text>
            {` · ${week.phase}`}
          </Text>
        ) : null}
        <Text style={styles.workoutTitle}>{workout.title}</Text>
        <Text style={styles.description}>{workout.description}</Text>
        <View style={styles.metaRow}>
          <View style={styles.time}>
            <Ionicons
              name="time-outline"
              size={16}
              color={color.textSecondary}
            />
            <Text style={styles.timeText}>{workout.estimatedTime} min</Text>
          </View>
          {labels.map((label) => (
            <Tag key={label} label={label} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title={TEMPERED_DAILY_LOCKED_INSIDE} />
        <View style={styles.list}>
          {blocks.map((block, index) => (
            <View key={`${index}-${block.name}`} style={styles.blockRow}>
              <Ionicons
                name="lock-closed"
                size={14}
                color={color.textTertiary}
              />
              <Text style={styles.blockName}>{block.name}</Text>
              {block.optional ? (
                <Badge label="Optional" tone="neutral" />
              ) : null}
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title={TEMPERED_DAILY_LOCKED_BENEFITS_TITLE} />
        <View style={styles.list}>
          {TEMPERED_DAILY_LOCKED_BENEFITS.map((benefit) => (
            <View key={benefit} style={styles.benefitRow}>
              <Ionicons name="checkmark-circle" size={18} color={color.gold} />
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryCta,
            pressed && styles.primaryCtaPressed,
          ]}
          onPress={onUnlock}
          accessibilityRole="button"
          accessibilityLabel={TEMPERED_DAILY_LOCKED_CTA}
          accessibilityHint="Opens the Pro upgrade screen"
        >
          <Text style={styles.primaryCtaText}>{TEMPERED_DAILY_LOCKED_CTA}</Text>
          <Ionicons name="chevron-forward" size={18} color={color.onGold} />
        </Pressable>
        {week ? (
          <Pressable
            style={({ pressed }) => [
              styles.secondaryCta,
              pressed && styles.secondaryCtaPressed,
            ]}
            onPress={onViewWeek}
            accessibilityRole="button"
            accessibilityLabel={TEMPERED_DAILY_VIEW_WEEK}
            accessibilityHint={`Opens this week's ${TEMPERED_DAILY_NAME} workouts`}
          >
            <Text style={styles.secondaryCtaText}>
              {TEMPERED_DAILY_VIEW_WEEK}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.md,
    paddingTop: space.xs,
    paddingBottom: space.xxl,
    gap: space.lg,
  },
  hero: {
    gap: space.xs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  overline: {
    ...typography.overline,
    color: color.gold,
  },
  heroTitle: {
    ...typography.title1,
    color: color.textPrimary,
  },
  heroBody: {
    ...typography.body,
    color: color.textSecondary,
  },
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  weekLine: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  weekTheme: {
    color: color.gold,
  },
  workoutTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  description: {
    ...typography.callout,
    color: color.textSecondary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  timeText: {
    ...typography.captionStrong,
    fontVariant: ['tabular-nums'],
    color: color.textSecondary,
  },
  section: {
    gap: space.sm,
  },
  list: {
    gap: space.sm,
  },
  blockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  blockName: {
    ...typography.callout,
    color: color.textPrimary,
    flexShrink: 1,
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
  actions: {
    gap: space.sm,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  primaryCtaPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryCtaText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  secondaryCta: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryCtaPressed: {
    backgroundColor: color.surface3,
  },
  secondaryCtaText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
});
