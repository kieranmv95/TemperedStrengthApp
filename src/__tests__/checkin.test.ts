import {
  getBundledCatalogue,
  resolveCatalogue,
} from '@/src/utils/checkin/catalogue';
import {
  FREE_BEHAVIOUR_CAP,
  canAddActiveSupplement,
  canAddBehaviour,
  countActiveSupplements,
  countCapBehaviours,
} from '@/src/utils/checkin/caps';
import {
  expectedTimesForDate,
  scheduleAppliesOnDate,
} from '@/src/utils/checkin/schedule';
import {
  buildCheckinStats,
  completionStreakEndingAt,
  isDayComplete,
} from '@/src/utils/checkin/stats';
import type { BehaviourCatalogue } from '@/src/types/checkin';
import type { SupplementSchedule } from '@/src/types/supplements';
import { deriveDosesForDate } from '@/src/utils/storage/checkin';

describe('checkin catalogue', () => {
  it('uses bundled catalogue with contractual version and week start', () => {
    const bundled = getBundledCatalogue();
    expect(bundled.catalogueVersion).toBe(2);
    expect(
      bundled.behaviours.some((b) => b.id === 'recovery_activity')
    ).toBe(true);
    expect(bundled.weekStartsOn).toBe(1);
    expect(bundled.behaviours.length).toBeGreaterThan(50);
    expect(bundled.behaviours.some((b) => b.id === 'strength_session')).toBe(
      true
    );
    expect(bundled.behaviours.filter((b) => b.category === 'womens_health')).toHaveLength(
      11
    );
  });

  it('prefers remote only when catalogueVersion is higher', () => {
    const bundled = getBundledCatalogue();
    const older: BehaviourCatalogue = {
      ...bundled,
      catalogueVersion: bundled.catalogueVersion - 1,
    };
    const newer: BehaviourCatalogue = {
      ...bundled,
      catalogueVersion: bundled.catalogueVersion + 1,
      behaviours: [
        ...bundled.behaviours,
        {
          id: 'future_behaviour',
          category: 'mind',
          label: 'Future',
          responseType: 'boolean',
          goalable: false,
          autofillable: false,
          sensitive: false,
          sortOrder: 9990,
          deprecated: false,
        },
      ],
    };
    expect(resolveCatalogue(bundled, older)).toBe(bundled);
    expect(resolveCatalogue(bundled, newer).catalogueVersion).toBe(
      bundled.catalogueVersion + 1
    );
    expect(
      resolveCatalogue(bundled, newer).behaviours.some(
        (b) => b.id === 'future_behaviour'
      )
    ).toBe(true);
  });

  it('hides deprecated from selection semantics (filter in helper)', () => {
    const bundled = getBundledCatalogue();
    const withDeprecated: BehaviourCatalogue = {
      ...bundled,
      behaviours: bundled.behaviours.map((b, i) =>
        i === 0 ? { ...b, deprecated: true } : b
      ),
    };
    const selectable = withDeprecated.behaviours.filter((b) => !b.deprecated);
    expect(selectable.length).toBe(withDeprecated.behaviours.length - 1);
  });
});

describe('checkin schedule', () => {
  const base: SupplementSchedule = {
    type: 'daily',
    times: ['08:00', '20:00'],
    startDate: '2026-09-01',
  };

  it('daily applies after startDate', () => {
    expect(scheduleAppliesOnDate(base, '2026-08-31')).toBe(false);
    expect(scheduleAppliesOnDate(base, '2026-09-01')).toBe(true);
    expect(expectedTimesForDate(base, '2026-09-10')).toEqual([
      '08:00',
      '20:00',
    ]);
  });

  it('respects endDate', () => {
    const s: SupplementSchedule = { ...base, endDate: '2026-09-05' };
    expect(scheduleAppliesOnDate(s, '2026-09-05')).toBe(true);
    expect(scheduleAppliesOnDate(s, '2026-09-06')).toBe(false);
  });

  it('specific_days uses ISO weekdays (1=Monday)', () => {
    // 2026-09-14 is Monday
    const s: SupplementSchedule = {
      type: 'specific_days',
      daysOfWeek: [1, 3, 5],
      times: ['09:00'],
      startDate: '2026-09-01',
    };
    expect(scheduleAppliesOnDate(s, '2026-09-14')).toBe(true);
    expect(scheduleAppliesOnDate(s, '2026-09-15')).toBe(false);
    expect(scheduleAppliesOnDate(s, '2026-09-16')).toBe(true);
  });

  it('every_n_days counts from startDate', () => {
    const s: SupplementSchedule = {
      type: 'every_n_days',
      intervalDays: 2,
      times: ['10:00'],
      startDate: '2026-09-01',
    };
    expect(scheduleAppliesOnDate(s, '2026-09-01')).toBe(true);
    expect(scheduleAppliesOnDate(s, '2026-09-02')).toBe(false);
    expect(scheduleAppliesOnDate(s, '2026-09-03')).toBe(true);
  });

  it('cycle on/off', () => {
    const s: SupplementSchedule = {
      type: 'cycle',
      cycleOnDays: 2,
      cycleOffDays: 1,
      times: ['08:00'],
      startDate: '2026-09-01',
    };
    expect(scheduleAppliesOnDate(s, '2026-09-01')).toBe(true);
    expect(scheduleAppliesOnDate(s, '2026-09-02')).toBe(true);
    expect(scheduleAppliesOnDate(s, '2026-09-03')).toBe(false);
    expect(scheduleAppliesOnDate(s, '2026-09-04')).toBe(true);
  });
});

