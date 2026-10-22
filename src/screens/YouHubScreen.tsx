import { Badge, PressableCard, StandardLayout } from '@/src/components/ds';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
import { settingsScreenStyles as settingsStyles } from '@/src/components/settings/settingsScreenStyles';
import { color, space, typography } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { useRoles } from '@/src/hooks/useRoles';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { useFocusEffect, router } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

const COACH_INSTAGRAM_URL = 'https://www.instagram.com/temperedstrength/';
const COACH_INSTAGRAM_HANDLE = '@temperedstrength';

export function YouHubScreen() {
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();
  const { roles, isLoading: rolesLoading } = useRoles();
  const { profile } = useOnboardingProfile();
  const displayName = profile?.name;
  const accessLoading = subscriptionLoading || rolesLoading;
  const isCoach = roles.includes(COACH_ROLE);

  useFocusEffect(
    React.useCallback(() => {
      if (tryConsumeSubscriptionRefreshCooldown()) {
        void refresh();
      }
    }, [refresh])
  );

  const handleCoachPress = () => {
    Linking.openURL(COACH_INSTAGRAM_URL).catch((error) => {
      console.error('Failed to open Instagram URL:', error);
    });
  };

  return (
    <StandardLayout title="You" subtitle="Records, trophies, and account">
      <StandardLayout.Body>
        <View style={styles.list}>
          <Text style={styles.hiText}>
            {isCoach
              ? displayName
                ? `Hi, Coach ${displayName}!`
                : 'Hi, Coach!'
              : displayName
                ? `Hi, ${displayName}!`
                : 'Hi there!'}
          </Text>
          {!accessLoading && !isPro ? (
            <PressableCard
              onPress={() => router.push('/paywall')}
              accessibilityLabel="Upgrade to Tempered Strength Pro, free tier"
              accessibilityHint="Opens subscription plans"
            >
              <View style={styles.upgradeContent}>
                <View style={styles.upgradeTitleRow}>
                  <Text style={settingsStyles.upgradePromptTitle}>
                    Upgrade to Pro
                  </Text>
                  <Badge label="Free tier" tone="neutral" />
                </View>
                <Text style={settingsStyles.upgradePromptBody}>
                  Go Pro to unlock all workouts, programs, recovery flows,
                  awards, unlimited exercise swaps and more.
                </Text>
                <Text style={settingsStyles.upgradePromptCta}>See plans</Text>
              </View>
            </PressableCard>
          ) : null}

          <View style={styles.promoStack}>
            <HubPromoCard
              icon="barbell-outline"
              eyebrow="Records"
              title="Personal bests"
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
            <HubPromoCard
              icon="person-outline"
              eyebrow="Account"
              title="Account & settings"
              description="Weight units, program preferences, and patch notes."
              onPress={() => router.push('/records/account')}
              accessibilityLabel="Open account and settings"
            />
          </View>

          {!accessLoading && !isCoach ? (
            <PressableCard
              onPress={handleCoachPress}
              accessibilityLabel={`Are you a coach? Message ${COACH_INSTAGRAM_HANDLE} on Instagram for free coach mode`}
              accessibilityHint="Opens Instagram"
            >
              <View style={styles.coachContent}>
                <Text style={styles.coachEyebrow}>For coaches</Text>
                <Text style={styles.coachTitle}>Are you a coach?</Text>
                <Text style={styles.coachBody}>
                  Reach out to Tempered Strength on Instagram{' '}
                  <Text style={styles.coachHandle}>
                    {COACH_INSTAGRAM_HANDLE}
                  </Text>{' '}
                  and we will upgrade you to coach mode for free.
                </Text>
                <Text style={styles.coachPerks}>
                  Coach unlocks all Skill discipline workouts, the Skills & Cues
                  explore section, and all mobility flows.
                </Text>
                <Text style={styles.coachCta}>
                  Message {COACH_INSTAGRAM_HANDLE}
                </Text>
              </View>
            </PressableCard>
          ) : null}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: space.lg,
  },
  hiText: {
    ...typography.title2,
    color: color.textPrimary,
  },
  upgradeContent: {
    gap: space.xs,
  },
  upgradeTitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  promoStack: {
    gap: space.sm,
  },
  coachContent: {
    gap: space.xs,
  },
  coachEyebrow: {
    ...typography.overline,
    color: color.textTertiary,
  },
  coachTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  coachBody: {
    ...typography.callout,
    color: color.textSecondary,
  },
  coachHandle: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  coachPerks: {
    ...typography.callout,
    color: color.textTertiary,
  },
  coachCta: {
    ...typography.calloutStrong,
    color: color.gold,
    marginTop: space.xxs,
  },
});
