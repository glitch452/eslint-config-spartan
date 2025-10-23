import prettierConfig from 'eslint-config-prettier';
import { CONFIG_NAME_PREFIX } from '../constants.js';
import stylisticPlugin from '@stylistic/eslint-plugin';
/** @import { Linter } from 'eslint' */

const allowedRules = ['curly', 'no-floating-decimal', '@typescript-eslint/member-delimiter-style'];

const originalRules = Object.entries(prettierConfig.rules).filter(([name]) => !allowedRules.includes(name));

const stylisticVersionOfRules = originalRules
  .filter(([name]) => name.startsWith('@typescript-eslint') || !name.includes('/'))
  .map(
    ([name]) =>
      /** @type {const} */ ([
        `@stylistic/${name.startsWith('@typescript-eslint') ? name.slice('@typescript-eslint'.length + 1) : name}`,
        'off',
      ]),
  );

const stylisticJsxRules = Object.keys(stylisticPlugin.rules)
  .filter((name) => name.startsWith('jsx'))
  .map((name) => /** @type {const} */ ([`@stylistic/${name}`, 'off']));

const additionalStylisticRules = [
  'indent-binary-ops',
  'type-generic-spacing',
  'type-named-tuple-spacing',
  'curly-newline',
].map((name) => /** @type {const} */ ([`@stylistic/${name}`, 'off']));

const additionalRules = ['tailwindcss/classnames-order'].map((name) => /** @type {const} */ ([name, 'off']));

/**
 * The `prettier` mixin creates an ESLint config for disabling rules which may interfere or conflict with
 * [Prettier](https://prettier.io). This config should come LAST in the list of configurations so that it can override
 * other configs.
 *
 * > [!NOTE]
 * >
 * > This config essentially re-exports [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) with
 * > some adjustments. It also disables rules for [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin).
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all files (i.e. the files property is not set).
 * @returns {Linter.Config}
 */
export function prettier(options = {}) {
  return {
    name: `${CONFIG_NAME_PREFIX}/${prettier.name}`,
    ...(options.files && { files: options.files }),
    rules: Object.fromEntries([
      ...originalRules,
      ...stylisticVersionOfRules,
      ...stylisticJsxRules,
      ...additionalStylisticRules,
      ...additionalRules,
    ]),
  };
}
