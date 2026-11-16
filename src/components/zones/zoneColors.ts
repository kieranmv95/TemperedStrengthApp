import { color } from '@/src/constants/tokens';
import type { HeartRateZoneId } from '@/src/types/heartRate';

/** Every zone colour pairs with `ZONE_TILE_FOREGROUND` in the contrast test. */
export const ZONE_COLORS: Record<HeartRateZoneId, string> = {
  1: color.textSecondary,
  2: color.success,
  3: color.gold,
  4: color.danger,
  5: color.violet,
};

export const ZONE_TILE_FOREGROUND = color.bg;
