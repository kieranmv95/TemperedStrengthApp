/** One logged time for a fixed conditioning distance. */
export type ConditioningEffort = {
  id: string;
  activityId: string;
  distanceM: number;
  durationMs: number;
  achievedAt: string;
};

/** Active efforts grouped by activity, then distance in metres. */
export type ConditioningEffortsStore = Record<
  string,
  Record<number, ConditioningEffort[]>
>;
