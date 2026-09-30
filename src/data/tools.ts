export type ToolId =
  | 'one-rep-max'
  | 'one-rep-max-breakdown'
  | 'creatine'
  | 'water-intake'
  | 'checkin';

/** Not every tool lives under `/tools` — check-in is a full feature area. */
export type ToolRoute =
  | '/tools/one-rep-max'
  | '/tools/one-rep-max-breakdown'
  | '/tools/creatine'
  | '/tools/water-intake'
  | '/checkin';

export type ToolDefinition = {
  id: ToolId;
  title: string;
  pillLabel: string;
  description: string;
  route: ToolRoute;
  icon: string;
};

export const TOOLS: ToolDefinition[] = [
  {
    id: 'checkin',
    title: 'Daily Check-in',
    pillLabel: 'Check-in',
    description:
      'Track daily habits and supplements, and see your consistency over time.',
    route: '/checkin',
    icon: 'checkbox-outline',
  },
  {
    id: 'one-rep-max',
    title: 'One Rep Max Estimator',
    pillLabel: '1RM Estimator',
    description:
      'Estimate your one-rep max from a known set and see training percentages.',
    route: '/tools/one-rep-max',
    icon: 'barbell-outline',
  },
  {
    id: 'one-rep-max-breakdown',
    title: 'One Rep Max Breakdown',
    pillLabel: '1RM Breakdown',
    description:
      'Enter your known one-rep max and see training weights at every percentage.',
    route: '/tools/one-rep-max-breakdown',
    icon: 'grid-outline',
  },
  {
    id: 'creatine',
    title: 'Creatine Calculator',
    pillLabel: 'Creatine Dose',
    description:
      'Daily creatine dose for muscle gain based on your bodyweight (kg or lb).',
    route: '/tools/creatine',
    icon: 'flask-outline',
  },
  {
    id: 'water-intake',
    title: 'Water Intake Calculator',
    pillLabel: 'Water Intake',
    description:
      'Daily hydration target from bodyweight, activity level, and creatine use.',
    route: '/tools/water-intake',
    icon: 'water-outline',
  },
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
