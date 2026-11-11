import { Badge, PressableCard, StandardLayout } from '@/src/components/ds';
import { settingsScreenStyles as settingsStyles } from '@/src/components/settings/settingsScreenStyles';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useLargeText } from '@/src/hooks/useLargeText';
import { useOnboardingProfile } from '@/src/hooks/useOnboardingProfile';
import { useRoles } from '@/src/hooks/useRoles';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { COACH_ROLE } from '@/src/utils/workoutAccess';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';

const COACH_INSTAGRAM_URL = 'https://www.instagram.com/temperedstrength/';
const COACH_INSTAGRAM_HANDLE = '@temperedstrength';

const ACCOUNT_ICON_WELL = 40;
const STATEMENT_ICON_SIZE = 72;

function youGreeting(
  isCoach: boolean,
  displayName: string | undefined
): string {
  if (isCoach) {
    return displayName ? `Hi, Coach ${displayName}!` : 'Hi, Coach!';
  }
  return displayName ? `Hi, ${displayName}!` : 'Hi there!';
}

type YouStatementTileProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  accessibilityLabel: string;
  onPress: () => void;
  /** Stretch to match the other tile. Off when large text stacks the row. */
  fill: boolean;
};

function YouStatementTile({
  icon,
  title,
  accessibilityLabel,
  onPress,
  fill,
}: YouStatementTileProps) {
  return (
    <PressableCard
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      variant="hero"
      showChevron={false}
      fill={fill}
      style={fill ? styles.statementFill : undefined}
    >
      <View style={[styles.statementBody, fill && styles.statementBodyFill]}>
        <Text style={styles.statementTitle}>{title}</Text>
        <View
          style={[styles.statementIconWrap, !fill && styles.statementIconStart]}
        >
          <Ionicons name={icon} size={STATEMENT_ICON_SIZE} color={color.gold} />
        </View>
      </View>
    </PressableCard>
  );
}

export function YouHubScreen() {
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();
  const { roles, isLoading: rolesLoading } = useRoles();
  const { profile } = useOnboardingProfile();
  const largeText = useLargeText();
  const displayName = profile?.name;
  const accessLoading = subscriptionLoading || rolesLoading;
  const isCoach = roles.includes(COACH_ROLE);
  const greeting = youGreeting(isCoach, displayName);

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
          <PressableCard
            onPress={() => router.push('/records/account')}
            accessibilityLabel={`${greeting}. Account and settings. Weight units, program preferences, and patch notes.`}
            accessibilityHint="Opens account and settings"
          >
            <View style={styles.accountRow}>
              <View style={styles.accountIcon}>
                <Ionicons name="person" size={22} color={color.gold} />
              </View>
              <View style={styles.accountText}>
                <Text style={styles.accountGreeting}>{greeting}</Text>
                <Text style={styles.accountSubtitle}>Account & settings</Text>
              </View>
            </View>
          </PressableCard>

          <View style={[styles.featureRow, largeText && styles.featureStacked]}>
            <View style={largeText ? undefined : styles.featureTile}>
              <YouStatementTile
                icon="trophy-outline"
                title="Trophies"
                accessibilityLabel="Trophies. Track awards and milestones across your training."
                onPress={() => router.push('/records/trophies')}
                fill={!largeText}
              />
            </View>
            <View style={largeText ? undefined : styles.featureTile}>
              <YouStatementTile
                icon="barbell-outline"
                title="PBs"
                accessibilityLabel="Personal bests. View and manage your personal records by exercise."
                onPress={() => router.push('/records/personal-bests')}
                fill={!largeText}
              />
            </View>
          </View>

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
                  Go Pro to unlock all Daily programming, workouts, programs,
                  recovery flows, awards, unlimited exercise swaps and more.
                </Text>
                <Text style={settingsStyles.upgradePromptCta}>See plans</Text>
              </View>
            </PressableCard>
          ) : null}

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
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  accountIcon: {
    width: ACCOUNT_ICON_WELL,
    height: ACCOUNT_ICON_WELL,
    borderRadius: radius.sm,
    backgroundColor: color.goldTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  accountGreeting: {
    ...typography.title2,
    color: color.textPrimary,
  },
  accountSubtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: space.sm,
  },
  featureStacked: {
    flexDirection: 'column',
  },
  featureTile: {
    flex: 1,
  },
  statementFill: {
    flex: 1,
  },
  statementBody: {
    minHeight: 136,
    justifyContent: 'space-between',
    gap: space.md,
  },
  statementBodyFill: {
    flex: 1,
  },
  statementTitle: {
    ...typography.title1,
    color: color.textPrimary,
  },
  statementIconWrap: {
    alignItems: 'center',
  },
  statementIconStart: {
    alignItems: 'flex-start',
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
