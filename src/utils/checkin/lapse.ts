import type { CheckinSettings } from '@/src/types/checkin';
import {
  FREE_BEHAVIOUR_CAP,
  FREE_SUPPLEMENT_CAP,
  countActiveSupplements,
  countCapBehaviours,
} from '@/src/utils/checkin/caps';
import {
  getCheckinSettings,
  getSupplements,
  getTrackedBehaviours,
  updateCheckinSettings,
} from '@/src/utils/storage/checkin';

/**
 * Keeps the lapse gate in sync with the current entitlement.
 *
 * Pro users never have a gate. A free user holding more than the free caps is
 * marked `lapsePending` with no editable ids, which is the signal the check-in
 * screen uses to send them to the choose-active gate. Once they have chosen,
 * `lapsePending` stays true and the ids stay populated so the caps helpers can
 * keep the rest read-only.
 */
export async function ensureCheckinLapseGate(
  isPro: boolean
): Promise<CheckinSettings> {
  const settings = await getCheckinSettings();

  if (isPro) {
    if (
      !settings.lapsePending &&
      settings.editableBehaviourIds === null &&
      settings.editableSupplementId === null
    ) {
      return settings;
    }
    return updateCheckinSettings({
      lapsePending: false,
      editableBehaviourIds: null,
      editableSupplementId: null,
    });
  }

  const [tracked, supplements] = await Promise.all([
    getTrackedBehaviours(),
    getSupplements(),
  ]);
  const overCap =
    countCapBehaviours(tracked) > FREE_BEHAVIOUR_CAP ||
    countActiveSupplements(supplements) > FREE_SUPPLEMENT_CAP;

  if (!overCap) {
    if (!settings.lapsePending) {
      return settings;
    }
    // They trimmed back down to the free caps, so the gate no longer applies.
    return updateCheckinSettings({
      lapsePending: false,
      editableBehaviourIds: null,
      editableSupplementId: null,
    });
  }

  if (settings.lapsePending) {
    return settings;
  }
  return updateCheckinSettings({
    lapsePending: true,
    editableBehaviourIds: null,
    editableSupplementId: null,
  });
}
