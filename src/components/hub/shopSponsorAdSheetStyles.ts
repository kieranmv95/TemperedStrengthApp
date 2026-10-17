import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const SHOP_DETAIL_LOGO_MAX_WIDTH = 200;
export const SHOP_DETAIL_LOGO_MAX_HEIGHT = 80;

export const shopSponsorAdSheetStyles = StyleSheet.create({
  logoPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.sm,
    borderRadius: radius.md,
  },
  logo: {
    width: SHOP_DETAIL_LOGO_MAX_WIDTH,
    maxWidth: '100%',
    height: SHOP_DETAIL_LOGO_MAX_HEIGHT,
  },
  description: {
    ...typography.body,
    color: color.textSecondary,
  },
  reviewAside: {
    gap: space.xs,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  reviewLabel: {
    ...typography.captionStrong,
    color: color.textPrimary,
  },
  reviewText: {
    ...typography.callout,
    color: color.textPrimary,
  },
  cta: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  ctaPressed: {
    backgroundColor: color.goldStrong,
  },
  ctaText: {
    ...typography.calloutStrong,
    color: color.onGold,
    textAlign: 'center',
  },
});
