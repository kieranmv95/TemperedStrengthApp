import type {
  BehaviourEntry,
  BehaviourEntrySource,
  CheckinSettings,
  TrackedBehaviour,
} from '@/src/types/checkin';
import type {
  DerivedDoseStatus,
  DerivedSupplementDose,
  Supplement,
  SupplementLog,
  SupplementLogStatus,
  SupplementSchedule,
} from '@/src/types/supplements';
import { getBehaviourById } from '@/src/utils/checkin/catalogue';
import {
  expectedTimesForDate,
  listLocalDatesInclusive,
} from '@/src/utils/checkin/schedule';
import {
  getCheckinSettings as getSettingsFromRepo,
  getBehaviourEntryByKey,
  getLocalCheckinSettings,
  getSupplementById,
  getSupplementLogByKey,
  getTrackedBehaviourByBehaviourId,
  listActiveBehaviourEntriesForDate,
  listActiveBehaviourEntriesInRange,
  listActiveSupplementLogsForDate,
  listActiveSupplementLogsInRange,
  listActiveSupplements,
  listActiveTrackedBehaviours,
  softDeleteTrackedBehaviour,
  upsertLocalBehaviourEntry,
  upsertLocalCheckinSettings,
  upsertLocalSupplement,
  upsertLocalSupplementLog,
  upsertLocalTrackedBehaviour,
} from '@/src/db/domains/checkin/repository';
import {
  CHECKIN_SETTINGS_LOCAL_ID,
  newCheckinId,
} from '@/src/db/domains/checkin/types';

function parseEntryValue(raw: string): boolean | number | string {
  try {
    return JSON.parse(raw) as boolean | number | string;
  } catch {
    return raw;
  }
}

function mapTracked(row: {
  id: string;
  behaviour_id: string;
  sort_order: number;
  sensitive: 0 | 1;
}): TrackedBehaviour {
  return {
    id: row.id,
    behaviourId: row.behaviour_id,
    sortOrder: row.sort_order,
    sensitive: row.sensitive === 1,
  };
}

function mapEntry(row: {
  local_date: string;
  behaviour_id: string;
  value: string;
  logged_at: string;
  source: BehaviourEntrySource;
}): BehaviourEntry {
  return {
    date: row.local_date,
    behaviourId: row.behaviour_id,
    value: parseEntryValue(row.value),
    loggedAt: row.logged_at,
    source: row.source,
  };
}

function mapSupplement(row: {
  id: string;
  name: string;
  brand: string | null;
  form: Supplement['form'];
  dose_amount: number;
  dose_unit: Supplement['doseUnit'];
  notes: string | null;
  schedule: string;
  reminders_enabled: 0 | 1;
  status: Supplement['status'];
  created_at: string;
}): Supplement {
  let schedule: SupplementSchedule;
  try {
    schedule = JSON.parse(row.schedule) as SupplementSchedule;
  } catch {
    schedule = {
      type: 'daily',
      times: ['08:00'],
      startDate: row.created_at.slice(0, 10),
    };
  }
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    form: row.form,
    doseAmount: row.dose_amount,
    doseUnit: row.dose_unit,
    notes: row.notes ?? undefined,
    schedule,
    remindersEnabled: row.reminders_enabled === 1,
    status: row.status,
    createdAt: row.created_at,
  };
}

function mapLog(row: {
  local_date: string;
  supplement_id: string;
  scheduled_time: string;
  status: SupplementLogStatus;
  actioned_at: string;
}): SupplementLog {
  return {
    date: row.local_date,
    supplementId: row.supplement_id,
    scheduledTime: row.scheduled_time,
    status: row.status,
    actionedAt: row.actioned_at,
  };
}

export async function getCheckinSettings(): Promise<CheckinSettings> {
  return getSettingsFromRepo();
}

