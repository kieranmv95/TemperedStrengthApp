export type WorkoutCategory =
  | "Strength"
  | "WOD"
  | "Hyrox"
  | "Conditioning"
  | "Mobility";

export interface SingleWorkout {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: number;
  tags: string[];
  isPremium: boolean;

  blocks: {
    name: string;
    instructions?: string;
    movements: string[] | DetailedMovement[];
  }[];
}

export interface DetailedMovement {
  name: string;
  value: string;
  note?: string;
}

// Data for the workouts

// 20 FREE WORKOUTS (High value to convert users)
const freeWorkouts: SingleWorkout[] = [
  // --- CONDITIONING & WODs ---
  {
    id: "f_01",
    title: "The 15-Min Engine",
    description: "Classic AMRAP. Move steady, don't redline early.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["AMRAP", "No Equipment"],
    isPremium: false,
    blocks: [
      {
        name: "15 Min AMRAP",
        movements: ["10 Burpees", "20 Air Squats", "30 Sit-ups"],
      },
    ],
  },
  {
    id: "f_02",
    title: "Death by 10 Meters",
    description: "EMOM style shuttle sprints. The clock is your enemy.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 12,
    tags: ["Sprint", "Lungs"],
    isPremium: false,
    blocks: [
      {
        name: "EMOM",
        instructions:
          "Min 1: 1 x 10m sprint, Min 2: 2 x 10m... continue until fail.",
        movements: ["10m Shuttles"],
      },
    ],
  },
  {
    id: "f_03",
    title: "Core Tempering",
    description: "Focused abdominal and spinal stability work.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 10,
    tags: ["Core", "Abs"],
    isPremium: false,
    blocks: [
      {
        name: "3 Rounds",
        movements: ["45s Plank", "15 Hollow Rocks", "30s Side Plank (L/R)"],
      },
    ],
  },
  {
    id: "f_04",
    title: "The Century",
    description: "A simple, brutal chipper of 100 reps.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 12,
    tags: ["Chipper", "Full Body"],
    isPremium: false,
    blocks: [{ name: "For Time", movements: ["100 Burpees for time"] }],
  },
  {
    id: "f_05",
    title: "Leg Day Primer",
    description: "High volume bodyweight leg pump.",
    category: "Strength",
    difficulty: "Beginner",
    estimatedTime: 20,
    tags: ["Legs", "Volume"],
    isPremium: false,
    blocks: [
      {
        name: "4 Rounds",
        movements: [
          "20 Lunges",
          "20 Glute Bridges",
          "20 Sumo Squats",
          "1 min Wall Sit",
        ],
      },
    ],
  },
  {
    id: "f_06",
    title: "Upper Body Blitz",
    description: "Push/Pull hypertrophy using only bodyweight.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["Upper Body", "Pump"],
    isPremium: false,
    blocks: [
      {
        name: "3 Rounds",
        movements: [
          "Max Pushups",
          "15 Inverted Rows (or Towel Rows)",
          "12 Dips (on chair/bench)",
        ],
      },
    ],
  },
  {
    id: "f_07",
    title: "The 500m Row Test",
    description: "A benchmark sprint to test pure power.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 5,
    tags: ["Benchmark", "Row"],
    isPremium: false,
    blocks: [{ name: "Max Effort", movements: ["500m Row Sprint"] }],
  },
  {
    id: "f_08",
    title: "Desk Job Recovery",
    description: "Antidote to sitting all day. Focus on hips and t-spine.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 10,
    tags: ["Recovery", "Postures"],
    isPremium: false,
    blocks: [
      {
        name: "Flow",
        movements: [
          "Couch Stretch (2m/side)",
          "Pigeon Pose (2m/side)",
          "Thoracic Extensions",
        ],
      },
    ],
  },
  {
    id: "f_09",
    title: "Standard PFT",
    description: "The Hyrox entry-level fitness test.",
    category: "Hyrox",
    difficulty: "Intermediate",
    estimatedTime: 20,
    tags: ["Hyrox", "Test"],
    isPremium: false,
    blocks: [
      {
        name: "For Time",
        movements: [
          "1000m Run",
          "30 Burpee Broad Jumps",
          "200m Sandbag Lunges",
          "1000m Row",
          "30 Wall Balls",
        ],
      },
    ],
  },
  {
    id: "f_10",
    title: "Kettlebell Swing Ladder",
    description: "Power endurance through high rep swings.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 10,
    tags: ["KB", "Power"],
    isPremium: false,
    blocks: [
      { name: "EMOM 10", movements: ["15-20 KB Swings (every minute)"] },
    ],
  },
  {
    id: "f_11",
    title: "Sprint Intervals",
    description: "Classic track-style conditioning.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Running", "Speed"],
    isPremium: false,
    blocks: [
      {
        name: "5 Sets",
        instructions: "Rest 90s between sets",
        movements: ["400m Run (All out)"],
      },
    ],
  },
  {
    id: "f_12",
    title: "Pushup Pyramid",
    description: "Volume building for chest and triceps.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 12,
    tags: ["Chest", "Bodyweight"],
    isPremium: false,
    blocks: [
      {
        name: "1 to 10 to 1",
        movements: ["1 Pushup, rest, 2 Pushups... up to 10 and back down."],
      },
    ],
  },
  {
    id: "f_13",
    title: "The 4-Min Tabata",
    description: "Ultra-quick metabolic spike.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 4,
    tags: ["Tabata", "Quick"],
    isPremium: false,
    blocks: [
      {
        name: "20s Work / 10s Rest",
        movements: ["Thrusters (or Jump Squats)"],
      },
    ],
  },
  {
    id: "f_14",
    title: "Handstand Prep",
    description: "Shoulder stability and overhead proprioception.",
    category: "Mobility",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["Shoulders", "Skill"],
    isPremium: false,
    blocks: [
      {
        name: "3 Rounds",
        movements: [
          "30s Wall Walk/Hold",
          "10 Scapular Pushups",
          "20 Shoulder Taps",
        ],
      },
    ],
  },
  {
    id: "f_15",
    title: "Burpee/Squat Ascending",
    description: "Simple but effective conditioning.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 10,
    tags: ["Legs", "Lungs"],
    isPremium: false,
    blocks: [
      {
        name: "10 min AMRAP",
        movements: [
          "2 Burpees, 2 Squats",
          "4 Burpees, 4 Squats",
          "Add 2 reps every round",
        ],
      },
    ],
  },
  {
    id: "f_16",
    title: "Shoulder Health Flow",
    description: "Fixing 'crunchy' shoulders with light movement.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 10,
    tags: ["Shoulders", "Prehab"],
    isPremium: false,
    blocks: [
      {
        name: "Flow",
        movements: [
          "Band Dislocates (20)",
          "Face Pulls (20)",
          "Wall Slides (15)",
        ],
      },
    ],
  },
  {
    id: "f_17",
    title: "Jump Rope Skill",
    description: "Improving footwork and heart rate.",
    category: "Conditioning",
    difficulty: "Beginner",
    estimatedTime: 15,
    tags: ["Cardio", "Jump Rope"],
    isPremium: false,
    blocks: [
      {
        name: "5 Rounds",
        movements: ["2 mins Steady Jump Rope", "1 min Rest"],
      },
    ],
  },
  {
    id: "f_18",
    title: "The Bear Crawl",
    description: "Total body coordination and core tension.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 10,
    tags: ["Full Body", "Animal Flow"],
    isPremium: false,
    blocks: [
      { name: "EMOM 10", movements: ["20m Bear Crawl", "10 Air Squats"] },
    ],
  },
  {
    id: "f_19",
    title: "Grip Strength 101",
    description: "Building forearms for heavy pulls.",
    category: "Strength",
    difficulty: "Beginner",
    estimatedTime: 12,
    tags: ["Grip", "Arms"],
    isPremium: false,
    blocks: [
      {
        name: "3 Rounds",
        movements: ["Max Hang from Pull-up Bar", "40m Farmers Walk (Heavy)"],
      },
    ],
  },
  {
    id: "f_20",
    title: "The 1km Row Benchmark",
    description: "The classic engine test.",
    category: "Hyrox",
    difficulty: "Intermediate",
    estimatedTime: 5,
    tags: ["Row", "Benchmark"],
    isPremium: false,
    blocks: [{ name: "Max Effort", movements: ["1000m Row"] }],
  },
];

