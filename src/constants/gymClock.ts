/**
 * Gym-clock overlay palette. Intentionally ignores app theme tokens so the
 * overlay reads like a wall-mounted LED clock in light and dark mode.
 */
export const gymClock = {
  panel: '#000000',
  mode: '#0137FE',
  leadIn: '#FF0400',
  work: '#28FB75',
  rest: '#FF0400',
  plain: '#FF0400',
  round: '#E5E7EB',
  controls: 'rgba(255, 255, 255, 0.45)',
  controlsStrong: 'rgba(255, 255, 255, 0.85)',
  ghostDigit: 'rgba(255, 255, 255, 0.09)',
} as const;

export const gymClockFont = {
  /** SIL OFL — see assets/fonts/DSEG-LICENSE.txt */
  digits: 'DSEG7Classic-Bold',
} as const;
