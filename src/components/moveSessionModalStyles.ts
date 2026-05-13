import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const moveSessionModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    padding: Spacing.section,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    marginBottom: Spacing.md,
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.lg,
    lineHeight: 20,
    marginBottom: Spacing.xxl,
  },
  daysRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.section,
  },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundElevated,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    minHeight: 56,
  },
  dayBtnDisabled: {
    opacity: 0.35,
  },
  dayBtnFrom: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  dayBtnSelected: {
    borderColor: Colors.accent,
  },
  dayLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.base,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dayLabelFrom: {
    color: Colors.textOnAccent,
  },
  dayDateLabel: {
    marginTop: 2,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dayDateLabelFrom: {
    color: Colors.textOnAccent,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.backgroundElevated,
    paddingTop: Spacing.xxl,
  },
  footerRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  btnGhost: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostText: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  btnPrimary: {
    flex: 1,
    paddingVertical: Spacing.xxl,
    paddingHorizontal: Spacing.xxl,
    borderRadius: BorderRadius.xxl,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryDisabled: {
    opacity: 0.4,
  },
  btnPrimaryText: {
    fontSize: FontSize.xl,
    color: Colors.textOnAccent,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
