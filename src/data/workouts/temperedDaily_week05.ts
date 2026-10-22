import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 2: Engine — Week 5: Engine – Discovery             */
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
 * Engine block: the progression lives in the WOD, not the Strength block.
 * Strength is maintenance only (3x5 @ 70% this week). Discovery week sets
 * controlled RPE 8 paces on the row (Mon), bike and ski (Wed) and run (Fri),
 * which are tested properly in the Test week.
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

/* ========================================================================== */
/*  td_029 — Row pacing intervals + back squat                                */
/* ========================================================================== */

const td029Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Raise the heart rate on the rower, open the hips, then rehearse the pace you will hold in the intervals.',
  movements: [
    '4 mins easy Row, building every minute',
    '10 Air Squats',
    '10 Leg Swings each direction each side',
    '5 Inchworms',
    '2 x 5 Empty Bar Back Squats',
    '3 x 15s Row pickups at RPE 8, 45s easy between',
  ],
};

const td029Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Step-ups', value: '8 each leg', note: 'Light. Knee height box.' },
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td029: StandaloneWorkoutSource = {
  id: 'td_029',
  title: 'Split Finder',
  description:
    'Find the rowing pace you can repeat. A few sets of back squats at a steady load, then five 500m pieces at a hard but controlled effort. The goal is the same split on every rep, not the fastest first one.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Cardio', 'Lower Body', 'Intervals'],
  equipment: ['barbell', 'rower', 'box', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'duration',
    label: 'Average 500m split',
    lowerIsBetter: true,
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td029Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '3 sets of 5 at 70% of your estimated 1RM, around RPE 7. Rest 2 mins. Every rep should look the same. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 @ 70% · RPE 7',
          movements: [
            {
              name: 'Back Squat',
              value: '3 x 5',
              note: '70% of estimated 1RM. Rest 2 mins.',
            },
          ],
        },
        {
          name: 'WOD: 5 x 500m Row',
          instructions:
            'Five 500m rows at RPE 8, rest 2 mins between each. Hard, but you should finish every piece knowing you could do one more. Pick a split and hold it. If the last rep is more than 3 seconds slower than the first, you started too fast. Log your average 500m split across all five.',
          highlightInstructions: 'Score: average 500m split · Rest 2:00',
          movements: [
            { name: 'Row', value: '5 x 500m', note: 'RPE 8. Damper 4–6.' },
            { type: 'divider', note: 'Rest 2 mins between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td029Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td029Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '3 sets of 8 at around RPE 6–7. Back squat or goblet squat. Rest 2 mins. Leave 3 good reps in the tank on every set. Record your working weight in your notes.',
          highlightInstructions: '3 x 8 · RPE 6–7',
          movements: [
            {
              name: 'Back Squat or Goblet Squat',
              value: '3 x 8',
              note: 'Rest 2 mins.',
            },
          ],
        },
        {
          name: 'WOD: 5 x 400m Row',
          instructions:
            'Five 400m rows at RPE 8, rest 2 mins between each. Hard but steady. Aim for the same split on every piece. Log your average 500m split from the monitor.',
          highlightInstructions: 'Score: average 500m split · Rest 2:00',
          movements: [
            { name: 'Row', value: '5 x 400m', note: 'RPE 8. Damper 4–6.' },
            { type: 'divider', note: 'Rest 2 mins between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td029Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_030 — Hybrid engine + upper pull                                       */
/* ========================================================================== */

const td030Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Easy jog, open up the hips and shoulders, then one practice lap of the stations.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Band Pull-Aparts',
    '5 Inchworms',
    'Practice: 5 Wall Balls, 10m Sled Push, 5 cal Ski',
  ],
};

const td030Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['12 Dumbbell Hammer Curls', '15 Reverse Flyes'],
};

const td030: StandaloneWorkoutSource = {
  id: 'td_030',
  title: 'Run the Gauntlet',
  description:
    'A race-style hybrid session. Pulling strength first, then three rounds of running, wall balls, sled pushes and the ski erg. Settle into a pace you could hold for half an hour and keep your transitions tidy.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Full Body', 'For Time'],
  equipment: ['pull-up bar', 'dumbbell', 'medicine ball', 'sled', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td030Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions:
            '4 sets, rest 90s after each pair. RPE 7. Strict reps, full hang at the bottom.',
          highlightInstructions: '4 Sets · RPE 7',
          movements: [
            { name: 'Strict Pull-ups', value: '6' },
            { name: 'Single Arm Dumbbell Row', value: '10 each arm' },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            '3 rounds for time at RPE 7–8. A pace you could hold for 30 minutes. Walk into each station, breathe, then go. 30 minute cap.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '800m Run',
            { name: 'Wall Balls', value: '20', note: '9/6kg to a 3m/2.7m target.' },
            {
              name: 'Sled Push',
              value: '20m',
              note: 'Heavy enough to be slow, light enough not to stop. No sled? 20 Dumbbell Walking Lunges, 2 x 22.5/15kg.',
            },
            {
              name: 'Ski Erg',
              value: '15/12 cal',
              note: 'No ski erg? 15/12 cal row.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td030Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td030Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions:
            '4 sets, rest 90s after each pair. RPE 7. Full range on every rep.',
          highlightInstructions: '4 Sets · RPE 7',
          movements: [
            {
              name: 'Banded Pull-ups or Ring Rows',
              value: '6 / 10',
              note: '6 banded pull-ups or 10 ring rows.',
            },
            { name: 'Single Arm Dumbbell Row', value: '10 each arm' },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            '3 rounds for time at a steady, sustainable pace. 30 minute cap.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '600m Run',
            { name: 'Wall Balls', value: '15', note: '6/4kg to a 2.7m/2.5m target.' },
            {
              name: 'Sled Push',
              value: '20m',
              note: 'Lighter load. No sled? 16 Dumbbell Walking Lunges, 2 x 12.5/7.5kg.',
            },
            {
              name: 'Ski Erg',
              value: '12/9 cal',
              note: 'No ski erg? 12/9 cal row.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td030Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_031 — Machine EMOM + strict press                                      */
/* ========================================================================== */

const td031Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Warm the shoulders and trunk, then a few short pickups on each machine.',
  movements: [
    '4 mins easy Bike',
    '10 Scapular Push-ups',
    '15 Band Pull-Aparts',
    '10 Kip Swings on the bar',
    '2 x 10 Empty Bar Strict Press',
    '2 x 10s pickups on the bike and the ski',
  ],
};

const td031Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 3 rounds, rest 45s.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Lateral Raises', value: '12' },
    { name: 'Push-ups', value: '10' },
  ],
};

const td031: StandaloneWorkoutSource = {
  id: 'td_031',
  title: 'Minute Maker',
  description:
    'Strict pressing, then a 24 minute EMOM that cycles the bike, the ski erg and core work. Learn how hard you can push a 45 second effort and still repeat it six times.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Upper Body', 'EMOM'],
  equipment: ['barbell', 'dumbbell', 'bike', 'ski erg', 'pull-up bar', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Total calories', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td031Warmup,
        {
          name: 'Strength: Strict Press',
          instructions:
            '3 sets of 5 at 70% of your estimated 1RM, RPE 7. Rest 2 mins. Squeeze the glutes, no leg drive. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 @ 70% · RPE 7',
          movements: [
            { name: 'Strict Press', value: '3 x 5', note: '70% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: EMOM 24',
          instructions:
            'Every minute on the minute for 24 minutes, cycling the 4 stations (6 rounds). RPE 8 on the machines. Try to keep every round within 2 calories of your first. Score is total calories from the bike and ski.',
          highlightInstructions: 'Score: total calories · 6 Rounds',
          movements: [
            { name: 'Min 1: Bike', value: '45s max cal' },
            { name: 'Min 2: Toes-to-Bar', value: '12' },
            {
              name: 'Min 3: Ski Erg',
              value: '45s max cal',
              note: 'No ski erg? Row.',
            },
            { name: 'Min 4: Rest', value: '60s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td031Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td031Warmup,
        {
          name: 'Strength: Dumbbell Strict Press',
          instructions:
            '3 sets of 8 at RPE 7. Seated or standing. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 8 · RPE 7',
          movements: [{ name: 'Dumbbell Strict Press', value: '3 x 8' }],
        },
        {
          name: 'WOD: EMOM 24',
          instructions:
            'Every minute on the minute for 24 minutes, cycling the 4 stations (6 rounds). Hard but repeatable. Score is total calories from the bike and ski.',
          highlightInstructions: 'Score: total calories · 6 Rounds',
          movements: [
            { name: 'Min 1: Bike', value: '40s max cal' },
            { name: 'Min 2: Hanging Knee Raises', value: '10' },
            {
              name: 'Min 3: Ski Erg',
              value: '40s max cal',
              note: 'No ski erg? Row.',
            },
            { name: 'Min 4: Rest', value: '60s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td031Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_032 — Power clean technique + mixed-modal AMRAP                        */
/* ========================================================================== */

const td032Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Light skipping to raise the heart rate, then an empty bar complex.',
  movements: [
    '3 mins easy skipping',
    '10 Band Pass-Throughs',
    '5 Burpees',
    '2 Rounds: 5 Muscle Cleans, 5 Front Squats, 5 Push Press (empty bar)',
  ],
};

const td032Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 3 rounds, rest 45s.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'GHD Sit-ups', value: '10', note: 'No GHD? 15 sit-ups.' },
    '20s Hollow Hold',
  ],
};

const td032: StandaloneWorkoutSource = {
  id: 'td_032',
  title: 'Spark Plug',
  description:
    'Light power clean technique on the minute, then a 16 minute AMRAP of dumbbell snatches, box jumps, skipping and rowing. Quick feet, smooth breathing, no redlining.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Full Body', 'Olympic Lifting', 'AMRAP'],
  equipment: ['barbell', 'dumbbell', 'box', 'skipping rope', 'rower', 'bands', 'ghd'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 16,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td032Warmup,
        {
          name: 'Strength: Power Clean EMOM',
          instructions:
            'Every minute for 10 minutes, 2 power cleans at 60–65% of your estimated 1RM, RPE 6. Fast elbows, land in a solid quarter squat. This is practice, not a test.',
          highlightInstructions: 'EMOM 10 · RPE 6',
          movements: [
            { name: 'Power Clean', value: '2 reps', note: '60–65% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: AMRAP 16',
          instructions:
            'As many rounds and reps as possible in 16 minutes at RPE 7–8. Keep moving. Short breaks are fine, long ones are not.',
          highlightInstructions: 'Score: rounds + reps · Cap 16 mins',
          movements: [
            {
              name: 'Alternating Dumbbell Snatches',
              value: '10',
              note: '22.5/15kg.',
            },
            { name: 'Box Jumps', value: '12', note: '60/50cm. Step down.' },
            { name: 'Double Unders', value: '30' },
            { name: 'Row', value: '12/9 cal' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td032Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td032Warmup,
        {
          name: 'Strength: Hang Power Clean EMOM',
          instructions:
            'Every minute for 10 minutes, 2 hang power cleans with a light barbell or 2 dumbbell hang cleans. Focus on a fast pull and a quick catch.',
          highlightInstructions: 'EMOM 10 · RPE 6',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '2 reps',
              note: 'Light barbell, or 2 dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 16',
          instructions:
            'As many rounds and reps as possible in 16 minutes at a steady pace.',
          highlightInstructions: 'Score: rounds + reps · Cap 16 mins',
          movements: [
            {
              name: 'Alternating Dumbbell Snatches',
              value: '10',
              note: '15/10kg.',
            },
            { name: 'Box Step-ups', value: '10', note: '50/40cm.' },
            { name: 'Single Unders', value: '50' },
            { name: 'Row', value: '10/7 cal' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td032Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_033 — Deadlift + compromised run ladder                                */
/* ========================================================================== */

const td033Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy run, running drills, then wake up the hinge.',
  movements: [
    '600m easy jog, building',
    '2 x 20m A-Skips',
    '2 x 20m High Knees',
    '10 Kettlebell Good Mornings',
    '2 x 5 Light Romanian Deadlifts',
    '2 x 15s Strides',
  ],
};

const td033Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Leg Romanian Deadlift', value: '8 each leg', note: 'Light dumbbell.' },
    '20 Calf Raises',
  ],
};

const td033: StandaloneWorkoutSource = {
  id: 'td_033',
  title: 'Ladder Climb',
  description:
    'Steady deadlifts, then a run ladder that climbs to 800m and back down, with kettlebell swings between every run. Learn what running on tired legs feels like and find a pace you can hold.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Lower Body', 'Ladder'],
  equipment: ['barbell', 'kettlebell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td033Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '3 sets of 5 at 70% of your estimated 1RM, RPE 7. Rest 2 mins. Reset every rep. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 @ 70% · RPE 7',
          movements: [
            { name: 'Deadlift', value: '3 x 5', note: '70% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: Run Ladder For Time',
          instructions:
            'Run up and down the ladder. After every run, 10 kettlebell swings, then go straight into the next run. RPE 8. The longer runs should not be slower per lap than the short ones. 25 minute cap.',
          highlightInstructions: 'Score: total time · Cap 25 mins',
          movements: [
            '200m Run',
            '400m Run',
            '600m Run',
            '800m Run',
            '600m Run',
            '400m Run',
            '200m Run',
            { type: 'divider', note: 'After every run:' },
            {
              name: 'Kettlebell Swings',
              value: '10',
              note: '24/16kg, Russian (eye level).',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td033Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td033Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '3 sets of 8 at RPE 6–7. Barbell, trap bar or a heavy kettlebell. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 8 · RPE 6–7',
          movements: [{ name: 'Deadlift', value: '3 x 8' }],
        },
        {
          name: 'WOD: Run Ladder For Time',
          instructions:
            'Run up and down the ladder with 10 kettlebell swings after every run. Steady and controlled. 25 minute cap.',
          highlightInstructions: 'Score: total time · Cap 25 mins',
          movements: [
            '100m Run',
            '200m Run',
            '400m Run',
            '600m Run',
            '400m Run',
            '200m Run',
            '100m Run',
            { type: 'divider', note: 'After every run:' },
            {
              name: 'Kettlebell Swings',
              value: '10',
              note: '16/12kg, Russian (eye level).',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td033Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_034 — Long solo chipper                                                */
/* ========================================================================== */

const td034Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Two easy rounds, then a few practice reps of each movement.',
  movements: [
    '2 Rounds: 250m Row, 10 Air Squats, 10 Push-ups, 5 Burpees',
    'Practice: 5 Wall Balls, 5 Kettlebell Swings, 2 Burpee Box Jump Overs',
  ],
};

const td034Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '20 Calf Raises'],
};

const td034: StandaloneWorkoutSource = {
  id: 'td_034',
  title: 'Long Game',
  description:
    'A long, steady chipper with no heavy barbell. Loaded carries first, then rowing, wall balls, running, kettlebells, box work and the ski erg. Think marathon, not sprint.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'Cardio', 'Chipper'],
  equipment: ['rower', 'medicine ball', 'kettlebell', 'box', 'sandbag', 'ski erg', 'dumbbell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td034Warmup,
        {
          name: 'Strength: Carries',
          instructions:
            '3 rounds, rest 60s between rounds. Tall posture, no dropping.',
          highlightInstructions: '3 Rounds · No barbell today',
          movements: [
            {
              name: 'Sandbag Bear Hug Carry',
              value: '40m',
              note: '45/30kg. No sandbag? 2 x 24/16kg front rack kettlebell carry.',
            },
            { name: 'Farmers Carry', value: '40m', note: '2 x 32/24kg.' },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order at RPE 7. Even effort from start to finish. 35 minute cap.',
          highlightInstructions: 'Score: total time · Cap 35 mins',
          movements: [
            '1000m Row',
            { name: 'Wall Balls', value: '40', note: '9/6kg to a 3m/2.7m target.' },
            '800m Run',
            {
              name: 'Kettlebell Swings',
              value: '30',
              note: '24/16kg, Russian (eye level).',
            },
            { name: 'Burpee Box Jump Overs', value: '20', note: '60/50cm.' },
            '800m Run',
            { name: 'Ski Erg', value: '20/15 cal', note: 'No ski erg? 20/15 cal row.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td034Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td034Warmup,
        {
          name: 'Strength: Carries',
          instructions:
            '3 rounds, rest 60s between rounds. Choose loads you can carry without stopping.',
          highlightInstructions: '3 Rounds · No barbell today',
          movements: [
            {
              name: 'Sandbag Bear Hug Carry',
              value: '40m',
              note: '30/20kg. No sandbag? 2 x 16/12kg front rack kettlebell carry.',
            },
            { name: 'Farmers Carry', value: '40m', note: '2 x 20/14kg.' },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order at a steady pace. 35 minute cap.',
          highlightInstructions: 'Score: total time · Cap 35 mins',
          movements: [
            '800m Row',
            { name: 'Wall Balls', value: '30', note: '6/4kg to a 2.7m/2.5m target.' },
            '600m Run',
            {
              name: 'Kettlebell Swings',
              value: '25',
              note: '16/12kg, Russian (eye level).',
            },
            { name: 'Burpee Box Step Overs', value: '15', note: '50/40cm.' },
            '600m Run',
            { name: 'Ski Erg', value: '15/12 cal', note: 'No ski erg? 15/12 cal row.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td034Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_035 — Recovery                                                         */
/* ========================================================================== */

const td035Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Glute Bridges',
  ],
};

const td035Strength: WorkoutBlockBase = {
  name: 'Strength: Tempo Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, 3 seconds down on every rep. RPE 5 max.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Tempo Goblet Squat', value: '8', note: 'Light. 3s lower.' },
    { name: 'Tempo Push-ups', value: '8', note: '3s lower. Hands on a box if needed.' },
    { name: 'Ring Rows', value: '10' },
  ],
};

const td035Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. A longer mobility flow. Take your time.',
  highlightInstructions: 'Optional',
  movements: [
    '10 90/90 Hip Switches each side',
    '10 Cossack Squats (5 each side)',
    '2 mins Dead Hang (accumulate)',
    '2 mins Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
  ],
};

const td035: StandaloneWorkoutSource = {
  id: 'td_035',
  title: 'Soft Pedal',
  description:
    'Easy recovery. Light tempo work, 30 minutes of Zone 2 across three machines and a long stretch. Nasal breathing the whole way. Leave fresher than you arrived.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['kettlebell', 'bike', 'rower', 'pull-up bar', 'box'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, average heart rate, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td035Warmup,
        td035Strength,
        {
          name: 'WOD: Zone 2 x 30',
          instructions:
            'Three 10 minute pieces, no rest between them. Breathe through your nose. If you can not, slow down. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '10 mins' },
            { name: 'Bike', value: '10 mins' },
            { name: 'Easy Jog or Incline Walk', value: '10 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td035Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td035Warmup,
        td035Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Three 8 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '8 mins' },
            { name: 'Bike', value: '8 mins' },
            { name: 'Brisk Walk', value: '8 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td035Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek05: StandaloneWorkoutSource[] = [
  td029,
  td030,
  td031,
  td032,
  td033,
  td034,
  td035,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek05Program: TemperedDailyWeek = {
  id: 'td_week_005',
  weekStart: '2026-11-23',
  blockName: 'Engine',
  theme: 'Metabolic Conditioning',
  phase: 'Discovery',
  description:
    'Welcome to Engine. Four weeks to build a bigger, more repeatable gas tank. This week is about finding your paces. Monday on the rower, Wednesday on the bike and ski, Friday on your feet. Work at RPE 8, hard but repeatable, and write your splits and calories down. Strength stays in, but light, so the conditioning can do the work. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Cardio',
  otherFocuses: ['Full Body', 'Lower Body'],
  nextWeekFocus: 'Engine – Accumulation',
  days: ['td_029', 'td_030', 'td_031', 'td_032', 'td_033', 'td_034', 'td_035'],
};
