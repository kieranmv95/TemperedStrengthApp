import type { Program, WorkoutBlockWarmup } from '@/src/types/program';

const pilatesWarmup: WorkoutBlockWarmup = {
  id: 'wu',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '2–3 minutes. Breathe, find your core, move smoothly.',
  description: [
    '60s slow breathing — long exhale through the mouth, inhale through the nose',
    '5 spine roll-downs (stand tall, nod your chin and peel down vertebra by vertebra, then roll back up)',
    '10 glute bridges — slow, squeeze at the top',
    '10 controlled bodyweight squats',
  ],
};

export const pilates_intro_4wk_free: Program = {
  id: 'pilates_intro_4wk_free',
  isPro: false,
  name: 'Pilates Intro (4 Weeks)',
  description: `A beginner-friendly 4-week intro focused on core strength, control, and mobility. You'll leave sessions feeling taller, steadier, and more switched on.`,
  bodyChangesSummary: `You'll feel stronger through your core and more stable in everyday movement. Expect better posture, improved mobility, and a "tighter" feel around your midsection as you build control and consistency.`,
  categories: ['functional'],
  goals: ['mobility', 'stronger', 'leaner', 'maintenance'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '25m',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    const wk = week + 1;
    const intensity: number = week < 2 ? 4 : 5;

    return [
      // ─── Pilates A — Core + glutes ───────────────────────────────────────────
      // Focus: anterior core, glutes, lateral stability
      // Finisher is distinct from main block — breath-based endurance, no repeated exercises
      {
        dayIndex: week * 7 + 0,
        label: `Pilates A (Week ${wk})`,
        description:
          'Core + glutes. Slow reps, full control, and steady breathing. Every rep should feel deliberate.',
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
                exerciseId: 13, // Plank
                prescription: '20–40s',
                notes:
                  'Ribs down, glutes on. Think of pulling your elbows toward your toes without moving. Knees down is a great option.',
              },
              {
                id: 'm2',
                exerciseId: 25, // Glute Bridge
                prescription: '12–15 reps',
                notes:
                  'Peel your spine off the floor one vertebra at a time on the way up. Squeeze for a full second at the top, then lower slowly.',
              },
              {
                id: 'm3',
                exerciseId: 50, // Side Plank
                prescription: '20–30s/side',
                notes:
                  "Stack hips and feet or stagger for balance. Keep your top hip pushed forward — don't let it roll back.",
              },
              {
                id: 'm4',
                exerciseId: 86, // Sit-ups
                prescription: '8–12 reps',
                notes:
                  'Curl up slowly, leading with your ribs rather than your head. Exhale on the way up, inhale as you lower.',
              },
              {
                id: 'm5',
                label: 'Dead bug',
                prescription: '6–10/side',
                notes:
                  'Press your lower back gently into the floor throughout. Slow exhale as you reach the opposite arm and leg out. Never let your back arch.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'tabata',
            title: 'Breath + Core Endurance',
            instructions:
              'Distinct from the main block — this is about breathing under tension, not raw reps. Keep everything controlled.',
            rounds: 8,
            workSeconds: 20,
            restSeconds: 10,
            movements: [
              {
                id: 'm1',
                label: 'Single-leg stretch (Pilates)',
                prescription: '20s on / 10s off',
                notes:
                  'Lie on your back, both knees to chest, head and shoulders curled up. Alternate extending one leg out while drawing the other knee in. Exhale with each switch. Keep your lower back heavy throughout.',
              },
              {
                id: 'm2',
                label: 'Leg lower (controlled)',
                prescription: '20s on / 10s off',
                notes:
                  'Both legs extended toward the ceiling. Lower them together slowly — stop the moment your back starts to arch and bring them back. Knees slightly bent is absolutely fine.',
              },
            ],
          },
        ],
      },

      // ─── Pilates B — Mobility + spine + core ─────────────────────────────────
      // Focus: thoracic mobility, hip flexor balance, rotational core, The Hundred
      // No plank or side plank — those live in sessions A and C only
      {
        dayIndex: week * 7 + 2,
        label: `Pilates B (Week ${wk})`,
        description:
          'Mobility + spine + core. The session most people feel most in daily life — better posture, freer movement, less stiffness.',
        intensity,
        format: 'v2',
        blocks: [
          pilatesWarmup,
          {
            id: 'mobility',
            type: 'rounds',
            title: 'Mobility Flow',
            instructions:
              'Move smoothly. No rushing. Inhale to prepare, exhale to move.',
            rounds: 2,
            movements: [
              {
                id: 'm1',
                label: 'Cat-cow',
                prescription: '6–8 reps',
                notes:
                  'Inhale to arch (cow), exhale to round (cat). Move slowly and feel each section of your spine respond.',
              },
              {
                id: 'm2',
                label: 'Thread the needle',
                prescription: '5/side',
                notes:
                  'From all fours, rotate one arm under your body and let your shoulder drop toward the floor. Hold for a breath, then return slowly.',
              },
              {
                id: 'm3',
                label: 'Hip flexor lunge hold',
                prescription: '30s/side',
                notes:
                  'Kneel on one knee, back upright. Gently tuck your pelvis under and breathe into the front of the rear hip. This is the essential counterbalance to all the glute work in this program.',
              },
              {
                id: 'm4',
                label: "World's greatest stretch",
                prescription: '3–4/side',
                notes:
                  'Lunge forward, plant your hand inside the front foot, then rotate and reach your top arm to the ceiling. Move slowly through each stage.',
              },
            ],
          },
          {
            id: 'core',
            type: 'rounds',
            title: 'Core Control',
            instructions:
              'Calm, steady reps. No rushing between movements. Keep tension through your midline.',
            rounds: 2,
            movements: [
              {
                id: 'm1',
                label: 'The Hundred (modified)',
                prescription: '20–40 pumps',
                notes:
                  'Lie on your back, legs at tabletop or extended at 45°, head and shoulders curled up. Pump your straight arms up and down in small, fast pulses — 5 pumps inhale, 5 pumps exhale. The signature Pilates breathing drill.',
              },
              {
                id: 'm2',
                exerciseId: 86, // Sit-ups
                prescription: '8–12 reps',
                notes:
                  'Peel up one vertebra at a time — spinal segmentation rather than a crunch. Exhale as you come up, inhale as you lower.',
              },
              {
                id: 'm3',
                label: 'Leg circles (supine)',
                prescription: '6 circles each direction / side',
                notes:
                  'Lie on your back, one leg extended toward the ceiling. Draw slow, controlled circles from the hip. Keep the opposite hip completely still and your lower back pressed into the floor.',
              },
              {
                id: 'm4',
                label: 'Bird dog',
                prescription: '6–10/side',
                notes:
                  'From all fours, extend the opposite arm and leg simultaneously. Imagine balancing a glass of water on your lower back — hips stay perfectly square. Slow exhale on each reach.',
              },
            ],
          },
          {
            id: 'posture',
            type: 'emom',
            title: 'Posture EMOM',
            instructions:
              'Every minute: 40s smooth work, 20s breathe and reset. Shoulders away from your ears throughout.',
            minutes: 8,
            movements: [
              {
                id: 'm1',
                label: 'Wall angels',
                prescription: '40s',
                notes:
                  'Stand with your back flat against a wall, arms in a goalpost shape. Slide your arms overhead slowly, keeping contact with the wall the whole time. Only go as high as you can maintain contact.',
              },
              {
                id: 'm2',
                label: 'Breathing reset (nasal)',
                prescription: '20s',
                notes:
                  '4 counts in through the nose, 6 counts out. Let your ribs expand outward rather than lifting your shoulders.',
              },
            ],
          },
        ],
      },

      // ─── Pilates C — Core endurance + lateral + balance ──────────────────────
      // Focus: endurance holds, lateral stability, hip flexor balance
      // Plank returns here as the second plank session of the week
      // AMRAP flow uses entirely different exercises to the endurance block above it
      {
        dayIndex: week * 7 + 4,
        label: `Pilates C (Week ${wk})`,
        description:
          'Core endurance + balance. The hardest session of the week — stay calm, stay steady, and trust the process.',
        intensity,
        format: 'v2',
        blocks: [
          pilatesWarmup,
          {
            id: 'endurance',
            type: 'rounds',
            title: 'Core Endurance',
            instructions:
              'Stay calm, stay steady. Smooth breathing throughout — never hold your breath.',
            rounds: 3,
            movements: [
              {
                id: 'm1',
                exerciseId: 13, // Plank — second plank session of the week
                prescription: '25–45s',
                notes:
                  'Quality over duration. If your hips sag or rise, drop to your knees and hold the standard rather than pushing the time.',
              },
              {
                id: 'm2',
                label: 'Hollow hold',
                prescription: '15–25s',
                notes:
                  'Lie on your back, arms overhead, legs extended. Press your lower back into the floor, lift your shoulders and legs a few inches. If your back arches at all — bend your knees. This should feel hard but controlled.',
              },
              {
                id: 'm3',
                exerciseId: 50, // Side Plank
                prescription: '20–30s/side',
                notes:
                  'Top hip stays forward. Build toward a full side plank over the 4 weeks — knee-down version is always fine.',
              },
              {
                id: 'm4',
                exerciseId: 86, // Sit-ups
                prescription: '8–12 reps',
                notes: 'Slow, controlled. Exhale as you curl up.',
              },
              {
                id: 'm5',
                exerciseId: 93, // Bodyweight Calf Raises
                prescription: '15–20 reps',
                notes:
                  'Stand tall. Rise slowly, pause at the top, lower with control. A small balance challenge at the end of a core session — notice how much harder it is when your core is fatigued.',
              },
            ],
          },
          {
            id: 'flow',
            type: 'amrap',
            title: 'AMRAP Flow',
            instructions:
              'Repeat smooth rounds for the full time. Stop before your form breaks — one clean rep is worth more than three sloppy ones.',
            minutes: 8,
            movements: [
              {
                id: 'm1',
                label: 'Single-leg stretch (Pilates)',
                prescription: '8/side',
                notes:
                  'Head and shoulders curled up, lower back heavy. Alternate extending each leg out at 45°. Breathe steadily throughout.',
              },
              {
                id: 'm2',
                label: 'Quadruped thoracic rotation',
                prescription: '6/side',
                notes:
                  'From all fours, place one hand behind your head and rotate your elbow toward the ceiling. Keep your hips square and your core braced.',
              },
              {
                id: 'm3',
                label: 'Hip flexor lunge hold',
                prescription: '20s/side',
                notes:
                  'Same as Pilates B. Tuck the pelvis gently and breathe into the front of the rear hip. Close every session with this — your hips will thank you.',
              },
            ],
          },
        ],
      },
    ];
  }),
};
