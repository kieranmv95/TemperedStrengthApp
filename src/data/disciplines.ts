import { ImageSourcePropType } from 'react-native';

type Discipline = {
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
    tag: 'No Equipment',
    showTitle: true,
    image: require('@/assets/images/disciplines/noequipment.png'),
  },
];
