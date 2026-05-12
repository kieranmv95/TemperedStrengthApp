import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const moveSessionModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#151517',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    padding: Spacing.section,
    shadowColor: '#000000',
    shadowOpacity: 0.36,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '900',
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
    backgroundColor: 'rgba(255,255,255,0.045)',
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    minHeight: 56,
  },
  dayBtnDisabled: {
    opacity: 0.35,
  },
  dayBtnFrom: {
    backgroundColor: Colors.accentSoft,
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
    color: Colors.textPrimary,
  },
  dayDateLabel: {
    marginTop: 2,
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  dayDateLabelFrom: {
    color: Colors.accent,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderDefault,
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
    borderColor: Colors.borderDefault,
    backgroundColor: 'rgba(255,255,255,0.045)',
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
    backgroundColor: Colors.accentSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(201,150,58,0.34)',
  },
  btnPrimaryDisabled: {
    opacity: 0.4,
  },
  btnPrimaryText: {
    fontSize: FontSize.xl,
    color: Colors.accent,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
