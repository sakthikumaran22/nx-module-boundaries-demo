/* eslint-disable */
export default {
  displayName: 'feature-repayment',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/loans/feature-repayment',
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
