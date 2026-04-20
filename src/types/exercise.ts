export type Exercise = {
  id: number;
  name: string;
  description: string;
  pattern: string;
  muscle: string;
  equipment: string;
  created_at: string;
  updated_at: string;
  logging_type: 'reps' | 'reps_and_weight' | 'time';
};
