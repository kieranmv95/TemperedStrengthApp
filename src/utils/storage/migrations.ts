// One-time, ordered storage migrations.
//
// Migrations run once per device at app launch, BEFORE the sync manager starts
// mirroring (see app/_layout.tsx). They write through plain AsyncStorage rather
// than the sync helpers so normalizing local data does not churn iCloud
// timestamps or spuriously win conflicts against a device on a newer version.
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SCHEMA_VERSION_KEY,
  SWAP_COUNT_KEY,
  SWAP_COUNT_MONTH_KEY,
  SWAP_COUNT_STATE_KEY,
  WORKOUT_NOTES_KEY,
} from './keys';

type Migration = {
  version: number;
  run: () => Promise<void>;
};

/**
 * v1: Normalize `workout_notes` to the canonical `{ [dayIndex]: string }` map.
 * Older builds may have stored an array or a `{ text: string }` object value;
 * this collapses them so reads no longer need shape coercion.
 */
async function normalizeWorkoutNotes(): Promise<void> {
  const raw = await AsyncStorage.getItem(WORKOUT_NOTES_KEY);
  if (!raw) {
    return;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }

  const coerce = (value: unknown): string | null => {
    if (typeof value === 'string') {
      return value;
    }
    if (
      typeof value === 'object' &&
      value !== null &&
      'text' in value &&
      typeof (value as { text?: unknown }).text === 'string'
    ) {
      return (value as { text: string }).text;
    }
    return null;
  };

  const out: Record<number, string> = {};

  if (Array.isArray(parsed)) {
    parsed.forEach((value, idx) => {
      const text = coerce(value);
      if (text !== null) {
        out[idx] = text;
      }
    });
  } else if (typeof parsed === 'object' && parsed !== null) {
    for (const [key, value] of Object.entries(
      parsed as Record<string, unknown>
    )) {
      const dayIndex = parseInt(key, 10);
      const text = coerce(value);
      if (!Number.isNaN(dayIndex) && text !== null) {
        out[dayIndex] = text;
      }
    }
  } else {
    return;
  }

  await AsyncStorage.setItem(WORKOUT_NOTES_KEY, JSON.stringify(out));
}

/**
 * v2: Fold the separate `swap_count` and `swap_count_month` keys into a single
 * `swap_count_state` JSON value so the monthly swap budget can never partially
 * write (count without month, or vice versa).
 */
async function foldSwapCountState(): Promise<void> {
  const existing = await AsyncStorage.getItem(SWAP_COUNT_STATE_KEY);
  if (existing) {
    return;
  }

  const [countRaw, monthRaw] = await Promise.all([
    AsyncStorage.getItem(SWAP_COUNT_KEY),
    AsyncStorage.getItem(SWAP_COUNT_MONTH_KEY),
  ]);

  if (countRaw === null && monthRaw === null) {
    return;
  }

  const parsedCount = countRaw ? parseInt(countRaw, 10) : 0;
  const parsedMonth = monthRaw ? parseInt(monthRaw, 10) : new Date().getMonth();

  await AsyncStorage.setItem(
    SWAP_COUNT_STATE_KEY,
    JSON.stringify({
      count: Number.isFinite(parsedCount) ? parsedCount : 0,
      month: Number.isFinite(parsedMonth) ? parsedMonth : new Date().getMonth(),
    })
  );
  await AsyncStorage.multiRemove([SWAP_COUNT_KEY, SWAP_COUNT_MONTH_KEY]);
}

const MIGRATIONS: Migration[] = [
  { version: 1, run: normalizeWorkoutNotes },
  { version: 2, run: foldSwapCountState },
];

export const LATEST_SCHEMA_VERSION = MIGRATIONS.reduce(
  (max, migration) => Math.max(max, migration.version),
  0
);

/**
 * Run any storage migrations newer than the device's recorded schema version,
 * in order. Idempotent and safe to call on every launch.
 */
export const runStorageMigrations = async (): Promise<void> => {
  try {
    const raw = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
    const parsed = raw ? Number(raw) : 0;
    const currentVersion = Number.isFinite(parsed) ? parsed : 0;

    for (const migration of MIGRATIONS) {
      if (migration.version > currentVersion) {
        await migration.run();
        await AsyncStorage.setItem(
          SCHEMA_VERSION_KEY,
          String(migration.version)
        );
      }
    }
  } catch (error) {
    console.error('Error running storage migrations:', error);
  }
};
