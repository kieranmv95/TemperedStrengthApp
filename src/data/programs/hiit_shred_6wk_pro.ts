import type {
  Program,
  WorkoutBlockCooldown,
  WorkoutBlockWarmup,
} from '@/src/types/program';

// ─── Warm-Ups ────────────────────────────────────────────────────────────────
// Each matched to the session stimulus. Never generic.

const warmupFullBody: WorkoutBlockWarmup = {
  id: 'wu-full',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '4–5 minutes. Build from easy to ready. This is not the workout - save that for what comes next.',
  description: [
    '90s easy walk or march on the spot - let your heart rate climb gradually',
    '10 inchworms - slow on the way out, own the range, walk back in',
    '10 bodyweight squats - controlled descent, drive up with purpose',
    '10 reverse lunges (5 each side) - tall torso, light touch of the back knee',
    '10 glute bridges - pause and squeeze at the top of each rep',
  ],
};

const warmupUpperFocus: WorkoutBlockWarmup = {
  id: 'wu-upper',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '4–5 minutes. Get the shoulders, chest, and upper back ready to work. The pressing and pulling today will expose any tightness you carry in.',
  description: [
    '90s easy walk or march on the spot',
    '10 inchworms - focus on the shoulder stretch at the bottom of each rep',
    '10 pike push-ups - slow and deliberate, feel the shoulders loading',
    '10 push-ups - easy pace, just warming the chest and triceps',
    '20s plank hold - ribs down, squeeze your core, breathe steadily',
  ],
};

const warmupLowerFocus: WorkoutBlockWarmup = {
  id: 'wu-lower',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '5 minutes. Hips, hamstrings, and quads need proper preparation today. Do not rush this - lower body sessions punish cold muscles.',
  description: [
    '90s easy walk or march on the spot',
    '10 glute bridges - pause at the top, squeeze hard each rep',
    '10 glute bridge marches - slow alternating lifts, keep hips level throughout',
    '10 bodyweight squats - slow on the way down, pause at the bottom',
    '10 reverse lunges each side - controlled, tall, deliberate',
    '10 inchworms - open the hamstrings before the session begins',
  ],
};

const warmupPowerFocus: WorkoutBlockWarmup = {
  id: 'wu-power',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '5 minutes. This session is explosive - your body needs to know what is coming. Build through the warm-up progressively. The burpees at the end should feel fast, not hard.',
  description: [
    '90s easy walk or march on the spot',
    '10 inchworms - slow and deliberate',
    '10 bodyweight squats - pause at the bottom',
    '10 reverse lunges each side',
    '5 burpees at easy pace - rehearse the pattern, not the intensity',
    '5 squat jumps - land soft, build the spring in your legs',
  ],
};

const warmupConditioningFocus: WorkoutBlockWarmup = {
  id: 'wu-cond',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '5 minutes. Today is a longer conditioning session. Warm-up tempo should feel like 50 percent effort - you will need the energy.',
  description: [
    '2 minutes easy walk or march - longer than usual, this session needs it',
    '10 bodyweight squats',
    '10 glute bridges',
    '10 inchworms',
    '10 reverse lunges each side',
    '5 burpees at easy pace - just to prime the engine',
  ],
};

// ─── Cooldown Blocks ─────────────────────────────────────────────────────────

const cooldownStandard: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Take 4–5 minutes here. Your heart rate is elevated and your muscles are warm - use that window. Start walking slowly around the space for 90 seconds before you stop moving entirely. Sitting down immediately after intense conditioning is one of the worst things you can do for recovery. Once your breathing settles, work through the stretches below. Hold each one without forcing it - you are unwinding, not stretching for performance.',
  description: [
    '90s easy walk - slow it right down, let your breathing settle before you stop moving',
    'Quad stretch - stand on one leg, hold your ankle behind you, 30s each side. Use a wall if needed. Keep your knees together and stand tall.',
    'Hip flexor lunge stretch - drop into a low lunge, back knee on the floor, push your hips gently forward, 30–45s each side. You will feel this at the front of the hip and thigh.',
    'Hamstring stretch - stand tall, hinge forward with soft knees and let your hands reach towards the floor. Hold 30s. If the floor is too far, rest your hands on your shins.',
    'Chest opener - clasp your hands behind your back, squeeze your shoulder blades together and lift your arms slightly. Hold 20–30s. Breathe into your chest.',
  ],
};

const cooldownUpperFocus: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Your shoulders, chest, and upper back have done the work today. Give them the time they need. Start with 90 seconds of easy walking - do not sit straight down. Once your breathing is under control, move through the stretches below slowly. The shoulder and thoracic work here will pay off in how you feel tomorrow. Take your time on each one.',
  description: [
    '90s easy walk or gentle movement - keep it slow, do not rush to sit down',
    'Cross-body shoulder stretch - bring one arm across your chest, use the other arm to gently pull it closer. Hold 30s each side. You should feel this through the back of the shoulder.',
    'Chest opener - clasp your hands behind your back, draw your shoulder blades together and lift your chest. Hold 30s. Breathe in deeply and let your chest expand.',
    'Neck side stretch - sit or stand tall, drop one ear towards your shoulder and hold gently for 20–30s each side. No forcing. Let gravity do the work.',
    'Thoracic rotation - sit on the floor with your legs crossed, place one hand behind your head and rotate your upper back slowly to one side. 5 slow reps each direction. This undoes a lot of the tension built up through pressing and pulling.',
  ],
};

const cooldownLowerFocus: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Your hips, glutes, hamstrings, and quads have taken a beating today. Do not skip this. Start by walking slowly for 90 seconds - your legs will thank you for not stopping abruptly. The stretches below target everything that worked hard. The hip flexor and glute work in particular will help with how you move tomorrow. Get on the floor if you can - it makes all of these easier to hold properly.',
  description: [
    '90s easy walk - slow, deliberate steps. Let your heart rate come down before you stop moving entirely.',
    'Hip flexor lunge stretch - step into a low lunge and lower your back knee to the floor. Shift your hips gently forward until you feel a stretch at the front of the hip. Hold 45s each side. If it feels tight, that is normal after lunges and squats.',
    'Hamstring stretch - sit on the floor with both legs extended. Hinge forward from the hips and reach towards your feet. Hold 45s. Keep your back as flat as you can - this is not a competition to touch your toes.',
    'Glute stretch - lie on your back, cross one ankle over the opposite knee and draw both legs towards your chest. Hold 30–45s each side. This is a figure-four stretch and it will feel very good after split squats and lunges.',
    'Calf stretch - stand facing a wall, place one foot back and press your heel flat into the floor. Lean gently into the wall. Hold 30s each side. Easy to rush, worth slowing down.',
  ],
};

