import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type PatchNote = {
  version: string;
  dateLabel: string;
  articleUrl?: string;
  notes: string[];
};

const PATCH_NOTES: PatchNote[] = [
  {
    version: '1.9.0',
    dateLabel: '24 Apr 2026',
    articleUrl: 'https://temperedstrength.com/patch-notes/1.9.0',
    notes: [
      'Refactored all exercises with correct logging types',
      'Added three logging types: Reps, Reps & Weight, and Time',
      'New reps exercise UI with optional weight tracking',
      'Added +15s / −15s buttons to the rest timer',
      'Rest timer now closes automatically at the end of a set',
      'Two new settings: Auto Timers and PB Detection toggle',
      'General UI spacing improvements',
      'Added patch notes into the app settings',
    ],
  },
  {
    version: '1.8.2',
    dateLabel: '20 Apr 2026',
    notes: [
      'Brief is now loaded from tempered strength API',
      'Fix: Copy notes now works with legacy structure',
    ],
  },
  {
    version: '1.8.1',
    dateLabel: '17 Apr 2026',
    notes: [
      'Added categories, difficulties and filters to programs',
      'Improved filters throughout',
      "LB's Support",
      'Copy notes from past sessions',
      'Export workout as text',
      'Fix sketchy article saving bug',
    ],
  },
  {
    version: '1.7.0',
    dateLabel: '15 Apr 2026',
    notes: [
      'Logging & Personal Bests added',
      'Remove set as today’s session as the logic was confusing and needs rethinking',
      'Placed rest timer under the globally session timer?',
      'Start session button padding added',
      'Rebuild the Articles and Brief section to link through to web and be better to use',
    ],
  },
  {
    version: '1.6.0',
    dateLabel: '10 Apr 2026',
    notes: [
      'iCloud data sync! no more lost data',
      'You can now select a program start date in the past',
      'Change program removed in favour of end program',
      'Settings renamed to accounts',
      'Full project refactor to improve app performance',
      'If your pro subscription ends mid way through pro program, we no longer clear your data, we allow you to hold it until you resub to prevent data loss',
    ],
  },
  {
    version: '1.5.0',
    dateLabel: '10 Apr 2026',
    notes: [
      'Implementation of Awards complete',
      'Removed the soundtracks',
      'Added Mikkos triangle workout to pro options',
      'Made it more obvious you can click pro to view details on launcher page',
      'Improved program launcher UX',
      'Updated Pro Powerbuilding average session time',
      'Fixed Notes bug where you cannot close notes keyboard',
      'Continued refactor and tidy of codebase',
    ],
  },
  {
    version: '1.4.0',
    dateLabel: '01 Apr 2026',
    notes: [
      'You can now log scores against your workouts to track performance over time.',
      "Swapped exercises now match both movement pattern and muscle group. You'll also see a match quality indicator so you know how close the swap is.",
    ],
  },
  {
    version: '1.3.0',
    dateLabel: '29 Mar 2026',
    notes: [
      'Added the new pro powerbuilding PRO program',
      'Updated 3 day split to be 45m average',
      'Pick which days your program runs on!',
    ],
  },
  {
    version: '1.2.0',
    dateLabel: '27 Mar 2026',
    notes: [
      'Session timer added, plus post-workout stats to review your performance.',
      'Exercise descriptions now include fallback text for swapped or missing exercises, so you’ll always see helpful guidance.',
      'Spelling and terminology updated to British English throughout the app.',
      'Exercise library expanded with new additions, including sit-ups.',
      'Improved in-app RPE guidance to help you better understand training intensity and self-regulate effort.',
    ],
  },
  {
    version: '1.1.0',
    dateLabel: '25 Mar 2026',
    notes: [
      'You no longer have to end your program to view the other available programs',
      'Added a restart button to the timer',
      'Timers now trigger a push notification',
    ],
  },
  {
    version: '1.0.1',
    dateLabel: '18 Mar 2026',
    notes: ['Implement subscriptions'],
  },
];

export default function PatchNotesScreen() {
  const [openVersions, setOpenVersions] = useState<Set<string>>(
    () => new Set([PATCH_NOTES[0]?.version].filter(Boolean))
  );

  const openVersionsArr = useMemo(() => Array.from(openVersions), [openVersions]);

  const toggle = (version: string) => {
    setOpenVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patch Notes</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>
          See what’s new in the latest versions of Tempered Strength.
        </Text>

        <View style={styles.sectionList}>
          {PATCH_NOTES.map((p) => {
            const isOpen = openVersions.has(p.version);
            return (
              <View key={p.version} style={styles.card}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => toggle(p.version)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle patch notes for version ${p.version}`}
                  accessibilityState={{ expanded: isOpen }}
                >
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.versionText}>{p.version}</Text>
                    <Text style={styles.dateText}>{p.dateLabel}</Text>
                  </View>
                  <Ionicons
                    name={isOpen ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>

                {isOpen ? (
                  <View style={styles.cardBody}>
                    {p.articleUrl ? (
                      <TouchableOpacity onPress={() => Linking.openURL(p.articleUrl as string)}>
                        <Text style={styles.articleUrlText}>View article on website</Text>
                      </TouchableOpacity>
                    ) : null}
                    {p.notes.map((n, idx) => (
                      <View key={`${p.version}-${idx}`} style={styles.noteRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.noteText}>{n}</Text>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>

        {openVersionsArr.length === 0 ? (
          <Text style={styles.hintText}>
            Tip: tap a version to expand its notes.
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  sectionList: {
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xl,
  },
  cardHeaderLeft: {
    flex: 1,
    gap: Spacing.xs,
  },
  versionText: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  dateText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  cardBody: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.accent,
    marginTop: 7,
  },
  noteText: {
    flex: 1,
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '500',
    lineHeight: 20,
  },
  articleUrlText: {
    textDecorationLine: 'underline',
    color: Colors.accent,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
  hintText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.base,
    fontWeight: '500',
  },
});

