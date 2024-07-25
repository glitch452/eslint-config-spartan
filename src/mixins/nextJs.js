import nextPlugin from '@next/eslint-plugin-next';
import { files, warnToError } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `nextJs` mixin creates an ESLint config for
 * [@next/eslint-plugin-next](https://www.npmjs.com/package/@next/eslint-plugin-next) to assist with
 * [Next.js](https://nextjs.org) application development.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-next` rules are prefixed with `@next/next`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all js/ts variant file extensions.
 * @returns {Linter.Config}
 */
export function nextJs(options = {}) {
  return {
    name: `${configNamePrefix}/${nextJs.name}`,
    files: options.files ?? [files.jsTs],
    plugins: { [prefixes.next]: nextPlugin },
    rules: warnToError(nextPlugin.configs.recommended.rules),
  };
}
