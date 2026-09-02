import type {
  ProgramRestDaySuggestions,
  RestDayActivitySuggestion,
  RestDaySuggestionSet,
} from '@/src/types/restDaySuggestions';

/** Curated standalone workouts safe(ish) for rest days. IDs only, grouped by intent. */
const W = {
  legPrimer: 'f_05',
  upperHypertrophy: 'f_06',
  pushupPyramid: 'f_12',
  grip: 'f_19',
  skip: 'f_17',
  tripleStack: 'f_01',
  hipSnap: 'f_10',
  groundPound: 'f_18',
  cindy: 'f_30',
  annie: 'f_33',
  barbara: 'f_40',
  chelsea: 'f_42',
  angie: 'f_43',
  runPacing: 'f_66',
  quietWork: 'f_60',
  performanceRitual: 'f_71',
  snatchBalance: 'p_15',
  snatchStability: 'p_79',
  snatchSession: 'p_80',
  cjSession: 'p_81',
  olySnatchStability: 'p_02',
  pistolClinic: 'p_09',
  muscleUpLab: 'p_16',
  doubleUnderClinic: 'p_10',
  ignition: 'p_55',
  diesel: 'p_05',
  hyroxLite: 'p_73',
  snatchAndWalk: 'rh_09',
  doubleTrouble: 'rh_02',
  rowBagBell: 'rh_05',
  atom: 'rh_10',
} as const;

const walk2040: RestDayActivitySuggestion = {
  title: 'Easy walk',
  description: '20–40 minutes at a conversational pace. No intervals.',
  icon: 'walk-outline',
};

const walk3045: RestDayActivitySuggestion = {
  title: 'Easy walk',
  description: '30–45 minutes outdoors. Let your legs move without loading them.',
  icon: 'walk-outline',
};

const easySwim: RestDayActivitySuggestion = {
  title: 'Easy swim',
  description: 'Light laps or treading water. Keep effort low and shoulders relaxed.',
  icon: 'water-outline',
};

const easyCycle: RestDayActivitySuggestion = {
  title: 'Easy cycle',
  description: 'Flat route, low resistance. Spin the legs without chasing a pace.',
  icon: 'bicycle-outline',
};

const fullRest: RestDayActivitySuggestion = {
  title: 'Full rest',
  description: 'Sometimes the best recovery is doing nothing. Sleep, eat, and come back fresh.',
  icon: 'bed-outline',
};

const zone2Run: RestDayActivitySuggestion = {
  title: 'Easy jog or Zone 2 run',
  description: '20–30 minutes. You should be able to hold a conversation throughout.',
  icon: 'fitness-outline',
};

const longWalk: RestDayActivitySuggestion = {
  title: 'Long walk',
  description: '45–60 minutes. Simple, effective, and easy to recover from.',
  icon: 'walk-outline',
};

const gentleYoga: RestDayActivitySuggestion = {
  title: 'Gentle yoga',
  description: 'A slow class or your own flow. Focus on breath and length, not intensity.',
  icon: 'leaf-outline',
};

export const coreRestDayActivities: RestDayActivitySuggestion[] = [
  {
    title: 'Steam room or sauna',
    description:
      '10–15 minutes of heat. Hydrate before and after, and skip if you feel lightheaded.',
    icon: 'thermometer-outline',
  },
  {
    title: 'Meditation',
    description:
      '10–20 minutes of quiet breathing or a guided session. No performance goal, just downshift.',
    icon: 'moon-outline',
  },
];

function fourDaySplitSets(
  afterPush: RestDaySuggestionSet,
  afterPull: RestDaySuggestionSet,
  midWeekend: RestDaySuggestionSet,
  sunday: RestDaySuggestionSet
): ProgramRestDaySuggestions {
  return { sets: [afterPush, afterPull, midWeekend, sunday] };
}

