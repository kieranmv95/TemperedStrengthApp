import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 1: The Big Three — Week 4: Strength – Test         */
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
 * Test week: RX tests a 1RM, Scaled tests a heavy 3RM. Test days log the
 * lift (max_reps, kg). Everything around them is light and fun.
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

const TEST_RULES =
  'Rest 3–5 mins between heavy attempts. You get 3 attempts above 90%. A missed attempt counts as one of the 3. Never test to failure on a rep that looks unsafe. A good test day ends with a smooth top lift, not a grinder.';

/* ========================================================================== */
/*  td_022 — Back squat test                                                  */
/* ========================================================================== */

const td022Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Take the full 10 minutes. Get hot, get mobile, then build the bar slowly.',
  movements: [
    '5 mins easy bike, building to a sweat',
    '10 Cossack Squats (5 each side)',
    '10 Goblet Squats with 3s pause at the bottom',
    '10 Banded Lateral Walks each way',
    '2 x 5 Empty Bar Back Squats',
  ],
};

const td022Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Light single leg work only. 2 rounds.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Bodyweight Split Squat', value: '10 each leg' },
    '30s Plank',
  ],
};

const td022: StandaloneWorkoutSource = {
  id: 'td_022',
  title: 'Squat Test',
  description:
    'Test day. Build to a new heavy back squat: a one rep max on RX, a three rep max on Scaled. Patient warmup, smart jumps and three heavy attempts. Then an easy flush and a long stretch.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength'],
  equipment: ['barbell', 'bike', 'rower', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Top lift (kg)', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td022Warmup,
        {
          name: 'Strength: Back Squat 1RM',
          instructions: `Build to a heavy single. Use safeties set just below the bottom of your squat, or spotters. ${TEST_RULES} Log your heaviest successful lift.`,
          highlightInstructions:
            'Use safeties or spotters · 3 attempts above 90%',
          movements: [
            {
              name: 'Build',
              value: '5 / 3 / 2 / 1 reps',
              note: 'Roughly 40% → 60% → 70% → 80% of estimated 1RM. Rest 2 mins.',
            },
            {
              name: 'Opener',
              value: '1 @ ~90%',
              note: 'A weight you are certain you will make.',
            },
            {
              name: 'Attempt 2',
              value: '1 @ ~95–100%',
              note: 'Around your previous best.',
            },
            {
              name: 'Attempt 3',
              value: '1 @ ~100–103%',
              note: 'Only if attempt 2 moved well. Jump 2.5–5kg.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions:
            'Not for score. 3 easy rounds to clear the legs. Stay below RPE 5.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['250m easy Row', '10 Band Pull-Aparts', '10 Dead Bugs'],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td022Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td022Warmup,
        {
          name: 'Strength: Back Squat 3RM',
          instructions: `Build to a heavy set of 3 with good form. Use safeties or spotters. ${TEST_RULES} Log the weight of your heaviest successful triple.`,
          highlightInstructions:
            'Use safeties or spotters · 3 attempts at your heavy triple',
          movements: [
            {
              name: 'Build',
              value: '8 / 5 / 3 / 3 reps',
              note: 'Add weight in steady jumps. Rest 2 mins.',
            },
            {
              name: 'Attempt 1',
              value: '3 reps',
              note: 'A heavy triple you know you will make.',
            },
            {
              name: 'Attempt 2',
              value: '3 reps',
              note: 'Add 2.5–5kg if attempt 1 was smooth.',
            },
            {
              name: 'Attempt 3',
              value: '3 reps',
              note: 'Only if attempt 2 moved well. Add 2.5kg.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions: 'Not for score. 3 easy rounds to clear the legs.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['200m easy Row', '10 Band Pull-Aparts', '10 Dead Bugs'],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td022Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_023 — Light engine                                                     */
/* ========================================================================== */

const td023Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Easy start. Legs may be heavy, so let them loosen up gradually.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Band Pull-Aparts',
    '5 Inchworms',
  ],
};

const td023Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['12 Dumbbell Hammer Curls', '15 Reverse Flyes'],
};

const td023: StandaloneWorkoutSource = {
  id: 'td_023',
  title: 'Cruise Control',
  description:
    'A moderate engine session. Light rowing strength work, then a 15 minute AMRAP at a pace you could hold all day. Steady, controlled and a good way to move after a heavy day.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'AMRAP'],
  equipment: ['dumbbell', 'rower', 'medicine ball', 'bands', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 15,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td023Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions:
            '3 sets, rest 90s after each pair. Moderate weight, perfect reps.',
          highlightInstructions: '3 Sets · RPE 7',
          movements: [
            {
              name: 'Chest Supported Dumbbell Row',
              value: '10',
              note: 'Bench on an incline.',
            },
            { name: 'Strict Pull-ups', value: '5' },
          ],
        },
        {
          name: 'WOD: AMRAP 15',
          instructions:
            'As many rounds and reps as possible in 15 minutes at RPE 6. This is not a race. You should finish feeling like you could have gone harder.',
          highlightInstructions: 'Score: rounds + reps · RPE 6',
          movements: [
            '250m Row',
            {
              name: 'Wall Balls',
              value: '10',
              note: '9/6kg to a 3m/2.7m target.',
            },
            '10 Sit-ups',
            '5 Push-ups',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td023Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td023Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions:
            '3 sets, rest 90s after each pair. Moderate weight, full range.',
          highlightInstructions: '3 Sets · RPE 7',
          movements: [
            { name: 'Chest Supported Dumbbell Row', value: '10' },
            { name: 'Ring Rows', value: '8' },
          ],
        },
        {
          name: 'WOD: AMRAP 15',
          instructions:
            'As many rounds and reps as possible in 15 minutes at an easy, steady pace.',
          highlightInstructions: 'Score: rounds + reps · RPE 6',
          movements: [
            '200m Row',
            {
              name: 'Wall Balls',
              value: '8',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
            '10 Sit-ups',
            { name: 'Push-ups', value: '5', note: 'Hands on a box if needed.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td023Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_024 — Bench press test                                                 */
/* ========================================================================== */

const td024Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Get the shoulders warm and the upper back tight before you build up.',
  movements: [
    '5 mins easy row or ski erg',
    '15 Band Pull-Aparts',
    '10 Scapular Push-ups',
    '10 Banded External Rotations each side',
    '2 x 10 Empty Bar Bench Press',
  ],
};

const td024Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s. Light.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Face Pulls', value: '15', note: 'Cable or band.' },
    '30s Dead Hang',
  ],
};

const td024: StandaloneWorkoutSource = {
  id: 'td_024',
  title: 'Bench Test',
  description:
    'Test day. Build to a new heavy bench press: a one rep max on RX, a three rep max on Scaled. Always with a spotter or safeties. Then a light upper back flush to finish.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Upper Body', 'Strength'],
  equipment: ['barbell', 'rower', 'pull-up bar', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Top lift (kg)', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td024Warmup,
        {
          name: 'Strength: Bench Press 1RM',
          instructions: `Build to a heavy single with a spotter or safeties. Same set-up every attempt: feet planted, shoulder blades pinned, brief pause on the chest. ${TEST_RULES} Log your heaviest successful lift.`,
          highlightInstructions:
            'Always use a spotter or safeties · 3 attempts above 90%',
          movements: [
            {
              name: 'Build',
              value: '8 / 5 / 3 / 1 reps',
              note: 'Roughly 40% → 60% → 70% → 80% of estimated 1RM. Rest 2 mins.',
            },
            {
              name: 'Opener',
              value: '1 @ ~90%',
              note: 'A weight you are certain you will make.',
            },
            {
              name: 'Attempt 2',
              value: '1 @ ~95–100%',
              note: 'Around your previous best.',
            },
            {
              name: 'Attempt 3',
              value: '1 @ ~100–103%',
              note: 'Only if attempt 2 moved well. Jump 1–2.5kg.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions:
            'Not for score. 3 easy rounds for the upper back. Stay below RPE 5.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['10 Ring Rows', '15 Band Pull-Aparts', '20s Hollow Hold'],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td024Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td024Warmup,
        {
          name: 'Strength: Bench Press 3RM',
          instructions: `Build to a heavy set of 3 with a spotter or safeties. Barbell or dumbbells. ${TEST_RULES} Log the weight of your heaviest successful triple.`,
          highlightInstructions: 'Always use a spotter or safeties',
          movements: [
            {
              name: 'Build',
              value: '10 / 6 / 4 / 3 reps',
              note: 'Add weight in steady jumps. Rest 2 mins.',
            },
            {
              name: 'Attempt 1',
              value: '3 reps',
              note: 'A heavy triple you know you will make.',
            },
            {
              name: 'Attempt 2',
              value: '3 reps',
              note: 'Add 1–2.5kg if attempt 1 was smooth.',
            },
            {
              name: 'Attempt 3',
              value: '3 reps',
              note: 'Only if attempt 2 moved well.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions: 'Not for score. 3 easy rounds for the upper back.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['8 Ring Rows', '15 Band Pull-Aparts', '15s Hollow Hold'],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td024Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_025 — Play day                                                         */
/* ========================================================================== */

const td025Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Loose and playful. Move in every direction.',
  movements: [
    '3 mins easy bike',
    '20m Bear Crawl',
    '20m Lateral Shuffle each way',
    '10 Inchworms',
    '5 Pogo Jumps x 3',
  ],
};

const td025Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. Skill practice. Pick one and play with it for 8–10 mins.',
  highlightInstructions: 'Optional · Choose one',
  movements: [
    'Handstand Holds against a wall (accumulate 2 mins)',
    'Double Under practice (accumulate 100)',
    'Pistol Squat progressions (5 each leg x 3)',
  ],
};

const td025: StandaloneWorkoutSource = {
  id: 'td_025',
  title: 'Play Day',
  description:
    'Fun, fast and light. Medicine ball power work, then a 20 minute EMOM that keeps you moving without beating you up. Leave with energy to spare.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Full Body', 'Core', 'EMOM'],
  equipment: ['medicine ball', 'bike', 'dumbbell', 'skipping rope'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'How it felt, any reps missed',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td025Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions:
            '4 rounds, rest 60s. Every rep explosive. Quality over quantity.',
          highlightInstructions: '4 Rounds · Fast and powerful',
          movements: [
            {
              name: 'Medicine Ball Scoop Toss',
              value: '4',
              note: '6–9kg. Throw it up and behind you, or against a wall.',
            },
            { name: 'Rotational Medicine Ball Throw', value: '4 each side' },
            { name: 'Medicine Ball Slams', value: '6', note: '10/6kg.' },
          ],
        },
        {
          name: 'WOD: EMOM 20',
          instructions:
            'Every minute on the minute for 20 minutes, cycling through the 4 stations (5 rounds). Moderate effort, RPE 6. Each station should leave you 20s of rest.',
          highlightInstructions: '5 Rounds · RPE 6',
          movements: [
            { name: 'Min 1: Bike', value: '12/9 cal' },
            { name: 'Min 2: Burpees', value: '8' },
            {
              name: 'Min 3: Dumbbell Push Press',
              value: '10',
              note: '2 x 15/10kg.',
            },
            { name: 'Min 4: Hollow Hold', value: '30s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td025Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td025Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions: '4 rounds, rest 60s. Explosive reps.',
          highlightInstructions: '4 Rounds · Fast and powerful',
          movements: [
            { name: 'Medicine Ball Scoop Toss', value: '4', note: '4–6kg.' },
            { name: 'Rotational Medicine Ball Throw', value: '4 each side' },
            { name: 'Medicine Ball Slams', value: '6', note: '6/4kg.' },
          ],
        },
        {
          name: 'WOD: EMOM 20',
          instructions:
            'Every minute on the minute for 20 minutes, cycling through the 4 stations (5 rounds). Easy to moderate effort.',
          highlightInstructions: '5 Rounds · RPE 6',
          movements: [
            { name: 'Min 1: Bike', value: '9/7 cal' },
            {
              name: 'Min 2: Burpees',
              value: '6',
              note: 'Step back and step up if needed.',
            },
            {
              name: 'Min 3: Dumbbell Push Press',
              value: '10',
              note: '2 x 7.5/5kg.',
            },
            {
              name: 'Min 4: Hollow Hold',
              value: '20s',
              note: 'Tuck the knees to make it easier.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td025Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_026 — Deadlift test                                                    */
/* ========================================================================== */

const td026Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Wake up the posterior chain and rehearse your set-up before you build.',
  movements: [
    '5 mins easy bike, building to a sweat',
    '10 Kettlebell Good Mornings',
    '10 Glute Bridges with 2s squeeze',
    '10 Bird Dogs (5 each side)',
    '2 x 5 Light Romanian Deadlifts',
  ],
};

const td026Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, light only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    '10 Bird Dogs each side',
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td026: StandaloneWorkoutSource = {
  id: 'td_026',
  title: 'Deadlift Test',
  description:
    'Test day. Build to a new heavy deadlift: a one rep max on RX, a three rep max on Scaled. Brace, wedge, push the floor away. Then an easy flush and a long stretch.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength'],
  equipment: ['barbell', 'kettlebell', 'bike', 'rower', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Top lift (kg)', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td026Warmup,
        {
          name: 'Strength: Deadlift 1RM',
          instructions: `Build to a heavy single. Conventional or sumo, whichever is your stronger pull. Lockout means hips and knees fully extended. ${TEST_RULES} Log your heaviest successful lift.`,
          highlightInstructions: '3 attempts above 90% · No rounded back',
          movements: [
            {
              name: 'Build',
              value: '5 / 3 / 2 / 1 reps',
              note: 'Roughly 40% → 60% → 70% → 80% of estimated 1RM. Rest 2 mins.',
            },
            {
              name: 'Opener',
              value: '1 @ ~90%',
              note: 'A weight you are certain you will make.',
            },
            {
              name: 'Attempt 2',
              value: '1 @ ~95–100%',
              note: 'Around your previous best.',
            },
            {
              name: 'Attempt 3',
              value: '1 @ ~100–103%',
              note: 'Only if attempt 2 moved well. Jump 2.5–5kg.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions: 'Not for score. 3 easy rounds. Stay below RPE 5.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['250m easy Row', '10 Air Squats', '20s Dead Hang'],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td026Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td026Warmup,
        {
          name: 'Strength: Deadlift 3RM',
          instructions: `Build to a heavy set of 3. Barbell or trap bar. Reset every rep. ${TEST_RULES} Log the weight of your heaviest successful triple.`,
          highlightInstructions:
            '3 attempts at your heavy triple · No rounded back',
          movements: [
            {
              name: 'Build',
              value: '8 / 5 / 3 / 3 reps',
              note: 'Add weight in steady jumps. Rest 2 mins.',
            },
            {
              name: 'Attempt 1',
              value: '3 reps',
              note: 'A heavy triple you know you will make.',
            },
            {
              name: 'Attempt 2',
              value: '3 reps',
              note: 'Add 5kg if attempt 1 was smooth.',
            },
            {
              name: 'Attempt 3',
              value: '3 reps',
              note: 'Only if attempt 2 moved well. Add 2.5–5kg.',
            },
          ],
        },
        {
          name: 'WOD: Flush',
          instructions: 'Not for score. 3 easy rounds.',
          highlightInstructions: '3 Rounds · Easy',
          movements: ['200m easy Row', '10 Air Squats', '15s Dead Hang'],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td026Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_027 — Solo chipper                                                     */
/* ========================================================================== */

const td027Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy rounds, then practice reps of the chipper movements.',
  movements: [
    '2 Rounds: 250m Row, 10 Air Squats, 10 Push-ups',
    'Practice: 5 Wall Balls, 5 Kettlebell Swings, 3 Burpee Box Jump Overs',
  ],
};

const td027Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '20 Calf Raises'],
};

const td027: StandaloneWorkoutSource = {
  id: 'td_027',
  title: 'Victory Lap',
  description:
    'A chipper to celebrate the hard work. Light carries to start, then rowing, wall balls, kettlebells, box work and a run to finish. Fun, moderate and a good sweat.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Full Body', 'Chipper'],
  equipment: ['rower', 'medicine ball', 'kettlebell', 'box', 'dumbbell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td027Warmup,
        {
          name: 'Strength: Carry Medley',
          instructions:
            '3 rounds, rest 60s between rounds. Moderate weight, no dropping.',
          highlightInstructions: '3 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 24/16kg.' },
            {
              name: 'Front Rack Kettlebell Carry',
              value: '20m',
              note: '2 x 16/12kg.',
            },
            {
              name: 'Single Arm Overhead Carry',
              value: '10m each arm',
              note: '16/12kg.',
            },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 20 minute cap. Moderate effort. This one is for enjoying.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            '500m Row',
            { name: 'Wall Balls', value: '25', note: '9/6kg.' },
            {
              name: 'Kettlebell Swings',
              value: '20',
              note: '24/16kg, Russian (eye level).',
            },
            { name: 'Burpee Box Jump Overs', value: '15', note: '60/50cm.' },
            { type: 'divider' },
            '400m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td027Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td027Warmup,
        {
          name: 'Strength: Carry Medley',
          instructions:
            '3 rounds, rest 60s between rounds. Choose loads you can carry without stopping.',
          highlightInstructions: '3 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 16/12kg.' },
            {
              name: 'Front Rack Kettlebell Carry',
              value: '20m',
              note: '2 x 12/8kg.',
            },
            {
              name: 'Single Arm Overhead Carry',
              value: '10m each arm',
              note: '12/8kg.',
            },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 20 minute cap. Steady and enjoyable.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            '400m Row',
            { name: 'Wall Balls', value: '20', note: '6/4kg.' },
            {
              name: 'Kettlebell Swings',
              value: '15',
              note: '16/12kg, Russian (eye level).',
            },
            { name: 'Burpee Box Step Overs', value: '10', note: '50/40cm.' },
            { type: 'divider' },
            '300m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td027Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_028 — Recovery                                                         */
/* ========================================================================== */

const td028Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Glute Bridges',
  ],
};

const td028Strength: WorkoutBlockBase = {
  name: 'Strength: Light Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, slow tempo. Just moving blood through tired muscles.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Dumbbell Floor Press', value: '10', note: 'Light. 3s lower.' },
    { name: 'Ring Rows', value: '10' },
    { name: 'Glute Bridge March', value: '10 each side' },
  ],
};

const td028Additional: WorkoutBlockBase = {
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

const td028: StandaloneWorkoutSource = {
  id: 'td_028',
  title: 'Unwind',
  description:
    'Pure recovery. Light accessories, an easy Zone 2 piece and an extended stretch. Leave feeling looser than when you came in.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['dumbbell', 'bike', 'rower', 'ski erg', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td028Warmup,
        td028Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Three 8 minute pieces, no rest between them. Conversational pace throughout. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '8 mins' },
            { name: 'Bike', value: '8 mins' },
            {
              name: 'Ski Erg',
              value: '8 mins',
              note: 'No ski erg? 8 mins easy jog or incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td028Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td028Warmup,
        td028Strength,
        {
          name: 'WOD: Zone 2 x 18',
          instructions:
            'Three 6 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '6 mins' },
            { name: 'Bike', value: '6 mins' },
            {
              name: 'Ski Erg',
              value: '6 mins',
              note: 'No ski erg? 6 mins brisk walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td028Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek04: StandaloneWorkoutSource[] = [
  td022,
  td023,
  td024,
  td025,
  td026,
  td027,
  td028,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek04Program: TemperedDailyWeek = {
  id: 'td_week_004',
  weekStart: '2026-11-16',
  blockName: 'The Big Three',
  theme: 'Strength',
  phase: 'Test',
  description:
    'Test week. Squat on Monday, bench on Wednesday, deadlift on Friday. RX builds to a new one rep max, Scaled to a new three rep max. Everything in between is light, fun and designed to keep you fresh for the next test. Log every lift, these are your new numbers. Short on time? Do Monday, Wednesday and Friday, nothing else matters this week.',
  primaryFocus: 'Strength',
  otherFocuses: ['Lower Body', 'Upper Body'],
  nextWeekFocus: 'Engine – Discovery',
  days: ['td_022', 'td_023', 'td_024', 'td_025', 'td_026', 'td_027', 'td_028'],
};
