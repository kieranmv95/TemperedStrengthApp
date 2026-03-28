const expoPreset = require('jest-expo/jest-preset');

module.exports = {
  ...expoPreset,
  setupFiles: ['<rootDir>/jest.polyfills.js', ...(expoPreset.setupFiles || [])],
  setupFilesAfterEnv: [
    ...(expoPreset.setupFilesAfterEnv || []),
    '<rootDir>/jest.setup.ts',
  ],
  moduleNameMapper: {
    ...expoPreset.moduleNameMapper,
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/index.ts',
    '!src/**/*.d.ts',
  ],
};
