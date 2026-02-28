/* eslint-disable */
export default {
  displayName: 'feature-settings',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/accounts/feature-settings',
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
