import type { SingleWorkout } from '@/src/types/workouts';

export type {
  DetailedMovement,
  SingleWorkout,
  WorkoutCategory,
} from '@/src/types/workouts';

const freeWorkouts: SingleWorkout[] = [
  {
    id: 'f_01',
    title: 'The 15-Min Engine',
    description:
      'Classic AMRAP. Aim for a consistent pace you can maintain for the full duration. Target 5+ rounds.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['AMRAP', 'No Equipment'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 200m Jog, 10 Air Squats, 10 Scapular Pushups'],
      },
      {
        name: '15 Min AMRAP',
        instructions:
          'As many rounds as possible in 15 mins. No scheduled rest; rest only as needed.',
        movements: ['10 Burpees', '20 Air Squats', '30 Sit-ups'],
      },
    ],
  },
  {
    id: 'f_02',
    title: 'Death by 10 Meters',
    description:
      'An EMOM (Every Minute on the Minute) shuttle test. This starts easy but becomes maximal effort quickly.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Sprint', 'Lungs'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['3 Rounds: 30s High Knees, 30s Butt Kicks, 5 Inchworms'],
      },
      {
        name: 'EMOM',
        instructions:
          'Start clock. Min 1: 1 x 10m sprint. Min 2: 2 x 10m sprints. Continue until you cannot complete the required sprints within the minute.',
        movements: ['10m Shuttles'],
      },
    ],
  },
  {
    id: 'f_03',
    title: 'Core Tempering',
    description:
      "Focus on 'bracing' your midsection. Movement should be slow and controlled.",
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Core', 'Abs'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['2 Rounds: 10 Cat-Cow, 10 Bird-Dogs'] },
      {
        name: '3 Rounds',
        instructions:
          'Rest 60s between rounds. Focus on keeping lower back glued to the floor during Hollow Rocks.',
        movements: ['45s Plank', '15 Hollow Rocks', '30s Side Plank (L/R)'],
      },
    ],
  },
  {
    id: 'f_04',
    title: 'The Century',
    description:
      'A benchmark test of mental grit. The goal is to finish 100 burpees as fast as possible.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['Chipper', 'Full Body'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins joint Prep: Wrist circles, arm swings, 20 Jumping Jacks',
        ],
      },
      {
        name: 'For Time',
        instructions:
          'Go at 80% pace for the first 50, then accelerate. Target: Under 8 mins.',
        movements: ['100 Burpees for time'],
      },
    ],
  },
  {
    id: 'f_05',
    title: 'Leg Day Primer',
    description:
      'High volume bodyweight leg pump. Keep rest minimal to maximize metabolic stress.',
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
          '20 Lunges',
          '20 Glute Bridges',
          '20 Sumo Squats',
          '1 min Wall Sit',
        ],
      },
    ],
  },
  {
    id: 'f_06',
    title: 'Upper Body Blitz',
    description:
      'Hypertrophy focus. Control the eccentric (lowering) phase for 2 seconds on every rep.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Upper Body', 'Pump'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 10 Pushups, 10 Prone Y-Raises, 10 Arm Circles'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds to allow for maximum effort on the next set.',
        movements: [
          'Max Pushups',
          '15 Inverted Rows (or Towel Rows)',
          '12 Dips (on chair/bench)',
        ],
      },
    ],
  },
  {
    id: 'f_07',
    title: 'The 500m Row Test',
    description:
      "Pure anaerobic power. This should be a 'sprint' where you finish completely breathless.",
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 12,
    tags: ['Benchmark', 'Row'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['500m Easy Row, then 3 x 10 stroke power bursts'],
      },
      {
        name: 'Max Effort',
        instructions:
          'Secure feet tightly. Start with short, quick strokes to get the flywheel moving.',
        movements: ['500m Row Sprint'],
      },
    ],
  },
  {
    id: 'f_08',
    title: 'Desk Job Recovery',
    description:
      'The antidote to sitting. Focus on breathing deeply into each stretch.',
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Recovery', 'Postures'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 mins light walking or jogging to warm the tissues'],
      },
      {
        name: 'Flow',
        instructions:
          "Hold each pose for the specified time. Don't force the range; let gravity do the work.",
        movements: [
          'Couch Stretch (2m/side)',
          'Pigeon Pose (2m/side)',
          'Thoracic Extensions (15 reps)',
        ],
      },
    ],
  },
  {
    id: 'f_09',
    title: 'Standard PFT',
    description:
      'The official Hyrox Physical Fitness Test. Use this to gauge your current level.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Hyrox', 'Test'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['800m Run, 10 Burpees, 10 Air Squats'] },
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
    id: 'f_10',
    title: 'Kettlebell Swing Ladder',
    description:
      'Building posterior chain power. Maintain a flat back and snap the hips aggressively.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['KB', 'Power'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['20 Hip Hinges, 10 Yoga Pushups'] },
      {
        name: 'EMOM 10',
        instructions:
          'Perform the reps at the start of every minute. Rest for the remainder of that minute.',
        movements: ['15-20 KB Swings'],
      },
    ],
  },
  {
    id: 'f_11',
    title: 'Sprint Intervals',
    description:
      'Developing top-end speed and aerobic recovery. Each 400m should be at 90-95% effort.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Running', 'Speed'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['1km Jog, Leg Swings, 2 x 50m Strides'] },
      {
        name: '5 Sets',
        instructions:
          'Rest 90s between sets. Focus on staying relaxed in the face and shoulders while sprinting.',
        movements: ['400m Run (All out)'],
      },
    ],
  },
  {
    id: 'f_12',
    title: 'Pushup Pyramid',
    description:
      'Volume-based conditioning for the upper body. Form over speed.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Chest', 'Bodyweight'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 10 Shoulder Taps, 10 Scapular Pushups'],
      },
      {
        name: '1 to 10 to 1',
        instructions:
          'Rest is equal to the time it took to do the reps. (e.g., 5 pushups, rest ~5-10s).',
        movements: ['1-2-3-4-5-6-7-8-9-10-9-8-7-6-5-4-3-2-1 Pushups'],
      },
    ],
  },
  {
    id: 'f_13',
    title: 'The 4-Min Tabata',
    description:
      'High intensity, short duration. Maximum intensity is required to see benefits.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 10,
    tags: ['Tabata', 'Quick'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['2 mins Jumping Jacks, 10 Air Squats'] },
      {
        name: '20s Work / 10s Rest',
        instructions:
          '8 Rounds of 20 seconds of work followed by 10 seconds of rest.',
        movements: ['Thrusters (or Jump Squats)'],
      },
    ],
  },
  {
    id: 'f_14',
    title: 'Handstand Prep',
    description:
      'Shoulder stability and technical positioning. Stop immediately if form breaks down.',
    category: 'Mobility',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Shoulders', 'Skill'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['3 Rounds: 10 Wrist Stretches, 10 Wall Slides'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds. Quality is the goal here, not fatigue.',
        movements: [
          '30s Wall Walk/Hold',
          '10 Scapular Pushups',
          '20 Shoulder Taps',
        ],
      },
    ],
  },
  {
    id: 'f_15',
    title: 'Burpee/Squat Ascending',
    description:
      'A ladder format that challenges your pacing and leg endurance.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Legs', 'Lungs'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['2 Rounds: 10 Air Squats, 5 Burpees'] },
      {
        name: '10 min AMRAP',
        instructions:
          'Round 1: 2 Reps each. Round 2: 4 Reps. Round 3: 6 Reps... continue until time is up.',
        movements: ['2 Burpees, 2 Squats (+2 reps every round)'],
      },
    ],
  },
  {
    id: 'f_16',
    title: 'Shoulder Health Flow',
    description:
      'Prehab for athletes with stiff shoulders. Use a light resistance band.',
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['Shoulders', 'Prehab'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['2 mins Arm Swings and Thoracic Twists'] },
      {
        name: 'Flow',
        instructions:
          "Move through the reps slowly. Focus on 'feeling' the scapula move on the ribcage.",
        movements: [
          'Band Dislocates (20)',
          'Face Pulls (20)',
          'Wall Slides (15)',
        ],
      },
    ],
  },
  {
    id: 'f_17',
    title: 'Jump Rope Skill',
    description:
      'Cardiovascular health and foot speed. Focus on staying light on the balls of your feet.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Cardio', 'Jump Rope'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['Ankle circles, 50 Calf Raises'] },
      {
        name: '5 Rounds',
        instructions:
          'Rest 1 min between rounds. If you trip, just reset and keep going.',
        movements: ['2 mins Steady Jump Rope', '1 min Rest'],
      },
    ],
  },
  {
    id: 'f_18',
    title: 'The Bear Crawl',
    description:
      'Building core tension and shoulder stability through crawling patterns.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Full Body', 'Animal Flow'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['Wrist prep, 10 Cat-Cow, 10 Bird-Dog'] },
      {
        name: 'EMOM 10',
        instructions:
          'Execute both movements within the minute. Rest for the remainder.',
        movements: ['20m Bear Crawl', '10 Air Squats'],
      },
    ],
  },
  {
    id: 'f_19',
    title: 'Grip Strength 101',
    description:
      "Building the foundations for pullups and heavy deadlifts. Don't use straps.",
    category: 'Strength',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Grip', 'Arms'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['Wrist circles, 20 Hand Clenches'] },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds. The goal is to reach near-failure on the hang.',
        movements: ['Max Hang from Pull-up Bar', '40m Farmers Walk (Heavy)'],
      },
    ],
  },
  {
    id: 'f_20',
    title: 'The 1km Row Benchmark',
    description:
      'A middle-distance engine test. Aim for a sub 4:00 time (Intermediate).',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 15,
    tags: ['Row', 'Benchmark'],
    isPremium: false,
    blocks: [
      { name: 'Warmup', movements: ['500m Easy Row + 5 High Power strokes'] },
      {
        name: 'Max Effort',
        instructions:
          "Try to maintain a consistent '500m split' for the entire distance.",
        movements: ['1000m Row'],
      },
    ],
  },

  // ── NEW FREE GYM SESSIONS ──────────────────────────────

  {
    id: 'f_21',
    title: 'Chest & Triceps',
    description:
      'A classic push session built around the bench press. Control the descent on every rep — the lowering phase is where the chest work really happens.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Chest', 'Triceps', 'Gym'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '10 arm circles forward / 10 arm circles backward',
          '10 scapular push-ups',
          '1 light set of 15 push-ups focusing on shoulder stability',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 90–120s between sets. Focus on a 2-second controlled descent on all pressing movements.',
        movements: [
          {
            name: 'Barbell or Dumbbell Bench Press',
            value: '4 x 10',
            note: 'Touch chest lightly on each rep. Do not bounce.',
          },
          {
            name: 'Incline Dumbbell Press',
            value: '3 x 12',
            note: '30–45° incline. Feel the stretch at the bottom.',
          },
          {
            name: 'Dumbbell or Cable Flyes',
            value: '3 x 15',
            note: 'Keep a slight bend in the elbow throughout. Squeeze at the top.',
          },
        ],
      },
      {
        name: 'Tricep Finisher',
        instructions:
          'Rest 60s between sets. Keep elbows pinned — only forearms should move.',
        movements: [
          {
            name: 'Dips (Bench or Bar)',
            value: '3 x 12',
            note: 'Stay upright to keep the load on the triceps.',
          },
          {
            name: 'Overhead Tricep Extension (DB or Cable)',
            value: '3 x 12',
            note: 'Full stretch at the bottom — do not rush.',
          },
        ],
      },
      {
        name: 'Shoulder Health',
        instructions:
          'Light weight only. This is prehab, not a strength exercise.',
        movements: [
          {
            name: 'Reverse Flyes or Band Pull-Aparts',
            value: '3 x 15',
            note: 'Counterbalances the pressing work. Lead with the elbows.',
          },
        ],
      },
    ],
  },
  {
    id: 'f_22',
    title: 'Back & Biceps',
    description:
      'A pulling session focused on building lat width and mid-back thickness. Think of your hands as hooks — pull with your elbows, not your hands.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Back', 'Biceps', 'Gym'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio (rower preferred)',
          '10 band pull-aparts or scapular wall slides',
          '10 dead bugs (controlled, alternating)',
          '1 light set of 10 dumbbell rows each side',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 90–120s between sets. Initiate every pull by retracting your shoulder blade first.',
        movements: [
          {
            name: 'Barbell Row or Dumbbell Row',
            value: '4 x 10',
            note: 'Keep torso parallel to floor. Pull elbows toward your back pockets.',
          },
          {
            name: 'Pull-ups or Lat Pulldown',
            value: '3 x 8–12',
            note: 'Full dead hang at the bottom on every rep. Pull chest to bar.',
          },
          {
            name: 'Seated Cable Row or Inverted Row',
            value: '3 x 12',
            note: 'Squeeze shoulder blades together and hold for a beat at the peak.',
          },
        ],
      },
      {
        name: 'Bicep Finisher',
        instructions:
          'Rest 60s between sets. No swinging — keep elbows pinned.',
        movements: [
          {
            name: 'Dumbbell Bicep Curls',
            value: '3 x 12',
            note: 'Supinate (rotate) the wrist at the top to fully contract the bicep.',
          },
          {
            name: 'Hammer Curls',
            value: '3 x 12',
            note: 'Neutral grip targets the brachialis. Keep wrists straight throughout.',
          },
        ],
      },
    ],
  },
  {
    id: 'f_23',
    title: 'Legs: Squat & Hinge',
    description:
      'A balanced lower body session covering both the anterior and posterior chain. The most important session of the week for overall strength and body composition.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 55,
    tags: ['Legs', 'Squat', 'Gym'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins bike or rower',
          '30s hip flexor stretch each side / 30s pigeon pose each side',
          '10 glute bridges with 2s pause at the top',
          '10 bodyweight squats with controlled tempo',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 2 mins between sets on squats. Rest 90s on accessory work.',
        movements: [
          {
            name: 'Barbell Back Squat or Leg Press',
            value: '4 x 10',
            note: 'Sit back and down. Drive the floor away on the way up.',
          },
          {
            name: 'Romanian Deadlift (Barbell or Dumbbell)',
            value: '3 x 12',
            note: 'Push hips back until you feel a deep hamstring stretch. Drive hips through at the top and squeeze glutes.',
          },
          {
            name: 'Walking Lunges or Split Squat',
            value: '3 x 10 each leg',
            note: 'Keep your front shin vertical. Do not let the knee cave inward.',
          },
        ],
      },
      {
        name: 'Isolation Finisher',
        instructions:
          'Rest 60s between sets. Full range of motion on both movements.',
        movements: [
          {
            name: 'Leg Extension or Leg Curl',
            value: '3 x 15',
            note: 'Pause for 1 second at peak contraction on each rep.',
          },
          {
            name: 'Calf Raises',
            value: '3 x 20',
            note: 'All the way up, all the way down. Slow eccentric.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Hanging Leg Raise or Plank',
            value: '3 x 12 / 3 x 45s',
            note: 'No spinal load after heavy squats. Hip flexion only.',
          },
        ],
      },
    ],
  },
];

