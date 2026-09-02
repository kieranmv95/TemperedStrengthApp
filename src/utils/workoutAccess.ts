import type { SingleWorkout } from '@/src/types/workouts';

export const COACH_ROLE = 'coach';

export type WorkoutAccessInput = {
  isPro: boolean;
  roles: string[];
};

/**
 * Premium workouts unlock for Pro subscribers, or for any role listed on
 * `workout.allowedRoles` (e.g. coach on skill sessions).
 */
export function canAccessWorkout(
  workout: Pick<SingleWorkout, 'isPremium' | 'allowedRoles'>,
  access: WorkoutAccessInput
): boolean {
  if (!workout.isPremium) {
    return true;
  }
  if (access.isPro) {
    return true;
  }
  const allowedRoles = workout.allowedRoles;
  if (!allowedRoles || allowedRoles.length === 0) {
    return false;
  }
  return allowedRoles.some((role) => access.roles.includes(role));
}

export function isWorkoutLocked(
  workout: Pick<SingleWorkout, 'isPremium' | 'allowedRoles'>,
  access: WorkoutAccessInput
): boolean {
  return !canAccessWorkout(workout, access);
}

/** Badge copy for premium content that may also unlock for listed roles. */
export function premiumAccessBadgeLabel(
  allowedRoles?: readonly string[]
): string {
  if (allowedRoles?.includes(COACH_ROLE)) {
    return 'PRO / COACH';
  }
  return 'PRO';
}
