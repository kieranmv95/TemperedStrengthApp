import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 2: Engine — Week 6: Engine – Accumulation          */
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
 * Accumulation week: the most conditioning volume of the block. Longer
 * intervals at RPE 7–8, the longest WODs (race-style chipper, EMOM 30,
 * AMRAP 35). Strength stays maintenance at 4x5 @ 72%.
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
/*  td_036 — 1000m row intervals + back squat                                 */
/* ========================================================================== */

const td036Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Build on the rower, open the hips, then a couple of short pickups at working pace.',
  movements: [
    '4 mins easy Row, building every minute',
    '10 Air Squats',
    '10 Cossack Squats (5 each side)',
    '5 Inchworms',
    '2 x 5 Empty Bar Back Squats',
    '2 x 20s Row pickups at RPE 7–8, 40s easy between',
  ],
};

const td036Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Copenhagen Plank', value: '20s each side', note: 'Knee on the bench to make it easier.' },
    { name: 'Glute Bridge', value: '15', note: '2s squeeze at the top.' },
  ],
};

const td036: StandaloneWorkoutSource = {
  id: 'td_036',
  title: 'Thousand Club',
  description:
    'Back squats at a steady load, then four 1000m rows with short rest. Long enough to hurt, short enough to hold form. Settle into a split early and protect it.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Lower Body', 'Intervals'],
  equipment: ['barbell', 'rower'],
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
        td036Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '4 sets of 5 at 72% of your estimated 1RM, around RPE 7. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 5 @ 72% · RPE 7',
          movements: [
            { name: 'Back Squat', value: '4 x 5', note: '72% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: 4 x 1000m Row',
          instructions:
            'Four 1000m rows at RPE 7–8, rest 2:30 between each. The third piece is the hard one. Stay patient and keep the stroke rate around 26–28. Log your average 500m split across all four.',
          highlightInstructions: 'Score: average 500m split · Rest 2:30',
          movements: [
            { name: 'Row', value: '4 x 1000m', note: 'RPE 7–8. Damper 4–6.' },
            { type: 'divider', note: 'Rest 2:30 between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td036Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td036Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '4 sets of 8 at around RPE 7. Back squat or goblet squat. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · RPE 7',
          movements: [
            { name: 'Back Squat or Goblet Squat', value: '4 x 8', note: 'Rest 2 mins.' },
          ],
        },
        {
          name: 'WOD: 4 x 750m Row',
          instructions:
            'Four 750m rows at RPE 7–8, rest 2:30 between each. Steady stroke rate, same split every piece. Log your average 500m split.',
          highlightInstructions: 'Score: average 500m split · Rest 2:30',
          movements: [
            { name: 'Row', value: '4 x 750m', note: 'RPE 7–8. Damper 4–6.' },
            { type: 'divider', note: 'Rest 2:30 between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td036Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_037 — Race-style chipper + upper pull                                  */
/* ========================================================================== */

const td037Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy jog, dynamic stretches, then one short practice of each station.',
  movements: [
    '600m easy jog',
    '10 Walking Lunges with a twist',
    '10 Band Pull-Aparts',
    '5 Inchworms',
    'Practice: 5 cal Ski, 10m Sled Push, 6 Walking Lunges, 5 Wall Balls',
  ],
};

const td037Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Face Pulls', value: '15', note: 'Cable or band.' },
    { name: 'Dumbbell Hammer Curls', value: '12' },
  ],
};

const td037: StandaloneWorkoutSource = {
  id: 'td_037',
  title: 'Race Rehearsal',
  description:
    'A race-style hybrid chipper. Pulling strength first, then four runs with a station after each: ski erg, sled push, walking lunges and wall balls. Practise steady running on tired legs and fast, calm transitions.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Full Body', 'Chipper'],
  equipment: ['pull-up bar', 'barbell', 'ski erg', 'sled', 'sandbag', 'dumbbell', 'medicine ball', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td037Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions:
            '4 sets, rest 90s after each pair. RPE 7. Keep the torso still on the rows.',
          highlightInstructions: '4 Sets · RPE 7',
          movements: [
            { name: 'Strict Pull-ups', value: '6' },
            { name: 'Bent Over Barbell Row', value: '8', note: 'Around RPE 7.' },
          ],
        },
        {
          name: 'WOD: Race Chipper For Time',
          instructions:
            'Run, then station, four times. RPE 7–8 on the runs, the same pace every time. No resting on the stations if you can help it. 40 minute cap.',
          highlightInstructions: 'Score: total time · Cap 40 mins',
          movements: [
            '800m Run',
            { name: 'Ski Erg', value: '25/20 cal', note: 'No ski erg? 25/20 cal row.' },
            '800m Run',
            {
              name: 'Sled Push',
              value: '40m',
              note: 'Heavy but moving. No sled? 40 Dumbbell Walking Lunges, 2 x 22.5/15kg.',
            },
            '800m Run',
            {
              name: 'Sandbag Walking Lunges',
              value: '40',
              note: '20/15kg on the shoulders. No sandbag? Dumbbells, 2 x 15/10kg.',
            },
            '800m Run',
            { name: 'Wall Balls', value: '50', note: '9/6kg to a 3m/2.7m target.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td037Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td037Warmup,
        {
          name: 'Strength: Upper Pull',
          instructions: '4 sets, rest 90s after each pair. RPE 7.',
          highlightInstructions: '4 Sets · RPE 7',
          movements: [
            {
              name: 'Banded Pull-ups or Ring Rows',
              value: '6 / 10',
              note: '6 banded pull-ups or 10 ring rows.',
            },
            { name: 'Bent Over Dumbbell Row', value: '10' },
          ],
        },
        {
          name: 'WOD: Race Chipper For Time',
          instructions:
            'Run, then station, four times. Steady runs, steady stations. 40 minute cap.',
          highlightInstructions: 'Score: total time · Cap 40 mins',
          movements: [
            '600m Run',
            { name: 'Ski Erg', value: '18/14 cal', note: 'No ski erg? 18/14 cal row.' },
            '600m Run',
            {
              name: 'Sled Push',
              value: '30m',
              note: 'Lighter load. No sled? 30 Walking Lunges.',
            },
            '600m Run',
            {
              name: 'Walking Lunges',
              value: '30',
              note: 'Bodyweight, or 2 x 7.5/5kg dumbbells.',
            },
            '600m Run',
            { name: 'Wall Balls', value: '40', note: '6/4kg to a 2.7m/2.5m target.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td037Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_038 — Long machine + gymnastics EMOM + strict press                    */
/* ========================================================================== */

const td038Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Warm the shoulders and wrists, then pickups on both machines.',
  movements: [
    '4 mins easy Row',
    '10 Scapular Push-ups',
    '10 Banded External Rotations each side',
    '10 Pike Push-ups',
    '2 x 10 Empty Bar Strict Press',
    '2 x 10s pickups on the row and the ski',
  ],
};

const td038Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 3 rounds, rest 45s.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Skull Crushers', value: '12' },
    { name: 'Plank Shoulder Taps', value: '20' },
  ],
};

const td038: StandaloneWorkoutSource = {
  id: 'td_038',
  title: 'Thirty Strong',
  description:
    'Strict pressing, then a 30 minute EMOM across the rower, burpees, the ski erg and handstand push-ups. A long, honest piece that rewards even pacing over heroics.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Upper Body', 'EMOM'],
  equipment: ['barbell', 'dumbbell', 'rower', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Total calories', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td038Warmup,
        {
          name: 'Strength: Strict Press',
          instructions:
            '4 sets of 5 at 72% of your estimated 1RM, RPE 7. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 5 @ 72% · RPE 7',
          movements: [
            { name: 'Strict Press', value: '4 x 5', note: '72% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: EMOM 30',
          instructions:
            'Every minute on the minute for 30 minutes, cycling the 5 stations (6 rounds). RPE 7–8 on the machines. The same calories in round 6 as round 1 is a great score. Score is total calories from the row and ski.',
          highlightInstructions: 'Score: total calories · 6 Rounds',
          movements: [
            { name: 'Min 1: Row', value: '45s max cal' },
            { name: 'Min 2: Burpees', value: '10' },
            { name: 'Min 3: Ski Erg', value: '45s max cal', note: 'No ski erg? Bike.' },
            { name: 'Min 4: Handstand Push-ups', value: '6', note: 'Strict or kipping.' },
            { name: 'Min 5: Rest', value: '60s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td038Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td038Warmup,
        {
          name: 'Strength: Dumbbell Strict Press',
          instructions:
            '4 sets of 8 at RPE 7. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · RPE 7',
          movements: [{ name: 'Dumbbell Strict Press', value: '4 x 8' }],
        },
        {
          name: 'WOD: EMOM 30',
          instructions:
            'Every minute on the minute for 30 minutes, cycling the 5 stations (6 rounds). Steady and repeatable. Score is total calories from the row and ski.',
          highlightInstructions: 'Score: total calories · 6 Rounds',
          movements: [
            { name: 'Min 1: Row', value: '40s max cal' },
            { name: 'Min 2: Burpees', value: '8', note: 'Step back and step up if needed.' },
            { name: 'Min 3: Ski Erg', value: '40s max cal', note: 'No ski erg? Bike.' },
            { name: 'Min 4: Pike Push-ups', value: '8', note: 'Feet on a box to make it harder.' },
            { name: 'Min 5: Rest', value: '60s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td038Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_039 — Power snatch technique + four Tabatas                            */
/* ========================================================================== */

const td039Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Raise the heart rate, open the overhead position, then an empty bar snatch complex.',
  movements: [
    '3 mins easy Bike',
    '10 Band Pass-Throughs',
    '10 Overhead Squats with a band or empty bar',
    '2 Rounds: 5 Snatch Grip Deadlifts, 5 Muscle Snatches, 5 Overhead Squats (empty bar)',
  ],
};

const td039Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'GHD Hip Extensions', value: '12', note: 'No GHD? 12 Kettlebell Good Mornings.' },
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td039: StandaloneWorkoutSource = {
  id: 'td_039',
  title: 'Twenty Ten',
  description:
    'Light power snatch technique on the minute, then four Tabatas back to back: bike, burpees, kettlebell swings and hollow rocks. Twenty seconds hard, ten seconds rest, thirty two times.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 55,
  tags: ['Full Body', 'Olympic Lifting', 'Tabata'],
  equipment: ['barbell', 'dumbbell', 'bike', 'kettlebell', 'bands', 'ghd'],
  isPremium: true,
  logSchema: {
    kind: 'max_reps',
    label: 'Total reps and calories',
    higherIsBetter: true,
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td039Warmup,
        {
          name: 'Strength: Power Snatch EMOM',
          instructions:
            'Every minute for 10 minutes, 2 power snatches at 60% of your estimated 1RM, RPE 6. Fast under the bar, lock out and stand tall.',
          highlightInstructions: 'EMOM 10 · RPE 6',
          movements: [
            { name: 'Power Snatch', value: '2 reps', note: '60% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: 4 x Tabata',
          instructions:
            'Four Tabatas, each 8 rounds of 20s work and 10s rest. Rest 1 min between Tabatas. Count every rep and calorie. Score is the total across all 32 rounds.',
          highlightInstructions: 'Score: total reps + calories · 19 mins',
          movements: [
            { name: 'Tabata 1: Bike', value: 'Max cal' },
            { name: 'Tabata 2: Burpees', value: 'Max reps' },
            { name: 'Tabata 3: Kettlebell Swings', value: 'Max reps', note: '24/16kg, Russian.' },
            { name: 'Tabata 4: Hollow Rocks', value: 'Max reps' },
            { type: 'divider', note: '20s on, 10s off, 8 rounds each. 1 min rest between.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td039Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td039Warmup,
        {
          name: 'Strength: Dumbbell Snatch EMOM',
          instructions:
            'Every minute for 10 minutes, 2 dumbbell snatches each arm, or 2 hang power snatches with a light bar. Smooth and fast.',
          highlightInstructions: 'EMOM 10 · RPE 6',
          movements: [
            {
              name: 'Dumbbell Snatch',
              value: '2 each arm',
              note: 'Or 2 light hang power snatches.',
            },
          ],
        },
        {
          name: 'WOD: 4 x Tabata',
          instructions:
            'Four Tabatas, each 8 rounds of 20s work and 10s rest. Rest 1 min between Tabatas. Score is the total across all 32 rounds.',
          highlightInstructions: 'Score: total reps + calories · 19 mins',
          movements: [
            { name: 'Tabata 1: Bike', value: 'Max cal' },
            { name: 'Tabata 2: Burpees', value: 'Max reps', note: 'Step back and step up if needed.' },
            { name: 'Tabata 3: Kettlebell Swings', value: 'Max reps', note: '16/12kg, Russian.' },
            { name: 'Tabata 4: Tuck Rocks', value: 'Max reps' },
            { type: 'divider', note: '20s on, 10s off, 8 rounds each. 1 min rest between.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td039Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_040 — Deadlift + compromised running rounds                            */
/* ========================================================================== */

const td040Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy run, drills, then build the hinge.',
  movements: [
    '600m easy jog, building',
    '2 x 20m A-Skips',
    '2 x 20m Butt Kicks',
    '10 Glute Bridges with 2s squeeze',
    '2 x 5 Light Romanian Deadlifts',
    '2 x 15s Strides',
  ],
};

const td040Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Nordic Curl Negatives', value: '5', note: 'Feet anchored. Lower as slowly as you can.' },
    { name: 'Tibialis Raises', value: '15', note: 'Back against a wall.' },
  ],
};

const td040: StandaloneWorkoutSource = {
  id: 'td_040',
  title: 'Five Alive',
  description:
    'Steady deadlifts, then five rounds of rowing, burpees and a 600m run. Your legs and lungs are already working when the run starts. Hold the same run pace every round.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Lower Body', 'For Time'],
  equipment: ['barbell', 'rower'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td040Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '4 sets of 5 at 72% of your estimated 1RM, RPE 7. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 5 @ 72% · RPE 7',
          movements: [
            { name: 'Deadlift', value: '4 x 5', note: '72% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: 5 Rounds For Time',
          instructions:
            '5 rounds for time at RPE 8. Get off the floor after the burpees and run straight away. 30 minute cap.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            { name: 'Row', value: '15/12 cal' },
            { name: 'Burpees', value: '10' },
            '600m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td040Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td040Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '4 sets of 8 at RPE 7. Barbell, trap bar or a heavy kettlebell. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · RPE 7',
          movements: [{ name: 'Deadlift', value: '4 x 8' }],
        },
        {
          name: 'WOD: 5 Rounds For Time',
          instructions: '5 rounds for time at a steady pace. 30 minute cap.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            { name: 'Row', value: '12/9 cal' },
            { name: 'Burpees', value: '8', note: 'Step back and step up if needed.' },
            '400m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td040Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_041 — Long solo AMRAP                                                  */
/* ========================================================================== */

const td041Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Two easy rounds, then practice reps of each movement.',
  movements: [
    '2 Rounds: 200m Run, 10 Air Squats, 10 Push-ups, 10 Sit-ups',
    'Practice: 5 Wall Balls, 5 Kettlebell Swings, 4 Dumbbell Step-ups',
  ],
};

const td041Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '10 Push-ups'],
};

const td041: StandaloneWorkoutSource = {
  id: 'td_041',
  title: 'Steady State',
  description:
    'A long 35 minute AMRAP with no heavy barbell. Running, wall balls, kettlebell swings, step-ups and the bike. Find a rhythm you can hold for the full time and just keep moving.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'Cardio', 'AMRAP'],
  equipment: ['kettlebell', 'sandbag', 'medicine ball', 'dumbbell', 'box', 'bike'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 35,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td041Warmup,
        {
          name: 'Strength: Carries',
          instructions: '2 rounds, rest 60s. Tall and braced.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Suitcase Carry', value: '20m each arm', note: '32/24kg.' },
            {
              name: 'Sandbag Front Carry',
              value: '40m',
              note: '45/30kg. No sandbag? 2 x 24/16kg front rack kettlebell carry.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 35',
          instructions:
            'As many rounds and reps as possible in 35 minutes at RPE 7. Each round should take about 4 minutes. If you are slowing down a lot, you started too fast.',
          highlightInstructions: 'Score: rounds + reps · Cap 35 mins',
          movements: [
            '400m Run',
            { name: 'Wall Balls', value: '20', note: '9/6kg to a 3m/2.7m target.' },
            { name: 'Kettlebell Swings', value: '15', note: '24/16kg, Russian.' },
            {
              name: 'Dumbbell Box Step-ups',
              value: '10',
              note: '2 x 22.5/15kg to a 60/50cm box. Alternate legs.',
            },
            { name: 'Bike', value: '15/11 cal' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td041Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td041Warmup,
        {
          name: 'Strength: Carries',
          instructions: '2 rounds, rest 60s. Choose loads you can carry without stopping.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Suitcase Carry', value: '20m each arm', note: '20/14kg.' },
            {
              name: 'Sandbag Front Carry',
              value: '40m',
              note: '30/20kg. No sandbag? 2 x 16/12kg front rack kettlebell carry.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 35',
          instructions:
            'As many rounds and reps as possible in 35 minutes at a steady pace.',
          highlightInstructions: 'Score: rounds + reps · Cap 35 mins',
          movements: [
            '300m Run',
            { name: 'Wall Balls', value: '15', note: '6/4kg to a 2.7m/2.5m target.' },
            { name: 'Kettlebell Swings', value: '12', note: '16/12kg, Russian.' },
            { name: 'Box Step-ups', value: '10', note: '50/40cm. Bodyweight or light dumbbells.' },
            { name: 'Bike', value: '12/9 cal' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td041Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_042 — Recovery                                                         */
/* ========================================================================== */

const td042Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy row',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Dead Bugs',
  ],
};

const td042Strength: WorkoutBlockBase = {
  name: 'Strength: Tempo Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, slow tempo. RPE 5 max.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Tempo Split Squat', value: '6 each leg', note: 'Bodyweight. 3s lower.' },
    { name: 'Dumbbell Floor Press', value: '10', note: 'Light. 3s lower.' },
    { name: 'Band Pull-Aparts', value: '15' },
  ],
};

const td042Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. A longer mobility flow. Take your time.',
  highlightInstructions: 'Optional',
  movements: [
    '10 90/90 Hip Switches each side',
    '10 Jefferson Curls with a light plate',
    '10 Thread the Needle each side',
    '2 mins Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
  ],
};

const td042: StandaloneWorkoutSource = {
  id: 'td_042',
  title: 'Low and Slow',
  description:
    'Recovery with a longer aerobic piece. Light tempo work, 36 minutes of easy Zone 2 across three machines and a long stretch. Slow is the point.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['dumbbell', 'rower', 'bike', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, average heart rate, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td042Warmup,
        td042Strength,
        {
          name: 'WOD: Zone 2 x 36',
          instructions:
            'Three 12 minute pieces, no rest between them. Nasal breathing only. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '12 mins' },
            { name: 'Row', value: '12 mins' },
            {
              name: 'Ski Erg',
              value: '12 mins',
              note: 'No ski erg? 12 mins easy jog or incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td042Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td042Warmup,
        td042Strength,
        {
          name: 'WOD: Zone 2 x 27',
          instructions:
            'Three 9 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '9 mins' },
            { name: 'Row', value: '9 mins' },
            {
              name: 'Ski Erg',
              value: '9 mins',
              note: 'No ski erg? 9 mins brisk walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td042Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek06: StandaloneWorkoutSource[] = [
  td036,
  td037,
  td038,
  td039,
  td040,
  td041,
  td042,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek06Program: TemperedDailyWeek = {
  id: 'td_week_006',
  weekStart: '2026-11-30',
  blockName: 'Engine',
  theme: 'Metabolic Conditioning',
  phase: 'Accumulation',
  description:
    'The big week. This is where the engine gets built. Intervals get longer, WODs get longer and the total work goes up across every day. Keep almost everything at RPE 7–8. You should finish each session tired but not wrecked. Saturday is a 35 minute grind and Sunday is a longer easy flush. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Cardio',
  otherFocuses: ['Full Body', 'Lower Body'],
  nextWeekFocus: 'Engine – Intensification',
  days: ['td_036', 'td_037', 'td_038', 'td_039', 'td_040', 'td_041', 'td_042'],
};
