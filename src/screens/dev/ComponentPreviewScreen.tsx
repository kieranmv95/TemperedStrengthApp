import { PreviewHeader } from '@/src/components/dev/PreviewHeader';
import { PreviewSection } from '@/src/components/dev/PreviewSection';
import {
  ActionChip,
  AppSafeAreaView,
  AppScrollView,
  Badge,
  FilterChip,
  PressableCard,
  SectionHeader,
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

export function ComponentPreviewScreen() {
  const [lastAction, setLastAction] = useState('Nothing yet');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([
    'Strength',
  ]);

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
});
