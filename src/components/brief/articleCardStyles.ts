import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const articleCardStyles = StyleSheet.create({
  favoriteButton: {
    position: 'absolute',
    top: Spacing.lg,
    right: Spacing.lg,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.overlayLighter,
  },
  heroCard: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xxl,
  },
  heroImage: {
    height: 240,
    justifyContent: 'flex-end',
  },
  heroImageStyle: {
    borderRadius: BorderRadius.full,
  },
  heroOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayLight,
    padding: Spacing.xxl,
    justifyContent: 'space-between',
  },
  heroBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  categoryBadge: {
    backgroundColor: Colors.accentOverlay,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  categoryBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  featuredBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  heroContent: {
    gap: Spacing.md,
  },
  heroTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayLg,
    fontWeight: '800',
    lineHeight: 28,
  },
  heroSubtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  heroMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  heroMetaText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '500',
  },
  compactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
  },
  compactImage: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
  },
  compactContent: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  compactCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactCategory: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  compactTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '600',
    lineHeight: 20,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  compactMetaText: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
  },
  horizontalCard: {
    width: 200,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  horizontalImage: {
    height: 150,
    justifyContent: 'flex-end',
  },
  horizontalImageStyle: {
    borderRadius: BorderRadius.xxl,
  },
  horizontalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlayLighter,
    padding: Spacing.xl,
    justifyContent: 'space-between',
  },
  horizontalCategoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentOverlay,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.sm,
  },
  horizontalCategoryText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxs,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horizontalContent: {
    gap: Spacing.xs,
  },
  horizontalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
    lineHeight: 18,
  },
  horizontalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  horizontalMetaText: {
    color: Colors.textTertiary,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
});
