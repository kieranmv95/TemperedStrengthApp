import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

/** Fixed height for all sponsor carousel slides. */
export const SPONSOR_CARD_HEIGHT = 176;
export const SPONSOR_LOGO_MAX_HEIGHT = 40;
export const SPONSOR_LOGO_MAX_WIDTH = 152;
/** 1:1 product image side length (fits card inner height). */
export const SPONSOR_PRODUCT_IMAGE_SIZE = SPONSOR_CARD_HEIGHT - Spacing.lg * 2;
/** Visible slice: right 75% of the square; left 25% bleeds off the card edge. */
export const SPONSOR_PRODUCT_RAIL_WIDTH = SPONSOR_PRODUCT_IMAGE_SIZE * 0.75;
export const SPONSOR_PRODUCT_IMAGE_BLEED = SPONSOR_PRODUCT_IMAGE_SIZE * 0.25;
export const SPONSOR_AUTO_SCROLL_MS = 6000;

export const homeScreenStyles = StyleSheet.create({
  spacing: {
    gap: Spacing.xxl,
  },
  loadingBox: {
    paddingVertical: Spacing.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeStrip: {
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accentWashFill,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  welcomeStripTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  /** Keeps headline on the left and badge pinned right when titles wrap. */
  welcomeHeadlineCell: {
    flex: 1,
    marginRight: Spacing.sm,
    minWidth: 0,
  },
  planBadgePro: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.pill,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planBadgeFree: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.pill,
    minHeight: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planBadgeLabelPro: {
    color: Colors.textOnAccent,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.85,
  },
  planBadgeLabelFree: {
    color: Colors.accent,
    fontSize: FontSize.xs,
    fontWeight: '800',
    letterSpacing: 0.85,
  },
  welcomeTitle: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  welcomeBody: {
    color: Colors.textSecondary,
    fontSize: FontSize.xl,
    lineHeight: 22,
    marginTop: Spacing.sm,
    fontWeight: '500',
  },
  /** Remote Sanity notification strip — background/border/colours come from CMS. */
  notificationBanner: {
    alignItems: 'flex-start',
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    gap: Spacing.sm,
  },
  notificationBannerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'left',
    width: '100%',
  },
  notificationBannerBody: {
    fontSize: FontSize.base,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'left',
    width: '100%',
  },
  notificationCta: {
    paddingHorizontal: Spacing.section,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
  },
  notificationCtaText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  sponsorCarousel: {
    gap: Spacing.sm,
  },
  sponsorCard: {
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.section,
    overflow: 'hidden',
  },
  sponsorCardStacked: {
    alignItems: 'flex-start',
  },
  sponsorStackedSpacer: {
    flex: 1,
    minHeight: 0,
  },
  sponsorTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sponsorProductTitle: {
    fontSize: FontSize.displaySm,
    fontWeight: '800',
    letterSpacing: -0.2,
    marginTop: Spacing.xs,
  },
  sponsorDescription: {
    fontSize: FontSize.base,
    lineHeight: 19,
    fontWeight: '500',
    alignSelf: 'stretch',
    textAlign: 'left',
  },
  sponsorCta: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.section,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.pill,
  },
  sponsorCtaText: {
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  sponsorLogoWrap: {
    alignSelf: 'stretch',
    alignItems: 'flex-start',
  },
  sponsorLogo: {
    width: SPONSOR_LOGO_MAX_WIDTH,
    height: SPONSOR_LOGO_MAX_HEIGHT,
  },
  sponsorCardProductLeft: {
    paddingLeft: 0,
  },
  sponsorProductRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: Spacing.md,
  },
  sponsorProductRail: {
    width: SPONSOR_PRODUCT_RAIL_WIDTH,
    height: SPONSOR_PRODUCT_IMAGE_SIZE,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  sponsorProductImage: {
    width: SPONSOR_PRODUCT_IMAGE_SIZE,
    height: SPONSOR_PRODUCT_IMAGE_SIZE,
    marginLeft: -SPONSOR_PRODUCT_IMAGE_BLEED,
  },
  sponsorProductContent: {
    flex: 1,
    minWidth: 0,
  },
  sponsorDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sponsorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.backgroundSubtle,
  },
  sponsorDotActive: {
    backgroundColor: Colors.textMuted,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  programTitle: {
    color: Colors.accent,
    fontSize: FontSize.xl,
    fontWeight: '500',
  },
  programStatus: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  programSessionsRemaining: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxxl,
    fontWeight: '600',
  },
  programCalendarProgressTrack: {
    width: '100%',
    height: 4,
    marginTop: Spacing.xs,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundSubtle,
    overflow: 'hidden',
  },
  programCalendarProgressFill: {
    height: '100%',
    backgroundColor: Colors.accent,
  },
  cardMuted: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '400',
  },
  cardAccent: {
    color: Colors.accent,
    fontWeight: '400',
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  emptySubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '400',
    marginTop: Spacing.xs,
  },
  pbListContent: {
    gap: Spacing.sm,
  },
  pbListTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  pbListTitle: {
    color: Colors.accent,
    fontSize: FontSize.xxxl,
    fontWeight: '600',
  },
  pbRow: {
    marginTop: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  pbRowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  pbMaxLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  pbValueContainer: {
    backgroundColor: Colors.backgroundSubtle,
    padding: Spacing.lg,
    borderRadius: BorderRadius.xxl,
  },
  pbValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  toolsScrollContent: {
    gap: Spacing.md,
    paddingRight: Spacing.xxl,
  },

  streakCard: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  streakCardInner: {
    width: '100%',
    gap: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakHeaderTitle: {
    color: Colors.accent,
    fontSize: FontSize.xxxl,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  streakMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: Spacing.lg,
  },
  streakStatsColumn: {
    gap: Spacing.xxs,
    flexShrink: 0,
    minWidth: 84,
  },
  streakCountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  streakNumber: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  streakCountUnit: {
    color: Colors.textMuted,
    fontSize: FontSize.xl,
    fontWeight: '600',
  },
  streakWeekRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minWidth: 0,
  },
  streakWeekCell: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  streakWeekLetter: {
    color: Colors.textSecondary,
    fontSize: FontSize.xxs,
    fontWeight: '600',
  },
  streakWeekLetterToday: {
    color: Colors.accent,
    fontWeight: '800',
  },
  streakWeekLetterMuted: {
    color: Colors.textMuted,
  },
  streakDayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDayDotDone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  streakDayDotTodayRing: {
    borderColor: Colors.accentWashOutline,
    borderWidth: 2,
  },
  streakBestLine: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
