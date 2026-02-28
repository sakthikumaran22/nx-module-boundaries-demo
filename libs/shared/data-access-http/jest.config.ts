/* eslint-disable */
export default {
  displayName: 'data-access-http',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/shared/data-access-http',
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
