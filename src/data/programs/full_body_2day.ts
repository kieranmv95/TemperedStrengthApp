import type { Program, Warmup } from '@/src/types/program';

export const full_body_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice (rower, bike, or light jog) to raise heart rate and body temperature.',
    '30s deep squat hold',
    '10 arm circles forward / 10 arm circles backward',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 band pull-aparts or scapular wall slides',
    '10 glute bridges with 2s pause at the top',
    '10 dead bugs or bird dogs (controlled)',
    '10 bodyweight squats or inchworms',
  ],
};

export const full_body_2day: Program = {
  isPro: false,
  id: 'full_body_2day',
  name: '2 Day Full Body',
  description:
    '12-Week Full Body Maintenance. Alternates movement variants monthly to prevent plateaus.',
  categories: ['strength'],
  goals: ['maintenance', 'stronger', 'hypertrophy'],
  difficulty: 'beginner',
  daysSplit: ['sat', 'sun'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 12 }).flatMap((_, week) => {
    const cycle = Math.floor(week / 4);
    const cycleNames = ['Foundation', 'Stability', 'Hypertrophy'];

    // FIX: Intensity now reflects the phase. Flat 7 across 12 weeks gave no
    // sense of progression. Hypertrophy cycle bumps to 8 to reflect increased
    // training demand.
    const intensity = cycle < 2 ? 7 : 8;

    // FIX: Description now accurately describes each cycle's focus rather
    // than incorrectly labelling cycle 2 (Hypertrophy) as 'Barbell' stability.
    const cycleDescriptions = [
      'Building foundational movement quality with barbell compounds.',
      'Emphasising machine-based stability and controlled range of motion.',
      'Maximising muscle stimulus through dumbbell and free weight variation.',
    ];

    return [
      // ─────────────────────────────────────────────
      // DAY A - Full Body (Saturday)
      // FIX 1: Bench Press now cycles - barbell in Foundation/Stability,
      //         Incline DB Press in Hypertrophy for greater ROM and pec stretch.
      // FIX 2: Lat Pulldown added after the row to provide a vertical pull.
      //         Day A previously had no vertical pull at all.
      // FIX 3: isAmrap removed from KB Swing. Going to failure on a
      //         hip-power movement risks form breakdown - keep it structured.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Full Body A (Week ${week + 1})`,
        description: `Phase ${cycle + 1} - ${cycleNames[cycle]}: ${cycleDescriptions[cycle]}`,
        intensity,
        exercises: [
          full_body_warmup,
          {
            type: 'exercise',
            id: cycle === 1 ? 19 : 4, // Leg Press (Stability) / Barbell Back Squat (Foundation + Hypertrophy)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: cycle === 1 ? 120 : 150,
            additionalHeader: cycle === 1 ? 'Controlled Load' : 'Core Demand',
            additionalDescription:
              cycle === 1
                ? 'Using the Leg Press to drive pure quadriceps hypertrophy without lower back fatigue. Focus on a deep range of motion.'
                : 'Barbell Squats: Brace your core as if about to be punched. Control the descent and drive the floor away aggressively.',
          },
          {
            type: 'exercise',
            // FIX: Bench now varies by cycle.
            // Foundation + Stability: Barbell Bench Press (id: 1) - builds base pressing strength.
            // Hypertrophy: Incline DB Press (id: 18) - greater ROM, deeper pec stretch, fits hypertrophy goal.
            id: cycle === 2 ? 18 : 1,
            sets: 3,
            repRange: cycle === 2 ? [10, 12] : [8, 10],
            restTimeSeconds: 150,
            additionalDescription:
              cycle === 2
                ? 'Incline DB Press: Use a moderate incline (30–45°) to emphasise the upper chest. Lower the weights slowly for a deep stretch and drive them up and slightly inward.'
                : "Barbell Bench: Maintain a slight arch in your back and keep your shoulder blades 'tucked' into the bench. Think about bending the bar to engage your chest.",
          },
          {
            type: 'exercise',
            id: cycle === 2 ? 45 : 7, // T-Bar Row (Hypertrophy) / Barbell Row (Foundation + Stability)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 120,
            additionalDescription:
              cycle === 2
                ? 'T-Bar Row: Focus on pulling with your elbows rather than your hands. Squeeze your mid-back at the peak of the contraction.'
                : "Barbell Row: Keep your torso rigid and parallel to the floor. This builds the foundational 'back thickness' required for heavy pulling.",
          },
          {
            type: 'exercise',
            // FIX: Lat Pulldown added to provide vertical pull on Day A.
            // Day A previously had no vertical pull at all - squat, bench,
            // row, and KB swing left the lats completely undertrained on this day.
            // Cycles between standard and single arm variant for variety.
            id: cycle === 2 ? 47 : 11, // Single Arm Lat Pulldown (Hypertrophy) / Lat Pulldown (Foundation + Stability)
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            canSwap: true,
            additionalDescription:
              cycle === 2
                ? 'Single Arm Lat Pulldown: Allows you to focus on each side independently. Initiate the pull by depressing your shoulder blade, not by bending your elbow.'
                : 'Lat Pulldown: Lean back slightly and pull the bar to your upper chest. Drive your elbows down and back - think of pulling your shoulder blades into your back pockets.',
          },
          {
            type: 'exercise',
            id: 24, // Kettlebell Swing
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            // FIX: isAmrap removed. KB Swing is a hip-power movement - going to
            // failure risks form breakdown (hyperextension, loss of hinge pattern).
            additionalHeader: 'Glute Finisher',
            additionalDescription:
              "A high-rep conditioning tool. Focus on the hip hinge - push your glutes back and 'snap' them forward to propel the weight. Stop before form deteriorates.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY B - Full Body (Sunday)
      // FIX 1: Pull-ups canSwap: true added - this is a non-pro program
      //         serving a broad audience. Not all users can do bodyweight
      //         pull-ups.
      // FIX 2: DB Goblet Squat (id: 5) replaced with a cycling core finisher.
      //         Day B opens with Deadlifts - adding more knee-dominant squatting
      //         at the end of the session compounds fatigue on already-loaded
      //         patterns. A core finisher is a better close to a pulling-focused
      //         day, and addresses the complete lack of direct core work on Day B.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 1,
        label: `Full Body B (Week ${week + 1})`,
        description: `Phase ${cycle + 1} - ${cycleNames[cycle]}: Pulling and overhead pressing focus.`,
        intensity,
        exercises: [
          full_body_warmup,
          {
            type: 'exercise',
            id: 14, // Barbell Deadlift
            sets: 3,
            repRange: [5, 8],
            restTimeSeconds: 180,
            additionalHeader: 'Primary Pull',
            additionalDescription:
              'The king of posterior chain movements. Pull the slack out of the bar before lifting. Keep the bar in contact with your shins throughout.',
          },
          {
            type: 'exercise',
            id: cycle === 1 ? 27 : 26, // DB Shoulder Press (Stability) / Barbell OHP (Foundation + Hypertrophy)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 120,
            additionalHeader: 'Vertical Drive',
            additionalDescription:
              cycle === 1
                ? 'Dumbbell Press allows for a more natural range of motion. Bring the weights down until they are just above shoulder height.'
                : "Overhead Press: Squeeze your glutes and quads hard to create a stable base. Press the bar in a straight line, finishing with your head through the 'window'.",
          },
          {
            type: 'exercise',
            id: 10, // Pull-ups
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 120,
            isAmrap: true,
            canSwap: true, // FIX: not all users can perform bodyweight pull-ups
            additionalDescription:
              'The ultimate test of upper body relative strength. Aim for full extension at the bottom and chin over the bar at the top. If bodyweight pull-ups are not yet accessible, swap to the Assisted Pull-up Machine or Lat Pulldown.',
          },
          {
            type: 'exercise',
            // FIX: Goblet Squat replaced with a cycling core finisher.
            // Foundation: Plank (id: 13) - anti-extension bracing fundamentals.
            // Stability: Hanging Leg Raise (id: 31) - hip flexion core, no spinal load.
            // Hypertrophy: Cable Crunch (id: 48) - loaded core flexion for hypertrophy.
            id: cycle === 0 ? 13 : cycle === 1 ? 31 : 48,
            sets: 3,
            repRange:
              cycle === 0 ? [30, 45] : cycle === 1 ? [10, 15] : [12, 15],
            restTimeSeconds: 60,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              cycle === 0
                ? 'Plank: Actively pull your elbows toward your toes. This is bracing practice - the same tension pattern you need under a heavy deadlift.'
                : cycle === 1
                  ? 'Hanging Leg Raise: Keep your legs as straight as possible. Avoid swinging - initiate every rep from a dead hang.'
                  : 'Cable Crunch: Exhale sharply as you crunch down. Keep your hips still - the movement should come entirely from your spine, not your hips.',
          },
        ],
      },
    ];
  }),
};
