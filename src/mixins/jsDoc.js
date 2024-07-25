import jsDocPlugin from 'eslint-plugin-jsdoc';
import { files } from '../utils/index.js';
import { configNamePrefix, prefixes } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `jsDoc` mixin creates an ESLint config for [eslint-plugin-jsdoc](https://www.npmjs.com/package/eslint-plugin-jsdoc) to
 * assist with writing [JS Doc](https://jsdoc.app) comments.
 *
 * This creates three configurations, one to apply the recommended rules to js files, another to apply the recommended
 * rules to ts files and a third to configure rules across both sets of files.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-jsdoc` rules are prefixed with `jsdoc`
 * @param {object} options
 * @param {Linter.Config['files']=} options.filesBoth Set the files for the config that is meant to apply to both `ts` and `js` files. By default, this applies to all `js/ts` variant file extensions.
 * @param {Linter.Config['files']=} options.filesJs Set the files for the config that is meant to apply to `js` files. By default, this applies to all `js` variant file extensions.
 * @param {Linter.Config['files']=} options.filesTs Set the files for the config that is meant to apply to `ts` files. By default,this applies to all `ts` variant file extensions.
 * @returns {Linter.Config[]}
 */
export function jsDoc(options = {}) {
  return [
    {
      name: `${configNamePrefix}/${jsDoc.name}/Ts`,
      files: options.filesTs ?? [files.ts],
      rules: jsDocPlugin.configs['flat/recommended-typescript-error'].rules,
    },
    {
      name: `${configNamePrefix}/${jsDoc.name}/Js`,
      files: options.filesJs ?? [files.js],
      rules: jsDocPlugin.configs['flat/recommended-typescript-flavor-error'].rules,
    },
    {
      name: `${configNamePrefix}/${jsDoc.name}/JsTs`,
      files: options.filesBoth ?? [files.jsTs],
      plugins: { [prefixes.jsDoc]: jsDocPlugin },
      rules: {
        'jsdoc/no-bad-blocks': 'error',
        'jsdoc/no-blank-block-descriptions': 'error',
        'jsdoc/no-blank-blocks': 'error',
        'jsdoc/require-jsdoc': 'off',
        'jsdoc/require-param-description': 'off',
        'jsdoc/require-returns-description': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/require-throws': 'error',
        'jsdoc/require-asterisk-prefix': 'error',
      },
    },
  ];
}
