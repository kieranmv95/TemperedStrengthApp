import {
  Badge,
  PressableCard,
  SectionHeader,
  StandardLayout,
} from '@/src/components/ds';
import {
  settingsSwitchColors,
  settingsScreenStyles as styles,
} from '@/src/components/settings/settingsScreenStyles';
import { color } from '@/src/constants/tokens';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useSubscription } from '@/src/hooks/use-subscription';
import { useLargeText } from '@/src/hooks/useLargeText';
import { refreshSanityHomeContent } from '@/src/services/sanityHomeContent';
import type { OnboardingProfile } from '@/src/types/onboarding';
import type { Program } from '@/src/types/program';
import { getProgramById } from '@/src/utils/program';
import {
  clearOnboarding,
  getActiveProgramId,
  getOnboarded,
  getOnboardingProfile,
} from '@/src/utils/storage';
import { tryConsumeSubscriptionRefreshCooldown } from '@/src/utils/subscriptionRefreshThrottle';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, type Href } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';

const PRO_FEATURES = [
  'Daily Programming access',
  'All Programs access',
  'All Workout access',
  'Unlimited exercise swaps',
  'All recovery flows access',
  'All awards unlocked',
];

type SettingTextProps = {
  title: string;
  description: string;
  danger?: boolean;
};

function SettingText({ title, description, danger = false }: SettingTextProps) {
  return (
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, danger && styles.dangerText]}>
        {title}
      </Text>
      <Text style={styles.settingDescription}>{description}</Text>
    </View>
  );
}

type ProStatusContentProps = {
  description: string;
};

