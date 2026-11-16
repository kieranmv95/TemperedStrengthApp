/** Schema-versioned gym clock config. Screens launch timers with this payload. */

export type GymTimerPhase = 'LEAD_IN' | 'WORK' | 'REST';

export type GymTimerType =
  | 'COUNTDOWN'
  | 'COUNTUP'
  | 'ROUNDS'
  | 'TABATA'
  | 'EMOM'
  | 'AMRAP'
  | 'FOR_TIME'
  | 'REST'
  | 'INTERVALS';

export type GymTimerSourceKind =
  | 'program_v2'
  | 'standalone'
  | 'tempered_daily'
  | 'manual'
  | 'preset'
  | 'quick_action'
  | 'strength_rest';

export type GymTimerSource = {
  kind: GymTimerSourceKind;
  workoutId?: string;
  blockId?: string;
};

export type GymTimerIntervalSegment = {
  phase: 'WORK' | 'REST';
  durationSec: number;
  label?: string;
};

type GymTimerConfigBase = {
  v: 1;
  name?: string;
  /** Default 10. Prefer 0 | 5 | 10. */
  leadInSec?: number;
  source?: GymTimerSource;
};

export type GymTimerConfig = GymTimerConfigBase &
  (
    | { type: 'COUNTDOWN'; config: { durationSec: number } }
    | { type: 'COUNTUP'; config: { capSec?: number } }
    | {
        type: 'ROUNDS';
        config: {
          rounds: number;
          /** 0 = open work until the user taps Next. */
          workSec: number;
          restSec: number;
        };
      }
    | {
        type: 'TABATA';
        config: {
          rounds: number;
          workSec: number;
          restSec: number;
          sets?: number;
          restBetweenSetsSec?: number;
        };
      }
    | { type: 'EMOM'; config: { rounds: number; intervalSec: number } }
    | { type: 'AMRAP'; config: { durationSec: number } }
    | { type: 'FOR_TIME'; config: { capSec?: number } }
    | { type: 'REST'; config: { durationSec: number } }
    | {
        type: 'INTERVALS';
        config: {
          segments: GymTimerIntervalSegment[];
          repeats?: number;
        };
      }
  );

export type GymTimerSegment = {
  phase: GymTimerPhase;
  durationSec: number;
  /** 1-based round within the work/rest cycle; omitted for lead-in. */
  round?: number;
  /** Total rounds for display (R x/y). */
  totalRounds?: number;
  label?: string;
  /** Open-ended work: advance only when the user taps Next. */
  openEnded?: boolean;
};

export type GymTimerViewState = 'closed' | 'open' | 'minimised';

export type GymTimerLifecycle =
  | 'ready'
  | 'lead_in'
  | 'running'
  | 'paused'
  | 'done';

/** Persisted / in-memory runtime for one active gym timer. */
export type GymTimerRuntime = {
  config: GymTimerConfig;
  segments: GymTimerSegment[];
  viewState: GymTimerViewState;
  lifecycle: GymTimerLifecycle;
  /** Index into `segments` while running / paused / lead-in. */
  segmentIndex: number;
  /**
   * Wall-clock ms when the current running segment (or overall clock for
   * count-up) last resumed. Null when ready / paused / done.
   */
  segmentStartedAt: number | null;
  /** Accumulated pause ms for the current segment. */
  pausedAccumMs: number;
  /** Ms already elapsed in the current segment before the latest resume. */
  segmentElapsedBeforePauseMs: number;
  /** Tap-to-count rounds for AMRAP / For Time. */
  completedRounds: number;
  muted: boolean;
  /** Set when Done so finish tone / notification fire once. */
  finishedAt: number | null;
};

export type GymTimerPreset = {
  id: string;
  createdAt: number;
  updatedAt: number;
  config: GymTimerConfig;
};

export type GymTimerSettings = {
  leadInSec: 0 | 5 | 10;
  defaultMuted: boolean;
};
