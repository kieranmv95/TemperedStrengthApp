import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const TOGETHER_WE_LIFT_LOGO_SIZE = 28;
const SHEET_LOGO_SIZE = 72;

export const togetherWeLiftStyles = StyleSheet.create({
  bannerCard: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.md,
    ...elevation.raised,
  },
  bannerCardPressed: {
    opacity: 0.88,
  },
  logoPanel: {
    padding: space.xxs,
    borderRadius: radius.sm,
    backgroundColor: color.textPrimary,
  },
  logoImage: {
    width: TOGETHER_WE_LIFT_LOGO_SIZE,
    height: TOGETHER_WE_LIFT_LOGO_SIZE,
  },
  bannerContent: {
    flex: 1,
    minWidth: 0,
    gap: space.xs,
  },
  bannerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  bannerTitle: {
    ...typography.headline,
    flexShrink: 1,
  },
  bannerDescription: {
    ...typography.callout,
  },

  sheetLogoPanel: {
    alignSelf: 'center',
    padding: space.xs,
    borderRadius: radius.md,
    backgroundColor: color.textPrimary,
  },
  sheetLogo: {
    width: SHEET_LOGO_SIZE,
    height: SHEET_LOGO_SIZE,
  },
  sheetAbout: {
    ...typography.body,
    color: color.textSecondary,
  },
  temperedAside: {
    gap: space.xs,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
  },
  temperedAsideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  temperedAsideLabel: {
    ...typography.captionStrong,
    color: color.textPrimary,
  },
  temperedAsideText: {
    ...typography.callout,
    color: color.textPrimary,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: space.sm,
  },
  sheetActionsStacked: {
    flexDirection: 'column-reverse',
  },
  actionButton: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  primaryButton: {
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
