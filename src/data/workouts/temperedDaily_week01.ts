import type {
  StandaloneWorkoutSource,
  TemperedDailyWeek,
  WorkoutBlockBase,
} from '@/src/types/workouts';

/* -------------------------------------------------------------------------- */
/*  TEMPERED DAILY — Block 1: The Big Three — Week 1: Strength – Discovery    */
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
/*  td_001 — Back Squat                                                       */
/* ========================================================================== */

const td001Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Raise the temperature, open the hips and ankles, then groove the squat pattern with an empty bar.',
  movements: [
    '3 mins easy bike or row',
    '10 Cossack Squats (5 each side)',
    '10 Goblet Squats with 3s pause at the bottom',
    '10 Glute Bridges with 2s squeeze at the top',
    '2 x 5 Empty Bar Back Squats',
  ],
};

const td001Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Single leg strength and a strong back keep your squat honest.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    {
      name: 'Bulgarian Split Squat',
      value: '10 each leg',
      note: 'Dumbbells at your sides. Front shin close to vertical.',
    },
    {
      name: 'Back Extension',
      value: '12',
      note: 'GHD or back extension bench. No machine? 15 Banded Good Mornings.',
    },
    { name: 'Side Plank', value: '30s each side' },
  ],
};

const td001: StandaloneWorkoutSource = {
  id: 'td_001',
  title: 'Find Your Five',
  description:
    'A back squat session built around one question: what does a hard five feel like today? Build to a heavy set of five with two reps left in the tank, back off for volume, then finish with a short, punchy AMRAP that keeps the legs out of it.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength', 'AMRAP'],
  equipment: ['barbell', 'kettlebell', 'rower', 'dumbbell', 'ghd'],
  isPremium: true,
  logSchema: {
    kind: 'amrap',
    timeCapMinutes: 10,
    roundsLabel: 'Rounds',
    extraRepsLabel: 'Extra reps',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td001Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            'Build across 5–6 sets to a heavy set of 5 at RPE 8 (2 good reps left). Rest 2–3 mins between the heavier sets. Then drop the weight by 10% and complete 2 more sets of 5. Record your heaviest set of five in your notes.',
          highlightInstructions: 'Heaviest set = RPE 8. Not a max.',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 5 / 3 / 3 reps',
              note: 'Roughly 40% → 55% → 65% → 72% of estimated 1RM.',
            },
            {
              name: 'Top set',
              value: '1 x 5 @ RPE 8',
              note: 'Usually around 75–80% of 1RM.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 5 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 10',
          instructions:
            'As many rounds and reps as possible in 10 minutes. Your legs are tired, so this one is driven by the engine and upper body. Find a pace you can hold, then push the last two minutes.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '12 cal Row',
            '10 Hand Release Push-ups',
            {
              name: 'Kettlebell Swings',
              value: '8',
              note: '24/16kg, Russian (eye level).',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td001Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td001Warmup,
        {
          name: 'Strength: Back Squat',
          instructions:
            'Build across 5–6 sets to a solid set of 8 at RPE 7 (3 good reps left). Depth and position come before load. Then drop the weight by 10% and complete 2 more sets of 8. If the barbell does not feel right yet, use a heavy goblet squat. Record your heaviest set in your notes.',
          highlightInstructions: 'Heaviest set = RPE 7. Own every rep.',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 8 / 5 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Top set',
              value: '1 x 8 @ RPE 7',
              note: 'Barbell back squat or goblet squat.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 8 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: AMRAP 10',
          instructions:
            'As many rounds and reps as possible in 10 minutes. Steady pace, quality reps.',
          highlightInstructions: 'Score: rounds + reps',
          movements: [
            '10 cal Row',
            {
              name: 'Push-ups',
              value: '10',
              note: 'Hands on a box or bench if needed. Chest to the box every rep.',
            },
            {
              name: 'Kettlebell Swings',
              value: '8',
              note: '16/12kg, Russian (eye level).',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td001Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_002 — Hybrid engine                                                    */
/* ========================================================================== */

const td002Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Get the legs moving and the lungs open. The pulling work comes first, so prep the shoulders too.',
  movements: [
    '400m easy jog',
    '10 Walking Lunges with a twist',
    '10 Band Pull-Aparts',
    '10 Scapular Pull-ups',
    '5 Air Squats to 5 Wall Ball Throws (light ball)',
  ],
};

const td002Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 45s between rounds. Grip and core for race day.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    {
      name: 'Farmers Carry',
      value: '40m',
      note: 'Heavy dumbbells or kettlebells.',
    },
    '12 Dead Bugs (6 each side)',
    '30s Hollow Hold',
  ],
};

const td002: StandaloneWorkoutSource = {
  id: 'td_002',
  title: 'Station to Station',
  description:
    'A hybrid engine session with a race-day feel. Some quality pulling to start, then four rounds of running, sled and wall balls. Learn the pace you can repeat, not the pace you can survive once.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Full Body', 'For Time'],
  equipment: ['barbell', 'pull-up bar', 'sled', 'medicine ball', 'bands'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td002Warmup,
        {
          name: 'Strength: Row + Pull-up Superset',
          instructions:
            '4 sets. Move straight from rows into pull-ups, then rest 90s. Controlled, strict reps. This is about building a back that holds position when you are tired.',
          highlightInstructions: '4 Sets · Rest 90s after each superset',
          movements: [
            {
              name: 'Barbell Bent-Over Row',
              value: '8 @ RPE 7',
              note: 'Torso near parallel. Pull to the belly button.',
            },
            {
              name: 'Strict Pull-ups',
              value: '6–8',
              note: 'Full dead hang at the bottom, chin over bar.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 30 minute cap. Run at a pace you could hold for all four rounds. The goal is that your last round is your fastest.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '800m Run',
            {
              name: 'Sled Push',
              value: '20m',
              note: 'Loaded so it moves steadily, not sprinting. No sled? 30 Heavy Dumbbell Walking Lunges.',
            },
            {
              name: 'Wall Balls',
              value: '20',
              note: '9/6kg to a 3m/2.7m target.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td002Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td002Warmup,
        {
          name: 'Strength: Row + Pull-up Superset',
          instructions:
            '4 sets. Move straight from rows into the pull-up option, then rest 90s. Controlled reps with full range.',
          highlightInstructions: '4 Sets · Rest 90s after each superset',
          movements: [
            {
              name: 'Dumbbell Bent-Over Row',
              value: '10 @ RPE 7',
              note: 'Two dumbbells or barbell. Squeeze at the top.',
            },
            {
              name: 'Ring Rows or Banded Pull-ups',
              value: '8–10',
              note: 'Walk your feet forward on ring rows to make them harder.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 30 minute cap. Even pacing. Walking is fine, stopping is not.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '600m Run',
            {
              name: 'Sled Push',
              value: '15m',
              note: 'Light to moderate load. No sled? 20 Dumbbell Walking Lunges.',
            },
            {
              name: 'Wall Balls',
              value: '15',
              note: '6/4kg to a 2.7m/2.5m target.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td002Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_003 — Bench press                                                      */
/* ========================================================================== */

const td003Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Open the chest and wake up the upper back before pressing. Set your shoulder blades back and down on every rep.',
  movements: [
    '3 mins easy ski erg or row',
    '15 Band Pull-Aparts',
    '10 Scapular Push-ups',
    '10 Banded Shoulder Dislocates',
    '2 x 10 Empty Bar Bench Press',
  ],
};

const td003Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Builds the triceps and rear delts that a strong bench depends on.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    {
      name: 'Incline Dumbbell Press',
      value: '12',
      note: '30–45° incline, 2s lowering.',
    },
    {
      name: 'Face Pulls',
      value: '15',
      note: 'Cable or band. Elbows high, pull to the forehead.',
    },
    {
      name: 'Dips',
      value: '8–12',
      note: 'Bar or bench. Stay upright for triceps.',
    },
  ],
};

const td003: StandaloneWorkoutSource = {
  id: 'td_003',
  title: 'Press Test',
  description:
    'A bench press session to find where you stand. Build to a heavy set of five, back off for volume, then take on an EMOM that blends gymnastics pulling with machine work. Shoulder blades pinned, feet planted, bar path straight.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Upper Body', 'Strength', 'EMOM'],
  equipment: ['barbell', 'pull-up bar', 'ski erg', 'ghd', 'dumbbell', 'bands'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Bench top set (kg x reps), EMOM reps missed',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td003Warmup,
        {
          name: 'Strength: Bench Press',
          instructions:
            'Build across 5–6 sets to a heavy set of 5 at RPE 8 (2 good reps left). Rest 2–3 mins between the heavier sets. Then drop the weight by 10% and complete 2 more sets of 5. Touch the chest, pause briefly, press. Use a spotter on the heavy sets. Record your heaviest set of five in your notes.',
          highlightInstructions:
            'Heaviest set = RPE 8. Always use a spotter or safeties.',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 5 / 3 / 3 reps',
              note: 'Roughly 40% → 55% → 65% → 72% of estimated 1RM.',
            },
            {
              name: 'Top set',
              value: '1 x 5 @ RPE 8',
              note: 'Usually around 75–80% of 1RM.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 5 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: EMOM 16',
          instructions:
            'Every minute on the minute for 16 minutes, cycling through the 4 stations (4 rounds). Each station should take 35–45 seconds, leaving you a short rest. If you can not finish inside the minute, cut the reps.',
          highlightInstructions: '4 Rounds · Note any reps missed',
          movements: [
            {
              name: 'Min 1: Ski Erg',
              value: '12/10 cal',
              note: 'No ski erg? Same calories on the rower.',
            },
            { name: 'Min 2: Chest to Bar Pull-ups', value: '8' },
            {
              name: 'Min 3: GHD Sit-ups',
              value: '12',
              note: 'No GHD? 20 Butterfly Sit-ups.',
            },
            { name: 'Min 4: Bar Facing Burpees', value: '10' },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td003Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td003Warmup,
        {
          name: 'Strength: Bench Press',
          instructions:
            'Build across 5–6 sets to a solid set of 8 at RPE 7 (3 good reps left). Then drop the weight by 10% and complete 2 more sets of 8. Dumbbell bench is a great option if the barbell is new to you. Record your heaviest set in your notes.',
          highlightInstructions: 'Heaviest set = RPE 7. Barbell or dumbbells.',
          movements: [
            {
              name: 'Ramp sets',
              value: '10 / 8 / 5 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Top set',
              value: '1 x 8 @ RPE 7',
              note: 'Barbell or dumbbell bench press.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 8 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: EMOM 16',
          instructions:
            'Every minute on the minute for 16 minutes, cycling through the 4 stations (4 rounds). Aim for 15–20 seconds of rest every minute.',
          highlightInstructions: '4 Rounds · Note any reps missed',
          movements: [
            {
              name: 'Min 1: Ski Erg',
              value: '10/8 cal',
              note: 'No ski erg? Same calories on the rower.',
            },
            {
              name: 'Min 2: Jumping or Banded Pull-ups',
              value: '8',
              note: 'Slow 3s lower on every jumping rep.',
            },
            { name: 'Min 3: Butterfly Sit-ups', value: '15' },
            {
              name: 'Min 4: Burpees',
              value: '8',
              note: 'Step back and step up if needed.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_UPPER,
        td003Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_004 — Athletic / light Olympic                                         */
/* ========================================================================== */

const td004Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Speed starts with positions. Move through the clean in pieces with an empty bar before adding any weight.',
  movements: [
    '3 mins easy row',
    '10 Inchworms',
    '10 Jumping Squats (soft landings)',
    'Empty Bar Clean Drills: 5 Muscle Cleans, 5 Front Squats, 5 Hang Power Cleans',
  ],
};

const td004Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 45s between rounds. Core and shoulder stability.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Single Arm Kettlebell Front Rack Carry', value: '20m each side' },
    { name: 'Single Arm Kettlebell Strict Press', value: '8 each side' },
    '30s Hollow Rock',
  ],
};

const td004: StandaloneWorkoutSource = {
  id: 'td_004',
  title: 'Fast Hips',
  description:
    'Light, fast and technical. A clean technique EMOM sharpens your positions without beating up the legs, then a three-round mixed-modal WOD gets you moving like an athlete. Speed over load all session.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'Olympic Lifting', 'For Time'],
  equipment: [
    'barbell',
    'dumbbell',
    'box',
    'pull-up bar',
    'kettlebell',
    'rower',
  ],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td004Warmup,
        {
          name: 'Strength: Clean Technique EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes. Stay at 60–70% of your estimated power clean 1RM (RPE 6). Every rep should be fast and crisp. If the bar slows down or the catch gets messy, take weight off.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '1 Hang Power Clean + 1 Power Clean + 1 Front Squat',
              note: 'Hang from just above the knee. Elbows fast in the catch.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 18 minute cap. Push the run, stay smooth on the box and the bar.',
          highlightInstructions: 'Score: total time · Cap 18 mins',
          movements: [
            '400m Run',
            {
              name: 'Alternating Dumbbell Snatch',
              value: '16',
              note: '22.5/15kg.',
            },
            {
              name: 'Box Jump Overs',
              value: '12',
              note: '60/50cm. Step down is fine.',
            },
            '9 Toes to Bar',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td004Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td004Warmup,
        {
          name: 'Strength: Clean Technique EMOM 12',
          instructions:
            'Every minute on the minute for 12 minutes. Use a light barbell or a pair of dumbbells. Every rep fast and crisp. If you are new to the clean, stay with the dumbbell option.',
          highlightInstructions:
            'Light and fast. This is practice, not testing.',
          movements: [
            {
              name: 'Each minute',
              value: '2 Hang Power Cleans + 1 Front Squat',
              note: 'Barbell, or 2 dumbbells.',
            },
          ],
        },
        {
          name: 'WOD: 3 Rounds For Time',
          instructions:
            'Three rounds for time, 18 minute cap. Smooth and steady.',
          highlightInstructions: 'Score: total time · Cap 18 mins',
          movements: [
            '300m Run',
            {
              name: 'Alternating Dumbbell Snatch',
              value: '12',
              note: '15/10kg.',
            },
            { name: 'Box Step Overs', value: '12', note: '50/40cm.' },
            '9 Hanging Knee Raises',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td004Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_005 — Deadlift                                                         */
/* ========================================================================== */

const td005Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Wake up the hamstrings and glutes and practise your brace before you pull anything heavy.',
  movements: [
    '3 mins easy bike',
    '10 Kettlebell Good Mornings',
    '10 Glute Bridges with 2s squeeze',
    '10 Dead Bugs (5 each side)',
    '2 x 5 Light Romanian Deadlifts',
  ],
};

const td005Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 3 rounds, rest 60s between rounds. Posterior chain and trunk.',
  highlightInstructions: '3 Rounds · Optional',
  movements: [
    { name: 'Single Leg Kettlebell RDL', value: '8 each leg' },
    {
      name: 'Back Extension',
      value: '12',
      note: 'GHD or back extension bench. No machine? 15 Banded Good Mornings.',
    },
    {
      name: 'Suitcase Hold',
      value: '30s each side',
      note: 'Heavy kettlebell. Stay perfectly upright.',
    },
  ],
};

const td005: StandaloneWorkoutSource = {
  id: 'td_005',
  title: 'Off the Floor',
  description:
    'A deadlift session to find your working five. Every rep starts from a dead stop, braced and patient off the floor. Then take your tired legs into a compromised-running finisher that feels a lot like the back half of a race.',
  category: 'Strength',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Lower Body', 'Strength', 'For Time'],
  equipment: ['barbell', 'kettlebell', 'bike', 'ghd'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td005Warmup,
        {
          name: 'Strength: Conventional Deadlift',
          instructions:
            'Build across 5–6 sets to a heavy set of 5 at RPE 8 (2 good reps left). Reset at the bottom of every rep, no touch and go. Rest 2–3 mins between the heavier sets. Then drop 10% and complete 2 more sets of 5. Record your heaviest set of five in your notes.',
          highlightInstructions: 'Dead stop every rep. Heaviest set = RPE 8.',
          movements: [
            {
              name: 'Ramp sets',
              value: '5 / 5 / 3 / 3 reps',
              note: 'Roughly 40% → 55% → 65% → 72% of estimated 1RM.',
            },
            {
              name: 'Top set',
              value: '1 x 5 @ RPE 8',
              note: 'Usually around 75–80% of 1RM.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 5 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 22 minute cap. Your legs will not feel fresh, and that is the point. Run with good posture and keep the burpee broad jumps rhythmic.',
          highlightInstructions: 'Score: total time · Cap 22 mins',
          movements: [
            '400m Run',
            { name: 'Burpee Broad Jumps', value: '10' },
            {
              name: 'Farmers Carry',
              value: '50m',
              note: '2 x 24/16kg kettlebells or dumbbells.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td005Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td005Warmup,
        {
          name: 'Strength: Deadlift',
          instructions:
            'Build across 5–6 sets to a solid set of 8 at RPE 7 (3 good reps left). Reset every rep. Trap bar or kettlebell deadlifts are great options if the barbell is new to you. Then drop 10% and complete 2 more sets of 8. Record your heaviest set in your notes.',
          highlightInstructions: 'Dead stop every rep. Heaviest set = RPE 7.',
          movements: [
            {
              name: 'Ramp sets',
              value: '8 / 8 / 5 / 5 reps',
              note: 'Add weight in small jumps.',
            },
            {
              name: 'Top set',
              value: '1 x 8 @ RPE 7',
              note: 'Barbell, trap bar or heavy kettlebell.',
            },
            {
              name: 'Back-off sets',
              value: '2 x 8 @ 90% of top set',
              note: 'Rest 2 mins between sets.',
            },
          ],
        },
        {
          name: 'WOD: 4 Rounds For Time',
          instructions:
            'Four rounds for time, 22 minute cap. Steady and consistent.',
          highlightInstructions: 'Score: total time · Cap 22 mins',
          movements: [
            '300m Run',
            {
              name: 'Burpees + Broad Jumps',
              value: '6 + 6',
              note: 'Do the burpees, then the jumps separately.',
            },
            {
              name: 'Farmers Carry',
              value: '50m',
              note: '2 x 16/12kg kettlebells or dumbbells.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_LOWER,
        td005Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_006 — Solo chipper                                                     */
/* ========================================================================== */

const td006Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Two easy rounds, then a few practice reps of every movement in the chipper.',
  movements: [
    '2 Rounds: 250m Row, 10 Air Squats, 10 Push-ups, 10 Kettlebell Deadlifts',
    'Practice: 3 Sandbag to Shoulder each side, 5 Kettlebell Swings',
  ],
};

const td006Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. 2 rounds, rest as needed. Short and simple to finish the week.',
  highlightInstructions: '2 Rounds · Optional',
  movements: [
    '15 Reverse Flyes or Band Pull-Aparts',
    '12 Hammer Curls',
    '20 Calf Raises',
  ],
};

const td006: StandaloneWorkoutSource = {
  id: 'td_006',
  title: 'Long Road',
  description:
    'Long and hybrid. Loaded carries replace the barbell, then a big chipper of rowing, kettlebells, sandbags, burpees and a run to finish. Break it into chunks early and keep moving.',
  category: 'WOD',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Full Body', 'Chipper'],
  equipment: ['rower', 'kettlebell', 'sandbag', 'dumbbell'],
  isPremium: true,
  logSchema: { kind: 'duration', label: 'Total time', lowerIsBetter: true },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td006Warmup,
        {
          name: 'Strength: Loaded Carries',
          instructions:
            '4 rounds, rest 60s between rounds. Heavy enough that the carries are a real effort, controlled enough that you never drop the load.',
          highlightInstructions: '4 Rounds · No barbell today',
          movements: [
            {
              name: 'Sandbag Bear Hug Carry',
              value: '40m',
              note: '70/50kg. No sandbag? Heavy kettlebell or dumbbell goblet carry.',
            },
            {
              name: 'Overhead Plate Walk',
              value: '20m',
              note: '20/15kg plate, arms locked.',
            },
            '30s Side Plank each side',
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 30 minute cap. Split the big numbers into sets from the start, for example 5 x 10 swings, and keep the rests short.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '1000m Row',
            {
              name: 'Kettlebell Swings',
              value: '50',
              note: '24/16kg, Russian (eye level).',
            },
            { type: 'divider' },
            {
              name: 'Sandbag to Shoulder',
              value: '20',
              note: '50/30kg. No sandbag? 20 Dumbbell Clean to Shoulder.',
            },
            '30 Burpees',
            { type: 'divider' },
            '800m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td006Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td006Warmup,
        {
          name: 'Strength: Loaded Carries',
          instructions:
            '4 rounds, rest 60s between rounds. Choose a load you can carry the full distance without stopping.',
          highlightInstructions: '4 Rounds · No barbell today',
          movements: [
            {
              name: 'Sandbag Bear Hug Carry',
              value: '40m',
              note: '40/30kg. No sandbag? Kettlebell or dumbbell goblet carry.',
            },
            {
              name: 'Overhead Plate Walk',
              value: '20m',
              note: '10/5kg plate, arms locked.',
            },
            '20s Side Plank each side',
          ],
        },
        {
          name: 'WOD: Chipper For Time',
          instructions:
            'Work through the list in order, 30 minute cap. Small sets, short rests.',
          highlightInstructions: 'Score: total time · Cap 30 mins',
          movements: [
            '800m Row',
            {
              name: 'Kettlebell Swings',
              value: '40',
              note: '16/12kg, Russian (eye level).',
            },
            { type: 'divider' },
            {
              name: 'Sandbag to Shoulder',
              value: '15',
              note: '30/20kg. No sandbag? 15 Dumbbell Clean to Shoulder.',
            },
            {
              name: 'Burpees',
              value: '20',
              note: 'Step back and step up if needed.',
            },
            { type: 'divider' },
            '600m Run',
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td006Additional,
      ],
    },
  ],
};

/* ========================================================================== */
/*  td_007 — Recovery engine                                                  */
/* ========================================================================== */

const td007Warmup: WorkoutBlockBase = {
  name: 'Warmup',
  instructions:
    'Gentle. You are here to feel better when you leave than when you arrived.',
  movements: [
    '5 mins very easy bike',
    '10 Cat Cows',
    '10 World’s Greatest Stretch (5 each side)',
    '10 Band Pull-Aparts',
  ],
};

const td007Strength: WorkoutBlockBase = {
  name: 'Strength: Tempo Pressing',
  instructions:
    '3 rounds, rest 60s between rounds. Light weights and slow lowering. These reps build control and blood flow, not fatigue. Finish every set feeling like you had 4 or more reps left.',
  highlightInstructions: '3 Rounds · RPE 6 max',
  movements: [
    {
      name: 'Dumbbell Floor Press',
      value: '10',
      note: '3s lower, pause on the floor, press.',
    },
    {
      name: 'Chest Supported Dumbbell Row',
      value: '12',
      note: 'Bench on an incline. Squeeze for 1s at the top.',
    },
    { name: 'Banded Tricep Pushdowns', value: '15' },
  ],
};

const td007Additional: WorkoutBlockBase = {
  name: 'Additional Work',
  optional: true,
  instructions:
    'Optional. Slow, controlled mobility to finish the week. Take your time with each one.',
  highlightInstructions: 'Optional',
  movements: [
    '10 Controlled Hip Circles each side (on all fours)',
    '10 Jefferson Curls with a light plate',
    '2 mins Dead Hang (accumulate in as many sets as needed)',
  ],
};

const td007: StandaloneWorkoutSource = {
  id: 'td_007',
  title: 'Slow Burn',
  description:
    'A recovery session that still counts. Light tempo pressing for the upper body, a long Zone 2 piece across three machines, and an extended stretch. Nothing here should feel hard. Leave fresher than you arrived.',
  category: 'Conditioning',
  difficulty: 'Multiple Difficulties',
  estimatedTime: 60,
  tags: ['Cardio', 'Upper Body', 'Intervals'],
  equipment: ['dumbbell', 'bike', 'rower', 'ski erg', 'bands', 'pull-up bar'],
  isPremium: true,
  logSchema: {
    kind: 'notes_only',
    placeholder: 'Total Zone 2 distance, how you feel',
  },
  blocks: [
    {
      scale: 'RX',
      blocks: [
        td007Warmup,
        td007Strength,
        {
          name: 'WOD: Zone 2 x 30',
          instructions:
            'Three 10 minute pieces, no rest between machines. Stay in Zone 2: you should be able to talk in full sentences the whole time. If you are breathing through your mouth, slow down. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '10 mins' },
            { name: 'Row', value: '10 mins' },
            {
              name: 'Ski Erg',
              value: '10 mins',
              note: 'No ski erg? 10 mins easy jog or incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td007Additional,
      ],
    },
    {
      scale: 'Scaled',
      blocks: [
        td007Warmup,
        td007Strength,
        {
          name: 'WOD: Zone 2 x 24',
          instructions:
            'Three 8 minute pieces, no rest between machines. Stay at a pace where you can talk in full sentences. Log your total distance in your notes.',
          highlightInstructions: 'Conversational pace only',
          movements: [
            { name: 'Bike', value: '8 mins' },
            { name: 'Row', value: '8 mins' },
            {
              name: 'Ski Erg',
              value: '8 mins',
              note: 'No ski erg? 8 mins brisk incline walk.',
            },
          ],
        },
        COOLDOWN_FLUSH,
        STRETCH_FULL,
        td007Additional,
      ],
    },
  ],
};

/* ------------------------------- Exports ---------------------------------- */

export const temperedDailyWeek01: StandaloneWorkoutSource[] = [
  td001,
  td002,
  td003,
  td004,
  td005,
  td006,
  td007,
];

/* ---------------------------- Weekly wrapper ------------------------------ */
/* Drops Monday 00:01 device local time. */

export const temperedDailyWeek01Program: TemperedDailyWeek = {
  id: 'td_week_001',
  weekStart: '2026-10-19',
  blockName: 'The Big Three',
  theme: 'Strength',
  phase: 'Discovery',
  description:
    'Welcome to The Big Three. This week is about finding your numbers. Squat Monday, bench Wednesday and deadlift Friday each build to a heavy five with reps left in the tank, so write those weights down. Everything around them keeps your engine and skills ticking over. Short on time? Prioritise Monday, Wednesday and Friday.',
  primaryFocus: 'Strength',
  otherFocuses: ['Lower Body', 'Upper Body', 'Cardio'],
  nextWeekFocus: 'Strength – Accumulation',
  days: ['td_001', 'td_002', 'td_003', 'td_004', 'td_005', 'td_006', 'td_007'],
};
