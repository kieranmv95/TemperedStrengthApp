import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';

const MULTILINE_INPUT_MIN_HEIGHT = 88;

/** Shared styles for every screen under `app/checkin`. */
export const checkinScreenStyles = StyleSheet.create({
  page: {
    gap: space.xl,
  },
  errorText: {
    ...typography.callout,
    color: color.danger,
    backgroundColor: color.dangerTint,
    borderRadius: radius.md,
    padding: space.md,
  },

  segmentRow: {
    flexDirection: 'row',
    padding: space.xxs,
    gap: space.xxs,
    backgroundColor: color.surface1,
    borderRadius: radius.pill,
    ...elevation.raised,
  },
  segmentOption: {
    flex: 1,
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  segmentOptionPressed: {
    backgroundColor: color.surface2,
  },
  segmentOptionActive: {
    backgroundColor: color.gold,
  },
  segmentText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  segmentTextActive: {
    color: color.onGold,
  },

  statsRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  /** Large text: stat tiles stack instead of sharing a row. */
  statsStacked: {
    flexDirection: 'column',
  },
  statCard: {
    flex: 1,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    paddingVertical: space.md,
    paddingHorizontal: space.sm,
    alignItems: 'center',
    ...elevation.raised,
  },
  statValue: {
    ...typography.numericMedium,
    color: color.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: color.textSecondary,
    textAlign: 'center',
  },

  section: {
    gap: space.sm,
  },
  sectionNote: {
    ...typography.callout,
    color: color.textSecondary,
  },
  list: {
    gap: space.sm,
  },

  emptyState: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.xl,
    gap: space.md,
    alignItems: 'center',
    ...elevation.raised,
  },
  emptyTitle: {
    ...typography.title2,
    color: color.textPrimary,
    textAlign: 'center',
  },
  emptyBody: {
    ...typography.callout,
    color: color.textSecondary,
    textAlign: 'center',
  },

  primaryButton: {
    alignSelf: 'stretch',
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    backgroundColor: color.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonPressed: {
    backgroundColor: color.goldStrong,
  },
  primaryButtonDisabled: {
    backgroundColor: color.surface3,
  },
  primaryButtonText: {
    ...typography.headline,
    color: color.onGold,
  },
  primaryButtonTextDisabled: {
    color: color.textDisabled,
  },
  secondaryButton: {
    alignSelf: 'stretch',
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonPressed: {
    backgroundColor: color.surface3,
  },
  secondaryButtonText: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  destructiveButton: {
    alignSelf: 'stretch',
    minHeight: MIN_TARGET_SIZE,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  destructiveButtonPressed: {
    backgroundColor: color.dangerTint,
  },
  destructiveButtonDisabled: {
    borderColor: color.surface3,
  },
  destructiveButtonText: {
    ...typography.calloutStrong,
    color: color.danger,
  },
  buttonTextDisabled: {
    color: color.textDisabled,
  },

  upsellCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
    ...elevation.raised,
  },
  upsellTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  upsellBody: {
    ...typography.callout,
    color: color.textSecondary,
  },

  slotsCard: {
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.xs,
    ...elevation.raised,
  },
  slotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: space.sm,
  },
  slotsLabel: {
    ...typography.calloutStrong,
    color: color.textPrimary,
  },
  slotsValue: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },

  trackedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE + space.md,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    ...elevation.raised,
  },
  trackedRowPressed: {
    backgroundColor: color.surface2,
  },
  trackedRowTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
  trackedRowTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  trackedRowMeta: {
    ...typography.callout,
    color: color.textSecondary,
  },
  reorderButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reorderButtonPressed: {
    backgroundColor: color.surface3,
  },
  reorderButtonDisabled: {
    borderColor: color.surface3,
  },

  categoryHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: space.sm,
  },
  categoryTitle: {
    ...typography.headline,
    color: color.textPrimary,
    flexShrink: 1,
  },
  selectionCounter: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },

  supplementTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  supplementMeta: {
    ...typography.callout,
    color: color.textSecondary,
    marginTop: space.xxs,
  },
  supplementAdherence: {
    gap: space.xs,
    marginTop: space.sm,
  },
  supplementAdherenceText: {
    ...typography.caption,
    color: color.textSecondary,
  },
  disclaimer: {
    ...typography.caption,
    color: color.textTertiary,
  },

  fieldGroup: {
    gap: space.xs,
  },
  fieldLabel: {
    ...typography.captionStrong,
    color: color.textSecondary,
  },
  fieldTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  fieldHint: {
    ...typography.caption,
    color: color.textTertiary,
  },
  textInput: {
    ...typography.body,
    minHeight: MIN_TARGET_SIZE + space.xxs,
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.borderStrong,
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    color: color.textPrimary,
  },
  textInputMultiline: {
    minHeight: MULTILINE_INPUT_MIN_HEIGHT,
    textAlignVertical: 'top',
  },
  inlineFieldRow: {
    flexDirection: 'row',
    gap: space.sm,
  },
  /** Large text: paired fields stack instead of sharing a row. */
  inlineFieldStacked: {
    flexDirection: 'column',
  },
  inlineField: {
    flex: 1,
    gap: space.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  chipScroll: {
    marginHorizontal: -space.md,
  },
  chipScrollContent: {
    flexDirection: 'row',
    gap: space.xs,
    paddingHorizontal: space.md,
    paddingVertical: space.xxs,
  },
  seedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    minHeight: MIN_TARGET_SIZE,
    paddingVertical: space.xs,
    paddingHorizontal: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
    ...elevation.raised,
  },
  seedRowPressed: {
    backgroundColor: color.surface2,
  },
  seedName: {
    ...typography.calloutStrong,
    color: color.textPrimary,
    flex: 1,
    minWidth: 0,
  },
  seedDose: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingLeft: space.md,
    borderRadius: radius.md,
    backgroundColor: color.surface1,
    ...elevation.raised,
  },
  timeText: {
    ...typography.numericMedium,
    color: color.textPrimary,
    flex: 1,
  },
  iconButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
  },
  addTimeInput: {
    flex: 1,
  },
  numberStepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
  },
  numberStepperButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    borderWidth: 1,
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberStepperButtonPressed: {
    backgroundColor: color.surface3,
  },
  numberStepperButtonDisabled: {
    borderColor: color.surface3,
  },
  numberStepperValue: {
    ...typography.numericMedium,
    minWidth: MIN_TARGET_SIZE,
    textAlign: 'center',
    color: color.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    ...elevation.raised,
  },
  switchRowTextBlock: {
    flex: 1,
    minWidth: 0,
    gap: space.xxs,
  },
});
