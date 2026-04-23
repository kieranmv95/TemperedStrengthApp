import type { Program, Warmup } from '@/src/types/program';

// ─────────────────────────────────────────────────────────
// WARMUPS
// ─────────────────────────────────────────────────────────

export const chest_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (rower or ski erg) to raise heart rate.',
    '30s doorway pec stretch each side / 30s lat stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '10 scapular push-ups',
    '10 empty-bar or very light bench press reps focusing on bar path and shoulder stability',
  ],
};

export const back_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (rower preferred) to raise heart rate.',
    '30s lat stretch each side / 30s thoracic extension over a foam roller',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts or scapular wall slides',
    '10 dead bugs (controlled, alternating sides)',
    '10 light dumbbell rows each side focusing on scapular retraction',
  ],
};

export const legs_warmup: Warmup = {
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

export const shoulders_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (bike or rower) to raise body temperature.',
    '30s overhead lat stretch each side / 30s cross-body shoulder stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '10 banded face pulls',
    '10 empty-bar overhead press reps focusing on bar path and lockout',
  ],
};

export const arms_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio of choice to raise heart rate.',
    '30s wrist flexor stretch each side / 30s wrist extensor stretch each side',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts',
    '1 light set of 15 cable curls / 1 light set of 15 tricep pushdowns to pump blood into the elbow joints',
  ],
};

// ─────────────────────────────────────────────────────────
// PRO BODYBUILDING - 5 DAY SPLIT
//
// Structure:
//   Mon - Chest
//   Tue - Back
//   Wed - Legs
//   Thu - Shoulders
//   Fri - Arms
//
// Phases:
//   Phase 1 (Weeks  1–4):  Foundation      - higher reps, form mastery, moderate load
//   Phase 2 (Weeks  5–8):  Hypertrophy     - volume peak, controlled load increase
//   Phase 3 (Weeks  9–12): Intensification - drop sets, AMRAP, lower reps, peak load
//   Phase 4 (Weeks 13–16): Peaking         - lower volume, maximum load, strength-hypertrophy
//
// Progressive overload mechanics:
//   - Compound rep ranges taper each phase
//   - Accessory rep ranges taper each phase
//   - Rest times increase as load increases
//   - AMRAP introduced Phase 3 on appropriate isolation exercises
//   - canSwap on all isolation machine exercises
// ─────────────────────────────────────────────────────────

