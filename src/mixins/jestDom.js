import jestDomPlugin from 'eslint-plugin-jest-dom';
import { files } from '../utils/index.js';
import { configNamePrefix } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `jestDom` mixin an ESLint config for [eslint-plugin-jest-dom](https://www.npmjs.com/package/eslint-plugin-jest-dom)
 * to assist with using the [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) element matchers.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-jest-dom` rules are prefixed with `jest-dom`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @returns {Linter.Config}
 */
export function jestDom(options = {}) {
  return {
    ...jestDomPlugin.configs['flat/recommended'],
    name: `${configNamePrefix}/${jestDom.name}`,
    files: options.files ?? [files.testSpec],
  };
}
