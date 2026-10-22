import {
  GAP,
  ITEM_MIN_WIDTH,
  ITEM_PADDING_H,
  SCROLL_PADDING_H,
} from '@/src/components/daySelectorConstants';
import {
  color,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const STATUS_ICON_SIZE = 14;
const SCHEDULED_DOT_SIZE = 6;

export const daySelectorStyles = StyleSheet.create({
  container: {
    backgroundColor: color.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
    paddingVertical: space.xxs,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: ITEM_PADDING_H,
    minWidth: ITEM_MIN_WIDTH,
    borderRadius: radius.sm,
  },
  label: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  labelToday: {
    color: color.gold,
  },
  labelSelected: {
    color: color.textPrimary,
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
