import { Program } from "@/src/utils/program";

// 4. POWERLIFTING (8 Weeks)
export const powerlifting_3day: Program = {
  id: "power_01",
  isPro: false,
  name: "Traditional Powerlifting (SBD)",
  description:
    "8-Week Peaking Program. Volume drops as intensity climbs to a Week 8 testing session.",
  daysSplit: ["mon", "wed", "fri"],
  workouts: Array.from({ length: 8 }).flatMap((_, week) => {
    const isTestingWeek = week === 7;
    const mainReps: [number, number] =
      week < 3 ? [8, 8] : week < 6 ? [5, 5] : [2, 3];
    const baseIntensity = week < 3 ? 7 : week < 6 ? 8 : 9;

    return [
      {
        dayIndex: week * 7 + 0,
        label: "Squat Focus",
        description: isTestingWeek
          ? "TESTING DAY: New 1RM Squat"
          : "High intensity squatting and quad accessories.",
        intensity: isTestingWeek ? 10 : baseIntensity + 1,
        exercises: [
          {
            id: 4,
            sets: week < 4 ? 4 : 5,
            repRange: mainReps,
            hideReps: isTestingWeek ? true : false,
            additionalHeader: isTestingWeek ? "1RM Test" : "Competition Squat",
            additionalDescription: isTestingWeek
              ? "The culmination of 8 weeks. Take 3-5 warm-up sets, then attempt your new Max. Focus: Big breath, tight back, and drive the hips."
              : "Focus on 'rooting' your feet into the floor. Create maximum intra-abdominal pressure. Descent should be controlled, ascent should be explosive.",
          },

          {
            id: 22,
            sets: 3,
            repRange: [8, 10],
            additionalDescription:
              "RDLs are here to protect your back. Keep the bar glued to your thighs and stop at mid-shin. You should feel a massive stretch in the hamstrings.",
          },
          {
            id: 19,
            sets: 3,
            repRange: [10, 12],
            additionalDescription:
              "Pure quad hypertrophy to support your squat out of the hole. Keep your feet low on the platform to emphasize the knees.",
          },
          {
            id: 13,
            sets: 3,
            repRange: [45, 60],
            additionalDescription:
              "Bracing practice. Do not just 'hold' the plank; actively pull your elbows toward your toes to engage the deep core.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: "Bench Focus",
        description: isTestingWeek
          ? "TESTING DAY: New 1RM Bench"
          : "Competition bench form and shoulder stability.",
        intensity: isTestingWeek ? 10 : baseIntensity,
        exercises: [
          {
            id: 1,
            sets: week < 4 ? 4 : 5,
            repRange: mainReps,
            hideReps: isTestingWeek ? true : false,
            additionalHeader: isTestingWeek ? "1RM Test" : "Comp Bench",
            additionalDescription: isTestingWeek
              ? "Find your max. Keep your heels driven into the floor (leg drive) and maintain your arch throughout the press."
              : "Pull your shoulder blades together and down. Touch the bar to your lower chest/upper stomach. Drive the bar 'back' toward your face.",
          },

          {
            id: 26,
            sets: 3,
            repRange: [6, 8],
            additionalDescription:
              "Overhead strength directly correlates to a stable bench press. Keep your ribs tucked; do not let your back arch excessively.",
          },
          {
            id: 30,
            sets: 3,
            repRange: [10, 12],
            additionalDescription:
              "A bigger back provides a bigger 'shelf' to bench press from. Squeeze the handle to your sternum.",
          },
          {
            id: 54,
            sets: 3,
            repRange: [10, 12],
            additionalDescription:
              "Strong triceps are required for the 'lockout' phase of the bench press. Keep elbows tucked in.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: "Deadlift Focus",
        description: isTestingWeek
          ? "TESTING DAY: New 1RM Deadlift"
          : "Max effort pulling and posterior chain work.",
        intensity: isTestingWeek ? 10 : baseIntensity + 1,
        exercises: [
          {
            id: 14,
            sets: 3,
            repRange: mainReps,
            hideReps: isTestingWeek ? true : false,
            additionalHeader: isTestingWeek ? "1RM Test" : "Comp Deadlift",
            additionalDescription: isTestingWeek
              ? "The final lift. Grip it and rip it. Keep the spine neutral and don't let the hips rise faster than the chest."
              : "Slack out, chest up. Pull the bar into your shins and think about 'pushing the floor away' rather than 'pulling the bar up'.",
          },

          {
            id: 6,
            sets: 3,
            repRange: [8, 10],
            additionalDescription:
              "Unilateral leg strength to prevent 'shooting' one hip up during a heavy deadlift. Stay upright.",
          },
          {
            id: 10,
            sets: 3,
            repRange: [8, 12],
            additionalDescription:
              "Lat strength is vital to keeping the bar close to your body during a heavy pull. Do not swing.",
          },
          {
            id: 48,
            sets: 3,
            repRange: [12, 15],
            additionalDescription:
              "Abdominal flexion under load. This builds the 'front' side of your brace to protect your lower back.",
          },
        ],
      },
    ];
  }),
};
