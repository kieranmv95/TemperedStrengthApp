import type {
  Program,
  WorkoutBlockCooldown,
  WorkoutBlockWarmup,
} from '@/src/types/program';

// ─── Warm-Ups ────────────────────────────────────────────────────────────────
// Three variants. Each matched to the session stimulus.

const warmup1: WorkoutBlockWarmup = {
  id: 'wu-1',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '4–5 minutes. Hinge and posterior chain activation. Session one is hip dominant - arrive ready to hinge.',
  description: [
    '60s brisk walk or easy cardio - get the blood moving before anything else',
    '5 KB halos each direction - slow circles around the head, core locked, shoulders loose. Use a light kettlebell or a plate.',
    '10 KB goblet squats (or bodyweight squats) - hold by the horns at chest height, elbows inside your knees at the bottom. Find the hinge pattern before the session begins.',
    '10 glute bridges - slow up, squeeze and hold for a full second at the top, lower with control. This activates the posterior chain you are about to load.',
    '10 push-ups - elevated if needed. Chest to the surface, full extension. Warming the pressing muscles before the pulls.',
  ],
};

const warmup2: WorkoutBlockWarmup = {
  id: 'wu-2',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '4–5 minutes. Shoulder and upper back preparation. Session two involves overhead pressing and KB skill work - cold shoulders do not press well.',
  description: [
    '60s brisk walk or easy cardio',
    '5 KB halos each direction - slow and deliberate. The halo is both warm-up and skill rehearsal for the session ahead. Feel each position.',
    '10 push-ups - full range, controlled descent. Warming the chest and shoulders before the overhead work.',
    '10 bodyweight squats - upright torso, drive up with purpose. Keeps the lower body warm while the upper body is the focus.',
    '10 glute bridges - posterior chain activation. Grounds you before the pressing begins.',
  ],
};

const warmup3: WorkoutBlockWarmup = {
  id: 'wu-3',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '5 minutes. Hip, hamstring, and balance preparation. Session three includes the Turkish Get-Up and heavy lower body work - this warm-up earns its length.',
  description: [
    '60s brisk walk or easy cardio',
    '5 KB halos each direction - also prepares the shoulder for the Get-Up overhead position.',
    '10 glute bridges - slow up, 2-second hold at the top. This is the primary posterior chain pattern of the session.',
    '10 bodyweight squats - slow descent, pause at the bottom. Prepare the hips and knees for what follows.',
    '10 reverse lunges each side - tall torso, light touch of the back knee. Activates the hip flexors and glutes before the single-leg work.',
    '5 slow inchworms - open the hamstrings. The Romanian deadlift and single-leg deadlift will expose any tightness you carry in.',
  ],
};

// ─── Cooldown Blocks ─────────────────────────────────────────────────────────

const cooldown1: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Take 4–5 minutes here. Session one loaded your posterior chain hard - hips, hamstrings, and upper back all need attention. Walk for 90 seconds before you stop moving entirely. Stopping abruptly after a session like this is hard on the body. Once your breathing settles, work through the stretches below.',
  description: [
    '90s easy walk - slow it right down. Let your heart rate settle before you move to the floor.',
    'Hip flexor lunge stretch - step into a low lunge, lower your back knee to the floor and shift your hips gently forward. 40s each side. You will feel this at the front of the hip after all the hinge work.',
    'Hamstring stretch - stand tall, hinge forward with soft knees and let your hands reach toward the floor. Hold 30s. If the floor is too far, rest your hands on your shins.',
    'Cross-body shoulder stretch - bring one arm across your chest and use the other to pull it gently closer. Hold 30s each side. The rows and swings load the upper back and rear delts - this releases them.',
    'Chest opener - clasp your hands behind your back, squeeze your shoulder blades together and lift your arms slightly. Hold 20–30s. Breathe into your chest.',
  ],
};

const cooldown2: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Your shoulders, chest, and upper back have done serious work today. The pressing and carrying load the anterior shoulder, the rows load the posterior. Both need unwinding. Start with 90 seconds of easy walking, then work through the stretches below slowly. The thoracic rotation at the end is the most important one - do not skip it.',
  description: [
    '90s easy walk - keep moving before you sit or lie down.',
    'Cross-body shoulder stretch - one arm across the chest, opposite hand pulling it close. 40s each side. Focus on the back of the shoulder which takes the load from all the pulling.',
    'Chest opener - hands clasped behind your back, shoulder blades together, chest lifted. Hold 30s. Breathe in deeply and let the chest expand. This counteracts the pressing posture.',
    'Neck side stretch - sit or stand tall, drop one ear toward your shoulder and hold for 25s each side. No forcing. Let gravity do the work. Carrying and pressing both load the traps and neck.',
    'Thoracic rotation - sit on the floor cross-legged, place one hand behind your head and rotate your upper back slowly to one side. 6 slow reps each direction. This undoes the compression that builds from a full session of overhead and horizontal pressing.',
  ],
};

