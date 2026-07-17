import type { ProgramDaySplitKey } from '@/src/utils/programStartWeekday';

export const CALENDAR_DAY_KEYS: ProgramDaySplitKey[] = [
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
  'sun',
];

export const CAL_DAY_LABELS: Record<ProgramDaySplitKey, string> = {
  mon: 'M',
  tue: 'T',
  wed: 'W',
  thu: 'T',
  fri: 'F',
  sat: 'S',
  sun: 'S',
};

/** Weekday strip ordered from `startKey` (e.g. Tue → T W T F S S M). */
export function weekKeysStartingFrom(
  startKey: ProgramDaySplitKey
): ProgramDaySplitKey[] {
  const idx = CALENDAR_DAY_KEYS.indexOf(startKey);
  if (idx <= 0) {
    return [...CALENDAR_DAY_KEYS];
  }
  return [
    ...CALENDAR_DAY_KEYS.slice(idx),
    ...CALENDAR_DAY_KEYS.slice(0, idx),
  ];
}
