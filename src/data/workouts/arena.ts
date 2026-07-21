import type { StandaloneWorkoutSource } from '@/src/types/workouts';

const collab = {
  image: require('@/assets/images/collabs/arena_games.jpg'),
  name: 'Arena Games',
  description:
    'This workout is brought to you by Arena Games, where we put everyday athletes on the big stage.',
  link: 'https://www.thearenagames.co.uk/',
  linkCopy: 'Click to Learn More',
  bgColor: '#000000',
  linkAndBorderColor: '#FF3801',
  nameColor: '#FF3801',
};

export const arena: StandaloneWorkoutSource[] = [
  {
    id: 'ar_01',
    title: 'Event 001 - Workout 1',
    description:
      'A 4-person workout (2M/2F). Eight minutes of max ski and bike, four minutes rest, then both mixed pairs race through 30 sync hang Grace.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Full Body', 'Intervals', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    collab,
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: '0:00 - 8:00 - Max Ski + Bike',
            instructions:
              'Team max calories on the ski erg and bike in 8 minutes. Split work as you choose.',
            movements: ['Max Calories Ski + Bike'],
          },
          {
            name: '8:00 - 12:00 - Rest',
            instructions: '4 minutes forced rest.',
            movements: ['4 min rest'],
          },
          {
            name: '12:00 - 20:00 - Sync Hang Grace',
            instructions:
              'Both mixed pairs work. Each MF pair completes 30 sync hang clean & jerks (Hang Grace).',
            highlightInstructions: 'Hang Grace = Hang Clean & Jerks.',
            movements: [
              'MF Pair 1: 30 Sync Hang Clean & Jerks',
              'MF Pair 2: 30 Sync Hang Clean & Jerks',
            ],
          },
        ],
      },
    ],
    equipment: ['ski erg', 'bike', 'barbell'],
  },
  {
    id: 'ar_02',
    title: 'Event 001 - Workout 2',
    description:
      'A 4-person workout (2M/2F). A synchro chipper with descending reps across snatches, toes to bar, lunges, chest to bar, devil presses and bar muscle-ups.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Full Body', 'Chipper', 'For Time', 'Arena', 'Partner'],
    isPremium: false,
    collab,
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'For Time',
            instructions:
              'Complete all reps in order. Numbers in brackets are athletes working together on that movement (4 = all four, 2 = a sync pair).',
            movements: [
              '60 Sync DB Snatches [4]',
              '60 Sync Toes to Bar [2]',
              {
                type: 'divider',
              },
              '40 Sync Overhead Lunges [4]',
              '40 Sync Chest to Bar Pull-Ups',
              {
                type: 'divider',
              },
              '20 Sync Devil Presses [4]',
              '20 Sync Bar Muscle-Ups [2]',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'pull-up bar'],
  },
  {
    id: 'ar_03',
    title: 'Event 001 - Workout 3',
    description:
      'A 4-person workout (2M/2F). A clean ladder — females buy in and build to a 1RM, then males do the same after a short rest. Heavy and precise.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 22,
    tags: ['Olympic Lifting', 'Ladder', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    collab,
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: '3a) 0:00 - 10:00 - Female Clean Ladder',
            instructions:
              'FF buy-in ladder into a 1RM clean. Complete the buy-in, then build to a max clean in the remaining time.',
            highlightInstructions: 'Females only.',
            movements: [
              '16 Cleans @ 50kg',
              '12 Cleans @ 60kg',
              '8 Cleans @ 70kg',
              '4 Cleans @ 75kg',
              {
                type: 'divider',
                note: 'into',
              },
              '1RM Clean',
            ],
          },
          {
            name: '10:00 - 12:00 - Rest',
            instructions: '2 minutes forced rest.',
            movements: ['2 min rest'],
          },
          {
            name: '3b) 12:00 - 22:00 - Male Clean Ladder',
            instructions:
              'MM buy-in ladder into a 1RM clean. Complete the buy-in, then build to a max clean in the remaining time.',
            highlightInstructions: 'Males only.',
            movements: [
              '16 Cleans @ 80kg',
              '12 Cleans @ 90kg',
              '8 Cleans @ 100kg',
              '4 Cleans @ 110kg',
              {
                type: 'divider',
                note: 'into',
              },
              '1RM Clean',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'ar_04',
    title: 'Event 001 - Workout 4',
    description:
      'A 4-person workout (2M/2F). Each round is one 3D shuttle run, then an unbroken set of deadlifts. Score is total deadlifts.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 6,
    tags: ['Lower Body', 'AMRAP', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    collab,
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'AMRAP 6',
            instructions:
              'Each round: 1 x 3D shuttle run (suicide run), then 1 unbroken set of deadlifts @ 80/55kg. Score = total deadlifts.',
            highlightInstructions: 'Deadlift sets must be unbroken.',
            movements: [
              '1 x 3D Shuttle Run (suicide run)',
              '1 Unbroken Set of Deadlifts @ 80/55kg',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'ar_05',
    title: 'Event 001 - Workout 5',
    description:
      'A 4-person workout (2M/2F). Five minutes of sync hang snatches and burpees, one minute rest, then a descending double-under and thruster chipper for time.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 16,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    collab,
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: '5a) 0:00 - 5:00 - AMRAP 5',
            instructions:
              'As many rounds as possible in 5 minutes. Sync hang power snatches are MF pairs @ 50/35kg. Burpee to reach is all 4 athletes.',
            movements: [
              '24 Sync Hang Power Snatches [MF] @ 50/35kg',
              '12 Sync Burpee to Reach [4]',
            ],
          },
          {
            name: '5:00 - 6:00 - Rest',
            instructions: '1 minute forced rest.',
            movements: ['1 min rest'],
          },
          {
            name: '5b) 6:00 - 16:00 - For Time (10:00 Cap)',
            instructions:
              'Athletes work in order P1 through P4. Complete all work for time within the 10-minute cap. Thrusters @ 50/35kg.',
            movements: [
              'P1: 50 Double Unders + 21 Thrusters @ 50/35kg',
              'P2: 75 Double Unders + 18 Thrusters @ 50/35kg',
              'P3: 100 Double Unders + 15 Thrusters @ 50/35kg',
              'P4: 125 Double Unders + 12 Thrusters @ 50/35kg',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell', 'skipping rope'],
  },
  {
    id: 'ar_06',
    title: 'Event 002 - ICEY',
    description:
      'A 4-person workout (2M/2F). Complete 60 sync down ups into max bike/rower cals, rest, then 120 reverse lunges into max bike/rower cals. Score = total cals (bike + rower). Same for all divisions.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 18,
    tags: ['Lower Body', 'Intervals', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    collab: {
      ...collab,
      link: 'https://www.instagram.com/reel/Da8K7oKo26B/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      linkCopy: 'Click to watch video description',
    },
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: '1a) 0:00 - 8:00 - 60 Sync Down Ups into Max Cals',
        instructions:
          'Complete 60 sync down ups. Every 15 reps, rotate 1 athlete off to start max calories on the bike/rower while the other athletes keep working. When the 60 sync reps are complete, all athletes accumulate max cals across the two ergs.',
        highlightInstructions:
          'Swap at 15 reps. Finish phase: everyone on bike + rower.',
        movements: [
          '60 Sync Down Ups',
          'Max Calories Bike/Row Erg (swap after each 15 reps)',
        ],
      },
      {
        name: '1b) 8:00 - 10:00 - Rest',
        instructions: '2 minutes forced rest.',
        movements: ['2 min rest'],
      },
      {
        name: '1c) 10:00 - 18:00 - 120 Reverse Lunges into Max Cals',
        instructions:
          'Complete 120 reverse lunges (sync as a team). Every 30 reps, rotate 1 athlete off to start max calories on the bike/rower while the other athletes keep working. Score = total combined calories across the bike and rower.',
        highlightInstructions:
          'Swap at 30 reps. Score is total cals (bike + rower).',
        movements: [
          '120 Reverse Lunges',
          'Max Calories Bike/Row Erg (swap after each 30 reps)',
        ],
      },
    ],
    equipment: ['bike', 'rower'],
  },
  {
    id: 'ar_07',
    title: 'Event 002 - FLEX FM',
    description:
      'The ultimate test of teamwork. A 4-person workout (2M/2F). For time with a 15-minute cap — buy in with sync double dumbbell snatches, 6 rounds of gymnastics and thrusters, then cash out with dumbbell snatches.',
    category: 'WOD',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 15,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Arena', 'Partner'],
    isPremium: false,
    partner: true,
    collab: {
      ...collab,
      link: 'https://www.instagram.com/reel/DbBZj8XKCEB/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      linkCopy: 'Click to watch video description',
    },
    blocks: [
      {
        scale: 'Locked In',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'For Time (15:00 Cap)',
            instructions:
              'Complete all work in order. Numbers in brackets are athletes working together on that movement (4 = all four, 2 = a sync pair).',
            highlightInstructions: 'Buy in → 6 rounds → cash out.',
            movements: [
              'Buy In: 50 Sync Double DB Snatches [2] (2×22/15kg)',
              {
                type: 'divider',
                note: '6 rounds',
              },
              '6 Bar Muscle-Ups [2]',
              '12 Sync Thrusters [2] (2×22/15kg)',
              '18 Sync Toes to Bar [2]',
              {
                type: 'divider',
                note: 'cash out',
              },
              '50 Sync DB Snatches [4]',
            ],
          },
        ],
      },
      {
        scale: 'On Job',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'For Time (15:00 Cap)',
            instructions:
              'Complete all work in order. Numbers in brackets are athletes working together on that movement (4 = all four, 2 = a sync pair).',
            highlightInstructions: 'Buy in → 6 rounds → cash out.',
            movements: [
              'Buy In: 50 Sync Double DB Snatches [2] (2×15/10kg)',
              {
                type: 'divider',
                note: '6 rounds',
              },
              '6 Pull-Ups [2]',
              '12 Sync Thrusters [2] (2×15/10kg)',
              '12 Sync Toes to Bar [2]',
              {
                type: 'divider',
                note: 'cash out',
              },
              '50 Sync DB Snatches [4] (1×15/10kg)',
            ],
          },
        ],
      },
      {
        scale: 'In the Mix',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
          },
          {
            name: 'For Time (15:00 Cap)',
            instructions:
              'Complete all work in order. Numbers in brackets are athletes working together on that movement (4 = all four, 2 = a sync pair).',
            highlightInstructions: 'Buy in → 6 rounds → cash out.',
            movements: [
              'Buy In: 50 Sync Double DB Snatches [2] (2×15/10kg)',
              {
                type: 'divider',
                note: '6 rounds',
              },
              '6 Pull-Ups',
              '12 Sync Thrusters [2] (1×15/10kg)',
              {
                name: '12 Toes to Bar',
                value: '1 person dead hang',
              },
              {
                type: 'divider',
                note: 'cash out',
              },
              '50 Sync DB Snatches [4] (1×15/10kg)',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'pull-up bar'],
  },
];
