import type {
  SupplementSchedule,
  SupplementScheduleType,
  SupplementStatus,
} from '@/src/types/supplements';

/** ISO weekdays, 1 = Monday … 7 = Sunday. */
export const ISO_WEEKDAYS: { value: number; label: string }[] = [
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
  { value: 7, label: 'Sun' },
];

export const SCHEDULE_TYPE_LABELS: Record<SupplementScheduleType, string> = {
  daily: 'Daily',
  specific_days: 'Specific days',
  every_n_days: 'Every N days',
  cycle: 'Cycle',
  as_needed: 'As needed',
};

export const STATUS_LABELS: Record<SupplementStatus, string> = {
  active: 'Active',
  paused: 'Paused',
  archived: 'Archived',
};

function timesLabel(times: readonly string[]): string {
  if (times.length < 1) {
    return 'no times set';
  }
  return [...times].sort((a, b) => a.localeCompare(b)).join(', ');
}

export function describeSupplementSchedule(
  schedule: SupplementSchedule
): string {
  const times = timesLabel(schedule.times);
  switch (schedule.type) {
    case 'daily':
      return `Daily · ${times}`;
    case 'specific_days': {
      const days = (schedule.daysOfWeek ?? [])
        .map(
          (value) =>
            ISO_WEEKDAYS.find((day) => day.value === value)?.label ??
            String(value)
        )
        .join(', ');
      return `${days.length > 0 ? days : 'No days'} · ${times}`;
    }
    case 'every_n_days':
      return `Every ${schedule.intervalDays ?? 1} days · ${times}`;
    case 'cycle':
      return `${schedule.cycleOnDays ?? 0} on / ${
        schedule.cycleOffDays ?? 0
      } off · ${times}`;
    case 'as_needed':
      return `As needed · ${times}`;
    default:
      return times;
  }
}

/** Accepts a 24-hour `HH:mm` string. */
export function isValidTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value.trim());
  if (!match) {
    return false;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

/** Accepts a `YYYY-MM-DD` local date string. */
export function isValidLocalDate(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) {
    return false;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }
  return day <= new Date(year, month, 0).getDate();
}
