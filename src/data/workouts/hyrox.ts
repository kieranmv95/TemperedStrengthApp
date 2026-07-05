import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const hyrox: StandaloneWorkoutSource[] = [
  {
    id: 'p_36',
    title: 'Order 66',
    description:
      'A high-output Hyrox-style workout chipper, designed in homage to the iconic Star Wars films.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Chipper', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            movements: [
              '3 mins easy cardio of choice',
              '10 wall balls, 10 burpees',
            ],
          },
          {
            name: '8 Rounds',
            instructions:
              'Partner format: alternate as you please, one rests the other works.',
            movements: [
              '66 cal row',
              '66 wall balls',
              '66 cal ski erg',
              '66 burpees',
              '66m sled push',
              '66 box jumps',
            ],
          },
        ],
      },
    ],
    equipment: ['rower', 'ski erg', 'box', 'medicine ball', 'sled'],
  },
];
