import { temperedDailyWorkouts } from '@/src/data/temperedDaily';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  parsePrescribedWeightSegments,
  prescribedWeightToDisplay,
  type PrescribedWeightSegment,
} from '@/src/utils/prescribedWeight';
import type { SingleWorkout, WorkoutMovement } from '@/src/types/workouts';
import { blocksOfWorkout } from '@/src/utils/workoutHrZones';

function weightsIn(text: string, context?: string) {
  return parsePrescribedWeightSegments(text, context).filter(
    (
      segment
    ): segment is Extract<PrescribedWeightSegment, { type: 'weight' }> =>
      segment.type === 'weight'
  );
}

function joined(text: string, context?: string): string {
  return parsePrescribedWeightSegments(text, context)
    .map((segment) => (segment.type === 'text' ? segment.text : segment.label))
    .join('');
}

describe('parsePrescribedWeightSegments', () => {
  it('links a men’s/women’s barbell pair and keeps the surrounding copy', () => {
    const text = '21 Deadlifts (70kg/50kg)';
    expect(weightsIn(text)).toEqual([
      {
        type: 'weight',
        label: '70kg/50kg',
        male: 70,
        female: 50,
        unit: 'kg',
      },
    ]);
    expect(joined(text)).toBe(text);
  });

  it('links a unit written once, an m/f pair, and an @ load', () => {
    expect(weightsIn('30 clean & jerks (61/43kg).')[0]).toMatchObject({
      label: '61/43kg',
      male: 61,
      female: 43,
    });
    expect(weightsIn('(70m/47.5f)kg')).toEqual([
      {
        type: 'weight',
        label: '(70m/47.5f)kg',
        male: 70,
        female: 47.5,
        unit: 'kg',
      },
    ]);
    expect(joined('16 Cleans @ 50kg')).toBe('16 Cleans @ 50kg');
    expect(weightsIn('16 Cleans @ 50kg')).toEqual([
      {
        type: 'weight',
        label: '50kg',
        male: 50,
        female: null,
        unit: 'kg',
      },
    ]);
  });

  it('uses the movement name when the note is only the load', () => {
    expect(weightsIn('22.5/15kg.', 'Alternating Dumbbell Snatch')).toEqual([]);
    expect(weightsIn('102/70kg', 'Deadlift')[0]).toMatchObject({
      male: 102,
      female: 70,
    });
  });

  it('leaves non-barbell implements and load jumps as plain text', () => {
    const plain = [
      '40 Wall Balls (9kg/7kg)',
      '15 American Kettlebell Swings (20kg/12kg)',
      '20 Dual KB Thrusters (2x24kg/16kg)',
      '30 Double Dumbbell Thrusters (22.5kg/15kg)',
      '4x8m Sandbag Carry (70kg/50kg)',
      '20m OH Plate Walking Lunges (20kg/15kg)',
      '2 x 15/10kg.',
      '1×15/10kg',
      'take 5kg off',
      'Jump 2.5–5kg.',
      'e.g. 4 × 60kg = 240',
      '100 Wall Balls (YGIG, 4kg)',
      '20lb Vest',
      '400m Sandbag Carry (20/30kg)',
    ];
    for (const text of plain) {
      expect(weightsIn(text)).toEqual([]);
      expect(joined(text)).toBe(text);
    }
    expect(weightsIn('16/12kg.', 'Single Arm Overhead Carry')).toEqual([]);
    expect(weightsIn('9/6kg.', 'Medicine Ball Slam')).toEqual([]);
    expect(weightsIn('70/50kg. No sandbag? Heavy kettlebell.')).toEqual([]);
  });

  it('links a snatch load named in its own sentence', () => {
    const text =
      "Complete all reps in order for time. Snatch load: 60kg/40kg. Score = finish time, or 'cap' if you do not finish.";
    expect(weightsIn(text)[0]).toMatchObject({ label: '60kg/40kg' });
  });

  it('still links the bar when a pull-up bar is named in the same line', () => {
    const text = '50 thrusters (20/15kg), then 30 pull-ups on the pull-up bar.';
    expect(weightsIn(text)[0]).toMatchObject({
      label: '20/15kg',
      male: 20,
      female: 15,
    });
  });
});

describe('prescribedWeightToDisplay', () => {
  it('keeps kilograms and rounds pounds to the pound', () => {
    expect(prescribedWeightToDisplay(42.5, 'kg', 'kg')).toBe(42.5);
    expect(prescribedWeightToDisplay(70, 'kg', 'lb')).toBe(154);
    expect(prescribedWeightToDisplay(50, 'kg', 'lb')).toBe(110);
  });
});

