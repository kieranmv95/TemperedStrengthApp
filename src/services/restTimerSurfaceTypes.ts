export type RestTimerSurfaceStatus = 'running' | 'complete';

export type RestTimerSurfacePayload = {
  endTimeMs: number;
  startedAtMs: number;
  label: string;
  untilLabel: string;
  status: RestTimerSurfaceStatus;
};

export const REST_TIMER_DEEP_LINK = 'temperedstrengthapp://program';

export const REST_TIMER_ANDROID_NOTIFICATION_ID = 'rest-timer';