// 20 PRO WORKOUTS (Advanced, Niche, and High Tech)
const proWorkouts: SingleWorkout[] = [
  {
    id: "p_01",
    title: "The Anvil Grinder",
    description: "Heavy sled work combined with high heart rate.",
    category: "Hyrox",
    difficulty: "Advanced",
    estimatedTime: 45,
    tags: ["Heavy", "Sled", "Elite"],
    isPremium: true,
    blocks: [
      {
        name: "5 Rounds",
        movements: [
          "1km Run",
          "50m Sled Push (Max weight)",
          "100m Sandbag Carry",
        ],
      },
    ],
  },
  {
    id: "p_02",
    title: "Olympic Complex: The Chief",
    description: "Speed under the bar and technical efficiency.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Snatch", "Barbell", "Speed"],
    isPremium: true,
    blocks: [
      {
        name: "EMOM 15",
        movements: ["1 Power Snatch + 1 Hang Snatch + 1 OHS"],
      },
    ],
  },
  {
    id: "p_03",
    title: "Metabolic Stress: Row/Thruster",
    description: "A variation of 'Fran' that burns the lungs and legs.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 15,
    tags: ["Row", "Barbell", "Sprint"],
    isPremium: true,
    blocks: [
      { name: "21-15-9", movements: ["Calories Row", "Thrusters (43/30kg)"] },
    ],
  },
  {
    id: "p_04",
    title: "Strict Strength: Press",
    description: "Pure overhead power with no leg drive.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 40,
    tags: ["Shoulders", "Overhead"],
    isPremium: true,
    blocks: [
      {
        name: "5x5",
        instructions: "85% of 1RM",
        movements: ["Strict Press"],
      },
    ],
  },
  {
    id: "p_05",
    title: "The 4km Row Finisher",
    description: "Long duration engine work for Hyrox prep.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Row", "Endurance"],
    isPremium: true,
    blocks: [
      {
        name: "Steady State",
        movements: ["4000m Row (Target 2k split + 10s)"],
      },
    ],
  },
  {
    id: "p_06",
    title: "Front Squat Volume",
    description: "Building the engine for heavy Clean & Jerks.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 50,
    tags: ["Legs", "Squat"],
    isPremium: true,
    blocks: [
      {
        name: "10x3",
        instructions: "Every 90s @ 80%",
        movements: ["Front Squat"],
      },
    ],
  },
  {
    id: "p_07",
    title: "Murph (Unpartitioned)",
    description: "The ultimate test of physical and mental grit.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 60,
    tags: ["Hero WOD", "Long"],
    isPremium: true,
    blocks: [
      {
        name: "For Time (20lb Vest)",
        movements: [
          "1 Mile Run",
          "100 Pullups",
          "200 Pushups",
          "300 Air Squats",
          "1 Mile Run",
        ],
      },
    ],
  },
  {
    id: "p_08",
    title: "The Sandbag Mile",
    description: "Unrelenting leg and core demand.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Running", "Sandbag"],
    isPremium: true,
    blocks: [
      {
        name: "1 Mile Run",
        instructions: "Carry a 20/30kg sandbag however you want.",
        movements: ["1600m Sandbag Carry"],
      },
    ],
  },
  {
    id: "p_09",
    title: "Pistol Squat Skill",
    description: "Developing elite unilateral leg strength.",
    category: "Mobility",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Legs", "Balance"],
    isPremium: true,
    blocks: [
      {
        name: "Skill Work",
        movements: ["Pistol Squat Progressions", "10 min EMOM: 6-10 Pistols"],
      },
    ],
  },
  {
    id: "p_10",
    title: "Double Under Mastery",
    description: "Fixing your engine by perfecting your jump rope.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 15,
    tags: ["Skill", "Jump Rope"],
    isPremium: true,
    blocks: [{ name: "10 min EMOM", movements: ["30-50 Double Unders"] }],
  },
  {
    id: "p_11",
    title: "Heavy Grace",
    description: "Clean and Jerks for speed under fatigue.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 10,
    tags: ["Barbell", "Power"],
    isPremium: true,
    blocks: [
      {
        name: "30 Reps for Time",
        instructions: "Weight: 61/43kg",
        movements: ["Clean and Jerk"],
      },
    ],
  },
  {
    id: "p_12",
    title: "The Ergathlon",
    description: "Total erg-based destruction.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 45,
    tags: ["Row", "Ski", "Bike"],
    isPremium: true,
    blocks: [
      { name: "For Time", movements: ["2000m Row", "2000m Ski", "4000m Bike"] },
    ],
  },
  {
    id: "p_13",
    title: "Pause Squat Intensity",
    description: "Removing the stretch reflex for raw strength.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 45,
    tags: ["Squat", "Pause"],
    isPremium: true,
    blocks: [
      {
        name: "6x2",
        instructions: "3-sec pause at bottom",
        movements: ["Back Squat"],
      },
    ],
  },
  {
    id: "p_14",
    title: "Burpee/Box Jump 50",
    description: "Explosive power under high fatigue.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 15,
    tags: ["Explosive", "Lungs"],
    isPremium: true,
    blocks: [
      { name: "50-40-30-20-10", movements: ["Burpee Box Jumps", "Wall Balls"] },
    ],
  },
  {
    id: "p_15",
    title: "Snatch Balance: Stability",
    description: "The best drill for confidence in the catch.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Snatch", "Technique"],
    isPremium: true,
    blocks: [{ name: "5x3", movements: ["Snatch Balance", "Overhead Squat"] }],
  },
  {
    id: "p_16",
    title: "Muscle-Up Progressions",
    description: "Vertical pulling and pressing at elite levels.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Gymnastics", "Skill"],
    isPremium: true,
    blocks: [
      { name: "EMOM 12", movements: ["3-5 Muscle Ups (or progressions)"] },
    ],
  },
  {
    id: "p_17",
    title: "The 5km Run Benchmark",
    description: "Aerobic threshold test.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Running", "Aerobic"],
    isPremium: true,
    blocks: [{ name: "Time Trial", movements: ["5000m Run (Flat course)"] }],
  },
  {
    id: "p_18",
    title: "Devil Press Ladder",
    description: "The ultimate metabolic and mental grind.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Dumbbell", "Lungs"],
    isPremium: true,
    blocks: [
      {
        name: "For Time",
        movements: [
          "10-9-8...1 Devil Press (2x22.5kg)",
          "20-18-16...2 Box Step Ups",
        ],
      },
    ],
  },
  {
    id: "p_19",
    title: "Weighted Dips / Pullups",
    description: "Old school strength for a massive upper body.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 35,
    tags: ["Calisthenics", "Heavy"],
    isPremium: true,
    blocks: [
      { name: "5x5", movements: ["Weighted Pull-ups", "Weighted Dips"] },
    ],
  },
  {
    id: "p_20",
    title: "The Hybrid Finisher",
    description: "Bringing it all together.",
    category: "Hyrox",
    difficulty: "Advanced",
    estimatedTime: 40,
    tags: ["Hybrid", "Finishers"],
    isPremium: true,
    blocks: [
      {
        name: "For Time",
        movements: [
          "500m Row",
          "50 Wall Balls",
          "500m Ski",
          "50 Burpees",
          "500m Run",
        ],
      },
    ],
  },
];

export const allStandaloneWorkouts: SingleWorkout[] = [
  ...freeWorkouts,
  ...proWorkouts,
];
