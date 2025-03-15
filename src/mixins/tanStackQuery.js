import tanStackQueryPlugin from '@tanstack/eslint-plugin-query';
import { files, warnToError } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `tanStackQuery` mixin creates an ESLint config for
 * [@tanstack/eslint-plugin-query](https://www.npmjs.com/package/@tanstack/eslint-plugin-query) to assist with using
 * the [TanStack Query](https://github.com/TanStack/query) hook for fetching, caching and updating asynchronous data
 * in React, Solid, Svelte and Vue.
 *
 * Rule Prefixes:
 *
 * - The `@tanstack/eslint-plugin-query` rules are prefixed with `@tanstack/query`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all js/ts variant file extensions.
 * @returns {Linter.Config}
 */
export function tanStackQuery(options = {}) {
  return {
    ...tanStackQueryPlugin.configs['flat/recommended'][0],
    name: `${CONFIG_NAME_PREFIX}/${tanStackQuery.name}`,
    files: options.files ?? [files.jsTs],
    rules: warnToError(tanStackQueryPlugin.configs['flat/recommended'][0].rules),
  };
}
