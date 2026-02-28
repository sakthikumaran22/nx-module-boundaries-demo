/* eslint-disable */
export default {
  displayName: 'feature-apply',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/loans/feature-apply',
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
