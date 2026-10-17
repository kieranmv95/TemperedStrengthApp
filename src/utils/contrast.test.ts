import { contrastRatio, flattenToHex, parseColor } from '@/src/utils/contrast';

describe('contrast', () => {
  it('parses short hex, long hex and rgba', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#0E0E10')).toEqual({ r: 14, g: 14, b: 16, a: 1 });
    expect(parseColor('rgba(212, 185, 122, 0.12)')).toEqual({
      r: 212,
      g: 185,
      b: 122,
      a: 0.12,
    });
  });

  it('matches WCAG reference ratios', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 5);
    expect(contrastRatio('#FFFFFF', '#FFFFFF')).toBeCloseTo(1, 5);
    expect(contrastRatio('#777777', '#FFFFFF')).toBeCloseTo(4.48, 2);
  });

  it('is symmetric', () => {
    expect(contrastRatio('#D4B97A', '#17171A')).toBeCloseTo(
      contrastRatio('#17171A', '#D4B97A'),
      5
    );
  });

  it('flattens translucent foregrounds onto the background', () => {
    expect(flattenToHex('rgba(255, 255, 255, 0.5)', '#000000')).toBe('#808080');
    expect(contrastRatio('rgba(0, 0, 0, 0)', '#123456')).toBeCloseTo(1, 5);
  });

  it('rejects translucent backgrounds and unknown formats', () => {
    expect(() => contrastRatio('#fff', 'rgba(0, 0, 0, 0.5)')).toThrow();
    expect(() => parseColor('red')).toThrow();
  });
});
