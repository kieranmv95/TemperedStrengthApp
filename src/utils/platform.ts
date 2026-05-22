import { Spacing } from '@/src/constants/theme';
import { Platform } from 'react-native';

/** True when running on iOS (iCloud sync and related UI are iOS-only). */
export const isIos = Platform.OS === 'ios';

/** Bottom padding for bottom-sheet modals (safe area + platform-appropriate spacing). */
export function modalSheetBottomPadding(safeBottom: number): number {
  if (isIos) {
    return safeBottom + Spacing.xl;
  }
  return Math.max(safeBottom, Spacing.lg);
}
