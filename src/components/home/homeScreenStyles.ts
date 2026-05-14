import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const homeScreenStyles = StyleSheet.create({
  section: {
    gap: Spacing.md,
  },
  spacing: {
    gap: Spacing.section,
  },
  notificationSpacing: {
    gap: Spacing.md,
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
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.section,
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
    fontWeight: '800',
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
  cardBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '800',
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
  pbRow: {
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  pbRowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '800',
  },
  pbMaxLabel: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    marginTop: Spacing.xxs,
    fontWeight: '700',
  },
  pbValueContainer: {
    backgroundColor: Colors.accentWashFill,
    padding: Spacing.md,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
  },
  pbValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  toolsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  toolButton: {
    flex: 1,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  toolButtonDisabled: {
    opacity: 0.45,
  },
  toolLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  toolLabelMuted: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
  },

  streakCardInner: {
    flex: 1,
    gap: Spacing.xl,
  },
  streakHero: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakIconRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakNumber: {
    color: Colors.textPrimary,
    fontSize: FontSize.hero,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  streakLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  streakMessage: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  streakWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxs,
  },
  streakWeekCell: {
    alignItems: 'center',
    gap: Spacing.xxs,
    minWidth: 36,
  },
  streakWeekLetter: {
    color: Colors.textSecondary,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  streakWeekLetterToday: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  streakWeekLetterMuted: {
    color: Colors.textMuted,
  },
  streakWeekDateNum: {
    color: Colors.textSecondary,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  streakWeekDateNumToday: {
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  streakWeekDateNumMuted: {
    color: Colors.textMuted,
  },
  streakDayDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxs,
  },
  streakDayDotDone: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  streakDayDotTodayRing: {
    borderColor: Colors.accentWashOutline,
    borderWidth: 2,
  },
  streakStatsCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.section,
    gap: Spacing.md,
    alignItems: 'center',
  },
  streakStatBlock: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakStatLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  streakStatValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
  },
  streakBestLine: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
});
