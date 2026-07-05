import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const strength: StandaloneWorkoutSource[] = [
  {
    id: 'f_05',
    title: 'Leg Primer',
    description:
      'High volume bodyweight leg pump. Keep rest minimal to maximise metabolic stress.',
    category: 'Strength',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['Legs', 'Volume'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ["10 World's Greatest Stretches, 20 Glute Bridges"],
      },
      {
        name: '4 Rounds',
        instructions: 'Rest 90s between rounds. Focus on full range of motion.',
        movements: [
          '20 BackwardLunges',
          '20 Glute Bridges',
          '20 Squat Jumps',
          '1 min Wall Sit',
        ],
      },
    ],
    equipment: [],
  },
];
