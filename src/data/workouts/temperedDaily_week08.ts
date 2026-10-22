import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 2: Engine — Week 8: Engine – Test                  */
/* -------------------------------------------------------------------------- */
/*
 * Conventions for every Tempered Daily workout:
 * - Standalone: no workout references another workout or the program.
 *   The weekly wrapper (bottom of file) carries the narrative.
 * - IDs are flat (`td_###`) so workouts can be reused in later blocks.
 * - Two scales on every session: 'RX' and 'Scaled'.
 * - Every session is written for one person training alone. No partner work.
 * - Block order: Warmup → Strength → WOD → Cooldown → Stretch → Additional Work.
 * - Loads written as RPE + % of estimated 1RM so they work without history.
 * - Specialist kit (ski erg, GHD, sled, sandbag) always carries a swap `note`.
 * - No brand or trademark names in any user-facing copy (e.g. CrossFit, Hyrox, AbMat).
 *
 * Test week: Monday 2k row (Scaled 1k), Wednesday 10 min max cal bike
 * (Scaled 8 min), Friday 5k run (Scaled 3k). On test days the Strength block
 * is a short, light primer. Everything around the tests is light and fun.
 */

/* ------------------------------ Shared blocks ----------------------------- */

const COOLDOWN_FLUSH: WorkoutBlockBase = {
  name: 'Cooldown',
  instructions:
    'Bring the heart rate down before you stretch. Nasal breathing only. If you can not hold a conversation, slow down.',
  movements: ['5 mins easy bike, row or walk'],
};

const STRETCH_LOWER: WorkoutBlockBase = {
  name: 'Stretch',
  instructions:
    'Hold each position for the full time. Breathe out slowly and sink a little deeper on every exhale.',
  movements: [
    '60s Couch Stretch each side',
    '60s Pigeon Stretch each side',
    '60s Elevated Hamstring Stretch each side',
    '60s Deep Squat Hold (hold a rig or pole if needed)',
    '60s Child’s Pose',
  ],
};

const STRETCH_UPPER: WorkoutBlockBase = {
  name: 'Stretch',
  instructions:
    'Hold each position for the full time. Breathe out slowly and sink a little deeper on every exhale.',
  movements: [
    '60s Doorframe Chest Stretch each side',
    '60s Lat Stretch on a rig or bench each side',
    '60s Cross Body Shoulder Stretch each side',
    '10 Thoracic Open Books each side',
    '60s Wrist Flexor Stretch',
  ],
};

const STRETCH_FULL: WorkoutBlockBase = {
  name: 'Stretch',
  instructions:
    'Hold each position for the full time. Breathe out slowly and sink a little deeper on every exhale.',
  movements: [
    '60s Couch Stretch each side',
    '60s Pigeon Stretch each side',
    '60s Lat Stretch on a rig or bench each side',
    '60s Calf Stretch against a wall each side',
    '60s Supine Twist each side',
  ],
};

const PACING_RULES =
  'Pacing is everything. Go out at a pace that feels slightly too easy for the first quarter, settle in the middle half, then empty the tank in the final quarter. Starting too fast is the most common way to lose a test.';

/* ========================================================================== */
/*  td_050 — 2k row test                                                      */
/* ========================================================================== */

const td050Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Take the full 10 minutes. You should be sweating and ready before you start.',
  movements: [
    '5 mins Row: 2 easy, 2 moderate, 1 at test pace',
    '10 Air Squats',
    '10 Band Pull-Aparts',
    '2 x 20s Row at test pace, 40s easy between',
    '1 x 10s Row sprint start',
    '2 mins easy, then set up for the test',
  ],
};

const td050Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Light core only. 2 rounds.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['10 Dead Bugs each side', '30s Plank'],
};

