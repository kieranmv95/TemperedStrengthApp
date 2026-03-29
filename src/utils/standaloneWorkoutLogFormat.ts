import type { StandaloneLogPayload } from '@/src/types/standaloneWorkoutLogs';
import type { WorkoutLogSchema } from '@/src/types/workouts';

/** One-line stamp for log cards: `DD/MM/YYYY - HH:MM` (local time, 24h). */
export function formatStandaloneLogCardTimestamp(iso: string): string | null {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} - ${hh}:${min}`;
  } catch {
    return null;
  }
}

/**
 * Formats when a log was saved (ISO string) for display: calendar date + clock time,
 * using the device locale.
 */
export function formatStandaloneLogLoggedAt(iso: string): {
  dateLabel: string;
  timeLabel: string;
} | null {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) {
      return null;
    }
    const dateLabel = d.toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
    const timeLabel = d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    });
    return { dateLabel, timeLabel };
  } catch {
    return null;
  }
}

export function formatDurationSeconds(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  }
  return `${m}:${String(sec).padStart(2, '0')}`;
}

/** Accepts `m:ss`, `mm:ss`, or `h:mm:ss` (numeric segments). */
export function parseDurationInputToSeconds(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) {
    return null;
  }
  const parts = trimmed.split(':').map((p) => p.trim());
  if (parts.some((p) => p === '')) {
    return null;
  }
  const nums = parts.map((p) => {
    const n = Number(p);
    return Number.isFinite(n) ? n : NaN;
  });
  if (nums.some((n) => n < 0 || Number.isNaN(n))) {
    return null;
  }
  if (parts.length === 1) {
    return Math.floor(nums[0]);
  }
  if (parts.length === 2) {
    return Math.floor(nums[0] * 60 + nums[1]);
  }
  if (parts.length === 3) {
    return Math.floor(nums[0] * 3600 + nums[1] * 60 + nums[2]);
  }
  return null;
}

export function formatStandaloneLogSummary(
  payload: StandaloneLogPayload,
  schema: WorkoutLogSchema
): string {
  switch (payload.kind) {
    case 'duration':
      return formatDurationSeconds(payload.durationSeconds);
    case 'amrap':
      return `${payload.rounds} rounds + ${payload.extraReps} reps`;
    case 'max_reps':
      return `${payload.reps} reps`;
    case 'distance': {
      const unit = schema.kind === 'distance' ? schema.unit : 'm';
      return `${payload.value} ${unit}`;
    }
    case 'notes_only':
      return payload.text.trim();
    default:
      return '';
  }
}
