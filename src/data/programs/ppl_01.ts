import type { Program, Warmup } from '@/src/types/program';

export const standard_warmup: Warmup = {
  type: 'warmup',
  description: [
    '3–5 minutes light cardio (rower, bike, or brisk walk) to raise body temperature.',
    '30s hip flexor stretch each side / 30s hamstring stretch',
    '10 arm circles forward / 10 arm circles backward',
    '10 band pull-aparts or scapular wall slides',
    '10 leg swings (front-to-back) each side / 10 leg swings (side-to-side) each side',
    '10 glute bridges with 2s pause at the top',
    '10 bodyweight squats focusing on depth and control',
  ],
};

// 1. 3 DAY SPLIT (4 Weeks)
export const ppl_01: Program = {
  id: 'ppl_01',
  isPro: false,
  name: '3 Day Split',
  description:
    '4-Week Hypertrophy block. Rotates intensity and exercise variations to maximize muscle fiber recruitment.',
  daysSplit: ['mon', 'wed', 'fri'],
  averageSessionDuration: '60 min',
  workouts: Array.from({ length: 4 }).flatMap((_, week) => [
    {
      dayIndex: week * 7 + 0,
      label: `Push (Week ${week + 1})`,
      description:
        week % 2 === 0 ? 'Heavy Barbell Focus' : 'Dumbbell & Volume Focus',
      intensity: 7 + (week % 2),
      exercises: [
        standard_warmup,
        {
          type: 'exercise',
          id: week % 2 === 0 ? 1 : 2,
          sets: 3,
          repRange: [8, 10],
          restTimeSeconds: 150,
          additionalHeader:
            week % 2 === 0 ? 'Foundation Strength' : 'Stability & Range',
          additionalDescription:
            week % 2 === 0
              ? 'Barbell Bench: Focus on a controlled 2-second eccentric (lowering phase). Touch the chest lightly and drive up without bouncing.'
              : 'DB Bench: Allow the dumbbells to come slightly deeper than a barbell would. Focus on the stretch at the bottom and a hard squeeze at the top.',
        },
        {
          type: 'exercise',
          id: 27,
          sets: 3,
          repRange: [10, 12],
          restTimeSeconds: 60,
          additionalDescription:
            'Keep your core tight and avoid using momentum. Press the weights up in a slight arc so they meet at the top without touching.',
        },
        {
          type: 'exercise',
          id: 36,
          sets: 3,
          repRange: [12, 15],
          restTimeSeconds: 60,
          additionalHeader: 'Constant Tension',
          additionalDescription:
            'Do not fully lock out at the end of the movement. Keep the tension on the pectorals throughout the entire set. Think about hugging a large tree.',
        },
        {
          type: 'exercise',
          id: 33,
          sets: 3,
          repRange: [12, 15],
          restTimeSeconds: 60,
          isAmrap: week === 3,
          additionalDescription:
            'Keep your elbows tucked and stationary. Only your forearms should move. On the final week, push until your form starts to break.',
        },
      ],
    },
    {
      dayIndex: week * 7 + 2,
      label: `Pull (Week ${week + 1})`,
      description: 'Mid-back and Lat development with bicep finishers.',
      intensity: 7,
      exercises: [
        standard_warmup,
        {
          type: 'exercise',
          id: week % 2 === 0 ? 7 : 8,
          sets: 3,
          repRange: [8, 10],
          restTimeSeconds: 120,
          additionalHeader: 'Back Thickness',
          additionalDescription:
            'Think of your hands as hooks. Pull with your elbows and imagine trying to put them in your back pockets to fully engage the lats.',
        },
        {
          type: 'exercise',
          id: 10,
          sets: 3,
          repRange: [6, 10],
          restTimeSeconds: 120,
          additionalDescription:
            'Pull your chest to the bar, not just your chin. Squeeze your shoulder blades together at the top of every rep.',
        },
        {
          type: 'exercise',
          id: 35,
          sets: 3,
          repRange: [15, 20],
          restTimeSeconds: 60,
          additionalDescription:
            "A high-rep 'pump' movement. Pull the rope toward your eyes and pull the ends apart to target the rear deltoids and traps.",
        },
        {
          type: 'exercise',
          id: 32,
          sets: 3,
          repRange: [10, 12],
          restTimeSeconds: 60,
          isAmrap: true,
          additionalHeader: 'Bicep Peak',
          additionalDescription:
            'No swinging. Keep your back against a wall or post if you find yourself using your hips to move the weight.',
        },
      ],
    },
    {
      dayIndex: week * 7 + 4,
      label: `Legs (Week ${week + 1})`,
      description: 'Compound leg movements followed by high-rep isolation.',
      intensity: 8 + (week === 3 ? 1 : 0),
      exercises: [
        standard_warmup,
        {
          type: 'exercise',
          id: week % 2 === 0 ? 4 : 19,
          sets: 3,
          repRange: [8, 10],
          restTimeSeconds: 150,
          additionalHeader: 'Posterior & Anterior Load',
          additionalDescription:
            week % 2 === 0
              ? 'Barbell Squats: Maintain a vertical chest. Break at the hips and knees simultaneously. Drive through the mid-foot.'
              : "Leg Press: Place feet shoulder-width apart. Don't let your lower back lift off the seat at the bottom of the movement.",
        },
        {
          type: 'exercise',
          id: 23,
          sets: 3,
          repRange: [10, 12],
          restTimeSeconds: 120,
          additionalDescription:
            "Focus on the 'hinge.' Push your hips as far back as possible until you feel a deep stretch in your hamstrings, then snap forward.",
        },
        {
          type: 'exercise',
          id: 39,
          sets: 3,
          repRange: [12, 15],
          restTimeSeconds: 60,
          additionalHeader: 'Quad Isolation',
          additionalDescription:
            'Pause for 1 second at the top of each rep with legs fully extended to maximize the contraction of the rectus femoris.',
        },
        {
          type: 'exercise',
          id: 31,
          sets: 3,
          repRange: [10, 15],
          restTimeSeconds: 60,
          isAmrap: true,
          additionalDescription:
            'Keep your legs as straight as possible. Curl your pelvis toward your belly button at the top to engage the lower abdominals.',
        },
      ],
    },
  ]),
};
