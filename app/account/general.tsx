import {
  PressableCard,
  SectionHeader,
  StandardLayout,
} from '@/src/components/ds';
import {
  settingsScreenStyles as styles,
  settingsSwitchColors,
} from '@/src/components/settings/settingsScreenStyles';
import { color } from '@/src/constants/tokens';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import { useLargeText } from '@/src/hooks/useLargeText';
import { posthogEventsNames } from '@/src/services/posthogEvents';
import {
  getCheckinSettings,
  getWeightUnit,
  setWeightUnit,
  updateCheckinSettings,
  type WeightUnit,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, router } from 'expo-router';
import { usePostHog } from 'posthog-react-native';
import React, { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

type UnitOptionProps = {
  unit: WeightUnit;
  selected: boolean;
  disabled: boolean;
  onPress: () => void;
};

function UnitOption({ unit, selected, disabled, onPress }: UnitOptionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.unitToggleOption,
        selected && styles.unitToggleOptionActive,
        pressed && !selected && styles.unitToggleOptionPressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={unit === 'kg' ? 'Kilograms' : 'Pounds'}
      accessibilityState={{ selected, disabled }}
    >
      {selected ? (
        <Ionicons
          name="checkmark"
          size={16}
          color={color.gold}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      ) : null}
      <Text
        style={[styles.unitToggleText, selected && styles.unitToggleTextActive]}
      >
        {unit}
      </Text>
    </Pressable>
  );
}

export default function AccountGeneralSettingsScreen() {
  const posthog = usePostHog();
  const largeText = useLargeText();
  const { user } = useSyncManager();
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('kg');
  const [weightUnitLoading, setWeightUnitLoading] = useState<boolean>(true);
  const [womensHealthVisible, setWomensHealthVisible] = useState<boolean>(true);
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

  const healthSyncDescription = user
    ? 'Back up women’s health entries to your account. This is a separate choice from the general account backup — leave it off to keep them on this device only.'
    : 'Create an account first. Women’s health entries are never backed up without this separate opt-in.';

  return (
    <StandardLayout
      title="General settings"
      subtitle="App-wide preferences."
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        <View style={styles.settingsList}>
          <View style={styles.settingsSection}>
            <View
              style={[
                styles.settingItem,
                largeText && styles.settingItemStacked,
              ]}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Weight units</Text>
                <Text style={styles.settingDescription}>
                  Show and enter weights in {weightUnit === 'lb' ? 'lbs' : 'kg'}
                  .
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
                <UnitOption
                  unit="kg"
                  selected={weightUnit === 'kg'}
                  disabled={weightUnitLoading}
                  onPress={() => persistWeightUnit('kg')}
                />
                <UnitOption
                  unit="lb"
                  selected={weightUnit === 'lb'}
                  disabled={weightUnitLoading}
                  onPress={() => persistWeightUnit('lb')}
                />
              </View>
            </View>

            <PressableCard
              onPress={handleUpdatePreferences}
              accessibilityLabel="Update preferences, replay onboarding to update your name, gender, interests, and experience level"
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Update preferences</Text>
                <Text style={styles.settingDescription}>
                  Replay onboarding to update your name, gender, interests, and
                  experience level.
                </Text>
              </View>
            </PressableCard>
          </View>

          <View style={styles.settingsSection}>
            <SectionHeader title="Daily check-in" />

            <View
              style={[
                styles.settingItem,
                largeText && styles.settingItemStacked,
              ]}
            >
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>Women’s health module</Text>
                <Text style={styles.settingDescription}>
                  Show cycle, symptom, and contraception behaviours in your
                  check-in.
                </Text>
              </View>
              <Switch
                {...settingsSwitchColors}
                value={womensHealthVisible}
                onValueChange={(enabled) => {
                  void persistWomensHealthVisible(enabled);
                }}
                disabled={checkinSettingsLoading}
                accessibilityLabel="Women’s health module"
                accessibilityHint="Shows cycle, symptom, and contraception behaviours in your check-in"
              />
            </View>

            <View
              style={[
                styles.settingItem,
                largeText && styles.settingItemStacked,
              ]}
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
                  {healthSyncDescription}
                </Text>
              </View>
              <Switch
                {...settingsSwitchColors}
                value={healthSyncOptIn}
                onValueChange={(enabled) => {
                  void persistHealthSyncOptIn(enabled);
                }}
                disabled={checkinSettingsLoading || !user}
                accessibilityLabel="Sync women’s health"
                accessibilityHint={healthSyncDescription}
              />
            </View>
          </View>
        </View>
      </StandardLayout.Body>
    </StandardLayout>
  );
}
