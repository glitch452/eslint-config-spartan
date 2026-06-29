import jestDomPlugin from 'eslint-plugin-jest-dom-ya';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

const { plugins, rules, ...flatRecommended } = jestDomPlugin.configs['flat/recommended'];
/**
 * The `jestDom` mixin an ESLint config for [eslint-plugin-jest-dom-ya](https://www.npmjs.com/package/eslint-plugin-jest-dom-ya)
 * to assist with using the [jest-dom](https://testing-library.com/docs/ecosystem-jest-dom/) element matchers.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-jest-dom-ya` rules are prefixed with `jest-dom`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @returns {Linter.Config}
 */
export function jestDom(options = {}) {
  return {
    ...flatRecommended,
    plugins: Object.fromEntries(Object.entries(plugins ?? {}).map(([_, x]) => [prefixes.jestDom, x])),
    name: `${CONFIG_NAME_PREFIX}/${jestDom.name}`,
    files: options.files ?? [files.testSpec],
    rules: Object.fromEntries(Object.entries(rules ?? {}).map(([x, y]) => [x.replace('-ya', ''), y])),
  };
}
