import { fixupPluginRules } from '@eslint/compat';
import { configNamePrefix, prefixes } from '../constants.js';
import { files, warnToError } from '../utils/index.js';
import testingLibraryPlugin from 'eslint-plugin-testing-library';
/** @import { Linter } from 'eslint' */

/**
 * The `testingLibraryReact` mixin creates an ESLint config for
 * [eslint-plugin-testing-library](https://www.npmjs.com/package/eslint-plugin-testing-library) to assist with component
 * testing using [Testing Library](https://testing-library.com).
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-testing-library` rules are prefixed with `testing-library`
 * @param {object} options
 * @param {string=} options.baseDirectory The base directory for relative paths in the eslintrc config. Default process.cwd()
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @returns {Linter.Config}
 */
export function testingLibraryReact(options = {}) {
  return {
    ...testingLibraryPlugin.configs['flat/react'],
    files: options.files ?? [files.testSpec],
    name: `${configNamePrefix}/${testingLibraryReact.name}`,
    plugins: { [prefixes.testingLibrary]: fixupPluginRules(testingLibraryPlugin) },
    rules: {
      ...warnToError(testingLibraryPlugin.configs['flat/react'].rules),
      'testing-library/prefer-explicit-assert': 'error',
      'testing-library/prefer-user-event': 'error',
    },
  };
}
