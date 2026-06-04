import { ImageSourcePropType } from 'react-native';
import type { SingleWorkout, WorkoutCategory } from '@/src/types/workouts';

/** Discipline carousel route key; not a `WorkoutTag` — filters by empty `equipment`. */
export const NO_EQUIPMENT_DISCIPLINE_TAG = 'No Equipment';

/** Discipline carousel keys mapped to workout category (tags no longer duplicate this). */
const DISCIPLINE_CATEGORY: Record<string, WorkoutCategory> = {
  CrossFit: 'WOD',
  Hyrox: 'Hyrox',
  Pilates: 'Pilates',
  Rainhill: 'Rainhill',
};

export type Discipline = {
  title: string;
  showTitle?: boolean;
  tag: string;
  image: ImageSourcePropType;
  logo?: {
    source: ImageSourcePropType;
    width: number;
    height: number;
  };
  description?: string;
  link?: string;
  isSponsor?: boolean;
};

export const disciplines: Discipline[] = [
  {
    title: 'The Rainhill Trials',
    tag: 'Rainhill',
    showTitle: false,
    isSponsor: true,
    logo: {
      source: require('@/assets/images/logos/TRT_White.png'),
      width: 100,
      height: 46,
    },
    image: require('@/assets/images/disciplines/rainhill.png'),
    description:
      "Get a feel for what a rainhill event is like by trying some of their past workouts. Don't forget to visit their website and get signed up for future events. Note that all workout weights are in kg, not lbs as it is a european event.",
    link: 'https://therainhilltrials.myshopify.com/',
  },
  {
    title: 'CrossFit',
    tag: 'CrossFit',
    showTitle: true,
    image: require('@/assets/images/disciplines/crossfit.png'),
  },
  {
    title: 'Hyrox',
    tag: 'Hyrox',
    showTitle: true,
    image: require('@/assets/images/disciplines/hyrox.png'),
  },
  {
    title: 'Pilates',
    tag: 'Pilates',
    showTitle: true,
    image: require('@/assets/images/disciplines/pilates.png'),
  },
  {
    title: 'Partner',
    tag: 'Partner',
    showTitle: true,
    image: require('@/assets/images/disciplines/partner.png'),
  },
  {
    title: 'No Equipment',
    tag: NO_EQUIPMENT_DISCIPLINE_TAG,
    showTitle: true,
    image: require('@/assets/images/disciplines/noequipment.png'),
  },
];

export function isNoEquipmentDiscipline(tag: string): boolean {
  return tag === NO_EQUIPMENT_DISCIPLINE_TAG;
}

export function workoutMatchesDiscipline(
  workout: SingleWorkout,
  disciplineTag: string
): boolean {
  if (isNoEquipmentDiscipline(disciplineTag)) {
    return workout.equipment.length === 0;
  }
  const category = DISCIPLINE_CATEGORY[disciplineTag];
  if (category) {
    return workout.category === category;
  }
  if (disciplineTag === 'Partner') {
    return workout.tags.includes('Partner');
  }
  return false;
}
