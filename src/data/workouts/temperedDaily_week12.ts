import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 3: Power — Week 12: Power – Test                   */
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
 * Test week: power clean Monday, broad jump Wednesday, sprint Friday.
 * RX tests a 1RM clean, Scaled a heavy 3RM. Test days log the score.
 * Everything around them is light and fun.
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
  'Rest 3–5 mins between heavy attempts. You get 3 attempts above {{90}}. A missed attempt counts as one of the 3. Never test to failure on a rep that looks unsafe. A good test day ends with a smooth top lift, not a grinder.';

/* ========================================================================== */
/*  td_078 — Power clean test                                                 */
/* ========================================================================== */

const td078Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Take the full 10 minutes. Get hot, get springy, then build the bar slowly.',
  movements: [
    '5 mins easy bike, building to a sweat',
    '10 Leg Swings each direction each side',
    '10 Air Squats',
    '3 Broad Jumps, light primer — stick the landing',
    'Empty Bar: 5 Muscle Cleans, 5 Front Squats, 5 Hang Power Cleans',
  ],
};

const td078Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Light trunk work only. 2 rounds.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Side Plank', value: '30s each side' },
    { name: 'Dead Bugs', value: '8 each side' },
  ],
};

const td078: StandaloneWorkoutSource = {
  id: 'td_078',
  title: 'Power Clean Test',
  description:
    'Test day. Build to a new power clean: a one rep max on RX, a three rep max on Scaled. Patient warmup, a light jump primer and three heavy attempts. Then an easy flush and a long stretch.',
  estimatedTime: 60,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Full Body'],
  levels: ['Intermediate', 'Advanced'],
  collections: ['Benchmarks'],
  equipment: ['barbell', 'bike', 'rower', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Top lift (kg)', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td078Warmup,
        {
          name: 'Strength: Power Clean 1RM',
          loadExerciseId: 64,
          instructions: `Build to a heavy single. Catch at or above parallel and stand up fully. Drop the bar from the shoulders onto bumper plates. ${TEST_RULES} Log your heaviest successful lift.`,
          highlightInstructions: 'Clear floor space · 3 attempts above {{90}}',
          movements: [
            {
              name: 'Build',
              value: '3 / 2 / 1 / 1 reps',
              note: 'Roughly {{40}} → {{60}} → {{70}} → {{80}} of estimated 1RM. Rest 2 mins.',
            },
            {
              name: 'Opener',
              value: '1 @ {{~90}}',
              note: 'A weight you are certain you will make.',
            },
            {
              name: 'Attempt 2',
              value: '1 @ {{~95-100}}',
              note: 'Around your previous best.',
            },
            {
              name: 'Attempt 3',
              value: '1 @ {{~100-103}}',
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
        td078Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td078Warmup,
        {
          name: 'Strength: Power Clean 3RM',
          loadExerciseId: 64,
          instructions: `Build to a heavy set of 3 with good form. Power clean or hang power clean, whichever you own. Drop the bar from the shoulders onto bumper plates. ${TEST_RULES} Log the weight of your heaviest successful triple.`,
          highlightInstructions:
            'Clear floor space · 3 attempts at your heavy triple',
          movements: [
            {
              name: 'Build',
              value: '5 / 3 / 3 / 3 reps',
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
        td078Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_079 — Shake-out                                                        */
/* ========================================================================== */

const td079Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Easy start. Legs and shoulders may feel heavy, so let them loosen up gradually.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Band Pull-Aparts',
    '5 Inchworms',
  ],
};

const td079Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['12 Dumbbell Hammer Curls', '15 Reverse Flyes'],
};

const td079: StandaloneWorkoutSource = {
  id: 'td_079',
  title: 'Shake-Out',
  description:
    'A light technical session. Empty-bar cleans and easy jumps to keep the movement sharp, then a gentle flow. No score, no pressure — move well and go home fresh.',
  estimatedTime: 40,
  disciplines: ['Olympic Lifting', 'Conditioning'],
  bodyFocus: ['Full Body'],
  levels: ['Intermediate', 'Advanced'],
  equipment: ['barbell', 'bike', 'rower', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'How the clean felt, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td079Warmup,
        {
          name: 'Strength: Clean Technique',
          loadExerciseId: 64,
          instructions:
            'No score. 4 sets of 3 hang power cleans at around {{40}} of your estimated power clean 1RM (RPE 4). Fast elbows, quiet catch. Rest 60s. Stop if anything feels sticky.',
          highlightInstructions: '4 x 3 @ {{40}} · Light and crisp',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '4 x 3',
              note: 'Hang above the knee. Smooth and fast.',
            },
          ],
        },
        {
          name: 'WOD: Easy Flow',
          instructions:
            'Not for score. 3 easy rounds. Stay below RPE 5 and keep the legs springy.',
          highlightInstructions: '3 Rounds · Easy',
          movements: [
            '250m easy Row',
            '5 Pogo Jumps',
            '10 Band Pull-Aparts',
            '10 Dead Bugs',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td079Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td079Warmup,
        {
          name: 'Strength: Clean Technique',
          instructions:
            'No score. 4 sets of 3 hang power cleans with an empty bar or light dumbbells. Fast elbows, quiet catch. Rest 60s.',
          highlightInstructions: '4 x 3 · Light and crisp',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '4 x 3',
              note: 'Empty bar or 2 light dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: Easy Flow',
          instructions: 'Not for score. 3 easy rounds. Stay below RPE 5.',
          highlightInstructions: '3 Rounds · Easy',
          movements: [
            '200m easy Row',
            '5 Pogo Jumps',
            '10 Band Pull-Aparts',
            '10 Dead Bugs',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td079Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_080 — Broad jump test                                                  */
/* ========================================================================== */

const td080Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Get the ankles, hips and calves springy before you jump for distance.',
  movements: [
    '5 mins easy bike, building to a sweat',
    '10 Leg Swings each direction each side',
    '10 Air Squats',
    '20m Skipping, tall and bouncy',
    '3 x 5 Pogo Jumps',
    '3 Bounds each leg, easy',
    '3 Broad Jumps at 70%, then 2 at 85%',
  ],
};

const td080Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds. Light only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Calf Raises', value: '15' },
    { name: 'Bodyweight Split Squat', value: '8 each leg' },
  ],
};

const td080: StandaloneWorkoutSource = {
  id: 'td_080',
  title: 'Broad Jump Test',
  description:
    'Test day. Best of three standing broad jumps for distance. A bounce-focused warmup, a light clean primer, then three focused attempts. Easy flush to finish.',
  estimatedTime: 45,
  disciplines: ['Olympic Lifting', 'Strength'],
  bodyFocus: ['Lower Body'],
  levels: ['Intermediate', 'Advanced'],
  collections: ['Benchmarks'],
  equipment: ['barbell', 'bike'],
  isPremium: true,
  logSchema: {
    kind: 'distance',
    label: 'Best broad jump',
    unit: 'm',
    higherIsBetter: true,
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td080Warmup,
        {
          name: 'Strength: Clean Primer',
          loadExerciseId: 64,
          instructions:
            'Light and fast. 3 sets of 2 power cleans at around {{40-50}} of your estimated power clean 1RM (RPE 5). Rest 60–90s. This wakes the hips up for the jumps — do not tire them.',
          highlightInstructions: '3 x 2 @ {{40-50}} · Light and fast',
          movements: [
            {
              name: 'Power Clean',
              value: '3 x 2',
              note: 'Quiet catch. Stop while it still feels easy.',
            },
          ],
        },
        {
          name: 'WOD: Broad Jump Test',
          instructions:
            'Best of 3 standing broad jumps. Rest 2 mins between jumps and walk it off. Stick every landing — a step or hand down does not count. Measure from the front of the starting line to the back of your rear heel. Log your best distance.',
          highlightInstructions: '3 attempts · Best distance counts',
          movements: [
            {
              name: 'Standing Broad Jump',
              value: '3 attempts',
              note: 'Swing the arms, load the hips, stick the landing. Mark each jump and measure.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td080Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td080Warmup,
        {
          name: 'Strength: Clean Primer',
          instructions:
            'Light and fast. 3 sets of 2 hang power cleans with a light bar or dumbbells. Rest 60–90s. Do not tire the hips.',
          highlightInstructions: '3 x 2 · Light and fast',
          movements: [
            {
              name: 'Hang Power Clean',
              value: '3 x 2',
              note: 'Barbell or 2 dumbbells. Quiet catch.',
            },
          ],
        },
        {
          name: 'WOD: Broad Jump Test',
          instructions:
            'Best of 3 standing broad jumps. Rest 2 mins between jumps. Take one extra practice jump at 85% first if you like. Stick every landing — a step or hand down does not count. Log your best distance.',
          highlightInstructions: '3 attempts · Best distance counts',
          movements: [
            {
              name: 'Standing Broad Jump',
              value: '3 attempts',
              note: 'Same test, same rules. Control the landing before chasing distance.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td080Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_081 — Play day                                                         */
/* ========================================================================== */

const td081Warmup: WorkoutBlockBase = {
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

const td081Additional: WorkoutBlockBase = {
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

const td081: StandaloneWorkoutSource = {
  id: 'td_081',
  title: 'Just Play',
  description:
    'Fun, light and easy on the legs. Medicine ball throws, then a 12 minute EMOM that keeps you moving without beating you up. Keep something in the tank for the sprint test.',
  estimatedTime: 40,
  disciplines: ['Metcon'],
  bodyFocus: ['Full Body'],
  format: 'EMOM',
  levels: ['Intermediate', 'Advanced'],
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
        td081Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions:
            '3 rounds, rest 60s. Every rep explosive. Quality over quantity.',
          highlightInstructions: '3 Rounds · Fast and powerful',
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
          name: 'WOD: EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes, cycling through the 4 stations (3 rounds). Easy effort, RPE 5. Each station should leave you 25s or more of rest.',
          highlightInstructions: '3 Rounds · RPE 5',
          movements: [
            { name: 'Min 1: Bike', value: '10/8 cal' },
            { name: 'Min 2: Air Squats', value: '12' },
            {
              name: 'Min 3: Dumbbell Push Press',
              value: '8',
              note: '2 x 15/10kg.',
            },
            { name: 'Min 4: Hollow Hold', value: '20s' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td081Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td081Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions: '3 rounds, rest 60s. Explosive reps.',
          highlightInstructions: '3 Rounds · Fast and powerful',
          movements: [
            { name: 'Medicine Ball Scoop Toss', value: '4', note: '4–6kg.' },
            { name: 'Rotational Medicine Ball Throw', value: '4 each side' },
            { name: 'Medicine Ball Slams', value: '6', note: '6/4kg.' },
          ],
        },
        {
          name: 'WOD: EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes, cycling through the 4 stations (3 rounds). Easy effort.',
          highlightInstructions: '3 Rounds · RPE 5',
          movements: [
            { name: 'Min 1: Bike', value: '8/6 cal' },
            { name: 'Min 2: Air Squats', value: '10' },
            {
              name: 'Min 3: Dumbbell Push Press',
              value: '8',
              note: '2 x 7.5/5kg.',
            },
            {
              name: 'Min 4: Hollow Hold',
              value: '15s',
              note: 'Tuck the knees to make it easier.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td081Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_082 — Sprint test                                                      */
/* ========================================================================== */

const td082Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Test day. Take the full 12 minutes. Sprinting needs a long, gradual build — do not rush the strides.',
  movements: [
    '5 mins easy jog or bike',
    '10 Leg Swings each direction each side',
    '20m A-Skips x 2',
    '20m Straight Leg Bounds x 2',
    '4 x 40m Strides, building from 60% to 90% (walk back)',
  ],
};

const td082Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds. Light only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Calf Raises', value: '15' },
    { name: 'Glute Bridges', value: '12' },
  ],
};

const td082: StandaloneWorkoutSource = {
  id: 'td_082',
  title: 'Sprint Test',
  description:
    'Test day. Timed sprints: 40m on RX, 20m on Scaled. A long warmup with strides, a short primer, then two or three timed efforts. No track? Swap to ten second max bike or row bouts and log calories.',
  estimatedTime: 45,
  disciplines: ['Conditioning', 'Metcon'],
  bodyFocus: ['Lower Body', 'Full Body'],
  levels: ['Intermediate', 'Advanced'],
  collections: ['Benchmarks'],
  equipment: ['bike', 'rower', 'box'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Sprint time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td082Warmup,
        {
          name: 'Strength: Primer',
          instructions:
            '2 rounds, rest 60s. Fast and snappy, not tiring. This wakes the legs up for the test.',
          highlightInstructions: '2 Rounds · Fast, not heavy',
          movements: [
            { name: 'Box Jumps', value: '3', note: 'Step down.' },
            { name: 'Broad Jumps', value: '2', note: 'Stick the landing.' },
            { name: 'Pogo Jumps', value: '5' },
          ],
        },
        {
          name: 'WOD: 40m Sprint Test',
          instructions:
            'Mark out 40m on flat ground. Start from a standing or split stance, no rolling start. Run 2–3 timed sprints at max effort and walk back to recover. Rest 3–4 mins between sprints. Log your fastest time. No track or space? Do 10 seconds of max-effort bike or row instead, 3 bouts with 3–4 mins rest, and log your best calories in your notes.',
          highlightInstructions: '2–3 sprints · Rest 3–4 mins · Best time',
          movements: [
            {
              name: '40m Sprint',
              value: '2–3 attempts',
              note: 'Time each run. Full recovery. No bike, row or space? 10s max bike or row, log best cals.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td082Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td082Warmup,
        {
          name: 'Strength: Primer',
          instructions:
            '2 rounds, rest 60s. Fast and snappy, not tiring. This wakes the legs up for the test.',
          highlightInstructions: '2 Rounds · Fast, not heavy',
          movements: [
            { name: 'Box Step-ups', value: '3 each leg', note: 'Fast up.' },
            {
              name: 'Broad Jumps or Line Hops',
              value: '2',
              note: 'Stick the landing.',
            },
            { name: 'Pogo Jumps', value: '5' },
          ],
        },
        {
          name: 'WOD: 20m Sprint Test',
          instructions:
            'Mark out 20m on flat ground. Start from a standing or split stance. Run 2–3 timed sprints at max effort and walk back to recover. Rest 3 mins between sprints. Log your fastest time. No track or space? Do 10 seconds of max-effort bike or row instead, 3 bouts with 3 mins rest, and log your best calories in your notes.',
          highlightInstructions: '2–3 sprints · Rest 3 mins · Best time',
          movements: [
            {
              name: '20m Sprint',
              value: '2–3 attempts',
              note: 'Time each run. Full recovery. No bike, row or space? 10s max bike or row, log best cals.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td082Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_083 — Victory lap                                                      */
/* ========================================================================== */

const td083Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy rounds, then loosen up for a fun, steady session.',
  movements: [
    '2 Rounds: 250m Row, 10 Air Squats, 10 Push-ups',
    'Practice: 5 Kettlebell Swings, 3 Burpees',
  ],
};

const td083Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '20 Calf Raises'],
};

const td083: StandaloneWorkoutSource = {
  id: 'td_083',
  title: 'Victory Lap',
  description:
    'A chipper to close the Power block. Light carries to start, then rowing, swings, step-ups and a jog to finish. Easy, fun and a good sweat.',
  estimatedTime: 45,
  disciplines: ['Metcon'],
  bodyFocus: ['Full Body'],
  format: 'Chipper',
  levels: ['Intermediate', 'Advanced'],
  equipment: ['rower', 'kettlebell', 'box', 'dumbbell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td083Warmup,
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
            'Work through the list in order, 18 minute cap. Easy to moderate effort. This one is for enjoying.',
          highlightInstructions: 'Score: total time · Cap 18 mins',
          movements: [
            '500m Row',
            {
              name: 'Kettlebell Swings',
              value: '20',
              note: '24/16kg, Russian (eye level).',
            },
            {
              name: 'Box Step-ups',
              value: '20',
              note: '60/50cm. Alternate legs.',
            },
            { name: 'Dumbbell Push Press', value: '15', note: '2 x 15/10kg.' },
            { type: 'divider' },
            '400m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td083Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td083Warmup,
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
            'Work through the list in order, 18 minute cap. Steady and enjoyable.',
          highlightInstructions: 'Score: total time · Cap 18 mins',
          movements: [
            '400m Row',
            {
              name: 'Kettlebell Swings',
              value: '15',
              note: '16/12kg, Russian (eye level).',
            },
            {
              name: 'Box Step-ups',
              value: '16',
              note: '50/40cm. Alternate legs.',
            },
            { name: 'Dumbbell Push Press', value: '10', note: '2 x 7.5/5kg.' },
            { type: 'divider' },
            '300m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td083Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_084 — Recovery                                                         */
/* ========================================================================== */

const td084Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Nothing should feel like work.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Glute Bridges',
  ],
};

const td084Strength: WorkoutBlockBase = {
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

const td084Additional: WorkoutBlockBase = {
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

const td084: StandaloneWorkoutSource = {
  id: 'td_084',
  title: 'Exhale',
  description:
    'Pure recovery at the end of the Power block. Light accessories, an easy Zone 2 piece and an extended stretch. Leave feeling looser than when you came in.',
  estimatedTime: 50,
  disciplines: ['Conditioning', 'Gymnastics'],
  bodyFocus: ['Full Body'],
  format: 'Intervals',
  levels: ['Intermediate', 'Advanced'],
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
        td084Warmup,
        td084Strength,
        {
          name: 'WOD: Zone 2 x 24',
          hrZone: 2,
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
        td084Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td084Warmup,
        td084Strength,
        {
          name: 'WOD: Zone 2 x 18',
          hrZone: 2,
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
        td084Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek12: StandaloneWorkoutSource[] = [
  td078,
  td079,
  td080,
  td081,
  td082,
  td083,
  td084,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek12Program: TemperedDailyWeek = {
  id: 'td_week_012',
  weekStart: '2027-02-01',
  blockName: 'Power',
  theme: 'Explosive Strength',
  phase: 'Test',
  description:
    'Test week. Power clean on Monday, broad jump on Wednesday, sprint on Friday. RX tests a one rep max clean, a best of three broad jump and a 40m sprint. Scaled tests a heavy three rep max clean, a best of three broad jump and a 20m sprint. Everything in between is light, fun and designed to keep you fresh for the next test. Log every score — these are your new numbers. Short on time? Do Monday, Wednesday and Friday, nothing else matters this week.',
  primaryFocus: 'Olympic Lifting',
  otherFocuses: ['Strength', 'Full Body', 'Lower Body'],
  nextWeekFocus: 'New block – revealed Monday',
  days: ['td_078', 'td_079', 'td_080', 'td_081', 'td_082', 'td_083', 'td_084'],
};
