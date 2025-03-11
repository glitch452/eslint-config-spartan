import playwrightPlugin from 'eslint-plugin-playwright';
import { files, warnToError } from '../utils/index.js';
import { configNamePrefix } from '../constants.js';
import { testEnvironmentAdjustments } from './testEnvironmentAdjustments.js';
/** @import { Linter } from 'eslint' */

/**
 * The `playwright` mixin creates an ESLint config for
 * [eslint-plugin-playwright](https://www.npmjs.com/package/eslint-plugin-playwright) to assist with using
 * the [Playwright](https://github.com/microsoft/playwright) framework.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-playwright` rules are prefixed with `playwright`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all js/ts variant file extensions.
 * @returns {Linter.Config}
 */
export function playwright(options = {}) {
  return {
    ...playwrightPlugin.configs['flat/recommended'],
    name: `${configNamePrefix}/${playwright.name}`,
    files: options.files ?? [files.testSpec],
    rules: {
      ...warnToError(playwrightPlugin.configs['flat/recommended'].rules),
      ...testEnvironmentAdjustments,
    },
  };
}
