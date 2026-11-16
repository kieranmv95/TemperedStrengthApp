type StrengthRestStarter = (durationSec: number) => void;

let starter: StrengthRestStarter | null = null;

/** GymTimerProvider registers this so program strength rest can open the gym clock. */
export function registerStrengthRestStarter(
  fn: StrengthRestStarter | null
): void {
  starter = fn;
}

export function startStrengthRestOnGymClock(durationSec: number): boolean {
  if (!starter || durationSec <= 0) return false;
  starter(durationSec);
  return true;
}
