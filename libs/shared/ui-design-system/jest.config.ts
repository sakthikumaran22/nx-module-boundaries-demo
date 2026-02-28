/* eslint-disable */
export default {
  displayName: 'ui-design-system',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/libs/shared/ui-design-system',
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
