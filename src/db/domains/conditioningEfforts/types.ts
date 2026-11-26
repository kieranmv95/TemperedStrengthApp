/** Local SQLite row for one conditioning effort. */
export type LocalConditioningEffortRow = {
  id: string;
  activity_id: string;
  distance_m: number;
  duration_ms: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

/** Payload upserted to Supabase `conditioning_efforts`. */
export type RemoteConditioningEffortRow = {
  id: string;
  user_id: string;
  activity_id: string;
  distance_m: number;
  duration_ms: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const CONDITIONING_EFFORTS_DOMAIN = 'conditioning_efforts';

export const CONDITIONING_EFFORTS_META = {
  lastRowSyncedAt: 'last_row_synced_at',
} as const;
