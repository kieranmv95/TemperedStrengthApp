import { programList } from "@/src/data/programs";

export interface Exercise {
  id: number;
  additionalHeader?: string | null;
  additionalDescription?: string | null;
  hideReps?: boolean;
  sets: number;
  repRange: [number, number];
  isAmrap?: boolean;
  canSwap?: boolean;
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
  isPro: boolean;
  daysSplit?: ("mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun")[];
}

export const programs: Program[] = programList;

export const getProgramById = (id: string): Program | undefined => {
  return programs.find((p) => p.id === id);
};
