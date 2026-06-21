import { BorderRadius, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const TOGETHER_WE_LIFT_LOGO_SIZE = 25;

export const togetherWeLiftStyles = StyleSheet.create({
  bannerCard: {
    alignSelf: 'stretch',
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  logoImage: {
    width: TOGETHER_WE_LIFT_LOGO_SIZE,
    height: TOGETHER_WE_LIFT_LOGO_SIZE,
  },
  bannerContent: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bannerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  bannerDescription: {
    fontSize: FontSize.base,
    lineHeight: 20,
    fontWeight: '500',
  },
  bannerCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },
  bannerCtaText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },

  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    paddingTop: Spacing.xl,
    paddingHorizontal: Spacing.section,
    maxHeight: '88%',
  },
  sheetCloseButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    zIndex: 1,
    padding: Spacing.xs,
  },
  sheetContent: {
    alignItems: 'center',
    gap: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
  sheetLogoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 88,
    height: 88,
  },
  sheetLogo: {
    width: 88,
    height: 88,
  },
  sheetTitle: {
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  sheetAboutBlock: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xs,
  },
  sheetAbout: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
  },
  temperedAside: {
    alignSelf: 'stretch',
    paddingVertical: Spacing.md,
    paddingLeft: Spacing.lg,
    borderLeftWidth: 4,
    gap: Spacing.sm,
  },
  temperedAsideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  temperedAsideLabel: {
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  temperedAsideText: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  sheetActions: {
    alignSelf: 'stretch',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.section,
    borderRadius: BorderRadius.pill,
  },
  linkButtonPrimary: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.section,
    borderRadius: BorderRadius.pill,
    alignItems: 'center',
  },
  linkButtonText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  linkButtonTextSecondary: {
    fontSize: FontSize.base,
    fontWeight: '700',
  },
});
