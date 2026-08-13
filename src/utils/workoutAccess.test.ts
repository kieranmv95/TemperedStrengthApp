import {
  canAccessWorkout,
  isWorkoutLocked,
  premiumAccessBadgeLabel,
} from '@/src/utils/workoutAccess';

describe('workoutAccess', () => {
  const premium = {
    isPremium: true,
    allowedRoles: ['coach'] as string[],
  };
  const premiumNoRoles = { isPremium: true };
  const free = { isPremium: false };

  it('allows free workouts for everyone', () => {
    expect(canAccessWorkout(free, { isPro: false, roles: [] })).toBe(true);
    expect(isWorkoutLocked(free, { isPro: false, roles: [] })).toBe(false);
  });

  it('allows premium workouts for Pro', () => {
    expect(canAccessWorkout(premium, { isPro: true, roles: [] })).toBe(true);
    expect(canAccessWorkout(premiumNoRoles, { isPro: true, roles: [] })).toBe(
      true
    );
  });

  it('allows premium workouts when the user has an allowed role', () => {
    expect(
      canAccessWorkout(premium, { isPro: false, roles: ['coach'] })
    ).toBe(true);
    expect(
      isWorkoutLocked(premium, { isPro: false, roles: ['coach'] })
    ).toBe(false);
  });

  it('locks premium workouts without Pro or an allowed role', () => {
    expect(canAccessWorkout(premium, { isPro: false, roles: [] })).toBe(false);
    expect(
      canAccessWorkout(premiumNoRoles, { isPro: false, roles: ['coach'] })
    ).toBe(false);
    expect(isWorkoutLocked(premium, { isPro: false, roles: [] })).toBe(true);
  });

  it('labels premium badges with coach when allowed', () => {
    expect(premiumAccessBadgeLabel(['coach'])).toBe('PRO / COACH');
    expect(premiumAccessBadgeLabel(['athlete', 'coach'])).toBe('PRO / COACH');
    expect(premiumAccessBadgeLabel([])).toBe('PRO');
    expect(premiumAccessBadgeLabel(undefined)).toBe('PRO');
  });
});
