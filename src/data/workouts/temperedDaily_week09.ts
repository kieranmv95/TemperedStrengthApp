import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 3: Power — Week 9: Power – Discovery               */
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
 * Power block: the progression lives in the Strength block (jumps, cleans,
 * push press / jerk, speed pulls, hang snatches). Loads sit around 30–70% of
 * 1RM — every rep should be snappy. The WOD is a short alactic finisher
 * (~10 seconds of work), not an engine piece.
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

const POWER_INTENT =
  'Every rep should be fast and crisp. If the bar slows down, the catch gets messy or the landing gets noisy, take weight off. Intent beats load.';

/* ========================================================================== */
/*  td_057 — Jumps + power cleans                                             */
/* ========================================================================== */

const td057Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Get hot, open the hips and ankles, then rehearse light jump and clean patterns.',
  movements: [
    '3 mins easy bike or row',
    '10 Leg Swings each direction each side',
    '10 Air Squats',
    '5 Inchworms',
    '3 Broad Jumps, stick the landing',
    'Empty Bar: 5 Muscle Cleans, 5 Front Squats, 5 Hang Power Cleans',
  ],
};

const td057Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s. Light only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Side Plank', value: '30s each side' },
    { name: 'Dead Bugs', value: '8 each side' },
  ],
};

const td057: StandaloneWorkoutSource = {
  id: 'td_057',
  title: 'Fast Off the Floor',
  description:
    'Find jump distance and clean speed. Broad jump practice, then power cleans that stay snappy at a moderate load. Finish with short bike sprints — ten seconds of work, full recovery.',
  estimatedTime: 55,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Lower Body', 'Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'bike', 'box'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Best broad jump (m), clean working weight, best bike bout',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td057Warmup,
        {
          name: 'Strength: Broad Jumps',
          instructions:
            '3 sets of 3 standing broad jumps. Full reset between reps. Stick every landing. Rest 60–90s. Write down your best distance.',
          highlightInstructions: '3 x 3 · Stick the landing',
          movements: [
            {
              name: 'Standing Broad Jump',
              value: '3 x 3',
              note: 'Measure toe-to-heel. Soft knees on landing.',
            },
          ],
        },
        {
          name: 'Strength: Power Clean',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} Build with a few singles to a fast working weight around {{45-55}} of your estimated power clean 1RM (RPE 6). Then 5 sets of 2 at that load. Rest 90–120s.`,
          highlightInstructions: '5 x 2 @ {{45-55}} · Fast singles first',
          movements: [
            { type: 'divider', note: 'Build · singles · based on 1RM' },
            '{{40}}',
            '{{45}}',
            '{{50-55}}',
            { type: 'divider', note: 'Stop when it still feels fast.' },
            {
              name: 'Working sets',
              value: '5 x 2',
              note: 'Full reset between reps. Elbows fast in the catch.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '8 rounds: 10 seconds all-out bike, 50 seconds easy. Score is your best calories in any 10 second bout. Legs still have to feel springy — this is not an engine piece.',
          highlightInstructions: '8 x 10s · Rest 50s · Best bout cals',
          movements: [
            {
              name: 'Bike Sprint',
              value: '10s',
              note: 'Max effort. Seated or standing.',
            },
            { type: 'divider', note: '50s easy spin between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td057Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td057Warmup,
        {
          name: 'Strength: Broad Jumps',
          instructions:
            '3 sets of 3 standing broad jumps or line hops. Full reset. Stick every landing. Rest 60–90s.',
          highlightInstructions: '3 x 3 · Stick the landing',
          movements: [
            {
              name: 'Standing Broad Jump or Line Hop',
              value: '3 x 3',
              note: 'Shorter distance is fine. Soft landings.',
            },
          ],
        },
        {
          name: 'Strength: Power Clean',
          instructions: `${POWER_INTENT} Use a light barbell or dumbbells. 5 sets of 2 hang power cleans. Every rep fast. Rest 90s.`,
          highlightInstructions: '5 x 2 Hang Power Clean · Light and fast',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '5 x 2',
              note: 'Barbell or 2 dumbbells. Hang from just above the knee.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '6 rounds: 10 seconds hard bike, 50 seconds easy. Best calories in any bout.',
          highlightInstructions: '6 x 10s · Rest 50s · Best bout cals',
          movements: [
            { name: 'Bike Sprint', value: '10s', note: 'Hard effort.' },
            { type: 'divider', note: '50s easy spin between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td057Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_058 — Hang high pulls + trunk                                          */
/* ========================================================================== */

const td058Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Raise the heart rate, open the upper back, then light pull patterns.',
  movements: [
    '3 mins easy row',
    '10 Band Pull-Aparts',
    '10 World’s Greatest Stretch (5 each side)',
    '5 Inchworms',
    'Empty Bar: 5 Hang Muscle Cleans, 5 Hang High Pulls',
  ],
};

const td058Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Arm Farmer Carry', value: '20m each side' },
    { name: 'Hollow Hold', value: '20s' },
  ],
};

const td058: StandaloneWorkoutSource = {
  id: 'td_058',
  title: 'Pull Tall',
  description:
    'Hang clean high pulls to train vertical drive without a heavy catch, then a short med-ball slam finisher. Trunk stays honest. Speed over load.',
  estimatedTime: 50,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Full Body', 'Upper Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'medicine ball', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'High pull weight, best slam bout',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td058Warmup,
        {
          name: 'Strength: Hang Clean High Pull',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} 4 sets of 3 hang clean high pulls at {{50}} of your estimated power clean 1RM (RPE 6). Elbows high, bar close. Rest 90s. Then 3 sets of 8 hollow rocks.`,
          highlightInstructions: '4 x 3 @ {{50}} · Then hollow rocks',
          movements: [
            {
              name: 'Hang Clean High Pull',
              value: '4 x 3',
              note: 'Hang above the knee. Finish tall on the toes.',
            },
            {
              name: 'Hollow Rock',
              value: '3 x 8',
              note: 'Rest 45s. Ribs down.',
            },
          ],
        },
        {
          name: 'WOD: Med-Ball Slams',
          instructions:
            '6 rounds: 10 seconds of med-ball slams, 50 seconds rest. Aggressive and tall. Score is total slams across all bouts.',
          highlightInstructions: '6 x 10s · Rest 50s · Total slams',
          movements: [
            {
              name: 'Medicine Ball Slam',
              value: '10s',
              note: '9/6kg. Full extension every rep.',
            },
            { type: 'divider', note: '50s rest between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td058Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td058Warmup,
        {
          name: 'Strength: Hang High Pull',
          instructions: `${POWER_INTENT} 4 sets of 3 hang high pulls with a light barbell or dumbbells. Then 3 sets of 8 dead bugs each side.`,
          highlightInstructions: '4 x 3 · Light and tall',
          movements: [
            {
              name: 'Hang High Pull',
              value: '4 x 3',
              note: 'Barbell or 2 dumbbells.',
            },
            {
              name: 'Dead Bugs',
              value: '3 x 8 each side',
              note: 'Rest 45s.',
            },
          ],
        },
        {
          name: 'WOD: Med-Ball Slams',
          instructions:
            '6 rounds: 10 seconds of med-ball slams or ball to floor, 50 seconds rest. Count total reps.',
          highlightInstructions: '6 x 10s · Rest 50s · Total reps',
          movements: [
            {
              name: 'Medicine Ball Slam',
              value: '10s',
              note: 'Light ball. Or dumbbell ground-to-shoulder fast.',
            },
            { type: 'divider', note: '50s rest between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td058Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_059 — Push press + jerk                                                */
/* ========================================================================== */

const td059Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Warm the shoulders and legs, then empty-bar push press and footwork drills.',
  movements: [
    '3 mins easy bike',
    '10 Band Pull-Aparts',
    '10 Thoracic Open Books each side',
    '5 Inchworms',
    'Empty Bar: 5 Push Presses, 5 Split Jerks each side (footwork only)',
  ],
};

const td059Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Face Pulls', value: '12', note: 'Band or cable. Light.' },
    { name: 'Side Plank', value: '25s each side' },
  ],
};

const td059: StandaloneWorkoutSource = {
  id: 'td_059',
  title: 'Drive Overhead',
  description:
    'Push press for leg drive, then light split jerk technique. Finish with short sled or bike sprints. Moderate load, moved fast.',
  estimatedTime: 55,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Upper Body', 'Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'sled', 'bike', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Push press weight, jerk notes, best sprint bout',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td059Warmup,
        {
          name: 'Strength: Push Press',
          loadExerciseId: 115,
          instructions: `${POWER_INTENT} 4 sets of 3 push press at {{45-55}} of your estimated push press 1RM (RPE 6–7). Dip straight, drive tall. Rest 90s.`,
          highlightInstructions: '4 x 3 @ {{45-55}}',
          movements: [
            {
              name: 'Push Press',
              value: '4 x 3',
              note: 'No press-out grind. If the lockout slows, drop weight.',
            },
          ],
        },
        {
          name: 'Strength: Split Jerk',
          loadExerciseId: 66,
          instructions: `${POWER_INTENT} 6 singles at {{45-55}} of your estimated jerk 1RM. Alternate lead leg each rep or stick your strong side and note it. Rest as needed — quality only.`,
          highlightInstructions: '6 x 1 @ {{45-55}} · Technique',
          movements: [
            {
              name: 'Split Jerk',
              value: '6 x 1',
              note: 'Fast feet, locked elbows. Same load band as the push press is fine.',
            },
          ],
        },
        {
          name: 'WOD: Sled Sprints',
          instructions:
            '8 rounds: 10m hard sled push, walk back easy. About 10 seconds of work. No sled? 10 seconds all-out bike instead. Log best feel / bike cals.',
          highlightInstructions: '8 x 10m · Walk back recover',
          movements: [
            {
              name: 'Sled Push',
              value: '10m',
              note: 'Moderate load, moved fast. No sled? 10s bike sprint.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td059Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td059Warmup,
        {
          name: 'Strength: Push Press',
          instructions: `${POWER_INTENT} 4 sets of 3 dumbbell or light barbell push press. Rest 90s.`,
          highlightInstructions: '4 x 3 · Light and fast',
          movements: [
            {
              name: 'Dumbbell Push Press',
              value: '4 x 3',
              note: 'Or empty / light barbell.',
            },
          ],
        },
        {
          name: 'Strength: Push Press Singles',
          instructions:
            'Skip the split jerk if you are new to it. 6 fast push press singles with the same light load. Rest as needed.',
          highlightInstructions: '6 x 1 · Fast lockout',
          movements: [
            {
              name: 'Push Press',
              value: '6 x 1',
              note: 'Dumbbells or light bar.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '6 rounds: 10 seconds hard bike, 50 seconds easy. Best bout calories.',
          highlightInstructions: '6 x 10s · Rest 50s',
          movements: [
            { name: 'Bike Sprint', value: '10s' },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td059Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_060 — Bounds + DB power                                                */
/* ========================================================================== */

const td060Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Light sweat, then jump and snatch rehearsal.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Air Squats',
    '3 Box Step-ups each leg (fast up)',
    '5 Alternating Dumbbell Snatches each side, light',
  ],
};

const td060Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Copenhagen Plank', value: '20s each side', note: 'Or side plank.' },
    { name: 'Band Pull-Aparts', value: '15' },
  ],
};

const td060: StandaloneWorkoutSource = {
  id: 'td_060',
  title: 'Play Fast',
  description:
    'Low-volume box jump overs and light dumbbell snatches, then a short slam-and-sprint finisher. Athletic and fun — keep contacts clean.',
  estimatedTime: 45,
  disciplines: ['Metcon', 'Olympic Lifting'],
  bodyFocus: ['Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['box', 'dumbbell', 'medicine ball', 'bike'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'How jumps felt, DB weight, finisher notes',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td060Warmup,
        {
          name: 'Strength: Jump + DB Snatch',
          instructions: `${POWER_INTENT} 4 rounds: 3 box jump overs, rest 20s, then 6 alternating dumbbell snatches (light). Rest 90s between rounds. Soft landings, fast elbows.`,
          highlightInstructions: '4 Rounds · 3 jumps + 6 snatches',
          movements: [
            {
              name: 'Box Jump Overs',
              value: '3',
              note: '60/50cm. Step down is fine.',
            },
            {
              name: 'Alternating Dumbbell Snatch',
              value: '6',
              note: 'Light. 22.5/15kg or less.',
            },
          ],
        },
        {
          name: 'WOD: Slam + Sprint',
          instructions:
            '6 rounds: 5 med-ball slams, then 10 seconds bike sprint. Rest 60s between rounds. Stay explosive on both.',
          highlightInstructions: '6 Rounds · 5 slams + 10s bike',
          movements: [
            {
              name: 'Medicine Ball Slam',
              value: '5',
              note: '9/6kg.',
            },
            { name: 'Bike Sprint', value: '10s' },
            { type: 'divider', note: 'Rest 60s between rounds.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td060Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td060Warmup,
        {
          name: 'Strength: Step-up + DB Snatch',
          instructions:
            '4 rounds: 3 box step-ups each leg (fast up), rest 20s, then 6 light alternating dumbbell snatches. Rest 90s.',
          highlightInstructions: '4 Rounds · Step-ups + snatches',
          movements: [
            {
              name: 'Box Step-ups',
              value: '3 each leg',
              note: 'Knee-height box. Fast up, controlled down.',
            },
            {
              name: 'Alternating Dumbbell Snatch',
              value: '6',
              note: 'Light.',
            },
          ],
        },
        {
          name: 'WOD: Slam + Sprint',
          instructions:
            '5 rounds: 5 med-ball slams, then 10 seconds bike. Rest 60s.',
          highlightInstructions: '5 Rounds · 5 slams + 10s bike',
          movements: [
            { name: 'Medicine Ball Slam', value: '5', note: 'Light ball.' },
            { name: 'Bike Sprint', value: '10s' },
            { type: 'divider', note: 'Rest 60s between rounds.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td060Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_061 — Speed pulls + hang snatches                                      */
/* ========================================================================== */

const td061Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Hinge pattern first, then empty-bar snatch drills and a couple of light speed pulls.',
  movements: [
    '3 mins easy row',
    '10 Good Mornings empty bar',
    '10 Glute Bridges',
    '5 Inchworms',
    'Empty Bar: 5 Hang Muscle Snatches, 5 Hang Power Snatches, 3 Speed Deadlifts',
  ],
};

const td061Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Leg Glute Bridge', value: '8 each side' },
    { name: 'Bird Dog', value: '6 each side' },
  ],
};

const td061: StandaloneWorkoutSource = {
  id: 'td_061',
  title: 'Hinge Speed',
  description:
    'Speed deadlifts that leave the floor fast, then hang snatches at a technical load. Finish with short row sprints. The bar should feel light.',
  estimatedTime: 55,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Lower Body', 'Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'rower', 'kettlebell'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Speed pull weight, hang snatch weight, best row bout',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td061Warmup,
        {
          name: 'Strength: Speed Deadlift',
          loadExerciseId: 14,
          instructions: `${POWER_INTENT} 6 sets of 2 speed deadlifts at {{45}} of your estimated deadlift 1RM (RPE 5–6). Reset every rep. The bar should fly. Rest 60–75s. Trap bar is fine if that is your hinge.`,
          highlightInstructions: '6 x 2 @ {{45}} · Leave fast',
          movements: [
            {
              name: 'Speed Deadlift',
              value: '6 x 2',
              note: 'Conventional or trap bar. No grinding.',
            },
          ],
        },
        {
          name: 'Strength: Hang Snatch',
          loadExerciseId: 59,
          instructions: `${POWER_INTENT} 5 sets of 2 hang snatches at {{40-50}} of your estimated hang snatch 1RM (RPE 6). Hang above the knee. Rest 90–120s.`,
          highlightInstructions: '5 x 2 @ {{40-50}}',
          movements: [
            {
              name: 'Hang Snatch',
              value: '5 x 2',
              note: 'Power catch is fine. Full snatch if positions are solid.',
            },
          ],
        },
        {
          name: 'WOD: Row Sprints',
          instructions:
            '8 rounds: 10 seconds hard row, 50 seconds easy. Damper mid. Score is best calories or metres in any bout.',
          highlightInstructions: '8 x 10s · Rest 50s · Best bout',
          movements: [
            { name: 'Row Sprint', value: '10s', note: 'Hard pull, tall finish.' },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td061Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td061Warmup,
        {
          name: 'Strength: Speed Hinge',
          instructions: `${POWER_INTENT} 6 sets of 2 kettlebell or light barbell speed hinges. Snap the hips. Rest 60s.`,
          highlightInstructions: '6 x 2 · Fast hips',
          movements: [
            {
              name: 'Kettlebell Swing or Light Speed Deadlift',
              value: '6 x 2',
              note: 'Choose the pattern you own.',
            },
          ],
        },
        {
          name: 'Strength: Hang Snatch',
          instructions: `${POWER_INTENT} 5 sets of 2 hang power snatches with a light bar or single dumbbell. Rest 90s.`,
          highlightInstructions: '5 x 2 · Light',
          movements: [
            {
              name: 'Hang Power Snatch',
              value: '5 x 2',
              note: 'Barbell or DB snatch each side alternating sets.',
            },
          ],
        },
        {
          name: 'WOD: Row Sprints',
          instructions:
            '6 rounds: 10 seconds hard row, 50 seconds easy. Best bout.',
          highlightInstructions: '6 x 10s · Rest 50s',
          movements: [
            { name: 'Row Sprint', value: '10s' },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td061Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_062 — Clean + push press EMOM                                          */
/* ========================================================================== */

const td062Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Full body prep for a light complex.',
  movements: [
    '3 mins easy bike or row',
    '10 Air Squats',
    '10 Band Pull-Aparts',
    '5 Inchworms',
    'Empty Bar: 3 Power Cleans + 3 Push Presses x 2',
  ],
};

const td062Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Ring Rows', value: '10' },
    { name: 'Dead Bugs', value: '8 each side' },
  ],
};

const td062: StandaloneWorkoutSource = {
  id: 'td_062',
  title: 'Link It',
  description:
    'A light clean and push press EMOM to practise linking power, then a short capped triplet. Keep the bar speed high and the finisher punchy — under eight minutes.',
  estimatedTime: 50,
  disciplines: ['Olympic Lifting', 'Metcon'],
  bodyFocus: ['Full Body'],
  format: 'EMOM',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'box', 'kettlebell', 'rower'],
  isPremium: true,
  logSchema: {
    kind: 'duration',
    label: 'Triplet time',
    lowerIsBetter: true,
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td062Warmup,
        {
          name: 'Strength: Clean + Push Press EMOM 10',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} Every minute for 10 minutes: 1 power clean + 2 push press at {{40-50}} of your estimated power clean 1RM. If you miss a minute, drop weight.`,
          highlightInstructions: 'EMOM 10 · 1 clean + 2 push press @ {{40-50}}',
          movements: [
            {
              name: 'Each minute',
              value: '1 Power Clean + 2 Push Press',
              note: 'Same bar. Fast elbows, then fast lockout.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 8 minute cap. Push the row, stay snappy on the box and swings. This is short on purpose.',
          highlightInstructions: 'Score: total time · Cap 8 mins',
          movements: [
            '150m Row',
            {
              name: 'Box Jump Overs',
              value: '8',
              note: '60/50cm.',
            },
            {
              name: 'Kettlebell Swings',
              value: '10',
              note: '24/16kg. Chest height is fine.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td062Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td062Warmup,
        {
          name: 'Strength: Clean + Push Press EMOM 10',
          instructions: `${POWER_INTENT} Every minute for 10 minutes: 1 hang power clean + 2 push press with a light bar or dumbbells.`,
          highlightInstructions: 'EMOM 10 · Hang clean + push press',
          movements: [
            {
              name: 'Each minute',
              value: '1 Hang Power Clean + 2 Push Press',
              note: 'Barbell or dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 8 minute cap. Step-ups instead of jump overs if needed.',
          highlightInstructions: 'Score: total time · Cap 8 mins',
          movements: [
            '100m Row',
            {
              name: 'Box Step-ups',
              value: '8',
              note: 'Total. Alternate legs.',
            },
            {
              name: 'Kettlebell Swings',
              value: '10',
              note: 'Light.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td062Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_063 — Soft recovery                                                    */
/* ========================================================================== */

const td063Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Very easy. Just start moving.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Dead Bugs',
  ],
};

const td063Strength: WorkoutBlockBase = {
  name: 'Strength: Light Accessories',
  instructions:
    '2 rounds, rest 60s. Light weights, slow tempo. Blood flow only.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Goblet Squat', value: '8', note: 'Light. 3s lower.' },
    { name: 'Dumbbell Floor Press', value: '10', note: 'Light. 3s lower.' },
    { name: 'Ring Rows', value: '10' },
  ],
};

const td063Additional: WorkoutBlockBase = {
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

const td063: StandaloneWorkoutSource = {
  id: 'td_063',
  title: 'Soft Pedal',
  description:
    'Pure recovery after a week of fast work. Light accessories, easy Zone 2 and a long stretch. Nasal breathing only.',
  estimatedTime: 50,
  disciplines: ['Conditioning', 'Gymnastics'],
  bodyFocus: ['Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
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
        td063Warmup,
        td063Strength,
        {
          name: 'WOD: Zone 2 x 20',
          hrZone: 2,
          instructions:
            'Two 10 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike or Row', value: '10 mins' },
            {
              name: 'Ski Erg or Walk',
              value: '10 mins',
              note: 'No ski erg? Brisk walk or easy jog.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td063Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td063Warmup,
        td063Strength,
        {
          name: 'WOD: Zone 2 x 16',
          hrZone: 2,
          instructions:
            'Two 8 minute pieces. Conversational pace only.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike or Row', value: '8 mins' },
            {
              name: 'Walk or Easy Jog',
              value: '8 mins',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td063Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek09: StandaloneWorkoutSource[] = [
  td057,
  td058,
  td059,
  td060,
  td061,
  td062,
  td063,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek09Program: TemperedDailyWeek = {
  id: 'td_week_009',
  weekStart: '2027-01-11',
  blockName: 'Power',
  theme: 'Explosive Strength',
  phase: 'Discovery',
  description:
    'Welcome to Power. Force and engine are in; this block trains how fast that force shows up. Jumps and cleans Monday, push press and jerk Wednesday, speed pulls and hang snatches Friday. Loads stay moderate — every rep should be snappy. Finishers are short and sharp, about ten seconds of work. Write down jump distances and loads that still feel fast. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Olympic Lifting',
  otherFocuses: ['Strength', 'Full Body', 'Lower Body'],
  nextWeekFocus: 'Power – Accumulation',
  days: ['td_057', 'td_058', 'td_059', 'td_060', 'td_061', 'td_062', 'td_063'],
};
