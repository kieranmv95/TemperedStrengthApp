import { SmallChevron } from '@/src/components/ds/SmallChevron';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  getCheckinSettings,
  getWeightUnit,
  setWeightUnit,
  updateCheckinSettings,
  type WeightUnit,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import {
  AppSafeAreaView,
  AppScrollView,
} from '@/src/components/AppSafeAreaView';

export default function AccountGeneralSettingsScreen() {
  const posthog = usePostHog();
  const { user } = useSyncManager();
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('kg');
  const [weightUnitLoading, setWeightUnitLoading] = useState<boolean>(true);
  const [womensHealthVisible, setWomensHealthVisible] =
    useState<boolean>(false);
  const [healthSyncOptIn, setHealthSyncOptIn] = useState<boolean>(false);
  const [checkinSettingsLoading, setCheckinSettingsLoading] =
    useState<boolean>(true);

  const loadWeightUnit = async () => {
    try {
      const u = await getWeightUnit();
      setWeightUnitState(u);
    } catch (error) {
      console.error('Error loading weight unit:', error);
      setWeightUnitState('kg');
    } finally {
      setWeightUnitLoading(false);
    }
  };

  const loadCheckinSettings = async () => {
    try {
      const settings = await getCheckinSettings();
      setWomensHealthVisible(settings.womensHealthVisible);
      setHealthSyncOptIn(settings.healthSyncOptIn);
    } catch (error) {
      console.error('Error loading check-in settings:', error);
    } finally {
      setCheckinSettingsLoading(false);
    }
  };

  const persistWomensHealthVisible = async (enabled: boolean) => {
    setWomensHealthVisible(enabled);
    try {
      await updateCheckinSettings({ womensHealthVisible: enabled });
      posthog.capture(posthogEventsNames.app.settingChanged, {
        setting_name: 'checkin_womens_health_visible',
        new_value: enabled,
      });
    } catch (error) {
      console.error('Error saving women’s health visibility:', error);
      setWomensHealthVisible(!enabled);
    }
  };

  const persistHealthSyncOptIn = async (enabled: boolean) => {
    setHealthSyncOptIn(enabled);
    try {
      await updateCheckinSettings({ healthSyncOptIn: enabled });
      posthog.capture(posthogEventsNames.app.settingChanged, {
        setting_name: 'checkin_health_sync_opt_in',
        new_value: enabled,
      });
    } catch (error) {
      console.error('Error saving women’s health sync opt-in:', error);
      setHealthSyncOptIn(!enabled);
    }
  };

  const persistWeightUnit = async (u: WeightUnit) => {
    setWeightUnitState(u);
    try {
      await setWeightUnit(u);
      posthog.capture(posthogEventsNames.app.settingChanged, {
        setting_name: 'weight_unit',
        new_value: u,
      });
    } catch (error) {
      console.error('Error saving weight unit:', error);
      const prev = await getWeightUnit();
      setWeightUnitState(prev);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadWeightUnit();
      void loadCheckinSettings();
    }, [])
  );

  const handleUpdatePreferences = () => {
    // Do not flip the `onboarded` flag here. The boot redirect in `app/_layout.tsx`
    // only fires on cold start; navigating here is enough to replay the flow.
    // The edit mode bypasses the new-device account question.
    router.push('/onboarding?mode=edit');
  };

  return (
    <AppSafeAreaView style={pageStyles.container}>
      <View style={pageStyles.header}>
        <TouchableOpacity
          style={pageStyles.headerBackButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={pageStyles.headerTitle}>General settings</Text>
        <View style={pageStyles.headerSpacer} />
      </View>

      <AppScrollView
        style={pageStyles.scroll}
        contentContainerStyle={pageStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={pageStyles.subtitle}>App-wide preferences.</Text>

        <View style={styles.settingsList}>
          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Weight units</Text>
              <Text style={styles.settingDescription}>
                Show and enter weights in {weightUnit === 'lb' ? 'lbs' : 'kg'}.
              </Text>
            </View>
            <View
              style={[
                styles.unitToggle,
                weightUnitLoading && styles.unitToggleDisabled,
              ]}
              accessibilityRole="radiogroup"
              accessibilityLabel="Weight units"
            >
              <TouchableOpacity
                style={[
                  styles.unitToggleOption,
                  weightUnit === 'kg' && styles.unitToggleOptionActive,
                ]}
                onPress={() => persistWeightUnit('kg')}
                disabled={weightUnitLoading}
                accessibilityRole="radio"
                accessibilityState={{
                  selected: weightUnit === 'kg',
                  disabled: weightUnitLoading,
                }}
              >
                <Text
                  style={[
                    styles.unitToggleText,
                    weightUnit === 'kg' && styles.unitToggleTextActive,
                  ]}
                >
                  kg
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.unitToggleOption,
                  weightUnit === 'lb' && styles.unitToggleOptionActive,
                ]}
                onPress={() => persistWeightUnit('lb')}
                disabled={weightUnitLoading}
                accessibilityRole="radio"
                accessibilityState={{
                  selected: weightUnit === 'lb',
                  disabled: weightUnitLoading,
                }}
              >
                <Text
                  style={[
                    styles.unitToggleText,
                    weightUnit === 'lb' && styles.unitToggleTextActive,
                  ]}
                >
                  lb
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleUpdatePreferences}
          >
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Update Preferences</Text>
              <Text style={styles.settingDescription}>
                Replay onboarding to update your name, gender, interests, and
                experience level.
              </Text>
            </View>
            <SmallChevron />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Daily check-in</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Women’s health module</Text>
              <Text style={styles.settingDescription}>
                Show cycle, symptom, and contraception behaviours in your
                check-in.
              </Text>
            </View>
            <Switch
              value={womensHealthVisible}
              onValueChange={(enabled) => {
                void persistWomensHealthVisible(enabled);
              }}
              disabled={checkinSettingsLoading}
              accessibilityLabel="Women’s health module"
            />
          </View>

          <View
            style={[styles.settingItem, !user && styles.settingItemDisabled]}
          >
            <View style={styles.settingContent}>
              <Text
                style={[
                  styles.settingTitle,
                  !user && styles.settingTitleDisabled,
                ]}
              >
                Sync women’s health
              </Text>
              <Text style={styles.settingDescription}>
                {user
                  ? 'Back up women’s health entries to your account. This is a separate choice from the general account backup — leave it off to keep them on this device only.'
                  : 'Create an account first. Women’s health entries are never backed up without this separate opt-in.'}
              </Text>
            </View>
            <Switch
              value={healthSyncOptIn}
              onValueChange={(enabled) => {
                void persistHealthSyncOptIn(enabled);
              }}
              disabled={checkinSettingsLoading || !user}
              accessibilityLabel="Sync women’s health"
            />
          </View>
        </View>
      </AppScrollView>
    </AppSafeAreaView>
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
    borderBottomColor: Colors.backgroundElevated,
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
