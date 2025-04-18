import { CONFIG_NAME_PREFIX } from '../constants.js';
import { files } from '../utils/index.js';
import typescriptEsLint from 'typescript-eslint';
/** @import { Linter } from 'eslint' */
/** @import { ConfigWithExtends } from 'typescript-eslint' */

/** @typedef {NonNullable<ConfigWithExtends['languageOptions']>['parserOptions']} ConfigParserOptions */

const TS_RULES_INDEX = 2;
const recommendedTypeCheckedRules = typescriptEsLint.configs.recommendedTypeCheckedOnly[TS_RULES_INDEX].rules;

/**
 * The `typeEnabled` mixin creates an eslint config with type-enabled rules for
 * [typescript-eslint](https://typescript-eslint.io). It requires an external config to enable the `@typescript-eslint`
 * plugin itself since it only includes rules. i.e. it's meant to bs used with the base config created with `buildConfig`. It also disables base eslint rules that are replaced with the equivalent
 * typescript-eslint rules.
 *
 * > [!NOTE]
 * >
 * > Note: This config also adds an ignores property to prevent these rules from being applied to code blocks within
 * > markdown files when the `mdx` mixin is being used since the parser cannot access that code.
 *
 * Rule Prefixes:
 *
 * - The `typescript-eslint` rules are prefixed with `@typescript-eslint`
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `js/ts` variant file extensions.
 * @param {Linter.Config['ignores']=} options.ignores Set the ignores for this config. By default, this applies to all `.md/*` and `.mdx/*` to ignore code within markdown file code blocks.
 * @param {ConfigParserOptions=} options.parserOptions See <https://typescript-eslint.io/packages/parser/#configuration> for more information on the ParserOptions available.
 * @returns {Linter.Config}
 */
export function typeEnabled(options = {}) {
  return {
    name: `${CONFIG_NAME_PREFIX}/${typeEnabled.name}`,
    files: options.files ?? [files.jsTs],
    ignores: options.ignores ?? [`${files.mdMdx}/**/*`],
    languageOptions: { parserOptions: options.parserOptions },
    rules: {
      ...recommendedTypeCheckedRules,

      // Disable JS rules that have TS versions below
      'dot-notation': 'off',
      'default-case': 'off',

      '@typescript-eslint/dot-notation': 'error',
      '@typescript-eslint/no-deprecated': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      '@typescript-eslint/no-misused-spread': 'error',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-template-expression': 'error',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'error',
      '@typescript-eslint/prefer-includes': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-reduce-type-parameter': 'error',
      '@typescript-eslint/related-getter-setter-pairs': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': ['error', { requireDefaultForNonUnion: true }],
      '@typescript-eslint/unbound-method': ['error', { ignoreStatic: true }],
    },
  };
}
