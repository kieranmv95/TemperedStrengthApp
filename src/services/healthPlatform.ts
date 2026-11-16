import type { HealthAvailability, RestingHeartRateSample } from './healthTypes';

// Fallback for web and any platform without a Health implementation.

export async function getHealthAvailability(): Promise<HealthAvailability> {
  return 'unavailable';
}

export async function requestRestingHeartRateAccess(): Promise<boolean> {
  return false;
}

export async function getLatestRestingHeartRate(): Promise<RestingHeartRateSample | null> {
  return null;
}

export async function getDateOfBirth(): Promise<Date | null> {
  return null;
}
