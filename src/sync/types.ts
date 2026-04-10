export type SyncDecision = 'keep_local' | 'keep_icloud';

export type SyncConflict = {
  key: string;
  reason: 'timestamp_equal' | 'timestamp_unknown';
  local: { value: string | null; ts: number };
  icloud: { value: string | null; ts: number; deleted: boolean };
};

export type ICloudEnvelope = {
  v: string | null;
  ts: number;
  deleted?: boolean;
};

export type ParsedICloudValue =
  | { kind: 'envelope'; envelope: ICloudEnvelope }
  | { kind: 'legacy_string'; value: string }
  | { kind: 'missing' };

