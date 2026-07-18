type Environment = 'production' | 'development';

export type SanityEnvironment = 'production' | 'qa';
export type CompetitionEnvironment = 'production' | 'test';

type Environments = {
  competition: CompetitionEnvironment;
  sanity: SanityEnvironment;
};

const ENVIRONMENT: Environment =
  (process.env.EXPO_PUBLIC_ENVIRONMENT as Environment) || 'production';

export const environments: Environments = {
  competition: ENVIRONMENT === 'production' ? 'production' : 'test',
  sanity: ENVIRONMENT === 'production' ? 'production' : 'qa',
};
