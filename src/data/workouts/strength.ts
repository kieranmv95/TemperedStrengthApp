import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const strength: StandaloneWorkoutSource[] = [
  {
    id: 'f_05',
    title: 'Leg Primer',
    description:
      'High volume bodyweight leg pump. Keep rest minimal to maximise metabolic stress.',
    category: 'Strength',
    difficulty: 'Beginner',
    estimatedTime: 25,
    tags: ['Lower Body', 'Strength'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        movements: ["10 World's Greatest Stretches, 20 Glute Bridges"],
      },
      {
        name: '4 Rounds',
        instructions: 'Rest 90s between rounds. Focus on full range of motion.',
        movements: [
          '20 BackwardLunges',
          '20 Glute Bridges',
          '20 Squat Jumps',
          '1 min Wall Sit',
        ],
      },
    ],
    equipment: [],
  },
  {
    id: 'f_06',
    title: 'Upper Body Hypertrophy',
    description:
      'Hypertrophy focus. Control the eccentric (lowering) phase for 2 seconds on every rep.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 30,
    tags: ['Upper Body', 'Strength'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: '4 Rounds - Triceps and Chest',
        instructions:
          'Rest 2 mins between rounds to allow for maximum effort on the next set.',
        highlightInstructions: 'Triceps and Chest focused.',
        movements: ['Max Pushups', '12 Dips (Chair/Bench/Machine)'],
      },
      {
        name: '4 Rounds - Biceps and Back',
        instructions:
          'Work through all the movements, rest as needed to maintain a consistent pace.',
        movements: ['15 Dumbell Rows', '15 Lateral Raises (DB or Machine)'],
      },
    ],
    equipment: ['dumbbell'],
  },
  {
    id: 'f_12',
    title: 'The Pushup Pyramid',
    description:
      'Every rep earned. You climb to 10 and fight your way back down. Rest only as long as the set took. Form over speed, chest to floor every time.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 20,
    tags: ['Upper Body', 'Strength'],
    isPremium: false,
    blocks: [
      {
        scale: 'Scaled',
        blocks: [
          {
            name: 'Warmup',
            movements: ['3 Rounds: 5 Shoulder Taps, 5 Scapular Pushups'],
          },
          {
            name: 'The Pyramid',
            instructions:
              'Work up from 1 rep to 10, then back down to 1. Rest between each set for roughly the same time it took to complete it. No rushing, no sloppy reps.',
            highlightInstructions:
              'Rest as long as it takes to complete the set.',
            movements: [
              '1 Kneeling Pushup, rest',
              '2 Kneeling Pushups, rest',
              '3 Kneeling Pushups, rest',
              '4 Kneeling Pushups, rest',
              '5 Kneeling Pushups, rest',
              '6 Kneeling Pushups, rest',
              '7 Kneeling Pushups, rest',
              '8 Kneeling Pushups, rest',
              '9 Kneeling Pushups, rest',
              '10 Kneeling Pushups, rest',
              '9 Kneeling Pushups, rest',
              '8 Kneeling Pushups, rest',
              '7 Kneeling Pushups, rest',
              '6 Kneeling Pushups, rest',
              '5 Kneeling Pushups, rest',
              '4 Kneeling Pushups, rest',
              '3 Kneeling Pushups, rest',
              '2 Kneeling Pushups, rest',
              '1 Kneeling Pushup',
            ],
          },
        ],
      },
      {
        scale: 'Advanced',
        blocks: [
          {
            name: 'Warmup',
            movements: ['3 Rounds: 5 Shoulder Taps, 5 Scapular Pushups'],
          },
          {
            name: 'The Pyramid',
            instructions:
              'Work up from 1 rep to 10, then back down to 1. Rest between each set for roughly the same time it took to complete it. No rushing, no sloppy reps.',
            highlightInstructions:
              'Rest as long as it takes to complete the set.',
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
    tags: ['Upper Body', 'Strength'],
    isPremium: false,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_03',
        mobilityFlowCopy: 'Start Handstand Prep Flow',
        highlightInstructions: 'Or:',
        movements: ['Wrist circles, 20 Hand Clenches'],
      },
      {
        name: '3 Rounds',
        instructions:
          'Rest 2 mins between rounds. The goal is to reach near-failure on the hang. Focus on form and technique, not speed.',
        highlightInstructions: '2 mins rest between rounds.',
        movements: [
          'Max Hang from Pull-up Bar',
          '50m Farmers Walk (Heavy / Rest as needed)',
        ],
      },
    ],
    equipment: ['dumbbell', 'pull-up bar'],
  },
  {
    id: 'f_21',
    title: 'Chest & Triceps',
    description:
      'A classic push session built around the bench press. Control the descent on every rep - the lowering phase is where the chest work really happens.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Or:',
        movements: [
          '3 mins light cardio (rower preferred)',
          '10 arm circles forward / 10 arm circles backward',
          '10 scapular push-ups',
          '1 light set of 15 push-ups focusing on shoulder stability',
        ],
      },
      {
        name: 'Barbell or Dumbbell Bench Press',
        instructions:
          'Rest 90–120s between sets. Focus on a 2-second controlled descent on all pressing movements.',
        highlightInstructions:
          'Touch chest lightly on each rep. Do not bounce.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '4 x 10',
          },
        ],
      },
      {
        name: 'Incline Barbell or Dumbbell Bench Press',
        instructions:
          'Rest 90–120s between sets. Focus on a 2-second controlled descent on all pressing movements.',
        highlightInstructions:
          '30-45° incline. Feel the stretch at the bottom.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Dumbbell or Cable Flyes',
        instructions:
          'Rest 90–120s between sets. Focus on a 2-second controlled descent on all pressing movements.',
        highlightInstructions:
          '30-45° incline. Feel the stretch at the bottom.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 15',
          },
        ],
      },
      {
        name: 'Dips (Bench or Bar)',
        instructions:
          'Rest 60s between sets. Keep elbows pinned - only forearms should move.',
        highlightInstructions: 'Stay upright to keep the load on the triceps.',
        movements: [
          {
            name: 'Dips (Bench or Bar)',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Overhead Tricep Extension, DB or Cable',
        instructions:
          'Rest 60s between sets. Keep elbows pinned - only forearms should move.',
        highlightInstructions: 'Stay upright to keep the load on the triceps.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Reverse Flyes or Band Pull-Aparts',
        instructions:
          'Light weight only. This is prehab, not a strength exercise.',
        highlightInstructions:
          'Counterbalances the pressing work. Lead with the elbows.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 15',
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'bands'],
  },
  {
    id: 'f_22',
    title: 'Back and Biceps',
    description:
      'A pulling session focused on building lat width and mid-back thickness. Think of your hands as hooks - pull with your elbows, not your hands.',
    category: 'Strength',
    difficulty: 'Intermediate',
    estimatedTime: 50,
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Or:',
        movements: [
          '3 mins light cardio (rower preferred)',
          '10 band pull-aparts or scapular wall slides',
          '10 dead bugs (controlled, alternating)',
          '1 light set of 10 dumbbell rows each side',
        ],
      },
      {
        name: 'Barbell or Dumbbell Row',
        instructions:
          'Rest 90–120s between sets. Initiate every pull by retracting your shoulder blade first.',
        highlightInstructions:
          'Keep torso parallel to floor. Pull elbows toward your back pockets.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '4 x 10',
          },
        ],
      },
      {
        name: 'Pull-ups or Lat Pulldown',
        instructions:
          'Rest 90–120s between sets. Initiate every pull by retracting your shoulder blade first.',
        highlightInstructions:
          'Full dead hang at the bottom on every rep. Pull chest to bar.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 8–12',
          },
        ],
      },
      {
        name: 'Seated Cable Row or Inverted Row',
        instructions:
          'Rest 90–120s between sets. Initiate every pull by retracting your shoulder blade first.',
        highlightInstructions:
          'Squeeze shoulder blades together and hold for a beat at the peak.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Bicep Curls',
        instructions:
          'Rest 60s between sets. No swinging - keep elbows pinned.',
        highlightInstructions:
          'Supinate (rotate) the wrist at the top to fully contract the bicep.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Hammer Curls',
        instructions:
          'Rest 60s between sets. No swinging - keep elbows pinned.',
        highlightInstructions:
          'Neutral grip targets the brachialis. Keep wrists straight throughout.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
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
    tags: ['Lower Body', 'Strength'],
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
        name: 'Barbell Back Squat or Leg Press',
        instructions:
          'Rest 2 mins between sets on squats. Rest 90s on accessory work.',
        highlightInstructions:
          'Sit back and down. Drive the floor away on the way up.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '4 x 10',
          },
        ],
      },
      {
        name: 'Romanian Deadlift (Barbell or Dumbbell)',
        instructions:
          'Rest 90s between sets. Push hips back until you feel a deep hamstring stretch. Drive hips through at the top and squeeze glutes.',
        highlightInstructions:
          'Push hips back until you feel a deep hamstring stretch. Drive hips through at the top and squeeze glutes.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12',
          },
        ],
      },
      {
        name: 'Walking Lunges or Split Squat',
        instructions:
          'Rest 90s between sets. Keep your front shin vertical. Do not let the knee cave inward.',
        highlightInstructions:
          'Keep your front shin vertical. Do not let the knee cave inward.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 10 each leg',
          },
        ],
      },
      {
        name: 'Leg Extension or Leg Curl',
        instructions:
          'Rest 60s between sets. Full range of motion on both movements.',
        highlightInstructions:
          'Pause for 1 second at peak contraction on each rep.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 15',
          },
        ],
      },
      {
        name: 'Calf Raises',
        instructions:
          'Rest 60s between sets. All the way up, all the way down. Slow eccentric.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 20',
          },
        ],
      },
      {
        name: 'Hanging Leg Raise or Plank',
        instructions:
          'Rest 60s between sets. No spinal load after heavy squats. Hip flexion only.',
        highlightInstructions:
          'No spinal load after heavy squats. Hip flexion only.',
        movements: [
          {
            name: 'Sets x Reps',
            value: '3 x 12-15 / 3 x 45-60s',
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
    id: 'p_02',
    title: 'Olympic Complex: Snatch Stability',
    description:
      'Developing technical speed and overhead stability with the snatch.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 30,
    tags: ['Olympic Lifting', 'Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['Burgener Warmup (Snatches with PVC pipe)'],
      },
      {
        name: 'Building up to working weight',
        instructions:
          'This first EMOM builds you up to your working weight. alter your barbell weight between sets and rest for a minimum of 60 seconds',
        highlightInstructions:
          'This is not a WOD, this is stability and conrol practice. OHS = Overhead squat.',
        movements: [
          '(30% 1RM) 5 Power Snatch + 1 Hang Snatch + 1 OHS',
          '(40% 1RM) 3 Power Snatch + 1 Hang Snatch + 1 OHS',
          '(50% 1RM) 2 Power Snatch + 1 Hang Snatch + 1 OHS',
          '(60% 1RM) 1 Power Snatch + 1 Hang Snatch + 1 OHS',
        ],
      },
      {
        name: 'EMOM 15',
        instructions:
          'Stay at or between 60-70% of 1RM Snatch. Focus on vertical bar path form and control.',
        highlightInstructions:
          'This is not a WOD, this is stability and conrol practice. OHS = Overhead squat.',
        movements: ['1 Power Snatch + 1 Hang Snatch + 1 OHS'],
      },
      {
        name: 'Strength Finisher',
        instructions:
          'Two heavy strength moves to reinforce the positions you just drilled. Build across the sets and rest 2 minutes between them. Keep every rep crisp.',
        movements: [
          '4 x 3 Overhead Squat (build to a heavy triple, taken from the rack)',
          '4 x 3 Snatch Grip Deadlift (90-100% of snatch 1RM, slow controlled pull)',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'p_04',
    title: 'Strength Press Day',
    description:
      'A proper overhead pressing session from the ground up. You will build to a heavy single, hit your volume work at 85%, then finish with accessory work that fills the gaps most pressers ignore. No leg drive, no excuses.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['10 Empty Bar Shoulder Press', 'Rest 60s before starting'],
      },
      {
        name: 'Block 1: Heavy Single Shoulder Press',
        instructions:
          'Five sets building to a heavy but not maximal single. This is 90-95% effort, not a true 1RM. Rest as needed between sets.',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM',
          'Set 2: 3 reps at 65% estimated 1RM',
          'Set 3: 2 reps at 75% estimated 1RM',
          'Set 4: 1 rep at 85% estimated 1RM',
          'Set 5: 1 rep at 90-95% estimated 1RM (record weight)',
        ],
      },
      {
        name: 'Block 2: 5x5 Volume Bench',
        instructions:
          'Drop to approximately 85% of your bench. Five sets of five with 3 minutes rest between each. Bar path straight, glutes and core tight, feet planted firmly. If you miss a rep, do not add weight next set.',
        movements: [
          'Set 1: 5 Bench Press 85%, rest 3 mins',
          'Set 2: 5 Bench Press 85%, rest 3 mins',
          'Set 3: 5 Bench Press 85%, rest 3 mins',
          'Set 4: 5 Bench Press 85%, rest 3 mins',
          'Set 5: 5 Bench Press 85%',
        ],
      },
      {
        name: 'Block 3: Accessory Superset',
        instructions:
          'Three rounds of the superset below. Rest 60s between rounds. These movements target the weak links in overhead pressing: triceps, rear delts and rotator cuff stability.',
        movements: [
          'Round 1: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls',
          'Round 2: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls',
          'Round 3: 12 Dumbbell Lateral Raises, 12 Tricep Dips, 12 Face Pulls',
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
    equipment: ['dumbbell', 'bands', 'barbell', 'static machines'],
  },
  {
    id: 'p_06',
    title: 'Strength Squat Day',
    description:
      'This is a proper squat session, not just a finisher. You will build to a heavy front squat, hit volume at 80%, then finish with accessory work that makes the next session better. Elbows up, chest tall, and do not bail on depth when it gets heavy.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Lower Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2mins easy cardio', 'Rest 60s before starting'],
      },
      {
        name: 'Block 1: Heavy Single Front Squat',
        instructions:
          'Take 5 sets to build to a heavy but not maximal single. This is not a 1RM attempt, aim for about 90-95% effort. Rest as needed between sets. This sets your working weight for Block 2.',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM',
          'Set 2: 3 reps at 65% estimated 1RM',
          'Set 3: 2 reps at 75% estimated 1RM',
          'Set 4: 1 rep at 85% estimated 1RM',
          'Set 5: 1 rep at 90-95% estimated 1RM',
        ],
      },
      {
        name: 'Block 2: Volume Front Squat at 80% of Block 1 weight',
        instructions:
          'Drop to 80% of your Block 1 heavy single and perform 3 reps every 90 seconds for 10 rounds. The weight should feel manageable for the first 5 rounds and earn your respect by round 8. Elbows up throughout.',
        highlightInstructions: 'minimum 90s rest between rounds.',
        movements: [
          'Round 1: 3 Front Squats at 80%',
          'Round 2: 3 Front Squats at 80%',
          'Round 3: 3 Front Squats at 80%',
          'Round 4: 3 Front Squats at 80%',
          'Round 5: 3 Front Squats at 80%',
          'Round 6: 3 Front Squats at 80%',
          'Round 7: 3 Front Squats at 80%',
          'Round 8: 3 Front Squats at 80%',
          'Round 9: 3 Front Squats at 80%',
          'Round 10: 3 Front Squats at 80%',
        ],
      },
      {
        name: 'Block 3: Accessory Finisher',
        instructions:
          'Three rounds, no barbell. Focus on quality and control. Rest 60s between rounds.',
        movements: [
          'Round 1: 12 Bulgarian Split Squats each leg, 15 Glute Bridges',
          'Round 2: 12 Bulgarian Split Squats each leg, 15 Glute Bridges',
          'Round 3: 12 Bulgarian Split Squats each leg, 15 Glute Bridges',
        ],
      },
      {
        name: 'Block 4: Leg Press',
        instructions:
          '3 rounds of hypertrophy work on the leg press. using a static machine will reduce your spine load after heavy front squats Rest 60s between rounds.',
        highlightInstructions: '60s rest between rounds, Medium weight',
        movements: ['15 Leg Press at 80%'],
      },
      {
        name: 'Cooldown',
        movements: ['5 minutes zone 2 cardio of choice / walking'],
      },
    ],
    equipment: ['barbell', 'static machines'],
  },
  {
    id: 'p_09',
    title: 'Pistol Squat Clinic',
    description:
      'Pistol squats are one of the hardest bodyweight movements to master. This session builds up to them properly, starting with the mobility and strength foundations and earning the full rep by the end. Do not skip the progressions, they are the session.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Lower Body', 'Gymnastics'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
      },
      {
        name: 'Block 1: Ankle and Hip Mobility',
        instructions:
          'Move slowly through each exercise. This is not a warmup, it is active prep for the demands of a pistol squat. Spend time where you feel restriction.',
        movements: [
          '3 x 45s Single Leg Bodyweight Calf Raises (slow, controlled)',
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
        highlightInstructions: 'Pistol Squat OR chosen progression',
        movements: [
          'Min 1: 3 Pistol Squats each leg',
          'Min 2: 3 Pistol Squats each leg',
          'Min 3: 3 Pistol Squats each leg',
          'Min 4: 3 Pistol Squats each leg',
          'Min 5: 3 Pistol Squats each leg',
          'Min 6: 3 Pistol Squats each leg',
          'Min 7: 3 Pistol Squats each leg',
          'Min 8: 3 Pistol Squats each leg',
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
    id: 'p_13',
    title: 'Pause Back Squats - Strength',
    description:
      'Pause squats expose every weakness in your squat. No bounce, no stretch reflex, just raw strength from the hole. This session builds to a heavy pause single, hits volume with a 3 second hold, then finishes with accessory work that makes the bottom position stronger every time you come back.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Lower Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Goblet Squats with 3 second pause at bottom',
          '2 x 5 Empty Bar Back Squat with 2 second pause',
          'Rest 90s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Back Squat Pause Single',
        instructions:
          'Five sets building to a heavy pause single. Every rep in this block has a 3 second hold at the bottom, including warmup sets. This is not a 1RM attempt, aim for 88-92% effort. Rest as needed between sets. This sets your working weight for Block 2.',
        highlightInstructions:
          '3 second pause at bottom of every rep, 3min rest between sets',
        movements: [
          'Set 1: 5 reps at 50% estimated 1RM, 3 second pause each',
          'Set 2: 3 reps at 63% estimated 1RM, 3 second pause each',
          'Set 3: 2 reps at 73% estimated 1RM, 3 second pause each',
          'Set 4: 1 rep at 83% estimated 1RM, 3 second pause',
          'Set 5: 1 rep at 88-92% estimated 1RM, 3 second pause',
        ],
      },
      {
        name: 'Block 2: 6x2 Pause Volume',
        instructions:
          'Drop to 80% of your Block 1 heavy single. Six sets of two reps, 3 second pause at the bottom of every rep. Rest exactly 3 minutes between sets. Brace hard before you descend, stay braced through the entire pause, drive the floor away on the way up.',
        highlightInstructions:
          '3 second pause at bottom of every rep, 3min rest between sets',
        movements: [
          'Set 1: 2 Pause Back Squats at 80%',
          'Set 2: 2 Pause Back Squats at 80%',
          'Set 3: 2 Pause Back Squats at 80%',
          'Set 4: 2 Pause Back Squats at 80%',
          'Set 5: 2 Pause Back Squats at 80%',
          'Set 6: 2 Pause Back Squats at 80%',
        ],
      },
      {
        name: 'Block 3: Bottom Position Strength',
        instructions:
          'Three rounds targeting the specific positions and muscles that fail first in a heavy pause squat. Rest 90s between rounds.',
        highlightInstructions: '3 Rounds. 60s rest between rounds',
        movements: [
          '60s Heavy Kettlebell Deep Squat Hold, 10 Heel Elevated Goblet Squats, 60s plank',
        ],
      },
      {
        name: 'Block 4: Posterior Chain Finisher',
        instructions:
          'Two rounds, no barbell. Keep rest minimal, this is just filling the gaps.',
        highlightInstructions: '2 Rounds. 90s rest between rounds',
        movements: ['15 Romanian Deadlifts, 15 Glute Bridges'],
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
    equipment: ['barbell', 'kettlebell'],
  },
  {
    id: 'p_16',
    title: 'The Muscle Up Lab',
    description:
      'The muscle up is not one skill, it is three. A powerful pull, a fast transition, and a strong dip. Most athletes fail in the transition because they never train it in isolation. This session breaks the movement into its components, trains each one separately, then puts it back together.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Upper Body', 'Gymnastics'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 Rounds: 10 Ring Rows, 10 Ring Dips',
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
        highlightInstructions: 'Rest in remaining minute time of the.',
        movements: ['2-3 Muscle Ups or Progression'],
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
    id: 'p_19',
    title: 'Pull-ups and Dips - Strength',
    description:
      'This session assumes you can perform weigthed pull-ups and dips. Pull-ups and dips have built more upper body strength than any machine ever invented. This session treats them with the respect they deserve. You will build to a heavy weighted single on both movements, hit volume at 85%, then finish with accessory work that fills every gap the big two leave behind.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 65,
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 x 5 Bodyweight Pull-ups, full range (assisted if needed)',
          '2 x 5 Bodyweight Dips, full depth (assisted if needed)',
          '30s Dead Hang',
          'Rest 60s before starting',
        ],
      },
      {
        name: 'Block 1: Build to a Heavy Weighted Single',
        instructions:
          'Alternate between pull-ups and dips each set, resting 90 seconds between movements. Build to the heaviest single you can execute with full range on both. This sets your working weight for Block 2. Full range means chin over bar and chest to bar on pull-ups, full depth lockout on dips.',
        highlightInstructions:
          '90s rest between movements, 2-3 mins rest between sets.',
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
    id: 'p_21',
    title: 'Chest Day',
    description:
      'Full chest and tricep session with structured progressive loading. The pec deck finisher will leave you unable to tie your own shoelaces.',
    category: 'Strength',
    difficulty: 'Advanced',
    estimatedTime: 60,
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins cardio of choice',
          '1 x 15 empty-bar or very light bench press - focus on bar path',
        ],
      },
      {
        name: 'Primary Compound',
        instructions: 'Controlled 2s descent on every rep.',
        highlightInstructions: 'Rest 2–3 mins between sets',
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
        instructions: 'Feel the upper chest stretch on the way down.',
        highlightInstructions: 'Rest 90s between sets',
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
        instructions: 'No lockout - keep constant tension on the pecs.',
        highlightInstructions: 'Rest 60s between sets',
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
        instructions: 'Elbows stay pinned throughout.',
        highlightInstructions: 'Rest 60s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins cardio of choice',
          '1 x 10 light dumbbell rows each side - focus on scapular retraction',
        ],
      },
      {
        name: 'Primary Compound',
        instructions: 'Torso parallel to floor. Pull elbows into back pockets.',
        highlightInstructions: 'Rest 2–3 mins between sets',
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
        instructions: 'Full dead hang at the bottom - every rep.',
        highlightInstructions: 'Rest 2 mins between sets',
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
        instructions: 'Hold the contraction for a beat before releasing.',
        highlightInstructions: 'Rest 90s between sets',
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
        instructions: 'Arms stay straight - this is not a row.',
        highlightInstructions: 'Rest 60s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
    tags: ['Lower Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: ['2 mins cardio of choice', '1 x 10 light goblet squats'],
      },
      {
        name: 'Primary Compound',
        instructions: 'This is the most important set of the week - earn it.',
        highlightInstructions: 'Rest 2.5–3 mins between sets',
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
        highlightInstructions: 'Rest 2 mins between sets',
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
        instructions:
          'Focus on form and not being "sloppy" with the movements.',
        highlightInstructions: 'Rest 90s between sets',
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
          'Full range of motion - all the way up, all the way down.',
        highlightInstructions: 'Rest 45s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '3 mins light cardio',
          '1 x 10 empty-bar overhead press - focus on lockout',
        ],
      },
      {
        name: 'Primary Press',
        instructions: 'No leg drive - strict press only.',
        highlightInstructions: 'Rest 2–3 mins between sets',
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
        instructions: 'Focus on lockout.',
        highlightInstructions: 'Rest 90s between sets',
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
          'Lead with the elbows - think about touching the side walls.',
        highlightInstructions: 'Rest 60s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
    tags: ['Upper Body', 'Strength'],
    isPremium: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '3 mins light cardio',
          '1 x 15 cable curls (light) / 1 x 15 tricep pushdowns (light) - pump blood into the elbow joints',
        ],
      },
      {
        name: 'Biceps - Compound',
        instructions: 'Elbows stay pinned - no swinging.',
        highlightInstructions: 'Rest 90s between sets',
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
        instructions: 'No momentum - the bicep does all the work.',
        highlightInstructions: 'Rest 60s between sets',
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
        instructions: 'Elbows stay tucked throughout.',
        highlightInstructions: 'Rest 90s between sets',
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
        instructions: 'Squeeze the lateral head hard on every rep.',
        highlightInstructions: 'Rest 60s between sets',
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
        highlightInstructions: 'Rest 60s between sets',
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
];
