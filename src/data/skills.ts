import type { Skill } from '@/src/types/skills';

const SkillsData: Skill[] = [
  {
    id: '1',
    name: 'Hand Stand Push Up',
    thumbnailPath: require('@/assets/images/skills/thumbnails/Handstand.jpg'),
    description:
      'Pull-Up is a bodyweight exercise that targets the back, biceps, and forearms. It is a great exercise for building strength and endurance in the upper body.',
    videoIds: [
      {
        id: 'oJf2Mnn4NVc',
        name: 'Hand Stand Push Up',
        description: 'Hand Stand Push Up',
      },
    ],
    recoveryFlowIds: ['r_01', 'r_02'],
    articleSlugs: [
      'the-science-of-progressive-overload',
      'the-science-of-progressive-overload',
    ],
    cues: [
      {
        title: 'Hand Stand Push Up',
        description:
          'The average head is approximately 10% of your height. This is the recommended distance to dip during the push press or jerk. The average head is approximately 10% of your height. This is the recommended distance to dip during the push press or jerk. The average head is approximately 10% of your height. This is the recommended distance to dip during the push press or jerk. The average head is approximately 10% of your height. This is the recommended distance to dip during the push press or jerk.',
        imagePath: require('@/assets/images/test.jpg'),
      },
      {
        title: 'Hand Stand Push Up',
        description: 'Hand Stand Push Up',
        imagePath: require('@/assets/images/test.jpg'),
      },
    ],
    workoutsIds: ['f_17', 'rh_09'],
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
    videoIds: [
      {
        id: 'oJf2Mnn4NVc',
        name: 'Snatch',
        description: 'Snatch',
      },
    ],
    recoveryFlowIds: ['r_01'],
    articleSlugs: ['the-science-of-progressive-overload'],
    cues: [
      {
        title: 'Snatch',
        description: 'Snatch',
        imagePath: require('@/assets/images/test.jpg'),
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
