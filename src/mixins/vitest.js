import vitestPlugin from '@vitest/eslint-plugin';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter, ESLint } from 'eslint' */

/**
 * The `vitest` mixin creates an ESLint config for
 * [@vitest/eslint-plugin](https://www.npmjs.com/package/@vitest/eslint-plugin) to assist with using the
 * [Vitest](https://vitest.dev) Testing Framework.
 *
 * Rule Prefixes:
 *
 * - The `@vitest/eslint-plugin` rules are prefixed with `vitest`
 *
 * Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @returns {Linter.Config}
 */
export function vitest(options = {}) {
  return {
    name: `${CONFIG_NAME_PREFIX}/${vitest.name}`,
    files: options.files ?? [files.testSpec],
    plugins: {
      [prefixes.vitest]: /** @type {Record<string, ESLint.Plugin>} */ (vitestPlugin),
    },
    settings: { vitest: { typecheck: true } },
    languageOptions: { globals: vitestPlugin.environments.env.globals },
    rules: {
      ...vitestPlugin.configs.recommended.rules,
      'vitest/consistent-test-it': ['error', { fn: 'test', withinDescribe: 'it' }],
      'vitest/max-expects': ['error', { max: 1 }],
      'vitest/no-conditional-expect': 'error',
      'vitest/no-conditional-tests': 'error',
      'vitest/no-disabled-tests': 'error',
      'vitest/no-duplicate-hooks': 'error',
      'vitest/no-focused-tests': 'error',
      'vitest/no-standalone-expect': 'error',
      'vitest/prefer-comparison-matcher': 'error',
      'vitest/prefer-each': 'error',
      'vitest/prefer-expect-resolves': 'error',
      'vitest/prefer-mock-promise-shorthand': 'error',
      'vitest/prefer-strict-equal': 'error',
      'vitest/prefer-to-be': 'error',
      'vitest/prefer-to-contain': 'error',
      'vitest/prefer-to-have-length': 'error',
      'vitest/require-hook': 'error',
      'vitest/require-top-level-describe': ['error', { maxNumberOfTopLevelDescribes: 1 }],
      'vitest/valid-title': ['error', { ignoreTypeOfDescribeName: true }],
      ...testEnvironmentAdjustments,
    },
  };
}
