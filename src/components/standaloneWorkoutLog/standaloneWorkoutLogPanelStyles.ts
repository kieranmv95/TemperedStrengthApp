import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const standaloneWorkoutLogPanelStyles = StyleSheet.create({
  panel: {
    marginTop: Spacing.xxl,
    paddingTop: Spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
  },
  sectionTitle: {
    fontSize: FontSize.displaySm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    letterSpacing: -0.2,
  },
  loader: {
    marginVertical: Spacing.xxl,
  },
  emptyText: {
    fontSize: FontSize.lg,
    lineHeight: 22,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },
  bestLine: {
    fontSize: FontSize.lg,
    color: Colors.accent,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  logCard: {
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xxl,
  },
  logRowMain: {
    flex: 1,
    paddingRight: Spacing.md,
  },
  logSummary: {
    fontSize: FontSize.displayMd,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    letterSpacing: -0.3,
  },
  logTimestampLine: {
    fontSize: FontSize.lg,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: Spacing.sm,
  },
  logTimestampFallback: {
    marginTop: Spacing.sm,
    fontSize: FontSize.base,
    color: Colors.textMuted,
  },
  logNotes: {
    fontSize: FontSize.base,
    lineHeight: 20,
    color: Colors.textMuted,
    marginTop: Spacing.md,
    fontStyle: 'italic',
  },
  logRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: Spacing.sm,
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundScreen,
    borderWidth: 1,
    borderColor: Colors.backgroundBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.accent,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
  },
  addButtonIcon: {
    marginRight: 2,
  },
  addButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
});
