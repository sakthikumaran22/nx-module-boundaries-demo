/* eslint-disable */
export default {
  displayName: 'util-formatters',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/shared/util-formatters',
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
