import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

export const COPY_NOTES_SKELETON_ROW_HEIGHT = 64;

export const copyWorkoutNotesModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'flex-end',
  },
  modalContent: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: space.md,
    paddingHorizontal: space.md,
    paddingBottom: space.xl,
    maxHeight: '80%',
    flexDirection: 'column',
    gap: space.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
  },
  modalTitle: {
    ...typography.title2,
    color: color.textPrimary,
    flex: 1,
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
  skeletons: {
    gap: space.xs,
  },
  emptyText: {
    ...typography.callout,
    color: color.textSecondary,
    paddingVertical: space.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingVertical: space.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
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
  rowPreview: {
    ...typography.caption,
    color: color.textTertiary,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: space.xs,
  },
});
