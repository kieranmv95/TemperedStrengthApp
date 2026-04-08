import type { Program, Warmup } from '@/src/types/program';

// ─────────────────────────────────────────────────────────
// WARMUPS
// ─────────────────────────────────────────────────────────

export const upper_strength_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-5 minutes light cardio (rower or bike) to raise heart rate and body temperature.',
    '30s doorway pec stretch each side / 30s lat stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts or scapular wall slides',
    '10 scapular push-ups',
    '10 empty-bar bench press reps focusing on bar path and shoulder stability',
  ],
};

export const lower_strength_warmup: Warmup = {
  type: 'warmup',
  description: [
    '5 minutes bike or rower to thoroughly warm the knees and hips.',
    '30s hip flexor stretch each side / 30s pigeon pose each side / 30s deep squat hold',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 hip circles each direction',
    '10 glute bridges with 2s pause at the top',
    '10 bodyweight squats with controlled tempo focusing on depth',
    '1 light set of 10 reps on the primary movement to groove the pattern',
  ],
};

export const upper_hypertrophy_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-5 minutes light cardio (rower or bike) to raise heart rate.',
    '30s overhead lat stretch each side / 30s cross-body shoulder stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '10 dead bugs (controlled, alternating sides)',
    '1 light set of 15 reps on the first pressing movement to prime the shoulders',
  ],
};

export const lower_hypertrophy_warmup: Warmup = {
  type: 'warmup',
  description: [
    '5 minutes bike or rower to thoroughly warm the knees and hips.',
    '30s hip flexor stretch each side / 30s hamstring stretch each side',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 glute bridges with 2s pause at the top',
    '10 bodyweight squats focusing on depth and control',
    '1 light set of 10 reps on the primary movement to groove the pattern',
  ],
};

// ─────────────────────────────────────────────────────────
// PRO POWERBUILDING - 4 DAY UPPER/LOWER
//
// Structure:
//   Mon - Upper Strength (heavy barbell compounds)
//   Tue - Lower Strength (squat + hinge focus)
//   Thu - Upper Hypertrophy (dumbbell/cable volume)
//   Fri - Lower Hypertrophy (unilateral + isolation volume)
//
// Phases:
//   Phase 1 (Weeks  1-4):  Accumulation    - higher reps, work capacity, moderate load
//   Phase 2 (Weeks  5-8):  Intensification - moderate reps, heavier loads, strength focus
//   Phase 3 (Weeks  9-12): Realisation     - lower reps, peak loads, AMRAP finishers
//
// Progressive overload mechanics:
//   - Compound rep ranges taper each phase
//   - Accessory rep ranges taper each phase
//   - Rest times increase as load increases
//   - AMRAP introduced Phase 3 on appropriate isolation exercises
//   - canSwap on all machine/isolation exercises
//   - Exercise variants rotate every 2 weeks within each phase
// ─────────────────────────────────────────────────────────

