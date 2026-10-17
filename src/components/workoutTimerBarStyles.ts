import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const TIMER_RING_SIZE = 36;

const DOT_SIZE = 8;

export const workoutTimerBarStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    backgroundColor: color.surface1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
    paddingHorizontal: space.md,
    paddingVertical: space.xs,
  },
  timerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    flex: 1,
    minWidth: 0,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: color.gold,
  },
  timerText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  timerTextComplete: {
    ...typography.calloutStrong,
    color: color.success,
  },
  timerValue: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  finishButton: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    backgroundColor: color.gold,
    borderRadius: radius.pill,
    paddingHorizontal: space.lg,
  },
  finishButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  finishButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  iconButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
  },
  iconButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    backgroundColor: color.surface3,
  },
  adjustButtonText: {
    ...typography.numericSmall,
    color: color.textPrimary,
  },
});
