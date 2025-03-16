import i18nextPlugin from 'eslint-plugin-i18next';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `i18next` mixin creates an ESLint config for [eslint-plugin-i18next](https://www.npmjs.com/package/eslint-plugin-i18next)
 * to assist with using the [i18next](https://www.i18next.com) internationalization library.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-i18next` rules are prefixed with `i18next`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @returns {Linter.Config}
 */
export function i18next(options = {}) {
  return {
    name: `${CONFIG_NAME_PREFIX}/${i18next.name}`,
    files: options.files ?? [files.jsTs],
    plugins: {
      [prefixes.i18next]: i18nextPlugin,
    },
    rules: i18nextPlugin.configs['flat/recommended'].rules,
  };
}
