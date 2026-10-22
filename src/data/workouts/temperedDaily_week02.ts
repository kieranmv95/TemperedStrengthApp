import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 1: The Big Three — Week 2: Strength – Accumulation */
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
/*  td_008 — Back squat volume                                                */
/* ========================================================================== */

const td008Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Lots of squat volume today, so take the warmup seriously. Open the hips and ankles, then groove the pattern with an empty bar.',
  movements: [
    '3 mins easy bike',
    '10 Spiderman Lunges with reach (5 each side)',
    '10 Goblet Squats with 3s pause at the bottom',
    '10 Banded Lateral Walks each way',
    '2 x 5 Empty Bar Back Squats',
  ],
};

const td008Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Builds the adductors and trunk that hold a squat together under fatigue.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Walking Lunges', value: '20 steps' },
    {
      name: 'Copenhagen Plank',
      value: '20s each side',
      note: 'Bend the top knee on the bench to make it easier.',
    },
    {
      name: 'Back Extension',
      value: '12',
      note: 'GHD or back extension bench. No machine? 15 Banded Good Mornings.',
    },
  ],
};

const td008: StandaloneWorkoutSource = {
  id: 'td_008',
  title: 'Under the Bar',
  description:
    'Five sets of five on the back squat. Every set at the same weight, every rep looking the same. Volume is the goal, not grinding. Then a longer AMRAP that leans on the engine and upper body while the legs recover.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength', 'AMRAP'],
  equipment: ['barbell', 'bike', 'dumbbell', 'bands', 'ghd'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 14,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td008Warmup,
        {
          name: 'Strength: Back Squat 5x5',
          instructions:
            'Warm up to your working weight in 3–4 sets, then complete 5 sets of 5 at the same weight. The first set should feel like RPE 7 and the last like RPE 8. If the last set is slower than RPE 8, go lighter next time. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '5 x 5 · Same weight every set',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 3 / 3 / 2 reps',
              note: 'Roughly 40% → 55% → 65% → 70% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '5 x 5 @ 72–78%',
              note: 'RPE 7 on set 1, RPE 8 by set 5.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 14',
          instructions:
            'As many rounds and reps as possible in 14 minutes. Settle into a pace you can hold from start to finish. The push press should be crisp, not grinding.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '12 cal Bike',
            {
              name: 'Dumbbell Push Press',
              value: '10',
              note: '2 x 22.5/15kg.',
            },
            '12 V-ups',
            '8 Burpees',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td008Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td008Warmup,
        {
          name: 'Strength: Back Squat 4x8',
          instructions:
            'Warm up to your working weight, then complete 4 sets of 8 at the same weight. Aim for RPE 7: three good reps left at the end of every set. Depth and position first. Goblet squats are a great option if the barbell is new to you. Rest 2 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · Same weight every set',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 8 @ RPE 7',
              note: 'Barbell back squat or goblet squat.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 14',
          instructions:
            'As many rounds and reps as possible in 14 minutes. Steady pace, quality reps.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '10 cal Bike',
            {
              name: 'Dumbbell Push Press',
              value: '10',
              note: '2 x 12.5/7.5kg.',
            },
            {
              name: 'Tuck-ups',
              value: '12',
              note: 'Bend the knees to make it easier.',
            },
            {
              name: 'Burpees',
              value: '6',
              note: 'Step back and step up if needed.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td008Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_009 — Long hybrid engine                                               */
/* ========================================================================== */

const td009Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'A long session ahead. Ease into the running and get the upper back ready for the pulling work.',
  movements: [
    '400m easy jog',
    '10 Leg Swings each direction each side',
    '10 Band Pull-Aparts',
    '10 Scapular Pull-ups',
    '250m easy ski erg or row',
  ],
};

const td009Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 45s between rounds. Biceps and grip for pulling under fatigue.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Dumbbell Hammer Curls', value: '12' },
    { name: 'Dead Hang', value: '30s' },
    '15 Reverse Flyes',
  ],
};

const td009: StandaloneWorkoutSource = {
  id: 'td_009',
  title: 'Long Haul',
  description:
    'A big hybrid engine session. Heavy rows and chin-ups to build the upper back, then four long rounds of running, ski, sled pull and sandbag lunges. Pace it like a race you want to finish strong.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Full Body', 'For Time'],
  equipment: ['barbell', 'pull-up bar', 'ski erg', 'sled', 'sandbag', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td009Warmup,
        {
          name: 'Strength: Pendlay Row + Chin-up Superset',
          instructions:
            '5 sets. Rows straight into chin-ups, then rest 90s. Every row starts from the floor with a flat back. Every chin-up starts from a dead hang.',
          highlightInstructions: '5 Sets · Rest 90s after each superset',
          movements: [
            {
              name: 'Pendlay Row',
              value: '6 @ RPE 7–8',
              note: 'Bar returns to the floor every rep. Explode up, control down.',
            },
            {
              name: 'Chin-ups',
              value: '5–6',
              note: 'Palms facing you. 3s lower on every rep.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 35 minute cap. This is long. Start slower than you think you need to and try to hold the same split every round.',
          highlightInstructions: 'Score: total time · Cap 35 mins',
          movements: [
            '800m Run',
            { name: 'Ski Erg', value: '250m', note: 'No ski erg? 300m row.' },
            {
              name: 'Sled Pull',
              value: '20m',
              note: 'Hand over hand with a rope, or walk backwards with a harness. No sled? 15 Heavy Kettlebell Bent-Over Rows.',
            },
            {
              name: 'Sandbag Walking Lunges',
              value: '20 steps',
              note: '20/10kg on the shoulders. No sandbag? Dumbbell front rack lunges.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td009Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td009Warmup,
        {
          name: 'Strength: Row + Pull-up Superset',
          instructions:
            '5 sets. Rows straight into the pull-up option, then rest 90s. Full range on every rep.',
          highlightInstructions: '5 Sets · Rest 90s after each superset',
          movements: [
            {
              name: 'Dumbbell Bent-Over Row',
              value: '10 @ RPE 7',
              note: 'Two dumbbells. Squeeze at the top.',
            },
            {
              name: 'Ring Rows or Banded Chin-ups',
              value: '8',
              note: 'Walk your feet forward on ring rows to make them harder.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 35 minute cap. Even pacing. Walking is fine, stopping is not.',
          highlightInstructions: 'Score: total time · Cap 35 mins',
          movements: [
            '600m Run',
            { name: 'Ski Erg', value: '200m', note: 'No ski erg? 250m row.' },
            {
              name: 'Sled Pull',
              value: '15m',
              note: 'Light load. No sled? 12 Kettlebell Bent-Over Rows.',
            },
            {
              name: 'Walking Lunges',
              value: '16 steps',
              note: 'Bodyweight, or a 10kg sandbag.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td009Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_010 — Bench press volume                                               */
/* ========================================================================== */

const td010Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Open the chest and wake up the upper back before pressing. Set your shoulder blades back and down on every rep.',
  movements: [
    '3 mins easy row',
    '15 Band Pull-Aparts',
    '10 Scapular Push-ups',
    '10 Banded External Rotations each side',
    '2 x 10 Empty Bar Bench Press',
  ],
};

const td010Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Triceps and rear delts.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    {
      name: 'Close Grip Push-ups',
      value: '12',
      note: 'Hands under the shoulders, elbows tight to the ribs.',
    },
    { name: 'Dumbbell Skull Crushers', value: '12' },
    { name: 'Face Pulls', value: '15', note: 'Cable or band. Elbows high.' },
  ],
};

const td010: StandaloneWorkoutSource = {
  id: 'td_010',
  title: 'Stacked',
  description:
    'Five sets of five on the bench press, all at the same weight. Smooth bar path, same touch point, every rep. Then a chipper that keeps the upper body busy without asking for more heavy pressing.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Upper Body', 'Strength', 'Chipper'],
  equipment: [
    'barbell',
    'rower',
    'pull-up bar',
    'dumbbell',
    'medicine ball',
    'skipping rope',
    'bands',
  ],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td010Warmup,
        {
          name: 'Strength: Bench Press 5x5',
          instructions:
            'Warm up to your working weight in 3–4 sets, then complete 5 sets of 5 at the same weight. RPE 7 on set 1, RPE 8 by set 5. Touch the chest, pause briefly, press. Use a spotter or safeties. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '5 x 5 · Always use a spotter or safeties',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 3 / 2 reps',
              note: 'Roughly 40% → 55% → 65% → 70% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '5 x 5 @ 72–78%',
              note: 'RPE 7 on set 1, RPE 8 by set 5.',
            },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 20 minute cap. Break the toes to bar and push press into small sets early so you never hit failure.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            '40 cal Row',
            '30 Toes to Bar',
            {
              name: 'Dumbbell Push Press',
              value: '20',
              note: '2 x 22.5/15kg.',
            },
            {
              name: 'Wall Balls',
              value: '30',
              note: '9/6kg to a 3m/2.7m target.',
            },
            {
              name: 'Double Unders',
              value: '60',
              note: 'No rope skills yet? 120 single unders.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td010Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td010Warmup,
        {
          name: 'Strength: Bench Press 4x8',
          instructions:
            'Warm up to your working weight, then complete 4 sets of 8 at the same weight, RPE 7. Barbell or dumbbells. Rest 2 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · Barbell or dumbbells',
          movements: [
            {
              name: 'Ramp sets',
              value: '10 / 8 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 8 @ RPE 7',
              note: 'Barbell or dumbbell bench press.',
            },
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 20 minute cap. Small sets, short rests.',
          highlightInstructions: 'Score: total time · Cap 20 mins',
          movements: [
            '30 cal Row',
            '20 Hanging Knee Raises',
            {
              name: 'Dumbbell Push Press',
              value: '15',
              note: '2 x 12.5/7.5kg.',
            },
            {
              name: 'Wall Balls',
              value: '20',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
            '80 Single Unders',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td010Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_011 — Athletic / snatch technique                                      */
/* ========================================================================== */

const td011Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Overhead positions need open shoulders and a strong midline. Build through the snatch in pieces with an empty bar.',
  movements: [
    '3 mins easy row',
    '10 Banded Shoulder Dislocates',
    '10 Overhead Squats with a PVC pipe or empty bar',
    'Empty Bar Snatch Drills: 5 Snatch Grip Deadlifts, 5 Muscle Snatches, 5 Hang Power Snatches',
  ],
};

const td011Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 45s between rounds. Overhead stability and trunk.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Single Arm Dumbbell Overhead Carry', value: '20m each side' },
    {
      name: 'Snatch Grip Behind the Neck Press',
      value: '8',
      note: 'Empty bar or light plates. Slow and strict.',
    },
    '30s Hollow Hold',
  ],
};

const td011: StandaloneWorkoutSource = {
  id: 'td_011',
  title: 'Overhead Speed',
  description:
    'A snatch technique EMOM to sharpen speed and overhead positions, followed by five intervals that blend running, burpees and a bike sprint. Light bar, fast elbows, big engine.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'Olympic Lifting', 'Intervals'],
  equipment: ['barbell', 'rower', 'bike', 'box', 'dumbbell', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'max_reps',
    label: 'Total bike calories',
    higherIsBetter: true,
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td011Warmup,
        {
          name: 'Strength: Snatch Technique EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes. Stay at 60–70% of your estimated power snatch 1RM (RPE 6). Every rep fast and crisp. If the bar drifts forward or the catch gets soft, take weight off.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '1 Hang Power Snatch + 1 Power Snatch + 1 Overhead Squat',
              note: 'Hang from just above the knee. Punch the bar up into the catch.',
            },
          ],
        },
        {
          name: 'WOD: 5 x 5 Min Intervals',
          instructions:
            'Start a new interval every 5 minutes, 5 intervals in total. Complete the run and burpees, then go hard on the bike for whatever time is left. Your score is the total bike calories across all 5 intervals.',
          highlightInstructions: 'Score: total bike calories',
          movements: [
            '400m Run',
            { name: 'Burpee Box Jump Overs', value: '10', note: '60/50cm.' },
            'Max cal Bike in the remaining time',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td011Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td011Warmup,
        {
          name: 'Strength: Snatch Technique EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes. Use a light barbell or a single dumbbell. Every rep fast and crisp. If you are new to the snatch, stay with the dumbbell option.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '2 Hang Power Snatches + 2 Overhead Squats',
              note: 'Barbell, or 1 dumbbell (alternate arms each minute).',
            },
          ],
        },
        {
          name: 'WOD: 5 x 5 Min Intervals',
          instructions:
            'Start a new interval every 5 minutes, 5 intervals in total. Complete the run and burpees, then ride the bike for whatever time is left. Your score is the total bike calories.',
          highlightInstructions: 'Score: total bike calories',
          movements: [
            '300m Run',
            { name: 'Burpee Box Step Overs', value: '8', note: '50/40cm.' },
            'Max cal Bike in the remaining time',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td011Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_012 — Deadlift volume                                                  */
/* ========================================================================== */

const td012Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Wake up the hamstrings and glutes and practise your brace before you pull.',
  movements: [
    '3 mins easy row',
    '10 Banded Good Mornings',
    '10 Single Leg Glute Bridges each side',
    '10 Bird Dogs (5 each side)',
    '2 x 5 Light Romanian Deadlifts',
  ],
};

const td012Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Hamstrings and trunk.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    {
      name: 'Nordic Curl Negatives',
      value: '5',
      note: 'Anchor your feet. Lower as slowly as you can, push back up with your hands.',
    },
    { name: 'Kettlebell Gorilla Rows', value: '8 each side' },
    { name: 'Pallof Press', value: '10 each side', note: 'Cable or band.' },
  ],
};

const td012: StandaloneWorkoutSource = {
  id: 'td_012',
  title: 'Dead Weight',
  description:
    'Five sets of five on the deadlift. Reset every rep, same set-up, same brace. Then take tired legs into three rounds of running, wall balls and box step-ups.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength', 'For Time'],
  equipment: [
    'barbell',
    'rower',
    'medicine ball',
    'box',
    'dumbbell',
    'kettlebell',
    'bands',
  ],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td012Warmup,
        {
          name: 'Strength: Conventional Deadlift 5x5',
          instructions:
            'Warm up to your working weight in 3–4 sets, then complete 5 sets of 5 at the same weight. Dead stop on the floor every rep, no touch and go. RPE 7 on set 1, RPE 8 by set 5. Rest 2–3 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '5 x 5 · Dead stop every rep',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 3 / 3 / 2 reps',
              note: 'Roughly 40% → 55% → 65% → 70% of estimated 1RM.',
            },
            {
              name: 'Working sets',
              value: '5 x 5 @ 72–78%',
              note: 'RPE 7 on set 1, RPE 8 by set 5.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 24 minute cap. Your legs will be heavy. Stay tall on the run and keep the step-ups rhythmic.',
          highlightInstructions: 'Score: total time · Cap 24 mins',
          movements: [
            '600m Run',
            {
              name: 'Wall Balls',
              value: '20',
              note: '9/6kg to a 3m/2.7m target.',
            },
            {
              name: 'Dumbbell Box Step-ups',
              value: '16',
              note: '2 x 15/10kg, 50/40cm box. Alternate legs.',
            },
            '10 Burpees',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td012Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td012Warmup,
        {
          name: 'Strength: Deadlift 4x8',
          instructions:
            'Warm up to your working weight, then complete 4 sets of 8 at the same weight, RPE 7. Reset every rep. Trap bar or kettlebell deadlifts are great options. Rest 2 mins between sets. Record your working weight in your notes.',
          highlightInstructions: '4 x 8 · Dead stop every rep',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Working sets',
              value: '4 x 8 @ RPE 7',
              note: 'Barbell, trap bar or heavy kettlebell.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 24 minute cap. Steady and consistent.',
          highlightInstructions: 'Score: total time · Cap 24 mins',
          movements: [
            '400m Run',
            {
              name: 'Wall Balls',
              value: '15',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
            {
              name: 'Box Step-ups',
              value: '16',
              note: 'Bodyweight, 40cm box. Alternate legs.',
            },
            {
              name: 'Burpees',
              value: '8',
              note: 'Step back and step up if needed.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td012Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_013 — Long AMRAP                                                       */
/* ========================================================================== */

const td013Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Two easy rounds, then practice reps of the stations.',
  movements: [
    '2 Rounds: 200m Run, 10 Air Squats, 10 Push-ups, 5 Inchworms',
    'Practice: 5 Wall Balls, 5 Kettlebell Swings, 3 Burpees',
  ],
};

const td013Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. 2 rounds, rest as needed.',
  highlightInstructions: '2 Rounds · Optional',
  movements: ['15 Band Pull-Aparts', '12 Dumbbell Curls', '20 Calf Raises'],
};

const td013: StandaloneWorkoutSource = {
  id: 'td_013',
  title: 'Engine Room',
  description:
    'A kettlebell strength circuit, then a long 28 minute AMRAP of running, wall balls, swings and burpees. Big volume, no heavy barbell. Find a rhythm you can hold and stay in it.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'AMRAP'],
  equipment: ['kettlebell', 'medicine ball', 'dumbbell'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 28,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td013Warmup,
        {
          name: 'Strength: Kettlebell Circuit',
          instructions:
            '4 rounds, rest 60s between rounds. Heavy enough that the last reps are hard, never sloppy.',
          highlightInstructions: '4 Rounds · No barbell today',
          movements: [
            {
              name: 'Double Kettlebell Front Rack Squat',
              value: '8',
              note: '2 x 24/16kg.',
            },
            {
              name: 'Double Kettlebell Row',
              value: '10',
              note: '2 x 24/16kg.',
            },
            '30s Hollow Hold',
          ],
        },
        {
          name: 'WOD: AMRAP 28',
          instructions:
            'As many rounds and reps as possible in 28 minutes. This is long. Treat the run as your recovery and keep the stations moving. Each round should take about the same time.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '400m Run',
            {
              name: 'Wall Balls',
              value: '20',
              note: '9/6kg to a 3m/2.7m target.',
            },
            {
              name: 'Kettlebell Swings',
              value: '20',
              note: '24/16kg, Russian (eye level).',
            },
            '10 Burpees',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td013Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td013Warmup,
        {
          name: 'Strength: Kettlebell Circuit',
          instructions:
            '4 rounds, rest 60s between rounds. Choose a load you can move with perfect form.',
          highlightInstructions: '4 Rounds · No barbell today',
          movements: [
            { name: 'Kettlebell Goblet Squat', value: '10', note: '16/12kg.' },
            {
              name: 'Single Arm Kettlebell Row',
              value: '10 each side',
              note: '16/12kg.',
            },
            '20s Hollow Hold',
          ],
        },
        {
          name: 'WOD: AMRAP 28',
          instructions:
            'As many rounds and reps as possible in 28 minutes. Steady pace, quality reps.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '300m Run',
            {
              name: 'Wall Balls',
              value: '15',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
            {
              name: 'Kettlebell Swings',
              value: '15',
              note: '16/12kg, Russian (eye level).',
            },
            {
              name: 'Burpees',
              value: '8',
              note: 'Step back and step up if needed.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td013Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_014 — Recovery engine                                                  */
/* ========================================================================== */

const td014Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions: 'Gentle. Move everything through a comfortable range.',
  movements: [
    '5 mins very easy row',
    '10 Cat Cows',
    '10 Thread the Needle each side',
    '10 Glute Bridges',
  ],
};

const td014Strength: WorkoutBlockBase = {
  name: 'Strength: Tempo Pull and Core',
  instructions:
    '3 rounds, rest 60s between rounds. Light and slow. Finish every set feeling like you had 4 or more reps left.',
  highlightInstructions: '3 Rounds · RPE 6 max',
  movements: [
    { name: 'Ring Rows', value: '10', note: '3s lower, pause at the top.' },
    {
      name: 'Single Arm Dumbbell Row',
      value: '10 each side',
      note: 'Light. Squeeze for 1s at the top.',
    },
    {
      name: 'Dead Bugs',
      value: '12',
      note: 'Slow. Low back stays flat on the floor.',
    },
  ],
};

const td014Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions: 'Optional. Slow, controlled mobility. Take your time.',
  highlightInstructions: 'Optional',
  movements: [
    '10 90/90 Hip Switches each side',
    '10 Wall Slides',
    '2 mins Deep Squat Hold (accumulate)',
  ],
};

const td014: StandaloneWorkoutSource = {
  id: 'td_014',
  title: 'Easy Miles',
  description:
    'A recovery session built around easy aerobic work. Light tempo pulling, a long Zone 2 piece across four machines and a full stretch. Conversational pace from start to finish.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Core', 'Intervals'],
  equipment: ['dumbbell', 'rower', 'bike', 'ski erg', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td014Warmup,
        td014Strength,
        {
          name: 'WOD: Zone 2 x 32',
          instructions:
            'Four 8 minute pieces, no rest between them. Stay in Zone 2: you should be able to talk in full sentences the whole time. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '8 mins' },
            { name: 'Bike', value: '8 mins' },
            { name: 'Run', value: '8 mins', note: 'Easy jog or treadmill.' },
            {
              name: 'Ski Erg',
              value: '8 mins',
              note: 'No ski erg? 8 mins incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td014Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td014Warmup,
        td014Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Four 6 minute pieces, no rest between them. Stay at a pace where you can talk in full sentences. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Row', value: '6 mins' },
            { name: 'Bike', value: '6 mins' },
            {
              name: 'Run or Walk',
              value: '6 mins',
              note: 'Brisk walk or easy jog.',
            },
            {
              name: 'Ski Erg',
              value: '6 mins',
              note: 'No ski erg? 6 mins incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td014Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek02: StandaloneWorkoutSource[] = [
  td008,
  td009,
  td010,
  td011,
  td012,
  td013,
  td014,
];

/* ---------------------------- Weekly wrapper ------------------------------ */

export const temperedDailyWeek02Program: TemperedDailyWeek = {
  id: 'td_week_002',
  weekStart: '2026-11-02',
  blockName: 'The Big Three',
  theme: 'Strength',
  phase: 'Accumulation',
  description:
    'Volume week. Squat Monday, bench Wednesday and deadlift Friday all move to five sets of five at the same weight, so every set is a chance to practise perfect reps. The conditioning gets longer too, with the biggest sessions of the block on Tuesday and Saturday. Eat well and sleep well this week. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Strength',
  otherFocuses: ['Lower Body', 'Upper Body', 'Cardio'],
  nextWeekFocus: 'Strength – Intensification',
  days: ['td_008', 'td_009', 'td_010', 'td_011', 'td_012', 'td_013', 'td_014'],
};
