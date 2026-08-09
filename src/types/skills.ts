import type { ImageSourcePropType } from 'react-native';

export type SkillCue = {
  id: string;
  name: string;
  description: string;
  imagePath: ImageSourcePropType;
};

export type Skill = {
  id: string;
  name: string;
  thumbnailPath: ImageSourcePropType;
  description: string;
  videoIds?: string[];
  tips?: string[];
  recoveryFlowIds?: string[];
  cues?: SkillCue[];
  workoutsIds?: string[];
  articleIds?: string[];
};
