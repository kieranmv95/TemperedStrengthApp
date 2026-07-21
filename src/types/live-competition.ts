export type LiveCompetitionTheme = {
  bgColor: string;
  copyColor: string;
  linkColor: string;
  linkTextColor: string;
  borderColor: string;
};

export type LiveCompetitionMetricType =
  | 'max_weight'
  | 'max_reps'
  | 'max_time'
  | 'max_calories'
  | 'max_distance';

export type LiveCompetitionEntry = {
  name: string;
  score: number;
  category: string;
};

export type LiveCompetition = {
  metricType: LiveCompetitionMetricType;
  title: string;
  description: string;
  additionalInfo: string;
  linkText: string;
  theme: LiveCompetitionTheme;
  entries: LiveCompetitionEntry[];
};
