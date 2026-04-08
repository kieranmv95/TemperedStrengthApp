import AsyncStorage from '@react-native-async-storage/async-storage';

export type TRACKED_METRIC =
  | 'program_starts'
  | 'sets_logged'
  | 'program_workouts_completed'
  | 'rest_timers_started'
  | 'rest_timers_skipped'
  | 'brief_visits'
  | 'articles_read'
  | 'terminology_views'
  | 'workouts_logged'
  | 'exercises_swapped';

type TrackedMetrics = { [K in TRACKED_METRIC]: number };

const TRACKED_METRICS_STORAGE_KEY = 'tracked_metrics';

const ALL_TRACKED_METRICS: TRACKED_METRIC[] = [
  'program_starts',
  'sets_logged',
  'program_workouts_completed',
  'rest_timers_started',
  'rest_timers_skipped',
  'brief_visits',
  'articles_read',
  'terminology_views',
  'workouts_logged',
  'exercises_swapped',
];

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readTrackedMetrics(): Promise<Partial<TrackedMetrics>> {
  try {
    const raw = await AsyncStorage.getItem(TRACKED_METRICS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    if (!isPlainObject(parsed)) return {};
    return parsed as Partial<TrackedMetrics>;
  } catch (error) {
    console.error('Error reading tracked metrics:', error);
    return {};
  }
}

async function writeTrackedMetrics(
  metrics: Partial<TrackedMetrics>
): Promise<void> {
  try {
    await AsyncStorage.setItem(
      TRACKED_METRICS_STORAGE_KEY,
      JSON.stringify(metrics)
    );
  } catch (error) {
    console.error('Error writing tracked metrics:', error);
    throw error;
  }
}

export async function getAll(): Promise<
  { name: TRACKED_METRIC; value: number }[]
> {
  const stored = await readTrackedMetrics();

  const normalized: TrackedMetrics = ALL_TRACKED_METRICS.reduce((acc, name) => {
    const rawValue = stored[name];
    const value =
      typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : 0;
    acc[name] = value;
    return acc;
  }, {} as TrackedMetrics);

  // Persist normalization so missing metrics exist next time.
  await writeTrackedMetrics(normalized);

  return ALL_TRACKED_METRICS.map((name) => ({ name, value: normalized[name] }));
}

export async function get(name: TRACKED_METRIC): Promise<{ value: number }> {
  const stored = await readTrackedMetrics();
  const rawValue = stored[name];
  const value =
    typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : 0;
  return { value };
}

export async function increment(
  name: TRACKED_METRIC
): Promise<{ value: number }> {
  const stored = await readTrackedMetrics();
  const rawValue = stored[name];
  const current =
    typeof rawValue === 'number' && Number.isFinite(rawValue) ? rawValue : 0;

  const nextValue = current + 1;
  const next: Partial<TrackedMetrics> = { ...stored, [name]: nextValue };
  await writeTrackedMetrics(next);
  return { value: nextValue };
}
