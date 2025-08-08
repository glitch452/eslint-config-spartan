import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX } from '../constants.js';
/** @import { Linter } from 'eslint' */

/**
 * The `namingConvention` mixin adds configuration for the [@typescript-eslint/naming-convention](https://typescript-eslint.io/rules/naming-convention) rule.
 * Note: This mixin requires the `typeEnabled` mixin to be already configured.
 * @param {object} options
 * @param {Linter.Config['files']=} options.files Set the files for this config. By default, this applies to all `.cjs` and `.cjsx` extensions.
 * @param {Linter.Config['files']=} options.testFiles Set the files for the test files variation of this config, which disables the boolean conventions. By default, this applies to all `js/ts` extension variants with `test.ext` and `spec.ext`.
 * @param {boolean=} options.useSnakeCaseVars Enforce snake_case for variable names
 * @param {boolean=} options.enableReactNaming Allow PascalCase for function names to accommodate react components
 * @param {boolean | 'non-strict'=} options.enableStoryNaming Allow StrictPascalCase for top-level constant names to accommodate storybook stories
 * @param {boolean=} options.allowUpperCaseVars Allow UPPER_CASE for variable names
 * @param {boolean=} options.allowUpperCaseFuncNames Allow UPPER_CASE for function names
 * @param {Array<Record<string, unknown>>=} options.extraConfigs Extra configuration blocks to append to the generated non-test-file config
 * @param {Array<Record<string, unknown>>=} options.extraTestFileConfigs Extra configuration blocks to append to the generated test file config
 * @param {('forbid' | 'require' | 'requireDouble' | 'allow' | 'allowDouble' | 'allowSingleOrDouble')=} options.privateUnderscore Enforce the presence or absence of a leading underscore for private class members
 * @param {Linter.Config['ignores']=} options.ignores Set the ignores for this config. By default, this applies to all `.md/*` and `.mdx/*` to ignore code within markdown file code blocks.
 * @returns {Linter.Config[]}
 */
export function namingConvention(options = {}) {
  return [
    {
      name: `${CONFIG_NAME_PREFIX}/${namingConvention.name}`,
      files: options.files ?? [files.jsTs],
      ignores: options.ignores ?? [`${files.mdMdx}/**/*`],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          ...getBaseComponents(),
          ...getPrivateMembersComponents(options),
          ...getFunctionComponents(options),
          ...getVariableNameComponents(options),
          ...getBooleanComponents(options),
          ...(options.extraConfigs ?? []),
        ],
      },
    },
    {
      name: `${CONFIG_NAME_PREFIX}/${namingConvention.name}TestFiles`,
      files: options.testFiles ?? [files.testSpec],
      ignores: options.ignores ?? [`${files.mdMdx}/**/*`],
      rules: {
        '@typescript-eslint/naming-convention': [
          'error',
          ...getBaseComponents(),
          ...getPrivateMembersComponents(options),
          ...getFunctionComponents(options),
          ...getVariableNameComponents(options),
          ...(options.extraTestFileConfigs ?? []),
        ],
      },
    },
  ];
}

function getBaseComponents() {
  return [
    // Enum members must be UPPER_CASE since they are treated as constants
    { selector: ['enumMember'], format: ['UPPER_CASE'] },

    // Allow destructured variables to keep their name formatting
    {
      selector: ['variable', 'parameter'],
      modifiers: ['destructured'],
      format: null,
      filter: { regex: '.+', match: true }, // Required to take precedence over other rules
    },
    {
      selector: ['variable', 'parameter'],
      modifiers: ['destructured'],
      format: null,
      types: ['function'], // Required to take precedence over other rules
      filter: { regex: '.+', match: true }, // Required to take precedence over other rules
    },

    // `typeLike` (class, interface, typeAlias, enum, typeParameter) should use StrictPascalCase
    { selector: 'typeLike', format: ['StrictPascalCase'] },
  ];
}

