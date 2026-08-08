import type { StandaloneWorkoutSource } from '@/src/types/workouts';

const replabCollab = {
  image: require('@/assets/images/collabs/replab.jpg'),
  name: 'RepLab',
  description:
    'Creatine + electrolytes in tear-and-pour sachets. Fuel strength, hydration, and recovery without the tubs and scoops. Use code TS10 for 10% off.',
  link: 'https://thereplab.co.uk/',
  linkCopy: 'Shop RepLab — TS10 for 10% off',
  bgColor: '#000000',
  nameColor: '#FFFFFF',
  descriptionColor: '#B0B0B0',
  linkAndBorderColor: '#FFFFFF',
  inColabWithColor: '#888888',
};

export const hyrox: StandaloneWorkoutSource[] = [
  {
    id: 'f_71',
    title: 'Performance Ritual',
    description:
      'A Hyrox-style chipper into a short bodyweight finisher. Move well, keep transitions tight, and empty the tank on the last 10 burpees.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Full Body', 'Chipper', 'For Time'],
    isPremium: false,
    collab: replabCollab,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins easy jog or rower',
          '10 air squats, 5 burpees, 10 walking lunges',
        ],
      },
      {
        name: 'For Time',
        instructions:
          'Work straight through every movement with minimal rest. Keep the run honest so you can still attack the burpee broad jumps and wall balls, then empty the tank on the finisher. Score is total time from the run to the last burpee.',
        highlightInstructions: 'One clock. Chipper into finisher.',
        movements: [
          '500m Run',
          '20 Burpee Broad Jumps',
          '20 Walking Lunges',
          '15 Wall Balls',
          '250m Row',
          '20m Farmer\u2019s Carry',
          { type: 'divider', note: 'Finisher' },
          '30 Bodyweight Squats',
          '30 Sit-ups',
          '10 Burpees',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '90s easy walk to bring the heart rate down',
          '60s seated forward fold',
          '60s hip flexor stretch each side',
        ],
      },
    ],
    equipment: ['medicine ball', 'rower', 'dumbbell'],
  },
  {
    id: 'p_36',
    title: 'Order 66',
    description:
      'A high-output Hyrox-style workout chipper, designed in homage to the iconic Star Wars films.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Full Body', 'Chipper', 'For Time', 'Partner'],
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
  {
    id: 'f_09',
    title: 'Standard PFT',
    description:
      'The official Hyrox Physical Fitness Test. Use this to gauge your current level.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['400m Run', '10 Burpees', '10 Air Squats'],
          },
          {
            name: 'For Time',
            instructions:
              'Minimal transition time between movements. Record your total time.',
            movements: [
              '1000m Run',
              '30 Burpee Broad Jumps',
              '200m Sandbag Lunges',
              '1000m Row',
              '30 Wall Balls',
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
            highlightInstructions: 'Into (working together):',
            movements: ['400m Run', '10 Burpees', '10 Air Squats'],
          },
          {
            name: 'For Time',
            instructions:
              'Minimal transition time between movements. Record your total time. Partner format: alternate as you please, one rests the other works.',
            highlightInstructions: 'One rests, the other works.',
            movements: [
              '1600m Run',
              '40 Burpee Broad Jumps',
              '300m Sandbag Lunges',
              '1600m Row',
              '40 Wall Balls',
            ],
          },
        ],
      },
    ],
    equipment: ['sandbag', 'medicine ball', 'rower'],
  },
  {
    id: 'f_20',
    title: 'The Long Pull',
    description:
      'This is not a sprint. Four rounds of rowing with bodyweight work in between, building fatigue the way a Hyrox race does. Your legs will be burning before you sit back down. Record your 500m/600m(partner) split each row and try to hold it across all four rounds.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Full Body', 'Intervals', 'Benchmark', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['250m Easy Row', '10 air squats', '5 burpees'],
          },
          {
            name: '4 Rounds',
            instructions:
              'Complete the row then move straight into the floor work, no rest between them. Rest 2 minutes after completing all three movements before starting the next round. Record your 500m row split each round.',
            highlightInstructions: 'Your score is your slowest row split.',
            movements: [
              'Round 1: 500m Row, 15 Burpees, 20 Air Squats',
              'Rest 2 mins',
              'Round 2: 500m Row, 15 Burpees, 20 Air Squats',
              'Rest 2 mins',
              'Round 3: 500m Row, 15 Burpees, 20 Air Squats',
              'Rest 2 mins',
              'Round 4: 500m Row, 15 Burpees, 20 Air Squats',
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
            highlightInstructions: 'Into:',
            movements: ['250m Easy Row', '10 air squats', '5 burpees'],
          },
          {
            name: '4 Rounds',
            instructions:
              'Complete the row then move straight into the floor work, no rest between them. Rest 2 minutes after completing all three movements before starting the next round. Record your 500m row split each round.',
            highlightInstructions:
              'One rests, the other works. Your score is your slowest row split.',
            movements: [
              'Round 1: 600m Row, 18 Burpees, 24 Air Squats',
              'Rest 2 mins',
              'Round 2: 600m Row, 18 Burpees, 24 Air Squats',
              'Rest 2 mins',
              'Round 3: 600m Row, 18 Burpees, 24 Air Squats',
              'Rest 2 mins',
              'Round 4: 600m Row, 18 Burpees, 24 Air Squats',
            ],
          },
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_50',
    title: 'Hyrox Prep: Run + Row Engine Session',
    description:
      'A simple Hyrox-style engine session. Keep transitions fast and breathing controlled.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Cardio', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '400m easy run',
              '250m easy row',
              '10 air squats, 10 lunges',
            ],
          },
          {
            name: '4 Rounds',
            instructions:
              'Complete the run then move straight into the row, no rest between them. Rest 2 minutes after completing all three movements before starting the next round. Record your 400m run split each round.',
            highlightInstructions: 'Your score is your slowest round.',
            movements: ['800m Run', '500m Row'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '400m easy run',
              '250m easy row',
              '10 air squats, 10 lunges',
            ],
          },
          {
            name: '4 Rounds',
            instructions:
              'Complete the run then move straight into the row, no rest between them. Rest 2 minutes after completing all three movements before starting the next round. Record your 400m run split each round.',
            highlightInstructions:
              'Run together (the hyrox way), split the row',
            movements: ['800m Run', '600m Row'],
          },
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_51',
    title: 'Sled Exposure',
    description:
      'Technique first. Learn bracing, posture, and smooth drive without redlining.',
    category: 'Hyrox',
    difficulty: 'Beginner',
    estimatedTime: 35,
    tags: ['Lower Body', 'Intervals'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '4 mins easy cardio',
          '2 x 20m empty sled push',
          '2 x 20m light sled pull',
        ],
      },
      {
        name: 'Skill + Work (6 rounds)',
        instructions:
          'This session is not about speed, it is about technique. Focus on bracing, posture, and smooth drive without redlining.',
        highlightInstructions:
          '6 Rounds. Rest where needed but respect the forced rest',
        movements: [
          '60m Sled Push - light',
          '15 Wall Balls - light',
          '60m Sled Pull - light',
          'Rest minimum 2 min',
        ],
      },
    ],
    equipment: ['medicine ball', 'sled'],
  },
  {
    id: 'f_52',
    title: 'Wall Ball Density 10',
    description:
      'Hyrox-specific density test. Pick a target pace and hold it without long breaks.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 12,
    tags: ['Full Body', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio', '3 x 10 wall balls - light'],
      },
      {
        name: '10 Min For Total Reps',
        instructions:
          'This will hurt. Pick a target pace and hold it without long breaks. Rest where needed but keep minimal, high HR zones are normal.',
        highlightInstructions: 'Score = total wall balls.',
        movements: ['Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_53',
    title: 'Jump The Gap',
    description:
      'Eight rounds of burpee broad jumps and air squats, Burpee Broad Jumps tends to be the movement that breaks people in Hyrox. The goal is consistent distance every round, not an all-out sprint that falls apart by round four. Solo or with a partner, the rules are the same: strong hips, full extension, calm breathing.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Full Body', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins Easy Jog',
              '10 Burpees at easy pace',
              '10 Broad Jumps, focus on full hip extension',
            ],
          },
          {
            name: 'E2MOM x 8 Rounds',
            instructions:
              'Every 2 minutes, complete as many reps as possible in 60 seconds. Rest the remaining 60 seconds. Try to hold similar reps accross each round.',
            movements: [
              '00:00 - 02:00: 60s Burpee Broad Jumps, 60s rest',
              '02:00 - 04:00: 60s Air Squats, 60s rest',
              '04:00 - 06:00: 60s Burpee Broad Jumps, 60s rest',
              '06:00 - 08:00: 60s Air Squats, 60s rest',
              '08:00 - 10:00: 60s Burpee Broad Jumps, 60s rest',
              '10:00 - 12:00: 60s Air Squats, 60s rest',
              '12:00 - 14:00: 60s Burpee Broad Jumps, 60s rest',
              '14:00 - 16:00: 60s Air Squats, 60s rest',
              '16:00 - 18:00: 60s Burpee Broad Jumps, 60s rest',
              '18:00 - 20:00: 60s Air Squats, 60s rest',
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
            highlightInstructions: 'Into:',
            movements: [
              '2 mins Easy Jog',
              '10 Burpees at easy pace',
              '10 Broad Jumps, focus on full hip extension',
            ],
          },
          {
            name: 'E2MOM x 8 Rounds',
            instructions:
              'Partner A works the first 60s, Partner B works the second 60s, alternating each round. Team goal is consistent distance across all 8 rounds.',
            movements: [
              '00:00 - 02:00: 60s (Each) Burpee Broad Jumps swa',
              '02:00 - 04:00: 60s (Each)Air Squats',
              '04:00 - 06:00: 60s (Each) Burpee Broad Jumps',
              '06:00 - 08:00: 60s (Each) Air Squats',
              '08:00 - 10:00: 60s (Each) Burpee Broad Jumps',
              '10:00 - 12:00: 60s (Each) Air Squats',
              '12:00 - 14:00: 60s (Each) Burpee Broad Jumps',
              '14:00 - 16:00: 60s (Each) Air Squats',
              '16:00 - 18:00: 60s (Each) Burpee Broad Jumps',
              '18:00 - 20:00: 60s (Each) Air Squats',
            ],
          },
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_54',
    title: 'Carry Capacity Builder',
    description:
      'Grip and posture under fatigue. Walk tall, breathe steady. This will feel heavy, expect to be slow and have to break up the heavy carry.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['200m easy jog', '2 x 20m light carry'],
          },
          {
            name: 'Workout',
            instructions:
              '5 Rounds, rest as needed, this one will feel heavy, expect to be slow and have to break up the heavy carry.',
            highlightInstructions: '5 Rounds',
            movements: ['600m Run', '100m Farmers Carry'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['200m easy jog', '2 x 20m light carry'],
          },
          {
            name: 'Workout',
            instructions:
              '5 Rounds. Run be completed TOGETHER, split the carry work between the team in a tag team style approach. Walk with your partner whilst the work as active recovery and rest. Rest while your partner works. This should feel fast.',
            highlightInstructions:
              '5 Rounds. Run together, split the carry work.',
            movements: ['600m Run', '150m Farmers Carry'],
          },
        ],
      },
    ],
    equipment: ['dumbbell'],
  },
  {
    id: 'f_56',
    title: 'Race Day Simulation',
    description:
      'Hyrox does not let you sit on a rower with fresh legs. This session makes sure you never do either. You will earn your 2000m row by getting through a full body burnout first, then rowing on legs that already have nothing left. That is the point.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Full Body', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins Easy cardio of choice',
          '10 Burpees at easy pace',
          '10 Squat to Stand',
          'Rest Mimimum 90s before starting',
        ],
      },
      {
        name: '1: The Burnout',
        instructions:
          'Complete all three movements as fast as possible with no rest between them. This is not for time but it should hurt. Move straight into the row when done.',
        movements: ['30 Burpee Broad Jumps', '40 Air Squats', '50 Wall Balls'],
      },
      {
        name: '2: 2000m Row',
        instructions:
          'Start the rower immediately after finishing the burnout. Even splits for the first 1500m then empty the tank for the final 500m. Chase it.',
        movements: ['2000m Row'],
      },
      {
        name: '3: The Burnout Pt 2',
        instructions:
          'Complete all three movements as fast as possible with no rest between them. This is not for time but it should hurt. Move straight into the row when done.',
        movements: ['30 Burpee Broad Jumps', '40 Air Squats', '50 Wall Balls'],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'f_57',
    title: 'No Ski, No Problem',
    description:
      'No SkiErg? This is your substitute. The row covers the upper body pulling demand and the run keeps the legs turning over, just like race day transitions. Five rounds of both with no scheduled rest. Smooth is fast.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Cardio', 'For Time'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '200m Easy Run',
          '200m Easy Row',
          'Rest Minimum 90s before starting',
        ],
      },
      {
        name: '5 Rounds: For Time',
        instructions:
          "No scheduled rest between movements or rounds. Rest only if you genuinely need to. Record your total time at the end. Keep the row powerful and vertical through the stroke, keep the run smooth and steady. It's easy to skimp on the ball slams, but they are important, really drive them into the ground.",
        highlightInstructions:
          'Ball slams replicate the upper body pulling demand of the ski erg.',
        movements: ['500m Run', '250m Row', '20 ball slams'],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'f_58',
    title: 'Run to the Wall',
    description:
      'Run hard enough to make wall balls feel heavy, then stay composed anyway.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Cardio', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '200m Easy Run',
              '2 x 10 Wall Balls (easy)',
              '10 Burpees (easy)',
            ],
          },
          {
            name: '6 Rounds',
            instructions:
              'Keep the run pace honest. you dont want to be redlining the run but you also dont want to have a full tank when you get back to the wall balls.',
            movements: ['500m', '20 Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '200m Easy Run',
              '2 x 10 Wall Balls (easy)',
              '10 Burpees (easy)',
            ],
          },
          {
            name: '6 Rounds',
            instructions:
              'Run together, then Partner A does 15 wall balls while Partner B rests, then switch for the next 15. Keep the run pace honest.',
            highlightInstructions:
              'Partner A does 15 wall balls while Partner B rests, then switch for the next 15.',
            movements: ['500m Run', '30 Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_59',
    title: 'Pit Stop',
    description:
      'Hyrox-style stations with minimal running. Great when space is limited.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '5 air squats, 5 lunges, 5 push-ups',
            ],
          },
          {
            name: '4 Rounds For Time',
            instructions:
              'Complete the movements as quickly as possible in order with minimal break',
            movements: [
              '500m Row',
              '25 Wall Balls',
              '20 Burpee Broad Jumps',
              '50m Farmers Carry',
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
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '5 air squats, 5 lunges, 5 push-ups',
            ],
          },
          {
            name: '4 Rounds For Time',
            instructions:
              'Complete the movements as quickly as possible in order with minimal break',
            highlightInstructions:
              'Split down the middle: Partner A does the first half of the movements, Partner B does the second half, then switch for the next half.',
            movements: [
              '500m Row',
              '40 Wall Balls',
              '30 Burpee Broad Jumps',
              '80m Farmers Carry',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'f_60',
    title: 'The Quiet Work',
    description:
      'Not every session needs to hurt. Zone 2 work is where your engine actually gets built, and most people skip it because it feels too easy. It is not. Stay conversational the whole time, if you cannot hold a sentence you are going too hard. Pick your machine and settle in.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 40,
    tags: ['Cardio'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '3 mins very easy cardio on your chosen machine',
          'Build pace slightly every 60s until you hit your working pace',
        ],
      },
      {
        name: '30 Min - Zone 2',
        instructions:
          'Pick one machine and stay on it. Maintain a conversational pace for the full 30 minutes. If you cannot speak in full sentences you are going too hard. If you feel like you could go forever you are probably right where you need to be. Record your distance at the end.',
        movements: [
          'Option A: 30 mins Steady Run',
          'Option B: 30 mins Steady Row',
          'Option C: 30 mins Steady Bike',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '5 mins very easy pace on a different machine',
          '60s Hip Flexor Stretch each side',
          '60s Hamstring Stretch each side',
          '60s Calf Stretch each side',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_61',
    title: 'Push Your Luck (Sled)',
    description:
      'Hyrox sled push practice. Smooth drive, no collapsing. Moderate weight, moderate pace.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Lower Body', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '30m light sled push',
              '10 wall balls (easy)',
            ],
          },
          {
            name: '8 Rounds For Time',
            instructions:
              'Flat out as you get 90s rest per round. dip in and out of redline to build versatility.',
            highlightInstructions: 'Rest 90s between rounds.',
            movements: ['20m Sled Push (moderate weight)', '15 Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '30m light sled push',
              '10 wall balls (easy)',
            ],
          },
          {
            name: '8 Rounds For Time',
            instructions:
              'Flat out as you get lots of partner rest then 90s rest each round. dip in and out of redline to build versatility.',
            highlightInstructions:
              '10m swaps on push, 10 then swap on wall balls. Rest 90s between rounds.',
            movements: ['40m Sled Push (moderate weight)', '40 Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['medicine ball', 'sled'],
  },
  {
    id: 'f_62',
    title: 'Sled Pull Intervals (Moderate)',
    description:
      'Hyrox sled pull practice. Keep torso tall and stride consistent.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Lower Body', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy cardio', '30m light sled pull'],
          },
          {
            name: '8 Rounds For Time',
            instructions:
              'Flat out as you get 90s rest per round. dip in and out of redline to build versatility.',
            highlightInstructions: 'Rest 90s between rounds.',
            movements: ['20m Sled Pull (moderate)', '15 Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy cardio', '30m light sled pull'],
          },
          {
            name: '8 Rounds For Time',
            instructions:
              'Flat out as you get lots of partner rest then 90s rest each round. dip in and out of redline to build versatility.',
            highlightInstructions:
              '10m swaps on pull, 10 then swap on wall balls. Rest 90s between rounds.',
            movements: ['40m Sled Pull (moderate)', '40 Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['sled'],
  },
  {
    id: 'f_63',
    title: 'Roxzone Transitions',
    description:
      'Run in, get working fast. A session built around Hyrox transitions and composure.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['200m easy jog', '10 burpees', '10 wall balls'],
          },
          {
            name: '6 Rounds',
            instructions:
              'pace the run, work fast on the burpees and wall balls.',
            movements: ['600m Run', '10 Burpees', '15 Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['200m easy jog', '10 burpees', '10 wall balls'],
          },
          {
            name: '6 Rounds',
            instructions:
              'Partner format: tag team the stations. Run together. At the station, Partner A works and then tags in Partner B and takes a rest.',
            highlightInstructions:
              'Partner A does burpees while Partner B rests, then switch for wall balls.',
            movements: ['600m Run', '20 Burpees', '30 Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_64',
    title: 'Hyrox Mini AMRAP 12',
    description:
      'A short Hyrox-style effort when you want intensity without a long session.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Full Body', 'AMRAP', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '10 air squats, 10 push-ups, 250m row',
            ],
          },
          {
            name: '12 Min AMRAP',
            instructions:
              'Complete the movements as quickly as possible in order with minimal break, redline.',
            movements: ['400m Run', '250m Row', '15 Wall Balls', '10 Burpees'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '10 air squats, 10 push-ups, 250m row',
            ],
          },
          {
            name: '12 Min AMRAP',
            instructions:
              'Run together, split the rest as you please.Complete the movements as quickly as possible in order with minimal break, redline.',
            highlightInstructions:
              'Run together, split the rest as you please.',
            movements: ['400m Run', '300m Row', '20 Wall Balls', '10 Burpees'],
          },
        ],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'f_65',
    title: 'The Qualifier',
    description:
      'A short, fast paced Hyrox-style benchmark. Minimal transition time, flat out.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['200m easy jog', '10 burpees', '10 air squats'],
      },
      {
        name: 'For Time',
        instructions: 'Record time ot complete, if you rest, make it short.',
        highlightInstructions: 'Flat out as you can, test your engine.',
        movements: [
          '1000m Run',
          '50m Farmers Carry',
          '1000m Row',
          '50 Wall Balls',
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'f_67',
    title: 'Grippy',
    description:
      'Carry medley under fatigue. Your job is to keep posture tall and steps clean.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '3 mins easy cardio',
              '2 x 40m light carry',
              '10 glute bridges',
            ],
          },
          {
            name: 'Workout',
            instructions:
              'A heavy chipper with a heavy carry finish. Work through each movement in full before moving on to the next. Rest only as needed to keep moving.',
            movements: [
              '400m Farmers Carry',
              '200m Sandbag Carry',
              '100m Overhead Plate Carry',
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
            highlightInstructions: 'Into:',
            movements: [
              '3 mins easy cardio',
              '2 x 40m light carry',
              '10 glute bridges',
            ],
          },
          {
            name: 'Workout',
            instructions:
              'A heavy chipper with a heavy carry finish. Work through each movement in full before moving on to the next. Split the carry work between the team in a tag team style approach. Walk with your partner whilst the work as active recovery and rest.',
            movements: [
              '400m Farmers Carry',
              '200m Sandbag Carry',
              '100m Overhead Plate Carry',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'sandbag'],
  },
  {
    id: 'f_68',
    title: 'Wall Ball 150 Test',
    description:
      'A Hyrox-flavoured benchmark. One movement. One goal. Keep moving.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['20 air squats, 10 push-ups'],
      },
      {
        name: 'For Time',
        instructions:
          '150 wall balls. Record finish time, if you rest, make it short.',
        highlightInstructions: 'Flat out as you can, keep moving.',
        movements: ['150 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_69',
    title: 'Race Sim: Half',
    description:
      'A half-distance Hyrox-style simulation. Focus on steady output and smooth transitions.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy jog', '10 wall balls, 10 burpees'],
          },
          {
            name: 'For Time',
            instructions:
              'This is roughly 50% of the Hyrox workout. Rest as you please. Focus on efficient transitions. keep everything tight and think of form.',
            highlightInstructions:
              "You don't want this to feel easy, it should be a challenge.",
            movements: [
              '1000m Run',
              '500m Row',
              '1000m Run',
              '50m Farmers Carry',
              '1000m Run',
              '30 Burpee Broad Jumps',
              '1000m Run',
              '50 Wall Balls',
            ],
          },
        ],
      },
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy jog', '10 wall balls, 10 burpees'],
          },
          {
            name: 'For Time',
            instructions:
              'This is roughly 50% of the Hyrox workout. Run together, split the rest as you please one works the other rests. Focus on minimal and efficient transitions. keep everything tight and think of form.',
            highlightInstructions:
              'Run together, split the rest as you please one works the other rests.',
            movements: [
              '1000m Run',
              '600m Row',
              '1000m Run',
              '60m Farmers Carry',
              '1000m Run',
              '40 Burpee Broad Jumps',
              '1000m Run',
              '60 Wall Balls',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'p_01',
    title: 'The Anvil Grinder',
    description:
      'Elite Hyrox preparation. Heavy sled work paired with aerobic fatigue.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Full Body', 'For Time'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['500m Jog, 10 Sled Pushes (Light), 20 Lunges'],
      },
      {
        name: '5 Rounds',
        instructions:
          'Rest 60s between rounds.Work through each movement in full before moving on to the next. Rest only as needed to keep moving.',
        highlightInstructions: 'Run at 70-80% of max heart rate',
        movements: [
          '1km Run',
          '50m Sled Push (Official Hyrox Weight)',
          '100m Sandbag Carry (Official Hyrox Weight)',
        ],
      },
    ],
    equipment: ['sandbag', 'sled'],
  },
  {
    id: 'p_17',
    title: 'Earn Your 5k',
    description:
      'Anyone can run a 5k on fresh legs. This session makes sure you never do. A short burnout before the run taxes the legs just enough to make the first kilometre feel like the third. Hit the burnout, then run your best 5k anyway. Sub 20:00 is the target, sub 18:00 is elite.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Cardio', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['500m Easy Jog', 'Rest 90s before starting'],
      },
      {
        name: 'Pre-Run Burnout',
        instructions:
          'Complete all movements as fast as possible with no rest between them. Move straight into the 5k the moment you finish. Do not let more than 20 seconds pass between the last rep and the start line.',
        movements: ['20 Burpees', '30 Air Squats', '20 Jump Lunges'],
      },
      {
        name: '5k Time Trial',
        instructions:
          'Run on a flat course or track. Record your total time. Do not go out too hot in the first kilometre, the burnout will catch up with you. Use these splits as a pacing guide.',
        movements: [
          '0-1km: Controlled, find your rhythm, resist the urge to sprint',
          '1-2km: Settle into race pace, this should feel sustainable',
          '2-3km: The middle kilometre is where most people drift, hold your pace',
          '3-4km: Start working, push slightly harder than comfortable',
          '4-5km: Everything you have left, empty the tank to the line (record total time)',
        ],
      },
      {
        name: 'Cooldown',
        mobilityFlow: 'p_05',
      },
    ],
    equipment: [],
  },
  {
    id: 'p_20',
    title: 'The Hybrid Finisher',
    description:
      'A combination of erg and bodyweight movements to finish the week.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'Chipper', 'For Time'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['500m Jog, 10 Burpees'],
      },
      {
        name: 'For Time',
        instructions:
          'Work through all the movements as quickly as possible with no rest between them. Push the pace on the 500m runs.',
        highlightInstructions: 'No rest between stations. Redlining expected.',
        movements: [
          '500m Row',
          '50 Wall Balls',
          '500m Ski',
          '50 Burpees',
          '500m Run',
        ],
      },
    ],
    equipment: ['rower', 'medicine ball', 'ski erg'],
  },
  {
    id: 'p_31',
    title: 'Full Hyrox Event',
    description:
      'A full Hyrox simulation. Long, demanding, and specific. Keep moving.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 85,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '5 mins easy jog',
              '10 wall balls, 10 burpees',
              '90s mimimum rest',
            ],
          },
          {
            name: 'For Time',
            instructions:
              'This is the full thing. Do not skip any stations. Keep moving. Rest only as needed to keep moving.',
            movements: [
              '1000m Run',
              '1000m SkiErg',
              '1000m Run',
              '50m Sled Push',
              '1000m Run',
              '50m Sled Pull',
              '1000m Run',
              '80m Burpee Broad Jumps',
              '1000m Run',
              '1000m Row',
              '1000m Run',
              '200m Farmers Carry',
              '1000m Run',
              '100m Sandbag Lunges',
              '1000m Run',
              '100 Wall Balls',
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
            highlightInstructions: 'Into:',
            movements: [
              '5 mins easy jog',
              '10 wall balls, 10 burpees',
              '90s mimimum rest',
            ],
          },
          {
            name: 'For Time',
            instructions:
              'This is the full thing. Do not skip any stations. Keep moving. Rest only as needed to keep moving.',
            highlightInstructions:
              'Run together, split the rest as you please one works the other rests. Aim for minimum/fast transitions',
            movements: [
              '1000m Run',
              '1000m SkiErg',
              '1000m Run',
              '50m Sled Push',
              '1000m Run',
              '50m Sled Pull',
              '1000m Run',
              '80m Burpee Broad Jumps',
              '1000m Run',
              '1000m Row',
              '1000m Run',
              '200m Farmers Carry',
              '1000m Run',
              '100m Sandbag Lunges',
              '1000m Run',
              '100 Wall Balls',
            ],
          },
        ],
      },
    ],
    equipment: [
      'dumbbell',
      'sandbag',
      'medicine ball',
      'rower',
      'ski erg',
      'sled',
    ],
  },
  {
    id: 'p_33',
    title: 'Elite Stations Repeat',
    description:
      'High output station repeats. Big breathing. Tight transitions.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Full Body', 'Intervals', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '10 wall balls, 250m row, 10 burpees',
            ],
          },
          {
            name: '4 Rounds',
            instructions:
              'This is a high volume session. Do not skip any stations. Keep moving. Rest only as needed to keep moving. it will be hard',
            highlightInstructions:
              'No prescribed rest between stations. Redlining expected.',
            movements: [
              '800m Run',
              '500m Row',
              '30 Wall Balls',
              '20 Burpee Broad Jumps',
              '100m Farmers Carry',
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
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '10 wall balls, 250m row, 10 burpees',
            ],
          },
          {
            name: '4 Rounds',
            instructions:
              'This is a high volume session. Do not skip any stations. Keep moving. Rest only as needed to keep moving. it will be hard',
            highlightInstructions:
              'Run together, split the rest as you please one works the other rests. Aim for minimum/fast transitions',
            movements: [
              '800m Run',
              '600m Row',
              '40 Wall Balls',
              '30 Burpee Broad Jumps',
              '200m Farmers Carry',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'p_34',
    title: 'Hyrox PFT (Pro Standard)',
    description:
      'A higher-standard Hyrox fitness test. Record finish time and station notes.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['200m run', '10 burpees, 10 air squats', '200m easy row'],
      },
      {
        name: 'For Time',
        instructions: 'Minimal transition time. Record total time.',
        movements: [
          '1000m Run',
          '30 Burpee Broad Jumps',
          '200m Sandbag Lunges',
          '1000m Row',
          '50 Wall Balls',
        ],
      },
    ],
    equipment: ['sandbag', 'medicine ball', 'rower'],
  },
  {
    id: 'p_35',
    title: 'Roxzone Killer',
    description:
      'Shorter runs, brutal transitions, dense stations. Designed to make you better at the messy middle.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Full Body', 'Intervals', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy jog', '10 wall balls, 10 burpees'],
          },
          {
            name: '8 Rounds',
            instructions:
              'This is a high volume session. Do not skip any stations. Keep moving. Rest only as needed to keep moving. it will be hard',
            highlightInstructions:
              'No prescribed rest between stations. Redlining expected.',
            movements: ['600m Run', '12 Wall Balls', '8 Burpees', '250m Row'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 mins easy jog', '10 wall balls, 10 burpees'],
          },
          {
            name: '8 Rounds',
            instructions:
              'This is a high volume session. Do not skip any stations. Keep moving. Rest only as needed to keep moving. it will be hard',
            highlightInstructions:
              'Run together, split the rest as you please one works the other rests. Aim for minimum/fast transitions',
            movements: ['600m Run', '24 Wall Balls', '16 Burpees', '500m Row'],
          },
        ],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'p_73',
    title: 'Hyrox Lite',
    description:
      'Hyrox-style session. Eight stations, one round each, for time. Functional movements, high volume, designed to replicate the feel of race-day conditioning. This is the longest lower body session of the programme - pace from station one.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['Full Body', 'For Time'],
    equipment: ['dumbbell', 'box', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Hyrox Lite: For Time',
        instructions:
          'Eight stations. Complete all reps in order. One pass. Time yourself - this is your benchmark. Every station feeds into the next. Pace from station one.',
        highlightInstructions: 'This is a long session. Pace from station one.',
        movements: [
          '50 Wall Balls',
          '30 Box Jumps/Step-ups',
          '60s DB Farmer Carry',
          '30 DB Romanian Deadlift',
          '40 Walking Lunges',
          '30 Ball Slams',
          '25 Squat Jumps',
          '20 Burpees',
        ],
      },
    ],
  },
  {
    id: 'f_55',
    title: 'Sandbag Lunge Repeatability',
    description:
      'Leg endurance with a Hyrox bias. Keep steps consistent and upright.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Lower Body', 'For Time', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins Easy Jog',
              '2 x 10 lunges (bodyweight)',
              '2 x 100m easy carry',
            ],
          },
          {
            name: '4 Sets for Time',
            instructions:
              'Keep steps consistent and upright. Rest as needed but keep the pace consistent and test breaks minimal.',
            highlightInstructions: '4 Sets for time',
            movements: ['800m Run', '200m Sandbag Lunges'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins Easy Jog',
              '2 x 10 lunges (bodyweight)',
              '2 x 100m easy carry',
            ],
          },
          {
            name: '4 Sets for Time',
            instructions:
              'Run together, split the carry work between the team in a tag team style approach. Walk with your partner whilst the work as active recovery and rest. Rest while your partner works. This should feel fast as a result.',
            highlightInstructions: '4 Sets for time.',
            movements: ['800m Run', '300m Sandbag Lunges'],
          },
        ],
      },
    ],
    equipment: ['sandbag'],
  },
  {
    id: 'p_32',
    title: 'Hyrox Heavy Sled Day',
    description:
      'Hyrox sled day. Heavy exposure with enough aerobic work to keep you honest.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Lower Body', 'For Time', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '2 x 20m light sled push, 2 x 20m light sled pull',
            ],
          },
          {
            name: 'Work',
            instructions:
              '6 Rounds for time of gruelling sled work and runs, aim to go for the official hyrox competition weight',
            movements: [
              '20m Sled Push (heavy)',
              '20m Sled Pull (heavy)',
              '600m Run (steady)',
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
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              '2 x 20m light sled push, 2 x 20m light sled pull',
            ],
          },
          {
            name: 'Work',
            instructions:
              '6 Rounds for time of gruelling sled work and runs, aim to go for the official hyrox competition weight',
            highlightInstructions:
              'Run together, split the sled work between 10m each in a tag team style approach. Rest while your partner works.',
            movements: [
              '40m Sled Push (heavy)',
              '40m Sled Pull (heavy)',
              '600m Run (steady)',
            ],
          },
        ],
      },
    ],
    equipment: ['sled'],
  },
];
