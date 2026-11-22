import { Skeleton, StandardLayout } from '@/src/components/ds';
import { HealthConnectCard } from '@/src/components/zones/HealthConnectCard';
import { ZoneMethodInfoSheet } from '@/src/components/zones/ZoneMethodInfoSheet';
import { ZoneMethodToggle } from '@/src/components/zones/ZoneMethodToggle';
import { ZoneRangeList } from '@/src/components/zones/ZoneRangeList';
import {
  ZoneSettingsSheet,
  type ZoneSettingsSheetValues,
} from '@/src/components/zones/ZoneSettingsSheet';
import { zoneScreenStyles as styles } from '@/src/components/zones/zoneScreenStyles';
import { color } from '@/src/constants/tokens';
import { useHealthConnection } from '@/src/hooks/useHealthConnection';
import { useHeartRateZones } from '@/src/hooks/useHeartRateZones';
import { healthServiceName } from '@/src/services/health';
import type { ZoneMethod } from '@/src/types/heartRate';
import {
  ageFromDateOfBirth,
  resolveZoneMethod,
} from '@/src/utils/heartRateZones';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export function ZonesScreen() {
  const zones = useHeartRateZones();
  const health = useHealthConnection();
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [restingHrRequired, setRestingHrRequired] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [methodError, setMethodError] = useState<string | null>(null);
  const service = healthServiceName();

  const restingHrBpm = zones.restingHr?.bpm ?? null;
  const effectiveMethod = resolveZoneMethod(
    zones.settings.method,
    restingHrBpm
  );
  const advancedMissingRestingHr =
    zones.settings.method === 'karvonen' && restingHrBpm === null;
  const suggestedAge = health.dateOfBirth
    ? ageFromDateOfBirth(health.dateOfBirth)
    : null;

  const openSettings = (requireRestingHr: boolean) => {
    setRestingHrRequired(requireRestingHr);
    setSettingsVisible(true);
  };

  const handleSaveSettings = async ({
    age,
    restingHr,
  }: ZoneSettingsSheetValues) => {
    const method: ZoneMethod =
      restingHrRequired && restingHr !== null
        ? 'karvonen'
        : zones.settings.method;
    await zones.saveAgeAndMethod(age, method);
    if (restingHr === null) {
      if (zones.restingHr?.source === 'manual') {
        await zones.clearRestingHr();
      }
    } else if (restingHr !== restingHrBpm) {
      await zones.saveManualRestingHr(restingHr);
    }
  };

  const handleSelectMethod = (method: ZoneMethod) => {
    if (method === 'karvonen' && restingHrBpm === null) {
      openSettings(true);
      return;
    }
    setMethodError(null);
    zones.setMethod(method).catch((error: unknown) => {
      console.error('Error saving zone method:', error);
      setMethodError('Could not change the calculation. Try again.');
    });
  };

  const handleConnect = async () => {
    const result = await health.connect();
    if (result === 'connected' || result === 'noData') {
      await zones.refresh();
      if (zones.setupState === 'notSetUp') {
        openSettings(false);
      }
    }
  };

  const handleUseHealthValue = () => {
    zones.switchToHealthValue().catch((error: unknown) => {
      console.error('Error switching to Health resting heart rate:', error);
    });
  };

  return (
    <StandardLayout
      title="Heart rate zones"
      onBackPress={() => router.back()}
      titleAccessory={
        zones.setupState === 'notSetUp' ? null : (
          <Pressable
            style={styles.headerButton}
            onPress={() => openSettings(false)}
            accessibilityRole="button"
            accessibilityLabel="Edit age and resting heart rate"
          >
            <Ionicons
              name="settings-outline"
              size={22}
              color={color.textPrimary}
            />
          </Pressable>
        )
      }
    >
      <StandardLayout.Body>
        {zones.isLoading ? (
          <View style={styles.list}>
            <Skeleton
              width="100%"
              height={88}
              radius="md"
              accessibilityLabel="Loading heart rate zones"
            />
            <Skeleton width="100%" height={280} radius="md" />
          </View>
        ) : zones.error ? (
          <View style={styles.card}>
            <Text style={styles.errorText}>
              Could not load your heart rate zones.
            </Text>
            <Pressable
              style={styles.linkButton}
              onPress={() => {
                void zones.refresh();
              }}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
            {zones.setupState === 'notSetUp' ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Train by heart rate</Text>
                <Text style={styles.body}>
                  Zones turn effort into numbers. Tell us your age to see your
                  bpm for each zone, and add your resting heart rate for more
                  accurate advanced zones.
                </Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnPrimary,
                      pressed && styles.btnPrimaryPressed,
                    ]}
                    onPress={() => openSettings(false)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.btnPrimaryText}>Set up zones</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.body}>
                  You told us you are{' '}
                  <Text style={styles.bodyStrong}>{zones.age}</Text>
                  {zones.restingHr ? (
                    <>
                      {zones.restingHr.source === 'health'
                        ? `. Your resting heart rate from ${service} is `
                        : ' and have a resting heart rate of '}
                      <Text style={styles.bodyStrong}>
                        {zones.restingHr.bpm} bpm
                      </Text>
                      .
                    </>
                  ) : (
                    '. Add your resting heart rate for advanced zones.'
                  )}
                </Text>
                <ZoneMethodToggle
                  method={effectiveMethod}
                  onSelect={handleSelectMethod}
                  onOpenInfo={() => setInfoVisible(true)}
                />
                {advancedMissingRestingHr ? (
                  <View>
                    <Text style={styles.body}>
                      Advanced zones need your resting heart rate. Showing basic
                      zones until you add it.
                    </Text>
                    <Pressable
                      style={styles.linkButton}
                      onPress={() => openSettings(true)}
                      accessibilityRole="button"
                    >
                      <Text style={styles.linkText}>
                        Add resting heart rate
                      </Text>
                    </Pressable>
                  </View>
                ) : null}
                {methodError ? (
                  <Text style={styles.errorText}>{methodError}</Text>
                ) : null}
              </View>
            )}

            <ZoneRangeList ranges={zones.ranges} />

            <HealthConnectCard
              availability={health.availability}
              isConnected={health.isConnected}
              isConnecting={health.isConnecting}
              lastResult={health.lastResult}
              restingHr={zones.restingHr}
              healthSample={zones.healthSample}
              isRefreshingHealth={zones.isRefreshingHealth}
              onConnect={() => {
                void handleConnect();
              }}
              onEnterManually={() => openSettings(false)}
              onUseHealthValue={handleUseHealthValue}
            />
          </View>
        )}
      </StandardLayout.Body>

      <ZoneSettingsSheet
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
        onSave={handleSaveSettings}
        initialAge={zones.age}
        suggestedAge={suggestedAge}
        healthServiceName={service}
        initialRestingHr={restingHrBpm}
        restingHrRequired={restingHrRequired}
      />
      <ZoneMethodInfoSheet
        visible={infoVisible}
        onClose={() => setInfoVisible(false)}
      />
    </StandardLayout>
  );
}
