import type { ExercisePersonalBestsLedger } from '@/src/types/personalBests';
import {
  blockHasLoadPercentTokens,
  formatLoadPercentSegment,
  parseLoadPercentSegments,
  resolveEstimatedOneRmKg,
  roundLoadToPlateIncrement,
  stringHasLoadPercentTokens,
} from '@/src/utils/loadPercent';

describe('parseLoadPercentSegments', () => {
  it('returns a single text segment when there are no tokens', () => {
    expect(parseLoadPercentSegments('drop the weight by 10%')).toEqual([
      { type: 'text', text: 'drop the weight by 10%' },
    ]);
  });

  it('parses a single percent', () => {
    expect(parseLoadPercentSegments('{{40}}')).toEqual([
      { type: 'load', approx: false, low: 40, high: null },
    ]);
  });

  it('parses a range', () => {
    expect(parseLoadPercentSegments('5 x 5 @ {{72-78}}')).toEqual([
      { type: 'text', text: '5 x 5 @ ' },
      { type: 'load', approx: false, low: 72, high: 78 },
    ]);
  });

  it('parses a tilde percent', () => {
    expect(parseLoadPercentSegments('1 @ {{~90}}')).toEqual([
      { type: 'text', text: '1 @ ' },
      { type: 'load', approx: true, low: 90, high: null },
    ]);
  });

  it('parses an over-100 range', () => {
    expect(parseLoadPercentSegments('{{100-103}}')).toEqual([
      { type: 'load', approx: false, low: 100, high: 103 },
    ]);
  });

  it('parses a ramp ladder with multiple tokens', () => {
    const segments = parseLoadPercentSegments(
      'Roughly {{40}} → {{55}} → {{65}} → {{70}} of estimated 1RM.'
    );
    expect(segments).toEqual([
      { type: 'text', text: 'Roughly ' },
      { type: 'load', approx: false, low: 40, high: null },
      { type: 'text', text: ' → ' },
      { type: 'load', approx: false, low: 55, high: null },
      { type: 'text', text: ' → ' },
      { type: 'load', approx: false, low: 65, high: null },
      { type: 'text', text: ' → ' },
      { type: 'load', approx: false, low: 70, high: null },
      { type: 'text', text: ' of estimated 1RM.' },
    ]);
  });

  it('parses a tilde range', () => {
    expect(parseLoadPercentSegments('{{~95-100}}')).toEqual([
      { type: 'load', approx: true, low: 95, high: 100 },
    ]);
  });
});

describe('stringHasLoadPercentTokens', () => {
  it('detects tokens', () => {
    expect(stringHasLoadPercentTokens('at {{80}}')).toBe(true);
    expect(stringHasLoadPercentTokens('at 80%')).toBe(false);
  });
});

describe('blockHasLoadPercentTokens', () => {
  it('finds tokens in notes and values', () => {
    expect(
      blockHasLoadPercentTokens({
        movements: [
          {
            name: 'Working sets',
            value: '5 x 5 @ {{72-78}}',
            note: 'RPE 7',
          },
        ],
      })
    ).toBe(true);
    expect(
      blockHasLoadPercentTokens({
        movements: [{ name: 'Working sets', value: '5 x 5 @ RPE 7' }],
      })
    ).toBe(false);
  });
});

describe('formatLoadPercentSegment', () => {
  it('formats without a 1RM', () => {
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: false, low: 40, high: null },
        null,
        'kg'
      )
    ).toBe('40%');
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: false, low: 72, high: 78 },
        null,
        'kg'
      )
    ).toBe('72–78%');
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: true, low: 90, high: null },
        null,
        'kg'
      )
    ).toBe('~90%');
  });

  it('formats with a 1RM in kg', () => {
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: false, low: 40, high: null },
        125,
        'kg'
      )
    ).toBe('40% (50kg)');
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: false, low: 72, high: 78 },
        125,
        'kg'
      )
    ).toBe('72–78% (90kg–97.5kg)');
  });

  it('rounds awkward kg fractions to the nearest 0.5', () => {
    expect(
      formatLoadPercentSegment(
        { type: 'load', approx: false, low: 72, high: 78 },
        60,
        'kg'
      )
    ).toBe('72–78% (43kg–47kg)');
  });
});

describe('roundLoadToPlateIncrement', () => {
  it('rounds kg to the nearest 0.5', () => {
    expect(roundLoadToPlateIncrement(43.2, 'kg')).toBe(43);
    expect(roundLoadToPlateIncrement(46.8, 'kg')).toBe(47);
    expect(roundLoadToPlateIncrement(43.25, 'kg')).toBe(43.5);
    expect(roundLoadToPlateIncrement(97.5, 'kg')).toBe(97.5);
  });

  it('rounds lb to the nearest whole', () => {
    expect(roundLoadToPlateIncrement(95.4, 'lb')).toBe(95);
    expect(roundLoadToPlateIncrement(95.6, 'lb')).toBe(96);
  });
});

describe('resolveEstimatedOneRmKg', () => {
  it('returns null for an empty ledger', () => {
    expect(resolveEstimatedOneRmKg({})).toBeNull();
  });

  it('prefers a logged 1RM', () => {
    const ledger: ExercisePersonalBestsLedger = {
      1: [{ id: 'a', weight: 140, achievedAt: '2026-01-01T00:00:00.000Z' }],
      5: [{ id: 'b', weight: 100, achievedAt: '2026-01-01T00:00:00.000Z' }],
    };
    expect(resolveEstimatedOneRmKg(ledger)).toBe(140);
  });

  it('estimates from a 5RM when no 1RM exists', () => {
    const ledger: ExercisePersonalBestsLedger = {
      5: [{ id: 'b', weight: 100, achievedAt: '2026-01-01T00:00:00.000Z' }],
    };
    expect(resolveEstimatedOneRmKg(ledger)).toBeCloseTo(112.5, 1);
  });

  it('ignores 10RM and higher', () => {
    const ledger: ExercisePersonalBestsLedger = {
      10: [{ id: 'c', weight: 80, achievedAt: '2026-01-01T00:00:00.000Z' }],
    };
    expect(resolveEstimatedOneRmKg(ledger)).toBeNull();
  });
});
