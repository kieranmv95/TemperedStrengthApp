export type RestTimerSurfaceStatus = 'running' | 'complete';

export type RestTimerSurfacePayload = {
  endTimeMs: number;
  startedAtMs: number;
  /** Secondary line (exercise name, phase, etc.). */
  label: string;
  untilLabel: string;
  status: RestTimerSurfaceStatus;
  /** Header chip text. Defaults to "Rest" in widgets. */
  title?: string;
  /** Deep link when the surface is tapped. */
  url?: string;
};

export const REST_TIMER_DEEP_LINK = 'temperedstrengthapp://program';
export const GYM_TIMER_DEEP_LINK = 'temperedstrengthapp://tools/timers';

export const REST_TIMER_ANDROID_NOTIFICATION_ID = 'rest-timer';
export const GYM_TIMER_ANDROID_NOTIFICATION_ID = 'gym-timer';
