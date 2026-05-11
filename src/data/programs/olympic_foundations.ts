import type { Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  title: 'Olympic Lift Warm-Up',
  additionalDescription:
    'Olympic lifts demand a properly prepared body. Do not skip the empty-bar primer - it warms the joints and rehearses the patterns you are about to load.',
  description: [
    '3-minute cardio of choice (row, bike, or skip). Get warm, not winded.',
    '30s each: wrist circles, ankle rocks, thoracic openers, hip flexor stretch, deep squat hold.',
    '3 sets of 5 muscle cleans + 5 front squats + 5 overhead squats with the empty bar. The same complex every session - it tells you exactly how warm you are today.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4-WEEK LOADING ARC
//
// This program is technique-first. The Snatch and Clean & Jerk are the most
// technical lifts in strength sport - load is earned by movement quality, not
// the other way around. The 4-week arc:
//
//   Week 1 - TECHNIQUE WEEK    Empty or light bar. Build the pattern.
//   Week 2 - LIGHT BUILD       ~40-55% of 1RM (or "comfortable"). Bar speed.
//   Week 3 - MODERATE BUILD    ~60-70%. Working weights. Same rep every rep.
//   Week 4 - HEAVY TECHNICAL   ~70-85%. Heavy technical single - NOT a 1RM.
//
// Each exercise's additionalHeader carries the week's load label so the user
// sees the intent at a glance. The additionalDescription explains the load
// in both % of 1RM (for users with a recorded max) and subjective terms (for
// users new to the lift) - then layers the technique cue on top.
// ─────────────────────────────────────────────────────────────────────────────

type Load = {
  header: string;
  description: string;
};

// Day 1 - Overhead Squat (positional primer before Hang Snatch).
// OHS for a beginner is typically 40-60% of their back squat. We stay well
// below that ceiling - this lift is here to groove the catch position, not
// build raw squat strength.
const overheadSquatLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Skill Focus',
        description:
          "Empty or light bar on every set. Pause 2 seconds at the bottom. The goal is to own the position - elbows locked, lats engaged, bar stacked directly over mid-foot. Slow down, the bar isn't going anywhere.",
      };
    case 1:
      return {
        header: 'Light - ~30-40% of Back Squat',
        description:
          'Small plates only. Roughly 30-40% of your back squat 1RM if you know it, otherwise a weight you could squat for 10 clean reps. The bar should feel weightless overhead - if your arms shake, you are too heavy.',
      };
    case 2:
      return {
        header: 'Moderate - ~45-55% of Back Squat',
        description:
          'Around 45-55% of your back squat 1RM, or a weight that feels solid but controllable for 5 reps. Pause 1 second at the bottom of every rep. Confidence in the bottom position is the whole point.',
      };
    case 3:
      return {
        header: 'Build to a Heavy 3 - ~55-65%',
        description:
          'Across the 3 sets, work up to a heavy but technically perfect triple - around 55-65% of your back squat 1RM. The moment the bar drifts forward or the torso collapses, you have found your stop point. Do not grind an OHS.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 1 - Hang Snatch. The hang position removes the floor pull so the user
// can focus on the second pull and the catch. Numbers below are % of best
// SNATCH (not back squat).
const hangSnatchLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Pattern Build',
        description:
          "Empty or light bar on every set. Focus on the 'brush' at the hips and a vertical bar path. Punch your arms up aggressively so you finish overhead with locked elbows. Repetition builds the pattern - do not rush to add weight.",
      };
    case 1:
      return {
        header: 'Light - ~40-55% of Snatch',
        description:
          'Light. Around 40-55% of your best snatch if you have one - otherwise the heaviest weight where bar speed stays sharp. The rule: if the bar slows on the way up, you are too heavy. Step on the platform with intent.',
      };
    case 2:
      return {
        header: 'Moderate - ~55-65% of Snatch',
        description:
          'Moderate working triples at 55-65% of your best snatch. Every rep should look identical - same setup, same rhythm, same finish. Consistency, not load. If rep 3 looks worse than rep 1, you are too heavy.',
      };
    case 3:
      return {
        header: 'Build to a Heavy 3 - ~65-75%',
        description:
          'Build across the sets to a top triple at 65-75% of your best snatch. The final set is heavy but technically perfect. The rule: if you would miss the rep with the next 5 kg, you have arrived at your top set.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 1 - Snatch High Pull. The pull is overloaded relative to the full lift
// - that is the entire point of pulls in Olympic programming. Numbers below
// are % of best SNATCH.
const snatchHighPullLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Triple Extension',
        description:
          'Empty or light bar. Drill the triple extension - ankles, knees, and hips fire in sequence, then high elbows pull the bar to chest height. Slow rep, fast finish.',
      };
    case 1:
      return {
        header: 'Light-Moderate - ~60-70% of Snatch',
        description:
          'Heavier than your Hang Snatch - around 60-70% of your snatch 1RM, or whatever lets you reach mid-chest height with high elbows. The pull should feel slightly overloaded.',
      };
    case 2:
      return {
        header: 'Moderate - ~70-80% of Snatch',
        description:
          'Around 70-80% of your snatch 1RM. The pull is the focus today: hips finish, bar climbs to chest, elbows lead. If the elbows drop or the bar swings forward, drop the weight.',
      };
    case 3:
      return {
        header: 'Heavy - ~80-90% of Snatch',
        description:
          'Around 80-90% of your snatch 1RM. This is your heaviest pull of the week. The pull is overloaded relative to the Snatch on purpose - it builds the finish that lets you eventually move heavier full lifts.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 2 - Hang Clean. Numbers are % of best CLEAN.
const hangCleanLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Elbow Turnover',
        description:
          'Empty or light bar on every set. The whole point this week is the elbow turnover - a fast, aggressive whip of the elbows around the bar to land in a high front rack. Build the pattern before you load it.',
      };
    case 1:
      return {
        header: 'Light - ~50-60% of Clean',
        description:
          'Light. Around 50-60% of your best clean. The cue: bar floats, then disappears - your elbows turn over so quickly the bar barely moves at the end of the pull.',
      };
    case 2:
      return {
        header: 'Moderate - ~60-70% of Clean',
        description:
          'Moderate working triples at 60-70% of your best clean. Sharp, fast reps. If the elbows drop or you have to muscle the bar into the rack, the weight is too heavy.',
      };
    case 3:
      return {
        header: 'Build to a Heavy 3 - ~70-80%',
        description:
          'Build across the sets to a heavy triple at 70-80% of your best clean. The final set should be technically clean (pun intended) - no missing the rack, no soft elbows.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 2 - Split Jerk. Numbers are % of best JERK (or best clean & jerk).
const splitJerkLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Footwork',
        description:
          'Empty or light bar on every set. The session is about the split landing - front shin vertical, back knee soft, weight balanced 60/40 front to back. Drill it slow before you ever load it.',
      };
    case 1:
      return {
        header: 'Light - ~50-60% of Jerk',
        description:
          'Light. Around 50-60% of your best jerk. Drive the bar straight up, drop fast into the split. The dip should be vertical - no chest dive forward, no leaning back.',
      };
    case 2:
      return {
        header: 'Moderate - ~60-70% of Jerk',
        description:
          'Around 60-70% of your best jerk. Doubles. Build comfort under bigger loads, but bail the moment a press-out begins - if the bar finishes overhead with bent elbows, the rep is past your limit.',
      };
    case 3:
      return {
        header: 'Build to a Heavy 2 - ~70-80%',
        description:
          'Build across the sets to a heavy double at 70-80% of your best jerk. Land it locked out and balanced - if your back foot drifts or you press the bar out, the rep is past your limit.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 2 - Front Squat. The engine of Olympic lifting. Numbers are % of best
// BACK SQUAT - front squat is typically 75-90% of back squat for trained
// lifters, so we sit safely below the comparable %.
const frontSquatLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Light - ~50% of Back Squat',
        description:
          'Light. Around 50% of your back squat 1RM. The whole week sets the front rack tolerance you will need later in the program. Elbows high, chest tall, breathe through the full rep.',
      };
    case 1:
      return {
        header: 'Moderate - ~55-65% of Back Squat',
        description:
          'Around 55-65% of your back squat 1RM. Add 5 kg between sets only if the front rack holds and the elbows stay high through all 5 reps.',
      };
    case 2:
      return {
        header: 'Moderate-Heavy - ~65-72% of Back Squat',
        description:
          'Around 65-72% of your back squat 1RM. The work set. If your elbows collapse or chest dives forward on rep 4 or 5, you have found your weight.',
      };
    case 3:
      return {
        header: 'Build to a Heavy 5 - ~70-78%',
        description:
          'Build across the 4 sets to a heavy 5-rep set at 70-78% of your back squat 1RM. Treat the last set like you mean it - but do not grind. Front Squats grind ugly and that posture transfers straight into your clean catches.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 2 - Seated Cable Row (back support / front-rack reinforcement).
const seatedCableRowLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Light - Pattern Focus',
        description:
          'Light weight. Focus on a full, controlled squeeze. Shoulder blades back and down, hold for 1 second at the contracted position. This is back tonic work - the form is the lift.',
      };
    case 1:
      return {
        header: 'Moderate - Build Tonic',
        description:
          'Moderate weight. 10-12 clean reps with no body english. You should feel your mid-back working, not your lower back. If the lower back starts to take over, drop the weight.',
      };
    case 2:
      return {
        header: 'Moderate-Heavy - Push Volume',
        description:
          'Moderate-heavy. Pick a weight where the last 2-3 reps are challenging but the form does not break. Squeeze hard at the back of every rep.',
      };
    case 3:
      return {
        header: 'Back Off - Moderate',
        description:
          'Back off to a moderate weight in the heavy week. The job here is recovery and back support - not stress. Save the intensity for the bar work earlier in the session.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 3 - Full Snatch. Numbers are % of best SNATCH.
const fullSnatchLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Add the Catch',
        description:
          'Empty or light bar. This week you add the full catch - pull, pull yourself under, and receive the bar in a full overhead squat. Slow on the catch, fast on the pull. Take your time.',
      };
    case 1:
      return {
        header: 'Light Singles - ~50-60%',
        description:
          'Light singles at 50-60% of your best snatch. The catch must be perfectly stacked - if you have to step the feet to recover, lower the load on the next set.',
      };
    case 2:
      return {
        header: 'Moderate Singles - ~60-70%',
        description:
          "Working singles at 60-70% of your best snatch. This is the working range for the day. Every rep should be a 'make' - no missed lifts allowed today.",
      };
    case 3:
      return {
        header: 'Heavy Technical Single - ~70-85%',
        description:
          'Build across the 5 sets to a heavy but technically perfect single at 70-85% of your best snatch. This is NOT a 1RM test - the rep must look identical to every rep that came before it. Stop the moment technique breaks.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 3 - Clean & Jerk. Numbers are % of best C&J.
const cleanJerkLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Full Sequence',
        description:
          'Empty or light bar. This is the first session you put the two halves together. Catch the clean, breathe, jerk. Be deliberate - pause 2 seconds in the rack to confirm balance before the dip.',
      };
    case 1:
      return {
        header: 'Light Doubles - ~50-60%',
        description:
          'Light doubles at 50-60% of your best clean & jerk. Re-rack the bar between the clean and the jerk; that pause is the lift. Set up the same way every time.',
      };
    case 2:
      return {
        header: 'Moderate Singles - ~60-75%',
        description:
          'Working singles at 60-75% of your best clean & jerk. Every rep is a competition rep. Set up the same way every time. Reset your grip and breath between the clean and the jerk.',
      };
    case 3:
      return {
        header: 'Heavy Technical Single - ~70-85%',
        description:
          'Build across the 5 sets to a heavy technical single at 70-85% of your best clean & jerk. Bail the moment the rack collapses or the jerk drifts forward overhead. Walking away from a missed lift is a win - this is a foundations program, not a meet.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 3 - Clean High Pull. Numbers are % of best CLEAN.
const cleanHighPullLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Mechanics',
        description:
          'Empty or light bar. Drill the clean-grip pull. Triple extension first, then high elbows. The bar should reach lower chest height. Slow down to learn it.',
      };
    case 1:
      return {
        header: 'Moderate - ~60-70% of Clean',
        description:
          'Around 60-70% of your clean 1RM. Heavier than the lift it is supporting - pulls should overload the finish.',
      };
    case 2:
      return {
        header: 'Moderate-Heavy - ~70-85%',
        description:
          'Around 70-85% of your clean 1RM. Sharp, fast pulls. If you cannot get the bar to mid-chest with high elbows, drop the weight - a slow pull rehearses a slow lift.',
      };
    case 3:
      return {
        header: 'Heavy - ~85-95%',
        description:
          'Around 85-95% of your clean 1RM. The heaviest pull in your program this week. Treat it like a clean attempt without the catch - same setup, same intent, just no receiving position at the top.',
      };
    default:
      return { header: '', description: '' };
  }
};

