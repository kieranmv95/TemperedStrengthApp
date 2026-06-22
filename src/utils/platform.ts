import { Spacing } from '@/src/constants/theme';
import { Platform } from 'react-native';

/** True when running on iOS (iCloud sync and related UI are iOS-only). */
export const isIos = Platform.OS === 'ios';

/** Typical Android gesture-navigation bar height when edge-to-edge reports 0. */
const ANDROID_GESTURE_NAV_INSET = 48;

/** Bottom inset with a floor on Android for gesture navigation. */
export function getEffectiveBottomInset(inset: number): number {
  if (Platform.OS !== 'android') {
    return inset;
  }
  return Math.max(inset, ANDROID_GESTURE_NAV_INSET);
}

/** Bottom padding for bottom-sheet modals (safe area + platform-appropriate spacing). */
export function modalSheetBottomPadding(safeBottom: number): number {
  const bottom = getEffectiveBottomInset(safeBottom);
  if (isIos) {
    return bottom + Spacing.xl;
  }
  return Math.max(bottom, Spacing.lg);
}
