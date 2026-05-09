/**
 * Shared throttle so RevenueCat-backed subscription state is not refetched on
 * every tab focus (avoids flicker on free-tier / upgrade UI on Home and Settings).
 */
const SUBSCRIPTION_REFRESH_COOLDOWN_MS = 30 * 60 * 1000;

let lastSubscriptionRefreshAt = 0;

/**
 * Returns true at most once per cooldown window (shared across all callers).
 * When true, the caller should run subscription `refresh()`.
 */
export function tryConsumeSubscriptionRefreshCooldown(): boolean {
  const now = Date.now();
  if (now - lastSubscriptionRefreshAt > SUBSCRIPTION_REFRESH_COOLDOWN_MS) {
    lastSubscriptionRefreshAt = now;
    return true;
  }
  return false;
}
