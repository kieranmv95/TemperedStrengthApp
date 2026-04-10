import { StandardLayout } from '@/src/components/StandardLayout';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { Program } from '@/src/types/program';
import { getProgramById } from '@/src/utils/program';
import { clearProgramData, getActiveProgramId } from '@/src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [hasProgram, setHasProgram] = useState<boolean>(false);
  const [, setActiveProgram] = useState<Program | null>(null);
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();
  const { enabled: iCloudSyncEnabled, isAvailable, setEnabled } = useSyncManager();

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

  useFocusEffect(
    React.useCallback(() => {
      checkProgramStatus();
      refresh(); // Refresh subscription status when screen is focused
    }, [refresh])
  );

  const handleSubscriptionPress = () => {
    if (isPro) {
      // Open Customer Center for Pro users
      router.push('/customer-center');
    } else {
      // Open Paywall for non-Pro users
      router.push('/paywall');
    }
  };

  const handleEndCurrentProgram = () => {
    Alert.alert(
      'End Current Program',
      'This will permanently end your current program and clear all program data, including:\n\n• Program selection & start date\n• Program progress\n• Workout logs\n• Exercise swaps\n• Custom set counts\n• Workout notes\n• Rest timers / active session\n\nThis action cannot be undone.\n\nAre you sure you want to end your current program?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'End Program',
          style: 'destructive',
          onPress: async () => {
            try {
              await Notifications.cancelAllScheduledNotificationsAsync();
            } catch (error) {
              console.error('Error cancelling scheduled notifications:', error);
            }

            try {
              await clearProgramData();
              setHasProgram(false);
              setActiveProgram(null);
              router.replace('/');
              Alert.alert(
                'Program Ended',
                'Your current program has been cleared.'
              );
            } catch (error) {
              console.error('Error ending current program:', error);
              Alert.alert(
                'Error',
                'Failed to end your current program. Please try again.'
              );
            }
          },
        },
      ]
    );
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
              setHasProgram(false);
              setActiveProgram(null);
              // Navigate back to Program tab (index)
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
    <StandardLayout title="Account" subtitle="Manage your account">
      <StandardLayout.Body>
        <View style={styles.settingsList}>
          {Platform.OS === 'ios' && (
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>iCloud Sync</Text>
                <Text style={styles.settingDescription}>
                  Keep a backup of your data in iCloud. AsyncStorage stays
                  primary; iCloud is used for backup and restore.
                </Text>
                {iCloudSyncEnabled && !isAvailable && (
                  <Text style={styles.settingDescription}>
                    iCloud is currently unavailable on this device/account.
                  </Text>
                )}
              </View>
              <Switch
                value={iCloudSyncEnabled}
                onValueChange={async (next) => {
                  if (!next) {
                    await setEnabled(false);
                    return;
                  }

                  const result = await setEnabled(true);
                  if (!result.isAvailable) {
                    Alert.alert(
                      'iCloud Unavailable',
                      "We couldn't access iCloud on this device/account. Your data will remain local only."
                    );
                    await setEnabled(false);
                  }
                }}
              />
            </View>
          )}

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
              {isPro && (
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
                    - Early access to new features
                  </Text>
                  <Text style={styles.proFeatureItem}>
                    - All awards unlocked
                  </Text>
                </View>
              )}
            </View>
            <Text style={[styles.settingArrow, isPro && styles.proArrow]}>
              →
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              styles.dangerItem,
              !hasProgram && styles.settingItemDisabled,
            ]}
            onPress={handleEndCurrentProgram}
            disabled={!hasProgram}
          >
            <View style={styles.settingContent}>
              <Text
                style={[
                  styles.settingTitle,
                  styles.dangerText,
                  !hasProgram && styles.settingTitleDisabled,
                ]}
              >
                End Current Program
              </Text>
              <Text style={styles.settingDescription}>
                {hasProgram
                  ? 'Clear all program progress and related data'
                  : 'No active program to end'}
              </Text>
            </View>
            <Text
              style={[
                styles.settingArrow,
                styles.dangerText,
                !hasProgram && styles.settingArrowDisabled,
              ]}
            >
              →
            </Text>
          </TouchableOpacity>

          {__DEV__ && (
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
              <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
            </TouchableOpacity>
          )}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
