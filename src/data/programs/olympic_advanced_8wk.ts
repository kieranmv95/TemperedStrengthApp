import type { Exercise, Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  title: 'Olympic Performance Warm-Up',
  additionalDescription:
    'A complete warm-up earns the heavy work. 8 weeks of heavy snatching demands properly prepared wrists, shoulders, and ankles - do not cut this short.',
  description: [
    '5-minute cardio of choice (rower or bike preferred). Get the heart rate up, not winded.',
    '90s each: wrist circles, ankle rocks, thoracic spine openers, hip flexor stretch, deep squat hold with prying.',
    '3 sets of 5 muscle cleans + 5 front squats + 5 overhead squats with the empty bar. Deliberate and slow.',
    "Ramp the day's main lift through 4-5 progressive singles from empty bar to your first working weight.",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 8-WEEK PEAKING ARC
//
// This program peaks for measurable 1RM PRs in the Snatch and Clean & Jerk.
// It is structured as a classic 4-phase peaking cycle:
//
//   ACCUMULATION    (W1-3)   Volume + positional strength. 70-78%.
//   INTENSIFICATION (W4-6)   Heavy doubles → singles. 80-88%.
//   REALIZATION     (W7)     Peaking. 90% singles + 95% opener. Volume drops.
//   TEST            (W8)     D1 Snatch 1RM, D2 C&J 1RM, D3 Competition
//                            Simulation (3 attempts at each lift - a second
//                            shot at a heavier PR).
//
// All percentages reference the lifter's CURRENT 1RM. Day 1's snatch variant
// switches from Hang Snatch (W1-3) to Full Snatch (W4-7) when intensification
// begins - hang work in the accumulation phase builds the second pull and
// positional strength under load before we ask for maximal speed under the bar.
//
// In the accumulation phase Day 1 also includes Snatch Balance as a secondary
// primer - a pure catch-speed drill that grooves the bottom position under
// dynamic load. It drops out in the intensification phase to keep session
// volume in check once Full Snatch becomes the main lift.
//
// Test week (W8) strips out every accessory. The warm-up and the main lift
// only - the lifter's job is to find a new 1RM, nothing else.
// ─────────────────────────────────────────────────────────────────────────────

type Phase = 'Accumulation' | 'Intensification' | 'Peaking' | 'Test';

const phaseFor = (week: number): Phase => {
  if (week <= 2) return 'Accumulation';
  if (week <= 5) return 'Intensification';
  if (week === 6) return 'Peaking';
  return 'Test';
};

type WorkSpec = Pick<
  Exercise,
  | 'sets'
  | 'repRange'
  | 'restTimeSeconds'
  | 'additionalHeader'
  | 'additionalDescription'
  | 'hideReps'
>;

// ─────────────────────────────────────────────────────────────────────────────
// Day 1 Main Lift - Snatch progression.
// W1-3: Hang Snatch (positional strength + second pull).
// W4-7: Full Snatch (maximal speed under the bar).
// W8:   Snatch 1RM.
// Percentages reference best FULL SNATCH.
// ─────────────────────────────────────────────────────────────────────────────
const day1SnatchLift = (week: number): { id: number; spec: WorkSpec } => {
  switch (week) {
    case 0:
      return {
        id: 59,
        spec: {
          sets: 4,
          repRange: [3, 3],
          restTimeSeconds: 150,
          additionalHeader: 'Hang Snatch - 4×3 @ 65% of Snatch',
          additionalDescription:
            'Warm-up: empty bar → 40% → 50% → 60%. Working: 4×3 at 65% of best Snatch. Hang isolates the second pull. Bar tight to the hips, fast brush, aggressive overhead turnover. Vertical bar path.',
        },
      };
    case 1:
      return {
        id: 59,
        spec: {
          sets: 4,
          repRange: [3, 3],
          restTimeSeconds: 150,
          additionalHeader: 'Hang Snatch - 4×3 @ 70% of Snatch',
          additionalDescription:
            'Warm-up: empty bar → 40% → 55% → 65%. Working: 4×3 at 70%. The bar speed of rep 3 should match rep 1 - if it slows, you are over your working weight.',
        },
      };
    case 2:
      return {
        id: 59,
        spec: {
          sets: 4,
          repRange: [3, 3],
          restTimeSeconds: 150,
          additionalHeader: 'Hang Snatch - 4×3 @ 73% of Snatch',
          additionalDescription:
            'Warm-up: empty bar → 45% → 60% → 70%. Working: 4×3 at 73% - the top of the accumulation phase. Last heavy hang work before the switch to the full lift. Sharp turnover.',
        },
      };
    case 3:
      return {
        id: 57,
        spec: {
          sets: 5,
          repRange: [2, 2],
          restTimeSeconds: 180,
          additionalHeader: 'Full Snatch - 5×2 @ 80%',
          additionalDescription:
            'Warm-up: empty bar → 50% → 65% → 75%. Working: 5×2 at 80%. Switch to the full lift. Maximal speed under the bar. Punch overhead, meet the bar in a locked-out bottom position.',
        },
      };
    case 4:
      return {
        id: 57,
        spec: {
          sets: 5,
          repRange: [2, 2],
          restTimeSeconds: 180,
          additionalHeader: 'Full Snatch - 5×2 @ 85%',
          additionalDescription:
            'Warm-up: empty bar → 50% → 65% → 75% → 82%. Working: 5×2 at 85%. Singles speed under doubles load. If you miss a rep, drop 5kg and finish the set.',
        },
      };
    case 5:
      return {
        id: 57,
        spec: {
          sets: 5,
          repRange: [1, 1],
          restTimeSeconds: 180,
          additionalHeader: 'Full Snatch - 5×1 @ 88%',
          additionalDescription:
            'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 5×1 at 88%. Last week of true volume work. Every single should look identical.',
        },
      };
    case 6:
      return {
        id: 57,
        spec: {
          sets: 5,
          repRange: [1, 1],
          restTimeSeconds: 240,
          additionalHeader: 'Full Snatch - 4×1 @ 90% + 1×1 @ 95% Opener',
          additionalDescription:
            'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 4 singles at 90%, then 1 single at 95% - this is your competition opener for next week. Bail if speed dies.',
        },
      };
    case 7:
      return {
        id: 57,
        spec: {
          sets: 1,
          repRange: [1, 1],
          restTimeSeconds: 300,
          hideReps: true,
          additionalHeader: '1RM TEST',
          additionalDescription:
            'Test day. Warm-up singles: 40% → 55% → 70% → 80% → 87% → 92%. Then attempt your opener (95-100% of current PR). From there, climb in the smallest plate increments your gym has - biscuits, fractionals, change plates, whatever the gym calls them. Stop on the first miss or when bar speed dies. 3-5 min rest between heavy attempts. The competition simulation later this week is your second chance if today does not land. This is the payoff.',
        },
      };
    default:
      return {
        id: 57,
        spec: { sets: 1, repRange: [1, 1], restTimeSeconds: 180 },
      };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Day 2 Main Lift - Clean & Jerk progression. Percentages of best C&J.
// ─────────────────────────────────────────────────────────────────────────────
const day2CleanJerk = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 70%',
        additionalDescription:
          'Warm-up: empty bar → 40% → 55% → 65%. Working: 4×2 at 70%. Two cleans then a jerk per set - re-rack between the clean and the jerk every time. Practice the breath and the reset.',
      };
    case 1:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 75%',
        additionalDescription:
          'Warm-up: empty bar → 45% → 60% → 70%. Working: 4×2 at 75%. Elbows high in the rack of the clean - the jerk dip needs a solid shelf. Vertical drive.',
      };
    case 2:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 78%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 4×2 at 78%. End of accumulation. The jerk should feel automatic by now - drive, split, lock.',
      };
    case 3:
      return {
        sets: 5,
        repRange: [2, 2],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×2 @ 80%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 5×2 at 80%. Volume jumps to 10 working reps. Aggressive turnover on the clean, no creep forward in the jerk dip.',
      };
    case 4:
      return {
        sets: 5,
        repRange: [2, 2],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×2 @ 85%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82%. Working: 5×2 at 85%. If a jerk presses out or a clean stalls, treat the next rep as your last and end the set.',
      };
    case 5:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×1 @ 88%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 5×1 at 88%. Five quality singles. Walk away from missed lifts - we are 1 week from peaking.',
      };
    case 6:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 240,
        additionalHeader: 'Clean & Jerk - 4×1 @ 90% + 1×1 @ 95% Opener',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 4 singles at 90%, then 1 opener at 95%. The 95% lift is your competition opener for next week - it should feel solid, not maximal.',
      };
    case 7:
      return {
        sets: 1,
        repRange: [1, 1],
        restTimeSeconds: 300,
        hideReps: true,
        additionalHeader: '1RM TEST',
        additionalDescription:
          'Test day. Warm-up singles: 40% → 55% → 70% → 80% → 87% → 92%. Then attempt your opener (95-100% of current PR). From there, climb in the smallest plate increments available - biscuits, fractionals, change plates. Stop on the first miss. 3-5 min rest between heavy attempts. Clean must be stable before the jerk - bail if the rack collapses. The competition simulation later this week is your second shot at a heavier PR.',
      };
    default:
      return { sets: 1, repRange: [1, 1], restTimeSeconds: 180 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Front Squat - the primary strength engine. % of best Front Squat 1RM.
// Programmed every week W1-7. Skipped in W8 (test week) - the legs need to
// be fresh for the Snatch 1RM (Mon), C&J 1RM (Wed), and competition simulation
// (Fri).
// ─────────────────────────────────────────────────────────────────────────────
const frontSquatLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 5,
        repRange: [5, 5],
        restTimeSeconds: 150,
        additionalHeader: 'Front Squat - 5×5 @ 70%',
        additionalDescription:
          'Warm-up: empty bar → 40% → 55% → 65%. Working: 5×5 at 70%. Elbows high, chest tall. Treat every rep like you are recovering from a heavy clean.',
      };
    case 1:
      return {
        sets: 5,
        repRange: [5, 5],
        restTimeSeconds: 150,
        additionalHeader: 'Front Squat - 5×5 @ 75%',
        additionalDescription:
          'Warm-up: empty bar → 45% → 60% → 70%. Working: 5×5 at 75%. The work set. If your elbows drop or the bar slides forward on rep 4 or 5, drop weight next week.',
      };
    case 2:
      return {
        sets: 5,
        repRange: [5, 5],
        restTimeSeconds: 180,
        additionalHeader: 'Front Squat - 5×5 @ 78%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 5×5 at 78%. Peak accumulation volume. 25 reps at 78% is a lot of work - do not grind. Stop the set if a rep slows.',
      };
    case 3:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 180,
        additionalHeader: 'Front Squat - 4×3 @ 82%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 80%. Working: 4×3 at 82%. Reps drop, load climbs. Tight rack, big breath, drive the elbows up.',
      };
    case 4:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 180,
        additionalHeader: 'Front Squat - 4×3 @ 85%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82%. Working: 4×3 at 85%. Heaviest triples of the cycle. Belt is optional - if you use one, use it from set 1.',
      };
    case 5:
      return {
        sets: 3,
        repRange: [2, 2],
        restTimeSeconds: 210,
        additionalHeader: 'Front Squat - 3×2 @ 88%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 3×2 at 88%. Heavy doubles. Drive out of the hole hard - any forward lean compounds.',
      };
    case 6:
      return {
        sets: 2,
        repRange: [2, 2],
        restTimeSeconds: 240,
        additionalHeader: 'Front Squat - 2×2 @ 90%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 2×2 at 90%. Final heavy squat session before the test week. Keep it sharp - this is a primer for fresh legs next week, not a max.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Overhead Squat (D1 positional primer). % of best Snatch.
// W1-3: 3×5 at 70/75/78% - groove the catch under volume.
// W4-6: 3×3 at 80/85/88% - heavier, position under load.
// W7:   2×3 at 88% - taper into test week.
// W8:   SKIP - warm-up primer is enough.
// ─────────────────────────────────────────────────────────────────────────────
const overheadSquatLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 3,
        repRange: [5, 5],
        restTimeSeconds: 120,
        additionalHeader: 'OHS Primer - 3×5 @ 70% of Snatch',
        additionalDescription:
          'Warm-up to 70%: empty bar → 50% → 65%. Working: 3×5 at 70% of best Snatch. Stretch the bar apart to engage the lats. Vertical torso, weight balanced over mid-foot.',
      };
    case 1:
      return {
        sets: 3,
        repRange: [5, 5],
        restTimeSeconds: 120,
        additionalHeader: 'OHS Primer - 3×5 @ 75% of Snatch',
        additionalDescription:
          'Warm-up to 75%: empty bar → 55% → 70%. Working: 3×5 at 75%. Pause 1 second at the bottom of every rep.',
      };
    case 2:
      return {
        sets: 3,
        repRange: [5, 5],
        restTimeSeconds: 120,
        additionalHeader: 'OHS Primer - 3×5 @ 78% of Snatch',
        additionalDescription:
          'Warm-up to 78%: empty bar → 55% → 70%. Working: 3×5 at 78%. Last volume week before the switch to lower reps.',
      };
    case 3:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'OHS - 3×3 @ 80% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 55% → 70% → 78%. Working: 3×3 at 80%. Heavier load, fewer reps. Same position.',
      };
    case 4:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'OHS - 3×3 @ 85% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 55% → 70% → 80%. Working: 3×3 at 85%. The bottom position must be rigid - any wobble at this weight tells you the catch is your limiter.',
      };
    case 5:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 150,
        additionalHeader: 'OHS - 3×3 @ 88% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 55% → 70% → 80% → 85%. Working: 3×3 at 88%. Heaviest OHS work of the cycle.',
      };
    case 6:
      return {
        sets: 2,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'OHS Taper - 2×3 @ 80% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 55% → 70%. Working: 2×3 at 80%. Volume drops into the test week. The position is grooved - this is just a primer.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Snatch Balance (D1 secondary primer, accumulation phase only). % of best
// Snatch. Pure catch-speed drill - press the bar overhead from the shoulders,
// then drop into a full overhead squat. Builds confidence in the bottom
// position under dynamic load. Drops out from W4 onward to keep volume in
// check once the Full Snatch becomes the main lift.
// ─────────────────────────────────────────────────────────────────────────────
const snatchBalanceLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch Balance - 3×3 @ 50% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 35% → 45%. Working: 3×3 at 50% of best Snatch. Press the bar overhead, drop fast into a full overhead squat. Punch the elbows up, meet the bar at the bottom. Pure catch-speed drill.',
      };
    case 1:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch Balance - 3×3 @ 55% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 40% → 50%. Working: 3×3 at 55%. The bottom catch must be rigid - any wobble at this load tells you the catch is your limiter.',
      };
    case 2:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch Balance - 3×3 @ 60% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 40% → 50%. Working: 3×3 at 60%. Heaviest Snatch Balance work. Last week before the Full Snatch becomes the focus on D1 - drill the catch position one more time.',
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Snatch High Pull (D1). % of best Snatch. Pulls are overloaded relative to
// the full lift - that is the entire point of pulls in Olympic programming.
// ─────────────────────────────────────────────────────────────────────────────
const snatchHighPullLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch HP - 4×3 @ 95% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 60% → 80%. Working: 4×3 at 95% of best Snatch. Pulls are overloaded relative to the lift. Traps to ears, elbows high and outside.',
      };
    case 1:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch HP - 4×3 @ 100% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 60% → 80% → 90%. Working: 4×3 at 100% of best Snatch. Build the finish - this is the weight you cannot yet snatch but you can pull.',
      };
    case 2:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch HP - 4×3 @ 105% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 60% → 85% → 95%. Working: 4×3 at 105%. Overload. If the bar will not reach mid-chest with high elbows, drop the load.',
      };
    case 3:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch HP - 3×3 @ 105% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 60% → 85% → 95%. Working: 3×3 at 105%. Reduced sets - main lift is the priority now.',
      };
    case 4:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 150,
        additionalHeader: 'Snatch HP - 3×3 @ 110% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 65% → 90% → 100%. Working: 3×3 at 110%. Heaviest pulls of the cycle. Hips finish before the arms pull.',
      };
    case 5:
      return {
        sets: 3,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Snatch HP - 3×2 @ 110% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 65% → 90% → 100%. Working: 3×2 at 110%. Reps drop to keep the bar moving fast.',
      };
    case 6:
      return {
        sets: 2,
        repRange: [2, 2],
        restTimeSeconds: 120,
        additionalHeader: 'Snatch HP Taper - 2×2 @ 95% of Snatch',
        additionalDescription:
          'Warm-up: empty bar → 65% → 85%. Working: 2×2 at 95%. Deload pulls into the test week. Sharp, fast, light enough to feel snappy.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Clean High Pull (D2). % of best Clean.
// ─────────────────────────────────────────────────────────────────────────────
const cleanHighPullLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Clean HP - 4×3 @ 90% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 60% → 75%. Working: 4×3 at 90% of best Clean. Triple extension first, then high elbows. The bar climbs to lower chest.',
      };
    case 1:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Clean HP - 4×3 @ 95% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 60% → 80%. Working: 4×3 at 95%. Hips finish before the arms pull. Any early arm bend kills the lift.',
      };
    case 2:
      return {
        sets: 4,
        repRange: [3, 3],
        restTimeSeconds: 120,
        additionalHeader: 'Clean HP - 4×3 @ 100% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 60% → 80% → 90%. Working: 4×3 at 100%. Top of the accumulation phase.',
      };
    case 3:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 150,
        additionalHeader: 'Clean HP - 3×3 @ 100% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 60% → 80% → 90%. Working: 3×3 at 100%. Reduced sets - C&J is the priority now.',
      };
    case 4:
      return {
        sets: 3,
        repRange: [3, 3],
        restTimeSeconds: 150,
        additionalHeader: 'Clean HP - 3×3 @ 105% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 65% → 85% → 95%. Working: 3×3 at 105%. Overload - heavier than your best clean. Stay tight, do not round.',
      };
    case 5:
      return {
        sets: 3,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean HP - 3×2 @ 105% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 65% → 85% → 95%. Working: 3×2 at 105%. Reps drop, intent stays sharp.',
      };
    case 6:
      return {
        sets: 2,
        repRange: [2, 2],
        restTimeSeconds: 120,
        additionalHeader: 'Clean HP Taper - 2×2 @ 90% of Clean',
        additionalDescription:
          'Warm-up: empty bar → 65% → 80%. Working: 2×2 at 90%. Light taper pulls before the test week.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Day 3 Snatch (Full Snatch, all weeks). Slightly lighter than Day 1 in the
// intensification phase - Day 1 owns the heaviest snatch work.
// ─────────────────────────────────────────────────────────────────────────────
const day3SnatchLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Full Snatch - 4×2 @ 70%',
        additionalDescription:
          'Warm-up: empty bar → 45% → 60% → 65%. Working: 4×2 at 70%. Full lift practice while the hang work on D1 builds strength. Bar path is everything.',
      };
    case 1:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Full Snatch - 4×2 @ 75%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 72%. Working: 4×2 at 75%. Consistent foot landing - same width every rep.',
      };
    case 2:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Full Snatch - 4×2 @ 78%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 4×2 at 78%. End of accumulation. The full lift should feel locked-in by now.',
      };
    case 3:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Full Snatch - 5×1 @ 80%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 5×1 at 80%. Singles competition style. Set up, breathe, execute.',
      };
    case 4:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Full Snatch - 5×1 @ 85%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82%. Working: 5×1 at 85%. Walk away from missed lifts - we are building consistency, not chasing PRs.',
      };
    case 5:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Full Snatch - 5×1 @ 88%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 5×1 at 88%. Last volume week. Every single must look the same.',
      };
    case 6:
      return {
        sets: 3,
        repRange: [1, 1],
        restTimeSeconds: 240,
        additionalHeader: 'Full Snatch - 3×1 @ 90% + 1×1 @ 95% Opener',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 3 singles at 90%, then 1 opener at 95%. Final heavy snatch session before the test.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Day 3 Clean & Jerk. Same progression shape as Day 3 Snatch.
// ─────────────────────────────────────────────────────────────────────────────
const day3CleanJerkLoad = (week: number): WorkSpec => {
  switch (week) {
    case 0:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 70%',
        additionalDescription:
          'Warm-up: empty bar → 45% → 60% → 65%. Working: 4×2 at 70%. Two cleans then a jerk. Drive through the heels on the clean; vertical drive in the jerk.',
      };
    case 1:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 75%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 72%. Working: 4×2 at 75%. Reset between the clean and the jerk. Find your jerk grip every time.',
      };
    case 2:
      return {
        sets: 4,
        repRange: [2, 2],
        restTimeSeconds: 150,
        additionalHeader: 'Clean & Jerk - 4×2 @ 78%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 4×2 at 78%. Last accumulation session. Smooth on the clean, sharp on the jerk.',
      };
    case 3:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×1 @ 80%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75%. Working: 5×1 at 80%. Singles. Clean, breathe, jerk. No rush.',
      };
    case 4:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×1 @ 85%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82%. Working: 5×1 at 85%. The jerk often fails before the clean at this load - drive vertically, do not let the chest dip forward.',
      };
    case 5:
      return {
        sets: 5,
        repRange: [1, 1],
        restTimeSeconds: 180,
        additionalHeader: 'Clean & Jerk - 5×1 @ 88%',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 5×1 at 88%. Last heavy C&J before test week.',
      };
    case 6:
      return {
        sets: 3,
        repRange: [1, 1],
        restTimeSeconds: 240,
        additionalHeader: 'Clean & Jerk - 3×1 @ 90% + 1×1 @ 95% Opener',
        additionalDescription:
          'Warm-up: empty bar → 50% → 65% → 75% → 82% → 88%. Working: 3 singles at 90%, then 1 opener at 95%. The 95% lift is your competition opener.',
      };
    case 7:
      return {
        sets: 0,
        repRange: [0, 0],
        restTimeSeconds: 0,
      };
    default:
      return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Bulgarian Split Squat (D3). Unilateral work - prevents side-to-side
