import { StandardLayout } from '@/src/components/StandardLayout';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { useSubscription } from '@/src/hooks/use-subscription';
import type { OnboardingProfile } from '@/src/types/onboarding';
import type { Program } from '@/src/types/program';
import { getProgramById } from '@/src/utils/program';
import {
  clearOnboarding,
  getActiveProgramId,
  getOnboarded,
  getOnboardingProfile,
} from '@/src/utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const [, setHasProgram] = useState<boolean>(false);
  const [, setActiveProgram] = useState<Program | null>(null);
  const [onboardedState, setOnboardedState] = useState<boolean>(false);
  const [onboardingProfileState, setOnboardingProfileState] =
    useState<OnboardingProfile | null>(null);
  const { isPro, isLoading: subscriptionLoading, refresh } = useSubscription();

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
          {onboardingProfileState?.name && (
            <Text style={styles.settingTitle}>Hi {onboardingProfileState?.name}</Text>
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
            style={styles.settingItem}
            onPress={() => router.push('/account/general')}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>General settings</Text>
              <Text style={styles.settingDescription}>
                Weight units, iCloud sync, onboarding preferences.
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
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
            <Text style={styles.settingArrow}>→</Text>
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
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          {__DEV__ && (
            <View style={styles.settingsSection}>
              <Text style={styles.settingsSectionTitle}>Dev settings</Text>

              <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleClearAllData}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
                  <Text style={styles.settingDescription}>Permanently delete all stored data</Text>
                </View>
                <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
              </TouchableOpacity>

              <View style={styles.settingItem}>
                <View style={styles.settingContent}>
                  <Text style={styles.settingTitle}>Developer · Onboarding</Text>
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

              <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleResetOnboarding}>
                <View style={styles.settingContent}>
                  <Text style={[styles.settingTitle, styles.dangerText]}>Reset Onboarding</Text>
                  <Text style={styles.settingDescription}>
                    Clear onboarded flag and stored profile for testing
                  </Text>
                </View>
                <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </StandardLayout.Body>
    </StandardLayout >
  );
}
