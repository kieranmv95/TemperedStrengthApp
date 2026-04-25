import type { Program, WorkoutBlockWarmup } from '@/src/types/program';

const bootcampWarmup: WorkoutBlockWarmup = {
  id: 'wu',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '4 minutes. Get warm, then get moving.',
  description: [
    '60s brisk walk or easy cardio',
    '10 bodyweight squats',
    '10 glute bridges',
    '10 push-ups (elevated is fine)',
    '10 hinge reps (hands on hips, practice the movement)',
  ],
};

export const bootcamp_kb_db_pro: Program = {
  id: 'bootcamp_kb_db_pro',
  isPro: true,
  name: 'KB + DB Bootcamp',
  description:
    'Bootcamp-style training with kettlebells and dumbbells. Simple moves, strong sweat, and a big confidence boost.',
  bodyChangesSummary: `You'll build full-body strength and feel fitter fast. Expect improved stamina, a stronger core, and more shape and "tone" through your legs, glutes, and shoulders as you repeat the basics and progress.`,
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic', 'stronger'],
  difficulty: 'beginner',
  daysSplit: ['tue', 'thu', 'sat'],
  averageSessionDuration: '45m',
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity: number = week < 2 ? 7 : week < 4 ? 8 : 9;
    const wk = week + 1;

    return [
      // ─── Bootcamp 1 — Swing + Pull focus ───────────────────────────────────
      {
        dayIndex: week * 7 + 1,
        label: `Bootcamp 1 (Week ${wk})`,
        description:
          'Full body with a swing and pull focus. Keep the reps snappy and safe. Optional treadmill: 8–12 min incline walk after (easy pace).',
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'main',
            type: 'rounds',
            title: 'Swing + Pull Circuit',
            instructions:
              'Keep reps snappy and safe. Rest as needed between rounds.',
            rounds: 5,
            movements: [
              {
                id: 'm1',
                exerciseId: 24, // KB Swing
                prescription: '12–20 reps',
                notes:
                  'Hinge, snap, and let the bell float. Stop before your form slips.',
              },
              {
                id: 'm2',
                exerciseId: 5, // DB Goblet Squat
                prescription: '10–15 reps',
                notes:
                  'Brace your core and keep your chest up. Strong, steady reps.',
              },
              {
                id: 'm3',
                exerciseId: 8, // Dumbbell Row
                prescription: '10–15 reps/side',
                notes:
                  'Pull to your hip and pause at the top. Control the lower.',
              },
              {
                id: 'm4',
                exerciseId: 9, // Inverted Row
                prescription: '8–12 reps',
                notes:
                  'Keep your body rigid. Pull your chest to the bar and lower slowly.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'tabata',
            title: 'Tabata Finisher',
            instructions:
              'Bodyweight burn. Keep form sharp and scale as needed.',
            rounds: 8,
            workSeconds: 20,
            restSeconds: 10,
            movements: [
              {
                id: 'm1',
                label: 'Squat to reach',
                prescription: '20s on / 10s off',
              },
              {
                id: 'm2',
                label: 'Fast feet (or march)',
                prescription: '20s on / 10s off',
              },
            ],
          },
        ],
      },

      // ─── Bootcamp 2 — Upper body + shoulders ────────────────────────────────
      {
        dayIndex: week * 7 + 3,
        label: `Bootcamp 2 (Week ${wk})`,
        description:
          'Upper body + conditioning. Strict pressing, shoulder health, and a solid carry finisher. Optional treadmill: 10 min steady walk (easy to moderate).',
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'main',
            type: 'amrap',
            title: 'Upper AMRAP',
            instructions:
              'Set a steady pace. Repeat the circuit for quality rounds.',
            minutes: 12,
            movements: [
              {
                id: 'm1',
                exerciseId: 27, // DB Shoulder Press (strict) — replaces push press to differ from HIIT A
                prescription: '8–12 reps',
                notes:
                  'Control the press overhead. No leg drive — strict and strong.',
              },
              {
                id: 'm2',
                exerciseId: 2, // DB Bench Press
                prescription: '8–12 reps',
                notes: 'Lower with control. Press up confidently.',
              },
              {
                id: 'm3',
                exerciseId: 32, // DB Bicep Curls
                prescription: '10–15 reps',
                notes: 'No swinging. Slow reps count more.',
              },
              {
                id: 'm4',
                exerciseId: 56, // Reverse Flyes — rear delt/posture work
                prescription: '12–15 reps',
                notes:
                  'Hinge slightly forward, lead with your elbows. Light weight, full squeeze.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'for_time',
            title: 'Carry + Core (For Time)',
            instructions:
              'Complete the work with strict form. Take short breaks as needed.',
            movements: [
              {
                id: 'm1',
                exerciseId: 92, // DB Farmer Carry — new exercise
                prescription: '3 x 20m walks',
                notes:
                  'Pick heavy, stand tall, brace your core. Rest 20s between each walk.',
              },
              {
                id: 'm2',
                exerciseId: 86, // Sit-ups
                prescription: '30 total reps',
                notes: 'Slow and controlled. Exhale as you come up.',
              },
            ],
          },
        ],
      },

      // ─── Bootcamp 3 — Lower body + glutes ───────────────────────────────────
      {
        dayIndex: week * 7 + 5,
        label: `Bootcamp 3 (Week ${wk})`,
        description:
          'Lower body + glutes. Expect a burn—and a proud finish. Optional treadmill: 6–10 min easy walk to cool down.',
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'main',
            type: 'emom',
            title: 'Lower EMOM',
            instructions:
              'Every minute: complete the work, then rest the remainder.',
            minutes: 12,
            movements: [
              {
                id: 'm1',
                exerciseId: 23, // DB Romanian Deadlift
                prescription: '10–15 reps',
                notes:
                  'Hips back, soft knees, stand tall by squeezing your glutes.',
              },
              {
                id: 'm2',
                exerciseId: 76, // DB Split Squat
                prescription: '8–12 reps/side',
                notes:
                  'Use a support if balance is the limiter. Slow down the lower.',
              },
              {
                id: 'm3',
                exerciseId: 88, // Single-Leg DB Deadlift — new, replaces glute bridge to cut overlap
                prescription: '8–10 reps/side',
                notes:
                  'Slow and controlled. Use a light touch on a wall if balance is tricky.',
              },
              {
                id: 'm4',
                exerciseId: 49, // Russian Twists — replaces side plank to reduce overlap with Pilates
                prescription: '16–20 reps',
                notes:
                  'Keep your chest tall and rotate from the ribs, not the arms.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'amrap',
            title: 'Legs + Lungs AMRAP',
            instructions:
              'Steady pace. Keep breathing and keep moving for the full time.',
            minutes: 8,
            movements: [
              {
                id: 'm1',
                exerciseId: 91, // Weighted Step-ups — new, replaces label-only step-ups
                prescription: '10/side',
                notes:
                  'Drive through the heel of the working leg. Light dumbbells or bodyweight.',
              },
              {
                id: 'm2',
                label: 'Reverse lunges',
                prescription: '10/side',
              },
              {
                id: 'm3',
                exerciseId: 93, // Bodyweight Calf Raises — new
                prescription: '20 reps',
                notes: 'Slow on the way down. Full range.',
              },
            ],
          },
        ],
      },
    ];
  }),
};
