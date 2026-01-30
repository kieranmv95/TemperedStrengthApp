import { Program, Warmup } from "@/src/utils/program";

export const standard_warmup: Warmup = {
  type: "warmup",
  description: [
    "3-minute cardio of choice, run/row/bike to raise your heart rate.",
    "2 minutes of wrist stretches, ankle circles, and shoulder mobility exercises.",
    "3 sets of 5 Empty bar cleans / 5 front rack squat / 5 overhead squats",
  ],
};

export const olympic_advanced_8wk: Program = {
  isPro: true,
  id: "oly_adv_01",
  name: "Advanced Olympic Performance",
  description:
    "8-Week peak. Phase 1: Volume & Positional Strength. Phase 2: Speed & Maximal Singles.",
  daysSplit: ["mon", "wed", "fri"],
  averageSessionDuration: "60 min",
  workouts: Array.from({ length: 8 }).flatMap((_, week) => {
    const isPhase2 = week >= 4;
    const intensity = isPhase2
      ? 8 + Math.floor((week - 4) / 2)
      : 7 + Math.floor(week / 2);

    return [
      {
        dayIndex: week * 7 + 0,
        label: `Day 1: Snatch & Pull (Week ${week + 1})`,
        description: isPhase2
          ? "Heavy Singles & Speed"
          : "Snatch Complexes & Technical Volume",
        intensity: intensity,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: isPhase2 ? 57 : 59,
            sets: isPhase2 ? 5 : 4,
            repRange: isPhase2 ? [1, 2] : [3, 3],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalHeader: !isPhase2
              ? "Complex: Hang + Full"
              : "Full Snatch",
            additionalDescription: isPhase2
              ? "The goal is maximal speed under the bar. Focus on 'punching' the bar overhead and meeting it in a rock-solid bottom position."
              : "Use the hang rep to find your 'power position.' Keep the bar tight to the pockets. The second rep from the floor must mimic the bar path of the hang rep.",
          },
          {
            type: "exercise",
            id: 62,
            sets: 4,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalDescription:
              "Overload the pull. We want to build the 'traps-to-ears' finish. Keep your elbows high and outside; do not let the bar swing out.",
          },

          {
            type: "exercise",
            id: 61,
            sets: 3,
            repRange: [5, 5],
            restTimeSeconds: 120,
            additionalDescription:
              "Builds absolute confidence in the catch. Focus on 'stretching' the bar apart to engage the lats and keep the torso vertical.",
          },

          {
            type: "exercise",
            id: 35,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "Prehab for the rotator cuff. Pull the rope toward your forehead and emphasize the external rotation at the end of the movement.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: `Day 2: Clean, Jerk & Front Squat (Week ${week + 1})`,
        description: "Focus on leg drive and maximal front rack recovery.",
        intensity: intensity + 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 63,
            sets: 4,
            repRange: isPhase2 ? [1, 1] : [2, 2],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription: isPhase2
              ? "Clean & Jerk singles. Focus on a sharp, aggressive 'drive' in the jerk. Ensure the back knee is bent and weight is balanced between feet."
              : "Focus on the 're-rack.' Keep the elbows up high in the catch of the clean so the bar doesn't slide forward during the transition to the jerk.",
          },
          {
            type: "exercise",
            id: 68,
            sets: 5,
            repRange: isPhase2 ? [2, 3] : [5, 5],
            restTimeSeconds: 150,
            additionalDescription:
              "This is your primary strength builder. No 'soft' catches—treat every rep like you are recovering from a heavy clean.",
          },
          {
            type: "exercise",
            id: 69,
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalDescription:
              "Builds the explosive 'finish' of the clean. Ensure the hips reach full extension before the arms start pulling.",
          },
          {
            type: "exercise",
            id: 11,
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Lats are the 'brakes' of the snatch and clean. Use a slow pace to build pulling control.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: `Day 3: The Total & Structural Balance (Week ${week + 1})`,
        description:
          "Maximal effort competition lifts followed by unilateral accessories.",
        intensity: intensity + 1,
        exercises: [
          standard_warmup,
          {
            type: "exercise",
            id: 57,
            sets: 5,
            repRange: isPhase2 ? [1, 1] : [2, 2],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription:
              "Competition mindset. Clear the mind, find your start position, and execute. Look for consistency in foot landing.",
          },
          {
            type: "exercise",
            id: 63,
            sets: 5,
            repRange: isPhase2 ? [1, 1] : [1, 1],
            restTimeSeconds: isPhase2 ? 180 : 150,
            additionalDescription:
              "Drive through the heels on the clean. In the jerk, focus on a vertical drive—do not let the chest dip forward.",
          },
          {
            type: "exercise",
            id: 6,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalDescription:
              "Fixes side-to-side imbalances. This prevents 'helicoptering' (rotating) during heavy cleans or snatches.",
          },

          {
            type: "exercise",
            id: 22,
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalDescription:
              "Develops the glute drive needed for the 'second pull.'",
          },
          {
            type: "exercise",
            id: 13,
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalDescription:
              "Anti-extension core strength. This protects the lower back when catching heavy weights overhead.",
          },
        ],
      },
    ];
  }),
};
