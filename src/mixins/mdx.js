import * as mdxPlugin from 'eslint-plugin-mdx';
import { files } from '../utils/index.js';
import { configNamePrefix } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `mdx` mixin creates an ESLint config for [eslint-plugin-mdx](https://www.npmjs.com/package/eslint-plugin-mdx) to
 * assist with writing [MDX](https://mdxjs.com) and [markdown](https://en.wikipedia.org/wiki/Markdown) files, as well as
 * code blocks within markdown files. This also adds support for using
 * [remark-lint](https://github.com/remarkjs/remark-lint) rules within those files.
 *
 * This creates two configurations, one to apply the recommended config for `.mdx`, `.md`, and `.markdown` files, and another to apply
 * the recommended config to code blocks in those files.
 *
 * > [!NOTE]
 * >
 * > - This config also adjusts some rules to accommodate mdx syntax and code blocks.
 * > - The typescript-eslint rules that require type information cannot be used within code blocks, since the parser cannot
 * >   parse the blocks within the files.
 *
 * Rule Prefixes:
 *
 * - The `eslint-plugin-mdx` rules are prefixed with `mdx`.
 *
 *  > [!TIP]
 *  >
 *  > To apply rules to the code blocks, the format for selecting the code block type is by first selecting the markdown
 *  > file itself, then adding the block type to the path. e.g. `*.{md,mdx}/js` to select all `js` code blocks within
 *  > `.md` or `.mdx` files.
 *
 * ```js
 * import { mdx } from 'eslint-config-spartan/mixins';
 * ```
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to `md` and `mdx` extensions.
 * @param {Linter.Config['files']=} options.codeBlocksFiles Set the files the code blocks config. By default, this applies to `.md/*` and `.mdx/*` extensions.
 * @returns {Linter.Config[]}
 */
export function mdx(options = {}) {
  return [
    {
      ...mdxPlugin.flat,
      name: `${configNamePrefix}/${mdx.name}/base`,
      processor: mdxPlugin.createRemarkProcessor({ lintCodeBlocks: true }),
      files: options.files ?? [files.mdMdx],
      rules: {
        ...mdxPlugin.flat.rules,
        'unused-imports/no-unused-imports': 'off',
        'mdx/remark': 'error',
      },
    },
    {
      ...mdxPlugin.flatCodeBlocks,
      name: `${configNamePrefix}/${mdx.name}/code-blocks`,
      files: options.codeBlocksFiles ?? [`${files.mdMdx}/**/*`],
      rules: {
        ...mdxPlugin.flatCodeBlocks.rules,
        '@typescript-eslint/no-magic-numbers': 'off',
        'unused-imports/no-unused-imports': 'off',
        'unused-imports/no-unused-vars': 'off',
      },
    },
  ];
}
