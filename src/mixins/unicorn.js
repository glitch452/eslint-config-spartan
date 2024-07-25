import unicornPlugin from 'eslint-plugin-unicorn';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

const rules = { ...unicornPlugin.configs['flat/recommended'].rules };
// Remove overrides for built-in eslint rules
delete rules['no-negated-condition'];
delete rules['no-nested-ternary'];

/**
 * The `unicorn` mixin creates an ESLint config for [eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn)
 * which contains miscellaneous rules.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-unicorn` rules are prefixed with `unicorn`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @returns {Linter.Config}
 */
export function unicorn(options = {}) {
  return {
    ...unicornPlugin.configs['flat/recommended'],
    name: `${configNamePrefix}/${unicorn.name}`,
    files: options.files ?? [files.jsTs],
    plugins: {
      [prefixes.unicorn]: unicornPlugin,
    },
    rules: {
      ...rules,
      'unicorn/better-regex': 'off',
      'unicorn/catch-error-name': ['error', { name: 'error' }],
      'unicorn/empty-brace-spaces': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/explicit-length-check': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-await-expression-member': 'off',
      'unicorn/no-console-spaces': 'off',
      'unicorn/no-empty-file': 'off',
      'unicorn/no-hex-escape': 'off',
      'unicorn/no-magic-array-flat-depth': 'off',
      'unicorn/no-negated-condition': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-object-as-default-parameter': 'off',
      'unicorn/no-static-only-class': 'off',
      'unicorn/no-unreadable-array-destructuring': 'off',
      'unicorn/no-unreadable-iife': 'off',
      'unicorn/no-useless-length-check': 'off',
      'unicorn/prefer-dom-node-dataset': 'off',
      'unicorn/prefer-node-protocol': 'off',
      'unicorn/prefer-number-properties': 'off',
      'unicorn/prefer-query-selector': 'off',
      'unicorn/prevent-abbreviations': 'off',
      'unicorn/switch-case-braces': 'off',
      'unicorn/template-indent': 'off',
    },
  };
}
