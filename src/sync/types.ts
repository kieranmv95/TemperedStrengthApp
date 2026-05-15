export type SyncDecision = 'keep_local' | 'keep_icloud';

export type SyncConflict = {
  key: string;
  reason: 'timestamp_equal' | 'timestamp_unknown';
  local: { value: string | null; ts: number };
  icloud: { value: string | null; ts: number; deleted: boolean };
};

/**
 * Merger for monotonic data (e.g. streak dates) where local and iCloud are
 * both partial views and the union is always correct. Returning a string
 * resolves the conflict silently. Returning null falls back to prompting.
 */
export type SyncMerger = (
  localValue: string | null,
  icloudValue: string | null
) => string | null;

export type SyncMergerRegistry = Record<string, SyncMerger>;

export type ICloudEnvelope = {
  v: string | null;
  ts: number;
  deleted?: boolean;
};

export type ParsedICloudValue =
  | { kind: 'envelope'; envelope: ICloudEnvelope }
  | { kind: 'legacy_string'; value: string }
  | { kind: 'missing' };
