import type {
  BehaviourEntrySource,
  CheckinSettings,
} from '@/src/types/checkin';
import type {
  SupplementDoseUnit,
  SupplementForm,
  SupplementLogStatus,
  SupplementSchedule,
  SupplementStatus,
} from '@/src/types/supplements';

export const CHECKIN_DOMAIN = 'checkin';

export const CHECKIN_META = {
  lastRowSyncedAt: 'last_row_synced_at',
} as const;

export const CHECKIN_SETTINGS_LOCAL_ID = 'local';

export type LocalCheckinSettingsRow = {
  id: string;
  womens_health_visible: 0 | 1;
  health_sync_opt_in: 0 | 1;
  lapse_pending: 0 | 1;
  editable_behaviour_ids: string | null;
  editable_supplement_id: string | null;
  updated_at: string;
  dirty: 0 | 1;
};

export type RemoteCheckinSettingsRow = {
  user_id: string;
  womens_health_visible: boolean;
  health_sync_opt_in: boolean;
  lapse_pending: boolean;
  editable_behaviour_ids: string[] | null;
  editable_supplement_id: string | null;
  updated_at: string;
};

export type LocalTrackedBehaviourRow = {
  id: string;
  behaviour_id: string;
  sort_order: number;
  sensitive: 0 | 1;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

export type RemoteTrackedBehaviourRow = {
  id: string;
  user_id: string;
  behaviour_id: string;
  sort_order: number;
  sensitive: boolean;
  updated_at: string;
  deleted_at: string | null;
};

export type LocalBehaviourEntryRow = {
  id: string;
  local_date: string;
  behaviour_id: string;
  value: string;
  logged_at: string;
  source: BehaviourEntrySource;
  sensitive: 0 | 1;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

export type RemoteBehaviourEntryRow = {
  id: string;
  user_id: string;
  local_date: string;
  behaviour_id: string;
  value: boolean | number | string;
  logged_at: string;
  source: BehaviourEntrySource;
  sensitive: boolean;
  updated_at: string;
  deleted_at: string | null;
};

export type LocalSupplementRow = {
  id: string;
  name: string;
  brand: string | null;
  form: SupplementForm;
  dose_amount: number;
  dose_unit: SupplementDoseUnit;
  notes: string | null;
  schedule: string;
  reminders_enabled: 0 | 1;
  status: SupplementStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

export type RemoteSupplementRow = {
  id: string;
  user_id: string;
  name: string;
  brand: string | null;
  form: SupplementForm;
  dose_amount: number;
  dose_unit: SupplementDoseUnit;
  notes: string | null;
  schedule: SupplementSchedule;
  reminders_enabled: boolean;
  status: SupplementStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type LocalSupplementLogRow = {
  id: string;
  local_date: string;
  supplement_id: string;
  scheduled_time: string;
  status: SupplementLogStatus;
  actioned_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

export type RemoteSupplementLogRow = {
  id: string;
  user_id: string;
  local_date: string;
  supplement_id: string;
  scheduled_time: string;
  status: SupplementLogStatus;
  actioned_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export function settingsRowToApp(
  row: LocalCheckinSettingsRow | null
): CheckinSettings {
  if (!row) {
    return {
      womensHealthVisible: false,
      healthSyncOptIn: false,
      lapsePending: false,
      editableBehaviourIds: null,
      editableSupplementId: null,
    };
  }
  let editableBehaviourIds: string[] | null = null;
  if (row.editable_behaviour_ids) {
    try {
      const parsed = JSON.parse(row.editable_behaviour_ids) as unknown;
      if (Array.isArray(parsed)) {
        editableBehaviourIds = parsed.filter(
          (item): item is string => typeof item === 'string'
        );
      }
    } catch {
      editableBehaviourIds = null;
    }
  }
  return {
    womensHealthVisible: row.womens_health_visible === 1,
    healthSyncOptIn: row.health_sync_opt_in === 1,
    lapsePending: row.lapse_pending === 1,
    editableBehaviourIds,
    editableSupplementId: row.editable_supplement_id,
  };
}

export function newCheckinId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  return `checkin_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}
