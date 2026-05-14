import AsyncStorage from '@react-native-async-storage/async-storage';
import { syncSetItem } from '@/src/sync/syncStorage';

/** Single JSON blob; mirrored via syncSetItem when iCloud sync is on. LWW conflicts could drop a day in rare multi-device offline cases — see plan. */
export const STREAK_STATE_KEY = 'streak_state_v1';

const MAX_STORED_DATES = 800;

export type StreakStateV1 = {
  v: 1;
  dates: string[];
  best: number;
};

export type StreakSnapshot = {
  currentStreak: number;
  bestStreak: number;
  totalDays: number;
  /** Sorted ascending unique YYYY-MM-DD (local), trimmed to cap. */
  dates: string[];
  todayLocal: string;
};

let applyMutex: Promise<void> = Promise.resolve();

export function formatLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function prevLocalYMD(ymd: string): string {
  const [ys, ms, ds] = ymd.split('-');
  const y = Number(ys);
  const mo = Number(ms) - 1;
  const day = Number(ds);
  const dt = new Date(y, mo, day);
  dt.setDate(dt.getDate() - 1);
  return formatLocalYMD(dt);
}

export function uniqueSortedDates(dates: readonly string[]): string[] {
  return [...new Set(dates)].sort((a, b) => a.localeCompare(b));
}

/** Longest consecutive run present in sorted unique YYYY-MM-DD strings. */
export function longestConsecutiveRun(sortedUnique: readonly string[]): number {
  if (sortedUnique.length === 0) return 0;
  let bestRun = 1;
  let run = 1;
  for (let i = 1; i < sortedUnique.length; i++) {
    const prev = sortedUnique[i - 1];
    const cur = sortedUnique[i];
    if (cur === undefined || prev === undefined) break;
    if (prevLocalYMD(cur) === prev) {
      run += 1;
      if (run > bestRun) bestRun = run;
    } else {
      run = 1;
    }
  }
  return bestRun;
}

/**
 * Consecutive check-in days ending at `endYmd` (inclusive), only counting days in `set`.
 */
export function currentStreakEndingAt(
  set: ReadonlySet<string>,
  endYmd: string
): number {
  if (!set.has(endYmd)) return 0;
  let cur = endYmd;
  let n = 0;
  while (set.has(cur)) {
    n += 1;
    cur = prevLocalYMD(cur);
  }
  return n;
}

export function parseStreakState(raw: string | null): StreakStateV1 {
  if (!raw) {
    return { v: 1, dates: [], best: 0 };
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      (parsed as { v?: unknown }).v !== 1
    ) {
      return { v: 1, dates: [], best: 0 };
    }
    const o = parsed as { dates?: unknown; best?: unknown };
    const dates = Array.isArray(o.dates)
      ? o.dates.filter((x): x is string => typeof x === 'string')
      : [];
    const best =
      typeof o.best === 'number' && Number.isFinite(o.best) && o.best >= 0
        ? Math.floor(o.best)
        : 0;
    return { v: 1, dates: uniqueSortedDates(dates), best };
  } catch {
    return { v: 1, dates: [], best: 0 };
  }
}

function trimOldestDates(sortedUnique: string[]): string[] {
  if (sortedUnique.length <= MAX_STORED_DATES) return sortedUnique;
  return sortedUnique.slice(-MAX_STORED_DATES);
}

export function buildSnapshot(
  state: StreakStateV1,
  todayLocal: string
): StreakSnapshot {
  const set = new Set(state.dates);
  const currentStreak = currentStreakEndingAt(set, todayLocal);
  const historicalBest = Math.max(
    state.best,
    longestConsecutiveRun(state.dates),
    currentStreak
  );
  return {
    currentStreak,
    bestStreak: historicalBest,
    totalDays: state.dates.length,
    dates: state.dates,
    todayLocal,
  };
}

export async function loadStreakSnapshot(
  now: Date = new Date()
): Promise<StreakSnapshot> {
  const raw = await AsyncStorage.getItem(STREAK_STATE_KEY);
  const todayLocal = formatLocalYMD(now);
  return buildSnapshot(parseStreakState(raw), todayLocal);
}

async function doApply(now: Date): Promise<StreakSnapshot> {
  const raw = await AsyncStorage.getItem(STREAK_STATE_KEY);
  const parsed = parseStreakState(raw);
  const todayLocal = formatLocalYMD(now);

  const set = new Set(parsed.dates);
  if (!set.has(todayLocal)) {
    set.add(todayLocal);
  }
  let dates = uniqueSortedDates([...set]);
  dates = trimOldestDates(dates);

  const currentAfter = currentStreakEndingAt(new Set(dates), todayLocal);
  const bestFromDates = longestConsecutiveRun(dates);
  const nextBest = Math.max(parsed.best, bestFromDates, currentAfter);

  const next: StreakStateV1 = { v: 1, dates, best: nextBest };
  await syncSetItem(STREAK_STATE_KEY, JSON.stringify(next));
  return buildSnapshot(next, todayLocal);
}

/**
 * Records today's open (idempotent per calendar day) and persists via syncSetItem.
 * Serialized so concurrent callers (e.g. tab layout + home load) do not corrupt state.
 */
export function applyDailyStreakCheckIn(now: Date = new Date()): Promise<StreakSnapshot> {
  const run = applyMutex.then(() => doApply(now));
  applyMutex = run.then(
    () => undefined,
    () => undefined
  );
  return run;
}

export type WeekStripDay = {
  ymd: string;
  label: string;
  dayOfMonth: number;
};

/** Local week Monday–Sunday for `ref`, with single-letter labels. */
export function weekDaysStartingMonday(ref: Date = new Date()): WeekStripDay[] {
  const y = ref.getFullYear();
  const m = ref.getMonth();
  const d = ref.getDate();
  const dow = ref.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(y, m, d + mondayOffset);
  const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
  const out: WeekStripDay[] = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(mon.getFullYear(), mon.getMonth(), mon.getDate() + i);
    const label = labels[i];
    if (label === undefined) continue;
    out.push({
      ymd: formatLocalYMD(dt),
      label,
      dayOfMonth: dt.getDate(),
    });
  }
  return out;
}
