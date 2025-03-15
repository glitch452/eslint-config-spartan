import promisePlugin from 'eslint-plugin-promise';
import { files, warnToError } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `promise` mixin creates an ESLint config for [eslint-plugin-promise](https://www.npmjs.com/package/eslint-plugin-promise)
 * to assist with encouraging good practices when using JS Promises.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-promise` rules are prefixed with `promise`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @returns {Linter.Config}
 */
export function promise(options = {}) {
  return {
    ...promisePlugin.configs['flat/recommended'],
    name: `${CONFIG_NAME_PREFIX}/${promise.name}`,
    files: options.files ?? [files.jsTs],
    plugins: {
      [prefixes.promise]: promisePlugin,
    },
    rules: {
      ...warnToError(promisePlugin.configs['flat/recommended'].rules),
      'promise/catch-or-return': 'off',
      'promise/no-multiple-resolved': 'error',
      'promise/prefer-await-to-callbacks': 'error',
      'promise/prefer-await-to-then': 'error',
      'promise/spec-only': 'error',
    },
  };
}
