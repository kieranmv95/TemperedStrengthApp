export type ToolId =
  | 'one-rep-max'
  | 'one-rep-max-breakdown'
  | 'bar-loader'
  | 'creatine'
  | 'water-intake'
  | 'timers'
  | 'checkin'
  | 'glossary';

/** Not every tool lives under `/tools` — check-in and glossary are feature areas. */
export type ToolRoute =
  | '/tools/one-rep-max'
  | '/tools/one-rep-max-breakdown'
  | '/tools/bar-loader'
  | '/tools/creatine'
  | '/tools/water-intake'
  | '/tools/timers'
  | '/checkin'
  | '/glossary';

export type ToolDefinition = {
  id: ToolId;
  title: string;
  pillLabel: string;
  /** Short line under the Explore tile title. */
  blurb: string;
  description: string;
  route: ToolRoute;
  icon: string;
};

export const TOOLS: ToolDefinition[] = [
  {
    id: 'timers',
    title: 'Gym Timers',
    pillLabel: 'Timers',
    blurb: 'AMRAP, EMOM, Tabata and rest clocks.',
    description:
      'AMRAP, EMOM, Tabata, For Time, rest, and more — full-screen gym clock.',
    route: '/tools/timers',
    icon: 'timer-outline',
  },
  {
    id: 'checkin',
    title: 'Daily Check-in',
    pillLabel: 'Check-in',
    blurb: 'Log habits and supplements daily.',
    description:
      'Track daily habits and supplements, and see your consistency over time.',
    route: '/checkin',
    icon: 'checkbox-outline',
  },
  {
    id: 'one-rep-max',
    title: 'One Rep Max Estimator',
    pillLabel: '1RM Estimator',
    blurb: 'Estimate 1RM from a known set.',
    description:
      'Estimate your one-rep max from a known set and see training percentages.',
    route: '/tools/one-rep-max',
    icon: 'barbell-outline',
  },
  {
    id: 'one-rep-max-breakdown',
    title: 'One Rep Max Breakdown',
    pillLabel: '1RM Breakdown',
    blurb: 'Training weights at every percent.',
    description:
      'Enter your known one-rep max and see training weights at every percentage.',
    route: '/tools/one-rep-max-breakdown',
    icon: 'grid-outline',
  },
  {
    id: 'bar-loader',
    title: 'Bar Loader',
    pillLabel: 'Bar Loader',
    blurb: 'Plates for any target on the bar.',
    description:
      "See which plates to load on a men's or women's bar to hit a target weight.",
    route: '/tools/bar-loader',
    icon: 'layers-outline',
  },
  {
    id: 'creatine',
    title: 'Creatine Calculator',
    pillLabel: 'Creatine Dose',
    blurb: 'Daily dose from your bodyweight.',
    description:
      'Daily creatine dose for muscle gain based on your bodyweight (kg or lb).',
    route: '/tools/creatine',
    icon: 'flask-outline',
  },
  {
    id: 'water-intake',
    title: 'Water Intake Calculator',
    pillLabel: 'Water Intake',
    blurb: 'Hydration target for your day.',
    description:
      'Daily hydration target from bodyweight, activity level, and creatine use.',
    route: '/tools/water-intake',
    icon: 'water-outline',
  },
  {
    id: 'glossary',
    title: 'Glossary',
    pillLabel: 'Glossary',
    blurb: 'Training, nutrition and recovery terms.',
    description:
      'Learn the terms we use across training, nutrition and recovery.',
    route: '/glossary',
    icon: 'book-outline',
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
