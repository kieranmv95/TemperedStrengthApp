import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('@oleg_svetlichnyi/expo-icloud-storage', () => {
  return {
    createDirAsync: jest.fn(async () => undefined),
    defaultICloudContainerPath: null,
    downloadFileAsync: jest.fn(async () => {
      throw new Error('iCloud not available in Jest');
    }),
    isExistAsync: jest.fn(async () => false),
    isICloudAvailableAsync: jest.fn(async () => false),
    uploadFileAsync: jest.fn(async () => {
      throw new Error('iCloud not available in Jest');
    }),
  };
});
