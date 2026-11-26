import { temperedDailyWorkouts } from '@/src/data/temperedDaily';
import { standaloneWorkouts } from '@/src/data/workouts';
import { isTimedWorkoutFormat } from './deriveWorkoutTimerConfig';
import * as fs from 'fs';
import * as path from 'path';

type CoverageRow = {
  id: string;
  title: string;
  format?: string;
  source: 'standalone';
  status: 'tagged' | 'skipped_untimed';
  timerType?: string;
  reason?: string;
};

describe('workout gym timer coverage', () => {
  it('tags every timed-format WOD and skips strength/untimed', () => {
    const rows: CoverageRow[] = [];

    const consider = (
      workouts: typeof standaloneWorkouts,
      source: CoverageRow['source']
    ) => {
      for (const w of workouts) {
        if (isTimedWorkoutFormat(w.format)) {
          expect(w.timerConfig).toBeTruthy();
          rows.push({
            id: w.id,
            title: w.title,
            format: w.format,
            source,
            status: 'tagged',
            timerType: w.timerConfig?.type,
          });
        } else {
          rows.push({
            id: w.id,
            title: w.title,
            format: w.format,
            source,
            status: 'skipped_untimed',
            reason: w.format
              ? `format_${w.format}`
              : 'no_timed_format_strength_or_skill',
          });
        }
      }
    };

    consider(standaloneWorkouts, 'standalone');

    // Daily sessions are timed per block; see deriveDailyBlockTimerConfig.test.ts.
    for (const w of temperedDailyWorkouts) {
      expect(w.timerConfig).toBeUndefined();
    }

    const tagged = rows.filter((r) => r.status === 'tagged');
    const skipped = rows.filter((r) => r.status === 'skipped_untimed');
    expect(tagged.length).toBeGreaterThan(50);

    const outPath = path.join(
      process.cwd(),
      'scripts/gym-timer-coverage.json'
    );
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(
      outPath,
      JSON.stringify(
        {
          generatedAt: new Date().toISOString(),
          tagged: tagged.length,
          skipped: skipped.length,
          rows,
        },
        null,
        2
      )
    );
  });
});
