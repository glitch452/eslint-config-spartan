import googleAppsScriptPlugin from 'eslint-plugin-googleappsscript';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `googleAppsScript` mixin creates an ESLint config for [eslint-plugin-googleappsscript](https://www.npmjs.com/package/eslint-plugin-googleappsscript)
 * which contains globals for the Google Apps Script environment.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-googleappsscript` does not contain any rules.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to the js/ts file extensions.
 * @returns {Linter.Config}
 */
export function googleAppsScript(options = {}) {
  return {
    name: `${CONFIG_NAME_PREFIX}/${googleAppsScript.name}`,
    files: options.files ?? [files.jsTs],
    languageOptions: {
      globals: Object.fromEntries(
        Object.entries(googleAppsScriptPlugin.environments.googleappsscript.globals).map(([k, v]) => [
          k,
          v ? 'writeable' : 'readonly',
        ]),
      ),
    },
  };
}
