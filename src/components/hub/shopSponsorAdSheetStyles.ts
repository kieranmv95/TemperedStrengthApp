import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const SHOP_DETAIL_LOGO_MAX_WIDTH = 200;
export const SHOP_DETAIL_LOGO_MAX_HEIGHT = 80;

export const shopSponsorAdSheetStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    paddingTop: Spacing.section,
    paddingHorizontal: Spacing.section,
    maxHeight: '88%',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    padding: Spacing.xs,
  },
  scrollContent: {
    gap: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  logoWrap: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: SHOP_DETAIL_LOGO_MAX_HEIGHT,
  },
  logo: {
    width: SHOP_DETAIL_LOGO_MAX_WIDTH,
    height: SHOP_DETAIL_LOGO_MAX_HEIGHT,
  },
  description: {
    fontSize: FontSize.lg,
    lineHeight: 24,
    fontWeight: '500',
    textAlign: 'center',
  },
  reviewAside: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.lg,
    borderLeftWidth: 4,
    gap: Spacing.sm,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  reviewLabel: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  reviewText: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  cta: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.section,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  ctaText: {
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
});
