import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const partnerDetailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  headerBackButton: {
    padding: Spacing.sm,
    marginLeft: -Spacing.sm,
  },
  headerTitle: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: Spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
  },
  kindBadge: {
    alignSelf: 'flex-start',
    color: Colors.accent,
    fontSize: FontSize.sm,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.sm,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXXl,
    fontWeight: '800',
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  focusAreasRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  descriptionBlock: {
    backgroundColor: Colors.accentWashFill,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.accentWashBorder,
    padding: Spacing.xxl,
    marginBottom: Spacing.xxl,
  },
  description: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 22,
    fontWeight: '500',
  },
  videoSection: {
    marginBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  section: {
    marginBottom: Spacing.xxl,
    gap: Spacing.md,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  sectionBody: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  statusBadgeOpen: {
    backgroundColor: Colors.recommendedWashFill,
    borderColor: Colors.recommendedWashBorder,
  },
  statusBadgeClosed: {
    backgroundColor: Colors.destructiveWashFill,
    borderColor: 'rgba(255, 107, 107, 0.25)',
  },
  statusBadgeText: {
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  statusBadgeTextOpen: {
    color: Colors.recommended,
  },
  statusBadgeTextClosed: {
    color: Colors.destructive,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  hoursDay: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '500',
  },
  hoursValue: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
  },
  linksSection: {
    marginBottom: Spacing.md,
    marginHorizontal: -Spacing.xxl,
  },
  linksScrollContent: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.xxl,
  },
  linkChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    maxWidth: 220,
  },
  linkChipLabel: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
    flexShrink: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.section,
    gap: Spacing.lg,
  },
  errorText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  backButton: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundElevated,
  },
  backButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  favoriteButton: {
    padding: Spacing.sm,
    marginRight: -Spacing.sm,
  },
});