describe('checkin dose derivation', () => {
  const supplement = {
    id: 'sup-1',
    name: 'Creatine',
    form: 'powder' as const,
    doseAmount: 5,
    doseUnit: 'g' as const,
    schedule: {
      type: 'daily' as const,
      times: ['08:00'],
      startDate: '2026-09-01',
    },
    remindersEnabled: false,
    status: 'active' as const,
    createdAt: '2026-09-01T00:00:00.000Z',
  };

  it('marks past unlogged doses as missed, not stored', () => {
    const doses = deriveDosesForDate({
      date: '2026-09-10',
      today: '2026-09-14',
      supplements: [supplement],
      logs: [],
    });
    expect(doses).toHaveLength(1);
    expect(doses[0]?.status).toBe('missed');
  });

  it('marks logged taken/skipped', () => {
    const doses = deriveDosesForDate({
      date: '2026-09-14',
      today: '2026-09-14',
      supplements: [supplement],
      logs: [
        {
          date: '2026-09-14',
          supplementId: 'sup-1',
          scheduledTime: '08:00',
          status: 'taken',
          actionedAt: '2026-09-14T08:05:00.000Z',
        },
      ],
    });
    expect(doses[0]?.status).toBe('taken');
  });

  it('skips paused supplements', () => {
    const doses = deriveDosesForDate({
      date: '2026-09-14',
      today: '2026-09-14',
      supplements: [{ ...supplement, status: 'paused' }],
      logs: [],
    });
    expect(doses).toHaveLength(0);
  });
});

describe('checkin caps', () => {
  it('counts non-sensitive behaviours only', () => {
    expect(
      countCapBehaviours([
        { id: '1', behaviourId: 'a', sortOrder: 10, sensitive: false },
        { id: '2', behaviourId: 'b', sortOrder: 20, sensitive: true },
      ])
    ).toBe(1);
  });

  it('allows sensitive behaviours beyond free cap', () => {
    const tracked = [
      { id: '1', behaviourId: 'a', sortOrder: 10, sensitive: false },
      { id: '2', behaviourId: 'b', sortOrder: 20, sensitive: false },
      { id: '3', behaviourId: 'c', sortOrder: 30, sensitive: false },
    ];
    expect(
      canAddBehaviour({ isPro: false, tracked, behaviourSensitive: false })
    ).toBe(false);
    expect(
      canAddBehaviour({ isPro: false, tracked, behaviourSensitive: true })
    ).toBe(true);
    expect(FREE_BEHAVIOUR_CAP).toBe(3);
  });

  it('counts only active supplements', () => {
    expect(
      countActiveSupplements([
        {
          id: '1',
          name: 'A',
          form: 'capsule',
          doseAmount: 1,
          doseUnit: 'capsule',
          schedule: { type: 'daily', times: ['08:00'], startDate: '2026-01-01' },
          remindersEnabled: false,
          status: 'active',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: '2',
          name: 'B',
          form: 'capsule',
          doseAmount: 1,
          doseUnit: 'capsule',
          schedule: { type: 'daily', times: ['08:00'], startDate: '2026-01-01' },
          remindersEnabled: false,
          status: 'paused',
          createdAt: '2026-01-01T00:00:00.000Z',
        },
      ])
    ).toBe(1);
    expect(
      canAddActiveSupplement({
        isPro: false,
        supplements: [
          {
            id: '1',
            name: 'A',
            form: 'capsule',
            doseAmount: 1,
            doseUnit: 'capsule',
            schedule: {
              type: 'daily',
              times: ['08:00'],
              startDate: '2026-01-01',
            },
            remindersEnabled: false,
            status: 'active',
            createdAt: '2026-01-01T00:00:00.000Z',
          },
        ],
      })
    ).toBe(false);
  });
});

describe('checkin stats', () => {
  const tracked = ['strength_session', 'mood'];
  const entries = [
    {
      date: '2026-09-14',
      behaviourId: 'strength_session',
      value: true,
      loggedAt: 'x',
      source: 'manual' as const,
    },
    {
      date: '2026-09-14',
      behaviourId: 'mood',
      value: 3,
      loggedAt: 'x',
      source: 'manual' as const,
    },
    {
      date: '2026-09-13',
      behaviourId: 'strength_session',
      value: true,
      loggedAt: 'x',
      source: 'manual' as const,
    },
    {
      date: '2026-09-13',
      behaviourId: 'mood',
      value: 2,
      loggedAt: 'x',
      source: 'manual' as const,
    },
  ];

  it('detects complete days and streak', () => {
    expect(
      isDayComplete({
        date: '2026-09-14',
        trackedBehaviourIds: tracked,
        entries,
      })
    ).toBe(true);
    expect(
      completionStreakEndingAt({
        endDate: '2026-09-14',
        trackedBehaviourIds: tracked,
        entries,
      })
    ).toBe(2);
  });

  it('builds 7/30 percentages', () => {
    const stats = buildCheckinStats({
      today: '2026-09-14',
      trackedBehaviourIds: tracked,
      entries,
    });
    expect(stats.currentStreak).toBe(2);
    expect(stats.completion7).toBeGreaterThan(0);
    expect(stats.completion30).toBeGreaterThan(0);
  });
});
