import i18nJsonPlugin from 'eslint-plugin-i18n-json';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `i18nJson` mixin creates an ESLint config for [eslint-plugin-i18n-json](https://www.npmjs.com/package/eslint-plugin-i18n-json)
 * to assist with maintaining json-based i18n translation files.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-i18n-json` rules are prefixed with `i18n-json`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the json file extensions.
 * @param {string | Record<string, string>=} options.identicalKeysFilePath Enables the identical-keys rule and sets the filePath option for the rule to the given value.
 * @param {string=} options.identicalPlaceholdersFilePath Enables the identical-placeholders rule and sets the filePath option for the rule to the given value.
 * @returns {Linter.Config}
 */
export function i18nJson(options = {}) {
  return {
    name: `${configNamePrefix}/${i18nJson.name}`,
    files: options.files ?? [files.json],
    plugins: {
      [prefixes.i18nJson]: i18nJsonPlugin,
    },
    processor: {
      meta: { name: '.json' },
      ...i18nJsonPlugin.processors['.json'],
    },
    rules: {
      ...i18nJsonPlugin.configs.recommended.rules,
      ...(options.identicalKeysFilePath
        ? { 'i18n-json/identical-keys': ['error', { filePath: options.identicalKeysFilePath }] }
        : undefined),
      ...(options.identicalPlaceholdersFilePath
        ? { 'i18n-json/identical-placeholders': ['error', { filePath: options.identicalPlaceholdersFilePath }] }
        : undefined),
      'i18n-json/valid-message-syntax': 'off',
    },
  };
}