const td050: StandaloneWorkoutSource = {
  id: 'td_050',
  title: '2k Row Test',
  description:
    'Test day. A 2000m row for time on RX, 1000m on Scaled. A short warmup primer, a smart pacing plan and one all-out effort. Then an easy flush and a long stretch.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Cardio', 'Benchmark'],
  equipment: ['rower', 'box', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Row time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td050Warmup,
        {
          name: 'Strength: Primer',
          instructions:
            '2 rounds, rest 60s. Fast and snappy, not tiring. This wakes the legs up for the test.',
          highlightInstructions: '2 Rounds · Fast, not heavy',
          movements: [
            { name: 'Box Jumps', value: '3', note: 'Step down.' },
            { name: 'Goblet Squats', value: '5', note: 'Light.' },
          ],
        },
        {
          name: 'WOD: 2000m Row Test',
          instructions: `2000m row for time. Damper 4–6. ${PACING_RULES} Log your finishing time.`,
          highlightInstructions: 'Score: total time · One effort',
          movements: [
            { name: 'Row', value: '2000m', note: 'Max effort.' },
            { type: 'divider', note: 'First 500m: controlled. 500–1500m: hold. Last 500m: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td050Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td050Warmup,
        {
          name: 'Strength: Primer',
          instructions: '2 rounds, rest 60s. Fast and light.',
          highlightInstructions: '2 Rounds · Fast, not heavy',
          movements: [
            { name: 'Box Step-ups', value: '3 each leg', note: 'Fast up, slow down.' },
            { name: 'Goblet Squats', value: '5', note: 'Light.' },
          ],
        },
        {
          name: 'WOD: 1000m Row Test',
          instructions: `1000m row for time. Damper 4–6. ${PACING_RULES} Log your finishing time.`,
          highlightInstructions: 'Score: total time · One effort',
          movements: [
            { name: 'Row', value: '1000m', note: 'Max effort.' },
            { type: 'divider', note: 'First 250m: controlled. 250–750m: hold. Last 250m: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td050Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_051 — Light hybrid                                                     */
/* ========================================================================== */

const td051Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy start. Let the legs loosen up gradually.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Band Pull-Aparts',
    '5 Inchworms',
  ],
};

const td051Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['12 Dumbbell Hammer Curls', '15 Band Face Pulls'],
};

const td051: StandaloneWorkoutSource = {
  id: 'td_051',
  title: 'Shake Out',
  description:
    'A light hybrid session. Easy pulling work, then three relaxed rounds of running, wall balls, sled pushes and the ski erg. Smooth, steady and over before it gets hard.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Cardio', 'Full Body', 'For Time'],
  equipment: ['pull-up bar', 'dumbbell', 'medicine ball', 'sled', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td051Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions: '3 sets, rest 90s after each pair. RPE 6. Easy reps.',
          highlightInstructions: '3 Sets · RPE 6',
          movements: [
            { name: 'Strict Pull-ups', value: '5' },
            { name: 'Chest Supported Dumbbell Row', value: '10', note: 'Bench on an incline.' },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            '3 rounds at RPE 6. This is not a race. You should be able to talk the whole way round. 20 minute cap.',
          highlightInstructions: 'Score: total time · RPE 6 · Cap 20 mins',
          movements: [
            '400m Run',
            { name: 'Wall Balls', value: '12', note: '9/6kg to a 3m/2.7m target.' },
            {
              name: 'Sled Push',
              value: '10m',
              note: 'Light. No sled? 10 Walking Lunges.',
            },
            { name: 'Ski Erg', value: '10/8 cal', note: 'No ski erg? 10/8 cal row.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td051Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td051Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions: '3 sets, rest 90s after each pair. RPE 6.',
          highlightInstructions: '3 Sets · RPE 6',
          movements: [
            { name: 'Ring Rows', value: '8' },
            { name: 'Chest Supported Dumbbell Row', value: '10' },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            '3 easy rounds. Conversational pace. 20 minute cap.',
          highlightInstructions: 'Score: total time · RPE 6 · Cap 20 mins',
          movements: [
            '300m Run',
            { name: 'Wall Balls', value: '10', note: '6/4kg to a 2.7m/2.5m target.' },
            {
              name: 'Sled Push',
              value: '10m',
              note: 'Light. No sled? 8 Walking Lunges.',
            },
            { name: 'Ski Erg', value: '8/6 cal', note: 'No ski erg? 8/6 cal row.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td051Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_052 — 10 minute max calorie bike test                                  */
/* ========================================================================== */

const td052Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Test day. Get properly warm on the bike before you start.',
  movements: [
    '5 mins Bike: 2 easy, 2 moderate, 1 at test pace',
    '10 Scapular Push-ups',
    '10 Band Pull-Aparts',
    '2 x 20s Bike at test pace, 40s easy between',
    '2 mins easy, then set up for the test',
  ],
};

const td052Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, light.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Lateral Raises', value: '12', note: 'Light.' },
    '30s Dead Hang',
  ],
};

const td052: StandaloneWorkoutSource = {
  id: 'td_052',
  title: 'Ten Minute Test',
  description:
    'Test day. As many calories as possible on the bike: 10 minutes on RX, 8 minutes on Scaled. A light upper body primer, one long hard effort, then an easy flush and a stretch.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Cardio', 'Benchmark'],
  equipment: ['bike', 'dumbbell', 'bands', 'pull-up bar'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Calories', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td052Warmup,
        {
          name: 'Strength: Primer',
          instructions: '2 rounds, rest 60s. Light. Just warming the upper body.',
          highlightInstructions: '2 Rounds · Light',
          movements: [
            { name: 'Dumbbell Strict Press', value: '8', note: 'Light.' },
            { name: 'Push-ups', value: '8' },
          ],
        },
        {
          name: 'WOD: 10 Min Max Cal Bike',
          instructions: `As many calories as possible in 10 minutes on an air bike or bike erg. ${PACING_RULES} Log your total calories.`,
          highlightInstructions: 'Score: total calories · 10 mins',
          movements: [
            { name: 'Bike', value: '10 mins max cal', note: 'Arms and legs on an air bike.' },
            { type: 'divider', note: 'Mins 0–3: controlled. 3–8: hold. 8–10: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td052Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td052Warmup,
        {
          name: 'Strength: Primer',
          instructions: '2 rounds, rest 60s. Light.',
          highlightInstructions: '2 Rounds · Light',
          movements: [
            { name: 'Dumbbell Strict Press', value: '8', note: 'Light.' },
            { name: 'Push-ups', value: '8', note: 'Hands on a box if needed.' },
          ],
        },
        {
          name: 'WOD: 8 Min Max Cal Bike',
          instructions: `As many calories as possible in 8 minutes on an air bike or bike erg. ${PACING_RULES} Log your total calories.`,
          highlightInstructions: 'Score: total calories · 8 mins',
          movements: [
            { name: 'Bike', value: '8 mins max cal' },
            { type: 'divider', note: 'Mins 0–2: controlled. 2–6: hold. 6–8: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td052Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_053 — Light technique + fun EMOM                                       */
/* ========================================================================== */

const td053Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Loose and playful. Move in every direction.',
  movements: [
    '3 mins easy skipping',
    '20m Bear Crawl',
    '20m Lateral Shuffle each way',
    '10 Band Pass-Throughs',
    '2 Rounds: 5 Snatch Grip Deadlifts, 5 Muscle Snatches (empty bar)',
  ],
};

const td053Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. Skill practice. Pick one and play with it for 8–10 mins.',
  highlightInstructions: 'Optional · Choose one',
  movements: [
    'Handstand Holds against a wall (accumulate 2 mins)',
    'Double Under practice (accumulate 100)',
    'Toes-to-Bar practice (5 x 5)',
  ],
};

const td053: StandaloneWorkoutSource = {
  id: 'td_053',
  title: 'Light Switch',
  description:
    'Fun and fast with nothing heavy. Light hang snatch technique, then a 15 minute EMOM of skipping, dumbbell work and medicine ball slams. Leave with energy to spare.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Full Body', 'Olympic Lifting', 'EMOM'],
  equipment: ['barbell', 'dumbbell', 'medicine ball', 'skipping rope', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'How it felt, any reps missed',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td053Warmup,
        {
          name: 'Strength: Hang Power Snatch EMOM',
          instructions:
            'Every minute for 8 minutes, 2 hang power snatches at 50–60% of your estimated 1RM, RPE 5–6. Fast, relaxed, perfect.',
          highlightInstructions: 'EMOM 8 · RPE 5–6',
          movements: [
            { name: 'Hang Power Snatch', value: '2 reps', note: '50–60% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: EMOM 15',
          instructions:
            'Every minute on the minute for 15 minutes, cycling the 3 stations (5 rounds). RPE 6. Each station should leave you at least 20s of rest.',
          highlightInstructions: '5 Rounds · RPE 6',
          movements: [
            { name: 'Min 1: Double Unders', value: '40' },
            { name: 'Min 2: Dumbbell Devil Press', value: '6', note: '2 x 15/10kg.' },
            { name: 'Min 3: Medicine Ball Slams', value: '12', note: '10/6kg.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td053Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td053Warmup,
        {
          name: 'Strength: Dumbbell Snatch EMOM',
          instructions:
            'Every minute for 8 minutes, 2 dumbbell hang snatches each arm, or 2 light barbell hang power snatches.',
          highlightInstructions: 'EMOM 8 · RPE 5–6',
          movements: [
            {
              name: 'Dumbbell Hang Snatch',
              value: '2 each arm',
              note: 'Or 2 light barbell hang power snatches.',
            },
          ],
        },
        {
          name: 'WOD: EMOM 15',
          instructions:
            'Every minute on the minute for 15 minutes, cycling the 3 stations (5 rounds). Easy to moderate effort.',
          highlightInstructions: '5 Rounds · RPE 6',
          movements: [
            { name: 'Min 1: Single Unders', value: '60' },
            { name: 'Min 2: Dumbbell Burpee to Press', value: '5', note: '2 x 7.5/5kg.' },
            { name: 'Min 3: Medicine Ball Slams', value: '10', note: '6/4kg.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td053Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_054 — 5k run test                                                      */
/* ========================================================================== */

const td054Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Test day. Easy jog, drills, then strides up to race pace.',
  movements: [
    '800m easy jog',
    '2 x 20m A-Skips',
    '2 x 20m High Knees',
    '10 Leg Swings each direction each side',
    '3 x 20s Strides at test pace, walk back',
  ],
};

const td054Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Gentle. 2 rounds.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['10 Glute Bridges', '60s Foam Roll calves each side'],
};

const td054: StandaloneWorkoutSource = {
  id: 'td_054',
  title: '5k Run Test',
  description:
    'Test day. A 5k run for time on RX, 3k on Scaled. Treadmill at 1% incline or a flat, measured route. A quick primer, a patient start and a strong finish. Then an easy flush and a long stretch.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Cardio', 'Benchmark'],
  equipment: ['kettlebell', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Run time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td054Warmup,
        {
          name: 'Strength: Primer',
          instructions: '2 rounds, rest 60s. Light. Just switching on the hips.',
          highlightInstructions: '2 Rounds · Light',
          movements: [
            { name: 'Kettlebell Deadlift', value: '8', note: 'Light.' },
            { name: 'Banded Lateral Walks', value: '10 each way' },
          ],
        },
        {
          name: 'WOD: 5k Run Test',
          instructions: `5k run for time. Treadmill at 1% incline, or a flat measured route. ${PACING_RULES} Log your finishing time.`,
          highlightInstructions: 'Score: total time · One effort',
          movements: [
            { name: 'Run', value: '5k', note: 'Max effort.' },
            { type: 'divider', note: 'First 1k: controlled. 1k–4k: hold. Last 1k: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td054Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td054Warmup,
        {
          name: 'Strength: Primer',
          instructions: '2 rounds, rest 60s. Light.',
          highlightInstructions: '2 Rounds · Light',
          movements: [
            { name: 'Kettlebell Deadlift', value: '8', note: 'Light.' },
            { name: 'Banded Lateral Walks', value: '10 each way' },
          ],
        },
        {
          name: 'WOD: 3k Run Test',
          instructions: `3k run for time. Treadmill at 1% incline, or a flat measured route. Walk breaks are allowed. ${PACING_RULES} Log your finishing time.`,
          highlightInstructions: 'Score: total time · One effort',
          movements: [
            { name: 'Run', value: '3k', note: 'Max effort.' },
            { type: 'divider', note: 'First 1k: controlled. 1k–2k: hold. Last 1k: everything.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td054Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_055 — Fun solo AMRAP                                                   */
/* ========================================================================== */

const td055Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy rounds, then practice reps.',
  movements: [
    '2 Rounds: 250m Row, 10 Air Squats, 10 Push-ups',
    'Practice: 5 Kettlebell Swings, 4 Box Step-ups, 5 Push-ups',
  ],
};

const td055Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '20 Calf Raises'],
};

const td055: StandaloneWorkoutSource = {
  id: 'td_055',
  title: 'Free Flow',
  description:
    'A relaxed 20 minute AMRAP to enjoy. Light carries, then rowing, kettlebell swings, step-ups and push-ups at an easy, flowing pace. Moderate, fun and a good sweat.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Full Body', 'Cardio', 'AMRAP'],
  equipment: ['rower', 'kettlebell', 'box', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 20,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td055Warmup,
        {
          name: 'Strength: Carry Medley',
          instructions: '2 rounds, rest 60s. Moderate weight.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 24/16kg.' },
            { name: 'Goblet Carry', value: '20m', note: '24/16kg.' },
          ],
        },
        {
          name: 'WOD: AMRAP 20',
          instructions:
            'As many rounds and reps as possible in 20 minutes at RPE 6–7. Smooth and steady. Enjoy it.',
          highlightInstructions: 'Score: rounds + reps · Cap 20 mins',
          movements: [
            { name: 'Row', value: '10/8 cal' },
            { name: 'Kettlebell Swings', value: '12', note: '24/16kg, Russian.' },
            { name: 'Box Step-ups', value: '10', note: '60/50cm. Alternate legs.' },
            { name: 'Push-ups', value: '10' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td055Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td055Warmup,
        {
          name: 'Strength: Carry Medley',
          instructions: '2 rounds, rest 60s. Choose loads you can carry without stopping.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 16/12kg.' },
            { name: 'Goblet Carry', value: '20m', note: '16/12kg.' },
          ],
        },
        {
          name: 'WOD: AMRAP 20',
          instructions:
            'As many rounds and reps as possible in 20 minutes at an easy, flowing pace.',
          highlightInstructions: 'Score: rounds + reps · Cap 20 mins',
          movements: [
            { name: 'Row', value: '8/6 cal' },
            { name: 'Kettlebell Swings', value: '10', note: '16/12kg, Russian.' },
            { name: 'Box Step-ups', value: '10', note: '50/40cm.' },
            { name: 'Push-ups', value: '8', note: 'Hands on a box if needed.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td055Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_056 — Recovery                                                         */
/* ========================================================================== */

const td056Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Dead Bugs',
  ],
};

const td056Strength: WorkoutBlockBase = {
  name: 'Strength: Light Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, slow tempo. Just moving blood through tired muscles.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Goblet Squat', value: '8', note: 'Light. 3s lower.' },
    { name: 'Dumbbell Floor Press', value: '10', note: 'Light. 3s lower.' },
    { name: 'Ring Rows', value: '10' },
  ],
};

const td056Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. A longer mobility flow. Take your time.',
  highlightInstructions: 'Optional',
  movements: [
    '10 90/90 Hip Switches each side',
    '10 Jefferson Curls with a light plate',
    '2 mins Dead Hang (accumulate)',
    '2 mins Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
  ],
};

const td056: StandaloneWorkoutSource = {
  id: 'td_056',
  title: 'Deep Breath',
  description:
    'Pure recovery. Light accessories, an easy Zone 2 piece across three machines and an extended stretch. Breathe through your nose and let the legs come back to life.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['kettlebell', 'dumbbell', 'bike', 'rower', 'ski erg', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, average heart rate, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td056Warmup,
        td056Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Three 8 minute pieces, no rest between them. Conversational pace throughout. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '8 mins' },
            {
              name: 'Ski Erg',
              value: '8 mins',
              note: 'No ski erg? 8 mins easy jog or incline walk.',
            },
            { name: 'Row', value: '8 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td056Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td056Warmup,
        td056Strength,
        {
          name: 'WOD: Zone 2 x 18',
          instructions:
            'Three 6 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '6 mins' },
            {
              name: 'Ski Erg',
              value: '6 mins',
              note: 'No ski erg? 6 mins brisk walk.',
            },
            { name: 'Row', value: '6 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td056Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek08: StandaloneWorkoutSource[] = [
  td050,
  td051,
  td052,
  td053,
  td054,
  td055,
  td056,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek08Program: TemperedDailyWeek = {
  id: 'td_week_008',
  weekStart: '2026-12-14',
  blockName: 'Engine',
  theme: 'Metabolic Conditioning',
  phase: 'Test',
  description:
    'Test week. Row on Monday, bike on Wednesday, run on Friday. RX tests a 2k row, 10 minutes of max calories on the bike and a 5k run. Scaled tests a 1k row, 8 minutes on the bike and a 3k run. Pace them smartly, empty the tank at the end and log every score. Everything in between is light, fun and designed to keep you fresh for the next test. Short on time? Do Monday, Wednesday and Friday, nothing else matters this week.',
  primaryFocus: 'Cardio',
  otherFocuses: ['Full Body', 'Lower Body'],
  // TODO: set once the next block's theme is decided.
  nextWeekFocus: 'New block – revealed Monday',
  days: ['td_050', 'td_051', 'td_052', 'td_053', 'td_054', 'td_055', 'td_056'],
};