const NON_BARBELL =
  /\b(?:kettlebells?|dumbbells?|wall\s*balls?|medicine\s*balls?|med\s*balls?|sandbags?|farmers?|goblets?|vests?|devil\s*press(?:es)?|slams?|plates?)\b|\b(?:kb|db|sb)s?\b/i;

const BARBELL_CUE =
  /\b(?:barbells?|bars?|deadlifts?|cleans?|snatch(?:es)?|squats?|jerks?|thrusters?|ohs|overhead\s+squats?|shoulder\s+to\s+overhead)\b/i;

const CANDIDATE =
  /(?:\d+(?:\.\d+)?(?:kg|lb)\/\d+(?:\.\d+)?(?:kg|lb)|\(?\d+(?:\.\d+)?m\/\d+(?:\.\d+)?f\)?(?:kg|lb)|\d+(?:\.\d+)?\/\d+(?:\.\d+)?(?:kg|lb)|@\s*\d+(?:\.\d+)?(?:kg|lb))/i;

const RENDERED_FIELDS = new Set([
  'instructions',
  'highlight',
  'movement',
  'value',
  'note',
  'divider',
]);

type WeightHit = {
  id: string;
  field: string;
  label: string;
  scope: string;
};

function consider(
  hits: WeightHit[],
  misses: string[],
  workout: SingleWorkout,
  field: string,
  text: string | undefined,
  context?: string
) {
  if (!text) {
    return;
  }
  const scope = [context, text].filter(Boolean).join(' | ');
  const found = weightsIn(text, context);
  for (const weight of found) {
    hits.push({
      id: workout.id,
      field,
      label: weight.label,
      scope,
    });
  }
  const cueScope = scope.replace(/\bpull[-\s]?up bars?\b/gi, ' ');
  const implementPair = /[12]\s*[x×]\s*\d/.test(text);
  if (
    found.length === 0 &&
    !implementPair &&
    CANDIDATE.test(text) &&
    BARBELL_CUE.test(cueScope) &&
    !NON_BARBELL.test(scope)
  ) {
    misses.push(`${workout.id} ${field}: ${text}`);
  }
}

function auditWorkouts(workouts: SingleWorkout[]) {
  const hits: WeightHit[] = [];
  const misses: string[] = [];
  for (const workout of workouts) {
    consider(hits, misses, workout, 'description', workout.description);
    for (const block of blocksOfWorkout(workout)) {
      consider(hits, misses, workout, 'name', block.name);
      consider(hits, misses, workout, 'instructions', block.instructions);
      consider(hits, misses, workout, 'highlight', block.highlightInstructions);
      for (const movement of block.movements ?? []) {
        visitMovement(hits, misses, workout, movement);
      }
    }
  }
  return { hits, misses };
}

function visitMovement(
  hits: WeightHit[],
  misses: string[],
  workout: SingleWorkout,
  movement: WorkoutMovement
) {
  if (typeof movement === 'string') {
    consider(hits, misses, workout, 'movement', movement);
    return;
  }
  if ('type' in movement) {
    consider(hits, misses, workout, 'divider', movement.note);
    return;
  }
  consider(hits, misses, workout, 'value', movement.value, movement.name);
  consider(hits, misses, workout, 'note', movement.note, movement.name);
}

describe('prescribed barbell loads across workouts', () => {
  const { hits, misses } = auditWorkouts([
    ...allStandaloneWorkouts,
    ...temperedDailyWorkouts,
  ]);

  it('links every barbell prescription the detail screen can show', () => {
    expect(misses).toEqual([]);
    const offScreen = hits.filter((hit) => !RENDERED_FIELDS.has(hit.field));
    expect(offScreen).toEqual([]);
  });

  it('does not treat kettlebells, dumbbells, balls, sandbags, or plates as a bar', () => {
    const wrongImplement = hits.filter((hit) => NON_BARBELL.test(hit.scope));
    expect(wrongImplement).toEqual([]);
  });

  it('covers the benchmark and Rainhill loads', () => {
    const labels = new Set(hits.map((hit) => `${hit.id} ${hit.label}`));
    expect(labels.has('rh_10 70kg/50kg')).toBe(true);
    expect(labels.has('f_34 61/43kg')).toBe(true);
    expect(labels.has('f_36 20/15kg')).toBe(true);
    expect(labels.has('f_38 102/70kg')).toBe(true);
    expect(labels.has('f_46 (70m/47.5f)kg')).toBe(true);
    expect(labels.has('p_03 (43m/30f)kg')).toBe(true);
    expect(hits.some((hit) => hit.label === '110kg')).toBe(true);
    expect(hits.length).toBeGreaterThan(40);
  });

  it('matches the audited barbell loads', () => {
    const lines = [
      ...new Set(hits.map((hit) => `${hit.id} ${hit.field} ${hit.label}`)),
    ].sort();
    expect(lines).toMatchSnapshot();
  });
});
