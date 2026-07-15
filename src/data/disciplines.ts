import type { SingleWorkout, WorkoutCategory } from '@/src/types/workouts';
import { ImageSourcePropType } from 'react-native';

/** Discipline carousel route key; not a `WorkoutTag` — filters by empty `equipment`. */
export const NO_EQUIPMENT_DISCIPLINE_TAG = 'No Equipment';

/** Discipline carousel keys mapped to workout category (tags no longer duplicate this). */
const DISCIPLINE_CATEGORY: Record<string, WorkoutCategory> = {
  CrossFit: 'WOD',
  Hyrox: 'Hyrox',
  Rainhill: 'Rainhill',
};

export type DisciplineTheme = {
  /** Card background; defaults to theme `backgroundCard`. */
  bgColor?: string;
  /** Card border; defaults to theme `accent`. */
  borderColor?: string;
  /** Description copy; defaults to theme `textMuted`. */
  descriptionColor?: string;
  /** Link label and icon; defaults to theme `accent`. */
  linkColor?: string;
};

export type Discipline = {
  title: string;
  showTitle?: boolean;
  /** Hide from the discipline carousel while unreleased (data kept in place). */
  hidden?: boolean;
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
  /** Optional white-label colours for the sponsor card on the discipline screen. */
  theme?: DisciplineTheme;
};

export const disciplines: Discipline[] = [
  {
    title: 'Arena Games',
    tag: 'Arena',
    showTitle: false,
    // Not ready for release yet - hidden from the discipline carousel.
    hidden: false,
    isSponsor: true,
    logo: {
      source: require('@/assets/images/logos/arena.png'),
      width: 100,
      height: 35,
    },
    image: require('@/assets/images/disciplines/arena.png'),
    description:
      "Everybody has their own arena. The place that gives you the butterflies in your stomach, where you sometimes think 'I don't know if I can do this'. Then you find your grit: where you go into the trenches to come out stronger, where you lock in. The place where you feel like the only person in the room.",
    link: 'https://www.thearenagames.co.uk/',
    theme: {
      bgColor: '#FF3801',
      borderColor: '#FF3801',
      descriptionColor: '#000000',
      linkColor: '#000000',
    },
  },
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
    title: 'Olympic Lifting',
    tag: 'Olympic Lifting',
    showTitle: true,
    image: require('@/assets/images/disciplines/oly.png'),
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
    title: 'Collabs',
    tag: 'Collab',
    isSponsor: true,
    showTitle: true,
    image: require('@/assets/images/disciplines/collab.png'),
    description:
      'At Tempered Strength, sometimes we come across a workout that just takes our breath away... Literally. Find all the workouts from people we have collaborated with here.',
  },
  {
    title: 'Partner',
    tag: 'Partner',
    showTitle: true,
    image: require('@/assets/images/disciplines/partner.png'),
  },
];

/** Disciplines shown in the carousel (excludes any flagged `hidden`). */
export const visibleDisciplines: Discipline[] = disciplines.filter(
  (discipline) => !discipline.hidden
);

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
  if (disciplineTag === 'Olympic Lifting') {
    return workout.tags.includes('Olympic Lifting');
  }
  if (disciplineTag === 'Arena') {
    return workout.tags.includes('Arena');
  }
  if (disciplineTag === 'Collab') {
    return Boolean(workout.collab);
  }
  return false;
}
