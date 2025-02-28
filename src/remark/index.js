import remarkPresetLintConsistent from 'remark-preset-lint-consistent';
import remarkPresetLintRecommended from 'remark-preset-lint-recommended';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkGfm from 'remark-gfm';
import remarkPresetPrettier from 'remark-preset-prettier';
import remarkLintNoUndefinedReferences from 'remark-lint-no-undefined-references';
import remarkLintNoFileNameIrregularCharacters from 'remark-lint-no-file-name-irregular-characters';

/**
 * A [remark-lint](https://github.com/remarkjs/remark-lint) preset for Markdown files.
 *
 * This returns configs for the following packages:
 * - [remark-preset-lint-consistent](https://www.npmjs.com/package/remark-preset-lint-consistent)
 * - [remark-preset-lint-recommended](https://www.npmjs.com/package/remark-preset-lint-recommended)
 * - [remark-preset-lint-markdown-style-guide](https://www.npmjs.com/package/remark-preset-lint-markdown-style-guide)
 * - [remark-lint-no-dead-urls](https://www.npmjs.com/package/remark-lint-no-dead-urls)
 * - [remark-gfm](https://www.npmjs.com/package/remark-gfm)
 * @type {import('unified').Preset}
 */
export const remark = {
  plugins: [
    remarkPresetLintConsistent,
    remarkPresetLintRecommended,
    remarkPresetLintMarkdownStyleGuide,
    remarkGfm,
    [remarkLintNoFileNameIrregularCharacters, ['off']],
    [
      remarkLintNoUndefinedReferences,
      {
        allow: ['!NOTE', '!TIP', '!IMPORTANT', '!WARNING', '!CAUTION'],
      },
    ],
  ],
};

/**
 * A remark preset that disable rules which conflict with prettier.
 */
export const remarkPrettier = {
  plugins: [remarkPresetPrettier],
};
