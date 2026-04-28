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

// ─── Programme ───────────────────────────────────────────────────────────────

export const hiit_shred_free: Program = {
  id: 'hiit_shred_free',
  isPro: false,
  name: 'HIIT Shred Taster',
  description: `The Hiit Shred Taster is a 4 day preview of what the full Hiit Shred 6 week PRO programme is like. It might not be the full thing, but it is a good way to get started.`,
  bodyChangesSummary: `A taste of what is to come. Better stamina, more athleticism, and a tighter feel through your legs, glutes, and core.`,
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
  ],
};
