import type { RecoveryFlowSource } from '@/src/types/recovery';

export const recoveryData: RecoveryFlowSource[] = [
  {
    id: 'r_01',
    title: 'Core Stability Flow',
    description:
      'Focus on bracing your midsection throughout. Move slowly. If you feel your lower back take over, reset.',
    difficulty: 'Beginner',
    estimatedTime: 10,
    tags: ['Core', 'Abs', 'Lower Back'],
    isPremium: false,
    blocks: [
      { movementId: 'cat_cow', dose: { kind: 'duration', seconds: 90 } },
      { movementId: 'dead_bug', dose: { kind: 'duration', seconds: 45 } },
      { movementId: 'bird_dog', dose: { kind: 'duration', seconds: 45 } },
      {
        movementId: 'hollow_body_hold',
        dose: { kind: 'duration', seconds: 30 },
      },
      {
        movementId: 'side_plank',
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      { movementId: 'cobra_pose', dose: { kind: 'duration', seconds: 60 } },
      { movementId: 'childs_pose', dose: { kind: 'duration', seconds: 90 } },
    ],
    equipment: [],
  },
  {
    id: 'r_02',
    title: 'Desk Job Recovery',
    description:
      'The antidote to sitting. Undoes the damage from hours at a desk: tight hips, a locked upper back, and rounded shoulders. Breathe deeply into each stretch.',
    difficulty: 'Beginner',
    estimatedTime: 12,
    tags: ['Recovery', 'Posture', 'Hips', 'Upper Back'],
    isPremium: false,
    blocks: [
      { movementId: 'neck_rolls', dose: { kind: 'duration', seconds: 60 } },
      { movementId: 'cat_cow', dose: { kind: 'duration', seconds: 60 } },
      {
        movementId: 'thread_the_needle',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'couch_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'pigeon_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      { movementId: 'cobra_pose', dose: { kind: 'duration', seconds: 60 } },
      { movementId: 'childs_pose', dose: { kind: 'duration', seconds: 60 } },
    ],
    equipment: [],
  },
  {
    id: 'r_03',
    title: 'Handstand Prep',
    description:
      'Wrist prep, scapular control, and body-line practice. Do this before any handstand session. Skip it and your wrists will remind you later.',
    difficulty: 'Intermediate',
    estimatedTime: 10,
    tags: ['Shoulders', 'Wrists', 'Skill', 'Handstand'],
    isPremium: false,
    blocks: [
      {
        movementId: 'wrist_circles',
        dose: {
          kind: 'duration',
          seconds: 30,
          rounds: 2,
          roundsLabel: 'each direction',
        },
      },
      {
        movementId: 'wrist_flexor_stretch',
        dose: {
          kind: 'duration',
          seconds: 60,
        },
      },
      {
        movementId: 'extensor_stretch',
        dose: {
          kind: 'duration',
          seconds: 60,
        },
      },
      { movementId: 'scapular_push_ups', dose: { kind: 'reps', count: 15 } },
      { movementId: 'wall_slides', dose: { kind: 'reps', count: 15 } },
      { movementId: 'pike_push_ups', dose: { kind: 'reps', count: 10 } },
      { movementId: 'wall_walk', dose: { kind: 'reps', count: 5 } },
      {
        movementId: 'kick_up_practice',
        dose: { kind: 'duration', seconds: 60 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_04',
    title: 'Shoulder Health Flow',
    description:
      'Prehab for athletes with stiff or overhead-heavy shoulders. Use a light resistance band. This should feel like active recovery, not a workout.',
    difficulty: 'Beginner',
    estimatedTime: 10,
    tags: ['Shoulders', 'Prehab', 'Rotator Cuff'],
    isPremium: false,
    blocks: [
      { movementId: 'arm_swings', dose: { kind: 'duration', seconds: 60 } },
      {
        movementId: 'thread_the_needle',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        movementId: 'pec_opener',
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      { movementId: 'wall_slides', dose: { kind: 'reps', count: 15 } },
      { movementId: 'banded_pull_aparts', dose: { kind: 'reps', count: 20 } },
      { movementId: 'band_pass_throughs', dose: { kind: 'reps', count: 15 } },
    ],
    equipment: ['bands'],
  },
  {
    id: 'r_05',
    title: 'Full Body Reset',
    description:
      'A head-to-toe mobility session to use the morning after a heavy training day. Move slowly. Today is about restoring range, not adding fatigue.',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Full Body', 'Recovery', 'Post-Workout'],
    isPremium: true,
    blocks: [
      { movementId: 'neck_rolls', dose: { kind: 'duration', seconds: 60 } },
      {
        movementId: 'thoracic_rotation',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      { movementId: 'cat_cow', dose: { kind: 'duration', seconds: 90 } },
      {
        movementId: 'worlds_greatest_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'hip_90_90',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'pigeon_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'supine_twist',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      { movementId: 'childs_pose', dose: { kind: 'duration', seconds: 90 } },
    ],
    equipment: [],
  },
  {
    id: 'r_06',
    title: 'Hip Flexor Unlock',
    description:
      'Targeted work for chronically tight hip flexors, common in anyone who sits, squats heavy, or runs. Expect one side to feel noticeably tighter than the other.',
    difficulty: 'Intermediate',
    estimatedTime: 13,
    tags: ['Hips', 'Mobility', 'Lower Body'],
    isPremium: true,
    blocks: [
      {
        movementId: 'supine_hip_circles',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        movementId: 'couch_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'kneeling_hip_flexor_stretch_with_reach',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'pigeon_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        movementId: 'lizard_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'supine_figure_four',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
    ],
    equipment: [],
  },
  {
    id: 'r_07',
    title: 'Thoracic Spine Restore',
    description:
      "The thoracic spine is the region most people completely neglect. Unlocking it improves posture, overhead range, and even breathing. You may feel some cracking. That's normal.",
    difficulty: 'Intermediate',
    estimatedTime: 18,
    tags: ['Upper Back', 'Posture', 'Spine', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        movementId: 'foam_roller_t_spine_extension',
        dose: { kind: 'duration', seconds: 180 },
      },
      {
        movementId: 'open_book_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'seated_thoracic_rotation',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'thread_the_needle',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'prayer_stretch_lat_t_spine',
        dose: { kind: 'duration', seconds: 90 },
      },
      { movementId: 'puppy_pose', dose: { kind: 'duration', seconds: 90 } },
      {
        movementId: 'doorframe_pec_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
    ],
    equipment: ['foam roller'],
  },
  {
    id: 'r_08',
    title: 'Lower Body Flush',
    description:
      'Designed for after leg day or a long run. Works through the quads, hamstrings, calves, and glutes to speed up recovery and restore movement quality.',
    difficulty: 'Beginner',
    estimatedTime: 18,
    tags: ['Lower Body', 'Recovery', 'Legs', 'Post-Workout'],
    isPremium: true,
    blocks: [
      {
        movementId: 'standing_quad_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'downward_dog_with_pedalling',
        dose: { kind: 'duration', seconds: 90 },
      },
      {
        movementId: 'standing_hamstring_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'foam_roller_quads',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'foam_roller_it_band_outer_thigh',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'pigeon_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'supine_hamstring_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'legs_up_the_wall',
        dose: { kind: 'duration', seconds: 180 },
      },
    ],
    equipment: ['foam roller'],
  },
  {
    id: 'r_09',
    title: 'Morning Mobility Wake-Up',
    description:
      'A gentle 15-minute flow to do before coffee, training, or anything else. No equipment, no warm-up needed. This is the warm-up.',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Morning', 'Full Body', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        movementId: 'supine_twist',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      { movementId: 'cat_cow', dose: { kind: 'duration', seconds: 90 } },
      { movementId: 'downward_dog', dose: { kind: 'duration', seconds: 90 } },
      {
        movementId: 'low_lunge_with_thoracic_rotation',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'hip_90_90',
        dose: { kind: 'duration_bilateral', secondsPerSide: 60 },
      },
      {
        movementId: 'standing_hip_circles',
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      { movementId: 'chest_opener', dose: { kind: 'duration', seconds: 60 } },
    ],
    equipment: [],
  },
  {
    id: 'r_10',
    title: 'Wrist & Forearm Health',
    description:
      'Essential if you do any gymnastics work, barbell pressing, or ring training. Neglecting wrist prep is the fastest route to an overuse injury that sidelines you for weeks.',
    difficulty: 'Intermediate',
    estimatedTime: 12,
    tags: ['Wrists', 'Forearms', 'Prehab', 'Skill'],
    isPremium: true,
    blocks: [
      { movementId: 'wrist_circles', dose: { kind: 'duration', seconds: 60 } },
      {
        movementId: 'palm_down_forearm_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        movementId: 'palm_up_forearm_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      {
        movementId: 'wrist_weight_shifting_hands_on_floor',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        movementId: 'reverse_wrist_circles_knuckles_down',
        dose: { kind: 'duration', seconds: 60 },
      },
      {
        movementId: 'prayer_stretch_reverse_prayer',
        dose: {
          kind: 'duration',
          seconds: 45,
          rounds: 2,
          roundsLabel: 'each position',
        },
      },
    ],
    equipment: ['bands'],
  },
  {
    id: 'r_11',
    title: 'Deep Stretch: Hips and Hamstrings',
    description:
      'A longer, deeper session for when you have time and your body genuinely needs it. Work slowly into each position. Passive stretching at this intensity requires patience, not force.',
    difficulty: 'Intermediate',
    estimatedTime: 25,
    tags: ['Hips', 'Hamstrings', 'Flexibility', 'Deep Stretch'],
    isPremium: true,
    blocks: [
      {
        movementId: 'supine_windshield_wipers',
        dose: { kind: 'duration', seconds: 90 },
      },
      { movementId: 'happy_baby', dose: { kind: 'duration', seconds: 90 } },
      {
        movementId: 'hip_90_90_with_forward_fold',
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        movementId: 'pigeon_pose',
        dose: { kind: 'duration_bilateral', secondsPerSide: 120 },
      },
      {
        movementId: 'wide_leg_forward_fold',
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        movementId: 'seated_forward_fold',
        dose: { kind: 'duration', seconds: 120 },
      },
      {
        movementId: 'reclined_butterfly',
        dose: { kind: 'duration', seconds: 120 },
      },
      { movementId: 'savasana', dose: { kind: 'duration', seconds: 120 } },
    ],
    equipment: [],
  },
  {
    id: 'r_12',
    title: 'Pre-Workout Activation',
    description:
      'Not a stretch session. This is activation. Prime your glutes, open your hips, and wake up the scapular muscles so your body is actually ready to train, not just warm.',
    difficulty: 'Intermediate',
    estimatedTime: 12,
    tags: ['Activation', 'Pre-Workout', 'Glutes', 'Scapula'],
    isPremium: true,
    blocks: [
      { movementId: 'glute_bridges', dose: { kind: 'reps', count: 20 } },
      {
        movementId: 'clamshells',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      {
        movementId: 'banded_monster_walks',
        dose: {
          kind: 'reps',
          count: 10,
          unit: 'steps',
          rounds: 4,
          roundsLabel: 'each direction',
        },
      },
      {
        movementId: 'bear_crawl_hold',
        dose: { kind: 'duration', seconds: 30 },
      },
      {
        movementId: 'worlds_greatest_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 45 },
      },
      { movementId: 'banded_pull_aparts', dose: { kind: 'reps', count: 20 } },
      { movementId: 'inchworms', dose: { kind: 'reps', count: 8 } },
    ],
    equipment: ['bands'],
  },
  {
    id: 'p_01',
    title: 'Full Body Flush',
    description:
      'A head-to-toe percussive reset. Cycle through every major muscle group to reduce soreness, improve circulation, and leave you feeling like you have new legs. Use the ball attachment throughout.',
    difficulty: 'Beginner',
    estimatedTime: 15,
    tags: ['Full Body', 'Recovery', 'Percussive'],
    isPremium: false,
    blocks: [
      {
        movementId: 'upper_traps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'pecs',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'lats',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'quads',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'hamstrings',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'calves',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'glutes',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_02',
    title: 'Upper Body Reset',
    description:
      'Thorough percussive work across the shoulders, chest, arms, and upper back. Ideal after pressing, pulling, or overhead sessions. Spend longer on any area that feels particularly knotted.',
    difficulty: 'Beginner',
    estimatedTime: 18,
    tags: ['Upper Body', 'Recovery', 'Percussive', 'Shoulders'],
    isPremium: true,
    blocks: [
      {
        movementId: 'upper_traps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'rear_delts_and_teres',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'pecs',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'biceps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'triceps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Medium' },
            { seconds: 45, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'forearms',
        dose: {
          kind: 'percussive_bilateral',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'rhomboids_and_mid_traps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'lats',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_03',
    title: 'Lower Body Reset',
    description:
      'A complete percussive flush for the hips, quads, hamstrings, calves, and feet. Use this after leg day, heavy squatting, or any session that leaves your legs feeling beaten up.',
    difficulty: 'Beginner',
    estimatedTime: 20,
    tags: ['Lower Body', 'Recovery', 'Percussive', 'Legs'],
    isPremium: true,
    blocks: [
      {
        movementId: 'hip_flexors',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'glutes',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Medium' },
            { seconds: 90, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'it_band_and_outer_quad',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Light' },
          ],
        },
      },
      {
        movementId: 'quads',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'adductors_inner_thigh',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'hamstrings',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'calves',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'plantar_fascia_feet',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 45, intensity: 'Light' },
            { seconds: 45, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_04',
    title: 'Run Warm-Up',
    description:
      'A pre-run percussive activation sequence. The goal here is not recovery but stimulation: waking up the calves, quads, glutes, and hip flexors so they are firing properly before your first kilometre. Keep sessions brief and pressure moderate.',
    difficulty: 'Beginner',
    estimatedTime: 8,
    tags: ['Running', 'Warm-Up', 'Percussive', 'Activation'],
    isPremium: true,
    blocks: [
      {
        movementId: 'hip_flexors',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        movementId: 'glutes',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 30, intensity: 'Medium' },
            { seconds: 30, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'quads',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        movementId: 'hamstrings',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 30, intensity: 'Light' },
            { seconds: 30, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'calves',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 30, intensity: 'Medium' }],
        },
      },
      {
        movementId: 'plantar_fascia_feet',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 20, intensity: 'Light' }],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_05',
    title: 'Run Recovery',
    description:
      'Designed for the 30 minutes after a run, while your muscles are still warm. Works through every tissue that absorbs impact during running: calves, plantar fascia, quads, hamstrings, and glutes. Slower and deeper than the warm-up.',
    difficulty: 'Beginner',
    estimatedTime: 16,
    tags: ['Running', 'Recovery', 'Percussive', 'Post-Run'],
    isPremium: true,
    blocks: [
      {
        movementId: 'plantar_fascia_feet',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'calves',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'achilles_and_lower_leg',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 45, intensity: 'Light' }],
        },
      },
      {
        movementId: 'hamstrings',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'quads',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'it_band_and_outer_thigh',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 60, intensity: 'Light' }],
        },
      },
      {
        movementId: 'glutes',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Medium' },
            { seconds: 90, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'hip_flexors',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'p_06',
    title: 'Climbing Recovery',
    description:
      'Targeted percussive work for the specific demands of climbing: forearms, hands, lats, and the upper back. Use this after a bouldering or route session to flush the forearms before they stiffen up.',
    difficulty: 'Beginner',
    estimatedTime: 16,
    tags: ['Climbing', 'Recovery', 'Percussive', 'Forearms'],
    isPremium: true,
    blocks: [
      {
        movementId: 'forearm_flexors',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 90, intensity: 'Light' },
            { seconds: 90, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'forearm_extensors',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'thenar_and_hypothenar_hand_muscles',
        dose: {
          kind: 'percussive',
          passes: [{ seconds: 45, intensity: 'Light' }],
        },
      },
      {
        movementId: 'biceps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
      {
        movementId: 'lats',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'rhomboids_and_mid_traps',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Medium' },
            { seconds: 60, intensity: 'Firm' },
          ],
        },
      },
      {
        movementId: 'upper_traps_and_neck_base',
        dose: {
          kind: 'percussive',
          passes: [
            { seconds: 60, intensity: 'Light' },
            { seconds: 60, intensity: 'Medium' },
          ],
        },
      },
    ],
    equipment: ['percussive device'],
  },
  {
    id: 'r_13',
    title: 'Knee and Hip Health',
    description:
      'Prehab for two of the most injury-prone joints in the body. This flow combines targeted strengthening, controlled mobility, and loaded stretching to build resilience rather than just temporary relief. Consistency with this one pays dividends.',
    difficulty: 'Intermediate',
    estimatedTime: 22,
    tags: ['Knees', 'Hips', 'Prehab', 'Mobility'],
    isPremium: true,
    blocks: [
      {
        movementId: 'supine_hip_circles',
        dose: {
          kind: 'duration',
          seconds: 30,
          rounds: 2,
          roundsLabel: 'each direction',
        },
      },
      {
        movementId: 'clamshells_with_band',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      { movementId: 'banded_glute_bridge', dose: { kind: 'reps', count: 20 } },
      {
        movementId: 'terminal_knee_extension_with_band',
        dose: { kind: 'reps_bilateral', countPerSide: 20, unit: 'reps' },
      },
      { movementId: 'wall_sit', dose: { kind: 'duration', seconds: 45 } },
      {
        movementId: 'hip_90_90',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'couch_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'supine_figure_four',
        dose: { kind: 'duration_bilateral', secondsPerSide: 90 },
      },
      {
        movementId: 'lateral_band_walk',
        dose: { kind: 'reps_bilateral', countPerSide: 15, unit: 'steps' },
      },
      { movementId: 'childs_pose', dose: { kind: 'duration', seconds: 90 } },
    ],
    equipment: ['bands'],
  },
  {
    id: 'r_14',
    title: 'Olympic Lifting Warm-Up',
    description:
      'Eight minutes to prime hips, ankles, shoulders, and wrists before snatches and cleans. Dynamic mobility and light activation - move with intent and build range before you touch the bar.',
    difficulty: 'Intermediate',
    estimatedTime: 8,
    tags: [
      'Warm-Up',
      'Pre-Workout',
      'Activation',
      'Hips',
      'Shoulders',
      'Mobility',
    ],
    isPremium: true,
    blocks: [
      { movementId: 'arm_swings', dose: { kind: 'duration', seconds: 45 } },
      {
        movementId: 'supine_hip_circles',
        dose: {
          kind: 'duration',
          seconds: 30,
          rounds: 2,
          roundsLabel: 'each direction',
        },
      },
      { movementId: 'cat_cow', dose: { kind: 'duration', seconds: 45 } },
      {
        movementId: 'downward_dog_with_pedalling',
        dose: { kind: 'duration', seconds: 45 },
      },
      {
        movementId: 'worlds_greatest_stretch',
        dose: { kind: 'duration_bilateral', secondsPerSide: 30 },
      },
      { movementId: 'band_pass_throughs', dose: { kind: 'reps', count: 15 } },
      { movementId: 'wall_slides', dose: { kind: 'reps', count: 12 } },
      { movementId: 'banded_pull_aparts', dose: { kind: 'reps', count: 15 } },
      { movementId: 'glute_bridges', dose: { kind: 'reps', count: 15 } },
      { movementId: 'wrist_circles', dose: { kind: 'duration', seconds: 30 } },
      {
        movementId: 'kneeling_hip_flexor_stretch_with_reach',
        dose: { kind: 'duration_bilateral', secondsPerSide: 25 },
      },
    ],
    equipment: ['bands'],
  },
];
