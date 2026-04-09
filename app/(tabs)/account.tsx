import {
  BorderRadius,
  Colors,
  FontSize,
  Spacing,
} from '@/src/constants/theme';
import { useSubscription } from '@/src/hooks/use-subscription';
import {
  getICloudSyncStatus,
  isICloudSyncEnabled,
  setICloudSyncEnabled,
  syncIfEnabled,
  syncNow,
} from '@/src/services/icloudSync/icloudSyncService';
import { isICloudReadyAsync } from '@/src/services/icloudSync/icloudFiles';
import { ProgramLauncher } from '@/src/screens/ProgramLauncher';
import type { Program } from '@/src/types/program';
import { getProgramById } from '@/src/utils/program';
import { getActiveProgramId } from '@/src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const KEY_APPLE_USER_ID = 'apple_user_id';

type AppleState = {
  isAvailable: boolean;
  userId: string | null;
};

export default function AccountScreen() {
  const [hasProgram, setHasProgram] = useState<boolean>(false);
  const [activeProgram, setActiveProgram] = useState<Program | null>(null);
  const [programLauncherVisible, setProgramLauncherVisible] = useState(false);
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();

  const [appleState, setAppleState] = useState<AppleState>({
    isAvailable: false,
    userId: null,
  });
  const [icloudReady, setIcloudReady] = useState<boolean>(false);
  const [syncEnabled, setSyncEnabled] = useState<boolean>(false);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<boolean>(false);

  const checkProgramStatus = useCallback(async () => {
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
  }, []);

  const refreshAccountStatus = useCallback(async () => {
    const [userId, enabled, status, ready] = await Promise.all([
      AsyncStorage.getItem(KEY_APPLE_USER_ID),
      isICloudSyncEnabled(),
      getICloudSyncStatus(),
      isICloudReadyAsync(),
    ]);

    const isAvailable =
      Platform.OS === 'ios' ? await AppleAuthentication.isAvailableAsync() : false;

    setAppleState({ isAvailable, userId });
    setSyncEnabled(enabled);
    setLastSyncAt(status.lastSyncAt);
    setLastError(status.lastError);
    setSyncing(status.isSyncing);
    setIcloudReady(ready);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkProgramStatus();
      refresh();
      void refreshAccountStatus();
      void syncIfEnabled({ reason: 'foreground' });
    }, [checkProgramStatus, refresh, refreshAccountStatus])
  );

  const handleSubscriptionPress = () => {
    if (isPro) {
      router.push('/customer-center');
    } else {
      router.push('/paywall');
    }
  };

  const handleProgramSelectedFromLauncher = () => {
    setProgramLauncherVisible(false);

    void (async () => {
      try {
        await Notifications.cancelAllScheduledNotificationsAsync();
      } catch (error) {
        console.error('Error cancelling scheduled notifications:', error);
      } finally {
        checkProgramStatus();
        router.replace('/');
      }
    })();
  };

  const appleStatusLabel = useMemo(() => {
    if (!appleState.isAvailable) return 'Not available on this device';
    if (appleState.userId) return `Signed in`;
    return 'Signed out';
  }, [appleState.isAvailable, appleState.userId]);

  const handleAppleSignIn = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      await AsyncStorage.setItem(KEY_APPLE_USER_ID, credential.user);
      setAppleState((s) => ({ ...s, userId: credential.user }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes('ERR_CANCELED')) {
        return;
      }
      Alert.alert('Sign in failed', 'Unable to sign in with Apple. Please try again.');
    }
  };

  const handleAppleSignOut = async () => {
    await AsyncStorage.removeItem(KEY_APPLE_USER_ID);
    setAppleState((s) => ({ ...s, userId: null }));
  };

  const handleSyncToggle = async (next: boolean) => {
    setSyncEnabled(next);
    await setICloudSyncEnabled(next);
    await refreshAccountStatus();
    if (next) {
      await syncNow({ reason: 'manual' });
      await refreshAccountStatus();
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    await syncNow({ reason: 'manual' });
    await refreshAccountStatus();
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete ALL stored data.\n\nThis action cannot be undone.\n\nAre you sure you want to clear all data?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All Data',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              setHasProgram(false);
              setActiveProgram(null);
              router.replace('/');
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              console.error('Error clearing all data:', error);
              Alert.alert('Error', 'Failed to clear all data. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <Text style={styles.title}>Account</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.settingsList}>
          <TouchableOpacity
            style={[styles.settingItem, isPro && styles.proItem]}
            onPress={handleSubscriptionPress}
            disabled={subscriptionLoading}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingTitleRow}>
                <Text style={styles.settingTitle}>
                  {isPro ? 'Tempered Strength Pro' : 'Upgrade to Pro'}
                </Text>
                {isPro && (
                  <View style={styles.proBadge}>
                    <Text style={styles.proBadgeText}>ACTIVE</Text>
                  </View>
                )}
              </View>
              <Text style={styles.settingDescription}>
                {isPro
                  ? 'Manage your subscription and access Pro features'
                  : 'Unlock all premium features with a subscription'}
              </Text>
            </View>
            <Text style={[styles.settingArrow, isPro && styles.proArrow]}>→</Text>
          </TouchableOpacity>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Apple</Text>
            <Text style={styles.sectionSubtitle}>{appleStatusLabel}</Text>
            {appleState.isAvailable && !appleState.userId && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={12}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}
            {appleState.isAvailable && appleState.userId && (
              <TouchableOpacity style={styles.secondaryButton} onPress={handleAppleSignOut}>
                <Text style={styles.secondaryButtonText}>Sign out</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>iCloud Sync</Text>
            <Text style={styles.sectionSubtitle}>
              {icloudReady ? 'Available' : 'Unavailable (check iCloud Drive)'}
            </Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>Enable Sync</Text>
              <Switch
                value={syncEnabled}
                onValueChange={handleSyncToggle}
                disabled={!icloudReady}
              />
            </View>

            <View style={styles.meta}>
              <Text style={styles.metaText}>
                Last synced: {lastSyncAt ? lastSyncAt : 'Never'}
              </Text>
              {lastError && (
                <Text style={styles.metaError}>
                  Last error: {lastError}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, (!syncEnabled || syncing) && styles.primaryButtonDisabled]}
              onPress={handleSyncNow}
              disabled={!syncEnabled || syncing}
            >
              <Text style={styles.primaryButtonText}>
                {syncing ? 'Syncing…' : 'Sync now'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.settingItem,
              !hasProgram && styles.settingItemDisabled,
            ]}
            onPress={() => setProgramLauncherVisible(true)}
            disabled={!hasProgram}
          >
            <View style={styles.settingContent}>
              <Text
                style={[
                  styles.settingTitle,
                  !hasProgram && styles.settingTitleDisabled,
                ]}
              >
                Change Program
              </Text>
              <Text style={styles.settingDescription}>
                {hasProgram && activeProgram ? activeProgram.name : 'Select a different program'}
              </Text>
            </View>
            <Text
              style={[
                styles.settingArrow,
                !hasProgram && styles.settingArrowDisabled,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleClearAllData}>
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
                <Text style={styles.settingDescription}>
                  Permanently delete all stored data
                </Text>
              </View>
              <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {programLauncherVisible && (
        <Modal
          visible={programLauncherVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setProgramLauncherVisible(false)}
        >
          <ProgramLauncher
            resetExistingProgramData
            onClose={() => setProgramLauncherVisible(false)}
            onProgramSelected={handleProgramSelectedFromLauncher}
          />
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.section,
  },
  header: {
    padding: Spacing.section,
    paddingBottom: Spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  settingsList: {
    gap: Spacing.xl,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  settingTitleDisabled: {
    color: Colors.textMuted,
  },
  settingDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  settingArrow: {
    color: Colors.accent,
    fontSize: FontSize.displayXl,
    fontWeight: '600',
    marginLeft: Spacing.xl,
  },
  settingArrowDisabled: {
    color: Colors.textPlaceholder,
  },
  dangerItem: {
    borderColor: Colors.destructiveAlt,
  },
  dangerText: {
    color: Colors.destructiveAlt,
  },
  proItem: {
    borderColor: Colors.accent,
  },
  proArrow: {
    color: Colors.accent,
  },
  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  proBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  proBadgeText: {
    color: Colors.textBlack,
    fontSize: FontSize.xxs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    gap: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  appleButton: {
    width: '100%',
    height: 44,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  rowLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  meta: {
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  metaText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  metaError: {
    color: Colors.destructiveAlt,
    fontSize: FontSize.md,
  },
  primaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: Colors.textBlack,
    fontSize: FontSize.lg,
    fontWeight: '800',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});

