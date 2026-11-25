import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 3: Power — Week 11: Power – Intensification        */
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
 * push press / jerk, speed pulls, hang snatches). The WOD is a short alactic
 * finisher (~10 seconds of work), not an engine piece.
 *
 * Intensification: heavier singles and doubles, roughly 30–40% less volume
 * than Accumulation. Long rests (2–3 mins). Jump work is a few max-intent
 * reps only. Every rep still has to be fast.
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
/*  td_071 — Max-intent jumps + power cleans                                  */
/* ========================================================================== */

const td071Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Get hot, open the hips and ankles, then rehearse jump and clean patterns. Build the bar slowly.',
  movements: [
    '3 mins easy bike or row',
    '10 Leg Swings each direction each side',
    '10 Air Squats',
    '5 Inchworms',
    '3 Broad Jumps, stick the landing',
    'Empty Bar: 5 Muscle Cleans, 5 Front Squats, 5 Hang Power Cleans',
  ],
};

const td071Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s. Light only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Side Plank', value: '30s each side' },
    { name: 'Dead Bugs', value: '8 each side' },
  ],
};

const td071: StandaloneWorkoutSource = {
  id: 'td_071',
  title: 'Heavier, Faster',
  description:
    'A few max-intent broad jumps, then power cleans at the heaviest load of the block — fewer reps, longer rests. Finish with six short bike sprints.',
  estimatedTime: 50,
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
        td071Warmup,
        {
          name: 'Strength: Broad Jumps',
          instructions:
            '4 single broad jumps, max intent. Walk back, reset fully and rest 2 mins between jumps. Stick every landing. Write down your best distance.',
          highlightInstructions: '4 x 1 · Max intent · Rest 2 mins',
          movements: [
            {
              name: 'Standing Broad Jump',
              value: '4 x 1',
              note: 'Measure toe-to-heel. Soft knees on landing.',
            },
          ],
        },
        {
          name: 'Strength: Power Clean',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} Build with a few singles to a working weight around {{60-70}} of your estimated power clean 1RM (RPE 7). Then 4 sets of 2 at that load. Rest 2–3 mins.`,
          highlightInstructions: '4 x 2 @ {{60-70}} · Rest 2–3 mins',
          movements: [
            { type: 'divider', note: 'Build · singles · based on 1RM' },
            '{{40}}',
            '{{50}}',
            '{{60}}',
            { type: 'divider', note: 'Stop adding if bar speed drops.' },
            {
              name: 'Working sets',
              value: '4 x 2',
              note: 'Full reset between reps. Elbows fast in the catch.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '6 rounds: 10 seconds all-out bike, 50 seconds easy. Score is your best calories in any 10 second bout. Keep it short and sharp.',
          highlightInstructions: '6 x 10s · Rest 50s · Best bout cals',
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
        td071Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td071Warmup,
        {
          name: 'Strength: Broad Jumps',
          instructions:
            '3 single broad jumps or line hops, max intent. Rest 2 mins between jumps. Stick every landing.',
          highlightInstructions: '3 x 1 · Max intent · Rest 2 mins',
          movements: [
            {
              name: 'Standing Broad Jump or Line Hop',
              value: '3 x 1',
              note: 'Shorter distance is fine. Soft landings.',
            },
          ],
        },
        {
          name: 'Strength: Power Clean',
          instructions: `${POWER_INTENT} Use a light-to-moderate barbell or dumbbells. 4 sets of 2 hang power cleans. Every rep fast. Rest 2 mins.`,
          highlightInstructions: '4 x 2 Hang Power Clean · Fast',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '4 x 2',
              note: 'Barbell or 2 dumbbells. Hang from just above the knee.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '4 rounds: 10 seconds hard bike, 50 seconds easy. Best calories in any bout.',
          highlightInstructions: '4 x 10s · Rest 50s · Best bout cals',
          movements: [
            { name: 'Bike Sprint', value: '10s', note: 'Hard effort.' },
            { type: 'divider', note: '50s easy spin between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td071Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_072 — Hang high pulls + trunk                                          */
/* ========================================================================== */

const td072Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Raise the heart rate, open the upper back, then light pull patterns.',
  movements: [
    '3 mins easy row',
    '10 Band Pull-Aparts',
    '10 World’s Greatest Stretch (5 each side)',
    '5 Inchworms',
    'Empty Bar: 5 Hang Muscle Cleans, 5 Hang High Pulls',
  ],
};

const td072Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Arm Farmer Carry', value: '20m each side' },
    { name: 'Hollow Hold', value: '20s' },
  ],
};

const td072: StandaloneWorkoutSource = {
  id: 'td_072',
  title: 'Pull Sharp',
  description:
    'Fewer hang clean high pulls at a heavier load with long rests, then a short run of med-ball slams. Tall, fast and fresh.',
  estimatedTime: 45,
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
        td072Warmup,
        {
          name: 'Strength: Hang Clean High Pull',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} 3 sets of 3 hang clean high pulls at {{60-70}} of your estimated power clean 1RM (RPE 7). Elbows high, bar close. Rest 2–3 mins. Then 3 sets of 6 hollow rocks.`,
          highlightInstructions: '3 x 3 @ {{60-70}} · Then hollow rocks',
          movements: [
            {
              name: 'Hang Clean High Pull',
              value: '3 x 3',
              note: 'Hang above the knee. Finish tall on the toes.',
            },
            {
              name: 'Hollow Rock',
              value: '3 x 6',
              note: 'Rest 45s. Ribs down.',
            },
          ],
        },
        {
          name: 'WOD: Med-Ball Slams',
          instructions:
            '5 rounds: 10 seconds of med-ball slams, 50 seconds rest. Aggressive and tall. Score is total slams across all bouts.',
          highlightInstructions: '5 x 10s · Rest 50s · Total slams',
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
        td072Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td072Warmup,
        {
          name: 'Strength: Hang High Pull',
          instructions: `${POWER_INTENT} 3 sets of 3 hang high pulls with a moderate barbell or dumbbells. Rest 2 mins. Then 3 sets of 6 dead bugs each side.`,
          highlightInstructions: '3 x 3 · Tall and fast',
          movements: [
            {
              name: 'Hang High Pull',
              value: '3 x 3',
              note: 'Barbell or 2 dumbbells.',
            },
            {
              name: 'Dead Bugs',
              value: '3 x 6 each side',
              note: 'Rest 45s.',
            },
          ],
        },
        {
          name: 'WOD: Med-Ball Slams',
          instructions:
            '4 rounds: 10 seconds of med-ball slams or ball to floor, 50 seconds rest. Count total reps.',
          highlightInstructions: '4 x 10s · Rest 50s · Total reps',
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
        td072Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_073 — Push press + jerk                                                */
/* ========================================================================== */

const td073Warmup: WorkoutBlockBase = {
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

const td073Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Face Pulls', value: '12', note: 'Band or cable. Light.' },
    { name: 'Side Plank', value: '25s each side' },
  ],
};

const td073: StandaloneWorkoutSource = {
  id: 'td_073',
  title: 'Lock It Out',
  description:
    'Heavier push press triples and split jerk singles, with long rests between sets. Finish with a few short sled or bike sprints. Less volume, more intent.',
  estimatedTime: 50,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Upper Body', 'Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'sled', 'bike', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Push press weight, jerk weight, best sprint bout',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td073Warmup,
        {
          name: 'Strength: Push Press',
          loadExerciseId: 115,
          instructions: `${POWER_INTENT} 3 sets of 3 push press at {{60-70}} of your estimated push press 1RM (RPE 7). Dip straight, drive tall. Rest 2–3 mins.`,
          highlightInstructions: '3 x 3 @ {{60-70}} · Rest 2–3 mins',
          movements: [
            {
              name: 'Push Press',
              value: '3 x 3',
              note: 'No press-out grind. If the lockout slows, drop weight.',
            },
          ],
        },
        {
          name: 'Strength: Split Jerk',
          loadExerciseId: 66,
          instructions: `${POWER_INTENT} 5 singles at {{60-70}} of your estimated jerk 1RM. Alternate lead leg each rep or stick your strong side and note it. Rest 2 mins between singles.`,
          highlightInstructions: '5 x 1 @ {{60-70}} · Fast feet',
          movements: [
            {
              name: 'Split Jerk',
              value: '5 x 1',
              note: 'Fast feet, locked elbows. Stop if the dip gets slow.',
            },
          ],
        },
        {
          name: 'WOD: Sled Sprints',
          instructions:
            '6 rounds: 10m hard sled push, walk back easy. About 10 seconds of work. No sled? 10 seconds all-out bike instead. Log best feel / bike cals.',
          highlightInstructions: '6 x 10m · Walk back recover',
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
        td073Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td073Warmup,
        {
          name: 'Strength: Push Press',
          instructions: `${POWER_INTENT} 3 sets of 3 dumbbell or barbell push press at a moderate load. Rest 2 mins.`,
          highlightInstructions: '3 x 3 · Moderate and fast',
          movements: [
            {
              name: 'Dumbbell Push Press',
              value: '3 x 3',
              note: 'Or light barbell.',
            },
          ],
        },
        {
          name: 'Strength: Push Press Singles',
          instructions:
            'Skip the split jerk if you are new to it. 5 fast push press singles with a slightly heavier load. Rest 2 mins between singles.',
          highlightInstructions: '5 x 1 · Fast lockout',
          movements: [
            {
              name: 'Push Press',
              value: '5 x 1',
              note: 'Dumbbells or barbell.',
            },
          ],
        },
        {
          name: 'WOD: Bike Sprints',
          instructions:
            '4 rounds: 10 seconds hard bike, 50 seconds easy. Best bout calories.',
          highlightInstructions: '4 x 10s · Rest 50s',
          movements: [
            { name: 'Bike Sprint', value: '10s' },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td073Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_074 — Bounds + DB power                                                */
/* ========================================================================== */

const td074Warmup: WorkoutBlockBase = {
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

const td074Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    {
      name: 'Copenhagen Plank',
      value: '20s each side',
      note: 'Or side plank.',
    },
    { name: 'Band Pull-Aparts', value: '15' },
  ],
};

const td074: StandaloneWorkoutSource = {
  id: 'td_074',
  title: 'Stay Springy',
  description:
    'A short, light athletic session. Few box jump overs, a few dumbbell snatches and a slam-and-sprint finisher. Keep the legs fresh for Friday.',
  estimatedTime: 40,
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
        td074Warmup,
        {
          name: 'Strength: Jump + DB Snatch',
          instructions: `${POWER_INTENT} 3 rounds: 3 box jump overs, rest 20s, then 5 alternating dumbbell snatches (light). Rest 2 mins between rounds. Soft landings, fast elbows.`,
          highlightInstructions: '3 Rounds · 3 jumps + 5 snatches',
          movements: [
            {
              name: 'Box Jump Overs',
              value: '3',
              note: '60/50cm. Step down is fine.',
            },
            {
              name: 'Alternating Dumbbell Snatch',
              value: '5',
              note: 'Light. 22.5/15kg or less.',
            },
          ],
        },
        {
          name: 'WOD: Slam + Sprint',
          instructions:
            '5 rounds: 5 med-ball slams, then 10 seconds bike sprint. Rest 60s between rounds. Stay explosive on both.',
          highlightInstructions: '5 Rounds · 5 slams + 10s bike',
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
        td074Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td074Warmup,
        {
          name: 'Strength: Step-up + DB Snatch',
          instructions:
            '3 rounds: 3 box step-ups each leg (fast up), rest 20s, then 5 light alternating dumbbell snatches. Rest 2 mins.',
          highlightInstructions: '3 Rounds · Step-ups + snatches',
          movements: [
            {
              name: 'Box Step-ups',
              value: '3 each leg',
              note: 'Knee-height box. Fast up, controlled down.',
            },
            {
              name: 'Alternating Dumbbell Snatch',
              value: '5',
              note: 'Light.',
            },
          ],
        },
        {
          name: 'WOD: Slam + Sprint',
          instructions:
            '4 rounds: 5 med-ball slams, then 10 seconds bike. Rest 60s.',
          highlightInstructions: '4 Rounds · 5 slams + 10s bike',
          movements: [
            { name: 'Medicine Ball Slam', value: '5', note: 'Light ball.' },
            { name: 'Bike Sprint', value: '10s' },
            { type: 'divider', note: 'Rest 60s between rounds.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td074Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_075 — Speed pulls + hang snatches                                      */
/* ========================================================================== */

const td075Warmup: WorkoutBlockBase = {
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

const td075Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Leg Glute Bridge', value: '8 each side' },
    { name: 'Bird Dog', value: '6 each side' },
  ],
};

const td075: StandaloneWorkoutSource = {
  id: 'td_075',
  title: 'Peak Speed',
  description:
    'Fewer speed deadlift sets at a slightly higher load, then hang snatch doubles with long rests. Finish with six short row sprints. Heavier, but still fast.',
  estimatedTime: 50,
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
        td075Warmup,
        {
          name: 'Strength: Speed Deadlift',
          loadExerciseId: 14,
          instructions: `${POWER_INTENT} 5 sets of 2 speed deadlifts at {{55-65}} of your estimated deadlift 1RM (RPE 6). Reset every rep. The bar should fly. Rest 90s. Trap bar is fine if that is your hinge.`,
          highlightInstructions: '5 x 2 @ {{55-65}} · Leave fast',
          movements: [
            {
              name: 'Speed Deadlift',
              value: '5 x 2',
              note: 'Conventional or trap bar. No grinding.',
            },
          ],
        },
        {
          name: 'Strength: Hang Snatch',
          loadExerciseId: 59,
          instructions: `${POWER_INTENT} 4 sets of 2 hang snatches at {{60-70}} of your estimated hang snatch 1RM (RPE 7). Hang above the knee. Rest 2–3 mins.`,
          highlightInstructions: '4 x 2 @ {{60-70}} · Rest 2–3 mins',
          movements: [
            {
              name: 'Hang Snatch',
              value: '4 x 2',
              note: 'Power catch is fine. Full snatch if positions are solid.',
            },
          ],
        },
        {
          name: 'WOD: Row Sprints',
          instructions:
            '6 rounds: 10 seconds hard row, 50 seconds easy. Damper mid. Score is best calories or metres in any bout.',
          highlightInstructions: '6 x 10s · Rest 50s · Best bout',
          movements: [
            {
              name: 'Row Sprint',
              value: '10s',
              note: 'Hard pull, tall finish.',
            },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td075Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td075Warmup,
        {
          name: 'Strength: Speed Hinge',
          instructions: `${POWER_INTENT} 5 sets of 2 kettlebell or barbell speed hinges. Snap the hips. Rest 90s.`,
          highlightInstructions: '5 x 2 · Fast hips',
          movements: [
            {
              name: 'Kettlebell Swing or Light Speed Deadlift',
              value: '5 x 2',
              note: 'Choose the pattern you own.',
            },
          ],
        },
        {
          name: 'Strength: Hang Snatch',
          instructions: `${POWER_INTENT} 4 sets of 2 hang power snatches with a light-to-moderate bar or single dumbbell. Rest 2 mins.`,
          highlightInstructions: '4 x 2 · Fast',
          movements: [
            {
              name: 'Hang Power Snatch',
              value: '4 x 2',
              note: 'Barbell or DB snatch each side alternating sets.',
            },
          ],
        },
        {
          name: 'WOD: Row Sprints',
          instructions:
            '4 rounds: 10 seconds hard row, 50 seconds easy. Best bout.',
          highlightInstructions: '4 x 10s · Rest 50s',
          movements: [
            { name: 'Row Sprint', value: '10s' },
            { type: 'divider', note: '50s easy between bouts.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td075Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_076 — Complex EMOM + short triplet                                     */
/* ========================================================================== */

const td076Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Full body prep for a light complex.',
  movements: [
    '3 mins easy bike or row',
    '10 Air Squats',
    '10 Band Pull-Aparts',
    '5 Inchworms',
    'Empty Bar: 3 Power Cleans + 3 Front Squats + 3 Push Presses x 2',
  ],
};

const td076Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Ring Rows', value: '8' },
    { name: 'Dead Bugs', value: '8 each side' },
  ],
};

const td076: StandaloneWorkoutSource = {
  id: 'td_076',
  title: 'Clean Link',
  description:
    'A shorter clean, front squat and push press EMOM at a heavier load, then a quick capped triplet. Short on purpose — you should leave fresh.',
  estimatedTime: 40,
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
        td076Warmup,
        {
          name: 'Strength: Clean Complex EMOM 8',
          loadExerciseId: 64,
          instructions: `${POWER_INTENT} Every minute for 8 minutes: 1 power clean + 1 front squat + 1 push press at {{60-70}} of your estimated power clean 1RM. If you miss a minute, drop weight.`,
          highlightInstructions:
            'EMOM 8 · Clean + front squat + push press @ {{60-70}}',
          movements: [
            {
              name: 'Each minute',
              value: '1 Power Clean + 1 Front Squat + 1 Push Press',
              note: 'Same bar. Fast elbows, drive out of the squat, fast lockout.',
            },
          ],
        },
        {
          name: 'WOD: 2 Rounds For Time',
          instructions:
            'Two rounds for time, 6 minute cap. Push the row, stay snappy on the box and swings. This is short on purpose.',
          highlightInstructions: 'Score: total time · Cap 6 mins',
          movements: [
            '200m Row',
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
        td076Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td076Warmup,
        {
          name: 'Strength: Clean Complex EMOM 8',
          instructions: `${POWER_INTENT} Every minute for 8 minutes: 1 hang power clean + 1 front squat + 1 push press with a moderate bar or dumbbells.`,
          highlightInstructions:
            'EMOM 8 · Hang clean + front squat + push press',
          movements: [
            {
              name: 'Each minute',
              value: '1 Hang Power Clean + 1 Front Squat + 1 Push Press',
              note: 'Barbell or dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: 2 Rounds For Time',
          instructions:
            'Two rounds for time, 6 minute cap. Step-ups instead of jump overs if needed.',
          highlightInstructions: 'Score: total time · Cap 6 mins',
          movements: [
            '150m Row',
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
        td076Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_077 — Soft recovery                                                    */
/* ========================================================================== */

const td077Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Very easy. Just start moving.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Dead Bugs',
  ],
};

const td077Strength: WorkoutBlockBase = {
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

const td077Additional: WorkoutBlockBase = {
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

const td077: StandaloneWorkoutSource = {
  id: 'td_077',
  title: 'Slow Roll',
  description:
    'Pure recovery before test week. Light accessories, easy Zone 2 and a long stretch. Nasal breathing only. Arrive next week fresh.',
  estimatedTime: 50,
  disciplines: ['Conditioning', 'Gymnastics'],
  bodyFocus: ['Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
  equipment: [
    'kettlebell',
    'dumbbell',
    'bike',
    'rower',
    'ski erg',
    'pull-up bar',
  ],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, average heart rate, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td077Warmup,
        td077Strength,
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
        td077Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td077Warmup,
        td077Strength,
        {
          name: 'WOD: Zone 2 x 16',
          hrZone: 2,
          instructions: 'Two 8 minute pieces. Conversational pace only.',
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
        td077Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek11: StandaloneWorkoutSource[] = [
  td071,
  td072,
  td073,
  td074,
  td075,
  td076,
  td077,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek11Program: TemperedDailyWeek = {
  id: 'td_week_011',
  weekStart: '2027-01-25',
  blockName: 'Power',
  theme: 'Explosive Strength',
  phase: 'Intensification',
  description:
    'Heavier, but less. Cleans, jerks and hang snatches move to fast singles and doubles around 60–70%, while total volume drops by about 35%. Rests are longer, jump work is a few max-intent reps, and finishers are short and sharp. Sessions are a little shorter too. This is how you arrive fresh and fast for test week. Resist the urge to add extra work. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Olympic Lifting',
  otherFocuses: ['Strength', 'Full Body', 'Lower Body'],
  nextWeekFocus: 'Power – Test',
  days: ['td_071', 'td_072', 'td_073', 'td_074', 'td_075', 'td_076', 'td_077'],
};
