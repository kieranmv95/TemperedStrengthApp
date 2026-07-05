import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const oly: StandaloneWorkoutSource[] = [
  {
    id: 'p_15',
    title: 'Snatch Balance Builder',
    description:
      'The snatch balance is the most underused drill in weightlifting. It trains the one thing most athletes fear: committing to the catch. This session builds from the ground up, earning the right to load the bar through positional drills before a single plate goes on.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Snatch', 'Technique', 'Overhead', 'Skill'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
      },
      {
        name: 'Block 1: Position Drills',
        instructions:
          'PVC or empty bar only. No exceptions. These drills isolate the three positions that make or break a snatch balance. Spend 3 sets on each before moving on. Move slowly and deliberately.',
        movements: [
          'Drill 1: 3 x 5 Overhead Squat Hold (3 second hold at bottom, PVC)',
          'Drill 2: 3 x 5 Drop Snatch (no dip, just punch under, PVC)',
          'Drill 3: 3 x 5 Pressing Snatch Balance (slow controlled descent, PVC)',
          'Drill 4: 3 x 5 Heaving Snatch Balance (add the dip and drive, empty bar)',
        ],
      },
      {
        name: 'Block 2: Snatch Balance Build',
        instructions:
          'Five sets building in weight. Every rep must include a 2 second hold at the bottom of the catch before standing. If the hold feels unstable, do not add weight. The punch under the bar is the skill, the weight is secondary.',
        movements: [
          'Set 1: 3 Snatch Balance at empty bar, 2 second hold each',
          'Set 2: 3 Snatch Balance at 50% estimated max, 2 second hold each',
          'Set 3: 3 Snatch Balance at 60% estimated max, 2 second hold each',
          'Set 4: 2 Snatch Balance at 70% estimated max, 2 second hold each',
          'Set 5: 2 Snatch Balance at 75-80% estimated max, 2 second hold each (record weight)',
        ],
      },
      {
        name: 'Block 3: 5x3 Working Sets',
        instructions:
          'Stay at 75-80% from Block 2. Five sets of three, alternating between snatch balance and overhead squat each set. The overhead squat reinforces the catch position under fatigue. Rest 2 minutes between sets.',
        movements: [
          'Set 1: 3 Snatch Balance, rest 90s, 3 Overhead Squat, rest 2 mins',
          'Set 2: 3 Snatch Balance, rest 90s, 3 Overhead Squat, rest 2 mins',
          'Set 3: 3 Snatch Balance, rest 90s, 3 Overhead Squat, rest 2 mins',
          'Set 4: 3 Snatch Balance, rest 90s, 3 Overhead Squat, rest 2 mins',
          'Set 5: 3 Snatch Balance, rest 90s, 3 Overhead Squat (record any stability issues)',
        ],
      },
      {
        name: 'Block 4: Stability Accessory',
        instructions:
          'Two rounds targeting the shoulders, lats and core that support the catch position. Rest 60s between rounds.',
        movements: [
          'Round 1: 10 Single Arm Dumbbell Press each side, 10 Tall Kneeling Overhead Hold 30s, 12 Face Pulls, 10 Hollow Body Rocks',
          'Round 2: 10 Single Arm Dumbbell Press each side, 10 Tall Kneeling Overhead Hold 30s, 12 Face Pulls, 10 Hollow Body Rocks',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['dumbbell', 'barbell', 'bands'],
  },
];
