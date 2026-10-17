import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const LOG_CARD_SKELETON_HEIGHT = 72;

export const standaloneWorkoutLogPanelStyles = StyleSheet.create({
  panel: {
    marginTop: space.sm,
    gap: space.sm,
  },
  emptyText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  bestLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  bestLineText: {
    ...typography.calloutStrong,
    fontVariant: ['tabular-nums'],
    color: color.gold,
  },
  logCard: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingLeft: space.md,
    paddingRight: space.xs,
    paddingVertical: space.sm,
  },
  logRowStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingRight: space.md,
  },
  logRowMain: {
    flex: 1,
    gap: space.xxs,
    paddingVertical: space.xxs,
  },
  logRowMainStacked: {
    flex: 0,
  },
  logSummary: {
    ...typography.headline,
    color: color.textPrimary,
  },
  logTimestampLine: {
    ...typography.caption,
    color: color.textSecondary,
  },
  logTimestampFallback: {
    color: color.textTertiary,
  },
  logNotes: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  logRowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logRowActionsStacked: {
    marginLeft: -space.sm,
  },
  iconActionBtn: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconActionBtnPressed: {
    backgroundColor: color.surface2,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.xl,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
  },
  addButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  addButtonText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
});
