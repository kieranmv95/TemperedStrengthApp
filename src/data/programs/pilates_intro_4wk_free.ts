import type { Program, WorkoutBlockWarmup } from '@/src/types/program';

const pilatesWarmup: WorkoutBlockWarmup = {
  id: 'wu',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '2–3 minutes. Breathe, find your core, move smoothly.',
  description: [
    '60s slow breathing (long exhale)',
    '10 glute bridges (squeeze at the top)',
    '10 controlled bodyweight squats',
    '20s plank (knees down is fine)',
  ],
};

export const pilates_intro_4wk_free: Program = {
  id: 'pilates_intro_4wk_free',
  isPro: false,
  name: 'Pilates Intro (4 Weeks)',
  description:
    'A beginner-friendly 4-week intro focused on core strength, control, and mobility. You’ll leave sessions feeling taller, steadier, and more switched on.',
  bodyChangesSummary:
    'You’ll feel stronger through your core and more stable in everyday movement. Expect better posture, improved mobility, and a “tighter” feel around your midsection as you build control and consistency.',
  categories: ['functional'],
  goals: ['mobility', 'stronger', 'leaner', 'maintenance'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '25m',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    const wk = week + 1;
    const intensity: number = week < 2 ? 4 : 5;

    return [
      {
        dayIndex: week * 7 + 0,
        label: `Pilates A (Week ${wk})`,
        description:
          'Core + glutes. Slow reps, full control, and steady breathing.',
        intensity,
        format: 'v2',
        blocks: [
          pilatesWarmup,
          {
            id: 'main',
            type: 'rounds',
            title: 'Control Circuit',
            instructions:
              'Slow reps, full control, steady breathing. Stop a rep short of losing form.',
            rounds: 3,
            movements: [
              {
                id: 'm1',
                exerciseId: 13,
                prescription: '20–40s',
                notes: 'Think ribs down, glutes on. Knees down is a great option.',
              },
              {
                id: 'm2',
                exerciseId: 25,
                prescription: '12–20 reps',
                notes: 'Squeeze for a full second at the top. Keep your ribs down.',
              },
              {
                id: 'm3',
                exerciseId: 50,
                prescription: '20–30s/side',
                notes: 'Keep it smooth. Drop the bottom knee if needed.',
              },
              {
                id: 'm4',
                exerciseId: 86,
                prescription: '8–15 reps',
                notes: 'Slow down the lower. Exhale as you come up.',
              },
              {
                id: 'm5',
                label: 'Dead bug',
                prescription: '8–12/side',
                notes: 'Low back stays heavy. Slow exhale on the reach.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'tabata',
            title: 'Core Tabata',
            instructions:
              'Keep it controlled. Choose regressions that let you keep breathing steady.',
            rounds: 8,
            workSeconds: 20,
            restSeconds: 10,
            movements: [
              {
                id: 'm1',
                label: 'Glute bridge hold',
                prescription: '20s on / 10s off',
                notes: 'Ribs down, squeeze glutes, breathe.',
              },
              {
                id: 'm2',
                label: 'Side plank (switch halfway)',
                prescription: '20s on / 10s off',
                notes: 'Knee-down is great if you need it.',
              },
            ],
          },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: `Pilates B (Week ${wk})`,
        description: 'Mobility + core. You should finish feeling better than you started.',
        intensity,
        format: 'v2',
        blocks: [
          pilatesWarmup,
          {
            id: 'mobility',
            type: 'rounds',
            title: 'Mobility Flow',
            instructions: 'Move smoothly. No rushing. Breathe the whole time.',
            rounds: 2,
            movements: [
              { id: 'm1', label: 'Cat-cow', prescription: '6–8 reps' },
              { id: 'm2', label: 'Thread the needle', prescription: '5/side' },
              { id: 'm3', label: 'World’s greatest stretch', prescription: '3–4/side' },
            ],
          },
          {
            id: 'core',
            type: 'rounds',
            title: 'Core Control',
            instructions: 'Calm, steady reps. Keep tension through the midline.',
            rounds: 2,
            movements: [
              {
                id: 'm1',
                exerciseId: 13,
                prescription: '20–40s',
                notes: 'Breathe slowly and keep your neck relaxed.',
              },
              {
                id: 'm2',
                exerciseId: 25,
                prescription: '12–20 reps',
                notes: 'Smooth reps. Squeeze at the top.',
              },
              {
                id: 'm3',
                label: 'Bird dog',
                prescription: '6–10/side',
                notes: 'Hips stay square. Slow exhale as you reach.',
              },
              {
                id: 'm4',
                exerciseId: 50,
                prescription: '20–30s/side',
                notes: 'Keep hips stacked. Knee-down is fine.',
              },
              {
                id: 'm5',
                exerciseId: 31,
                prescription: '6–12 reps (optional)',
                notes:
                  'If hanging raises aren’t for you yet, swap to a simpler core move and keep it controlled.',
              },
            ],
          },
          {
            id: 'posture',
            type: 'emom',
            title: 'Posture EMOM',
            instructions:
              'Every minute: 40s smooth work, 20s breathe. Keep shoulders down and neck relaxed.',
            minutes: 8,
            movements: [
              { id: 'm1', label: 'Wall angels (or band pull-aparts)', prescription: '40s' },
              { id: 'm2', label: 'Breathing reset (nasal)', prescription: '20s' },
            ],
          },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: `Pilates C (Week ${wk})`,
        description: 'Core endurance. Stay calm, stay steady.',
        intensity,
        format: 'v2',
        blocks: [
          pilatesWarmup,
          {
            id: 'endurance',
            type: 'rounds',
            title: 'Core Endurance',
            instructions: 'Stay calm, stay steady. Smooth breathing.',
            rounds: 3,
            movements: [
              {
                id: 'm1',
                exerciseId: 13,
                prescription: '20–45s',
                notes: 'Quality over time. Breathe.',
              },
              {
                id: 'm2',
                label: 'Hollow hold (or dead bug)',
                prescription: '15–30s',
                notes: 'Choose the hardest version you can keep perfect.',
              },
              {
                id: 'm3',
                exerciseId: 25,
                prescription: '12–20 reps',
                notes: 'Squeeze at the top and control the lower.',
              },
              {
                id: 'm4',
                exerciseId: 86,
                prescription: '8–15 reps',
                notes: 'Slow, controlled reps.',
              },
              {
                id: 'm5',
                exerciseId: 50,
                prescription: '20–30s/side',
                notes: 'Finish steady. Knee-down is fine.',
              },
            ],
          },
          {
            id: 'flow',
            type: 'amrap',
            title: 'AMRAP Flow',
            instructions:
              'Repeat smooth rounds. Stop before your form breaks down.',
            minutes: 8,
            movements: [
              { id: 'm1', label: 'Glute bridge', prescription: '12 reps' },
              { id: 'm2', label: 'Heel taps (or dead bug)', prescription: '10/side' },
              { id: 'm3', label: 'Quadruped thoracic rotations', prescription: '6/side' },
            ],
          },
        ],
      },
    ];
  }),
};

