import reactPlugin from 'eslint-plugin-react';
// eslint-disable-next-line import/default
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { fixupPluginRules } from '@eslint/compat';
import { files, warnToError } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `react` mixin creates an ESLint config for [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react)
 * and [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) to assist with
 * [React](https://react.dev) application development.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-react` rules are prefixed with `react`
 * - The `eslint-plugin-react-hooks` rules are prefixed with `react-hooks`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all js/ts variant file extensions.
 * @param {boolean=} options.noJsxRuntime Set this to true to disable the 'jsx-runtime' preset rules (JSX Runtime is available from React v17+).
 * @returns {Linter.Config}
 */
export function react(options = {}) {
  return {
    ...reactPlugin.configs.flat.recommended,
    name: `${CONFIG_NAME_PREFIX}/${react.name}`,
    files: options.files ?? [files.jsTs],
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
      globals: globals.browser,
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      [prefixes.react]: reactPlugin,
      // Use fixupPluginRules for ESLint v9 support until the plugin is updated
      [prefixes.reactHooks]: fixupPluginRules(reactHooksPlugin),
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...(options.noJsxRuntime ? undefined : reactPlugin.configs['jsx-runtime'].rules),
      ...warnToError(reactHooksPlugin.configs.recommended.rules),
      'react/button-has-type': 'error',
      'react/hook-use-state': 'error',
      'react/jsx-boolean-value': ['error', 'never', { assumeUndefinedIsFalse: true }],
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-fragments': 'error',
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['coerce', 'ternary'] }],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-pascal-case': ['error', { allowNamespace: true }],
      // 'react/jsx-sort-props': 'error', // Maybe?
      'react/no-array-index-key': 'error',
      // 'react/no-invalid-html-attribute': 'error', // Maybe?
      // 'react/prefer-read-only-props': 'error', // Maybe?
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
    },
  };
}
