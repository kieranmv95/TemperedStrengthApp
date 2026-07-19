import type { StandaloneWorkoutSource } from '@/src/types/workouts';

// const collab = {
//   imageUrl:
//     'https://scontent-man2-1.cdninstagram.com/v/t51.82787-19/559154916_17854417824547327_2276666834850858080_n.jpg?efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby40NzAuYzIifQ&_nc_ht=scontent-man2-1.cdninstagram.com&_nc_cat=107&_nc_oc=Q6cZ2gF6p8x6XKJ4bcmSxauRTcHDsDOaPSncIUTGl0rdMbjZUExdtpB9d_jD_kOlkDHve8k&_nc_ohc=WzfANukQ2rEQ7kNvwFuKRyx&_nc_gid=mfsJZ0PGDRy2eLZOR1kEWw&edm=APoiHPcBAAAA&ccb=7-5&oh=00_AQCHEMvSZPGSmjgE97mj71jOgxmXa7bq6RdGGdZQpUF_EA&oe=6A56AD0A&_nc_sid=22de04',
//   name: 'Arena Games',
//   description:
//     'This workout is brought to you by Arena Games, where we put everyday athletes on the big stage.',
//   link: 'https://www.thearenagames.co.uk/',
//   linkCopy: 'Click to Learn More',
//   bgColor: '#000000',
//   linkAndBorderColor: '#FF3801',
//   nameColor: '#FF3801',
// };

