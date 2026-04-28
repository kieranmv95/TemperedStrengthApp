import type {
  Program,
  WorkoutBlockCooldown,
  WorkoutBlockWarmup,
  WorkoutV2,
} from '@/src/types/program';

// ─── Tailored Warm-Ups ───────────────────────────────────────────────────────

const warmupShredA: WorkoutBlockWarmup = {
  id: 'wu-a',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '4–5 minutes. Build from easy to ready.',
  description: [
    '60s easy cardio (walk, bike, row, or march on the spot)',
    '10 inchworms — walk out slow, own the range',
    '10 push-ups (knees down is fine)',
    '10 bodyweight squats',
    '10 reverse lunges (5 each side)',
  ],
};

const warmupShredB: WorkoutBlockWarmup = {
  id: 'wu-b',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '4–5 minutes. Focus on hips and hamstrings.',
  description: [
    '60s easy cardio (walk, bike, row, or march on the spot)',
    '10 glute bridges — pause at the top each rep',
    '10 bodyweight squats — slow on the way down',
    '10 reverse lunges (5 each side)',
    '10 glute bridge marches — keep hips level',
  ],
};

const warmupShredC: WorkoutBlockWarmup = {
  id: 'wu-c',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '4–5 minutes. Open the shoulders and get the core firing.',
  description: [
    '60s easy cardio (walk, bike, row, or march on the spot)',
    '10 inchworms',
    '10 pike push-ups (slow and controlled)',
    '10 bodyweight squats',
    '20s plank hold — ribs down, breathe',
  ],
};

const warmupShredD: WorkoutBlockWarmup = {
  id: 'wu-d',
  type: 'warmup',
  title: 'Warm-Up',
  instructions: '5 minutes. Dynamic and progressive — this one earns it.',
  description: [
    '60s easy cardio (walk, bike, row, or march on the spot)',
    '10 inchworms',
    '10 bodyweight squats',
    '5 burpees (easy pace)',
    '10 glute bridges',
    '10 reverse lunges (5 each side)',
  ],
};

// ─── Cooldown Blocks ─────────────────────────────────────────────────────────

const cooldownStandard: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions: '3–5 minutes. Bring your heart rate down. Do not skip this.',
  description: [
    '60s easy walk or march on the spot',
    '30s quad stretch each side — hold a wall if needed',
    '30s hamstring stretch each side',
    '30s hip flexor lunge stretch each side',
    '30s chest opener — hands clasped behind back',
  ],
};

const cooldownUpperFocus: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions: '3–5 minutes. Let the shoulders and upper back unwind.',
  description: [
    '60s easy walk or march on the spot',
    '30s cross-body shoulder stretch each side',
    '30s chest opener — hands clasped behind back',
    '30s neck side stretch each side',
    '30s thoracic rotation — seated or kneeling',
  ],
};

const cooldownLowerFocus: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions: '3–5 minutes. Hips and hamstrings need this.',
  description: [
    '60s easy walk or march on the spot',
    '45s hip flexor lunge stretch each side',
    '45s hamstring stretch each side — seated or standing',
    '30s glute stretch each side (figure-four or pigeon)',
    '30s calf stretch each side against a wall',
  ],
};

// ─── Programme ───────────────────────────────────────────────────────────────

