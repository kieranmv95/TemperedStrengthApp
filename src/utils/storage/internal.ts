// Shared write primitives for the storage domain modules.
//
// AsyncStorage runs in a single JS process, so a per-key promise chain is enough
// to serialize read-modify-write sequences and prevent the "two callers read the
// same blob, last write wins" data loss. Cross-device conflicts are a separate
// concern handled by the sync layer (`SyncManager.decideWinner`).
import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncRemoveItem, syncSetItem } from '@/src/sync/syncStorage';

const chains = new Map<string, Promise<unknown>>();

/**
 * Serializes `fn` against other locked operations on the same `key`. Operations
 * on different keys still run concurrently. The stored chain swallows rejections
 * so one failing operation does not block subsequent ones, while the returned
 * promise still rejects for the caller.
 */
export function withKeyLock<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const prev = chains.get(key) ?? Promise.resolve();
  const next = prev.then(fn, fn);
  chains.set(
    key,
    next.catch(() => undefined)
  );
  return next;
}

/**
 * Atomically read-modify-write a single key. `parse` turns the raw stored string
 * (or null) into the working value; `mutator` returns the next value, or `null`
 * to remove the key entirely.
 */
export async function mutate<T>(
  key: string,
  parse: (raw: string | null) => T,
  mutator: (current: T) => T | null
): Promise<void> {
  await withKeyLock(key, async () => {
    const raw = await AsyncStorage.getItem(key);
    const next = mutator(parse(raw));
    if (next === null) {
      if (raw !== null) {
        await syncRemoveItem(key);
      }
      return;
    }
    const serialized = JSON.stringify(next);
    // Skip redundant writes so a no-op mutation does not churn the sync layer.
    if (serialized === raw) {
      return;
    }
    await syncSetItem(key, serialized);
  });
}

/**
 * Parse a stored JSON object map, returning an empty object for a missing key.
 * Throws on malformed JSON so a corrupt blob is surfaced rather than silently
 * overwritten during a mutation.
 */
export function parseJsonMap<T>(raw: string | null): T {
  return (raw ? JSON.parse(raw) : {}) as T;
}

/**
 * Parse a stored JSON array, returning an empty array for a missing key.
 */
export function parseJsonArray<T>(raw: string | null): T[] {
  return (raw ? JSON.parse(raw) : []) as T[];
}
