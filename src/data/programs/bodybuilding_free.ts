import type { Program, Warmup } from '@/src/types/program';

export const upper_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (rower or bike) to raise body temperature.',
    '30s doorway pec stretch each side / 30s lat stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts or scapular wall slides',
    '10 scapular push-ups',
    '10 empty-bar or very light overhead press reps focusing on bar path',
  ],
};

export const legs_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (bike preferred) to raise heart rate and warm the knees.',
    '30s hip flexor stretch each side / 30s pigeon pose each side',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 hip circles each direction',
    '10 glute bridges with 2s pause at the top',
    '10 bodyweight squats focusing on depth and control',
  ],
};

// ─────────────────────────────────────────────────────────
// TRADITIONAL BODYBUILDING — 3 DAY SPLIT
// Structure: Chest & Triceps | Back & Biceps | Legs & Shoulders
// 4 Weeks | Mon / Wed / Fri | 60 min sessions
// ─────────────────────────────────────────────────────────

export const bodybuilding_free: Program = {
  id: 'bb_3day_01',
  isPro: false,
  name: 'Traditional Bodybuilding Split',
  description:
    '4-Week classic bodybuilding block. Chest & Triceps, Back & Biceps, Legs & Shoulders. Rep ranges taper weeks 3–4 to drive progressive overload.',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60 min',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    // Intensity trends upward across the block
    const intensity = week < 2 ? 7 : 8;

    // Rep ranges taper in weeks 3–4 — same weight target, fewer reps = heavier load
    const compoundReps: [number, number] = week < 2 ? [10, 12] : [8, 10];
    const accessoryReps: [number, number] = week < 2 ? [12, 15] : [10, 12];

    return [
      // ─────────────────────────────────────────────
      // DAY 1 — Chest & Triceps (Monday)
      // Primary: Horizontal push compounds, pec isolation, tricep isolation
      // Balance: Reverse Flyes close the session to protect the shoulder joint
      //          after a full day of pressing volume.
      // Variation: Bench press alternates barbell (even) / dumbbell (odd)
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Chest & Triceps (Week ${week + 1})`,
        description:
          week % 2 === 0
            ? 'Barbell strength focus with cable and isolation finishers.'
            : 'Dumbbell range-of-motion focus with cable and isolation finishers.',
        intensity,
        exercises: [
          upper_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 1 : 2, // Barbell Bench (even) / DB Bench (odd)
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: 150,
            additionalHeader: week % 2 === 0 ? 'Power Base' : 'Full Stretch',
            additionalDescription:
              week % 2 === 0
                ? 'Controlled 2-second descent. Touch the lower chest lightly and drive upward without bouncing. Maintain leg drive throughout.'
                : 'Allow the dumbbells to travel slightly deeper than a barbell would permit. Focus on feeling the pec stretch at the bottom and squeezing hard at the top.',
          },
          {
            type: 'exercise',
            id: 18, // Incline DB Press
            sets: 3,
            repRange: compoundReps,
            restTimeSeconds: 120,
            additionalDescription:
              'Use a 30–45° incline to target the upper chest. Control the weight on the descent — the stretch under load is where upper chest growth happens.',
          },
          {
            type: 'exercise',
            id: 36, // Cable Flyes
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: 60,
            additionalHeader: 'Constant Tension',
            additionalDescription:
              'Do not lock out at the top — keep the tension on the pecs throughout. Think about trying to wrap your arms around a barrel. Squeeze for a full second at peak contraction.',
          },
          {
            type: 'exercise',
            id: week % 2 === 0 ? 54 : 53, // Skull Crushers (even) / Overhead Tricep Extension (odd)
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: 60,
            additionalHeader: 'Tricep Isolation',
            additionalDescription:
              week % 2 === 0
                ? "Keep your elbows pointing at the ceiling and tucked close to your ears. Focus on the stretch at the bottom of the movement — don't let them flare out."
                : 'Overhead position puts the long head of the tricep in a fully stretched position. Keep your elbows pointing straight up and avoid letting them flare forward.',
          },
          {
            type: 'exercise',
            id: 56, // Reverse Flyes
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalHeader: 'Shoulder Health',
            additionalDescription:
              'Use light weight — this is prehab, not a strength exercise. Lead with the elbows and stop at shoulder height. This directly counteracts the anterior shoulder load from all the pressing work today.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 — Back & Biceps (Wednesday)
      // Primary: Horizontal + vertical pull compounds, bicep isolation
      // Balance: Full vertical and horizontal pull coverage every week
      // Variation: Horizontal row alternates barbell (even) / dumbbell (odd)
      //            Vertical pull alternates pull-ups (even) / lat pulldown (odd)
      // Core: Ab Wheel Rollout closes the session — anti-extension work
      //       with no spinal load after a pulling-dominant session.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Back & Biceps (Week ${week + 1})`,
        description:
          week % 2 === 0
            ? 'Barbell rows and pull-ups for maximum back thickness and width.'
            : 'Dumbbell rows and lat pulldown for unilateral control and lat isolation.',
        intensity,
        exercises: [
          upper_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 7 : 8, // Barbell Row (even) / Dumbbell Row (odd)
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: 120,
            additionalHeader: 'Back Thickness',
            additionalDescription:
              week % 2 === 0
                ? "Keep your torso rigid and parallel to the floor. Pull with your elbows — imagine driving them into your back pockets. This builds the mid-back 'thickness' that defines a classic physique."
                : 'Brace your core against the bench. Pull the dumbbell to your hip, not your armpit — this keeps the lat engaged rather than the rear delt doing the work.',
          },
          {
            type: 'exercise',
            id: week % 2 === 0 ? 10 : 11, // Pull-ups (even) / Lat Pulldown (odd)
            sets: 3,
            repRange: week % 2 === 0 ? [6, 10] : compoundReps,
            restTimeSeconds: 120,
            canSwap: true,
            additionalHeader: 'Lat Width',
            additionalDescription:
              week % 2 === 0
                ? "Pull your chest to the bar — not just your chin. Think about 'putting your shoulder blades in your back pockets' at the top of every rep."
                : 'Lean back slightly and pull the bar to your upper chest. Drive your elbows down and back — focus on the lats doing the work, not the biceps.',
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: 90,
            additionalDescription:
              'Maintain a slight forward lean at the start and sit tall at the peak contraction. Squeeze your shoulder blades together and hold for a beat before releasing.',
          },
          {
            type: 'exercise',
            id: week % 2 === 0 ? 32 : 52, // DB Bicep Curls (even) / Preacher Curls (odd)
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: 60,
            isAmrap: week >= 3,
            additionalHeader: 'Bicep Isolation',
            additionalDescription:
              week % 2 === 0
                ? 'Supinate (rotate) your wrist at the top of each rep to fully contract the bicep peak. Keep your elbows pinned — no swinging.'
                : 'The preacher bench eliminates all momentum. Focus on the full stretch at the bottom — resisting the urge to bounce out of the bottom position is where the growth happens.',
          },
          {
            type: 'exercise',
            id: 15, // Ab Wheel Rollout
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 60,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              'Brace hard before each rollout — do not let your lower back collapse. Roll out only as far as you can maintain a neutral spine. This is one of the most effective anti-extension core exercises available.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 — Legs & Shoulders (Friday)
      // Primary: Knee dominant compound, hip hinge, quad + hamstring isolation,
      //          vertical push, lateral isolation
      // Balance: Quad and hamstring isolation alternate weeks to ensure
      //          both get direct work across the 4-week block.
      //          Face Pulls close the session for rotator cuff health after
      //          overhead pressing.
      // Variation: Main leg compound alternates squat (even) / leg press (odd)
      //            Isolation alternates leg extension (even) / leg curl (odd)
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Legs & Shoulders (Week ${week + 1})`,
        description:
          week % 2 === 0
            ? 'Barbell squat and quad-dominant isolation with overhead strength.'
            : 'Leg press and hamstring-dominant isolation with dumbbell pressing.',
        intensity: intensity + (week === 3 ? 1 : 0), // Peaks at 9 in final week
        exercises: [
          legs_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 4 : 19, // Barbell Back Squat (even) / Leg Press (odd)
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: 150,
            additionalHeader: week % 2 === 0 ? 'King of Legs' : 'Quad Drive',
            additionalDescription:
              week % 2 === 0
                ? "Sit back and down — keep your chest proud throughout. In the bottom position, your thighs should be at least parallel. Drive the floor away on the ascent, not just 'stand up'."
                : "Feet shoulder-width apart in the middle of the platform. Don't let your lower back peel off the seat at the bottom — control the depth.",
          },
          {
            type: 'exercise',
            id: 22, // Romanian Deadlift
            sets: 3,
            repRange: compoundReps,
            restTimeSeconds: 120,
            additionalDescription:
              'Push your hips back as far as possible until you feel a deep stretch in the hamstrings. Keep the bar close to your legs throughout. Drive your hips through to standing and squeeze your glutes hard at the top.',
          },
          {
            type: 'exercise',
            id: week % 2 === 0 ? 39 : 40, // Leg Extension (even) / Leg Curl (odd)
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: 60,
            canSwap: true,
            additionalHeader:
              week % 2 === 0 ? 'Quad Isolation' : 'Hamstring Isolation',
            additionalDescription:
              week % 2 === 0
                ? 'Pause for a full second at the top with legs fully extended. This peak contraction maximises rectus femoris activation.'
                : 'Control the descent — do not let the weight stack slam at the bottom. Maintain tension on the hamstrings through the full range of motion.',
          },
          {
            type: 'exercise',
            id: week % 2 === 0 ? 26 : 27, // Barbell OHP (even) / DB Shoulder Press (odd)
            sets: 3,
            repRange: compoundReps,
            restTimeSeconds: 120,
            additionalHeader:
              week % 2 === 0 ? 'Strict Press' : 'Shoulder Press',
            additionalDescription:
              week % 2 === 0
                ? 'No leg drive. Squeeze your glutes and brace your core to create a rigid base. Press the bar vertically — pull your head back slightly as it passes your face, then push your head through at the top.'
                : 'Press the dumbbells up in a slight arc so they nearly touch at the top. Avoid using momentum — full range of motion from just above shoulder height to full lockout.',
          },
          {
            type: 'exercise',
            id: 34, // Lateral Raises
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            canSwap: true,
            additionalDescription:
              "Lead with the elbows — think about trying to touch the side walls rather than lifting the weight 'up.' Stop slightly above shoulder height. Use lighter weight than feels necessary.",
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalHeader: 'Shoulder Health',
            additionalDescription:
              'Pull the rope to your forehead with your elbows flared high. Emphasise the external rotation at the end of the movement. This is essential after overhead pressing to protect the rotator cuff.',
          },
        ],
      },
    ];
  }),
};
