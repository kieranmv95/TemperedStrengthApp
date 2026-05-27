export type ToolId = 'one-rep-max' | 'one-rep-max-breakdown';

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
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