function ProStatusContent({ description }: ProStatusContentProps) {
  return (
    <View style={styles.settingContent}>
      <View style={styles.settingTitleRow}>
        <Text style={styles.settingTitle}>Tempered Strength Pro</Text>
        <Badge label="Active" tone="success" />
      </View>
      <Text style={styles.settingDescription}>{description}</Text>
      <View style={styles.proFeaturesList}>
        <Text style={styles.proTitle}>Your Pro features include:</Text>
        {PRO_FEATURES.map((feature) => (
          <View key={feature} style={styles.proFeatureRow}>
            <Ionicons
              name="checkmark"
              size={18}
              color={color.gold}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
            <Text style={styles.proFeatureItem}>{feature}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function YouAccountSettingsScreen() {
  const largeText = useLargeText();
  const [, setHasProgram] = useState<boolean>(false);
  const [, setActiveProgram] = useState<Program | null>(null);
  const [onboardedState, setOnboardedState] = useState<boolean>(false);
  const [onboardingProfileState, setOnboardingProfileState] =
    useState<OnboardingProfile | null>(null);
  const [isRefreshingSanityHome, setIsRefreshingSanityHome] = useState(false);
  const [isUpdatingDevProOverride, setIsUpdatingDevProOverride] =
    useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { deleteAccount, isConfigured, signOut, syncError, user } =
    useSyncManager();
  const {
    isPro,
    isPromoPro,
    isRevenueCatPro,
    isDeveloperProOverrideEnabled,
    promoProGrant,
    isLoading: subscriptionLoading,
    refresh,
    setDeveloperProOverrideEnabled,
  } = useSubscription();

  const promoExpiryLabel =
    isPromoPro && promoProGrant
      ? new Date(promoProGrant.expiresAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
      : null;

  const promoDaysRemaining =
    isPromoPro && promoProGrant
      ? Math.max(
        0,
        Math.ceil(
          (Date.parse(promoProGrant.expiresAt) - Date.now()) /
          (24 * 60 * 60 * 1000)
        )
      )
      : null;

  const promoRemainingLabel =
    promoDaysRemaining !== null && promoExpiryLabel
      ? promoDaysRemaining === 0
        ? `Expires today (${promoExpiryLabel})`
        : promoDaysRemaining === 1
          ? `1 day remaining · until ${promoExpiryLabel}`
          : `${promoDaysRemaining} days remaining · until ${promoExpiryLabel}`
      : null;

  const proBannerDescription = (() => {
    if (isRevenueCatPro && promoRemainingLabel) {
      return `Manage your subscription. Promo code also active — ${promoRemainingLabel}.`;
    }
    if (isRevenueCatPro) {
      return 'Manage your subscription and access Pro features';
    }
    if (promoRemainingLabel) {
      return `Pro via promo code · ${promoRemainingLabel}`;
    }
    return 'Access Pro features';
  })();

  const checkProgramStatus = async () => {
    try {
      const programId = await getActiveProgramId();
      const hasActiveProgram = !!programId;
      setHasProgram(hasActiveProgram);

      if (hasActiveProgram && programId) {
        const program = getProgramById(programId);
        setActiveProgram(program || null);
      } else {
        setActiveProgram(null);
      }
    } catch (error) {
      console.error('Error checking program status:', error);
      setHasProgram(false);
      setActiveProgram(null);
    }
  };

  const loadOnboardingState = async () => {
    try {
      const [done, profile] = await Promise.all([
        getOnboarded(),
        getOnboardingProfile(),
      ]);
      setOnboardedState(done);
      setOnboardingProfileState(profile);
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      setOnboardedState(false);
      setOnboardingProfileState(null);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkProgramStatus();
      loadOnboardingState();
      if (tryConsumeSubscriptionRefreshCooldown()) {
        void refresh();
      }
    }, [refresh])
  );

  const handleSubscriptionPress = () => {
    if (isRevenueCatPro) {
      router.push('/customer-center');
      return;
    }
    if (isPromoPro) {
      router.push('/account/redeem-promo');
      return;
    }
    router.push('/paywall');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign out?',
      'Your training data stays on this device, but changes will not be backed up until you sign in again.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign out',
          style: 'destructive',
          onPress: () => {
            void signOut().catch((error) => {
              console.error('Failed to sign out:', error);
              Alert.alert('Could not sign out', 'Please try again.');
            });
          },
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete account and cloud backup?',
      'This permanently deletes your account and all cloud backup data. Your training data will remain on this device so you can continue using the app locally. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete account',
          style: 'destructive',
          onPress: () => {
            setIsDeletingAccount(true);
            void deleteAccount()
              .then(() => {
                Alert.alert(
                  'Account deleted',
                  'Your cloud account and backup were deleted. Local data remains on this device.'
                );
              })
              .catch((error) => {
                console.error('Failed to delete account:', error);
                Alert.alert(
                  'Could not delete account',
                  'Please check your connection and try again.'
                );
              })
              .finally(() => setIsDeletingAccount(false));
          },
        },
      ]
    );
  };

  const handleResetOnboarding = () => {
    Alert.alert(
      'Reset onboarding',
      'This clears the onboarded flag and the stored onboarding profile.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearOnboarding();
              setOnboardedState(false);
              setOnboardingProfileState(null);
            } catch (error) {
              console.error('Error resetting onboarding:', error);
              Alert.alert(
                'Error',
                'Failed to reset onboarding. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleDevDumpPersonalBestsSqlite = () => {
    void (async () => {
      try {
        const { logPersonalBestsSqliteDebug } =
          await import('@/src/db/domains/personalBests/debug');
        const summary = await logPersonalBestsSqliteDebug('dev settings dump');
        Alert.alert(
          'SQLite personal bests',
          `total: ${summary.total}\nactive: ${summary.active}\ndirty (pending cloud): ${summary.dirty}\n\nFull rows are in the Metro console as [sqlite].`
        );
      } catch (error) {
        console.error('Dev SQLite PB dump failed:', error);
        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'Could not read personal_best_entries from SQLite.'
        );
      }
    })();
  };

  const handleDevDumpWorkoutLogSetsSqlite = () => {
    void (async () => {
      try {
        const { logWorkoutLogSetsSqliteDebug } =
          await import('@/src/db/domains/workoutLogs/debug');
        const summary = await logWorkoutLogSetsSqliteDebug('dev settings dump');
        Alert.alert(
          'SQLite workout log sets',
          `total: ${summary.total}\nactive: ${summary.active}\ndirty (pending cloud): ${summary.dirty}\n\nFull rows are in the Metro console as [sqlite].`
        );
      } catch (error) {
        console.error('Dev SQLite workout log dump failed:', error);
        Alert.alert(
          'Error',
          error instanceof Error
            ? error.message
            : 'Could not read workout_log_sets from SQLite.'
        );
      }
    })();
  };

  const handleDevPurgeStructuredData = () => {
    Alert.alert(
      'Purge structured data',
      'Deletes personal bests + workout logs from:\n\n• Local SQLite\n• Supabase tables (if signed in)\n\nDoes not clear AsyncStorage prefs/KV.\n\nCannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void (async () => {
              try {
                const { purgeStructuredDataLocalAndRemote } =
                  await import('@/src/db/devPurgeStructuredData');
                const result = await purgeStructuredDataLocalAndRemote();
                const localLine = result.localCleared
                  ? 'Local SQLite: cleared (PBs + workout logs + check-in + domain meta).'
                  : 'Local SQLite: failed.';
                const remoteLine = result.remoteCleared
                  ? `Remote: deleted ${result.remotePersonalBestDeleted ?? 0} PB rows, ${result.remoteWorkoutLogDeleted ?? 0} set log rows, ${result.remoteCheckinDeleted ?? 0} check-in rows.`
                  : `Remote: skipped/failed — ${result.remoteSkippedReason ?? 'unknown'}`;
                Alert.alert(
                  'Structured data purged',
                  `${localLine}\n\n${remoteLine}`
                );
              } catch (error) {
                console.error('Dev structured purge failed:', error);
                Alert.alert(
                  'Error',
                  error instanceof Error
                    ? error.message
                    : 'Could not purge structured data.'
                );
              }
            })();
          },
        },
      ]
    );
  };

  const handleDevRefreshSanityHomeContent = () => {
    if (isRefreshingSanityHome) {
      return;
    }
    setIsRefreshingSanityHome(true);
    void (async () => {
      try {
        const { notification, shopAds, skills } =
          await refreshSanityHomeContent();
        const shopCount = shopAds.length;
        const skillsCount = skills.length;
        const notificationNote =
          notification !== null ? 'Notification loaded.' : 'No notification.';
        Alert.alert(
          'Sanity content refreshed',
          `${notificationNote} ${shopCount} ad${shopCount === 1 ? '' : 's'} in shop, ${skillsCount} skill${skillsCount === 1 ? '' : 's'}. Open Home, Hub, or Skills & Cues to preview.`
        );
      } catch (error) {
        console.error('Dev Sanity refresh failed:', error);
        Alert.alert('Error', 'Could not refresh Sanity content. Try again.');
      } finally {
        setIsRefreshingSanityHome(false);
      }
    })();
  };

  const handleDevProOverrideChange = async (enabled: boolean) => {
    if (isUpdatingDevProOverride) {
      return;
    }

    setIsUpdatingDevProOverride(true);
    try {
      await setDeveloperProOverrideEnabled(enabled);
    } catch (error) {
      console.error('Error updating dev Pro override:', error);
      Alert.alert('Error', 'Could not update the developer Pro override.');
    } finally {
      setIsUpdatingDevProOverride(false);
    }
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear all data',
      'This will permanently delete ALL stored data including:\n\n• Program progress\n• Exercise swaps\n• Custom set counts\n• Exercise cache\n\nThis action cannot be undone.\n\nAre you sure you want to clear all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear all data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await setDeveloperProOverrideEnabled(false);
              setHasProgram(false);
              setActiveProgram(null);
              router.replace('/');
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing all data:', error);
              Alert.alert(
                'Error',
                'Failed to clear all data. Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const signedInDescription = user
    ? `${user.email ?? 'Your account'} · ${syncError
      ? `Backup needs attention: ${syncError}`
      : 'Data backup is active. Tap to sign out.'
    }`
    : '';
  const loginDescription = isConfigured
    ? 'Create or sign in to an account. Your data is not currently backed up.'
    : 'Account backup is not configured in this build.';
  const proAccessibilityLabel = `Tempered Strength Pro, active. ${proBannerDescription}. Your Pro features include: ${PRO_FEATURES.join(', ')}`;
  const redeemDescription = promoRemainingLabel
    ? `${promoRemainingLabel}. Redeem another code once this expires.`
    : 'Unlock Pro with a promo code.';
  const deleteAccountDescription = isDeletingAccount
    ? 'Deleting account and cloud backup…'
    : 'Permanently delete your account and cloud backup. Local data stays on this device.';
  const sanityRefreshDescription = isRefreshingSanityHome
    ? 'Fetching notification, shop ads, and skills from Sanity…'
    : 'Clear cached Sanity content (home + skills) and refetch. Open Home, Hub, or Skills & Cues to preview.';

  return (
    <StandardLayout
      title="Account & settings"
      subtitle="Manage your account"
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.settingsList}>
          <View style={styles.settingsSection}>
            <SectionHeader title="Account" />
            {user ? (
              <PressableCard
                onPress={handleSignOut}
                accessibilityLabel={`Signed in, ${signedInDescription}`}
                accessibilityHint="Asks to confirm signing out"
              >
                <SettingText
                  title="Signed in"
                  description={signedInDescription}
                />
              </PressableCard>
            ) : isConfigured ? (
              <PressableCard
                onPress={() =>
                  router.push({
                    pathname: '/account/create-account',
                    params: {
                      intent: 'create',
                      returnTo: '/records/account',
                    },
                  } as unknown as Href)
                }
                accessibilityLabel={`Log in or sign up, ${loginDescription}`}
              >
                <SettingText
                  title="Log in or sign up"
                  description={loginDescription}
                />
              </PressableCard>
            ) : (
              <View
                style={styles.settingItem}
                accessible
                accessibilityLabel={`Log in or sign up, ${loginDescription}`}
              >
                <SettingText
                  title="Log in or sign up"
                  description={loginDescription}
                />
              </View>
            )}

            {isPro ? (
              isRevenueCatPro ? (
                <PressableCard
                  onPress={handleSubscriptionPress}
                  disabled={subscriptionLoading}
                  accessibilityLabel={proAccessibilityLabel}
                  accessibilityHint="Opens subscription management"
                >
                  <ProStatusContent description={proBannerDescription} />
                </PressableCard>
              ) : (
                <View
                  style={styles.settingItem}
                  accessible
                  accessibilityLabel={proAccessibilityLabel}
                >
                  <ProStatusContent description={proBannerDescription} />
                </View>
              )
            ) : null}

            {isPromoPro ? (
              <View
                style={styles.settingItem}
                accessible
                accessibilityLabel={`Redeem Pro code, ${redeemDescription}`}
              >
                <SettingText
                  title="Redeem Pro code"
                  description={redeemDescription}
                />
              </View>
            ) : (
              <PressableCard
                onPress={() => router.push('/account/redeem-promo')}
                accessibilityLabel={`Redeem Pro code, ${redeemDescription}`}
              >
                <SettingText
                  title="Redeem Pro code"
                  description={redeemDescription}
                />
              </PressableCard>
            )}
          </View>

          <View style={styles.settingsSection}>
            <SectionHeader title="Settings" />
            <PressableCard
              onPress={() => router.push('/account/general')}
              accessibilityLabel="General settings, weight units and onboarding preferences"
            >
              <SettingText
                title="General settings"
                description="Weight units and onboarding preferences."
              />
            </PressableCard>

            <PressableCard
              onPress={() => router.push('/account/program')}
              accessibilityLabel="Program settings, auto timers, PB detection, end current program"
            >
              <SettingText
                title="Program settings"
                description="Auto timers, PB detection, end current program."
              />
            </PressableCard>

            <PressableCard
              onPress={() => router.push('/patch-notes')}
              accessibilityLabel="Patch notes, see what’s new in the latest versions"
            >
              <SettingText
                title="Patch notes"
                description="See what’s new in the latest versions."
              />
            </PressableCard>
          </View>

          <View style={styles.settingsSection}>
            <SectionHeader title="Pro across devices FAQ" />
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Use the same account on every device
                </Text>
                <Text style={styles.settingDescription}>
                  Sign in with the same Tempered Strength account on iPhone and
                  Android. Pro follows your account, not just the phone you paid
                  on.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Billing stays with the store you bought from
                </Text>
                <Text style={styles.settingDescription}>
                  An Apple purchase renews through Apple. A Google Play purchase
                  renews through Google. You still get Pro on both platforms
                  when signed in.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  “Restore purchases” is store-specific
                </Text>
                <Text style={styles.settingDescription}>
                  Restore on Android only restores Google Play purchases. For an
                  Apple subscription on Android, sign into your Tempered
                  Strength account instead.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Bought Pro before creating an account?
                </Text>
                <Text style={styles.settingDescription}>
                  Open the app on the device you purchased on, sign in once,
                  then sign into the same account on your other device. That
                  links Pro to your account.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <SectionHeader title="Legal" />
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Trademarks</Text>
                <Text style={styles.settingDescription}>
                  CrossFit and HYROX are trademarks of their respective owners.
                  Tempered Strength is not affiliated with, endorsed by, or
                  sponsored by them.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem} accessible>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Partner offers</Text>
                <Text style={styles.settingDescription}>
                  Highlights on Home and in the Shop are partner placements.
                  When you follow a link and buy (or sign up), Tempered Strength
                  may earn a commission or referral fee. That does not change
                  what you pay.
                </Text>
              </View>
            </View>
          </View>

          {user ? (
            <PressableCard
              onPress={handleDeleteAccount}
              disabled={isDeletingAccount}
              accessibilityLabel={`Delete account, ${deleteAccountDescription}`}
              accessibilityHint="Asks to confirm before deleting"
            >
              <SettingText
                title="Delete account"
                description={deleteAccountDescription}
                danger
              />
            </PressableCard>
          ) : null}

          {__DEV__ && (
            <View style={styles.settingsSection}>
              <SectionHeader title="Dev settings" />

              <PressableCard
                onPress={() => router.push('/dev/tokens')}
                accessibilityLabel="Design tokens preview"
              >
                <SettingText
                  title="Design tokens preview"
                  description="Every colour, type style, spacing, radius, elevation and motion token, with contrast ratios."
                />
              </PressableCard>

              <PressableCard
                onPress={() => router.push('/dev/components')}
                accessibilityLabel="Design components preview"
              >
                <SettingText
                  title="Design components preview"
                  description="The new shared components in isolation, with press, selection and Reduce Motion behaviour."
                />
              </PressableCard>

              <View
                style={[
                  styles.settingItem,
                  largeText && styles.settingItemStacked,
                ]}
              >
                <SettingText
                  title="Force Pro mode"
                  description="Treat this device as Pro for local testing. RevenueCat is not changed."
                />
                <Switch
                  {...settingsSwitchColors}
                  value={isDeveloperProOverrideEnabled}
                  onValueChange={(enabled) => {
                    void handleDevProOverrideChange(enabled);
                  }}
                  disabled={isUpdatingDevProOverride}
                  accessibilityLabel="Force Pro mode"
                  accessibilityHint="Treat this device as Pro for local testing"
                />
              </View>

              <PressableCard
                onPress={handleClearAllData}
                accessibilityLabel="Clear all data, permanently delete all stored data"
                accessibilityHint="Asks to confirm before deleting"
              >
                <SettingText
                  title="Clear all data"
                  description="Permanently delete all stored data."
                  danger
                />
              </PressableCard>

              <PressableCard
                onPress={handleDevDumpPersonalBestsSqlite}
                accessibilityLabel="Dump personal bests SQLite"
              >
                <SettingText
                  title="Dump personal bests SQLite"
                  description="Log every personal_best_entries row to Metro and show counts. Use after logging a PB."
                />
              </PressableCard>

              <PressableCard
                onPress={handleDevDumpWorkoutLogSetsSqlite}
                accessibilityLabel="Dump workout log sets SQLite"
              >
                <SettingText
                  title="Dump workout log sets SQLite"
                  description="Log every workout_log_sets row to Metro and show dirty counts. Use after logging a set."
                />
              </PressableCard>

              <PressableCard
                onPress={handleDevPurgeStructuredData}
                accessibilityLabel="Purge SQLite and cloud structured data"
                accessibilityHint="Asks to confirm before deleting"
              >
                <SettingText
                  title="Purge SQLite + cloud structured data"
                  description="Delete personal bests and workout_log_sets from this device and from Supabase (when signed in). Dev only."
                  danger
                />
              </PressableCard>

              <PressableCard
                onPress={handleDevRefreshSanityHomeContent}
                disabled={isRefreshingSanityHome}
                accessibilityLabel={`Clear Sanity cache and refresh, ${sanityRefreshDescription}`}
              >
                <SettingText
                  title="Clear Sanity cache & refresh"
                  description={sanityRefreshDescription}
                />
              </PressableCard>

              <View style={styles.settingItem} accessible>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    Developer · Onboarding
                  </Text>
                  <Text style={styles.settingDescription}>
                    onboarded: {onboardedState ? 'true' : 'false'}
                  </Text>
                  <Text style={styles.settingDescription}>
                    onboarding_profile:{'\n'}
                    {onboardingProfileState
                      ? JSON.stringify(onboardingProfileState, null, 2)
                      : 'null'}
                  </Text>
                </View>
              </View>

              <PressableCard
                onPress={handleResetOnboarding}
                accessibilityLabel="Reset onboarding, clear onboarded flag and stored profile for testing"
                accessibilityHint="Asks to confirm before resetting"
              >
                <SettingText
                  title="Reset onboarding"
                  description="Clear onboarded flag and stored profile for testing."
                  danger
                />
              </PressableCard>
            </View>
          )}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