export const powerbuilding_4day_pro: Program = {
  id: 'powerbuilding_4day_pro',
  isPro: true,
  name: 'Pro Powerbuilding',
  description:
    '12-week powerbuilding programme across 3 phases: Accumulation, Intensification, and Realisation. 4 days per week blending heavy compound strength with targeted hypertrophy for both size and strength.',
  daysSplit: ['mon', 'tue', 'thu', 'fri'],
  averageSessionDuration: '60-75m',
  workouts: Array.from({ length: 12 }).flatMap((_, week) => {
    // ── Phase logic ──────────────────────────────────────
    const phase = week < 4 ? 0 : week < 8 ? 1 : 2;
    const phaseNames = ['Accumulation', 'Intensification', 'Realisation'];
    const phaseName = phaseNames[phase];

    // ── Intensity per phase (with intra-phase progression) ──
    const baseIntensity = [7, 8, 9][phase];
    const intraWeek = week % 4; // 0-3 within each phase
    const intensity = Math.min(baseIntensity + Math.floor(intraWeek / 2), 10);

    // ── Week 12 is a deload/test week ──
    const isDeload = week === 11;

    // ── Compound rep ranges taper each phase ──
    const compoundReps: [number, number] = isDeload
      ? [3, 5]
      : (
          [
            [8, 12], // Accumulation
            [5, 8], // Intensification
            [3, 6], // Realisation
          ] as [number, number][]
        )[phase];

    // ── Accessory rep ranges taper each phase ──
    const accessoryReps: [number, number] = isDeload
      ? [8, 10]
      : (
          [
            [10, 15], // Accumulation
            [8, 12], // Intensification
            [8, 10], // Realisation
          ] as [number, number][]
        )[phase];

    // ── Isolation rep ranges stay higher throughout ──
    const isolationReps: [number, number] = isDeload
      ? [10, 12]
      : (
          [
            [12, 15], // Accumulation
            [10, 12], // Intensification
            [10, 12], // Realisation
          ] as [number, number][]
        )[phase];

    // ── Rest times increase as loads increase ──
    const compoundRest = [120, 150, 180][phase];
    const accessoryRest = [90, 90, 120][phase];
    const isolationRest = 60;

    // ── Sets reduce on deload week ──
    const compoundSets = isDeload ? 3 : [4, 4, 4][phase];
    const mainCompoundSets = isDeload ? 3 : [4, 5, 5][phase];

    // ── AMRAP: only Realisation phase, only isolation ──
    const useAmrap = phase === 2 && !isDeload;

    // ── Exercise variation: rotates every 2 weeks within each phase ──
    const variantA = intraWeek < 2;

    return [
      // ───────────────────────────────────────────────────
      // DAY 1 - UPPER STRENGTH (Monday)
      // Structure: Primary press + primary pull + secondary press
      //            + secondary pull + shoulder health
      // Variation: Secondary pull alternates chin-ups/lat pulldown
      //            Tricep finisher alternates CGBP/skull crushers
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Upper Strength - Week ${week + 1}`,
        description: isDeload
          ? `${phaseName}: Deload week. Reduce loads by 40-50% and focus on movement quality.`
          : `${phaseName}: Heavy barbell compounds. Maximise load on the primary press and pull.`,
        intensity: isDeload ? 5 : intensity,
        exercises: [
          upper_strength_warmup,
          {
            type: 'exercise',
            id: 1, // Barbell Bench Press
            sets: mainCompoundSets,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: 'Primary Press',
            additionalDescription:
              'Maintain a tight arch and drive your feet into the floor throughout. Control the descent for a full 2-second count, touch the lower chest lightly, and press explosively without bouncing. This is the cornerstone of your upper body strength.',
          },
          {
            type: 'exercise',
            id: 7, // Barbell Row
            sets: mainCompoundSets,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: 'Primary Pull',
            additionalDescription:
              'Keep your torso rigid and close to parallel with the floor. Pull with your elbows, driving them into your back pockets. Reset your brace between reps on heavier sets. This balances the bench press and builds the back thickness that supports all your pressing.',
          },
          {
            type: 'exercise',
            id: 26, // Barbell Overhead Press
            sets: compoundSets,
            repRange:
              phase === 0 ? ([8, 10] as [number, number]) : compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: 'Secondary Press',
            additionalDescription:
              'No leg drive. Brace your core as if about to be punched and squeeze your glutes. Press the bar vertically, pulling your head back slightly as the bar passes your face. Strict form builds true pressing strength.',
          },
          {
            type: 'exercise',
            id: variantA ? 12 : 11, // Chin-ups / Lat Pulldown
            sets: 3,
            repRange: variantA ? ([6, 10] as [number, number]) : accessoryReps,
            restTimeSeconds: accessoryRest,
            canSwap: true,
            additionalHeader: 'Secondary Pull',
            additionalDescription: variantA
              ? 'Full dead hang at the bottom, pull your chest to the bar. Initiate by depressing your shoulder blades before bending the elbows. Add weight once bodyweight reps exceed the top of the range.'
              : 'Lean back slightly and pull the bar to your upper chest. Drive your elbows toward your hips and squeeze your lats hard at the bottom of each rep. Control the eccentric fully.',
          },
          {
            type: 'exercise',
            id: variantA ? 35 : 87, // Face Pulls / Close-Grip Bench Press
            sets: 3,
            repRange: variantA ? ([15, 20] as [number, number]) : accessoryReps,
            restTimeSeconds: variantA ? isolationRest : accessoryRest,
            additionalHeader: variantA ? 'Shoulder Health' : 'Lockout Strength',
            additionalDescription: variantA
              ? 'Pull the rope to your forehead with elbows flared high. Emphasise the external rotation at the end. This directly protects the rotator cuff across a heavy 12-week pressing programme.'
              : 'Hands roughly a thumb-length inside the smooth rings of the bar. Keep your elbows tucked close to your torso throughout. This builds the lockout strength that directly transfers to your competition bench.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 2 - LOWER STRENGTH (Tuesday)
      // Structure: Primary squat + hip hinge + quad accessory
      //            + hamstring isolation + core
      // Variation: Core alternates plank/hanging leg raise
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 1,
        label: `Lower Strength - Week ${week + 1}`,
        description: isDeload
          ? `${phaseName}: Deload week. Reduce loads by 40-50% and focus on depth and positioning.`
          : `${phaseName}: Heavy squat and hip hinge. Build maximal lower body strength through the primary patterns.`,
        intensity: isDeload ? 5 : Math.min(intensity + 1, 10),
        exercises: [
          lower_strength_warmup,
          {
            type: 'exercise',
            id: 4, // Barbell Back Squat
            sets: mainCompoundSets,
            repRange: compoundReps,
            restTimeSeconds: Math.min(compoundRest + 30, 210),
            additionalHeader: 'Primary Squat',
            additionalDescription:
              'Sit back and down, keeping your chest proud throughout. At the bottom your thighs should be at or below parallel. Drive the floor away on the ascent and squeeze your glutes at the top. Take the time to brace properly before every rep.',
          },
          {
            type: 'exercise',
            id: 22, // Romanian Deadlift
            sets: compoundSets,
            repRange:
              phase === 0
                ? ([8, 12] as [number, number])
                : ([6, 10] as [number, number]),
            restTimeSeconds: compoundRest,
            additionalHeader: 'Hip Hinge',
            additionalDescription:
              'Push your hips back as far as possible until you feel a deep hamstring stretch. Keep the bar close to your legs throughout the entire range. Drive your hips through to standing and squeeze your glutes hard at the top. Control the descent - do not just drop the bar.',
          },
          {
            type: 'exercise',
            id: 19, // Leg Press
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            canSwap: true,
            additionalHeader: 'Quad Accessory',
            additionalDescription:
              'Place your feet at shoulder width in the middle of the platform. Control the descent to a deep range and press through the full foot. This adds quad volume without the spinal loading of another squat variation.',
          },
          {
            type: 'exercise',
            id: 40, // Leg Curl
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            canSwap: true,
            additionalHeader: 'Hamstring Isolation',
            additionalDescription:
              'Slow and controlled throughout. Do not let the weight stack slam at the bottom - maintain tension on the hamstrings through the full range. This protects the knee joint and balances the quad-dominant work from squats and leg press.',
          },
          {
            type: 'exercise',
            id: variantA ? 13 : 31, // Plank / Hanging Leg Raise
            sets: 3,
            repRange: variantA
              ? ([45, 60] as [number, number])
              : ([10, 15] as [number, number]),
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core',
            additionalDescription: variantA
              ? 'Actively pull your elbows toward your toes. Squeeze your glutes and quads to create total body tension. Bracing under fatigue after heavy squats is exactly how core strength transfers to your main lifts.'
              : 'Keep your legs as straight as possible and avoid swinging. This decompresses the spine after heavy squatting while training the lower abs through hip flexion. Initiate every rep from a controlled dead hang.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 3 - UPPER HYPERTROPHY (Thursday)
      // Structure: Primary press + primary pull + shoulder press
      //            + lat width + chest isolation + lateral raises
      //            + biceps + triceps
      // Variation: Primary pull alternates DB row/cable row
      //            Shoulder press alternates DB press/Arnold press
      //            Lat work alternates pulldown/single arm pulldown
      //            Biceps alternates DB curls/hammer curls
      //            Triceps alternates pushdowns/overhead extension
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 3,
        label: `Upper Hypertrophy - Week ${week + 1}`,
        description: isDeload
          ? `${phaseName}: Deload week. Lighter loads, focus on the mind-muscle connection and recovery.`
          : `${phaseName}: Volume-driven upper body work. Prioritise the squeeze, the stretch, and time under tension.`,
        intensity: isDeload ? 5 : intensity,
        exercises: [
          upper_hypertrophy_warmup,
          {
            type: 'exercise',
            id: 18, // Incline DB Press
            sets: compoundSets,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: 'Incline Press',
            additionalDescription:
              'Use a 30-45 degree incline. Allow the dumbbells to travel slightly deeper than a barbell would permit. Feel the full stretch across the upper chest at the bottom and squeeze hard at the top without touching the weights together.',
          },
          {
            type: 'exercise',
            id: variantA ? 8 : 30, // Dumbbell Row / Seated Cable Row
            sets: compoundSets,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: variantA ? 'Back Thickness' : 'Mid-Back Detail',
            additionalDescription: variantA
              ? 'Place one hand and knee on a bench. Pull the dumbbell to your hip, squeezing the shoulder blade back and down at the peak. Let the weight stretch your lat fully at the bottom between reps.'
              : 'Slight forward lean at the start, sit tall at the peak. Squeeze your shoulder blades together and hold for a full beat before releasing. Think chest proud, not just arms back.',
          },
          {
            type: 'exercise',
            id: variantA ? 27 : 43, // Dumbbell Shoulder Press / Arnold Press
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: variantA
              ? 'Shoulder Volume'
              : 'Full Delt Activation',
            additionalDescription: variantA
              ? 'Dumbbells allow each shoulder to work independently, exposing and correcting any imbalances. Press in a slight arc and stop just short of the weights touching at the top.'
              : 'The rotation from palms-in at the bottom to palms-forward at the top recruits all three heads of the deltoid. Slow and deliberate - do not rush the rotation.',
          },
          {
            type: 'exercise',
            id: variantA ? 11 : 47, // Lat Pulldown / Single Arm Lat Pulldown
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            canSwap: true,
            additionalHeader: 'Lat Width',
            additionalDescription: variantA
              ? 'Lean back slightly and pull the bar to your upper chest. Initiate by pulling your shoulder blades down, driving your elbows toward your hips. Feel the lats working, not the biceps.'
              : 'Single arm work allows a greater range of motion and addresses imbalances. Initiate by depressing the shoulder blade before bending the elbow. Focus on each side independently.',
          },
          {
            type: 'exercise',
            id: 36, // Cable Flyes
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            isAmrap: useAmrap,
            additionalHeader: 'Chest Isolation',
            additionalDescription:
              'Do not lock out - keep constant tension on the pecs throughout. Think about wrapping your arms around a barrel. Squeeze for a full second at peak contraction. This finishes off the chest after incline pressing.',
          },
          {
            type: 'exercise',
            id: 34, // Lateral Raises
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            isAmrap: useAmrap,
            canSwap: true,
            additionalHeader: 'Side Delts',
            additionalDescription:
              'The most important exercise for shoulder width. Lead with the elbows - imagine trying to touch the side walls. Stop slightly above shoulder height. Use lighter weight than feels necessary and focus on the burn.',
          },
          {
            type: 'exercise',
            id: variantA ? 32 : 51, // Dumbbell Bicep Curls / Hammer Curls
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            additionalHeader: variantA ? 'Bicep Peak' : 'Brachialis & Forearms',
            additionalDescription: variantA
              ? 'Supinate your wrist at the top of each rep to fully contract the bicep peak. Keep your elbows pinned to your sides - no swinging. Controlled descent on every rep.'
              : 'Neutral grip targets the brachialis underneath the bicep. Keep your wrists straight and avoid rocking. This also builds the forearm strength that supports your heavy pulling days.',
          },
          {
            type: 'exercise',
            id: variantA ? 33 : 53, // Tricep Pushdowns / Overhead Tricep Extension
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            additionalHeader: variantA ? 'Lateral Head' : 'Long Head Stretch',
            additionalDescription: variantA
              ? 'Keep your elbows pinned to your sides - only your forearms should move. Full extension at the bottom to maximise the peak contraction in the lateral head.'
              : 'Overhead position puts the long head of the tricep in its most fully stretched position. This is the largest head and the key to arm size. Keep elbows pointing up throughout.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 4 - LOWER HYPERTROPHY (Friday)
      // Structure: Primary hinge/squat + unilateral + glutes
      //            + quad isolation + hamstring isolation
      //            + calves + core
      // Variation: Primary lift alternates deadlift/front squat
      //            Hamstring isolation alternates lying/seated curl
      //            Core alternates cable crunch/ab wheel rollout
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Lower Hypertrophy - Week ${week + 1}`,
        description: isDeload
          ? `${phaseName}: Deload week. Lighter loads, focus on range of motion and muscle connection.`
          : variantA
            ? `${phaseName}: Deadlift and unilateral focus. Posterior chain development with targeted isolation.`
            : `${phaseName}: Front squat and glute focus. Upright loading pattern with volume-driven accessories.`,
        intensity: isDeload ? 5 : Math.min(intensity + 1, 10),
        exercises: [
          lower_hypertrophy_warmup,
          {
            type: 'exercise',
            id: variantA ? 14 : 68, // Barbell Deadlift / Front Squat
            sets: compoundSets,
            repRange: variantA
              ? phase === 0
                ? ([6, 10] as [number, number])
                : ([5, 8] as [number, number])
              : accessoryReps,
            restTimeSeconds: variantA
              ? Math.min(compoundRest + 30, 210)
              : compoundRest,
            additionalHeader: variantA ? 'Hinge Power' : 'Upright Squat',
            additionalDescription: variantA
              ? 'Wedge your hips close to the bar and pull the slack out before every rep. Drive through the full foot and keep the bar as close to your body as possible. Reset your position fully between reps - no touch-and-go on a powerbuilding programme.'
              : 'Bar resting on the front of your shoulders with a clean grip or crossed arms. Keep your torso as upright as possible throughout. This hammers the quads and core in a way back squats cannot, and builds the front rack strength that transfers to all your pressing.',
          },
          {
            type: 'exercise',
            id: 6, // Bulgarian Split Squat
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalDescription:
              'Elevate your rear foot on a bench. Focus on keeping your front knee aligned with your toes and your torso upright. This builds single-leg strength, addresses imbalances, and develops the hip stability that supports your heavy squats.',
          },
          {
            type: 'exercise',
            id: 41, // Hip Thrust
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: 'Glute Focus',
            additionalDescription:
              'Use a pad for the bar. Drive through your heels and squeeze your glutes for a full second at the top. Your shins should be vertical at peak contraction. Strong glutes directly power your squat lockout and deadlift drive.',
          },
          {
            type: 'exercise',
            id: 39, // Leg Extensions
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            canSwap: true,
            isAmrap: useAmrap,
            additionalHeader: 'Quad Detail',
            additionalDescription:
              'Pause for a full second at the top with legs fully extended. This peak contraction maximises rectus femoris activation. Control the eccentric - do not let the weight slam down. Volume here adds quad size without taxing the lower back.',
          },
          {
            type: 'exercise',
            id: variantA ? 81 : 80, // Lying Leg Curl / Seated Leg Curl
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            canSwap: true,
            additionalHeader: 'Hamstring Detail',
            additionalDescription: variantA
              ? 'The lying position stretches the hamstring differently to the seated variant. Slow controlled reps - focus on the peak contraction and a 2-second eccentric on every rep.'
              : 'Seated position places the hamstring under a greater stretch throughout the range. Focus on a slow eccentric and a hard peak contraction. Both positions are trained across the programme for full development.',
          },
          {
            type: 'exercise',
            id: 55, // Calf Raises
            sets: 4,
            repRange: [15, 20],
            restTimeSeconds: 45,
            canSwap: true,
            additionalDescription:
              'Full range of motion - all the way up onto your toes and all the way down for a deep stretch. Calves respond well to slow eccentrics and high volume. Pause for a second at the top of each rep.',
          },
          {
            type: 'exercise',
            id: variantA ? 48 : 15, // Cable Crunch / Ab Wheel Rollout
            sets: 3,
            repRange: variantA
              ? ([12, 15] as [number, number])
              : ([8, 12] as [number, number]),
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core Finisher',
            additionalDescription: variantA
              ? 'Keep your hips still - the movement comes entirely from your spine. Exhale sharply as you crunch down and hold the peak contraction for a beat. Weighted core work builds the bracing strength your heavy lifts demand.'
              : 'Roll out slowly with your core engaged throughout. Do not let your lower back sag at full extension. Pull back using your abs, not your hip flexors. This builds the anti-extension strength critical for heavy squats and deadlifts.',
          },
        ],
      },
    ];
  }),
};
