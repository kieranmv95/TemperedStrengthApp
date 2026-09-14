import type { TrackedBehaviour } from '@/src/types/checkin';
import type { Supplement } from '@/src/types/supplements';

export const FREE_BEHAVIOUR_CAP = 3;
export const FREE_SUPPLEMENT_CAP = 1;

export function countCapBehaviours(
  tracked: readonly TrackedBehaviour[]
): number {
  return tracked.filter((t) => !t.sensitive).length;
}

export function countActiveSupplements(
  supplements: readonly Supplement[]
): number {
  return supplements.filter((s) => s.status === 'active').length;
}

export function canAddBehaviour(input: {
  isPro: boolean;
  tracked: readonly TrackedBehaviour[];
  behaviourSensitive: boolean;
}): boolean {
  if (input.isPro || input.behaviourSensitive) {
    return true;
  }
  return countCapBehaviours(input.tracked) < FREE_BEHAVIOUR_CAP;
}

export function canAddActiveSupplement(input: {
  isPro: boolean;
  supplements: readonly Supplement[];
}): boolean {
  if (input.isPro) {
    return true;
  }
  return countActiveSupplements(input.supplements) < FREE_SUPPLEMENT_CAP;
}

export function isBehaviourEditable(input: {
  isPro: boolean;
  behaviourId: string;
  sensitive: boolean;
  lapsePending: boolean;
  editableBehaviourIds: string[] | null;
}): boolean {
  if (input.isPro) {
    return true;
  }
  if (input.sensitive) {
    return true;
  }
  if (input.lapsePending && input.editableBehaviourIds) {
    return input.editableBehaviourIds.includes(input.behaviourId);
  }
  // Free under cap without lapse gate: all currently tracked non-sensitive are editable
  // until they exceed cap (enforced at add time). Over-cap without completed choose-active
  // still allows edits only after selection — while pending with null ids, treat as not editable
  // for over-cap items. If not pending, all tracked are editable (free user within self-managed cap).
  if (input.lapsePending && !input.editableBehaviourIds) {
    return false;
  }
  return true;
}

export function isSupplementEditable(input: {
  isPro: boolean;
  supplementId: string;
  status: Supplement['status'];
  lapsePending: boolean;
  editableSupplementId: string | null;
}): boolean {
  if (input.isPro) {
    return true;
  }
  if (input.status !== 'active') {
    // paused/archived: allow viewing; editing schedule while paused is allowed for free
    // if they are not over-cap active. Spec: over-cap become read-only. Paused don't count.
    return true;
  }
  if (input.lapsePending) {
    return input.editableSupplementId === input.supplementId;
  }
  return true;
}

export function needsLapseSelection(input: {
  isPro: boolean;
  tracked: readonly TrackedBehaviour[];
  supplements: readonly Supplement[];
  lapsePending: boolean;
  editableBehaviourIds: string[] | null;
}): boolean {
  if (input.isPro) {
    return false;
  }
  const overCap =
    countCapBehaviours(input.tracked) > FREE_BEHAVIOUR_CAP ||
    countActiveSupplements(input.supplements) > FREE_SUPPLEMENT_CAP;
  if (!overCap) {
    return false;
  }
  if (input.lapsePending && !input.editableBehaviourIds) {
    return true;
  }
  return input.lapsePending && input.editableBehaviourIds === null;
}
