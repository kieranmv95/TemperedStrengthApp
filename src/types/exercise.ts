export type Exercise = {
  id: number;
  name: string;
  description: string;
  pattern: string;
  muscle: string;
  equipment: string;
  logging_type: 'reps' | 'reps_and_weight' | 'time';
  youtube_id?: string;
  /** When true, a lighter logged weight is the better personal best (e.g. assistance). */
  lowerWeightIsBetter?: boolean;
};
