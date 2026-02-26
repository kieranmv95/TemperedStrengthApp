import type { Program, Warmup } from '@/src/types/program';

export const squat_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (bike or rower preferred) to raise heart rate and body temperature.',
    '30s pigeon pose each side / 30s deep squat hold with prying / 30s cat-cow',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 hip circles each direction',
    '10 bodyweight squats with controlled tempo',
    '10 glute bridges with 2s pause at the top',
  ],
};

export const bench_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (rower or ski erg preferred) to raise your heart rate.',
    '30s banded or doorway pec stretch / 30s lat stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '10 banded face pulls',
    '10 scapular push-ups',
    '10 empty-bar bench presses focusing on bar path and shoulder stability',
  ],
};

export const deadlift_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (rower or bike preferred) to raise your heart rate.',
    '30s hamstring stretch / 30s hip flexor stretch each side',
    '10 hip circles each direction',
    '10 glute bridges with 2s squeeze at the top',
    '10 bodyweight good mornings',
    '10 bird dogs (controlled, alternating sides)',
    '5–10 empty-bar Romanian deadlifts focusing on hinge mechanics',
  ],
};

export const powerlifting_3day: Program = {
  id: 'power_01',
  isPro: false,
  name: 'Traditional Powerlifting (SBD)',
  description:
    '8-Week Peaking Program. Volume drops as intensity climbs to a Week 8 testing session.',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60 min',
  workouts: Array.from({ length: 8 }).flatMap((_, week) => {
    const isTestingWeek = week === 7;
    const mainReps: [number, number] =
      week < 3 ? [8, 8] : week < 6 ? [5, 5] : [2, 3];
    const baseIntensity = week < 3 ? 7 : week < 6 ? 8 : 9;

    // Accessory rep ranges taper in line with the program's peaking arc.
    // High volume accessories in peak/testing week add unnecessary fatigue.
    const accessoryReps: [number, number] =
      week < 3 ? [8, 10] : week < 6 ? [6, 8] : [5, 6];

    return [
      // ─────────────────────────────────────────────
      // DAY 1 — Squat Focus (Monday)
      // FIX 1: Plank now has hideReps: true — logging_type is 'time',
      //         rendering [45, 60] as reps was incorrect.
      // FIX 2: RDL rep range now uses accessoryReps so it tapers with
      //         the program. High-rep RDLs in peak/test week are
      //         unnecessary posterior chain fatigue before a 1RM.
      // FIX 3: Testing week sets reduced to 1 — on a 1RM day the user
      //         builds up with warm-up sets then attempts a max.
      //         Prescribing 5 working sets is incorrect for this context.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: isTestingWeek
          ? 'TESTING DAY — 1RM Squat'
          : `Squat Focus — Week ${week + 1}`,
        description: isTestingWeek
          ? 'TESTING DAY: New 1RM Squat'
          : 'High intensity squatting and quad accessories.',
        intensity: isTestingWeek ? 10 : Math.min(baseIntensity + 1, 10),
        exercises: [
          squat_warmup,
          {
            type: 'exercise',
            id: 4, // Barbell Back Squat
            sets: isTestingWeek ? 1 : week < 4 ? 4 : 5, // FIX: 1 set on test day
            repRange: mainReps,
            restTimeSeconds: isTestingWeek ? 180 : 150,
            hideReps: isTestingWeek,
            additionalHeader: isTestingWeek ? '1RM Test' : 'Competition Squat',
            additionalDescription: isTestingWeek
              ? 'The culmination of 8 weeks. Take 4–6 progressively heavier warm-up sets, then attempt your new max. Big breath, tight back, drive the hips through the top.'
              : "Focus on 'rooting' your feet into the floor. Create maximum intra-abdominal pressure. Descent should be controlled, ascent should be explosive.",
          },
          {
            type: 'exercise',
            id: 22, // Romanian Deadlift
            sets: 3,
            repRange: accessoryReps, // FIX: was hardcoded [8, 10] every week
            restTimeSeconds: 90,
            additionalDescription:
              'RDLs are here to protect your back. Keep the bar glued to your thighs and stop at mid-shin. You should feel a massive stretch in the hamstrings.',
          },
          {
            type: 'exercise',
            id: 19, // Leg Press
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Pure quad hypertrophy to support your squat out of the hole. Keep your feet low on the platform to emphasize the knees.',
          },
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            hideReps: true, // FIX: logging_type is 'time' — display as seconds
            restTimeSeconds: 60,
            additionalDescription:
              "Bracing practice. Do not just 'hold' the plank; actively pull your elbows toward your toes to engage the deep core.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 — Bench Focus (Wednesday)
      // FIX: Skull Crushers replaced with Face Pulls (id: 35).
      //
      // A powerlifting bench day already has: Bench Press + OHP + Seated
      // Cable Row. That is heavy pressing across every set. 8 weeks of
      // this with zero direct rear delt / external rotation work is the
      // #1 cause of shoulder impingement in competitive benchers.
      //
      // Face Pulls address the rotator cuff and rear delts directly,
      // counterbalancing the pressing volume. Tricep lockout strength
      // is already well-served by the volume on the comp bench sets —
      // an isolated skull crusher adds marginal lockout gains compared
      // to the shoulder injury risk it compounds.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: isTestingWeek
          ? 'TESTING DAY — 1RM Bench'
          : `Bench Focus — Week ${week + 1}`,
        description: isTestingWeek
          ? 'TESTING DAY: New 1RM Bench'
          : 'Competition bench form and shoulder stability.',
        intensity: isTestingWeek ? 10 : baseIntensity,
        exercises: [
          bench_warmup,
          {
            type: 'exercise',
            id: 1, // Barbell Bench Press
            sets: isTestingWeek ? 1 : week < 4 ? 4 : 5, // FIX: 1 set on test day
            repRange: mainReps,
            restTimeSeconds: isTestingWeek ? 180 : 150,
            hideReps: isTestingWeek,
            additionalHeader: isTestingWeek ? '1RM Test' : 'Comp Bench',
            additionalDescription: isTestingWeek
              ? 'Find your max. Take 4–6 warm-up sets, then go for it. Keep your heels driven into the floor (leg drive) and maintain your arch throughout the press.'
              : "Pull your shoulder blades together and down. Touch the bar to your lower chest/upper stomach. Drive the bar 'back' toward your face.",
          },
          {
            type: 'exercise',
            id: 26, // Barbell Overhead Press
            sets: 3,
            repRange: [6, 8],
            restTimeSeconds: 120,
            additionalDescription:
              'Overhead strength directly correlates to a stable bench press. Keep your ribs tucked; do not let your back arch excessively.',
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "A bigger back provides a bigger 'shelf' to bench press from. Squeeze the handle to your sternum.",
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls — REPLACED Skull Crushers
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalDescription:
              'Non-negotiable for shoulder longevity in any heavy bench program. Pull the rope to your forehead with elbows flared high. This protects the rotator cuff and counterbalances weeks of pressing load.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 — Deadlift Focus (Friday)
      // FIX 1: Cable Crunches (id: 48) replaced with Hanging Leg Raise
      //         (id: 31). After Comp Deadlifts + Bulgarian Split Squats +
      //         Pull-ups, the lumbar spine is at maximum weekly fatigue.
      //         Cable Crunches add compressive spinal flexion load on top
      //         of that. Hanging Leg Raises train the same abs through hip
      //         flexion with zero additional lower back stress, and
      //         actually decompress the spine when done hanging.
      // FIX 2: Pull-ups canSwap: true added — not all users can perform
      //         bodyweight pull-ups. Assisted Pull-up Machine (id: 84)
      //         or Lat Pulldown (id: 11) are natural swaps.
      // FIX 3: Testing week sets: 1 on the main deadlift.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: isTestingWeek
          ? 'TESTING DAY — 1RM Deadlift'
          : `Deadlift Focus — Week ${week + 1}`,
        description: isTestingWeek
          ? 'TESTING DAY: New 1RM Deadlift'
          : 'Max effort pulling and posterior chain work.',
        intensity: isTestingWeek ? 10 : Math.min(baseIntensity + 1, 10),
        exercises: [
          deadlift_warmup,
          {
            type: 'exercise',
            id: 14, // Barbell Deadlift
            sets: isTestingWeek ? 1 : 3, // FIX: 1 set on test day
            repRange: mainReps,
            restTimeSeconds: isTestingWeek ? 180 : 150,
            hideReps: isTestingWeek,
            additionalHeader: isTestingWeek ? '1RM Test' : 'Comp Deadlift',
            additionalDescription: isTestingWeek
              ? "The final lift. Take 4–6 warm-up sets, then grip it and rip it. Keep the spine neutral and don't let the hips rise faster than the chest."
              : "Slack out, chest up. Pull the bar into your shins and think about 'pushing the floor away' rather than 'pulling the bar up'.",
          },
          {
            type: 'exercise',
            id: 6, // Bulgarian Split Squat
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              "Unilateral leg strength to prevent 'shooting' one hip up during a heavy deadlift. Stay upright.",
          },
          {
            type: 'exercise',
            id: 10, // Pull-ups
            sets: 3,
            repRange: [6, 10], // FIX: tightened from [8, 12] — cleaner target range
            restTimeSeconds: 120,
            canSwap: true, // FIX: not all users can do bodyweight pull-ups
            additionalDescription:
              'Lat strength is vital to keeping the bar close to your body during a heavy pull. Do not swing. If bodyweight pull-ups are not yet achievable, swap to the Assisted Pull-up Machine or Lat Pulldown.',
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise — REPLACED Cable Crunches
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalDescription:
              'After heavy deadlifts and hinge work, spinal flexion under load is the last thing your lower back needs. Hanging Leg Raises build the same anterior core strength through hip flexion, with zero additional lumbar stress — and the hang itself decompresses the spine.',
          },
        ],
      },
    ];
  }),
};
