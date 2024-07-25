import globals from 'globals';
import { files } from '../utils/index.js';
import { configNamePrefix } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `commonJs` mixin creates an ESLint config for common js files.
 *
 * This config is included in `buildConfig` and applied to files with common js extensions. This can be used to apply the
 * config to `.js` files which are known to be common js.
 *
 * Note: This config also adjusts some `@typescript-eslint` and `unicorn` rules that conflict with common js globals.
 * This config should be added after the configs for these rules.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `.cjs` and `.cjsx` extensions.
 * @returns {Linter.Config}
 */
export function commonJs(options = {}) {
  return {
    name: `${configNamePrefix}/${commonJs.name}`,
    files: options.files ?? [files.cjs],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'unicorn/prefer-module': 'off',
    },
  };
}
