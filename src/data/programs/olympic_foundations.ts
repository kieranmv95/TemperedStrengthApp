import type { Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3-minute cardio of choice, run/row/bike to raise your heart rate.',
    '2 minutes of wrist stretches, ankle circles, and shoulder mobility exercises.',
    '3 sets of 5 Empty bar cleans / 5 front rack squat / 5 overhead squats',
  ],
};

export const olympic_foundations: Program = {
  isPro: false,
  id: 'oly_01',
  name: 'Olympic Foundations',
  description:
    '4-Week technical build-up for Snatch and Clean & Jerk. Focuses on bar path, speed, and overhead stability.',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    const baseIntensity = 7 + Math.floor(week / 2);

    return [
      // ─────────────────────────────────────────────
      // DAY 1 - Snatch Focus (Monday)
      // FIX 1: Overhead Squat moved to first exercise (after warmup).
      //         Positional/stability drills must come before the partial
      //         movement (Hang Snatch), not after. The original order had
      //         Hang Snatch → OHS → High Pull which is pedagogically backwards.
      // FIX 2: Overhead Squat reduced from 5×5 to 3×3. 5×5 OHS before
      //         Hang Snatches and High Pulls over-fatigues shoulder
      //         stabilisers. In a technical foundations program, OHS
      //         serves as a positional primer - 3×3 is the correct volume.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Day 1: Snatch Focus (Week ${week + 1})`,
        description:
          'Technical Snatch day focusing on the overhead catch and vertical pull.',
        intensity: baseIntensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 61, // Overhead Squat - MOVED to first, REDUCED to 3×3
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 90,
            additionalHeader: 'Positional Primer',
            additionalDescription:
              "Open every Snatch session here. The goal is total overhead rigidity - keep your elbows locked and 'push' the ceiling away. Lower slowly to groove the bottom position before you load it with speed.",
          },
          {
            type: 'exercise',
            id: 59, // Hang Snatch
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalHeader: 'Technical Primer',
            additionalDescription:
              "Starting from the 'hang' position (bar at mid-thigh). Focus on the 'brush' against the hips and staying vertical. Do not let the bar swing out away from your body.",
          },
          {
            type: 'exercise',
            id: 62, // Snatch High Pull
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: 'Pulling Mechanics',
            additionalDescription:
              "Focus on 'triple extension' (ankles, knees, and hips). Pull the bar as high as possible while keeping it close to your chest. High elbows are key.",
          },
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              "Anti-extension core strength. A rock-solid core prevents the 'back-arching' that leads to missed lifts and injury.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 - Clean & Jerk Focus (Wednesday)
      // FIX 1: Intensity bumped to baseIntensity + 1. The Clean & Jerk
      //         is a two-movement lift requiring the highest technical and
      //         physical demand of any session - it should reflect that.
      // FIX 2: Seated Cable Row added after Front Squat. Day 2 had no
      //         horizontal pull or back reinforcement at all. Upper back
      //         and lat strength are critical for maintaining the front rack
      //         position and keeping the bar close during the pull.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Day 2: Clean & Jerk Focus (Week ${week + 1})`,
        description:
          'Focusing on the front rack position and leg drive for the Jerk.',
        intensity: Math.min(baseIntensity + 1, 10), // FIX: C&J is the most demanding session
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 65, // Hang Clean
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalDescription:
              "Clean from the hang. Focus on a fast 'elbow turnover.' Your elbows should snap around the bar to land in a high front rack position.",
          },
          {
            type: 'exercise',
            id: 66, // Split Jerk
            sets: 3,
            repRange: [2, 3],
            restTimeSeconds: 120,
            additionalHeader: 'Footwork Focus',
            additionalDescription:
              "Focus on the 'split.' The front shin should be vertical, and the back knee should be slightly bent. Stability is more important than depth here.",
          },
          {
            type: 'exercise',
            id: 68, // Front Squat
            sets: 4,
            repRange: [5, 5],
            restTimeSeconds: 150,
            additionalDescription:
              'The engine of Olympic lifting. Keep your chest up and elbows high. If your elbows drop, the weight will pull you forward.',
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row - ADDED for back/front rack support
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalHeader: 'Back Reinforcement',
            additionalDescription:
              'Upper back strength is essential for maintaining a high front rack and keeping the bar close during the pull. Squeeze your shoulder blades together at the peak contraction.',
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Strengthens the hip flexors and lower abs, which are vital for 'pulling yourself under the bar' quickly.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 - Full Classic Lifts (Friday)
      // FIX 1: Barbell Deadlift (id: 14) replaced with Clean High Pull (id: 69).
      //         The original labelled the deadlift as a "Clean Pull Variation"
      //         and described it as mimicking the first pull of a clean. That
      //         is precisely what the Clean High Pull is - it exists in the DB
      //         for this exact purpose and carries the correct pattern, muscle
      //         tagging, and bar path intent.
      // FIX 2: AMRAP Dips replaced with Good Mornings (id: 42). Day 3 is the
      //         most technically demanding session of the week. Finishing with
      //         AMRAP chest/tricep work is a poor fit - it adds fatigue that
      //         carries into Monday's Snatch session. Good Mornings directly
      //         reinforce the hip hinge mechanics practised all session and
      //         strengthen the posterior chain that drives the first pull.
      // FIX 3: Testing week intensity fixed to 10. The original logic set
      //         week 4 (testing) to intensity 9, while week 3's Day 3 was
      //         also 9 (baseIntensity 8 + 1). Testing week should be the
      //         peak - 10.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Day 3: Full Classic Lifts (Week ${week + 1})`,
        description:
          week === 3
            ? 'Max Effort: Testing technical heavy singles.'
            : 'Integrating the full movements at moderate intensity.',
        intensity: week === 3 ? 10 : Math.min(baseIntensity + 1, 10), // FIX: testing week is 10, not 9
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 57, // Full Snatch
            sets: 5,
            repRange: week === 3 ? [1, 2] : [2, 3],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalHeader: week === 3 ? 'Heavy Single' : 'Full Movement',
            additionalDescription:
              "Merging the pull and the catch. Keep the bar path vertical. In Week 4, focus on a heavy but 'perfect' technical rep.",
          },
          {
            type: 'exercise',
            id: 63, // Clean & Jerk
            sets: 5,
            repRange: week === 3 ? [1, 1] : [1, 2],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalDescription:
              "The ultimate test of power. Ensure the clean is stable before beginning your dip for the jerk. Don't rush the transition.",
          },
          {
            type: 'exercise',
            id: 69, // Clean High Pull - REPLACED Barbell Deadlift
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: 'Clean Pull Accessory',
            additionalDescription:
              'Use a clean grip and focus on triple extension - ankles, knees, and hips firing in sequence. This directly reinforces the first and second pull mechanics from your clean work earlier in the session. Keep the bar close and pull the elbows high.',
          },
          {
            type: 'exercise',
            id: 42, // Good Mornings - REPLACED AMRAP Dips
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalHeader: 'Posterior Chain Finisher',
            additionalDescription:
              'Keep a slight bend in the knees and hinge from the hips - not the lower back. This strengthens the hamstrings and spinal erectors that power your first pull off the floor. Use light-to-moderate weight and focus on feeling the hamstring stretch at the bottom.',
          },
        ],
      },
    ];
  }),
};
