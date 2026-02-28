/* eslint-disable */
export default {
  displayName: 'util-validators',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/shared/util-validators',
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
