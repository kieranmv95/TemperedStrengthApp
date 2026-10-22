import type { RestTimerSurfacePayload } from './restTimerSurfaceTypes';

export async function startRestTimerSurface(
  _payload: RestTimerSurfacePayload
): Promise<void> {
  // Live Activity / lock-screen surfaces are unavailable on this platform.
}

export async function updateRestTimerSurface(
  _payload: RestTimerSurfacePayload
): Promise<void> {
  // Live Activity / lock-screen surfaces are unavailable on this platform.
}

export async function endRestTimerSurface(
  _payload?: RestTimerSurfacePayload
): Promise<void> {
  // Live Activity / lock-screen surfaces are unavailable on this platform.
}

export async function syncRestTimerSurface(
  _payload: RestTimerSurfacePayload | null
): Promise<void> {
  // Live Activity / lock-screen surfaces are unavailable on this platform.
}
