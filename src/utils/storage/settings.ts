// User-level settings and onboarding flags.
import type { OnboardingProfile } from '@/src/types/onboarding';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';
import {
  AUTO_PB_DETECTION_IN_PROGRAMS_ENABLED_KEY,
  AUTO_REST_TIMERS_ENABLED_KEY,
  DEV_PRO_OVERRIDE_ENABLED_KEY,
  ONBOARDED_KEY,
  ONBOARDING_PROFILE_KEY,
  PROGRAM_COOLDOWN_MODULE_ENABLED_KEY,
  PROGRAM_SHOW_START_SESSION_BUTTON_KEY,
  PROGRAM_WARMUP_MODULE_ENABLED_KEY,
  PROMO_PRO_GRANT_KEY,
  WEIGHT_UNIT_KEY,
} from './keys';

export type WeightUnit = 'kg' | 'lb';

export type PromoProGrant = {
  code: string;
  email: string;
  redeemedAt: string;
  daysGranted: number;
  expiresAt: string;
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function parsePromoProGrant(raw: string | null): PromoProGrant | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return null;
    }
    const record = parsed as Record<string, unknown>;
    const code = typeof record.code === 'string' ? record.code.trim() : '';
    const email = typeof record.email === 'string' ? record.email.trim() : '';
    const redeemedAt =
      typeof record.redeemedAt === 'string' ? record.redeemedAt : '';
    const expiresAt =
      typeof record.expiresAt === 'string' ? record.expiresAt : '';
    const daysGranted =
      typeof record.daysGranted === 'number' &&
      Number.isFinite(record.daysGranted)
        ? record.daysGranted
        : NaN;

    if (
      code.length === 0 ||
      email.length === 0 ||
      redeemedAt.length === 0 ||
      expiresAt.length === 0 ||
      !Number.isFinite(daysGranted) ||
      daysGranted <= 0
    ) {
      return null;
    }

    const expiresMs = Date.parse(expiresAt);
    const redeemedMs = Date.parse(redeemedAt);
    if (Number.isNaN(expiresMs) || Number.isNaN(redeemedMs)) {
      return null;
    }

    return {
      code,
      email,
      redeemedAt,
      daysGranted,
      expiresAt,
    };
  } catch {
    return null;
  }
}

export const getPromoProGrant = async (): Promise<PromoProGrant | null> => {
  try {
    const raw = await AsyncStorage.getItem(PROMO_PRO_GRANT_KEY);
    return parsePromoProGrant(raw);
  } catch (error) {
    console.error('Error getting promo Pro grant:', error);
    return null;
  }
};

export const isPromoProGrantActive = (
  grant: PromoProGrant | null,
  now: Date = new Date()
): boolean => {
  if (!grant) return false;
  const expiresMs = Date.parse(grant.expiresAt);
  if (Number.isNaN(expiresMs)) return false;
  return expiresMs > now.getTime();
};

export const buildPromoProGrant = (input: {
  code: string;
  email: string;
  daysGranted: number;
  redeemedAt?: Date;
}): PromoProGrant => {
  const redeemedAt = input.redeemedAt ?? new Date();
  const expiresAt = new Date(
    redeemedAt.getTime() + input.daysGranted * MS_PER_DAY
  );
  return {
    code: input.code.trim().toUpperCase(),
    email: input.email.trim(),
    redeemedAt: redeemedAt.toISOString(),
    daysGranted: input.daysGranted,
    expiresAt: expiresAt.toISOString(),
  };
};

export const setPromoProGrant = async (grant: PromoProGrant): Promise<void> => {
  try {
    await syncSetItem(PROMO_PRO_GRANT_KEY, JSON.stringify(grant));
  } catch (error) {
    console.error('Error setting promo Pro grant:', error);
    throw error;
  }
};

export const clearPromoProGrant = async (): Promise<void> => {
  try {
    await syncRemoveItem(PROMO_PRO_GRANT_KEY);
  } catch (error) {
    console.error('Error clearing promo Pro grant:', error);
    throw error;
  }
};

export const getOnboarded = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(ONBOARDED_KEY);
    return raw === 'true';
  } catch (error) {
    console.error('Error getting onboarded flag:', error);
    return false;
  }
};

