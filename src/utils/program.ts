export interface Exercise {
  id: string;
  sets: number;
  repRange: [number, number];
  isAmrap: boolean;
}

export interface Workout {
  dayIndex: number;
  label: string;
  description: string;
  intensity: number; // 1 to 10 scale
  exercises: Exercise[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
}

// 1. PUSH PULL LEGS (4 Weeks)
export const ppl_01: Program = {
  id: "ppl_01",
  name: "Push/Pull/Legs (PPL)",
  description:
    "4-Week Hypertrophy block. Rotates intensity and exercise variations.",
  workouts: Array.from({ length: 4 }).flatMap((_, week) => [
    {
      dayIndex: week * 7 + 0,
      label: `Push (Week ${week + 1})`,
      description:
        week % 2 === 0 ? "Heavy Barbell Focus" : "Dumbbell & Volume Focus",
      intensity: 7 + (week % 2),
      exercises: [
        {
          id: week % 2 === 0 ? "1" : "2",
          sets: 3,
          repRange: [8, 10],
          isAmrap: false,
        },
        { id: "27", sets: 3, repRange: [10, 12], isAmrap: false },
        { id: "36", sets: 3, repRange: [12, 15], isAmrap: false },
        { id: "33", sets: 3, repRange: [12, 15], isAmrap: week === 3 },
      ],
    },
    {
      dayIndex: week * 7 + 2,
      label: `Pull (Week ${week + 1})`,
      description: "Mid-back and Lat development with bicep finishers.",
      intensity: 7,
      exercises: [
        {
          id: week % 2 === 0 ? "7" : "8",
          sets: 3,
          repRange: [8, 10],
          isAmrap: false,
        },
        { id: "10", sets: 3, repRange: [6, 10], isAmrap: false },
        { id: "35", sets: 3, repRange: [15, 20], isAmrap: false },
        { id: "32", sets: 3, repRange: [10, 12], isAmrap: true },
      ],
    },
    {
      dayIndex: week * 7 + 4,
      label: `Legs (Week ${week + 1})`,
      description: "Compound leg movements followed by high-rep isolation.",
      intensity: 8 + (week === 3 ? 1 : 0),
      exercises: [
        {
          id: week % 2 === 0 ? "4" : "19",
          sets: 3,
          repRange: [8, 10],
          isAmrap: false,
        },
        { id: "23", sets: 3, repRange: [10, 12], isAmrap: false },
        { id: "39", sets: 3, repRange: [12, 15], isAmrap: false },
        { id: "31", sets: 3, repRange: [10, 15], isAmrap: true },
      ],
    },
  ]),
};

// 2. 5-DAY POWER & STRENGTH (6 Weeks)
export const strength_5day: Program = {
  id: "strength_5day",
  name: "5-Day Power & Strength",
  description: "6-Week Strength Peak. Intensifies every 2 weeks.",
  workouts: Array.from({ length: 6 }).flatMap((_, week) => {
    const intensity = week < 2 ? 7 : week < 4 ? 8 : 9;
    const reps = [
      [8, 10],
      [5, 8],
      [3, 5],
    ][week < 2 ? 0 : week < 4 ? 1 : 2] as [number, number];

    return [
      {
        dayIndex: week * 7 + 0,
        label: "Chest & Back (Heavy)",
        description: "Primary upper body compound focus.",
        intensity: intensity,
        exercises: [
          { id: "1", sets: 4, repRange: reps, isAmrap: false },
          { id: "7", sets: 4, repRange: reps, isAmrap: false },
          { id: "18", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "30", sets: 3, repRange: [10, 12], isAmrap: false },
        ],
      },
      {
        dayIndex: week * 7 + 1,
        label: "Lower Body (Squat focus)",
        description: "Developing maximal leg power.",
        intensity: intensity + 1,
        exercises: [
          { id: "4", sets: 5, repRange: reps, isAmrap: false },
          { id: "19", sets: 3, repRange: [8, 10], isAmrap: false },
          { id: "40", sets: 3, repRange: [12, 15], isAmrap: false },
          { id: "13", sets: 3, repRange: [45, 60], isAmrap: false },
        ],
      },
      {
        dayIndex: week * 7 + 2,
        label: "Shoulders & Arms",
        description: "Structural balance and arm hypertrophy.",
        intensity: intensity - 1,
        exercises: [
          { id: "26", sets: 4, repRange: [6, 8], isAmrap: false },
          { id: "34", sets: 4, repRange: [12, 15], isAmrap: false },
          { id: "51", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "54", sets: 3, repRange: [10, 12], isAmrap: false },
        ],
      },
      {
        dayIndex: week * 7 + 3,
        label: "Lower Body (Deadlift focus)",
        description: "Posterior chain and pulling power.",
        intensity: intensity + 1,
        exercises: [
          { id: "14", sets: 3, repRange: [3, 5], isAmrap: false },
          { id: "6", sets: 3, repRange: [8, 10], isAmrap: false },
          { id: "41", sets: 3, repRange: [8, 12], isAmrap: false },
          { id: "48", sets: 3, repRange: [12, 15], isAmrap: false },
        ],
      },
      {
        dayIndex: week * 7 + 4,
        label: "Upper Body Hypertrophy",
        description: "Focus on mind-muscle connection and pump.",
        intensity: intensity,
        exercises: [
          { id: "2", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "11", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "17", sets: 3, repRange: [8, 12], isAmrap: week === 5 },
          { id: "56", sets: 3, repRange: [12, 15], isAmrap: false },
        ],
      },
    ];
  }),
};

// 3. WEEKEND WARRIOR (12 Weeks)
export const full_body_2day: Program = {
  id: "full_body_2day",
  name: "Weekend Warrior",
  description:
    "12-Week Full Body Maintenance. Alternates movement variants monthly.",
  workouts: Array.from({ length: 12 }).flatMap((_, week) => {
    const cycle = Math.floor(week / 4);
    return [
      {
        dayIndex: week * 7 + 0,
        label: "Full Body A",
        description: `Phase ${cycle + 1}: Focusing on ${
          cycle === 1 ? "Machine" : "Barbell"
        } stability.`,
        intensity: 7,
        exercises: [
          {
            id: cycle === 1 ? "19" : "4",
            sets: 3,
            repRange: [8, 10],
            isAmrap: false,
          },
          { id: "1", sets: 3, repRange: [8, 10], isAmrap: false },
          {
            id: cycle === 2 ? "45" : "7",
            sets: 3,
            repRange: [8, 10],
            isAmrap: false,
          },
          { id: "24", sets: 3, repRange: [15, 20], isAmrap: true },
        ],
      },
      {
        dayIndex: week * 7 + 1,
        label: "Full Body B",
        description: "Pulling and overhead pressing focus.",
        intensity: 7,
        exercises: [
          { id: "14", sets: 3, repRange: [5, 8], isAmrap: false },
          {
            id: cycle === 1 ? "27" : "26",
            sets: 3,
            repRange: [8, 10],
            isAmrap: false,
          },
          { id: "10", sets: 3, repRange: [8, 12], isAmrap: true },
          { id: "5", sets: 3, repRange: [12, 15], isAmrap: false },
        ],
      },
    ];
  }),
};

// 4. POWERLIFTING (8 Weeks)
export const powerlifting_3day: Program = {
  id: "power_01",
  name: "Traditional Powerlifting (SBD)",
  description:
    "8-Week Peaking Program. Volume drops as intensity climbs to a Week 8 testing session.",
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
            id: "4",
            sets: week < 4 ? 4 : 5,
            repRange: mainReps,
            isAmrap: isTestingWeek,
          },
          { id: "22", sets: 3, repRange: [8, 10], isAmrap: false },
          { id: "19", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "13", sets: 3, repRange: [45, 60], isAmrap: false },
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
            id: "1",
            sets: week < 4 ? 4 : 5,
            repRange: mainReps,
            isAmrap: isTestingWeek,
          },
          { id: "26", sets: 3, repRange: [6, 8], isAmrap: false },
          { id: "30", sets: 3, repRange: [10, 12], isAmrap: false },
          { id: "54", sets: 3, repRange: [10, 12], isAmrap: false },
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
          { id: "14", sets: 3, repRange: mainReps, isAmrap: isTestingWeek },
          { id: "6", sets: 3, repRange: [8, 10], isAmrap: false },
          { id: "10", sets: 3, repRange: [8, 12], isAmrap: false },
          { id: "48", sets: 3, repRange: [12, 15], isAmrap: false },
        ],
      },
    ];
  }),
};

export const programs: Program[] = [
  ppl_01,
  strength_5day,
  full_body_2day,
  powerlifting_3day,
];

export const getProgramById = (id: string): Program | undefined => {
  return programs.find((p) => p.id === id);
};
