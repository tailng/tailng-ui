export default {
  displayName: 'icons',
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleNameMapper: {
    '^@tailng-ui/ui$': '<rootDir>/../../libs/ui/src/public-api.ts',
    '^@tailng-ui/ui/(.*)$': '<rootDir>/../../libs/ui/$1/src/public-api.ts',
    '^@tailng-ui/cdk$': '<rootDir>/../../libs/cdk/src/public-api.ts',
    '^@tailng-ui/cdk/(.*)$': '<rootDir>/../../libs/cdk/$1/src/public-api.ts',
    '^@tailng-ui/icons$': '<rootDir>/../../libs/icons/src/public-api.ts',
    '^@tailng-ui/icons/(.*)$': '<rootDir>/../../libs/icons/$1/src/public-api.ts',
    '^@tailng-ui/theme$': '<rootDir>/../../libs/theme/src/public-api.ts',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '!**/*.spec.ts',
    '!**/*.d.ts',
    '!**/index.ts',
  ],
  coverageDirectory: '../../coverage/libs/icons',
};
