import { files } from './src/utils/index.js';
import { jsDoc, mdx, namingConvention, prettier, typeEnabled, vitest } from './src/mixins/index.js';
import { buildConfig } from './src/buildConfig.js';

export default buildConfig(
  typeEnabled({ parserOptions: { tsconfigRootDir: import.meta.dirname, projectService: true } }),
  namingConvention,
  vitest,
  jsDoc,
  mdx,
  {
    name: 'root/scripts',
    files: [`scripts/${files.jsTsNoX}`],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off',
      'security/detect-non-literal-fs-filename': 'off',
    },
  },
  prettier,
  {
    name: 'root/global-ignores',
    ignores: ['coverage/', 'reports/', '.vscode/', 'dist/', '.temp/'],
  },
);
