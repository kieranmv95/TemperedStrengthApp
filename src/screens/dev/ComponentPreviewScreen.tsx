import { DemoSetLogger } from '@/src/components/dev/DemoSetLogger';
import { PreviewHeader } from '@/src/components/dev/PreviewHeader';
import { PreviewSection } from '@/src/components/dev/PreviewSection';
import {
  ActionChip,
  AnimatedNumber,
  AppSafeAreaView,
  AppScrollView,
  Badge,
  Collapsible,
  FilterChip,
  PressableCard,
  ProgressBar,
  ProgressRing,
  SectionHeader,
  Skeleton,
  Tag,
} from '@/src/components/ds';
import { color, space, typography } from '@/src/constants/tokens';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DEMO_FILTERS = [
  { label: 'Strength', count: 22 },
  { label: 'Hyrox', count: 9 },
  { label: 'Conditioning', count: 31 },
  { label: 'Favourites', count: 4 },
] as const;

/** Partner colour from the CMS; decorative edge only. */
const DEMO_PARTNER_ACCENT = '#7EC8E3';

const DEMO_TOTAL_SESSIONS = 16;

function formatKilograms(value: number): string {
  return `${value.toLocaleString('en-GB')} kg`;
}

export function ComponentPreviewScreen() {
  const [lastAction, setLastAction] = useState('Nothing yet');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'Strength',
  ]);
  const [warmupExpanded, setWarmupExpanded] = useState(false);
  const [sessionsComplete, setSessionsComplete] = useState(6);
  const [volume, setVolume] = useState(12340);
  const [showSkeletons, setShowSkeletons] = useState(true);

  const sessionsLeft = DEMO_TOTAL_SESSIONS - sessionsComplete;

  const changeSessions = (delta: number) => {
    setSessionsComplete((prev) =>
      Math.min(DEMO_TOTAL_SESSIONS, Math.max(0, prev + delta))
    );
  };

  const toggleFilter = (label: string) => {
    setSelectedFilters((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <AppSafeAreaView style={styles.screen}>
      <AppScrollView contentContainerStyle={styles.content}>
        <PreviewHeader
          title="Components"
          subtitle={`Last action: ${lastAction}`}
        />

        <PreviewSection title="PressableCard">
          <PressableCard
            variant="hero"
            onPress={() => setLastAction('Hero card')}
            accessibilityLabel="Advanced Olympic Performance, Rest day, 10 sessions left"
          >
            <Text style={styles.overline}>Today</Text>
            <Text style={styles.cardTitle}>Advanced Olympic Performance</Text>
            <Text style={styles.cardBody}>Rest day · 10 sessions left</Text>
          </PressableCard>
          <PressableCard
            onPress={() => setLastAction('Default card')}
            accessibilityLabel="Just fancy a workout? Strength sessions and mobility flows"
          >
            <Text style={styles.overline}>Open workouts</Text>
            <Text style={styles.cardTitle}>Just fancy a workout?</Text>
            <Text style={styles.cardBody}>
              Strength sessions and mobility flows outside a program.
            </Text>
          </PressableCard>
          <PressableCard
            variant="promo"
            accentColor={DEMO_PARTNER_ACCENT}
            onPress={() => setLastAction('Promo card')}
            accessibilityLabel="Partner, Prep Pal Meals, meal prep tailored to your goals"
          >
            <Text style={styles.overline}>Partner</Text>
            <Text style={styles.cardTitle}>Prep Pal Meals</Text>
            <Text style={styles.cardBody} numberOfLines={2}>
              Meal prep tailored to your goals, whether you’re building muscle
              or staying lean.
            </Text>
          </PressableCard>
        </PreviewSection>

        <PreviewSection title="FilterChip">
          <View style={styles.chipRow}>
            {DEMO_FILTERS.map((filter) => (
              <FilterChip
                key={filter.label}
                label={filter.label}
                count={filter.count}
                selected={selectedFilters.includes(filter.label)}
                onPress={() => toggleFilter(filter.label)}
                accessibilityLabel={`${filter.label}, ${filter.count} workouts`}
                icon={filter.label === 'Favourites' ? 'heart' : undefined}
              />
            ))}
          </View>
        </PreviewSection>

        <PreviewSection title="ActionChip">
          <View style={styles.chipRow}>
            <ActionChip
              label="How to perform"
              icon="play-circle"
              tone="info"
              onPress={() => setLastAction('How to perform')}
              accessibilityLabel="How to perform, Snatch"
            />
            <ActionChip
              label="Swap"
              icon="swap-horizontal"
              tone="gold"
              onPress={() => setLastAction('Swap')}
            />
            <ActionChip
              label="Notes"
              icon="create-outline"
              tone="neutral"
              onPress={() => setLastAction('Notes')}
            />
          </View>
        </PreviewSection>

        <PreviewSection title="Tag and Badge">
          <View style={styles.chipRow}>
            <Tag label="Gymnastics" />
            <Tag label="Week 4" />
            <Badge label="PRO" accessibilityLabel="Pro" />
            <Badge label="Advanced" tone="neutral" />
          </View>
        </PreviewSection>

        <PreviewSection title="Collapsible">
          <Collapsible
            title="Clean & jerk warm-up"
            expanded={warmupExpanded}
            onToggle={() => setWarmupExpanded((prev) => !prev)}
            accessory={<Badge label="3 drills" tone="neutral" />}
            accessibilityLabel="Clean and jerk warm-up, 3 drills"
          >
            <Text style={styles.cardBody}>Empty bar × 10 tall cleans</Text>
            <Text style={styles.cardBody}>Muscle clean × 5</Text>
            <Text style={styles.cardBody}>Push press × 5</Text>
          </Collapsible>
        </PreviewSection>

        <PreviewSection title="Progress and numbers">
          <ProgressBar
            progress={sessionsComplete / DEMO_TOTAL_SESSIONS}
            accessibilityLabel="Program progress"
            accessibilityValueText={`${sessionsComplete} of ${DEMO_TOTAL_SESSIONS} sessions complete`}
          />
          <View style={styles.numberRow}>
            <ProgressRing
              progress={sessionsComplete / DEMO_TOTAL_SESSIONS}
              size={88}
              accessibilityLabel="Program progress"
              accessibilityValueText={`${sessionsComplete} of ${DEMO_TOTAL_SESSIONS} sessions complete`}
            >
              <AnimatedNumber
                value={sessionsComplete}
                style={styles.ringNumber}
              />
            </ProgressRing>
            <View style={styles.numberColumn}>
              <AnimatedNumber
                value={sessionsLeft}
                style={styles.bigNumber}
                accessibilityLabel={`${sessionsLeft} sessions left`}
              />
              <Text style={styles.cardBody}>sessions left</Text>
              <AnimatedNumber
                value={volume}
                format={formatKilograms}
                style={styles.mediumNumber}
                animateOnMount
              />
            </View>
          </View>
          <View style={styles.chipRow}>
            <ActionChip
              label="Session −1"
              icon="remove"
              tone="neutral"
              onPress={() => changeSessions(-1)}
              accessibilityLabel="One fewer session complete"
            />
            <ActionChip
              label="Session +1"
              icon="add"
              tone="neutral"
              onPress={() => changeSessions(1)}
              accessibilityLabel="One more session complete"
            />
            <ActionChip
              label="Volume +250"
              icon="barbell-outline"
              tone="gold"
              onPress={() => setVolume((prev) => prev + 250)}
            />
          </View>
        </PreviewSection>

        <PreviewSection title="Set logging">
          <Text style={styles.cardBody}>
            The next set to log expands with steppers. Long-press −/+ to repeat.
            The check needs reps first.
          </Text>
          <DemoSetLogger />
        </PreviewSection>

        <PreviewSection title="Skeleton">
          {showSkeletons ? (
            <View style={styles.skeletonGroup}>
              <Skeleton
                width="100%"
                height={96}
                radius="md"
                accessibilityLabel="Loading skills"
              />
              <View style={styles.skeletonRow}>
                <Skeleton width={72} height={72} />
                <Skeleton width={72} height={72} />
                <Skeleton width={72} height={72} />
              </View>
              <Skeleton width="60%" height={16} />
            </View>
          ) : (
            <Text style={styles.cardBody}>Content loaded.</Text>
          )}
          <ActionChip
            label={showSkeletons ? 'Finish loading' : 'Show skeletons'}
            icon="refresh"
            tone="neutral"
            onPress={() => setShowSkeletons((prev) => !prev)}
          />
        </PreviewSection>

        <PreviewSection title="SectionHeader">
          <SectionHeader title="Session actions" />
          <SectionHeader
            title="Tools"
            actionLabel="See all"
            onActionPress={() => setLastAction('See all tools')}
            actionAccessibilityLabel="See all tools"
          />
        </PreviewSection>
      </AppScrollView>
    </AppSafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: color.bg,
  },
  content: {
    paddingHorizontal: space.md,
    paddingBottom: space.jumbo,
    gap: space.xxl,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  overline: {
    ...typography.overline,
    color: color.gold,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
    marginTop: space.xxs,
  },
  cardBody: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  numberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
  },
  numberColumn: {
    flex: 1,
  },
  ringNumber: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  bigNumber: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  mediumNumber: {
    ...typography.numericMedium,
    color: color.gold,
    marginTop: space.xs,
  },
  skeletonGroup: {
    gap: space.sm,
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: space.xs,
  },
});
