import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { flattenToHex } from '@/src/utils/contrast';
import { StyleSheet } from 'react-native';

const DAY_BUTTON_MIN_HEIGHT = 72;
const DAY_ICON_SLOT_SIZE = 16;

/** Selected day fill inside the sheet (sheets sit on surface1). */
const DAY_SELECTED_FILL = flattenToHex(color.goldTint, color.surface1);

export const moveSessionModalStyles = StyleSheet.create({
  subtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  daysRow: {
    flexDirection: 'row',
    gap: space.xxs,
  },
  dayBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    minHeight: DAY_BUTTON_MIN_HEIGHT,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
  },
  dayBtnPressed: {
    backgroundColor: color.surface3,
  },
  dayBtnDisabled: {
    borderColor: color.surface3,
    backgroundColor: color.surface1,
  },
  dayBtnFrom: {
    borderColor: color.surface3,
    backgroundColor: color.surface3,
  },
  dayBtnSelected: {
    borderColor: color.gold,
    backgroundColor: DAY_SELECTED_FILL,
  },
  dayLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  dayDateLabel: {
    ...typography.caption,
    color: color.textSecondary,
  },
  dayLabelSelected: {
    color: color.gold,
  },
  dayLabelDisabled: {
    color: color.textDisabled,
  },
  dayIconSlot: {
    width: DAY_ICON_SLOT_SIZE,
    height: DAY_ICON_SLOT_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  legendText: {
    ...typography.caption,
    color: color.textTertiary,
  },
  footerRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  btnGhost: {
    flex: 1,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhostPressed: {
    backgroundColor: color.surface3,
  },
  btnGhostText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  btnPrimary: {
    flex: 1,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryPressed: {
    backgroundColor: color.goldStrong,
  },
  btnPrimaryDisabled: {
    backgroundColor: color.surface3,
  },
  btnPrimaryText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  btnPrimaryTextDisabled: {
    color: color.textDisabled,
  },
});
