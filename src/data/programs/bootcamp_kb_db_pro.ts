import type { Program, WorkoutBlockWarmup } from '@/src/types/program';

const bootcampWarmup: WorkoutBlockWarmup = {
  id: 'wu',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '4–5 minutes. Get warm, then get moving.',
  description: [
    '60s brisk walk or easy cardio',
    '5 KB halos each direction (or shoulder circles if no KB yet) — wake up the shoulders',
    '10 KB goblet squats (or bodyweight squats) — find your hinge',
    '10 glute bridges — activate the posterior chain',
    '10 push-ups (elevated is fine)',
  ],
};

export const bootcamp_kb_db_pro: Program = {
  id: 'bootcamp_kb_db_pro',
  isPro: true,
  name: 'KB + DB Bootcamp',
  description:
    'Bootcamp-style training with kettlebells and dumbbells. Simple moves, strong sweat, and a big confidence boost.',
  bodyChangesSummary:
    'You\'ll build full-body strength and feel fitter fast. Expect improved stamina, a stronger core, and more shape and "tone" through your legs, glutes, and shoulders as you repeat the basics and progress.',
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic', 'stronger'],
  difficulty: 'beginner',
  daysSplit: ['tue', 'thu', 'sat'],
  averageSessionDuration: '45m',
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity: number = week < 2 ? 7 : week < 4 ? 8 : 9;
    const wk = week + 1;

    return [
      // ─── Bootcamp 1 — KB swing + pull focus ─────────────────────────────────
      // Push/pull balanced: DB Row + Inverted Row pair on the pull side,
      // KB Swing provides hip hinge, KB Goblet Squat keeps the KB theme throughout.
      // Plank is gone from the main block — core is handled in Bootcamp 3 only.
      {
        dayIndex: week * 7 + 1,
        label: `Bootcamp 1 (Week ${wk})`,
        description:
          'Full body with a swing and pull focus. KB carries the session — own the hinge. Optional treadmill: 8–12 min incline walk after (easy pace).',
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
                  'Hinge, snap hips, and let the bell float to shoulder height. The power comes from the hips — not your arms. Stop before your form slips.',
              },
              {
                id: 'm2',
                exerciseId: 98, // KB Goblet Squat — keeps the KB in play for session 1
                prescription: '10–15 reps',
                notes:
                  'Hold by the horns at chest height. Elbows inside your knees at the bottom. Drive through your heels to stand.',
              },
              {
                id: 'm3',
                exerciseId: 8, // DB Row
                prescription: '10–15 reps/side',
                notes:
                  "Pull to your hip and pause at the top. Elbow close to your body. Control the lower — don't drop it.",
              },
              {
                id: 'm4',
                exerciseId: 9, // Inverted Row — second pull, vertical variety
                prescription: '8–12 reps',
                notes:
                  'Keep your body rigid from heels to shoulders. Pull your chest all the way to the bar. Lower slowly.',
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
                notes:
                  'Squat deep, reach both arms overhead as you rise. Smooth and continuous.',
              },
              {
                id: 'm2',
                label: 'Fast feet (or march)',
                prescription: '20s on / 10s off',
                notes:
                  'Keep it light — this is a metabolic flush, not a sprint.',
              },
            ],
          },
        ],
      },

      // ─── Bootcamp 2 — KB skill + upper body pressing ────────────────────────
      // The KB gets a proper upper body role here via KB Clean → KB Press sequence.
      // DB fills the horizontal push gap that was missing from the original.
      // Rear delt/posture work via Reverse Flyes — important shoulder health balance
      // after back-to-back pressing days.
      // The AMRAP now has an honest push/pull balance:
      //   Push: DB Shoulder Press (strict) + DB Bench Press
      //   Pull: DB Row (carried from warm-up energy)
      //   Shoulder health: Reverse Flyes
      {
        dayIndex: week * 7 + 3,
        label: `Bootcamp 2 (Week ${wk})`,
        description:
          "KB skill day + upper body. You'll learn the clean-to-press sequence — the backbone of kettlebell training. Optional treadmill: 10 min steady walk (easy to moderate).",
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'skill',
            type: 'rounds',
            title: 'KB Skill: Clean + Press',
            instructions:
              'Take your time here. These are skill movements — quality reps only. Rest fully between rounds.',
            rounds: 4,
            movements: [
              {
                id: 'm1',
                exerciseId: 96, // KB Clean
                prescription: '5 reps/side',
                notes:
                  'Hinge, pull, and guide the bell into the rack position at your shoulder — not your wrist. The bell should land softly. Practise slow before going fast.',
              },
              {
                id: 'm2',
                exerciseId: 97, // KB Press (Single Arm)
                prescription: '5 reps/side',
                notes:
                  'Bell in rack, brace your core, press straight up to lockout. Your body should be rigid — no side-lean or hip shift. Lower slowly back to rack.',
              },
            ],
          },
          {
            id: 'main',
            type: 'amrap',
            title: 'Upper AMRAP',
            instructions:
              'Set a steady pace. Push and pull balanced — accumulate quality rounds.',
            minutes: 10,
            movements: [
              {
                id: 'm1',
                exerciseId: 27, // DB Shoulder Press (strict)
                prescription: '8–12 reps',
                notes:
                  'No leg drive — strict overhead press. Control the press and the lower equally.',
              },
              {
                id: 'm2',
                exerciseId: 2, // DB Bench Press
                prescription: '8–12 reps',
                notes:
                  'Horizontal push to complement the overhead work above. Lower with control, press with confidence.',
              },
              {
                id: 'm3',
                exerciseId: 8, // DB Row
                prescription: '10–12 reps/side',
                notes:
                  'Pull to your hip, pause at the top. No swinging — this is the pull balance to the pressing above.',
              },
              {
                id: 'm4',
                exerciseId: 56, // Reverse Flyes — rear delt/posture health
                prescription: '12–15 reps',
                notes:
                  "Hinge forward slightly, lead with your elbows, light weight, full squeeze at the top. Shoulder health work — don't skip it.",
              },
            ],
          },
          {
            id: 'finisher',
            type: 'for_time',
            title: 'Carry + Core (For Time)',
            instructions:
              'Complete the work with strict form. Take short breaks as needed — quality over speed.',
            movements: [
              {
                id: 'm1',
                exerciseId: 92, // DB Farmer Carry
                prescription: '3 x 20m walks',
                notes:
                  'Pick heavy. Stand tall, shoulders packed down and back, brace your core. Rest 20s between each walk.',
              },
              {
                id: 'm2',
                exerciseId: 86, // Sit-ups
                prescription: '30 total reps',
                notes:
                  'Slow and controlled. Exhale as you come up. Break into sets of 10 if needed.',
              },
            ],
          },
        ],
      },

      // ─── Bootcamp 3 — Lower body + KB Turkish Get-Up ────────────────────────
      // The get-up is the centrepiece — it gets its own dedicated block rather than
      // being buried in a circuit. Lower EMOM uses the new single-leg DB deadlift
      // to replace the glute bridge (already in the warmup). Russian Twists replace
      // side plank to cut overlap with Pilates. Finisher uses new Weighted Step-ups
      // and Calf Raises to broaden lower body coverage.
      {
        dayIndex: week * 7 + 5,
        label: `Bootcamp 3 (Week ${wk})`,
        description:
          'Lower body + the KB Turkish Get-Up. The get-up is the most technical move in the program — take your time and earn it. Optional treadmill: 6–10 min easy walk to cool down.',
        intensity,
        format: 'v2',
        blocks: [
          bootcampWarmup,
          {
            id: 'getup',
            type: 'rounds',
            title: 'KB Turkish Get-Up',
            instructions:
              "This is a skill block, not a conditioning block. Move slowly and deliberately through every position. One rep takes 30–60 seconds when done correctly — that's intentional.",
            rounds: 3,
            movements: [
              {
                id: 'm1',
                exerciseId: 95, // KB Turkish Get-Up
                prescription: '3 reps/side',
                notes:
                  "Keep your eyes on the bell the entire time. Move from lying → elbow → hand → hip up → tall kneeling → standing, then reverse every step. Use a light weight until the pattern is solid. If you lose the bell, that's feedback — go lighter.",
              },
            ],
          },
          {
            id: 'main',
            type: 'emom',
            title: 'Lower EMOM',
            instructions:
              'Every minute: complete the work, then rest the remainder. Keep loads manageable — quality reps, not rushed ones.',
            minutes: 12,
            movements: [
              {
                id: 'm1',
                exerciseId: 23, // DB Romanian Deadlift
                prescription: '10–15 reps',
                notes:
                  'Hips back, soft knees, feel the hamstring stretch at the bottom. Stand tall by squeezing your glutes at the top.',
              },
              {
                id: 'm2',
                exerciseId: 76, // DB Split Squat
                prescription: '8–12 reps/side',
                notes:
                  'Use a wall or rack for balance if you need it. Slow down the lower — 2–3 seconds on the way down.',
              },
              {
                id: 'm3',
                exerciseId: 88, // Single-Leg DB Deadlift — new, deeper hip hinge challenge
                prescription: '8–10 reps/side',
                notes:
                  'Hinge forward on one leg until your torso is near parallel, then return. Use a light touch on a wall if balance is the limiter. Keep your hips square.',
              },
              {
                id: 'm4',
                exerciseId: 49, // Russian Twists — replaces side plank, cuts Pilates overlap
                prescription: '16–20 reps',
                notes:
                  'Lean back slightly, feet off the floor if you can. Rotate from the ribs — not just the arms. Keep your chest tall.',
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
                exerciseId: 91, // Weighted Step-ups
                prescription: '10/side',
                notes:
                  'Drive through the heel of the working leg. Light dumbbells or bodyweight — this is conditioning, not a strength test.',
              },
              {
                id: 'm2',
                exerciseId: 100, // DB Thruster — new, squat-to-press combo for conditioning
                prescription: '8–10 reps',
                notes:
                  'Squat deep, then drive the dumbbells overhead as you stand — one fluid movement. Use a weight that lets you keep moving for all 8 reps without stopping.',
              },
              {
                id: 'm3',
                exerciseId: 93, // Bodyweight Calf Raises
                prescription: '20 reps',
                notes:
                  'Slow on the way down. Full range — pause at the top for a beat.',
              },
            ],
          },
        ],
      },
    ];
  }),
};
