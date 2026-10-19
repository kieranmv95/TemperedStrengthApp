import {
  color,
  elevation,
  MIN_TARGET_SIZE,
  radius,
  space,
  typography,
} from '@/src/constants/tokens';
import { StyleSheet } from 'react-native';
import { NUMBER_FIELD_MIN_HEIGHT } from '@/src/components/ds/NumberField';

export const SET_NUMBER_WIDTH = 32;
const REPS_FIELD_WIDTH = 72;
const RPE_FIELD_WIDTH = 64;

export const exerciseCardStyles = StyleSheet.create({
  card: {
    ...elevation.raised,
    backgroundColor: color.surface1,
    borderRadius: radius.md,
    padding: space.md,
    gap: space.sm,
  },
  header: {
    gap: space.xs,
  },
  exerciseName: {
    ...typography.title2,
    color: color.textPrimary,
  },
  metaLine: {
    ...typography.callout,
    color: color.textSecondary,
  },
  metaLineAccent: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
  },
  notes: {
    backgroundColor: color.surface2,
    borderRadius: radius.sm,
    padding: space.sm,
    gap: space.xxs,
  },
  notesText: {
    ...typography.callout,
    color: color.textSecondary,
  },
  notesToggle: {
    alignSelf: 'flex-start',
    minHeight: MIN_TARGET_SIZE,
    justifyContent: 'center',
  },
  notesToggleText: {
    ...typography.calloutStrong,
    color: color.gold,
  },
  setsHeader: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.xs,
    marginTop: space.xs,
  },
  setsTitle: {
    ...typography.headline,
    color: color.textPrimary,
  },
  setControls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: space.xxs,
  },
  roundButton: {
    width: MIN_TARGET_SIZE,
    height: MIN_TARGET_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.surface2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundButtonPressed: {
    backgroundColor: color.surface3,
  },
  roundButtonActive: {
    backgroundColor: color.goldTint,
  },
  setCountText: {
    ...typography.numericSmall,
    color: color.textPrimary,
    minWidth: space.xxl,
    textAlign: 'center',
  },
  columnHeaders: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    paddingHorizontal: space.xxs,
  },
  columnLabel: {
    ...typography.captionStrong,
    color: color.textTertiary,
  },
  columnSet: {
    width: SET_NUMBER_WIDTH,
    textAlign: 'center',
  },
  columnSetIcon: {
    width: SET_NUMBER_WIDTH,
    alignItems: 'center',
  },
  columnFlex: {
    flex: 1,
  },
  columnReps: {
    width: REPS_FIELD_WIDTH,
  },
  columnRpe: {
    width: RPE_FIELD_WIDTH,
  },
  columnCheck: {
    width: MIN_TARGET_SIZE,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs,
    padding: space.xxs,
    borderRadius: radius.sm,
  },
  setNumberColumn: {
    width: SET_NUMBER_WIDTH,
    minHeight: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xxs,
  },
  setNumber: {
    ...typography.numericSmall,
    color: color.textSecondary,
  },
  setNumberActive: {
    color: color.gold,
  },
  dragHandle: {
    width: SET_NUMBER_WIDTH,
    height: MIN_TARGET_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fields: {
    flex: 1,
    flexDirection: 'row',
    gap: space.xs,
  },
  fieldFlex: {
    flex: 1,
  },
  /** Large text: weight on its own line, reps and RPE share the next. */
  fieldsStacked: {
    flexWrap: 'wrap',
  },
  fieldFullWidth: {
    flexBasis: '100%',
  },
  fieldReps: {
    width: REPS_FIELD_WIDTH,
  },
  fieldRpe: {
    width: RPE_FIELD_WIDTH,
  },
  weightWithRemove: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.xxs,
  },
  addWeightButton: {
    minHeight: NUMBER_FIELD_MIN_HEIGHT,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: color.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addWeightText: {
    ...typography.calloutStrong,
    color: color.textSecondary,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    marginTop: space.xs,
  },
  emptySlot: {
    gap: space.sm,
  },
  emptySlotLabel: {
    ...typography.headline,
    color: color.textSecondary,
  },
});
