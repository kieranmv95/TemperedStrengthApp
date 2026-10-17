import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  sections: {
    gap: space.md,
  },
  bentoRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  bentoTile: {
    flex: 1,
  },
  skeletons: {
    gap: space.md,
  },
  /** Also used by ProgramLauncher's welcome strip. */
  welcomeStrip: {
    borderRadius: radius.md,
    backgroundColor: color.goldTint,
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
  },
  /** Also used by ProgramLauncher's welcome strip. */
  welcomeBody: {
    ...typography.body,
    color: color.textSecondary,
  },
  upgradeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
  },
  upgradeTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  /** Remote Sanity notification strip — background/border/colours come from CMS. */
  notificationBanner: {
    alignItems: 'flex-start',
    borderRadius: radius.md,
    borderWidth: 1,
    padding: space.md,
    gap: space.xs,
  },
  notificationBannerTitle: {
    ...typography.headline,
    width: '100%',
  },
  notificationBannerBody: {
    ...typography.callout,
    width: '100%',
  },
  notificationCta: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
  },
  notificationCtaText: {
    ...typography.calloutStrong,
  },
  pbTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  cardTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  cardBody: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  pbRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.sm,
    marginTop: space.xs,
  },
  pbRowText: {
    flex: 1,
    minWidth: 0,
  },
  pbExercise: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  pbTier: {
    ...typography.caption,
    color: color.textSecondary,
  },
  pbValue: {
    ...typography.numericMedium,
    color: color.gold,
  },
});
