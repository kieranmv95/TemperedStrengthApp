import { Program } from "@/src/utils/program";

export const olympic_foundations: Program = {
  isPro: false,
  id: "oly_01",
  name: "Olympic Foundations",
  description:
    "4-Week technical build-up for Snatch and Clean & Jerk. Focuses on bar path, speed, and overhead stability.",
  daysSplit: ["mon", "wed", "fri"],
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
          {
            id: 59,
            sets: 3,
            repRange: [3, 3],
            additionalHeader: "Technical Primer",
            additionalDescription:
              "Starting from the 'hang' position (bar at mid-thigh). Focus on the 'brush' against the hips and staying vertical. Do not let the bar swing out away from your body.",
          },

          {
            id: 61,
            sets: 5,
            repRange: [5, 5],
            additionalDescription:
              "The goal is total overhead rigidity. Keep your elbows locked and 'push' the ceiling away. Lower slowly to build stability in the bottom of the squat.",
          },

          {
            id: 62,
            sets: 3,
            repRange: [3, 5],
            additionalHeader: "Pulling Mechanics",
            additionalDescription:
              "Focus on the 'triple extension' (ankles, knees, and hips). Pull the bar as high as possible while keeping it close to your chest. High elbows are key.",
          },

          {
            id: 13,
            sets: 3,
            repRange: [45, 60],
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
          {
            id: 65,
            sets: 3,
            repRange: [3, 3],
            additionalDescription:
              "Clean from the hang. Focus on a fast 'elbow turnover.' Your elbows should snap around the bar to land in a high front rack position.",
          },

          {
            id: 66,
            sets: 3,
            repRange: [2, 3],
            additionalHeader: "Footwork Focus",
            additionalDescription:
              "Focus on the 'split.' The front shin should be vertical, and the back knee should be slightly bent. Stability is more important than depth here.",
          },

          {
            id: 68,
            sets: 4,
            repRange: [5, 5],
            additionalDescription:
              "The engine of Olympic lifting. Keep your chest up and elbows high. If your elbows drop, the weight will pull you forward.",
          },
          {
            id: 31,
            sets: 3,
            repRange: [10, 15],
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
          {
            id: 57,
            sets: 5,
            repRange: week === 3 ? [1, 2] : [2, 3],
            additionalHeader: week === 3 ? "Heavy Single" : "Full Movement",
            additionalDescription:
              "Merging the pull and the catch. Keep the bar path vertical. In Week 4, focus on a heavy but 'perfect' technical rep.",
          },

          {
            id: 63,
            sets: 5,
            repRange: week === 3 ? [1, 1] : [1, 2],
            additionalDescription:
              "The ultimate test of power. Ensure the clean is stable before beginning your dip for the jerk. Don't rush the transition.",
          },
          {
            id: 14,
            sets: 3,
            repRange: [3, 5],
            additionalHeader: "Clean Pull Variation",
            additionalDescription:
              "Use a 'Clean Grip.' This isn't a standard deadlift—keep your hips slightly lower and shoulders over the bar to mimic the first pull of a clean.",
          },

          {
            id: 17,
            sets: 3,
            repRange: [8, 12],
            isAmrap: true,
            additionalDescription:
              "Builds tricep and shoulder 'lockout' strength. Essential for supporting heavy weights overhead without collapsing.",
          },
        ],
      },
    ];
  }),
};
