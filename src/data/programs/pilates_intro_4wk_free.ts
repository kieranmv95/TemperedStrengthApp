import type {
  Program,
  WorkoutBlockCooldown,
  WorkoutBlockWarmup,
} from '@/src/types/program';

// ─── Warm-Ups ────────────────────────────────────────────────────────────────
// Three variants. Each matched to the session stimulus.

const warmupA: WorkoutBlockWarmup = {
  id: 'wu-a',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '2–3 minutes. Core and glute activation. Move slowly and with intention — this is not cardio, it is preparation.',
  description: [
    '60s slow breathing — inhale through the nose for 4 counts, exhale through the mouth for 6. Let your ribs expand outward, not upward.',
    '5 spine roll-downs — stand tall, nod your chin to your chest and peel down vertebra by vertebra. Pause at the bottom, then roll back up slowly. Feel each section of your spine.',
    '10 glute bridges — slow on the way up, squeeze and hold for a full second at the top, then lower with control. This is the primary movement pattern of the session.',
    '10 controlled bodyweight squats — upright torso, breathe in on the way down, exhale on the drive up.',
  ],
};

const warmupB: WorkoutBlockWarmup = {
  id: 'wu-b',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '2–3 minutes. Spine mobility and breathing. Today is about movement quality — start here and carry that intention into the session.',
  description: [
    '60s slow breathing — long exhale through the mouth. On each exhale, feel your ribs drop and your core engage gently. This is the breathing pattern you will use throughout.',
    '6 cat-cow — from all fours, inhale to arch (cow), exhale to round (cat). Move one vertebra at a time. Feel the difference between your upper and lower back.',
    '5 spine roll-downs — stand tall, peel down slowly, pause at the bottom with your head heavy. Roll back up one vertebra at a time.',
    '5 thread the needle each side — from all fours, rotate one arm under your body and let your shoulder drop toward the floor. Hold for a breath, return slowly.',
  ],
};

const warmupC: WorkoutBlockWarmup = {
  id: 'wu-c',
  type: 'warmup',
  title: 'Warm-Up',
  instructions:
    '2–3 minutes. Lateral stability and balance preparation. The session today challenges your ability to hold position — begin by finding it.',
  description: [
    '60s slow breathing — inhale for 4, exhale for 6. On each exhale, draw your lower belly gently inward. This is your deep core engaging.',
    '5 spine roll-downs — slow and deliberate. Pause at the bottom and feel the length in your hamstrings before rolling back up.',
    '10 glute bridges with a 2-second hold at the top — squeeze your glutes hard. Lateral stability starts with a strong posterior.',
    '20s plank hold — knees down is absolutely fine. Ribs down, breathe steadily. You are not warming up your arms, you are warming up your core.',
  ],
};

// ─── Cooldown Blocks ─────────────────────────────────────────────────────────
// One per week. Progressive. Week 1 is short and gentle. Week 4 is thorough.

const cooldownWeek1: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    '2–3 minutes. Your nervous system needs to downregulate after focused work. Do not skip this — it is part of the session, not an afterthought. Move through each item slowly and without rushing.',
  description: [
    'Hip flexor lunge stretch — kneel on one knee, back upright. Tuck your pelvis gently under and breathe into the front of the rear hip. 30s each side. This counterbalances the glute and core work.',
    'Supine twist — lie on your back, draw one knee to your chest and guide it across your body. Let your shoulder stay on the floor. Hold 30s each side. Breathe into the stretch.',
    '60s slow breathing — inhale for 4, exhale for 6. Let your body settle. Notice the difference between how you feel now and how you felt at the start.',
  ],
};

const cooldownWeek2: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    '3 minutes. You have worked harder this week — give the body the time it needs to unwind. Move through these slowly. The breathing at the end is not optional.',
  description: [
    'Hip flexor lunge stretch — kneel on one knee, tuck the pelvis, breathe into the front of the rear hip. 40s each side. If you feel tight here, that is normal and this is exactly what it needs.',
    'Supine twist — lie on your back, draw one knee across your body, keep both shoulders grounded. 40s each side. Use your exhale to release deeper into the rotation.',
    'Legs up the wall (or against a sofa) — lie on your back and extend your legs up a wall at 90 degrees. Stay here for 60s. Let gravity do the work. This is one of the best things you can do after a core session.',
    '30s slow breathing to finish — inhale for 4, exhale for 6. Eyes closed if that helps.',
  ],
};

const cooldownWeek3: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    '3–4 minutes. Week three is where the cumulative work starts to show in how your body feels. Take the full time here. The thoracic and hip work below will matter tomorrow morning.',
  description: [
    'Hip flexor lunge stretch — 45s each side. Deeper this week if your body allows. Tuck the pelvis, breathe in, and let the front of the hip open on each exhale.',
    'Thoracic rotation stretch — sit cross-legged, place one hand behind your head and rotate your upper back slowly to one side. 5 slow reps each direction. You are undoing the tension that builds from sitting and from the rotational work in the session.',
    'Supine twist — 45s each side. Let the shoulder stay down. Use your breath to release rather than forcing the range.',
    'Legs up the wall — 60s. Let your lower back settle into the floor. If it lifts, move a little further from the wall.',
    '30s slow breathing to finish — inhale for 4, exhale for 8. Longer exhale this week.',
  ],
};