const cooldown3: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    'Session three is the hardest on the lower body. The Turkish Get-Up also loads the shoulder significantly. Give yourself a full 5 minutes here. Walk for at least 90 seconds before you do anything else. The hip flexor and glute work below will directly affect how you move tomorrow.',
  description: [
    '90s easy walk - longer than usual. The lower body work today earns it. Let your heart rate come down fully.',
    'Hip flexor lunge stretch - low lunge, back knee on the floor, hips shifted forward. 45s each side. After split squats and single-leg deadlifts this will feel tighter than expected. Breathe into it.',
    'Glute stretch - lie on your back, cross one ankle over the opposite knee and draw both legs toward your chest. Hold 40s each side. Figure-four position. This is the best thing you can do after heavy lower body work.',
    'Hamstring stretch - sit on the floor with both legs extended, hinge forward from the hips and reach toward your feet. 45s. Keep your back as flat as you can.',
    'Calf stretch - stand facing a wall, one foot back, heel pressed flat into the floor. Lean gently into the wall. 30s each side. The step-ups and calf raises leave the calves loaded and shortened.',
    'Cross-body shoulder stretch - 30s each side. The Get-Up loads the shoulder overhead for an extended period. This closes the session properly.',
  ],
};

// ─── Programme ───────────────────────────────────────────────────────────────

