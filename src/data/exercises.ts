export type Exercise = {
  id: string;
  name: string;
  pattern: string;
  muscle: string;
  equipment: string;
};

export const exercises: Exercise[] = [
  // --- HORIZONTAL PUSH (Chest/Triceps) ---
  {
    id: "1",
    name: "Barbell Bench Press",
    pattern: "Horizontal Push",
    muscle: "Chest",
    equipment: "Barbell",
  },
  {
    id: "2",
    name: "Dumbbell Bench Press",
    pattern: "Horizontal Push",
    muscle: "Chest",
    equipment: "Dumbbell",
  },
  {
    id: "3",
    name: "Push-ups",
    pattern: "Horizontal Push",
    muscle: "Chest",
    equipment: "Bodyweight",
  },
  {
    id: "16",
    name: "Chest Press Machine",
    pattern: "Horizontal Push",
    muscle: "Chest",
    equipment: "Machine",
  },
  {
    id: "17",
    name: "Dips",
    pattern: "Horizontal Push",
    muscle: "Triceps/Chest",
    equipment: "Bodyweight",
  },
  {
    id: "18",
    name: "Incline DB Press",
    pattern: "Horizontal Push",
    muscle: "Upper Chest",
    equipment: "Dumbbell",
  },

  // --- KNEE DOMINANT (Quads) ---
  {
    id: "4",
    name: "Barbell Back Squat",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Barbell",
  },
  {
    id: "5",
    name: "DB Goblet Squat",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Dumbbell",
  },
  {
    id: "6",
    name: "Bulgarian Split Squat",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Dumbbell",
  },
  {
    id: "19",
    name: "Leg Press",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Machine",
  },
  {
    id: "20",
    name: "Hack Squat",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Machine",
  },
  {
    id: "21",
    name: "Bodyweight Squats",
    pattern: "Knee Dominant",
    muscle: "Quadriceps",
    equipment: "Bodyweight",
  },

  // --- HIP HINGE (Hamstrings/Glutes/Lower Back) ---
  {
    id: "14",
    name: "Barbell Deadlift",
    pattern: "Hip Hinge",
    muscle: "Posterior Chain",
    equipment: "Barbell",
  },
  {
    id: "22",
    name: "Romanian Deadlift",
    pattern: "Hip Hinge",
    muscle: "Hamstrings",
    equipment: "Barbell",
  },
  {
    id: "23",
    name: "DB Romanian Deadlift",
    pattern: "Hip Hinge",
    muscle: "Hamstrings",
    equipment: "Dumbbell",
  },
  {
    id: "24",
    name: "Kettlebell Swing",
    pattern: "Hip Hinge",
    muscle: "Glutes",
    equipment: "Kettlebell",
  },
  {
    id: "25",
    name: "Glute Bridge",
    pattern: "Hip Hinge",
    muscle: "Glutes",
    equipment: "Bodyweight",
  },

  // --- VERTICAL PUSH (Shoulders) ---
  {
    id: "26",
    name: "Barbell Overhead Press",
    pattern: "Vertical Push",
    muscle: "Shoulders",
    equipment: "Barbell",
  },
  {
    id: "27",
    name: "Dumbbell Shoulder Press",
    pattern: "Vertical Push",
    muscle: "Shoulders",
    equipment: "Dumbbell",
  },
  {
    id: "28",
    name: "Machine Shoulder Press",
    pattern: "Vertical Push",
    muscle: "Shoulders",
    equipment: "Machine",
  },
  {
    id: "29",
    name: "Pike Push-ups",
    pattern: "Vertical Push",
    muscle: "Shoulders",
    equipment: "Bodyweight",
  },

  // --- HORIZONTAL PULL (Mid-Back/Lats) ---
  {
    id: "7",
    name: "Barbell Row",
    pattern: "Horizontal Pull",
    muscle: "Back",
    equipment: "Barbell",
  },
  {
    id: "8",
    name: "Dumbbell Row",
    pattern: "Horizontal Pull",
    muscle: "Back",
    equipment: "Dumbbell",
  },
  {
    id: "9",
    name: "Inverted Row",
    pattern: "Horizontal Pull",
    muscle: "Back",
    equipment: "Bodyweight",
  },
  {
    id: "30",
    name: "Seated Cable Row",
    pattern: "Horizontal Pull",
    muscle: "Back",
    equipment: "Machine",
  },

  // --- VERTICAL PULL (Lats) ---
  {
    id: "10",
    name: "Pull-ups",
    pattern: "Vertical Pull",
    muscle: "Back",
    equipment: "Bodyweight",
  },
  {
    id: "11",
    name: "Lat Pulldown",
    pattern: "Vertical Pull",
    muscle: "Back",
    equipment: "Machine",
  },
  {
    id: "12",
    name: "Chin-ups",
    pattern: "Vertical Pull",
    muscle: "Back",
    equipment: "Bodyweight",
  },

  // --- CORE & ISOLATION ---
  {
    id: "13",
    name: "Plank",
    pattern: "Core",
    muscle: "Abs",
    equipment: "Bodyweight",
  },
  {
    id: "15",
    name: "Ab Wheel Rollout",
    pattern: "Core",
    muscle: "Abs",
    equipment: "Bodyweight",
  },
  {
    id: "31",
    name: "Hanging Leg Raise",
    pattern: "Core",
    muscle: "Abs",
    equipment: "Bodyweight",
  },
  {
    id: "32",
    name: "Bicep Curls",
    pattern: "Isolation",
    muscle: "Biceps",
    equipment: "Dumbbell",
  },
  {
    id: "33",
    name: "Tricep Pushdowns",
    pattern: "Isolation",
    muscle: "Triceps",
    equipment: "Machine",
  },
  {
    id: "34",
    name: "Lateral Raises",
    pattern: "Isolation",
    muscle: "Shoulders",
    equipment: "Dumbbell",
  },
  {
    id: "35",
    name: "Face Pulls",
    pattern: "Isolation",
    muscle: "Rear Delts",
    equipment: "Machine",
  },
];

// Helper functions
export const getExerciseById = (id: string) =>
  exercises.find((ex) => ex.id === id);

export const getExercisesByPattern = (pattern: string) =>
  exercises.filter((ex) => ex.pattern === pattern);

export const getAllExercises = () => exercises;
