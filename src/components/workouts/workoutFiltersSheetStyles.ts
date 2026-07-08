import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const workoutFiltersSheetStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.backgroundElevated,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  closeButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    marginHorizontal: Spacing.xxl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.xl,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    padding: 0,
  },
  scrollView: {
    flex: 1,
    backgroundColor: Colors.backgroundScreen,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  section: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionHint: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  sectionAction: {
    color: Colors.accent,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  pillWrap: {
    marginRight: Spacing.md,
    marginBottom: Spacing.md,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    backgroundColor: Colors.backgroundScreen,
    gap: Spacing.md,
  },
  resultCount: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  footerButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    backgroundColor: Colors.backgroundCard,
  },
  footerButtonPrimary: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  footerButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  footerButtonTextPrimary: {
    color: Colors.textOnAccent,
  },
});
