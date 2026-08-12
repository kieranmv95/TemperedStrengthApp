import type { ImageSourcePropType } from 'react-native';

export type SkillVideo = {
  id: string;
  name: string;
  description: string;
};

export type SkillCue = {
  title?: string;
  description?: string;
  imagePath: ImageSourcePropType;
};

/** Card / catalog row — counts only for heavy tip & cue content. */
export type SkillSummary = {
  id: string;
  name: string;
  thumbnailPath: ImageSourcePropType;
  description: string;
  videoCount: number;
  tipCount: number;
  cueCount: number;
  articleCount: number;
  recoveryFlowCount: number;
  workoutCount: number;
};

/** Full skill for the detail screen (summary fields + heavy content). */
export type Skill = SkillSummary & {
  videoIds?: SkillVideo[];
  tips?: string[];
  recoveryFlowIds?: string[];
  cues?: SkillCue[];
  workoutsIds?: string[];
  articleSlugs?: string[];
};
