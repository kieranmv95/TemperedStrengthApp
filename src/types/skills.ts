import type { ImageSourcePropType } from 'react-native';

export type SkillVideo = {
  id: string;
  name: string;
  description: string;
};

export type Skill = {
  id: string;
  name: string;
  thumbnailPath: ImageSourcePropType;
  description: string;
  videoIds?: SkillVideo[];
  tips?: string[];
  recoveryFlowIds?: string[];
  cues?: ImageSourcePropType[];
  workoutsIds?: string[];
  articleSlugs?: string[];
};
