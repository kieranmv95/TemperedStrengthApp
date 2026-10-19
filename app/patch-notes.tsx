import { ActionChip, Collapsible, StandardLayout } from '@/src/components/ds';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

const BULLET_SIZE = 6;

type PatchNote = {
  version: string;
  dateLabel: string;
  articleUrl?: string;
  notes: string[];
};

const PATCH_NOTES: PatchNote[] = [
  {
    version: '3.2.1',
    dateLabel: '19th October 2026',
    notes: [
      'Refreshed the look across the app',
      'Clearer set logging, including reordering sets',
      'Rest days are easier to scan',
      'Removed Discover search',
    ],
  },
  {
    version: '3.2.0',
    dateLabel: '',
    notes: ['Behaviour and supplement tracking'],
  },
  {
    version: '3.1.0',
    dateLabel: '31st August 2026',
    notes: [
      'Skills section',
      'New collab workouts added',
      'Program rest days',
      'UI fixes',
    ],
  },
  {
    version: '3.0.0',
    dateLabel: '05th August 2026',
    notes: ['Improved database sync', 'Enhanced shop UI'],
  },
  {
    version: '2.14.1',
    dateLabel: '26th July 2026',
    notes: ['OTP countdown fixed', 'Collab images fixed'],
  },
  {
    version: '2.14.0',
    dateLabel: '22nd July 2026',
    notes: ['Accounts'],
  },
  {
    version: '2.13.0',
    dateLabel: '17th July 2026',
    notes: [
      'Start programs on any day of the week',
      'Mark days as complete or skipped',
      'Removed the start session',
      'Promo redemption',
    ],
  },
  {
    version: '2.12.0',
    dateLabel: '13th July 2026',
    notes: [
      'Competition banner support added',
      'Wendler 5/3/1 (3-Day) program added',
    ],
  },
  {
    version: '2.11.0',
    dateLabel: '15th July 2026',
    notes: [
      'Clubs, coaches and PTs have landed',
      'Workouts review, top to bottom',
    ],
  },
  {
    version: '2.10.0',
    dateLabel: '25th June 2026',
    notes: ['Clubs, coaches and PTs have landed', 'bug fix for score logging'],
  },
  {
    version: '2.9.0',
    dateLabel: '18th June 2026',
    notes: ['Redesigned the entire app navigation and flow'],
  },
  {
    version: '2.8.0',
    dateLabel: 'N/A',
    notes: [
      'Recovery flows added to the hub',
      'Workouts section UI improvements',
      'Data integrity improvements',
      'Fixed swap modal video bug',
    ],
  },
  {
    version: '2.7.1',
    dateLabel: '04th June 2026',
    notes: [
      'Workouts filter by equipment added',
      'Added 24 new workouts to the pro programs',
      'Sort by option added to workouts screen',
      'Improved the workouts filters selected UI',
    ],
  },
  {
    version: '2.7.0',
    dateLabel: '28th May 2026',
    notes: ['Video support'],
  },
  {
    version: '2.6.0',
    dateLabel: '1st June 2026',
    notes: [
      'Improved best single / latest single display on exercise cards',
      'Improved streak card display',
      'Added a 1RM estimator tool',
      'Added a 1RM breakdown tool',
      'Added a creatine dose tool',
      'Added a water intake tool',
    ],
  },
  {
    version: '2.5.1',
    dateLabel: '22nd May 2026',
    notes: [
      'Together we lift charity added.',
      'Android support added',
      'OTA update support added',
      'Switched video player',
    ],
  },
  {
    version: '2.5.0',
    dateLabel: '20th May 2026',
    notes: ['Improved ALL of our workouts', 'Added the SHOP!'],
  },
  {
    version: '2.4.1',
    dateLabel: '15th May 2026',
    notes: [
      'Fixed a bug where the sync was intermittently failing with streaks',
    ],
  },
  {
    version: '2.4.0',
    dateLabel: '15th May 2026',
    notes: [
      'Streaks added',
      'Progress bar added to program',
      'Sweeping UI changes / fixes / enhancements',
      'Fixed a bug where the pro gate was not being respected on awards',
    ],
  },
  {
    version: '2.3.2',
    dateLabel: '12th May 2026',
    notes: ['Sweeping UI changes / fixes / enhancements'],
  },
  {
    version: '2.3.1',
    dateLabel: '12th May 2026',
    notes: [
      'Day selector visual improvements',
      'Improved Olympic Foundations & Advanced Olympic Performance programs',
    ],
  },
  {
    version: '2.3.0',
    dateLabel: '14th May 2026',
    notes: [
      'Added a suite of rainhill trials workouts',
      'Improved the pro banner to reduce flickering',
    ],
    articleUrl: 'https://temperedstrength.com/patch-notes/2.3.0',
  },
  {
    version: '2.2.0',
    dateLabel: '07 May 2026',
    notes: [
      'Added rainhill trials workouts',
      'Added support for multi-difficulty workouts',
      'Fixed day switch bug',
      'Added prompt to finish workout',
    ],
  },
  {
    version: '2.1.0',
    dateLabel: '05 May 2026',
    notes: [
      'Added moving sessions support to the programs',
      'Improved sliding calendar UI',
      'Moved start session button away from being a sticky header',
      'Improve notes behaviour and reversed order',
      'Added a new disciplines section to the workouts screen',
      'Tidied up workouts filters and tags',
      'Created home screen welcome strip and improved program launcher',
      'Added tracking links for new features',
      'Added 18 new pilates workouts',
    ],
    articleUrl: 'https://temperedstrength.com/patch-notes/2.1.0',
  },
  {
    version: '2.0.2',
    dateLabel: '05 May 2026',
    notes: [
      'Analytics tracking implemented',
      'Program starting in X screen improved',
    ],
  },
  {
    version: '2.0.1',
    dateLabel: '30 Apr 2026',
    notes: [
      'Program starting in X screen improved',
      'Rest day screen improved',
      'Program completed screen improved',
      'Program starting in X screen improved',
      'Updated the app icon to be more consistent with the brand',
      '50 new standalone workouts added: 40 Free + 10 Pro',
      'Big focus on Hyrox and CrossFit-style benchmark workouts',
      'Partner workouts added, plus a new Partner filter',
      'Workouts filters improved: curated sections now stay visible under filters (when they have matches), and filter counts update dynamically',
    ],
  },
  {
    version: '2.0.0',
    dateLabel: '03 Jul 2026',
    notes: [
      'New onboarding flow to capture name, gender preferences, interests, and key settings up front',
      'More guided first experience with better defaults and a more personal app experience',
      'Hybrid & Conditioning upgrades with new workout blocks (Tabata, AMRAP, For Time, and more)',
      'New HIIT-focused content with 5 new HIIT-style workouts',
      'Preference-based workout sections so sessions better match what you care about',
      'Smarter program discovery: programs ordered and recommended based on your onboarding answers',
      '4 new programs added: DB+KB Bootcamp (Pro), HIIT Shred (Free), HIIT Shred (Pro), and Pilates Intro (Free)',
      'Account section refresh with clearer categorised settings to reduce clutter',
      'Re-onboarding enabled so you can redo onboarding and update preferences anytime',
      'Friendlier account greeting with “Hi, your name!” in the Account area',
    ],
  },
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
      'Brief is now loaded from the Tempered Strength API',
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
      'Program setting to hide the “Start Session” button',
    ],
  },
  {
    version: '1.7.0',
    dateLabel: '15 Apr 2026',
    notes: [
      'Logging & Personal Bests added',
      'Remove set as today’s session as the logic was confusing and needs rethinking',
      'Placed rest timer under the global session timer',
      'Start session button padding added',
      'Rebuild the Articles and Brief section to link through to web and be better to use',
    ],
  },
  {
    version: '1.6.0',
    dateLabel: '10 Apr 2026',
    notes: [
      'Early cloud data sync support',
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

  const openVersionsArr = useMemo(
    () => Array.from(openVersions),
    [openVersions]
  );

  const toggle = (version: string) => {
    setOpenVersions((prev) => {
      const next = new Set(prev);
      if (next.has(version)) next.delete(version);
      else next.add(version);
      return next;
    });
  };

  return (
    <StandardLayout
      title="Patch notes"
      subtitle="See what’s new in the latest versions of Tempered Strength."
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.sectionList}>
          {PATCH_NOTES.map((p) => {
            const isOpen = openVersions.has(p.version);
            return (
              <Collapsible
                key={p.version}
                title={p.version}
                expanded={isOpen}
                onToggle={() => toggle(p.version)}
                accessory={
                  p.dateLabel ? (
                    <Text style={styles.dateText}>{p.dateLabel}</Text>
                  ) : null
                }
                accessibilityLabel={
                  p.dateLabel
                    ? `Version ${p.version}, ${p.dateLabel}`
                    : `Version ${p.version}`
                }
              >
                {p.articleUrl ? (
                  <ActionChip
                    label="View article on website"
                    icon="open-outline"
                    tone="neutral"
                    onPress={() => Linking.openURL(p.articleUrl as string)}
                    accessibilityHint="Opens in your browser"
                  />
                ) : null}
                {p.notes.map((n, idx) => (
                  <View key={`${p.version}-${idx}`} style={styles.noteRow}>
                    <View style={styles.bullet} />
                    <Text style={styles.noteText}>{n}</Text>
                  </View>
                ))}
              </Collapsible>
            );
          })}
        </View>

        {openVersionsArr.length === 0 ? (
          <Text style={styles.hintText}>
            Tip: tap a version to expand its notes.
          </Text>
        ) : null}
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  sectionList: {
    gap: space.sm,
  },
  dateText: {
    ...typography.caption,
    color: color.textTertiary,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  bullet: {
    width: BULLET_SIZE,
    height: BULLET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.textTertiary,
    marginTop: (typography.callout.lineHeight - BULLET_SIZE) / 2,
  },
  noteText: {
    ...typography.callout,
    flex: 1,
    color: color.textSecondary,
  },
  hintText: {
    ...typography.caption,
    color: color.textTertiary,
    marginTop: space.md,
  },
});