export async function updateCheckinSettings(
  patch: Partial<CheckinSettings>
): Promise<CheckinSettings> {
  const current = await getSettingsFromRepo();
  const next: CheckinSettings = {
    womensHealthVisible:
      patch.womensHealthVisible ?? current.womensHealthVisible,
    healthSyncOptIn: patch.healthSyncOptIn ?? current.healthSyncOptIn,
    lapsePending: patch.lapsePending ?? current.lapsePending,
    editableBehaviourIds:
      patch.editableBehaviourIds !== undefined
        ? patch.editableBehaviourIds
        : current.editableBehaviourIds,
    editableSupplementId:
      patch.editableSupplementId !== undefined
        ? patch.editableSupplementId
        : current.editableSupplementId,
  };
  const now = new Date().toISOString();
  await upsertLocalCheckinSettings({
    id: CHECKIN_SETTINGS_LOCAL_ID,
    womens_health_visible: next.womensHealthVisible ? 1 : 0,
    health_sync_opt_in: next.healthSyncOptIn ? 1 : 0,
    lapse_pending: next.lapsePending ? 1 : 0,
    editable_behaviour_ids: next.editableBehaviourIds
      ? JSON.stringify(next.editableBehaviourIds)
      : null,
    editable_supplement_id: next.editableSupplementId,
    updated_at: now,
    dirty: 1,
  });
  return next;
}

export async function getTrackedBehaviours(): Promise<TrackedBehaviour[]> {
  const rows = await listActiveTrackedBehaviours();
  return rows.map(mapTracked);
}

export async function setTrackedBehaviours(
  behaviourIds: string[]
): Promise<TrackedBehaviour[]> {
  const now = new Date().toISOString();
  const existing = await listActiveTrackedBehaviours();
  const existingById = new Map(existing.map((r) => [r.behaviour_id, r]));
  const nextIds = new Set(behaviourIds);

  for (const row of existing) {
    if (!nextIds.has(row.behaviour_id)) {
      await softDeleteTrackedBehaviour(row.id, now);
    }
  }

  const result: TrackedBehaviour[] = [];
  for (let i = 0; i < behaviourIds.length; i++) {
    const behaviourId = behaviourIds[i];
    if (!behaviourId) continue;
    const catalogueItem = await getBehaviourById(behaviourId);
    const sensitive = catalogueItem?.sensitive === true;
    const prev =
      existingById.get(behaviourId) ??
      (await getTrackedBehaviourByBehaviourId(behaviourId));
    const id = prev?.id ?? newCheckinId();
    await upsertLocalTrackedBehaviour({
      id,
      behaviour_id: behaviourId,
      sort_order: (i + 1) * 10,
      sensitive: sensitive ? 1 : 0,
      updated_at: now,
      deleted_at: null,
      dirty: 1,
    });
    result.push({
      id,
      behaviourId,
      sortOrder: (i + 1) * 10,
      sensitive,
    });
  }
  return result;
}

export async function reorderTrackedBehaviours(
  behaviourIdsInOrder: string[]
): Promise<void> {
  await setTrackedBehaviours(behaviourIdsInOrder);
}

export async function getBehaviourEntriesForDate(
  date: string
): Promise<BehaviourEntry[]> {
  const rows = await listActiveBehaviourEntriesForDate(date);
  return rows.map(mapEntry);
}

export async function getBehaviourEntriesInRange(
  startDate: string,
  endDate: string
): Promise<BehaviourEntry[]> {
  const rows = await listActiveBehaviourEntriesInRange(startDate, endDate);
  return rows.map(mapEntry);
}

export async function upsertBehaviourEntry(input: {
  date: string;
  behaviourId: string;
  value: boolean | number | string;
  source?: BehaviourEntrySource;
}): Promise<BehaviourEntry> {
  const now = new Date().toISOString();
  const catalogueItem = await getBehaviourById(input.behaviourId);
  const sensitive = catalogueItem?.sensitive === true;
  const existing = await getBehaviourEntryByKey(input.date, input.behaviourId);
  const id = existing?.id ?? newCheckinId();
  const source = input.source ?? 'manual';
  await upsertLocalBehaviourEntry({
    id,
    local_date: input.date,
    behaviour_id: input.behaviourId,
    value: JSON.stringify(input.value),
    logged_at: now,
    source,
    sensitive: sensitive ? 1 : 0,
    updated_at: now,
    deleted_at: null,
    dirty: 1,
  });
  return {
    date: input.date,
    behaviourId: input.behaviourId,
    value: input.value,
    loggedAt: now,
    source,
  };
}

export async function getSupplements(): Promise<Supplement[]> {
  const rows = await listActiveSupplements();
  return rows.map(mapSupplement);
}

export async function getSupplement(id: string): Promise<Supplement | null> {
  const row = await getSupplementById(id);
  if (!row || row.deleted_at) {
    return null;
  }
  return mapSupplement(row);
}