const cooldownFullBodyDeep: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'This was a full body session and a hard one. Give yourself a proper 5 minutes here. Walk for at least 90 seconds before you do anything else - your cardiovascular system needs time to downregulate, not just your muscles. Work through every stretch below and hold each one longer than feels necessary. The harder the session, the more this matters.',
  description: [
    '2 minutes easy walk - longer walk today, the session earned it. Breathe out longer than you breathe in.',
    'Hip flexor lunge stretch - low lunge, back knee down, hips forward. 45s each side. Breathe into the stretch.',
    'Hamstring stretch - seated or standing, hinge from the hips, reach long. 45s. Keep your spine as flat as you can.',
    'Glute stretch - lie on your back, figure-four position, draw your legs in gently. 45s each side.',
    'Chest opener - hands clasped behind your back, shoulder blades squeezed, chest lifted. 30s.',
    'Thoracic rotation - seated cross-legged, hand behind your head, rotate slowly each direction. 5 reps each side. This one is worth doing slowly.',
  ],
};

// ─── Programme ───────────────────────────────────────────────────────────────

export const hiit_shred_6wk_pro: Program = {
  id: 'hiit_shred_6wk_pro',
  isPro: true,
  name: 'HIIT Shred (6 Weeks)',
  description: `24 unique sessions across 6 weeks. Every day is different. Every session has a named WOD at its centre - the kind that makes your heart rate spike and your legs heavy. A short strength primer earns you the right to get into it. No repeated days. No coasting.`,
  bodyChangesSummary: `Better stamina, more athleticism, and a tighter feel through your legs, glutes, and core. By week five you will be handling formats most people avoid. By week six you will know exactly what you are capable of.`,
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri', 'sun'],
  averageSessionDuration: '45m',
  workouts: [
    // =========================================================================
    // WEEK 1 - Learn the formats. Short, sharp WODs. Build the habit.
    // =========================================================================

    // ─── W1 Mon - Ignition ───────────────────────────────────────────────────
    {
      dayIndex: 0,
      label: 'Ignition',
      description:
        'First session. Full body. The WOD is an AMRAP - as many rounds as possible in 10 minutes. Set a pace you can hold and do not blow up in round two.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Not for time. Move well, rest 45s between rounds. This earns you the WOD.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 2, // DB Bench Press
              prescription: '10 reps',
              notes:
                'Controlled descent. Press with confidence. Shoulders packed.',
            },
            {
              id: 'm2',
              exerciseId: 8, // Dumbbell Row
              prescription: '10 reps/side',
              notes: 'Pull to your hip. Pause. Control down.',
            },
            {
              id: 'm3',
              exerciseId: 5, // DB Goblet Squat
              prescription: '12 reps',
              notes:
                'Upright torso. Drive up fast. Pick a weight that challenges.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - AMRAP 10',
          instructions:
            'As many rounds as possible in 10 minutes. Find a pace in round one and hold it.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '8 reps',
              notes: 'Steady pace. Do not sprint round one.',
            },
            {
              id: 'm2',
              exerciseId: 21, // Bodyweight Squats
              prescription: '15 reps',
              notes: 'Full range. Move with purpose.',
            },
            {
              id: 'm3',
              exerciseId: 3, // Push-ups
              prescription: '10 reps',
              notes: 'Chest to floor. Scale to knees to keep moving.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W1 Wed - The Ladder ─────────────────────────────────────────────────
    {
      dayIndex: 2,
      label: 'The Ladder',
      description:
        'Lower body focus. The WOD is a descending ladder - reps drop each round so the session gets faster as you go. Start controlled.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupLowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Not for time. Rest as needed. Load up more than you think.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '10 reps',
              notes:
                'Hinge back, keep dumbbells close, squeeze your glutes at the top.',
            },
            {
              id: 'm2',
              exerciseId: 6, // Bulgarian Split Squat
              prescription: '8 reps/side',
              notes:
                'Rear foot elevated. Drive through the front heel. Slow on the way down.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Descending Ladder (For Time)',
          instructions:
            'Complete each movement for 21 reps, then 15, then 9 reps. Work through all reps of each exercise before moving on. Time yourself.',
          movements: [
            {
              id: 'm1',
              exerciseId: 102, // Squat Jumps
              prescription: '21 / 15 / 9 reps',
              notes: 'Land soft every rep. Full squat depth.',
            },
            {
              id: 'm2',
              exerciseId: 109, // Reverse Lunge
              prescription: '21 / 15 / 9 reps each side',
              notes: 'Tall torso. Light touch of the back knee.',
            },
            {
              id: 'm3',
              exerciseId: 107, // Ball Slams
              prescription: '21 / 15 / 9 reps',
              notes:
                'Full extension overhead before every slam. Drive it down.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W1 Fri - Push Storm ─────────────────────────────────────────────────
    {
      dayIndex: 4,
      label: 'Push Storm',
      description:
        'Upper body push focus. The WOD is a Tabata - 8 rounds of 20s work, 10s rest. Four stations. Simple format, uncomfortable execution.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Controlled. Not rushed. These build the base before the Tabata.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 27, // DB Shoulder Press
              prescription: '10 reps',
              notes:
                'Brace your core. Avoid leaning back. Full extension overhead.',
            },
            {
              id: 'm2',
              exerciseId: 34, // Lateral Raises
              prescription: '12 reps',
              notes: 'Light weight. Lead with elbows. No shrugging.',
            },
            {
              id: 'm3',
              exerciseId: 56, // Reverse Flyes
              prescription: '12 reps',
              notes: 'Shoulders down. Squeeze shoulder blades at the top.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'tabata',
          title: 'WOD - Push Storm Tabata',
          instructions:
            '8 rounds, 20s work / 10s rest. Rotate through all four stations. Go as hard as you can sustain. This should be uncomfortable.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 3, // Push-ups
              prescription: '20s on / 10s off',
              notes: 'Maximum reps with good form. Scale to knees when needed.',
            },
            {
              id: 'm2',
              exerciseId: 73, // DB Push Press
              prescription: '20s on / 10s off',
              notes:
                'Dip and drive. Keep the weight manageable enough to keep moving.',
            },
            {
              id: 'm3',
              exerciseId: 107, // Ball Slams
              prescription: '20s on / 10s off',
              notes: 'Full extension, slam hard, pick it up fast.',
            },
            {
              id: 'm4',
              exerciseId: 29, // Pike Push-ups
              prescription: '20s on / 10s off',
              notes: 'Hips high. Lower with control. Press with everything.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W1 Sun - Ground & Pound ──────────────────────────────────────────────
    {
      dayIndex: 6,
      label: 'Ground & Pound',
      description:
        'Full body to close the week. The WOD is the first chipper of the programme - one pass through a list of movements, for time. Pace from the start.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions: 'Moderate load. Own the movements before the chipper.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 72, // DB Power Clean
              prescription: '6 reps',
              notes:
                'Explosive pull. Stand tall. Swap to goblet squat if technique breaks.',
            },
            {
              id: 'm2',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes: 'Hinge forward, torso parallel. Control the return.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Ground & Pound Chipper (For Time)',
          instructions:
            'Complete all reps in order. One pass. Time yourself. Do not go out too fast.',
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '20 reps',
              notes: 'Steady effort. This is not the last movement.',
            },
            {
              id: 'm2',
              exerciseId: 74, // DB Goblet Front Squat
              prescription: '20 reps',
              notes: 'Upright torso. Drive hard out of the hole.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '10 reps',
              notes: 'Band or assist is fine. Every rep counts.',
            },
            {
              id: 'm4',
              exerciseId: 107, // Ball Slams
              prescription: '20 reps',
              notes: 'Full extension overhead. Drive it into the floor.',
            },
            {
              id: 'm5',
              exerciseId: 102, // Squat Jumps
              prescription: '15 reps',
              notes: 'Land soft. Depth every rep.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // =========================================================================
    // WEEK 2 - New formats. Volume steps up. Nothing from week one repeated.
    // =========================================================================

    // ─── W2 Mon - Death by Dumbbell ──────────────────────────────────────────
    {
      dayIndex: 7,
      label: 'Death by Dumbbell',
      description:
        'Upper body and core. The WOD is an EMOM - every minute on the minute for 12 minutes. Work starts the second the clock does.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Set your load for the EMOM here. These primer movements warm up what follows.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 32, // Dumbbell Bicep Curls
              prescription: '12 reps',
              notes: 'No swinging. Slow and controlled.',
            },
            {
              id: 'm2',
              exerciseId: 53, // Overhead Tricep Extension
              prescription: '10 reps',
              notes: 'Elbows tight. Full range. Control the lower.',
            },
            {
              id: 'm3',
              exerciseId: 51, // Hammer Curls
              prescription: '12 reps',
              notes: 'Neutral grip. No swinging. Own every rep.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'emom',
          title: 'WOD - EMOM 12',
          instructions:
            'Every minute on the minute, complete the prescribed reps. Rest is whatever is left of that minute. If you finish with less than 10s rest, your load or pace is too high.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps (odd minutes)',
              notes:
                'Squat and press in one movement. Keep dumbbells at shoulders on the descent.',
            },
            {
              id: 'm2',
              exerciseId: 103, // Burpees
              prescription: '8 reps (even minutes)',
              notes: 'Consistent pace. Same speed every round.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W2 Wed - The Grind ───────────────────────────────────────────────────
    {
      dayIndex: 9,
      label: 'The Grind',
      description:
        'Lower body and posterior chain. The WOD is 5 rounds for time - as fast as possible with form intact. This is where it starts to feel like real conditioning.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupLowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Not for time. Load heavy enough to feel it. Rest 60s between rounds.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // Kettlebell Swing
              prescription: '15 reps',
              notes:
                'Hinge back hard. Drive with your hips. The bell floats - you do not pull it.',
            },
            {
              id: 'm2',
              exerciseId: 38, // Walking Lunges
              prescription: '12 reps/side',
              notes: 'Tall torso. Light touch of the back knee. Keep moving.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'rounds',
          title: 'WOD - 5 Rounds For Time',
          instructions:
            '5 rounds, completed as fast as possible. Rest only when you have to.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 105, // Box Jumps
              prescription: '10 reps',
              notes: 'Step down every rep. Land soft, reset, go again.',
            },
            {
              id: 'm2',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '12 reps',
              notes: 'Hinge clean. Squeeze at the top. Do not round the back.',
            },
            {
              id: 'm3',
              exerciseId: 109, // Reverse Lunge
              prescription: '10 reps/side',
              notes: 'Tall torso. Drive up through the front heel.',
            },
            {
              id: 'm4',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '20 reps',
              notes: 'Full range. Pause at the top.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W2 Fri - Station Six ─────────────────────────────────────────────────
    {
      dayIndex: 11,
      label: 'Station Six',
      description:
        'Six stations, rotating continuously for 15 minutes. The first station-style session of the programme - move through all six then repeat.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 2 Rounds',
          instructions:
            'Short primer today - the six-station WOD needs the time. Move well, rest 45s between rounds.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '6 reps/side',
              notes:
                'Hip hinge, pull to shoulder. Stand tall. Control the catch.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '8 reps/side',
              notes: 'Brace hard. Press tall. Avoid leaning.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - Station Six AMRAP 15',
          instructions:
            '15 minutes. Move through all six stations in order, then repeat. Scale loads to keep moving - stopping costs more than going lighter.',
          minutes: 15,
          movements: [
            {
              id: 'm1',
              exerciseId: 106, // Wall Balls
              prescription: '10 reps',
              notes: 'Squat to depth every rep. Drive the ball to your target.',
            },
            {
              id: 'm2',
              exerciseId: 9, // Inverted Row
              prescription: '10 reps',
              notes: 'Chest to bar. Squeeze at the top.',
            },
            {
              id: 'm3',
              exerciseId: 102, // Squat Jumps
              prescription: '10 reps',
              notes: 'Land soft every rep. Full depth.',
            },
            {
              id: 'm4',
              exerciseId: 3, // Push-ups
              prescription: '10 reps',
              notes: 'Chest to floor. Scale to knees to keep moving.',
            },
            {
              id: 'm5',
              exerciseId: 24, // Kettlebell Swing
              prescription: '12 reps',
              notes: 'Hip drive. The bell floats.',
            },
            {
              id: 'm6',
              exerciseId: 108, // Bicycle Crunch
              prescription: '20 reps',
              notes: 'Rotate from the ribs. Slow and deliberate.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W2 Sun - Burn Out ────────────────────────────────────────────────────
    {
      dayIndex: 13,
      label: 'Burn Out',
      description:
        'Full body close to week two. The WOD is a descending rep scheme - starts with high reps, drops by 5 each round. Starts heavy, finishes fast.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmupPowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Load up. These movements warm the posterior chain before the WOD.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 41, // Hip Thrust
              prescription: '12 reps',
              notes:
                'Drive through your heels. Squeeze your glutes at the top. Pause for a beat.',
            },
            {
              id: 'm2',
              exerciseId: 92, // DB Farmer Carry
              prescription: '30s',
              notes:
                'Heavy as possible. Tall posture. Do not let your shoulders drop.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Burn Out (For Time)',
          instructions:
            'Complete 25, 20, 15, 10, 5 reps of each movement in order. Each round drops by 5 reps. Time yourself.',
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '25 / 20 / 15 / 10 / 5 reps',
              notes: 'Pace the first round. It gets easier as the reps drop.',
            },
            {
              id: 'm2',
              exerciseId: 21, // Bodyweight Squats
              prescription: '25 / 20 / 15 / 10 / 5 reps',
              notes: 'Full depth. Drive up hard.',
            },
            {
              id: 'm3',
              exerciseId: 107, // Ball Slams
              prescription: '25 / 20 / 15 / 10 / 5 reps',
              notes: 'Full extension overhead every rep.',
            },
          ],
        },
        cooldownFullBodyDeep,
      ],
    },

    // =========================================================================
    // WEEK 3 - Volume and complexity increase. WODs get longer. New movements.
    // =========================================================================

    // ─── W3 Mon - The Gauntlet ────────────────────────────────────────────────
    {
      dayIndex: 14,
      label: 'The Gauntlet',
      description:
        'Full body. The WOD is an AMRAP 15 - five movements, more volume than anything in weeks 1–2. This is where the programme steps up.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heavier than last week. Set your loads properly before the WOD begins.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes: 'Controlled descent. Press with power.',
            },
            {
              id: 'm2',
              exerciseId: 101, // DB Renegade Row
              prescription: '8 reps/side',
              notes: 'Hips level. No rotation. Pull to the hip.',
            },
            {
              id: 'm3',
              exerciseId: 5, // DB Goblet Squat
              prescription: '15 reps',
              notes: 'Heavier than week one. Drive up fast.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - The Gauntlet AMRAP 15',
          instructions:
            'Five movements, 15 minutes. Find a sustainable pace in round one and hold it.',
          minutes: 15,
          movements: [
            {
              id: 'm1',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '8 reps',
              notes: 'Drive forward. Land soft. Reset and go.',
            },
            {
              id: 'm2',
              exerciseId: 106, // Wall Balls
              prescription: '12 reps',
              notes: 'Squat to depth. Drive the ball up.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '8 reps',
              notes: 'Band or assist is fine. Chest to bar.',
            },
            {
              id: 'm4',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Squat and press. Fluid movement.',
            },
            {
              id: 'm5',
              exerciseId: 13, // Plank
              prescription: '20s',
              notes: 'Active recovery within the round. Ribs down, breathe.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W3 Wed - Pressing Matters ───────────────────────────────────────────
    {
      dayIndex: 16,
      label: 'Pressing Matters',
      description:
        'Upper body push and pull. The WOD is an EMOM 16 - longer than week two. Four movements rotating across 16 minutes.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Set the load for the EMOM here. Primer is heavier, EMOM is faster.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '10 reps',
              notes:
                'Start with palms facing you. Rotate as you press. Full range.',
            },
            {
              id: 'm2',
              exerciseId: 35, // Face Pulls
              prescription: '15 reps',
              notes:
                'Pull the rope to your face. Separate the ends. Squeeze rear delts.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'emom',
          title: 'WOD - EMOM 16',
          instructions:
            'Every minute on the minute. Rotate through all four movements. Four rounds of each. Go hard on work, use the rest.',
          minutes: 16,
          movements: [
            {
              id: 'm1',
              exerciseId: 73, // DB Push Press
              prescription: '10 reps',
              notes: 'Dip and drive. Full lockout overhead.',
            },
            {
              id: 'm2',
              exerciseId: 12, // Chin-ups
              prescription: '8 reps',
              notes: 'Full hang to chin above bar. Control the lower.',
            },
            {
              id: 'm3',
              exerciseId: 107, // Ball Slams
              prescription: '12 reps',
              notes: 'Full extension. Slam hard. Pick it up fast.',
            },
            {
              id: 'm4',
              exerciseId: 108, // Bicycle Crunch
              prescription: '20 reps',
              notes:
                'Slow rotation from the ribs. Active recovery within the EMOM.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W3 Fri - Lower Inferno ───────────────────────────────────────────────
    {
      dayIndex: 18,
      label: 'Lower Inferno',
      description:
        'Lower body chipper. One pass. More reps than the week one chipper. Pace it from the first movement - this session punishes anyone who goes out too fast.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupLowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heavy and controlled. Rest 60s between rounds. These prepare the hips and legs for what follows.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '6 reps/side',
              notes: 'Hinge and pull. Catch at the shoulder. Stand tall.',
            },
            {
              id: 'm2',
              exerciseId: 6, // Bulgarian Split Squat
              prescription: '10 reps/side',
              notes:
                'Rear foot elevated. Slow descent. Drive through the front heel.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Lower Inferno Chipper (For Time)',
          instructions:
            'Complete all reps in order. One pass. Time yourself. The wall sit at the end will test everything you have left.',
          movements: [
            {
              id: 'm1',
              exerciseId: 105, // Box Jumps
              prescription: '25 reps',
              notes: 'Step down every rep. Land soft. Do not rush the reset.',
            },
            {
              id: 'm2',
              exerciseId: 38, // Walking Lunges
              prescription: '20 reps/side',
              notes: 'Keep moving. Light dumbbells if available.',
            },
            {
              id: 'm3',
              exerciseId: 102, // Squat Jumps
              prescription: '25 reps',
              notes: 'Land soft. Full depth. Breathe.',
            },
            {
              id: 'm4',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '20 reps',
              notes: 'Hinge clean. Squeeze up. Do not round the back.',
            },
            {
              id: 'm5',
              exerciseId: 109, // Reverse Lunge
              prescription: '15 reps/side',
              notes: 'Controlled. Tall torso. Nearly there.',
            },
            {
              id: 'm6',
              exerciseId: 111, // Wall Sit
              prescription: '60s',
              notes: 'Last thing. Breathe through it. Hold position.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W3 Sun - Full Send ───────────────────────────────────────────────────
    {
      dayIndex: 20,
      label: 'Full Send',
      description:
        'Full body to close week three. The WOD is a 4-round station circuit with rest between rounds. Station work, high heart rate, no hiding.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupPowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions: 'Power focus today. Load the primer accordingly.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 72, // DB Power Clean
              prescription: '6 reps',
              notes: 'Explosive. Stand tall. Reset between reps.',
            },
            {
              id: 'm2',
              exerciseId: 41, // Hip Thrust
              prescription: '12 reps',
              notes: 'Drive through your heels. Squeeze and pause at the top.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'rounds',
          title: 'WOD - Full Send (4 Rounds For Time)',
          instructions:
            '4 rounds. Complete all reps of each movement before moving on. Rest 60s between rounds.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '12 reps',
              notes: 'Consistent pace. Same speed every round.',
            },
            {
              id: 'm2',
              exerciseId: 106, // Wall Balls
              prescription: '15 reps',
              notes: 'Squat to depth every rep.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '8 reps',
              notes: 'Band or assist is fine.',
            },
            {
              id: 'm4',
              exerciseId: 107, // Ball Slams
              prescription: '15 reps',
              notes: 'Full extension. Drive it into the floor.',
            },
            {
              id: 'm5',
              exerciseId: 92, // DB Farmer Carry
              prescription: '30s',
              notes: 'Heavy. Posture tall. Walk steady.',
            },
          ],
        },
        cooldownFullBodyDeep,
      ],
    },

    // =========================================================================
    // WEEK 4 - Longer WODs. Kettlebell complex work. New formats introduced.
    // =========================================================================

    // ─── W4 Mon - The Hurricane ───────────────────────────────────────────────
    {
      dayIndex: 21,
      label: 'The Hurricane',
      description:
        'Full body power. The WOD is a three-round hurricane - three movements, maximum effort, rest between rounds. Designed to spike and recover, spike and recover.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupPowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions: 'Power focus. Build the load across rounds.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 77, // DB Muscle Snatch
              prescription: '5 reps/side',
              notes:
                'Swing from between legs, pull it overhead in one motion. Stay controlled.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '12 reps',
              notes:
                'Hold by the horns at chest height. Elbows inside your knees at the bottom.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'rounds',
          title: 'WOD - The Hurricane (3 Rounds For Time)',
          instructions:
            '3 rounds. Go as hard as you can each round. Rest 90s between rounds. This is designed to hurt and then let you recover. Use the rest.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '10 reps',
              notes: 'Max effort. Drive forward every rep.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '15 reps',
              notes: 'Squat and press. No pausing at the bottom.',
            },
            {
              id: 'm3',
              exerciseId: 107, // Ball Slams
              prescription: '20 reps',
              notes: 'Everything you have. Full extension before every slam.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W4 Wed - Pull Everything ─────────────────────────────────────────────
    {
      dayIndex: 23,
      label: 'Pull Everything',
      description:
        'Pull-dominant upper body. The WOD is a Tabata with pull and core stations. Eight rounds, alternating between pulling movements and anti-rotation work.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heavier than usual - these are the last sets before the Tabata.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 8, // Dumbbell Row
              prescription: '12 reps/side',
              notes: 'Pull to your hip. Pause. Control down.',
            },
            {
              id: 'm2',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '3 reps/side',
              notes:
                'Slow and deliberate. Bell locked overhead throughout. Do not rush the transitions.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'tabata',
          title: 'WOD - Pull Everything Tabata',
          instructions:
            '8 rounds, 20s work / 10s rest. Alternate between pull and core movements. Go hard on work intervals.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 10, // Pull-ups
              prescription: '20s on / 10s off',
              notes: 'Max reps. Band or assist is fine.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '20s on / 10s off',
              notes: 'Full range. Controlled on the way down.',
            },
            {
              id: 'm3',
              exerciseId: 9, // Inverted Row
              prescription: '20s on / 10s off',
              notes: 'Chest to bar every rep.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '20s on / 10s off',
              notes: 'Use a light dumbbell. Rotate from the ribs.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W4 Fri - Leg Day Lies ────────────────────────────────────────────────
    {
      dayIndex: 25,
      label: 'Leg Day Lies',
      description:
        'Lower body. The WOD is an AMRAP 18 - longest lower body WOD of the programme so far. Pace accordingly from the first movement.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupLowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Load heavy here. The AMRAP is bodyweight-led so the primer is the strength stimulus.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 6, // Bulgarian Split Squat
              prescription: '10 reps/side',
              notes:
                'Rear foot elevated. Slow descent. Drive through the front heel.',
            },
            {
              id: 'm2',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes: 'Hinge forward, torso parallel. Control the return.',
            },
            {
              id: 'm3',
              exerciseId: 41, // Hip Thrust
              prescription: '15 reps',
              notes: 'Drive through heels. Squeeze and pause at the top.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - AMRAP 18',
          instructions:
            '18 minutes. Five lower body movements. Find a pace you can sustain and.',
          minutes: 18,
          movements: [
            {
              id: 'm1',
              exerciseId: 105, // Box Jumps
              prescription: '8 reps',
              notes: 'Step down every rep. Land soft.',
            },
            {
              id: 'm2',
              exerciseId: 102, // Squat Jumps
              prescription: '10 reps',
              notes: 'Land soft. Depth every rep.',
            },
            {
              id: 'm3',
              exerciseId: 109, // Reverse Lunge
              prescription: '10 reps/side',
              notes: 'Tall torso. Light touch of the back knee.',
            },
            {
              id: 'm4',
              exerciseId: 24, // Kettlebell Swing
              prescription: '15 reps',
              notes: 'Hip drive. The bell floats.',
            },
            {
              id: 'm5',
              exerciseId: 110, // Glute Bridge March
              prescription: '20 reps',
              notes: 'Active recovery within the AMRAP. Hips level throughout.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W4 Sun - Core Reckoning ──────────────────────────────────────────────
    {
      dayIndex: 27,
      label: 'Core Reckoning',
      description:
        'Full body with a core emphasis. The WOD is a chipper with a core movement between every strength station. There is no hiding place in this one.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Core and upper body focus. Set your loads before the chipper begins.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 99, // KB Halo
              prescription: '5 reps each direction',
              notes:
                'Slow circles around the head. Core locked. Avoid arching your back.',
            },
            {
              id: 'm2',
              exerciseId: 15, // Ab Wheel Rollout
              prescription: '8 reps',
              notes: 'Slow out, pull back hard. Do not let your hips sag.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Core Reckoning Chipper (For Time)',
          instructions:
            'Complete in order. One pass. Core movements between every station - do not skip them.',
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '15 reps',
              notes: 'Start steady. Do not blow up here.',
            },
            {
              id: 'm2',
              exerciseId: 31, // Hanging Leg Raise
              prescription: '15 reps',
              notes: 'Control the lower. No swinging.',
            },
            {
              id: 'm3',
              exerciseId: 100, // DB Thruster
              prescription: '15 reps',
              notes: 'Squat and press. Full range.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '30 reps',
              notes: 'Light dumbbell. Rotate from the ribs.',
            },
            {
              id: 'm5',
              exerciseId: 107, // Ball Slams
              prescription: '20 reps',
              notes: 'Full extension every rep.',
            },
            {
              id: 'm6',
              exerciseId: 86, // Sit-ups
              prescription: '20 reps',
              notes: 'Full range. Nearly there.',
            },
            {
              id: 'm7',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '10 reps',
              notes: 'Drive forward. Land soft. Finish strong.',
            },
          ],
        },
        cooldownFullBodyDeep,
      ],
    },

    // =========================================================================
    // WEEK 5 - Peak volume. Hyrox-style formats. Sessions push 50 minutes.
    // =========================================================================

    // ─── W5 Mon - The Accumulator ─────────────────────────────────────────────
    {
      dayIndex: 28,
      label: 'The Accumulator',
      description:
        'Full body. The WOD is an ascending ladder - reps build each round. Starts easy, finishes brutal. Unlike the descending ladder in week one, this one gets harder as it goes.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heaviest primer of the programme so far. Take your time between rounds.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes: 'Heavier than week three. Full range, controlled descent.',
            },
            {
              id: 'm2',
              exerciseId: 101, // DB Renegade Row
              prescription: '10 reps/side',
              notes: 'Hips locked. No rotation. Pull hard.',
            },
            {
              id: 'm3',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Squat and press. Load up.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - The Accumulator (For Time)',
          instructions:
            'Complete rounds of 5, 10, 15, 20 reps of each movement. Reps climb each round. Time yourself. The last round will feel very different to the first.',
          movements: [
            {
              id: 'm1',
              exerciseId: 103, // Burpees
              prescription: '5 / 10 / 15 / 20 reps',
              notes: 'The round of 20 is coming. Pace accordingly.',
            },
            {
              id: 'm2',
              exerciseId: 106, // Wall Balls
              prescription: '5 / 10 / 15 / 20 reps',
              notes: 'Squat to depth every rep. Drive the ball.',
            },
            {
              id: 'm3',
              exerciseId: 102, // Squat Jumps
              prescription: '5 / 10 / 15 / 20 reps',
              notes: 'Land soft every rep. Full depth.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W5 Wed - Double Trouble ──────────────────────────────────────────────
    {
      dayIndex: 30,
      label: 'Double Trouble',
      description:
        'Upper body pairs. The WOD is a push and pull AMRAP 20 - five movements alternating push and pull. Longest upper body WOD of the programme.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heavier than previous upper sessions. Set your load here.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '10 reps',
              notes: 'Full rotation. Slow on the way down.',
            },
            {
              id: 'm2',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '3 reps/side',
              notes: 'Deliberate transitions. Bell locked overhead throughout.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - Double Trouble AMRAP 20',
          instructions:
            '20 minutes. Push and pull alternating - complete all five movements before repeating.',
          minutes: 20,
          movements: [
            {
              id: 'm1',
              exerciseId: 3, // Push-ups
              prescription: '15 reps',
              notes: 'Chest to floor. Scale to knees to keep moving.',
            },
            {
              id: 'm2',
              exerciseId: 12, // Chin-ups
              prescription: '8 reps',
              notes: 'Full hang. Chin above bar. Control down.',
            },
            {
              id: 'm3',
              exerciseId: 73, // DB Push Press
              prescription: '12 reps',
              notes: 'Dip and drive. Full lockout.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '12 reps',
              notes: 'Chest to bar. Squeeze at the top.',
            },
            {
              id: 'm5',
              exerciseId: 107, // Ball Slams
              prescription: '15 reps',
              notes: 'Full extension overhead. Drive it down.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W5 Fri - Hyrox Lite ─────────────────────────────────────────────────
    {
      dayIndex: 32,
      label: 'Hyrox Lite',
      description:
        'Hyrox-style session. Eight stations, one round each, for time. Functional movements, high volume, designed to replicate the feel of race-day conditioning. This is the longest lower body session of the programme - pace from station one.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupConditioningFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 2 Rounds',
          instructions:
            'Short primer - the session is long. Move well, save your legs.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // Kettlebell Swing
              prescription: '15 reps',
              notes: 'Hip drive. Controlled. Warming up for what follows.',
            },
            {
              id: 'm2',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes:
                'Controlled hinge. Activate the glutes before the chipper.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Hyrox Lite (For Time)',
          instructions:
            'Eight stations. Complete all reps in order. One pass. Time yourself - this is your benchmark. Every station feeds into the next. Pace from station one.',
          movements: [
            {
              id: 'm1',
              exerciseId: 106, // Wall Balls
              prescription: '50 reps',
              notes: 'Break into sets of 10–15. Squat to depth every rep.',
            },
            {
              id: 'm2',
              exerciseId: 105, // Box Jumps
              prescription: '30 reps',
              notes: 'Step down every rep. Do not rush the reset.',
            },
            {
              id: 'm3',
              exerciseId: 92, // DB Farmer Carry
              prescription: '60s',
              notes: 'Heavy as possible. Tall posture. Walk steady.',
            },
            {
              id: 'm4',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '30 reps',
              notes: 'Moderate weight. Hinge clean, squeeze up.',
            },
            {
              id: 'm5',
              exerciseId: 38, // Walking Lunges
              prescription: '40 reps/side',
              notes: 'Keep moving. Light dumbbells if available.',
            },
            {
              id: 'm6',
              exerciseId: 107, // Ball Slams
              prescription: '30 reps',
              notes: 'Full extension overhead before each slam.',
            },
            {
              id: 'm7',
              exerciseId: 102, // Squat Jumps
              prescription: '25 reps',
              notes: 'Land soft every rep.',
            },
            {
              id: 'm8',
              exerciseId: 103, // Burpees
              prescription: '20 reps',
              notes: 'Last station. Empty the tank.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W5 Sun - Power Hour ─────────────────────────────────────────────────
    {
      dayIndex: 34,
      label: 'Power Hour',
      description:
        'Full body power. The WOD is an EMOM 20 - the longest EMOM of the programme. Five movements rotating across 20 minutes. Tests your ability to sustain effort, not just produce it.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupPowerFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Power movements. Load up - these are not warm-up sets.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 72, // DB Power Clean
              prescription: '5 reps',
              notes: 'Explosive. Stand tall. Reset between reps.',
            },
            {
              id: 'm2',
              exerciseId: 77, // DB Muscle Snatch
              prescription: '5 reps/side',
              notes: 'Swing from between legs, pull overhead in one motion.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'emom',
          title: 'WOD - EMOM 20',
          instructions:
            'Five movements rotating across 20 minutes - four rounds of each. Go hard on work. Use every second of rest.',
          minutes: 20,
          movements: [
            {
              id: 'm1',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '8 reps',
              notes: 'Drive forward. Land soft.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Squat and press. Full range.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '8 reps',
              notes: 'Band or assist is fine.',
            },
            {
              id: 'm4',
              exerciseId: 107, // Ball Slams
              prescription: '12 reps',
              notes: 'Full extension. Slam hard.',
            },
            {
              id: 'm5',
              exerciseId: 92, // DB Farmer Carry
              prescription: '30s (minutes 5, 10, 15, 20)',
              notes:
                'Heavy. Posture tall. Active recovery between the hard stations.',
            },
          ],
        },
        cooldownFullBodyDeep,
      ],
    },

    // =========================================================================
    // WEEK 6 - Peak week. Every session is the hardest version of its format.
    // =========================================================================

    // ─── W6 Mon - Final Ignition ──────────────────────────────────────────────
    {
      dayIndex: 35,
      label: 'Final Ignition',
      description:
        'Full body. The WOD is an AMRAP 25 - the longest AMRAP of the programme. Five movements, 25 minutes, everything you have built over six weeks on the line.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupFullBody,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Heaviest loads of the programme. Set your weights properly before the AMRAP begins.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes:
                'Heavier than every previous session. Press with conviction.',
            },
            {
              id: 'm2',
              exerciseId: 101, // DB Renegade Row
              prescription: '10 reps/side',
              notes: 'Locked hips. Pull to the hip. Slow and controlled.',
            },
            {
              id: 'm3',
              exerciseId: 98, // KB Goblet Squat
              prescription: '15 reps',
              notes: 'Elbows inside knees. Drive hard out of the hole.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'amrap',
          title: 'WOD - AMRAP 25',
          instructions:
            '25 minutes. Everything you have. This is six weeks of work coming to a head.',
          minutes: 25,
          movements: [
            {
              id: 'm1',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '8 reps',
              notes: 'Drive forward. Land soft. Same standard as week one.',
            },
            {
              id: 'm2',
              exerciseId: 106, // Wall Balls
              prescription: '15 reps',
              notes: 'Squat to depth every rep. Do not short the range.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '8 reps',
              notes: 'Every rep counts.',
            },
            {
              id: 'm4',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Squat and press. Full range.',
            },
            {
              id: 'm5',
              exerciseId: 107, // Ball Slams
              prescription: '15 reps',
              notes: 'Full extension. Slam hard.',
            },
          ],
        },
        cooldownStandard,
      ],
    },

    // ─── W6 Wed - The Last Pull ───────────────────────────────────────────────
    {
      dayIndex: 37,
      label: 'The Last Pull',
      description:
        'Pull-dominant upper body. The WOD is a chipper - every movement involves pulling, rowing, or anti-rotation work. The longest upper body WOD of the programme.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupUpperFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions: 'Heaviest upper body primer of the programme.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 8, // Dumbbell Row
              prescription: '12 reps/side',
              notes: 'Heaviest dumbbell row of the programme. Pull hard.',
            },
            {
              id: 'm2',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '3 reps/side',
              notes:
                'Slow and deliberate. Bell locked overhead. Own every position.',
            },
            {
              id: 'm3',
              exerciseId: 43, // Arnold Press
              prescription: '10 reps',
              notes: 'Full rotation. Controlled descent.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - The Last Pull Chipper (For Time)',
          instructions:
            'Complete in order. One pass. Pull, hinge, core - no pushing today. Time yourself.',
          movements: [
            {
              id: 'm1',
              exerciseId: 10, // Pull-ups
              prescription: '30 reps',
              notes:
                'Break as needed. Band or assist is fine. Every rep counts.',
            },
            {
              id: 'm2',
              exerciseId: 31, // Hanging Leg Raise
              prescription: '25 reps',
              notes: 'Control the lower. No swinging.',
            },
            {
              id: 'm3',
              exerciseId: 9, // Inverted Row
              prescription: '25 reps',
              notes: 'Chest to bar every rep.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '15 reps',
              notes:
                'Controlled reps. Exhale as you sit up. Keep the chin tucked. Aim to feel the abs initiate the movement rather than yanking with the hip flexors.',
            },
            {
              id: 'm5',
              exerciseId: 12, // Chin-ups
              prescription: '15 reps',
              notes: 'Underhand grip. Full hang to chin above bar.',
            },
            {
              id: 'm6',
              exerciseId: 49, // Russian Twists
              prescription: '40 reps',
              notes: 'Light dumbbell. Rotate from the ribs. Nearly done.',
            },
          ],
        },
        cooldownUpperFocus,
      ],
    },

    // ─── W6 Fri - Six Weeks Done ──────────────────────────────────────────────
    {
      dayIndex: 39,
      label: 'Six Weeks Done',
      description:
        'Lower body finale. The WOD is the hardest lower body chipper of the programme - more volume than Hyrox Lite, higher intensity. Time yourself.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupConditioningFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions: 'Heaviest lower body primer of the programme. Load up.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 6, // Bulgarian Split Squat
              prescription: '10 reps/side',
              notes: 'Heaviest of the programme. Drive through the front heel.',
            },
            {
              id: 'm2',
              exerciseId: 41, // Hip Thrust
              prescription: '15 reps',
              notes:
                'Heavier than every previous session. Squeeze and pause at the top.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes:
                'Controlled hinge. Glutes and hamstrings engaged throughout.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Six Weeks Done (For Time)',
          instructions:
            'One pass. Everything in order. The final lower body test. Time yourself.',
          movements: [
            {
              id: 'm1',
              exerciseId: 106, // Wall Balls
              prescription: '60 reps',
              notes: 'Break in sets of 15. Squat to depth every rep.',
            },
            {
              id: 'm2',
              exerciseId: 105, // Box Jumps
              prescription: '30 reps',
              notes: 'Step down every rep. Do not rush the reset.',
            },
            {
              id: 'm3',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '30 reps',
              notes: 'Hinge clean. Squeeze at the top.',
            },
            {
              id: 'm4',
              exerciseId: 38, // Walking Lunges
              prescription: '40 reps/side',
              notes: 'Keep moving. This is where week six is earned.',
            },
            {
              id: 'm5',
              exerciseId: 107, // Ball Slams
              prescription: '30 reps',
              notes: 'Full extension overhead before every slam.',
            },
            {
              id: 'm6',
              exerciseId: 102, // Squat Jumps
              prescription: '30 reps',
              notes: 'Land soft. Depth every rep.',
            },
            {
              id: 'm7',
              exerciseId: 111, // Wall Sit
              prescription: '90s',
              notes: 'Last thing. You earned it. Hold.',
            },
          ],
        },
        cooldownLowerFocus,
      ],
    },

    // ─── W6 Sun - Peak ───────────────────────────────────────────────────────
    {
      dayIndex: 41,
      label: 'Peak',
      description:
        'The last session. Full body. Everything. The WOD is the longest chipper of the programme - nine movements, one pass, for time. Every exercise here has appeared before. You know all of them. Now do them all at once.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmupConditioningFocus,
        {
          id: 'primer',
          type: 'rounds',
          title: 'Strength Primer - 3 Rounds',
          instructions:
            'Final primer. Load everything heavier than you have before. This is the last time.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 72, // DB Power Clean
              prescription: '5 reps',
              notes:
                'Explosive. Stand tall. Reset. Last power clean of the programme.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Squat and press. Full range. Heavy.',
            },
            {
              id: 'm3',
              exerciseId: 92, // DB Farmer Carry
              prescription: '30s',
              notes: 'Heaviest carry of the programme. Walk tall.',
            },
          ],
        },
        {
          id: 'wod',
          type: 'for_time',
          title: 'WOD - Peak (For Time)',
          instructions:
            'Nine movements. One pass. Everything in order. Time yourself. This is the final session of the programme - leave nothing behind.',
          movements: [
            {
              id: 'm1',
              exerciseId: 106, // Wall Balls
              prescription: '40 reps',
              notes: 'Set your pace early. Break in sets of 10.',
            },
            {
              id: 'm2',
              exerciseId: 103, // Burpees
              prescription: '20 reps',
              notes: 'Steady. This is the middle, not the end.',
            },
            {
              id: 'm3',
              exerciseId: 10, // Pull-ups
              prescription: '15 reps',
              notes: 'Break as needed. Every rep counts.',
            },
            {
              id: 'm4',
              exerciseId: 107, // Ball Slams
              prescription: '30 reps',
              notes: 'Full extension. Drive it into the floor.',
            },
            {
              id: 'm5',
              exerciseId: 104, // Burpee Broad Jumps
              prescription: '15 reps',
              notes: 'Drive forward. Land soft. Keep moving.',
            },
            {
              id: 'm6',
              exerciseId: 102, // Squat Jumps
              prescription: '25 reps',
              notes: 'Land soft. Depth every rep.',
            },
            {
              id: 'm7',
              exerciseId: 100, // DB Thruster
              prescription: '15 reps',
              notes: 'Squat and press. Full range. Keep going.',
            },
            {
              id: 'm8',
              exerciseId: 9, // Inverted Row
              prescription: '20 reps',
              notes: 'Chest to bar. Squeeze. Nearly done.',
            },
            {
              id: 'm9',
              exerciseId: 92, // DB Farmer Carry
              prescription: '60s',
              notes: 'Last thing. Heavy. Posture tall. Walk to the finish.',
            },
          ],
        },
        cooldownFullBodyDeep,
      ],
    },
  ],
};
