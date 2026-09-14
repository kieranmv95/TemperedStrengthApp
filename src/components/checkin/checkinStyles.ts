import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

/** Shared styles for the check-in rows, log modal, and history calendar. */
export const checkinStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.xxl,
  },
  rowLocked: {
    opacity: 0.45,
  },
  rowTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xxs,
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  rowDescription: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    lineHeight: 16,
  },
  rowValue: {
    color: Colors.accent,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  rowValueEmpty: {
    color: Colors.textPlaceholder,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  rowStatusIcon: {
    width: 28,
    alignItems: 'center',
  },
  doseActions: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexShrink: 0,
  },
  doseButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundScreen,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  doseButtonTaken: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  doseButtonSkipped: {
    backgroundColor: Colors.backgroundSubtle,
    borderColor: Colors.backgroundBorder,
  },
  doseButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  doseButtonTextTaken: {
    color: Colors.accent,
  },
  doseButtonTextSkipped: {
    color: Colors.textPrimary,
  },
  doseMissed: {
    color: Colors.destructive,
    fontSize: FontSize.md,
    fontWeight: '700',
  },

  section: {
    gap: Spacing.xl,
  },
  listSection: {
    gap: Spacing.md,
  },
  listSectionTitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '700',
    paddingHorizontal: Spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundScreen,
    borderTopLeftRadius: BorderRadius.full,
    borderTopRightRadius: BorderRadius.full,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.section,
    gap: Spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xl,
  },
  modalHeaderText: {
    flex: 1,
    minWidth: 0,
    gap: Spacing.xxs,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayMd,
    fontWeight: '700',
  },
  modalSubtitle: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 20,
  },
  modalCloseButton: {
    padding: Spacing.xs,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  optionChip: {
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
  },
  optionChipActive: {
    backgroundColor: Colors.accentWashFill,
    borderColor: Colors.accentWashBorder,
  },
  optionChipText: {
    color: Colors.textSecondary,
    fontSize: FontSize.xl,
    fontWeight: '700',
  },
  optionChipTextActive: {
    color: Colors.accent,
  },
  scaleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scaleLabel: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    fontWeight: '600',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xl,
  },
  stepperButton: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.4,
  },
  stepperValueBlock: {
    flex: 1,
    alignItems: 'center',
    gap: Spacing.xxs,
  },
  stepperValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXXl,
    fontWeight: '800',
  },
  stepperUnit: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  modalPrimaryButton: {
    backgroundColor: Colors.accent,
    borderRadius: BorderRadius.pill,
    paddingVertical: Spacing.xxl,
    alignItems: 'center',
  },
  modalPrimaryButtonDisabled: {
    opacity: 0.5,
  },
  modalPrimaryButtonText: {
    color: Colors.textOnAccent,
    fontSize: FontSize.displaySm,
    fontWeight: '700',
  },
  modalClearButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  modalClearButtonText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },

  calendar: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: BorderRadius.xxl,
    borderWidth: 1,
    borderColor: Colors.backgroundElevated,
    padding: Spacing.xl,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  calendarMonthNav: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthNavDisabled: {
    opacity: 0.35,
  },
  calendarMonthTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  calendarWeekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekdayText: {
    color: Colors.textMuted,
    fontSize: FontSize.sm,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    padding: 2,
    minHeight: 44,
  },
  calendarDayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: BorderRadius.lg,
  },
  calendarDayInnerToday: {
    borderWidth: 1,
    borderColor: Colors.accentWashOutline,
  },
  calendarDayInnerSelected: {
    backgroundColor: Colors.accent,
  },
  calendarDayText: {
    color: Colors.textPrimary,
    fontSize: FontSize.lg,
    fontWeight: '600',
  },
  calendarDayTextMuted: {
    color: Colors.textPlaceholder,
  },
  calendarDayTextSelected: {
    color: Colors.textOnAccent,
  },
  calendarDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.accent,
  },
  calendarDotSelected: {
    backgroundColor: Colors.textOnAccent,
  },
  calendarDotSpacer: {
    width: 5,
    height: 5,
  },
});
