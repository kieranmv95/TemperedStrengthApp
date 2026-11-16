import { color } from '@/src/constants/tokens';
import type { HealthConnectResult } from '@/src/hooks/useHealthConnection';
import {
  healthServiceName,
  openHealthConnectInstallPage,
} from '@/src/services/health';
import type {
  HealthAvailability,
  RestingHeartRateSample,
} from '@/src/services/healthTypes';
import type { RestingHeartRate } from '@/src/types/heartRate';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { zoneScreenStyles as styles } from './zoneScreenStyles';

type HealthConnectCardProps = {
  availability: HealthAvailability | null;
  isConnected: boolean;
  isConnecting: boolean;
  lastResult: HealthConnectResult;
  restingHr: RestingHeartRate | null;
  healthSample: RestingHeartRateSample | null;
  isRefreshingHealth: boolean;
  onConnect: () => void;
  onEnterManually: () => void;
  onUseHealthValue: () => void;
};

function noDataCopy(service: string): string {
  if (Platform.OS === 'ios') {
    return `No resting heart rate found in ${service}. It is usually recorded by Apple Watch. You can enter it manually instead.`;
  }
  return `No resting heart rate found in ${service}. Your wearable app needs to share resting heart rate with ${service}. You can enter it manually instead.`;
}

function formatReadingDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

type CardButtonProps = {
  label: string;
  onPress: () => void;
  variant: 'primary' | 'ghost';
  disabled?: boolean;
  accessibilityHint?: string;
};

function CardButton({
  label,
  onPress,
  variant,
  disabled = false,
  accessibilityHint,
}: CardButtonProps) {
  if (variant === 'ghost') {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.btnGhost,
          pressed && styles.btnGhostPressed,
        ]}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        <Text style={styles.btnGhostText}>{label}</Text>
      </Pressable>
    );
  }
  return (
    <Pressable
      style={({ pressed }) => [
        styles.btnPrimary,
        pressed && !disabled && styles.btnPrimaryPressed,
        disabled && styles.btnPrimaryDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled, busy: disabled }}
    >
      <Text
        style={[
          styles.btnPrimaryText,
          disabled && styles.btnPrimaryTextDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Connects Apple Health / Health Connect as a resting heart rate source.
 * Hidden when Health is unavailable on this device.
 */
export function HealthConnectCard({
  availability,
  isConnected,
  isConnecting,
  lastResult,
  restingHr,
  healthSample,
  isRefreshingHealth,
  onConnect,
  onEnterManually,
  onUseHealthValue,
}: HealthConnectCardProps) {
  const service = healthServiceName();

  if (availability === null || availability === 'unavailable') {
    return null;
  }

  if (availability === 'needsInstall') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Install {service}</Text>
        <Text style={styles.body}>
          Install or update {service} to pull your resting heart rate
          automatically.
        </Text>
        <View style={styles.buttonRow}>
          <CardButton
            label={`Install ${service}`}
            variant="primary"
            onPress={() => {
              void openHealthConnectInstallPage();
            }}
            accessibilityHint="Opens the Play Store"
          />
        </View>
      </View>
    );
  }

  if (!isConnected) {
    return (
      <View style={styles.card}>
        <View style={styles.methodRow}>
          <Ionicons name="heart-outline" size={20} color={color.gold} />
          <Text style={styles.cardTitle}>Connect {service}</Text>
        </View>
        <Text style={styles.body}>
          Pull your resting heart rate automatically to use advanced zones.{' '}
          {Platform.OS === 'ios'
            ? 'We only read resting heart rate and date of birth.'
            : 'We only read resting heart rate.'}
        </Text>
        {lastResult === 'denied' ? (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            Access was not granted. You can allow it in Settings, or enter your
            resting heart rate manually.
          </Text>
        ) : null}
        {lastResult === 'error' ? (
          <Text style={styles.errorText} accessibilityLiveRegion="polite">
            Could not reach {service}. Try again, or enter your resting heart
            rate manually.
          </Text>
        ) : null}
        <View style={styles.buttonRow}>
          <CardButton
            label={isConnecting ? 'Connecting…' : `Connect ${service}`}
            variant="primary"
            onPress={onConnect}
            disabled={isConnecting}
          />
          {lastResult === 'denied' || lastResult === 'error' ? (
            <CardButton
              label="Enter manually"
              variant="ghost"
              onPress={onEnterManually}
            />
          ) : null}
        </View>
      </View>
    );
  }

  const showNoData =
    !isRefreshingHealth &&
    healthSample === null &&
    restingHr?.source !== 'health' &&
    (lastResult === 'noData' || restingHr === null);

  if (showNoData) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Connected to {service}</Text>
        <Text style={styles.body}>{noDataCopy(service)}</Text>
        <View style={styles.buttonRow}>
          <CardButton
            label="Enter manually"
            variant="primary"
            onPress={onEnterManually}
          />
        </View>
      </View>
    );
  }

  const healthDiffersFromManual =
    healthSample !== null &&
    restingHr?.source === 'manual' &&
    healthSample.bpm !== restingHr.bpm;

  return (
    <View style={styles.card}>
      <View style={styles.methodRow}>
        <Ionicons name="checkmark-circle" size={20} color={color.success} />
        <Text style={styles.cardTitle}>Connected to {service}</Text>
      </View>
      {healthDiffersFromManual && healthSample ? (
        <>
          <Text style={styles.body}>
            {service} has a resting heart rate of {healthSample.bpm} bpm. You
            are using {restingHr?.bpm} bpm that you entered.
          </Text>
          <View style={styles.buttonRow}>
            <CardButton
              label={`Use ${service} value`}
              variant="primary"
              onPress={onUseHealthValue}
            />
          </View>
        </>
      ) : restingHr?.source === 'health' ? (
        <>
          <Text style={styles.body}>
            Resting heart rate {restingHr.bpm} bpm, recorded{' '}
            {formatReadingDate(restingHr.recordedAt)}.
          </Text>
          <Pressable
            style={styles.linkButton}
            onPress={onEnterManually}
            accessibilityRole="button"
          >
            <Text style={styles.linkText}>Enter manually instead</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.body}>
          {isRefreshingHealth
            ? 'Checking for a new resting heart rate…'
            : 'Using the resting heart rate you entered.'}
        </Text>
      )}
    </View>
  );
}