export const arena: StandaloneWorkoutSource[] = [
  // {
  //   id: 'ar_01',
  //   title: 'Event 001 - WOD 1',
  //   description:
  //     'A 4-person workout (2M/2F). Eight minutes of max ski and bike, four minutes rest, then both mixed pairs race through 30 sync hang Grace.',
  //   category: 'WOD',
  //   difficulty: 'Advanced',
  //   estimatedTime: 20,
  //   tags: ['Full Body', 'Intervals', 'Benchmark', 'Arena', 'Partner'],
  //   isPremium: false,
  //   collab,
  //   blocks: [
  //     {
  //       scale: 'Locked In',
  //       blocks: [
  //         {
  //           name: 'Warmup',
  //           mobilityFlow: 'r_15',
  //         },
  //         {
  //           name: '0:00 - 8:00 - Max Ski + Bike',
  //           instructions:
  //             'Team max calories on the ski erg and bike in 8 minutes. Split work as you choose.',
  //           movements: ['Max Calories Ski + Bike'],
  //         },
  //         {
  //           name: '8:00 - 12:00 - Rest',
  //           instructions: '4 minutes forced rest.',
  //           movements: ['4 min rest'],
  //         },
  //         {
  //           name: '12:00 - 20:00 - Sync Hang Grace',
  //           instructions:
  //             'Both mixed pairs work. Each MF pair completes 30 sync hang clean & jerks (Hang Grace).',
  //           highlightInstructions: 'Hang Grace = Hang Clean & Jerks.',
  //           movements: [
  //             'MF Pair 1: 30 Sync Hang Clean & Jerks',
  //             'MF Pair 2: 30 Sync Hang Clean & Jerks',
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   equipment: ['ski erg', 'bike', 'barbell'],
  // },
  // {
  //   id: 'ar_02',
  //   title: 'Event 001 - WOD 2',
  //   description:
  //     'A 4-person workout (2M/2F). A synchro chipper with descending reps across snatches, toes to bar, lunges, chest to bar, devil presses and bar muscle-ups.',
  //   category: 'WOD',
  //   difficulty: 'Advanced',
  //   estimatedTime: 20,
  //   tags: ['Full Body', 'Chipper', 'For Time', 'Arena', 'Partner'],
  //   isPremium: false,
  //   collab,
  //   blocks: [
  //     {
  //       scale: 'Locked In',
  //       blocks: [
  //         {
  //           name: 'Warmup',
  //           mobilityFlow: 'r_15',
  //         },
  //         {
  //           name: 'For Time',
  //           instructions:
  //             'Complete all reps in order. Numbers in brackets are athletes working together on that movement (4 = all four, 2 = a sync pair).',
  //           movements: [
  //             '60 Sync DB Snatches [4]',
  //             '60 Sync Toes to Bar [2]',
  //             {
  //               type: 'divider',
  //             },
  //             '40 Sync Overhead Lunges [4]',
  //             '40 Sync Chest to Bar Pull-Ups',
  //             {
  //               type: 'divider',
  //             },
  //             '20 Sync Devil Presses [4]',
  //             '20 Sync Bar Muscle-Ups [2]',
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   equipment: ['dumbbell', 'pull-up bar'],
  // },
  // {
  //   id: 'ar_03',
  //   title: 'Event 001 - WOD 3',
  //   description:
  //     'A 4-person workout (2M/2F). A clean ladder — females buy in and build to a 1RM, then males do the same after a short rest. Heavy and precise.',
  //   category: 'WOD',
  //   difficulty: 'Advanced',
  //   estimatedTime: 22,
  //   tags: ['Olympic Lifting', 'Ladder', 'Benchmark', 'Arena', 'Partner'],
  //   isPremium: false,
  //   collab,
  //   blocks: [
  //     {
  //       scale: 'Locked In',
  //       blocks: [
  //         {
  //           name: 'Warmup',
  //           mobilityFlow: 'r_15',
  //         },
  //         {
  //           name: '3a) 0:00 - 10:00 - Female Clean Ladder',
  //           instructions:
  //             'FF buy-in ladder into a 1RM clean. Complete the buy-in, then build to a max clean in the remaining time.',
  //           highlightInstructions: 'Females only.',
  //           movements: [
  //             '16 Cleans @ 50kg',
  //             '12 Cleans @ 60kg',
  //             '8 Cleans @ 70kg',
  //             '4 Cleans @ 75kg',
  //             {
  //               type: 'divider',
  //               note: 'into',
  //             },
  //             '1RM Clean',
  //           ],
  //         },
  //         {
  //           name: '10:00 - 12:00 - Rest',
  //           instructions: '2 minutes forced rest.',
  //           movements: ['2 min rest'],
  //         },
  //         {
  //           name: '3b) 12:00 - 22:00 - Male Clean Ladder',
  //           instructions:
  //             'MM buy-in ladder into a 1RM clean. Complete the buy-in, then build to a max clean in the remaining time.',
  //           highlightInstructions: 'Males only.',
  //           movements: [
  //             '16 Cleans @ 80kg',
  //             '12 Cleans @ 90kg',
  //             '8 Cleans @ 100kg',
  //             '4 Cleans @ 110kg',
  //             {
  //               type: 'divider',
  //               note: 'into',
  //             },
  //             '1RM Clean',
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   equipment: ['barbell'],
  // },
  // {
  //   id: 'ar_04',
  //   title: 'Event 001 - WOD 4',
  //   description:
  //     'A 4-person workout (2M/2F). Each round is one 3D shuttle run, then an unbroken set of deadlifts. Score is total deadlifts.',
  //   category: 'WOD',
  //   difficulty: 'Advanced',
  //   estimatedTime: 6,
  //   tags: ['Lower Body', 'AMRAP', 'Benchmark', 'Arena', 'Partner'],
  //   isPremium: false,
  //   collab,
  //   blocks: [
  //     {
  //       scale: 'Locked In',
  //       blocks: [
  //         {
  //           name: 'Warmup',
  //           mobilityFlow: 'r_15',
  //         },
  //         {
  //           name: 'AMRAP 6',
  //           instructions:
  //             'Each round: 1 x 3D shuttle run (suicide run), then 1 unbroken set of deadlifts @ 80/55kg. Score = total deadlifts.',
  //           highlightInstructions: 'Deadlift sets must be unbroken.',
  //           movements: [
  //             '1 x 3D Shuttle Run (suicide run)',
  //             '1 Unbroken Set of Deadlifts @ 80/55kg',
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   equipment: ['barbell'],
  // },
  // {
  //   id: 'ar_05',
  //   title: 'Event 001 - WOD 5',
  //   description:
  //     'A 4-person workout (2M/2F). Five minutes of sync hang snatches and burpees, one minute rest, then a descending double-under and thruster chipper for time.',
  //   category: 'WOD',
  //   difficulty: 'Advanced',
  //   estimatedTime: 16,
  //   tags: ['Full Body', 'For Time', 'Benchmark', 'Arena', 'Partner'],
  //   isPremium: false,
  //   collab,
  //   blocks: [
  //     {
  //       scale: 'Locked In',
  //       blocks: [
  //         {
  //           name: 'Warmup',
  //           mobilityFlow: 'r_15',
  //         },
  //         {
  //           name: '5a) 0:00 - 5:00 - AMRAP 5',
  //           instructions:
  //             'As many rounds as possible in 5 minutes. Sync hang power snatches are MF pairs @ 50/35kg. Burpee to reach is all 4 athletes.',
  //           movements: [
  //             '24 Sync Hang Power Snatches [MF] @ 50/35kg',
  //             '12 Sync Burpee to Reach [4]',
  //           ],
  //         },
  //         {
  //           name: '5:00 - 6:00 - Rest',
  //           instructions: '1 minute forced rest.',
  //           movements: ['1 min rest'],
  //         },
  //         {
  //           name: '5b) 6:00 - 16:00 - For Time (10:00 Cap)',
  //           instructions:
  //             'Athletes work in order P1 through P4. Complete all work for time within the 10-minute cap. Thrusters @ 50/35kg.',
  //           movements: [
  //             'P1: 50 Double Unders + 21 Thrusters @ 50/35kg',
  //             'P2: 75 Double Unders + 18 Thrusters @ 50/35kg',
  //             'P3: 100 Double Unders + 15 Thrusters @ 50/35kg',
  //             'P4: 125 Double Unders + 12 Thrusters @ 50/35kg',
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  //   equipment: ['barbell', 'skipping rope'],
  // },
];
