import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
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
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountProgramSettingsScreen() {
  const [hasProgram, setHasProgram] = useState<boolean>(false);
  const [, setActiveProgram] = useState<Program | null>(null);
  const [autoTimersEnabled, setAutoTimersEnabledState] = useState<boolean>(true);
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
      'End Current Program',
      'This will permanently end your current program and clear all program data, including:\n\n• Program selection & start date\n• Program progress\n• Workout logs\n• Exercise swaps\n• Custom set counts\n• Workout notes\n• Rest timers / active session\n\nThis action cannot be undone.\n\nAre you sure you want to end your current program?',
      [
        { text: 'Cancel', style: 'cancel' },
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
              Alert.alert('Program Ended', 'Your current program has been cleared.');
            } catch (error) {
              console.error('Error ending current program:', error);
              Alert.alert('Error', 'Failed to end your current program. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={pageStyles.container}>
      <View style={pageStyles.header}>
        <TouchableOpacity
          style={pageStyles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={pageStyles.headerTitle}>Program settings</Text>
        <View style={pageStyles.headerSpacer} />
      </View>

      <ScrollView
        style={pageStyles.scroll}
        contentContainerStyle={pageStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={pageStyles.subtitle}>Program-specific preferences.</Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto rest timers</Text>
              <Text style={styles.settingDescription}>
                When enabled, completing a set will automatically start (or restart) the rest
                timer. The timer closes after the last set.
              </Text>
            </View>
            <Switch
              value={autoTimersEnabled}
              onValueChange={(next) => {
                if (autoTimersLoading) return;
                persistAutoTimersEnabled(next);
              }}
              disabled={autoTimersLoading}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Auto-detect PBs (Programs)</Text>
              <Text style={styles.settingDescription}>
                When enabled, if we detect a new PB we’ll prompt you to update personal bests after
                sets during program workouts.
              </Text>
            </View>
            <Switch
              value={autoPbEnabled}
              onValueChange={(next) => {
                if (autoPbLoading) return;
                persistAutoPbEnabled(next);
              }}
              disabled={autoPbLoading}
            />
          </View>

          {hasProgram ? (
            <TouchableOpacity
              style={[styles.settingItem, styles.dangerItem]}
              onPress={handleEndCurrentProgram}
            >
              <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, styles.dangerText]}>
                  End Current Program
                </Text>
                <Text style={styles.settingDescription}>
                  Clear all program progress and related data
                </Text>
              </View>
              <Text style={[styles.settingArrow, styles.dangerText]}>→</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const pageStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDefault,
  },
  headerBackButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 32,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xl,
  },
  subtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
});

