import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { useSyncManager } from '@/src/hooks/sync-manager-context';
import {
  getWeightUnit,
  setOnboarded,
  setWeightUnit,
  type WeightUnit,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AccountGeneralSettingsScreen() {
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>('kg');
  const [weightUnitLoading, setWeightUnitLoading] = useState<boolean>(true);
  const { enabled: iCloudSyncEnabled, isAvailable, setEnabled } = useSyncManager();

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

  const handleUpdatePreferences = async () => {
    try {
      await setOnboarded(false);
      router.push('/onboarding');
    } catch (error) {
      console.error('Error starting onboarding replay:', error);
      Alert.alert('Error', 'Failed to start onboarding. Please try again.');
    }
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
        <Text style={pageStyles.headerTitle}>General settings</Text>
        <View style={pageStyles.headerSpacer} />
      </View>

      <ScrollView
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
              style={[styles.unitToggle, weightUnitLoading && styles.unitToggleDisabled]}
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

          {Platform.OS === 'ios' && (
            <View style={styles.settingItem}>
              <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>iCloud Sync</Text>
                <Text style={styles.settingDescription}>
                  Keep a backup of your data in iCloud. AsyncStorage stays primary; iCloud is used
                  for backup and restore.
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

          <TouchableOpacity style={styles.settingItem} onPress={handleUpdatePreferences}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Update Preferences</Text>
              <Text style={styles.settingDescription}>
                Replay onboarding to update your name, gender, interests, and experience level.
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
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

