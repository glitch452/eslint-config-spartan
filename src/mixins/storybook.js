import { CONFIG_NAME_PREFIX } from '../constants.js';
import { files, warnToError } from '../utils/index.js';
import storybookPlugin from 'eslint-plugin-storybook';
/** @import { Linter } from 'eslint' */

/**
 * The `storybook` mixin creates an ESLint config for
 * [eslint-plugin-storybook](https://www.npmjs.com/package/eslint-plugin-storybook) to assist with component development in
 * [Storybook](https://storybook.js.org).
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-storybook` rules are prefixed with `storybook`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` extension variants with `.story.ext` and `.stories.ext`.
 * @param {Linter.Config['files']=} options.mainFiles Set the files for the .storybook/main file config. By default, this applies to all `js/ts` extension variants with `.storybook/main`.
 * @returns {Linter.Config[]}
 */
export function storybook(options = {}) {
  return storybookPlugin.configs['flat/recommended'].map((config, i) => {
    switch (config.name) {
      case 'storybook:recommended:stories-rules':
        return {
          ...config,
          files: options.files ?? [files.stories],
          name: `${CONFIG_NAME_PREFIX}/${storybook.name}/${i}-${config.name}`,
          rules: {
            ...warnToError(/** @type {Partial<Linter.RulesRecord>} */ (config.rules)),
            'storybook/csf-component': 'error',
            'storybook/no-stories-of': 'error',
          },
        };
      case 'storybook:recommended:main-rules':
        return {
          ...config,
          files: options.files ?? [files.storybookMain],
          name: `${CONFIG_NAME_PREFIX}/${storybook.name}/${i}-${config.name}`,
        };
      default:
        // Known other cases: 'storybook:recommended:setup'
        return {
          ...config,
          files: options.files ?? [files.stories],
          name: `${CONFIG_NAME_PREFIX}/${storybook.name}/${i}-${config.name}`,
        };
    }
  });
}
