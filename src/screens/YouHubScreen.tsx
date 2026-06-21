import { Card, SmallChevron } from '@/src/components/ds';
import { settingsScreenStyles as settingsStyles } from '@/src/components/settings/settingsScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HubDestination = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  route: '/records/account' | '/records/personal-bests' | '/records/trophies';
  accessibilityLabel: string;
};

const DESTINATIONS: HubDestination[] = [
  {
    title: 'Account & Settings',
    description:
      'Weight units, program preferences, and patch notes.',
    icon: 'person-outline',
    route: '/records/account',
    accessibilityLabel: 'Open account and settings',
  },
  {
    title: 'Personal Bests',
    description: 'View and manage your personal records by exercise.',
    icon: 'barbell-outline',
    route: '/records/personal-bests',
    accessibilityLabel: 'Open personal bests',
  },
  {
    title: 'Trophies',
    description: 'Track achievements and milestones across your training.',
    icon: 'trophy-outline',
    route: '/records/trophies',
    accessibilityLabel: 'Open trophies',
  },
];

export function YouHubScreen() {
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();
  const { profile } = useOnboardingProfile();
  const displayName = profile?.name;

  useFocusEffect(
    React.useCallback(() => {
      if (tryConsumeSubscriptionRefreshCooldown()) {
        void refresh();
      }
    }, [refresh])
  );

  return (
    <StandardLayout
      title="You"
      subtitle="Account, personal bests, and trophies"
    >
      <StandardLayout.Body>
        <View style={styles.list}>
          <Text style={styles.hiText}>
            Hi{displayName ? `, ${displayName}` : ' there'}!
          </Text>
          {!subscriptionLoading && !isPro ? (
            <TouchableOpacity
              style={settingsStyles.upgradePrompt}
              onPress={() => router.push('/paywall')}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Upgrade to Tempered Strength Pro. Opens subscription plans"
            >
              <Text style={settingsStyles.upgradePromptTitle}>
                Upgrade to Pro
              </Text>
              <Text style={settingsStyles.upgradePromptBody}>
                Go Pro to unlock. All workouts, programs, recovery flows,
                awards, unlimited exercise swaps and more.
              </Text>
              <Text style={settingsStyles.upgradePromptCta}>See plans →</Text>
            </TouchableOpacity>
          ) : null}
          {DESTINATIONS.map((destination) => (
            <Card
              key={destination.route}
              onPress={() => router.push(destination.route)}
              accessibilityLabel={destination.accessibilityLabel}
            >
              <View style={styles.cardContent}>
                <View style={styles.titleRow}>
                  <Ionicons
                    name={destination.icon}
                    size={18}
                    color={Colors.accent}
                  />
                  <Text style={styles.cardTitle}>{destination.title}</Text>
                </View>
                <Text style={styles.cardDescription}>
                  {destination.description}
                </Text>
              </View>
              <SmallChevron />
            </Card>
          ))}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  hiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.md,
  },
  hiText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
  },
  hiSubtext: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  list: {
    gap: Spacing.xl,
  },
  cardContent: {
    flex: 1,
    paddingRight: Spacing.xl,
    gap: Spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  cardDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
});
