import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const rainhill: StandaloneWorkoutSource[] = [
  {
    id: 'rh_06',
    title: 'Four Movement Fury',
    description:
      'A four-movement AMRAP. Simple on paper, brutal in practice. The double unders will punish any loss of composure.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 10,
    tags: ['Full Body', 'AMRAP', 'Gymnastics'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '10 Min AMRAP',
            instructions:
              'As many rounds as possible in 10 minutes. Box height: 24"/20". Wall Balls: 9kg/7kg. Score = rounds + reps.',
            movements: [
              '20 Burpee Box Jump Overs (24"/20")',
              '30 Chest to Bar Pull Ups',
              '40 Wall Balls (9kg/7kg)',
              '50 Double Unders',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '10 Min AMRAP',
            instructions:
              'As many rounds as possible in 10 minutes. Box height: 24"/20". Wall Balls: 9kg/7kg. Double Unders recommended - Single Unders permitted at 2:1. Score = rounds + reps.',
            movements: [
              '20 Burpee Box Jump Overs (24"/20")',
              '20 Pull Ups',
              '40 Wall Balls (9kg/7kg)',
              '40 Double Unders (or 80 Single Unders)',
            ],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: '10 Min AMRAP',
            instructions:
              'As many rounds as possible in 10 minutes. Box height: 24"/20". Wall Balls: 9kg/7kg. Double or Single Unders permitted. Score = rounds + reps.',
            movements: [
              '15 Burpee Box Step Ups (24"/20")',
              '15 American Kettlebell Swings (20kg/12kg)',
              '30 Wall Balls (9kg/7kg)',
              '30 Double Unders (or 60 Single Unders)',
            ],
          },
        ],
      },
    ],
    equipment: [
      'kettlebell',
      'medicine ball',
      'pull-up bar',
      'box',
      'skipping rope',
    ],
  },
  {
    id: 'rh_11',
    title: 'Revolution',
    description:
      "Two rowing tests bookending a five-minute AMRAP. Your legs will be cooked going into the second row. That's the point.",
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 11,
    tags: ['Full Body', 'AMRAP', 'Gymnastics'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '00:00 - 02:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: '02:00 - 03:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '03:00 - 08:00 - AMRAP',
            instructions:
              'As many rounds as possible in 5 minutes. Score = rounds + reps.',
            movements: ['10m Handstand Walk', '15 Toes to Bar'],
          },
          {
            name: '08:00 - 09:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '09:00 - 11:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 3.',
            movements: ['Max Metres Row (2 mins)'],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '00:00 - 02:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: '02:00 - 03:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '03:00 - 08:00 - AMRAP',
            instructions:
              'As many rounds as possible in 5 minutes. Score = rounds + reps.',
            movements: [
              '20m OH Plate Walking Lunges (20kg/15kg)',
              '12 Toes to Bar',
            ],
          },
          {
            name: '08:00 - 09:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '09:00 - 11:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 3.',
            movements: ['Max Metres Row (2 mins)'],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: '00:00 - 02:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: '02:00 - 03:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '03:00 - 08:00 - AMRAP',
            instructions:
              'As many rounds as possible in 5 minutes. Score = rounds + reps.',
            movements: [
              '20m OH Plate Walking Lunges (15kg/10kg)',
              '10 Hanging Leg Raises',
            ],
          },
          {
            name: '08:00 - 09:00 - Transition',
            instructions: '1 minute forced rest.',
            movements: ['1 min transition'],
          },
          {
            name: '09:00 - 11:00 - Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 3.',
            movements: ['Max Metres Row (2 mins)'],
          },
        ],
      },
    ],
    equipment: ['rower', 'pull-up bar'],
  },
  {
    id: 'rh_10',
    title: 'Atom',
    description:
      'Four rounds of a barbell complex, then max distance on the rower with whatever time remains. The barbell will cost you - how much is up to you.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 10,
    tags: ['Full Body', 'Chipper', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: 'For Time (10 min cap)',
            instructions:
              '4 rounds for time. Bar weight: 70kg/50kg. Note your finish time, then immediately move to the rower for max distance in remaining time.',
            movements: [
              '21 Deadlifts (70kg/50kg)',
              '15 Hang Cleans (70kg/50kg)',
              '9 Shoulder to Overhead (70kg/50kg)',
            ],
          },
          {
            name: 'Max Distance Row',
            instructions:
              'Row for max metres in the remaining time. Score 1 = chipper finish time. Score 2 = metres rowed.',
            movements: ['Max Distance Row (metres)'],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: 'For Time (10 min cap)',
            instructions:
              '4 rounds for time. Bar weight: 60kg/42.5kg. Note your finish time, then immediately move to the rower for max distance in remaining time.',
            movements: [
              '21 Deadlifts (60kg/42.5kg)',
              '15 Hang Cleans (60kg/42.5kg)',
              '9 Shoulder to Overhead (60kg/42.5kg)',
            ],
          },
          {
            name: 'Max Distance Row',
            instructions:
              'Row for max metres in the remaining time. Score 1 = chipper finish time. Score 2 = metres rowed.',
            movements: ['Max Distance Row (metres)'],
          },
        ],
      },
      {
        scale: 'RASTRICK',
        blocks: [
          {
            name: 'For Time (10 min cap)',
            instructions:
              '4 rounds for time. Bar weight: 50kg/35kg. Note your finish time, then immediately move to the rower for max distance in remaining time.',
            movements: [
              '21 Deadlifts (50kg/35kg)',
              '15 Hang Cleans (50kg/35kg)',
              '9 Shoulder to Overhead (50kg/35kg)',
            ],
          },
          {
            name: 'Max Distance Row',
            instructions:
              'Row for max metres in the remaining time. Score 1 = chipper finish time. Score 2 = metres rowed.',
            movements: ['Max Distance Row (metres)'],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: 'For Time (10 min cap)',
            instructions:
              '4 rounds for time. Bar weight: 40kg/27.5kg. Note your finish time, then immediately move to the rower for max distance in remaining time.',
            movements: [
              '21 Deadlifts (40kg/27.5kg)',
              '15 Hang Cleans (40kg/27.5kg)',
              '9 Shoulder to Overhead (40kg/27.5kg)',
            ],
          },
          {
            name: 'Max Distance Row',
            instructions:
              'Row for max metres in the remaining time. Score 1 = chipper finish time. Score 2 = metres rowed.',
            movements: ['Max Distance Row (metres)'],
          },
        ],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'rh_08',
    title: 'Dead Thruster',
    description:
      'A seven-minute barbell and kettlebell AMRAP. Heavy deadlifts into overhead work - the later movements will expose any fatigue you built in the first two.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 7,
    tags: ['Full Body', 'AMRAP', 'Gymnastics'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '7 Min AMRAP',
            instructions:
              'As many rounds as possible in 7 minutes. Score = rounds + reps.',
            movements: [
              '10 Deadlifts (110kg/85kg)',
              '20 Dual KB Thrusters (2x24kg/16kg)',
              '30/24 Chest to Bar Pull Ups',
              '40 Kettlebell Box Step Ups (2x24kg/16kg)',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '7 Min AMRAP',
            instructions:
              'As many rounds as possible in 7 minutes. Score = rounds + reps.',
            movements: [
              '10 Deadlifts (100kg/75kg)',
              '20 Dual KB Thrusters (2x20kg/12kg)',
              '25 Chest to Bar Pull Ups / Pull Ups',
              '40 Kettlebell Box Step Ups (2x20kg/12kg)',
            ],
          },
        ],
      },
    ],
    equipment: ['kettlebell', 'barbell', 'pull-up bar', 'box'],
  },
  {
    id: 'rainhill_wod_04',
    title: 'The 600m Sting',
    description: "It reads like a chipper... but it's not.",
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 9,
    tags: ['Cardio', 'For Time', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '00:00 - 09:00',
            instructions:
              'Run 600m. Into: 10 Chest to Bar Pullups, 10 Burpee Box Jump Over, 10 Toes to Bar, 10 Box Jumps. Add 2 reps to each movement until 09:00.\n\nSCORE 1.1 = 600m Run Time\nSCORE 1.2 = Reps',
            movements: [
              'Run 600m (for time) - score this as 1.1',
              'Then: 10 Chest to Bar Pullups',
              '10 Burpee Box Jump Over',
              '10 Toes to Bar',
              '10 Box Jumps',
              'Add 2 reps to each movement until 09:00 - score total reps as 1.2',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '00:00 - 09:00',
            instructions:
              'Run 600m. Into: 8 Pullups, 8 Burpee Box Jump Over, 8 Toes to Bar, 8 Box Jumps. Add 2 reps to each movement until 09:00.\n\nSCORE 1.1 = 600m Run Time\nSCORE 1.2 = Reps',
            movements: [
              'Run 600m (for time) - score this as 1.1',
              'Then: 8 Pullups',
              '8 Burpee Box Jump Over',
              '8 Toes to Bar',
              '8 Box Jumps',
              'Add 2 reps to each movement until 09:00 - score total reps as 1.2',
            ],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: '00:00 - 09:00',
            instructions:
              'Run 600m. Into: 8 American Kettlebell Swings (20kg/12kg), 8 Burpee Box Step Up, 8 Hanging Leg Raises, 8 Box Jumps / Step Up. Add 2 reps to each movement until 09:00.\n\nSCORE 1.1 = 600m Run Time\nSCORE 1.2 = Reps',
            movements: [
              'Run 600m (for time) - score this as 1.1',
              'Then: 8 American Kettlebell Swings (20kg/12kg)',
              '8 Burpee Box Step Up',
              '8 Hanging Leg Raises',
              '8 Box Jumps / Step Up',
              'Add 2 reps to each movement until 09:00 - score total reps as 1.2',
            ],
          },
        ],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar', 'box'],
  },
  {
    id: 'rh_02',
    title: 'Double Trouble',
    description:
      'A descending chipper built around overhead endurance and rope skills. Opens and closes with double unders. The middle third is where it breaks people.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 11,
    tags: ['Gymnastics', 'For Time', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: 'For Time (11 min cap)',
            instructions:
              'Complete all movements in order. Score = finish time. If you hit the timecap, score = 11:00.',
            movements: [
              '75 Double Unders',
              '30 Handstand Pushups',
              '30 Cal Row',
              '30 Double Dumbbell Thrusters (22.5kg/15kg)',
              '20 Handstand Pushups',
              '20 Cal Row',
              '20 Double Dumbbell Thrusters (22.5kg/15kg)',
              '10 Handstand Pushups',
              '10 Cal Row',
              '10 Double Dumbbell Thrusters (22.5kg/15kg)',
              '75 Double Unders',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: 'For Time (11 min cap)',
            instructions:
              'Complete all movements in order. Score = finish time. If you hit the timecap, score = 11:00.',
            movements: [
              '50 Double Unders',
              '10 Wall Walks',
              '30 Cal Row',
              '20 Double Dumbbell Thrusters (22.5kg/15kg)',
              '10 Wall Walks',
              '20 Cal Row',
              '15 Double Dumbbell Thrusters (22.5kg/15kg)',
              '10 Handstand Pushups',
              '10 Cal Row',
              '10 Double Dumbbell Thrusters (22.5kg/15kg)',
              '50 Double Unders',
            ],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: 'For Time (11 min cap)',
            instructions:
              'Complete all movements in order. Score = finish time. If you hit the timecap, score = 11:00.',
            movements: [
              '30 Double Unders / 60 Single Unders',
              '5 Wall Walks',
              '30 Cal Row',
              '20 Double Dumbbell Thrusters (15kg/10kg)',
              '5 Wall Walks',
              '20 Cal Row',
              '15 Double Dumbbell Thrusters (15kg/10kg)',
              '5 Wall Walks',
              '10 Cal Row',
              '10 Dumbbell Thrusters (15kg/10kg)',
              '30 Double Unders / 60 Single Unders',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'rower', 'skipping rope'],
  },
  {
    id: 'rh_09',
    title: 'Snatch and Walk',
    description:
      "A descending chipper built around snatches and handstand walks. The double unders drop each round - the handstand walk distance does too, but it won't feel like it.",
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 10,
    tags: ['Gymnastics', 'For Time', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: 'For Time (7 min cap)',
            instructions:
              "Complete all reps in order for time. Snatch load: 60kg/40kg. Score = finish time, or 'cap' if you do not finish.",
            movements: [
              '90 Double Unders',
              '12 Snatches (60kg/40kg)',
              '30m Handstand Walk',
              {
                type: 'divider',
                note: 'second round',
              },
              '60 Double Unders',
              '9 Snatches (60kg/40kg)',
              '20m Handstand Walk',
              {
                type: 'divider',
                note: 'third round',
              },
              '30 Double Unders',
              '6 Snatches (60kg/40kg)',
              '10m Handstand Walk',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: 'For Time (7 min cap)',
            instructions:
              "Complete all reps in order for time. Snatch load: 55kg/35kg. Score = finish time, or 'cap' if you do not finish.",
            movements: [
              '90 Double Unders',
              '12 Snatches (55kg/35kg)',
              '30m Handstand Walk',
              {
                type: 'divider',
                note: 'second round',
              },
              '60 Double Unders',
              '9 Snatches (55kg/35kg)',
              '20m Handstand Walk',
              {
                type: 'divider',
                note: 'third round',
              },
              '30 Double Unders',
              '6 Snatches (55kg/35kg)',
              '10m Handstand Walk',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell', 'skipping rope'],
  },
  {
    id: 'rh_03',
    title: 'Seeding: The Gauntlet',
    description:
      'Three sequential chippers, each with its own timecap. Descending reps, ascending difficulty. Note your finish time for each block separately.',
    category: 'Rainhill',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Full Body', 'For Time', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        name: 'Block 1 - 6 Min Cap',
        instructions:
          'Complete all reps in order for time. Score your finish time for this block.',
        movements: [
          '21 Wall Balls (9kg/7kg)',
          '21 Kettlebell Swings (20kg/12kg)',
          '18 Wall Balls (9kg/7kg)',
          '18 Kettlebell Swings (20kg/12kg)',
          '15 Wall Balls (9kg/7kg)',
          '15 Kettlebell Swings (20kg/12kg)',
        ],
      },
      {
        name: 'Block 2 - 5 Min Cap',
        instructions:
          'Complete all reps in order for time. Score your finish time for this block. Note your time at the 9 Box Jumps if you do not finish.',
        movements: [
          '15 Box Jumps (24"/20")',
          '15 Pull Ups',
          '12 Box Jumps (24"/20")',
          '12 Pull Ups',
          '9 Box Jumps (24"/20") - note time here if needed',
          '9 Chest to Bar Pull Ups',
        ],
      },
      {
        name: 'Block 3 - 4 Min Cap',
        instructions:
          'Complete all reps in order for time. Score your finish time for this block. Note your time at the 9 Burpee Box Jump Overs if you do not finish.',
        movements: [
          '12 Burpee Box Jump Overs (30"/24")',
          '12 Chest to Bar Pull Ups',
          '9 Burpee Box Jump Overs (30"/24") - note time here if needed',
          '9 Bar Muscle Ups',
          '6 Burpee Box Jump Overs (30"/24")',
          '6 Bar Muscle Ups',
        ],
      },
    ],
    equipment: ['kettlebell', 'medicine ball', 'pull-up bar', 'box'],
  },
  {
    id: 'rh_04',
    title: 'The Ladder Carry',
    description:
      'An ascending AMRAP. Distance and reps climb every round. Kettlebell cycling and grip are the limiters - pace the carries early.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 8,
    tags: ['Full Body', 'AMRAP', 'Gymnastics'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '8 Min AMRAP',
            instructions:
              'Complete each round in order. Every round, add 2 reps to the shuttle distance and 2 reps to the Toes to Bar. Kettlebells: 24kg/16kg. Toes to Bar start at 12 reps. Score = rounds + reps.',
            movements: [
              '2x8m Shuttle Runs',
              '2x8m Double Kettlebell Farmers Carry (24kg/16kg)',
              '2x8m Double KB Front Rack Alternating Forward Lunges (24kg/16kg)',
              '12 Toes to Bar',
              {
                type: 'divider',
                note: 'add 2 reps to distance and Toes to Bar each round',
              },
              '4x8m Shuttle Runs',
              '4x8m Double Kettlebell Farmers Carry (24kg/16kg)',
              '4x8m Double KB Front Rack Alternating Forward Lunges (24kg/16kg)',
              '14 Toes to Bar',
              {
                type: 'divider',
                note: 'continue adding reps until time is up',
              },
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '8 Min AMRAP',
            instructions:
              'Complete each round in order. Every round, add 2 reps to the shuttle distance and 2 reps to the Toes to Bar. Kettlebells: 20kg/12kg. Toes to Bar start at 8 reps. Score = rounds + reps.',
            movements: [
              '2x8m Shuttle Runs',
              '2x8m Double Kettlebell Farmers Carry (20kg/12kg)',
              '2x8m Double KB Front Rack Alternating Forward Lunges (20kg/12kg)',
              '8 Toes to Bar',
              {
                type: 'divider',
                note: 'add 2 reps to distance and Toes to Bar each round',
              },
              '4x8m Shuttle Runs',
              '4x8m Double Kettlebell Farmers Carry (20kg/12kg)',
              '4x8m Double KB Front Rack Alternating Forward Lunges (20kg/12kg)',
              '10 Toes to Bar',
              {
                type: 'divider',
                note: 'continue adding reps until time is up',
              },
            ],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: '8 Min AMRAP',
            instructions:
              'Complete each round in order. Every round, add 2 reps to the shuttle distance and 2 reps to the Hanging Leg Raises. Kettlebells: 16kg/8kg. Hanging Leg Raises start at 8 reps. Score = rounds + reps.',
            movements: [
              '2x8m Shuttle Runs',
              '2x8m Double Kettlebell Farmers Carry (16kg/8kg)',
              '2x8m Double KB Front Rack Alternating Forward Lunges (16kg/8kg)',
              '8 Hanging Leg Raises',
              {
                type: 'divider',
                note: 'Add 2 reps to distance and Hanging Leg Raises each round',
              },
              '4x8m Shuttle Runs',
              '4x8m Double Kettlebell Farmers Carry (16kg/8kg)',
              '4x8m Double KB Front Rack Alternating Forward Lunges (16kg/8kg)',
              '10 Hanging Leg Raises',
              {
                type: 'divider',
                note: 'continue adding reps until time is up',
              },
            ],
          },
        ],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'rh_05',
    title: 'Row, Bag and Bell',
    description:
      'A three-part workout with two rowing tests bookending a sandbag and kettlebell chipper. Pace the chipper - the second row will find you out.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 12,
    tags: ['Full Body', 'For Time', 'Chipper', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: 'Part 1 - 2 Min Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Set up for the chipper.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 2 - 7 Min Cap Chipper',
            instructions:
              "Complete all reps in order for time. Kettlebells: 24kg/16kg. Sandbag: 70kg/50kg. Note your finish time as Score 2, or 'cap' if you do not finish.",
            movements: [
              '21 Alternating Single KB Snatch (24kg/16kg)',
              '4x8m Sandbag Carry (70kg/50kg)',
              '15 Sandbag Alternating Clean to Shoulder (70kg/50kg)',
              {
                type: 'divider',
                note: 'second round',
              },
              '15 Alternating Single KB Snatch (24kg/16kg)',
              '6x8m Sandbag Carry (70kg/50kg)',
              '12 Sandbag Toss over Shoulder (70kg/50kg)',
              {
                type: 'divider',
                note: 'third round',
              },
              '9 Alternating Single KB Snatch (24kg/16kg)',
              '8x8m Sandbag Carry (70kg/50kg)',
              '9 Sandbag Squats (70kg/50kg)',
            ],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Get back on the rower.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 3 - 1 Min Row Test',
            instructions:
              'Max metres in 1 minute. Note your distance as Score 3.',
            movements: ['Max Metres Row (1 min)'],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: 'Part 1 - 2 Min Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Set up for the chipper.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 2 - 7 Min Cap Chipper',
            instructions:
              "Complete all reps in order for time. Kettlebells: 20kg/12kg. Sandbag: 50kg/30kg. Note your finish time as Score 2, or 'cap' if you do not finish.",
            movements: [
              '21 Alternating Single KB Snatch (20kg/12kg)',
              '4x8m Sandbag Carry (50kg/30kg)',
              '15 Sandbag Alternating Clean to Shoulder (50kg/30kg)',
              {
                type: 'divider',
                note: 'second round',
              },
              '15 Alternating Single KB Snatch (20kg/12kg)',
              '6x8m Sandbag Carry (50kg/30kg)',
              '12 Sandbag Toss over Shoulder (50kg/30kg)',
              {
                type: 'divider',
                note: 'third round',
              },
              '9 Alternating Single KB Snatch (20kg/12kg)',
              '8x8m Sandbag Carry (50kg/30kg)',
              '9 Sandbag Squats (50kg/30kg)',
            ],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Get back on the rower.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 3 - 1 Min Row Test',
            instructions:
              'Max metres in 1 minute. Note your distance as Score 3.',
            movements: ['Max Metres Row (1 min)'],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: 'Part 1 - 2 Min Row Test',
            instructions:
              'Max metres in 2 minutes. Note your distance as Score 1.',
            movements: ['Max Metres Row (2 mins)'],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Set up for the chipper.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 2 - 7 Min Cap Chipper',
            instructions:
              "Complete all reps in order for time. Kettlebells: 16kg/8kg. Sandbag: 50kg/30kg. Note your finish time as Score 2, or 'cap' if you do not finish.",
            movements: [
              '21 Alternating Single KB Snatch (16kg/8kg)',
              '12 Sandbag Toss over Shoulder (50kg/30kg)',
              {
                type: 'divider',
                note: 'second round',
              },
              '15 Alternating Single KB Snatch (16kg/8kg)',
              '9 Sandbag Toss over Shoulder (50kg/30kg)',
              {
                type: 'divider',
                note: 'third round',
              },
              '9 Alternating Single KB Snatch (16kg/8kg)',
              '6 Sandbag Squats (50kg/30kg)',
            ],
          },
          {
            name: 'Transition',
            instructions: '1 minute forced rest. Get back on the rower.',
            movements: ['1 min transition'],
          },
          {
            name: 'Part 3 - 1 Min Row Test',
            instructions:
              'Max metres in 1 minute. Note your distance as Score 3.',
            movements: ['Max Metres Row (1 min)'],
          },
        ],
      },
    ],
    equipment: ['kettlebell', 'sandbag', 'rower'],
  },
  {
    id: 'rh_07',
    title: 'Clean Complex Meet Chipper',
    description:
      'A two-part barbell workout. Six minutes to find your heaviest complex, then straight into a barbell chipper against the clock. The load you pick in part one will follow you into part two.',
    category: 'Rainhill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 12,
    tags: ['Full Body', 'Chipper', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        scale: 'ROCKET',
        blocks: [
          {
            name: '00:00 - 06:00 -  Complex',
            instructions:
              'Build to a maximum weight for the complex in 6 minutes. Complete as many attempts as needed. Score 1 = heaviest successful complex load (kg).',
            movements: [
              '3 Deadlifts',
              '2 Hang Cleans',
              '1 Shoulder to Overhead',
            ],
          },
          {
            name: '06:00 - 07:00 - Transition',
            instructions:
              '1 minute forced rest. Deload/Load your bar for Part 2 at 70kg/50kg.',
            movements: ['1 min transition'],
          },
          {
            name: '07:00 - 12:00 - Capped Chipper',
            instructions:
              "5 rounds for time. Bar weight: 70kg/50kg. Score 2 = finish time, or 'cap' if you do not finish.",
            movements: [
              '9 Deadlifts (70kg/50kg)',
              '6 Hang Cleans (70kg/50kg)',
              '3 Shoulder to Overhead (70kg/50kg)',
            ],
          },
        ],
      },
      {
        scale: 'KENNEDY',
        blocks: [
          {
            name: '00:00 - 06:00 - Complex',
            instructions:
              'Build to a maximum weight for the complex in 6 minutes. Complete as many attempts as needed. Score 1 = heaviest successful complex load (kg).',
            movements: [
              '3 Deadlifts',
              '2 Hang Cleans',
              '1 Shoulder to Overhead',
            ],
          },
          {
            name: '06:00 - 07:00 - Transition',
            instructions:
              '1 minute forced rest. Load your bar for Part 2 at 60kg/42.5kg.',
            movements: ['1 min transition'],
          },
          {
            name: '07:00 - 12:00 - Capped Chipper',
            instructions:
              "5 rounds for time. Bar weight: 60kg/42.5kg. Score 2 = finish time, or 'cap' if you do not finish.",
            movements: [
              '9 Deadlifts (60kg/42.5kg)',
              '6 Hang Cleans (60kg/42.5kg)',
              '3 Shoulder to Overhead (60kg/42.5kg)',
            ],
          },
        ],
      },
      {
        scale: 'WOOD',
        blocks: [
          {
            name: '00:00 - 06:00 - Complex',
            instructions:
              'Build to a maximum weight for the complex in 6 minutes. Complete as many attempts as needed. Score 1 = heaviest successful complex load (kg).',
            movements: [
              '3 Deadlifts',
              '2 Hang Cleans',
              '1 Shoulder to Overhead',
            ],
          },
          {
            name: '06:00 - 07:00 - Transition',
            instructions:
              '1 minute forced rest. Load your bar for Part 2 at 50kg/35kg.',
            movements: ['1 min transition'],
          },
          {
            name: '07:00 - 12:00 - Capped Chipper',
            instructions:
              "4 rounds for time. Bar weight: 50kg/35kg. Score 2 = finish time, or 'cap' if you do not finish.",
            movements: [
              '9 Deadlifts (50kg/35kg)',
              '6 Hang Cleans (50kg/35kg)',
              '3 Shoulder to Overhead (50kg/35kg)',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
];