export const genericRestDaySuggestions: ProgramRestDaySuggestions = {
  sets: [
    {
      context: 'Light movement to flush the week without adding gym stress.',
      recoveryIds: ['r_15', 'r_02', 'r_04'],
      workoutIds: [
        W.legPrimer,
        W.tripleStack,
        W.cindy,
        W.skip,
        W.runPacing,
        W.quietWork,
      ],
      skillWorkoutIds: ['sw_04', 'sw_15', 'sw_20', 'sw_16'],
      activities: [walk2040, easySwim, easyCycle],
    },
    {
      context: 'Open hips and upper back, common tight spots between sessions.',
      recoveryIds: ['r_04', 'r_06', 'r_07'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.upperHypertrophy,
        W.doubleUnderClinic,
        W.performanceRitual,
      ],
      skillWorkoutIds: ['sw_15', 'sw_16', 'sw_10', 'sw_05'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'A longer reset before the next training block.',
      recoveryIds: ['r_05', 'r_08', 'p_01'],
      workoutIds: [
        W.barbara,
        W.angie,
        W.chelsea,
        W.skip,
        W.quietWork,
      ],
      skillWorkoutIds: ['sw_20', 'sw_17', 'sw_22', 'sw_11'],
      activities: [longWalk, fullRest],
    },
    {
      context: 'Keep it easy. Save your energy for upcoming sessions.',
      recoveryIds: ['r_02', 'r_15', 'r_05'],
      workoutIds: [W.skip, W.grip, W.annie, W.runPacing, W.diesel],
      skillWorkoutIds: ['sw_16', 'sw_04', 'sw_03', 'sw_18'],
      activities: [fullRest, easySwim],
    },
  ],
};

export const restDaySuggestionsByProgramId: Record<
  string,
  ProgramRestDaySuggestions
> = {
  bb_3day_01: fourDaySplitSets(
    {
      context:
        'After chest & triceps, open the shoulders and undo desk posture.',
      recoveryIds: ['r_04', 'p_02', 'r_07'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.skip,
        W.annie,
        W.upperHypertrophy,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_04', 'sw_17', 'sw_10', 'sw_08'],
      activities: [walk2040, easySwim, easyCycle],
    },
    {
      context: 'After back & biceps, hips and posterior chain need attention.',
      recoveryIds: ['r_06', 'r_08', 'r_11'],
      workoutIds: [
        W.grip,
        W.tripleStack,
        W.runPacing,
        W.doubleTrouble,
        W.chelsea,
        W.olySnatchStability,
      ],
      skillWorkoutIds: ['sw_10', 'sw_05', 'sw_06', 'sw_18'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'After legs & shoulders, flush the lower body and T-spine.',
      recoveryIds: ['r_07', 'r_11', 'p_03'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.barbara,
        W.muscleUpLab,
        W.performanceRitual,
      ],
      skillWorkoutIds: ['sw_17', 'sw_16', 'sw_15', 'sw_11'],
      activities: [walk3045, easyCycle, fullRest],
    },
    {
      context: 'End-of-week reset before Monday push day.',
      recoveryIds: ['r_02', 'r_15', 'r_05'],
      workoutIds: [
        W.skip,
        W.quietWork,
        W.diesel,
        W.rowBagBell,
        W.atom,
      ],
      skillWorkoutIds: ['sw_15', 'sw_20', 'sw_03', 'sw_14'],
      activities: [fullRest, easySwim],
    }
  ),

  ppl_01: fourDaySplitSets(
    {
      context: 'After push, chest and shoulders are loaded; keep mobility upper-body focused.',
      recoveryIds: ['r_04', 'r_07', 'p_02'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.doubleUnderClinic,
        W.chelsea,
        W.pistolClinic,
      ],
      skillWorkoutIds: ['sw_04', 'sw_17', 'sw_09', 'sw_07'],
      activities: [walk2040, easySwim],
    },
    {
      context: 'After pull, hips and hamstrings tighten from rows and dead work.',
      recoveryIds: ['r_06', 'r_11', 'r_08'],
      workoutIds: [
        W.grip,
        W.tripleStack,
        W.runPacing,
        W.doubleTrouble,
        W.upperHypertrophy,
        W.snatchAndWalk,
      ],
      skillWorkoutIds: ['sw_10', 'sw_05', 'sw_06', 'sw_12'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'After legs, flush quads, glutes, and lower back.',
      recoveryIds: ['r_08', 'p_03', 'r_06'],
      workoutIds: [
        W.pushupPyramid,
        W.annie,
        W.barbara,
        W.angie,
        W.muscleUpLab,
        W.performanceRitual,
      ],
      skillWorkoutIds: ['sw_15', 'sw_20', 'sw_16', 'sw_18'],
      activities: [walk3045, easyCycle, fullRest],
    },
    {
      context: 'Full rest before the next push session.',
      recoveryIds: ['r_15', 'r_02', 'r_05'],
      workoutIds: [
        W.skip,
        W.quietWork,
        W.diesel,
        W.rowBagBell,
        W.cindy,
      ],
      skillWorkoutIds: ['sw_20', 'sw_03', 'sw_21', 'sw_14'],
      activities: [fullRest, easySwim],
    }
  ),

  bb_5day_pro_01: {
    sets: [
      {
        context: 'Mid-week break, you trained hard Mon–Fri; flush everything.',
        recoveryIds: ['r_05', 'p_01', 'r_08'],
        workoutIds: [
          W.cindy,
          W.tripleStack,
          W.barbara,
          W.legPrimer,
          W.runPacing,
          W.quietWork,
        ],
        skillWorkoutIds: ['sw_16', 'sw_04', 'sw_20', 'sw_11'],
        activities: [walk3045, easySwim, fullRest],
      },
      {
        context: 'Second rest day, stay easy so Monday chest day hits fresh.',
        recoveryIds: ['r_08', 'r_15', 'r_02'],
        workoutIds: [
          W.skip,
          W.annie,
          W.grip,
          W.chelsea,
          W.diesel,
          W.performanceRitual,
        ],
        skillWorkoutIds: ['sw_04', 'sw_17', 'sw_15', 'sw_08'],
        activities: [fullRest, easyCycle],
      },
    ],
  },

  strength_5day: {
    sets: [
      {
        context: 'Weekend recovery after five heavy days, flush, don’t load.',
        recoveryIds: ['r_05', 'r_08', 'p_01'],
        workoutIds: [
          W.grip,
          W.skip,
          W.annie,
          W.barbara,
          W.quietWork,
          W.doubleUnderClinic,
        ],
        skillWorkoutIds: ['sw_20', 'sw_04', 'sw_16', 'sw_22'],
        activities: [walk3045, fullRest, easySwim],
      },
      {
        context: 'Second rest day, grip and skill work only; legs need a break.',
        recoveryIds: ['p_01', 'r_02', 'r_15'],
        workoutIds: [
          W.pushupPyramid,
          W.annie,
          W.runPacing,
          W.diesel,
          W.muscleUpLab,
        ],
        skillWorkoutIds: ['sw_17', 'sw_13', 'sw_22', 'sw_07'],
        activities: [easySwim, fullRest],
      },
    ],
  },

  pilates_intro_4wk_free: fourDaySplitSets(
    {
      context: 'After Pilates A, lengthen hips; skip extra core work today.',
      recoveryIds: ['r_02', 'r_06', 'r_11'],
      workoutIds: [
        W.skip,
        W.pushupPyramid,
        W.runPacing,
        W.quietWork,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_16', 'sw_15', 'sw_03', 'sw_18'],
      activities: [walk2040, easySwim, gentleYoga],
    },
    {
      context: 'After Pilates B, thoracic and hip mobility, not more ab work.',
      recoveryIds: ['r_07', 'r_11', 'r_15'],
      workoutIds: [
        W.skip,
        W.grip,
        W.annie,
        W.diesel,
        W.performanceRitual,
      ],
      skillWorkoutIds: ['sw_15', 'sw_16', 'sw_03', 'sw_20'],
      activities: [easyCycle, gentleYoga],
    },
    {
      context: 'After Pilates C, deep stretch for hips and hamstrings.',
      recoveryIds: ['r_15', 'r_11', 'r_06'],
      workoutIds: [
        W.skip,
        W.quietWork,
        W.runPacing,
        W.rowBagBell,
        W.atom,
      ],
      skillWorkoutIds: ['sw_03', 'sw_16', 'sw_14', 'sw_21'],
      activities: [walk2040, gentleYoga],
    },
    {
      context: 'Full rest, your core gets plenty on training days.',
      recoveryIds: ['r_02', 'r_15', 'r_05'],
      workoutIds: [W.skip, W.annie, W.diesel],
      skillWorkoutIds: ['sw_16', 'sw_15', 'sw_18'],
      activities: [fullRest, easySwim],
    }
  ),

  wendler_531_3day: fourDaySplitSets(
    {
      context: 'After squat day, knees, hips, and quads need gentle mobility.',
      recoveryIds: ['r_13', 'r_06', 'p_03'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.barbara,
        W.muscleUpLab,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_13', 'sw_04', 'sw_20', 'sw_08'],
      activities: [walk2040, easyCycle],
    },
    {
      context: 'After press day, shoulders and T-spine; skip extra pressing.',
      recoveryIds: ['r_04', 'r_07', 'p_02'],
      workoutIds: [
        W.grip,
        W.skip,
        W.legPrimer,
        W.runPacing,
        W.pistolClinic,
        W.quietWork,
      ],
      skillWorkoutIds: ['sw_04', 'sw_17', 'sw_03', 'sw_10'],
      activities: [easySwim, walk2040],
    },
    {
      context: 'After deadlift day, hamstrings, hips, and lower back flush.',
      recoveryIds: ['r_11', 'p_03', 'r_08'],
      workoutIds: [
        W.pushupPyramid,
        W.annie,
        W.chelsea,
        W.angie,
        W.performanceRitual,
        W.diesel,
      ],
      skillWorkoutIds: ['sw_22', 'sw_20', 'sw_04', 'sw_18'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'Before the next squat wave, keep it light, no extra bar work.',
      recoveryIds: ['r_15', 'r_02', 'r_05'],
      workoutIds: [
        W.skip,
        W.quietWork,
        W.runPacing,
        W.rowBagBell,
        W.doubleTrouble,
      ],
      skillWorkoutIds: ['sw_20', 'sw_15', 'sw_16', 'sw_14'],
      activities: [fullRest, easySwim],
    }
  ),

  power_01: fourDaySplitSets(
    {
      context: 'After squat day, hip and knee prehab; no extra squatting.',
      recoveryIds: ['r_13', 'p_03', 'r_06'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.barbara,
        W.muscleUpLab,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_13', 'sw_04', 'sw_20', 'sw_09'],
      activities: [walk2040, easyCycle],
    },
    {
      context: 'After bench day, shoulders and pecs; open the chest and upper back.',
      recoveryIds: ['r_04', 'r_07', 'p_02'],
      workoutIds: [
        W.grip,
        W.skip,
        W.legPrimer,
        W.runPacing,
        W.pistolClinic,
        W.quietWork,
      ],
      skillWorkoutIds: ['sw_04', 'sw_17', 'sw_10', 'sw_07'],
      activities: [easySwim, walk2040],
    },
    {
      context: 'After deadlift day, posterior chain flush and hamstring length.',
      recoveryIds: ['r_06', 'r_11', 'r_08'],
      workoutIds: [
        W.pushupPyramid,
        W.annie,
        W.chelsea,
        W.angie,
        W.diesel,
        W.performanceRitual,
      ],
      skillWorkoutIds: ['sw_22', 'sw_20', 'sw_15', 'sw_12'],
      activities: [easyCycle, walk3045],
    },
    {
      context: 'Rest before test week or the next SBD rotation.',
      recoveryIds: ['r_02', 'r_15', 'r_05'],
      workoutIds: [
        W.skip,
        W.quietWork,
        W.runPacing,
        W.rowBagBell,
        W.atom,
      ],
      skillWorkoutIds: ['sw_20', 'sw_16', 'sw_03', 'sw_19'],
      activities: [fullRest, easySwim],
    }
  ),

  full_body_2day: {
    sets: [
      {
        context: 'Mid-week rest. Mon–Fri off between weekend sessions.',
        recoveryIds: ['r_15', 'r_02', 'r_04'],
        workoutIds: [
          W.legPrimer,
          W.cindy,
          W.tripleStack,
          W.hipSnap,
          W.runPacing,
          W.quietWork,
        ],
        skillWorkoutIds: ['sw_04', 'sw_15', 'sw_20', 'sw_22'],
        activities: [walk2040, zone2Run, easySwim],
      },
      {
        context: 'Second weekday rest, stay mobile without fatiguing for Saturday.',
        recoveryIds: ['r_04', 'r_09', 'r_06'],
        workoutIds: [
          W.grip,
          W.pushupPyramid,
          W.groundPound,
          W.annie,
          W.doubleTrouble,
          W.hyroxLite,
        ],
        skillWorkoutIds: ['sw_15', 'sw_16', 'sw_22', 'sw_10'],
        activities: [easySwim, easyCycle],
      },
      {
        context: 'Third weekday rest, light aerobic work is fine here.',
        recoveryIds: ['r_06', 'r_07', 'r_08'],
        workoutIds: [
          W.legPrimer,
          W.skip,
          W.barbara,
          W.performanceRitual,
          W.diesel,
          W.rowBagBell,
        ],
        skillWorkoutIds: ['sw_16', 'sw_20', 'sw_04', 'sw_05'],
        activities: [zone2Run, walk2040, longWalk],
      },
      {
        context: 'Fourth weekday rest, save legs for the weekend full-body days.',
        recoveryIds: ['r_08', 'r_15', 'r_11'],
        workoutIds: [
          W.pushupPyramid,
          W.grip,
          W.annie,
          W.muscleUpLab,
          W.doubleUnderClinic,
          W.chelsea,
        ],
        skillWorkoutIds: ['sw_20', 'sw_17', 'sw_10', 'sw_08'],
        activities: [longWalk, easySwim],
      },
      {
        context: 'After Sunday full body, flush before the weekday break.',
        recoveryIds: ['r_05', 'p_01', 'r_02'],
        workoutIds: [
          W.skip,
          W.quietWork,
          W.annie,
          W.runPacing,
          W.atom,
        ],
        skillWorkoutIds: ['sw_22', 'sw_04', 'sw_15', 'sw_21'],
        activities: [fullRest, easyCycle],
      },
    ],
  },

  hiit_shred_free: {
    sets: [
      {
        context: 'After a hard HIIT day, flush the legs; no extra metcons.',
        recoveryIds: ['r_08', 'p_01', 'r_05'],
        workoutIds: [
          W.skip,
          W.pushupPyramid,
          W.legPrimer,
          W.annie,
          W.quietWork,
          W.runPacing,
        ],
        skillWorkoutIds: ['sw_20', 'sw_10', 'sw_05', 'sw_21'],
        activities: [walk2040, easySwim, fullRest],
      },
      {
        context: 'Mid-week recovery, your CNS needs easy movement, not intensity.',
        recoveryIds: ['r_05', 'r_15', 'r_02'],
        workoutIds: [
          W.skip,
          W.grip,
          W.doubleUnderClinic,
          W.diesel,
          W.performanceRitual,
        ],
        skillWorkoutIds: ['sw_10', 'sw_05', 'sw_20', 'sw_07'],
        activities: [easyCycle, fullRest],
      },
      {
        context: 'Before the next HIIT session, stay fresh, not fatigued.',
        recoveryIds: ['r_02', 'r_08', 'p_01'],
        workoutIds: [
          W.skip,
          W.pushupPyramid,
          W.annie,
          W.barbara,
          W.quietWork,
          W.pistolClinic,
        ],
        skillWorkoutIds: ['sw_05', 'sw_21', 'sw_20', 'sw_06'],
        activities: [walk2040, easySwim],
      },
    ],
  },

  hiit_shred_6wk_pro: {
    sets: [
      {
        context: 'After a peak-week HIIT day, lower body flush and percussive recovery.',
        recoveryIds: ['r_08', 'p_03', 'r_05'],
        workoutIds: [
          W.skip,
          W.pushupPyramid,
          W.annie,
          W.quietWork,
          W.runPacing,
          W.doubleUnderClinic,
        ],
        skillWorkoutIds: ['sw_21', 'sw_20', 'sw_10', 'sw_05'],
        activities: [walk2040, easySwim, fullRest],
      },
      {
        context: 'Mid-week, four training days already; keep heart rate low today.',
        recoveryIds: ['r_05', 'r_15', 'r_02'],
        workoutIds: [
          W.skip,
          W.grip,
          W.diesel,
          W.performanceRitual,
          W.pistolClinic,
        ],
        skillWorkoutIds: ['sw_10', 'sw_05', 'sw_07', 'sw_06'],
        activities: [easyCycle, fullRest],
      },
      {
        context: 'Pre-session rest, save legs and lungs for the next WOD.',
        recoveryIds: ['p_01', 'r_02', 'r_08'],
        workoutIds: [
          W.skip,
          W.pushupPyramid,
          W.legPrimer,
          W.annie,
          W.quietWork,
          W.muscleUpLab,
        ],
        skillWorkoutIds: ['sw_20', 'sw_21', 'sw_05', 'sw_08'],
        activities: [walk2040, easySwim],
      },
    ],
  },

  bootcamp_kb_db_pro: fourDaySplitSets(
    {
      context: 'After hinge day, hips and hamstrings from swings and deads.',
      recoveryIds: ['r_06', 'r_10', 'r_11'],
      workoutIds: [
        W.pushupPyramid,
        W.grip,
        W.annie,
        W.barbara,
        W.muscleUpLab,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_22', 'sw_21', 'sw_20', 'sw_04'],
      activities: [walk2040, easySwim],
    },
    {
      context: 'After upper/TGU day, shoulders, wrists, and grip recovery.',
      recoveryIds: ['r_04', 'r_10', 'p_02'],
      workoutIds: [
        W.grip,
        W.skip,
        W.annie,
        W.doubleTrouble,
        W.pistolClinic,
        W.diesel,
      ],
      skillWorkoutIds: ['sw_21', 'sw_04', 'sw_17', 'sw_10'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'After lower day, flush quads and open the hips.',
      recoveryIds: ['r_08', 'r_15', 'r_06'],
      workoutIds: [
        W.pushupPyramid,
        W.annie,
        W.chelsea,
        W.angie,
        W.performanceRitual,
        W.quietWork,
      ],
      skillWorkoutIds: ['sw_20', 'sw_15', 'sw_22', 'sw_16'],
      activities: [easySwim, easyCycle, fullRest],
    },
    {
      context: 'Full rest, bootcamp volume adds up fast.',
      recoveryIds: ['p_01', 'r_02', 'r_05'],
      workoutIds: [
        W.skip,
        W.runPacing,
        W.rowBagBell,
        W.atom,
        W.diesel,
      ],
      skillWorkoutIds: ['sw_15', 'sw_16', 'sw_03', 'sw_18'],
      activities: [fullRest, walk2040],
    }
  ),

  oly_01: fourDaySplitSets(
    {
      context: 'After snatch day, wrists, shoulders, and overhead position.',
      recoveryIds: ['r_10', 'r_03', 'r_04'],
      workoutIds: [
        W.snatchBalance,
        W.snatchStability,
        W.snatchSession,
        W.olySnatchStability,
        W.skip,
        W.grip,
      ],
      skillWorkoutIds: ['sw_01', 'sw_13', 'sw_03', 'sw_04'],
      activities: [walk2040, easyCycle],
    },
    {
      context: 'After C&J day. T-spine and hip mobility for the catch.',
      recoveryIds: ['r_07', 'r_13', 'r_06'],
      workoutIds: [
        W.cjSession,
        W.snatchBalance,
        W.snatchStability,
        W.skip,
        W.snatchAndWalk,
        W.pistolClinic,
      ],
      skillWorkoutIds: ['sw_02', 'sw_03', 'sw_13', 'sw_15'],
      activities: [easySwim, walk2040],
    },
    {
      context: 'After classics day, full-body flush; shoulders may need a break.',
      recoveryIds: ['r_04', 'r_06', 'p_03'],
      workoutIds: [
        W.skip,
        W.grip,
        W.snatchBalance,
        W.quietWork,
        W.annie,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_13', 'sw_01', 'sw_02', 'sw_20'],
      activities: [easyCycle, fullRest],
    },
    {
      context: 'Before the next snatch session, positional work only if you train.',
      recoveryIds: ['r_15', 'r_02', 'r_10'],
      workoutIds: [
        W.snatchBalance,
        W.snatchStability,
        W.snatchSession,
        W.olySnatchStability,
      ],
      skillWorkoutIds: ['sw_03', 'sw_01', 'sw_13', 'sw_02'],
      activities: [fullRest, walk2040],
    }
  ),

  oly_adv_01: fourDaySplitSets(
    {
      context: 'After snatch & pull day, wrist and shoulder prehab is priority.',
      recoveryIds: ['r_10', 'r_04', 'r_03'],
      workoutIds: [
        W.snatchBalance,
        W.snatchSession,
        W.snatchStability,
        W.olySnatchStability,
        W.grip,
        W.doubleUnderClinic,
      ],
      skillWorkoutIds: ['sw_01', 'sw_13', 'sw_03', 'sw_07'],
      activities: [walk2040, easyCycle],
    },
    {
      context: 'After C&J & front squat day, hips, ankles, and thoracic spine.',
      recoveryIds: ['r_13', 'r_07', 'r_06'],
      workoutIds: [
        W.cjSession,
        W.snatchBalance,
        W.snatchStability,
        W.skip,
        W.pistolClinic,
        W.snatchAndWalk,
      ],
      skillWorkoutIds: ['sw_02', 'sw_03', 'sw_13', 'sw_15'],
      activities: [easyCycle, walk2040],
    },
    {
      context: 'After total day, heavy loading; flush and lengthen.',
      recoveryIds: ['r_06', 'p_03', 'r_08'],
      workoutIds: [
        W.skip,
        W.grip,
        W.quietWork,
        W.annie,
        W.runPacing,
        W.diesel,
      ],
      skillWorkoutIds: ['sw_13', 'sw_01', 'sw_02', 'sw_22'],
      activities: [fullRest, easySwim],
    },
    {
      context: 'Meet-prep rest, stay sharp, not sore.',
      recoveryIds: ['r_03', 'r_15', 'r_10'],
      workoutIds: [
        W.snatchBalance,
        W.snatchSession,
        W.cjSession,
        W.olySnatchStability,
      ],
      skillWorkoutIds: ['sw_03', 'sw_01', 'sw_02', 'sw_04'],
      activities: [fullRest, walk2040],
    }
  ),

  powerbuilding_4day_pro: {
    sets: [
      {
        context: 'Mid-week rest (Wed), between upper and lower strength days.',
        recoveryIds: ['r_04', 'r_08', 'r_07'],
        workoutIds: [
          W.grip,
          W.skip,
          W.pushupPyramid,
          W.annie,
          W.runPacing,
          W.pistolClinic,
        ],
        skillWorkoutIds: ['sw_13', 'sw_04', 'sw_17', 'sw_10'],
        activities: [walk3045, easySwim, easyCycle],
      },
      {
        context: 'First weekend rest, flush after four hard days.',
        recoveryIds: ['r_05', 'p_02', 'r_08'],
        workoutIds: [
          W.cindy,
          W.tripleStack,
          W.barbara,
          W.legPrimer,
          W.quietWork,
          W.hyroxLite,
        ],
        skillWorkoutIds: ['sw_04', 'sw_17', 'sw_15', 'sw_20'],
        activities: [easyCycle, fullRest],
      },
      {
        context: 'Second weekend rest, save squat strength for Monday.',
        recoveryIds: ['r_07', 'p_03', 'r_06'],
        workoutIds: [
          W.pushupPyramid,
          W.grip,
          W.annie,
          W.chelsea,
          W.muscleUpLab,
          W.performanceRitual,
        ],
        skillWorkoutIds: ['sw_17', 'sw_13', 'sw_20', 'sw_08'],
        activities: [walk3045, easySwim, fullRest],
      },
    ],
  },
};
