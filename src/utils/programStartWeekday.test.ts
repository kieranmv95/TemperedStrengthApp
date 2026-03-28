import {
  isProgramAnchorDate,
  nearestProgramAnchorOnOrAfter,
  normalizeToLocalMidnight,
  programSplitKeyToJsDay,
} from './programStartWeekday';

describe('programSplitKeyToJsDay', () => {
  it('maps split keys to JavaScript getDay() values (Sun=0 … Sat=6)', () => {
    expect(programSplitKeyToJsDay('sun')).toBe(0);
    expect(programSplitKeyToJsDay('mon')).toBe(1);
    expect(programSplitKeyToJsDay('tue')).toBe(2);
    expect(programSplitKeyToJsDay('wed')).toBe(3);
    expect(programSplitKeyToJsDay('thu')).toBe(4);
    expect(programSplitKeyToJsDay('fri')).toBe(5);
    expect(programSplitKeyToJsDay('sat')).toBe(6);
  });
});

describe('normalizeToLocalMidnight', () => {
  it('strips time components', () => {
    const d = new Date(2025, 5, 4, 15, 30, 45, 123);
    const n = normalizeToLocalMidnight(d);
    expect(n.getHours()).toBe(0);
    expect(n.getMinutes()).toBe(0);
    expect(n.getSeconds()).toBe(0);
    expect(n.getMilliseconds()).toBe(0);
    expect(n.getFullYear()).toBe(2025);
    expect(n.getMonth()).toBe(5);
    expect(n.getDate()).toBe(4);
  });
});

describe('isProgramAnchorDate', () => {
  it('returns true when the local weekday matches the anchor', () => {
    // 2 June 2025 is a Monday in local time
    const mon = new Date(2025, 5, 2);
    expect(isProgramAnchorDate(mon, 'mon')).toBe(true);
    expect(isProgramAnchorDate(mon, 'tue')).toBe(false);
  });
});

describe('nearestProgramAnchorOnOrAfter', () => {
  it('returns the same day when already on the anchor weekday', () => {
    const mon = new Date(2025, 5, 2);
    const out = nearestProgramAnchorOnOrAfter(mon, 'mon');
    expect(out.getTime()).toBe(normalizeToLocalMidnight(mon).getTime());
  });

  it('advances to the next matching weekday when later in the week', () => {
    // 4 June 2025 is Wednesday
    const wed = new Date(2025, 5, 4);
    const out = nearestProgramAnchorOnOrAfter(wed, 'mon');
    expect(out.getDay()).toBe(1);
    expect(out.getFullYear()).toBe(2025);
    expect(out.getMonth()).toBe(5);
    expect(out.getDate()).toBe(9);
  });

  it('rolls from Sunday to the following Monday in the same month', () => {
    // 29 June 2025 is Sunday; next Monday is 30 June
    const sun = new Date(2025, 5, 29);
    const out = nearestProgramAnchorOnOrAfter(sun, 'mon');
    expect(out.getDay()).toBe(1);
    expect(out.getFullYear()).toBe(2025);
    expect(out.getMonth()).toBe(5);
    expect(out.getDate()).toBe(30);
  });
});
