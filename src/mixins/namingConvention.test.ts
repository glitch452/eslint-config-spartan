import typescriptEsLint from 'typescript-eslint';
import { namingConvention } from './namingConvention.js';
import { configSchema } from '../__test__/utils/configSchema.js';
import { difference, intersection } from '../__test__/utils/sets.js';
import { files } from '../utils/index.js';
import { CONFIG_NAME_PREFIX, prefixes } from '../constants.js';
import { getDeprecatedRules, getEnabledRules, getWarnRules, listRules } from '../__test__/utils/rules.js';

describe(namingConvention.name, () => {
  const configs = namingConvention();

  const testTable = [
    {
      id: namingConvention.name,
      filesOption: 'files',
      expectedFiles: [files.jsTs],
      extraConfigsOption: [{ test: 'extraConfigsOption' }],
      extraTestFileConfigs: [{ test: 'extraTestFileConfigs' }],
      expectedExtraConfigs: [{ test: 'extraConfigsOption' }],
    },
    {
      id: `${namingConvention.name}TestFiles`,
      filesOption: 'testFiles',
      expectedFiles: [files.testSpec],
      extraConfigsOption: [{ test: 'extraConfigsOption' }],
      extraTestFileConfigs: [{ test: 'extraTestFileConfigs' }],
      expectedExtraConfigs: [{ test: 'extraTestFileConfigs' }],
    },
  ] as const;

  const validRules = listRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint);
  const deprecatedRules = getDeprecatedRules((typescriptEsLint.plugin as any).rules, prefixes.typescriptEsLint);

  describe.each(testTable)('$id', (item) => {
    const { id, expectedFiles, filesOption, extraConfigsOption, extraTestFileConfigs, expectedExtraConfigs } = item;
    const index = testTable.indexOf(item);
    const config = configs[index];

    it('should create a valid eslint config', () => {
      const actual = () => configSchema.parse(config);
      expect(actual).not.toThrow();
    });

    it('should produce the expected default configuration', () => {
      expect(config.rules).toMatchSnapshot();
    });

    it('should set the name value', () => {
      expect(config.name).toBe(`${CONFIG_NAME_PREFIX}/${id}`);
    });

    it('should set the default files value', () => {
      expect(config.files).toStrictEqual(expectedFiles);
    });

    it('should set the given files value', () => {
      const fileValue = ['files.txt'];
      const actual = namingConvention({ [filesOption]: fileValue })[index].files;
      expect(actual).toStrictEqual(fileValue);
    });

    it('should add the leading underscore config when the "privateUnderscore" option is set', () => {
      const actual = namingConvention({ privateUnderscore: 'allowSingleOrDouble' })[index];
      const expected = expect.arrayContaining([
        expect.objectContaining({
          selector: ['accessor', 'classProperty'],
          modifiers: ['private'],
          leadingUnderscore: 'allowSingleOrDouble',
        }),
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should not add the leading underscore config when the "privateUnderscore" option is not set', () => {
      const actual = namingConvention()[index];
      const expected = expect.arrayContaining([
        expect.objectContaining({
          selector: ['accessor', 'classProperty'],
          modifiers: ['private'],
          leadingUnderscore: 'allowSingleOrDouble',
        }),
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).not.toStrictEqual(expected);
    });

    it('should add the leading underscore config with snake case when the "privateUnderscore" and "useSnakeCaseVars" options are set', () => {
      const actual = namingConvention({ privateUnderscore: 'allowSingleOrDouble', useSnakeCaseVars: true })[index];
      const expected = expect.arrayContaining([
        expect.objectContaining({
          selector: ['accessor', 'classProperty'],
          format: ['snake_case', 'UPPER_CASE'],
          modifiers: ['private'],
          leadingUnderscore: 'allowSingleOrDouble',
        }),
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow StrictPascalCase for function names when the "react" option is set to true', () => {
      const actual = namingConvention({ enableReactNaming: true })[index];
      const expected = expect.arrayContaining([
        expect.objectContaining({
          selector: ['function', 'parameter', 'variable', 'classMethod', 'typeMethod', 'classProperty', 'typeProperty'],
          format: ['strictCamelCase', 'StrictPascalCase'],
          types: ['function'],
        }),
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should not allow StrictPascalCase for function names when the "react" option is set to false', () => {
      const actual = namingConvention({ enableReactNaming: false })[index];
      const expected = expect.arrayContaining([
        expect.objectContaining({
          selector: ['function', 'parameter', 'variable', 'classMethod', 'typeMethod', 'classProperty', 'typeProperty'],
          format: ['strictCamelCase'],
          types: ['function'],
        }),
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should enforce snake_case function parameter names when the "useSnakeCaseVars" option is set to true', () => {
      const actual = namingConvention({ useSnakeCaseVars: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['parameter'],
          format: ['snake_case', 'UPPER_CASE'],
          modifiers: ['unused'],
          leadingUnderscore: 'require',
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should enforce strictCamelCase function parameter names when the "useSnakeCaseVars" option is set to false', () => {
      const actual = namingConvention({ useSnakeCaseVars: false })[index];
      const expected = expect.arrayContaining([
        { selector: ['parameter'], format: ['strictCamelCase'], modifiers: ['unused'], leadingUnderscore: 'require' },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should enforce snake_case variable names when the "useSnakeCaseVars" option is set to true', () => {
      const actual = namingConvention({ useSnakeCaseVars: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['variable', 'parameter', 'accessor', 'classProperty', 'typeProperty'],
          format: ['snake_case', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should enforce strictCamelCase variable names when the "useSnakeCaseVars" option is set to false', () => {
      const actual = namingConvention({ useSnakeCaseVars: false })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['variable', 'parameter', 'accessor', 'classProperty', 'typeProperty'],
          format: ['strictCamelCase'],
          leadingUnderscore: 'allow',
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow UPPER_CASE variable names when the "allowUpperCaseVars" option is set to true', () => {
      const nonSnakeCaseVars = ['strictCamelCase', 'UPPER_CASE'];
      const actual = namingConvention({ allowUpperCaseVars: true, privateUnderscore: 'allow' })[index];
      const components: any[] = [
        {
          selector: ['accessor', 'classProperty'],
          format: nonSnakeCaseVars,
          modifiers: ['private'],
          leadingUnderscore: 'allow',
        },
        {
          selector: ['variable', 'parameter', 'accessor', 'classProperty', 'typeProperty'],
          format: nonSnakeCaseVars,
          leadingUnderscore: 'allow',
        },
      ];
      if (index === 0) {
        components.push(
          {
            selector: ['parameter'],
            format: nonSnakeCaseVars,
            modifiers: ['unused'],
            types: ['boolean'],
            // eslint-disable-next-line vitest/no-conditional-expect
            custom: { regex: expect.any(String), match: true },
            leadingUnderscore: 'require',
          },
          {
            selector: ['variable', 'parameter', 'classProperty', 'typeProperty'],
            format: nonSnakeCaseVars,
            types: ['boolean'],
            // eslint-disable-next-line vitest/no-conditional-expect
            custom: { regex: expect.any(String), match: true },
          },
        );
      }
      const expected = expect.arrayContaining(components);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow UPPER_CASE function names when the "allowUpperCaseFuncNames" option is set to true', () => {
      const nonSnakeCaseNames = ['strictCamelCase', 'UPPER_CASE'];
      const actual = namingConvention({ allowUpperCaseFuncNames: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['function', 'parameter', 'variable', 'classMethod', 'typeMethod', 'classProperty', 'typeProperty'],
          format: nonSnakeCaseNames,
          types: ['function'],
          filter: { regex: 'toJSON', match: false },
        },
        {
          selector: ['parameter'],
          format: nonSnakeCaseNames,
          modifiers: ['unused'],
          leadingUnderscore: 'require',
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow UPPER_CASE function names when the "allowUpperCaseFuncNames" and "enableReactNaming" options are set to true', () => {
      const reactNames = ['strictCamelCase', 'StrictPascalCase', 'UPPER_CASE'];
      const actual = namingConvention({ allowUpperCaseFuncNames: true, enableReactNaming: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['function', 'parameter', 'variable', 'classMethod', 'typeMethod', 'classProperty', 'typeProperty'],
          format: reactNames,
          types: ['function'],
          filter: { regex: 'toJSON', match: false },
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow StrictPascalCase top-level constant names when the "enableStoryNaming" option is set to true', () => {
      const actual = namingConvention({ enableStoryNaming: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['variable'],
          format: ['UPPER_CASE', 'strictCamelCase', 'StrictPascalCase'],
          modifiers: ['const', 'global'],
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow PascalCase top-level constant names when the "enableStoryNaming" option is set to "non-strict"', () => {
      const actual = namingConvention({ enableStoryNaming: 'non-strict' })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['variable'],
          format: ['UPPER_CASE', 'strictCamelCase', 'PascalCase'],
          modifiers: ['const', 'global'],
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should allow StrictPascalCase top-level constant names when the "enableStoryNaming" and "useSnakeCaseVars" options are set to true', () => {
      const actual = namingConvention({ enableStoryNaming: true, useSnakeCaseVars: true })[index];
      const expected = expect.arrayContaining([
        {
          selector: ['variable'],
          format: ['snake_case', 'UPPER_CASE', 'StrictPascalCase'],
          modifiers: ['const', 'global'],
        },
      ]);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should append the values provided via the "extraConfigs" option', () => {
      const actual = namingConvention({
        extraConfigs: extraConfigsOption as any,
        extraTestFileConfigs: extraTestFileConfigs as any,
      })[index];
      const expected = expect.arrayContaining(expectedExtraConfigs as any);
      expect(actual.rules!['@typescript-eslint/naming-convention']).toStrictEqual(expected);
    });

    it('should only configure rules that exist', () => {
      const configuredRules = Object.keys(config.rules ?? {});
      const actual = difference(configuredRules, validRules);
      expect(actual).toStrictEqual([]);
    });

    it('should not configure rules that are deprecated', () => {
      const configuredAndEnabledRules = getEnabledRules(config.rules);
      const actual = intersection(configuredAndEnabledRules, deprecatedRules);
      expect(actual).toStrictEqual([]);
    });

    it('should not configure any rules as warn', () => {
      const configuredAndWarnRules = getWarnRules(config.rules);
      expect(configuredAndWarnRules).toStrictEqual([]);
    });
  });
});
