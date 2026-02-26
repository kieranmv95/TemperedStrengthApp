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

export const ppl_01: Program = {
  id: 'ppl_01',
  isPro: false,
  name: '3 Day Split',
  description:
    '4-Week Hypertrophy block. Rotates intensity and exercise variations to maximize muscle fiber recruitment.',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60 min',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    // FIX: Intensity now trends upward (7→7→8→8) rather than oscillating
    // (7→8→7→8). The barbell/dumbbell variation already provides the weekly
    // contrast — intensity should reflect genuine progression, not yo-yo.
    const pushPullIntensity = week < 2 ? 7 : 8;

    return [
      // ─────────────────────────────────────────────
      // PUSH DAY (Monday)
      // FIX 1: Shoulder press now alternates between Barbell OHP (even weeks,
      //         id: 26) and DB Shoulder Press (odd weeks, id: 27) at [8, 10]
      //         with 120s rest — giving it proper compound weight rather than
      //         treating it as a light accessory at [10, 12] / 60s.
      // FIX 2: Tricep Pushdowns alternate with Reverse Flyes (id: 56) on odd
      //         weeks. 4 weeks of heavy pressing with no direct rear delt
      //         protection on the Push day is a shoulder health risk. Reverse
      //         Flyes on the day they're needed most (the heaviest pressing day)
      //         directly counterbalances the anterior shoulder load.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Push (Week ${week + 1})`,
        description:
          week % 2 === 0 ? 'Heavy Barbell Focus' : 'Dumbbell & Volume Focus',
        intensity: pushPullIntensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 1 : 2, // Barbell Bench (even) / DB Bench (odd)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 150,
            additionalHeader:
              week % 2 === 0 ? 'Foundation Strength' : 'Stability & Range',
            additionalDescription:
              week % 2 === 0
                ? 'Barbell Bench: Focus on a controlled 2-second eccentric (lowering phase). Touch the chest lightly and drive up without bouncing.'
                : 'DB Bench: Allow the dumbbells to come slightly deeper than a barbell would. Focus on the stretch at the bottom and a hard squeeze at the top.',
          },
          {
            type: 'exercise',
            // FIX: Shoulder press now alternates and carries proper compound weight.
            // Even weeks: Barbell OHP — strict, heavier vertical push.
            // Odd weeks: DB Shoulder Press — natural arc, unilateral stability.
            id: week % 2 === 0 ? 26 : 27,
            sets: 3,
            repRange: [8, 10], // FIX: was [10, 12] at 60s — treated as accessory, not compound
            restTimeSeconds: 120,
            additionalHeader:
              week % 2 === 0 ? 'Strict Press' : 'Dumbbell Press',
            additionalDescription:
              week % 2 === 0
                ? 'No leg drive. Brace your core and glutes to create a stable base. Press the bar in a straight vertical line, pulling your head back slightly as it passes your face.'
                : 'Keep your core tight and avoid using momentum. Press the weights up in a slight arc so they meet at the top without touching.',
          },
          {
            type: 'exercise',
            id: 36, // Cable Flyes
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalHeader: 'Constant Tension',
            additionalDescription:
              'Do not fully lock out at the end of the movement. Keep the tension on the pectorals throughout the entire set. Think about hugging a large tree.',
          },
          {
            type: 'exercise',
            // FIX: Tricep Pushdowns alternate with Reverse Flyes.
            // Even weeks: Tricep Pushdowns (id: 33) — tricep isolation finisher.
            // Odd weeks: Reverse Flyes (id: 56) — rear delt protection on the
            // day it's needed most. Face Pulls on Pull day cover rear delts mid-week
            // but with 3 push sessions in 4 weeks, Push day needs its own
            // counterbalance too.
            id: week % 2 === 0 ? 33 : 56,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            isAmrap: week % 2 === 0 && week === 3, // AMRAP only on tricep pushdowns in final week
            additionalHeader:
              week % 2 === 0 ? 'Tricep Finisher' : 'Rear Delt Protection',
            additionalDescription:
              week % 2 === 0
                ? 'Keep your elbows tucked and stationary. Only your forearms should move. On the final week, push until your form starts to break.'
                : 'Use light weight and prioritise the squeeze. Lead with the elbows and stop just below shoulder height. This directly counteracts the anterior shoulder stress from all the pressing.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // PULL DAY (Wednesday)
      // FIX 1: Intensity now scales with pushPullIntensity (7→7→8→8) instead
      //         of being hardcoded at 7 all 4 weeks. Pull was the only day
      //         that never progressed.
      // FIX 2: Pull-ups canSwap: true added — non-pro program, broad audience.
      // FIX 3: Dumbbell Bicep Curl isAmrap gated to week >= 3. Unconditional
      //         AMRAP from week 1 encourages form breakdown from the first
      //         session. Final two weeks only.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Pull (Week ${week + 1})`,
        description: 'Mid-back and Lat development with bicep finishers.',
        intensity: pushPullIntensity, // FIX: was hardcoded 7 all 4 weeks
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 7 : 8, // Barbell Row (even) / Dumbbell Row (odd)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 120,
            additionalHeader: 'Back Thickness',
            additionalDescription:
              'Think of your hands as hooks. Pull with your elbows and imagine trying to put them in your back pockets to fully engage the lats.',
          },
          {
            type: 'exercise',
            id: 10, // Pull-ups
            sets: 3,
            repRange: [6, 10],
            restTimeSeconds: 120,
            canSwap: true, // FIX: not all users can perform bodyweight pull-ups
            additionalDescription:
              'Pull your chest to the bar, not just your chin. Squeeze your shoulder blades together at the top of every rep. If bodyweight pull-ups are not yet accessible, swap to the Assisted Pull-up Machine or Lat Pulldown.',
          },
          {
            type: 'exercise',
            id: 35, // Face Pulls
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            additionalDescription:
              "A high-rep 'pump' movement. Pull the rope toward your eyes and pull the ends apart to target the rear deltoids and traps.",
          },
          {
            type: 'exercise',
            id: 32, // Dumbbell Bicep Curls
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 60,
            isAmrap: week >= 3, // FIX: was unconditional — now gated to final two weeks only
            additionalHeader: 'Bicep Peak',
            additionalDescription:
              'No swinging. Keep your back against a wall or post if you find yourself using your hips to move the weight.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // LEGS DAY (Friday)
      // FIX 1: Leg Extension (id: 39) now alternates with Leg Curl (id: 40)
      //         on odd weeks. The original had 2 quad movements (squat + leg
      //         extension) vs 1 hamstring hinge (RDL) — heavily quad-dominant.
      //         Alternating gives both muscle groups direct isolation work
      //         without adding overall volume.
      // FIX 2: RDL "snap forward" cue corrected. That phrase implies lumbar
      //         hyperextension at the top of the movement, which is a common
      //         injury mechanism. Replaced with correct cue: drive hips through
      //         and squeeze glutes to standing.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Legs (Week ${week + 1})`,
        description: 'Compound leg movements followed by high-rep isolation.',
        intensity: 8 + (week === 3 ? 1 : 0),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: week % 2 === 0 ? 4 : 19, // Barbell Back Squat (even) / Leg Press (odd)
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 150,
            additionalHeader: 'Primary Mover',
            additionalDescription:
              week % 2 === 0
                ? 'Barbell Squats: Maintain a vertical chest. Break at the hips and knees simultaneously. Drive through the mid-foot.'
                : "Leg Press: Place feet shoulder-width apart. Don't let your lower back lift off the seat at the bottom of the movement.",
          },
          {
            type: 'exercise',
            id: 23, // DB Romanian Deadlift
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 120,
            additionalDescription:
              'Focus on the hinge. Push your hips as far back as possible until you feel a deep stretch in your hamstrings, then drive your hips through to standing and squeeze your glutes at the top.', // FIX: removed "snap forward" — dangerous cue implying lumbar hyperextension
          },
          {
            type: 'exercise',
            // FIX: Leg Extension (quad isolation) alternates with Leg Curl
            // (hamstring isolation) on odd weeks. Original was quad-dominant:
            // squat + leg extension with only one hamstring movement (RDL).
            id: week % 2 === 0 ? 39 : 40,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            canSwap: true,
            additionalHeader:
              week % 2 === 0 ? 'Quad Isolation' : 'Hamstring Isolation',
            additionalDescription:
              week % 2 === 0
                ? 'Pause for 1 second at the top of each rep with legs fully extended to maximize the contraction of the rectus femoris.'
                : "Slow and controlled. Do not let the weight stack 'slam' at the bottom — maintain tension on the hamstrings throughout the full range.",
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            isAmrap: true,
            additionalDescription:
              'Keep your legs as straight as possible. Curl your pelvis toward your belly button at the top to engage the lower abdominals.',
          },
        ],
      },
    ];
  }),
};
