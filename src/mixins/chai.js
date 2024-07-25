import chaiFriendlyPlugin from 'eslint-plugin-chai-friendly';
import chaiExpectPlugin from 'eslint-plugin-chai-expect';
import { configNamePrefix, prefixes } from '../constants.js';
import { files } from '../utils/index.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter } from 'eslint' */

/**
 * The `chai` mixin creates an ESLint config for
 * [eslint-plugin-chai-friendly](https://www.npmjs.com/package/eslint-plugin-chai-friendly) and
 * [eslint-plugin-chai-expect](https://www.npmjs.com/package/eslint-plugin-chai-expect) to assist with using the
 * [Chai Assertion Library](https://www.chaijs.com).
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-chai-expect` rules are prefixed with `chai-expect`
 * - The `eslint-plugin-chai-friendly` rules are prefixed with `chai-friendly`
 *
 * Note: This config also adjusts some `@typescript-eslint` rules to make them more helpful for test files.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext`, `spec.ext` and `.cy.ext`.
 * @returns {Linter.Config}
 */
export function chai(options = {}) {
  return {
    name: `${configNamePrefix}/${chai.name}`,
    files: options.files ?? [files.testSpec, files.cypress],
    plugins: {
      [prefixes.chaiFriendly]: chaiFriendlyPlugin,
      [prefixes.chaiExpect]: chaiExpectPlugin,
    },
    rules: {
      ...chaiFriendlyPlugin.configs.recommendedFlat.rules,
      ...chaiExpectPlugin.configs['recommended-flat'].rules,
      ...testEnvironmentAdjustments,
    },
  };
}