export const setOnboarded = async (next: boolean): Promise<void> => {
  try {
    await syncSetItem(ONBOARDED_KEY, next ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting onboarded flag:', error);
    throw error;
  }
};

export const getOnboardingProfile =
  async (): Promise<OnboardingProfile | null> => {
    try {
      const raw = await AsyncStorage.getItem(ONBOARDING_PROFILE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as unknown;
      if (
        typeof parsed !== 'object' ||
        parsed === null ||
        Array.isArray(parsed)
      ) {
        return null;
      }
      return parsed as OnboardingProfile;
    } catch (error) {
      console.error('Error getting onboarding profile:', error);
      return null;
    }
  };

export const setOnboardingProfile = async (
  profile: OnboardingProfile
): Promise<void> => {
  try {
    await syncSetItem(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error setting onboarding profile:', error);
    throw error;
  }
};

/**
 * Clears both the `onboarded` flag and the stored `onboarding_profile`.
 * Used by dev tooling to fully reset onboarding for testing.
 */
export const clearOnboarding = async (): Promise<void> => {
  try {
    await syncRemoveItem(ONBOARDED_KEY);
    await syncRemoveItem(ONBOARDING_PROFILE_KEY);
  } catch (error) {
    console.error('Error clearing onboarding:', error);
    throw error;
  }
};

export const getWeightUnit = async (): Promise<WeightUnit> => {
  try {
    const raw = await AsyncStorage.getItem(WEIGHT_UNIT_KEY);
    return raw === 'lb' || raw === 'kg' ? raw : 'kg';
  } catch (error) {
    console.error('Error getting weight unit:', error);
    return 'kg';
  }
};

export const setWeightUnit = async (unit: WeightUnit): Promise<void> => {
  try {
    await syncSetItem(WEIGHT_UNIT_KEY, unit);
  } catch (error) {
    console.error('Error setting weight unit:', error);
    throw error;
  }
};

export const getDevProOverrideEnabled = async (): Promise<boolean> => {
  if (!__DEV__) return false;

  try {
    const raw = await AsyncStorage.getItem(DEV_PRO_OVERRIDE_ENABLED_KEY);
    return raw === 'true';
  } catch (error) {
    console.error('Error getting dev Pro override enabled:', error);
    return false;
  }
};

export const setDevProOverrideEnabled = async (
  enabled: boolean
): Promise<void> => {
  if (!__DEV__) return;

  try {
    await AsyncStorage.setItem(
      DEV_PRO_OVERRIDE_ENABLED_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    console.error('Error setting dev Pro override enabled:', error);
    throw error;
  }
};

export const getAutoRestTimersEnabled = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(AUTO_REST_TIMERS_ENABLED_KEY);
    if (raw === null) return true;
    return raw === 'true';
  } catch (error) {
    console.error('Error getting auto rest timers enabled:', error);
    return true;
  }
};

export const setAutoRestTimersEnabled = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(AUTO_REST_TIMERS_ENABLED_KEY, enabled ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting auto rest timers enabled:', error);
    throw error;
  }
};

/**
 * Controls whether the app should automatically detect potential personal bests
 * during program workouts and show the “New personal best” prompt.
 */
export const getAutoPbDetectionInProgramsEnabled =
  async (): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(
        AUTO_PB_DETECTION_IN_PROGRAMS_ENABLED_KEY
      );
      if (raw === null) return true;
      return raw === 'true';
    } catch (error) {
      console.error(
        'Error getting auto PB detection in programs enabled:',
        error
      );
      return true;
    }
  };

export const setAutoPbDetectionInProgramsEnabled = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(
      AUTO_PB_DETECTION_IN_PROGRAMS_ENABLED_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    console.error(
      'Error setting auto PB detection in programs enabled:',
      error
    );
    throw error;
  }
};

export const getProgramWarmupModuleEnabled = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(PROGRAM_WARMUP_MODULE_ENABLED_KEY);
    if (raw === null) return false;
    return raw === 'true';
  } catch (error) {
    console.error('Error getting program warmup module enabled:', error);
    return false;
  }
};

export const setProgramWarmupModuleEnabled = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(
      PROGRAM_WARMUP_MODULE_ENABLED_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    console.error('Error setting program warmup module enabled:', error);
    throw error;
  }
};

export const getProgramCooldownModuleEnabled = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(PROGRAM_COOLDOWN_MODULE_ENABLED_KEY);
    if (raw === null) return false;
    return raw === 'true';
  } catch (error) {
    console.error('Error getting program cooldown module enabled:', error);
    return false;
  }
};

export const setProgramCooldownModuleEnabled = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(
      PROGRAM_COOLDOWN_MODULE_ENABLED_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    console.error('Error setting program cooldown module enabled:', error);
    throw error;
  }
};

export const getProgramShowStartSessionButton = async (): Promise<boolean> => {
  try {
    const raw = await AsyncStorage.getItem(
      PROGRAM_SHOW_START_SESSION_BUTTON_KEY
    );
    if (raw === null) return true;
    return raw === 'true';
  } catch (error) {
    console.error('Error getting program show start session button:', error);
    return true;
  }
};

export const setProgramShowStartSessionButton = async (
  enabled: boolean
): Promise<void> => {
  try {
    await syncSetItem(
      PROGRAM_SHOW_START_SESSION_BUTTON_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    console.error('Error setting program show start session button:', error);
    throw error;
  }
};
