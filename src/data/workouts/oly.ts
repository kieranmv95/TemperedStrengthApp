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
    tags: ['Olympic Lifting', 'Upper Body', 'Strength'],
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
  {
    id: 'p_79',
    title: 'Olympic Complex: Clean & Jerk Stability',
    description:
      'Building technical speed and overhead stability through the clean and jerk.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Olympic Lifting', 'Full Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: ['Burgener Warmup (Clean & Jerk pattern with PVC pipe)'],
      },
      {
        name: 'Building up to working weight',
        instructions:
          'This first EMOM builds you up to your working weight. Alter your barbell weight between sets and rest for a minimum of 60 seconds.',
        highlightInstructions:
          'This is not a WOD, this is stability and control practice. Reset every rep from the floor.',
        movements: [
          '(30% 1RM) 5 Power Clean + 1 Hang Clean + 1 Split Jerk',
          '(40% 1RM) 3 Power Clean + 1 Hang Clean + 1 Split Jerk',
          '(50% 1RM) 2 Power Clean + 1 Hang Clean + 1 Split Jerk',
          '(60% 1RM) 1 Power Clean + 1 Hang Clean + 1 Split Jerk',
        ],
      },
      {
        name: 'EMOM 15',
        instructions:
          'Stay at or between 60-70% of 1RM Clean & Jerk. Focus on a stable front rack, a vertical dip and drive, and a locked-out receiving position.',
        highlightInstructions:
          'This is not a WOD, this is stability and control practice. Split evenly and stand the jerk together.',
        movements: ['1 Power Clean + 1 Hang Clean + 1 Split Jerk'],
      },
      {
        name: 'Strength Finisher',
        instructions:
          'Two heavy strength moves to reinforce the clean and the jerk. Build across the sets and rest 2 minutes between them. Keep every rep crisp.',
        movements: [
          '4 x 3 Front Squat (build to a heavy triple, taken from the rack)',
          '4 x 3 Push Press (build to a heavy triple, strict dip and drive)',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_80',
    title: 'Snatch Session',
    description:
      'A complete snatch day: positional drills to sharpen technique, a heavy build to test it, and complementary strength to hold it all together. Own the positions before you chase the numbers.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Olympic Lifting', 'Full Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: ['Burgener Warmup (Snatches with PVC pipe)'],
      },
      {
        name: 'Block 1: Position Drills',
        instructions:
          'PVC or empty bar only. Three sets of each drill to rehearse the positions before you load. Move slowly and reset every rep.',
        movements: [
          'Drill 1: 3 x 3 Snatch High Pull (empty bar, tall finish on the toes)',
          'Drill 2: 3 x 3 Muscle Snatch (empty bar, no re-bend of the legs)',
          'Drill 3: 3 x 3 Overhead Squat (3 second hold at the bottom)',
          'Drill 4: 3 x 2 Snatch from the Hang (slow to the knee, fast under)',
        ],
      },
      {
        name: 'Block 2: Heavy Snatch Build',
        instructions:
          'Work up to a heavy single for the day in full snatches. This is not a max-out. Stop climbing the moment technique breaks down and hold that weight.',
        movements: [
          'Set 1: 2 Snatch at 60% 1RM',
          'Set 2: 2 Snatch at 70% 1RM',
          'Set 3: 1 Snatch at 80% 1RM',
          'Set 4: 1 Snatch at 85% 1RM',
          'Set 5: 1 Snatch at 88-92% 1RM (heavy single for the day, record weight)',
        ],
      },
      {
        name: 'Block 3: Complementary Strength',
        instructions:
          'Two heavy accessory lifts that build the pull and the catch. Build across the sets and rest 2 minutes between them.',
        movements: [
          '4 x 3 Snatch Grip Deadlift (100-110% of snatch 1RM, controlled off the floor)',
          '4 x 4 Overhead Squat (build to a heavy set of four, from the rack)',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_81',
    title: 'Clean & Jerk Session',
    description:
      'A complete clean and jerk day: positional drills to sharpen the pull and the overhead, a heavy build to test them, and complementary strength to back it up. Sharp technique first, big weights second.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Olympic Lifting', 'Full Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: ['Burgener Warmup (Clean & Jerk pattern with PVC pipe)'],
      },
      {
        name: 'Block 1: Position Drills',
        instructions:
          'PVC or empty bar only. Three sets of each drill to rehearse the positions before you load. Move slowly and reset every rep.',
        movements: [
          'Drill 1: 3 x 3 Clean High Pull (empty bar, tall finish on the toes)',
          'Drill 2: 3 x 3 Muscle Clean (empty bar, fast elbows through the rack)',
          'Drill 3: 3 x 3 Front Squat (3 second hold at the bottom)',
          'Drill 4: 3 x 3 Tall Jerk (empty bar, punch under to a locked receiving position)',
        ],
      },
      {
        name: 'Block 2: Heavy Clean & Jerk Build',
        instructions:
          'Work up to a heavy single for the day in full clean and jerks. This is not a max-out. Stop climbing the moment technique breaks down and hold that weight.',
        movements: [
          'Set 1: 2 Clean & Jerk at 60% 1RM',
          'Set 2: 2 Clean & Jerk at 70% 1RM',
          'Set 3: 1 Clean & Jerk at 80% 1RM',
          'Set 4: 1 Clean & Jerk at 85% 1RM',
          'Set 5: 1 Clean & Jerk at 88-92% 1RM (heavy single for the day, record weight)',
        ],
      },
      {
        name: 'Block 3: Complementary Strength',
        instructions:
          'Two heavy accessory lifts that build the pull and the overhead. Build across the sets and rest 2 minutes between them.',
        movements: [
          '4 x 3 Clean Pull (100-110% of clean 1RM, controlled off the floor)',
          '4 x 4 Push Press (build to a heavy set of four, strict dip and drive)',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Doorframe Chest Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['barbell'],
  },
];
