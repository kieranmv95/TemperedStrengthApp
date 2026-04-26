import type { Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice, run/row/bike to raise your heart rate.',
    '2 minutes of wrist stretches, ankle circles, and shoulder mobility exercises.',
    '3 sets of 5 Empty bar cleans / 5 front rack squat / 5 overhead squats',
  ],
};

export const olympic_advanced_8wk: Program = {
  isPro: true,
  id: 'oly_adv_01',
  name: 'Advanced Olympic Performance',
  description:
    '8-Week peak. Phase 1: Volume & Positional Strength. Phase 2: Speed & Maximal Singles.',
  categories: ['olympic'],
  goals: ['stronger', 'athletic', 'mobility'],
  difficulty: 'advanced',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 8 }).flatMap((_, week) => {
    const isPhase2 = week >= 4;
    const intensity = isPhase2
      ? 8 + Math.floor((week - 4) / 2)
      : 7 + Math.floor(week / 2);

    return [
      // ─────────────────────────────────────────────
      // DAY 1 - Snatch & Pull (Monday)
      // FIX 1: Overhead Squat moved before Snatch work. OHS is a positional
      //         primer - it must come before the full movement is loaded with
      //         speed, not after it. Original order (Snatch → High Pull → OHS)
      //         was pedagogically backwards.
      // FIX 2: additionalHeader for Phase 1 corrected from "Complex: Hang + Full"
      //         to "Hang Snatch." The exercise is id: 59 (Hang Snatch only) -
      //         the header implied a two-movement complex that wasn't programmed.
      //         The description already explains the hang-to-full-rep intent clearly.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Day 1: Snatch & Pull (Week ${week + 1})`,
        description: isPhase2
          ? 'Heavy Singles & Speed'
          : 'Snatch Complexes & Technical Volume',
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 61, // Overhead Squat - MOVED to first position
            sets: 3,
            repRange: [5, 5],
            restTimeSeconds: 120,
            additionalHeader: 'Positional Primer',
            additionalDescription:
              "Opens every session by grooving the catch. Focus on 'stretching' the bar apart to engage the lats and keep the torso vertical. Build confidence in the bottom position before loading it with speed.",
          },
          {
            type: 'exercise',
            id: isPhase2 ? 57 : 59, // Full Snatch (Phase 2) / Hang Snatch (Phase 1)
            sets: isPhase2 ? 5 : 4,
            repRange: isPhase2 ? [1, 2] : [3, 3],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalHeader: isPhase2 ? 'Full Snatch' : 'Hang Snatch', // FIX: was "Complex: Hang + Full" which mislabelled the exercise
            additionalDescription: isPhase2
              ? "The goal is maximal speed under the bar. Focus on 'punching' the bar overhead and meeting it in a rock-solid bottom position."
              : "Use the hang position to find your 'power pocket.' Keep the bar tight to the hips. Focus on a vertical bar path - do not let it drift forward on the way up.",
          },
          {
            type: 'exercise',
            id: 62, // Snatch High Pull
            sets: 4,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalDescription:
              "Overload the pull. We want to build the 'traps-to-ears' finish. Keep your elbows high and outside; do not let the bar swing out.",
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Prehab for the rotator cuff. Pull the rope toward your forehead and emphasise the external rotation at the end of the movement.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 - Clean, Jerk & Front Squat (Wednesday)
      // FIX: Sit-ups added as core finisher. Day 2 previously had
      //      no direct core work - the session ended on Lat Pulldown.
      //      The front rack and overhead demands of the C&J require strong
      //      trunk control and bracing under load. Sit-ups are a simple,
      //      repeatable way to build direct ab volume without extra equipment.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Day 2: Clean, Jerk & Front Squat (Week ${week + 1})`,
        description: 'Focus on leg drive and maximal front rack recovery.',
        intensity: Math.min(intensity + 1, 10),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 63, // Clean & Jerk
            sets: 4,
            repRange: isPhase2 ? [1, 1] : [2, 2],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription: isPhase2
              ? "Clean & Jerk singles. Focus on a sharp, aggressive 'drive' in the jerk. Ensure the back knee is bent and weight is balanced between feet."
              : "Focus on the 're-rack.' Keep the elbows up high in the catch of the clean so the bar doesn't slide forward during the transition to the jerk.",
          },
          {
            type: 'exercise',
            id: 68, // Front Squat
            sets: 5,
            repRange: isPhase2 ? [2, 3] : [5, 5],
            restTimeSeconds: 150,
            additionalDescription:
              "This is your primary strength builder. No 'soft' catches - treat every rep like you are recovering from a heavy clean.",
          },
          {
            type: 'exercise',
            id: 69, // Clean High Pull
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalDescription:
              "Builds the explosive 'finish' of the clean. Ensure the hips reach full extension before the arms start pulling.",
          },
          {
            type: 'exercise',
            id: 11, // Lat Pulldown
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Lats are the 'brakes' of the snatch and clean. Use a slow eccentric to build pulling control.",
          },
          {
            type: 'exercise',
            id: 86, // Sit-ups - ADDED for core work
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 60,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              'Controlled reps. Exhale as you sit up, keep the chin tucked (don’t pull on the neck), and aim to feel the abs initiate the movement rather than yanking with the hip flexors.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 - The Total & Structural Balance (Friday)
      // FIX 1: Intensity bumped to intensity + 2 (capped at 10). Day 3 is
      //         billed as "The Total" - competition simulation, the hardest
      //         day of the week. Days 2 and 3 were both intensity + 1 which
      //         made them indistinguishable. Day 3 must peak higher.
      // FIX 2: C&J repRange Phase 1 fixed from [1, 1] to [2, 2]. The Phase 1
      //         vs Phase 2 ternary was [1,1] in both branches - identical.
      //         Phase 1 is the volume phase and should reflect that with
      //         [2, 2] to match the Day 2 Phase 1 rep scheme.
      // FIX 3: RDL description corrected. "Develops glute drive for the
      //         second pull" was inaccurate - the second pull is an explosive
      //         hip extension pattern, not what an RDL trains at [10, 12].
      //         The RDL's actual benefit here is eccentric hamstring strength
      //         and posterior chain resilience for the first pull off the floor.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Day 3: The Total & Structural Balance (Week ${week + 1})`,
        description:
          'Maximal effort competition lifts followed by unilateral accessories.',
        intensity: Math.min(intensity + 2, 10), // FIX: was intensity + 1, same as Day 2
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 57, // Full Snatch
            sets: 5,
            repRange: isPhase2 ? [1, 1] : [2, 2],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription:
              'Competition mindset. Clear the mind, find your start position, and execute. Look for consistency in foot landing.',
          },
          {
            type: 'exercise',
            id: 63, // Clean & Jerk
            sets: 5,
            repRange: isPhase2 ? [1, 1] : [2, 2], // FIX: Phase 1 was [1,1] same as Phase 2 - corrected to [2, 2]
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription:
              'Drive through the heels on the clean. In the jerk, focus on a vertical drive - do not let the chest dip forward.',
          },
          {
            type: 'exercise',
            id: 6, // Bulgarian Split Squat
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              "Fixes side-to-side imbalances. This prevents 'helicoptering' (rotating) during heavy cleans or snatches.",
          },
          {
            type: 'exercise',
            id: 22, // Romanian Deadlift
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'Builds eccentric hamstring strength and posterior chain resilience. Strong hamstrings maintain a neutral spine and consistent bar position during the first pull off the floor - the foundation everything else is built on.', // FIX: was "glute drive for the second pull" which is inaccurate
          },
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              'Anti-extension core strength. This protects the lower back when catching heavy weights overhead.',
          },
        ],
      },
    ];
  }),
};
