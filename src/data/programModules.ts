import type { Warmup } from '@/src/types/program';

export const fiveMinuteWarmup: Warmup = {
  type: 'warmup',
  title: 'Warm-Up',
  additionalDescription: '5 minutes. Build heat, move well, feel ready.',
  description: [
    '60s easy cardio (march, jog on the spot, or bike)',
    '10 bodyweight squats',
    '10 glute bridges',
    '10 inchworms (walk hands out and back)',
    '30s plank (knees down is fine)',
    '30s shoulder circles + arm swings',
  ],
};

export const fiveMinuteCooldown: Warmup = {
  type: 'warmup',
  title: 'Cool-Down',
  additionalDescription: '5 minutes. Breathe, reset, and let your heart rate come down.',
  description: [
    '60s slow breathing (in through nose, long exhale)',
    '60s calf stretch (switch sides halfway)',
    '60s hip flexor stretch (switch sides halfway)',
    '60s chest/shoulder opener',
    '60s gentle forward fold (soft knees)',
  ],
};

