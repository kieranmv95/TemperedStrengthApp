import type { StandaloneWorkoutLogEntry } from '@/src/types/standaloneWorkoutLogs';
import type { WorkoutLogSchema } from '@/src/types/workouts';
import {
  formatDurationSeconds,
  formatStandaloneLogSummary,
  parseDurationInputToSeconds,
} from '@/src/utils/standaloneWorkoutLogFormat';

export type FormState = {
  /** When the workout actually happened (UTC ms). */
  loggedAtMs: number;
  durationInput: string;
  roundsInput: string;
  extraRepsInput: string;
  repsInput: string;
  distanceInput: string;
  notesOnlyInput: string;
  notesInput: string;
};

export function emptyForm(): FormState {
  return {
    loggedAtMs: Date.now(),
    durationInput: '',
    roundsInput: '',
    extraRepsInput: '',
    repsInput: '',
    distanceInput: '',
    notesOnlyInput: '',
    notesInput: '',
  };
}

export function resetFormForSchema(): FormState {
  return emptyForm();
}

export function loadEntryIntoForm(
  entry: StandaloneWorkoutLogEntry,
  base: FormState = emptyForm()
): FormState {
  const next = { ...base };
  const t = new Date(entry.loggedAt).getTime();
  next.loggedAtMs = Number.isNaN(t) ? Date.now() : t;
  switch (entry.payload.kind) {
    case 'duration':
      next.durationInput = formatDurationSeconds(entry.payload.durationSeconds);
      break;
    case 'amrap':
      next.roundsInput = String(entry.payload.rounds);
      next.extraRepsInput = String(entry.payload.extraReps);
      break;
    case 'max_reps':
      next.repsInput = String(entry.payload.reps);
      break;
    case 'distance':
      next.distanceInput = String(entry.payload.value);
      break;
    case 'notes_only': {
      const main = entry.payload.text.trim();
      const extra = entry.notes?.trim() ?? '';
      next.notesOnlyInput = [main, extra].filter(Boolean).join('\n\n');
      break;
    }
    default:
      break;
  }
  if (entry.payload.kind === 'notes_only') {
    next.notesInput = '';
  } else {
    next.notesInput = entry.notes ?? '';
  }
  return next;
}

export type BuildPayloadResult =
  | { ok: true; payload: StandaloneWorkoutLogEntry['payload'] }
  | { ok: false; error: string };

export function buildPayloadFromForm(
  schema: WorkoutLogSchema,
  form: FormState
): BuildPayloadResult {
  switch (schema.kind) {
    case 'none':
      return { ok: false, error: 'This workout does not support logging.' };
    case 'duration': {
      const durationSeconds = parseDurationInputToSeconds(form.durationInput);
      if (durationSeconds === null || durationSeconds <= 0) {
        return {
          ok: false,
          error: 'Enter a valid time (e.g. 45:30 or 1:05:30).',
        };
      }
      return { ok: true, payload: { kind: 'duration', durationSeconds } };
    }
    case 'amrap': {
      const rounds = parseInt(form.roundsInput.trim(), 10);
      const extraReps = parseInt(form.extraRepsInput.trim(), 10);
      if (
        Number.isNaN(rounds) ||
        Number.isNaN(extraReps) ||
        rounds < 0 ||
        extraReps < 0
      ) {
        return {
          ok: false,
          error: 'Enter valid rounds and extra reps (0 or more).',
        };
      }
      return { ok: true, payload: { kind: 'amrap', rounds, extraReps } };
    }
    case 'max_reps': {
      const reps = parseInt(form.repsInput.trim(), 10);
      if (Number.isNaN(reps) || reps < 0) {
        return { ok: false, error: 'Enter a valid rep count.' };
      }
      return { ok: true, payload: { kind: 'max_reps', reps } };
    }
    case 'distance': {
      const value = parseFloat(form.distanceInput.trim());
      if (Number.isNaN(value) || value < 0) {
        return { ok: false, error: 'Enter a valid distance.' };
      }
      return { ok: true, payload: { kind: 'distance', value } };
    }
    case 'notes_only': {
      const text = form.notesOnlyInput.trim();
      if (!text) {
        return { ok: false, error: 'Add a note or cancel.' };
      }
      return { ok: true, payload: { kind: 'notes_only', text } };
    }
    default:
      return { ok: false, error: 'Unsupported log type.' };
  }
}

/** Primary line in the log list (merges legacy notes for notes-only payloads). */
export function logListPrimarySummary(
  entry: StandaloneWorkoutLogEntry,
  schema: WorkoutLogSchema
): string {
  if (entry.payload.kind === 'notes_only') {
    const main = entry.payload.text.trim();
    const extra = entry.notes?.trim() ?? '';
    return [main, extra].filter(Boolean).join('\n\n');
  }
  return formatStandaloneLogSummary(entry.payload, schema);
}

export type DurationLogEntry = StandaloneWorkoutLogEntry & {
  payload: { kind: 'duration'; durationSeconds: number };
};

/**
 * Picks the best duration log for display. On ties, the first entry in
 * iteration order wins (first log in the array).
 */
export function computeBestDurationEntry(
  logs: StandaloneWorkoutLogEntry[],
  schema: WorkoutLogSchema
): DurationLogEntry | null {
  if (schema.kind !== 'duration') {
    return null;
  }
  const entries = logs.filter(
    (e): e is DurationLogEntry => e.payload.kind === 'duration'
  );
  if (entries.length === 0) {
    return null;
  }

  let best = entries[0];
  for (const e of entries) {
    const better = schema.lowerIsBetter
      ? e.payload.durationSeconds < best.payload.durationSeconds
      : e.payload.durationSeconds > best.payload.durationSeconds;
    if (better) {
      best = e;
    }
  }
  return best;
}
