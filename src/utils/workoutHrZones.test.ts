import { mentionedHrZone } from '@/src/utils/workoutHrZones';

describe('mentionedHrZone', () => {
  it('finds a zone in the block name or instructions', () => {
    expect(mentionedHrZone({ name: 'WOD: Zone 2 x 30' })).toBe(2);
    expect(
      mentionedHrZone({ name: 'Run', instructions: 'Hold zone 3 throughout' })
    ).toBe(3);
  });

  it('ignores words that only contain "zone"', () => {
    expect(mentionedHrZone({ name: 'Roxzone Transitions' })).toBeNull();
    expect(mentionedHrZone({ name: 'Cooldown' })).toBeNull();
  });
});
