import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularParser from '@angular-eslint/template-parser';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { files } from '../utils/index.js';
/** @import { Linter, ESLint } from 'eslint' */

/**
 * The `angular` mixin creates an ESLint config for
 * [@angular-eslint/eslint-plugin](https://www.npmjs.com/package/@angular-eslint/eslint-plugin) and
 * [@angular-eslint/eslint-plugin-template](https://www.npmjs.com/package/@angular-eslint/eslint-plugin-template) to
 * assist with using the [Angular](https://angular.dev) framework.
 *
 * Rule Prefixes:
 *
 * - The `@angular-eslint/eslint-plugin` rules are prefixed with `@angular-eslint`
 * - The `@angular-eslint/eslint-plugin-template` rules are prefixed with `@angular-eslint/template`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @param {Linter.Config['files']=} options.templateFiles Set the files for the template files part of this config. By default, this applies to the html file extensions.
 * @returns {Linter.Config[]}
 */
export function angular(options = {}) {
  return [
    {
      name: `${CONFIG_NAME_PREFIX}/${angular.name}`,
      files: options.files ?? [files.jsTs],
      plugins: {
        // eslint-disable-next-line jsdoc/reject-any-type
        [prefixes.angular]: /** @type {any} */ (angularPlugin),
        // eslint-disable-next-line jsdoc/reject-any-type
        [prefixes.angularTemplate]: /** @type {any} */ (angularTemplatePlugin),
      },
      processor: '@angular-eslint/template/extract-inline-html',
      rules: {
        .../** @type {Partial<Linter.RulesRecord>} */ (angularPlugin.configs.recommended.rules),
        '@angular-eslint/component-selector': ['error', { type: 'element', prefix: 'app', style: 'kebab-case' }],
        '@angular-eslint/directive-class-suffix': 'off',
        '@angular-eslint/directive-selector': ['off', { type: 'attribute', prefix: 'app', style: 'camelCase' }],
        '@angular-eslint/use-lifecycle-interface': 'error',
      },
    },
    {
      name: `${CONFIG_NAME_PREFIX}/${angular.name}Template`,
      files: options.templateFiles ?? [files.html],
      plugins: {
        // eslint-disable-next-line jsdoc/reject-any-type
        [prefixes.angularTemplate]: /** @type {any} */ (angularTemplatePlugin),
      },
      languageOptions: { parser: angularParser },
      rules: /** @type {Partial<Linter.RulesRecord>} */ (angularTemplatePlugin.configs.recommended.rules),
    },
  ];
}
