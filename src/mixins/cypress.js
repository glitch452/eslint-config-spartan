import cypressPlugin from 'eslint-plugin-cypress/flat';
import { CONFIG_NAME_PREFIX } from '../constants.js';
import { files } from '../utils/index.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter } from 'eslint' */

/**
 * The `cypress` mixin an ESLint config for [eslint-plugin-cypress](https://www.npmjs.com/package/eslint-plugin-cypress) to
 * assist with using the [Cypress](https://www.cypress.io) Testing Framework.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-cypress` rules are prefixed with `cypress`
 *
 * Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `.cy.ext`.
 * @returns {Linter.Config}
 */
export function cypress(options = {}) {
  return {
    ...cypressPlugin.configs.recommended,
    name: `${CONFIG_NAME_PREFIX}/${cypress.name}`,
    files: options.files ?? [files.cypress],
    rules: {
      ...cypressPlugin.configs.recommended.rules,
      'cypress/no-debug': 'error',
      ...testEnvironmentAdjustments,
    },
  };
}