/**
 * @param {object} options
 * @param {boolean=} options.useSnakeCaseVars Enforce snake_case for variable names
 * @param {boolean=} options.allowUpperCaseVars Allow UPPER_CASE for variable names
 * @param {('forbid' | 'require' | 'requireDouble' | 'allow' | 'allowDouble' | 'allowSingleOrDouble')=} options.privateUnderscore Enforce the presence or absence of a leading underscore for private class members
 */
function getPrivateMembersComponents({ useSnakeCaseVars, privateUnderscore, allowUpperCaseVars }) {
  const snakeCaseVars = ['snake_case', 'UPPER_CASE'];
  const nonSnakeCaseVars = ['strictCamelCase'];
  if (allowUpperCaseVars) {
    nonSnakeCaseVars.push('UPPER_CASE');
  }

  return !privateUnderscore
    ? []
    : [
        {
          selector: ['accessor', 'classProperty'],
          format: useSnakeCaseVars ? snakeCaseVars : nonSnakeCaseVars,
          modifiers: ['private'],
          leadingUnderscore: privateUnderscore,
        },
      ];
}

/**
 * @param {object} options
 * @param {boolean=} options.useSnakeCaseVars Enforce snake_case for variable names
 * @param {boolean=} options.enableReactNaming Allow PascalCase for function names to accommodate react components
 * @param {boolean=} options.allowUpperCaseFuncNames Allow UPPER_CASE for function names
 */
function getFunctionComponents({ useSnakeCaseVars, enableReactNaming, allowUpperCaseFuncNames }) {
  const reactNames = ['strictCamelCase', 'StrictPascalCase'];
  const snakeCaseNames = ['snake_case', 'UPPER_CASE'];
  const nonSnakeCaseNames = ['strictCamelCase'];

  if (allowUpperCaseFuncNames) {
    reactNames.push('UPPER_CASE');
    nonSnakeCaseNames.push('UPPER_CASE');
  }

  return [
    // Functions must use strictCamelCase
    {
      selector: ['function', 'parameter', 'variable', 'classMethod', 'typeMethod', 'classProperty', 'typeProperty'],
      format: enableReactNaming ? reactNames : nonSnakeCaseNames,
      types: ['function'], // To scope 'parameter', 'classProperty', 'typeProperty' and 'variable'
      filter: { regex: 'toJSON', match: false },
    },
    // Unused function parameters must begin with an underscore
    {
      selector: ['parameter'],
      format: useSnakeCaseVars ? snakeCaseNames : nonSnakeCaseNames,
      modifiers: ['unused'],
      leadingUnderscore: 'require',
    },
    {
      selector: ['parameter'],
      format: ['strictCamelCase'],
      modifiers: ['unused'],
      types: ['function'],
      filter: { regex: '.+', match: true }, // Required to take precedence over other rules
      leadingUnderscore: 'require',
    },
  ];
}

/**
 * @param {object} options
 * @param {boolean=} options.useSnakeCaseVars Enforce snake_case for variable names
 * @param {boolean=} options.allowUpperCaseVars Allow UPPER_CASE for variable names
 * @param {boolean | 'non-strict'=} options.enableStoryNaming Allow StrictPascalCase for top-level constant names to accommodate storybook stories
 */
function getVariableNameComponents({ useSnakeCaseVars, allowUpperCaseVars, enableStoryNaming }) {
  const snakeCaseVars = ['snake_case', 'UPPER_CASE'];
  const nonSnakeCaseVars = ['strictCamelCase'];
  const topLevelConstants = useSnakeCaseVars ? snakeCaseVars : ['UPPER_CASE', ...nonSnakeCaseVars];

  if (allowUpperCaseVars) {
    nonSnakeCaseVars.push('UPPER_CASE');
  }

  if (enableStoryNaming) {
    topLevelConstants.push(enableStoryNaming === 'non-strict' ? 'PascalCase' : 'StrictPascalCase');
  }

  return [
    // Variables in general
    {
      selector: ['variable', 'parameter', 'accessor', 'classProperty', 'typeProperty'],
      format: useSnakeCaseVars ? snakeCaseVars : nonSnakeCaseVars,
      leadingUnderscore: 'allow',
    },
    // Allow an exception for names that are quoted (i.e. 'Content-Type')
    {
      selector: ['objectLiteralProperty'],
      format: null,
      modifiers: ['requiresQuotes'],
    },
    // Always allow UPPER_CASE for top-level constants
    {
      selector: ['variable'],
      format: topLevelConstants,
      modifiers: ['const', 'global'],
    },
  ];
}

