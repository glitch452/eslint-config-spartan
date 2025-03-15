import jestPlugin from 'eslint-plugin-jest';
import { files, warnToError } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter } from 'eslint' */

/**
 * The `jest` mixin creates an ESLint config for [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) to
 * assist with using the [jest](https://jestjs.io) testing framework.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-jest` rules are prefixed with `jest`
 *
 * Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @returns {Linter.Config}
 */
export function jest(options = {}) {
  return {
    ...jestPlugin.configs['flat/recommended'],
    name: `${CONFIG_NAME_PREFIX}/${jest.name}`,
    files: options.files ?? [files.testSpec],
    rules: {
      ...warnToError(jestPlugin.configs['flat/recommended'].rules),
      'jest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
      'jest/max-expects': ['error', { max: 1 }],
      'jest/no-conditional-expect': 'error',
      'jest/no-disabled-tests': 'error',
      'jest/no-duplicate-hooks': 'error',
      'jest/no-focused-tests': 'error',
      'jest/no-standalone-expect': 'error',
      'jest/prefer-comparison-matcher': 'error',
      'jest/prefer-each': 'error',
      'jest/prefer-expect-resolves': 'error',
      'jest/prefer-mock-promise-shorthand': 'error',
      'jest/prefer-strict-equal': 'error',
      'jest/prefer-to-be': 'error',
      'jest/prefer-to-contain': 'error',
      'jest/prefer-to-have-length': 'error',
      'jest/require-hook': 'error',
      'jest/require-top-level-describe': ['error', { maxNumberOfTopLevelDescribes: 1 }],
      'jest/valid-title': ['error', { ignoreTypeOfDescribeName: true }],
      ...testEnvironmentAdjustments,
    },
  };
}
