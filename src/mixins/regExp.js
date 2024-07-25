import regExpPlugin from 'eslint-plugin-regexp';
import { files, warnToError } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `regExp` mixin creates an ESLint config for [eslint-plugin-regexp](https://www.npmjs.com/package/eslint-plugin-regexp)
 * to assist with encouraging good practices when using [JS Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-regexp` rules are prefixed with `regexp`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @param {Linter.Config['settings']=} options.settings Set the `settings` property on the config. For convenience when configuring additional plugin settings. See [Settings](https://ota-meshi.github.io/eslint-plugin-regexp/settings) for details.
 * @returns {Linter.Config}
 */
export function regExp(options = {}) {
  return {
    ...regExpPlugin.configs['flat/recommended'],
    name: `${configNamePrefix}/${regExp.name}`,
    files: options.files ?? [files.jsTs],
    settings: options.settings,
    plugins: {
      [prefixes.regExp]: regExpPlugin,
    },
    rules: {
      ...warnToError(regExpPlugin.configs['flat/recommended'].rules),
      'regexp/prefer-d': 'off',
      'regexp/prefer-w': 'off',
      'regexp/prefer-result-array-groups': 'error',
      'regexp/sort-character-class-elements': 'error',
      'regexp/unicode-escape': 'error',
      'regexp/unicode-property': 'error',
    },
  };
}
