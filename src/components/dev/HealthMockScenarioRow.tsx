import { BottomSheet, PressableCard } from '@/src/components/ds';
import { settingsScreenStyles as styles } from '@/src/components/settings/settingsScreenStyles';
import {
  color,
  MIN_TARGET_SIZE,
  space,
  typography,
} from '@/src/constants/tokens';
import {
  HEALTH_MOCK_SCENARIOS,
  type HealthMockScenario,
} from '@/src/services/healthTypes';
import {
  clearHealthRestingHeartRate,
  getDevHealthMockScenario,
  setDevHealthMockScenario,
  setHealthConnected,
} from '@/src/utils/storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

const SCENARIO_COPY: Record<
  HealthMockScenario,
  { label: string; description: string }
> = {
  off: {
    label: 'Off',
    description: 'Use the real Health integration (unavailable in Expo Go).',
  },
  connected: {
    label: 'Connected',
    description: 'Access granted. Resting HR 52 bpm, born 1993.',
  },
  noData: {
    label: 'No data',
    description: 'Access granted, but no resting heart rate recorded.',
  },
  denied: {
    label: 'Denied',
    description: 'The permission request is refused.',
  },
  needsInstall: {
    label: 'Needs install',
    description: 'Health Connect is missing or out of date (Android).',
  },
  error: {
    label: 'Error',
    description: 'Every Health call throws.',
  },
};

/**
 * Dev-only: pick a canned Health response so the Zones connect flow can be
 * seen in Expo Go. Switching resets the connection and cached Health value.
 */
export function HealthMockScenarioRow() {
  const [scenario, setScenario] = useState<HealthMockScenario>('off');
  const [sheetVisible, setSheetVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      void getDevHealthMockScenario().then((next) => {
        if (!cancelled) setScenario(next);
      });
      return () => {
        cancelled = true;
      };
    }, [])
  );

  const handleSelect = async (next: HealthMockScenario) => {
    setSheetVisible(false);
    if (next === scenario) return;
    try {
      await setDevHealthMockScenario(next);
      await setHealthConnected(false);
      await clearHealthRestingHeartRate();
      setScenario(next);
    } catch (error) {
      console.error('Error changing health mock scenario:', error);
      Alert.alert('Error', 'Could not change the mock health scenario.');
    }
  };

  const current = SCENARIO_COPY[scenario];

  return (
    <>
      <PressableCard
        onPress={() => setSheetVisible(true)}
        accessibilityLabel={`Mock health data, ${current.label}`}
        accessibilityHint="Choose a mocked Apple Health or Health Connect response"
      >
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>Mock health data</Text>
          <Text style={styles.settingDescription}>
            {current.label}: {current.description}
          </Text>
        </View>
      </PressableCard>
      <BottomSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        title="Mock health data"
      >
        <View accessibilityRole="radiogroup">
          {HEALTH_MOCK_SCENARIOS.map((option) => {
            const selected = option === scenario;
            const copy = SCENARIO_COPY[option];
            return (
              <Pressable
                key={option}
                style={({ pressed }) => [
                  localStyles.option,
                  pressed && localStyles.optionPressed,
                ]}
                onPress={() => {
                  void handleSelect(option);
                }}
                accessibilityRole="radio"
                accessibilityLabel={`${copy.label}, ${copy.description}`}
                accessibilityState={{ checked: selected }}
              >
                <Ionicons
                  name={selected ? 'radio-button-on' : 'radio-button-off'}
                  size={22}
                  color={selected ? color.gold : color.textSecondary}
                />
                <View style={localStyles.optionText}>
                  <Text style={localStyles.optionLabel}>{copy.label}</Text>
                  <Text style={localStyles.optionDescription}>
                    {copy.description}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </>
  );
}

const localStyles = StyleSheet.create({
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    paddingVertical: space.xs,
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  optionLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  optionDescription: {
    ...typography.caption,
    color: color.textSecondary,
  },
});
