import {
  getAll as getAllTrackedMetrics,
  TRACKED_METRIC,
} from '../services/metricService';

type Tier = 'bronze' | 'silver' | 'platinum';

type Award = {
  id: number;
  name: string;
  badgeTitle: string;
  description: string;
  isPro: boolean;
  tier: Tier;
  group: TRACKED_METRIC;
  threshold: number;
};

export const awards: Award[] = [
  {
    id: 13,
    name: `No rest for the wicked`,
    badgeTitle: 'No Rest',
    description: 'Skip a rest timer',
    isPro: false,
    tier: 'silver',
    group: 'rest_timers_skipped',
    threshold: 1,
  },
  {
    id: 14,
    name: 'In the Loop',
    badgeTitle: 'In the Loop',
    description: 'Visit the brief page',
    isPro: false,
    tier: 'silver',
    group: 'brief_visits',
    threshold: 1,
  },
  {
    id: 15,
    name: 'The Reader',
    badgeTitle: 'The Reader',
    description: 'Read your first article',
    isPro: false,
    tier: 'silver',
    group: 'articles_read',
    threshold: 1,
  },
  {
    id: 16,
    name: 'Speaking the Lingo',
    badgeTitle: 'WTF?',
    description: 'View all the terms in the glossary',
    isPro: false,
    tier: 'silver',
    group: 'terminology_views',
    threshold: 1,
  },
  {
    id: 1,
    name: 'Step 1',
    badgeTitle: 'First Program',
    description: 'Started your first program',
    isPro: false,
    tier: 'bronze',
    group: 'program_starts',
    threshold: 1,
  },
  {
    id: 2,
    name: 'Program Connoisseur',
    badgeTitle: '5 Programs',
    description: 'Started 5 programs',
    isPro: false,
    tier: 'silver',
    group: 'program_starts',
    threshold: 5,
  },
  {
    id: 3,
    name: 'Program Professional',
    badgeTitle: '10 Programs',
    description: 'Started 10 programs',
    isPro: true,
    tier: 'platinum',
    group: 'program_starts',
    threshold: 10,
  },
  {
    id: 4,
    name: 'Set Starter',
    badgeTitle: 'Set Starter',
    description: 'Logged 10 sets in programs',
    isPro: false,
    tier: 'bronze',
    group: 'sets_logged',
    threshold: 10,
  },
  {
    id: 5,
    name: 'Set Vet',
    badgeTitle: 'Set Veteran',
    description: 'Logged 100 sets in programs',
    isPro: false,
    tier: 'silver',
    group: 'sets_logged',
    threshold: 100,
  },
  {
    id: 6,
    name: 'Set Master',
    badgeTitle: 'Set Master',
    description: 'Logged 1000 sets in programs',
    isPro: true,
    tier: 'platinum',
    group: 'sets_logged',
    threshold: 1000,
  },
  {
    id: 7,
    name: 'Showing Up',
    badgeTitle: 'Showing Up',
    description: 'Complete your first program workout',
    isPro: false,
    tier: 'bronze',
    group: 'program_workouts_completed',
    threshold: 1,
  },
  {
    id: 8,
    name: 'Consistency',
    badgeTitle: 'Consistency',
    description: 'Completed 10 workouts in programs',
    isPro: false,
    tier: 'silver',
    group: 'program_workouts_completed',
    threshold: 10,
  },
  {
    id: 9,
    name: 'Relentless',
    badgeTitle: 'Relentless',
    description: 'Complete 100 workouts in program',
    isPro: true,
    tier: 'platinum',
    group: 'program_workouts_completed',
    threshold: 100,
  },
  {
    id: 10,
    name: 'On the Clock',
    badgeTitle: 'On the Clock',
    description: 'Start or Restart 10 rest timers',
    isPro: false,
    tier: 'bronze',
    group: 'rest_timers_started',
    threshold: 10,
  },
  {
    id: 11,
    name: 'Timekeeper',
    badgeTitle: 'Timekeeper',
    description: 'Start or Restart 100 rest timers',
    isPro: false,
    tier: 'silver',
    group: 'rest_timers_started',
    threshold: 100,
  },
  {
    id: 12,
    name: 'Master of Time',
    badgeTitle: 'Timelord',
    description: 'Start or Restart 1000 rest timers',
    isPro: true,
    tier: 'platinum',
    group: 'rest_timers_started',
    threshold: 1000,
  },
  // workouts_logged
  {
    id: 17,
    name: 'First Rep',
    badgeTitle: 'First Rep',
    description: 'Log your first workout',
    isPro: false,
    tier: 'bronze',
    group: 'workouts_logged',
    threshold: 1,
  },
  {
    id: 18,
    name: 'Building Habits',
    badgeTitle: '5 Workouts',
    description: 'Logged 5 workouts',
    isPro: false,
    tier: 'silver',
    group: 'workouts_logged',
    threshold: 5,
  },
  {
    id: 19,
    name: 'Creature of Habit',
    badgeTitle: '50 Workouts',
    description: 'Logged 50 workouts',
    isPro: true,
    tier: 'platinum',
    group: 'workouts_logged',
    threshold: 50,
  },
  {
    id: 20,
    name: `It's Busy`,
    badgeTitle: `It's Busy`,
    description: 'Swap an exercise in a workout',
    isPro: false,
    tier: 'bronze',
    group: 'exercises_swapped',
    threshold: 1,
  },
  {
    id: 21,
    name: 'Maybe this one',
    badgeTitle: 'Shapeshifter',
    description: 'Swap 10 exercises in workouts',
    isPro: false,
    tier: 'silver',
    group: 'exercises_swapped',
    threshold: 10,
  },
  {
    id: 22,
    name: 'Swapper',
    badgeTitle: 'Swapper',
    description: 'Swap 50 exercises in workouts',
    isPro: true,
    tier: 'platinum',
    group: 'exercises_swapped',
    threshold: 50,
  },
];

export const getAll = async () => {
  const trackedMetrics = await getAllTrackedMetrics();

  return awards.map((a) => {
    const metricValue =
      trackedMetrics.find((t) => t.name === a.group)?.value ?? 0;
    return {
      award: a,
      granted: metricValue >= a.threshold,
    };
  });
};
