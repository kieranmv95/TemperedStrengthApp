import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

/**
 * Lightweight in-memory stand-in for expo-sqlite so unit tests can exercise
 * personal bests + workout log repositories without native modules.
 */
jest.mock('expo-sqlite', () => {
  const mockSchemaMigrations = new Map();
  const mockDomainMeta = new Map();
  const mockPersonalBestEntries = new Map();
  const mockWorkoutLogSets = new Map();

  const metaKey = (domain: string, key: string) => `${domain}::${key}`;

  const db = {
    execAsync: jest.fn(async () => undefined),
    runAsync: jest.fn(async (sql, ...params) => {
      const args = params;
      const normalized = String(sql).replace(/\s+/g, ' ').trim();

      if (normalized.startsWith('INSERT INTO schema_migrations')) {
        const [version, name, applied_at] = args;
        mockSchemaMigrations.set(version, { version, name, applied_at });
        return { changes: 1, lastInsertRowId: version };
      }

      if (normalized.includes('INSERT INTO domain_meta')) {
        const [domain, key, value] = args;
        mockDomainMeta.set(metaKey(domain, key), value);
        return { changes: 1, lastInsertRowId: 0 };
      }

      if (normalized.startsWith('DELETE FROM domain_meta')) {
        const [domain] = args;
        for (const key of [...mockDomainMeta.keys()]) {
          if (String(key).startsWith(`${domain}::`)) {
            mockDomainMeta.delete(key);
          }
        }
        return { changes: 1, lastInsertRowId: 0 };
      }

      if (normalized.includes('INSERT INTO personal_best_entries')) {
        const [
          id,
          exercise_id,
          rep_max,
          weight,
          achieved_at,
          updated_at,
          deleted_at,
          dirty,
        ] = args;
        mockPersonalBestEntries.set(String(id), {
          id,
          exercise_id,
          rep_max,
          weight,
          achieved_at,
          updated_at,
          deleted_at,
          dirty,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }

      if (normalized.startsWith('UPDATE personal_best_entries SET dirty = 0')) {
        const [id] = args;
        const row = mockPersonalBestEntries.get(id);
        if (row) {
          mockPersonalBestEntries.set(id, { ...row, dirty: 0 });
        }
        return { changes: row ? 1 : 0, lastInsertRowId: 0 };
      }

      if (
        normalized.startsWith('UPDATE personal_best_entries SET deleted_at')
      ) {
        const [deleted_at, updated_at, id] = args;
        const row = mockPersonalBestEntries.get(id);
        if (row && row.deleted_at == null) {
          mockPersonalBestEntries.set(id, {
            ...row,
            deleted_at,
            updated_at,
            dirty: 1,
          });
          return { changes: 1, lastInsertRowId: 0 };
        }
        return { changes: 0, lastInsertRowId: 0 };
      }

      if (normalized.startsWith('DELETE FROM personal_best_entries')) {
        mockPersonalBestEntries.clear();
        return { changes: 1, lastInsertRowId: 0 };
      }

      if (normalized.includes('INSERT INTO workout_log_sets')) {
        const [
          id,
          day_index,
          slot_index,
          set_index,
          weight,
          reps,
          state,
          updated_at,
          deleted_at,
          dirty,
        ] = args;
        mockWorkoutLogSets.set(String(id), {
          id,
          day_index,
          slot_index,
          set_index,
          weight,
          reps,
          state,
          updated_at,
          deleted_at,
          dirty,
        });
        return { changes: 1, lastInsertRowId: 0 };
      }

      if (normalized.startsWith('UPDATE workout_log_sets SET dirty = 0')) {
        const [id] = args;
        const row = mockWorkoutLogSets.get(id);
        if (row) {
          mockWorkoutLogSets.set(id, { ...row, dirty: 0 });
        }
        return { changes: row ? 1 : 0, lastInsertRowId: 0 };
      }

      if (
        normalized.includes('UPDATE workout_log_sets') &&
        normalized.includes('deleted_at =')
      ) {
        if (args.length === 3 && typeof args[2] === 'string') {
          const [deleted_at, updated_at, id] = args;
          const row = mockWorkoutLogSets.get(id);
          if (row && row.deleted_at == null) {
            mockWorkoutLogSets.set(id, {
              ...row,
              deleted_at,
              updated_at,
              dirty: 1,
            });
            return { changes: 1, lastInsertRowId: 0 };
          }
          return { changes: 0, lastInsertRowId: 0 };
        }
        if (args.length === 4 && typeof args[2] === 'number') {
          const [deleted_at, updated_at, a, b] = args;
          let changes = 0;
          if (normalized.includes('slot_index =')) {
            for (const [id, row] of mockWorkoutLogSets) {
              if (
                row.day_index === a &&
                row.slot_index === b &&
                row.deleted_at == null
              ) {
                mockWorkoutLogSets.set(id, {
                  ...row,
                  deleted_at,
                  updated_at,
                  dirty: 1,
                });
                changes += 1;
              }
            }
          } else if (
            normalized.includes('day_index = ? AND deleted_at IS NULL')
          ) {
            for (const [id, row] of mockWorkoutLogSets) {
              if (row.day_index === a && row.deleted_at == null) {
                mockWorkoutLogSets.set(id, {
                  ...row,
                  deleted_at,
                  updated_at,
                  dirty: 1,
                });
                changes += 1;
              }
            }
          } else if (normalized.includes('day_index >= ?')) {
            for (const [id, row] of mockWorkoutLogSets) {
              if (row.day_index >= a && row.deleted_at == null) {
                mockWorkoutLogSets.set(id, {
                  ...row,
                  deleted_at,
                  updated_at,
                  dirty: 1,
                });
                changes += 1;
              }
            }
          }
          return { changes, lastInsertRowId: 0 };
        }
        if (args.length === 2) {
          const [deleted_at, updated_at] = args;
          let changes = 0;
          for (const [id, row] of mockWorkoutLogSets) {
            if (row.deleted_at == null) {
              mockWorkoutLogSets.set(id, {
                ...row,
                deleted_at,
                updated_at,
                dirty: 1,
              });
              changes += 1;
            }
          }
          return { changes, lastInsertRowId: 0 };
        }
      }

      if (normalized.startsWith('DELETE FROM workout_log_sets')) {
        mockWorkoutLogSets.clear();
        return { changes: 1, lastInsertRowId: 0 };
      }

      return { changes: 0, lastInsertRowId: 0 };
    }),
    getFirstAsync: jest.fn(async (sql, ...params) => {
      const args = params;
      const normalized = String(sql).replace(/\s+/g, ' ').trim();

      if (normalized.includes('FROM domain_meta')) {
        const [domain, key] = args;
        const value = mockDomainMeta.get(metaKey(domain, key));
        return value === undefined ? null : { value };
      }

      if (normalized.includes('FROM personal_best_entries WHERE id')) {
        const [id] = args;
        const row = mockPersonalBestEntries.get(id);
        if (!row) return null;
        return {
          id: row.id,
          updated_at: row.updated_at,
          dirty: row.dirty,
        };
      }

      if (
        normalized.includes('COUNT(*)') &&
        normalized.includes('personal_best_entries')
      ) {
        return { count: mockPersonalBestEntries.size };
      }

      if (normalized.includes('FROM workout_log_sets WHERE id')) {
        const [id] = args;
        const row = mockWorkoutLogSets.get(id);
        if (!row) return null;
        return {
          updated_at: row.updated_at,
          dirty: row.dirty,
        };
      }

      if (
        normalized.includes('COUNT(*)') &&
        normalized.includes('workout_log_sets')
      ) {
        return { count: mockWorkoutLogSets.size };
      }

      return null;
    }),
    getAllAsync: jest.fn(async (sql, ...params) => {
      const args = params;
      const normalized = String(sql).replace(/\s+/g, ' ').trim();

      if (normalized.includes('FROM schema_migrations')) {
        return [...mockSchemaMigrations.values()].sort(
          (a, b) => Number(a.version) - Number(b.version)
        );
      }

      if (
        normalized.includes('FROM personal_best_entries') &&
        normalized.includes('deleted_at IS NULL')
      ) {
        return [...mockPersonalBestEntries.values()].filter(
          (row) => row.deleted_at == null
        );
      }

      if (
        normalized.includes('FROM personal_best_entries') &&
        normalized.includes('dirty = 1')
      ) {
        return [...mockPersonalBestEntries.values()].filter(
          (row) => row.dirty === 1
        );
      }

      if (
        normalized.includes('FROM workout_log_sets') &&
        normalized.includes('day_index = ? AND slot_index = ?')
      ) {
        const [dayIndex, slotIndex] = args;
        return [...mockWorkoutLogSets.values()].filter(
          (row) =>
            row.day_index === dayIndex &&
            row.slot_index === slotIndex &&
            row.deleted_at == null
        );
      }

      if (
        normalized.includes('FROM workout_log_sets') &&
        normalized.includes('WHERE dirty = 1')
      ) {
        return [...mockWorkoutLogSets.values()].filter(
          (row) => row.dirty === 1
        );
      }

      if (
        normalized.includes('FROM workout_log_sets') &&
        normalized.includes('day_index = ?')
      ) {
        const [dayIndex] = args;
        return [...mockWorkoutLogSets.values()]
          .filter(
            (row) => row.day_index === dayIndex && row.deleted_at == null
          )
          .sort(
            (a, b) =>
              Number(a.slot_index) - Number(b.slot_index) ||
              Number(a.set_index) - Number(b.set_index)
          );
      }

      return [];
    }),
    withTransactionAsync: jest.fn(async (task) => {
      await task();
    }),
    closeAsync: jest.fn(async () => undefined),
  };

  return {
    openDatabaseAsync: jest.fn(async () => db),
    openDatabaseSync: jest.fn(() => db),
  };
});
