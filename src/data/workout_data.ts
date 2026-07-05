import type { StandaloneWorkoutSource } from '@/src/types/workouts';

import { hyrox } from './workouts/hyrox';
import { oly } from './workouts/oly';
import { rainhill } from './workouts/rainhill';
import { strength } from './workouts/strength';
import { wods } from './workouts/wods';

export const workouts: StandaloneWorkoutSource[] = [
  ...oly,
  ...rainhill,
  ...strength,
  ...wods,
  ...hyrox,
  {
    id: 'f_01',
    title: 'The Triple Stack',
    description:
      'Classic AMRAP. Aim for a consistent pace you can maintain for the full duration. Target 5+ rounds.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['AMRAP'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 200m Jog, 10 Air Squats, 10 Scapular Pushups'],
      },
      {
        name: '15 Min AMRAP',
        instructions:
          'As many rounds as possible in 15 mins. No scheduled rest; rest only as needed.',
        movements: ['10 Burpees', '20 Air Squats', '30 Sit-ups'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_02',
    title: 'Death by 10 Metres',
    description:
      'An EMOM shuttle test with a twist. Each round you add a sprint, and a movement penalty. Starts easy, becomes a full-body lung burner fast.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Sprint', 'Lungs'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 Rounds: 30s High Knees, 30s Butt Kicks, 5 Inchworms, 5 Broad Jumps',
        ],
      },
      {
        name: 'Death by 10 Metres',
        instructions:
          'Start clock. Each minute, complete the required sprints PLUS the movement penalty for that round. Add one sprint every minute. Continue until you cannot complete the work within the minute.',
        movements: [
          'Min 1: 1 x 10m sprint + 5 Burpees',
          'Min 2: 2 x 10m sprints + 10 Push-ups',
          'Min 3: 3 x 10m sprints + 15 Air Squats',
          'Min 4: 4 x 10m sprints + 5 Burpees',
          'Min 5+: Continue adding 1 sprint per minute, cycling through the movement penalties',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_03',
    title: 'Hold the Line',
    description:
      "Focus on 'bracing' your midsection. Movement should be slow and controlled.",
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Core', 'Abs'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 10 Cat-Cow, 10 Bird-Dogs'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 60s between rounds. Focus on keeping lower back glued to the floor during Hollow Rocks.',
        movements: ['45s Plank', '15 Hollow Rocks', '30s Side Plank (L/R)'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_06',
    title: 'Upper Body Blitz',
    description:
      'Hypertrophy focus. Control the eccentric (lowering) phase for 2 seconds on every rep.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Upper Body', 'Pump'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 10 Pushups, 10 Prone Y-Raises, 10 Arm Circles'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds to allow for maximum effort on the next set.',
        movements: [
          'Max Pushups',
          '15 Inverted Rows (or Towel Rows)',
          '12 Dips (on chair/bench)',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_07',
    title: 'Row Till You Break',
    description:
      'Pure anaerobic punishment. Three cracks at 500m, each one should leave you breathless. Rest just enough to go again, but not enough to fully recover. Your split time is your score.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 Air Squats',
          '10 Push-ups (kneeling if required)',
          '500m Easy Row',
          '2 min rest before starting',
        ],
      },
      {
        name: '3 x 500m Row - Max Effort',
        instructions:
          '3 attempts at 500m, all-out each time. Rest exactly 3 minutes between efforts. Record your split time for each. Your score is your fastest split.',
        movements: [
          '500m Row Sprint - Attempt 1',
          '3 min rest',
          '500m Row Sprint - Attempt 2',
          '3 min rest',
          '500m Row Sprint - Attempt 3',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          'Shoulder Health mobility flow OR:',
          '60s seated forward fold',
          '60s pigeon stretch each side',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_08',
    title: 'Desk Job Recovery',
    description:
      'The antidote to sitting. Focus on breathing deeply into each stretch.',
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Recovery', 'Postures'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 mins light walking or jogging to warm the tissues'],
      },
      {
        name: 'Flow',
        instructions:
          "Hold each pose for the specified time. Don't force the range; let gravity do the work.",
        movements: [
          'Couch Stretch (2m/side)',
          'Pigeon Pose (2m/side)',
          'Thoracic Extensions (15 reps)',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_09',
    title: 'Standard PFT',
    description:
      'The official Hyrox Physical Fitness Test. Use this to gauge your current level.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Test'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['500m Run, 10 Burpees, 10 Air Squats'],
      },
      {
        name: 'For Time',
        instructions:
          'Minimal transition time between movements. Record your total time.',
        movements: [
          '1000m Run',
          '30 Burpee Broad Jumps',
          '200m Sandbag Lunges',
          '1000m Row',
          '30 Wall Balls',
        ],
      },
    ],
    equipment: ['sandbag', 'medicine ball', 'rower'],
  },
  {
    id: 'f_10',
    title: 'Hip Snap',
    description:
      'Posterior chain power, built one swing at a time. The reps climb every two minutes so there is no cruising. Flat back, aggressive hip snap, and let the bell float.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Power'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '20 Hip Hinges',
          '10 Pushups',
          '10 Romanian Deadlifts (light KB)',
          '10 KB Deadlifts (working weight)',
        ],
      },
      {
        name: 'EMOM 10',
        instructions:
          'Perform the reps at the start of every minute. Rest for the remainder. Reps climb every 2 minutes so pace yourself on the early rounds. If form breaks, drop the reps not the bell.',
        movements: [
          'Min 1-2: 12 KB Swings',
          'Min 3-4: 15 KB Swings',
          'Min 5-6: 18 KB Swings',
          'Min 7-8: 21 KB Swings',
          'Min 9-10: 24 KB Swings',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          "60s Child's Pose",
          '60s Glute Bridge Hold',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['kettlebell'],
  },
  {
    id: 'f_11',
    title: 'The 400 Club',
    description:
      'Five rounds of 400m at 90-95% effort. The goal is consistency, not just a fast first rep. If your splits are falling apart by round three, you went out too hot. Record every split and chase them next time.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Running', 'Speed', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '1km Easy Jog',
          'Leg Swings x 10 each direction',
          'High Knees x 20m',
          'Butt Kicks x 20m',
          '2 x 50m Strides (building to 80%)',
        ],
      },
      {
        name: '5 x 400m',
        instructions:
          'Rest exactly 90 seconds between efforts. Record your split each round. Stay relaxed in the face and shoulders, tension costs you speed. Aim to finish rounds 4 and 5 within 5 seconds of round 1.',
        movements: [
          '400m Run',
          '90s rest',
          '400m Run',
          '90s rest',
          '400m Run',
          '90s rest',
          '400m Run',
          '90s rest',
          '400m Run',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '800m Easy Walk or Jog',
          '60s Hip Flexor Stretch each side',
          '60s Standing Hamstring Stretch each side',
          '60s Calf Stretch each side',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_12',
    title: 'The Pushup Pyramid',
    description:
      'Every rep earned. You climb to 10 and fight your way back down. Rest only as long as the set took. Form over speed, chest to floor every time.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Chest'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 Rounds: 10 Shoulder Taps, 10 Scapular Pushups'],
      },
      {
        name: 'The Pyramid',
        instructions:
          'Work up from 1 rep to 10, then back down to 1. Rest between each set for roughly the same time it took to complete it. No rushing, no sloppy reps.',
        movements: [
          '1 Pushup, rest',
          '2 Pushups, rest',
          '3 Pushups, rest',
          '4 Pushups, rest',
          '5 Pushups, rest',
          '6 Pushups, rest',
          '7 Pushups, rest',
          '8 Pushups, rest',
          '9 Pushups, rest',
          '10 Pushups, rest',
          '9 Pushups, rest',
          '8 Pushups, rest',
          '7 Pushups, rest',
          '6 Pushups, rest',
          '5 Pushups, rest',
          '4 Pushups, rest',
          '3 Pushups, rest',
          '2 Pushups, rest',
          '1 Pushup',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_13',
    title: 'Four Minutes of Fury',
    description:
      '4 minutes. That is all. But if you are not redlining by round 4 you are not working hard enough. Tabata protocol: 20 seconds all-out, 10 seconds to survive. Eight rounds, alternating between two movements. No excuses.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 10,
    tags: ['Tabata', 'Quick'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '60s High Knees',
          '10 Squat to Stand',
          '10 Explosive Jump Squats (easy pace)',
          '10 Burpees (steady pace)',
        ],
      },
      {
        name: 'Tabata: 20s Work / 10s Rest x 8 Rounds',
        instructions:
          'Alternate between Jump Squats and Burpees each round. 20 seconds all-out, 10 seconds rest. Count your reps and try to hold consistent numbers across all 8 rounds.',
        movements: [
          'Round 1: Jump Squats (20s), rest (10s)',
          'Round 2: Burpees (20s), rest (10s)',
          'Round 3: Jump Squats (20s), rest (10s)',
          'Round 4: Burpees (20s), rest (10s)',
          'Round 5: Jump Squats (20s), rest (10s)',
          'Round 6: Burpees (20s), rest (10s)',
          'Round 7: Jump Squats (20s), rest (10s)',
          'Round 8: Burpees (20s), rest (10s)',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_14',
    title: 'Handstand Prep',
    description:
      'Shoulder stability and technical positioning. Stop immediately if form breaks down.',
    category: 'Mobility',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Shoulders', 'Skill'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['3 Rounds: 10 Wrist Stretches, 10 Wall Slides'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds. Quality is the goal here, not fatigue.',
        movements: [
          '30s Wall Walk/Hold',
          '10 Scapular Pushups',
          '20 Shoulder Taps',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_15',
    title: 'The Endless Climb',
    description:
      'A ladder that never stops climbing. Every round adds 2 reps to both movements and the clock does not care. Pace yourself early or blow up before the halfway mark. Your score is the round you reach when time is called.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Legs', 'Lungs'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 Rounds: 10 Air Squats, 5 Burpees',
          'Rest 60s before starting',
        ],
      },
      {
        name: '10 Min AMRAP Ladder',
        instructions:
          'Start at 2 reps and add 2 each round. No scheduled rest, move at a pace you can sustain. When time is called, record the round you completed as your score.',
        movements: [
          'Round 1: 2 Burpees, 2 Air Squats',
          'Round 2: 4 Burpees, 4 Air Squats',
          'Round 3: 6 Burpees, 6 Air Squats',
          'Round 4: 8 Burpees, 8 Air Squats',
          'Round 5: 10 Burpees, 10 Air Squats',
          'Round 6: 12 Burpees, 12 Air Squats',
          'Round 7: 14 Burpees, 14 Air Squats',
          'Round 8: 16 Burpees, 16 Air Squats',
          'Round 9: 18 Burpees, 18 Air Squats',
          'Round 10: 20 Burpees, 20 Air Squats',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_16',
    title: 'Shoulder Health Flow',
    description:
      'Prehab for athletes with stiff shoulders. Use a light resistance band.',
    category: 'Mobility',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['Shoulders', 'Prehab'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 mins Arm Swings and Thoracic Twists'],
      },
      {
        name: 'Flow',
        instructions:
          "Move through the reps slowly. Focus on 'feeling' the scapula move on the ribcage.",
        movements: [
          'Band Dislocates (20)',
          'Face Pulls (20)',
          'Wall Slides (15)',
        ],
      },
    ],
    equipment: ['bands'],
  },
  {
    id: 'f_17',
    title: 'Learn the Rope',
    description:
      'Jump rope is a skill before it is a workout. This session is about building rhythm and foot speed, not fitness. Stay light on the balls of your feet, keep your elbows in, and do not stare at the ground. Trip? Reset and go again, everyone does.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Cardio', 'Skill'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '30s Ankle Circles each foot',
          '50 Calf Raises',
          '30s Bounce in place on balls of feet (no rope)',
          '30s Wrist circles',
        ],
      },
      {
        name: 'Skill Practice: 5 Rounds',
        instructions:
          'Each round has a focus point. Read it before you start and keep it in your head while you jump. Rest 60 seconds between rounds. Tripping is fine, resetting quickly is the skill.',
        movements: [
          'Round 1: 2 mins steady jump rope. Focus: find your rhythm, nothing else.',
          'Round 2: 2 mins steady jump rope. Focus: keep elbows close to your sides.',
          'Round 3: 2 mins steady jump rope. Focus: stay light, minimal ground contact.',
          'Round 4: 2 mins steady jump rope. Focus: eyes forward, not at the floor.',
          'Round 5: 2 mins steady jump rope. Focus: put it all together.',
        ],
      },
    ],
    equipment: ['skipping rope'],
  },
  {
    id: 'f_18',
    title: 'Ground & Pound',
    description:
      'Core tension, shoulder stability and leg power, all without touching a single piece of kit. Each minute has two movements that fight each other in the best way. Get through both and the rest of the minute is yours.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Full Body', 'Core'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '30s Wrist Circles each direction',
          '10 Cat-Cow',
          '10 Bird-Dog each side',
          '10 Glute Bridges',
        ],
      },
      {
        name: 'EMOM 10',
        instructions:
          'Complete both movements at the start of each minute. Whatever time is left is your rest. Keep quality high throughout, this is not a race.',
        movements: [
          'Min 1: 10 Push-ups, 10 Jump Squats',
          'Min 2: 10 Push-ups, 10 Jump Squats',
          'Min 3: 12 Push-ups, 12 Jump Squats',
          'Min 4: 12 Push-ups, 12 Jump Squats',
          'Min 5: 14 Push-ups, 14 Jump Squats',
          'Min 6: 14 Push-ups, 14 Jump Squats',
          'Min 7: 16 Push-ups, 16 Jump Squats',
          'Min 8: 16 Push-ups, 16 Jump Squats',
          'Min 9: 18 Push-ups, 18 Jump Squats',
          'Min 10: 18 Push-ups, 18 Jump Squats',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_19',
    title: 'Grip Strength 101',
    description:
      "Building the foundations for pullups and heavy deadlifts. Don't use straps.",
    category: 'Strength',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Grip', 'Arms'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Wrist circles, 20 Hand Clenches'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds. The goal is to reach near-failure on the hang.',
        movements: ['Max Hang from Pull-up Bar', '40m Farmers Walk (Heavy)'],
      },
    ],
    equipment: ['dumbbell', 'pull-up bar'],
  },
  {
    id: 'f_20',
    title: 'The Long Pull',
    description:
      'This is not a sprint. Four rounds of rowing with bodyweight work in between, building fatigue the way a Hyrox race does. Your legs will be burning before you sit back down. Record your 500m split each row and try to hold it across all four rounds.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Benchmark', 'Full Body'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m Easy Row',
          '5 High Power strokes',
          '10 Squat to Stand',
          '10 Glute Bridges',
          'Rest 90s before starting',
        ],
      },
      {
        name: '4 Rounds',
        instructions:
          'Complete the row then move straight into the floor work, no rest between them. Rest 2 minutes after completing all three movements before starting the next round. Record your 500m row split each round.',
        movements: [
          'Round 1: 500m Row (record split), 15 Burpees, 20 Air Squats',
          'Rest 2 mins',
          'Round 2: 500m Row (record split), 15 Burpees, 20 Air Squats',
          'Rest 2 mins',
          'Round 3: 500m Row (record split), 15 Burpees, 20 Air Squats',
          'Rest 2 mins',
          'Round 4: 500m Row (record split), 15 Burpees, 20 Air Squats',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '3 mins Easy Row',
          '60s Seated Forward Fold',
          '60s Pigeon Stretch each side',
          '60s Hip Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_21',
    title: 'Chest & Triceps',
    description:
      'A classic push session built around the bench press. Control the descent on every rep - the lowering phase is where the chest work really happens.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Chest', 'Triceps'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '10 arm circles forward / 10 arm circles backward',
          '10 scapular push-ups',
          '1 light set of 15 push-ups focusing on shoulder stability',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 90–120s between sets. Focus on a 2-second controlled descent on all pressing movements.',
        movements: [
          {
            name: 'Barbell or Dumbbell Bench Press',
            value: '4 x 10',
            note: 'Touch chest lightly on each rep. Do not bounce.',
          },
          {
            name: 'Incline Dumbbell Press',
            value: '3 x 12',
            note: '30–45° incline. Feel the stretch at the bottom.',
          },
          {
            name: 'Dumbbell or Cable Flyes',
            value: '3 x 15',
            note: 'Keep a slight bend in the elbow throughout. Squeeze at the top.',
          },
        ],
      },
      {
        name: 'Tricep Finisher',
        instructions:
          'Rest 60s between sets. Keep elbows pinned - only forearms should move.',
        movements: [
          {
            name: 'Dips (Bench or Bar)',
            value: '3 x 12',
            note: 'Stay upright to keep the load on the triceps.',
          },
          {
            name: 'Overhead Tricep Extension (DB or Cable)',
            value: '3 x 12',
            note: 'Full stretch at the bottom - do not rush.',
          },
        ],
      },
      {
        name: 'Shoulder Health',
        instructions:
          'Light weight only. This is prehab, not a strength exercise.',
        movements: [
          {
            name: 'Reverse Flyes or Band Pull-Aparts',
            value: '3 x 15',
            note: 'Counterbalances the pressing work. Lead with the elbows.',
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'bands'],
  },
  {
    id: 'f_22',
    title: 'Back & Biceps',
    description:
      'A pulling session focused on building lat width and mid-back thickness. Think of your hands as hooks - pull with your elbows, not your hands.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Back', 'Biceps'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio (rower preferred)',
          '10 band pull-aparts or scapular wall slides',
          '10 dead bugs (controlled, alternating)',
          '1 light set of 10 dumbbell rows each side',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 90–120s between sets. Initiate every pull by retracting your shoulder blade first.',
        movements: [
          {
            name: 'Barbell Row or Dumbbell Row',
            value: '4 x 10',
            note: 'Keep torso parallel to floor. Pull elbows toward your back pockets.',
          },
          {
            name: 'Pull-ups or Lat Pulldown',
            value: '3 x 8–12',
            note: 'Full dead hang at the bottom on every rep. Pull chest to bar.',
          },
          {
            name: 'Seated Cable Row or Inverted Row',
            value: '3 x 12',
            note: 'Squeeze shoulder blades together and hold for a beat at the peak.',
          },
        ],
      },
      {
        name: 'Bicep Finisher',
        instructions:
          'Rest 60s between sets. No swinging - keep elbows pinned.',
        movements: [
          {
            name: 'Dumbbell Bicep Curls',
            value: '3 x 12',
            note: 'Supinate (rotate) the wrist at the top to fully contract the bicep.',
          },
          {
            name: 'Hammer Curls',
            value: '3 x 12',
            note: 'Neutral grip targets the brachialis. Keep wrists straight throughout.',
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'rower', 'pull-up bar', 'bands', 'static machines'],
  },
  {
    id: 'f_23',
    title: 'Legs: Squat & Hinge',
    description:
      'A balanced lower body session covering both the anterior and posterior chain. The most important session of the week for overall strength and body composition.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 55,
    tags: ['Legs', 'Squat'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins bike or rower',
          '30s hip flexor stretch each side / 30s pigeon pose each side',
          '10 glute bridges with 2s pause at the top',
          '10 bodyweight squats with controlled tempo',
        ],
      },
      {
        name: 'Main Work',
        instructions:
          'Rest 2 mins between sets on squats. Rest 90s on accessory work.',
        movements: [
          {
            name: 'Barbell Back Squat or Leg Press',
            value: '4 x 10',
            note: 'Sit back and down. Drive the floor away on the way up.',
          },
          {
            name: 'Romanian Deadlift (Barbell or Dumbbell)',
            value: '3 x 12',
            note: 'Push hips back until you feel a deep hamstring stretch. Drive hips through at the top and squeeze glutes.',
          },
          {
            name: 'Walking Lunges or Split Squat',
            value: '3 x 10 each leg',
            note: 'Keep your front shin vertical. Do not let the knee cave inward.',
          },
        ],
      },
      {
        name: 'Isolation Finisher',
        instructions:
          'Rest 60s between sets. Full range of motion on both movements.',
        movements: [
          {
            name: 'Leg Extension or Leg Curl',
            value: '3 x 15',
            note: 'Pause for 1 second at peak contraction on each rep.',
          },
          {
            name: 'Calf Raises',
            value: '3 x 20',
            note: 'All the way up, all the way down. Slow eccentric.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Hanging Leg Raise or Plank',
            value: '3 x 12 / 3 x 45s',
            note: 'No spinal load after heavy squats. Hip flexion only.',
          },
        ],
      },
    ],
    equipment: [
      'dumbbell',
      'barbell',
      'rower',
      'pull-up bar',
      'static machines',
    ],
  },
  {
    id: 'f_24',
    title: "Mikko's Triangle",
    description:
      'A classic erg benchmark. Pick a single calorie target and complete that amount every working minute — every minute.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Benchmark', 'EMOM'],
    isPremium: true,
    blocks: [
      {
        name: 'Setup',
        movements: ['Set up a rower, SkiErg, and Assault Bike (or Echo Bike).'],
      },
      {
        name: 'EMOM 39',
        instructions:
          'Minute 1: Row. Minute 2: SkiErg. Minute 3: Assault Bike. Minute 4: Rest. Repeat this sequence until 39:00. Choose one calorie number and hit it on each working minute.',
        movements: [
          '1 min Row (calories)',
          '1 min SkiErg (calories)',
          '1 min Assault Bike (calories)',
          '1 min Rest',
        ],
      },
    ],
    equipment: ['rower', 'bike', 'ski erg'],
  },
  {
    id: 'f_30',
    title: 'Cindy',
    description:
      'The classic 20-minute bodyweight engine test. Smooth is fast. Keep sets crisp.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['AMRAP', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 Rounds: 6–8 pull-ups (or ring rows), 8 push-ups, 10 air squats',
        ],
      },
      {
        name: '20 Min AMRAP',
        instructions: 'As many rounds as possible in 20 mins.',
        movements: ['5 Pull-ups', '10 Push-ups', '15 Air Squats'],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_31',
    title: 'Fran',
    description:
      'A fast, brutal classic. Sprint the barbell, survive the pull-ups.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['For Time', 'Benchmark', 'Thrusters'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m Row',
          '2 x 10 Thrusters (empty bar)',
          '2 x 6 Pull-ups (or ring rows)',
        ],
      },
      {
        name: '21-15-9 For Time',
        instructions:
          '43/30kg suggested. Scale load to keep the thrusters unbroken or 2 sets max.',
        movements: ['Thrusters', 'Pull-ups'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar'],
  },
  {
    id: 'f_32',
    title: 'Helen',
    description:
      'Short rounds, high output. The run is your limiter. The swings are your tax.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['For Time', 'Benchmark', 'Run'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m Easy Run',
          '2 Rounds: 10 KB swings (light), 5 pull-ups (or ring rows)',
        ],
      },
      {
        name: '3 Rounds For Time',
        instructions:
          'Scale the swing weight so every rep is powerful and unbroken.',
        movements: ['400m Run', '21 KB Swings', '12 Pull-ups'],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'f_33',
    title: 'Annie',
    description:
      'A pure midline and engine burner. Keep the jump rope relaxed and efficient.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['For Time', 'Benchmark', 'Core', 'Rope'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins easy skipping',
          '2 Rounds: 15 sit-ups, 30 single-unders',
        ],
      },
      {
        name: 'For Time',
        instructions: '50-40-30-20-10. Double-unders and sit-ups.',
        movements: ['Double-Unders', 'Sit-ups'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_34',
    title: 'Grace',
    description:
      'Power, speed, and composure under fatigue. Every rep should be snappy.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['For Time', 'Benchmark', 'Clean and Jerk'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins easy row',
          'Build: 5-3-2 clean & jerks (light → working)',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '30 clean & jerks (60/40kg suggested). Scale so you can cycle fast singles or small sets.',
        movements: ['30 Clean & Jerks'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'f_35',
    title: 'Karen',
    description:
      'Simple on paper. Mentally heavy in reality. Small sets from the start.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['For Time', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m Easy Jog', '3 x 10 Wall balls (light, easy)'],
      },
      {
        name: 'For Time',
        instructions:
          '150 wall balls. Target: consistent set size and short rests.',
        movements: ['150 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_36',
    title: 'Jackie',
    description:
      'Engine into grip and shoulders. Keep the row controlled and the thrusters smooth.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['For Time', 'Benchmark', 'Thrusters'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m easy row',
          '2 x 10 thrusters (empty bar)',
          '2 x 5 pull-ups (or ring rows)',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '1000m row, then 50 thrusters (20/15kg), then 30 pull-ups.',
        movements: ['1000m Row', '50 Thrusters', '30 Pull-ups'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar'],
  },
  {
    id: 'f_37',
    title: 'Nancy',
    description:
      'Legs and lungs. The overhead squat demands patience and positioning.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['For Time', 'Benchmark', 'Run', 'Overhead Squat'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m easy run', '2 x 8 overhead squats (PVC/empty bar)'],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          '15 OHS at 43/30kg suggested. Scale to stay unbroken or 2 sets.',
        movements: ['400m Run', '15 Overhead Squats'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_38',
    title: 'Diane',
    description:
      'Heavy hinge plus inverted pressing. Keep your back safe and your sets smart.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['For Time', 'Benchmark', 'Deadlift', 'HSPU'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 rounds: 8 deadlifts (light), 8 pike push-ups, 8 hollow rocks',
        ],
      },
      {
        name: '21-15-9 For Time',
        instructions:
          'Deadlift 102/70kg suggested. Scale both movements to keep form.',
        movements: ['Deadlifts', 'Handstand Push-ups'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_39',
    title: 'Isabel',
    description:
      'Speed under a bar. Your best score is the fastest safe cycling you can manage.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['For Time', 'Benchmark', 'Snatch'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins easy cardio',
          'Build: 3-3-2 snatch (light → working)',
        ],
      },
      {
        name: 'For Time',
        instructions: '30 snatches (61/43kg suggested). Scale to fast singles.',
        movements: ['30 Snatches'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_40',
    title: 'Elizabeth',
    description:
      'Fast rounds. Clean technique, stable shoulders, and short rests.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['For Time', 'Benchmark', 'Clean'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m row',
          '2 x 6 power cleans (light)',
          '2 x 6 box dips (easy)',
        ],
      },
      {
        name: '21-15-9 For Time',
        instructions:
          'Cleans at 61/43kg suggested. Scale dips to maintain quality reps.',
        movements: ['Squat Cleans', 'Ring Dips'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar', 'box'],
  },
  {
    id: 'f_41',
    title: 'Angie',
    description:
      'A simple bodyweight chipper. Stay disciplined with sets so you don’t crater.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['For Time', 'Benchmark', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 rounds: 5 pull-ups, 10 push-ups, 10 sit-ups, 10 squats',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '100 pull-ups, 100 push-ups, 100 sit-ups, 100 air squats.',
        movements: [
          '100 Pull-ups',
          '100 Push-ups',
          '100 Sit-ups',
          '100 Air Squats',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_42',
    title: 'Barbara',
    description:
      'High output rounds with enforced rest. Sprint the work, then recover with intent.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['For Time', 'Benchmark', 'Intervals'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins easy cardio',
          '2 rounds: 10 sit-ups, 8 push-ups, 6 pull-ups, 10 squats',
        ],
      },
      {
        name: '5 Rounds (Time Each)',
        instructions:
          'Complete each round for time. Rest exactly 3 mins between rounds.',
        movements: [
          '20 Pull-ups',
          '30 Push-ups',
          '40 Sit-ups',
          '50 Air Squats',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_43',
    title: 'Chelsea',
    description:
      'A 30-minute EMOM. Keep moving, never sprint the early minutes.',
    category: 'WOD',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['EMOM', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          'Practice: 3 rounds easy (5 pull-ups, 10 push-ups, 15 squats)',
        ],
      },
      {
        name: 'EMOM 30',
        instructions:
          'Every minute for 30 mins: 5 pull-ups, 10 push-ups, 15 squats.',
        movements: ['5 Pull-ups', '10 Push-ups', '15 Air Squats'],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'f_44',
    title: 'Fight Gone Bad (Classic)',
    description:
      'A points-style benchmark. Output matters, but transitions matter more.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Benchmark', 'Intervals', 'For Score'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m easy jog',
          '1 round easy: 10 wall balls, 8 push press, 10 box step-ups',
        ],
      },
      {
        name: '3 Rounds',
        instructions:
          '1 min each station, 1 min rest between rounds. Score = total reps.',
        movements: [
          'Wall Balls',
          'Sumo Deadlift High Pull',
          'Box Jumps',
          'Push Press',
          'Calories Row',
        ],
      },
    ],
    equipment: ['barbell', 'medicine ball', 'box'],
  },
  {
    id: 'f_45',
    title: 'The Chief',
    description:
      'Short windows, high pace. The only goal is consistent output across sets.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Benchmark', 'AMRAP', 'Intervals'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m row',
          'Build: light power cleans + push press + front squats',
        ],
      },
      {
        name: '5 Cycles',
        instructions:
          'Each cycle: 3 mins AMRAP, then rest 1 min. Score = total rounds across all cycles.',
        movements: ['3 Power Cleans', '6 Push-ups', '9 Air Squats'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'f_46',
    title: 'DT',
    description:
      'Grip and barbell cycling. Break early to keep the bar moving.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['For Time', 'Benchmark', 'Chipper'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins easy cardio',
          '2 rounds: 6 deadlifts (light), 6 hang power cleans (light), 6 push jerks (light)',
        ],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          '12 deadlifts, 9 hang power cleans, 6 push jerks (70/47.5kg suggested).',
        movements: ['Deadlifts', 'Hang Power Cleans', 'Push Jerks'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'f_47',
    title: 'Kelly',
    description:
      'Longer benchmark with consistent rounds. Smooth transitions win.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['For Time', 'Benchmark', 'Run'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m easy run',
          '2 rounds: 10 wall balls, 10 box step-ups',
        ],
      },
      {
        name: '5 Rounds For Time',
        instructions: '400m run, 30 box jumps, 30 wall balls.',
        movements: ['400m Run', '30 Box Jumps', '30 Wall Balls'],
      },
    ],
    equipment: ['box', 'medicine ball'],
  },
  {
    id: 'f_48',
    title: 'Lynne',
    description:
      'Max reps under fatigue. Keep strict form, track total reps honestly.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Benchmark', 'For Score', 'Bench Press'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '500m row',
          '2 x 10 light bench press',
          '2 x 6 easy pull-ups (or ring rows)',
        ],
      },
      {
        name: '5 Rounds (Not For Time)',
        instructions:
          'Bench press bodyweight (or challenging load) max reps, then pull-ups max reps. Rest as needed.',
        movements: ['Bench Press (max reps)', 'Pull-ups (max reps)'],
      },
    ],
    equipment: ['barbell', 'rower', 'pull-up bar'],
  },
  {
    id: 'f_49',
    title: 'Kalsu',
    description:
      'A brutal thruster benchmark. Every minute you pay the burpee tax.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['For Time', 'Benchmark', 'Thrusters', 'Burpees'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['500m row', '2 x 8 thrusters (empty bar)', '2 x 5 burpees'],
      },
      {
        name: 'For Time',
        instructions:
          '100 thrusters. At the start of every minute: 5 burpees. Then continue thrusters with remaining time.',
        movements: ['100 Thrusters', 'Burpees (5 every minute)'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'f_50',
    title: 'Hyrox Prep: 4x (Run + Row)',
    description:
      'A simple Hyrox-style engine session. Keep transitions fast and breathing controlled.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Engine', 'Run', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m easy run',
          '500m easy row',
          '10 air squats, 10 lunges',
        ],
      },
      {
        name: '4 Rounds',
        instructions:
          'Partner option: alternate full rounds. Partner A completes the full round while Partner B rests. Swap each round. Record each person’s split times if you want.',
        movements: ['800m Run', '500m Row'],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_51',
    title: 'Sled Exposure (Light)',
    description:
      'Technique first. Learn bracing, posture, and smooth drive without redlining.',
    category: 'Hyrox',
    difficulty: 'Beginner',
    estimatedTime: 35,
    tags: ['Technique'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 x 20m empty sled push (or incline walk)',
          '2 x 20m light sled pull',
        ],
      },
      {
        name: 'Skill + Work',
        instructions: 'Record loads used. Keep every rep crisp.',
        movements: [
          '6 x 20m Sled Push (light)',
          '6 x 20m Sled Pull (light)',
          '6 x 10 Wall Balls (easy)',
        ],
      },
    ],
    equipment: ['medicine ball', 'sled'],
  },
  {
    id: 'f_52',
    title: 'Wall Ball Density 10',
    description:
      'Hyrox-specific density test. Pick a target pace and hold it without long breaks.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Benchmark', 'For Score'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins easy cardio',
          '3 x 10 wall balls (light → working)',
        ],
      },
      {
        name: '10 Min For Total Reps',
        instructions: 'Score = total wall balls. Keep sets small and steady.',
        movements: ['Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_53',
    title: 'Jump The Gap',
    description:
      'Eight rounds of burpee broad jumps, the movement that breaks people in Hyrox. The goal is consistent distance every round, not an all-out sprint that falls apart by round four. Solo or with a partner, the rules are the same: strong hips, full extension, calm breathing.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Intervals', 'Burpees', 'Jumps', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins Easy Jog',
          '3 mins Easy Row or Bike (if available)',
          '10 Burpees at easy pace',
          '10 Broad Jumps, focus on full hip extension',
          '10 Burpees at easy pace',
          '10 Broad Jumps, push the distance slightly',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'E2MOM x 8 Rounds',
        instructions:
          'Every 2 minutes, complete as many burpee broad jumps as possible in 60 seconds. Rest the remaining 60 seconds. Solo: track your distance or rep count each round and aim to hold it. Partner: Partner A works the first 60s, Partner B works the second 60s, alternating each round. Team goal is consistent distance across all 8 rounds.',
        movements: [
          'Round 1: 60s Burpee Broad Jumps, 60s rest',
          'Round 2: 60s Burpee Broad Jumps, 60s rest',
          'Round 3: 60s Burpee Broad Jumps, 60s rest',
          'Round 4: 60s Burpee Broad Jumps, 60s rest',
          'Round 5: 60s Burpee Broad Jumps, 60s rest',
          'Round 6: 60s Burpee Broad Jumps, 60s rest',
          'Round 7: 60s Burpee Broad Jumps, 60s rest',
          'Round 8: 60s Burpee Broad Jumps, 60s rest',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '2 mins Easy Walk',
          '60s Hip Flexor Stretch each side',
          '60s Hamstring Stretch each side',
          '60s Glute Stretch each side',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_54',
    title: 'Carry Capacity Builder',
    description: 'Grip and posture under fatigue. Walk tall, breathe steady.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Carry', 'Grip', 'Run', 'Partner', 'For Time'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            movements: [
              '500m easy jog',
              '2 x 20m light carry',
              '10 reverse lunges each side',
            ],
          },
          {
            name: 'Workout',
            instructions:
              '5 Rounds, rest as needed, this one will feel heavy, expect to be slow and have to break up the heavy carry.',
            highlightInstructions: '5 Rounds',
            movements: ['600m Run', '100m Farmers Carry'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            movements: [
              '500m easy jog',
              '2 x 20m light carry',
              '10 reverse lunges each side',
            ],
          },
          {
            name: 'Workout',
            instructions:
              '5 Rounds. Run be completed TOGETHER, split the carry work between the team in a tag team style approach. Walk with your partner whilst the work as active recovery and rest. Rest while your partner works. This should feel fast.',
            highlightInstructions:
              '5 Rounds. Run together, split the carry work.',
            movements: ['600m Run', '150m Farmers Carry'],
          },
        ],
      },
    ],
    equipment: ['dumbbell'],
  },
  {
    id: 'f_55',
    title: 'Sandbag Lunge Repeatability',
    description:
      'Leg endurance with a Hyrox bias. Keep steps consistent and upright.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Lunges', 'Run', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 x 10 lunges (bodyweight)',
          '2 x 100m easy carry',
        ],
      },
      {
        name: '4 Sets',
        instructions:
          'Partner option: split the lunges. Run together, then alternate 25m/25m lunges (or 10 steps/10 steps). Record load and keep switchovers fast.',
        movements: ['800m Run', '200m Sandbag Lunges'],
      },
    ],
    equipment: ['sandbag'],
  },
  {
    id: 'f_56',
    title: 'Race Day Simulation',
    description:
      'Hyrox does not let you sit on a rower with fresh legs. This session makes sure you never do either. You will earn your 2000m row by getting through a full body burnout first, then rowing on legs that already have nothing left. That is the point.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Benchmark', 'Full Body'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins Easy Row, building pace every minute',
          '3 x 10 hard strokes with 20s rest between',
          '10 Burpees at easy pace',
          '10 Squat to Stand',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'The Burnout',
        instructions:
          'Complete all three movements as fast as possible with no rest between them. This is not for time but it should hurt. Move straight into the row when done.',
        movements: ['30 Burpee Broad Jumps', '40 Air Squats', '50 Push-ups'],
      },
      {
        name: '2000m Row: For Time',
        instructions:
          'Start the rower immediately after finishing the burnout. Record your time. Even splits for the first 1500m then empty the tank for the final 500m. This is your benchmark, chase it every time.',
        movements: ['2000m Row (record time)'],
      },
      {
        name: 'Cooldown',
        movements: [
          '3 mins Easy Row',
          '60s Seated Forward Fold',
          '60s Pigeon Stretch each side',
          '60s Hip Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_57',
    title: 'No Ski, No Problem',
    description:
      'No SkiErg? This is your substitute. The row covers the upper body pulling demand and the run keeps the legs turning over, just like race day transitions. Five rounds of both with no scheduled rest. Smooth is fast.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Engine', 'Run'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m Easy Run',
          '500m Easy Row',
          '10 Push-ups',
          '10 Air Squats',
          '10 Scapular Push-ups',
          'Rest 90s before starting',
        ],
      },
      {
        name: '5 Rounds: For Time',
        instructions:
          'No scheduled rest between movements or rounds. Rest only if you genuinely need to. Record your total time at the end. Keep the row powerful and vertical through the stroke, keep the run smooth and steady. The goal is consistent round times, not a fast round one and a dying round five.',
        movements: [
          'Round 1: 600m Run, 300m Row',
          'Round 2: 600m Run, 300m Row',
          'Round 3: 600m Run, 300m Row',
          'Round 4: 600m Run, 300m Row',
          'Round 5: 600m Run, 300m Row',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '400m Easy Walk',
          '60s Hip Flexor Stretch each side',
          '60s Hamstring Stretch each side',
          '60s Lat Stretch each side',
          '60s Chest Opener',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_58',
    title: 'Run to the Wall',
    description:
      'Run hard enough to make wall balls feel heavy, then stay composed anyway.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Run', 'Intervals', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '800m easy run',
          '2 x 10 wall balls (easy)',
          '10 burpees (easy)',
        ],
      },
      {
        name: '6 Rounds',
        instructions:
          'Partner option: alternate wall balls. Run together, then Partner A does 10 wall balls while Partner B rests, then switch for the next 10. Keep the run pace honest.',
        movements: ['500m Run', '20 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_59',
    title: 'Pit Stop',
    description:
      'Hyrox-style stations with minimal running. Great when space is limited.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Stations', 'Circuit', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '10 air squats, 10 lunges, 10 push-ups',
        ],
      },
      {
        name: '4 Rounds For Time',
        instructions:
          'Partner option: split the reps. For each movement, partner A completes the first half, partner B completes the second half, then move on together. Keep transitions tight.',
        movements: [
          '500m Row',
          '25 Wall Balls',
          '20 Burpee Broad Jumps',
          '50m Farmers Carry',
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'f_60',
    title: 'The Quiet Work',
    description:
      'Not every session needs to hurt. Zone 2 work is where your engine actually gets built, and most people skip it because it feels too easy. It is not. Stay conversational the whole time, if you cannot hold a sentence you are going too hard. Pick your machine and settle in.',
    category: 'Hyrox',
    difficulty: 'Beginner',
    estimatedTime: 40,
    tags: ['Aerobic', 'Zone 2', 'Engine'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins very easy cardio on your chosen machine',
          'Build pace slightly every 60s until you hit your working pace',
          'You should be breathing but comfortable before the clock starts',
        ],
      },
      {
        name: '30 Min Zone 2',
        instructions:
          'Pick one machine and stay on it. Maintain a conversational pace for the full 30 minutes. If you cannot speak in full sentences you are going too hard. If you feel like you could go forever you are probably right where you need to be. Record your distance at the end.',
        movements: [
          'Option A: 30 mins Steady Run',
          'Option B: 30 mins Steady Row',
          'Option C: 30 mins Steady Bike',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '5 mins very easy pace on your chosen machine',
          '60s Hip Flexor Stretch each side',
          '60s Hamstring Stretch each side',
          '60s Calf Stretch each side',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_61',
    title: 'Push Your Luck',
    description:
      'Hyrox sled push practice. Record load and quality. Smooth drive, no collapsing.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Intervals'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 x 20m light sled push',
          '10 wall balls (easy)',
        ],
      },
      {
        name: 'Work',
        instructions: 'Rest 90s between efforts. Record loads.',
        movements: [
          '8 x 20m Sled Push (moderate)',
          '4 x 15 Wall Balls (steady)',
        ],
      },
    ],
    equipment: ['medicine ball', 'sled'],
  },
  {
    id: 'f_62',
    title: 'Sled Pull Intervals (Moderate)',
    description:
      'Hyrox sled pull practice. Keep torso tall and stride consistent.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Intervals'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '2 x 20m light sled pull',
          '10 reverse lunges each side',
        ],
      },
      {
        name: 'Work',
        instructions: 'Rest 90s between efforts. Record loads.',
        movements: ['8 x 20m Sled Pull (moderate)', '4 x 200m Run (steady)'],
      },
    ],
    equipment: ['sled'],
  },
  {
    id: 'f_63',
    title: 'Roxzone Transitions',
    description:
      'Run in, get working fast. A session built around Hyrox transitions and composure.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Transitions', 'Run', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m easy jog', '10 burpees', '10 wall balls'],
      },
      {
        name: '6 Rounds',
        instructions:
          'Partner option: you-go-I-go on stations. Run together. At the station, Partner A completes burpees while Partner B rests, then switch for wall balls (or alternate round-by-round).',
        movements: ['600m Run', '10 Burpees', '15 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_64',
    title: 'Hyrox Mini AMRAP 12',
    description:
      'A short Hyrox-style effort when you want intensity without a long session.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['AMRAP', 'For Score', 'Engine', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          '10 air squats, 10 push-ups, 250m row',
        ],
      },
      {
        name: '12 Min AMRAP',
        instructions:
          'Partner option: alternate full rounds. Partner A completes one full round while Partner B rests. Swap each round. Score = total rounds + reps as a team.',
        movements: ['400m Run', '250m Row', '15 Wall Balls', '10 Burpees'],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'f_65',
    title: 'The Qualifier',
    description:
      'A Hyrox-style benchmark with accessible swaps. Minimal transition time.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Benchmark', 'Test'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m run', '10 burpees', '10 air squats'],
      },
      {
        name: 'For Time',
        instructions: 'Record total time.',
        movements: [
          '1000m Run',
          '50m Farmers Carry',
          '1000m Row',
          '50 Wall Balls',
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'f_66',
    title: 'Run Pacing Ladders',
    description:
      'A pacing session that teaches you how to control effort and recover quickly.',
    category: 'Hyrox',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Run', 'Pacing', 'Engine'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['10 mins easy jog + drills'],
      },
      {
        name: 'Ladder',
        instructions: 'Rest 2 mins between reps. Aim for negative splits.',
        movements: ['1000m Run', '800m Run', '600m Run', '400m Run'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_67',
    title: 'Grippy',
    description:
      'Carry medley under fatigue. Your job is to keep posture tall and steps clean.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Carry', 'Grip', 'For Time', 'Benchmark', 'Partner'],
    isPremium: false,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            movements: [
              '3 mins easy cardio',
              '2 x 40m light carry',
              '10 glute bridges',
            ],
          },
          {
            name: 'Workout',
            instructions:
              'A heavy chipper with a heavy carry finish. Work through each movement in full before moving on to the next. Rest only as needed to keep moving.',
            movements: [
              '400m Farmers Carry',
              '200m Sandbag Carry',
              '100m Overhead Plate Carry',
            ],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            movements: [
              '3 mins easy cardio',
              '2 x 40m light carry',
              '10 glute bridges',
            ],
          },
          {
            name: 'Workout',
            instructions:
              'A heavy chipper with a heavy carry finish. Work through each movement in full before moving on to the next. Split the carry work between the team in a tag team style approach. Walk with your partner whilst the work as active recovery and rest.',
            movements: [
              '400m Farmers Carry',
              '200m Sandbag Carry',
              '100m Overhead Plate Carry',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'sandbag'],
  },
  {
    id: 'f_68',
    title: 'Wall Ball 150 Test',
    description:
      'A Hyrox-flavoured benchmark. One movement. One goal. Keep moving.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Benchmark', 'For Time'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m easy jog', '3 x 10 wall balls (easy)'],
      },
      {
        name: 'For Time',
        instructions: '150 wall balls. Record finish time.',
        movements: ['150 Wall Balls'],
      },
    ],
    equipment: ['medicine ball'],
  },
  {
    id: 'f_69',
    title: 'Race Sim: Half',
    description:
      'A half-distance Hyrox-style simulation. Focus on steady output and smooth transitions.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Simulation', 'Run', 'Stations', 'Partner'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['10 mins easy jog + drills', '10 wall balls, 10 burpees'],
      },
      {
        name: 'For Time',
        instructions:
          'Partner format: split stations, run together. Keep all running as written. At each station, split the work 50/50 (or alternate small chunks). Record total team time and keep transitions tight.',
        movements: [
          '1000m Run',
          '500m Row',
          '1000m Run',
          '50m Farmers Carry',
          '1000m Run',
          '30 Burpee Broad Jumps',
          '1000m Run',
          '50 Wall Balls',
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'p_01',
    title: 'The Anvil Grinder',
    description:
      'Elite Hyrox preparation. Heavy sled work paired with aerobic fatigue.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Heavy', 'Elite'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['1km Jog, 10 Sled Pushes (Light), 20 Lunges'],
      },
      {
        name: '5 Rounds',
        instructions:
          'Rest 60s between rounds. Run at 70-80% of max heart rate.',
        movements: [
          '1km Run',
          '50m Sled Push (Max weight)',
          '100m Sandbag Carry',
        ],
      },
    ],
    equipment: ['sandbag', 'sled'],
  },
  {
    id: 'p_02',
    title: 'Olympic Complex: The Chief',
    description:
      'Developing technical speed and overhead stability with the snatch.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Snatch', 'Speed'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Burgener Warmup (Snatches with PVC pipe)'],
      },
      {
        name: 'EMOM 15',
        instructions: 'Use 60-70% of 1RM Snatch. Focus on vertical bar path.',
        movements: ['1 Power Snatch + 1 Hang Snatch + 1 OHS'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_03',
    title: 'Metabolic Stress: Row/Thruster',
    description:
      "A 'couplet' designed to maximise lactate production. This will burn.",
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Sprint'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['500m Row, 15 Thrusters (Empty Bar)'],
      },
      {
        name: '21-15-9',
        instructions:
          'Go unbroken on the thrusters if possible. Sprint the 9 cal row.',
        movements: ['Calories Row', 'Thrusters (43/30kg)'],
      },
    ],
    equipment: ['barbell', 'rower'],
  },
  {
    id: 'p_04',
    title: 'Press Day',
    description:
      'A proper overhead pressing session from the ground up. You will build to a heavy single, hit your volume work at 85%, then finish with accessory work that fills the gaps most pressers ignore. No leg drive, no excuses.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Shoulders', 'Overhead', 'Upper Body'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 Rounds: 10 Prone Y-Raises, 10 Face Pulls, 10 Empty Bar Presses',
          '10 Band Pull Aparts',
          '10 Shoulder CARs each side',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Single',
        instructions:
          'Five sets building to a heavy but not maximal single. This is 90-95% effort, not a true 1RM. Rest as needed between sets. This number sets your working weight for Block 2.',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM',
          'Set 2: 3 reps at 65% estimated 1RM',
          'Set 3: 2 reps at 75% estimated 1RM',
          'Set 4: 1 rep at 85% estimated 1RM',
          'Set 5: 1 rep at 90-95% estimated 1RM (record weight)',
        ],
      },
      {
        name: 'Block 2: 5x5 Volume',
        instructions:
          'Drop to 85% of your Block 1 heavy single. Five sets of five with 3 minutes rest between each. Bar path straight, glutes and core tight, no layback. If you miss a rep, do not add weight next set.',
        movements: [
          'Set 1: 5 Strict Press at 85%, rest 3 mins',
          'Set 2: 5 Strict Press at 85%, rest 3 mins',
          'Set 3: 5 Strict Press at 85%, rest 3 mins',
          'Set 4: 5 Strict Press at 85%, rest 3 mins',
          'Set 5: 5 Strict Press at 85% (record weight and any missed reps)',
        ],
      },
      {
        name: 'Block 3: Accessory Superset',
        instructions:
          'Three rounds of the superset below. Rest 60s between rounds. These movements target the weak links in overhead pressing: triceps, rear delts and rotator cuff stability.',
        movements: [
          'Round 1: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls, 10 External Rotation each side',
          'Round 2: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls, 10 External Rotation each side',
          'Round 3: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls, 10 External Rotation each side',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
          '60s Neck Side Stretch each side',
        ],
      },
    ],
    equipment: ['dumbbell', 'bands'],
  },
  {
    id: 'p_05',
    title: 'The Diesel',
    description:
      'Four kilometres at a pace you can actually hold. This is not about suffering, it is about sustaining. Target 10-15 seconds slower than your 2k split and lock into a rhythm you could hold for another 2k if you had to. Legs drive, arms finish, breathe on the recovery.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Endurance', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 Bird-Dogs each side',
          '500m Easy Row, focus on posture',
          '4 x 10 hard strokes building to working pace',
          'Rest 90s before starting',
        ],
      },
      {
        name: '4000m Steady State',
        instructions:
          'Target a split 10-15 seconds slower than your 2k pace and do not deviate. Check your split every 500m and adjust if needed. Legs drive first, arms finish the stroke, breathe on every recovery. Record your total time and average split at the end.',
        movements: [
          '0-500m: Settle in, find your split, resist going out hot',
          '500-1500m: Lock into rhythm, check split every 250m',
          '1500-2500m: The middle is where most people drift, stay focused',
          '2500-3500m: Hold what you have, do not chase the finish yet',
          '3500-4000m: If you have anything left, build the last 500m to the line',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '3 mins Easy Row',
          '60s Seated Forward Fold',
          '60s Pigeon Stretch each side',
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'p_06',
    title: 'Squat Heavy, Squat Often',
    description:
      'This is a proper squat session, not just a finisher. You will build to a heavy front squat, hit volume at 80%, then finish with accessory work that makes the next session better. Elbows up, chest tall, and do not bail on depth when it gets heavy.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Legs', 'Squat'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 Rounds: 10 Goblet Squats, 10 Glute Bridges',
          '10 Ankle Circles each foot',
          '10 Hip 90-90 Rotations',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Single',
        instructions:
          'Take 5 sets to build to a heavy but not maximal single. This is not a 1RM attempt, aim for about 90-95% effort. Rest as needed between sets. This sets your working weight for Block 2.',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM',
          'Set 2: 3 reps at 65% estimated 1RM',
          'Set 3: 2 reps at 75% estimated 1RM',
          'Set 4: 1 rep at 85% estimated 1RM',
          'Set 5: 1 rep at 90-95% estimated 1RM (record weight)',
        ],
      },
      {
        name: 'Block 2: Volume at 80%',
        instructions:
          'Drop to 80% of your Block 1 heavy single and perform 3 reps every 90 seconds for 10 rounds. The weight should feel manageable for the first 5 rounds and earn your respect by round 8. Elbows up throughout.',
        movements: [
          'Round 1: 3 Front Squats at 80%, rest 90s',
          'Round 2: 3 Front Squats at 80%, rest 90s',
          'Round 3: 3 Front Squats at 80%, rest 90s',
          'Round 4: 3 Front Squats at 80%, rest 90s',
          'Round 5: 3 Front Squats at 80%, rest 90s',
          'Round 6: 3 Front Squats at 80%, rest 90s',
          'Round 7: 3 Front Squats at 80%, rest 90s',
          'Round 8: 3 Front Squats at 80%, rest 90s',
          'Round 9: 3 Front Squats at 80%, rest 90s',
          'Round 10: 3 Front Squats at 80%, rest 90s',
        ],
      },
      {
        name: 'Block 3: Accessory Finisher',
        instructions:
          'Three rounds, no barbell. Focus on quality and control. Rest 60s between rounds.',
        movements: [
          'Round 1: 12 Bulgarian Split Squats each leg, 15 Glute Bridges, 12 Nordic Curls',
          'Round 2: 12 Bulgarian Split Squats each leg, 15 Glute Bridges, 12 Nordic Curls',
          'Round 3: 12 Bulgarian Split Squats each leg, 15 Glute Bridges, 12 Nordic Curls',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Pigeon Stretch each side',
          '60s Hip Flexor Stretch each side',
          '60s Seated Forward Fold',
          '60s Ankle Stretch each side',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_07',
    title: 'Murph (Unpartitioned)',
    description:
      'The gold standard of endurance. No partitioning means finishing all reps of one movement before the next.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Hero WOD', 'Long'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m Jog, 20 Air Squats, 10 Pushups'],
      },
      {
        name: 'For Time (20lb Vest)',
        instructions:
          'Complete in order: 1 Mile Run, then all Pullups, then all Pushups, then all Squats, then 1 Mile Run.',
        movements: [
          '1 Mile Run',
          '100 Pullups',
          '200 Pushups',
          '300 Air Squats',
          '1 Mile Run',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'p_08',
    title: 'The Mile That Earns It',
    description:
      'A full mile of sandbag carry, broken up by movements that make picking it back up feel even heavier. You will cover 1600m in four 400m legs with a penalty block between each one. Switch carry positions as needed but the bag never goes in a locker, it stays with you the whole time.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Running', 'Full Body', 'Endurance'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins joint prep',
          '200m light sandbag carry at easy pace',
          '10 Squats to Stand',
          '10 Hip Hinges',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'Leg 1',
        instructions:
          'Pick up the bag and move. Switch between shoulder carry and bear hug as needed. Do not put the bag down until you hit 400m.',
        movements: ['400m Sandbag Carry (20/30kg)'],
      },
      {
        name: 'Penalty Block 1',
        instructions:
          'Complete all three movements before picking the bag back up. No rest between movements.',
        movements: ['15 Burpees', '20 Air Squats', '10 Sandbag Cleans'],
      },
      {
        name: 'Leg 2',
        instructions:
          'Pick the bag back up. Legs are already burning, that is the point.',
        movements: ['400m Sandbag Carry (20/30kg)'],
      },
      {
        name: 'Penalty Block 2',
        instructions:
          'Complete all three movements before picking the bag back up. No rest between movements.',
        movements: ['15 Push-ups', '20 Reverse Lunges', '10 Sandbag Squats'],
      },
      {
        name: 'Leg 3',
        instructions:
          'Halfway done. Find a carry position that works and commit to it.',
        movements: ['400m Sandbag Carry (20/30kg)'],
      },
      {
        name: 'Penalty Block 3',
        instructions:
          'Complete all three movements before picking the bag back up. No rest between movements.',
        movements: ['15 Burpees', '20 Jump Squats', '10 Sandbag Cleans'],
      },
      {
        name: 'Leg 4: The Finish',
        instructions:
          'Final 400m. The bag does not touch the floor until you cross the line. Record your total time.',
        movements: ['400m Sandbag Carry (20/30kg, record total time)'],
      },
      {
        name: 'Cooldown',
        movements: [
          '5 mins easy walk',
          '60s Hip Flexor Stretch each side',
          '60s Thoracic Rotation each side',
          '60s Hamstring Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
        ],
      },
    ],
    equipment: ['sandbag'],
  },
  {
    id: 'p_09',
    title: 'One Leg at a Time',
    description:
      'Pistol squats are one of the hardest bodyweight movements to master. This session builds up to them properly, starting with the mobility and strength foundations and earning the full rep by the end. Do not skip the progressions, they are the session.',
    category: 'Mobility',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Legs', 'Balance', 'Skill'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '60s Ankle Circles each foot',
          '60s Deep Squat Hold',
          '10 Air Squats',
          '10 Single Leg Glute Bridges each side',
          '10 Hip 90-90 Rotations',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Ankle and Hip Mobility',
        instructions:
          'Move slowly through each exercise. This is not a warmup, it is active prep for the demands of a pistol squat. Spend time where you feel restriction.',
        movements: [
          '3 x 60s Single Leg Calf Raises (slow, controlled)',
          '3 x 10 Knee Over Toe Squats each side',
          '3 x 30s Single Leg Balance Hold each side',
          '3 x 10 Assisted Deep Squat to Stand (hold a pole or rig)',
        ],
      },
      {
        name: 'Block 2: Pistol Progressions',
        instructions:
          'Work through each progression in order. Spend 2-3 sets on each before moving to the next. Only move forward when the current level feels controlled, not just possible.',
        movements: [
          'Progression 1: Box Pistol Squat (sit back to a box, 3 x 5 each leg)',
          'Progression 2: Assisted Pistol Squat (hold a rig or counterweight, 3 x 5 each leg)',
          'Progression 3: Eccentric Pistol Squat (lower slowly for 4 counts, stand with two legs, 3 x 4 each leg)',
          'Progression 4: Full Pistol Squat (unassisted if ready, 3 x 3 each leg)',
        ],
      },
      {
        name: 'Block 3: EMOM 8',
        instructions:
          'Choose the progression level that challenged you most in Block 2 and repeat it for 8 minutes. Every minute on the minute, perform 3 reps each leg. Rest the remainder of the minute. Quality over quantity.',
        movements: [
          'Min 1: 3 Pistol Squats each leg (or chosen progression)',
          'Min 2: 3 Pistol Squats each leg (or chosen progression)',
          'Min 3: 3 Pistol Squats each leg (or chosen progression)',
          'Min 4: 3 Pistol Squats each leg (or chosen progression)',
          'Min 5: 3 Pistol Squats each leg (or chosen progression)',
          'Min 6: 3 Pistol Squats each leg (or chosen progression)',
          'Min 7: 3 Pistol Squats each leg (or chosen progression)',
          'Min 8: 3 Pistol Squats each leg (or chosen progression)',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Pigeon Stretch each side',
          '60s Hip Flexor Stretch each side',
          '60s Ankle Stretch each side',
          '60s Seated Forward Fold',
        ],
      },
    ],
    equipment: ['box'],
  },
  {
    id: 'p_10',
    title: 'The Double Under Clinic',
    description:
      'This is for athletes who can already string double unders together but want to get faster, more consistent and less rattled when they trip. Four blocks that isolate the specific skills that separate good double unders from great ones. Relaxed grip, high jump, patient wrists.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Skill'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '60s Calf Raises',
          '60s Ankle Circles each foot',
          '30s Wrist Circles each direction',
          '50 Single Unders at easy pace',
          '20 Single Unders at fast cadence',
          '10 x 3 Double Under attempts with full reset between each',
        ],
      },
      {
        name: 'Block 1: Consistency Work',
        instructions:
          'Five sets with 45 seconds rest between each. The goal is unbroken sets. If you trip, reset immediately and note where in the set it happened. Most athletes trip at the same point every time, find yours.',
        movements: [
          'Set 1: 20 Unbroken Double Unders (rest 45s)',
          'Set 2: 25 Unbroken Double Unders (rest 45s)',
          'Set 3: 30 Unbroken Double Unders (rest 45s)',
          'Set 4: 35 Unbroken Double Unders (rest 45s)',
          'Set 5: 40 Unbroken Double Unders (rest 45s)',
        ],
      },
      {
        name: 'Block 2: Speed Work',
        instructions:
          'Six rounds of 20 seconds on, 10 seconds off. This is Tabata timing. The goal is maximum reps in each 20 second window. Count every round and try to hold the same number across all six. Wrists drive the speed here, not the arms.',
        movements: [
          'Round 1: 20s Max Double Unders, 10s rest (record reps)',
          'Round 2: 20s Max Double Unders, 10s rest (record reps)',
          'Round 3: 20s Max Double Unders, 10s rest (record reps)',
          'Round 4: 20s Max Double Unders, 10s rest (record reps)',
          'Round 5: 20s Max Double Unders, 10s rest (record reps)',
          'Round 6: 20s Max Double Unders, 10s rest (record reps)',
        ],
      },
      {
        name: 'Block 3: Trip and Reset Drill',
        instructions:
          'This block is specifically about what happens after you trip. The goal is to get back into unbroken reps as fast as possible after each break. Five sets of 50 reps, every time you trip counts as one penalty burpee at the end. Track your burpee total.',
        movements: [
          'Set 1: 50 Double Unders (note trips, rest 60s)',
          'Set 2: 50 Double Unders (note trips, rest 60s)',
          'Set 3: 50 Double Unders (note trips, rest 60s)',
          'Set 4: 50 Double Unders (note trips, rest 60s)',
          'Set 5: 50 Double Unders (note trips, rest 60s)',
          'Penalty: 1 Burpee for every trip across all 5 sets',
        ],
      },
      {
        name: 'Block 4: EMOM Finisher',
        instructions:
          'Ten minutes, every minute on the minute. Accumulate 40-50 reps per minute and rest whatever is left. This should feel manageable after the previous blocks. Focus on staying relaxed in the shoulders and face.',
        movements: [
          'Min 1: 40-50 Double Unders, rest remainder',
          'Min 2: 40-50 Double Unders, rest remainder',
          'Min 3: 40-50 Double Unders, rest remainder',
          'Min 4: 40-50 Double Unders, rest remainder',
          'Min 5: 40-50 Double Unders, rest remainder',
          'Min 6: 40-50 Double Unders, rest remainder',
          'Min 7: 40-50 Double Unders, rest remainder',
          'Min 8: 40-50 Double Unders, rest remainder',
          'Min 9: 40-50 Double Unders, rest remainder',
          'Min 10: 40-50 Double Unders, rest remainder',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Calf Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['skipping rope'],
  },
  {
    id: 'p_11',
    title: 'Heavy Grace',
    description:
      '30 Clean and Jerks for time. This is a classic CrossFit benchmark at a pro weight.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Power'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['Barbell Warmup: 10 Cleans, 10 Push Press'],
      },
      {
        name: '30 Reps',
        instructions: 'Weight: 61/43kg. Target is sub 5:00 for elite athletes.',
        movements: ['Clean and Jerk'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_12',
    title: 'The Ergathlon',
    description:
      'Triple-erg test. Minimal transitions are key. Maintain a steady aerobic pace.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Ski', 'Bike'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 mins on each erg at low intensity'],
      },
      {
        name: 'For Time',
        instructions: 'Move quickly between machines. Do not stop moving.',
        movements: ['2000m Row', '2000m Ski', '4000m Bike'],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'p_13',
    title: 'Dead Stop Squats',
    description:
      'Pause squats expose every weakness in your squat. No bounce, no stretch reflex, just raw strength from the hole. This session builds to a heavy pause single, hits volume with a 3 second hold, then finishes with accessory work that makes the bottom position stronger every time you come back.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Squat', 'Pause'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '60s Hip 90-90 Rotations',
          '60s Deep Squat Hold',
          '60s Ankle Circles each foot',
          '10 Goblet Squats with 3 second pause at bottom',
          '2 x 5 Empty Bar Back Squat with 2 second pause',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Pause Single',
        instructions:
          'Five sets building to a heavy pause single. Every rep in this block has a 3 second hold at the bottom, including warmup sets. This is not a 1RM attempt, aim for 88-92% effort. Rest as needed between sets. This sets your working weight for Block 2.',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM, 3 second pause each',
          'Set 2: 3 reps at 63% estimated 1RM, 3 second pause each',
          'Set 3: 2 reps at 73% estimated 1RM, 3 second pause each',
          'Set 4: 1 rep at 83% estimated 1RM, 3 second pause',
          'Set 5: 1 rep at 88-92% estimated 1RM, 3 second pause (record weight)',
        ],
      },
      {
        name: 'Block 2: 6x2 Pause Volume',
        instructions:
          'Drop to 80% of your Block 1 heavy single. Six sets of two reps, 3 second pause at the bottom of every rep. Rest exactly 3 minutes between sets. Brace hard before you descend, stay braced through the entire pause, drive the floor away on the way up.',
        movements: [
          'Set 1: 2 Pause Back Squats at 80%, rest 3 mins',
          'Set 2: 2 Pause Back Squats at 80%, rest 3 mins',
          'Set 3: 2 Pause Back Squats at 80%, rest 3 mins',
          'Set 4: 2 Pause Back Squats at 80%, rest 3 mins',
          'Set 5: 2 Pause Back Squats at 80%, rest 3 mins',
          'Set 6: 2 Pause Back Squats at 80% (record weight and any missed pauses)',
        ],
      },
      {
        name: 'Block 3: Bottom Position Strength',
        instructions:
          'Three rounds targeting the specific positions and muscles that fail first in a heavy pause squat. Rest 90s between rounds.',
        movements: [
          'Round 1: 60s Weighted Deep Squat Hold, 10 Heel Elevated Goblet Squats, 12 Copenhagen Planks each side',
          'Round 2: 60s Weighted Deep Squat Hold, 10 Heel Elevated Goblet Squats, 12 Copenhagen Planks each side',
          'Round 3: 60s Weighted Deep Squat Hold, 10 Heel Elevated Goblet Squats, 12 Copenhagen Planks each side',
        ],
      },
      {
        name: 'Block 4: Posterior Chain Finisher',
        instructions:
          'Two rounds, no barbell. Keep rest minimal, this is just filling the gaps.',
        movements: [
          'Round 1: 15 Romanian Deadlifts, 15 Glute Bridges, 12 Nordic Curls',
          'Round 2: 15 Romanian Deadlifts, 15 Glute Bridges, 12 Nordic Curls',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Pigeon Stretch each side',
          '60s Hip Flexor Stretch each side',
          '60s Ankle Stretch each side',
          '60s Seated Forward Fold',
          '60s Supine Twist each side',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_14',
    title: 'The 100 Club',
    description:
      'High-volume plyometrics and metabolic demand. Stay efficient on the box step-down.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Explosive', 'Lungs', 'Partner', 'For Time'],
    isPremium: true,
    blocks: [
      {
        scale: 'Individual',
        blocks: [
          {
            name: 'Warmup',
            movements: ['20 Step-ups, 10 Burpees'],
          },
          {
            name: 'WOD',
            instructions:
              '4 rounds totalling 100 reps of each movement with a descending rep scheme. Rest only as needed to keep moving.',
            highlightInstructions: 'Rep Range: 40, 30, 20, 10',
            movements: ['Burpee Box Jumps', 'Wall Balls'],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'Warmup',
            movements: ['20 Step-ups, 10 Burpees'],
          },
          {
            name: 'WOD',
            instructions:
              '4 rounds totalling 100 reps of each movement with a descending rep scheme. Split between the team in a tag team style approach. Rest while your partner works. This should feel fast.',
            highlightInstructions: 'Rep Range: 40, 30, 20, 10',
            movements: ['Burpee Box Jumps', 'Wall Balls'],
          },
        ],
      },
    ],
    equipment: ['box', 'medicine ball'],
  },
  {
    id: 'p_16',
    title: 'The Muscle Up Lab',
    description:
      'The muscle up is not one skill, it is three. A powerful pull, a fast transition, and a strong dip. Most athletes fail in the transition because they never train it in isolation. This session breaks the movement into its components, trains each one separately, then puts it back together.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Gymnastics', 'Skill', 'Upper Body', 'Rings'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 Rounds: 10 Ring Rows, 10 Ring Dips',
          '10 Scapular Pull-ups',
          '10 Band Pull Aparts',
          '10 Hollow Body Rocks',
          '30s Dead Hang from rings or bar',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Pull Strength',
        instructions:
          'Three sets of each movement with 60s rest between. These build the pulling power needed to get above the rings. Focus on pulling the rings to your hips, not your chest.',
        movements: [
          '3 x 5 Weighted Ring Rows (add weight or elevate feet), rest 60s',
          '3 x 3 High Pull-ups (pull until rings touch chest), rest 60s',
          '3 x 5 Archer Ring Rows each side (unilateral pulling strength), rest 60s',
        ],
      },
      {
        name: 'Block 2: Transition Drills',
        instructions:
          'The transition is where muscle ups are won or lost. Three sets of each drill with full rest between. Move slowly and deliberately, speed comes later. A false grip is required for ring muscle ups, get comfortable with it here.',
        movements: [
          'Drill 1: 3 x 5 False Grip Ring Rows (build false grip comfort), rest 60s',
          'Drill 2: 3 x 3 Jumping Muscle Up Transitions (use legs to assist, focus on the turn over), rest 90s',
          'Drill 3: 3 x 3 Slow Transition Pull (pull to chest, pause, rotate wrists and push to support), rest 90s',
          'Drill 4: 3 x 5 Support Hold at top of rings (straight arm, locked out, 3 second hold), rest 60s',
        ],
      },
      {
        name: 'Block 3: Dip Strength',
        instructions:
          'Two sets of each movement. The dip out of the transition is what kills athletes who have the pull. Rings move, bars do not, train both if possible.',
        movements: [
          '2 x 8 Ring Dips (full depth, pause at bottom), rest 60s',
          '2 x 5 Slow Eccentric Ring Dips (4 second lower), rest 90s',
          '2 x 8 Bar Dips (if rings feel too unstable), rest 60s',
        ],
      },
      {
        name: 'Block 4: EMOM 10 Skill Practice',
        instructions:
          'Ten minutes every minute on the minute. Choose the hardest progression you can execute with control. If you have full muscle ups, aim for 2-3 quality reps per minute. If not, choose the progression from Blocks 1-3 that challenged you most. Quality over quantity, every single rep.',
        movements: [
          'Min 1: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 2: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 3: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 4: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 5: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 6: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 7: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 8: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 9: 2-3 Muscle Ups or Progression, rest remainder',
          'Min 10: 2-3 Muscle Ups or Progression, rest remainder',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang from bar or rings',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands'],
  },
  {
    id: 'p_17',
    title: 'Earn Your 5k',
    description:
      'Anyone can run a 5k on fresh legs. This session makes sure you never do. A short burnout before the run taxes the legs just enough to make the first kilometre feel like the third. Hit the burnout, then run your best 5k anyway. Sub 20:00 is the target, sub 18:00 is elite.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Running', 'Aerobic', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '1km Easy Jog',
          'Leg Swings x 10 each direction',
          'High Knees x 20m',
          'Butt Kicks x 20m',
          '2 x 100m Strides building to 85%',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'Pre-Run Burnout',
        instructions:
          'Complete all movements as fast as possible with no rest between them. Move straight into the 5k the moment you finish. Do not let more than 20 seconds pass between the last rep and the start line.',
        movements: ['20 Burpees', '30 Air Squats', '20 Jump Lunges'],
      },
      {
        name: '5k Time Trial',
        instructions:
          'Run on a flat course or track. Record your total time. Do not go out too hot in the first kilometre, the burnout will catch up with you. Use these splits as a pacing guide.',
        movements: [
          '0-1km: Controlled, find your rhythm, resist the urge to sprint',
          '1-2km: Settle into race pace, this should feel sustainable',
          '2-3km: The middle kilometre is where most people drift, hold your pace',
          '3-4km: Start working, push slightly harder than comfortable',
          '4-5km: Everything you have left, empty the tank to the line (record total time)',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '800m Easy Walk or Jog',
          '60s Hip Flexor Stretch each side',
          '60s Hamstring Stretch each side',
          '60s Calf Stretch each side',
          '60s Quad Stretch each side',
          '60s Glute Stretch each side',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'p_18',
    title: 'Press From Hell',
    description:
      'A descending ladder that gets kinder with every round, but your lungs will not notice. Devil press and box step ups paired together from 10 down to 1. The reps shrink, the suffering does not. Use the swing of the dumbbells to drive the press overhead and do not fight the movement.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Lungs'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '2 Rounds: 10 DB Snatches, 5 Burpees',
          '5 Devil Press at light weight (practice the swing)',
          '10 Box Step Ups at easy pace',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'For Time: Descending Ladder',
        instructions:
          'Complete all devil press reps then all box step up reps before moving to the next round. No scheduled rest. Record your total time. Swing the dumbbells, do not muscle press them.',
        movements: [
          'Round 1: 10 Devil Press, 20 Box Step Ups',
          'Round 2: 9 Devil Press, 18 Box Step Ups',
          'Round 3: 8 Devil Press, 16 Box Step Ups',
          'Round 4: 7 Devil Press, 14 Box Step Ups',
          'Round 5: 6 Devil Press, 12 Box Step Ups',
          'Round 6: 5 Devil Press, 10 Box Step Ups',
          'Round 7: 4 Devil Press, 8 Box Step Ups',
          'Round 8: 3 Devil Press, 6 Box Step Ups',
          'Round 9: 2 Devil Press, 4 Box Step Ups',
          'Round 10: 1 Devil Press, 2 Box Step Ups (record total time)',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '2 mins Easy Walk',
          '60s Hip Flexor Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
          '60s Thoracic Rotation each side',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['dumbbell', 'box'],
  },
  {
    id: 'p_19',
    title: 'Iron Classics',
    description:
      'Pull-ups and dips have built more upper body strength than any machine ever invented. This session treats them with the respect they deserve. You will build to a heavy weighted single on both movements, hit volume at 85%, then finish with accessory work that fills every gap the big two leave behind.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Calisthenics', 'Heavy', 'Upper Body'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 Scapular Pull-ups',
          '10 Band Pull Aparts',
          '10 Scapular Push-ups',
          '2 x 5 Bodyweight Pull-ups, full range',
          '2 x 5 Bodyweight Dips, full depth',
          '30s Dead Hang',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Weighted Single',
        instructions:
          'Alternate between pull-ups and dips each set, resting 90 seconds between movements. Build to the heaviest single you can execute with full range on both. This sets your working weight for Block 2. Full range means chin over bar and chest to bar on pull-ups, full depth lockout on dips.',
        movements: [
          'Set 1: 5 Bodyweight Pull-ups, rest 90s, 5 Bodyweight Dips',
          'Set 2: 3 Pull-ups at light added weight, rest 90s, 3 Dips at light added weight',
          'Set 3: 2 Pull-ups at moderate weight, rest 90s, 2 Dips at moderate weight',
          'Set 4: 1 Pull-up at heavy weight, rest 90s, 1 Dip at heavy weight',
          'Set 5: 1 Pull-up at max weight, rest 90s, 1 Dip at max weight (record both)',
        ],
      },
      {
        name: 'Block 2: 5x5 Volume Superset',
        instructions:
          'Drop to 80% of your Block 1 heavy single on both movements. Superset pull-ups and dips each set with 90 seconds rest between movements and 2-3 minutes rest between sets. Full range on every rep, no half reps when it gets heavy.',
        movements: [
          'Set 1: 5 Weighted Pull-ups, rest 90s, 5 Weighted Dips, rest 2-3 mins',
          'Set 2: 5 Weighted Pull-ups, rest 90s, 5 Weighted Dips, rest 2-3 mins',
          'Set 3: 5 Weighted Pull-ups, rest 90s, 5 Weighted Dips, rest 2-3 mins',
          'Set 4: 5 Weighted Pull-ups, rest 90s, 5 Weighted Dips, rest 2-3 mins',
          'Set 5: 5 Weighted Pull-ups, rest 90s, 5 Weighted Dips (record weight and any missed reps)',
        ],
      },
      {
        name: 'Block 3: Volume Pump',
        instructions:
          'Drop all weight. Three sets of max reps bodyweight on both movements with 60 seconds rest between. Stop two reps before failure to keep quality high. This builds volume on top of the heavy work.',
        movements: [
          'Set 1: Max Bodyweight Pull-ups, rest 60s, Max Bodyweight Dips, rest 60s',
          'Set 2: Max Bodyweight Pull-ups, rest 60s, Max Bodyweight Dips, rest 60s',
          'Set 3: Max Bodyweight Pull-ups, rest 60s, Max Bodyweight Dips (record reps each set)',
        ],
      },
      {
        name: 'Block 4: Accessory Finisher',
        instructions:
          'Two rounds targeting the supporting muscles that make pull-ups and dips stronger. Rest 60s between rounds.',
        movements: [
          'Round 1: 12 Face Pulls, 12 Tricep Dips between benches, 10 Single Arm Dumbbell Row each side, 12 Lateral Raises',
          'Round 2: 12 Face Pulls, 12 Tricep Dips between benches, 10 Single Arm Dumbbell Row each side, 12 Lateral Raises',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '30s Dead Hang from bar',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Shoulder Cross Body Stretch each side',
          '60s Wrist Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['dumbbell', 'pull-up bar', 'bands'],
  },
  {
    id: 'p_20',
    title: 'The Hybrid Finisher',
    description:
      'A combination of erg and bodyweight movements to finish the week.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Hybrid', 'Finishers'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['500m Jog, 10 Burpees'],
      },
      {
        name: 'For Time',
        instructions:
          'No rest between stations. Push the pace on the 500m runs.',
        movements: [
          '500m Row',
          '50 Wall Balls',
          '500m Ski',
          '50 Burpees',
          '500m Run',
        ],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'p_21',
    title: 'Chest Day',
    description:
      'Full chest and tricep session with structured progressive loading. The pec deck finisher will leave you unable to tie your own shoelaces.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Chest', 'Triceps', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins rower or ski erg',
          '30s doorway pec stretch each side',
          '10 scapular push-ups',
          '10 band pull-aparts',
          '1 x 15 empty-bar or very light bench press - focus on bar path',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2–3 mins between sets. Controlled 2s descent on every rep.',
        movements: [
          {
            name: 'Barbell Bench Press',
            value: '4 x 6–8',
            note: 'Touch lower chest. Leg drive throughout. No bouncing.',
          },
        ],
      },
      {
        name: 'Secondary Compound',
        instructions:
          'Rest 90s between sets. Feel the upper chest stretch on the way down.',
        movements: [
          {
            name: 'Incline Dumbbell Press',
            value: '4 x 10',
            note: '30–45° incline. Allow dumbbells to travel below chest level for maximum stretch.',
          },
          {
            name: 'Dumbbell Floor Press',
            value: '3 x 10',
            note: 'No stretch reflex - pure tricep and inner chest tension from a dead stop.',
          },
        ],
      },
      {
        name: 'Isolation',
        instructions:
          'Rest 60s between sets. No lockout - keep constant tension on the pecs.',
        movements: [
          {
            name: 'Pec Deck or Cable Flyes',
            value: '3 x 15',
            note: 'Pause for 1 second at peak contraction. Think about wrapping arms around a barrel.',
          },
          {
            name: 'Cable Crossover (High to Low)',
            value: '3 x 15',
            note: "Targets the lower chest. Keep a slight forward lean and don't fully extend the elbows.",
          },
        ],
      },
      {
        name: 'Tricep Finisher',
        instructions: 'Rest 60s. Elbows stay pinned throughout.',
        movements: [
          {
            name: 'Skull Crushers',
            value: '3 x 12',
            note: 'Elbows pointing at the ceiling. Focus on the stretch at the bottom.',
          },
          {
            name: 'Tricep Pushdowns (Cable)',
            value: '3 x 15',
            note: 'Full extension at the bottom. Squeeze the lateral head hard.',
          },
        ],
      },
      {
        name: 'Posterior Health',
        instructions:
          'Light weight only. Essential after a heavy pressing session.',
        movements: [
          {
            name: 'Reverse Flyes or Face Pulls',
            value: '3 x 20',
            note: 'Protects the rotator cuff over time. Never skip this.',
          },
        ],
      },
    ],
    equipment: [
      'dumbbell',
      'barbell',
      'rower',
      'ski erg',
      'bands',
      'static machines',
    ],
  },
  {
    id: 'p_22',
    title: 'Back Day',
    description:
      'A complete back session targeting thickness, width, and rear delt health. Pull with your elbows - your hands are just hooks.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Back', 'Lats', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins rower',
          '30s lat stretch each side',
          '10 band pull-aparts',
          '10 dead bugs (alternating, controlled)',
          '1 x 10 light dumbbell rows each side - focus on scapular retraction',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2–3 mins between sets. Torso parallel to floor. Pull elbows into back pockets.',
        movements: [
          {
            name: 'Barbell Row',
            value: '4 x 6–8',
            note: 'Heavy. Reset each rep. Build the mid-back thickness that defines a serious physique.',
          },
        ],
      },
      {
        name: 'Vertical Pull',
        instructions:
          'Rest 2 mins between sets. Full dead hang at the bottom - every rep.',
        movements: [
          {
            name: 'Weighted Pull-ups or Lat Pulldown',
            value: '4 x 8',
            note: 'Initiate by depressing the shoulder blade before bending the elbow. Pull chest to bar.',
          },
          {
            name: 'Single Arm Lat Pulldown',
            value: '3 x 12 each side',
            note: 'Allows you to focus on each lat independently. Full stretch at the top.',
          },
        ],
      },
      {
        name: 'Horizontal Pull',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Seated Cable Row',
            value: '3 x 12',
            note: 'Slight forward lean at start. Sit tall at peak. Hold the contraction for a beat before releasing.',
          },
          {
            name: 'T-Bar Row',
            value: '3 x 10',
            note: 'Chest on the pad. Neutral grip. Pull elbows past your torso - this is where the mid-back really fires.',
          },
        ],
      },
      {
        name: 'Lat Isolation',
        instructions: 'Rest 60s. Arms stay straight - this is not a row.',
        movements: [
          {
            name: 'Straight Arm Pulldown',
            value: '3 x 15',
            note: 'Pull the shoulder blades down and feel the lats contract fully at the bottom.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Sit-ups',
            value: '3 x 10',
            note: "Controlled reps. Exhale as you sit up, keep your chin tucked, and don't pull on the neck. Aim for consistent tempo rather than speed.",
          },
        ],
      },
    ],
    equipment: [
      'dumbbell',
      'barbell',
      'rower',
      'pull-up bar',
      'bands',
      'static machines',
    ],
  },
  {
    id: 'p_23',
    title: 'Legs Day',
    description:
      'The most demanding session of the week. Quad, hamstring, and glute work across every major movement pattern. You earn the rest days after this one.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Legs', 'Quads', 'Hamstrings', 'Glutes'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '5 mins bike - thorough warm-up for knees and hips',
          '30s hip flexor stretch each side / 30s pigeon pose each side',
          '10 glute bridges with 2s pause at the top',
          '10 bodyweight squats with controlled tempo',
          '1 x 10 goblet squats focusing on depth',
        ],
      },
      {
        name: 'Primary Compound',
        instructions:
          'Rest 2.5–3 mins between sets. This is the most important set of the week - earn it.',
        movements: [
          {
            name: 'Barbell Back Squat',
            value: '5 x 5',
            note: 'Sit back and down. Hip crease below knee. Drive the floor away - do not just stand up.',
          },
        ],
      },
      {
        name: 'Quad Focus',
        instructions: 'Rest 2 mins between sets.',
        movements: [
          {
            name: 'Hack Squat or Leg Press',
            value: '4 x 10',
            note: 'Hack squat: constant tension, no lockout. Leg press: feet mid-platform, do not let lower back peel off the seat.',
          },
          {
            name: 'Leg Extension',
            value: '3 x 15',
            note: 'Pause for 1 full second at the top. Control the eccentric all the way down.',
          },
        ],
      },
      {
        name: 'Posterior Chain',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Romanian Deadlift',
            value: '4 x 10',
            note: 'Push hips back until deep hamstring stretch. Drive hips through at the top and squeeze glutes hard.',
          },
          {
            name: 'Hip Thrust (Barbell)',
            value: '3 x 12',
            note: 'Use a pad. Squeeze glutes for 1 full second at the top. Shins vertical at peak contraction.',
          },
          {
            name: 'Lying or Seated Leg Curl',
            value: '3 x 12',
            note: 'Slow eccentric. Do not let the stack slam at the bottom - maintain hamstring tension throughout.',
          },
        ],
      },
      {
        name: 'Calves',
        instructions:
          'Rest 45s between sets. Full range of motion - all the way up, all the way down.',
        movements: [
          {
            name: 'Calf Raises (Machine or Standing)',
            value: '4 x 20',
            note: 'Pause at the top. Calves respond well to high volume and slow eccentrics.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Hanging Leg Raise',
            value: '3 x 12',
            note: 'No spinal flexion load after heavy squats. Hip flexion only. Avoid swinging.',
          },
        ],
      },
    ],
    equipment: ['barbell', 'pull-up bar', 'static machines'],
  },
  {
    id: 'p_24',
    title: 'Shoulders Day',
    description:
      'Full shoulder development from pressing strength to lateral width and rear delt health. The face pull at the end is not optional.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Shoulders', 'Delts', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '30s overhead lat stretch each side',
          '10 arm circles forward / 10 arm circles backward',
          '10 band pull-aparts',
          '10 banded face pulls',
          '1 x 10 empty-bar overhead press - focus on lockout',
        ],
      },
      {
        name: 'Primary Press',
        instructions:
          'Rest 2–3 mins between sets. No leg drive - strict press only.',
        movements: [
          {
            name: 'Barbell Overhead Press',
            value: '4 x 6–8',
            note: 'Squeeze glutes and brace core. Press the bar vertically. Head through the window at the top.',
          },
        ],
      },
      {
        name: 'Secondary Press',
        instructions: 'Rest 90s between sets.',
        movements: [
          {
            name: 'Dumbbell Shoulder Press or Arnold Press',
            value: '3 x 10',
            note: 'Arnold press: rotate from palms-in to palms-forward through the press. Recruits all three delt heads.',
          },
          {
            name: 'Machine Shoulder Press',
            value: '3 x 12',
            note: 'Eliminates stability demands - focus entirely on deltoid recruitment. Control the eccentric.',
          },
        ],
      },
      {
        name: 'Lateral Development',
        instructions:
          'Rest 60s. Lead with the elbows - think about touching the side walls.',
        movements: [
          {
            name: 'Lateral Raises (Dumbbell or Cable)',
            value: '4 x 15',
            note: 'Use lighter weight than feels necessary. Stop slightly above shoulder height.',
          },
          {
            name: 'Upright Row (Cable or Barbell)',
            value: '3 x 12',
            note: 'Wide grip to reduce shoulder impingement risk. Elbows lead the movement.',
          },
        ],
      },
      {
        name: 'Rear Delt & Health',
        instructions:
          'Light weight. This is the most important part of the session for long-term shoulder health.',
        movements: [
          {
            name: 'Face Pulls (Cable)',
            value: '3 x 20',
            note: 'Pull to forehead. Elbows flared high. Emphasise the external rotation at the end of every rep.',
          },
          {
            name: 'Reverse Flyes (Dumbbell or Machine)',
            value: '3 x 15',
            note: 'Focus on feeling the rear delt contract - not the traps.',
          },
        ],
      },
      {
        name: 'Core Finisher',
        movements: [
          {
            name: 'Russian Twists',
            value: '3 x 20',
            note: 'Feet off the floor. Rotate from the obliques. Add a plate in later weeks.',
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'barbell', 'bands'],
  },
  {
    id: 'p_25',
    title: 'Arms Day',
    description:
      'Dedicated bicep and tricep session. The arms respond exceptionally well to focused isolation work - give them your full attention for once.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Arms', 'Biceps', 'Triceps', 'Hypertrophy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '3 mins light cardio',
          '30s wrist flexor stretch each side / 30s wrist extensor stretch each side',
          '10 arm circles forward / 10 arm circles backward',
          '1 x 15 cable curls (light) / 1 x 15 tricep pushdowns (light) - pump blood into the elbow joints',
        ],
      },
      {
        name: 'Biceps - Compound',
        instructions:
          'Rest 90s between sets. Elbows stay pinned - no swinging.',
        movements: [
          {
            name: 'Barbell or EZ Bar Curl',
            value: '4 x 10',
            note: 'The heaviest bicep movement of the session. Full extension at the bottom - do not cheat the range.',
          },
          {
            name: 'Incline Dumbbell Curl',
            value: '3 x 12',
            note: 'The incline position stretches the long head of the bicep maximally. Slow and deliberate on every rep.',
          },
        ],
      },
      {
        name: 'Biceps - Isolation',
        instructions: 'Rest 60s. No momentum - the bicep does all the work.',
        movements: [
          {
            name: 'Preacher Curl (Barbell or EZ Bar)',
            value: '3 x 12',
            note: 'The bench eliminates all cheating. Resist the urge to bounce at the bottom - that stretch is where growth happens.',
          },
          {
            name: 'Hammer Curls',
            value: '3 x 12',
            note: 'Neutral grip targets the brachialis - developing this pushes the bicep peak higher.',
          },
          {
            name: 'Cable Curl (Single Arm)',
            value: '2 x 15 each side',
            note: 'Constant tension from the cable. Supinate hard at the top of each rep.',
          },
        ],
      },
      {
        name: 'Triceps - Compound',
        instructions: 'Rest 90s between sets. Elbows stay tucked throughout.',
        movements: [
          {
            name: 'Skull Crushers (Barbell or EZ Bar)',
            value: '4 x 10',
            note: 'Lower to forehead with elbows pointing at the ceiling. The long head stretch at the bottom is where size comes from.',
          },
          {
            name: 'Overhead Tricep Extension (Cable or Dumbbell)',
            value: '3 x 12',
            note: 'Overhead position places the long head in full stretch. Keep elbows pointing straight up - do not let them flare.',
          },
        ],
      },
      {
        name: 'Triceps - Isolation',
        instructions: 'Rest 60s. Squeeze the lateral head hard on every rep.',
        movements: [
          {
            name: 'Tricep Pushdowns (Cable - Straight Bar or Rope)',
            value: '3 x 15',
            note: 'Full extension at the bottom. Rope allows a twist at the bottom to maximise lateral head contraction.',
          },
          {
            name: 'Dips (Upright / Tricep Focus)',
            value: '3 x 12',
            note: 'Stay upright to keep the load on the triceps. Excellent mass-builder to close out the session.',
          },
        ],
      },
      {
        name: 'Forearm Finisher',
        instructions:
          'Light weight, high rep. Grip strength underpins every compound lift you do.',
        movements: [
          {
            name: 'Hammer Curls (Slow)',
            value: '2 x 20',
            note: 'Focus on the forearm and brachioradialis at the top. Full extension at the bottom.',
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'barbell'],
  },
  {
    id: 'p_26',
    title: 'Eva',
    description:
      'A high-volume benchmark. Long rounds, constant grip demand, and a steady run pace.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Benchmark', 'For Time', 'Run'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 mins easy run + drills',
          '2 rounds: 10 KB swings (light), 6 pull-ups (easy)',
        ],
      },
      {
        name: '5 Rounds For Time',
        instructions:
          'Keep the run smooth and the swings powerful. Break pull-ups before you fail reps.',
        movements: ['800m Run', '30 KB Swings', '30 Pull-ups'],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'p_27',
    title: 'King Kong',
    description:
      'A heavy classic. Only for athletes with solid technique and strict standards.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Benchmark', 'For Time', 'Heavy'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 mins progressive warmup',
          'Build to moderate heavy deadlift + squat clean',
        ],
      },
      {
        name: '3 Rounds For Time',
        instructions: 'Scale loads and/or skills to keep reps safe and clean.',
        movements: [
          '1 Deadlift (heavy)',
          '2 Muscle-ups',
          '3 Squat Cleans (heavy)',
          '4 Handstand Push-ups',
        ],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'p_28',
    title: 'Nate',
    description:
      'A 20-minute AMRAP that rewards efficient gymnastics and a strong hinge.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Benchmark', 'AMRAP', 'Gymnastics'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '8 mins easy cardio',
          'Skill: 5–10 mins muscle-up practice (or strict pull-up + dip)',
        ],
      },
      {
        name: '20 Min AMRAP',
        instructions: 'Score = rounds + reps. Stay efficient on transitions.',
        movements: ['2 Muscle-ups', '4 Handstand Push-ups', '8 KB Swings'],
      },
    ],
    equipment: ['kettlebell', 'pull-up bar'],
  },
  {
    id: 'p_29',
    title: 'Randy',
    description:
      'A fast barbell benchmark. Crisp reps only. Grip and lungs will be tested.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Benchmark', 'For Time', 'Snatch'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '6 mins easy cardio',
          'Build: 5-3-2 power snatch (light → working)',
        ],
      },
      {
        name: 'For Time',
        instructions:
          '75 power snatches (34/25kg suggested). Scale to safe cycling.',
        movements: ['75 Power Snatches'],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_30',
    title: 'Amanda',
    description:
      'A sharp classic: high-skill and fast reps. Scale to maintain standards.',
    category: 'WOD',
    difficulty: 'Advanced',
    estimatedTime: 20,
    tags: ['Benchmark', 'For Time', 'Gymnastics'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '8 mins warmup',
          'Build: 3-2-1 snatch (light → working)',
          'Skill: muscle-up progressions',
        ],
      },
      {
        name: '9-7-5 For Time',
        instructions:
          'Muscle-ups + snatches (heavy). Scale both to keep reps safe.',
        movements: ['Muscle-ups', 'Snatches'],
      },
    ],
    equipment: ['barbell', 'pull-up bar'],
  },
  {
    id: 'p_31',
    title: 'Race Sim: Full',
    description:
      'A full Hyrox-style simulation. Long, demanding, and specific. Keep moving.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 85,
    tags: ['Simulation', 'Run', 'Stations', 'Partner'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '12 mins easy jog + drills',
          '10 wall balls, 10 burpees, 500m easy row',
        ],
      },
      {
        name: 'For Time',
        instructions:
          'Partner format: split stations, run together. Keep all running as written. At each station, split the work 50/50 (or alternate small chunks). Record total team time. Scale stations if needed, but keep the run volume.',
        movements: [
          '1000m Run',
          '1000m SkiErg (or 1000m Row)',
          '1000m Run',
          '50m Sled Push',
          '1000m Run',
          '50m Sled Pull',
          '1000m Run',
          '80m Burpee Broad Jumps',
          '1000m Run',
          '1000m Row',
          '1000m Run',
          '200m Farmers Carry',
          '1000m Run',
          '100m Sandbag Lunges',
          '1000m Run',
          '100 Wall Balls',
        ],
      },
    ],
    equipment: [
      'dumbbell',
      'sandbag',
      'medicine ball',
      'rower',
      'ski erg',
      'sled',
    ],
  },
  {
    id: 'p_32',
    title: 'Sled Heavy Day',
    description:
      'Hyrox sled day. Heavy exposure with enough aerobic work to keep you honest.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Heavy', 'Run', 'Partner'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 mins easy cardio',
          '2 x 20m light sled push, 2 x 20m light sled pull',
        ],
      },
      {
        name: 'Work',
        instructions:
          'Partner format: alternate efforts. Partner A completes one sled push + one sled pull while Partner B rests, then swap. Run reps together at steady pace. Record loads used.',
        movements: [
          '6 x 20m Sled Push (heavy)',
          '6 x 20m Sled Pull (heavy)',
          '4 x 600m Run (steady)',
        ],
      },
    ],
    equipment: ['sled'],
  },
  {
    id: 'p_33',
    title: 'Elite Stations Repeat',
    description:
      'High output station repeats. Big breathing. Tight transitions.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Stations', 'Intervals', 'Elite', 'Partner'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: [
          '10 mins easy cardio',
          'Practice: 10 wall balls, 250m row, 10 burpees',
        ],
      },
      {
        name: '4 Rounds',
        instructions:
          'Partner format: split stations, run together. For each station, split reps/distance 50/50. Rest 2 mins between rounds. Keep intensity high but repeatable.',
        movements: [
          '800m Run',
          '500m Row',
          '30 Wall Balls',
          '20 Burpee Broad Jumps',
          '100m Farmers Carry',
        ],
      },
    ],
    equipment: ['dumbbell', 'medicine ball', 'rower'],
  },
  {
    id: 'p_34',
    title: 'Hyrox PFT (Pro Standard)',
    description:
      'A higher-standard Hyrox fitness test. Record finish time and station notes.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Benchmark', 'Test'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['800m run', '10 burpees, 10 air squats', '500m easy row'],
      },
      {
        name: 'For Time',
        instructions: 'Minimal transition time. Record total time.',
        movements: [
          '1000m Run',
          '30 Burpee Broad Jumps',
          '200m Sandbag Lunges',
          '1000m Row',
          '50 Wall Balls',
        ],
      },
    ],
    equipment: ['sandbag', 'medicine ball', 'rower'],
  },
  {
    id: 'p_35',
    title: 'Roxzone Killer',
    description:
      'Shorter runs, brutal transitions, dense stations. Designed to make you better at the messy middle.',
    category: 'Hyrox',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Transitions', 'Intervals', 'Stations', 'Partner'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        movements: ['10 mins easy jog + drills', '10 wall balls, 10 burpees'],
      },
      {
        name: '8 Rounds',
        instructions:
          'Partner format: alternate rounds. Partner A completes one full round while Partner B rests, then swap next round. Keep transitions fast and form clean.',
        movements: ['600m Run', '12 Wall Balls', '8 Burpees', '250m Row'],
      },
    ],
    equipment: ['rower', 'medicine ball'],
  },
  {
    id: 'p_55',
    title: 'Ignition',
    description:
      'First session. Full body. The WOD is an AMRAP - as many rounds as possible in 10 minutes. Set a pace you can hold and do not blow up in round two.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 10,
    tags: ['HIIT', 'HIIT Shred', 'AMRAP'],
    equipment: [],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - AMRAP 10',
        instructions:
          'As many rounds as possible in 10 minutes. Find a pace in round one and hold it.\n\nAMRAP • 10 min',
        movements: [
          '8 reps Burpees (Steady pace. Do not sprint round one.)',
          '15 reps Bodyweight Squats (Full range. Move with purpose.)',
          '10 reps Push-ups (Chest to floor. Scale to knees to keep moving.)',
        ],
      },
    ],
  },
  {
    id: 'p_56',
    title: 'The Ladder',
    description:
      'Lower body focus. The WOD is a descending ladder - reps drop each round so the session gets faster as you go. Start controlled.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Descending Ladder (For Time)',
        instructions:
          'Complete each movement for 21 reps, then 15, then 9 reps. Work through all reps of each exercise before moving on. Time yourself.\n\nFor time',
        movements: [
          '21 / 15 / 9 reps Squat Jumps (Land soft every rep. Full squat depth.)',
          '21 / 15 / 9 reps each side Reverse Lunge (Tall torso. Light touch of the back knee.)',
          '21 / 15 / 9 reps Ball Slams (Full extension overhead before every slam. Drive it down.)',
        ],
      },
    ],
  },
  {
    id: 'p_57',
    title: 'Push Storm',
    description:
      'Upper body push focus. The WOD is a Tabata - 8 rounds of 20s work, 10s rest. Four stations. Simple format, uncomfortable execution.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 8,
    tags: ['HIIT', 'HIIT Shred', 'Tabata'],
    equipment: ['dumbbell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Push Storm Tabata',
        instructions:
          '8 rounds, 20s work / 10s rest. Rotate through all four stations. Go as hard as you can sustain. This should be uncomfortable.\n\n8 rounds • 20s work / 10s rest',
        movements: [
          '20s on / 10s off Push-ups (Maximum reps with good form. Scale to knees when needed.)',
          '20s on / 10s off DB Push Press (Dip and drive. Keep the weight manageable enough to keep moving.)',
          '20s on / 10s off Ball Slams (Full extension, slam hard, pick it up fast.)',
          '20s on / 10s off Pike Push-ups (Hips high. Lower with control. Press with everything.)',
        ],
      },
    ],
  },
  {
    id: 'p_58',
    title: 'Ground & Pound',
    description:
      'Full body to close the week. The WOD is the first chipper of the programme - one pass through a list of movements, for time. Pace from the start.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Ground & Pound Chipper (For Time)',
        instructions:
          'Complete all reps in order. One pass. Time yourself. Do not go out too fast.\n\nFor time',
        movements: [
          '20 reps Burpees (Steady effort. This is not the last movement.)',
          '20 reps DB Goblet Front Squat (Upright torso. Drive hard out of the hole.)',
          '10 reps Pull-ups (Band or assist is fine. Every rep counts.)',
          '20 reps Ball Slams (Full extension overhead. Drive it into the floor.)',
          '15 reps Squat Jumps (Land soft. Depth every rep.)',
        ],
      },
    ],
  },
  {
    id: 'p_59',
    title: 'Death by Dumbbell',
    description:
      'Upper body and core. The WOD is an EMOM - every minute on the minute for 12 minutes. Work starts the second the clock does.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['HIIT', 'HIIT Shred', 'EMOM'],
    equipment: ['dumbbell'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - EMOM 12',
        instructions:
          'Every minute on the minute, complete the prescribed reps. Rest is whatever is left of that minute. If you finish with less than 10s rest, your load or pace is too high.\n\nEMOM • 12 min',
        movements: [
          '10 reps (odd minutes) DB Thruster (Squat and press in one movement. Keep dumbbells at shoulders on the descent.)',
          '8 reps (even minutes) Burpees (Consistent pace. Same speed every round.)',
        ],
      },
    ],
  },
  {
    id: 'p_60',
    title: 'The Grind',
    description:
      'Lower body and posterior chain. The WOD is 5 rounds for time - as fast as possible with form intact. This is where it starts to feel like real conditioning.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'box'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - 5 Rounds For Time',
        instructions:
          '5 rounds, completed as fast as possible. Rest only when you have to.\n\n5 rounds for time',
        movements: [
          '10 reps Box Jumps/Step-ups (Step down every rep. Land soft, reset, go again.)',
          '12 reps DB Romanian Deadlift (Hinge clean. Squeeze at the top. Do not round the back.)',
          '10 reps/side Reverse Lunge (Tall torso. Drive up through the front heel.)',
          '20 reps Bodyweight Calf Raises (Full range. Pause at the top.)',
        ],
      },
    ],
  },
  {
    id: 'p_61',
    title: 'Station Six',
    description:
      'Six stations, rotating continuously for 15 minutes. The first station-style session of the programme - move through all six then repeat.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['HIIT', 'HIIT Shred', 'AMRAP'],
    equipment: ['kettlebell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Station Six AMRAP 15',
        instructions:
          '15 minutes. Move through all six stations in order, then repeat. Scale loads to keep moving - stopping costs more than going lighter.\n\nAMRAP • 15 min',
        movements: [
          '10 reps Wall Balls (Squat to depth every rep. Drive the ball to your target.)',
          '10 reps Inverted Row (Chest to bar. Squeeze at the top.)',
          '10 reps Squat Jumps (Land soft every rep. Full depth.)',
          '10 reps Push-ups (Chest to floor. Scale to knees to keep moving.)',
          '12 reps Kettlebell Swing (Hip drive. The bell floats.)',
          '20 reps Bicycle Crunch (Rotate from the ribs. Slow and deliberate.)',
        ],
      },
    ],
  },
  {
    id: 'p_62',
    title: 'Burn Out',
    description:
      'This WOD is a descending rep scheme - starts with high reps, drops each round. Starts heavy, finishes fast.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'For Time', 'Partner'],
    equipment: ['medicine ball'],
    isPremium: true,
    blocks: [
      {
        scale: 'RX',
        blocks: [
          {
            name: 'WOD - Burn Out, For Time',
            instructions:
              'Complete 5 rounds. Each rounds rep range is like so: 25 reps, 20 reps, 15 reps, 10 reps and finally 5 reps of each movement in order. Each round drops by 5 reps. Time yourself.',
            highlightInstructions: 'Rep Range: 25, 20, 15, 10, then 5.',
            movements: [
              'Burpees - Pace the first round. It gets easier as the reps drop.',
              'Bodyweight Squats - Full depth. Drive up hard.',
              'Ball Slams - Full extension overhead every rep.',
            ],
          },
        ],
      },
      {
        scale: 'Partner',
        blocks: [
          {
            name: 'WOD - Burn Out, For Time',
            instructions:
              'You go, I go. One clock for the team.\n\n' +
              'Complete 5 rounds. Reps per movement each round: 32, 28, 24, 20, 16, 12, then 8. ' +
              'Alternate reps on each movement (Partner A does 1, Partner B does 1, and so on) until that movement’s reps are done, then move to the next. ',
            highlightInstructions: 'Rep Range: 32, 28, 24, 20, 16, 12 then 8',
            movements: [
              'Burpees - Alternate reps. Pace round 1.',
              'Bodyweight Squats - Alternate reps. Full depth every rep.',
              'Ball Slams - Alternate reps. Full extension overhead every rep.',
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'p_63',
    title: 'The Gauntlet',
    description:
      'Full body. The WOD is an AMRAP 15 - five movements, more volume than anything in weeks 1–2. This is where the programme steps up.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['HIIT', 'AMRAP'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - The Gauntlet AMRAP 15',
        instructions:
          'Five movements, 15 minutes. Find a sustainable pace in round one and hold it.\n\nAMRAP • 15 min',
        movements: [
          '8 reps Burpee Broad Jumps (Drive forward. Land soft. Reset and go.)',
          '12 reps Wall Balls (Squat to depth. Drive the ball up.)',
          '8 reps Pull-ups (Band or assist is fine. Chest to bar.)',
          '10 reps DB Thruster (Squat and press. Fluid movement.)',
          '20s Plank (Active recovery within the round. Ribs down, breathe.)',
        ],
      },
    ],
  },
  {
    id: 'p_64',
    title: 'Pressing Matters',
    description:
      'Upper body push and pull. The WOD is an EMOM 16 - longer than week two. Four movements rotating across 16 minutes.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 16,
    tags: ['HIIT', 'EMOM'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - EMOM 16',
        instructions:
          'Every minute on the minute. Rotate through all four movements. Four rounds of each. Go hard on work, use the rest.\n\nEMOM • 16 min',
        movements: [
          '10 reps DB Push Press (Dip and drive. Full lockout overhead.)',
          '8 reps Chin-ups (Full hang to chin above bar. Control the lower.)',
          '12 reps Ball Slams (Full extension. Slam hard. Pick it up fast.)',
          '20 reps Bicycle Crunch (Slow rotation from the ribs. Active recovery within the EMOM.)',
        ],
      },
    ],
  },
  {
    id: 'p_65',
    title: 'Lower Inferno',
    description:
      'Lower body chipper. One pass. More reps than the week one chipper. Pace it from the first movement - this session punishes anyone who goes out too fast.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'For Time'],
    equipment: ['dumbbell', 'box'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Lower Inferno Chipper (For Time)',
        instructions:
          'Complete all reps in order. One pass. Time yourself. The wall sit at the end will test everything you have left.\n\nFor time',
        movements: [
          '25 reps Box Jumps/Step-ups (Step down every rep. Land soft. Do not rush the reset.)',
          '20 reps/side Walking Lunges (Keep moving. Light dumbbells if available.)',
          '25 reps Squat Jumps (Land soft. Full depth. Breathe.)',
          '20 reps DB Romanian Deadlift (Hinge clean. Squeeze up. Do not round the back.)',
          '15 reps/side Reverse Lunge (Controlled. Tall torso. Nearly there.)',
          '60s Wall Sit (Last thing. Breathe through it. Hold position.)',
        ],
      },
    ],
  },
  {
    id: 'p_66',
    title: 'Full Send',
    description:
      'Full body to close week three. The WOD is a 4-round station circuit with rest between rounds. Station work, high heart rate, no hiding.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['HIIT', 'For Time'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Full Send (4 Rounds For Time)',
        instructions:
          '4 rounds. Complete all reps of each movement before moving on. Rest 60s between rounds.\n\n4 rounds for time',
        movements: [
          '12 reps Burpees (Consistent pace. Same speed every round.)',
          '15 reps Wall Balls (Squat to depth every rep.)',
          '8 reps Pull-ups (Band or assist is fine.)',
          '15 reps Ball Slams (Full extension. Drive it into the floor.)',
          '30s DB Farmer Carry (Heavy. Posture tall. Walk steady.)',
        ],
      },
    ],
  },
  {
    id: 'p_67',
    title: 'The Hurricane',
    description:
      'Full body power. The WOD is a three-round hurricane - three movements, maximum effort, rest between rounds. Designed to spike and recover, spike and recover.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['HIIT', 'For Time'],
    equipment: ['dumbbell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - The Hurricane (3 Rounds For Time)',
        instructions:
          '3 rounds. Go as hard as you can each round. Rest 90s between rounds. This is designed to hurt and then let you recover. Use the rest.\n\n3 rounds for time',
        movements: [
          '10 reps Burpee Broad Jumps (Max effort. Drive forward every rep.)',
          '15 reps DB Thruster (Squat and press. No pausing at the bottom.)',
          '20 reps Ball Slams (Everything you have. Full extension before every slam.)',
        ],
      },
    ],
  },
  {
    id: 'p_68',
    title: 'Pull Everything',
    description:
      'Pull-dominant upper body. The WOD is a Tabata with pull and core stations. Eight rounds, alternating between pulling movements and anti-rotation work.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 8,
    tags: ['HIIT', 'Tabata'],
    equipment: ['dumbbell', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Pull Everything Tabata',
        instructions:
          '8 rounds, 20s work / 10s rest. Alternate between pull and core movements. Go hard on work intervals.\n\n8 rounds • 20s work / 10s rest',
        movements: [
          '20s on / 10s off Pull-ups (Max reps. Band or assist is fine.)',
          '20s on / 10s off Sit-ups (Full range. Controlled on the way down.)',
          '20s on / 10s off Inverted Row (Chest to bar every rep.)',
          '20s on / 10s off Russian Twists (Use a light dumbbell. Rotate from the ribs.)',
        ],
      },
    ],
  },
  {
    id: 'p_69',
    title: 'Leg Day Lies',
    description:
      'Lower body. The WOD is an AMRAP 18 - longest lower body WOD of the programme so far. Pace accordingly from the first movement.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 18,
    tags: ['HIIT', 'AMRAP'],
    equipment: ['kettlebell', 'box'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - AMRAP 18',
        instructions:
          '18 minutes. Five lower body movements. Find a pace you can sustain and.\n\nAMRAP • 18 min',
        movements: [
          '8 reps Box Jumps/Step-ups (Step down every rep. Land soft.)',
          '10 reps Squat Jumps (Land soft. Depth every rep.)',
          '10 reps/side Reverse Lunge (Tall torso. Light touch of the back knee.)',
          '15 reps Kettlebell Swing (Hip drive. The bell floats.)',
          '20 reps Glute Bridge March (Active recovery within the AMRAP. Hips level throughout.)',
        ],
      },
    ],
  },
  {
    id: 'p_70',
    title: 'Core Reckoning',
    description:
      'Full body with a core emphasis. The WOD is a chipper with a core movement between every strength station. There is no hiding place in this one.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'For Time'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Core Reckoning Chipper (For Time)',
        instructions:
          'Complete in order. One pass. Core movements between every station - do not skip them.\n\nFor time',
        movements: [
          '15 reps Burpees (Start steady. Do not blow up here.)',
          '15 reps Hanging Leg Raise (Control the lower. No swinging.)',
          '15 reps DB Thruster (Squat and press. Full range.)',
          '30 reps Russian Twists (Light dumbbell. Rotate from the ribs.)',
          '20 reps Ball Slams (Full extension every rep.)',
          '20 reps Sit-ups (Full range. Nearly there.)',
          '10 reps Burpee Broad Jumps (Drive forward. Land soft. Finish strong.)',
        ],
      },
    ],
  },
  {
    id: 'p_71',
    title: 'The Accumulator',
    description:
      'Full body. The WOD is an ascending ladder - reps build each round. Starts easy, finishes brutal. Unlike the descending ladder in week one, this one gets harder as it goes.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'For Time'],
    equipment: ['medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - The Accumulator (For Time)',
        instructions:
          'Complete rounds of 5, 10, 15, 20 reps of each movement. Reps climb each round. Time yourself. The last round will feel very different to the first.\n\nFor time',
        movements: [
          '5 / 10 / 15 / 20 reps Burpees (The round of 20 is coming. Pace accordingly.)',
          '5 / 10 / 15 / 20 reps Wall Balls (Squat to depth every rep. Drive the ball.)',
          '5 / 10 / 15 / 20 reps Squat Jumps (Land soft every rep. Full depth.)',
        ],
      },
    ],
  },
  {
    id: 'p_72',
    title: 'Double Trouble',
    description:
      'Upper body pairs. The WOD is a push and pull AMRAP 20 - five movements alternating push and pull. Longest upper body WOD of the programme.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['HIIT', 'HIIT Shred', 'AMRAP'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Double Trouble AMRAP 20',
        instructions:
          '20 minutes. Push and pull alternating - complete all five movements before repeating.\n\nAMRAP • 20 min',
        movements: [
          '15 reps Push-ups (Chest to floor. Scale to knees to keep moving.)',
          '8 reps Chin-ups (Full hang. Chin above bar. Control down.)',
          '12 reps DB Push Press (Dip and drive. Full lockout.)',
          '12 reps Inverted Row (Chest to bar. Squeeze at the top.)',
          '15 reps Ball Slams (Full extension overhead. Drive it down.)',
        ],
      },
    ],
  },
  {
    id: 'p_73',
    title: 'Hyrox Lite',
    description:
      'Hyrox-style session. Eight stations, one round each, for time. Functional movements, high volume, designed to replicate the feel of race-day conditioning. This is the longest lower body session of the programme - pace from station one.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'box', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Hyrox Lite (For Time)',
        instructions:
          'Eight stations. Complete all reps in order. One pass. Time yourself - this is your benchmark. Every station feeds into the next. Pace from station one.\n\nFor time',
        movements: [
          '50 reps Wall Balls (Break into sets of 10–15. Squat to depth every rep.)',
          '30 reps Box Jumps/Step-ups (Step down every rep. Do not rush the reset.)',
          '60s DB Farmer Carry (Heavy as possible. Tall posture. Walk steady.)',
          '30 reps DB Romanian Deadlift (Moderate weight. Hinge clean, squeeze up.)',
          '40 reps/side Walking Lunges (Keep moving. Light dumbbells if available.)',
          '30 reps Ball Slams (Full extension overhead before each slam.)',
          '25 reps Squat Jumps (Land soft every rep.)',
          '20 reps Burpees (Last station. Empty the tank.)',
        ],
      },
    ],
  },
  {
    id: 'p_74',
    title: 'Power Hour',
    description:
      'Full body power. The WOD is an EMOM 20 - the longest EMOM of the programme. Five movements rotating across 20 minutes. Tests your ability to sustain effort, not just produce it.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['HIIT', 'HIIT Shred', 'EMOM'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - EMOM 20',
        instructions:
          'Five movements rotating across 20 minutes - four rounds of each. Go hard on work. Use every second of rest.\n\nEMOM • 20 min',
        movements: [
          '8 reps Burpee Broad Jumps (Drive forward. Land soft.)',
          '10 reps DB Thruster (Squat and press. Full range.)',
          '8 reps Pull-ups (Band or assist is fine.)',
          '12 reps Ball Slams (Full extension. Slam hard.)',
          '30s (minutes 5, 10, 15, 20) DB Farmer Carry (Heavy. Posture tall. Active recovery between the hard stations.)',
        ],
      },
    ],
  },
  {
    id: 'p_76',
    title: 'The Last Pull',
    description:
      'Pull-dominant upper body. The WOD is a chipper - every movement involves pulling, rowing, or anti-rotation work. The longest upper body WOD of the programme.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - The Last Pull Chipper (For Time)',
        instructions:
          'Complete in order. One pass. Pull, hinge, core - no pushing today. Time yourself.\n\nFor time',
        movements: [
          '30 reps Pull-ups (Break as needed. Band or assist is fine. Every rep counts.)',
          '25 reps Hanging Leg Raise (Control the lower. No swinging.)',
          '25 reps Inverted Row (Chest to bar every rep.)',
          '15 reps Sit-ups (Controlled reps. Exhale as you sit up. Keep the chin tucked. Aim to feel the abs initiate the movement rather than yanking with the hip flexors.)',
          '15 reps Chin-ups (Underhand grip. Full hang to chin above bar.)',
          '40 reps Russian Twists (Light dumbbell. Rotate from the ribs. Nearly done.)',
        ],
      },
    ],
  },
  {
    id: 'p_77',
    title: 'Six Weeks Done',
    description:
      'Lower body finale. The WOD is the hardest lower body chipper of the programme - more volume than Hyrox Lite, higher intensity. Time yourself.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'box', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Six Weeks Done (For Time)',
        instructions:
          'One pass. Everything in order. The final lower body test. Time yourself.\n\nFor time',
        movements: [
          '60 reps Wall Balls (Break in sets of 15. Squat to depth every rep.)',
          '30 reps Box Jumps/Step-ups (Step down every rep. Do not rush the reset.)',
          '30 reps DB Romanian Deadlift (Hinge clean. Squeeze at the top.)',
          '40 reps/side Walking Lunges (Keep moving. This is where week six is earned.)',
          '30 reps Ball Slams (Full extension overhead before every slam.)',
          '30 reps Squat Jumps (Land soft. Depth every rep.)',
          '90s Wall Sit (Last thing. You earned it. Hold.)',
        ],
      },
    ],
  },
  {
    id: 'p_78',
    title: 'Peak',
    description:
      'The last session. Full body. Everything. The WOD is the longest chipper of the programme - nine movements, one pass, for time. Every exercise here has appeared before. You know all of them. Now do them all at once.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['HIIT', 'HIIT Shred', 'For Time'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Peak (For Time)',
        instructions:
          'Nine movements. One pass. Everything in order. Time yourself. This is the final session of the programme - leave nothing behind.\n\nFor time',
        movements: [
          '40 reps Wall Balls (Set your pace early. Break in sets of 10.)',
          '20 reps Burpees (Steady. This is the middle, not the end.)',
          '15 reps Pull-ups (Break as needed. Every rep counts.)',
          '30 reps Ball Slams (Full extension. Drive it into the floor.)',
          '15 reps Burpee Broad Jumps (Drive forward. Land soft. Keep moving.)',
          '25 reps Squat Jumps (Land soft. Depth every rep.)',
          '15 reps DB Thruster (Squat and press. Full range. Keep going.)',
          '20 reps Inverted Row (Chest to bar. Squeeze. Nearly done.)',
          '60s DB Farmer Carry (Last thing. Heavy. Posture tall. Walk to the finish.)',
        ],
      },
    ],
  },
];