export const bootcamp_kb_db_pro: Program = {
  id: 'bootcamp_kb_db_pro',
  isPro: true,
  name: 'KB + DB Bootcamp',
  description:
    'Six weeks of kettlebell and dumbbell bootcamp training. Three sessions per week, each with a clear identity. Session one owns the hinge. Session two builds KB skill and upper body strength. Session three develops lower body and the Turkish Get-Up. Every two weeks the load steps up.',
  bodyChangesSummary:
    'You will build full-body strength and feel fitter fast. Expect improved stamina, a stronger core, and more shape through your legs, glutes, and shoulders as you master the basics and progress the load.',
  categories: ['conditioning', 'functional'],
  goals: ['cutting', 'leaner', 'endurance', 'athletic', 'stronger'],
  difficulty: 'beginner',
  daysSplit: ['tue', 'thu', 'sat'],
  averageSessionDuration: '45m',
  workouts: [
    // =========================================================================
    // WEEKS 1–2 - Foundation
    // Learn the movements. Moderate loads. More guidance in notes.
    // 4 rounds on main circuits. Shorter finishers. Build the pattern.
    // =========================================================================

    // ─── W1 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 1,
      label: 'Session 1 (Week 1)',
      description:
        'Full body with a swing and pull focus. The kettlebell carries this session. Your first job is to own the hinge - everything else follows from that.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 4 Rounds',
          instructions:
            'Four rounds. Rest as needed between movements. This week is about learning the patterns - do not chase load.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '12 reps',
              notes:
                'Hinge back hard, then snap your hips forward and let the bell float to shoulder height. The power comes from the hips, not your arms. If the bell feels heavy in your hands, you are pulling with your arms. Stop before your form slips.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '10 reps',
              notes:
                'Hold by the horns at chest height. Elbows inside your knees at the bottom. Drive through your heels to stand. Keep your torso upright throughout.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '10 reps/side',
              notes:
                'Pull to your hip and pause at the top. Elbow close to your body. Control the lower. Do not drop it.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '8 reps',
              notes:
                'Keep your body rigid from heels to shoulders. Pull your chest all the way to the bar. Lower slowly. If this is too easy, raise your feet.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Tabata Finisher',
          instructions:
            '8 rounds, 20s work, 10s rest. Bodyweight burn to close the session. Keep form sharp and scale as needed.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 21, // Bodyweight Squats
              prescription: '20s on / 10s off',
              notes: 'Full range. Consistent pace. Do not sprint and crash.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '20s on / 10s off',
              notes: 'Chest to floor. Scale to knees if needed. Keep moving.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W1 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 3,
      label: 'Session 2 (Week 1)',
      description:
        'KB skill day and upper body. You will learn the clean-to-press sequence this week. It is the backbone of kettlebell training. Take your time with the skill block.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 4 Rounds',
          instructions:
            'Skill movements only. Quality reps, not conditioned reps. Rest fully between rounds. Five reps each side this week.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '5 reps/side',
              notes:
                'Hinge, pull, and guide the bell into the rack position at your shoulder. Not your wrist. The bell should land softly. Practise slow before going fast. If it crashes into your forearm, the arc of the bell needs to change.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '5 reps/side',
              notes:
                'Bell in rack, brace your core, press straight up to lockout. Your body should be rigid. No side-lean or hip shift. Lower slowly back to rack. This is a strict press.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 10 Minutes',
          instructions:
            'Set a steady pace. Push and pull balanced. Accumulate quality rounds.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 27, // DB Shoulder Press
              prescription: '8 reps',
              notes:
                'No leg drive. Strict overhead press. Control the press and the lower equally.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '8 reps',
              notes:
                'Horizontal push to complement the overhead work. Lower with control, press with confidence.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '10 reps/side',
              notes:
                'Pull to your hip, pause at the top. No swinging. This is the pull balance to the pressing above.',
            },
            {
              id: 'm4',
              exerciseId: 56, // Reverse Flyes
              prescription: '12 reps',
              notes:
                'Hinge forward slightly, lead with your elbows, light weight, full squeeze at the top. Shoulder health work. Do not skip it.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Carry + Core (For Time)',
          instructions:
            'Complete the work with strict form. Short breaks are fine. Quality over speed.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '3 x 20m walks',
              notes:
                'Pick heavy. Stand tall, shoulders packed down and back, brace your core. Rest 20s between each walk.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '25 reps',
              notes:
                'Slow and controlled. Exhale as you come up. Break into sets if needed.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W1 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 5,
      label: 'Session 3 (Week 1)',
      description:
        'Lower body and the KB Turkish Get-Up. The get-up is the most technical movement in the programme. It gets its own block. Take your time and earn it.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 3 Rounds',
          instructions:
            'This is a skill block, not a conditioning block. Move slowly and deliberately through every position. One rep takes 30–60 seconds when done correctly. That is intentional. Use a light weight until the pattern is solid.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '2 reps/side',
              notes:
                'Keep your eyes on the bell the entire time. Move through each position in sequence: lying, elbow, hand, hip up, tall kneeling, standing. Then reverse every step back to the floor. Two reps each side this week. If you lose the bell, go lighter.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 12 Minutes',
          instructions:
            'Every minute: complete the work, then rest the remainder. Keep loads manageable. Quality reps, not rushed ones.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '10 reps',
              notes:
                'Hips back, soft knees, feel the hamstring stretch at the bottom. Stand tall by squeezing your glutes at the top.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '8 reps/side',
              notes:
                'Use a wall or rack for balance if needed. Slow on the way down - 2 to 3 seconds. Drive through the front heel to stand.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '6 reps/side',
              notes:
                'Hinge forward on one leg until your torso is near parallel, then return. Light touch on a wall if balance is the limiter. Keep your hips square throughout.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '14 reps',
              notes:
                'Lean back slightly, feet off the floor if you can. Rotate from the ribs, not just your arms. Keep your chest tall.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Legs + Lungs AMRAP - 6 Minutes',
          instructions:
            'Steady pace. Keep breathing and keep moving for the full time.',
          minutes: 6,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '8 reps/side',
              notes:
                'Drive through the heel of the working leg. Light dumbbells or bodyweight. This is conditioning, not a strength test.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '8 reps',
              notes:
                'Squat deep, then drive the dumbbells overhead as you stand. One fluid movement. Use a weight you can keep moving with for all 8 reps.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '15 reps',
              notes: 'Slow on the way down. Full range. Pause at the top.',
            },
          ],
        },
        cooldown3,
      ],
    },

    // ─── W2 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 8,
      label: 'Session 1 (Week 2)',
      description:
        'Full body, swing and pull focus. Same structure as week one. Go heavier on the swing and the row. You know the patterns now.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 4 Rounds',
          instructions:
            'Four rounds. Heavier than week one where possible. Same quality standards.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '15 reps',
              notes:
                'Three more reps than week one. If the pattern felt solid last week, add weight. The power is in the hips.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '12 reps',
              notes:
                'Two extra reps. Load up if week one felt manageable. Elbows inside knees at the bottom.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '12 reps/side',
              notes:
                'Two extra reps. Heavier if the form held last week. Pause at the top each rep.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '10 reps',
              notes:
                'Two extra reps. Raise your feet if bodyweight is not enough.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Tabata Finisher',
          instructions:
            '8 rounds, 20s work, 10s rest. Push harder than week one.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 21, // Bodyweight Squats
              prescription: '20s on / 10s off',
              notes: 'More reps than week one. Same depth and quality.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '20s on / 10s off',
              notes: 'Push the rep count. Scale to knees only if form breaks.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W2 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 10,
      label: 'Session 2 (Week 2)',
      description:
        'KB skill and upper body. The clean-to-press should feel more familiar this week. Focus on the rack position and the lockout.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 4 Rounds',
          instructions:
            'Same structure as week one. The bell should land softer this week. Five reps each side.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '5 reps/side',
              notes:
                'Focus on the rack position. The bell should sit at your shoulder with your elbow tucked. If it is crashing into your forearm, the pull needs to change.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '5 reps/side',
              notes:
                'Focus on the lockout this week. Full extension overhead, elbow locked, wrist neutral. Lower slowly back to rack.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 12 Minutes',
          instructions:
            'Two more minutes than week one. Same movements. Find a pace you can sustain.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              exerciseId: 27, // DB Shoulder Press
              prescription: '10 reps',
              notes: 'Two extra reps. Heavier if week one felt manageable.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '10 reps',
              notes: 'Two extra reps. Control the descent.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '10 reps/side',
              notes: 'Pause at the top. No swinging.',
            },
            {
              id: 'm4',
              exerciseId: 56, // Reverse Flyes
              prescription: '15 reps',
              notes: 'Three extra reps. Light weight, full squeeze at the top.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Carry + Core (For Time)',
          instructions:
            'Complete the work with strict form. Heavier carries than week one.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '3 x 20m walks',
              notes:
                'Heavier than week one if last week felt manageable. Posture tall throughout.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '30 reps',
              notes: 'Five more reps than week one. Same quality.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W2 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 12,
      label: 'Session 3 (Week 2)',
      description:
        'Lower body and the KB Turkish Get-Up. The get-up should feel more available this week. Focus on finding each position rather than rushing between them.',
      intensity: 7,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 3 Rounds',
          instructions:
            'Three rounds. Same weight as week one. The focus this week is on finding each position more cleanly.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '2 reps/side',
              notes:
                'Focus on the transition from elbow to hand this week. That is where most people rush. Pause at each position before moving to the next.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 12 Minutes',
          instructions:
            'Every minute: complete the work, then rest the remainder. Slightly heavier than week one where possible.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '12 reps',
              notes:
                'Two extra reps. Heavier if week one felt solid. Hinge clean and squeeze at the top.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '10 reps/side',
              notes:
                'Two extra reps. Slow descent. Drive through the front heel.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes:
                'Two extra reps. Reduce wall contact if balance has improved.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '16 reps',
              notes: 'Two extra reps. Rotate from the ribs.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Legs + Lungs AMRAP - 7 Minutes',
          instructions:
            'One extra minute. Same movements. Find a rhythm and hold it.',
          minutes: 7,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '8 reps/side',
              notes:
                'Light dumbbells if last week was bodyweight. Drive through the heel.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '8 reps',
              notes:
                'Same load as week one if the pattern felt solid. Squat and press as one movement.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '15 reps',
              notes: 'Full range. Pause at the top.',
            },
          ],
        },
        cooldown3,
      ],
    },

    // =========================================================================
    // WEEKS 3–4 - Development
    // Volume steps up. 5 rounds on main circuits. Finishers get longer.
    // KB skill work increases. New movement variation introduced per session.
    // Less hand-holding in the notes.
    // =========================================================================

    // ─── W3 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 15,
      label: 'Session 1 (Week 3)',
      description:
        'Full body, swing and pull focus. Five rounds this week. The swing rep count goes up. New movement added to the circuit.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 5 Rounds',
          instructions:
            'Five rounds. One more than weeks 1 and 2. Load up where you can.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '18 reps',
              notes:
                'Heavier bell this week if the pattern is solid. Hip snap, bell floats to shoulder height.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '12 reps',
              notes:
                'Load up. Elbows inside knees. Drive hard out of the hole.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '12 reps/side',
              notes: 'Heaviest row of the programme so far. Pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '10 reps',
              notes: 'Feet raised if bodyweight is not enough. Chest to bar.',
            },
            {
              id: 'm5',
              exerciseId: 101, // DB Renegade Row
              prescription: '6 reps/side',
              notes:
                'New this week. Push-up position with a dumbbell in each hand. Row one dumbbell to your hip while the other arm stays planted. Hips level. No rotation.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Swing Chipper (For Time)',
          instructions:
            'Complete all reps as fast as possible with good form. New finisher format this week.',
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '30 reps',
              notes: 'Break as needed. Hip drive every rep.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '20 reps',
              notes: 'Chest to floor. Keep moving.',
            },
            {
              id: 'm3',
              exerciseId: 21, // Bodyweight Squats
              prescription: '30 reps',
              notes: 'Full depth. Drive up hard.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W3 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 17,
      label: 'Session 2 (Week 3)',
      description:
        'KB skill and upper body. The clean-to-press goes to 6 reps each side this week. The AMRAP runs for 14 minutes. Arnold Press replaces strict DB Shoulder Press.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 4 Rounds',
          instructions:
            'Six reps each side this week. The extra rep demands more consistency in the rack position.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '6 reps/side',
              notes:
                'The bell should land consistently at the shoulder every rep. If it drifts, slow down.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '6 reps/side',
              notes:
                'Full lockout every rep. Lower slowly back to rack. No side-lean.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 14 Minutes',
          instructions:
            'Two more minutes than week two. Arnold Press replaces strict shoulder press this week.',
          minutes: 14,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '10 reps',
              notes:
                'Start with palms facing you at shoulder height. Rotate outward as you press overhead. Full rotation, full range.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '10 reps',
              notes: 'Controlled descent. Press with confidence.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '12 reps/side',
              notes:
                'Heavier than week two. Pull to the hip, pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 56, // Reverse Flyes
              prescription: '15 reps',
              notes: 'Light weight, full squeeze at the top. Shoulder health.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Carry + Core (For Time)',
          instructions:
            'Complete with strict form. Heavier carry than week two.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '4 x 20m walks',
              notes:
                'One extra walk. Heaviest carry of the programme so far. Posture tall.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '30 reps',
              notes: 'Same reps as week two. Slower and more controlled.',
            },
            {
              id: 'm3',
              exerciseId: 49, // Russian Twists
              prescription: '20 reps',
              notes:
                'New addition this week. Light dumbbell. Rotate from the ribs.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W3 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 19,
      label: 'Session 3 (Week 3)',
      description:
        'Lower body and the KB Turkish Get-Up. Get-up reps increase to 3 each side. EMOM goes to 16 minutes. Hip thrust added to the finisher.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 3 Rounds',
          instructions:
            'Three reps each side this week. You have two weeks of pattern work behind you. Move with more confidence but keep the same deliberate pace.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '3 reps/side',
              notes:
                'One extra rep each side. Consider adding weight if the two-rep version felt controlled last week. Eyes on the bell throughout.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 16 Minutes',
          instructions:
            'Four more minutes than weeks one and two. Five movements rotating. Loads heavier than the foundation block.',
          minutes: 16,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '12 reps',
              notes: 'Heavier than week two. Hinge clean. Squeeze at the top.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '10 reps/side',
              notes: 'Slow descent. Drive through the front heel.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '8 reps/side',
              notes:
                'No wall contact this week if balance has developed. Hips square throughout.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '20 reps',
              notes: 'Light dumbbell. Rotate from the ribs.',
            },
            {
              id: 'm5',
              exerciseId: 41, // Hip Thrust
              prescription: '12 reps',
              notes:
                'New this week. Sit with your upper back against a bench, bar or dumbbell over your hips. Drive through your heels and squeeze your glutes hard at the top. Pause for a beat.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Legs + Lungs AMRAP - 8 Minutes',
          instructions: 'One extra minute. Heavier step-ups. Same pace.',
          minutes: 8,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '10 reps/side',
              notes: 'Heavier dumbbells than week two. Drive through the heel.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Two extra reps. Squat and press as one movement.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '20 reps',
              notes: 'Full range. Pause at the top.',
            },
          ],
        },
        cooldown3,
      ],
    },

    // ─── W4 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 22,
      label: 'Session 1 (Week 4)',
      description:
        'Full body, swing and pull focus. Five rounds. Heavier across the board. The renegade row stays in the circuit.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 5 Rounds',
          instructions:
            'Five rounds. Heaviest loads of the development block. Same quality standards.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '20 reps',
              notes:
                'Heaviest swing of the programme so far. Hip snap, controlled float.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '15 reps',
              notes: 'Three extra reps. Load up. Drive hard.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '15 reps/side',
              notes:
                'Heaviest row of the programme. Pause at the top every rep.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '12 reps',
              notes: 'Feet raised. Chest to bar. Lower slowly.',
            },
            {
              id: 'm5',
              exerciseId: 101, // DB Renegade Row
              prescription: '8 reps/side',
              notes: 'Two extra reps. Hips level. No rotation.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Swing Chipper (For Time)',
          instructions:
            'More reps than week three. Time yourself and aim to beat it next session.',
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '40 reps',
              notes: 'Ten more reps than week three. Break as needed.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '25 reps',
              notes: 'Five more reps. Keep moving.',
            },
            {
              id: 'm3',
              exerciseId: 21, // Bodyweight Squats
              prescription: '40 reps',
              notes: 'Ten more reps. Full depth every rep.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W4 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 24,
      label: 'Session 2 (Week 4)',
      description:
        'KB skill and upper body. Six reps each side on the clean-to-press. AMRAP runs for 16 minutes. Hammer curls added to the circuit.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 5 Rounds',
          instructions:
            'Five rounds this week. One more than the foundation block. Six reps each side.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '6 reps/side',
              notes:
                'Consistent rack position every rep. If the bell drifts, slow down and fix it.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '6 reps/side',
              notes: 'Full lockout. Rigid body. Lower with control.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 16 Minutes',
          instructions:
            'Two more minutes than week three. Hammer curls added to the circuit.',
          minutes: 16,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '10 reps',
              notes: 'Full rotation, full range. No rushing.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes: 'Two extra reps. Controlled descent.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '12 reps/side',
              notes: 'Pause at the top. No swinging.',
            },
            {
              id: 'm4',
              exerciseId: 51, // Hammer Curls
              prescription: '12 reps',
              notes:
                'New this week. Neutral grip. No swinging. Slow on the way down.',
            },
            {
              id: 'm5',
              exerciseId: 56, // Reverse Flyes
              prescription: '15 reps',
              notes: 'Shoulder health. Light weight, full squeeze.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Carry + Core (For Time)',
          instructions:
            'Complete with strict form. Heaviest carry of the development block.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '4 x 20m walks',
              notes: 'Heavier than week three. Posture tall throughout.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '35 reps',
              notes: 'Five more than week three. Same quality.',
            },
            {
              id: 'm3',
              exerciseId: 49, // Russian Twists
              prescription: '24 reps',
              notes: 'Four more reps. Light dumbbell. Rotate from the ribs.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W4 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 26,
      label: 'Session 3 (Week 4)',
      description:
        'Lower body and the KB Turkish Get-Up. Three reps each side on the get-up. EMOM stays at 16 minutes. Consider adding weight to the get-up this week.',
      intensity: 8,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 4 Rounds',
          instructions:
            'Four rounds this week. One more than week three. Same deliberate pace.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '3 reps/side',
              notes:
                'Four rounds now. If the pattern is solid, add weight. Eyes on the bell. Reverse every step back to the floor.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 16 Minutes',
          instructions:
            'Same length as week three. Heavier loads across all movements.',
          minutes: 16,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '15 reps',
              notes: 'Three extra reps. Heaviest RDL of the development block.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '10 reps/side',
              notes: 'Heavier than week three. Slow descent.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '10 reps/side',
              notes: 'Two extra reps. Hips square. No wall contact.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '20 reps',
              notes: 'Light dumbbell. Rotate from the ribs.',
            },
            {
              id: 'm5',
              exerciseId: 41, // Hip Thrust
              prescription: '15 reps',
              notes:
                'Three extra reps. Squeeze and pause at the top every rep.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Legs + Lungs AMRAP - 8 Minutes',
          instructions:
            'Same length as week three. Heavier step-ups and thrusters.',
          minutes: 8,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '10 reps/side',
              notes: 'Heavier than week three. Drive through the heel.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes:
                'Heaviest thruster of the development block. Squat and press.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '20 reps',
              notes: 'Full range. Pause at the top.',
            },
          ],
        },
        cooldown3,
      ],
    },

    // =========================================================================
    // WEEKS 5–6 - Peak
    // Heaviest loads. 6 rounds on main circuits. Longest finishers.
    // Get-Up reps at their highest. Notes expect competence.
    // =========================================================================

    // ─── W5 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 29,
      label: 'Session 1 (Week 5)',
      description:
        'Full body, swing and pull focus. Six rounds. Heaviest loads of the programme. The swing should feel powerful by now.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 6 Rounds',
          instructions:
            'Six rounds. One more than the development block. This is the peak. Load heavy and hold form.',
          rounds: 6,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '20 reps',
              notes:
                'Heaviest bell of the programme. Hip snap. The bell floats.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '15 reps',
              notes:
                'Heaviest goblet squat of the programme. Drive hard out of the hole.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '15 reps/side',
              notes: 'Heaviest row of the programme. Pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '12 reps',
              notes: 'Feet raised. Chest to bar every rep.',
            },
            {
              id: 'm5',
              exerciseId: 101, // DB Renegade Row
              prescription: '8 reps/side',
              notes:
                'Heaviest renegade row of the programme. Hips level. No rotation.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Peak Swing Chipper (For Time)',
          instructions: 'Highest rep count of the programme. Time yourself.',
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '50 reps',
              notes: 'Break as needed. Hip drive every rep.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '30 reps',
              notes: 'Keep moving. Scale to knees only if form breaks.',
            },
            {
              id: 'm3',
              exerciseId: 21, // Bodyweight Squats
              prescription: '50 reps',
              notes: 'Full depth. This is the finish line.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W5 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 31,
      label: 'Session 2 (Week 5)',
      description:
        'KB skill and upper body. Seven reps each side on the clean-to-press. The AMRAP runs for 18 minutes. Heaviest upper body session of the programme.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 5 Rounds',
          instructions:
            'Seven reps each side. The most reps of the programme. Consistency matters more than ever.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '7 reps/side',
              notes:
                'Consistent rack position every rep. Heavier bell if the pattern is solid.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '7 reps/side',
              notes:
                'Full lockout. Rigid body. Lower slowly. This is the hardest pressing set of the programme.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 18 Minutes',
          instructions:
            'Two more minutes than week four. Heaviest loads of the programme.',
          minutes: 18,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '12 reps',
              notes: 'Two extra reps. Full rotation, full range.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes: 'Heaviest bench of the programme. Controlled descent.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '15 reps/side',
              notes: 'Heaviest row of the AMRAP block. Pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 51, // Hammer Curls
              prescription: '12 reps',
              notes: 'Neutral grip. No swinging.',
            },
            {
              id: 'm5',
              exerciseId: 56, // Reverse Flyes
              prescription: '15 reps',
              notes: 'Shoulder health. Light weight, full squeeze.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Carry + Core (For Time)',
          instructions:
            'Heaviest carry of the programme. Complete with strict form.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '5 x 20m walks',
              notes:
                'One extra walk. Heaviest carry of the programme. Posture tall.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '35 reps',
              notes: 'Same reps as week four. Slower.',
            },
            {
              id: 'm3',
              exerciseId: 49, // Russian Twists
              prescription: '30 reps',
              notes: 'Six more reps. Light dumbbell. Rotate from the ribs.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W5 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 33,
      label: 'Session 3 (Week 5)',
      description:
        'Lower body and the KB Turkish Get-Up. Four reps each side on the get-up. EMOM goes to 20 minutes. This is the longest lower body session of the programme.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 4 Rounds',
          instructions:
            'Four reps each side. The most get-up work of the programme. Weight should be heavier than the foundation block.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '4 reps/side',
              notes:
                'Four reps each side. Heavier than week four if the pattern is solid. Eyes on the bell. Every position earns the next.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 20 Minutes',
          instructions:
            'Four more minutes than the development block. Five movements. Heaviest lower body loads of the programme.',
          minutes: 20,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '15 reps',
              notes:
                'Heaviest RDL of the programme. Hinge clean. Squeeze at the top.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '12 reps/side',
              notes:
                'Two extra reps. Slow descent. Drive through the front heel.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '10 reps/side',
              notes:
                'Heaviest single-leg deadlift of the programme. Hips square.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '24 reps',
              notes: 'Light dumbbell. Rotate from the ribs.',
            },
            {
              id: 'm5',
              exerciseId: 41, // Hip Thrust
              prescription: '15 reps',
              notes:
                'Heaviest hip thrust of the programme. Squeeze and pause at the top.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Legs + Lungs AMRAP - 10 Minutes',
          instructions:
            'Two more minutes than the development block. Heaviest loads. This is the peak lower body finisher.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '12 reps/side',
              notes:
                'Heaviest step-up of the programme. Drive through the heel.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes: 'Heaviest thruster of the programme. Squat and press.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '25 reps',
              notes: 'Five more reps. Full range. Pause at the top.',
            },
          ],
        },
        cooldown3,
      ],
    },

    // ─── W6 Session 1 - Swing + Pull ─────────────────────────────────────────
    {
      dayIndex: 36,
      label: 'Session 1 (Week 6)',
      description:
        'Final swing and pull session. Six rounds. Everything you have. The swing should feel completely different to week one.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup1,
        {
          id: 'main',
          type: 'rounds',
          title: 'Swing + Pull Circuit - 6 Rounds',
          instructions:
            'Six rounds. Final version of this circuit. Load as heavy as you can move well.',
          rounds: 6,
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '20 reps',
              notes:
                'Final swing session of the programme. Heaviest bell. Hip snap. Own it.',
            },
            {
              id: 'm2',
              exerciseId: 98, // KB Goblet Squat
              prescription: '15 reps',
              notes: 'Heaviest goblet squat of the programme. Drive hard.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '15 reps/side',
              notes:
                'Final row of the programme. Heaviest load. Pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 9, // Inverted Row
              prescription: '12 reps',
              notes: 'Feet raised. Chest to bar.',
            },
            {
              id: 'm5',
              exerciseId: 101, // DB Renegade Row
              prescription: '10 reps/side',
              notes:
                'Two extra reps. Final renegade row of the programme. Hips level.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Final Swing Chipper (For Time)',
          instructions:
            'Highest rep count of the programme. Time yourself and compare to week three.',
          movements: [
            {
              id: 'm1',
              exerciseId: 24, // KB Swing
              prescription: '60 reps',
              notes:
                'Ten more than week five. Break as needed. Hip drive every rep.',
            },
            {
              id: 'm2',
              exerciseId: 3, // Push-ups
              prescription: '30 reps',
              notes: 'Same as week five. Move faster.',
            },
            {
              id: 'm3',
              exerciseId: 21, // Bodyweight Squats
              prescription: '50 reps',
              notes: 'Full depth. Last time. Finish strong.',
            },
          ],
        },
        cooldown1,
      ],
    },

    // ─── W6 Session 2 - KB Skill + Upper Body ────────────────────────────────
    {
      dayIndex: 38,
      label: 'Session 2 (Week 6)',
      description:
        'Final KB skill and upper body session. Seven reps each side on the clean-to-press. AMRAP runs for 20 minutes. The longest upper body session of the programme.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup2,
        {
          id: 'skill',
          type: 'rounds',
          title: 'KB Skill: Clean + Press - 5 Rounds',
          instructions:
            'Final skill block. Seven reps each side. Compare how the rack position feels now versus week one.',
          rounds: 5,
          movements: [
            {
              id: 'm1',
              exerciseId: 96, // KB Clean
              prescription: '7 reps/side',
              notes:
                'Final clean of the programme. Consistent rack position every rep. The bell should land softly every time.',
            },
            {
              id: 'm2',
              exerciseId: 97, // KB Press (Single Arm)
              prescription: '7 reps/side',
              notes:
                'Final press of the programme. Full lockout. Rigid body. Lower with control.',
            },
          ],
        },
        {
          id: 'main',
          type: 'amrap',
          title: 'Upper AMRAP - 20 Minutes',
          instructions:
            'The longest AMRAP of the programme. Two more minutes than week five. Everything you have built goes into this.',
          minutes: 20,
          movements: [
            {
              id: 'm1',
              exerciseId: 43, // Arnold Press
              prescription: '12 reps',
              notes:
                'Full rotation, full range. Final Arnold press of the programme.',
            },
            {
              id: 'm2',
              exerciseId: 2, // DB Bench Press
              prescription: '12 reps',
              notes: 'Heaviest bench of the programme. Controlled descent.',
            },
            {
              id: 'm3',
              exerciseId: 8, // DB Row
              prescription: '15 reps/side',
              notes: 'Heaviest row of the programme. Pause at the top.',
            },
            {
              id: 'm4',
              exerciseId: 51, // Hammer Curls
              prescription: '15 reps',
              notes: 'Three extra reps. Neutral grip. Slow on the way down.',
            },
            {
              id: 'm5',
              exerciseId: 56, // Reverse Flyes
              prescription: '15 reps',
              notes: 'Final shoulder health set. Light weight, full squeeze.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'for_time',
          title: 'Final Carry + Core (For Time)',
          instructions:
            'The last carry and core finisher of the programme. Heaviest loads. Complete with strict form.',
          movements: [
            {
              id: 'm1',
              exerciseId: 92, // DB Farmer Carry
              prescription: '5 x 20m walks',
              notes:
                'Final carry of the programme. Heaviest load. Posture tall. Walk steady.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '40 reps',
              notes: 'Five more than week five. Controlled throughout.',
            },
            {
              id: 'm3',
              exerciseId: 49, // Russian Twists
              prescription: '30 reps',
              notes:
                'Final core rotation of the programme. Light dumbbell. Rotate from the ribs.',
            },
          ],
        },
        cooldown2,
      ],
    },

    // ─── W6 Session 3 - Lower Body + Turkish Get-Up ──────────────────────────
    {
      dayIndex: 40,
      label: 'Session 3 (Week 6)',
      description:
        'The final session of the programme. Lower body and the KB Turkish Get-Up. Four reps each side on the get-up. Twenty-minute EMOM. Compare how this feels to week one session three.',
      intensity: 9,
      format: 'v2',
      blocks: [
        warmup3,
        {
          id: 'getup',
          type: 'rounds',
          title: 'KB Turkish Get-Up - 4 Rounds',
          instructions:
            'Final get-up block. Four reps each side. Heaviest weight of the programme if the pattern is solid. This movement has been the technical centrepiece of the programme for six weeks.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 95, // KB Turkish Get-Up
              prescription: '4 reps/side',
              notes:
                'Final get-up of the programme. Heaviest bell. Eyes on the bell throughout. Move through every position with the same deliberate pace as week one. The weight is heavier. The standard is the same.',
            },
          ],
        },
        {
          id: 'main',
          type: 'emom',
          title: 'Lower EMOM - 20 Minutes',
          instructions:
            'Final lower EMOM of the programme. Heaviest loads. Same quality standards as week one.',
          minutes: 20,
          movements: [
            {
              id: 'm1',
              exerciseId: 23, // DB Romanian Deadlift
              prescription: '15 reps',
              notes:
                'Final RDL of the programme. Heaviest load. Hinge clean. Squeeze at the top.',
            },
            {
              id: 'm2',
              exerciseId: 76, // DB Split Squat (Jerk Stance)
              prescription: '12 reps/side',
              notes:
                'Heaviest split squat of the programme. Slow descent. Drive through the front heel.',
            },
            {
              id: 'm3',
              exerciseId: 88, // Single-Leg DB Deadlift
              prescription: '10 reps/side',
              notes:
                'Final single-leg deadlift of the programme. Hips square. No wall contact.',
            },
            {
              id: 'm4',
              exerciseId: 49, // Russian Twists
              prescription: '24 reps',
              notes: 'Light dumbbell. Rotate from the ribs.',
            },
            {
              id: 'm5',
              exerciseId: 41, // Hip Thrust
              prescription: '15 reps',
              notes:
                'Final hip thrust of the programme. Heaviest load. Squeeze and pause at the top.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'amrap',
          title: 'Final Legs + Lungs AMRAP - 10 Minutes',
          instructions:
            'The last finisher of the programme. Ten minutes. Heaviest loads. Leave nothing behind.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              exerciseId: 91, // Weighted Step-ups
              prescription: '12 reps/side',
              notes:
                'Heaviest step-up of the programme. Drive through the heel.',
            },
            {
              id: 'm2',
              exerciseId: 100, // DB Thruster
              prescription: '10 reps',
              notes:
                'Final thruster of the programme. Squat and press. Full range.',
            },
            {
              id: 'm3',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '25 reps',
              notes:
                'Full range. Pause at the top. Last movement of the programme.',
            },
          ],
        },
        cooldown3,
      ],
    },
  ],
};
