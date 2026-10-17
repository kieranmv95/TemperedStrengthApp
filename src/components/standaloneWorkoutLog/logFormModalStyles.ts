import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const MODAL_SCROLL_MAX_HEIGHT = 400;
const INPUT_MIN_HEIGHT = 48;
const NOTES_MIN_HEIGHT = 100;
const SESSION_NOTES_MIN_HEIGHT = 72;

export const logFormModalStyles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  modalKeyboardRoot: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: color.scrim,
    justifyContent: 'center',
    paddingHorizontal: space.md,
    paddingVertical: space.xxl,
  },
  modalCard: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderRadius: radius.lg,
    maxHeight: '90%',
    padding: space.lg,
    gap: space.md,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
  },
  modalHeaderText: {
    flex: 1,
    gap: space.xxs,
  },
  modalCloseBtn: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -space.xs,
    marginRight: -space.xs,
  },
  modalCloseBtnPressed: {
    backgroundColor: color.surface2,
  },
  modalTitle: {
    ...typography.title2,
    color: color.textPrimary,
  },
  modalSubtitle: {
    ...typography.callout,
    color: color.textSecondary,
  },
  modalScroll: {
    maxHeight: MODAL_SCROLL_MAX_HEIGHT,
  },
  modalScrollContent: {
    gap: space.md,
    paddingBottom: space.xs,
  },
  whenBlock: {
    gap: space.xxs,
  },
  whenHint: {
    ...typography.caption,
    color: color.textTertiary,
  },
  whenSingleLine: {
    ...typography.body,
    color: color.textPrimary,
  },
  whenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: space.xs,
    minHeight: MIN_TARGET_SIZE,
    marginTop: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
  },
  whenButtonPressed: {
    backgroundColor: color.surface3,
  },
  whenButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  whenPickerOverlayAbsolute: {
    ...StyleSheet.absoluteFill,
    backgroundColor: color.scrim,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  whenPickerSheet: {
    ...elevation.overlay,
    backgroundColor: color.surface1,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingBottom: space.md,
  },
  whenPickerToolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: color.borderSubtle,
  },
  whenPickerDoneBtn: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  whenPickerDone: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  field: {
    gap: space.xxs,
  },
  fieldLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  fieldHint: {
    ...typography.caption,
    color: color.textTertiary,
  },
  input: {
    minHeight: INPUT_MIN_HEIGHT,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    backgroundColor: color.surface2,
    color: color.textPrimary,
  },
  inputNumeric: {
    ...typography.numericMedium,
    textAlign: 'center',
  },
  inputSessionNotes: {
    ...typography.body,
  },
  textArea: {
    minHeight: NOTES_MIN_HEIGHT,
    textAlignVertical: 'top',
  },
  textAreaSmall: {
    minHeight: SESSION_NOTES_MIN_HEIGHT,
    textAlignVertical: 'top',
  },
  modalActions: {
    flexDirection: 'row',
    gap: space.sm,
  },
  btnGhostLarge: {
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
  btnPrimaryLarge: {
    flex: 1,
    flexDirection: 'row',
    gap: space.xs,
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
  btnPrimaryText: {
    ...typography.calloutStrong,
    color: color.onGold,
  },
  keyboardDoneBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.surface2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: color.borderSubtle,
    paddingHorizontal: space.md,
  },
  keyboardDoneBarSpacer: {
    flex: 1,
  },
  keyboardDoneBtn: {
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
    paddingHorizontal: space.sm,
  },
  keyboardDoneText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
});
