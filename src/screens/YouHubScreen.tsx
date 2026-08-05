import { Card, SmallChevron } from '@/src/components/ds';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
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
      subtitle="Records, trophies, and account"
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

          <View style={styles.promoStack}>
            <HubPromoCard
              icon="barbell-outline"
              eyebrow="Records"
              title="Personal Bests"
              description="View and manage your personal records by exercise."
              onPress={() => router.push('/records/personal-bests')}
              accessibilityLabel="Open personal bests"
            />
            <HubPromoCard
              icon="trophy-outline"
              eyebrow="Achievements"
              title="Trophies"
              description="Track awards and milestones across your training."
              onPress={() => router.push('/records/trophies')}
              accessibilityLabel="Open trophies"
            />
          </View>

          <Card
            onPress={() => router.push('/records/account')}
            accessibilityLabel="Open account and settings"
          >
            <View style={styles.accountIconWrap}>
              <Ionicons
                name="person-outline"
                size={18}
                color={Colors.textMuted}
              />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.accountTitle}>Account & Settings</Text>
              <Text style={styles.cardDescription}>
                Weight units, program preferences, and patch notes.
              </Text>
            </View>
            <SmallChevron />
          </Card>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.xxl,
  },
  hiText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
  },
  promoStack: {
    gap: Spacing.md,
  },
  accountIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundElevated,
  },
  cardContent: {
    flex: 1,
    paddingRight: Spacing.xl,
    gap: Spacing.xs,
  },
  accountTitle: {
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