// imbalance in the squat catch. Volume tapers through the cycle.
// ─────────────────────────────────────────────────────────────────────────────
const bulgarianSplitSquatLoad = (week: number): WorkSpec => {
  if (week <= 2) {
    return {
      sets: 3,
      repRange: [8, 10],
      restTimeSeconds: 90,
      additionalHeader: 'BSS - 3×8-10 each leg',
      additionalDescription:
        'Heavy dumbbells. Stay upright - any forward lean turns this into a lunge. The rear leg is for balance, the front leg is the lift.',
    };
  }
  if (week <= 5) {
    return {
      sets: 3,
      repRange: [6, 8],
      restTimeSeconds: 90,
      additionalHeader: 'BSS - 3×6-8 each leg',
      additionalDescription:
        'Heavier weight, fewer reps. Pause 1 second at the bottom of every rep. Drive through the heel of the front foot.',
    };
  }
  if (week === 6) {
    return {
      sets: 2,
      repRange: [6, 6],
      restTimeSeconds: 90,
      additionalHeader: 'BSS Taper - 2×6 each leg',
      additionalDescription:
        'Volume drops into the test week. Same load as W5-6, half the volume.',
    };
  }
  return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
};

// ─────────────────────────────────────────────────────────────────────────────
// Romanian Deadlift (D3). Eccentric hamstring strength + posterior chain
// resilience for the first pull off the floor.
// ─────────────────────────────────────────────────────────────────────────────
const romanianDeadliftLoad = (week: number): WorkSpec => {
  if (week <= 2) {
    return {
      sets: 3,
      repRange: [8, 8],
      restTimeSeconds: 90,
      additionalHeader: 'RDL - 3×8 @ 60-70% of Deadlift',
      additionalDescription:
        'Moderate load. 3 second eccentric. Push the hips back hard - this is a hinge, not a squat. Bar travels in a straight line down the thighs.',
    };
  }
  if (week <= 5) {
    return {
      sets: 3,
      repRange: [6, 6],
      restTimeSeconds: 120,
      additionalHeader: 'RDL - 3×6 @ 70-80% of Deadlift',
      additionalDescription:
        'Heavier load, controlled tempo. Stop at mid-shin or wherever you lose the neutral spine. Hamstring stretch is the cue.',
    };
  }
  if (week === 6) {
    return {
      sets: 2,
      repRange: [5, 5],
      restTimeSeconds: 90,
      additionalHeader: 'RDL Taper - 2×5 @ 65% of Deadlift',
      additionalDescription:
        'Light taper into the test week. The hamstrings need to be fresh for the first pull when you test next week.',
    };
  }
  return { sets: 0, repRange: [0, 0], restTimeSeconds: 0 };
};