const cooldownWeek4: WorkoutBlockCooldown = {
  id: 'cooldown',
  type: 'cooldown',
  title: 'Cool Down',
  instructions:
    '4–5 minutes. Final week. This cool down is the longest of the programme and earns its place. You have built real control over four weeks — let the body acknowledge that by taking time to fully unwind. Do not rush any of these.',
  description: [
    'Hip flexor lunge stretch — 60s each side. The longest hold of the programme. Breathe in slowly and let the hip open on every exhale. Notice how much more available this feels than week one.',
    'Thoracic rotation stretch — seated cross-legged, hand behind your head, rotate slowly. 6 reps each direction. Move through the full available range without forcing it.',
    'Supine twist — 60s each side. Full release. Let your shoulder stay grounded, breathe into the side of your ribcage.',
    'Legs up the wall — 90s. Eyes closed. Let everything go.',
    'Final breathing sequence — inhale for 4, hold for 2, exhale for 8. Repeat 5 times. This is the parasympathetic reset. It signals to your body that the work is done.',
  ],
};

// ─── Programme ───────────────────────────────────────────────────────────────

export const pilates_intro_4wk_free: Program = {
  id: 'pilates_intro_4wk_free',
  isPro: false,
  name: 'Pilates Intro (4 Weeks)',
  description: `A beginner-friendly 4-week intro focused on core strength, control, and mobility. Every week builds on the last. You will leave sessions feeling taller, steadier, and more switched on.`,
  bodyChangesSummary: `You will feel stronger through your core and more stable in everyday movement. Expect better posture, improved mobility, and a tighter feel around your midsection as you build control and consistency.`,
  categories: ['functional'],
  goals: ['mobility', 'stronger', 'leaner', 'maintenance'],
  difficulty: 'beginner',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '25m',
  workouts: [
    // =========================================================================
    // WEEK 1 — Learn the movements. Shorter holds. More guidance in the notes.
    // Every rep should feel deliberate. Form over duration every time.
    // =========================================================================

    // ─── W1 Pilates A — Core + glutes ────────────────────────────────────────
    {
      dayIndex: 0,
      label: 'Pilates A (Week 1)',
      description:
        'Core and glutes. Your first session. Slow reps, full control, steady breathing. Every rep should feel deliberate. If something does not feel right, stop and reset.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupA,
        {
          id: 'main',
          type: 'rounds',
          title: 'Control Circuit — 3 Rounds',
          instructions:
            'Slow reps, full control, steady breathing. Stop a rep short of losing form. Rest as needed between movements.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '20s',
              notes:
                'Knees down is a great option for week one. Ribs down, glutes on. Think of pulling your elbows toward your toes without moving. Breathe steadily throughout.',
            },
            {
              id: 'm2',
              exerciseId: 25, // Glute Bridge
              prescription: '10 reps',
              notes:
                'Peel your spine off the floor one vertebra at a time on the way up. Squeeze for a full second at the top, then lower slowly. Do not rush the descent.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '15s each side',
              notes:
                'Knees down to start. Stack your knees and keep your top hip pushed forward. Short holds in week one are fine. Build the position, not the time.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '8 reps',
              notes:
                'Curl up slowly, leading with your ribs rather than your head. Exhale on the way up, inhale as you lower. This is not a crunch. Peel up, peel down.',
            },
            {
              id: 'm5',
              label: 'Dead bug',
              prescription: '5 reps each side',
              notes:
                'Lie on your back, arms toward the ceiling, knees at tabletop. Press your lower back gently into the floor and keep it there throughout. Slowly lower the opposite arm and leg together, then return. Never let your back arch off the floor. If it does, reduce the range.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Breath and Core Endurance',
          instructions:
            '8 rounds, 20s work, 10s rest. This is about breathing under tension, not raw reps. Keep everything controlled. If you lose the breathing pattern, that is your signal to scale back.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '20s on / 10s off',
              notes:
                'Lie on your back, both knees to chest, head and shoulders curled up. Alternate extending one leg out while drawing the other knee in. Exhale with each switch. Keep your lower back heavy throughout. If your neck tires, rest your head down.',
            },
            {
              id: 'm2',
              label: 'Leg lower (controlled)',
              prescription: '20s on / 10s off',
              notes:
                'Both legs extended toward the ceiling. Lower them together slowly and stop the moment your back starts to lift. Bring them back before that happens. Knees slightly bent is absolutely fine in week one.',
            },
          ],
        },
        cooldownWeek1,
      ],
    },

    // ─── W1 Pilates B — Mobility + spine + core ───────────────────────────────
    {
      dayIndex: 2,
      label: 'Pilates B (Week 1)',
      description:
        'Mobility, spine, and core. The session most people feel most in daily life. Better posture, freer movement, less stiffness. Take your time with every transition.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupB,
        {
          id: 'mobility',
          type: 'rounds',
          title: 'Mobility Flow — 2 Rounds',
          instructions:
            'Move smoothly. No rushing. Inhale to prepare, exhale to move. This is not stretching for flexibility, it is movement for control.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'Cat-cow',
              prescription: '6 reps',
              notes:
                'Inhale to arch (cow), exhale to round (cat). Move slowly and feel each section of your spine respond. Do not rush through the middle — find the full range at each end.',
            },
            {
              id: 'm2',
              label: 'Thread the needle',
              prescription: '4 reps each side',
              notes:
                'From all fours, rotate one arm under your body and let your shoulder drop toward the floor. Hold for a breath at the bottom, then return slowly. Keep your hips square throughout.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '30s each side',
              notes:
                'Kneel on one knee, back upright. Gently tuck your pelvis under and breathe into the front of the rear hip. This is the essential counterbalance to all the glute and core work in this programme. Do not skip it.',
            },
            {
              id: 'm4',
              label: "World's greatest stretch",
              prescription: '3 reps each side',
              notes:
                'Step into a lunge, plant your hand inside the front foot, then rotate and reach your top arm to the ceiling. Move slowly through each stage. Do not force the rotation.',
            },
          ],
        },
        {
          id: 'core',
          type: 'rounds',
          title: 'Core Control — 2 Rounds',
          instructions:
            'Calm, steady reps. No rushing between movements. Keep tension through your midline. Exhale on effort every time.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'The Hundred (modified)',
              prescription: '20 pumps',
              notes:
                'Lie on your back, legs at tabletop, head and shoulders curled up. Pump your straight arms up and down in small, fast pulses — 5 pumps inhale, 5 pumps exhale. 20 pumps is two full breath cycles. This is the signature Pilates breathing drill. Week one, keep it short and controlled.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '8 reps',
              notes:
                'Peel up one vertebra at a time. This is spinal segmentation, not a sit-up in the traditional sense. Exhale as you come up, inhale as you lower. Slow on both directions.',
            },
            {
              id: 'm3',
              label: 'Leg circles (supine)',
              prescription: '5 circles each direction each side',
              notes:
                'Lie on your back, one leg extended toward the ceiling. Draw slow, controlled circles from the hip. Small circles in week one. Keep the opposite hip completely still and your lower back pressed into the floor.',
            },
            {
              id: 'm4',
              label: 'Bird dog',
              prescription: '6 reps each side',
              notes:
                'From all fours, extend the opposite arm and leg simultaneously. Imagine balancing a glass of water on your lower back — hips stay perfectly square. Slow exhale on each reach. Hold for a full second before returning.',
            },
          ],
        },
        {
          id: 'posture',
          type: 'emom',
          title: 'Posture EMOM — 8 Minutes',
          instructions:
            'Every minute: 40s smooth work, 20s breathe and reset. Shoulders away from your ears throughout. This block is about quality of position, not effort.',
          minutes: 8,
          movements: [
            {
              id: 'm1',
              label: 'Wall angels',
              prescription: '40s',
              notes:
                'Stand with your back flat against a wall, arms in a goalpost shape. Slide your arms overhead slowly, keeping contact with the wall the whole time. Only go as high as you can maintain full contact. Most people will not make it all the way in week one. That is fine.',
            },
            {
              id: 'm2',
              label: 'Breathing reset (nasal)',
              prescription: '20s',
              notes:
                '4 counts in through the nose, 6 counts out through the mouth. Let your ribs expand outward rather than lifting your shoulders. This is your reset between rounds.',
            },
          ],
        },
        cooldownWeek1,
      ],
    },

    // ─── W1 Pilates C — Core endurance + lateral + balance ────────────────────
    {
      dayIndex: 4,
      label: 'Pilates C (Week 1)',
      description:
        'Core endurance and balance. The hardest session of the week. Stay calm, stay steady, and trust the process. Short holds in week one are the right approach.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupC,
        {
          id: 'endurance',
          type: 'rounds',
          title: 'Core Endurance — 3 Rounds',
          instructions:
            'Stay calm, stay steady. Smooth breathing throughout. Never hold your breath. Drop to an easier option the moment form breaks.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '20s',
              notes:
                'Knees down is the right call in week one. Ribs down, breathe steadily. Quality over duration every time.',
            },
            {
              id: 'm2',
              label: 'Hollow hold',
              prescription: '10s',
              notes:
                'Lie on your back, arms overhead, legs extended. Press your lower back into the floor, then lift your shoulders and legs a few inches. If your back arches at all, bend your knees. Short holds in week one. Ten seconds of clean tension is worth more than thirty seconds of arching.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '15s each side',
              notes:
                'Knees down to build the position. Stack your knees, push your top hip forward. Short holds this week. The position matters more than the time.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '8 reps',
              notes:
                'Slow, controlled. Exhale as you curl up. Do not pull on your neck.',
            },
            {
              id: 'm5',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '12 reps',
              notes:
                'Stand tall. Rise slowly, pause at the top, lower with control. Notice how much harder balance is when your core is fatigued. That is the point.',
            },
          ],
        },
        {
          id: 'flow',
          type: 'amrap',
          title: 'AMRAP Flow — 6 Minutes',
          instructions:
            'Repeat smooth rounds for the full time. Stop before your form breaks. One clean rep is worth more than three sloppy ones.',
          minutes: 6,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '5 reps each side',
              notes:
                'Head and shoulders curled up, lower back heavy. Alternate extending each leg out at 45 degrees. Breathe steadily. If your neck fatigues, rest your head down.',
            },
            {
              id: 'm2',
              label: 'Quadruped thoracic rotation',
              prescription: '5 reps each side',
              notes:
                'From all fours, place one hand behind your head and rotate your elbow toward the ceiling. Keep your hips square and your core braced. Move slowly.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '20s each side',
              notes:
                'Tuck the pelvis gently and breathe into the front of the rear hip. Close every session with this. Your hips carry a lot of tension and this is how you release it.',
            },
          ],
        },
        cooldownWeek1,
      ],
    },

    // =========================================================================
    // WEEK 2 — Build confidence. Holds extend. Reps increase slightly.
    // One new movement introduced per session. Less hand-holding in the notes.
    // =========================================================================

    // ─── W2 Pilates A — Core + glutes ────────────────────────────────────────
    {
      dayIndex: 7,
      label: 'Pilates A (Week 2)',
      description:
        'Core and glutes. Same structure as week one, longer holds and more reps. You should feel more familiar with the movements now. Focus on quality of tension, not just completing the reps.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupA,
        {
          id: 'main',
          type: 'rounds',
          title: 'Control Circuit — 3 Rounds',
          instructions:
            'Same circuit as week one. Holds are longer, reps are higher. Move with more intention this week.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '25–30s',
              notes:
                'Five seconds longer than week one. If knees down felt solid last week, try a few seconds on toes. Ribs down, core braced, breathe steadily.',
            },
            {
              id: 'm2',
              exerciseId: 25, // Glute Bridge
              prescription: '12 reps',
              notes:
                'Peel up slowly. Squeeze and hold for two full seconds at the top this week. The pause is where the work happens.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '20s each side',
              notes:
                'Build toward a full side plank if knees-down felt easy last week. Top hip stays forward. Five more seconds than week one.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '10 reps',
              notes:
                'Two extra reps. Same quality. Exhale on the way up, inhale as you lower.',
            },
            {
              id: 'm5',
              label: 'Dead bug',
              prescription: '6 reps each side',
              notes:
                'Lower back stays on the floor throughout. Full range if you can keep the back down. If it lifts, reduce the range. One extra rep each side this week.',
            },
          ],
        },
        {
          id: 'new',
          type: 'rounds',
          title: 'New This Week — Glute Bridge March',
          instructions:
            '2 rounds. A progression from the glute bridge — introduces single-leg challenge and hip stability.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              exerciseId: 110, // Glute Bridge March
              prescription: '10 reps each side',
              notes:
                'From a glute bridge position with hips raised, march alternate feet off the floor. Keep your hips level throughout. Do not let the pelvis drop as you lift. This is harder than it looks.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Breath and Core Endurance',
          instructions:
            '8 rounds, 20s work, 10s rest. You should know this format now. Focus on the breathing pattern rather than the reps.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '20s on / 10s off',
              notes:
                'Extend the leg a little lower this week if your back stays flat. Exhale with every switch.',
            },
            {
              id: 'm2',
              label: 'Leg lower (controlled)',
              prescription: '20s on / 10s off',
              notes:
                'Lower a little further than week one if your back stays down. The moment it lifts, bring the legs back.',
            },
          ],
        },
        cooldownWeek2,
      ],
    },

    // ─── W2 Pilates B — Mobility + spine + core ───────────────────────────────
    {
      dayIndex: 9,
      label: 'Pilates B (Week 2)',
      description:
        'Mobility, spine, and core. Longer mobility holds this week. The Hundred goes up to 40 pumps. New movement introduced at the end of the core block.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupB,
        {
          id: 'mobility',
          type: 'rounds',
          title: 'Mobility Flow — 2 Rounds',
          instructions:
            'Same movements as week one. Longer holds. More attention to the breath.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'Cat-cow',
              prescription: '8 reps',
              notes:
                'Two more reps this week. Slow on both ends. Find the full range of your spine in each direction.',
            },
            {
              id: 'm2',
              label: 'Thread the needle',
              prescription: '5 reps each side',
              notes:
                'One extra rep. Hold at the bottom for a full breath before returning. Let the rotation deepen on each exhale.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '40s each side',
              notes:
                'Ten more seconds than week one. Breathe into the front of the rear hip on every exhale. Notice if one side is tighter than the other.',
            },
            {
              id: 'm4',
              label: "World's greatest stretch",
              prescription: '4 reps each side',
              notes:
                'One extra rep. Move slowly. Find more range in the rotation this week without forcing it.',
            },
          ],
        },
        {
          id: 'core',
          type: 'rounds',
          title: 'Core Control — 2 Rounds',
          instructions:
            'Same structure as week one. The Hundred goes up to 40 pumps. New movement added at the end.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'The Hundred (modified)',
              prescription: '40 pumps',
              notes:
                'Double the pumps from week one. That is four full breath cycles. Legs can stay at tabletop or extend to 45 degrees if your back stays flat. Maintain the curl of your head and shoulders throughout.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '10 reps',
              notes: 'Two more reps. Same quality. Peel up, peel down.',
            },
            {
              id: 'm3',
              label: 'Leg circles (supine)',
              prescription: '6 circles each direction each side',
              notes:
                'Slightly larger circles this week if your hip stays stable. The opposite hip should not move at all.',
            },
            {
              id: 'm4',
              label: 'Bird dog',
              prescription: '8 reps each side',
              notes:
                'Two extra reps. Hold for two full seconds at the end range before returning. Slow and deliberate.',
            },
          ],
        },
        {
          id: 'new',
          type: 'rounds',
          title: 'New This Week — Thoracic Extension',
          instructions:
            '2 rounds. A new movement to complement the rotational work already in this session.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'Thoracic extension over a foam roller or rolled towel',
              prescription: '5 slow extensions',
              notes:
                'Place a foam roller or tightly rolled towel across your mid-back (not your lower back). Support your head with your hands, let your upper back extend gently over the roller. Hold 2–3 seconds at the bottom. This is one of the best things you can do for posture and thoracic mobility.',
            },
          ],
        },
        {
          id: 'posture',
          type: 'emom',
          title: 'Posture EMOM — 8 Minutes',
          instructions:
            'Same format as week one. Wall angels should feel more available this week.',
          minutes: 8,
          movements: [
            {
              id: 'm1',
              label: 'Wall angels',
              prescription: '40s',
              notes:
                'Try to go higher than week one without losing wall contact. If you hit the same ceiling, focus on keeping your lower back flat against the wall throughout.',
            },
            {
              id: 'm2',
              label: 'Breathing reset (nasal)',
              prescription: '20s',
              notes: '4 counts in, 6 counts out. Shoulders down. Ribs out.',
            },
          ],
        },
        cooldownWeek2,
      ],
    },

    // ─── W2 Pilates C — Core endurance + lateral + balance ────────────────────
    {
      dayIndex: 11,
      label: 'Pilates C (Week 2)',
      description:
        'Core endurance and balance. Holds are longer across the board. The AMRAP runs for 8 minutes this week. New movement introduced in the endurance block.',
      intensity: 4,
      format: 'v2',
      blocks: [
        warmupC,
        {
          id: 'endurance',
          type: 'rounds',
          title: 'Core Endurance — 3 Rounds',
          instructions:
            'Longer holds this week. Same principles apply. Stop before form breaks.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '30s',
              notes:
                'Ten more seconds than week one. If toes-down is available, try it. If not, knees-down with solid form is better.',
            },
            {
              id: 'm2',
              label: 'Hollow hold',
              prescription: '15s',
              notes:
                'Five more seconds. Keep the lower back pressed into the floor throughout. Bend your knees if needed.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '20s each side',
              notes:
                'Five more seconds. Try the full position if knees-down felt solid last week.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '10 reps',
              notes:
                'Two extra reps. Slow on both directions. Exhale up, inhale down.',
            },
            {
              id: 'm5',
              label: 'Single-leg glute bridge',
              prescription: '8 reps each side',
              notes:
                'New this week. Lie on your back, one foot flat on the floor, the other leg extended or at tabletop. Drive through the grounded heel and squeeze the glute hard at the top. Keep your hips level throughout. This is a significant step up from the standard glute bridge.',
            },
          ],
        },
        {
          id: 'flow',
          type: 'amrap',
          title: 'AMRAP Flow — 8 Minutes',
          instructions:
            'Two more minutes than week one. Same movements. Find a steady rhythm and stay in it.',
          minutes: 8,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '6 reps each side',
              notes:
                'One extra rep each side. Lower the extended leg a little if your back stays flat.',
            },
            {
              id: 'm2',
              label: 'Quadruped thoracic rotation',
              prescription: '6 reps each side',
              notes:
                'One extra rep. Hold at the top for a breath before returning.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '25s each side',
              notes: 'Five more seconds. Breathe in, release on the exhale.',
            },
          ],
        },
        cooldownWeek2,
      ],
    },

    // =========================================================================
    // WEEK 3 — Add challenge. Longer endurance blocks. More complex movements.
    // Less scaffolding in the notes. You know what you are doing by now.
    // =========================================================================

    // ─── W3 Pilates A — Core + glutes ────────────────────────────────────────
    {
      dayIndex: 14,
      label: 'Pilates A (Week 3)',
      description:
        'Core and glutes. Intensity steps up to 5 this week. Rounds go up to 4. If week two felt manageable, this is the week you start to earn it.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupA,
        {
          id: 'main',
          type: 'rounds',
          title: 'Control Circuit — 4 Rounds',
          instructions:
            'One extra round this week. Same quality standards. Shorter rest.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '30–35s',
              notes:
                'Toes down where possible. Ribs down, glutes on. Breathe steadily.',
            },
            {
              id: 'm2',
              exerciseId: 25, // Glute Bridge
              prescription: '15 reps',
              notes:
                'Three-second hold at the top. Slow lower. Feel the full range of each rep.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '25s each side',
              notes: 'Full position where possible. Top hip forward and up.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '12 reps',
              notes: 'Peel up, peel down. Exhale up, inhale down.',
            },
            {
              id: 'm5',
              label: 'Dead bug',
              prescription: '8 reps each side',
              notes:
                'Full range if the back stays flat. Slow exhale on every reach. Two extra reps this week.',
            },
          ],
        },
        {
          id: 'glute',
          type: 'rounds',
          title: 'Glute Progression — 3 Rounds',
          instructions:
            'Building on the glute bridge march from week two. Rest 30s between rounds.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 110, // Glute Bridge March
              prescription: '12 reps each side',
              notes:
                'Hips level throughout. Do not let the pelvis drop as you march.',
            },
            {
              id: 'm2',
              label: 'Single-leg glute bridge',
              prescription: '10 reps each side',
              notes:
                'Introduced in week two. Three-second hold at the top this week. Drive through the heel.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Breath and Core Endurance',
          instructions:
            '8 rounds. You should be comfortable with this format now. Challenge the range this week.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '20s on / 10s off',
              notes:
                'Extend the leg lower this week if your back stays flat. Exhale with every switch.',
            },
            {
              id: 'm2',
              label: 'Leg lower (controlled)',
              prescription: '20s on / 10s off',
              notes:
                'Lower as far as you can while keeping the back pressed into the floor. That is your range. Do not go past it.',
            },
          ],
        },
        cooldownWeek3,
      ],
    },

    // ─── W3 Pilates B — Mobility + spine + core ───────────────────────────────
    {
      dayIndex: 16,
      label: 'Pilates B (Week 3)',
      description:
        'Mobility, spine, and core. The Hundred goes to 60 pumps. Thoracic extension returns with more range. The posture EMOM extends to 10 minutes.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupB,
        {
          id: 'mobility',
          type: 'rounds',
          title: 'Mobility Flow — 3 Rounds',
          instructions:
            'Three rounds this week. The third round should feel more available than the first.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              label: 'Cat-cow',
              prescription: '8 reps',
              notes:
                'Move through every section of your spine. Upper, mid, lower. Slow on both ends.',
            },
            {
              id: 'm2',
              label: 'Thread the needle',
              prescription: '5 reps each side',
              notes:
                'Hold at the bottom for a full breath. Find more rotation than week two.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '45s each side',
              notes:
                'Longest hold so far. Breathe into the stretch on every exhale.',
            },
            {
              id: 'm4',
              label: "World's greatest stretch",
              prescription: '4 reps each side',
              notes:
                'More range in the rotation this week. Keep the movement slow.',
            },
          ],
        },
        {
          id: 'core',
          type: 'rounds',
          title: 'Core Control — 3 Rounds',
          instructions:
            'Three rounds this week. Same movements, more volume. The Hundred steps up significantly.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              label: 'The Hundred (modified)',
              prescription: '60 pumps',
              notes:
                'Six full breath cycles. Extend the legs to 45 degrees if your back stays flat. This should feel like real work by round three.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '12 reps',
              notes: 'Peel up, peel down. No rushing.',
            },
            {
              id: 'm3',
              label: 'Leg circles (supine)',
              prescription: '8 circles each direction each side',
              notes:
                'Two extra circles. Maintain full control. The opposite hip does not move.',
            },
            {
              id: 'm4',
              label: 'Bird dog',
              prescription: '10 reps each side',
              notes:
                'Two extra reps. Hold for two seconds at full extension. Hips perfectly square.',
            },
          ],
        },
        {
          id: 'thoracic',
          type: 'rounds',
          title: 'Thoracic Progression — 2 Rounds',
          instructions:
            'Introduced in week two. More range available now. Take your time.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              label: 'Thoracic extension over a foam roller or rolled towel',
              prescription: '6 slow extensions',
              notes:
                'One extra extension this week. Hold 3 seconds at the bottom. Arms can reach overhead at the bottom if your range allows.',
            },
          ],
        },
        {
          id: 'posture',
          type: 'emom',
          title: 'Posture EMOM — 10 Minutes',
          instructions:
            'Two extra minutes this week. Same format. Wall angels should feel significantly more available than week one.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              label: 'Wall angels',
              prescription: '40s',
              notes:
                'Challenge the range this week. Keep every part of your back in contact with the wall. Slow on the way up and the way down.',
            },
            {
              id: 'm2',
              label: 'Breathing reset (nasal)',
              prescription: '20s',
              notes: '4 counts in, 8 counts out. Longer exhale this week.',
            },
          ],
        },
        cooldownWeek3,
      ],
    },

    // ─── W3 Pilates C — Core endurance + lateral + balance ────────────────────
    {
      dayIndex: 18,
      label: 'Pilates C (Week 3)',
      description:
        'Core endurance and balance. Holds are the longest of the programme so far. The AMRAP runs for 10 minutes. A new balance challenge is introduced.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupC,
        {
          id: 'endurance',
          type: 'rounds',
          title: 'Core Endurance — 3 Rounds',
          instructions:
            'Longest holds of the programme so far. Same quality standards.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '35–40s',
              notes:
                'Toes down. Ribs down. Breathe steadily. Do not hold your breath.',
            },
            {
              id: 'm2',
              label: 'Hollow hold',
              prescription: '20s',
              notes:
                'Back flat throughout. Legs extended if possible. Ten more seconds than week two.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '25s each side',
              notes:
                'Full position. Top hip forward and up. Build the time steadily.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '12 reps',
              notes: 'Slow and controlled. Exhale up, inhale down.',
            },
            {
              id: 'm5',
              label: 'Single-leg glute bridge',
              prescription: '10 reps each side',
              notes:
                'Three-second hold at the top. Keep your hips level. Drive through the heel.',
            },
          ],
        },
        {
          id: 'balance',
          type: 'rounds',
          title: 'New This Week — Balance Challenge',
          instructions:
            '2 rounds. This block introduces a standing balance element. Fatigue from the endurance block will make this harder than it looks.',
          rounds: 2,
          movements: [
            {
              id: 'm1',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '15 reps single-leg',
              notes:
                'Stand tall on one leg. Rise slowly, pause at the top, lower with control. Use a wall if needed but try to reduce contact over the two rounds.',
            },
            {
              id: 'm2',
              label: 'Standing hip circle',
              prescription: '5 circles each direction each side',
              notes:
                'Stand on one leg and draw slow circles with your raised knee. Keep your standing hip still. Core engaged throughout. This is a balance and hip mobility combination.',
            },
          ],
        },
        {
          id: 'flow',
          type: 'amrap',
          title: 'AMRAP Flow — 10 Minutes',
          instructions:
            'Two more minutes than week two. Same movements. Find a rhythm and stay in it.',
          minutes: 10,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '8 reps each side',
              notes:
                'Two extra reps each side. Leg extends lower if your back stays flat.',
            },
            {
              id: 'm2',
              label: 'Quadruped thoracic rotation',
              prescription: '6 reps each side',
              notes:
                'Hold at the top for a full breath. Find more rotation than week two.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '30s each side',
              notes: 'Ten more seconds. Breathe into the stretch.',
            },
          ],
        },
        cooldownWeek3,
      ],
    },

    // =========================================================================
    // WEEK 4 — Peak control. Longest holds, most complex sequences.
    // Sessions feel complete, not introductory. This is the finish line.
    // =========================================================================

    // ─── W4 Pilates A — Core + glutes ────────────────────────────────────────
    {
      dayIndex: 21,
      label: 'Pilates A (Week 4)',
      description:
        'Core and glutes. The final version of this session. Four rounds, longest holds, most complex glute progression. Compare how this feels to week one.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupA,
        {
          id: 'main',
          type: 'rounds',
          title: 'Control Circuit — 4 Rounds',
          instructions:
            'Four rounds. You have earned the right to do these properly. No shortcuts.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '40s',
              notes:
                'Toes down. Ribs down. Breathe steadily. This is the longest plank of the programme.',
            },
            {
              id: 'm2',
              exerciseId: 25, // Glute Bridge
              prescription: '15 reps',
              notes:
                'Three-second hold at the top every rep. Full range. Slow lower.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '30s each side',
              notes: 'Full position. Top hip forward. Breathe steadily.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '15 reps',
              notes: 'Peel up, peel down. Three extra reps. Same quality.',
            },
            {
              id: 'm5',
              label: 'Dead bug',
              prescription: '10 reps each side',
              notes:
                'Full range, slow exhale on every reach. Back flat throughout. This is the most reps of the programme.',
            },
          ],
        },
        {
          id: 'glute',
          type: 'rounds',
          title: 'Glute Progression — 3 Rounds',
          instructions:
            'Final glute block. Four weeks of progression behind you. Rest 30s between rounds.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 110, // Glute Bridge March
              prescription: '15 reps each side',
              notes: 'Three extra reps. Hips level throughout.',
            },
            {
              id: 'm2',
              label: 'Single-leg glute bridge',
              prescription: '12 reps each side',
              notes:
                'Three-second hold at the top. Drive through the heel. This is the hardest version of this movement in the programme.',
            },
          ],
        },
        {
          id: 'finisher',
          type: 'tabata',
          title: 'Breath and Core Endurance',
          instructions:
            '8 rounds. Final version of this finisher. Push the range and trust the four weeks of work behind you.',
          rounds: 8,
          workSeconds: 20,
          restSeconds: 10,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '20s on / 10s off',
              notes:
                'Full range. Leg extends low. Exhale with every switch. Lower back stays heavy.',
            },
            {
              id: 'm2',
              label: 'Leg lower (controlled)',
              prescription: '20s on / 10s off',
              notes:
                'Take the legs as low as you can with your back fully pressed into the floor. That is your range now. Own it.',
            },
          ],
        },
        cooldownWeek4,
      ],
    },

    // ─── W4 Pilates B — Mobility + spine + core ───────────────────────────────
    {
      dayIndex: 23,
      label: 'Pilates B (Week 4)',
      description:
        'Mobility, spine, and core. The Hundred reaches 80 pumps. Three rounds of everything. The posture EMOM runs for 12 minutes. Final version of this session.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupB,
        {
          id: 'mobility',
          type: 'rounds',
          title: 'Mobility Flow — 3 Rounds',
          instructions:
            'Three rounds. The final mobility flow of the programme. Notice how much more available your spine and hips feel compared to week one.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              label: 'Cat-cow',
              prescription: '10 reps',
              notes:
                'The most reps of the programme. Move through the full range of your spine. Do not rush.',
            },
            {
              id: 'm2',
              label: 'Thread the needle',
              prescription: '6 reps each side',
              notes:
                'Hold at the bottom for a full breath each rep. Find the deepest rotation your thoracic spine will allow.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '60s each side',
              notes:
                'The longest hold of the programme. Breathe into the stretch on every exhale. Notice how different this feels from week one.',
            },
            {
              id: 'm4',
              label: "World's greatest stretch",
              prescription: '5 reps each side',
              notes: 'One extra rep. Full range. Take your time at each stage.',
            },
          ],
        },
        {
          id: 'core',
          type: 'rounds',
          title: 'Core Control — 3 Rounds',
          instructions:
            'Three rounds. The Hundred goes to 80 pumps. This is the peak of the programme.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              label: 'The Hundred',
              prescription: '80 pumps',
              notes:
                'Eight full breath cycles. Legs extended at 45 degrees. Head and shoulders curled up. This is the full Pilates Hundred. Four weeks of preparation behind you. Own it.',
            },
            {
              id: 'm2',
              exerciseId: 86, // Sit-ups
              prescription: '15 reps',
              notes: 'Peel up, peel down. Slow on both directions.',
            },
            {
              id: 'm3',
              label: 'Leg circles (supine)',
              prescription: '10 circles each direction each side',
              notes:
                'The largest circles of the programme, controlled by your hip. The opposite hip does not move.',
            },
            {
              id: 'm4',
              label: 'Bird dog',
              prescription: '10 reps each side',
              notes:
                'Two-second hold at full extension. Hips perfectly square. Slow exhale on every reach.',
            },
          ],
        },
        {
          id: 'thoracic',
          type: 'rounds',
          title: 'Thoracic Progression — 3 Rounds',
          instructions:
            'Three rounds this week. The most thoracic work of the programme.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              label: 'Thoracic extension over a foam roller or rolled towel',
              prescription: '6 slow extensions',
              notes:
                'Arms reaching overhead at the bottom if your range allows. Hold 3 seconds. Move the roller to a slightly different segment between rounds if you have the range.',
            },
          ],
        },
        {
          id: 'posture',
          type: 'emom',
          title: 'Posture EMOM — 12 Minutes',
          instructions:
            'The longest posture EMOM of the programme. Same format. Same quality. Notice how much more range you have in the wall angels compared to week one.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              label: 'Wall angels',
              prescription: '40s',
              notes:
                'Full range if available. Every part of your back in contact with the wall. Slow on the way up and down.',
            },
            {
              id: 'm2',
              label: 'Breathing reset (nasal)',
              prescription: '20s',
              notes:
                '4 counts in, 8 counts out. Eyes closed if that helps. This is your reset.',
            },
          ],
        },
        cooldownWeek4,
      ],
    },

    // ─── W4 Pilates C — Core endurance + lateral + balance ────────────────────
    {
      dayIndex: 25,
      label: 'Pilates C (Week 4)',
      description:
        'Core endurance and balance. The final session of the programme. Longest holds, longest AMRAP. Compare how this feels to week one session C. That difference is four weeks of consistent work.',
      intensity: 5,
      format: 'v2',
      blocks: [
        warmupC,
        {
          id: 'endurance',
          type: 'rounds',
          title: 'Core Endurance — 4 Rounds',
          instructions:
            'Four rounds. The most endurance work of the programme. Same quality standards as week one — just a lot more of it.',
          rounds: 4,
          movements: [
            {
              id: 'm1',
              exerciseId: 13, // Plank
              prescription: '40–45s',
              notes:
                'The longest plank hold of the programme. Toes down. Ribs down. Breathe. Do not hold your breath.',
            },
            {
              id: 'm2',
              label: 'Hollow hold',
              prescription: '25s',
              notes:
                'Back flat, legs extended. This is the longest hollow hold of the programme. Bend your knees if the back lifts.',
            },
            {
              id: 'm3',
              exerciseId: 50, // Side Plank
              prescription: '30s each side',
              notes: 'Full position. Top hip forward and up. Breathe steadily.',
            },
            {
              id: 'm4',
              exerciseId: 86, // Sit-ups
              prescription: '15 reps',
              notes: 'Peel up, peel down. Exhale up, inhale down. No rushing.',
            },
            {
              id: 'm5',
              label: 'Single-leg glute bridge',
              prescription: '12 reps each side',
              notes:
                'Three-second hold at the top. Drive through the heel. Hips level. The hardest version of this movement in the programme.',
            },
          ],
        },
        {
          id: 'balance',
          type: 'rounds',
          title: 'Balance Challenge — 3 Rounds',
          instructions:
            'Three rounds this week. More reps, less wall contact. Trust the core work you have built.',
          rounds: 3,
          movements: [
            {
              id: 'm1',
              exerciseId: 93, // Bodyweight Calf Raises
              prescription: '15 reps single-leg',
              notes:
                'Try without wall contact for at least one set this week. Rise slowly, pause at the top, lower with control.',
            },
            {
              id: 'm2',
              label: 'Standing hip circle',
              prescription: '6 circles each direction each side',
              notes:
                'One extra circle. Keep your standing hip still. Core engaged. Eyes on a fixed point to help balance.',
            },
          ],
        },
        {
          id: 'flow',
          type: 'amrap',
          title: 'AMRAP Flow — 12 Minutes',
          instructions:
            'The longest AMRAP of the programme. Final session. Find a steady rhythm and hold it. This is four weeks of work expressed in 12 minutes.',
          minutes: 12,
          movements: [
            {
              id: 'm1',
              label: 'Single-leg stretch (Pilates)',
              prescription: '8 reps each side',
              notes:
                'Full range. Leg extends low. Lower back heavy throughout.',
            },
            {
              id: 'm2',
              label: 'Quadruped thoracic rotation',
              prescription: '6 reps each side',
              notes:
                'Hold at the top for a full breath. Find the full available range.',
            },
            {
              id: 'm3',
              label: 'Hip flexor lunge hold',
              prescription: '30s each side',
              notes:
                'Final time you do this in the programme. Breathe into the stretch. Notice the difference from week one.',
            },
          ],
        },
        cooldownWeek4,
      ],
    },
  ],
};
