import type { Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (rower, bike, or brisk walk) to raise body temperature.',
    '30s hip flexor stretch each side / 30s hamstring stretch',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts or scapular wall slides',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 glute bridges with 2s pause at the top',
    '10 bodyweight squats focusing on depth and control',
  ],
};

export const strength_5day: Program = {
  isPro: true,
  id: 'strength_5day',
  name: '5-Day Power & Strength',
  description:
    '6-Week Strength Peak. Intensifies every 2 weeks through progressive overload and rep-range tapering.',
  daysSplit: ['mon', 'tue', 'wed', 'thu', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity = week < 2 ? 7 : week < 4 ? 8 : 9;
    const phase = week < 2 ? 'Volume' : week < 4 ? 'Strength' : 'Peak';
    const reps = [
      [8, 10],
      [5, 8],
      [3, 5],
    ][week < 2 ? 0 : week < 4 ? 1 : 2] as [number, number];

    return [
      // ─────────────────────────────────────────────
      // DAY 1 - Chest & Back (Heavy)
      // Push/pull pairing. No changes needed - well balanced.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Chest & Back (Heavy) - Week ${week + 1}`,
        description: `Phase: ${phase}. Primary upper body compound focus.`,
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 1, // Barbell Bench Press
            sets: 4,
            repRange: reps,
            restTimeSeconds: intensity >= 9 ? 180 : 150,
            additionalHeader: 'Main Power Lift',
            additionalDescription:
              'Maintain a tight arch and drive your feet into the floor. As reps drop, increase the rest time between sets to ensure maximum power output.',
          },
          {
            type: 'exercise',
            id: 7, // Barbell Row
            sets: 4,
            repRange: reps,
            restTimeSeconds: 120,
            additionalDescription:
              "Brace your core and keep your back flat. Avoid 'shrugging' the weight; pull with your elbows to target the mid-back and lats.",
          },
          {
            type: 'exercise',
            id: 18, // Incline DB Press
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'Higher incline targets the upper clavicular head of the chest. Control the weight on the way down for a deep stretch.',
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'Maintain a slight bend in the knees. Focus on pulling the handle to your belly button while keeping your shoulders down.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 - Lower Body (Squat focus)
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 1,
        label: `Lower Body (Squat focus) - Week ${week + 1}`,
        description:
          'Developing maximal leg power and anterior chain strength.',
        intensity: Math.min(intensity + 1, 10),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 4, // Barbell Back Squat
            sets: 5,
            repRange: reps,
            restTimeSeconds: intensity >= 9 ? 180 : 150,
            additionalHeader: 'Primary Mover',
            additionalDescription:
              "Sit back into the movement and keep your chest proud. In the 'Peak' phase (Weeks 5-6), focus on a fast, aggressive ascent.",
          },
          {
            type: 'exercise',
            id: 19, // Leg Press
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              'Keep your feet high on the platform to involve more glutes and hamstrings, or lower to focus on the quads.',
          },
          {
            type: 'exercise',
            id: 40, // Leg Curl
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalHeader: 'Hamstring Isolation',
            additionalDescription:
              "Slow and controlled. Do not let the weight stack 'slam' at the bottom; maintain tension on the hamstrings throughout.",
          },
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              'Total body tension. Squeeze your glutes and quads to create a rigid bridge, protecting the lower back after heavy squatting.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 - Shoulders & Arms
      // FIX: Added Face Pulls before arm work to address the lack of any
      // rear delt / pulling movement. A purely push-dominant shoulder day
      // over 6 weeks creates imbalance and impingement risk.
      // Skull Crushers moved to 5th slot; arm isolation remains intact.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Shoulders & Arms - Week ${week + 1}`,
        description: 'Structural balance and upper body hypertrophy.',
        intensity: intensity - 1,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 26, // Barbell Overhead Press
            sets: 4,
            repRange: [6, 8],
            restTimeSeconds: 120,
            additionalHeader: 'Strict Press',
            additionalDescription:
              'No leg drive. Keep your core locked. Press the bar in a straight line, pulling your head back slightly as the bar passes your face.',
          },
          {
            type: 'exercise',
            id: 34, // Lateral Raises
            sets: 4,
            repRange: [12, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              "Lead with the elbows. Imagine trying to touch the side walls with your dumbbells rather than lifting them 'up'.",
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls - ADDED for rear delt health and push/pull balance
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalDescription:
              'Set the cable at face height. Pull the rope to your forehead, flaring your elbows out. This counters the heavy pressing work and protects the rotator cuff.',
          },
          {
            type: 'exercise',
            id: 51, // Hammer Curls
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              'Neutral grip targets the brachialis and forearms. Keep your wrists straight and avoid swinging.',
          },
          {
            type: 'exercise',
            id: 54, // Skull Crushers
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 60,
            additionalDescription:
              "Keep your elbows 'tucked in' toward your ears. Focus on the stretch at the bottom of the movement.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 4 - Lower Body (Deadlift focus)
      // FIX 1: Deadlift repRange now uses the `reps` variable so it
      //         scales through Volume → Strength → Peak like every other
      //         compound. Previously hardcoded to [3, 5] all 6 weeks.
      // FIX 2: Cable Crunches (id: 48) replaced with Hanging Leg Raise
      //         (id: 31). After deadlifts + split squats + hip thrusts the
      //         lower back is already under significant load. Hanging Leg
      //         Raise trains the abs through hip flexion without adding
      //         further spinal flexion stress.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 3,
        label: `Lower Body (Deadlift focus) - Week ${week + 1}`,
        description: 'Posterior chain development and pulling power.',
        intensity: Math.min(intensity + 1, 10),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 14, // Barbell Deadlift
            sets: 3,
            repRange: reps, // FIX: was hardcoded [3, 5] - now scales with phase
            restTimeSeconds: 180,
            additionalHeader: 'Max Pull',
            additionalDescription:
              'Wedge your hips close to the bar. Pull the slack out before the lift. This is a technical lift - reset your position for every single rep.',
          },
          {
            type: 'exercise',
            id: 6, // Bulgarian Split Squat
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              'Elevate your rear foot. Focus on keeping your front knee aligned with your toes. This is brutal but essential for hip stability.',
          },
          {
            type: 'exercise',
            id: 41, // Hip Thrust
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'The best glute builder. Use a pad for the bar. Squeeze your glutes for a full second at the top of the movement.',
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise - REPLACED Cable Crunches
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalDescription:
              'Keep your legs as straight as possible and avoid swinging. This decompresses the spine after heavy pulling and hinge work while effectively training the lower abs.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 5 - Upper Body Hypertrophy
      // FIX 1: Reverse Flyes replaced with Face Pulls (id: 35). Reverse Flyes
      //         now live on the Shoulder day (Day 3) where rear delt work
      //         belongs. Face Pulls are better suited here for joint health
      //         after a week of heavy pressing, and fit the pump/hypertrophy
      //         theme.
      // FIX 2: Dumbbell Bicep Curls (id: 32) added. An "Upper Hypertrophy"
      //         day with no direct bicep work was a clear gap - the pull
      //         movements (Lat Pulldown, Dips) don't provide enough isolation
      //         volume for hypertrophy goals.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Upper Body Hypertrophy - Week ${week + 1}`,
        description:
          "Focus on mind-muscle connection, isolation, and the 'pump'.",
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 2, // Dumbbell Bench Press
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'Focus on the inner chest squeeze. Do not touch the dumbbells together at the top - keep the tension on the muscle.',
          },
          {
            type: 'exercise',
            id: 11, // Lat Pulldown
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              'Lean back slightly and pull the bar to your upper chest. Focus on driving your shoulder blades down and back.',
          },
          {
            type: 'exercise',
            id: 17, // Dips
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            isAmrap: week === 5,
            additionalDescription:
              'Lean forward for more chest, stay upright for more triceps. On Week 6, go until you cannot push back up.',
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls - REPLACED Reverse Flyes
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalDescription:
              'An essential shoulder health movement to close out a week of heavy pressing. Pull the rope to your forehead with elbows flared high.',
          },
          {
            type: 'exercise',
            id: 32, // Dumbbell Bicep Curls - ADDED
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalDescription:
              'Supinate the wrist at the top of each rep to fully contract the bicep. Keep your elbows pinned to your sides - no swinging.',
          },
        ],
      },
    ];
  }),
};
