import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const customiseHomeStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
  },
  dock: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  card: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: space.md,
  },
  header: {
    paddingHorizontal: space.md,
    gap: space.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
  },
  title: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
  },
  closeButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -space.xs,
  },
  body: {
    ...typography.callout,
    color: color.textSecondary,
  },
  upgrade: {
    ...typography.calloutStrong,
    color: color.gold,
    paddingVertical: space.xxs,
  },
  list: {
    flexShrink: 1,
  },
  listContent: {
    paddingHorizontal: space.md,
    paddingTop: space.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE + space.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
  },
  rowStacked: {
    alignItems: 'stretch',
    paddingVertical: space.xs,
  },
  rowMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xxs,
    minWidth: 0,
  },
  dragHandle: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -space.xs,
  },
  label: {
    ...typography.headline,
    color: color.textPrimary,
    flex: 1,
  },
  visibility: {
    minWidth: MIN_TARGET_SIZE,
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  visibilityStacked: {
    alignItems: 'flex-end',
  },
});
