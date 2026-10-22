import { PressableCard, StandardLayout } from '@/src/components/ds';
import {
  settingsScreenStyles as styles,
  settingsSwitchColors,
} from '@/src/components/settings/settingsScreenStyles';
import { useLargeText } from '@/src/hooks/useLargeText';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import type { Program } from '@/src/types/program';
import { getProgramById } from '@/src/utils/program';
import {
  clearProgramData,
  getActiveProgramId,
  getAutoPbDetectionInProgramsEnabled,
  getAutoRestTimersEnabled,
  setAutoPbDetectionInProgramsEnabled,
  setAutoRestTimersEnabled,
} from '@/src/utils/storage';
import { cancelTimerFinishedNotifications } from '@/src/services/localNotifications';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { Alert, Switch, Text, View } from 'react-native';

export default function AccountProgramSettingsScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const [hasProgram, setHasProgram] = useState<boolean>(false);
  const [, setActiveProgram] = useState<Program | null>(null);
  const [autoTimersEnabled, setAutoTimersEnabledState] =
    useState<boolean>(true);
  const [autoTimersLoading, setAutoTimersLoading] = useState<boolean>(true);
  const [autoPbEnabled, setAutoPbEnabledState] = useState<boolean>(true);
  const [autoPbLoading, setAutoPbLoading] = useState<boolean>(true);

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

  const loadAutoTimersEnabled = async () => {
    try {
      const enabled = await getAutoRestTimersEnabled();
      setAutoTimersEnabledState(enabled);
    } catch (error) {
      console.error('Error loading auto timers enabled:', error);
      setAutoTimersEnabledState(true);
    } finally {
      setAutoTimersLoading(false);
    }
  };

  const loadAutoPbEnabled = async () => {
    try {
      const enabled = await getAutoPbDetectionInProgramsEnabled();
      setAutoPbEnabledState(enabled);
    } catch (error) {
      console.error('Error loading auto PB detection enabled:', error);
      setAutoPbEnabledState(true);
    } finally {
      setAutoPbLoading(false);
    }
  };

  const persistAutoTimersEnabled = async (next: boolean) => {
    setAutoTimersEnabledState(next);
    try {
      await setAutoRestTimersEnabled(next);
      posthog.capture(posthogEventsNames.app.settingChanged, {
        setting_name: 'auto_rest_timers',
        new_value: next ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Error saving auto timers enabled:', error);
      const prev = await getAutoRestTimersEnabled();
      setAutoTimersEnabledState(prev);
    }
  };

  const persistAutoPbEnabled = async (next: boolean) => {
    setAutoPbEnabledState(next);
    try {
      await setAutoPbDetectionInProgramsEnabled(next);
      posthog.capture(posthogEventsNames.app.settingChanged, {
        setting_name: 'auto_pb_detection',
        new_value: next ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Error saving auto PB detection enabled:', error);
      const prev = await getAutoPbDetectionInProgramsEnabled();
      setAutoPbEnabledState(prev);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      checkProgramStatus();
      loadAutoTimersEnabled();
      loadAutoPbEnabled();
    }, [])
  );

  const handleEndCurrentProgram = () => {
    Alert.alert(
      'End current program',
      'This will permanently end your current program and clear all program data, including:\n\n• Program selection & start date\n• Program progress\n• Workout logs\n• Exercise swaps\n• Custom set counts\n• Workout notes\n• Rest timers / active session\n\nThis action cannot be undone.\n\nAre you sure you want to end your current program?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End program',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelTimerFinishedNotifications();
            } catch (error) {
              console.error('Error cancelling scheduled notifications:', error);
            }

            try {
              await clearProgramData();
              setHasProgram(false);
              setActiveProgram(null);
              router.replace('/');
              Alert.alert(
                'Program ended',
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

  return (
    <StandardLayout
      title="Program settings"
      subtitle="Program-specific preferences."
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.settingsSection}>
          <View
            style={[styles.settingItem, largeText && styles.settingItemStacked]}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto rest timers</Text>
              <Text style={styles.settingDescription}>
                When enabled, completing a set will automatically start (or
                restart) the rest timer. The timer closes after the last set.
              </Text>
            </View>
            <Switch
              {...settingsSwitchColors}
              value={autoTimersEnabled}
              onValueChange={(next) => {
                if (autoTimersLoading) return;
                persistAutoTimersEnabled(next);
              }}
              disabled={autoTimersLoading}
              accessibilityLabel="Auto rest timers"
              accessibilityHint="Starts the rest timer when you complete a set"
            />
          </View>

          <View
            style={[styles.settingItem, largeText && styles.settingItemStacked]}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                Auto-detect PBs in programs
              </Text>
              <Text style={styles.settingDescription}>
                When enabled, if we detect a new PB we’ll prompt you to update
                personal bests after sets during program workouts.
              </Text>
            </View>
            <Switch
              {...settingsSwitchColors}
              value={autoPbEnabled}
              onValueChange={(next) => {
                if (autoPbLoading) return;
                persistAutoPbEnabled(next);
              }}
              disabled={autoPbLoading}
              accessibilityLabel="Auto-detect PBs in programs"
              accessibilityHint="Prompts you to update personal bests after sets during program workouts"
            />
          </View>

          {hasProgram ? (
            <PressableCard
              onPress={handleEndCurrentProgram}
              accessibilityLabel="End current program, clear all program progress and related data"
              accessibilityHint="Asks to confirm before ending"
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  End current program
                </Text>
                <Text style={styles.settingDescription}>
                  Clear all program progress and related data.
                </Text>
              </View>
            </PressableCard>
          ) : null}
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
