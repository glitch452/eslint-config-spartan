import eslint from '@eslint/js';
import { fixupPluginRules } from '@eslint/compat';
import stylisticPlugin from '@stylistic/eslint-plugin';
import typescriptEsLint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import securityPlugin from 'eslint-plugin-security';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import typescriptEnumPlugin from 'eslint-plugin-typescript-enum';
import { files as filesUtil, mergeConfig, warnToError } from './utils/index.js';
import { commonJs } from './mixins/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from './constants.js';
/** @import { Linter, ESLint } from 'eslint' */
/** @import { DeepConfig } from './utils/types.js' */

const inputPluginExtensions = [
  '.js',
  '.cjs',
  '.mjs',
  '.jsx',
  '.cjsx',
  '.mjsx',
  '.ts',
  '.cts',
  '.mts',
  '.tsx',
  '.ctsx',
  '.mtsx',
];

/**
 * Create the base configurations and append and provided configurations.
 *
 * This returns configs for the following packages:
 * - [@eslint/js](https://www.npmjs.com/package/@eslint/js)
 * - [typescript-eslint](https://www.npmjs.com/package/typescript-eslint)
 * - [@stylistic/eslint-plugin](https://www.npmjs.com/package/@stylistic/eslint-plugin)
 * - [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import)
 * - [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security)
 * - [eslint-plugin-unused-imports](https://www.npmjs.com/package/eslint-plugin-unused-imports)
 * - [eslint-plugin-typescript-enum](https://www.npmjs.com/package/eslint-plugin-typescript-enum)
 * @param {...DeepConfig} configs
 * @returns {Linter.Config[]}
 */
export function buildConfig(...configs) {
  const files = [filesUtil.jsTs];

  return mergeConfig(
    {
      ...eslint.configs.recommended,
      name: `${CONFIG_NAME_PREFIX}/base/eslint/recommended`,
      files,
    },
    /** @type {Linter.Config[]} */ (
      typescriptEsLint.configs.recommended.map((c) => ({
        ...c,
        name: `${CONFIG_NAME_PREFIX}/base/${c.name}`,
        files,
      }))
    ),
    {
      name: `${CONFIG_NAME_PREFIX}/base`,
      files,
      plugins: {
        [prefixes.import]: fixupPluginRules(importPlugin),
        [prefixes.security]: securityPlugin,
        [prefixes.stylistic]: /** @type {ESLint.Plugin} */ (stylisticPlugin),
        [prefixes.typescriptEnum]: typescriptEnumPlugin,
        [prefixes.unusedImports]: unusedImportsPlugin,
      },

      // This is required to avoid 'parserPath or languageOptions.parser is required' error in the 'import' plugin
      settings: {
        ...importPlugin.flatConfigs.typescript.settings,
        'import/extensions': inputPluginExtensions,
        'import/parsers': { '@typescript-eslint/parser': inputPluginExtensions },
        'import/resolver': { typescript: true, node: { extensions: inputPluginExtensions } },
      },
      // This is required to avoid ecmaVersion < 2015 error or 'import' / 'export' error in the 'import' plugin
      languageOptions: { parserOptions: { ecmaVersion: 'latest', sourceType: 'module' } },

      rules: {
        /* -- unused-imports Rules -- */
        // Use the rule from unused-imports instead of eslint or typescript-eslint
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        'unused-imports/no-unused-vars': [
          'error',
          { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
        ],
        'unused-imports/no-unused-imports': 'error',

        /* -- Security Rules -- */
        ...warnToError(securityPlugin.configs.recommended.rules),
        'security/detect-object-injection': 'off',

        /* -- import Rules -- */
        ...warnToError(importPlugin.configs.recommended.rules),
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-absolute-path': 'error',
        'import/no-cycle': 'error',
        'import/no-deprecated': 'error',
        'import/no-duplicates': ['error', { considerQueryString: true }],
        'import/no-empty-named-blocks': 'error',
        'import/no-import-module-exports': 'error',
        'import/no-named-as-default-member': 'off',
        'import/no-self-import': 'error',
        'import/no-unresolved': 'off', // Let Typescript handle unresolved modules
        'import/no-useless-path-segments': 'error',
        // Disable built-in rule in favour of import plugin rule
        'no-duplicate-imports': 'off',

        /* -- typescript-enum Rules -- */
        ...typescriptEnumPlugin.configs.recommended.rules,
        'typescript-enum/no-const-enum': 'error',

        /* -- Stylistic Rules -- */
        ...stylisticPlugin.configs.recommended.rules,
        '@stylistic/arrow-parens': ['error', 'always'],
        '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: false }],
        '@stylistic/jsx-curly-spacing': ['error', { when: 'never', children: true }],
        '@stylistic/member-delimiter-style': 'error',
        '@stylistic/semi': ['error', 'always'],
        '@stylistic/yield-star-spacing': ['error', { before: false, after: true }],

        /* -- JS Rules -- */
        'array-callback-return': 'error',
        'default-case-last': 'error',
        'default-case': ['error', { commentPattern: '^skip\\sdefault' }],
        'dot-notation': 'error',
        'no-alert': 'error',
        'no-caller': 'error',
        'no-constructor-return': 'error',
        'no-else-return': ['error', { allowElseIf: false }],
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-labels': 'error',
        'no-new-func': 'error',
        'no-param-reassign': 'error',
        'no-proto': 'error',
        'no-return-assign': 'error',
        'no-script-url': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unassigned-vars': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-useless-call': 'error',
        'no-useless-computed-key': 'error',
        'no-useless-concat': 'error',
        'no-useless-rename': 'error',
        'no-useless-return': 'error',
        'object-shorthand': ['error', 'always'],
        'prefer-template': 'error',
        'require-atomic-updates': 'error',
        'sort-imports': ['error', { ignoreDeclarationSort: true }],
        curly: 'error',
        eqeqeq: 'error',
        yoda: ['error', 'never', { exceptRange: true }],

        // Disable JS rules that have TS versions below
        'default-param-last': 'off',
        'no-dupe-class-members': 'off',
        'no-magic-numbers': 'off',
        'no-shadow': 'off',

        /* -- Typescript Plugin Rules that DO NOT require type-checking -- */
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/default-param-last': 'error',
        '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'no-public' }],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/method-signature-style': ['error', 'property'],
        '@typescript-eslint/no-confusing-non-null-assertion': 'error',
        '@typescript-eslint/no-dupe-class-members': 'error',
        '@typescript-eslint/no-dynamic-delete': 'error',
        '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
        '@typescript-eslint/no-invalid-void-type': ['error', { allowAsThisParameter: true }],
        '@typescript-eslint/no-magic-numbers': [
          'error',
          {
            ignoreEnums: true,
            ignoreNumericLiteralTypes: false,
            ignoreReadonlyClassProperties: true,
            ignore: [-1, 0, 1],
          },
        ],
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-useless-constructor': 'error',
        '@typescript-eslint/prefer-for-of': 'error',
      },
    },
    { ...commonJs(), name: `${CONFIG_NAME_PREFIX}/base/${commonJs.name}` },
    ...configs,
  );
}
