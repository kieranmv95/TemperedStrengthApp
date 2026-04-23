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
  bodyChangesSummary:
    'You’ll build full-body strength and feel fitter fast. Expect improved stamina, a stronger core, and more shape and “tone” through your legs, glutes, and shoulders as you repeat the basics and progress.',
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic', 'stronger'],
  difficulty: 'beginner',
  daysSplit: ['tue', 'thu', 'sat'],
  averageSessionDuration: '45m',
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity: number = week < 2 ? 7 : week < 4 ? 8 : 9;
    const wk = week + 1;

    return [
      {
        dayIndex: week * 7 + 1,
        label: `Bootcamp 1 (Week ${wk})`,
        description:
          'Full body with a swing focus. Keep the reps snappy and safe. Optional treadmill: 8–12 min incline walk after (easy pace).',
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'main',
            type: 'rounds',
            title: 'Swing Circuit',
            instructions: 'Keep reps snappy and safe. Rest as needed.',
            rounds: 5,
            movements: [
              {
                id: 'm1',
                exerciseId: 24,
                prescription: '12–20 reps',
                notes:
                  'Hinge, snap, and let the bell float. Stop before your form slips.',
              },
              {
                id: 'm2',
                exerciseId: 5,
                prescription: '10–15 reps',
                notes:
                  'Brace your core and keep your chest up. Strong, steady reps.',
              },
              {
                id: 'm3',
                exerciseId: 8,
                prescription: '10–15 reps',
                notes:
                  'Pull to your hip and pause at the top. Control the lower.',
              },
              {
                id: 'm4',
                exerciseId: 13,
                prescription: '30–45s',
                notes: 'Breathe slowly and keep your body line strong.',
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
      {
        dayIndex: week * 7 + 3,
        label: `Bootcamp 2 (Week ${wk})`,
        description:
          'Upper body + conditioning. You decide the pace—keep it real. Optional treadmill: 10 min steady walk (easy to moderate).',
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
                exerciseId: 73,
                prescription: '8–12 reps',
                notes: 'Small dip, strong press. Keep your core tight.',
              },
              {
                id: 'm2',
                exerciseId: 2,
                prescription: '8–12 reps',
                notes: 'Lower with control. Press up confidently.',
              },
              {
                id: 'm3',
                exerciseId: 32,
                prescription: '10–15 reps',
                notes: 'No swinging. Slow reps count more.',
              },
              {
                id: 'm4',
                label: 'Fast step jacks (or march)',
                prescription: '30–45s',
                notes: 'Keep it light — just enough to keep the heart rate up.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'for_time',
            title: 'Push Finish (For Time)',
            instructions:
              'Complete the work with strict form. Take short breaks as needed.',
            movements: [
              { id: 'm1', label: 'Push-ups', prescription: '40 total reps' },
              {
                id: 'm2',
                label: 'Hollow hold (or dead bug)',
                prescription: '90s total',
              },
            ],
          },
        ],
      },
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
                exerciseId: 23,
                prescription: '10–15 reps',
                notes:
                  'Hips back, soft knees, stand tall by squeezing your glutes.',
              },
              {
                id: 'm2',
                exerciseId: 76,
                prescription: '8–12 reps/side',
                notes:
                  'Use a support if balance is the limiter. Slow down the lower.',
              },
              {
                id: 'm3',
                exerciseId: 25,
                prescription: '12–20 reps',
                notes: 'Squeeze and hold for a beat at the top.',
              },
              {
                id: 'm4',
                exerciseId: 50,
                prescription: '20–40s/side',
                notes: 'Drop the bottom knee if you need it.',
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
              { id: 'm1', label: 'Reverse lunges', prescription: '10/side' },
              {
                id: 'm2',
                label: 'Fast step-ups (or march)',
                prescription: '20 reps',
              },
              { id: 'm3', label: 'Glute bridge hold', prescription: '30s' },
            ],
          },
        ],
      },
    ];
  }),
};
