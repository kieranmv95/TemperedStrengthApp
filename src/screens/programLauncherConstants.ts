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
