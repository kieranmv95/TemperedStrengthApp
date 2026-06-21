import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const workoutsListStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.xl,
    height: 44,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    padding: 0,
  },
  filtersWrap: {
    gap: Spacing.xl,
  },
  filtersRow: {
    gap: Spacing.md,
  },
  filtersLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  filterScrollContent: {
    paddingRight: Spacing.xxl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  quickFiltersRow: {
    marginTop: Spacing.sm,
  },
  listContent: {
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.md,
  },
  listContentWithActiveFilters: {
    paddingTop: Spacing.md,
  },
  curatedSectionList: {
    gap: Spacing.section,
  },
  curatedScrollContent: {
    gap: Spacing.lg,
    paddingRight: Spacing.xl,
  },
  titleSpace: {
    marginBottom: Spacing.md,
  },
  sectionsHiddenNote: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  workoutCard: {
    marginBottom: Spacing.md,
    padding: Spacing.xl,
  },
  sponsorCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  sponsorTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  sponsorDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  sponsorLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sponsorLinkText: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  workoutCardLocked: {
    borderColor: Colors.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCategory: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  premiumBadgeText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xxs,
    fontWeight: '700',
  },
  favoriteButton: {
    padding: Spacing.xs,
  },
  cardTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    marginBottom: Spacing.xxs,
  },
  cardDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 17,
    marginBottom: Spacing.md,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    marginBottom: Spacing.md,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  metaTimeText: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  difficultyBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  difficultyText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tag: {
    backgroundColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.md,
    paddingVertical: 2,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  tagGold: {
    borderColor: Colors.accent,
    backgroundColor: Colors.backgroundElevated,
  },
  tagText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '500',
  },
  tagGoldText: {
    color: Colors.accent,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
  },
  disciplineSection: {
    height: 160,
    width: 160,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: BorderRadius.xxl,
  },
  disciplineSectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '800',
    textAlign: 'center',
  },
  disciplineImage: {
    ...StyleSheet.absoluteFillObject,
  },
  disciplineGoldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
    opacity: 0.1,
  },
  disciplineImageStyle: {
    borderRadius: BorderRadius.xxl,
  },
  disciplineDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  disciplineLink: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  sponsorLogo: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  recoveryCard: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
    marginBottom: Spacing.section,
  },
  recoveryVisualTile: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recoveryCtaTextColumn: {
    flex: 1,
    marginLeft: Spacing.xl,
    gap: Spacing.xs,
  },
  shopEyebrow: {
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  hubCtaTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  hubCtaDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
});
