import type { Program, Warmup } from "@/src/types/program";

export const standard_warmup: Warmup = {
  type: "warmup",
  description: [
    "3-minute cardio of choice, run/row/bike to raise your heart rate.",
    "2 minutes of wrist stretches, ankle circles, and shoulder mobility exercises.",
    "3 sets of 5 Empty bar cleans / 5 front rack squat / 5 overhead squats",
  ],
};

export const olympic_foundations: Program = {
  isPro: false,
  id: "oly_01",
  name: "Olympic Foundations",
  description:
    "4-Week technical build-up for Snatch and Clean & Jerk. Focuses on bar path, speed, and overhead stability.",
  daysSplit: ["mon", "wed", "fri"],
  averageSessionDuration: "60 min",
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    const baseIntensity = 7 + Math.floor(week / 2);

    return [
      {
        dayIndex: week * 7 + 0,
        label: `Day 1: Snatch Focus (Week ${week + 1})`,
        description:
          "Technical Snatch day focusing on the overhead catch and vertical pull.",
        intensity: baseIntensity,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 59,
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalHeader: "Technical Primer",
            additionalDescription:
              "Starting from the 'hang' position (bar at mid-thigh). Focus on the 'brush' against the hips and staying vertical. Do not let the bar swing out away from your body.",
          },

          {
            type: "exercise",
            id: 61,
            sets: 5,
            repRange: [5, 5],
            restTimeSeconds: 120,
            additionalDescription:
              "The goal is total overhead rigidity. Keep your elbows locked and 'push' the ceiling away. Lower slowly to build stability in the bottom of the squat.",
          },

          {
            type: "exercise",
            id: 62,
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: "Pulling Mechanics",
            additionalDescription:
              "Focus on the 'triple extension' (ankles, knees, and hips). Pull the bar as high as possible while keeping it close to your chest. High elbows are key.",
          },

          {
            type: "exercise",
            id: 13,
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              "Anti-extension core strength. A rock-solid core prevents the 'back-arching' that leads to missed lifts and injury.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: `Day 2: Clean & Jerk Focus (Week ${week + 1})`,
        description:
          "Focusing on the front rack position and leg drive for the Jerk.",
        intensity: baseIntensity,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 65,
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalDescription:
              "Clean from the hang. Focus on a fast 'elbow turnover.' Your elbows should snap around the bar to land in a high front rack position.",
          },

          {
            type: "exercise",
            id: 66,
            sets: 3,
            repRange: [2, 3],
            restTimeSeconds: 120,
            additionalHeader: "Footwork Focus",
            additionalDescription:
              "Focus on the 'split.' The front shin should be vertical, and the back knee should be slightly bent. Stability is more important than depth here.",
          },

          {
            type: "exercise",
            id: 68,
            sets: 4,
            repRange: [5, 5],
            restTimeSeconds: 150,
            additionalDescription:
              "The engine of Olympic lifting. Keep your chest up and elbows high. If your elbows drop, the weight will pull you forward.",
          },
          {
            type: "exercise",
            id: 31,
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Strengthens the hip flexors and lower abs, which are vital for 'pulling yourself under the bar' quickly.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: `Day 3: Full Classic Lifts (Week ${week + 1})`,
        description:
          week === 3
            ? "Max Effort: Testing technical heavy singles."
            : "Integrating the full movements at moderate intensity.",
        intensity: week === 3 ? 9 : baseIntensity + 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 57,
            sets: 5,
            repRange: week === 3 ? [1, 2] : [2, 3],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalHeader: week === 3 ? "Heavy Single" : "Full Movement",
            additionalDescription:
              "Merging the pull and the catch. Keep the bar path vertical. In Week 4, focus on a heavy but 'perfect' technical rep.",
          },

          {
            type: "exercise",
            id: 63,
            sets: 5,
            repRange: week === 3 ? [1, 1] : [1, 2],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalDescription:
              "The ultimate test of power. Ensure the clean is stable before beginning your dip for the jerk. Don't rush the transition.",
          },
          {
            type: "exercise",
            id: 14,
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: "Clean Pull Variation",
            additionalDescription:
              "Use a 'Clean Grip.' This isn't a standard deadlift—keep your hips slightly lower and shoulders over the bar to mimic the first pull of a clean.",
          },

          {
            type: "exercise",
            id: 17,
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 60,
            isAmrap: true,
            additionalDescription:
              "Builds tricep and shoulder 'lockout' strength. Essential for supporting heavy weights overhead without collapsing.",
          },
        ],
      },
    ];
  }),
};
