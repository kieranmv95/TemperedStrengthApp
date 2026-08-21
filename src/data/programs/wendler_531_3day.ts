import type {
  ExerciseSetPrescription,
  Program,
  Warmup,
} from '@/src/types/program';

// Primary lifts (also the training maxes the lifter enters at program start).
const SQUAT_ID = 4; // Barbell Back Squat
const PRESS_ID = 26; // Barbell Overhead Press (Strict Press)
const DEADLIFT_ID = 14; // Barbell Deadlift

// Cycle-over-cycle training-max increases (pounds), applied per Wendler 5/3/1.
const SQUAT_INCREMENT_LB = 10;
const DEADLIFT_INCREMENT_LB = 10;
const PRESS_INCREMENT_LB = 5;

export const squat_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (bike or rower preferred) to raise your heart rate.',
    '30s deep squat hold with prying / 30s pigeon pose each side',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 hip circles each direction',
    '10 bodyweight squats with controlled tempo',
    '10 glute bridges with a 2s pause at the top',
    'Ramp to your first work set with 2-3 lighter warm-up sets on the bar.',
  ],
};

export const press_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (rower or ski erg preferred) to raise your heart rate.',
    '30s banded or doorway pec stretch / 30s lat stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '10 banded face pulls',
    '10 scapular push-ups',
    'Ramp to your first work set with 2-3 lighter warm-up sets on the bar.',
  ],
};

export const deadlift_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (rower or bike preferred) to raise your heart rate.',
    '30s hamstring stretch / 30s hip flexor stretch each side',
    '10 hip circles each direction',
    '10 glute bridges with a 2s squeeze at the top',
    '10 bodyweight good mornings',
    '10 bird dogs (controlled, alternating sides)',
    'Ramp to your first work set with 2-3 lighter warm-up sets from the floor.',
  ],
};

// The three working sets for a given week within a 4-week 5/3/1 cycle.
// weekInCycle: 0 = 5s, 1 = 3s, 2 = 5/3/1, 3 = deload.
const mainSetScheme = (weekInCycle: number): ExerciseSetPrescription[] => {
  switch (weekInCycle) {
    case 0:
      return [
        { percentOfTrainingMax: 65, reps: 5 },
        { percentOfTrainingMax: 75, reps: 5 },
        { percentOfTrainingMax: 85, reps: 5, isAmrap: true },
      ];
    case 1:
      return [
        { percentOfTrainingMax: 70, reps: 3 },
        { percentOfTrainingMax: 80, reps: 3 },
        { percentOfTrainingMax: 90, reps: 3, isAmrap: true },
      ];
    case 2:
      return [
        { percentOfTrainingMax: 75, reps: 5 },
        { percentOfTrainingMax: 85, reps: 3 },
        { percentOfTrainingMax: 95, reps: 1, isAmrap: true },
      ];
    default:
      return [
        { percentOfTrainingMax: 40, reps: 5 },
        { percentOfTrainingMax: 50, reps: 5 },
        { percentOfTrainingMax: 60, reps: 5 },
      ];
  }
};

const mainLiftDescription = (weekInCycle: number): string => {
  switch (weekInCycle) {
    case 0:
      return 'Week 1 (5s). Sets are 65% × 5, 75% × 5, 85% × 5+. Target weights are pre-filled from your training max. The final set is AMRAP, so push for as many crisp reps as you can and try to beat last cycle.';
    case 1:
      return 'Week 2 (3s). Sets are 70% × 3, 80% × 3, 90% × 3+. The final set is AMRAP. Stop when bar speed drops or form breaks, and never grind ugly reps.';
    case 2:
      return 'Week 3 (5/3/1). Sets are 75% × 5, 85% × 3, 95% × 1+. The final single is your heaviest of the cycle and is AMRAP. This is where you set rep PRs.';
    default:
      return 'Deload. Sets are 40% × 5, 50% × 5, 60% × 5. Keep every rep fast and easy, with no AMRAP. This week is recovery so you come back stronger next cycle.';
  }
};