/**
 * @param {object} options
 * @param {boolean=} options.useSnakeCaseVars Enforce snake_case for variable names
 * @param {boolean=} options.allowUpperCaseVars Allow UPPER_CASE for variable names
 */
function getBooleanComponents({ useSnakeCaseVars, allowUpperCaseVars }) {
  const nonSnakeCaseVars = ['strictCamelCase'];
  if (allowUpperCaseVars) {
    nonSnakeCaseVars.push('UPPER_CASE');
  }

  const indicators = ['is', 'are', 'was', 'should', 'has', 'can', 'did', 'will', 'allow', 'use', 'requires', 'does'];
  const indicatorsUpperFirst = indicators.map((x) => `${x[0].toUpperCase()}${x.slice(1)}`);

  const lowerSnakePattern = `.*(${indicators.map((x) => `${x}_`).join('|')}).*`;
  const upperSnakePattern = lowerSnakePattern.toUpperCase();
  const camelCasePattern = `(^(${indicators.join('|')})([A-Z].*|$)|.*(${indicatorsUpperFirst.join('|')}).*)`;

  /** @type {Record<string, unknown>[]} */
  const entries = [
    // Handle top-level UPPER_CASE booleans
    {
      selector: ['variable'],
      format: ['UPPER_CASE'],
      modifiers: ['const', 'global'],
      types: ['boolean'],
      custom: { regex: upperSnakePattern, match: true },
      filter: { regex: '.+', match: true }, // Required to take precedence over other rules
    },
  ];

  // Booleans should have an appropriate indicator
  if (useSnakeCaseVars) {
    entries.push(
      // Handle unused parameter booleans
      {
        selector: ['parameter'],
        format: ['snake_case'],
        modifiers: ['unused'],
        types: ['boolean'],
        custom: { regex: lowerSnakePattern, match: true },
        filter: { regex: '^_?[a-z]', match: true }, // Only test snake_case in this rule to avoid is_MIXED
        leadingUnderscore: 'require',
      },
      {
        selector: ['parameter'],
        format: ['UPPER_CASE'],
        modifiers: ['unused'],
        types: ['boolean'],
        custom: { regex: upperSnakePattern, match: true },
        filter: { regex: '^_?[A-Z]', match: true }, // Only test UPPER_CASE in this rule to avoid IS_mixed
        leadingUnderscore: 'require',
      },
      // Handle general case booleans
      {
        selector: ['variable', 'parameter', 'classProperty', 'typeProperty'],
        format: ['snake_case'],
        types: ['boolean'],
        custom: { regex: lowerSnakePattern, match: true },
        filter: { regex: '^[a-z]', match: true }, // Only test snake_case in this rule to avoid is_MIXED
      },
      {
        selector: ['variable', 'parameter', 'classProperty', 'typeProperty'],
        format: ['UPPER_CASE'],
        types: ['boolean'],
        custom: { regex: upperSnakePattern, match: true },
        filter: { regex: '^[A-Z]', match: true }, // Only test UPPER_CASE in this rule to avoid IS_mixed
      },
    );
  } else {
    entries.push(
      // Handle unused parameter booleans
      {
        selector: ['parameter'],
        format: nonSnakeCaseVars,
        modifiers: ['unused'],
        types: ['boolean'],
        custom: { regex: camelCasePattern, match: true },
        leadingUnderscore: 'require',
      },
      // Handle general case booleans
      {
        selector: ['variable', 'parameter', 'classProperty', 'typeProperty'],
        format: nonSnakeCaseVars,
        types: ['boolean'],
        custom: { regex: camelCasePattern, match: true },
      },
    );
  }

  return entries;
}