// ─────────────────────────────────────────────────────────────────────────────
// Build a workout's exercise list. Exercises with sets === 0 are filtered
// out - that's how we drop accessories in test week / front squat on test
// week D2 / etc.
// ─────────────────────────────────────────────────────────────────────────────
const buildExercise = (id: number, spec: WorkSpec): Exercise | null => {
  if (spec.sets === 0) return null;
  return {
    type: 'exercise',
    id,
    sets: spec.sets,
    repRange: spec.repRange,
    restTimeSeconds: spec.restTimeSeconds,
    ...(spec.additionalHeader && { additionalHeader: spec.additionalHeader }),
    ...(spec.additionalDescription && {
      additionalDescription: spec.additionalDescription,
    }),
    ...(spec.hideReps && { hideReps: spec.hideReps }),
  };
};

const phaseLabel = (week: number): string =>
  week === 7 ? 'TEST' : phaseFor(week);

export const olympic_advanced_8wk: Program = {
  isPro: true,
  id: 'oly_adv_01',
  name: 'Advanced Olympic Performance',
  description:
    '8-Week peaking cycle for new Snatch and Clean & Jerk 1RMs. Four phases - Accumulation, Intensification, Peaking, and a Test Week that ends with a 3-attempt competition simulation. Every working set lists the exact percentage of your 1RM.',
  bodyChangesSummary:
    'You will move faster under the bar and pull heavier off the floor. Eight weeks of structured peaking should sharpen your snatch and clean & jerk technique, build explosive power through your hips and legs, and leave you ready to test new 1RMs in the final week.',
  categories: ['olympic'],
  goals: ['stronger', 'athletic', 'mobility'],
  difficulty: 'advanced',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60m',
  workouts: Array.from({ length: 8 }).flatMap((_, week) => {
    const isTestWeek = week === 7;
    const phase = phaseLabel(week);

    // Intensity scales with the phase. Test week is 10 across all days; in
    // earlier weeks D1 sits at the phase base, D2 +1, D3 +2 (capped at 10).
    const baseIntensity =
      phase === 'Accumulation' ? 7 : phase === 'Intensification' ? 8 : 9;

    const day1Snatch = day1SnatchLift(week);

    // ─────────────────────────────────────────────
    // DAY 1 - Snatch & Pull
    //
    // OHS → Snatch Balance (W1-3 only, accumulation primer) → Snatch (Hang
    // in W1-3, Full in W4-7) → Snatch High Pull → Face Pulls.
    // ─────────────────────────────────────────────
    const day1Exercises = [
      standard_warmup,
      buildExercise(61, overheadSquatLoad(week)),
      buildExercise(60, snatchBalanceLoad(week)),
      buildExercise(day1Snatch.id, day1Snatch.spec),
      buildExercise(62, snatchHighPullLoad(week)),
      !isTestWeek && {
        type: 'exercise' as const,
        id: 35,
        sets: 3,
        repRange: [12, 15] as [number, number],
        restTimeSeconds: 60,
        canSwap: true,
        additionalHeader: 'Face Pulls - Shoulder Health',
        additionalDescription:
          'Rotator cuff and rear delt work. 8 weeks of heavy overhead lifting demands counterbalanced pulling. Pull rope to the forehead, emphasise external rotation at the end.',
      },
    ].filter(Boolean) as (Exercise | Warmup)[];

    // ─────────────────────────────────────────────
    // DAY 2 - Clean & Jerk + Front Squat
    // ─────────────────────────────────────────────
    const day2Exercises = [
      standard_warmup,
      buildExercise(63, day2CleanJerk(week)),
      buildExercise(68, frontSquatLoad(week)),
      buildExercise(69, cleanHighPullLoad(week)),
      !isTestWeek && {
        type: 'exercise' as const,
        id: 11,
        sets: 3,
        repRange: [8, 12] as [number, number],
        restTimeSeconds: 90,
        canSwap: true,
        additionalHeader: 'Lat Pulldown - Pulling Support',
        additionalDescription:
          'Lats are the brakes of the snatch and clean. Slow 3-second eccentric. Pull to upper chest, squeeze at the bottom.',
      },
      !isTestWeek && {
        type: 'exercise' as const,
        id: 86,
        sets: 3,
        repRange: [10, 15] as [number, number],
        restTimeSeconds: 60,
        additionalHeader: 'Core Finisher - Sit-ups',
        additionalDescription:
          'Exhale as you sit up. Chin tucked. Feel the abs initiate the movement rather than yanking with the hip flexors.',
      },
    ].filter(Boolean) as (Exercise | Warmup)[];

    // ─────────────────────────────────────────────
    // DAY 3 - The Total / Competition Simulation on test week
    //
    // In W1-7 this is the integration session: Full Snatch + C&J + accessories.
    // In W8 (test week) this is a competition simulation - 3 attempts at the
    // Snatch followed by 3 attempts at the Clean & Jerk, exactly like a real
    // meet. The user has already PRed Snatch on D1 and C&J on D2 - today
    // gives them a second shot at a heavier PR.
    // ─────────────────────────────────────────────
    const day3Exercises: (Exercise | Warmup)[] = isTestWeek
      ? [
          standard_warmup,
          {
            type: 'exercise' as const,
            id: 57,
            sets: 3,
            repRange: [1, 1] as [number, number],
            restTimeSeconds: 300,
            hideReps: true,
            additionalHeader: 'Snatch - 3 Competition Attempts',
            additionalDescription:
              'Competition simulation. Three attempts at the Snatch, just like a real meet. Warm up to your opener (~95% of the Snatch 1RM you hit earlier this week), make it, then climb in the smallest plate increments your gym has - biscuits, fractionals, change plates. Stop on the first miss. 3-5 min rest between attempts. This is your second shot at a heavier Snatch PR.',
          },
          {
            type: 'exercise' as const,
            id: 63,
            sets: 3,
            repRange: [1, 1] as [number, number],
            restTimeSeconds: 300,
            hideReps: true,
            additionalHeader: 'Clean & Jerk - 3 Competition Attempts',
            additionalDescription:
              'Competition simulation. Three attempts at the Clean & Jerk after the Snatches, just like a real meet. Re-warm to your C&J opener (~95% of the C&J 1RM you hit earlier this week). Same protocol: opener → smallest plate jump → smallest plate jump. Stop on the first miss. 3-5 min rest between attempts. Second shot at a heavier C&J PR.',
          },
        ]
      : ([
          standard_warmup,
          buildExercise(57, day3SnatchLoad(week)),
          buildExercise(63, day3CleanJerkLoad(week)),
          buildExercise(6, bulgarianSplitSquatLoad(week)),
          buildExercise(22, romanianDeadliftLoad(week)),
          {
            type: 'exercise' as const,
            id: 13,
            sets: 3,
            repRange: [45, 60] as [number, number],
            restTimeSeconds: 60,
            additionalHeader: 'Anti-Extension Core',
            additionalDescription:
              'Pull elbows toward toes to engage the deep core. Protects the lower back when catching heavy weights overhead.',
          },
        ].filter(Boolean) as (Exercise | Warmup)[]);

    return [
      {
        dayIndex: week * 7 + 0,
        label: isTestWeek
          ? `TEST WEEK - Snatch 1RM (Week ${week + 1})`
          : `Day 1: Snatch & Pull (Week ${week + 1} - ${phase})`,
        description: isTestWeek
          ? 'Build to a new Snatch 1RM. The payoff.'
          : phase === 'Peaking'
            ? 'Peaking - heavy singles and the 95% opener.'
            : phase === 'Intensification'
              ? 'Heavy snatching - speed under the bar.'
              : 'Snatch complexes and technical volume.',
        intensity: isTestWeek ? 10 : baseIntensity,
        exercises: day1Exercises,
      },
      {
        dayIndex: week * 7 + 2,
        label: isTestWeek
          ? `TEST WEEK - Clean & Jerk 1RM (Week ${week + 1})`
          : `Day 2: C&J + Front Squat (Week ${week + 1} - ${phase})`,
        description: isTestWeek
          ? 'Build to a new Clean & Jerk 1RM. The payoff.'
          : 'Leg drive, front rack recovery, and pulling support.',
        intensity: isTestWeek ? 10 : Math.min(baseIntensity + 1, 10),
        exercises: day2Exercises,
      },
      {
        dayIndex: week * 7 + 4,
        label: isTestWeek
          ? `TEST WEEK - Competition Simulation (Week ${week + 1})`
          : `Day 3: The Total (Week ${week + 1} - ${phase})`,
        description: isTestWeek
          ? '3 Snatch attempts then 3 C&J attempts - a second shot at a heavier PR.'
          : 'Full competition lifts and structural balance work.',
        intensity: isTestWeek ? 10 : Math.min(baseIntensity + 2, 10),
        exercises: day3Exercises,
      },
    ];
  }),
};
