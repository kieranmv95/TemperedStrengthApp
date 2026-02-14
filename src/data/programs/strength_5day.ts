import type { Program, Warmup } from "@/src/types/program";

export const standard_warmup: Warmup = {
  type: "warmup",
  description: [
    "3–5 minutes light cardio (rower, bike, or brisk walk) to raise body temperature.",
    "30s hip flexor stretch each side / 30s hamstring stretch",
    "10 arm circles forward / 10 arm circles backward",
    "10 band pull-aparts or scapular wall slides",
    "10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side",
    "10 glute bridges with 2s pause at the top",
    "10 bodyweight squats focusing on depth and control",
  ],
};

export const strength_5day: Program = {
  isPro: true,
  id: "strength_5day",
  name: "5-Day Power & Strength",
  description:
    "6-Week Strength Peak. Intensifies every 2 weeks through progressive overload and rep-range tapering.",
  daysSplit: ["mon", "tue", "wed", "thu", "fri"],
  averageSessionDuration: "60 min",
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity = week < 2 ? 7 : week < 4 ? 8 : 9;
    const phase = week < 2 ? "Volume" : week < 4 ? "Strength" : "Peak";
    const reps = [
      [8, 10],
      [5, 8],
      [3, 5],
    ][week < 2 ? 0 : week < 4 ? 1 : 2] as [number, number];

    return [
      {
        dayIndex: week * 7 + 0,
        label: `Chest & Back (Heavy) - Week ${week + 1}`,
        description: `Phase: ${phase}. Primary upper body compound focus.`,
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 1,
            sets: 4,
            repRange: reps,
            restTimeSeconds: intensity >= 9 ? 180 : 150,
            additionalHeader: "Main Power Lift",
            additionalDescription:
              "Maintain a tight arch and drive your feet into the floor. As reps drop, increase the rest time between sets to ensure maximum power output.",
          },

          {
            type: "exercise",
            id: 7,
            sets: 4,
            repRange: reps,
            restTimeSeconds: 120,
            additionalDescription:
              "Brace your core and keep your back flat. Avoid 'shrugging' the weight; pull with your elbows to target the mid-back and lats.",
          },
          {
            type: "exercise",
            id: 18,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Higher incline targets the upper clavicular head of the chest. Control the weight on the way down for a deep stretch.",
          },
          {
            type: "exercise",
            id: 30,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Maintain a slight bend in the knees. Focus on pulling the handle to your belly button while keeping your shoulders down.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 1,
        label: `Lower Body (Squat focus) - Week ${week + 1}`,
        description:
          "Developing maximal leg power and anterior chain strength.",
        intensity: intensity + 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 4,
            sets: 5,
            repRange: reps,
            restTimeSeconds: intensity >= 9 ? 180 : 150,
            additionalHeader: "Primary Mover",
            additionalDescription:
              "Sit back into the movement and keep your chest proud. In the 'Peak' phase (Weeks 5-6), focus on a fast, aggressive ascent.",
          },

          {
            type: "exercise",
            id: 19,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              "Keep your feet high on the platform to involve more glutes and hamstrings, or lower to focus on the quads.",
          },
          {
            type: "exercise",
            id: 40,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalHeader: "Hamstring Isolation",
            additionalDescription:
              "Slow and controlled. Do not let the weight stack 'slam' at the bottom; maintain tension on the hamstrings throughout.",
          },
          {
            type: "exercise",
            id: 13,
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              "Total body tension. Squeeze your glutes and quads to create a rigid bridge, protecting the lower back after heavy squatting.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: `Shoulders & Arms - Week ${week + 1}`,
        description: "Structural balance and upper body hypertrophy.",
        intensity: intensity - 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 26,
            sets: 4,
            repRange: [6, 8],
            restTimeSeconds: 120,
            additionalHeader: "Strict Press",
            additionalDescription:
              "No leg drive. Keep your core locked. Press the bar in a straight line, pulling your head back slightly as the bar passes your face.",
          },

          {
            type: "exercise",
            id: 34,
            sets: 4,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Lead with the elbows. Imagine trying to touch the side walls with your dumbbells rather than lifting them 'up'.",
          },
          {
            type: "exercise",
            id: 51,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 60,
            additionalDescription:
              "Neutral grip targets the brachialis and forearms. Keep your wrists straight and avoid swinging.",
          },
          {
            type: "exercise",
            id: 54,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 60,
            additionalDescription:
              "Keep your elbows 'tucked in' toward your ears. Focus on the stretch at the bottom of the movement.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 3,
        label: `Lower Body (Deadlift focus) - Week ${week + 1}`,
        description: "Posterior chain development and pulling power.",
        intensity: intensity + 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 14,
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 180,
            additionalHeader: "Max Pull",
            additionalDescription:
              "Wedge your hips close to the bar. Pull the slack out before the lift. This is a technical lift—reset your position for every single rep.",
          },

          {
            type: "exercise",
            id: 6,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              "Elevate your rear foot. Focus on keeping your front knee aligned with your toes. This is brutal but essential for hip stability.",
          },
          {
            type: "exercise",
            id: 41,
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "The best glute builder. Use a pad for the bar. Squeeze your glutes for a full second at the top of the movement.",
          },
          {
            type: "exercise",
            id: 48,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Exhale sharply as you crunch down. This helps engage the deep abdominal muscles.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: `Upper Body Hypertrophy - Week ${week + 1}`,
        description:
          "Focus on mind-muscle connection, isolation, and the 'pump'.",
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 2,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Focus on the inner chest squeeze. Do not touch the dumbbells together at the top—keep the tension on the muscle.",
          },
          {
            type: "exercise",
            id: 11,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Lean back slightly and pull the bar to your upper chest. Focus on driving your shoulder blades down and back.",
          },
          {
            type: "exercise",
            id: 17,
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            isAmrap: week === 5,
            additionalDescription:
              "Lean forward for more chest, stay upright for more triceps. On Week 6, go until you cannot push back up.",
          },
          {
            type: "exercise",
            id: 56,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Target the rear delts. Squeeze your shoulder blades together at the top. Use light weights and perfect form.",
          },
        ],
      },
    ];
  }),
};
