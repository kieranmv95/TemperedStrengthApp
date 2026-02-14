import type { SingleWorkout } from "@/src/types/workouts";

export type {
  DetailedMovement,
  SingleWorkout,
  WorkoutCategory,
} from "@/src/types/workouts";

const freeWorkouts: SingleWorkout[] = [
  {
    id: "f_01",
    title: "The 15-Min Engine",
    description:
      "Classic AMRAP. Aim for a consistent pace you can maintain for the full duration. Target 5+ rounds.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 25, // 15m work + 10m warmup
    tags: ["AMRAP", "No Equipment"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["2 Rounds: 200m Jog, 10 Air Squats, 10 Scapular Pushups"],
      },
      {
        name: "15 Min AMRAP",
        instructions:
          "As many rounds as possible in 15 mins. No scheduled rest; rest only as needed.",
        movements: ["10 Burpees", "20 Air Squats", "30 Sit-ups"],
      },
    ],
  },
  {
    id: "f_02",
    title: "Death by 10 Meters",
    description:
      "An EMOM (Every Minute on the Minute) shuttle test. This starts easy but becomes maximal effort quickly.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Sprint", "Lungs"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["3 Rounds: 30s High Knees, 30s Butt Kicks, 5 Inchworms"],
      },
      {
        name: "EMOM",
        instructions:
          "Start clock. Min 1: 1 x 10m sprint. Min 2: 2 x 10m sprints. Continue until you cannot complete the required sprints within the minute.",
        movements: ["10m Shuttles"],
      },
    ],
  },
  {
    id: "f_03",
    title: "Core Tempering",
    description:
      "Focus on 'bracing' your midsection. Movement should be slow and controlled.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 15,
    tags: ["Core", "Abs"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["2 Rounds: 10 Cat-Cow, 10 Bird-Dogs"] },
      {
        name: "3 Rounds",
        instructions:
          "Rest 60s between rounds. Focus on keeping lower back glued to the floor during Hollow Rocks.",
        movements: ["45s Plank", "15 Hollow Rocks", "30s Side Plank (L/R)"],
      },
    ],
  },
  {
    id: "f_04",
    title: "The Century",
    description:
      "A benchmark test of mental grit. The goal is to finish 100 burpees as fast as possible.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["Chipper", "Full Body"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: [
          "5 mins joint Prep: Wrist circles, arm swings, 20 Jumping Jacks",
        ],
      },
      {
        name: "For Time",
        instructions:
          "Go at 80% pace for the first 50, then accelerate. Target: Under 8 mins.",
        movements: ["100 Burpees for time"],
      },
    ],
  },
  {
    id: "f_05",
    title: "Leg Day Primer",
    description:
      "High volume bodyweight leg pump. Keep rest minimal to maximize metabolic stress.",
    category: "Strength",
    difficulty: "Beginner",
    estimatedTime: 25,
    tags: ["Legs", "Volume"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["10 World's Greatest Stretches, 20 Glute Bridges"],
      },
      {
        name: "4 Rounds",
        instructions: "Rest 90s between rounds. Focus on full range of motion.",
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
    description:
      "Hypertrophy focus. Control the eccentric (lowering) phase for 2 seconds on every rep.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 25,
    tags: ["Upper Body", "Pump"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["2 Rounds: 10 Pushups, 10 Prone Y-Raises, 10 Arm Circles"],
      },
      {
        name: "3 Rounds",
        instructions:
          "Rest 2 mins between rounds to allow for maximum effort on the next set.",
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
    description:
      "Pure anaerobic power. This should be a 'sprint' where you finish completely breathless.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 12,
    tags: ["Benchmark", "Row"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["500m Easy Row, then 3 x 10 stroke power bursts"],
      },
      {
        name: "Max Effort",
        instructions:
          "Secure feet tightly. Start with short, quick strokes to get the flywheel moving.",
        movements: ["500m Row Sprint"],
      },
    ],
  },
  {
    id: "f_08",
    title: "Desk Job Recovery",
    description:
      "The antidote to sitting. Focus on breathing deeply into each stretch.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 15,
    tags: ["Recovery", "Postures"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["2 mins light walking or jogging to warm the tissues"],
      },
      {
        name: "Flow",
        instructions:
          "Hold each pose for the specified time. Don't force the range; let gravity do the work.",
        movements: [
          "Couch Stretch (2m/side)",
          "Pigeon Pose (2m/side)",
          "Thoracic Extensions (15 reps)",
        ],
      },
    ],
  },
  {
    id: "f_09",
    title: "Standard PFT",
    description:
      "The official Hyrox Physical Fitness Test. Use this to gauge your current level.",
    category: "Hyrox",
    difficulty: "Intermediate",
    estimatedTime: 35,
    tags: ["Hyrox", "Test"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["800m Run, 10 Burpees, 10 Air Squats"] },
      {
        name: "For Time",
        instructions:
          "Minimal transition time between movements. Record your total time.",
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
    description:
      "Building posterior chain power. Maintain a flat back and snap the hips aggressively.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["KB", "Power"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["20 Hip Hinges, 10 Yoga Pushups"] },
      {
        name: "EMOM 10",
        instructions:
          "Perform the reps at the start of every minute. Rest for the remainder of that minute.",
        movements: ["15-20 KB Swings"],
      },
    ],
  },
  {
    id: "f_11",
    title: "Sprint Intervals",
    description:
      "Developing top-end speed and aerobic recovery. Each 400m should be at 90-95% effort.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Running", "Speed"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["1km Jog, Leg Swings, 2 x 50m Strides"] },
      {
        name: "5 Sets",
        instructions:
          "Rest 90s between sets. Focus on staying relaxed in the face and shoulders while sprinting.",
        movements: ["400m Run (All out)"],
      },
    ],
  },
  {
    id: "f_12",
    title: "Pushup Pyramid",
    description:
      "Volume-based conditioning for the upper body. Form over speed.",
    category: "Strength",
    difficulty: "Intermediate",
    estimatedTime: 20,
    tags: ["Chest", "Bodyweight"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["2 Rounds: 10 Shoulder Taps, 10 Scapular Pushups"],
      },
      {
        name: "1 to 10 to 1",
        instructions:
          "Rest is equal to the time it took to do the reps. (e.g., 5 pushups, rest ~5-10s).",
        movements: ["1-2-3-4-5-6-7-8-9-10-9-8-7-6-5-4-3-2-1 Pushups"],
      },
    ],
  },
  {
    id: "f_13",
    title: "The 4-Min Tabata",
    description:
      "High intensity, short duration. Maximum intensity is required to see benefits.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 10,
    tags: ["Tabata", "Quick"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["2 mins Jumping Jacks, 10 Air Squats"] },
      {
        name: "20s Work / 10s Rest",
        instructions:
          "8 Rounds of 20 seconds of work followed by 10 seconds of rest.",
        movements: ["Thrusters (or Jump Squats)"],
      },
    ],
  },
  {
    id: "f_14",
    title: "Handstand Prep",
    description:
      "Shoulder stability and technical positioning. Stop immediately if form breaks down.",
    category: "Mobility",
    difficulty: "Intermediate",
    estimatedTime: 25,
    tags: ["Shoulders", "Skill"],
    isPremium: false,
    blocks: [
      {
        name: "Warmup",
        movements: ["3 Rounds: 10 Wrist Stretches, 10 Wall Slides"],
      },
      {
        name: "3 Rounds",
        instructions:
          "Rest 2 mins between rounds. Quality is the goal here, not fatigue.",
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
    description:
      "A ladder format that challenges your pacing and leg endurance.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 18,
    tags: ["Legs", "Lungs"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["2 Rounds: 10 Air Squats, 5 Burpees"] },
      {
        name: "10 min AMRAP",
        instructions:
          "Round 1: 2 Reps each. Round 2: 4 Reps. Round 3: 6 Reps... continue until time is up.",
        movements: ["2 Burpees, 2 Squats (+2 reps every round)"],
      },
    ],
  },
  {
    id: "f_16",
    title: "Shoulder Health Flow",
    description:
      "Prehab for athletes with stiff shoulders. Use a light resistance band.",
    category: "Mobility",
    difficulty: "Beginner",
    estimatedTime: 12,
    tags: ["Shoulders", "Prehab"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["2 mins Arm Swings and Thoracic Twists"] },
      {
        name: "Flow",
        instructions:
          "Move through the reps slowly. Focus on 'feeling' the scapula move on the ribcage.",
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
    description:
      "Cardiovascular health and foot speed. Focus on staying light on the balls of your feet.",
    category: "Conditioning",
    difficulty: "Beginner",
    estimatedTime: 20,
    tags: ["Cardio", "Jump Rope"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["Ankle circles, 50 Calf Raises"] },
      {
        name: "5 Rounds",
        instructions:
          "Rest 1 min between rounds. If you trip, just reset and keep going.",
        movements: ["2 mins Steady Jump Rope", "1 min Rest"],
      },
    ],
  },
  {
    id: "f_18",
    title: "The Bear Crawl",
    description:
      "Building core tension and shoulder stability through crawling patterns.",
    category: "WOD",
    difficulty: "Intermediate",
    estimatedTime: 18,
    tags: ["Full Body", "Animal Flow"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["Wrist prep, 10 Cat-Cow, 10 Bird-Dog"] },
      {
        name: "EMOM 10",
        instructions:
          "Execute both movements within the minute. Rest for the remainder.",
        movements: ["20m Bear Crawl", "10 Air Squats"],
      },
    ],
  },
  {
    id: "f_19",
    title: "Grip Strength 101",
    description:
      "Building the foundations for pullups and heavy deadlifts. Don't use straps.",
    category: "Strength",
    difficulty: "Beginner",
    estimatedTime: 20,
    tags: ["Grip", "Arms"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["Wrist circles, 20 Hand Clenches"] },
      {
        name: "3 Rounds",
        instructions:
          "Rest 2 mins between rounds. The goal is to reach near-failure on the hang.",
        movements: ["Max Hang from Pull-up Bar", "40m Farmers Walk (Heavy)"],
      },
    ],
  },
  {
    id: "f_20",
    title: "The 1km Row Benchmark",
    description:
      "A middle-distance engine test. Aim for a sub 4:00 time (Intermediate).",
    category: "Hyrox",
    difficulty: "Intermediate",
    estimatedTime: 15,
    tags: ["Row", "Benchmark"],
    isPremium: false,
    blocks: [
      { name: "Warmup", movements: ["500m Easy Row + 5 High Power strokes"] },
      {
        name: "Max Effort",
        instructions:
          "Try to maintain a consistent '500m split' for the entire distance.",
        movements: ["1000m Row"],
      },
    ],
  },
];

