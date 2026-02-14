import type { Program, Warmup } from "@/src/types/program";

export const full_body_warmup: Warmup = {
  type: "warmup",
  description: [
    "3-minute cardio of choice (rower, bike, or light jog) to raise heart rate and body temperature.",
    "30s deep squat hold",
    "10 arm circles forward / 10 arm circles backward",
    "10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side",
    "10 band pull-aparts or scapular wall slides",
    "10 glute bridges with 2s pause at the top",
    "10 dead bugs or bird dogs (controlled)",
    "10 bodyweight squats or inchworms",
  ],
};

export const full_body_2day: Program = {
  isPro: false,
  id: "full_body_2day",
  name: "2 Day Full Body",
  description:
    "12-Week Full Body Maintenance. Alternates movement variants monthly to prevent plateaus.",
  daysSplit: ["sat", "sun"],
  averageSessionDuration: "60 min",
  workouts: Array.from({ length: 12 }).flatMap((_, week) => {
    const cycle = Math.floor(week / 4);
    const cycleNames = ["Foundation", "Stability", "Hypertrophy"];

    return [
      {
        dayIndex: week * 7 + 0,
        label: `Full Body A (Week ${week + 1})`,
        description: `Phase ${cycle + 1} (${cycleNames[cycle]}): Focusing on ${
          cycle === 1 ? "Machine" : "Barbell"
        } stability.`,
        intensity: 7,
        exercises: [
          full_body_warmup,
          {
            type: "exercise",
            id: cycle === 1 ? 19 : 4,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: cycle === 1 ? 120 : 150,
            additionalHeader: cycle === 1 ? "Controlled Load" : "Core Demand",
            additionalDescription:
              cycle === 1
                ? "Using the Leg Press to drive pure quadriceps hypertrophy without lower back fatigue. Focus on a deep range of motion."
                : "Barbell Squats: Brace your core as if about to be punched. Control the descent and drive the floor away aggressively.",
          },

          {
            type: "exercise",
            id: 1,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 150,
            additionalDescription:
              "Maintain a slight arch in your back and keep your shoulder blades 'tucked' into the bench. Think about bending the bar to engage your chest.",
          },
          {
            type: "exercise",
            id: cycle === 2 ? 45 : 7,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 120,
            additionalDescription:
              cycle === 2
                ? "T-Bar Row: Focus on pulling with your elbows rather than your hands. Squeeze your mid-back at the peak of the contraction."
                : "Barbell Row: Keep your torso rigid and parallel to the floor. This builds the foundational 'back thickness' required for heavy pulling.",
          },

          {
            type: "exercise",
            id: 24,
            sets: 3,
            repRange: [15, 20],
            restTimeSeconds: 60,
            isAmrap: true,
            additionalHeader: "Glute Finisher",
            additionalDescription:
              "A high-rep conditioning tool. Focus on the hip hinge—push your glutes back and 'snap' them forward to propel the weight.",
          },
        ],
      },
      {
        dayIndex: week * 7 + 1,
        label: `Full Body B (Week ${week + 1})`,
        description: "Pulling and overhead pressing focus.",
        intensity: 7,
        exercises: [
          full_body_warmup,
          {
            type: "exercise",
            id: 14,
            sets: 3,
            repRange: [5, 8],
            restTimeSeconds: 180,
            additionalHeader: "Primary Pull",
            additionalDescription:
              "The king of posterior chain movements. Pull the slack out of the bar before lifting. Keep the bar in contact with your shins throughout.",
          },

          {
            type: "exercise",
            id: cycle === 1 ? 27 : 26,
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 120,
            additionalHeader: "Vertical Drive",
            additionalDescription:
              cycle === 1
                ? "Dumbbell Press allows for a more natural range of motion. Bring the weights down until they are just above shoulder height."
                : "Overhead Press: Squeeze your glutes and quads hard to create a stable base. Press the bar in a straight line, finishing with your head through the 'window'.",
          },
          {
            type: "exercise",
            id: 10,
            sets: 3,
            repRange: [8, 12],
            restTimeSeconds: 120,
            isAmrap: true,
            additionalDescription:
              "The ultimate test of upper body relative strength. Aim for full extension at the bottom and chin over the bar at the top.",
          },

          {
            type: "exercise",
            id: 5,
            sets: 3,
            repRange: [12, 15],
            restTimeSeconds: 60,
            additionalDescription:
              "A goblet squat helps correct squat mechanics. Keep your elbows inside your knees at the bottom to open up the hips.",
          },
        ],
      },
    ];
  }),
};
