import type { Program, WorkoutBlockWarmup } from '@/src/types/program';

const hiitWarmup: WorkoutBlockWarmup = {
  id: 'wu',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '3–5 minutes. Start easy and build up.',
  description: [
    '60s easy cardio (walk, bike, row, or march on the spot)',
    '10 bodyweight squats',
    '10 glute bridges',
    '10 inchworms',
    '20s plank (knees down is fine)',
  ],
};

export const hiit_shred_6wk_pro: Program = {
  id: 'hiit_shred_6wk_pro',
  isPro: true,
  name: 'HIIT Shred (6 Weeks)',
  description: `A 6-week dumbbell-based HIIT block to build confidence, boost fitness, and support body composition. Short rests, simple moves, big results.`,
  bodyChangesSummary: `You'll build strength and feel more athletic, while getting fitter week by week. Expect more energy, better stamina, and a tighter feel through your legs, glutes, and core as you stay consistent.`,
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri', 'sun'],
  averageSessionDuration: '45m',
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity: number = week < 2 ? 7 : week < 4 ? 8 : 9;
    const wk = week + 1;

    return [
      // ─── Shred A — Full body, horizontal push focus ─────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Shred A (Week ${wk})`,
        description:
          'Full body dumbbells. Horizontal push opener today — different stimulus to the other sessions. Optional treadmill: 8–12 min incline walk after (easy pace).',
        intensity,
        format: 'v2',
        blocks: [
          hiitWarmup,
          {
            id: 'main',
            type: 'rounds',
            title: 'Circuit',
            instructions: 'Move with intent. Rest as needed, then keep going.',
            rounds: 4,
            movements: [
              {
                id: 'm1',
                exerciseId: 2, // DB Bench Press — replaces DB Push Press (moved to Shred C) to vary push pattern
                prescription: '10–15 reps',
                notes:
                  'Lower with control and press with confidence. Keep shoulders down and back.',
              },
              {
                id: 'm2',
                exerciseId: 8, // Dumbbell Row
                prescription: '10–15 reps/side',
                notes:
                  'Pull the dumbbell to your hip. Pause for a beat at the top and control the lower.',
              },
              {
                id: 'm3',
                exerciseId: 5, // DB Goblet Squat
                prescription: '10–15 reps',
                notes:
                  'Stay tall, brace your core, and drive up fast. Pick a weight that challenges but stays safe.',
              },
              {
                id: 'm4',
                exerciseId: 34, // Lateral Raises — adds missing shoulder variety
                prescription: '12–15 reps',
                notes:
                  'Light weight, full arc. Lead with your elbows and avoid shrugging.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'tabata',
            title: 'Tabata Finisher',
            instructions:
              'Go hard on work, fully recover on rest. Pick options you can maintain for all rounds.',
            rounds: 8,
            workSeconds: 20,
            restSeconds: 10,
            movements: [
              {
                id: 'm1',
                label: 'Fast step jacks (or march)',
                prescription: '20s on / 10s off',
                notes:
                  'Keep shoulders relaxed. Scale to a brisk march if needed.',
              },
              {
                id: 'm2',
                label: 'Skater steps (low impact)',
                prescription: '20s on / 10s off',
                notes: 'Soft knees. Stay light and smooth.',
              },
            ],
          },
        ],
      },

      // ─── Shred B — Lower body, fully redesigned EMOM ────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Shred B (Week ${wk})`,
        description: `Lower body + hamstring focus. Completely different stimulus to Bootcamp's lower EMOM. Expect a burn. Optional treadmill: 10 min steady walk (easy to moderate).`,
        intensity,
        format: 'v2',
        blocks: [
          hiitWarmup,
          {
            id: 'main',
            type: 'emom',
            title: 'Lower EMOM',
            instructions:
              'Every minute: complete the work, then rest the remainder. Keep loads manageable and reps crisp.',
            minutes: 12,
            movements: [
              {
                id: 'm1',
                exerciseId: 23, // DB Romanian Deadlift
                prescription: '10–12 reps',
                notes:
                  'Hinge back, keep the dumbbells close, and stand tall by squeezing your glutes.',
              },
              {
                id: 'm2',
                exerciseId: 38, // Walking Lunges — replaces DB Split Squat (used in Bootcamp 3)
                prescription: '10 reps/side',
                notes:
                  'Tall torso. Light touch of the back knee, then drive forward.',
              },
              {
                id: 'm3',
                exerciseId: 6, // Bulgarian Split Squat — different from split squat pattern, more knee dominant
                prescription: '8–10 reps/side',
                notes:
                  'Rear foot elevated. Drive through the front heel. Slow on the way down.',
              },
              {
                id: 'm4',
                exerciseId: 93, // Bodyweight Calf Raises — new, replaces side plank (used heavily in Pilates)
                prescription: '20–25 reps',
                notes: 'Full range. Pause at the top and lower slowly.',
              },
            ],
          },
          {
            id: 'finisher',
            type: 'for_time',
            title: 'Glute Burnout (For Time)',
            instructions:
              'Complete the work with clean form. Short breaks are fine — keep moving.',
            movements: [
              {
                id: 'm1',
                label: 'Bodyweight squat',
                prescription: '40 reps',
                notes: 'Smooth reps. Full range you can control.',
              },
              {
                id: 'm2',
                label: 'Reverse lunge',
                prescription: '20/side',
                notes: 'Light touch of the knee, tall torso.',
              },
              {
                id: 'm3',
                label: 'Wall sit',
                prescription: '60s',
                notes: 'Breathe. Keep knees tracking over toes.',
              },
            ],
          },
        ],
      },

      // ─── Shred C — Upper body + vertical push ───────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Shred C (Week ${wk})`,
        description: `Upper body + core. Vertical push today — different to Shred A's horizontal push. You should finish feeling worked, not wrecked. Optional treadmill: 6–10 min easy walk to cool down.`,
        intensity,
        format: 'v2',
        blocks: [
          hiitWarmup,
          {
            id: 'main',
            type: 'amrap',
            title: 'Upper AMRAP',
            instructions:
              'Set a steady pace. Accumulate quality rounds for the full time.',
            minutes: 12,
            movements: [
              {
                id: 'm1',
                exerciseId: 73, // DB Push Press — moved here from Shred A, vertical push pattern
                prescription: '8–12 reps',
                notes: 'Small dip, strong drive. Keep it smooth—no rushing.',
              },
              {
                id: 'm2',
                exerciseId: 27, // DB Shoulder Press (strict)
                prescription: '8–12 reps',
                notes: 'Brace your core and avoid leaning back. Smooth reps.',
              },
              {
                id: 'm3',
                exerciseId: 32, // DB Bicep Curls
                prescription: '10–15 reps',
                notes: 'No swinging. Move slowly and own every rep.',
              },
              {
                id: 'm4',
                exerciseId: 56, // Reverse Flyes — replaces label-only banded pull-aparts with a tracked exercise
                prescription: '12–15 reps',
                notes:
                  'Posture focus. Shoulders down, squeeze shoulder blades at the top.',
              },
            ],
          },
          {
            id: 'core',
            type: 'tabata',
            title: 'Core Tabata',
            instructions:
              'Pick options that stay controlled. Keep your ribs down and breathe.',
            rounds: 8,
            workSeconds: 20,
            restSeconds: 10,
            movements: [
              {
                id: 'm1',
                label: 'Bicycle crunch (slow)',
                prescription: '20s on / 10s off',
                notes: 'Rotate from the ribs. Keep it controlled.',
              },
              {
                id: 'm2',
                label: 'Glute bridge march',
                prescription: '20s on / 10s off',
                notes: 'Hips stay level. Small steps, constant tension.',
              },
            ],
          },
        ],
      },

      // ─── Shred D — Full body power day ──────────────────────────────────────
      {
        dayIndex: week * 7 + 6,
        label: `Shred D (Week ${wk})`,
        description:
          'Full body power day. Push and pull balanced — short rests, keep it honest. Optional treadmill: 10 min intervals (1 min brisk / 1 min easy).',
        intensity,
        format: 'v2',
        blocks: [
          hiitWarmup,
          {
            id: 'main',
            type: 'for_time',
            title: 'Push + Pull Finisher',
            instructions:
              'Complete the work as fast as you can with good form. Rest only when you need it.',
            movements: [
              {
                id: 'm1',
                exerciseId: 72, // DB Power Clean
                prescription: '6–10 reps',
                notes: `Explosive pull, then stand tall. Keep reps crisp — swap to a goblet squat if technique isn't there today.'`,
              },
              {
                id: 'm2',
                exerciseId: 74, // DB Goblet Front Squat
                prescription: '10–15 reps',
                notes: 'Full range you can control. Breathe and keep moving.',
              },
              {
                id: 'm3',
                exerciseId: 10, // Pull-ups — replaces push-ups (already in warmup/other sessions) to add vertical pull
                prescription: '5–10 reps',
                notes:
                  'Use an assisted machine or band if needed. Any pull-up rep counts.',
              },
              {
                id: 'm4',
                exerciseId: 3, // Push-ups
                prescription: '10–20 reps',
                notes:
                  'Hands elevated is a great option — choose the version that lets you keep good form.',
              },
            ],
          },
          {
            id: 'afterburn',
            type: 'emom',
            title: 'Afterburn EMOM',
            instructions:
              'Every minute: 30s work, 30s easy. Keep the work honest but repeatable.',
            minutes: 10,
            movements: [
              {
                id: 'm1',
                exerciseId: 91, // Weighted Step-ups — replaces label-only step-ups
                prescription: '30s',
                notes:
                  'Light or no weight — this is conditioning, not another leg burner.',
              },
              { id: 'm2', label: 'Easy walk / breathe', prescription: '30s' },
            ],
          },
        ],
      },
    ];
  }),
};
