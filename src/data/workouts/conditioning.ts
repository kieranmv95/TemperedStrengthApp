import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const conditioning: StandaloneWorkoutSource[] = [
  {
    id: 'f_70',
    title: 'Redline',
    description:
      'Score is total time taken to complete. include the rest. its redline central and challenges the mind. The question is can you hang on? #chasepain',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 15,
    tags: ['Cardio', 'Full Body', 'For Time'],
    isPremium: false,
    collab: {
      image: require('@/assets/images/collabs/chase_pain.jpg'),
      name: 'Chase Pain Podcast',
      description:
        'This workouts is brought to you by the chase pain podcast, sharing conversations with athletes from all different walks of life.',
      link: 'https://open.spotify.com/show/2rifksaDS0rVXGpvZXRYPA?si=b9a72bd63a5b43b9&fbclid=IwZXh0bgNhZW0CMTAAYnJpZBExUG5yYklXMFZyenNiRHNTa3NydGMGYXBwX2lkEDIyMjAzOTE3ODgyMDA4OTIAAR79sza2w0Jy0jdsML1_C7diJjL08jToEygu7dY2KFBv2NHy0OH_lLhAHUWTyQ_aem_DjWeRXeGUarTdFxgxQbT3w&nd=1&dlsi=d9a047cdc9534f4a',
      linkCopy: 'Click to Listen',
      bgColor: '#000000',
      linkAndBorderColor: '#ff00ff',
      nameColor: '#ff00ff',
    },
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 minutes easy cardio to raise the heart rate',
          '5 slow burpees, 10 air squats',
        ],
      },
      {
        name: 'For Time',
        instructions:
          'The clock runs the whole way through - the rest periods are part of your score. Go hard but pace the row so you can attack the burpees, then empty the tank on the ski. Score is total time taken to complete everything, including the rest.',
        highlightInstructions: 'The rest counts. Can you hang on?',
        movements: [
          '500m Row',
          'Rest 1 min',
          '50 Burpees to Plate',
          'Rest 1 min',
          '500m Ski',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s seated forward fold',
          '60s child\u2019s pose',
          '90s easy walk to bring the heart rate down',
        ],
      },
    ],
    equipment: ['rower', 'ski erg'],
  },
  {
    id: 'f_07',
    title: 'Row Till You Break',
    description:
      'Pure anaerobic punishment. Three cracks at 500m, each one should leave you breathless. Rest just enough to go again, but not enough to fully recover. Your split time is your score.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 25,
    tags: ['Cardio', 'Intervals', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ['2 minutes Cardio of choice'],
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
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
        mobilityFlow: 'r_04',
        mobilityFlowCopy: 'Shoulder Health Flow',
        highlightInstructions: 'Or:',
        movements: ['60s seated forward fold', '60s pigeon stretch each side'],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'f_11',
    title: 'The 500 Club',
    description:
      'Five rounds of 500m at 90-95% effort. The goal is consistency, not just a fast first rep. If your splits are falling apart by round three, you went out too hot. Record every split and chase them next time.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Cardio', 'Intervals', 'Benchmark'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'p_04',
        highlightInstructions: 'Into:',
        movements: ['500m Easy Jog', '20 Butt Kicks'],
      },
      {
        name: '5 x 500m',
        instructions:
          'Rest exactly 90 seconds between efforts. Record your split each round. Stay relaxed in the face and shoulders, tension costs you speed. Aim to finish rounds 4 and 5 within 5 seconds of round 1.',
        highlightInstructions: 'Similar splits each round.',
        movements: [
          '500m Run',
          '90s rest',
          '500m Run',
          '90s rest',
          '500m Run',
          '90s rest',
          '500m Run',
          '90s rest',
          '500m Run',
        ],
      },
      {
        name: 'Cooldown',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Or:',
        movements: ['500m Easy Walk or Jog'],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_17',
    title: 'Skipping Skill Practice',
    description:
      'Jump rope is a skill before it is a workout. This session is about building rhythm and foot speed, not fitness. Stay light on the balls of your feet, keep your elbows in, and do not stare at the ground. Trip? Reset and go again, everyone does.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Cardio'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'Skill Practice: 5 Rounds',
        instructions:
          'Each round has a focus point. Read it before you start and keep it in your head while you jump. Rest 60 seconds between rounds. Tripping is fine, resetting quickly is the skill.',
        highlightInstructions: 'Rest 60s between rounds, longer if needed.',
        movements: [
          'Round 1: 2 mins to find your rhythm, nothing else.',
          'Round 2: 2 mins with the focus of keeping elbows close to your sides.',
          'Round 3: 2 mins with the focus of staying light, minimal ground contact.',
          'Round 4: 2 mins with the focus of eyes forward, not at the floor.',
          'Round 5: 2 mins with the focus of putting it all together.',
        ],
      },
      {
        name: 'Test',
        instructions:
          'Take some rest and then go for a max unbroken fast jump rope, end the session once you can no longer maintain a fast pace, break them or hit 5 minutes, whichever comes first. This is about stability and control and putting what you had from practice into action.',
        highlightInstructions:
          'Whilst we want to attempt fast reps, focus on control and stability.',
        movements: ['Max Unbroken Fast Jump Rope'],
      },
    ],
    equipment: ['skipping rope'],
  },
  {
    id: 'f_24',
    title: "Mikko's Triangle",
    description:
      'A classic erg benchmark. Pick a single calorie target and complete that amount every working minute — every minute.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Cardio', 'EMOM', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Setup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          'Set up a rower, SkiErg, and Assault Bike (or Echo Bike if your mad).',
        ],
      },
      {
        name: 'EMOM 39:00',
        instructions:
          'Minute 1: Row. Minute 2: SkiErg. Minute 3: Assault Bike. Minute 4: Rest. Repeat this sequence until 39:00. Choose one calorie number and hit it on each working minute.',
        highlightInstructions:
          'Choose one calorie number and hit it on each working minute.',
        movements: [
          '1 min Row ',
          '1 min SkiErg',
          '1 min Bike / Assault Bike',
          '1 min Rest',
          'Repeat this sequence until 39:00.',
        ],
      },
    ],
    equipment: ['rower', 'bike', 'ski erg'],
  },
  {
    id: 'f_66',
    title: 'Run Pacing Ladder',
    description:
      'A pacing session that teaches you how to control effort and recover quickly.',
    category: 'Conditioning',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Cardio', 'Intervals'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['200m easy jog', 'Minimum 90s rest before workout'],
      },
      {
        name: 'Ladder',
        instructions:
          'Rest 2 mins between each run. Aim for faster splits each run. it shouldnt feel easier with shorter runs as your pace should step, it should feel consistent',
        highlightInstructions:
          'This should feel similar difficulty as your pace ups',
        movements: [
          '1000m Run',
          '800m Run',
          '600m Run',
          '400m Run',
          '200m Run',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'p_05',
    title: 'The Diesel',
    description:
      'Four kilometres at a pace you can actually hold. This is not about suffering, it is about sustaining. Target 10-15 seconds slower than your 2k split and lock into a rhythm you could hold for another 2k if you had to. Legs drive, arms finish, breathe on the recovery.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Cardio', 'Benchmark'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2min easy cardio', 'Rest 90s before starting'],
      },
      {
        name: '4000m Steady State',
        instructions:
          'Target a split 10-15 seconds slower than your 2k pace and do not deviate. Check your split every 500m and adjust if needed. Legs drive first, arms finish the stroke, breathe on every recovery. Record your completion time at the end.',
        highlightInstructions:
          'Check your split every 500m and adjust if needed.',
        movements: [
          '0-500m: Settle in, find your split, resist going out hot',
          '500-1500m: Lock into rhythm, check split every 250m',
          '1500-2500m: The middle is where most people drift, stay focused',
          '2500-3500m: Hold what you have, do not chase the finish yet',
          '3500-4000m: If you have anything left, push the last 500m to the line',
        ],
      },
    ],
    equipment: ['rower'],
  },
  {
    id: 'p_08',
    title: 'The Mile That Earns It',
    description:
      'A full mile of sandbag carry, broken up by movements that make picking it back up feel even heavier. You will cover 1600m in four 400m legs with a penalty block between each one. Switch carry positions as needed but the bag never goes in a locker, it stays with you the whole time.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Full Body', 'For Time'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2mins easy cardio',
          '10 sandbag lunges',
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
          'Final 400m. The bag does not touch the floor until you cross the line.',
        movements: ['400m Sandbag Carry (20/30kg, record total time)'],
      },
      {
        name: 'Cooldown',
        movements: ['5 mins easy walk'],
      },
    ],
    equipment: ['sandbag'],
  },
  {
    id: 'p_10',
    title: 'The Double Under Clinic',
    description:
      'This is for athletes who can already string double unders together but want to get faster, more consistent and less rattled when they trip. Four blocks that isolate the specific skills that separate good double unders from great ones. Relaxed grip, high jump, patient wrists.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Cardio'],
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
        highlightInstructions:
          '45s rest between rounds. Most athletes trip at the same point every time, find yours.',
        movements: [
          'Set 1: 20 Unbroken Double Unders',
          'Set 2: 25 Unbroken Double Unders',
          'Set 3: 30 Unbroken Double Unders',
          'Set 4: 35 Unbroken Double Unders',
          'Set 5: 40 Unbroken Double Unders',
        ],
      },
      {
        name: 'Block 2: Speed Work',
        instructions:
          'This is Tabata timing. The goal is maximum reps in each 20 second window. Count every round and try to hold the same number across all six. Wrists drive the speed here, not the arms.',
        highlightInstructions: '6 Rounds of:',
        movements: ['20s Max Double Unders, 10s rest'],
      },
      {
        name: 'Block 3: Trip and Reset Drill',
        instructions:
          'This block is specifically about what happens after you trip. The goal is to get back into unbroken reps as fast as possible after each break. Five sets of 50 reps, every time you trip counts as one penalty burpee at the end. Track your burpee total.',
        highlightInstructions:
          '5 Rounds. 1 Burpee every time you trip. 60s rest between rounds',
        movements: ['50 Double Unders'],
      },
      {
        name: 'Block 4: EMOM Finisher',
        instructions:
          'Ten minutes, every minute on the minute. Accumulate 40-50 reps per minute and rest whatever is left. This should feel manageable after the previous blocks. Focus on staying relaxed in the shoulders and face.',
        highlightInstructions:
          '10 minutes, every minute on the minute. rest in remaining minute time.',
        movements: ['30 Double Unders'],
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
    id: 'p_12',
    title: 'The Ergathlon',
    description:
      'at 10k in total, This is a Triple-erg test and a run. Minimal transitions are key. Maintain a steady aerobic pace.',
    category: 'Conditioning',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Cardio', 'For Time', 'Benchmark', 'Chipper'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        movements: ['2 mins on each erg at low intensity'],
      },
      {
        name: 'For Time',
        instructions: 'Move quickly between machines. Do not stop moving.',
        highlightInstructions: 'Exepct to redline.',
        movements: ['1000m Ski', '2000m Row', '3000m Run', '4000m Bike'],
      },
    ],
    equipment: ['rower', 'ski erg', 'bike'],
  },
  {
    id: 'p_55',
    title: 'Ignition',
    description:
      'First session. Full body. The WOD is an AMRAP - as many rounds as possible in 10 minutes. Set a pace you can hold and do not blow up in round two.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['Full Body', 'AMRAP'],
    equipment: [],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio', 'Rest 90s before starting'],
      },
      {
        name: 'WOD - AMRAP 10',
        instructions:
          'As many rounds as possible in 10 minutes. Find a pace in round one and hold it.\n\nAMRAP • 10 min',
        movements: [
          '8 reps Burpees',
          '15 reps Bodyweight Squats',
          '10 reps Push-ups',
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
    tags: ['Full Body', 'For Time', 'Ladder'],
    equipment: ['medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Descending Ladder (For Time)',
        instructions:
          'Complete all movements for 21 reps, then 15, then 9 reps. Work through all reps of each exercise before moving on.',
        highlightInstructions: '21-15-9',
        movements: ['Squat Jumps', 'Reverse Lunge', 'Ball Slams'],
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
    tags: ['Upper Body', 'Tabata'],
    equipment: ['dumbbell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Push Storm Tabata',
        instructions:
          'Rotate through all four stations. Go as hard as you can sustain. This should be uncomfortable.\n\n8',
        highlightInstructions: '8 rounds tabata: 20s work / 10s rest',
        movements: ['Push-ups', 'DB Push Press', 'Ball Slams', 'Pike Push-ups'],
      },
    ],
  },
  {
    id: 'p_58',
    title: 'Up And Down',
    description:
      'Full body. One pass through a list of movements, for time. Pace from the start.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Full Body', 'For Time', 'Chipper'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Ground & Pound Chipper (For Time)',
        instructions:
          'Complete all reps in order. One pass. Time yourself. Do not go out too fast.',
        movements: [
          '30 Burpees',
          '40 DB Goblet Front Squat',
          '20 Pull-ups',
          '40 Ball Slams / Wall Balls',
          '30 Squat Jumps',
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
    tags: ['Full Body', 'EMOM'],
    equipment: ['dumbbell'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 Rounds: 5 DB thrusters, 4 Burpees',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'WOD - EMOM 12',
        instructions:
          'Every minute on the minute, complete the prescribed reps. Rest is whatever is left of that minute. If you finish with less than 10s rest, your load or pace is too high.',
        highlightInstructions: 'rest in remaining minute time.',
        movements: [
          'Odd Minutes: 10 reps DB Thrusters',
          'Even Minutes: 8 reps Burpees',
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
    tags: ['Lower Body', 'For Time'],
    equipment: ['dumbbell', 'box'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['5 box jumps, 5 step-ups'],
      },
      {
        name: 'WOD - 5 Rounds For Time',
        instructions:
          '5 rounds, completed as fast as possible. Rest only when you have to.',
        movements: [
          '10 Box Jumps/Step-ups',
          '12 DB Romanian Deadlift',
          '10 Reverse Lunge',
          '20 Bodyweight Calf Raises',
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
    tags: ['Full Body', 'AMRAP'],
    equipment: ['kettlebell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 wall balls, 10 KB Swings, 10 Push-ups',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'WOD - Station Six AMRAP 15',
        instructions:
          '15 minutes. Move through all six stations in order, then repeat. Scale loads to keep moving',
        highlightInstructions: 'Minimal rest, stopping eats time.',
        movements: [
          '10 Wall Balls',
          '10 Inverted Row (barbell or ring)',
          '10 Squat Jumps',
          '10 Push-ups',
          '12 Kettlebell Swing',
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
    tags: ['Full Body', 'For Time', 'Partner'],
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
    tags: ['Full Body', 'AMRAP'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - The Gauntlet AMRAP 15',
        instructions:
          'Five movements, 15 minutes. Find a sustainable pace in round one and hold it.',
        highlightInstructions:
          'Find a sustainable pace in round one and hold it.',
        movements: [
          '8 reps Burpee Broad Jumps',
          '12 reps Wall Balls',
          '8 reps Pull-ups',
          '10 reps DB Thruster',
          '20s Plank',
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
    tags: ['Upper Body', 'EMOM'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['5 DB push press, 4 Chin-ups', 'Rest 90s before starting'],
      },
      {
        name: 'WOD - EMOM 16',
        instructions:
          'Every minute on the minute. Rotate through all four movements.',
        highlightInstructions:
          'Go hard on work, use the minute remainder as rest.',
        movements: [
          '10 reps DB Push Press',
          '8 reps Chin-ups',
          '12 reps Ball Slams/Wall Balls',
          '20 reps Bicycle Crunch',
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
    tags: ['Lower Body', 'For Time'],
    equipment: ['dumbbell', 'box', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['5 box jumps, 5 step-ups'],
      },
      {
        name: 'WOD - Lower Inferno Chipper (For Time)',
        instructions:
          'Complete all reps in order. One pass. Time yourself. The wall sit at the end will test everything you have left.',
        movements: [
          '30 reps Box Jumps/Step-ups',
          '30 reps/side Banded Walking Lunges',
          '20 reps Squat Jumps',
          '20 reps DB Romanian Deadlift',
          '20 reps/side Reverse Lunge',
          '60s Wall Sit Finisher',
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
    tags: ['Full Body', 'For Time', 'Intervals'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Full Send: 4 Rounds',
        instructions:
          '4 rounds. Complete all reps of each movement before moving on. Rest 60s between rounds.',
        highlightInstructions: 'Consistent pace. Same speed every round.',
        movements: [
          '12 Burpees',
          '15 Wall Balls',
          '8 Pull-ups',
          '15 Ball Slams',
          '30s DB Farmer Carry',
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
    tags: ['Full Body', 'For Time', 'Intervals'],
    equipment: ['dumbbell', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - The Hurricane - 3 Rounds',
        instructions:
          '3 rounds. Go as hard as you can each round. Rest 90s between rounds. This is designed to hurt and then let you recover. Use the rest.',
        highlightInstructions: 'Max effort. Drive forward every rep.',
        movements: [
          '10 Burpee Broad Jumps',
          '15 DB Thruster',
          '20 Ball Slams/Wall Balls',
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
    estimatedTime: 6,
    tags: ['Upper Body', 'Tabata'],
    equipment: ['dumbbell', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Pull Everything Tabata',
        instructions:
          '12 round Tabata 20s work / 10s rest. you will do each movement three times Alternate between pull and core movements. Go hard on work intervals.',
        highlightInstructions: '20s on 10s rest. Go hard on work intervals.',
        movements: ['Pull-ups', 'Sit-ups', 'Inverted Row', 'Russian Twists'],
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
    tags: ['Lower Body', 'AMRAP'],
    equipment: ['kettlebell', 'box'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - AMRAP 18',
        instructions:
          '18 minutes. Five lower body movements. Find a pace you can sustain and hold it.',
        highlightInstructions: 'This is a long AMRAP. Mental endurance is key.',
        movements: [
          '8 Box Jumps/Step-ups',
          '10 Squat Jumps',
          '10 (1rep = L + R) Reverse Lunge',
          '15 Kettlebell Swing',
          '10 Glute Bridges',
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
    tags: ['Full Body', 'For Time', 'Chipper'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Core Reckoning Chipper: For Time',
        instructions:
          'Complete in order. One pass. Core movements between every station - do not skip them.',
        highlightInstructions: 'Consistent pace. Same speed every round.',
        movements: [
          '30 Burpees',
          '15 Hanging Leg Raise',
          '30 DB Thruster',
          '60 Russian Twists',
          '40 Ball Slams/Wall Balls',
          '20 Burpee Broad Jumps',
          '40 Sit-ups',
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
    tags: ['Full Body', 'For Time', 'Ladder'],
    equipment: ['medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - The Accumulator (For Time)',
        instructions:
          'Complete rounds of 5 reps of each movement, then 10, 15 and 20. Reps climb each round. The last round will feel very different to the first.',
        highlightInstructions: 'This is a brutal WOD. Pace accordingly.',
        movements: ['Burpees', 'Wall Balls', 'Squat Jumps'],
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
    tags: ['Full Body', 'AMRAP'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Double Trouble AMRAP 20',
        instructions:
          '20 minutes. Push and pull alternating - complete all five movements before repeating.',
        movements: [
          '15 Push-ups',
          '8 Chin-ups',
          '12 DB Push Press',
          '12 Inverted Row',
          '15 Ball Slams/Wall Balls',
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
    tags: ['Full Body', 'EMOM'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - EMOM 20',
        instructions:
          'Five movements rotating across 20 minutes - four rounds of each. Go hard on work. Use every second of rest.',
        highlightInstructions: 'Go hard on work. Use every second of rest.',
        movements: [
          '00:00 - 01:00: 8 Burpee Broad Jumps',
          '01:00 - 02:00: 10 DB Thruster',
          '02:00 - 03:00: 8 Pull-ups',
          '03:00 - 04:00: 12 Ball Slams',
          '04:00 - 05:00: 30s DB Farmer Carry',
          'REPEAT until 20:00',
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
    estimatedTime: 20,
    tags: ['Upper Body', 'For Time', 'Chipper'],
    equipment: ['dumbbell', 'pull-up bar', 'bands'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - The Last Pull Chipper: For Time',
        instructions:
          'Complete in order. One pass. Pull, hinge, core - no pushing today. Time yourself.',
        highlightInstructions:
          'Pull, hinge, core - no pushing today. Time yourself.',
        movements: [
          '30 Pull-ups',
          '25 Hanging Leg Raise',
          '25 Inverted Row',
          '15 Sit-ups',
          '15 Chin-ups',
          '40 Russian Twists',
        ],
      },
    ],
  },
  {
    id: 'p_77',
    title: 'Lower Body Finale',
    description:
      'Lower body finale. The WOD is a hard lower body chipper, high volume, high intensity.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['Lower Body', 'For Time'],
    equipment: ['dumbbell', 'box', 'medicine ball'],
    isPremium: true,
    blocks: [
      {
        name: 'WOD - Lower Body Finale: For Time',
        instructions:
          'One pass. Everything in order. A true lower body test. Time yourself.',
        highlightInstructions: 'A true lower body test. Time yourself.',
        movements: [
          '60 Wall Balls',
          '30 Box Jumps/Step-ups',
          '30 DB Romanian Deadlift',
          '40 Walking Lunges',
          '30 Ball Slams',
          '30 Squat Jumps',
          '90s Wall Sit',
        ],
      },
    ],
  },
  {
    id: 'p_78',
    title: 'Peak',
    description:
      'Full body. Everything. The WOD is one of the longer chippers we offer - nine movements, one pass, for time.',
    category: 'Conditioning',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['Full Body', 'For Time', 'Chipper'],
    equipment: ['dumbbell', 'medicine ball', 'pull-up bar'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins easy cardio'],
      },
      {
        name: 'WOD - Peak: For Time',
        instructions:
          'Nine movements. One pass. Everything in order. Time yourself.',
        highlightInstructions: 'Good Luck',
        movements: [
          '40 Wall Balls',
          '20 Burpees',
          '15 Pull-ups',
          '30 Ball Slams',
          '15 Burpee Broad Jumps',
          '25 Squat Jumps',
          '15 DB Thruster',
          '20 Inverted Row',
          '60s DB Farmer Carry',
        ],
      },
    ],
  },
];
