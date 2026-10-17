import {
  GAP,
  ITEM_MIN_WIDTH,
  ITEM_PADDING_H,
  SCROLL_PADDING_H,
} from '@/src/components/daySelectorConstants';
import { color, radius, space, typography } from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const STATUS_ICON_SIZE = 14;
const SCHEDULED_DOT_SIZE = 6;

export const daySelectorStyles = StyleSheet.create({
  container: {
    backgroundColor: color.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
    paddingTop: space.xs,
    paddingBottom: space.xs,
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: SCROLL_PADDING_H,
    alignItems: 'stretch',
    gap: GAP,
  },
  indicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.gold,
    backgroundColor: color.goldTint,
  },
  dayItem: {
    alignItems: 'center',
    paddingHorizontal: ITEM_PADDING_H,
    paddingVertical: space.xs,
    minWidth: ITEM_MIN_WIDTH,
    borderRadius: radius.sm,
    gap: space.xxs,
  },
  weekday: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  weekdayToday: {
    color: color.gold,
  },
  weekdaySelected: {
    color: color.textPrimary,
  },
  dayOfMonth: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
  dayOfMonthSelected: {
    color: color.textPrimary,
  },
  statusSlot: {
    height: STATUS_ICON_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduledDot: {
    width: SCHEDULED_DOT_SIZE,
    height: SCHEDULED_DOT_SIZE,
    borderRadius: SCHEDULED_DOT_SIZE / 2,
    backgroundColor: color.textTertiary,
  },
  timelineActionRow: {
    alignSelf: 'center',
    marginTop: space.xs,
  },
});
