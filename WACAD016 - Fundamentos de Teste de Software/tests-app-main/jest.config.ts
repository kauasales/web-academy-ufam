import type {Config} from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageDirectory: "coverage",
  testMatch: ['**/tests/**/*.test.js'],
  transform: { '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest' },
  testEnvironment: 'jsdom',
};

export default config;