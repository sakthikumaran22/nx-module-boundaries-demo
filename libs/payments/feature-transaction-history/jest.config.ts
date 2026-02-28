/* eslint-disable */
export default {
  displayName: 'feature-transaction-history',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/payments/feature-transaction-history',
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
