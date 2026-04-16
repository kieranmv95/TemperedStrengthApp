import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const copyWorkoutNotesModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.backgroundCard,
    borderTopLeftRadius: BorderRadius.pill,
    borderTopRightRadius: BorderRadius.pill,
    padding: Spacing.section,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    flexDirection: 'column',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.displayXl,
    fontWeight: '700',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.displaySm,
    fontWeight: '600',
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.lg,
    lineHeight: 22,
    paddingVertical: Spacing.xxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderDefault,
  },
  rowTextBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '700',
  },
  rowPreview: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
  },
  copyHit: {
    padding: Spacing.md,
  },
  list: {
    flexGrow: 0,
  },
});
