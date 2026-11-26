import type { ConditioningActivity } from '@/src/data/conditioningActivities';
import type { ConditioningEffort } from '@/src/types/conditioningEfforts';

export function newConditioningEffortId(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') {
    return c.randomUUID();
  }
  return `effort_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

/** Shown when a typed clock time cannot be read. */
export const DURATION_INPUT_ERROR = 'Enter a time like 22:10 or 01:45:30.';

/**
 * Parse a clock time into milliseconds.
 * Accepts `m:ss`, `mm:ss`, and `hh:mm:ss`, with an optional fractional second.
 */
export function parseDurationInput(raw: string): number | null {
  const trimmed = raw.trim();
  const withHours = /^(\d+):([0-5]\d):([0-5]\d)(?:\.(\d{1,3}))?$/.exec(trimmed);
  const minutesOnly = /^(\d+):([0-5]\d)(?:\.(\d{1,3}))?$/.exec(trimmed);
  const match = withHours ?? minutesOnly;
  if (!match) {
    return null;
  }

  const hours = withHours ? Number(match[1]) : 0;
  const minutes = withHours ? Number(match[2]) : Number(match[1]);
  const seconds = withHours ? Number(match[3]) : Number(match[2]);
  const fraction = match[withHours ? 4 : 3];
  const millis = fraction ? Number(fraction.padEnd(3, '0')) : 0;
  const durationMs = (hours * 3600 + minutes * 60 + seconds) * 1000 + millis;
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return null;
  }
  return durationMs;
}

/** Clock time. An hour or more is `hh:mm:ss`. Tenths show when set. */
export function formatDuration(durationMs: number): string {
  if (!Number.isFinite(durationMs) || durationMs < 0) {
    return '0:00';
  }
  const totalTenths = Math.round(durationMs / 100);
  const tenths = totalTenths % 10;
  const totalSeconds = Math.floor(totalTenths / 10);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);
  const sec = String(seconds).padStart(2, '0');
  const clock =
    hours > 0
      ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${sec}`
      : `${minutes}:${sec}`;
  return tenths > 0 ? `${clock}.${tenths}` : clock;
}

/** Fastest effort. Equal times keep the later date. */
export function bestConditioningEffort(
  entries: ConditioningEffort[]
): ConditioningEffort | undefined {
  if (entries.length === 0) {
    return undefined;
  }
  let best = entries[0];
  for (const entry of entries) {
    if (entry.durationMs < best.durationMs) {
      best = entry;
    } else if (
      entry.durationMs === best.durationMs &&
      entry.achievedAt > best.achievedAt
    ) {
      best = entry;
    }
  }
  return best;
}

export function isFasterConditioningEffort(
  durationMs: number,
  currentBestMs: number | undefined
): boolean {
  return (
    currentBestMs === undefined ||
    (Number.isFinite(durationMs) &&
      durationMs > 0 &&
      durationMs < currentBestMs)
  );
}

export function formatConditioningPace(
  durationMs: number,
  distanceM: number,
  activity: ConditioningActivity
): string {
  if (
    !Number.isFinite(durationMs) ||
    durationMs <= 0 ||
    !Number.isFinite(distanceM) ||
    distanceM <= 0 ||
    activity.pacePerM <= 0
  ) {
    return '';
  }
  const paceMs = (durationMs / distanceM) * activity.pacePerM;
  return `${formatDuration(paceMs)}${activity.paceUnit}`;
}

export type ConditioningSummaryLine = {
  distanceM: number;
  label: string;
};

/** One chip per distance that has a logged effort, in catalog order. */
export function listConditioningSummaryLines(
  entries: ConditioningEffort[],
  activity: ConditioningActivity
): ConditioningSummaryLine[] {
  const lines: ConditioningSummaryLine[] = [];
  for (const distance of activity.distances) {
    const best = bestConditioningEffort(
      entries.filter((entry) => entry.distanceM === distance.distanceM)
    );
    if (!best) {
      continue;
    }
    lines.push({
      distanceM: distance.distanceM,
      label: `${distance.label}: ${formatDuration(best.durationMs)}`,
    });
  }
  return lines;
}
