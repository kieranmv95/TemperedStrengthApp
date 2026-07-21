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
