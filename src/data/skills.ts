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
        name: 'Hookk Grip 101',
        description: 'What is a hook grip and how to do it',
      },
      {
        id: 'oJf2Mnn4NVc',
        name: 'Progressions',
        description:
          'progressions from the flow to the top of a handstand push up',
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
];

export const getSkillById = (id: string): Skill | undefined => {
  return SkillsData.find((skill) => skill.id === id);
};

export const getSkills = (): Skill[] => {
  return SkillsData;
};
