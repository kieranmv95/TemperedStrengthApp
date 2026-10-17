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

const ACCENT_EDGE_WIDTH = 4;

export const shopSponsorAdSheetStyles = StyleSheet.create({
  identity: {
    flexDirection: 'row',
    gap: space.sm,
  },
  accentEdge: {
    width: ACCENT_EDGE_WIDTH,
    borderRadius: radius.pill,
  },
  identityContent: {
    flex: 1,
    gap: space.xs,
  },
  overline: {
    ...typography.overline,
    color: color.textTertiary,
  },
  logoPanel: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.sm,
    borderRadius: radius.md,
    backgroundColor: color.textPrimary,
  },
  logo: {
    width: SHOP_DETAIL_LOGO_MAX_WIDTH,
    maxWidth: '100%',
    height: SHOP_DETAIL_LOGO_MAX_HEIGHT,
    backgroundColor: color.textPrimary,
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
