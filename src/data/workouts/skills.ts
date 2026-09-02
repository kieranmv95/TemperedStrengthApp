import type { StandaloneWorkoutSource } from '@/src/types/workouts';

export const skills: StandaloneWorkoutSource[] = [
  {
    id: 'sw_01',
    title: 'Snatch Skill Lab',
    description:
      'A drill-led snatch session focused on the turnover and the catch, not the number on the bar. Positions first, speed second, load last. If a rep is slow under the bar, the weight stops climbing.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Skill', 'Olympic Lifting', 'Full Body'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: [
          '10 PVC Pass Throughs',
          '10 PVC Overhead Squats',
          'Burgener Warmup (PVC or empty bar)',
        ],
      },
      {
        name: 'Block 1: Position Drills',
        instructions:
          'Empty bar only. Three sets of each drill. Reset every rep and pause where the drill tells you to pause. Nobody has ever fixed a bar path by adding weight.',
        highlightInstructions: 'Empty bar. Slow and deliberate.',
        movements: [
          '3 x 5 Snatch Grip RDL (pause 2s below the knee)',
          '3 x 5 Snatch High Pull (tall finish, elbows high and outside)',
          '3 x 3 Muscle Snatch (no re-bend of the legs)',
          '3 x 3 Snatch from the Hang (slow to the knee, fast under)',
        ],
      },
      {
        name: 'Block 2: Turnover Speed',
        instructions:
          'The point of this block is how fast you get under the bar, not how much is on it. Every rep should sound the same. Stay light.',
        highlightInstructions: 'Speed under the bar is the score.',
        movements: [
          '5 x 3 Power Snatch at 50-60% 1RM',
          'Rest 90s between sets',
          '5 x 2 Snatch (full) at 60-70% 1RM',
          'Rest 90s between sets',
        ],
      },
      {
        name: 'Block 3: EMOM 10',
        instructions:
          'Every minute on the minute, one complex at 65-75% 1RM. If you miss a rep or the catch feels loose, drop the weight for the remaining minutes. Rest the remainder of each minute.',
        highlightInstructions: '1 complex per minute at 65-75%.',
        movements: ['1 Snatch + 1 Overhead Squat + 1 Snatch Balance'],
      },
      {
        name: 'Block 4: Accessory',
        instructions:
          'Three rounds. This builds the pull and the overhead position that hold the lift together. Rest 90s between rounds.',
        movements: [
          '5 Snatch Grip Deadlifts (100-110% of snatch 1RM, controlled)',
          '30s Overhead Barbell Hold (heavy, arms locked)',
          '10 Hollow Body Rocks',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'sw_02',
    title: 'Clean & Jerk Skill Lab',
    description:
      'Two lifts, one session. Drill the pull and the rack, then drill the overhead, then put them together under a clock. Every rep resets from the floor.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Skill', 'Olympic Lifting', 'Full Body'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: [
          '10 PVC Pass Throughs',
          '10 Front Rack Elbow Punches',
          'Burgener Warmup (Clean & Jerk pattern, PVC or empty bar)',
        ],
      },
      {
        name: 'Block 1: Clean Position Drills',
        instructions:
          'Empty bar. Three sets of each. Elbows fast, feet loud, chest tall. If the bar lands on your wrists rather than your shoulders, slow the drill down further.',
        movements: [
          '3 x 5 Clean Grip RDL (pause 2s below the knee)',
          '3 x 5 Clean High Pull (tall finish on the toes)',
          '3 x 3 Muscle Clean (fast elbows through the rack)',
          '3 x 3 Front Squat (3s pause at the bottom)',
        ],
      },
      {
        name: 'Block 2: Jerk Position Drills',
        instructions:
          'Empty bar. The dip is vertical, the drive is violent, the feet land at the same time. Reset the rack position between every rep.',
        movements: [
          '3 x 5 Jerk Dip (pause 2s in the dip, no drive)',
          '3 x 3 Tall Jerk (punch under to a locked receiving position)',
          '3 x 3 Behind the Neck Split Jerk',
        ],
      },
      {
        name: 'Block 3: Build',
        instructions:
          'Build to a technically sound heavy single. This is not a max out. The moment a rep looks worse than the one before it, hold that weight and stop climbing.',
        movements: [
          'Set 1: 2 Clean & Jerk at 60% 1RM',
          'Set 2: 2 Clean & Jerk at 70% 1RM',
          'Set 3: 1 Clean & Jerk at 80% 1RM',
          'Set 4: 1 Clean & Jerk at 85% 1RM',
          'Set 5: 1 Clean & Jerk at 88-92% 1RM (record weight)',
        ],
      },
      {
        name: 'Block 4: EMOM 10',
        instructions:
          'Every minute on the minute at 70% 1RM. Full stop between the clean and the jerk. Rest the remainder of each minute.',
        highlightInstructions: 'Singles at 70%. Reset from the floor.',
        movements: ['1 Clean & Jerk'],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Doorframe Chest Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['barbell'],
  },
  {
    id: 'sw_03',
    title: 'Split Jerk Clinic',
    description:
      'The split jerk is a footwork skill dressed up as a strength lift. Most misses are a slow front foot or a soft back leg, not a weak press. This session drills the split before it ever loads it.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Skill', 'Olympic Lifting', 'Upper Body'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: [
          '10 PVC Pass Throughs',
          '30s Couch Stretch each side',
          '10 Empty Bar Strict Press',
        ],
      },
      {
        name: 'Block 1: Footwork, No Bar',
        instructions:
          'No bar at all. Find your split: front shin vertical, back knee soft, feet roughly hip width apart laterally. Mark the landing spots on the floor with chalk and hit them every time.',
        highlightInstructions: 'Same landing spot every rep.',
        movements: [
          '3 x 5 Split Jumps (hands on hips, land and freeze for 2s)',
          '3 x 5 Split Jumps (alternate lead leg, then pick your dominant one)',
          '3 x 30s Split Position Hold (arms locked overhead)',
        ],
      },
      {
        name: 'Block 2: Bar Drills',
        instructions:
          'Empty bar, then light. Three sets of each drill. The dip is short and vertical - if your heels come off the floor in the dip, shorten it.',
        movements: [
          '3 x 5 Jerk Dip (2s pause in the dip, stand, no drive)',
          '3 x 3 Tall Jerk (no dip, punch under only)',
          '3 x 3 Jerk Balance (front foot already forward, drive and land)',
          '3 x 3 Behind the Neck Split Jerk',
        ],
      },
      {
        name: 'Block 3: Build to a Heavy Single',
        instructions:
          'From the rack, not from the floor. Five sets building to a heavy but not maximal single at 88-92% effort. Rest as needed. Record the weight.',
        movements: [
          'Set 1: 3 Split Jerk at 60% 1RM',
          'Set 2: 2 Split Jerk at 70% 1RM',
          'Set 3: 1 Split Jerk at 80% 1RM',
          'Set 4: 1 Split Jerk at 85% 1RM',
          'Set 5: 1 Split Jerk at 88-92% 1RM (record weight)',
        ],
      },
      {
        name: 'Block 4: Overhead Accessory',
        instructions:
          'Three rounds. Rest 90s between rounds. This is the strength that holds a heavy jerk overhead when the footwork is not perfect.',
        movements: [
          '5 Push Press (heavy)',
          '30s Overhead Barbell Hold in the Split Position',
          '10 Tall Kneeling Single Arm DB Press each side',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Couch Stretch each side',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['barbell', 'dumbbell'],
  },
  {
    id: 'sw_04',
    title: 'Strict Pull-Up Builder',
    description:
      'Everything else on the bar is built on this. Strict pull-ups, honest range, no kip to hide behind. Whether you have one rep or twenty, this session has a lane for you.',
    category: 'Skill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 40,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        scale: 'No Pull-Up Yet',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '10 Band Pull-Aparts',
              '10 Scapular Pull-Ups',
              '30s Dead Hang',
            ],
          },
          {
            name: 'Block 1: Scap Strength',
            instructions:
              'The first inch of a pull-up is the shoulder blade, not the elbow. Rest 60s between sets.',
            movements: [
              '4 x 8 Scapular Pull-Ups (arms stay straight, shrug down only)',
              '4 x 20s Active Hang (shoulders pulled down and back)',
            ],
          },
          {
            name: 'Block 2: Negatives',
            instructions:
              'Jump or step to the top position with your chin over the bar, then lower as slowly as you can. Rest 90s between sets. Stop the block when the lower drops under 3 seconds.',
            highlightInstructions: 'Lower for 5 seconds. Quality over count.',
            movements: ['5 x 3 Pull-Up Negatives (5s lower)'],
          },
          {
            name: 'Block 3: Assisted Volume',
            instructions:
              'Band assisted or ring rows. Pick a level where the last rep of each set is hard but clean. Rest 60s between sets.',
            movements: [
              '4 x 6 Band Assisted Pull-Ups',
              '3 x 10 Ring Rows (feet forward to make them harder)',
            ],
          },
          {
            name: 'Block 4: Accessory',
            instructions: 'Two rounds. Rest 60s between rounds.',
            movements: [
              '12 Face Pulls',
              '10 Single Arm Dumbbell Row each side',
              '30s Hollow Hold',
            ],
          },
        ],
      },
      {
        scale: 'Building Reps',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '10 Band Pull-Aparts',
              '10 Scapular Pull-Ups',
              '3 Easy Pull-Ups',
            ],
          },
          {
            name: 'Block 1: Density Ladder',
            instructions:
              'Every 90 seconds, complete the reps for that round. Stop the ladder the round before you would fail. Note the round you reached.',
            highlightInstructions: 'Stop one round before failure.',
            movements: [
              'Round 1: 1 Strict Pull-Up',
              'Round 2: 2 Strict Pull-Ups',
              'Round 3: 3 Strict Pull-Ups',
              'Round 4: 4 Strict Pull-Ups',
              'Continue adding 1 rep per round until the set is no longer clean',
            ],
          },
          {
            name: 'Block 2: Tempo Work',
            instructions:
              '3 seconds up, 1 second hold at the top, 3 seconds down. Rest 2 minutes between sets. This is where the strength actually comes from.',
            movements: ['4 x 3 Tempo Strict Pull-Ups (3-1-3)'],
          },
          {
            name: 'Block 3: Accessory',
            instructions: 'Three rounds. Rest 60s between rounds.',
            movements: [
              '12 Face Pulls',
              '10 Single Arm Dumbbell Row each side',
              '12 Band Straight Arm Pulldowns',
              '30s Hollow Hold',
            ],
          },
        ],
      },
      {
        scale: 'Weighted',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_15',
            highlightInstructions: 'Into:',
            movements: [
              '10 Band Pull-Aparts',
              '10 Scapular Pull-Ups',
              '2 x 5 Bodyweight Pull-Ups',
            ],
          },
          {
            name: 'Block 1: Build to a Heavy Single',
            instructions:
              'Full range means dead hang at the bottom, chin clearly over the bar at the top. Rest 2-3 minutes between sets. Record the weight.',
            movements: [
              'Set 1: 5 Bodyweight Pull-Ups',
              'Set 2: 3 Pull-Ups at light added weight',
              'Set 3: 2 Pull-Ups at moderate weight',
              'Set 4: 1 Pull-Up at heavy weight',
              'Set 5: 1 Pull-Up at max weight (record weight)',
            ],
          },
          {
            name: 'Block 2: 5 x 5 at 80%',
            instructions:
              'Drop to 80% of your Block 1 single. Five sets of five with 2-3 minutes rest. No half reps when it gets heavy.',
            movements: ['5 x 5 Weighted Strict Pull-Ups at 80%'],
          },
          {
            name: 'Block 3: Bodyweight Pump',
            instructions:
              'Drop all weight. Three sets of max reps, stopping two reps before failure. Rest 90s between sets.',
            movements: ['3 x Max Strict Pull-Ups (leave 2 in the tank)'],
          },
          {
            name: 'Block 4: Accessory',
            instructions: 'Two rounds. Rest 60s between rounds.',
            movements: [
              '12 Face Pulls',
              '10 Single Arm Dumbbell Row each side',
              '12 Band Straight Arm Pulldowns',
            ],
          },
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'dumbbell'],
  },
  {
    id: 'sw_05',
    title: 'The Kip Clinic',
    description:
      'The kip is a rhythm, not a thrash. Two shapes, hollow and arch, swapped at the right moment. This session builds the swing before it ever asks you to pull, because a bad kip repeated 500 times is just practice at being bad.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '10 Scapular Pull-Ups',
          '30s Dead Hang',
          '10 Cat Cows',
        ],
      },
      {
        name: 'Block 1: Shapes on the Floor',
        instructions:
          'You cannot make a shape on the bar that you cannot make on the floor. Ribs down in the hollow, glutes squeezed in the arch. Rest 45s between sets.',
        highlightInstructions:
          'Ribs down. No gaps between your back and floor.',
        movements: [
          '3 x 30s Hollow Hold',
          '3 x 30s Arch Hold (superman)',
          '3 x 10 Hollow to Arch Roll (roll around the side, not through)',
        ],
      },
      {
        name: 'Block 2: The Swing',
        instructions:
          'On the bar now. Push away from the bar with straight arms to make the shapes. The swing comes from the shoulders, not from bending your knees. Rest 60s between sets.',
        highlightInstructions:
          'Straight arms throughout. This block has no pulling in it.',
        movements: [
          '4 x 5 Scapular Pull-Ups',
          '4 x 8 Kip Swing (hollow to arch, straight arms, no pull)',
          '3 x 5 Kip Swing with Hip Pop (drive the hips forward, still no pull)',
        ],
      },
      {
        name: 'Block 3: Adding the Pull',
        instructions:
          'One rep at a time. Swing, pop the hips, pull, push away from the bar to reset into the arch. Come off the bar between every single rep in the first two sets. Rest 90s between sets.',
        highlightInstructions: 'Pull at the top of the hip pop, not before it.',
        movements: [
          '3 x 3 Single Kipping Pull-Ups (full reset between reps)',
          '3 x 3 Kipping Pull-Ups (linked, unbroken)',
          '3 x 5 Kipping Pull-Ups (linked, find the rhythm)',
        ],
      },
      {
        name: 'Block 4: EMOM 8',
        instructions:
          'Every minute on the minute, 5 unbroken kipping pull-ups. If the set breaks or the shapes fall apart, drop to 3 reps for the remaining minutes. Quality is the whole point.',
        highlightInstructions: 'Unbroken and smooth beats fast and ugly.',
        movements: ['5 Unbroken Kipping Pull-Ups'],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Lat Stretch each side',
          '60s Doorframe Chest Stretch each side',
          "60s Child's Pose",
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands'],
  },
  {
    id: 'sw_06',
    title: 'Chest to Bar Builder',
    description:
      'The gap between a pull-up and a chest to bar is about four inches of pull height, and those four inches come from the hips and the lats. This session builds the extra range rather than hoping you thrash your way to it.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '10 Scapular Pull-Ups',
          '5 Kip Swings',
          '3 Easy Pull-Ups',
        ],
      },
      {
        name: 'Block 1: Pull Height (Strict)',
        instructions:
          'Strict reps, aiming to touch the collarbone. If you cannot touch strict, pull as high as you can and hold the top for 2 seconds. Rest 90s between sets.',
        highlightInstructions:
          'Lean back at the top. Elbows drive down and back.',
        movements: [
          '4 x 3 Strict Chest to Bar Pull-Ups (or highest possible pull, 2s hold)',
          '3 x 5 Band Assisted Strict Chest to Bar',
        ],
      },
      {
        name: 'Block 2: Power from the Hips',
        instructions:
          'The kipping version is a hip drive problem, not an arm problem. Chase height, not reps. Rest 90s between sets.',
        movements: [
          '4 x 3 High Kipping Pull-Ups (pull sternum to bar, full reset each rep)',
          '3 x 3 Kipping Chest to Bar (linked)',
          '3 x 5 Kipping Chest to Bar (linked, contact every rep)',
        ],
      },
      {
        name: 'Block 3: EMOM 10',
        instructions:
          'Every minute on the minute, 4 chest to bar pull-ups. Every rep must make contact. A rep that misses the bar does not count and does not get repeated - the standard is the standard.',
        highlightInstructions: 'Contact every rep or the rep does not count.',
        movements: ['4 Chest to Bar Pull-Ups'],
      },
      {
        name: 'Block 4: Accessory',
        instructions: 'Three rounds. Rest 60s between rounds.',
        movements: [
          '12 Band Straight Arm Pulldowns',
          '10 Single Arm Dumbbell Row each side',
          '12 Face Pulls',
          '30s Hollow Hold',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Lat Stretch each side',
          '60s Doorframe Chest Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'dumbbell'],
  },
  {
    id: 'sw_07',
    title: 'Butterfly School',
    description:
      'Butterfly is the fastest way to cycle a pull-up and the fastest way to rip your hands if you rush it. You need 10 clean kipping pull-ups before you start this. The skill is the continuous circle, not the speed.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 35,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '10 Scapular Pull-Ups',
          '10 Kip Swings',
          '5 Kipping Pull-Ups',
        ],
      },
      {
        name: 'Block 1: The Continuous Swing',
        instructions:
          'Butterfly is a circle, not a pendulum. Instead of pushing back away from the bar, you drop under it and swing straight through. No pulling in this block at all. Rest 60s between sets.',
        highlightInstructions:
          'Same shapes as a kip, but you travel forward under the bar.',
        movements: [
          '4 x 8 Kip Swings (baseline rhythm)',
          '4 x 5 Butterfly Swing (no pull, feel the forward circle at the bottom)',
        ],
      },
      {
        name: 'Block 2: One Rep at a Time',
        instructions:
          'Add a single pull into the swing, then come straight back to swinging. Do not chase linked reps yet. Rest 90s between sets and check your hands after every set.',
        movements: [
          '4 x 1 Butterfly Pull-Up (from a swing, back to a swing)',
          '4 x 2 Butterfly Pull-Ups (linked)',
          '3 x 3 Butterfly Pull-Ups (linked)',
        ],
      },
      {
        name: 'Block 3: Cadence Practice',
        instructions:
          'EMOM 8. Every minute, 5 butterfly pull-ups at a rhythm you can repeat. If the reps get scrappy or a rip starts, stop the block immediately - hands take weeks to heal and this skill does not.',
        highlightInstructions:
          'Stop the moment a hot spot appears on your palm. Do not train through it.',
        movements: ['5 Butterfly Pull-Ups'],
      },
      {
        name: 'Block 4: Grip and Shoulder Accessory',
        instructions: 'Two rounds. Rest 60s between rounds.',
        movements: [
          '30s Dead Hang',
          '12 Band Straight Arm Pulldowns',
          '30s Hollow Hold',
          '12 Face Pulls',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Doorframe Chest Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands'],
  },
  {
    id: 'sw_08',
    title: 'Bar Muscle-Up Lab',
    description:
      'A bar muscle-up is a high pull and a fast turnover, not a big pull-up. Most athletes fail because they pull to the chest instead of to the hips. This session trains the height, the hip drive and the turnover separately, then puts them back together.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '10 Scapular Pull-Ups',
          '10 Kip Swings',
          '5 Kipping Pull-Ups',
        ],
      },
      {
        name: 'Block 1: Pull Height',
        instructions:
          'You need to pull the bar to your hips, not your chest. Chase contact points lower and lower down your torso. Rest 90s between sets.',
        highlightInstructions: 'Aim the bar at your belt, not your collarbone.',
        movements: [
          '4 x 3 Chest to Bar Pull-Ups (full reset each rep)',
          '4 x 3 Hip to Bar Pull-Ups (pull as low on the torso as possible)',
        ],
      },
      {
        name: 'Block 2: Turnover Drills',
        instructions:
          'The turnover is a fast lean forward around the bar. Keep it slow and deliberate here, speed comes later. Rest 90s between sets.',
        movements: [
          '3 x 3 Banded Bar Muscle-Up (foot or knee in the band)',
          '3 x 3 Jumping Bar Muscle-Up (from a box, focus on the lean over the bar)',
          '3 x 3 Bar Muscle-Up Negatives (5s lower from support to hang)',
          '3 x 20s Bar Support Hold (arms locked, shoulders over the bar)',
        ],
      },
      {
        name: 'Block 3: Put It Together',
        instructions:
          'Singles only, with a full reset between reps. If you have muscle-ups already, work on linking 2-3 reps with a clean push away at the top. Rest 2 minutes between sets.',
        movements: [
          '5 x 1 Bar Muscle-Up (or hardest progression from Block 2)',
          '3 x 2 Bar Muscle-Ups (linked, if available)',
        ],
      },
      {
        name: 'Block 4: EMOM 8',
        instructions:
          'Every minute on the minute, 1-3 quality reps of your chosen level. Stop the block if the reps stop being clean. Rest the remainder of each minute.',
        highlightInstructions: 'Quality over quantity, every single rep.',
        movements: ['1-3 Bar Muscle-Ups or chosen progression'],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Wrist Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'box'],
  },
  {
    id: 'sw_09',
    title: 'Strict Bar Muscle-Up Strength',
    description:
      'No kip, no swing, no momentum. A strict bar muscle-up is raw pulling power plus the ability to change direction over the bar. This is a strength session more than a skill session, and it is deliberately slow.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Skill', 'Upper Body', 'Strength'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '10 Scapular Pull-Ups',
          '5 Strict Pull-Ups',
          '5 Bar Dips',
        ],
      },
      {
        name: 'Block 1: Strict Pull Height',
        instructions:
          'The entry requirement is a strict chest to bar. Build the pull higher than that. Rest 2 minutes between sets.',
        movements: [
          '4 x 3 Weighted Strict Chest to Bar Pull-Ups',
          '3 x 3 Strict Sternum Pull-Ups (pull as low on the torso as you can, 1s hold)',
        ],
      },
      {
        name: 'Block 2: The Transition',
        instructions:
          'Strict transitions are trained in the eccentric and in partial ranges before they happen in full. Move slowly, no swinging. Rest 2 minutes between sets.',
        movements: [
          '4 x 3 Strict Bar Muscle-Up Negatives (8s lower, no swing)',
          '3 x 3 Banded Strict Bar Muscle-Up (band on the bar, no leg drive)',
          '3 x 30s Bar Support Hold (arms locked, shoulders forward)',
        ],
      },
      {
        name: 'Block 3: Dip Strength',
        instructions:
          'The finish kills as many strict attempts as the pull. Rest 90s between sets.',
        movements: [
          '4 x 5 Bar Dips (full depth, 1s pause at the bottom)',
          '3 x 3 Slow Eccentric Bar Dips (5s lower)',
        ],
      },
      {
        name: 'Block 4: Attempts and Accessory',
        instructions:
          'Three attempts at a strict rep with full rest, then finish with accessory work. Do not grind attempts when you are already fatigued.',
        movements: [
          '3 x 1 Strict Bar Muscle-Up attempt (rest 3 mins between attempts)',
          {
            type: 'divider',
            note: 'then 2 rounds',
          },
          '12 Face Pulls',
          '10 Single Arm Dumbbell Row each side',
          '12 Band Straight Arm Pulldowns',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'dumbbell'],
  },
  {
    id: 'sw_10',
    title: 'Toes to Bar Clinic',
    description:
      'Toes to bar is a compression problem and a timing problem. If you cannot touch your toes to your hands sitting on the floor, no amount of swinging will fix it on the bar. Compression first, then the kip.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Skill', 'Core', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '30s Dead Hang',
          '10 Scapular Pull-Ups',
          '10 Cat Cows',
          '30s Standing Hamstring Stretch each side',
        ],
      },
      {
        name: 'Block 1: Compression',
        instructions:
          'This is the part everyone skips and it is the part that limits you. Rest 45s between sets.',
        highlightInstructions:
          'If you cannot compress on the floor, you cannot compress on the bar.',
        movements: [
          '3 x 20s Seated Pike Compression (hands by hips, lift heels off floor)',
          '3 x 10 Seated Leg Lifts (legs straight, lift and hold 2s)',
          '3 x 30s Hollow Hold',
          '3 x 10 V-Ups',
        ],
      },
      {
        name: 'Block 2: On the Bar',
        instructions:
          'Straight arms, push away from the bar to create the arch. The legs travel because the shoulders move, not because you crunch. Rest 60s between sets.',
        movements: [
          '4 x 8 Kip Swings (straight arms, big shapes)',
          '4 x 6 Hanging Knee Raises (controlled, no swing)',
          '4 x 5 Hanging Leg Raises (straight legs, toes to hip height)',
        ],
      },
      {
        name: 'Block 3: Timing',
        instructions:
          'Now add the kip. Bring the toes to the bar at the front of the swing, then push away hard to reset into the arch. Full reset between reps in the first two sets. Rest 90s between sets.',
        movements: [
          '3 x 3 Single Toes to Bar (full reset between reps)',
          '3 x 3 Toes to Bar (linked)',
          '3 x 5 Toes to Bar (linked)',
        ],
      },
      {
        name: 'Block 4: EMOM 8',
        instructions:
          'Every minute on the minute, 6 unbroken toes to bar. If the set breaks, drop to 4 for the remaining minutes. Contact the bar on every rep.',
        highlightInstructions: 'Unbroken sets, contact every rep.',
        movements: ['6 Unbroken Toes to Bar'],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Standing Forward Fold',
          "60s Child's Pose",
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar'],
  },
  {
    id: 'sw_11',
    title: 'Ring Muscle-Up Lab',
    description:
      'Rings move, and that is the whole problem. The false grip is uncomfortable, unglamorous and completely non-negotiable. This session builds the grip, the transition and the dip in that order.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 50,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '2 Rounds: 10 Ring Rows, 8 Ring Dips',
          '30s False Grip Hang',
        ],
      },
      {
        name: 'Block 1: False Grip',
        instructions:
          'Wrist on top of the ring, ring sitting in the meat of the hand. It will feel wrong for about three weeks. Rest 60s between sets.',
        highlightInstructions: 'Build tolerance, not just strength.',
        movements: [
          '4 x 20s False Grip Hang',
          '4 x 6 False Grip Ring Rows',
          '3 x 5 False Grip Ring Pull-Ups (pull rings to the sternum)',
        ],
      },
      {
        name: 'Block 2: Transition Drills',
        instructions:
          'The transition is a fast lean forward with the elbows driving back and down. Slow and deliberate here. Rest 90s between sets.',
        movements: [
          '3 x 3 Jumping Ring Muscle-Up (rings at chest height, feet assist)',
          '3 x 3 Slow Transition Pull (pull to chest, pause, rotate wrists, push to support)',
          '3 x 3 Ring Muscle-Up Negatives (5s lower through the transition)',
          '3 x 20s Ring Support Hold (arms locked, rings turned out)',
        ],
      },
      {
        name: 'Block 3: Kip and Dip',
        instructions:
          'The kipping ring muscle-up uses a hollow to arch swing with a fast hip drive, exactly like the bar. Then you still need the dip. Rest 90s between sets.',
        movements: [
          '4 x 6 Ring Kip Swings (straight arms, no pull)',
          '4 x 6 Ring Dips (full depth, pause at the bottom)',
          '3 x 3 Slow Eccentric Ring Dips (4s lower)',
        ],
      },
      {
        name: 'Block 4: EMOM 8',
        instructions:
          'Every minute on the minute, 1-2 reps of your hardest clean progression. If you have muscle-ups, work on the smoothness of the transition rather than adding reps.',
        highlightInstructions: 'Quality over quantity, every single rep.',
        movements: ['1-2 Ring Muscle-Ups or chosen progression'],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Doorframe Chest Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'box'],
  },
  {
    id: 'sw_12',
    title: 'Strict Ring Muscle-Up Strength',
    description:
      'The hardest bodyweight skill in the building. No swing, no leg drive, no momentum through the transition. This session assumes you already have a kipping ring muscle-up and want the strict version.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 55,
    tags: ['Skill', 'Upper Body', 'Strength'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Band Pull-Aparts',
          '2 Rounds: 10 Ring Rows, 8 Ring Dips',
          '30s False Grip Hang',
          '3 Strict Pull-Ups',
        ],
      },
      {
        name: 'Block 1: False Grip Pulling Strength',
        instructions:
          'Everything here is false grip and strict. Rest 2 minutes between sets.',
        movements: [
          '4 x 3 Weighted False Grip Ring Pull-Ups (pull rings to sternum, 1s hold)',
          '3 x 5 Archer Ring Rows each side',
          '4 x 20s False Grip Hang (add weight if easy)',
        ],
      },
      {
        name: 'Block 2: Strict Transition',
        instructions:
          'This is the entire session. Slow, controlled, no leg drive, no hip swing. Rest 2-3 minutes between sets.',
        highlightInstructions: 'If the hips swing, the rep does not count.',
        movements: [
          '4 x 3 Strict Ring Muscle-Up Negatives (8s lower, pause halfway through the transition)',
          '3 x 3 Banded Strict Ring Muscle-Up (band under the feet)',
          '4 x 5 Ring Dip to Deep Support (pause 2s at the bottom)',
        ],
      },
      {
        name: 'Block 3: Support Strength',
        instructions:
          'The catch position is a strength position of its own. Rest 90s between sets.',
        movements: [
          '4 x 30s Ring Support Hold (rings turned out)',
          '3 x 5 Weighted Ring Dips',
          '3 x 5 Russian Dips (elbow to ring, then press out)',
        ],
      },
      {
        name: 'Block 4: Attempts and Accessory',
        instructions:
          'Three attempts with full rest, then finish with the accessory work. Do not grind attempts once you are cooked.',
        movements: [
          '3 x 1 Strict Ring Muscle-Up attempt (rest 3 mins between attempts)',
          {
            type: 'divider',
            note: 'then 2 rounds',
          },
          '12 Face Pulls',
          '12 Band Straight Arm Pulldowns',
          '10 Single Arm Dumbbell Row each side',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Dead Hang',
          '60s Doorframe Chest Stretch each side',
          '60s Wrist Flexor Stretch each side',
          '60s Lat Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'bands', 'dumbbell'],
  },
  {
    id: 'sw_13',
    title: 'Overhead Squat Fix',
    description:
      'The overhead squat exposes ankles, hips, t-spine and shoulders all at once, which is why most people hate it. This session opens the positions, then loads them, then tests whether they held.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 45,
    tags: ['Skill', 'Olympic Lifting', 'Lower Body'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_14',
        highlightInstructions: 'Into:',
        movements: [
          '10 PVC Pass Throughs',
          '60s Ankle Rock each side',
          '60s Deep Squat Hold (hold a rig for support)',
          '30s Lat Stretch each side',
        ],
      },
      {
        name: 'Block 1: Position Drills',
        instructions:
          'PVC or empty bar only. If the bar drifts forward, the fault is behind you in the warmup, not in your arms. Rest 45s between sets.',
        movements: [
          '3 x 10 PVC Pass Throughs (narrow the grip each set)',
          '3 x 5 Snatch Grip Press Behind Neck',
          '3 x 5 Sotts Press (from the bottom of the squat, PVC)',
          '3 x 5 Overhead Squat (3s hold at the bottom)',
        ],
      },
      {
        name: 'Block 2: Tempo Build',
        instructions:
          'Five sets building in weight. Every rep has a 3 second descent and a 2 second hold at the bottom. Stop adding weight the moment the bar drifts in front of your midfoot.',
        highlightInstructions: 'Bar over the middle of the foot. Always.',
        movements: [
          'Set 1: 5 Overhead Squats at empty bar',
          'Set 2: 5 Overhead Squats at 40% snatch 1RM',
          'Set 3: 3 Overhead Squats at 55% snatch 1RM',
          'Set 4: 3 Overhead Squats at 65% snatch 1RM',
          'Set 5: 3 Overhead Squats at 70-75% snatch 1RM (record weight)',
        ],
      },
      {
        name: 'Block 3: Stability Under Load',
        instructions:
          'Five sets alternating between the two movements, staying at the weight from Block 2. The snatch balance reinforces receiving the bar in that same position. Rest 2 minutes between sets.',
        movements: ['5 x 3 Overhead Squat, rest 90s, 2 Snatch Balance'],
      },
      {
        name: 'Block 4: Accessory',
        instructions: 'Two rounds. Rest 60s between rounds.',
        movements: [
          '30s Overhead Barbell Hold (walk 10m if space allows)',
          '10 Single Arm Dumbbell Overhead Squat each side',
          '12 Face Pulls',
          '10 Hollow Body Rocks',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Lat Stretch each side',
          '60s Ankle Stretch each side',
          '60s Thoracic Extension over foam roller',
          '60s Deep Squat Hold',
        ],
      },
    ],
    equipment: ['barbell', 'dumbbell', 'bands'],
  },
  {
    id: 'sw_14',
    title: 'Worm Work',
    description:
      'The worm is a team skill, not an individual one. Everything is decided by whoever calls the reps and whether the whole line moves at the same time. No worm? Use a log, a heavy barbell held by the team, or a loaded sandbag on the shoulders.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Skill', 'Full Body', 'Strength', 'Partner'],
    isPremium: true,
    allowedRoles: ['coach'],
    partner: true,
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into (as a team):',
        movements: [
          '10 Bodyweight Squats (called out and synced)',
          '10 Good Mornings (empty bar or PVC)',
          '10 Front Rack Elbow Punches',
        ],
      },
      {
        name: 'Block 1: Timing, No Load',
        instructions:
          'One person calls every rep. The whole team moves on the call, not on what they feel. Agree the count before you touch anything heavy. This block is boring and it is the most important one.',
        highlightInstructions: 'One caller. Everyone moves on the call.',
        movements: [
          '3 x 10 Synced Air Squats (caller counts down 3-2-1 on each rep)',
          '3 x 10 Synced Good Mornings (PVC or empty bar across the team)',
          '3 x 5 Synced Deadlift and Stand (empty bar or light worm)',
        ],
      },
      {
        name: 'Block 2: Positions Under Load',
        instructions:
          'Light worm or team-held barbell. Everyone picks up on the same call and everyone puts down on the same call. If one person breaks early, the whole team resets the set.',
        movements: [
          '4 x 5 Worm Deadlifts',
          '4 x 3 Worm Cleans to the Shoulder',
          '4 x 5 Worm Front Squats',
          '3 x 3 Worm Shoulder to Overhead',
        ],
      },
      {
        name: 'Block 3: The Full Movement',
        instructions:
          'Four sets of the full complex, building load if the timing holds. Rest 2 minutes between sets. Load only goes up if every rep of the previous set was synced.',
        highlightInstructions:
          'Add weight only when the timing is perfect, not before.',
        movements: [
          '4 x 3 Worm Thrusters (clean to shoulder, front squat, drive overhead)',
        ],
      },
      {
        name: 'Block 4: Team Finisher',
        instructions:
          '3 rounds as a team. Not for time. The goal is to hold the timing when everyone is breathing hard, because that is when worm reps fall apart in a competition.',
        movements: [
          '5 Worm Cleans',
          '10 Worm Front Squats',
          '20m Worm Carry',
          'Rest 2 mins between rounds',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Doorframe Chest Stretch each side',
          '60s Hip Flexor Stretch each side',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['barbell', 'sandbag'],
  },
  {
    id: 'sw_15',
    title: 'Pistol Progression',
    description:
      'A pistol squat needs ankle range, single leg strength and balance, and most people are missing at least one. This session finds out which one it is and trains it, then earns the full rep at the end.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Skill', 'Lower Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '60s Ankle Rock each side',
          '10 Deep Squat to Stand',
          '10 Glute Bridges',
        ],
      },
      {
        name: 'Block 1: Ankles and Balance',
        instructions:
          'Move slowly. Spend extra time on whichever side feels worse - and one side always feels worse.',
        movements: [
          '3 x 45s Single Leg Calf Raises (slow, full range)',
          '3 x 10 Knee Over Toe Squats each side',
          '3 x 30s Single Leg Balance Hold each side (eyes closed if easy)',
          '3 x 10 Assisted Deep Squat to Stand (hold a rig)',
        ],
      },
      {
        name: 'Block 2: Progressions',
        instructions:
          'Two to three sets of each. Only move to the next progression when the current one is controlled, not just possible. Rest 60s between sets.',
        movements: [
          'Progression 1: 3 x 5 Box Pistol Squat each leg (sit back to a box)',
          'Progression 2: 3 x 5 Counterbalanced Pistol each leg (hold a light plate or KB in front)',
          'Progression 3: 3 x 4 Eccentric Pistol each leg (4s lower, stand with two legs)',
          'Progression 4: 3 x 3 Full Pistol Squat each leg',
        ],
      },
      {
        name: 'Block 3: EMOM 10',
        instructions:
          'Pick the progression that challenged you most in Block 2. Every minute on the minute, 3 reps each leg. Rest the remainder of the minute.',
        highlightInstructions: 'Pistol Squat or chosen progression.',
        movements: ['3 Pistol Squats each leg'],
      },
      {
        name: 'Block 4: Single Leg Accessory',
        instructions: 'Three rounds. Rest 60s between rounds.',
        movements: [
          '10 Bulgarian Split Squats each leg',
          '10 Step Ups each leg (controlled down)',
          '15 Banded Terminal Knee Extensions each leg',
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
    equipment: ['box', 'kettlebell', 'bands'],
  },
  {
    id: 'sw_16',
    title: 'Handstand Walk Progression',
    description:
      'Handstand walking is a balance skill built on a shoulder strength base. If you cannot hold a wall facing handstand for 60 seconds, that is the session, not the walking. Wrists get prepped properly here because they take the brunt of it.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 40,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_03',
        mobilityFlowCopy: 'Start Handstand Prep Flow',
        highlightInstructions: 'Or:',
        movements: [
          '30s Wrist Circles each direction',
          '30s Wrist Flexor and Extensor Stretch each side',
          '10 Scapular Push-Ups',
          '3 Wall Walks',
        ],
      },
      {
        name: 'Block 1: The Hold',
        instructions:
          'Chest to the wall, not back to the wall. Ribs down, glutes squeezed, push the floor away through the shoulders. Rest 60s between sets.',
        highlightInstructions: 'Wall facing. Hollow, not banana.',
        movements: [
          '4 x 30-60s Wall Facing Handstand Hold',
          '3 x 10 Handstand Shoulder Taps (wall facing, controlled)',
          '3 x 20s Handstand Hold with Weight Shift (side to side, one hand light)',
        ],
      },
      {
        name: 'Block 2: Freestanding Balance',
        instructions:
          'Away from the wall now. Kick up, find the balance point with your fingertips, bail to the side when you lose it. Falling safely is part of the skill. Rest 60s between sets.',
        movements: [
          '5 x 3 Kick Up to Freestanding Handstand (hold as long as possible)',
          '3 x 5 Box Walk Outs (feet on a box, walk hands out and back)',
          '3 x 3 Handstand Bail Practice (cartwheel out to the side)',
        ],
      },
      {
        name: 'Block 3: Walking',
        instructions:
          'Short distances, quality steps. Small steps travel further than lunging hand movements. Take the distance in chunks rather than chasing one long attempt.',
        highlightInstructions: 'Small steps. Fingertips do the balancing.',
        movements: [
          '5 x 5m Handstand Walk (or 5 x 3 attempts if 5m is not there yet)',
          '3 x 10m Handstand Walk (rest as needed)',
        ],
      },
      {
        name: 'Block 4: Shoulder and Wrist Accessory',
        instructions: 'Two rounds. Rest 60s between rounds.',
        movements: [
          '10 Seated Dumbbell Press',
          '30s Wrist Push-Up Rocks (front to back on the palms)',
          '12 Face Pulls',
          '30s Hollow Hold',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Wrist Flexor Stretch each side',
          '60s Doorframe Chest Stretch each side',
          '60s Lat Stretch each side',
          '60s Thoracic Extension over foam roller',
        ],
      },
    ],
    equipment: ['dumbbell', 'box', 'bands'],
  },
  {
    id: 'sw_17',
    title: 'Handstand Push-Up Builder',
    description:
      'Strict first, kipping second. The kipping handstand push-up is a hip drive skill and it is only safe on top of strict strength. Three lanes here depending on where you are.',
    category: 'Skill',
    difficulty: 'Multiple Difficulties',
    estimatedTime: 45,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        scale: 'Building Strength',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_03',
            mobilityFlowCopy: 'Start Handstand Prep Flow',
            highlightInstructions: 'Or:',
            movements: [
              '30s Wrist Circles each direction',
              '10 Scapular Push-Ups',
              '10 Band Pull-Aparts',
              '3 Wall Walks',
            ],
          },
          {
            name: 'Block 1: Pressing Base',
            instructions:
              'Build the vertical pressing strength before you go upside down under load. Rest 90s between sets.',
            movements: [
              '4 x 8 Pike Push-Ups (feet on the floor, hips high)',
              '4 x 6 Box Pike Push-Ups (feet on a box, more vertical)',
              '3 x 8 Seated Dumbbell Press',
            ],
          },
          {
            name: 'Block 2: Inverted Time',
            instructions: 'Get comfortable upside down. Rest 60s between sets.',
            movements: [
              '4 x 30s Wall Facing Handstand Hold',
              '3 x 3 Wall Walks (slow, controlled down)',
            ],
          },
          {
            name: 'Block 3: Negatives',
            instructions:
              'Kick up to the wall, lower slowly to an abmat or folded towel, then step down and reset. Rest 90s between sets.',
            highlightInstructions:
              '5s lower. Head lands in front of the hands.',
            movements: ['5 x 3 Handstand Push-Up Negatives (5s lower)'],
          },
          {
            name: 'Block 4: Accessory',
            instructions: 'Two rounds. Rest 60s between rounds.',
            movements: [
              '12 Dumbbell Lateral Raises',
              '12 Face Pulls',
              '10 Tricep Dips',
              '30s Hollow Hold',
            ],
          },
        ],
      },
      {
        scale: 'Strict HSPU',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_03',
            mobilityFlowCopy: 'Start Handstand Prep Flow',
            highlightInstructions: 'Or:',
            movements: [
              '30s Wrist Circles each direction',
              '10 Scapular Push-Ups',
              '3 Wall Walks',
              '3 Strict Handstand Push-Ups',
            ],
          },
          {
            name: 'Block 1: Strength Sets',
            instructions:
              'Head to the floor or an abmat, full lockout at the top. Stop each set one rep before failure. Rest 2 minutes between sets.',
            movements: [
              '5 x 3-5 Strict Handstand Push-Ups',
              '3 x 3 Deficit Strict Handstand Push-Ups (hands on plates, if available)',
            ],
          },
          {
            name: 'Block 2: Tempo and Holds',
            instructions:
              'Control on the way down builds the strength that gets you back up. Rest 90s between sets.',
            movements: [
              '3 x 3 Tempo Strict HSPU (4s lower, 1s pause on the floor)',
              '3 x 30s Wall Facing Handstand Hold',
            ],
          },
          {
            name: 'Block 3: Accessory',
            instructions: 'Three rounds. Rest 60s between rounds.',
            movements: [
              '10 Seated Dumbbell Press',
              '12 Dumbbell Lateral Raises',
              '12 Face Pulls',
              '10 Tricep Dips',
            ],
          },
        ],
      },
      {
        scale: 'Kipping HSPU',
        blocks: [
          {
            name: 'Warmup',
            mobilityFlow: 'r_03',
            mobilityFlowCopy: 'Start Handstand Prep Flow',
            highlightInstructions: 'Or:',
            movements: [
              '30s Wrist Circles each direction',
              '10 Scapular Push-Ups',
              '3 Wall Walks',
              '3 Strict Handstand Push-Ups',
            ],
          },
          {
            name: 'Block 1: The Kip',
            instructions:
              'Lower under control, tuck the knees, then drive the legs up and press at the same moment. The press finishes as the legs extend, not after. Rest 90s between sets.',
            highlightInstructions: 'Legs drive and arms press together.',
            movements: [
              '4 x 3 Single Kipping HSPU (full reset between reps)',
              '4 x 5 Kipping HSPU (linked)',
            ],
          },
          {
            name: 'Block 2: Capacity',
            instructions:
              'EMOM 10. Every minute, 5 kipping handstand push-ups. If the reps get scrappy or the head starts landing hard, drop to 3 for the remaining minutes.',
            movements: ['5 Kipping Handstand Push-Ups'],
          },
          {
            name: 'Block 3: Strict Maintenance',
            instructions:
              'Never let the strict work disappear. Rest 90s between sets.',
            movements: ['3 x 5 Strict Handstand Push-Ups'],
          },
          {
            name: 'Block 4: Accessory',
            instructions: 'Two rounds. Rest 60s between rounds.',
            movements: [
              '12 Dumbbell Lateral Raises',
              '12 Face Pulls',
              '10 Tricep Dips',
              '30s Hollow Hold',
            ],
          },
        ],
      },
    ],
    equipment: ['dumbbell', 'box', 'bands'],
  },
  {
    id: 'sw_18',
    title: 'Rope Climb Clinic',
    description:
      'A rope climb is a leg exercise that people insist on doing with their arms. Get the foot lock right and you can climb all day. Get it wrong and you will burn your grip out on rep two. Long socks and long leggings for this one.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 40,
    tags: ['Skill', 'Upper Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '20 Hand Clenches',
          '30s Wrist Circles each direction',
          '10 Scapular Pull-Ups',
          '30s Dead Hang',
        ],
      },
      {
        name: 'Block 1: The Foot Lock',
        instructions:
          'Sitting on the floor first. Rope over the top of one foot, wrap it around, trap it with the other foot. Practice both the J-hook and the S-wrap and pick the one that locks fastest for you. Do this until it is automatic.',
        highlightInstructions:
          'The feet hold your weight. The hands only stop you falling backwards.',
        movements: [
          '5 x 5 Seated Foot Lock Practice (on the floor, both styles)',
          '3 x 5 Standing Foot Lock (stand up out of the lock, rope still low)',
        ],
      },
      {
        name: 'Block 2: Pull and Stand',
        instructions:
          'This is the whole climb in miniature. Pull the knees up high, lock the feet, then stand up on the rope. Every climb is just this movement repeated. Rest 90s between sets.',
        movements: [
          '4 x 5 Seated Rope Pull-Ups (sat on the floor, pull to standing)',
          '4 x 3 Lock and Stand (jump to grip, lock feet, stand tall)',
          '3 x 3 Half Climbs (lock, stand, lock, then controlled descent)',
        ],
      },
      {
        name: 'Block 3: Full Climbs',
        instructions:
          'Full climbs with a controlled descent. Never slide down - it costs skin and it costs control. Rest 2 minutes between attempts.',
        highlightInstructions: 'Controlled descent every time. Do not slide.',
        movements: [
          '5 x 1 Rope Climb (rest 2 mins between)',
          '3 x 2 Rope Climbs (rest 2 mins between)',
        ],
      },
      {
        name: 'Block 4: Grip Accessory',
        instructions: 'Three rounds. Rest 90s between rounds.',
        movements: [
          '30s Dead Hang',
          '40m Farmers Carry (heavy)',
          '10 Single Arm Dumbbell Row each side',
          '20 Hand Clenches',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Wrist Flexor Stretch each side',
          '60s Lat Stretch each side',
          '60s Forearm Massage each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'dumbbell'],
  },
  {
    id: 'sw_19',
    title: 'Legless Rope Climb',
    description:
      'Take the legs away and a rope climb becomes a pulling test with a grip tax. You need strict pull-ups and a solid standard climb before this. Everything here builds the hand over hand pull and the grip that has to survive it.',
    category: 'Skill',
    difficulty: 'Advanced',
    estimatedTime: 45,
    tags: ['Skill', 'Upper Body', 'Strength'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '20 Hand Clenches',
          '10 Scapular Pull-Ups',
          '30s Dead Hang',
          '5 Strict Pull-Ups',
        ],
      },
      {
        name: 'Block 1: Pull Strength',
        instructions:
          'Legless is a strict pulling problem. Rest 2 minutes between sets.',
        movements: [
          '4 x 3 Weighted Strict Pull-Ups',
          '3 x 5 Rope Pull-Ups (hands on the rope, feet off the floor)',
          '3 x 5 Archer Pull-Ups each side',
        ],
      },
      {
        name: 'Block 2: Legless Progressions',
        instructions:
          'Start seated on the floor and work up. Only add height when the current level is controlled. Rest 2 minutes between sets.',
        highlightInstructions: 'Hand over hand. No leg contact at any point.',
        movements: [
          '4 x 3 Seated Legless Pull to Standing (from the floor, L-sit legs)',
          '4 x 2 Half Legless Climbs (halfway up, controlled descent)',
          '3 x 3 Legless Descents (climb with legs, descend hand over hand)',
        ],
      },
      {
        name: 'Block 3: Full Attempts',
        instructions:
          'Five attempts at a full legless climb with plenty of rest. Controlled descent every time. Stop when the grip goes, not when the arms do - a failed grip halfway up a rope is not worth it.',
        movements: ['5 x 1 Legless Rope Climb (rest 3 mins between attempts)'],
      },
      {
        name: 'Block 4: Grip Accessory',
        instructions: 'Three rounds. Rest 90s between rounds.',
        movements: [
          '30s Rope or Bar Hang (as heavy as you can hold)',
          '40m Farmers Carry (heavy)',
          '10 Single Arm Dumbbell Row each side',
          '30s Hollow Hold',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Wrist Flexor Stretch each side',
          '60s Lat Stretch each side',
          '60s Doorframe Chest Stretch each side',
        ],
      },
    ],
    equipment: ['pull-up bar', 'dumbbell'],
  },
  {
    id: 'sw_20',
    title: 'Box Jump Mechanics',
    description:
      'Box jumps break more shins than any other movement in the gym, and almost always because of a rushed rebound at rep 40. This session trains the landing first, then the height, then the cycle rate.',
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Skill', 'Lower Body', 'Gymnastics'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '60s Ankle Rock each side',
          '20 Calf Raises',
          '10 Bodyweight Squats',
          '10 Low Box Step Ups',
        ],
      },
      {
        name: 'Block 1: Landing Mechanics',
        instructions:
          'Land soft, land quiet, land with the hips back and knees tracking over the toes. If you can hear the landing from across the gym, lower the box. Rest 60s between sets.',
        highlightInstructions: 'Quiet landings only. Noise means impact.',
        movements: [
          '3 x 5 Squat to Landing Position (jump, land, freeze for 2s)',
          '3 x 5 Depth Drops (step off a low box, absorb and hold the landing)',
          '3 x 5 Broad Jumps (land and hold, no stumble)',
        ],
      },
      {
        name: 'Block 2: Height Ladder',
        instructions:
          'Singles only, stepping down between every rep. Add height each set until you find your limit, then stop. There is no prize for a shin full of stitches.',
        highlightInstructions: 'Step down between every rep in this block.',
        movements: [
          'Set 1: 5 Box Jumps at a comfortable height',
          'Set 2: 4 Box Jumps, add height',
          'Set 3: 3 Box Jumps, add height',
          'Set 4: 2 Box Jumps, add height',
          'Set 5: 1 Box Jump at max height (record it)',
        ],
      },
      {
        name: 'Block 3: Cycle Rate',
        instructions:
          'Drop the box to a comfortable competition height. This block trains the rebound, which is where speed comes from in a workout. Rest 90s between sets.',
        movements: [
          '4 x 8 Rebound Box Jumps (land, absorb, immediately jump again)',
          '3 x 8 Box Jump Overs (lateral, step or jump down)',
        ],
      },
      {
        name: 'Block 4: Accessory',
        instructions:
          'Three rounds. Ankles and calves take the load in this movement and deserve the work. Rest 60s between rounds.',
        movements: [
          '20 Calf Raises (slow lower)',
          '10 Single Leg Box Step Ups each leg',
          '10 Jump Squats (soft landings)',
          '30s Wall Sit',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Calf Stretch each side',
          '60s Ankle Stretch each side',
          '60s Hip Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['box'],
  },
  {
    id: 'sw_21',
    title: "Devil's Press Efficiency",
    description:
      "The devil's press is a burpee and a double dumbbell snatch welded together, and most people fight it. Swing the dumbbells, do not press them. This session breaks the movement into halves before putting it back under a clock.",
    category: 'Skill',
    difficulty: 'Intermediate',
    estimatedTime: 35,
    tags: ['Skill', 'Full Body', 'Strength'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '2 mins easy cardio',
          '10 Hip Hinges',
          '10 Light DB Deadlifts',
          '5 Slow Burpees',
        ],
      },
      {
        name: 'Block 1: The Two Halves',
        instructions:
          'Train each half separately with light dumbbells. The snatch half is a hinge and a hip snap, not a shoulder press. Rest 60s between sets.',
        highlightInstructions: 'Swing the dumbbells. Do not muscle them up.',
        movements: [
          '3 x 8 Double DB Deadlift to Hip Snap (light, feel the swing)',
          '3 x 6 Double DB Snatch (from the floor, one continuous movement)',
          '3 x 6 Burpee to Dumbbells (chest to floor, jump feet outside the DBs)',
        ],
      },
      {
        name: 'Block 2: Full Movement, Slow',
        instructions:
          'Put it together at a light load. Chest to the floor, feet outside the dumbbells, stand and swing straight overhead in one movement. Rest 90s between sets.',
        movements: [
          "4 x 5 Devil's Press (light, full reset between reps)",
          "3 x 5 Devil's Press (moderate, unbroken)",
        ],
      },
      {
        name: 'Block 3: EMOM 10',
        instructions:
          'Every minute on the minute, 5 devil press at a moderate weight. The goal is the same movement pattern on rep 50 as on rep 1. Rest the remainder of each minute.',
        highlightInstructions: 'Same technique on the last rep as the first.',
        movements: ["5 Devil's Press"],
      },
      {
        name: 'Block 4: Accessory',
        instructions: 'Three rounds. Rest 60s between rounds.',
        movements: [
          '10 Single Arm DB Snatch each side',
          '12 DB Romanian Deadlifts',
          '30s DB Overhead Hold each side',
          '30s Plank',
        ],
      },
      {
        name: 'Cooldown',
        movements: [
          '60s Lat Stretch each side',
          '60s Hip Flexor Stretch each side',
          '60s Standing Forward Fold',
        ],
      },
    ],
    equipment: ['dumbbell'],
  },
  {
    id: 'sw_22',
    title: 'Kettlebell Swing Mechanics',
    description:
      'The swing is a hinge, not a squat, and the bell floats because your hips threw it there. If your shoulders are burning, you are lifting it rather than swinging it. This session fixes the hinge, then builds density.',
    category: 'Skill',
    difficulty: 'Beginner',
    estimatedTime: 35,
    tags: ['Skill', 'Full Body', 'Strength'],
    isPremium: true,
    allowedRoles: ['coach'],
    blocks: [
      {
        name: 'Warmup',
        mobilityFlow: 'r_15',
        highlightInstructions: 'Into:',
        movements: [
          '10 Cat Cows',
          '10 Glute Bridges',
          '10 Bodyweight Good Mornings',
          '10 Light KB Deadlifts',
        ],
      },
      {
        name: 'Block 1: The Hinge',
        instructions:
          'Hips back, not down. A dowel or PVC along the spine should stay in contact with the head, upper back and tailbone throughout. Rest 45s between sets.',
        highlightInstructions:
          'Hips travel back and forward. The bell does not get lifted.',
        movements: [
          '3 x 10 Dowel Hip Hinges (three points of contact maintained)',
          '3 x 10 KB Deadlifts (light, flat back)',
          '3 x 10 Hip Snaps (stand tall, snap the glutes hard)',
        ],
      },
      {
        name: 'Block 2: Building the Swing',
        instructions:
          'The hike pass sets the whole swing up. Bell goes back high between the legs like a rugby pass, then the hips fire. Rest 60s between sets.',
        movements: [
          '4 x 8 Hike Pass (hike the bell back, catch it, stand, no swing)',
          '4 x 8 Dead Stop Swings (one rep at a time from the floor)',
          '4 x 10 Russian Swings (bell to chest height, arms relaxed)',
        ],
      },
      {
        name: 'Block 3: Density',
        instructions:
          'EMOM 10 at a working weight. Every minute, 15 swings. If the back rounds or the shoulders start doing the work, drop the reps not the bell - and if that does not fix it, drop the bell too.',
        highlightInstructions: 'Drop the reps, not the bell.',
        movements: ['15 Kettlebell Swings'],
      },
      {
        name: 'Block 4: Posterior Chain Accessory',
        instructions: 'Three rounds. Rest 60s between rounds.',
        movements: [
          '12 Romanian Deadlifts',
          '15 Glute Bridges (2s squeeze at the top)',
          '10 Single Leg RDL each side',
          '30s Hollow Hold',
        ],
      },
      {
        name: 'Cooldown',
        mobilityFlow: 'r_06',
        mobilityFlowCopy: 'Hip Flow',
        highlightInstructions: 'Or:',
        movements: [
          "60s Child's Pose",
          '60s Standing Forward Fold',
          '60s Hip Flexor Stretch each side',
        ],
      },
    ],
    equipment: ['kettlebell', 'dumbbell'],
  },
];