const proWorkouts: SingleWorkout[] = [
  {
    id: 'p_01',
    title: 'The Anvil Grinder',
    description:
      'Elite Hyrox preparation. Heavy sled work paired with aerobic fatigue.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Heavy', 'Sled', 'Elite'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['1km Jog, 10 Sled Pushes (Light), 20 Lunges'],
      },
      {
        name: '5 Rounds',
        instructions:
          'Rest 60s between rounds. Run at 70-80% of max heart rate.',
        movements: [
          '1km Run',
          '50m Sled Push (Max weight)',
          '100m Sandbag Carry',
        ],
      },
    ],
  },
  {
    id: 'p_02',
    title: 'Olympic Complex: The Chief',
    description:
      'Developing technical speed and overhead stability with the snatch.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Snatch', 'Barbell', 'Speed'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Burgener Warmup (Snatches with PVC pipe)'],
      },
      {
        name: 'EMOM 15',
        instructions: 'Use 60-70% of 1RM Snatch. Focus on vertical bar path.',
        movements: ['1 Power Snatch + 1 Hang Snatch + 1 OHS'],
      },
    ],
  },
  {
    id: 'p_03',
    title: 'Metabolic Stress: Row/Thruster',
    description:
      "A 'couplet' designed to maximize lactate production. This will burn.",
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Row', 'Barbell', 'Sprint'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['500m Row, 15 Thrusters (Empty Bar)'] },
      {
        name: '21-15-9',
        instructions:
          'Go unbroken on the thrusters if possible. Sprint the 9 cal row.',
        movements: ['Calories Row', 'Thrusters (43/30kg)'],
      },
    ],
  },
  {
    id: 'p_04',
    title: 'Strict Strength: Press',
    description:
      'Pure overhead pressing power. No help from the legs (no dip).',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Shoulders', 'Overhead'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 Rounds: 10 Prone Y-Raises, 10 Face Pulls, 10 Empty Bar Presses',
        ],
      },
      {
        name: '5x5',
        instructions: 'Rest 3 mins between sets. Weight should be ~85% of 1RM.',
        movements: ['Strict Press'],
      },
    ],
  },
  {
    id: 'p_05',
    title: 'The 4km Row Finisher',
    description:
      "Building the 'diesel' engine. Focus on rhythmic breathing and powerful leg drive.",
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Row', 'Endurance'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['20 Cal Row (Slow), 10 Bird-Dogs'] },
      {
        name: 'Steady State',
        instructions:
          'Target a pace 10-15 seconds slower than your 2k split pace.',
        movements: ['4000m Row'],
      },
    ],
  },
  {
    id: 'p_06',
    title: 'Front Squat Volume',
    description:
      'High density strength work. Short rest periods build capacity under fatigue.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Legs', 'Squat'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['3 Rounds: 10 Goblet Squats, 10 Glute Bridges'],
      },
      {
        name: '10x3',
        instructions:
          'Perform 3 reps every 90 seconds. Weight should be 80% of 1RM.',
        movements: ['Front Squat'],
      },
    ],
  },
  {
    id: 'p_07',
    title: 'Murph (Unpartitioned)',
    description:
      'The gold standard of endurance. No partitioning means finishing all reps of one movement before the next.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Hero WOD', 'Long'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['800m Jog, 20 Air Squats, 10 Pushups'] },
      {
        name: 'For Time (20lb Vest)',
        instructions:
          'Complete in order: 1 Mile Run, then all Pullups, then all Pushups, then all Squats, then 1 Mile Run.',
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
    id: 'p_08',
    title: 'The Sandbag Mile',
    description:
      "Brutal core and carry endurance. Use a shoulder or 'bear hug' carry.",
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Running', 'Sandbag'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['5 mins joint prep, 200m light carry'] },
      {
        name: '1600m Carry',
        instructions:
          'Cover 1 mile as fast as possible. Switch carrying positions as needed.',
        movements: ['1600m Sandbag Carry (20/30kg)'],
      },
    ],
  },
  {
    id: 'p_09',
    title: 'Pistol Squat Skill',
    description:
      'Unilateral strength and balance. Use a counterweight or bench for support if needed.',
    category: 'Mobility',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Legs', 'Balance'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['Ankle mobility (2m), 20 Air Squats'] },
      {
        name: 'EMOM 10',
        instructions:
          'Perform 3-5 pistols per leg every minute. Rest remainder of minute.',
        movements: ['Pistol Squat Progressions'],
      },
    ],
  },
  {
    id: 'p_10',
    title: 'Double Under Mastery',
    description:
      'Efficiency test. Double unders require a relaxed grip and high vertical jumps.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Skill', 'Jump Rope'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['Calf stretches, 50 Single Unders'] },
      {
        name: '10 min EMOM',
        instructions:
          'Accumulate 30-50 reps per minute. Focus on timing, not speed.',
        movements: ['30-50 Double Unders'],
      },
    ],
  },
  {
    id: 'p_11',
    title: 'Heavy Grace',
    description:
      '30 Clean and Jerks for time. This is a classic CrossFit benchmark at a pro weight.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Barbell', 'Power'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Barbell Warmup: 10 Cleans, 10 Push Press'],
      },
      {
        name: '30 Reps',
        instructions: 'Weight: 61/43kg. Target is sub 5:00 for elite athletes.',
        movements: ['Clean and Jerk'],
      },
    ],
  },
  {
    id: 'p_12',
    title: 'The Ergathlon',
    description:
      'Triple-erg test. Minimal transitions are key. Maintain a steady aerobic pace.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Row', 'Ski', 'Bike'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['2 mins on each erg at low intensity'] },
      {
        name: 'For Time',
        instructions: 'Move quickly between machines. Do not stop moving.',
        movements: ['2000m Row', '2000m Ski', '4000m Bike'],
      },
    ],
  },
  {
    id: 'p_13',
    title: 'Pause Squat Intensity',
    description:
      "Removing the 'stretch reflex' to build raw strength from the bottom of the squat.",
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Squat', 'Pause'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Hip openers, 2 sets of 10 squats (Empty bar)'],
      },
      {
        name: '6x2',
        instructions:
          'Hold for 3 seconds in the bottom. Rest 3 mins between sets.',
        movements: ['Back Squat'],
      },
    ],
  },
  {
    id: 'p_14',
    title: 'Burpee/Box Jump 50',
    description:
      'High-volume plyometrics and metabolic demand. Stay efficient on the box step-down.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Explosive', 'Lungs'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['20 Step-ups, 10 Burpees'] },
      {
        name: '50-40-30-20-10',
        instructions:
          'Descending rep scheme. Rest only as needed to keep moving.',
        movements: ['Burpee Box Jumps', 'Wall Balls'],
      },
    ],
  },
  {
    id: 'p_15',
    title: 'Snatch Balance: Stability',
    description:
      "A technical drill to build confidence in 'catching' the snatch in a deep overhead squat.",
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Snatch', 'Technique'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['PVC overhead squats, shoulder pass-throughs'],
      },
      {
        name: '5x3',
        instructions: "Moderate weight. Focus on the 'punch' under the bar.",
        movements: ['Snatch Balance', 'Overhead Squat'],
      },
    ],
  },
  {
    id: 'p_16',
    title: 'Muscle-Up Progressions',
    description:
      "Elite gymnastics skill work. Focus on the 'transition' through the rings/bar.",
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Gymnastics', 'Skill'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['3 Rounds: 10 Ring Rows, 10 Ring Dips'] },
      {
        name: 'EMOM 12',
        instructions:
          'Perform 3-5 reps or the hardest progression you can master.',
        movements: ['Muscle Ups'],
      },
    ],
  },
  {
    id: 'p_17',
    title: 'The 5km Run Benchmark',
    description:
      'Aerobic capacity test. Aim for a sub 20:00 (Advanced) or sub 18:00 (Elite).',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Running', 'Aerobic'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['1km Jog, 2 x 100m Strides, Leg Swings'] },
      {
        name: 'Time Trial',
        instructions:
          'Run on a flat course or track. Pacing is crucial in the first 2km.',
        movements: ['5000m Run'],
      },
    ],
  },
  {
    id: 'p_18',
    title: 'Devil Press Ladder',
    description:
      'Extremely high metabolic demand. Use the swing of the dumbbells to help the overhead movement.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Dumbbell', 'Lungs'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['2 Rounds: 10 DB Snatches, 5 Burpees'] },
      {
        name: 'For Time',
        instructions:
          'Descending ladder of Devil Press (10 to 1) and Box Step Ups (20 to 2).',
        movements: ['Devil Press', 'Box Step Ups'],
      },
    ],
  },
  {
    id: 'p_19',
    title: 'Weighted Dips / Pullups',
    description:
      'Old school strength for upper body mass and power. Use a dipping belt.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Calisthenics', 'Heavy'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['2 sets of bodyweight pullups and dips'] },
      {
        name: '5x5',
        instructions: 'Superset movements. Rest 2-3 mins between sets.',
        movements: ['Weighted Pull-ups', 'Weighted Dips'],
      },
    ],
  },
  {
    id: 'p_20',
    title: 'The Hybrid Finisher',
    description:
      'A combination of erg and bodyweight movements to finish the week.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Hybrid', 'Finishers'],
    isPremium: true,
    blocks: [
      { name: 'Warmup', movements: ['500m Jog, 10 Burpees'] },
      {
        name: 'For Time',
        instructions:
          'No rest between stations. Push the pace on the 500m runs.',
        movements: [
          '500m Row',
          '50 Wall Balls',
          '500m Ski',
          '50 Burpees',
          '500m Run',
        ],
      },
    ],
  },

  // ── NEW PRO GYM SESSIONS ───────────────────────────────

  {
    id: 'p_21',
    title: 'Chest Day',
    description:
      'Full chest and tricep session with structured progressive loading. The pec deck finisher will leave you unable to tie your own shoelaces.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Chest', 'Triceps', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins rower or ski erg',
          '30s doorway pec stretch each side',
          '10 scapular push-ups',
          '10 band pull-aparts',
          '1 x 15 empty-bar or very light bench press — focus on bar path',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2–3 mins between sets. Controlled 2s descent on every rep.',
        movements: [
          {
            name: 'Barbell Bench Press',
            value: '4 x 6–8',
            note: 'Touch lower chest. Leg drive throughout. No bouncing.',
          },
        ],
      },
      {
        name: 'Secondary Compound',
        instructions:
          'Rest 90s between sets. Feel the upper chest stretch on the way down.',
        movements: [
          {
            name: 'Incline Dumbbell Press',
            value: '4 x 10',
            note: '30–45° incline. Allow dumbbells to travel below chest level for maximum stretch.',
          },
          {
            name: 'Dumbbell Floor Press',
            value: '3 x 10',
            note: 'No stretch reflex — pure tricep and inner chest tension from a dead stop.',
          },
        ],
      },
      {
        name: 'Isolation',
        instructions:
          'Rest 60s between sets. No lockout — keep constant tension on the pecs.',
        movements: [
          {
            name: 'Pec Deck or Cable Flyes',
            value: '3 x 15',
            note: 'Pause for 1 second at peak contraction. Think about wrapping arms around a barrel.',
          },
          {
            name: 'Cable Crossover (High to Low)',
            value: '3 x 15',
            note: "Targets the lower chest. Keep a slight forward lean and don't fully extend the elbows.",
          },
        ],
      },
      {
        name: 'Tricep Finisher',
        instructions: 'Rest 60s. Elbows stay pinned throughout.',
        movements: [
          {
            name: 'Skull Crushers',
            value: '3 x 12',
            note: 'Elbows pointing at the ceiling. Focus on the stretch at the bottom.',
          },
          {
            name: 'Tricep Pushdowns (Cable)',
            value: '3 x 15',
            note: 'Full extension at the bottom. Squeeze the lateral head hard.',
          },
        ],
      },
      {
        name: 'Posterior Health',
        instructions:
          'Light weight only. Essential after a heavy pressing session.',
        movements: [
          {
            name: 'Reverse Flyes or Face Pulls',
            value: '3 x 20',
            note: 'Protects the rotator cuff over time. Never skip this.',
          },
        ],
      },
    ],
  },
  {
    id: 'p_22',
    title: 'Back Day',
    description:
      'A complete back session targeting thickness, width, and rear delt health. Pull with your elbows — your hands are just hooks.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Back', 'Lats', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins rower',
          '30s lat stretch each side',
          '10 band pull-aparts',
          '10 dead bugs (alternating, controlled)',
          '1 x 10 light dumbbell rows each side — focus on scapular retraction',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2–3 mins between sets. Torso parallel to floor. Pull elbows into back pockets.',
        movements: [
          {
            name: 'Barbell Row',
            value: '4 x 6–8',
            note: 'Heavy. Reset each rep. Build the mid-back thickness that defines a serious physique.',
          },
        ],
      },
      {
        name: 'Vertical Pull',
        instructions:
          'Rest 2 mins between sets. Full dead hang at the bottom — every rep.',
        movements: [
          {
            name: 'Weighted Pull-ups or Lat Pulldown',
            value: '4 x 8',
            note: 'Initiate by depressing the shoulder blade before bending the elbow. Pull chest to bar.',
          },
          {
            name: 'Single Arm Lat Pulldown',
            value: '3 x 12 each side',
            note: 'Allows you to focus on each lat independently. Full stretch at the top.',
          },
        ],
      },
      {
        name: 'Horizontal Pull',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Seated Cable Row',
            value: '3 x 12',
            note: 'Slight forward lean at start. Sit tall at peak. Hold the contraction for a beat before releasing.',
          },
          {
            name: 'T-Bar Row',
            value: '3 x 10',
            note: 'Chest on the pad. Neutral grip. Pull elbows past your torso — this is where the mid-back really fires.',
          },
        ],
      },
      {
        name: 'Lat Isolation',
        instructions: 'Rest 60s. Arms stay straight — this is not a row.',
        movements: [
          {
            name: 'Straight Arm Pulldown',
            value: '3 x 15',
            note: 'Pull the shoulder blades down and feel the lats contract fully at the bottom.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Ab Wheel Rollout',
            value: '3 x 10',
            note: 'Brace hard before each rep. Roll only as far as you can maintain a neutral spine.',
          },
        ],
      },
    ],
  },
  {
    id: 'p_23',
    title: 'Legs Day',
    description:
      'The most demanding session of the week. Quad, hamstring, and glute work across every major movement pattern. You earn the rest days after this one.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Legs', 'Quads', 'Hamstrings', 'Glutes'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins bike — thorough warm-up for knees and hips',
          '30s hip flexor stretch each side / 30s pigeon pose each side',
          '10 glute bridges with 2s pause at the top',
          '10 bodyweight squats with controlled tempo',
          '1 x 10 goblet squats focusing on depth',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2.5–3 mins between sets. This is the most important set of the week — earn it.',
        movements: [
          {
            name: 'Barbell Back Squat',
            value: '5 x 5',
            note: 'Sit back and down. Hip crease below knee. Drive the floor away — do not just stand up.',
          },
        ],
      },
      {
        name: 'Quad Focus',
        instructions: 'Rest 2 mins between sets.',
        movements: [
          {
            name: 'Hack Squat or Leg Press',
            value: '4 x 10',
            note: 'Hack squat: constant tension, no lockout. Leg press: feet mid-platform, do not let lower back peel off the seat.',
          },
          {
            name: 'Leg Extension',
            value: '3 x 15',
            note: 'Pause for 1 full second at the top. Control the eccentric all the way down.',
          },
        ],
      },
      {
        name: 'Posterior Chain',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Romanian Deadlift',
            value: '4 x 10',
            note: 'Push hips back until deep hamstring stretch. Drive hips through at the top and squeeze glutes hard.',
          },
          {
            name: 'Hip Thrust (Barbell)',
            value: '3 x 12',
            note: 'Use a pad. Squeeze glutes for 1 full second at the top. Shins vertical at peak contraction.',
          },
          {
            name: 'Lying or Seated Leg Curl',
            value: '3 x 12',
            note: 'Slow eccentric. Do not let the stack slam at the bottom — maintain hamstring tension throughout.',
          },
        ],
      },
      {
        name: 'Calves',
        instructions:
          'Rest 45s between sets. Full range of motion — all the way up, all the way down.',
        movements: [
          {
            name: 'Calf Raises (Machine or Standing)',
            value: '4 x 20',
            note: 'Pause at the top. Calves respond well to high volume and slow eccentrics.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Hanging Leg Raise',
            value: '3 x 12',
            note: 'No spinal flexion load after heavy squats. Hip flexion only. Avoid swinging.',
          },
        ],
      },
    ],
  },
  {
    id: 'p_24',
    title: 'Shoulders Day',
    description:
      'Full shoulder development from pressing strength to lateral width and rear delt health. The face pull at the end is not optional.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Shoulders', 'Delts', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '30s overhead lat stretch each side',
          '10 arm circles forward / 10 arm circles backward',
          '10 band pull-aparts',
          '10 banded face pulls',
          '1 x 10 empty-bar overhead press — focus on lockout',
        ],
      },
      {
        name: 'Primary Press',
        instructions:
          'Rest 2–3 mins between sets. No leg drive — strict press only.',
        movements: [
          {
            name: 'Barbell Overhead Press',
            value: '4 x 6–8',
            note: 'Squeeze glutes and brace core. Press the bar vertically. Head through the window at the top.',
          },
        ],
      },
      {
        name: 'Secondary Press',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Dumbbell Shoulder Press or Arnold Press',
            value: '3 x 10',
            note: 'Arnold press: rotate from palms-in to palms-forward through the press. Recruits all three delt heads.',
          },
          {
            name: 'Machine Shoulder Press',
            value: '3 x 12',
            note: 'Eliminates stability demands — focus entirely on deltoid recruitment. Control the eccentric.',
          },
        ],
      },
      {
        name: 'Lateral Development',
        instructions:
          'Rest 60s. Lead with the elbows — think about touching the side walls.',
        movements: [
          {
            name: 'Lateral Raises (Dumbbell or Cable)',
            value: '4 x 15',
            note: 'Use lighter weight than feels necessary. Stop slightly above shoulder height.',
          },
          {
            name: 'Upright Row (Cable or Barbell)',
            value: '3 x 12',
            note: 'Wide grip to reduce shoulder impingement risk. Elbows lead the movement.',
          },
        ],
      },
      {
        name: 'Rear Delt & Health',
        instructions:
          'Light weight. This is the most important part of the session for long-term shoulder health.',
        movements: [
          {
            name: 'Face Pulls (Cable)',
            value: '3 x 20',
            note: 'Pull to forehead. Elbows flared high. Emphasise the external rotation at the end of every rep.',
          },
          {
            name: 'Reverse Flyes (Dumbbell or Machine)',
            value: '3 x 15',
            note: 'Focus on feeling the rear delt contract — not the traps.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Russian Twists',
            value: '3 x 20',
            note: 'Feet off the floor. Rotate from the obliques. Add a plate in later weeks.',
          },
        ],
      },
    ],
  },
  {
    id: 'p_25',
    title: 'Arms Day',
    description:
      'Dedicated bicep and tricep session. The arms respond exceptionally well to focused isolation work — give them your full attention for once.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Arms', 'Biceps', 'Triceps', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '30s wrist flexor stretch each side / 30s wrist extensor stretch each side',
          '10 arm circles forward / 10 arm circles backward',
          '1 x 15 cable curls (light) / 1 x 15 tricep pushdowns (light) — pump blood into the elbow joints',
        ],
      },
      {
        name: 'Biceps — Compound',
        instructions:
          'Rest 90s between sets. Elbows stay pinned — no swinging.',
        movements: [
          {
            name: 'Barbell or EZ Bar Curl',
            value: '4 x 10',
            note: 'The heaviest bicep movement of the session. Full extension at the bottom — do not cheat the range.',
          },
          {
            name: 'Incline Dumbbell Curl',
            value: '3 x 12',
            note: 'The incline position stretches the long head of the bicep maximally. Slow and deliberate on every rep.',
          },
        ],
      },
      {
        name: 'Biceps — Isolation',
        instructions: 'Rest 60s. No momentum — the bicep does all the work.',
        movements: [
          {
            name: 'Preacher Curl (Barbell or EZ Bar)',
            value: '3 x 12',
            note: 'The bench eliminates all cheating. Resist the urge to bounce at the bottom — that stretch is where growth happens.',
          },
          {
            name: 'Hammer Curls',
            value: '3 x 12',
            note: 'Neutral grip targets the brachialis — developing this pushes the bicep peak higher.',
          },
          {
            name: 'Cable Curl (Single Arm)',
            value: '2 x 15 each side',
            note: 'Constant tension from the cable. Supinate hard at the top of each rep.',
          },
        ],
      },
      {
        name: 'Triceps — Compound',
        instructions: 'Rest 90s between sets. Elbows stay tucked throughout.',
        movements: [
          {
            name: 'Skull Crushers (Barbell or EZ Bar)',
            value: '4 x 10',
            note: 'Lower to forehead with elbows pointing at the ceiling. The long head stretch at the bottom is where size comes from.',
          },
          {
            name: 'Overhead Tricep Extension (Cable or Dumbbell)',
            value: '3 x 12',
            note: 'Overhead position places the long head in full stretch. Keep elbows pointing straight up — do not let them flare.',
          },
        ],
      },
      {
        name: 'Triceps — Isolation',
        instructions: 'Rest 60s. Squeeze the lateral head hard on every rep.',
        movements: [
          {
            name: 'Tricep Pushdowns (Cable — Straight Bar or Rope)',
            value: '3 x 15',
            note: 'Full extension at the bottom. Rope allows a twist at the bottom to maximise lateral head contraction.',
          },
          {
            name: 'Dips (Upright / Tricep Focus)',
            value: '3 x 12',
            note: 'Stay upright to keep the load on the triceps. Excellent mass-builder to close out the session.',
          },
        ],
      },
      {
        name: 'Forearm Finisher',
        instructions:
          'Light weight, high rep. Grip strength underpins every compound lift you do.',
        movements: [
          {
            name: 'Hammer Curls (Slow)',
            value: '2 x 20',
            note: 'Focus on the forearm and brachioradialis at the top. Full extension at the bottom.',
          },
        ],
      },
    ],
  },
];

export const allStandaloneWorkouts: SingleWorkout[] = [
  ...freeWorkouts,
  ...proWorkouts,
];
