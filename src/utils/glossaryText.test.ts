import { getAllExercises } from '@/src/data/exercises';
import { programList } from '@/src/data/programs';
import {
  temperedDailyProgram,
  temperedDailyWorkouts,
} from '@/src/data/temperedDaily';
import { allStandaloneWorkouts } from '@/src/data/workouts';
import {
  findGlossaryHits,
  segmentGlossaryText,
} from '@/src/utils/glossaryText';

const STACKED_DESCRIPTION =
  'Five sets of five on the bench press, all at the same weight. Smooth bar path, same touch point, every rep. Then a chipper that keeps the upper body busy without asking for more heavy pressing.';

const STACKED_STRENGTH =
  'Warm up to your working weight in 3–4 sets, then complete 5 sets of 5 at the same weight. RPE 7 on set 1, RPE 8 by set 5. Touch the chest, pause briefly, press. Use a spotter or safeties. Rest 2–3 mins between sets. Record your working weight in your notes.';

function linkedTerms(text: string): string[] {
  return segmentGlossaryText(text)
    .filter((segment) => segment.type === 'term')
    .map((segment) =>
      segment.type === 'term' ? `${segment.text}→${segment.term.term}` : ''
    );
}

const SKIP_KEYS = new Set([
  'id',
  'type',
  'icon',
  'image',
  'youtube_id',
  'youtubeId',
  'videoUrl',
  'videoId',
  'link',
  'weekStart',
  'logging_type',
  'pattern',
  'equipment',
  'disciplines',
  'levels',
  'format',
  'bodyFocus',
  'categories',
  'goals',
  'difficulty',
  'primaryFocus',
  'otherFocuses',
  'special',
  'collections',
  'partner',
  'allowedRoles',
  'days',
  'daysSplit',
  'logSchema',
  'timerConfig',
  'scale',
  'requireRmId',
  'loadExerciseId',
  'exerciseId',
  'trainingMaxExerciseId',
  'dayIndex',
  'estimatedTime',
  'isPremium',
  'isPro',
  'intensity',
  'sets',
  'repRange',
  'restTimeSeconds',
  'hrZone',
  'rounds',
  'minutes',
  'workSeconds',
  'restSeconds',
  'intervalSec',
  'timeCapSeconds',
  'percentOfTrainingMax',
  'reps',
  'trainingMaxIncrementLb',
]);

function collectStrings(value: unknown, out: string[], seen: Set<unknown>) {
  if (typeof value === 'string') {
    out.push(value);
    return;
  }
  if (value === null || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out, seen);
    return;
  }

  for (const [key, child] of Object.entries(value)) {
    if (SKIP_KEYS.has(key)) continue;
    collectStrings(child, out, seen);
  }
}

function coachingStrings(): string[] {
  const out: string[] = [];
  const seen = new Set<unknown>();
  collectStrings(allStandaloneWorkouts, out, seen);
  collectStrings(temperedDailyWorkouts, out, seen);
  collectStrings(programList, out, seen);
  collectStrings(getAllExercises(), out, seen);
  collectStrings(temperedDailyProgram, out, seen);
  return out;
}

describe('segmentGlossaryText', () => {
  it('links rep and chipper in the Stacked description', () => {
    expect(linkedTerms(STACKED_DESCRIPTION)).toEqual([
      'sets→Sets',
      'rep→Reps',
      'chipper→Chipper',
    ]);
  });

  it('links the strength notes without treating warm-up verbs as sets', () => {
    expect(linkedTerms(STACKED_STRENGTH)).toEqual([
      'sets→Sets',
      'sets→Sets',
      'RPE→RPE',
      'set→Sets',
      'RPE→RPE',
      'set→Sets',
      'spotter→Spotter',
      'safeties→Safeties',
      'sets→Sets',
    ]);
  });

  it('prefers the longer phrase over the single word inside it', () => {
    expect(linkedTerms('Warm-up sets · based on 1RM')).toEqual([
      'Warm-up sets→Warm-up Set',
      '1RM→1RM',
    ]);
    expect(linkedTerms('Working sets at one rep max')).toEqual([
      'Working sets→Working Set',
      'one rep max→1RM',
    ]);
    expect(linkedTerms('WOD: Chipper For Time')).toEqual([
      'WOD→WOD',
      'Chipper→Chipper',
      'For Time→For Time',
    ]);
  });

  it('does not link ordinary English that shares a glossary word', () => {
    expect(linkedTerms('Set up the bar, then set the safeties.')).toEqual([
      'safeties→Safeties',
    ]);
    expect(linkedTerms('Set your pace and set a clock.')).toEqual([]);
    expect(linkedTerms('Complete all work in order.')).toEqual([]);
    expect(linkedTerms('2 mins Box Breathing, then box jumps.')).toEqual([
      'box→Box',
    ]);
    expect(linkedTerms('Press from a dead stop.')).toEqual([]);
    expect(linkedTerms('Record your working weight.')).toEqual([]);
    expect(linkedTerms('Do not bail on depth. Bail to the side.')).toEqual([
      'Bail→Bail',
    ]);
  });
});

describe('glossary coverage in bundled coaching copy', () => {
  it('links real terms and leaves verb-set and rack-sharing phrases alone', () => {
    const counts = new Map<string, number>();
    const problems: string[] = [];

    for (const text of coachingStrings()) {
      for (const hit of findGlossaryHits(text)) {
        counts.set(hit.term.term, (counts.get(hit.term.term) ?? 0) + 1);
        const after = text.slice(hit.end);
        if (
          hit.term.term === 'Sets' &&
          /^set$/i.test(hit.text) &&
          /^\s+(?:up|the|your|yourself|a|an|for|them|those|these)\b/i.test(
            after
          )
        ) {
          problems.push(text.slice(Math.max(0, hit.start - 24), hit.end + 24));
        }
        if (hit.term.term === 'Box' && /^\s+breathing\b/i.test(after)) {
          problems.push(text.slice(Math.max(0, hit.start - 12), hit.end + 16));
        }
        if (hit.term.term === 'Bail' && /^\s+on\b/i.test(after)) {
          problems.push(text.slice(Math.max(0, hit.start - 16), hit.end + 16));
        }
      }
    }

    expect(problems).toEqual([]);
    expect(counts.get('Reps') ?? 0).toBeGreaterThan(100);
    expect(counts.get('Sets') ?? 0).toBeGreaterThan(50);
    expect(counts.get('Chipper') ?? 0).toBeGreaterThan(10);
    expect(counts.get('RPE') ?? 0).toBeGreaterThan(20);
    expect(counts.get('1RM') ?? 0).toBeGreaterThan(20);
    expect(counts.has('Work In')).toBe(false);
  });
});
