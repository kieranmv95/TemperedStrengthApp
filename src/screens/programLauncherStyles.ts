import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { flattenToHex } from '@/src/utils/contrast';
import { StyleSheet } from 'react-native';

const DAY_ITEM_MIN_HEIGHT = 64;
export const DAY_ITEM_ICON_SIZE = 16;
const INTENSITY_DOT_SIZE = 6;
const STAT_MIN_WIDTH = 120;

/** Selected weekday fill inside a sheet (sheets sit on surface1). */
const DAY_SELECTED_FILL = flattenToHex(color.goldTint, color.surface1);

export const programLauncherStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'flex-end',
  },
  sheet: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: space.md,
    maxHeight: '90%',
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
  },
  sheetTitleRow: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  sheetTitle: {
    ...typography.title2,
    color: color.textPrimary,
    flexShrink: 1,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  closeButtonPressed: {
    backgroundColor: color.surface3,
  },
  sheetScroll: {
    flexGrow: 0,
  },
  sheetScrollContent: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    paddingBottom: space.md,
    gap: space.md,
  },
  sheetFooter: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  programContent: {
    gap: space.xs,
  },
  programName: {
    ...typography.headline,
    color: color.textPrimary,
  },
  programTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xs,
  },
  proBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  programDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  programStats: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  bodyChangesCard: {
    backgroundColor: color.surface2,
  },
  bodyChangesText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
  },
  statItem: {
    flexGrow: 1,
    flexBasis: STAT_MIN_WIDTH,
    gap: space.xxs,
    padding: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface2,
  },
  statValue: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: color.textTertiary,
  },
  sheetFooterRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  sheetFooterButton: {
    flex: 1,
  },
  primaryButton: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonDisabled: {
    backgroundColor: color.surface3,
  },
  primaryButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
    textAlign: 'center',
  },
  primaryButtonTextDisabled: {
    color: color.textDisabled,
  },
  secondaryButton: {
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    textAlign: 'center',
  },
  datePickerExplanation: {
    ...typography.callout,
    color: color.textSecondary,
  },
  datePickerExplanationEmphasis: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  weekdayPicker: {
    gap: space.sm,
  },
  workoutDaysHint: {
    ...typography.callout,
    color: color.textSecondary,
  },
  weekdaySelectionHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  weekdaySelectionHint: {
    ...typography.calloutStrong,
    color: color.warning,
    flex: 1,
  },
  daysSplitContainer: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  dayItem: {
    flex: 1,
    minHeight: DAY_ITEM_MIN_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  dayItemPressed: {
    backgroundColor: color.surface3,
  },
  dayItemSelected: {
    borderColor: color.gold,
    backgroundColor: DAY_SELECTED_FILL,
  },
  dayLabel: {
    ...typography.headline,
    color: color.textSecondary,
  },
  dayLabelSelected: {
    color: color.gold,
  },
  dayIconSlot: {
    width: DAY_ITEM_ICON_SIZE,
    height: DAY_ITEM_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutItem: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
  },
  workoutLabel: {
    ...typography.headline,
    color: color.textPrimary,
  },
  workoutDescription: {
    ...typography.callout,
    color: color.textSecondary,
  },
  workoutExercisesList: {
    ...typography.callout,
    color: color.textSecondary,
  },
  workoutMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  workoutExercises: {
    ...typography.caption,
    color: color.textTertiary,
  },
  workoutIntensity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  workoutIntensityLabel: {
    ...typography.caption,
    color: color.textTertiary,
  },
  workoutIntensityBar: {
    flexDirection: 'row',
    gap: space.xxs,
    alignItems: 'center',
  },
  workoutIntensityDot: {
    width: INTENSITY_DOT_SIZE,
    height: INTENSITY_DOT_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface3,
  },
  workoutIntensityDotFilled: {
    backgroundColor: color.gold,
  },
  workoutIntensityValue: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
});
