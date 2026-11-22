import type {
  GymTimerPreset,
  GymTimerRuntime,
  GymTimerSettings,
} from '@/src/types/gymTimer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';
import {
  GYM_TIMER_PRESETS_KEY,
  GYM_TIMER_RUNTIME_KEY,
  GYM_TIMER_SETTINGS_KEY,
} from './keys';

export const DEFAULT_GYM_TIMER_SETTINGS: GymTimerSettings = {
  leadInSec: 10,
  defaultMuted: false,
};

export async function saveGymTimerRuntime(
  runtime: GymTimerRuntime | null
): Promise<void> {
  try {
    if (!runtime || runtime.viewState === 'closed') {
      await AsyncStorage.removeItem(GYM_TIMER_RUNTIME_KEY);
      return;
    }
    await AsyncStorage.setItem(GYM_TIMER_RUNTIME_KEY, JSON.stringify(runtime));
  } catch (error) {
    console.error('Error saving gym timer runtime:', error);
  }
}

export async function getGymTimerRuntime(): Promise<GymTimerRuntime | null> {
  try {
    const raw = await AsyncStorage.getItem(GYM_TIMER_RUNTIME_KEY);
    return raw ? (JSON.parse(raw) as GymTimerRuntime) : null;
  } catch (error) {
    console.error('Error reading gym timer runtime:', error);
    return null;
  }
}

export async function clearGymTimerRuntime(): Promise<void> {
  try {
    await AsyncStorage.removeItem(GYM_TIMER_RUNTIME_KEY);
  } catch (error) {
    console.error('Error clearing gym timer runtime:', error);
  }
}

export async function getGymTimerSettings(): Promise<GymTimerSettings> {
  try {
    const raw = await AsyncStorage.getItem(GYM_TIMER_SETTINGS_KEY);
    if (!raw) return DEFAULT_GYM_TIMER_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<GymTimerSettings>;
    const leadInSec =
      parsed.leadInSec === 0 ||
      parsed.leadInSec === 5 ||
      parsed.leadInSec === 10
        ? parsed.leadInSec
        : DEFAULT_GYM_TIMER_SETTINGS.leadInSec;
    return {
      leadInSec,
      defaultMuted: parsed.defaultMuted === true,
    };
  } catch (error) {
    console.error('Error reading gym timer settings:', error);
    return DEFAULT_GYM_TIMER_SETTINGS;
  }
}

export async function setGymTimerSettings(
  settings: GymTimerSettings
): Promise<void> {
  try {
    await syncSetItem(GYM_TIMER_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving gym timer settings:', error);
  }
}

export async function getGymTimerPresets(): Promise<GymTimerPreset[]> {
  try {
    const raw = await AsyncStorage.getItem(GYM_TIMER_PRESETS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GymTimerPreset[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading gym timer presets:', error);
    return [];
  }
}

export async function saveGymTimerPresets(
  presets: GymTimerPreset[]
): Promise<void> {
  try {
    await syncSetItem(GYM_TIMER_PRESETS_KEY, JSON.stringify(presets));
  } catch (error) {
    console.error('Error saving gym timer presets:', error);
  }
}

export async function clearGymTimerPresets(): Promise<void> {
  try {
    await syncRemoveItem(GYM_TIMER_PRESETS_KEY);
  } catch (error) {
    console.error('Error clearing gym timer presets:', error);
  }
}
