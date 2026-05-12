import { BorderRadius, Colors, FontSize, Spacing } from '@/src/constants/theme';
import { StyleSheet } from 'react-native';

export const copyWorkoutNotesModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#151517',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: Spacing.section,
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    flexDirection: 'column',
    shadowColor: '#000000',
    shadowOpacity: 0.36,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -8 },
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
    fontWeight: '900',
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'rgba(255,255,255,0.045)',
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
    backgroundColor: 'rgba(255,255,255,0.025)',
    borderRadius: BorderRadius.xxl,
    marginBottom: Spacing.sm,
  },
  rowTextBlock: {
    flex: 1,
    marginRight: Spacing.md,
  },
  rowTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.xxl,
    fontWeight: '900',
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