const mainLiftHeader = (cycle: number, weekInCycle: number): string => {
  const label =
    weekInCycle === 0
      ? '5s'
      : weekInCycle === 1
        ? '3s'
        : weekInCycle === 2
          ? '5/3/1'
          : 'Deload';
  return `Main Lift · Cycle ${cycle + 1} · ${label}`;
};

const dayLabel = (lift: string, cycle: number, weekInCycle: number): string => {
  if (weekInCycle === 3) {
    return `${lift} - Deload (Cycle ${cycle + 1})`;
  }
  return `${lift} - Cycle ${cycle + 1} Week ${weekInCycle + 1}`;
};

export const wendler_531_3day: Program = {
  id: 'wendler_531_3day',
  isPro: true,
  name: 'Wendler 5/3/1 (3-Day)',
  description:
    '16-Week strength block over four 5/3/1 cycles. Three primary lifts, Back Squat, Strict Press, Deadlift, with your training max climbing every cycle.',
  bodyChangesSummary:
    'You will get measurably stronger on the squat, strict press, and deadlift. Four cycles of 5/3/1 progression - with your training max rising each cycle and AMRAP top sets driving rep PRs - build durable strength, while the assistance work adds size to your legs, chest, shoulders, and back.',
  categories: ['strength', 'powerlifting'],
  videoId: 'fG_B2h5WrQ8',
  goals: ['stronger', 'hypertrophy'],
  difficulty: 'advanced',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60m',
  requireRmId: [SQUAT_ID, PRESS_ID, DEADLIFT_ID],
  workouts: Array.from({ length: 16 }).flatMap((_, week) => {
    const cycle = Math.floor(week / 4);
    const weekInCycle = week % 4;
    const isDeload = weekInCycle === 3;
    const scheme = mainSetScheme(weekInCycle);
    const baseIntensity = [7, 8, 9, 4][weekInCycle];
    const heavyIntensity = isDeload ? 4 : Math.min(baseIntensity + 1, 10);
    const accessorySets = isDeload ? 2 : 3;
    const mainRest = isDeload ? 120 : 180;

    return [
      // ─────────────────────────────────────────────
      // DAY 1 - Squat (Monday) + leg assistance
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: dayLabel('Back Squat', cycle, weekInCycle),
        description:
          'Primary lift: Back Squat. Assistance: quads, hamstrings, and core.',
        intensity: heavyIntensity,
        exercises: [
          squat_warmup,
          {
            type: 'exercise',
            id: SQUAT_ID,
            sets: scheme.length,
            repRange: [scheme[0].reps, scheme[0].reps],
            setScheme: scheme,
            trainingMaxIncrementLb: cycle * SQUAT_INCREMENT_LB,
            restTimeSeconds: mainRest,
            canSwap: false,
            additionalHeader: mainLiftHeader(cycle, weekInCycle),
            additionalDescription: mainLiftDescription(weekInCycle),
          },
          {
            type: 'exercise',
            id: 19, // Leg Press
            sets: accessorySets,
            repRange: [10, 15],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Quad-focused volume to support your squat out of the hole. Control the descent and keep your lower back flat against the pad.',
          },
          {
            type: 'exercise',
            id: 40, // Leg Curl
            sets: accessorySets,
            repRange: [10, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Direct hamstring work to balance all the quad-dominant pressing. Slow and controlled - no slamming the stack.',
          },
          {
            type: 'exercise',
            id: 38, // Walking Lunges
            sets: accessorySets,
            repRange: [10, 12],
            restTimeSeconds: 75,
            canSwap: true,
            additionalDescription:
              'Unilateral leg strength and stability. Keep your torso tall and drive through the front heel. Reps are per leg.',
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise
            sets: accessorySets,
            repRange: [10, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Anterior core without added spinal compression. Keep your legs straight and avoid swinging - the hang also decompresses the spine after squats.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 - Strict Press (Wednesday) + chest/triceps/shoulders
      // Face Pulls close the session to protect the shoulders against a
      // heavy pressing day with no vertical pulling.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: dayLabel('Strict Press', cycle, weekInCycle),
        description:
          'Primary lift: Strict Press. Assistance: chest, triceps, and shoulders.',
        intensity: isDeload ? 4 : baseIntensity,
        exercises: [
          press_warmup,
          {
            type: 'exercise',
            id: PRESS_ID,
            sets: scheme.length,
            repRange: [scheme[0].reps, scheme[0].reps],
            setScheme: scheme,
            trainingMaxIncrementLb: cycle * PRESS_INCREMENT_LB,
            restTimeSeconds: mainRest,
            canSwap: false,
            additionalHeader: mainLiftHeader(cycle, weekInCycle),
            additionalDescription: mainLiftDescription(weekInCycle),
          },
          {
            type: 'exercise',
            id: 17, // Dips
            sets: accessorySets,
            repRange: [8, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Chest and triceps compound work. Lean forward for more chest, stay upright for more triceps. Add weight once bodyweight is easy, or swap to the assisted machine.',
          },
          {
            type: 'exercise',
            id: 18, // Incline DB Press
            sets: accessorySets,
            repRange: [8, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Upper-chest pressing that carries directly over to your strict press lockout. Control the stretch at the bottom.',
          },
          {
            type: 'exercise',
            id: 3, // Push-ups
            sets: accessorySets,
            repRange: [12, 20],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Chest and triceps volume finisher. Keep a rigid plank from head to heels and take each set close to failure.',
          },
          {
            type: 'exercise',
            id: 34, // Lateral Raises
            sets: accessorySets,
            repRange: [12, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Side-delt width to round out the shoulders. Lead with the elbows and avoid swinging - strict form over heavy weight.',
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls
            sets: accessorySets,
            repRange: [15, 20],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Non-negotiable rear-delt and rotator-cuff work to balance a pressing-heavy day. Pull the rope to your forehead with elbows flared high.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 - Deadlift (Friday) + back / posterior chain
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: dayLabel('Deadlift', cycle, weekInCycle),
        description:
          'Primary lift: Deadlift. Assistance: back, lats, and posterior chain.',
        intensity: heavyIntensity,
        exercises: [
          deadlift_warmup,
          {
            type: 'exercise',
            id: DEADLIFT_ID,
            sets: scheme.length,
            repRange: [scheme[0].reps, scheme[0].reps],
            setScheme: scheme,
            trainingMaxIncrementLb: cycle * DEADLIFT_INCREMENT_LB,
            restTimeSeconds: mainRest,
            canSwap: false,
            additionalHeader: mainLiftHeader(cycle, weekInCycle),
            additionalDescription: mainLiftDescription(weekInCycle),
          },
          {
            type: 'exercise',
            id: 7, // Barbell Row
            sets: accessorySets,
            repRange: [8, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Horizontal pulling to build the mid-back that keeps the bar close on heavy pulls. Brace hard and pull with the elbows, not the hands.',
          },
          {
            type: 'exercise',
            id: 10, // Pull-ups
            sets: accessorySets,
            repRange: [6, 10],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Lat strength for a tight, stable deadlift setup. If bodyweight reps are not there yet, swap to the Assisted Pull-up Machine or Lat Pulldown.',
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row
            sets: accessorySets,
            repRange: [10, 12],
            restTimeSeconds: 75,
            canSwap: true,
            additionalDescription:
              'Mid-back thickness. Squeeze the handle to your sternum and keep your shoulders down and away from your ears.',
          },
          {
            type: 'exercise',
            id: 41, // Hip Thrust
            sets: accessorySets,
            repRange: [8, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Glute and posterior-chain power for lockout. Squeeze hard for a full second at the top of every rep.',
          },
        ],
      },
    ];
  }),
};
