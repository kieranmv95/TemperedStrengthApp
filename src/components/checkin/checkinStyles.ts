import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const SCALE_DOT_MAX_SIZE = 56;
const QUANTITY_STEPPER_SIZE = 52;
/** Icon under a calendar day that has a check-in. */
export const CALENDAR_MARK_SIZE = 12;

/** Shared styles for the check-in rows, log sheet, and history calendar. */
export const checkinStyles = StyleSheet.create({
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    ...elevation.raised,
  },
  /** Large text: dose actions wrap below the dose details. */
  rowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  rowLocked: {
    opacity: 0.6,
  },
  rowTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  rowTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  rowDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  rowStatusLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  rowValue: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  rowValueEmpty: {
    ...typography.callout,
    color: color.textTertiary,
  },
  doseActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },

  section: {
    gap: space.xl,
  },
  listSection: {
    gap: space.sm,
  },

  modalSubtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  booleanRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  booleanButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xl,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  booleanButtonPressed: {
    backgroundColor: color.surface3,
  },
  booleanButtonActive: {
    backgroundColor: color.goldTint,
    borderColor: color.gold,
  },
  booleanButtonText: {
    ...typography.headline,
    color: color.textPrimary,
  },
  booleanButtonTextActive: {
    color: color.gold,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  scaleSection: {
    gap: space.md,
    alignItems: 'center',
  },
  scaleSelected: {
    alignItems: 'center',
  },
  scaleSelectedNumber: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  scaleSelectedLabel: {
    ...typography.callout,
    color: color.textSecondary,
  },
  scaleTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: space.xs,
  },
  scaleDot: {
    flex: 1,
    aspectRatio: 1,
    minHeight: MIN_TARGET_SIZE,
    maxWidth: SCALE_DOT_MAX_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleDotPressed: {
    backgroundColor: color.surface3,
  },
  scaleDotActive: {
    backgroundColor: color.gold,
    borderColor: color.gold,
  },
  scaleDotText: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  scaleDotTextActive: {
    color: color.onGold,
  },
  scaleLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: space.sm,
  },
  scaleLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
  },
  stepperButton: {
    width: QUANTITY_STEPPER_SIZE,
    height: QUANTITY_STEPPER_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonPressed: {
    backgroundColor: color.surface3,
  },
  stepperButtonDisabled: {
    borderColor: color.surface3,
  },
  stepperValueBlock: {
    flex: 1,
    alignItems: 'center',
  },
  stepperValue: {
    ...typography.numericLarge,
    color: color.textPrimary,
  },
  stepperUnit: {
    ...typography.callout,
    color: color.textSecondary,
  },
  primaryButton: {
    alignSelf: 'stretch',
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonDisabled: {
    backgroundColor: color.surface3,
  },
  primaryButtonText: {
    ...typography.headline,
    color: color.onGold,
  },
  primaryButtonTextDisabled: {
    color: color.textDisabled,
  },

  calendar: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.sm,
    ...elevation.raised,
  },
  calendarMonthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: space.xs,
  },
  calendarMonthNav: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarMonthNavPressed: {
    backgroundColor: color.surface2,
  },
  calendarMonthTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
    textAlign: 'center',
  },
  calendarWeekdayRow: {
    flexDirection: 'row',
    marginBottom: space.xxs,
  },
  calendarWeekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  calendarWeekdayText: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayCell: {
    width: '14.28%',
    padding: 2,
    minHeight: MIN_TARGET_SIZE + space.xs,
  },
  calendarDayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
  },
  calendarDayInnerPressed: {
    backgroundColor: color.surface2,
  },
  calendarDayInnerToday: {
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  calendarDayInnerSelected: {
    backgroundColor: color.gold,
  },
  calendarDayText: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
  calendarDayTextMuted: {
    color: color.textDisabled,
  },
  calendarDayTextSelected: {
    color: color.onGold,
  },
  calendarMarkSpacer: {
    height: CALENDAR_MARK_SIZE,
  },
});
