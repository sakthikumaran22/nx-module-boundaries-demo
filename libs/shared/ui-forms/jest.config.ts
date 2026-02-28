/* eslint-disable */
export default {
  displayName: 'ui-forms',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/shared/ui-forms',
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
