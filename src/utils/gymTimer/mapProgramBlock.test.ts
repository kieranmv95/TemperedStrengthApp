import type { WorkoutBlock } from '@/src/types/program';
import { mapProgramBlockToGymTimer } from './mapProgramBlock';

describe('mapProgramBlockToGymTimer', () => {
  it('maps tabata', () => {
    const block: WorkoutBlock = {
      id: 'wod',
      title: 'Push Tabata',
      type: 'tabata',
      rounds: 8,
      workSeconds: 20,
      restSeconds: 10,
    };
    expect(mapProgramBlockToGymTimer(block)).toMatchObject({
      type: 'TABATA',
      config: { rounds: 8, workSec: 20, restSec: 10 },
    });
  });

  it('maps emom with default interval', () => {
    const block: WorkoutBlock = {
      id: 'emom',
      title: 'EMOM',
      type: 'emom',
      minutes: 12,
    };
    expect(mapProgramBlockToGymTimer(block)).toMatchObject({
      type: 'EMOM',
      config: { rounds: 12, intervalSec: 60 },
    });
  });

  it('returns null for warmup', () => {
    const block: WorkoutBlock = {
      id: 'wu',
      title: 'Warm-up',
      type: 'warmup',
      description: ['Jumping jacks'],
    };
    expect(mapProgramBlockToGymTimer(block)).toBeNull();
  });
});
