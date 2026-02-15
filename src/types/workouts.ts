export type WorkoutCategory =
  | 'Strength'
  | 'WOD'
  | 'Hyrox'
  | 'Conditioning'
  | 'Mobility';

export type SingleWorkout = {
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
};

export type DetailedMovement = {
  name: string;
  value: string;
  note?: string;
};
