import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 2: Engine — Week 7: Engine – Intensification       */
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
 * Intensification week (taper): roughly 40% less conditioning volume, much
 * higher intensity (RPE 9 on short pieces, more rest). Strength drops to
 * 3x3 @ 80% to keep the nervous system sharp without adding fatigue.
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
/*  td_043 — Short, fast row intervals + back squat                           */
/* ========================================================================== */

const td043Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Thorough warmup for a fast day. Build on the rower, then rehearse the sprint start.',
  movements: [
    '5 mins Row: 2 easy, 2 moderate, 1 hard',
    '10 Air Squats',
    '10 Leg Swings each direction each side',
    '2 x 5 Empty Bar Back Squats',
    '3 x 10s Row sprint starts, 50s easy between',
  ],
};

const td043Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Leg Glute Bridge', value: '10 each leg' },
    '30s Hollow Hold',
  ],
};

const td043: StandaloneWorkoutSource = {
  id: 'td_043',
  title: 'Redline Row',
  description:
    'Heavy triples on the back squat, then eight fast 250m rows with plenty of rest. Short, sharp and close to flat out. Push the pace but hold your stroke together.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
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
        td043Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '3 sets of 3 at 80% of your estimated 1RM, RPE 8. Rest 2–3 mins. Use safeties. Record your working weight in your notes.',
          highlightInstructions: '3 x 3 @ 80% · RPE 8',
          movements: [
            { name: 'Back Squat', value: '3 x 3', note: '80% of estimated 1RM. Use safeties.' },
          ],
        },
        {
          name: 'WOD: 8 x 250m Row',
          instructions:
            'Eight 250m rows at RPE 9, rest 1:30 between each. Fast, powerful strokes, rate 30–34. If your split drops off by more than 3 seconds, take an extra 30s rest. Log your average 500m split.',
          highlightInstructions: 'Score: average 500m split · Rest 1:30',
          movements: [
            { name: 'Row', value: '8 x 250m', note: 'RPE 9. Damper 5–7.' },
            { type: 'divider', note: 'Rest 1:30 between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td043Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td043Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            '3 sets of 5 at RPE 7–8. Back squat or goblet squat. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 · RPE 7–8',
          movements: [
            { name: 'Back Squat or Goblet Squat', value: '3 x 5', note: 'Rest 2 mins.' },
          ],
        },
        {
          name: 'WOD: 8 x 200m Row',
          instructions:
            'Eight 200m rows at RPE 8–9, rest 1:30 between each. Fast but controlled. Log your average 500m split.',
          highlightInstructions: 'Score: average 500m split · Rest 1:30',
          movements: [
            { name: 'Row', value: '8 x 200m', note: 'RPE 8–9. Damper 5–7.' },
            { type: 'divider', note: 'Rest 1:30 between pieces.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td043Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_044 — Hybrid sprint AMRAPs + weighted pull                             */
/* ========================================================================== */

const td044Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Jog, drills, then a short build through each station.',
  movements: [
    '400m easy jog',
    '2 x 20m High Knees',
    '10 Band Pull-Aparts',
    '5 Scapular Pull-ups',
    'Practice: 5 Wall Balls, 10m Sled Push, 5 cal Ski',
    '2 x 15s Strides',
  ],
};

const td044Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Incline Dumbbell Curls', value: '10' },
    { name: 'Prone Y Raises', value: '12', note: 'Light plates or no weight.' },
  ],
};

const td044: StandaloneWorkoutSource = {
  id: 'td_044',
  title: 'Sprint Station',
  description:
    'Heavy pulling, then three hard 4 minute AMRAPs of running, wall balls, sled pushes and the ski erg with full rest between. Go hard every round. The rest is there to let you.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'AMRAP'],
  equipment: ['pull-up bar', 'dumbbell', 'medicine ball', 'sled', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 12,
    roundsLabel: 'Total rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td044Warmup,
        {
          name: 'Strength: Weighted Pull-up',
          instructions:
            '4 sets of 3 at RPE 8. Add weight with a belt or a dumbbell between the feet. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '4 x 3 · RPE 8',
          movements: [
            { name: 'Weighted Strict Pull-ups', value: '4 x 3', note: 'No belt? Strict pull-ups, 4 x 5.' },
          ],
        },
        {
          name: 'WOD: 3 x AMRAP 4',
          instructions:
            'Three 4 minute AMRAPs, rest 2 mins between each. RPE 9. Start each AMRAP from the top. Score is total rounds and reps across all three.',
          highlightInstructions: 'Score: total rounds + reps · 3 x 4 mins',
          movements: [
            '200m Run',
            { name: 'Wall Balls', value: '10', note: '9/6kg to a 3m/2.7m target.' },
            {
              name: 'Sled Push',
              value: '10m',
              note: 'Heavy. No sled? 10 Dumbbell Walking Lunges, 2 x 22.5/15kg.',
            },
            { name: 'Ski Erg', value: '8/6 cal', note: 'No ski erg? 8/6 cal row.' },
            { type: 'divider', note: 'Rest 2 mins between AMRAPs.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td044Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td044Warmup,
        {
          name: 'Strength: Pull-up',
          instructions:
            '4 sets of 5 at RPE 8. Banded pull-ups or ring rows with your feet further forward. Rest 2 mins.',
          highlightInstructions: '4 x 5 · RPE 8',
          movements: [
            { name: 'Banded Pull-ups or Ring Rows', value: '4 x 5' },
          ],
        },
        {
          name: 'WOD: 3 x AMRAP 4',
          instructions:
            'Three 4 minute AMRAPs, rest 2 mins between each. Hard effort. Start each AMRAP from the top. Score is total rounds and reps across all three.',
          highlightInstructions: 'Score: total rounds + reps · 3 x 4 mins',
          movements: [
            '150m Run',
            { name: 'Wall Balls', value: '8', note: '6/4kg to a 2.7m/2.5m target.' },
            {
              name: 'Sled Push',
              value: '10m',
              note: 'Lighter load. No sled? 10 Walking Lunges.',
            },
            { name: 'Ski Erg', value: '6/5 cal', note: 'No ski erg? 6/5 cal row.' },
            { type: 'divider', note: 'Rest 2 mins between AMRAPs.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td044Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_045 — 30s machine sprints EMOM + strict press                          */
/* ========================================================================== */

const td045Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Shoulders first, then build to two hard bursts on the bike and ski.',
  movements: [
    '4 mins easy Bike',
    '15 Band Pull-Aparts',
    '10 Scapular Push-ups',
    '10 Kip Swings on the bar',
    '2 x 10 Empty Bar Strict Press',
    '2 x 8s hard bursts on the bike and the ski',
  ],
};

const td045Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Ring Dips', value: '8', note: 'Or bench dips.' },
    { name: 'Dumbbell Rear Delt Flyes', value: '15' },
  ],
};

const td045: StandaloneWorkoutSource = {
  id: 'td_045',
  title: 'Thirty Seconds Flat',
  description:
    'Heavy press triples, then a 16 minute EMOM of 30 second sprints on the bike and ski erg with core and burpees between. Every machine minute is close to flat out.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Upper Body', 'EMOM'],
  equipment: ['barbell', 'dumbbell', 'bike', 'ski erg', 'pull-up bar', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Total calories', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td045Warmup,
        {
          name: 'Strength: Strict Press',
          instructions:
            '3 sets of 3 at 80% of your estimated 1RM, RPE 8. Rest 2–3 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 3 @ 80% · RPE 8',
          movements: [
            { name: 'Strict Press', value: '3 x 3', note: '80% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: EMOM 16',
          instructions:
            'Every minute on the minute for 16 minutes, cycling the 4 stations (4 rounds). The machine minutes are 30 seconds at RPE 9, then rest. Score is total calories from the bike and ski.',
          highlightInstructions: 'Score: total calories · 4 Rounds',
          movements: [
            { name: 'Min 1: Bike', value: '30s max cal' },
            { name: 'Min 2: Toes-to-Bar', value: '10' },
            { name: 'Min 3: Ski Erg', value: '30s max cal', note: 'No ski erg? Row.' },
            { name: 'Min 4: Burpees', value: '8' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td045Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td045Warmup,
        {
          name: 'Strength: Dumbbell Strict Press',
          instructions:
            '3 sets of 5 at RPE 8. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 · RPE 8',
          movements: [{ name: 'Dumbbell Strict Press', value: '3 x 5' }],
        },
        {
          name: 'WOD: EMOM 16',
          instructions:
            'Every minute on the minute for 16 minutes, cycling the 4 stations (4 rounds). Hard 30 second efforts on the machines. Score is total calories from the bike and ski.',
          highlightInstructions: 'Score: total calories · 4 Rounds',
          movements: [
            { name: 'Min 1: Bike', value: '30s max cal' },
            { name: 'Min 2: Hanging Knee Raises', value: '10' },
            { name: 'Min 3: Ski Erg', value: '30s max cal', note: 'No ski erg? Row.' },
            { name: 'Min 4: Burpees', value: '6', note: 'Step back and step up if needed.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td045Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_046 — Clean and jerk technique + thruster ladder                       */
/* ========================================================================== */

const td046Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Raise the heart rate, then an empty bar clean and jerk complex.',
  movements: [
    '3 mins easy skipping',
    '10 Band Pass-Throughs',
    '5 Burpees',
    '2 Rounds: 5 Muscle Cleans, 5 Front Squats, 5 Push Jerks (empty bar)',
  ],
};

const td046Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Weighted Sit-ups', value: '12', note: 'Hold a light plate.' },
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td046: StandaloneWorkoutSource = {
  id: 'td_046',
  title: 'Step Up',
  description:
    'Light clean and jerk technique on the minute, then a 10 minute ladder of dumbbell thrusters and burpees over the dumbbells. Every round gets bigger. How high can you climb?',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Full Body', 'Olympic Lifting', 'Ladder'],
  equipment: ['barbell', 'dumbbell', 'skipping rope', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td046Warmup,
        {
          name: 'Strength: Clean and Jerk EMOM',
          instructions:
            'Every minute for 8 minutes, 1 power clean plus 1 push jerk at 65–70% of your estimated clean and jerk, RPE 7. Crisp and fast.',
          highlightInstructions: 'EMOM 8 · RPE 7',
          movements: [
            {
              name: 'Power Clean + Push Jerk',
              value: '1 + 1',
              note: '65–70% of estimated 1RM.',
            },
          ],
        },
        {
          name: 'WOD: 10 Min Ascending Ladder',
          instructions:
            'Round 1 is 2 thrusters and 2 burpees over the dumbbells, round 2 is 4 and 4, round 3 is 6 and 6, adding 2 each round. Climb as high as you can in 10 minutes at RPE 9. Score is total reps.',
          highlightInstructions: 'Score: total reps · Cap 10 mins',
          movements: [
            { name: 'Dumbbell Thrusters', value: '2, 4, 6, 8...', note: '2 x 22.5/15kg.' },
            { name: 'Burpees over the Dumbbells', value: '2, 4, 6, 8...', note: 'Jump laterally over.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td046Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td046Warmup,
        {
          name: 'Strength: Hang Clean and Press EMOM',
          instructions:
            'Every minute for 8 minutes, 1 hang power clean plus 1 push press with a light barbell or dumbbells. Smooth and fast.',
          highlightInstructions: 'EMOM 8 · RPE 6–7',
          movements: [
            {
              name: 'Hang Power Clean + Push Press',
              value: '1 + 1',
              note: 'Light barbell, or 2 dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: 10 Min Ascending Ladder',
          instructions:
            'Round 1 is 2 thrusters and 2 burpees, round 2 is 4 and 4, adding 2 each round. Climb as high as you can in 10 minutes. Score is total reps.',
          highlightInstructions: 'Score: total reps · Cap 10 mins',
          movements: [
            { name: 'Dumbbell Thrusters', value: '2, 4, 6, 8...', note: '2 x 12.5/7.5kg.' },
            { name: 'Burpees', value: '2, 4, 6, 8...', note: 'Step back and step up if needed.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td046Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_047 — Deadlift + short, fast compromised running                       */
/* ========================================================================== */

const td047Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy run, drills, then build the hinge and a couple of fast strides.',
  movements: [
    '600m easy jog, building',
    '2 x 20m A-Skips',
    '10 Kettlebell Good Mornings',
    '2 x 5 Light Romanian Deadlifts',
    '3 x 20s Strides, building to fast',
  ],
};

const td047Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Leg Calf Raises', value: '12 each leg' },
    { name: 'Bird Dogs', value: '10 each side' },
  ],
};

const td047: StandaloneWorkoutSource = {
  id: 'td_047',
  title: 'Fast Finish',
  description:
    'Heavy deadlift triples, then three quick rounds of a fast 400m run, kettlebell swings and box jumps. Short enough to push hard from the first step.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Lower Body', 'For Time'],
  equipment: ['barbell', 'kettlebell', 'box'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td047Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '3 sets of 3 at 80% of your estimated 1RM, RPE 8. Rest 2–3 mins. Reset every rep. Record your working weight in your notes.',
          highlightInstructions: '3 x 3 @ 80% · RPE 8',
          movements: [
            { name: 'Deadlift', value: '3 x 3', note: '80% of estimated 1RM.' },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            '3 rounds for time at RPE 9. Run hard, then get straight onto the kettlebell. 15 minute cap.',
          highlightInstructions: 'Score: total time · Cap 15 mins',
          movements: [
            '400m Run',
            { name: 'Kettlebell Swings', value: '15', note: '24/16kg, Russian (eye level).' },
            { name: 'Box Jumps', value: '10', note: '60/50cm. Step down.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td047Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td047Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            '3 sets of 5 at RPE 7–8. Barbell, trap bar or a heavy kettlebell. Rest 2 mins. Record your working weight in your notes.',
          highlightInstructions: '3 x 5 · RPE 7–8',
          movements: [{ name: 'Deadlift', value: '3 x 5' }],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions: '3 rounds for time at a hard pace. 15 minute cap.',
          highlightInstructions: 'Score: total time · Cap 15 mins',
          movements: [
            '300m Run',
            { name: 'Kettlebell Swings', value: '12', note: '16/12kg, Russian (eye level).' },
            { name: 'Box Step-ups', value: '10', note: '50/40cm.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td047Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_048 — Short, sharp solo chipper                                        */
/* ========================================================================== */

const td048Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Two easy rounds, then practice reps.',
  movements: [
    '2 Rounds: 1 min easy Bike, 10 Walking Lunges, 5 Push-ups, 5 Burpees',
    'Practice: 5 Dumbbell Snatches each arm, 3 Burpee Broad Jumps',
  ],
};

const td048Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '30s Dead Hang'],
};

const td048: StandaloneWorkoutSource = {
  id: 'td_048',
  title: 'Short Fuse',
  description:
    'A short, fast chipper with no heavy barbell. Light carries to start, then the bike, lunges, running, dumbbell snatches and burpee broad jumps. Under 20 minutes and hard all the way.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Full Body', 'Cardio', 'Chipper'],
  equipment: ['bike', 'dumbbell', 'kettlebell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td048Warmup,
        {
          name: 'Strength: Carries',
          instructions: '2 rounds, rest 60s. Moderate weight, no dropping.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 32/24kg.' },
            { name: 'Single Arm Overhead Carry', value: '15m each arm', note: '16/12kg.' },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order at RPE 8–9. 20 minute cap.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            { name: 'Bike', value: '25/18 cal' },
            { name: 'Walking Lunges', value: '30', note: 'Bodyweight.' },
            '400m Run',
            {
              name: 'Alternating Dumbbell Snatches',
              value: '30',
              note: '22.5/15kg.',
            },
            { name: 'Burpee Broad Jumps', value: '15' },
            '400m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td048Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td048Warmup,
        {
          name: 'Strength: Carries',
          instructions: '2 rounds, rest 60s. Choose loads you can carry without stopping.',
          highlightInstructions: '2 Rounds · No barbell today',
          movements: [
            { name: 'Farmers Carry', value: '40m', note: '2 x 20/14kg.' },
            { name: 'Single Arm Overhead Carry', value: '15m each arm', note: '12/8kg.' },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions: 'Work through the list in order at a hard pace. 20 minute cap.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            { name: 'Bike', value: '18/14 cal' },
            { name: 'Walking Lunges', value: '20', note: 'Bodyweight.' },
            '300m Run',
            {
              name: 'Alternating Dumbbell Snatches',
              value: '20',
              note: '15/10kg.',
            },
            { name: 'Burpees', value: '10', note: 'Step back and step up if needed.' },
            '300m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td048Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_049 — Recovery                                                         */
/* ========================================================================== */

const td049Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 Spiderman Lunges with a reach (5 each side)',
    '10 Glute Bridges',
  ],
};

const td049Strength: WorkoutBlockBase = {
  name: 'Strength: Tempo Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, slow tempo. RPE 5 max.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Tempo Box Squat', value: '8', note: 'Bodyweight. 3s lower, pause on the box.' },
    { name: 'Half Kneeling Dumbbell Press', value: '8 each arm', note: 'Light.' },
    { name: 'Ring Rows', value: '10' },
  ],
};

const td049Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. A longer mobility flow. Take your time.',
  highlightInstructions: 'Optional',
  movements: [
    '10 90/90 Hip Switches each side',
    '10 Thoracic Open Books each side',
    '2 mins Dead Hang (accumulate)',
    '2 mins Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
  ],
};

const td049: StandaloneWorkoutSource = {
  id: 'td_049',
  title: 'Reset Ride',
  description:
    'Pure recovery. Light tempo work, an easy Zone 2 piece on three machines and an extended stretch. Keep it easy enough to chat the whole way through.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['dumbbell', 'bike', 'rower', 'ski erg', 'box', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, average heart rate, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td049Warmup,
        td049Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Three 8 minute pieces, no rest between them. Conversational pace throughout. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Ski Erg', value: '8 mins', note: 'No ski erg? 8 mins easy jog or incline walk.' },
            { name: 'Bike', value: '8 mins' },
            { name: 'Row', value: '8 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td049Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td049Warmup,
        td049Strength,
        {
          name: 'WOD: Zone 2 x 18',
          instructions:
            'Three 6 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Ski Erg', value: '6 mins', note: 'No ski erg? 6 mins brisk walk.' },
            { name: 'Bike', value: '6 mins' },
            { name: 'Row', value: '6 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td049Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek07: StandaloneWorkoutSource[] = [
  td043,
  td044,
  td045,
  td046,
  td047,
  td048,
  td049,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek07Program: TemperedDailyWeek = {
  id: 'td_week_007',
  weekStart: '2026-12-07',
  blockName: 'Engine',
  theme: 'Metabolic Conditioning',
  phase: 'Intensification',
  description:
    'Less volume, more speed. Every WOD is shorter this week, but the efforts are harder and the rest is longer. Treat the work intervals as close to flat out and use every second of rest. Strength drops to heavy triples to keep you sharp without adding fatigue. Sleep well and eat well, next week you test. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Cardio',
  otherFocuses: ['Full Body', 'Lower Body'],
  nextWeekFocus: 'Engine – Test',
  days: ['td_043', 'td_044', 'td_045', 'td_046', 'td_047', 'td_048', 'td_049'],
};
