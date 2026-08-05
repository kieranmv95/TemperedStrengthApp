import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// expo-sqlite pulls native/Expo asset modules; unit tests use this lightweight stub.
jest.mock('expo-sqlite', () => {
  const db = {
    execAsync: jest.fn(async () => undefined),
    runAsync: jest.fn(async () => ({ changes: 0, lastInsertRowId: 0 })),
    getFirstAsync: jest.fn(async () => null),
    getAllAsync: jest.fn(async () => []),
    withTransactionAsync: jest.fn(async (task: () => Promise<void>) => {
      await task();
    }),
    closeAsync: jest.fn(async () => undefined),
  };
  return {
    openDatabaseAsync: jest.fn(async () => db),
    openDatabaseSync: jest.fn(() => db),
  };
});
