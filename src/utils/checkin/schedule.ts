import { formatLocalYMD, prevLocalYMD } from '@/src/services/streakService';
import type { Supplement, SupplementSchedule } from '@/src/types/supplements';

function parseYmd(ymd: string): Date {
  const [ys, ms, ds] = ymd.split('-');
  return new Date(Number(ys), Number(ms) - 1, Number(ds), 12, 0, 0);
}

function daysBetween(startYmd: string, endYmd: string): number {
  const start = parseYmd(startYmd);
  const end = parseYmd(endYmd);
  const ms = end.getTime() - start.getTime();
  return Math.round(ms / (24 * 60 * 60 * 1000));
}

/** JS getDay(): 0=Sun … 6=Sat → ISO 1=Mon … 7=Sun */
export function localDateToIsoWeekday(ymd: string): number {
  const d = parseYmd(ymd).getDay();
  return d === 0 ? 7 : d;
}

/**
 * Whether a supplement schedule produces doses on the given local date.
 * Does not consult status (caller should skip paused/archived).
 */
export function scheduleAppliesOnDate(
  schedule: SupplementSchedule,
  date: string
): boolean {
  if (date < schedule.startDate) {
    return false;
  }
  if (schedule.endDate && date > schedule.endDate) {
    return false;
  }

  switch (schedule.type) {
    case 'daily':
      return true;
    case 'as_needed':
      // Still may have times for optional logging; show doses if times exist.
      return schedule.times.length > 0;
    case 'specific_days': {
      const days = schedule.daysOfWeek ?? [];
      const weekday = localDateToIsoWeekday(date);
      return days.includes(weekday);
    }
    case 'every_n_days': {
      const interval = schedule.intervalDays ?? 1;
      if (interval < 1) {
        return false;
      }
      const offset = daysBetween(schedule.startDate, date);
      return offset % interval === 0;
    }
    case 'cycle': {
      const onDays = schedule.cycleOnDays ?? 0;
      const offDays = schedule.cycleOffDays ?? 0;
      const cycleLen = onDays + offDays;
      if (cycleLen < 1 || onDays < 1) {
        return false;
      }
      const offset = daysBetween(schedule.startDate, date);
      const pos = offset % cycleLen;
      return pos < onDays;
    }
    default:
      return false;
  }
}

export function expectedTimesForDate(
  schedule: SupplementSchedule,
  date: string
): string[] {
  if (!scheduleAppliesOnDate(schedule, date)) {
    return [];
  }
  return [...schedule.times].sort((a, b) => a.localeCompare(b));
}

export function isSupplementDueOnDate(
  supplement: Supplement,
  date: string
): boolean {
  if (supplement.status !== 'active') {
    return false;
  }
  return expectedTimesForDate(supplement.schedule, date).length > 0;
}

export function addLocalDays(ymd: string, days: number): string {
  const d = parseYmd(ymd);
  d.setDate(d.getDate() + days);
  return formatLocalYMD(d);
}

export function listLocalDatesInclusive(
  startYmd: string,
  endYmd: string
): string[] {
  if (startYmd > endYmd) {
    return [];
  }
  const out: string[] = [];
  let cur = startYmd;
  while (cur <= endYmd) {
    out.push(cur);
    if (cur === endYmd) {
      break;
    }
    cur = addLocalDays(cur, 1);
  }
  return out;
}

export { formatLocalYMD, prevLocalYMD };
