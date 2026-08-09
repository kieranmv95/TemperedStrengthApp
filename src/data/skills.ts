type Cue = {
  id: string;
  name: string;
  description: string;
  imagePath: string;
};

type Skill = {
  id: string;
  name: string;
  thumbnailPath: string;
  description: string;
  videoIds?: string[];
  tips?: string[];
  recoveryFlowIds?: string[];
  cues?: Cue[];
  workoutsIds?: string[];
  articleIds?: string[];
};

const SkillsData: Skill[] = [
  {
    id: '1',
    name: 'Hand Stand Push Ups (HSPU)',
    thumbnailPath: require('@/assets/images/skills/thumbnails/HSPU.jpg'),
    description:
      'Pull-Up is a bodyweight exercise that targets the back, biceps, and forearms. It is a great exercise for building strength and endurance in the upper body.',
    videoIds: ['oJf2Mnn4NVc'],
    recoveryFlowIds: ['r_01'],
    articleIds: ['ao_1'],
  },
];