export const bodybuilding_pro: Program = {
  id: 'bb_5day_pro_01',
  isPro: true,
  name: 'Pro Bodybuilding Split',
  description:
    '16-Week advanced bodybuilding program across 4 phases: Foundation, Hypertrophy, Intensification, and Peaking. 5 days per week with dedicated muscle group focus and systematic progressive overload.',
  categories: ['bodybuilding'],
  goals: ['bulking', 'hypertrophy', 'stronger'],
  difficulty: 'advanced',
  daysSplit: ['mon', 'tue', 'wed', 'thu', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 16 }).flatMap((_, week) => {
    // ── Phase logic ──────────────────────────────────────
    const phase = week < 4 ? 0 : week < 8 ? 1 : week < 12 ? 2 : 3;
    const phaseNames = [
      'Foundation',
      'Hypertrophy',
      'Intensification',
      'Peaking',
    ];
    const phaseName = phaseNames[phase];

    // ── Intensity per phase (with intra-phase progression) ──
    const baseIntensity = [7, 8, 9, 9][phase];
    const intraWeek = week % 4; // 0–3 within each phase
    const intensity = Math.min(baseIntensity + Math.floor(intraWeek / 2), 10);

    // ── Compound rep ranges taper each phase ──
    const compoundReps: [number, number] = (
      [
        [10, 12], // Foundation
        [8, 10], // Hypertrophy
        [6, 8], // Intensification
        [5, 6], // Peaking
      ] as [number, number][]
    )[phase];

    // ── Accessory rep ranges taper each phase ──
    const accessoryReps: [number, number] = (
      [
        [12, 15], // Foundation
        [10, 12], // Hypertrophy
        [8, 10], // Intensification
        [8, 10], // Peaking (same - isolation stays moderate)
      ] as [number, number][]
    )[phase];

    // ── Isolation rep ranges stay higher throughout ──
    const isolationReps: [number, number] = (
      [
        [15, 20], // Foundation
        [12, 15], // Hypertrophy
        [12, 15], // Intensification
        [10, 12], // Peaking
      ] as [number, number][]
    )[phase];

    // ── Rest times increase as loads increase ──
    const compoundRest = [120, 150, 150, 180][phase];
    const accessoryRest = [90, 90, 120, 120][phase];
    const isolationRest = 60;

    // ── AMRAP: only Intensification and Peaking phases, only isolation ──
    const useAmrap = phase >= 2;

    // ── Exercise variation: rotates every 2 weeks within each phase ──
    const variantA = intraWeek < 2; // weeks 1–2 of phase = variant A; weeks 3–4 = variant B

    return [
      // ───────────────────────────────────────────────────
      // DAY 1 - CHEST (Monday)
      // Structure: 2 compound movements + 2 isolation + rear delt health
      // Variation: Primary compound alternates barbell/dumbbell
      //            Secondary compound alternates incline/flat
      //            Isolation alternates cable flyes/pec deck
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Chest - Week ${week + 1} (${phaseName})`,
        description: variantA
          ? 'Barbell strength focus. Maximise load and upper chest development.'
          : 'Dumbbell range-of-motion focus. Prioritise stretch, squeeze, and mind-muscle connection.',
        intensity,
        exercises: [
          chest_warmup,
          {
            type: 'exercise',
            id: variantA ? 1 : 2, // Barbell Bench / DB Bench
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: variantA ? 'Foundation Strength' : 'Full Range',
            additionalDescription: variantA
              ? 'Controlled 2-second descent. Touch the lower chest lightly and drive explosively without bouncing. Maintain leg drive and a tight arch throughout.'
              : 'Allow the dumbbells to travel slightly deeper than a barbell would permit. Feel the full pec stretch at the bottom and squeeze hard at the top without touching the weights.',
          },
          {
            type: 'exercise',
            id: variantA ? 18 : 37, // Incline DB Press / Floor Press
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: variantA ? 'Upper Chest' : 'Tricep & Inner Chest',
            additionalDescription: variantA
              ? 'Use a 30–45° incline to maximise upper clavicular head activation. Control the descent - the stretch under load is where upper chest development happens.'
              : 'The floor limits the range of motion and removes the stretch reflex - this isolates the triceps and inner chest under pure muscular tension. Do not bounce off the floor.',
          },
          {
            type: 'exercise',
            id: variantA ? 36 : 78, // Cable Flyes / Pec Deck
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            isAmrap: useAmrap,
            additionalHeader: 'Pec Isolation',
            additionalDescription: variantA
              ? 'Do not lock out - keep constant tension on the pecs throughout. Think about wrapping your arms around a barrel. Squeeze for a full second at peak contraction.'
              : 'The pec deck locks your arms in the movement pattern so the chest must do all the work. Pause at the peak contraction and resist the urge to let the weight pull your arms back too far.',
          },
          {
            type: 'exercise',
            id: variantA ? 54 : 33, // Skull Crushers / Tricep Pushdowns
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: 'Tricep Accessory',
            additionalDescription: variantA
              ? 'Keep your elbows pointing at the ceiling throughout. Focus on the long head stretch at the bottom - elbows should not flare out to the sides.'
              : 'Keep your elbows pinned to your sides - only your forearms should move. Full extension at the bottom to maximise tricep contraction.',
          },
          {
            type: 'exercise',
            id: 56, // Reverse Flyes
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Posterior Health',
            additionalDescription:
              'Use light weight. Lead with the elbows and stop at shoulder height. This directly counteracts the anterior shoulder stress from all the pressing today and protects the rotator cuff over a 16-week block.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 2 - BACK (Tuesday)
      // Structure: 2 compound pulls (horizontal + vertical) + 2 accessories + core
      // Variation: Horizontal row alternates barbell/T-bar
      //            Vertical pull alternates pull-ups/lat pulldown
      //            Cable accessory alternates seated row/single arm row
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 1,
        label: `Back - Week ${week + 1} (${phaseName})`,
        description: variantA
          ? 'Barbell and pull-up focus for maximum back thickness and width.'
          : 'T-bar and pulldown focus for lat isolation and mid-back detail.',
        intensity,
        exercises: [
          back_warmup,
          {
            type: 'exercise',
            id: variantA ? 7 : 45, // Barbell Row / T-Bar Row
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: 'Back Thickness',
            additionalDescription: variantA
              ? 'Keep your torso rigid and parallel to the floor. Pull with your elbows, not your hands - drive them into your back pockets. This builds the mid-back thickness that defines a classic physique.'
              : 'Brace hard and keep your chest on the pad. Pull with your elbows and squeeze your shoulder blades together at the peak. T-bar rows allow a heavy neutral-grip load that the back responds extremely well to.',
          },
          {
            type: 'exercise',
            id: variantA ? 10 : 11, // Pull-ups / Lat Pulldown
            sets: 4,
            repRange: variantA ? [6, 10] : compoundReps,
            restTimeSeconds: compoundRest,
            canSwap: true,
            additionalHeader: 'Lat Width',
            additionalDescription: variantA
              ? 'Pull your chest to the bar - not just your chin. Initiate the movement by depressing your shoulder blades before bending your elbows. Full dead hang at the bottom on every rep.'
              : 'Lean back slightly and pull the bar to your upper chest. Initiate by pulling your shoulder blades down - drive your elbows toward your hips.',
          },
          {
            type: 'exercise',
            id: variantA ? 30 : 44, // Seated Cable Row / Single Arm Cable Row
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalDescription: variantA
              ? 'Slight forward lean at the start, sit tall at the peak. Squeeze your shoulder blades together and hold for a full beat before releasing. Think chest proud, not just arms back.'
              : 'Single arm allows a greater range of motion and rotation. Let the shoulder protract fully at the start, then retract and pull through, finishing with your elbow behind your torso.',
          },
          {
            type: 'exercise',
            id: variantA ? 46 : 47, // Straight Arm Pulldown / Single Arm Lat Pulldown
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            isAmrap: useAmrap,
            canSwap: true,
            additionalHeader: 'Lat Isolation',
            additionalDescription: variantA
              ? 'Keep your arms straight throughout - this is a lat isolation movement, not a row. Focus on pulling your shoulder blades down and feeling the lats contract fully at the bottom.'
              : 'Initiate by depressing the shoulder blade before bending the elbow. Focus on each side independently to address any lat development imbalances.',
          },
          {
            type: 'exercise',
            id: 86, // Sit-ups
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              'Controlled reps and smooth tempo. Avoid pulling on the neck - think ribs down, chin tucked, and exhale as you sit up. Stop each rep before your hip flexors take over.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 3 - LEGS (Wednesday)
      // Structure: Knee dominant compound + hip hinge + quad isolation
      //            + hamstring isolation + calf + core
      // Variation: Primary compound alternates barbell squat/hack squat
      //            Hip hinge alternates RDL/hip thrust
      //            Quad/hamstring isolation alternates even/odd weeks
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Legs - Week ${week + 1} (${phaseName})`,
        description: variantA
          ? 'Squat and RDL focus. Anterior and posterior chain loaded through full range.'
          : 'Hack squat and hip thrust focus. Maximum quad and glute hypertrophy.',
        intensity: Math.min(intensity + 1, 10), // Legs always highest intensity day
        exercises: [
          legs_warmup,
          {
            type: 'exercise',
            id: variantA ? 4 : 20, // Barbell Back Squat / Hack Squat
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: Math.min(compoundRest + 30, 180),
            additionalHeader: variantA ? 'King of Legs' : 'Quad Overload',
            additionalDescription: variantA
              ? 'Sit back and down - keep your chest proud throughout. At the bottom your thighs should be at or below parallel. Drive the floor away on the ascent and squeeze your glutes at the top.'
              : 'Hack squat allows a more upright torso and places extreme tension on the quads. Control the descent fully - do not bounce out of the bottom. Keep constant tension throughout.',
          },
          {
            type: 'exercise',
            id: variantA ? 22 : 41, // Romanian Deadlift / Hip Thrust
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: variantA ? 'Posterior Chain' : 'Glute Peak',
            additionalDescription: variantA
              ? 'Push your hips back as far as possible until you feel a deep hamstring stretch. Keep the bar close to your legs throughout. Drive your hips through to standing and squeeze your glutes hard at the top.'
              : 'Use a pad for the bar. Drive through your heels and squeeze your glutes for a full second at the top. Your shins should be vertical at peak contraction - if they are not, adjust your foot position.',
          },
          {
            type: 'exercise',
            id: variantA ? 39 : 40, // Leg Extension / Leg Curl
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            canSwap: true,
            isAmrap: useAmrap,
            additionalHeader: variantA
              ? 'Quad Isolation'
              : 'Hamstring Isolation',
            additionalDescription: variantA
              ? 'Pause for a full second at the top with legs fully extended. This peak contraction maximises rectus femoris activation. Control the eccentric - do not let the weight slam down.'
              : 'Slow and controlled throughout. Do not let the weight stack slam at the bottom - maintain tension on the hamstrings through the full range. Flex the hamstrings hard at peak contraction.',
          },
          {
            type: 'exercise',
            id: phase >= 2 ? 81 : 40, // Lying Leg Curl (Intensification+) / Seated Leg Curl (Foundation/Hypertrophy)
            sets: 3,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            canSwap: true,
            additionalHeader: 'Hamstring Detail',
            additionalDescription:
              phase >= 2
                ? 'The lying position stretches the hamstring differently to the seated variant - both positions are worth training across a full program. Control every rep.'
                : 'Seated leg curl places the hamstring in a stretched position throughout. Focus on a slow eccentric and a hard peak contraction.',
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
            id: variantA ? 48 : 31, // Cable Crunch / Hanging Leg Raise
            sets: 3,
            repRange: variantA ? [12, 15] : [10, 15],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core Finisher',
            additionalDescription: variantA
              ? 'Keep your hips still - the movement comes entirely from your spine. Exhale sharply as you crunch down and hold the peak contraction for a beat.'
              : 'Keep your legs as straight as possible. Curl your pelvis toward your belly button at the top to engage the lower abs. Avoid swinging - initiate every rep from a controlled dead hang.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 4 - SHOULDERS (Thursday)
      // Structure: 2 pressing movements + lateral raises + rear delt work
      //            + traps + core
      // Variation: Primary press alternates barbell OHP/machine press
      //            Secondary press alternates DB press/Arnold press
      //            Rear delt alternates face pulls/reverse flyes
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 3,
        label: `Shoulders - Week ${week + 1} (${phaseName})`,
        description: variantA
          ? 'Barbell overhead press focus. Strict strength through the full vertical pressing pattern.'
          : 'Machine and dumbbell focus. Shoulder detail and maximum isolation.',
        intensity,
        exercises: [
          shoulders_warmup,
          {
            type: 'exercise',
            id: variantA ? 26 : 28, // Barbell OHP / Machine Shoulder Press
            sets: 4,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: variantA ? 'Strict Press' : 'Controlled Load',
            additionalDescription: variantA
              ? 'No leg drive. Squeeze your glutes and brace your core to create a rigid base. Press the bar vertically - pull your head back slightly as the bar passes, then push your head through at the top.'
              : 'The machine eliminates stability demands and allows you to focus purely on deltoid recruitment. Control the weight both ways - do not let the stack crash between reps.',
          },
          {
            type: 'exercise',
            id: variantA ? 27 : 43, // DB Shoulder Press / Arnold Press
            sets: 3,
            repRange: compoundReps,
            restTimeSeconds: compoundRest,
            additionalHeader: variantA
              ? 'Unilateral Stability'
              : 'Full Rotation',
            additionalDescription: variantA
              ? 'Dumbbells allow each shoulder to work independently, exposing and correcting strength imbalances. Press in a slight arc and stop just short of the weights touching at the top.'
              : 'The rotation from palms-in at the bottom to palms-forward at the top recruits all three heads of the deltoid across the movement. Slow and deliberate - do not rush the rotation.',
          },
          {
            type: 'exercise',
            id: 34, // Lateral Raises
            sets: 4,
            repRange: isolationReps,
            restTimeSeconds: isolationRest,
            canSwap: true,
            isAmrap: useAmrap,
            additionalDescription:
              'The most important exercise for shoulder width. Lead with the elbows - imagine trying to touch the side walls. Stop slightly above shoulder height. Use lighter weight than feels necessary and focus on the burn.',
          },
          {
            type: 'exercise',
            id: variantA ? 35 : 56, // Face Pulls / Reverse Flyes
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Rear Delt',
            additionalDescription: variantA
              ? 'Pull the rope to your forehead with elbows flared high. Emphasise the external rotation at the end - this directly protects the rotator cuff across a heavy 16-week pressing program.'
              : 'Use light weight. Lead with the elbows and squeeze your shoulder blades together at the peak. Focus on feeling the rear deltoid contract, not the traps.',
          },
          {
            type: 'exercise',
            id: 49, // Russian Twists
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              'Keep your feet off the floor throughout. Rotate from the obliques, not just the arms. Add a light dumbbell or plate in Phases 2–4 to increase the challenge.',
          },
        ],
      },

      // ───────────────────────────────────────────────────
      // DAY 5 - ARMS (Friday)
      // Structure: 2 bicep movements + 2 tricep movements + forearms + core
      // Variation: Bicep compound alternates barbell/dumbbell curls
      //            Bicep isolation alternates preacher/hammer curls
      //            Tricep compound alternates skull crushers/overhead extension
      //            Tricep isolation alternates pushdowns/dips
      // Note: Arms day falls on Friday - any residual fatigue from the week
      //       is a non-issue since there is no pressing or pulling tomorrow.
      // ───────────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Arms - Week ${week + 1} (${phaseName})`,
        description: variantA
          ? 'Barbell and skull crusher focus. Maximum mechanical load through the elbow flexors and extensors.'
          : 'Dumbbell and cable focus. Range of motion, isolation, and the pump.',
        intensity: Math.max(intensity - 1, 6), // Arms day is slightly lower intensity - recovery day before the week resets
        exercises: [
          arms_warmup,
          // ── BICEPS ──
          {
            type: 'exercise',
            id: variantA ? 32 : 51, // DB Bicep Curls / Hammer Curls
            sets: 4,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: variantA
              ? 'Bicep Peak'
              : 'Brachialis & Thickness',
            additionalDescription: variantA
              ? 'Supinate (rotate) your wrist at the top of each rep to fully contract the bicep peak. Keep your elbows pinned to your sides - no swinging.'
              : 'Neutral grip targets the brachialis underneath the bicep - developing this muscle pushes the bicep peak higher. Keep your wrists straight and avoid rocking.',
          },
          {
            type: 'exercise',
            id: variantA ? 52 : 32, // Preacher Curls / DB Curls (different emphasis)
            sets: 3,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            isAmrap: useAmrap,
            additionalHeader: variantA ? 'Stretch & Peak' : 'Supination Focus',
            additionalDescription: variantA
              ? 'The preacher bench eliminates all momentum. Focus on the full stretch at the bottom - resisting the urge to bounce out of the bottom is where the growth happens.'
              : 'Alternate arms. As one curls, the other is descending - this keeps constant tension and maximises the pump. Supinate hard at the top of every rep.',
          },
          // ── TRICEPS ──
          {
            type: 'exercise',
            id: variantA ? 54 : 53, // Skull Crushers / Overhead Tricep Extension
            sets: 4,
            repRange: accessoryReps,
            restTimeSeconds: accessoryRest,
            additionalHeader: variantA ? 'Long Head Mass' : 'Full Stretch',
            additionalDescription: variantA
              ? "Elbows pointing at the ceiling, tucked close to your ears. Lower the bar to your forehead with control - the stretch at the bottom is critical. Don't let the elbows flare."
              : 'Overhead position puts the long head of the tricep in its most fully stretched position. This is the largest head and the key to arm size. Keep elbows pointing up throughout.',
          },
          {
            type: 'exercise',
            id: variantA ? 33 : 17, // Tricep Pushdowns / Dips
            sets: 3,
            repRange: variantA ? accessoryReps : [8, 12],
            restTimeSeconds: accessoryRest,
            canSwap: !variantA,
            isAmrap: useAmrap && variantA,
            additionalHeader: variantA ? 'Lateral Head' : 'Compound Finisher',
            additionalDescription: variantA
              ? 'Elbows pinned to your sides - only your forearms should move. Full extension at the bottom to maximise the peak contraction in the lateral head.'
              : 'Stay upright to keep the load on the triceps. Full range of motion - lockout at the top, full stretch at the bottom. These are an excellent mass builder to close out the week.',
          },
          // ── FOREARMS ──
          {
            type: 'exercise',
            id: 51, // Hammer Curls (doubles as forearm work in this slot)
            sets: 2,
            repRange: [15, 20],
            restTimeSeconds: 45,
            additionalHeader: 'Forearm Finisher',
            additionalDescription:
              'Light weight, high rep. Focus on the forearm and brachioradialis squeeze at the top of each rep. Grip strength directly supports every compound lift in this program.',
          },
          // ── CORE ──
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: isolationRest,
            additionalHeader: 'Core Finisher',
            additionalDescription:
              "Actively pull your elbows toward your toes - don't just 'hold' the plank. Squeeze your glutes and quads to create total body tension. This closes out the training week with foundational bracing work.",
          },
        ],
      },
    ];
  }),
};
