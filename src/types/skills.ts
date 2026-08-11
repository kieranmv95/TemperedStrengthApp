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

export type Skill = {
  id: string;
  name: string;
  thumbnailPath: ImageSourcePropType;
  description: string;
  videoIds?: SkillVideo[];
  tips?: string[];
  recoveryFlowIds?: string[];
  cues?: SkillCue[];
  workoutsIds?: string[];
  articleSlugs?: string[];
};
