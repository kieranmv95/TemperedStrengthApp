import type { RepMax } from '@/src/types/personalBests';

/** Local SQLite row shape for one personal best history entry. */
export type LocalPersonalBestRow = {
  id: string;
  exercise_id: number;
  rep_max: RepMax;
  weight: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
  dirty: 0 | 1;
};

/** Payload upserted to Supabase `personal_best_entries`. */
export type RemotePersonalBestRow = {
  id: string;
  user_id: string;
  exercise_id: number;
  rep_max: number;
  weight: number;
  achieved_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export const PERSONAL_BESTS_DOMAIN = 'personal_bests';

export const PERSONAL_BESTS_META = {
  localMigrated: 'local_v2_migrated',
  lastRowSyncedAt: 'last_row_synced_at',
  cloudKvCutover: 'cloud_kv_cutover',
} as const;
