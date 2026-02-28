/* eslint-disable */
export default {
  displayName: 'feature-dashboard',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/accounts/feature-dashboard',
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
};
