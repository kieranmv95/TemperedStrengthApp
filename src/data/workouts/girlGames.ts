import type { StandaloneWorkoutSource } from '@/src/types/workouts';

const collab = {
  image: require('@/assets/images/disciplines/tgg.jpg'),
  name: 'The Girl Games',
  description: 'A fitness competition made for women, by women.',
  link: 'https://www.instagram.com/thegirlgames_/',
  linkCopy: 'Visit The Girl Games on Instagram',
  bgColor: '#000000',
  linkAndBorderColor: '#FF4BB8',
  nameColor: '#FF4BB8',
  descriptionColor: '#FFFFFF',
  inColabWithColor: '#B0B0B0',
};

const partnerChipperInstructions =
  'Partner workout. Work through the list in order. YGIG (You Go I Go): split the work, one athlete working at a time. Synchro: both athletes move together. 40 minute time cap. Score = finish time, or cap if you hit 40:00.';

export const girlGames: StandaloneWorkoutSource[] = [
  {
    id: 'gg_01',
    title: 'METCON - Row',
    description:
      'A partner pyramid chipper. You-go-I-go on the row, snatches, lunges and farmer carries, with synchro sprints and chest-to-floor burpees over the line at the turnaround.',
    category: 'Girl Games',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Chipper', 'Partner'],
    isPremium: false,
    partner: true,
    collab,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'For Time (40:00 Cap)',
        instructions: partnerChipperInstructions,
        highlightInstructions: 'YGIG splits the work. Synchro moves together.',
        movements: [
          'Sprint to Start (Synchro)',
          '1000m Row (YGIG)',
          '100 DB Alternating Single Arm Snatch (YGIG, 10kg DB)',
          '80 DB Front Loaded Alternate Lunges (YGIG, 7.5kg DBs)',
          '30 Chest to Floor Burpee Over the Line (Synchro)',
          '16 Lengths Farmers Carry (YGIG, 16kg KBs)',
          '30 Chest to Floor Burpee Over the Line (Synchro)',
          '80 DB Front Loaded Alternate Lunges (YGIG, 7.5kg DBs)',
          '100 DB Alternating Single Arm Snatch (YGIG, 10kg DB)',
          '1000m Row (YGIG)',
          'Sprint Finish (Synchro)',
        ],
      },
    ],
    equipment: ['kettlebell', 'dumbbell', 'rower'],
  },
  {
    id: 'gg_02',
    title: 'METCON - Assault Bike',
    description:
      'A 40-minute partner race. Assault bike, sandbag lunges, dual DB ground-to-shoulders and wall balls, with synchro chest-to-floor burpees through the middle.',
    category: 'Girl Games',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Chipper', 'Partner'],
    isPremium: false,
    partner: true,
    collab,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'For Time (40:00 Cap)',
        instructions: partnerChipperInstructions,
        highlightInstructions: 'YGIG splits the work. Synchro moves together.',
        movements: [
          'Sprint to Start (Synchro)',
          '50 Calorie Assault Bike (YGIG)',
          '100 Sandbag Reverse Lunges (YGIG, 10kg SB)',
          '80 Dual DB Ground to Shoulders (YGIG, 10kg DBs)',
          '20 Chest to Floor Burpees (Full Extension, Synchro)',
          '100 Wall Balls (YGIG, 4kg)',
          '20 Chest to Floor Burpees (Full Extension, Synchro)',
          '80 Dual DB Ground to Shoulders (YGIG, 10kg DBs)',
          '100 Sandbag Reverse Lunges (YGIG, 10kg SB)',
          '50 Calorie Assault Bike (YGIG)',
          'Sprint Finish (Synchro)',
        ],
      },
    ],
    equipment: ['dumbbell', 'bike', 'medicine ball', 'sandbag'],
  },
  {
    id: 'gg_03',
    title: 'METCON - Ski',
    description:
      'Ski, devil press, front-loaded lunges and kettlebell swings out and back, with a synchro dumbbell push press at the peak.',
    category: 'Girl Games',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Chipper', 'Partner'],
    isPremium: false,
    partner: true,
    collab,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'For Time (40:00 Cap)',
        instructions: partnerChipperInstructions,
        highlightInstructions: 'YGIG splits the work. Synchro moves together.',
        movements: [
          'Sprint to Start (Synchro)',
          '1000m Ski (YGIG)',
          '50 Devil Presses (YGIG, 7.5kg DBs)',
          '75 DB Front Loaded Alternate Lunges (YGIG, 7.5kg DBs)',
          '75 Kettlebell Swings (YGIG, 16kg KB)',
          '25 DB Push Press (Synchro, 10kg DBs)',
          '75 Kettlebell Swings (YGIG, 16kg KB)',
          '75 DB Front Loaded Alternate Lunges (YGIG, 7.5kg DBs)',
          '50 Devil Presses (YGIG, 7.5kg DBs)',
          '1000m Ski (YGIG)',
          'Sprint Finish (Synchro)',
        ],
      },
    ],
    equipment: ['kettlebell', 'dumbbell', 'ski erg'],
  },
];