// Day 3 - Good Mornings (posterior chain finisher). Stay light all program -
// this is accessory work, not a hinge max.
const goodMorningLoad = (week: number): Load => {
  switch (week) {
    case 0:
      return {
        header: 'Empty/Light Bar - Hinge Pattern',
        description:
          'Empty or light bar. This week is about the hinge pattern - push the hips back, keep a soft bend in the knees, neutral spine. Find the hamstring stretch at the bottom and own it.',
      };
    case 1:
      return {
        header: 'Light - Move With Control',
        description:
          'Light. Add small plates only if the hinge stays clean. Good Mornings expose bad backs - if your lower back rounds, drop the weight immediately.',
      };
    case 2:
      return {
        header: 'Light-Moderate - ~25-35% of Back Squat',
        description:
          'Light-moderate, capped at roughly 25-35% of your back squat 1RM. Tempo: 3 seconds down, then drive the hips through the bar.',
      };
    case 3:
      return {
        header: 'Hold the Load',
        description:
          'Hold at the same load as week 3 - Good Mornings are an accessory in this program, not a main lift. The week is heavy enough already. Focus on the stretch and the controlled hip drive.',
      };
    default:
      return { header: '', description: '' };
  }
};

export const olympic_foundations: Program = {
  isPro: false,
  id: 'oly_01',
  name: 'Olympic Foundations',
  description:
    '4-Week technique-first foundation for the Snatch and Clean & Jerk. Week 1 is empty/light-bar skill work; Week 4 builds to a heavy technical single - NOT a 1RM test. Bar speed and movement quality are the limits, not load. Every exercise lists exact loading guidance per week (in % of 1RM and in plain language).',
  categories: ['olympic'],
  goals: ['stronger', 'athletic', 'mobility'],
  difficulty: 'intermediate',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => {
    const baseIntensity = 7 + Math.floor(week / 2);

    return [
      // ─────────────────────────────────────────────
      // DAY 1 - Snatch Focus
      //
      // Order rationale:
      //   1. Overhead Squat is the positional primer for the catch - it must
      //      come BEFORE the Hang Snatch, never after.
      //   2. Hang Snatch is the main technical lift.
      //   3. Snatch High Pull overloads the second pull to build the finish.
      //   4. Plank closes out with bracing work that protects the spine
      //      under overhead loading.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 0,
        label: `Day 1: Snatch Focus (Week ${week + 1})`,
        description:
          'Technical Snatch day focusing on the overhead catch and vertical pull.',
        intensity: baseIntensity,
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 61, // Overhead Squat
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 90,
            additionalHeader: overheadSquatLoad(week).header,
            additionalDescription: overheadSquatLoad(week).description,
          },
          {
            type: 'exercise',
            id: 59, // Hang Snatch
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalHeader: hangSnatchLoad(week).header,
            additionalDescription: hangSnatchLoad(week).description,
          },
          {
            type: 'exercise',
            id: 62, // Snatch High Pull
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: snatchHighPullLoad(week).header,
            additionalDescription: snatchHighPullLoad(week).description,
          },
          {
            type: 'exercise',
            id: 13, // Plank
            sets: 3,
            repRange: [45, 60],
            restTimeSeconds: 60,
            additionalHeader: 'Anti-Extension Core',
            additionalDescription:
              "Hold a strict plank. Do not just 'hold' it - actively pull your elbows toward your toes to engage the deep core. A rock-solid core prevents the back-arching that leads to missed lifts and shoulder pain under overhead load.",
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 2 - Clean & Jerk Focus
      //
      // Day 2 sits at baseIntensity + 1 because the Clean & Jerk is the most
      // demanding session of the week - two consecutive Olympic movements,
      // front rack squatting, and pulling all in one day.
      //
      // Seated Cable Row provides direct upper-back work to support the front
      // rack position; Hanging Leg Raise builds hip-flexor strength for
      // pulling yourself under the bar.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 2,
        label: `Day 2: Clean & Jerk Focus (Week ${week + 1})`,
        description:
          'Focusing on the front rack position and leg drive for the Jerk.',
        intensity: Math.min(baseIntensity + 1, 10),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 65, // Hang Clean
            sets: 3,
            repRange: [3, 3],
            restTimeSeconds: 120,
            additionalHeader: hangCleanLoad(week).header,
            additionalDescription: hangCleanLoad(week).description,
          },
          {
            type: 'exercise',
            id: 66, // Split Jerk
            sets: 3,
            repRange: [2, 3],
            restTimeSeconds: 120,
            additionalHeader: splitJerkLoad(week).header,
            additionalDescription: splitJerkLoad(week).description,
          },
          {
            type: 'exercise',
            id: 68, // Front Squat
            sets: 4,
            repRange: [5, 5],
            restTimeSeconds: 150,
            additionalHeader: frontSquatLoad(week).header,
            additionalDescription: frontSquatLoad(week).description,
          },
          {
            type: 'exercise',
            id: 30, // Seated Cable Row
            sets: 3,
            repRange: [10, 12],
            restTimeSeconds: 90,
            additionalHeader: seatedCableRowLoad(week).header,
            additionalDescription: seatedCableRowLoad(week).description,
          },
          {
            type: 'exercise',
            id: 31, // Hanging Leg Raise
            sets: 3,
            repRange: [10, 15],
            restTimeSeconds: 60,
            additionalHeader: 'Hip-Flexor Strength',
            additionalDescription:
              'Strengthens the hip flexors and lower abs - vital for pulling yourself under the bar quickly. Slow and controlled, no swing. If you cannot get the legs to parallel without kipping, do tucked knee raises instead.',
          },
        ],
      },

      // ─────────────────────────────────────────────
      // DAY 3 - Full Classic Lifts
      //
      // Day 3 is the integration session - both classic lifts in their full
      // form, plus the heaviest pull of the week and a posterior chain
      // finisher. Week 4 peaks here at intensity 10.
      //
      // Note: Week 4 is described as "Heavy Technical Singles" not "Max
      // Singles". This is a foundations program - the user is building the
      // skill, not testing it. A 1RM attempt is reserved for the Advanced
      // Olympic Performance program.
      // ─────────────────────────────────────────────
      {
        dayIndex: week * 7 + 4,
        label: `Day 3: Full Classic Lifts (Week ${week + 1})`,
        description:
          week === 3
            ? 'Heavy Technical Week: build to a heavy but perfect single. Not a 1RM.'
            : 'Integrating the full movements at moderate intensity.',
        intensity: week === 3 ? 10 : Math.min(baseIntensity + 1, 10),
        exercises: [
          standard_warmup,
          {
            type: 'exercise',
            id: 57, // Full Snatch
            sets: 5,
            repRange: week === 3 ? [1, 2] : [2, 3],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalHeader: fullSnatchLoad(week).header,
            additionalDescription: fullSnatchLoad(week).description,
          },
          {
            type: 'exercise',
            id: 63, // Clean & Jerk
            sets: 5,
            repRange: week === 3 ? [1, 1] : [1, 2],
            restTimeSeconds: week === 3 ? 180 : 150,
            additionalHeader: cleanJerkLoad(week).header,
            additionalDescription: cleanJerkLoad(week).description,
          },
          {
            type: 'exercise',
            id: 69, // Clean High Pull
            sets: 3,
            repRange: [3, 5],
            restTimeSeconds: 120,
            additionalHeader: cleanHighPullLoad(week).header,
            additionalDescription: cleanHighPullLoad(week).description,
          },
          {
            type: 'exercise',
            id: 42, // Good Mornings
            sets: 3,
            repRange: [8, 10],
            restTimeSeconds: 90,
            additionalHeader: goodMorningLoad(week).header,
            additionalDescription: goodMorningLoad(week).description,
          },
        ],
      },
    ];
  }),
};
