export interface Exercise {
  id: string;
  sets: number;
  repRange: [number, number];
  isAmrap: boolean;
}

export interface Workout {
  dayIndex: number;
  label: string;
  exercises: Exercise[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  workouts: Workout[];
}

export const program: Program = {
  id: "ppl_01",
  name: "Push/Pull/Legs",
  description: "A classic 3-day split for strength and size.",
  workouts: [
    {
      dayIndex: 0,
      label: "Push",
      exercises: [
        {
          id: "1",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "26",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "17",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "33",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
    {
      dayIndex: 2,
      label: "Pull",
      exercises: [
        {
          id: "7",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "10",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "8",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "32",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
    {
      dayIndex: 4,
      label: "Legs",
      exercises: [
        {
          id: "4",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "14",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "6",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "13",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
    {
      dayIndex: 7,
      label: "Push",
      exercises: [
        {
          id: "1",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "26",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "17",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "33",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
    {
      dayIndex: 9,
      label: "Pull",
      exercises: [
        {
          id: "7",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "10",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "8",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "32",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
    {
      dayIndex: 11,
      label: "Legs",
      exercises: [
        {
          id: "4",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "14",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "6",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
        {
          id: "13",
          sets: 3,
          repRange: [8, 12],
          isAmrap: false,
        },
      ],
    },
  ],
};

export const programs: Program[] = [program];

/**
 * Get a program by ID
 * @param id - Program ID
 * @returns Program or undefined
 */
export const getProgramById = (id: string): Program | undefined => {
  return programs.find((p) => p.id === id);
};
