import { Card, SmallChevron } from '@/src/components/ds';
import { HubPromoCard } from '@/src/components/hub/HubPromoRow';
import { settingsScreenStyles as settingsStyles } from '@/src/components/settings/settingsScreenStyles';
import { StandardLayout } from '@/src/components/StandardLayout';
import { Colors, FontSize, Spacing, BorderRadius } from '@/src/constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useRoles } from '@/src/hooks/useRoles';
import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
    <StandardLayout
      title="You"
      subtitle="Records, trophies, and account"
    >
      <StandardLayout.Body>
        <View style={styles.list}>
          <Text style={styles.hiText}>
            {isCoach
              ? displayName
                ? `Hi, coach ${displayName}!`
                : 'Hi, coach!'
              : displayName
                ? `Hi, ${displayName}!`
                : 'Hi there!'}
          </Text>
          {!accessLoading && !isPro ? (
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

          {!accessLoading && !isCoach ? (
            <TouchableOpacity
              style={styles.coachPrompt}
              onPress={handleCoachPress}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={`Are you a coach? Message ${COACH_INSTAGRAM_HANDLE} on Instagram for free coach mode`}
            >
              <Text style={styles.coachEyebrow}>For coaches</Text>
              <Text style={styles.coachTitle}>Are you a coach?</Text>
              <Text style={styles.coachBody}>
                Reach out to Tempered Strength on Instagram{' '}
                <Text style={styles.coachHandle}>{COACH_INSTAGRAM_HANDLE}</Text>{' '}
                and we will upgrade you to coach mode for free.
              </Text>
              <Text style={styles.coachPerks}>
                Coach unlocks all Skill discipline workouts, the Skills & Cues
                explore section, and all mobility flows.
              </Text>
              <Text style={styles.coachCta}>
                Message {COACH_INSTAGRAM_HANDLE} →
              </Text>
            </TouchableOpacity>
          ) : null}
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
  coachPrompt: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    padding: Spacing.xxl,
    gap: Spacing.sm,
  },
  coachEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  coachTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: '800',
  },
  coachBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    fontWeight: '500',
  },
  coachHandle: {
    color: Colors.accent,
    fontWeight: '700',
  },
  coachPerks: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginTop: Spacing.xs,
  },
  coachCta: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
});
