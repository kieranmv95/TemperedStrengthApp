/** Formats stored sync timestamps for conflict UI; 0 means unknown / legacy. */
export function formatSyncTimestamp(ts: number): string {
  if (!Number.isFinite(ts) || ts <= 0) {
    return 'Unknown';
  }
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(ts));
  } catch {
    return 'Unknown';
  }
}

export function maxPositiveTimestamp(values: number[]): number {
  const valid = values.filter((t) => Number.isFinite(t) && t > 0);
  if (valid.length === 0) return 0;
  return Math.max(...valid);
}
