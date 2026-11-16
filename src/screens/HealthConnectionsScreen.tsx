import { Skeleton, StandardLayout } from '@/src/components/ds';
import { HealthConnectCard } from '@/src/components/zones/HealthConnectCard';
import { zoneScreenStyles as styles } from '@/src/components/zones/zoneScreenStyles';
import { useHealthConnection } from '@/src/hooks/useHealthConnection';
import { useHeartRateZones } from '@/src/hooks/useHeartRateZones';
import { healthServiceName } from '@/src/services/health';
import { router } from 'expo-router';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';

function revokeAccessCopy(service: string): string {
  if (Platform.OS === 'ios') {
    return `To remove access completely, open the Settings app, then Health, Data Access & Devices, Tempered Strength.`;
  }
  return `To remove access completely, open ${service}, then App permissions, Tempered Strength.`;
}

/**
 * Health data sources connected to the app. Today that is resting heart rate
 * for heart rate zones; future health data types belong here too.
 */
export function HealthConnectionsScreen() {
  const health = useHealthConnection();
  const zones = useHeartRateZones();
  const service = healthServiceName();

  const handleConnect = async () => {
    const result = await health.connect();
    if (result === 'connected' || result === 'noData') {
      await zones.refresh();
    }
  };

  const handleDisconnect = async () => {
    await health.disconnect();
    await zones.refresh();
  };

  const handleUseHealthValue = () => {
    zones.switchToHealthValue().catch((error: unknown) => {
      console.error('Error switching to Health resting heart rate:', error);
    });
  };

  return (
    <StandardLayout
      title="Health connections"
      subtitle={service}
      onBackPress={() => router.back()}
    >
      <StandardLayout.Body>
        {health.availability === null ? (
          <Skeleton
            width="100%"
            height={140}
            radius="md"
            accessibilityLabel="Loading health connections"
          />
        ) : health.availability === 'unavailable' ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{service} is not available</Text>
            <Text style={styles.body}>
              Health data is not available on this device. You can still enter
              your resting heart rate manually in heart rate zones.
            </Text>
            <Pressable
              style={styles.linkButton}
              onPress={() => router.push('/zones')}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>Open heart rate zones</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.list}>
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
              onEnterManually={() => router.push('/zones')}
              onUseHealthValue={handleUseHealthValue}
            />

            <View style={styles.card}>
              <Text style={styles.cardTitle}>What we read</Text>
              <Text style={styles.body}>
                Resting heart rate, to calculate your heart rate zones.
                {Platform.OS === 'ios'
                  ? ' Date of birth, to suggest your age.'
                  : ''}{' '}
                We never write to {service}, and your resting heart rate stays
                on this device.
              </Text>
            </View>

            {health.isConnected ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Disconnect</Text>
                <Text style={styles.body}>{revokeAccessCopy(service)}</Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.btnGhost,
                      pressed && styles.btnGhostPressed,
                    ]}
                    onPress={() => {
                      void handleDisconnect();
                    }}
                    accessibilityRole="button"
                    accessibilityHint={`Stops Tempered Strength reading ${service}`}
                  >
                    <Text style={styles.btnGhostText}>
                      Stop reading {service}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </StandardLayout.Body>
    </StandardLayout>
  );
}
