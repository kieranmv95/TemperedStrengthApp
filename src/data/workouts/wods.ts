import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const wods: StandaloneWorkoutSource[] = [
  {
    id: 'f_04',
    title: 'The Century',
    description:
      'A benchmark test of mental grit. The goal is to finish 100 burpees as fast as possible.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['Chipper', 'Full Body'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins joint Prep: Wrist circles, arm swings, 20 Jumping Jacks',
        ],
      },
      {
        name: 'Workout',
        instructions:
          'Go at 80% pace for the first 50, then accelerate. Target: Under 8 mins.',
        highlightInstructions: 'As fast as possible for time.',
        movements: ['100 Burpees for time'],
      },
    ],
    equipment: [],
  },
];
