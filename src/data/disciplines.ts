import {
  WORKOUT_DISCIPLINES,
  type SingleWorkout,
  type WorkoutCollection,
  type WorkoutDiscipline,
  type WorkoutSpecial,
} from '@/src/types/workouts';
import { ImageSourcePropType } from 'react-native';

/** Ionicon per discipline, used on pills, filter chips and workout cards. */
export const DISCIPLINE_ICONS: Record<WorkoutDiscipline, string> = {
  Metcon: 'timer-outline',
  Strength: 'barbell-outline',
  'Olympic Lifting': 'trending-up-outline',
  Gymnastics: 'body-outline',
  Conditioning: 'heart-outline',
  Hyrox: 'fitness-outline',
  Skills: 'school-outline',
};

/** Route key that filters by empty `equipment`. */
export const NO_EQUIPMENT_DISCIPLINE_TAG = 'No Equipment';

/**
 * Route key per discipline. `Skill` predates the Skills rename and stays so
 * existing links keep working.
 */
const DISCIPLINE_TAG_FOR: Record<WorkoutDiscipline, string> = {
  Metcon: 'Metcon',
  Strength: 'Strength',
  'Olympic Lifting': 'Olympic Lifting',
  Gymnastics: 'Gymnastics',
  Conditioning: 'Conditioning',
  Hyrox: 'Hyrox',
  Skills: 'Skill',
};

const DISCIPLINE_FOR_TAG: Record<string, WorkoutDiscipline> =
  Object.fromEntries(
    WORKOUT_DISCIPLINES.map((discipline) => [
      DISCIPLINE_TAG_FOR[discipline],
      discipline,
    ])
  );

/** `CrossFit` was a discipline; its route now opens the benchmarks collection. */
const DISCIPLINE_COLLECTION: Record<string, WorkoutCollection> = {
  CrossFit: 'CrossFit Benchmarks',
};

/** Event keys mapped to the workout's event series. */
const DISCIPLINE_SPECIAL: Record<string, WorkoutSpecial> = {
  DBB: 'Death By Beth',
  Arena: 'Arena',
  Rainhill: 'Rainhill',
  'Girl Games': 'Girl Games',
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
  /** `event` renders as an Events tile; `discipline` as a Disciplines pill. */
  group: 'event' | 'discipline';
  showTitle?: boolean;
  /** Hide from the discipline carousel while unreleased (data kept in place). */
  hidden?: boolean;
  tag: string;
  /** Tile artwork; events only. */
  image?: ImageSourcePropType;
  /** Ionicon name for the Disciplines pill. */
  icon?: string;
  logo?: {
    source: ImageSourcePropType;
    width: number;
    height: number;
  };
  description?: string;
  link?: string;
  /** Label for the sponsor link. Falls back to "View event details". */
  linkLabel?: string;
  isSponsor?: boolean;
  /** Optional white-label colours for the sponsor card on the discipline screen. */
  theme?: DisciplineTheme;
};

export const disciplines: Discipline[] = [
  {
    title: 'Death by Beth',
    group: 'event',
    tag: 'DBB',
    showTitle: false,
    hidden: false,
    isSponsor: true,
    logo: {
      source: require('@/assets/images/logos/deathbybeth_logo.png'),
      width: 75,
      height: 75,
    },
    image: require('@/assets/images/disciplines/deathbybeth.png'),
    description:
      'High-energy, all-level workouts to push your limits – choose your weights and survive! Not for the faint-hearted! ☠️',
    link: 'https://www.instagram.com/coach_bethb/',
    linkLabel: 'Check out Death by Beth here',
    theme: {
      bgColor: '#39FF14',
      borderColor: '#39FF14',
      descriptionColor: '#000000',
      linkColor: '#000000',
    },
  },
  {
    title: 'Arena Games',
    group: 'event',
    tag: 'Arena',
    showTitle: false,
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
    group: 'event',
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
    title: 'The Girl Games',
    group: 'event',
    tag: 'Girl Games',
    showTitle: false,
    isSponsor: true,
    image: require('@/assets/images/disciplines/thegirlgames.png'),
    description:
      'A fitness competition made for women, by women. Get a feel for the event with these past Metcons, then get signed up for the next one. Weights are in kg.',
    link: 'https://www.instagram.com/thegirlgames_/',
    theme: {
      bgColor: '#000000',
      borderColor: '#FF4BB8',
      descriptionColor: '#FFFFFF',
      linkColor: '#FF4BB8',
    },
  },
  ...WORKOUT_DISCIPLINES.map((discipline): Discipline => ({
    title: discipline,
    group: 'discipline',
    tag: DISCIPLINE_TAG_FOR[discipline],
    showTitle: true,
    icon: DISCIPLINE_ICONS[discipline],
  })),
  {
    title: 'CrossFit Benchmarks',
    group: 'discipline',
    tag: 'CrossFit',
    showTitle: true,
    icon: 'trophy-outline',
  },
  {
    title: 'Partner',
    group: 'discipline',
    tag: 'Partner',
    showTitle: true,
    icon: 'people-outline',
  },
  {
    title: 'Collabs',
    group: 'discipline',
    tag: 'Collab',
    isSponsor: true,
    showTitle: true,
    icon: 'sparkles-outline',
    description:
      'At Tempered Strength, sometimes we come across a workout that just takes our breath away... Literally. Find all the workouts from people we have collaborated with here.',
  },
];

/** Events shown as tiles on the workouts screen (excludes any flagged `hidden`). */
export const visibleEvents: Discipline[] = disciplines.filter(
  (discipline) => discipline.group === 'event' && !discipline.hidden
);

/** Training disciplines shown as pills on the workouts screen. */
export const visibleTrainingDisciplines: Discipline[] = disciplines.filter(
  (discipline) => discipline.group === 'discipline' && !discipline.hidden
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
  const discipline = DISCIPLINE_FOR_TAG[disciplineTag];
  if (discipline) {
    return workout.disciplines.includes(discipline);
  }
  const collection = DISCIPLINE_COLLECTION[disciplineTag];
  if (collection) {
    return workout.collections?.includes(collection) ?? false;
  }
  const special = DISCIPLINE_SPECIAL[disciplineTag];
  if (special) {
    return workout.special === special;
  }
  if (disciplineTag === 'Partner') {
    return Boolean(workout.partner);
  }
  if (disciplineTag === 'Collab') {
    return Boolean(workout.collab);
  }
  return false;
}
