export type ToolId =
  | 'one-rep-max'
  | 'one-rep-max-breakdown'
  | 'creatine'
  | 'water-intake';

export type ToolDefinition = {
  id: ToolId;
  title: string;
  pillLabel: string;
  description: string;
  route: `/tools/${ToolId}`;
  icon: string;
};

export const TOOLS: ToolDefinition[] = [
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
