export type WorkoutCategory =
  | 'Strength'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Mobility';

export interface SingleWorkout {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: number;
  tags: string[];
  isPremium: boolean;

  blocks: {
    name: string;
    instructions?: string;
    movements: string[] | DetailedMovement[];
  }[];
}

export interface DetailedMovement {
  name: string;
  value: string;
  note?: string;
}
