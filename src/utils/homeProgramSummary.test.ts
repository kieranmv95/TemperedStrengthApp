import { formatHomeProgramSessionMeta } from '@/src/utils/homeProgramSummary';

describe('formatHomeProgramSessionMeta', () => {
  it('shows only sessions left when nothing is marked', () => {
    expect(
      formatHomeProgramSessionMeta({
        sessionsCompleted: 0,
        sessionsSkipped: 0,
        sessionsRemaining: 11,
      })
    ).toBe('11 sessions left');
  });

  it('includes completed and singular skip when present', () => {
    expect(
      formatHomeProgramSessionMeta({
        sessionsCompleted: 2,
        sessionsSkipped: 1,
        sessionsRemaining: 8,
      })
    ).toBe('2 completed · 1 skip · 8 sessions left');
  });

  it('singularizes sessions left', () => {
    expect(
      formatHomeProgramSessionMeta({
        sessionsCompleted: 1,
        sessionsSkipped: 0,
        sessionsRemaining: 1,
      })
    ).toBe('1 completed · 1 session left');
  });

  it('pluralizes skips', () => {
    expect(
      formatHomeProgramSessionMeta({
        sessionsCompleted: 1,
        sessionsSkipped: 2,
        sessionsRemaining: 4,
      })
    ).toBe('1 completed · 2 skips · 4 sessions left');
  });
});
