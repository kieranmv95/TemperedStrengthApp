import { formatLocalYMD } from '@/src/services/streakService';
import { getBehaviourCatalogue } from '@/src/utils/checkin/catalogue';
import {
  deriveDosesForDate,
  getBehaviourEntriesForDate,
  getSupplementLogsForDate,
  getSupplements,
  getTrackedBehaviours,
} from '@/src/utils/storage';

export type HomeCheckinSummary = {
  loggedCount: number;
  totalCount: number;
  supplementsDue: number;
  supplementsTotal: number;
};

/** Today's check-in progress for the home card. */
export async function loadHomeCheckinSummary(): Promise<HomeCheckinSummary> {
  const today = formatLocalYMD(new Date());
  const [catalogue, tracked, entries, supplements, logs] = await Promise.all([
    getBehaviourCatalogue(),
    getTrackedBehaviours(),
    getBehaviourEntriesForDate(today),
    getSupplements(),
    getSupplementLogsForDate(today),
  ]);

  const behavioursById = new Map(catalogue.behaviours.map((b) => [b.id, b]));
  const trackedIds = tracked
    .filter((item) => {
      const behaviour = behavioursById.get(item.behaviourId);
      return behaviour !== undefined && !behaviour.deprecated;
    })
    .map((item) => item.behaviourId);
  const loggedIds = new Set(entries.map((entry) => entry.behaviourId));
  const doses = deriveDosesForDate({
    date: today,
    today,
    supplements,
    logs,
  });

  return {
    loggedCount: trackedIds.filter((id) => loggedIds.has(id)).length,
    totalCount: trackedIds.length,
    supplementsDue: doses.filter((dose) => dose.status === 'pending').length,
    supplementsTotal: doses.length,
  };
}
