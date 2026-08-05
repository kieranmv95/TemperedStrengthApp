import { StandardLayout } from '@/src/components/StandardLayout';
import { SmallChevron } from '@/src/components/ds/SmallChevron';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useSubscription } from '@/src/hooks/use-subscription';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router, type Href } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Switch, Text, TouchableOpacity, View } from 'react-native';

export function YouAccountSettingsScreen() {
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
      'Reset Onboarding',
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
        const { logPersonalBestsSqliteDebug } = await import(
          '@/src/db/domains/personalBests/debug'
        );
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
        const { logWorkoutLogSetsSqliteDebug } = await import(
          '@/src/db/domains/workoutLogs/debug'
        );
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
                const { purgeStructuredDataLocalAndRemote } = await import(
                  '@/src/db/devPurgeStructuredData'
                );
                const result = await purgeStructuredDataLocalAndRemote();
                const localLine = result.localCleared
                  ? 'Local SQLite: cleared (PBs + workout logs + domain meta).'
                  : 'Local SQLite: failed.';
                const remoteLine = result.remoteCleared
                  ? `Remote: deleted ${result.remotePersonalBestDeleted ?? 0} PB rows, ${result.remoteWorkoutLogDeleted ?? 0} set log rows.`
                  : `Remote: skipped/failed — ${result.remoteSkippedReason ?? 'unknown'}`;
                Alert.alert('Structured data purged', `${localLine}\n\n${remoteLine}`);
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
        const { notification, sponsorAds, shopAds } =
          await refreshSanityHomeContent();
        const sponsorCount = sponsorAds.length;
        const shopCount = shopAds.length;
        const notificationNote =
          notification !== null ? 'Notification loaded.' : 'No notification.';
        Alert.alert(
          'Sanity home content refreshed',
          `${notificationNote} ${sponsorCount} carousel ad${sponsorCount === 1 ? '' : 's'}, ${shopCount} in shop. Open Home or Hub to preview.`
        );
      } catch (error) {
        console.error('Dev Sanity refresh failed:', error);
        Alert.alert(
          'Error',
          'Could not refresh Sanity home content. Try again.'
        );
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
      'Clear All Data',
      'This will permanently delete ALL stored data including:\n\n• Program progress\n• Exercise swaps\n• Custom set counts\n• Exercise cache\n\nThis action cannot be undone.\n\nAre you sure you want to clear all data?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All Data',
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

  return (
    <StandardLayout
      title="Account & Settings"
      subtitle="Manage your account"
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.settingsList}>
          {user ? (
            <>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleSignOut}
              >
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Signed in</Text>
                  <Text style={styles.settingDescription}>
                    {user.email ?? 'Your account'} ·{' '}
                    {syncError
                      ? `Backup needs attention: ${syncError}`
                      : 'Data backup is active. Tap to sign out.'}
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.settingItem, styles.dangerItem]}
                onPress={handleDeleteAccount}
                disabled={isDeletingAccount}
              >
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Delete account
                  </Text>
                  <Text style={styles.settingDescription}>
                    {isDeletingAccount
                      ? 'Deleting account and cloud backup…'
                      : 'Permanently delete your account and cloud backup. Local data stays on this device.'}
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() =>
                router.push({
                  pathname: '/account/create-account',
                  params: {
                    intent: 'create',
                    returnTo: '/records/account',
                  },
                } as unknown as Href)
              }
              disabled={!isConfigured}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Back up your data</Text>
                <Text style={styles.settingDescription}>
                  {isConfigured
                    ? 'Create or sign in to an account. Your data is not currently backed up.'
                    : 'Account backup is not configured in this build.'}
                </Text>
              </View>
              {isConfigured ? <SmallChevron /> : null}
            </TouchableOpacity>
          )}

          {isPro ? (
            <TouchableOpacity
              style={[styles.settingItem, styles.proItem]}
              onPress={isRevenueCatPro ? handleSubscriptionPress : undefined}
              disabled={subscriptionLoading || !isRevenueCatPro}
              activeOpacity={isRevenueCatPro ? 0.2 : 1}
            >
              <View style={styles.settingContent}>
                <View style={styles.settingTitleRow}>
                  <Text style={styles.settingTitle}>Tempered Strength Pro</Text>
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>ACTIVE</Text>
                  </View>
                </View>
                <Text style={styles.settingDescription}>
                  {proBannerDescription}
                </Text>
                <View style={styles.proFeaturesList}>
                  <Text style={styles.proTitle}>
                    Your Pro features include:
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - All programs access
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - All workout access
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - Unlimited exercise swaps
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - All recovery flows access
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - All awards unlocked
                  </Text>
                </View>
              </View>
              {isRevenueCatPro ? <SmallChevron /> : null}
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={[
              styles.settingItem,
              isPromoPro && styles.settingItemDisabled,
            ]}
            onPress={
              isPromoPro
                ? undefined
                : () => router.push('/account/redeem-promo')
            }
            disabled={isPromoPro}
            activeOpacity={isPromoPro ? 1 : 0.2}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Redeem Pro code</Text>
              <Text style={styles.settingDescription}>
                {promoRemainingLabel
                  ? `${promoRemainingLabel}. Redeem another code once this expires.`
                  : 'Unlock Pro with a promo code.'}
              </Text>
            </View>
            {isPromoPro ? null : <SmallChevron />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/account/general')}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>General settings</Text>
              <Text style={styles.settingDescription}>
                Weight units and onboarding preferences.
              </Text>
            </View>
            <SmallChevron />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/account/program')}
            style={styles.settingItem}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Program settings</Text>
              <Text style={styles.settingDescription}>
                Auto timers, PB detection, end current program.
              </Text>
            </View>
            <SmallChevron />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => router.push('/patch-notes')}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Patch Notes</Text>
              <Text style={styles.settingDescription}>
                See what’s new in the latest versions.
              </Text>
            </View>
            <SmallChevron />
          </TouchableOpacity>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>
              Pro across devices FAQ
            </Text>
            <View style={styles.settingItem}>
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
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Billing stays with the store you bought from
                </Text>
                <Text style={styles.settingDescription}>
                  An Apple purchase renews through Apple. A Google Play purchase
                  renews through Google. You still get Pro on both platforms when
                  signed in.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  “Restore purchases” is store-specific
                </Text>
                <Text style={styles.settingDescription}>
                  Restore on Android only restores Google Play purchases. For an
                  Apple subscription on Android, sign into your Tempered Strength
                  account instead.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>
                  Bought Pro before creating an account?
                </Text>
                <Text style={styles.settingDescription}>
                  Open the app on the device you purchased on, sign in once, then
                  sign into the same account on your other device. That links Pro
                  to your account.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.settingsSection}>
            <Text style={styles.settingsSectionTitle}>Legal</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Trademarks</Text>
                <Text style={styles.settingDescription}>
                  CrossFit and HYROX are trademarks of their respective owners.
                  Tempered Strength is not affiliated with, endorsed by, or
                  sponsored by them.
                </Text>
              </View>
            </View>
            <View style={styles.settingItem}>
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

          {__DEV__ && (
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Dev settings</Text>

              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Force Pro mode</Text>
                  <Text style={styles.settingDescription}>
                    Treat this device as Pro for local testing. RevenueCat is
                    not changed.
                  </Text>
                </View>
                <Switch
                  value={isDeveloperProOverrideEnabled}
                  onValueChange={(enabled) => {
                    void handleDevProOverrideChange(enabled);
                  }}
                  disabled={isUpdatingDevProOverride}
                  accessibilityLabel="Force Pro mode"
                />
              </View>

              <TouchableOpacity
                style={[styles.settingItem, styles.dangerItem]}
                onPress={handleClearAllData}
              >
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Clear All Data
                  </Text>
                  <Text style={styles.settingDescription}>
                    Permanently delete all stored data
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleDevDumpPersonalBestsSqlite}
              >
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    Dump personal bests SQLite
                  </Text>
                  <Text style={styles.settingDescription}>
                    Log every personal_best_entries row to Metro and show counts.
                    Use after logging a PB.
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleDevDumpWorkoutLogSetsSqlite}
              >
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    Dump workout log sets SQLite
                  </Text>
                  <Text style={styles.settingDescription}>
                    Log every workout_log_sets row to Metro and show dirty counts.
                    Use after logging a set.
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.settingItem, styles.dangerItem]}
                onPress={handleDevPurgeStructuredData}
              >
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Purge SQLite + cloud structured data
                  </Text>
                  <Text style={styles.settingDescription}>
                    Delete personal bests and workout_log_sets from this device
                    and from Supabase (when signed in). Dev only.
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleDevRefreshSanityHomeContent}
                disabled={isRefreshingSanityHome}
              >
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>
                    Clear Sanity cache & refresh
                  </Text>
                  <Text style={styles.settingDescription}>
                    {isRefreshingSanityHome
                      ? 'Fetching notification and sponsor ads from Sanity…'
                      : 'Clear cached home content and refetch from Sanity. Open Home to preview what users see.'}
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>

              <View style={styles.settingItem}>
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

              <TouchableOpacity
                style={[styles.settingItem, styles.dangerItem]}
                onPress={handleResetOnboarding}
              >
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>
                    Reset Onboarding
                  </Text>
                  <Text style={styles.settingDescription}>
                    Clear onboarded flag and stored profile for testing
                  </Text>
                </View>
                <SmallChevron />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
