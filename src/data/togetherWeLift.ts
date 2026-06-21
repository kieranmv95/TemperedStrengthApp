/** Together We Lift charity partnership — copy and outbound links. */

export const TOGETHER_WE_LIFT = {
  name: 'Together We Lift',
  sheetAbout:
    'Together We Lift runs not-for-profit mental health fundraisers that bring the strength community together. Events travel the UK linking local gyms with local mental health charities, with every pound raised going directly to the host area\u2019s charity.',
  bannerIntro:
    'Not for profit charity events that bring the strength community together. Click to learn more.',
  sheetTemperedLabel: 'From Tempered Strength',
  sheetTemperedStatement:
    'We met Together We Lift at FitXpo and were moved by their story and cause. That\u2019s why we\u2019re proud to support what they do.',
  colors: {
    background: '#001A70',
    title: '#FFFFFF',
    description: 'rgba(255, 255, 255, 0.88)',
    ctaBackground: '#FFFFFF',
    ctaText: '#001A70',
    linkBackground: 'rgba(255, 255, 255, 0.14)',
    linkText: '#FFFFFF',
  },
  links: {
    zeffyOrganization:
      'https://www.zeffy.com/en-GB/organizations/together-we-lift-cic',
    zeffyDonate: 'https://www.zeffy.com/en-GB/donation-form/together-we-lift',
    linktree: 'https://linktr.ee/togetherwelift.c.i.c',
    eventsAndAbout: 'https://www.budsfitness.co.uk/together/',
  },
  linkLabels: {
    donate: 'Donate on Zeffy',
    zeffyProfile: 'Charity profile on Zeffy',
    linktree: 'All links',
    events: 'Events & about',
  },
} as const;

export type TogetherWeLiftLinkKey = keyof typeof TOGETHER_WE_LIFT.links;
