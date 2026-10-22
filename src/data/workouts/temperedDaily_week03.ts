import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* ------------------------------------------------------------------------------ */
/*  TEMPERED DAILY — Block 1: The Big Three — Week 3: Strength – Intensification   */
/* ------------------------------------------------------------------------------ */
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
 * Taper week: heavier main lifts, ~40% less total volume, short sharp WODs.
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
/*  td_015 — Back squat heavy doubles                                         */
/* ========================================================================== */

const td015Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Heavy squats today. Take a little longer than usual and make every warmup rep look like a working rep.',
  movements: [
    '3 mins easy bike',
    '10 Cossack Squats (5 each side)',
    '10 Goblet Squats with 3s pause at the bottom',
    '10 Glute Bridges with 2s squeeze',
    '2 x 5 Empty Bar Back Squats',
  ],
};

const td015Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 2 rounds only, rest 60s. Keep it light. Today is about the heavy work.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Goblet Box Squat', value: '10', note: 'Light. Pause on the box.' },
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td015: StandaloneWorkoutSource = {
  id: 'td_015',
  title: 'Heavy Doubles',
  description:
    'Heavier weights, fewer reps. Four sets of two on the back squat at a weight that demands your full attention, then a short, sharp sprint finisher. Less total work, more quality.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Lower Body', 'Strength', 'For Time'],
  equipment: ['barbell', 'rower', 'bike', 'box', 'kettlebell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td015Warmup,
        {
          name: 'Strength: Back Squat 4x2',
          instructions:
            'Warm up in 5–6 sets, then complete 4 sets of 2 at around 85% of your estimated 1RM (RPE 8). Every double should be fast and controlled. If the second rep slows right down, take 5kg off. Rest 3 mins between sets. Use safeties. Record your working weight in your notes.',
          highlightInstructions: '4 x 2 · Rest 3 mins · Use safeties',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 3 / 2 / 1 / 1 reps',
              note: 'Roughly 40% → 55% → 65% → 75% → 80% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '4 x 2 @ 85%',
              note: 'RPE 8. Two good reps left in every set.',
            },
          ],
        },
        {
          name: 'WOD: 21-15-9 For Time',
          instructions:
            'Three rounds of rowing and push-ups, 8 minute cap. This should hurt for a short time. Go hard from the first stroke.',
          highlightInstructions: 'Score: total time · Cap 8 mins',
          movements: ['21-15-9 cal Row', '21-15-9 Hand Release Push-ups'],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td015Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td015Warmup,
        {
          name: 'Strength: Back Squat 4x3',
          instructions:
            'Warm up in 4–5 sets, then complete 4 sets of 3 at RPE 7–8: heavy, but every rep looks the same. Barbell or heavy goblet squat. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 3 · Rest 2–3 mins',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 3 / 3 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 3 @ RPE 7–8',
              note: 'Barbell back squat or goblet squat.',
            },
          ],
        },
        {
          name: 'WOD: 15-12-9 For Time',
          instructions:
            'Three rounds of rowing and push-ups, 8 minute cap. Short and fast.',
          highlightInstructions: 'Score: total time · Cap 8 mins',
          movements: [
            '15-12-9 cal Row',
            {
              name: 'Push-ups',
              value: '15-12-9',
              note: 'Hands on a box or bench if needed.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td015Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_016 — Race pace intervals                                              */
/* ========================================================================== */

const td016Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Build up the running speed gradually. The last strides should feel close to race pace.',
  movements: [
    '400m easy jog',
    '10 Walking Lunges with a twist',
    '10 A-Skips each leg',
    '3 x 60m strides, building speed',
    '5 Wall Ball Throws (light ball)',
  ],
};

const td016Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s. Light core.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['12 Dead Bugs', '20s Hollow Hold', '10 Superman Lifts'],
};

const td016: StandaloneWorkoutSource = {
  id: 'td_016',
  title: 'Race Pace',
  description:
    'Short, fast and repeatable. A few quality pull-ups and rows, then five intervals of running and wall balls with built-in rest. Hit the same pace every round. Your score is your slowest round.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['pull-up bar', 'dumbbell', 'medicine ball', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Slowest round', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td016Warmup,
        {
          name: 'Strength: Pull Primer',
          instructions:
            '3 sets, rest 90s after each pair. Strict and controlled. Leave plenty in the tank.',
          highlightInstructions: '3 Sets · RPE 7',
          movements: [
            {
              name: 'Strict Pull-ups',
              value: '5',
              note: 'Full dead hang at the bottom.',
            },
            {
              name: 'Single Arm Dumbbell Row',
              value: '8 each side',
              note: 'Heavy, but no twisting.',
            },
          ],
        },
        {
          name: 'WOD: 5 Rounds Every 4 Mins',
          instructions:
            'Start a round every 4 minutes, 5 rounds in total. Rest for whatever is left of the 4 minutes. Note each round time. Your score is your slowest round, so do not blow up on round one.',
          highlightInstructions: 'Score: slowest round',
          movements: [
            '400m Run',
            {
              name: 'Wall Balls',
              value: '15',
              note: '9/6kg to a 3m/2.7m target.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td016Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td016Warmup,
        {
          name: 'Strength: Pull Primer',
          instructions:
            '3 sets, rest 90s after each pair. Full range on every rep.',
          highlightInstructions: '3 Sets · RPE 7',
          movements: [
            { name: 'Banded Pull-ups or Ring Rows', value: '6–8' },
            { name: 'Single Arm Dumbbell Row', value: '10 each side' },
          ],
        },
        {
          name: 'WOD: 5 Rounds Every 4 Mins',
          instructions:
            'Start a round every 4 minutes, 5 rounds in total. Rest for whatever is left. Your score is your slowest round.',
          highlightInstructions: 'Score: slowest round',
          movements: [
            '300m Run',
            {
              name: 'Wall Balls',
              value: '12',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td016Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_017 — Bench heavy doubles                                              */
/* ========================================================================== */

const td017Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Heavy pressing today. Open the chest, set the shoulders, and take your time building up.',
  movements: [
    '3 mins easy ski erg or row',
    '15 Band Pull-Aparts',
    '10 Scapular Push-ups',
    '10 Banded Shoulder Dislocates',
    '2 x 10 Empty Bar Bench Press',
  ],
};

const td017Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s. Light shoulder health work.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Face Pulls', value: '15', note: 'Cable or band.' },
    { name: 'Banded External Rotations', value: '12 each side' },
  ],
};

const td017: StandaloneWorkoutSource = {
  id: 'td_017',
  title: 'Tight Arch',
  description:
    'Four heavy doubles on the bench press. Set up the same way every time: feet planted, shoulder blades pinned, bar over the wrists. Then a short AMRAP that works the trunk and engine without more pressing.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Upper Body', 'Strength', 'AMRAP'],
  equipment: ['barbell', 'pull-up bar', 'box', 'dumbbell', 'ski erg', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 8,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td017Warmup,
        {
          name: 'Strength: Bench Press 4x2',
          instructions:
            'Warm up in 5–6 sets, then complete 4 sets of 2 at around 85% of your estimated 1RM (RPE 8). Touch, brief pause, press. Always use a spotter or safeties. Rest 3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 2 · Always use a spotter or safeties',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 3 / 1 / 1 reps',
              note: 'Roughly 40% → 55% → 65% → 75% → 80% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '4 x 2 @ 85%',
              note: 'RPE 8. Two good reps left in every set.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 8',
          instructions:
            'As many rounds and reps as possible in 8 minutes. Move quickly between stations.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '6 Toes to Bar',
            {
              name: 'Dumbbell Box Step-ups',
              value: '8',
              note: '2 x 15/10kg, 50/40cm box.',
            },
            {
              name: 'Ski Erg',
              value: '10 cal',
              note: 'No ski erg? 10 cal row.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td017Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td017Warmup,
        {
          name: 'Strength: Bench Press 4x3',
          instructions:
            'Warm up in 4–5 sets, then complete 4 sets of 3 at RPE 7–8. Barbell or dumbbells. Use a spotter or safeties. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 3 · Barbell or dumbbells',
          movements: [
            {
              name: 'Ramp sets',
              value: '10 / 6 / 4 / 3 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 3 @ RPE 7–8',
              note: 'Barbell or dumbbell bench press.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 8',
          instructions:
            'As many rounds and reps as possible in 8 minutes. Smooth and steady.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '6 Hanging Knee Raises',
            { name: 'Box Step-ups', value: '8', note: 'Bodyweight, 40cm box.' },
            { name: 'Ski Erg', value: '8 cal', note: 'No ski erg? 8 cal row.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td017Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_018 — Athletic / clean & jerk technique + Tabata                       */
/* ========================================================================== */

const td018Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Light and springy. Build the clean and jerk in pieces with an empty bar.',
  movements: [
    '3 mins easy row',
    '10 Inchworms',
    '10 Banded Shoulder Dislocates',
    'Empty Bar Drills: 5 Hang Power Cleans, 5 Push Presses, 5 Split Jerks',
  ],
};

const td018Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 45s.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    { name: 'Single Arm Kettlebell Strict Press', value: '8 each side' },
    '30s Hollow Rock',
  ],
};

const td018: StandaloneWorkoutSource = {
  id: 'td_018',
  title: 'Quick Feet',
  description:
    'A light clean and jerk EMOM to stay fast and sharp, then a four-part Tabata that gets the heart rate up without loading the legs. Short, punchy and fun.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Full Body', 'Olympic Lifting', 'Tabata'],
  equipment: ['barbell', 'rower', 'bike', 'kettlebell', 'bands'],
  isPremium: true,
  logSchema: { kind: 'max_reps', label: 'Total reps', higherIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td018Warmup,
        {
          name: 'Strength: Clean & Jerk EMOM 10',
          instructions:
            'Every minute on the minute for 10 minutes. Stay at 60–65% of your estimated clean and jerk 1RM. Fast under the bar, locked out overhead, stable feet.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '1 Power Clean + 1 Split Jerk',
              note: 'Push press is fine if the split jerk is new to you.',
            },
          ],
        },
        {
          name: 'WOD: Tabata x 4',
          instructions:
            'Four Tabatas back to back: 8 rounds of 20s work, 10s rest on each movement, with 1 min rest between movements. Count every rep or calorie. Your score is the total of everything.',
          highlightInstructions: '20s on / 10s off · Score: total reps',
          movements: [
            'Tabata 1: Row (calories)',
            'Tabata 2: Push-ups',
            'Tabata 3: Bike (calories)',
            'Tabata 4: Sit-ups',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td018Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td018Warmup,
        {
          name: 'Strength: Clean & Press EMOM 10',
          instructions:
            'Every minute on the minute for 10 minutes. Light barbell or a pair of dumbbells. Fast and crisp.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '2 Hang Power Cleans + 2 Push Presses',
              note: 'Barbell, or 2 dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: Tabata x 4',
          instructions:
            'Four Tabatas back to back: 8 rounds of 20s work, 10s rest, with 1 min rest between movements. Your score is the total of everything.',
          highlightInstructions: '20s on / 10s off · Score: total reps',
          movements: [
            'Tabata 1: Row (calories)',
            {
              name: 'Tabata 2: Push-ups',
              value: '8 x 20s',
              note: 'Hands on a box or bench if needed.',
            },
            'Tabata 3: Bike (calories)',
            'Tabata 4: Sit-ups',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td018Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_019 — Deadlift heavy doubles                                           */
/* ========================================================================== */

const td019Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Heavy pulls today. Prime the hinge, practise the brace and build up patiently.',
  movements: [
    '3 mins easy bike',
    '10 Kettlebell Good Mornings',
    '10 Glute Bridges with 2s squeeze',
    '10 Dead Bugs (5 each side)',
    '2 x 5 Light Romanian Deadlifts',
  ],
};

const td019Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest 60s. Light posterior chain only.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    {
      name: 'Back Extension',
      value: '10',
      note: 'GHD or back extension bench. No machine? 12 Banded Good Mornings.',
    },
    { name: 'Suitcase Hold', value: '30s each side' },
  ],
};

const td019: StandaloneWorkoutSource = {
  id: 'td_019',
  title: 'Pull Heavy',
  description:
    'Four heavy doubles on the deadlift. Every rep from a dead stop, every rep braced like it is your heaviest. Then a short, fast finisher of running and burpees.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 50,
  tags: ['Lower Body', 'Strength', 'For Time'],
  equipment: ['barbell', 'kettlebell', 'bike', 'dumbbell', 'ghd'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td019Warmup,
        {
          name: 'Strength: Conventional Deadlift 4x2',
          instructions:
            'Warm up in 5–6 sets, then complete 4 sets of 2 at around 85% of your estimated 1RM (RPE 8). Full reset between reps. If your back rounds, the set is over. Rest 3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 2 · Full reset every rep',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 3 / 2 / 1 / 1 reps',
              note: 'Roughly 40% → 55% → 65% → 75% → 80% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '4 x 2 @ 85%',
              note: 'RPE 8. Two good reps left in every set.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 10 minute cap. Fast, but stay smooth on the dumbbell.',
          highlightInstructions: 'Score: total time · Cap 10 mins',
          movements: [
            '300m Run',
            '10 Burpees over the Dumbbell',
            {
              name: 'Dumbbell Hang Clean & Jerk',
              value: '10',
              note: '1 x 22.5/15kg. Alternate arms every rep.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td019Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td019Warmup,
        {
          name: 'Strength: Deadlift 4x3',
          instructions:
            'Warm up in 4–5 sets, then complete 4 sets of 3 at RPE 7–8. Reset every rep. Barbell, trap bar or heavy kettlebell. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 3 · Full reset every rep',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 3 / 3 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 3 @ RPE 7–8',
              note: 'Barbell, trap bar or heavy kettlebell.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 10 minute cap. Quick and controlled.',
          highlightInstructions: 'Score: total time · Cap 10 mins',
          movements: [
            '200m Run',
            {
              name: 'Burpees',
              value: '8',
              note: 'Step back and step up if needed.',
            },
            {
              name: 'Dumbbell Hang Clean & Press',
              value: '8',
              note: '1 x 12.5/7.5kg. Alternate arms every rep.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td019Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_020 — Short sharp AMRAP                                                */
/* ========================================================================== */

const td020Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Easy rounds, then a few reps of everything in the AMRAP.',
  movements: [
    '2 Rounds: 200m Run, 10 Air Squats, 10 Push-ups',
    'Practice: 5 Wall Balls, 3 Box Jump Overs, 5 Ball Slams',
  ],
};

const td020Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    '15 Band Pull-Aparts',
    '20s Side Plank each side',
    '15 Calf Raises',
  ],
};

const td020: StandaloneWorkoutSource = {
  id: 'td_020',
  title: 'Quick Fire',
  description:
    'Short and fast. Medicine ball power work to start, then a 12 minute AMRAP of running, wall balls, box jumps and slams. Quick feet, quick transitions, no wasted time.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Full Body', 'AMRAP'],
  equipment: ['medicine ball', 'box'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 12,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td020Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions:
            '4 rounds, rest 60s between rounds. Every rep is explosive.',
          highlightInstructions: '4 Rounds · Fast and powerful',
          movements: [
            {
              name: 'Medicine Ball Chest Pass to a Wall',
              value: '5',
              note: '6–9kg. Throw as hard as you can.',
            },
            {
              name: 'Rotational Medicine Ball Throw',
              value: '4 each side',
              note: 'Against a wall.',
            },
            { name: 'Broad Jumps', value: '3', note: 'Stick every landing.' },
          ],
        },
        {
          name: 'WOD: AMRAP 12',
          instructions:
            'As many rounds and reps as possible in 12 minutes. Push the pace, but keep every box jump controlled.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '200m Run',
            { name: 'Wall Balls', value: '10', note: '9/6kg.' },
            { name: 'Box Jump Overs', value: '8', note: '60/50cm.' },
            { name: 'Ball Slams', value: '10', note: '10/6kg.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td020Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td020Warmup,
        {
          name: 'Strength: Medicine Ball Power',
          instructions:
            '4 rounds, rest 60s between rounds. Fast, explosive reps.',
          highlightInstructions: '4 Rounds · Fast and powerful',
          movements: [
            {
              name: 'Medicine Ball Chest Pass to a Wall',
              value: '5',
              note: '4–6kg.',
            },
            { name: 'Rotational Medicine Ball Throw', value: '4 each side' },
            { name: 'Broad Jumps', value: '3' },
          ],
        },
        {
          name: 'WOD: AMRAP 12',
          instructions:
            'As many rounds and reps as possible in 12 minutes. Smooth and steady.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '150m Run',
            { name: 'Wall Balls', value: '10', note: '6/4kg.' },
            { name: 'Box Step Overs', value: '8', note: '50/40cm.' },
            { name: 'Ball Slams', value: '10', note: '6/4kg.' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td020Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_021 — Recovery and mobility                                            */
/* ========================================================================== */

const td021Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Get warm and loose.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Band Pull-Aparts',
  ],
};

const td021Strength: WorkoutBlockBase = {
  name: 'Strength: Light Activation',
  instructions:
    '2 rounds, rest 60s. Very light. The aim is blood flow and good positions, nothing more.',
  highlightInstructions: '2 Rounds · RPE 5 max',
  movements: [
    { name: 'Goblet Squat', value: '10', note: 'Light. 3s lower.' },
    { name: 'Push-ups', value: '10', note: 'Slow and smooth.' },
    {
      name: 'Kettlebell Romanian Deadlift',
      value: '10',
      note: 'Light. Feel the hamstring stretch.',
    },
  ],
};

const td021Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Extra mobility. Take your time with each one.',
  highlightInstructions: 'Optional',
  movements: [
    '10 Controlled Hip Circles each side (on all fours)',
    '10 Wall Slides',
    '2 mins Dead Hang (accumulate in as many sets as needed)',
    '2 mins Box Breathing (4s in, 4s hold, 4s out, 4s hold)',
  ],
};

const td021: StandaloneWorkoutSource = {
  id: 'td_021',
  title: 'Reset',
  description:
    'A short recovery session to leave you feeling fresh. Light activation work, an easy Zone 2 piece and a longer stretch. Perfect before a big lifting day.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 45,
  tags: ['Cardio', 'Full Body', 'Intervals'],
  equipment: ['bike', 'rower', 'kettlebell', 'bands', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td021Warmup,
        td021Strength,
        {
          name: 'WOD: Zone 2 x 20',
          instructions:
            'Two 10 minute pieces, no rest between them. Conversational pace the whole time. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '10 mins' },
            { name: 'Row', value: '10 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td021Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td021Warmup,
        td021Strength,
        {
          name: 'WOD: Zone 2 x 16',
          instructions:
            'Two 8 minute pieces, no rest between them. Conversational pace. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '8 mins' },
            { name: 'Row', value: '8 mins' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td021Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek03: StandaloneWorkoutSource[] = [
  td015,
  td016,
  td017,
  td018,
  td019,
  td020,
  td021,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek03Program: TemperedDailyWeek = {
  id: 'td_week_003',
  weekStart: '2026-11-09',
  blockName: 'The Big Three',
  theme: 'Strength',
  phase: 'Intensification',
  description:
    'Heavier, but less. The squat, bench and deadlift move to heavy doubles at around 85%, while total volume drops by about 40%. Conditioning is short and sharp, and sessions are a little shorter. This is how you arrive fresh and strong for test week. Resist the urge to add extra work. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Strength',
  otherFocuses: ['Lower Body', 'Upper Body', 'Cardio'],
  nextWeekFocus: 'Strength – Test',
  days: ['td_015', 'td_016', 'td_017', 'td_018', 'td_019', 'td_020', 'td_021'],
};
