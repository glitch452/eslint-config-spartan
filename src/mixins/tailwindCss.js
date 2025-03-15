import tailwindCssPlugin from 'eslint-plugin-tailwindcss';
import { files, warnToError } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `tailwindCss` mixin creates an ESLint config for [eslint-plugin-tailwindcss](https://www.npmjs.com/package/eslint-plugin-tailwindcss)
 * to assist with using the [Tailwind CSS](https://tailwindcss.com) framework.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-tailwindcss` rules are prefixed with `tailwindcss`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the jsx/tsx file extensions.
 * @param {Linter.Config['settings']=} options.settings Set the `settings` property on the config. For convenience when configuring additional plugin settings. See [eslint-plugin-tailwindcss/More settings](https://github.com/francoismassart/eslint-plugin-tailwindcss#more-settings) for details.
 * @returns {Linter.Config}
 */
export function tailwindCss(options = {}) {
  return {
    ...tailwindCssPlugin.configs['flat/recommended'][0],
    name: `${CONFIG_NAME_PREFIX}/${tailwindCss.name}`,
    files: options.files ?? [files.jsxTsx],
    settings: options.settings ?? {},
    plugins: {
      [prefixes.tailwindCss]: tailwindCssPlugin,
    },
    rules: {
      ...warnToError(tailwindCssPlugin.configs['flat/recommended'][1].rules),
      'tailwindcss/migration-from-tailwind-2': 'off',
    },
  };
}
