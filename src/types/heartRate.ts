export type HeartRateZoneId = 1 | 2 | 3 | 4 | 5;

/** `basic` is a % of estimated max HR. `karvonen` is a % of HR reserve. */
export type ZoneMethod = 'basic' | 'karvonen';

export type ZoneRange = {
  zone: HeartRateZoneId;
  minBpm: number;
  /** `null` for the open-ended top zone, shown as "171+". */
  maxBpm: number | null;
};

export type RestingHeartRateSource = 'health' | 'manual';

export type RestingHeartRate = {
  bpm: number;
  source: RestingHeartRateSource;
  /** ISO timestamp of the reading (Health) or of the manual entry. */
  recordedAt: string;
};

export type HeartRateZoneSettings = {
  birthYear: number | null;
  method: ZoneMethod;
};

export type ZoneSetupState = 'notSetUp' | 'ageOnly' | 'ageAndRhr';
