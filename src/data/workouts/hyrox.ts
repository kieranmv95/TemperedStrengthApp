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
    tags: ['Chipper', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'Workout',
            instructions:
              'A chipper, work through the movements as quickly as possible in order with minimal break',
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
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'Workout',
            instructions:
              'Partner format: alternate as you please, one rests the other works.',
            highlightInstructions: 'One rests, the other works.',
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
