import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const wods: StandaloneWorkoutSource[] = [
  {
    id: 'f_04',
    title: 'The Century',
    description:
      'A benchmark test of mental grit. The goal is to finish 100 burpees as fast as possible.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Full Body', 'Chipper', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins joint Prep: Wrist circles, arm swings, 20 Jumping Jacks',
        ],
      },
      {
        name: 'Workout',
        instructions:
          'Go at 80% pace for the first 50, then accelerate. Target: Under 8 mins.',
        highlightInstructions: 'As fast as possible for time.',
        movements: ['100 Burpees for time'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_01',
    title: 'The Triple Stack',
    description:
      'Classic AMRAP. Aim for a consistent pace you can maintain for the full duration. Target 5+ rounds.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['Full Body', 'AMRAP', 'Partner'],
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
            name: '15 Min AMRAP',
            instructions:
              'As many rounds as possible in 15 mins. No scheduled rest; rest only as needed.',
            highlightInstructions: 'Rest only as needed.',
            movements: ['10 Burpees', '20 Air Squats', '30 Sit-ups'],
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
            name: '20 Min AMRAP',
            instructions:
              'Each partner completes half the reps then swaps. e.g. 5-5 burpees, 10-10 air squats etc. As many rounds as possible in 20 mins. No scheduled rest; rest only as needed.',
            highlightInstructions:
              'Each partner completes half the reps then swaps.',
            movements: ['10 Burpees', '20 Air Squats', '30 Sit-ups'],
          },
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_02',
    title: 'Death by 10 Metres',
    description:
      'An EMOM shuttle test with a twist. Each round you add a sprint, and a movement penalty. Starts easy, becomes a full-body lung burner fast.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Full Body', 'EMOM'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'Death by 10 Metres',
        instructions:
          'Start clock. Each minute, complete the required sprints PLUS the movement penalty for that round. Add one sprint every minute. Continue until you cannot complete the work within the minute.',
        highlightInstructions: 'Continue adding 1 sprint per minute',
        movements: [
          '00:00 - 01:00: 10m sprint then 5 Burpees',
          '01:00 - 02:00: 2 x 10m sprints then 10 Push-ups',
          '02:00 - 03:00: 3 x 10m sprints then 15 Air Squats',
          '03:00 - 04:00: 4 x 10m sprints then 5 Burpees',
          '04:00 - 05:00+: Continue adding 1 sprint per minute until failure',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_10',
    title: 'Hip Snap',
    description:
      'Posterior chain power, built one swing at a time. The reps climb every two minutes so there is no cruising. Flat back, aggressive hip snap, and let the bell float.',
    category: 'Conditioning',
    difficulty: 'Intermediate',
    estimatedTime: 10,
    tags: ['Full Body', 'EMOM'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Hip Hinges',
          '5 Pushups',
          '5 Romanian Deadlifts (light KB)',
          '5 KB Deadlifts (working weight)',
        ],
      },
      {
        name: 'EMOM 10',
        instructions:
          'Perform the reps at the start of every minute. Rest for the remainder. Reps climb every 2 minutes so pace yourself on the early rounds. If form breaks, drop the reps not the bell.',
        highlightInstructions: 'Drop the reps not the bell.',
        movements: [
          '0:00-02:00: 12KB Swings',
          '02:00-04:00: 15KB Swings',
          '04:00-06:00: 18KB Swings',
          '06:00-08:00: 21KB Swings',
          '08:00-10:00: 24KB Swings',
        ],
      },
      {
        name: 'Cooldown',
        mobilityFlow: 'r_06',
        mobilityFlowCopy: 'Hip Flow',
        highlightInstructions: 'Or:',
        movements: [
          "60s Child's Pose",
          '60s Glute Bridge Hold',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['kettlebell'],
  },
  {
    id: 'f_13',
    title: 'Four Minutes of Fury',
    description:
      '4 minutes. That is all. But if you are not redlining by round 4 you are not working hard enough. Tabata protocol: 20 seconds all-out, 10 seconds to survive. Eight rounds, alternating between two movements. No excuses.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 10,
    tags: ['Full Body', 'Tabata'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 High Knees',
          '5 Inchworms',
          '5 Explosive Jump Squats',
          '5 Burpees',
        ],
      },
      {
        name: 'Tabata',
        instructions:
          'Alternate between Jump Squats and Burpees each round. 20 seconds all-out, 10 seconds rest. Count your reps and try to hold consistent numbers across all 8 rounds.',
        highlightInstructions: '20s Work + 10s Rest Per round x 8 Rounds',
        movements: [
          'Round 1: Jump Squats',
          'Round 2: Burpees',
          'Round 3: Jump Squats',
          'Round 4: Burpees',
          'Round 5: Jump Squats',
          'Round 6: Burpees',
          'Round 7: Jump Squats',
          'Round 8: Burpees',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_15',
    title: 'The Endless Climb',
    description:
      'A ladder that never stops climbing. Every round adds 2 reps to both movements and the clock does not care. Pace yourself early or blow up before the halfway mark. Your score is the round you reach when time is called.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Full Body', 'AMRAP', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['2 Rounds: 5 Air Squats, 5 Burpees'],
          },
          {
            name: '10 Min AMRAP',
            instructions:
              'Start at 2 reps and add 2 each round. No scheduled rest, move at a pace you can sustain. When time is called, record the round you completed as your score.',
            highlightInstructions: 'Start at 2 reps and add 2 each round.',
            movements: [
              'Round 1: 2 Burpees, 2 Air Squats',
              'Round 2: 4 Burpees, 4 Air Squats',
              'Round 3: 6 Burpees, 6 Air Squats',
              'Round 4: 8 Burpees, 8 Air Squats',
              'Round 5: 10 Burpees, 10 Air Squats',
              'Continue adding 2 reps each round until time is called',
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
            movements: ['2 Rounds: 5 Air Squats, 5 Burpees'],
          },
          {
            name: '10 Min AMRAP',
            instructions:
              'Start at 2 reps and add 2 each round. Alternate the burpees and share the squats. No scheduled rest, move at a pace you can sustain. When time is called, record the round you completed as your score.',
            highlightInstructions: 'Alternate Burpees, share the squats.',
            movements: [
              'Round 1: 2 Burpees, 2 Air Squats',
              'Round 2: 4 Burpees, 4 Air Squats',
              'Round 3: 6 Burpees, 6 Air Squats',
              'Round 4: 8 Burpees, 8 Air Squats',
              'Round 5: 10 Burpees, 10 Air Squats',
              'Continue adding 2 reps each round until time is called',
            ],
          },
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_18',
    title: 'Ground & Pound',
    description:
      'Core tension, shoulder stability and leg power, all without touching a single piece of kit. Each minute has two movements that fight each other in the best way. Get through both and the rest of the minute is yours.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Full Body', 'EMOM'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['10 Push-ups'],
      },
      {
        name: 'EMOM 10',
        instructions:
          'Complete both movements at the start of each minute. Whatever time is left is your rest. Keep quality high throughout, this is not a race.',
        movements: [
          '00:00 - 01:00: 10 Push-ups, 10 Jump Squats',
          '01:00 - 02:00: 10 Push-ups, 10 Jump Squats',
          '02:00 - 03:00: 12 Push-ups, 12 Jump Squats',
          '03:00 - 04:00: 12 Push-ups, 12 Jump Squats',
          '04:00 - 05:00: 14 Push-ups, 14 Jump Squats',
          '05:00 - 06:00: 14 Push-ups, 14 Jump Squats',
          '06:00 - 07:00: 16 Push-ups, 16 Jump Squats',
          '07:00 - 08:00: 16 Push-ups, 16 Jump Squats',
          '08:00 - 09:00: 18 Push-ups, 18 Jump Squats',
          '09:00 - 10:00: 18 Push-ups, 18 Jump Squats',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_30',
    title: 'Cindy (Bodyweight AMRAP)',
    description:
      'The classic 20-minute bodyweight engine test. Smooth is fast. Keep sets crisp.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Full Body', 'AMRAP', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '6 mins easy cardio',
          '6–8 pull-ups (or ring rows), 8 push-ups, 10 air squats',
        ],
      },
      {
        name: '20 Min AMRAP',
        instructions: 'As many rounds as possible in 20 mins.',
        movements: ['5 Pull-ups', '10 Push-ups', '15 Air Squats'],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_31',
    title: 'Fran (Thrusters and Pull-ups)',
    description:
      'A fast, brutal classic. Sprint the barbell, survive the pull-ups.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['10 Thrusters (empty bar)', '6 Pull-ups (or ring rows)'],
      },
      {
        name: '21-15-9 For Time',
        instructions:
          'Work through 21 of each movement then drop to 15 then 9 until completion.',
        highlightInstructions:
          'Scale load to keep the thrusters unbroken or 2 sets max.',
        movements: ['Thrusters', 'Pull-ups'],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'f_32',
    title: 'Helen (Run, KB, Pull-ups)',
    description:
      'Short rounds, high output. The run is your limiter. The swings are your tax.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '400m Easy Run',
          '10 KB swings (light)',
          '5 pull-ups (or ring rows)',
        ],
      },
      {
        name: '3 Rounds For Time',
        instructions:
          '3 Rounds for time, as fast as possible with minimal break, no scheduled rest.',
        highlightInstructions:
          'Scale the swing weight so every rep is powerful and unbroken.',
        movements: ['400m Run', '21 KB Swings', '12 Pull-ups'],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'f_33',
    title: 'Annie (Skipping and Sitting)',
    description:
      'A pure midline and engine burner. Keep the jump rope relaxed and efficient.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Core', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['3 mins easy skipping', '15 sit-ups', '30 single-unders'],
      },
      {
        name: 'For Time',
        instructions: '50-40-30-20-10. Double-unders and sit-ups.',
        highlightInstructions: 'rest as needed.',
        movements: ['Double-Unders', 'Sit-ups'],
      },
    ],
    equipment: ['skipping rope'],
  },
  {
    id: 'f_34',
    title: "Grace (C&J's)",
    description:
      'Power, speed, and composure under fatigue. Every rep should be snappy.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 10,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy row / cardio of choice',
              'Build to C&J working weight in singles',
            ],
          },
          {
            name: 'For Time',
            instructions:
              '30 clean & jerks (61/43kg). Scale so you can cycle fast singles or small sets.',
            highlightInstructions:
              'This is a fast workout, so cycles should be snappy.',
            movements: ['30 Clean & Jerks'],
          },
        ],
      },
      {
        scale: 'RX+',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy row / cardio of choice',
              'Build to C&J working weight in singles',
            ],
          },
          {
            name: 'For Time',
            instructions:
              '30 clean & jerks (80/52.5kg suggested). Scale so you can cycle fast singles or small sets.',
            highlightInstructions:
              'This is a heavy version of a fast workout, so dont blow out.',
            movements: ['30 Clean & Jerks'],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_35',
    title: 'Karen (Wall Balls)',
    description:
      'Simple on paper. Mentally battle in reality. Small sets from the start.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['10 Air squats', '10 Burpees'],
      },
      {
        name: 'For Time',
        instructions:
          '150 wall balls. As fast as you can. The target is consistent set size and short rests.',
        highlightInstructions: 'Target: consistent set size and short rests.',
        movements: ['150 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_36',
    title: 'Jackie (Row, Thrusters, Pull-ups)',
    description:
      'Engine into grip and shoulders. Keep the row controlled and the thrusters smooth.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m easy row',
          '2 x 10 thrusters (empty bar)',
          '2 x 5 pull-ups (or ring rows)',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '1000m row, then 50 thrusters (20/15kg), then 30 pull-ups.',
        highlightInstructions:
          'Scale the thrusters to keep them unbroken or 2 sets max.',
        movements: ['1000m Row', '50 Thrusters', '30 Pull-ups'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar'],
  },
  {
    id: 'f_37',
    title: 'Nancy (run, OH squats)',
    description:
      'Legs and lungs. The overhead squat demands patience and positioning.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['800m Easy Run', '2 x 8 overhead squats (PVC/empty bar)'],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          '15 OHS at 43/30kg suggested. 5 rounds for time, as fast as possible with minimal break, no scheduled rest.',
        highlightInstructions:
          'Scale the overhead squat to stay unbroken or 2 sets.',
        movements: ['400m Run', '15 Overhead Squats'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_38',
    title: 'Diane (Deadlift, HSPU)',
    description:
      'Heavy hinge plus inverted pressing. Keep your back safe and your sets smart.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['Build to deadlift weight in singles'],
          },
          {
            name: '21-15-9 For Time',
            instructions:
              'Deadlift 102/70kg suggested. Scale both movements to keep form.',
            movements: ['Deadlifts', 'Handstand Push-ups'],
          },
        ],
      },
      {
        scale: 'No Gymnastics',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['Build to deadlift weight in singles'],
          },
          {
            name: '21-15-9 For Time',
            instructions:
              'Deadlift 102/70kg suggested. Scale both movements to keep form.',
            movements: ['Deadlifts', 'Push-ups'],
          },
        ],
      },
      {
        scale: 'Scaled',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: ['Build to deadlift weight in singles'],
          },
          {
            name: '21-15-9 For Time',
            instructions:
              'Deadlift 60/40kg suggested. Scale both movements to keep form.',
            movements: ['Deadlifts', 'Push-ups'],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_39',
    title: 'Isabel (Snatch)',
    description:
      'Speed under a bar. Your best score is the fastest safe cycling you can manage.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 10,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['Build to snatch WORKING weight in singles'],
      },
      {
        name: 'For Time',
        instructions:
          '30 snatches (61/43kg suggested). Scale to fast singles. The target is consistent set size and short rests.',
        highlightInstructions: 'Target: consistent set size and short rests.',
        movements: ['30 Snatches'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_40',
    title: 'Elizabeth (Row, Clean, Dip)',
    description:
      'Fast rounds. Clean technique, stable shoulders, and short rests.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['Build to clean weight in singles'],
      },
      {
        name: '21-15-9 For Time',
        instructions:
          'Cleans at 61/43kg suggested. Scale dips to maintain quality reps. 21-15-9 for time, as fast as possible with minimal break, no scheduled rest.',
        highlightInstructions: 'Consistent set size and short rests.',
        movements: ['Squat Cleans', 'Ring Dips'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar', 'box'],
  },
  {
    id: 'f_41',
    title: 'Angie (Pull-ups, Push-ups, Sit-ups, Squats)',
    description:
      'A simple bodyweight chipper. Stay disciplined with sets so you don’t crater.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '3 mins easy cardio',
          '5 pull-ups',
          '10 push-ups',
          '10 sit-ups',
          '10 squats',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '100 pull-ups, 100 push-ups, 100 sit-ups, 100 air squats. 5 Rounds for time, as fast as possible with minimal break, no scheduled rest.',
        highlightInstructions: 'Consistent set size and short rests.',
        movements: [
          '100 Pull-ups',
          '100 Push-ups',
          '100 Sit-ups',
          '100 Air Squats',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_42',
    title: 'Barbara (Sit-ups, Push-ups, Pull-ups, Squats)',
    description:
      'High output rounds with enforced rest. Sprint the work, then recover with intent.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Full Body', 'Intervals', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['10 sit-ups', '8 push-ups', '6 pull-ups', '10 squats'],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          '5 rounds for time, as fast as possible with minimal break, no scheduled rest. Complete each round for time. Rest exactly 3 mins between rounds.',
        highlightInstructions: 'Rest exactly 3 mins between rounds.',
        movements: [
          '20 Pull-ups',
          '30 Push-ups',
          '40 Sit-ups',
          '50 Air Squats',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_43',
    title: 'Chelsea (Pull-ups, Push-ups, Squats)',
    description:
      'A 30-minute EMOM. Keep moving, never sprint the early minutes.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Full Body', 'EMOM', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins easy cardio',
          '5 pull-ups',
          '10 push-ups',
          '15 squats',
        ],
      },
      {
        name: 'EMOM 30',
        instructions:
          'Every minute for 30 mins: 5 pull-ups, 10 push-ups, 15 squats. EMOM 30, as fast as possible with minimal break, no scheduled rest, rest in remaining time of the minute (if any).',
        highlightInstructions: 'Rest in remaining time of the minute (if any).',
        movements: ['5 Pull-ups', '10 Push-ups', '15 Air Squats'],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_44',
    title: 'Fight Gone Bad (Classic)',
    description:
      'A points-style benchmark. Output matters, but transitions matter more.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Full Body', 'Intervals', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '800m easy row',
          '10 wall balls, 8 push press, 10 box step-ups',
        ],
      },
      {
        name: '3 Rounds',
        instructions:
          '1 min each station, then move to the next station. 3 rounds for time, as fast as possible with no scheduled rest.',
        highlightInstructions: 'total reps + calories row = score',
        movements: [
          'Wall Balls',
          'Sumo Deadlift High Pull',
          'Box Jumps',
          'Push Press',
          'Calories Row',
        ],
      },
    ],
    equipment: ['barbell', 'medicine ball', 'box', 'rower'],
  },
  {
    id: 'f_45',
    title: 'The Chief (Power Cleans + Bodyweight Movements)',
    description:
      'Short windows, high pace. The only goal is consistent output across sets.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Full Body', 'AMRAP', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '500m row',
          'Build: light power cleans + push press + front squats',
        ],
      },
      {
        name: '5 rounds of 3 minute AMRAPs',
        instructions:
          '5 rounds of a 3 minute AMRAP, rest 1 minute between rounds. Score = total rounds across all cycles.',
        highlightInstructions:
          'Rest 1 minute between rounds. Score = total rounds.',
        movements: ['3 Power Cleans', '6 Push-ups', '9 Air Squats'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'f_46',
    title: 'DT (Deadlifts + Olympic lifts)',
    description:
      'Grip and barbell cycling. Break early to keep the bar moving.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Full Body', 'For Time', 'Benchmark', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              'Build to barbell weight in singles',
            ],
          },
          {
            name: '5 Rounds For Time',
            highlightInstructions: '(70m/47.5f)kg',
            instructions:
              '5 Rounds for time, as fast as possible with minimal break, no scheduled rest.',
            movements: ['12 Deadlifts', '9 Hang Power Cleans', '6 Push Jerks'],
          },
        ],
      },
      {
        scale: 'Scaled',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins easy cardio',
              'Build to barbell weight in singles',
            ],
          },
          {
            name: '5 Rounds For Time',
            instructions:
              '5 Rounds for time, as fast as possible with minimal break, no scheduled rest.',
            highlightInstructions: '(50m/35f)kg',
            movements: ['8 Deadlifts', '6 Hang Power Cleans', '3 Push Jerks'],
          },
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_47',
    title: 'Kelly (Run, Box Jumps, Wall balls)',
    description:
      'Longer benchmark with consistent rounds. Smooth transitions win.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '400m easy run',
          '2 rounds: 10 wall balls, 10 box step-ups',
        ],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          '5 Rounds for time, as fast as possible with minimal break, no scheduled rest. 400m run, 30 box jumps, 30 wall balls.',
        highlightInstructions: 'Consistent set size and short rests.',
        movements: ['400m Run', '30 Box Jumps', '30 Wall Balls'],
      },
    ],
    equipment: ['box', 'medicine ball'],
  },
  {
    id: 'f_48',
    title: 'Lynne (Bench press, Pull-ups)',
    description:
      'Max reps under fatigue. Keep strict form, track total reps honestly.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Upper Body', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '500m row/cardio of choice',
          '10 light bench press',
          '6 easy pull-ups (or ring rows)',
        ],
      },
      {
        name: '5 Rounds (Not For Time)',
        instructions:
          '5 Rounds for time, as fast as possible with minimal break, no scheduled rest. Bench press bodyweight (or challenging load) max reps, then pull-ups max reps. Rest as needed.',
        highlightInstructions: 'Consistent set size and short rests.',
        movements: ['10 Bench Press (max reps)', '6 Pull-ups (max reps)'],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'f_49',
    title: 'Kalsu - Thruster Burpees',
    description:
      'A brutal thruster benchmark. Every minute you pay the burpee tax.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '500m row/cardio of choice',
          '8 thrusters (empty bar)',
          '5 burpees',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '5 Rounds for time, as fast as possible with minimal break, no scheduled rest. 100 thrusters. At the start of every minute: 5 burpees. Then continue thrusters with remaining time.',
        highlightInstructions: 'Consistent set size and short rests.',
        movements: ['100 Thrusters', 'Burpees (5 every minute)'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_03',
    title: 'Metabolic Stress: Row/Thruster',
    description:
      "A 'couplet' designed to maximise lactate production. This will burn.",
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Full Body', 'For Time'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio', '15 Thrusters (Empty Bar)'],
      },
      {
        name: '21-15-9',
        instructions:
          'Go unbroken on the thrusters if possible. Sprint the 9 cal row.',
        movements: ['Calories Row', 'Thrusters (43m/30f)kg'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'p_07',
    title: 'Murph',
    description:
      'The gold standard of endurance. No partitioning means finishing all reps of one movement before the next.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Full Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            movements: ['800m Jog, 20 Air Squats, 10 Pushups'],
          },
          {
            name: 'For Time',
            instructions:
              'Complete in order: 1 Mile Run, then all Pullups, then all Pushups, then all Squats, then 1 Mile Run.',
            highlightInstructions: '20lb Vest',
            movements: [
              '1 Mile Run',
              '100 Pullups',
              '200 Pushups',
              '300 Air Squats',
              '1 Mile Run',
            ],
          },
        ],
      },
      {
        scale: '5 Round',
        blocks: [
          {
            name: 'Warmup',
            movements: ['800m Jog, 20 Air Squats, 10 Pushups'],
          },
          {
            name: 'Buy In',
            instructions: '1 mile run as your buy in',
            movements: ['1 Mile Run'],
          },
          {
            name: '5 rounds',
            instructions: '5 rounds of the following.',
            highlightInstructions: 'Rest as needed.',
            movements: ['20 Pullups', '40 Pushups', '60 Air Squats'],
          },
          {
            name: 'Cash-out',
            instructions: '1 mile run to finish',
            movements: ['1 Mile Run'],
          },
        ],
      },
      {
        scale: '10 Round',
        blocks: [
          {
            name: 'Warmup',
            movements: ['800m Jog, 20 Air Squats, 10 Pushups'],
          },
          {
            name: 'Buy In',
            instructions: '1 mile run as your buy in',
            movements: ['1 Mile Run'],
          },
          {
            name: '10 rounds',
            instructions: '10 rounds of the following.',
            highlightInstructions: 'Rest as needed.',
            movements: ['10 Pullups', '20 Pushups', '30 Air Squats'],
          },
          {
            name: 'Cash-out',
            instructions: '1 mile run to finish',
            movements: ['1 Mile Run'],
          },
        ],
      },
      {
        scale: '20 Round',
        blocks: [
          {
            name: 'Warmup',
            movements: ['800m Jog, 20 Air Squats, 10 Pushups'],
          },
          {
            name: 'Buy In',
            instructions: '1 mile run as your buy in',
            movements: ['1 Mile Run'],
          },
          {
            name: '20 rounds',
            instructions: '20 rounds of the following.',
            highlightInstructions: 'Rest as needed.',
            movements: ['5 Pullups', '10 Pushups', '15 Air Squats'],
          },
          {
            name: 'Cash-out',
            instructions: '1 mile run to finish',
            movements: ['1 Mile Run'],
          },
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'p_14',
    title: 'The 100 Club',
    description:
      'High-volume plyometrics and metabolic demand. Stay efficient on the box step-down.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Full Body', 'For Time', 'Partner'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            movements: ['20 Step-ups, 10 Burpees'],
          },
          {
            name: 'WOD',
            instructions:
              '4 rounds totalling 100 reps of each movement with a descending rep scheme. Rest only as needed to keep moving.',
            highlightInstructions: 'Rep Range: 40, 30, 20, 10',
            movements: ['Burpee Box Jumps', 'Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            movements: ['20 Step-ups, 10 Burpees'],
          },
          {
            name: 'WOD',
            instructions:
              '4 rounds totalling 100 reps of each movement with a descending rep scheme. Split between the team in a tag team style approach. Rest while your partner works. This should feel fast.',
            highlightInstructions: 'Rep Range: 40, 30, 20, 10',
            movements: ['Burpee Box Jumps', 'Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['box', 'medicine ball'],
  },
  {
    id: 'p_18',
    title: 'Press From Hell',
    description:
      'A descending ladder that gets kinder with every round, but your lungs will not notice. Devil press and box step ups paired together from 10 down to 1. The reps shrink, the suffering does not. Use the swing of the dumbbells to drive the press overhead and do not fight the movement.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Full Body', 'For Time', 'Ladder'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 Rounds: 10 DB Snatches, 5 Burpees',
          '10 Box Step Ups at easy pace',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'For Time: Descending Ladder',
        instructions:
          'Complete all devil press reps then all box step up reps before moving to the next round. No scheduled rest. Record your total time. Swing the dumbbells, do not muscle press them.',
        highlightInstructions:
          'Record your total time. Try to reduce rest to a minimum.',
        movements: [
          'Round 1: 10 Devil Press, 20 Box Step Ups',
          'Round 2: 9 Devil Press, 18 Box Step Ups',
          'Round 3: 8 Devil Press, 16 Box Step Ups',
          'Round 4: 7 Devil Press, 14 Box Step Ups',
          'Round 5: 6 Devil Press, 12 Box Step Ups',
          'Round 6: 5 Devil Press, 10 Box Step Ups',
          'Round 7: 4 Devil Press, 8 Box Step Ups',
          'Round 8: 3 Devil Press, 6 Box Step Ups',
          'Round 9: 2 Devil Press, 4 Box Step Ups',
          'Round 10: 1 Devil Press, 2 Box Step Ups',
        ],
      },
    ],
    equipment: ['dumbbell', 'box'],
  },
  {
    id: 'p_26',
    title: 'Eva',
    description:
      'A high-volume benchmark. Long rounds, constant grip demand, and a steady run pace.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Full Body', 'For Time', 'Benchmark'],
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
              '2 mins easy run',
              '2 rounds: 10 KB swings (light), 6 pull-ups (easy)',
            ],
          },
          {
            name: '5 Rounds For Time',
            instructions: 'Keep the run smooth and the swings powerful.',
            highlightInstructions: 'Break pull-ups before you fail reps.',
            movements: ['800m Run', '30 KB Swings', '30 Pull-ups'],
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
              '2 mins easy run',
              '2 rounds: 10 KB swings (light), 6 pull-ups (easy)',
            ],
          },
          {
            name: '5 Rounds For Time',
            instructions: 'Keep the run smooth and the swings powerful.',
            highlightInstructions:
              'Share the run, split the KB swings, Synchro pull-ups.',
            movements: ['800m Run', '30 KB Swings', '20 Pull-ups'],
          },
        ],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'p_27',
    title: 'King Kong',
    description:
      'A heavy classic. Only for athletes with solid technique and strict standards.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins cardio',
              'Build to moderate heavy deadlift + squat clean',
            ],
          },
          {
            name: '3 Rounds For Time',
            instructions: 'Scale loads to keep reps safe and clean.',
            movements: [
              '1 Deadlift (heavy)',
              '2 Muscle-ups',
              '3 Squat Cleans (heavy)',
              '4 Handstand Push-ups',
            ],
          },
        ],
      },
      {
        scale: 'No Gymnastics',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '2 mins cardio',
              'Build to moderate heavy deadlift + squat clean',
            ],
          },
          {
            name: '3 Rounds For Time',
            instructions: 'Scale loads to keep reps safe and clean.',
            movements: [
              '1 Deadlift (heavy)',
              '2 Muscle-ups',
              '3 Squat Cleans (heavy)',
              '4 Push-ups',
            ],
          },
        ],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'p_28',
    title: 'Nate (Muscle-ups + HSPU + KB)',
    description:
      'A 20-minute AMRAP that rewards efficient gymnastics and a strong hinge.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Gymnastics', 'AMRAP', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '8 mins easy cardio',
          'Skill: 5 mins muscle-up practice (or strict pull-up + dip)',
        ],
      },
      {
        name: '20 Min AMRAP',
        instructions: 'Score = rounds + reps. Stay efficient on transitions.',
        movements: ['2 Muscle-ups', '4 Handstand Push-ups', '8 KB Swings'],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'p_29',
    title: 'Randy (Power Snatch)',
    description:
      'A fast barbell benchmark. Crisp reps only. Grip and lungs will be tested.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Upper Body', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        movements: ['2 mins easy cardio', 'Build: power snatch working weight'],
      },
      {
        name: 'For Time',
        instructions:
          '75 power snatches (34/25kg suggested). Scale to safe cycling.',
        movements: ['75 Power Snatches'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_30',
    title: 'Amanda (Muscle-ups + Snatch)',
    description:
      'A sharp classic: high-skill and fast reps. Scale to maintain standards.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Gymnastics', 'For Time', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins easy cardio',
          'Build: snatch working weight',
          'Skill: muscle-up practice (or strict pull-up + dip)',
        ],
      },
      {
        name: '9-7-5 For Time',
        instructions:
          'Muscle-ups + snatches (heavy). Scale both to keep reps safe.',
        highlightInstructions:
          '9 reps each the first round, 7 reps each the second round...',
        movements: ['Muscle-ups', 'Snatches'],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'f_72',
    title: 'The Fixus Games 1',
    description:
      'A long chipper from CrossFit Fixus in Middleton. Four 1km runs broken up by wall balls, kettlebell swings, box step overs and dumbbell thrusters. Partner or individual — 40 minute cap.',
    category: 'WOD',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 40,
    tags: ['Full Body', 'For Time', 'Chipper', 'Partner'],
    isPremium: false,
    partner: true,
    collab: {
      image: require('@/assets/images/collabs/crossfit_fIxus.jpg'),
      name: 'CrossFit Fixus',
      description:
        'At CrossFit Fixus, we believe fitness should be both challenging and enjoyable. Our community-driven workouts make hard work feel like play, helping you build strength, confidence, and lasting friendships.',
      link: 'https://www.crossfit-fixus.com/',
      linkCopy: 'Visit the CrossFit Fixus website',
      bgColor: '#1E1E1E',
      inColabWithColor: '#1b8890',
      nameColor: '#F29300',
      descriptionColor: '#FFFFFF',
      linkAndBorderColor: '#F29300',
    },
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '400m easy jog',
              '2 rounds: 5 wall balls, 5 kettlebell swings, 5 box step overs, 5 dumbbell thrusters',
            ],
          },
          {
            name: 'For Time (40:00 Cap)',
            instructions:
              'Partner or individual. Work straight through the chipper. Pace the runs so you can still attack the stations. Score is total time, or reps completed if you hit the 40 minute cap.',
            highlightInstructions: 'Partner or individual. 40 minute cap.',
            movements: [
              '1km Run',
              '50 Wall Balls',
              '1km Run',
              '50 Kettlebell Swings (24/16kg)',
              '1km Run',
              '50 Box Step Overs (24"/20")',
              '1km Run',
              '50 Dumbbell Thrusters (2×15/10kg)',
            ],
          },
        ],
      },
      {
        scale: 'Scaled',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '400m easy jog or 500m easy bike',
              '2 rounds: 8 wall balls, 8 kettlebell swings, 6 box step overs, 6 dumbbell thrusters',
            ],
          },
          {
            name: 'For Time (40:00 Cap)',
            instructions:
              'Partner or individual. Swap each 1km run for 1000m bike or 500m run, drop every station to 30 reps, and reduce the loads. Score is total time, or reps completed if you hit the 40 minute cap.',
            highlightInstructions:
              '1000m bike or 500m run. 30 reps. Reduce weight.',
            movements: [
              '1000m Bike or 500m Run',
              '30 Wall Balls',
              '1000m Bike or 500m Run',
              '30 Kettlebell Swings (reduce weight)',
              '1000m Bike or 500m Run',
              '30 Box Step Overs',
              '1000m Bike or 500m Run',
              '30 Dumbbell Thrusters (reduce weight)',
            ],
          },
        ],
      },
    ],
    equipment: ['medicine ball', 'kettlebell', 'box', 'dumbbell', 'bike'],
  },
];
