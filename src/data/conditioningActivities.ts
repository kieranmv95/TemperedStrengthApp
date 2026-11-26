export type ConditioningActivityId =
  'run' | 'row' | 'ski_erg' | 'bike_erg' | 'triathlon';

export type ConditioningDistance = {
  distanceM: number;
  label: string;
  /** Extra line under the name, such as a triathlon's three legs. */
  detail?: string;
};

export type ConditioningActivity = {
  id: ConditioningActivityId;
  name: string;
  equipment: string;
  /** Pace is duration for this many metres. */
  pacePerM: number;
  /** Suffix after the pace clock, including the slash. */
  paceUnit: string;
  /** Distance selected when logging a new effort. */
  defaultDistanceM: number;
  /** Replaces the default screen subtitle when set. */
  summary?: string;
  /** Name of a tier in the log sheet. Defaults to Distance. */
  tierLabel?: string;
  distances: ConditioningDistance[];
};

/** Road-race distances shared by running and biking. Miles use the statute mile. */
const LONG_DISTANCES: ConditioningDistance[] = [
  { distanceM: 21097, label: 'Half marathon' },
  { distanceM: 42195, label: 'Marathon' },
  { distanceM: 50000, label: '50 km' },
  { distanceM: 80467, label: '50 miles' },
  { distanceM: 100000, label: '100 km' },
  { distanceM: 160934, label: '100 miles' },
];

const RUN_DISTANCES: ConditioningDistance[] = [
  { distanceM: 400, label: '400 m' },
  { distanceM: 1000, label: '1 km' },
  { distanceM: 1609, label: '1 mile' },
  { distanceM: 5000, label: '5 km' },
  { distanceM: 10000, label: '10 km' },
  ...LONG_DISTANCES,
];

const ROW_AND_SKI_DISTANCES: ConditioningDistance[] = [
  { distanceM: 500, label: '500 m' },
  { distanceM: 1000, label: '1,000 m' },
  { distanceM: 2000, label: '2,000 m' },
  { distanceM: 5000, label: '5,000 m' },
];

/** World Triathlon and Ironman race formats. Totals keep each format unique. */
const TRIATHLON_DISTANCES: ConditioningDistance[] = [
  {
    distanceM: 12900,
    label: 'Super Sprint',
    detail: '400 m swim · 10 km bike · 2.5 km run',
  },
  {
    distanceM: 25750,
    label: 'Sprint',
    detail: '750 m swim · 20 km bike · 5 km run',
  },
  {
    distanceM: 51500,
    label: 'Olympic',
    detail: '1.5 km swim · 40 km bike · 10 km run',
  },
  {
    distanceM: 113000,
    label: '70.3',
    detail: '1.9 km swim · 90 km bike · 21.1 km run',
  },
  {
    distanceM: 226000,
    label: 'Ironman',
    detail: '3.8 km swim · 180 km bike · 42.2 km run',
  },
];

const BIKE_DISTANCES: ConditioningDistance[] = [
  { distanceM: 1000, label: '1,000 m' },
  { distanceM: 4000, label: '4,000 m' },
  { distanceM: 10000, label: '10,000 m' },
  { distanceM: 20000, label: '20,000 m' },
  ...LONG_DISTANCES,
];

export const CONDITIONING_ACTIVITIES: ConditioningActivity[] = [
  {
    id: 'run',
    name: 'Run',
    equipment: 'Road',
    pacePerM: 1000,
    paceUnit: '/km',
    defaultDistanceM: 5000,
    distances: RUN_DISTANCES,
  },
  {
    id: 'row',
    name: 'Row',
    equipment: 'RowErg',
    pacePerM: 500,
    paceUnit: '/500m',
    defaultDistanceM: 2000,
    distances: ROW_AND_SKI_DISTANCES,
  },
  {
    id: 'ski_erg',
    name: 'SkiErg',
    equipment: 'SkiErg',
    pacePerM: 500,
    paceUnit: '/500m',
    defaultDistanceM: 1000,
    distances: ROW_AND_SKI_DISTANCES,
  },
  {
    id: 'bike_erg',
    name: 'BikeErg',
    equipment: 'BikeErg',
    pacePerM: 1000,
    paceUnit: '/km',
    defaultDistanceM: 4000,
    distances: BIKE_DISTANCES,
  },
  {
    id: 'triathlon',
    name: 'Triathlon',
    equipment: 'Swim, bike, run',
    pacePerM: 0,
    paceUnit: '',
    defaultDistanceM: 51500,
    summary: 'Finish time for a standard race',
    tierLabel: 'Race',
    distances: TRIATHLON_DISTANCES,
  },
];

export function getConditioningActivity(
  activityId: string
): ConditioningActivity | undefined {
  return CONDITIONING_ACTIVITIES.find((activity) => activity.id === activityId);
}

export function getConditioningDistance(
  activityId: string,
  distanceM: number
): ConditioningDistance | undefined {
  return getConditioningActivity(activityId)?.distances.find(
    (distance) => distance.distanceM === distanceM
  );
}
