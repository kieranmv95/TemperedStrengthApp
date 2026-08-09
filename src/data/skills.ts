import type { Skill } from '@/src/types/skills';

const SkillsData: Skill[] = [
  {
    id: '1',
    name: 'Hand Stand Push Up',
    thumbnailPath: require('@/assets/images/skills/thumbnails/Handstand.jpg'),
    description:
      'Pull-Up is a bodyweight exercise that targets the back, biceps, and forearms. It is a great exercise for building strength and endurance in the upper body.',
    videoIds: ['oJf2Mnn4NVc'],
    recoveryFlowIds: ['r_01'],
    articleIds: ['ao_1'],
    cues: [
      {
        id: '1',
        name: 'Hand Stand Push Up',
        description: 'Hand Stand Push Up',
        imagePath: require('@/assets/images/skills/thumbnails/Handstand.jpg'),
      },
    ],
    workoutsIds: ['w_01'],
    tips: [
      'Keep your hips square to the ground',
      'Keep your shoulders down and back',
      'Keep your elbows close to your body',
      'Keep your feet together',
      'Keep your head up',
      'Keep your chest up',
    ],
  },
  {
    id: '2',
    name: 'Snatch',
    thumbnailPath: require('@/assets/images/skills/thumbnails/Snatch.jpg'),
    description:
      'The snatch is a powerful Olympic lift that combines the power of the clean and jerk into a single movement to get the barbell off the ground and over the head.',
    videoIds: ['oJf2Mnn4NVc'],
    recoveryFlowIds: ['r_01'],
    articleIds: ['ao_1'],
    cues: [
      {
        id: '1',
        name: 'Hand Stand Push Up',
        description: 'Hand Stand Push Up',
        imagePath: require('@/assets/images/skills/thumbnails/Handstand.jpg'),
      },
    ],
  },
];

export const getSkillById = (id: string): Skill | undefined => {
  return SkillsData.find((skill) => skill.id === id);
};

export const getSkills = (): Skill[] => {
  return SkillsData;
};