export async function upsertSupplement(
  supplement: Omit<Supplement, 'createdAt'> & { createdAt?: string }
): Promise<Supplement> {
  const now = new Date().toISOString();
  const existing = await getSupplementById(supplement.id);
  const createdAt = existing?.created_at ?? supplement.createdAt ?? now;
  await upsertLocalSupplement({
    id: supplement.id,
    name: supplement.name,
    brand: supplement.brand ?? null,
    form: supplement.form,
    dose_amount: supplement.doseAmount,
    dose_unit: supplement.doseUnit,
    notes: supplement.notes ?? null,
    schedule: JSON.stringify(supplement.schedule),
    reminders_enabled: supplement.remindersEnabled ? 1 : 0,
    status: supplement.status,
    created_at: createdAt,
    updated_at: now,
    deleted_at: null,
    dirty: 1,
  });
  return {
    ...supplement,
    createdAt,
  };
}

export async function setSupplementStatus(
  id: string,
  status: Supplement['status']
): Promise<void> {
  const existing = await getSupplementById(id);
  if (!existing || existing.deleted_at) {
    return;
  }
  const now = new Date().toISOString();
  await upsertLocalSupplement({
    ...existing,
    status,
    updated_at: now,
    dirty: 1,
  });
}

export async function getSupplementLogsForDate(
  date: string
): Promise<SupplementLog[]> {
  const rows = await listActiveSupplementLogsForDate(date);
  return rows.map(mapLog);
}

export async function getSupplementLogsInRange(
  startDate: string,
  endDate: string
): Promise<SupplementLog[]> {
  const rows = await listActiveSupplementLogsInRange(startDate, endDate);
  return rows.map(mapLog);
}

export async function upsertSupplementLog(input: {
  date: string;
  supplementId: string;
  scheduledTime: string;
  status: SupplementLogStatus;
}): Promise<SupplementLog> {
  const now = new Date().toISOString();
  const existing = await getSupplementLogByKey(
    input.date,
    input.supplementId,
    input.scheduledTime
  );
  const id = existing?.id ?? newCheckinId();
  await upsertLocalSupplementLog({
    id,
    local_date: input.date,
    supplement_id: input.supplementId,
    scheduled_time: input.scheduledTime,
    status: input.status,
    actioned_at: now,
    updated_at: now,
    deleted_at: null,
    dirty: 1,
  });
  return {
    date: input.date,
    supplementId: input.supplementId,
    scheduledTime: input.scheduledTime,
    status: input.status,
    actionedAt: now,
  };
}

export function deriveDosesForDate(input: {
  date: string;
  today: string;
  supplements: readonly Supplement[];
  logs: readonly SupplementLog[];
}): DerivedSupplementDose[] {
  const logMap = new Map<string, SupplementLog>();
  for (const log of input.logs) {
    if (log.date !== input.date) continue;
    logMap.set(`${log.supplementId}|${log.scheduledTime}`, log);
  }

  const doses: DerivedSupplementDose[] = [];
  for (const supplement of input.supplements) {
    if (supplement.status !== 'active') continue;
    const times = expectedTimesForDate(supplement.schedule, input.date);
    for (const scheduledTime of times) {
      const log = logMap.get(`${supplement.id}|${scheduledTime}`);
      let status: DerivedDoseStatus = 'pending';
      if (log) {
        status = log.status;
      } else if (input.date < input.today) {
        status = 'missed';
      }
      doses.push({
        supplementId: supplement.id,
        name: supplement.name,
        scheduledTime,
        date: input.date,
        status,
        doseAmount: supplement.doseAmount,
        doseUnit: supplement.doseUnit,
      });
    }
  }
  return doses.sort((a, b) =>
    a.scheduledTime.localeCompare(b.scheduledTime) ||
    a.name.localeCompare(b.name)
  );
}

/** Adherence: taken / expected over a date range for an active supplement. */
export function computeSupplementAdherence(input: {
  startDate: string;
  endDate: string;
  supplement: Supplement;
  logs: readonly SupplementLog[];
}): { taken: number; expected: number } {
  if (input.supplement.status !== 'active') {
    return { taken: 0, expected: 0 };
  }
  let expected = 0;
  let taken = 0;
  const dates = listLocalDatesInclusive(input.startDate, input.endDate);
  for (const date of dates) {
    const times = expectedTimesForDate(input.supplement.schedule, date);
    expected += times.length;
    for (const time of times) {
      const log = input.logs.find(
        (l) =>
          l.date === date &&
          l.supplementId === input.supplement.id &&
          l.scheduledTime === time &&
          l.status === 'taken'
      );
      if (log) taken += 1;
    }
  }
  return { taken, expected };
}

export { getLocalCheckinSettings };
