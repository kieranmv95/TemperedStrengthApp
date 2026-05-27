export type ToolId = 'one-rep-max';

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
];

export function getToolById(id: string): ToolDefinition | undefined {
  return TOOLS.find((tool) => tool.id === id);
}
