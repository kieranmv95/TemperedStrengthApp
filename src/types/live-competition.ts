export type LiveCompetitionTheme = {
  bgColor: string;
  copyColor: string;
  linkColor: string;
  linkTextColor: string;
  borderColor: string;
};

export type LiveCompetitionOrderBy = 'weight' | 'time';

export type LiveCompetitionEntry = {
  name: string;
  score: number;
  category: string;
};

export type LiveCompetition = {
  orderBy: LiveCompetitionOrderBy;
  title: string;
  description: string;
  additionalInfo: string;
  linkText: string;
  theme: LiveCompetitionTheme;
  entries: LiveCompetitionEntry[];
};
