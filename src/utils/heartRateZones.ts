import type {
  HeartRateZoneId,
  HeartRateZoneSettings,
  RestingHeartRate,
  ZoneMethod,
  ZoneRange,
  ZoneSetupState,
} from '@/src/types/heartRate';

export const MIN_ZONE_AGE = 13;
export const MAX_ZONE_AGE = 100;
export const MIN_RESTING_HR = 30;
export const MAX_RESTING_HR = 120;

export type HeartRateZoneInfo = {
  zone: HeartRateZoneId;
  name: string;
  description: string;
  minPct: number;
  /** `null` for the open-ended top zone. */
  maxPct: number | null;
};

export const HR_ZONES: HeartRateZoneInfo[] = [
  {
    zone: 1,
    name: 'Warm-up',
    description: 'Walking, warm-ups and active recovery.',
    minPct: 0.5,
    maxPct: 0.6,
  },
  {
    zone: 2,
    name: 'Aerobic base',
    description: 'Easy, conversational pace. Where your engine gets built.',
    minPct: 0.6,
    maxPct: 0.7,
  },
  {
    zone: 3,
    name: 'Tempo',
    description: 'Moderate and steady. Talking gets harder.',
    minPct: 0.7,
    maxPct: 0.8,
  },
  {
    zone: 4,
    name: 'Threshold',
    description: 'Hard. Around your lactate threshold.',
    minPct: 0.8,
    maxPct: 0.9,
  },
  {
    zone: 5,
    name: 'Max',
    description: 'All-out efforts. VO2 max work.',
    minPct: 0.9,
    maxPct: null,
  },
];

export function isValidZoneAge(age: number): boolean {
  return Number.isInteger(age) && age >= MIN_ZONE_AGE && age <= MAX_ZONE_AGE;
}

export function isValidRestingHr(bpm: number): boolean {
  return (
    Number.isInteger(bpm) && bpm >= MIN_RESTING_HR && bpm <= MAX_RESTING_HR
  );
}

export function ageFromBirthYear(
  birthYear: number,
  now: Date = new Date()
): number {
  return now.getFullYear() - birthYear;
}

export function birthYearFromAge(age: number, now: Date = new Date()): number {
  return now.getFullYear() - age;
}

/** Whole years since `dateOfBirth`, or `null` when out of range. */
export function ageFromDateOfBirth(
  dateOfBirth: Date,
  now: Date = new Date()
): number | null {
  let age = now.getFullYear() - dateOfBirth.getFullYear();
  const birthdayPassed =
    now.getMonth() > dateOfBirth.getMonth() ||
    (now.getMonth() === dateOfBirth.getMonth() &&
      now.getDate() >= dateOfBirth.getDate());
  if (!birthdayPassed) {
    age -= 1;
  }
  return isValidZoneAge(age) ? age : null;
}

/** Age in years from `settings.birthYear`, or `null` when unset or out of range. */
export function zoneAgeFromSettings(
  settings: HeartRateZoneSettings,
  now: Date = new Date()
): number | null {
  if (settings.birthYear === null) {
    return null;
  }
  const age = ageFromBirthYear(settings.birthYear, now);
  return isValidZoneAge(age) ? age : null;
}

export function estimateMaxHeartRate(age: number): number {
  return 220 - age;
}

/** Karvonen needs a resting HR; without one the basic method is used. */
export function resolveZoneMethod(
  method: ZoneMethod,
  restingHr: number | null
): ZoneMethod {
  if (method === 'karvonen' && restingHr !== null) {
    return 'karvonen';
  }
  return 'basic';
}

type CalculateZoneRangesInput = {
  age: number;
  restingHr: number | null;
  method: ZoneMethod;
};

/**
 * Bpm range for each zone. Ranges are contiguous: each zone starts one beat
 * above the previous zone's top, so no bpm sits in two zones.
 */
export function calculateZoneRanges({
  age,
  restingHr,
  method,
}: CalculateZoneRangesInput): ZoneRange[] | null {
  if (!isValidZoneAge(age)) {
    return null;
  }
  const maxHr = estimateMaxHeartRate(age);
  const validRestingHr =
    restingHr !== null && isValidRestingHr(restingHr) && restingHr < maxHr
      ? restingHr
      : null;
  const effectiveMethod = resolveZoneMethod(method, validRestingHr);

  const targetBpm = (pct: number): number => {
    if (effectiveMethod === 'karvonen' && validRestingHr !== null) {
      return Math.round((maxHr - validRestingHr) * pct + validRestingHr);
    }
    return Math.round(maxHr * pct);
  };

  const ranges: ZoneRange[] = [];
  for (const info of HR_ZONES) {
    const previous = ranges[ranges.length - 1];
    const minBpm =
      previous && previous.maxBpm !== null
        ? previous.maxBpm + 1
        : targetBpm(info.minPct);
    const maxBpm = info.maxPct === null ? null : targetBpm(info.maxPct);
    ranges.push({ zone: info.zone, minBpm, maxBpm });
  }
  return ranges;
}

export function findZoneRange(
  ranges: ZoneRange[] | null,
  zone: HeartRateZoneId
): ZoneRange | null {
  return ranges?.find((range) => range.zone === zone) ?? null;
}

export function getZoneInfo(zone: HeartRateZoneId): HeartRateZoneInfo {
  return HR_ZONES[zone - 1];
}

/** "130–140 bpm", or "171+ bpm" for the open top zone. */
export function formatZoneRange(range: ZoneRange): string {
  if (range.maxBpm === null) {
    return `${range.minBpm}+ bpm`;
  }
  return `${range.minBpm}–${range.maxBpm} bpm`;
}

/** "50–60%", or "90%+" for the open top zone. */
export function formatZonePercent(info: HeartRateZoneInfo): string {
  const min = Math.round(info.minPct * 100);
  if (info.maxPct === null) {
    return `${min}%+`;
  }
  return `${min}–${Math.round(info.maxPct * 100)}%`;
}

export function zoneSetupState(
  settings: HeartRateZoneSettings,
  restingHr: RestingHeartRate | null,
  now: Date = new Date()
): ZoneSetupState {
  if (zoneAgeFromSettings(settings, now) === null) {
    return 'notSetUp';
  }
  return restingHr === null ? 'ageOnly' : 'ageAndRhr';
}

/** Zone ranges for stored settings, or `null` until an age is set. */
export function zoneRangesFromSettings(
  settings: HeartRateZoneSettings,
  restingHr: RestingHeartRate | null,
  now: Date = new Date()
): ZoneRange[] | null {
  const age = zoneAgeFromSettings(settings, now);
  if (age === null) {
    return null;
  }
  return calculateZoneRanges({
    age,
    restingHr: restingHr?.bpm ?? null,
    method: settings.method,
  });
}