const proWorkouts: SingleWorkout[] = [
  {
    id: "p_01",
    title: "The Anvil Grinder",
    description:
      "Elite Hyrox preparation. Heavy sled work paired with aerobic fatigue.",
    category: "Hyrox",
    difficulty: "Advanced",
    estimatedTime: 55,
    tags: ["Heavy", "Sled", "Elite"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["1km Jog, 10 Sled Pushes (Light), 20 Lunges"],
      },
      {
        name: "5 Rounds",
        instructions:
          "Rest 60s between rounds. Run at 70-80% of max heart rate.",
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
    description:
      "Developing technical speed and overhead stability with the snatch.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Snatch", "Barbell", "Speed"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["Burgener Warmup (Snatches with PVC pipe)"],
      },
      {
        name: "EMOM 15",
        instructions: "Use 60-70% of 1RM Snatch. Focus on vertical bar path.",
        movements: ["1 Power Snatch + 1 Hang Snatch + 1 OHS"],
      },
    ],
  },
  {
    id: "p_03",
    title: "Metabolic Stress: Row/Thruster",
    description:
      "A 'couplet' designed to maximize lactate production. This will burn.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Row", "Barbell", "Sprint"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["500m Row, 15 Thrusters (Empty Bar)"] },
      {
        name: "21-15-9",
        instructions:
          "Go unbroken on the thrusters if possible. Sprint the 9 cal row.",
        movements: ["Calories Row", "Thrusters (43/30kg)"],
      },
    ],
  },
  {
    id: "p_04",
    title: "Strict Strength: Press",
    description:
      "Pure overhead pressing power. No help from the legs (no dip).",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 40,
    tags: ["Shoulders", "Overhead"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: [
          "2 Rounds: 10 Prone Y-Raises, 10 Face Pulls, 10 Empty Bar Presses",
        ],
      },
      {
        name: "5x5",
        instructions: "Rest 3 mins between sets. Weight should be ~85% of 1RM.",
        movements: ["Strict Press"],
      },
    ],
  },
  {
    id: "p_05",
    title: "The 4km Row Finisher",
    description:
      "Building the 'diesel' engine. Focus on rhythmic breathing and powerful leg drive.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Row", "Endurance"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["20 Cal Row (Slow), 10 Bird-Dogs"] },
      {
        name: "Steady State",
        instructions:
          "Target a pace 10-15 seconds slower than your 2k split pace.",
        movements: ["4000m Row"],
      },
    ],
  },
  {
    id: "p_06",
    title: "Front Squat Volume",
    description:
      "High density strength work. Short rest periods build capacity under fatigue.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Legs", "Squat"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["3 Rounds: 10 Goblet Squats, 10 Glute Bridges"],
      },
      {
        name: "10x3",
        instructions:
          "Perform 3 reps every 90 seconds. Weight should be 80% of 1RM.",
        movements: ["Front Squat"],
      },
    ],
  },
  {
    id: "p_07",
    title: "Murph (Unpartitioned)",
    description:
      "The gold standard of endurance. No partitioning means finishing all reps of one movement before the next.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 60,
    tags: ["Hero WOD", "Long"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["800m Jog, 20 Air Squats, 10 Pushups"] },
      {
        name: "For Time (20lb Vest)",
        instructions:
          "Complete in order: 1 Mile Run, then all Pullups, then all Pushups, then all Squats, then 1 Mile Run.",
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
    description:
      "Brutal core and carry endurance. Use a shoulder or 'bear hug' carry.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 35,
    tags: ["Running", "Sandbag"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["5 mins joint prep, 200m light carry"] },
      {
        name: "1600m Carry",
        instructions:
          "Cover 1 mile as fast as possible. Switch carrying positions as needed.",
        movements: ["1600m Sandbag Carry (20/30kg)"],
      },
    ],
  },
  {
    id: "p_09",
    title: "Pistol Squat Skill",
    description:
      "Unilateral strength and balance. Use a counterweight or bench for support if needed.",
    category: "Mobility",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Legs", "Balance"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["Ankle mobility (2m), 20 Air Squats"] },
      {
        name: "EMOM 10",
        instructions:
          "Perform 3-5 pistols per leg every minute. Rest remainder of minute.",
        movements: ["Pistol Squat Progressions"],
      },
    ],
  },
  {
    id: "p_10",
    title: "Double Under Mastery",
    description:
      "Efficiency test. Double unders require a relaxed grip and high vertical jumps.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 20,
    tags: ["Skill", "Jump Rope"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["Calf stretches, 50 Single Unders"] },
      {
        name: "10 min EMOM",
        instructions:
          "Accumulate 30-50 reps per minute. Focus on timing, not speed.",
        movements: ["30-50 Double Unders"],
      },
    ],
  },
  {
    id: "p_11",
    title: "Heavy Grace",
    description:
      "30 Clean and Jerks for time. This is a classic CrossFit benchmark at a pro weight.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 15,
    tags: ["Barbell", "Power"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["Barbell Warmup: 10 Cleans, 10 Push Press"],
      },
      {
        name: "30 Reps",
        instructions: "Weight: 61/43kg. Target is sub 5:00 for elite athletes.",
        movements: ["Clean and Jerk"],
      },
    ],
  },
  {
    id: "p_12",
    title: "The Ergathlon",
    description:
      "Triple-erg test. Minimal transitions are key. Maintain a steady aerobic pace.",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 40,
    tags: ["Row", "Ski", "Bike"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["2 mins on each erg at low intensity"] },
      {
        name: "For Time",
        instructions: "Move quickly between machines. Do not stop moving.",
        movements: ["2000m Row", "2000m Ski", "4000m Bike"],
      },
    ],
  },
  {
    id: "p_13",
    title: "Pause Squat Intensity",
    description:
      "Removing the 'stretch reflex' to build raw strength from the bottom of the squat.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 50,
    tags: ["Squat", "Pause"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["Hip openers, 2 sets of 10 squats (Empty bar)"],
      },
      {
        name: "6x2",
        instructions:
          "Hold for 3 seconds in the bottom. Rest 3 mins between sets.",
        movements: ["Back Squat"],
      },
    ],
  },
  {
    id: "p_14",
    title: "Burpee/Box Jump 50",
    description:
      "High-volume plyometrics and metabolic demand. Stay efficient on the box step-down.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 25,
    tags: ["Explosive", "Lungs"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["20 Step-ups, 10 Burpees"] },
      {
        name: "50-40-30-20-10",
        instructions:
          "Descending rep scheme. Rest only as needed to keep moving.",
        movements: ["Burpee Box Jumps", "Wall Balls"],
      },
    ],
  },
  {
    id: "p_15",
    title: "Snatch Balance: Stability",
    description:
      "A technical drill to build confidence in 'catching' the snatch in a deep overhead squat.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 35,
    tags: ["Snatch", "Technique"],
    isPremium: true,
    blocks: [
      {
        name: "Warmup",
        movements: ["PVC overhead squats, shoulder pass-throughs"],
      },
      {
        name: "5x3",
        instructions: "Moderate weight. Focus on the 'punch' under the bar.",
        movements: ["Snatch Balance", "Overhead Squat"],
      },
    ],
  },
  {
    id: "p_16",
    title: "Muscle-Up Progressions",
    description:
      "Elite gymnastics skill work. Focus on the 'transition' through the rings/bar.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Gymnastics", "Skill"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["3 Rounds: 10 Ring Rows, 10 Ring Dips"] },
      {
        name: "EMOM 12",
        instructions:
          "Perform 3-5 reps or the hardest progression you can master.",
        movements: ["Muscle Ups"],
      },
    ],
  },
  {
    id: "p_17",
    title: "The 5km Run Benchmark",
    description:
      "Aerobic capacity test. Aim for a sub 20:00 (Advanced) or sub 18:00 (Elite).",
    category: "Conditioning",
    difficulty: "Advanced",
    estimatedTime: 35,
    tags: ["Running", "Aerobic"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["1km Jog, 2 x 100m Strides, Leg Swings"] },
      {
        name: "Time Trial",
        instructions:
          "Run on a flat course or track. Pacing is crucial in the first 2km.",
        movements: ["5000m Run"],
      },
    ],
  },
  {
    id: "p_18",
    title: "Devil Press Ladder",
    description:
      "Extremely high metabolic demand. Use the swing of the dumbbells to help the overhead movement.",
    category: "WOD",
    difficulty: "Advanced",
    estimatedTime: 30,
    tags: ["Dumbbell", "Lungs"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["2 Rounds: 10 DB Snatches, 5 Burpees"] },
      {
        name: "For Time",
        instructions:
          "Descending ladder of Devil Press (10 to 1) and Box Step Ups (20 to 2).",
        movements: ["Devil Press", "Box Step Ups"],
      },
    ],
  },
  {
    id: "p_19",
    title: "Weighted Dips / Pullups",
    description:
      "Old school strength for upper body mass and power. Use a dipping belt.",
    category: "Strength",
    difficulty: "Advanced",
    estimatedTime: 45,
    tags: ["Calisthenics", "Heavy"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["2 sets of bodyweight pullups and dips"] },
      {
        name: "5x5",
        instructions: "Superset movements. Rest 2-3 mins between sets.",
        movements: ["Weighted Pull-ups", "Weighted Dips"],
      },
    ],
  },
  {
    id: "p_20",
    title: "The Hybrid Finisher",
    description:
      "A combination of erg and bodyweight movements to finish the week.",
    category: "Hyrox",
    difficulty: "Advanced",
    estimatedTime: 40,
    tags: ["Hybrid", "Finishers"],
    isPremium: true,
    blocks: [
      { name: "Warmup", movements: ["500m Jog, 10 Burpees"] },
      {
        name: "For Time",
        instructions:
          "No rest between stations. Push the pace on the 500m runs.",
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
