/* eslint-disable */
export default {
  displayName: 'feature-transfer',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/payments/feature-transfer',
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
