import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `jsxA11y` mixin creates an ESLint config for
 * [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) to assist with accessibility when using
 * JSX templates.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-jsx-a11y` rules are prefixed with `jsx-a11y`.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all jsx/tsx variant file extensions.
 * @returns {Linter.Config}
 */
export function jsxA11y(options = {}) {
  return {
    ...jsxA11yPlugin.flatConfigs.recommended,
    name: `${CONFIG_NAME_PREFIX}/${jsxA11y.name}`,
    files: options.files ?? [files.jsxTsx],
    rules: {
      ...jsxA11yPlugin.flatConfigs.recommended.rules,
      'jsx-a11y/aria-role': ['error', { allowedInvalidRoles: ['mark'] }],
    },
  };
}