export const hiit_shred_6wk_pro: Program = {
  id: 'hiit_shred_6wk_pro',
  isPro: false,
  name: 'HIIT Shred (6 Weeks)',
  description: `A 6-week dumbbell-based conditioning block that builds fitness, supports body composition, and introduces longer-form HIIT formats as the weeks progress. Starts structured and short. Gets harder and longer.`,
  bodyChangesSummary: `Expect better stamina, more athleticism, and a tighter feel through your legs, glutes, and core. By week five you will be handling workout formats most people avoid entirely.`,
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri', 'sun'],
  averageSessionDuration: '45m',
  workouts: [
    // =========================================================================
    // WEEKS 1–2 — Foundation
    // Shorter circuits. Establish movement quality and base fitness.
    // =========================================================================

    ...Array.from({ length: 2 }).flatMap((_, i) => {
      const week = i + 1;
      const intensity = 7;

      return [
        // ─── Shred A — Full body circuit, horizontal push focus ───────────────
        {
          dayIndex: i * 7 + 0,
          label: `Shred A (Week ${week})`,
          description:
            'Full body dumbbells. Horizontal push opener. Four rounds, move with intent.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredA,
            {
              id: 'main',
              type: 'rounds',
              title: 'Circuit — 4 Rounds',
              instructions:
                'Rest as needed between movements. Keep form honest.',
              rounds: 4,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 2, // DB Bench Press
                  prescription: '10–12 reps',
                  notes:
                    'Lower with control. Press with confidence. Shoulders down and back.',
                },
                {
                  id: 'm2',
                  exerciseId: 8, // Dumbbell Row
                  prescription: '10–12 reps/side',
                  notes:
                    'Pull to your hip. Pause at the top. Control the lower.',
                },
                {
                  id: 'm3',
                  exerciseId: 5, // DB Goblet Squat
                  prescription: '12–15 reps',
                  notes: 'Stay tall, brace your core, and drive up fast.',
                },
                {
                  id: 'm4',
                  exerciseId: 34, // Lateral Raises
                  prescription: '12–15 reps',
                  notes:
                    'Light weight, full arc. Lead with elbows, no shrugging.',
                },
              ],
            },
            {
              id: 'finisher',
              type: 'tabata',
              title: 'Tabata Finisher',
              instructions:
                '8 rounds. 20s work, 10s rest. Alternate movements each round.',
              rounds: 8,
              workSeconds: 20,
              restSeconds: 10,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 21, // Bodyweight Squats
                  prescription: '20s on / 10s off',
                  notes: 'Full range, consistent pace. Scale depth if needed.',
                },
                {
                  id: 'm2',
                  exerciseId: 3, // Push-ups
                  prescription: '20s on / 10s off',
                  notes: 'Knees down is fine. Keep your hips level.',
                },
              ],
            },
            cooldownStandard,
          ],
        },

        // ─── Shred B — Lower body EMOM ────────────────────────────────────────
        {
          dayIndex: i * 7 + 2,
          label: `Shred B (Week ${week})`,
          description:
            'Lower body and hamstring focus. EMOM format — work hard, rest smart.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredB,
            {
              id: 'main',
              type: 'emom',
              title: 'Lower EMOM — 12 Minutes',
              instructions:
                'Every minute: complete the reps, rest the remainder. Loads manageable, reps crisp.',
              minutes: 12,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 23, // DB Romanian Deadlift
                  prescription: '10–12 reps',
                  notes:
                    'Hinge back, keep dumbbells close, stand tall squeezing your glutes.',
                },
                {
                  id: 'm2',
                  exerciseId: 38, // Walking Lunges
                  prescription: '10 reps/side',
                  notes:
                    'Tall torso. Light touch of the back knee, then drive forward.',
                },
                {
                  id: 'm3',
                  exerciseId: 6, // Bulgarian Split Squat
                  prescription: '8–10 reps/side',
                  notes:
                    'Rear foot elevated. Drive through the front heel. Slow on the way down.',
                },
                {
                  id: 'm4',
                  exerciseId: 93, // Bodyweight Calf Raises
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
                'Complete in order. Short breaks are fine — keep moving.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 21, // Bodyweight Squats
                  prescription: '40 reps',
                  notes: 'Smooth reps. Full range you can control.',
                },
                {
                  id: 'm2',
                  exerciseId: 109, // Reverse Lunge
                  prescription: '20 reps/side',
                  notes: 'Light touch of the knee. Tall torso.',
                },
                {
                  id: 'm3',
                  exerciseId: 111, // Wall Sit
                  prescription: '60s',
                  notes: 'Breathe. Keep knees tracking over toes.',
                },
              ],
            },
            cooldownLowerFocus,
          ],
        },

        // ─── Shred C — Upper body AMRAP + core tabata ─────────────────────────
        {
          dayIndex: i * 7 + 4,
          label: `Shred C (Week ${week})`,
          description:
            'Upper body and core. Vertical push today. You should finish feeling worked, not wrecked.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredC,
            {
              id: 'main',
              type: 'amrap',
              title: 'Upper AMRAP — 12 Minutes',
              instructions: 'Set a steady pace. Accumulate quality rounds.',
              minutes: 12,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 73, // DB Push Press
                  prescription: '8–10 reps',
                  notes: 'Small dip, strong drive. Keep it smooth.',
                },
                {
                  id: 'm2',
                  exerciseId: 27, // DB Shoulder Press
                  prescription: '8–10 reps',
                  notes: 'Brace your core and avoid leaning back.',
                },
                {
                  id: 'm3',
                  exerciseId: 32, // DB Bicep Curls
                  prescription: '10–12 reps',
                  notes: 'No swinging. Slow and controlled.',
                },
                {
                  id: 'm4',
                  exerciseId: 56, // Reverse Flyes
                  prescription: '12–15 reps',
                  notes: 'Shoulders down. Squeeze shoulder blades at the top.',
                },
              ],
            },
            {
              id: 'core',
              type: 'tabata',
              title: 'Core Tabata',
              instructions:
                '8 rounds. 20s work, 10s rest. Keep control throughout.',
              rounds: 8,
              workSeconds: 20,
              restSeconds: 10,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 108, // Bicycle Crunch
                  prescription: '20s on / 10s off',
                  notes: 'Rotate from the ribs. Slow and controlled.',
                },
                {
                  id: 'm2',
                  exerciseId: 110, // Glute Bridge March
                  prescription: '20s on / 10s off',
                  notes: 'Hips stay level. Small steps, constant tension.',
                },
              ],
            },
            cooldownUpperFocus,
          ],
        },

        // ─── Shred D — Full body power day ────────────────────────────────────
        {
          dayIndex: i * 7 + 6,
          label: `Shred D (Week ${week})`,
          description:
            'Full body power day. Push and pull balanced. Short rests — keep it honest.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredD,
            {
              id: 'main',
              type: 'for_time',
              title: 'Push + Pull (For Time)',
              instructions:
                'Complete as fast as you can with good form. Rest only when needed.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 72, // DB Power Clean
                  prescription: '6–8 reps',
                  notes:
                    'Explosive pull, stand tall. Swap to goblet squat if technique breaks.',
                },
                {
                  id: 'm2',
                  exerciseId: 74, // DB Goblet Front Squat
                  prescription: '10–12 reps',
                  notes: 'Full range you can control. Breathe and keep moving.',
                },
                {
                  id: 'm3',
                  exerciseId: 10, // Pull-ups
                  prescription: '5–8 reps',
                  notes:
                    'Use an assisted machine or band if needed. Any pull-up rep counts.',
                },
                {
                  id: 'm4',
                  exerciseId: 3, // Push-ups
                  prescription: '10–15 reps',
                  notes: 'Hands elevated is a great option. Keep form honest.',
                },
              ],
            },
            {
              id: 'afterburn',
              type: 'emom',
              title: 'Afterburn EMOM — 8 Minutes',
              instructions:
                'Every minute: 30s work, 30s easy. Repeatable effort.',
              minutes: 8,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 102, // Squat Jumps
                  prescription: '30s',
                  notes: 'Land softly. Reset between reps if needed.',
                },
                {
                  id: 'm2',
                  exerciseId: 110, // Glute Bridge March
                  prescription: '30s',
                  notes: 'Active recovery. Keep hips level.',
                },
              ],
            },
            cooldownStandard,
          ],
        },
      ] satisfies WorkoutV2[];
    }),

    // =========================================================================
    // WEEKS 3–4 — Development
    // Longer formats introduced. Chipper and extended AMRAP make first appearance.
    // Kettlebell and dumbbell movements pulled into conditioning blocks.
    // =========================================================================

    ...Array.from({ length: 2 }).flatMap((_, i) => {
      const week = i + 3;
      const intensity = 8;

      return [
        // ─── Shred A — Circuit + ball slam finisher ───────────────────────────
        {
          dayIndex: (i + 2) * 7 + 0,
          label: `Shred A (Week ${week})`,
          description:
            'Full body dumbbells. Rounds go up this week — so does the expectation.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredA,
            {
              id: 'main',
              type: 'rounds',
              title: 'Circuit — 5 Rounds',
              instructions:
                'Keep rest short. If the load feels easy, go heavier.',
              rounds: 5,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 2, // DB Bench Press
                  prescription: '12–15 reps',
                  notes:
                    'Same movement, more reps. Push the pace on the press.',
                },
                {
                  id: 'm2',
                  exerciseId: 101, // DB Renegade Row
                  prescription: '8–10 reps/side',
                  notes:
                    'Hips level. No rotation. Pull to your hip, not your shoulder.',
                },
                {
                  id: 'm3',
                  exerciseId: 5, // DB Goblet Squat
                  prescription: '15 reps',
                  notes:
                    'Heavier than weeks 1–2 if you can. Drive out of the hole.',
                },
                {
                  id: 'm4',
                  exerciseId: 100, // DB Thruster
                  prescription: '8–10 reps',
                  notes:
                    'Squat and press in one movement. Keep the dumbells tight to your shoulders on the way down.',
                },
              ],
            },
            {
              id: 'finisher',
              type: 'for_time',
              title: 'Ball Slam Finisher (For Time)',
              instructions:
                'Complete all reps as fast as possible. Controlled aggression.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 107, // Ball Slams
                  prescription: '50 reps',
                  notes:
                    'Break into sets if needed. Do not lose the hinge pattern.',
                },
              ],
            },
            cooldownStandard,
          ],
        },

        // ─── Shred B — Lower body chipper ─────────────────────────────────────
        {
          dayIndex: (i + 2) * 7 + 2,
          label: `Shred B (Week ${week})`,
          description:
            'Lower body chipper. Work through the list once. Longer format — pace yourself from the start.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredB,
            {
              id: 'main',
              type: 'for_time',
              title: 'Lower Body Chipper (For Time)',
              instructions:
                'Complete all reps in order. One pass. Time yourself.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 105, // Box Jumps
                  prescription: '20 reps',
                  notes: 'Step down every rep. Land soft, reset, go again.',
                },
                {
                  id: 'm2',
                  exerciseId: 38, // Walking Lunges
                  prescription: '30 reps/side',
                  notes: 'Keep moving. Light dumbbells if available.',
                },
                {
                  id: 'm3',
                  exerciseId: 23, // DB Romanian Deadlift
                  prescription: '25 reps',
                  notes: 'Moderate weight. Hinge back, squeeze up.',
                },
                {
                  id: 'm4',
                  exerciseId: 102, // Squat Jumps
                  prescription: '20 reps',
                  notes: 'Land softly every time. Depth over speed.',
                },
                {
                  id: 'm5',
                  exerciseId: 6, // Bulgarian Split Squat
                  prescription: '15 reps/side',
                  notes: 'Slow and controlled. This is where you earn it.',
                },
                {
                  id: 'm6',
                  exerciseId: 111, // Wall Sit
                  prescription: '60s',
                  notes: 'Last thing. Breathe through it.',
                },
              ],
            },
            cooldownLowerFocus,
          ],
        },

        // ─── Shred C — Upper body + kettlebell core ───────────────────────────
        {
          dayIndex: (i + 2) * 7 + 4,
          label: `Shred C (Week ${week})`,
          description:
            'Upper body AMRAP gets longer. Kettlebell core work introduced.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredC,
            {
              id: 'main',
              type: 'amrap',
              title: 'Upper AMRAP — 15 Minutes',
              instructions: 'Three extra minutes this week. Pace accordingly.',
              minutes: 15,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 73, // DB Push Press
                  prescription: '10–12 reps',
                  notes: 'More reps this week. Keep the dip-drive tight.',
                },
                {
                  id: 'm2',
                  exerciseId: 8, // Dumbbell Row
                  prescription: '10–12 reps/side',
                  notes: 'Pull to the hip. Pause. Control down.',
                },
                {
                  id: 'm3',
                  exerciseId: 51, // Hammer Curls
                  prescription: '12 reps',
                  notes: 'Neutral grip. No swinging.',
                },
                {
                  id: 'm4',
                  exerciseId: 56, // Reverse Flyes
                  prescription: '15 reps',
                  notes: 'Light and controlled. Squeeze at the top.',
                },
              ],
            },
            {
              id: 'core',
              type: 'rounds',
              title: 'Kettlebell Core Circuit — 3 Rounds',
              instructions: 'Quality over speed. Rest 45s between rounds.',
              rounds: 3,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 99, // KB Halo
                  prescription: '5 reps each direction',
                  notes:
                    'Slow circles. Keep your core locked and avoid arching your back.',
                },
                {
                  id: 'm2',
                  exerciseId: 49, // Russian Twists
                  prescription: '20 reps',
                  notes:
                    'Use a light dumbbell or kettlebell. Rotate from the ribs.',
                },
                {
                  id: 'm3',
                  exerciseId: 13, // Plank
                  prescription: '30s',
                  notes: 'Ribs down. Breathe.',
                },
              ],
            },
            cooldownUpperFocus,
          ],
        },

        // ─── Shred D — Wall balls + full body conditioning ────────────────────
        {
          dayIndex: (i + 2) * 7 + 6,
          label: `Shred D (Week ${week})`,
          description:
            'Wall balls make their first appearance. Full body conditioning. Longer than Shred D was in weeks 1–2.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredD,
            {
              id: 'main',
              type: 'for_time',
              title: 'Full Body For Time',
              instructions:
                'Complete all reps as fast as possible with good form.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 106, // Wall Balls
                  prescription: '30 reps',
                  notes:
                    'Squat to depth every rep. Drive the ball to target height.',
                },
                {
                  id: 'm2',
                  exerciseId: 72, // DB Power Clean
                  prescription: '10 reps',
                  notes: 'Explosive. Land tall.',
                },
                {
                  id: 'm3',
                  exerciseId: 103, // Burpees
                  prescription: '15 reps',
                  notes: 'Steady pace. Do not sprint then crash.',
                },
                {
                  id: 'm4',
                  exerciseId: 106, // Wall Balls
                  prescription: '20 reps',
                  notes:
                    'Second set. Smaller if you need it. Keep the squat honest.',
                },
                {
                  id: 'm5',
                  exerciseId: 10, // Pull-ups
                  prescription: '10 reps',
                  notes: 'Band or machine assist is fine. Pull hard.',
                },
                {
                  id: 'm6',
                  exerciseId: 107, // Ball Slams
                  prescription: '20 reps',
                  notes: 'Finish strong. Full extension on every rep.',
                },
              ],
            },
            {
              id: 'afterburn',
              type: 'tabata',
              title: 'Tabata Afterburn',
              instructions: '8 rounds. 20s work, 10s rest.',
              rounds: 8,
              workSeconds: 20,
              restSeconds: 10,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 102, // Squat Jumps
                  prescription: '20s on / 10s off',
                  notes: 'Land softly. Full squat every rep.',
                },
                {
                  id: 'm2',
                  exerciseId: 3, // Push-ups
                  prescription: '20s on / 10s off',
                  notes: 'Keep hips level. Scale to knees if needed.',
                },
              ],
            },
            cooldownStandard,
          ],
        },
      ] satisfies WorkoutV2[];
    }),

    // =========================================================================
    // WEEKS 5–6 — Peak
    // Longest formats of the programme. Hyrox-style conditioning introduced.
    // Chippers extend. AMRAPs run longer. Expect sessions to push 50–55 minutes.
    // =========================================================================

    ...Array.from({ length: 2 }).flatMap((_, i) => {
      const week = i + 5;
      const intensity = 9;

      return [
        // ─── Shred A — Extended circuit + burpee broad jump finisher ─────────
        {
          dayIndex: (i + 4) * 7 + 0,
          label: `Shred A (Week ${week})`,
          description:
            'Six rounds now. Finisher uses burpee broad jumps — longest Shred A of the programme.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredA,
            {
              id: 'main',
              type: 'rounds',
              title: 'Circuit — 6 Rounds',
              instructions:
                'Two extra rounds on what you built in week one. You are ready for this.',
              rounds: 6,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 2, // DB Bench Press
                  prescription: '12–15 reps',
                  notes: 'Heavier than week 3 if you can. Press with purpose.',
                },
                {
                  id: 'm2',
                  exerciseId: 101, // DB Renegade Row
                  prescription: '10 reps/side',
                  notes: 'Slow and locked. No hip rotation.',
                },
                {
                  id: 'm3',
                  exerciseId: 100, // DB Thruster
                  prescription: '10–12 reps',
                  notes: 'Drive hard out of the squat. Punch the press.',
                },
                {
                  id: 'm4',
                  exerciseId: 92, // DB Farmer Carry
                  prescription: '30s',
                  notes:
                    'Heavy as possible. Tall posture. Do not let your shoulders drop.',
                },
              ],
            },
            {
              id: 'finisher',
              type: 'for_time',
              title: 'Burpee Broad Jump Finisher (For Time)',
              instructions:
                'Cover as much distance as possible. Power and pace.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 104, // Burpee Broad Jumps
                  prescription: '20 reps',
                  notes: 'Drive forward off both feet. Land soft, reset fast.',
                },
              ],
            },
            cooldownStandard,
          ],
        },

        // ─── Shred B — Hyrox-style lower body chipper ─────────────────────────
        {
          dayIndex: (i + 4) * 7 + 2,
          label: `Shred B (Week ${week})`,
          description:
            'Hyrox-style session. Longer format, higher volume. This is the hardest lower session of the programme. Pace it from rep one.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredB,
            {
              id: 'main',
              type: 'for_time',
              title: 'Hyrox-Style Chipper (For Time)',
              instructions:
                'Complete all reps in order. One pass. Time yourself — aim to beat it next week.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 106, // Wall Balls
                  prescription: '50 reps',
                  notes:
                    'Set your target and hold it. Break into sets of 10–15 if needed.',
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
                  notes: 'Moderate weight. Hinge clean, squeeze up.',
                },
                {
                  id: 'm4',
                  exerciseId: 38, // Walking Lunges
                  prescription: '40 reps/side',
                  notes: 'Keep moving. Light dumbbells if available.',
                },
                {
                  id: 'm5',
                  exerciseId: 107, // Ball Slams
                  prescription: '30 reps',
                  notes: 'Full extension overhead before each slam.',
                },
                {
                  id: 'm6',
                  exerciseId: 102, // Squat Jumps
                  prescription: '20 reps',
                  notes:
                    'Last movement. You have earned the right to empty the tank.',
                },
              ],
            },
            cooldownLowerFocus,
          ],
        },

        // ─── Shred C — Long upper AMRAP + kettlebell complex ─────────────────
        {
          dayIndex: (i + 4) * 7 + 4,
          label: `Shred C (Week ${week})`,
          description:
            'Twenty-minute AMRAP. Kettlebell complex added. Upper body and core peak week.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredC,
            {
              id: 'main',
              type: 'amrap',
              title: 'Upper AMRAP — 20 Minutes',
              instructions:
                'Longest AMRAP of the programme. Find a pace you can sustain. Log your rounds.',
              minutes: 20,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 73, // DB Push Press
                  prescription: '10 reps',
                  notes: 'Tight dip, full extension. Every rep the same.',
                },
                {
                  id: 'm2',
                  exerciseId: 9, // Inverted Row
                  prescription: '10 reps',
                  notes: 'Chest to bar. Squeeze at the top.',
                },
                {
                  id: 'm3',
                  exerciseId: 97, // KB Press (Single Arm)
                  prescription: '6 reps/side',
                  notes: 'Brace hard. Avoid leaning. Press tall.',
                },
                {
                  id: 'm4',
                  exerciseId: 95, // KB Turkish Get-Up
                  prescription: '2 reps/side',
                  notes: 'Slow and deliberate. Do not rush the transitions.',
                },
              ],
            },
            {
              id: 'core',
              type: 'rounds',
              title: 'Core Finisher — 3 Rounds',
              instructions: 'Quality over speed. 30s rest between rounds.',
              rounds: 3,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 15, // Ab Wheel Rollout
                  prescription: '8–10 reps',
                  notes: 'Slow out, pull back hard. Do not let your hips sag.',
                },
                {
                  id: 'm2',
                  exerciseId: 31, // Hanging Leg Raise
                  prescription: '10–12 reps',
                  notes: 'Control the lower. No swinging.',
                },
                {
                  id: 'm3',
                  exerciseId: 13, // Plank
                  prescription: '45s',
                  notes: 'Ribs down. Squeeze everything.',
                },
              ],
            },
            cooldownUpperFocus,
          ],
        },

        // ─── Shred D — Peak conditioning day ─────────────────────────────────
        {
          dayIndex: (i + 4) * 7 + 6,
          label: `Shred D (Week ${week})`,
          description:
            'The hardest session of the programme. Full body, high volume, no shortcuts. Everything you have built over six weeks gets used here.',
          intensity,
          format: 'v2',
          blocks: [
            warmupShredD,
            {
              id: 'main',
              type: 'for_time',
              title: 'Peak Conditioning Chipper (For Time)',
              instructions:
                'Complete in order. This is long. Pace from the start — do not blow up on wall balls.',
              movements: [
                {
                  id: 'm1',
                  exerciseId: 106, // Wall Balls
                  prescription: '40 reps',
                  notes: 'Set your pace early. Break in sets of 10–15.',
                },
                {
                  id: 'm2',
                  exerciseId: 103, // Burpees
                  prescription: '20 reps',
                  notes: 'Steady effort. This is the middle, not the end.',
                },
                {
                  id: 'm3',
                  exerciseId: 72, // DB Power Clean
                  prescription: '15 reps',
                  notes:
                    'Explosive and tall. Swap to goblet squat if technique breaks.',
                },
                {
                  id: 'm4',
                  exerciseId: 107, // Ball Slams
                  prescription: '30 reps',
                  notes: 'Full extension overhead. Drive it into the floor.',
                },
                {
                  id: 'm5',
                  exerciseId: 104, // Burpee Broad Jumps
                  prescription: '15 reps',
                  notes: 'Drive forward. Land soft. Keep moving.',
                },
                {
                  id: 'm6',
                  exerciseId: 10, // Pull-ups
                  prescription: '15 reps',
                  notes: 'Break as needed. Every rep counts.',
                },
                {
                  id: 'm7',
                  exerciseId: 92, // DB Farmer Carry
                  prescription: '60s',
                  notes:
                    'Heavy. Posture tall. Walk steady. This is the finish line.',
                },
              ],
            },
            {
              id: 'afterburn',
              type: 'tabata',
              title: 'Final Tabata',
              instructions: '8 rounds. Leave nothing behind.',
              rounds: 8,
              workSeconds: 20,
              restSeconds: 10,
              movements: [
                {
                  id: 'm1',
                  exerciseId: 102, // Squat Jumps
                  prescription: '20s on / 10s off',
                  notes: 'Everything you have. Land soft.',
                },
                {
                  id: 'm2',
                  exerciseId: 3, // Push-ups
                  prescription: '20s on / 10s off',
                  notes: 'Hold form. Last thing you do. Make it count.',
                },
              ],
            },
            cooldownStandard,
          ],
        },
      ] satisfies WorkoutV2[];
    }),
  ],
};
