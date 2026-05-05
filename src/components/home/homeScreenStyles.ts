import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

/** Warm wash behind the home welcome strip (brand accent, low alpha). */
const welcomeStripBg = 'rgba(201, 176, 114, 0.12)';

export const homeScreenStyles = StyleSheet.create({
  loadingBox: {
    paddingVertical: Spacing.section,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeStrip: {
    borderRadius: BorderRadius.xxl,
    backgroundColor: welcomeStripBg,
    borderWidth: 1,
    borderColor: 'rgba(201, 176, 114, 0.22)',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.section,
    marginBottom: Spacing.section,
  },
  welcomeStripTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
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
    borderColor: 'rgba(201, 176, 114, 0.45)',
    paddingHorizontal: Spacing.lg,
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
    fontSize: FontSize.sm,
    fontWeight: '800',
    letterSpacing: 0.85,
  },
  welcomeTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
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
  section: {
    marginBottom: Spacing.xxl,
  },
  sectionheader: {
    marginBottom: Spacing.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: 4,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    flex: 1,
  },
  sectionSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: 'rgba(201, 176, 114, 0.18)',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
    padding: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardBody: {
    flex: 1,
    gap: Spacing.sm,
  },
  cardChevronWrap: {
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 28,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
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
  pbRow: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  pbRowFirst: {
    marginTop: 0,
    paddingTop: 0,
    borderTopWidth: 0,
  },
  pbRowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  pbRowMeta: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    marginTop: Spacing.xxs,
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
    borderColor: 'rgba(201, 176, 114, 0.14)',
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
});
