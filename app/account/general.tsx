import { SmallChevron } from '@/src/components/ds/SmallChevron';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { isIos } from '@/src/utils/platform';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  getWeightUnit,
  setWeightUnit,
  type WeightUnit,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSafeAreaView, AppScrollView } from '@/src/components/AppSafeAreaView';

export default function AccountGeneralSettingsScreen() {
  const posthog = usePostHog();
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('kg');
  const [weightUnitLoading, setWeightUnitLoading] = useState<boolean>(true);
  const {
    enabled: iCloudSyncEnabled,
    isAvailable,
    setEnabled,
  } = useSyncManager();

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
    }, [])
  );

  const handleUpdatePreferences = () => {
    // Do not flip the `onboarded` flag here. The boot redirect in `app/_layout.tsx`
    // only fires on cold start; navigating here is enough to replay the flow.
    // Flipping it to `false` previously meant an aborted replay (or iCloud mirror)
    // could push already-onboarded users — including other devices — back into onboarding.
    router.push('/onboarding');
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

          {isIos ? (
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
                    posthog.capture(posthogEventsNames.app.settingChanged, {
                      setting_name: 'icloud_sync',
                      new_value: 'false',
                    });
                    return;
                  }

                  const result = await setEnabled(true);
                  if (!result.isAvailable) {
                    Alert.alert(
                      'iCloud Unavailable',
                      "We couldn't access iCloud on this device/account. Your data will remain local only."
                    );
                    await setEnabled(false);
                    posthog.capture(posthogEventsNames.app.settingChanged, {
                      setting_name: 'icloud_sync',
                      new_value: 'false',
                    });
                  } else {
                    posthog.capture(posthogEventsNames.app.settingChanged, {
                      setting_name: 'icloud_sync',
                      new_value: 'true',
                    });
                  }
                }}
              />
            </View>
          ) : null}

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
