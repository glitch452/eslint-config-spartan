import mochaPlugin from 'eslint-plugin-mocha';
import { CONFIG_NAME_PREFIX } from '../constants.js';
import { files, warnToError } from '../utils/index.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter } from 'eslint' */

/**
 * The `mocha` mixin creates an ESLint config for [eslint-plugin-mocha](https://www.npmjs.com/package/eslint-plugin-mocha) to
 * assist with using the [Mocha](https://mochajs.org) test framework.
 *
 * Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-mocha` rules are prefixed with `mocha`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext`, `spec.ext` and `.cy.ext`.
 * @returns {Linter.Config}
 */
export function mocha(options = {}) {
  return {
    ...mochaPlugin.configs.flat.recommended,
    name: `${CONFIG_NAME_PREFIX}/${mocha.name}`,
    files: options.files ?? [files.testSpec, files.cypress],
    rules: {
      ...warnToError(mochaPlugin.configs.flat.recommended.rules),
      'mocha/prefer-arrow-callback': 'error',
      'mocha/no-mocha-arrows': 'off',
      ...testEnvironmentAdjustments,
    },
  };
}
